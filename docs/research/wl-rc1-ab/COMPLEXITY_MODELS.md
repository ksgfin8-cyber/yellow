# Modelos estáticos RC1-B

**SD: deducciones condicionales del código, no benchmarks ni garantía de wall/RSS.** Revisión única `030ec332c753d85b266492db1dbb6400ba61c18f`. El [catálogo por función/familia](function-models.json) contiene contrato/dominio, tamaños independientes, estructuras, bucles/copias, tiempo/espacio, casos, dependencias de runtime, agotamiento, experimento de contraste e incertidumbre. Cada símbolo remite a archivo, línea, SHA-256 y revisión. Las familias explicitan diferencias de sus funciones, sin tratarlas como costes idénticos.

## Variables y supuestos

| Símbolo | Definición y dominio |
|---|---|
| w,h,N | Dimensiones positivas; N=wh≤2^20 por WorldConfig. La forma importa para filas, fronteras y localidad aunque N coincida. |
| r,s,Q | Radio uint32, lado s=2r+1, Q=s². La construcción tiene guard operacional adicional, sin recortar el dominio semántico de WorldConfig. |
| L,S | L máximo tamaño UTF-8 de identificadores relevantes; S=N+L, proxy de trabajo de estado. Entidades exactamente1. Inicialización genera el ID fijo de7 bytes; snapshots pueden contener IDs más largos. |
| T,a,E | Transiciones realmente ejecutadas, acciones suministradas y eventos totales; T≤a cuando hay secuencia completa. En la ruta WORLD, ≤2 eventos de acción y≤1 lifecycle por tick, E≤3T+1; otros datos estructurales requieren conservar e como variable. |
| D,Z | D=S+Q en modo con agente, D=S sin agente; tamaño lógico de trayectoria Z=O(S+TD+EL). Usa cotas superiores, no bytes reales de heap. Repeticiones de strings inmutables pueden compartir almacenamiento. |
| B,U,C,d | Bytes WLS1 B; bytes JSON tipado sin comprimir U; bytes gzip C; profundidad de transporte d. No se fija ratio U/C ni se iguala Z en registros con U en bytes. |
| P,F,V | Intentos de campaña P (P01 fija256; desarrollo32), bytes de fuentes/evidencia y del ejecutable Node leídos por guards F, coste externo V de carga/VM/Git y preparación. La API P01 no admite campañas arbitrarias por variar P. |
| J,I,K,A,R | Índices históricos J, suma de sus bytes I, referencias de versiones K, intentos del log A y bytes actuales de todos los archivos R. Sean A_j,R_j,log_j los observados en snapshot j. |
| k,b,g | Candidatos iniciales k≤N; bloqueadas b; recursos agotados g≤N para cambios de regeneración. |
| κ | Número de extracciones de rechazo hasta elegir índice; no se presupone κ=1 ni independencia probabilística del PRNG determinista. |

**Modelo de coste.** Registros ordinarios válidos y acíclicos, esquemas cerrados y aritmética de ancho fijo; coste unitario para lectura/asignación/escalar y descriptores de registros pequeños. Se supone acceso a Map/Set esperado O(1) y crecimiento de arrays amortizado O(1); ECMAScript no garantiza esas cotas concretas ni la estrategia de sort. `Csort(n)` representa coste real de ordenar; O(n log n) se usa solo como hipótesis de comparación usual, no garantía del runtime. Para codecs con claves arbitrarias se añade `Ckeys=Σ coste_sort(claves del objeto)`; en registros de aridad acotada es lineal en cantidad de registros. SHA/FNV se modelan por bloques/bytes; zlib se deja como G_enc(U)/G_dec(C,U), I/O y fsync como costes externos.

Las Θ describen conteo de operaciones bajo estos supuestos y entradas válidas que completan, no el peor caso de toda entrada malformada/Proxy ni tiempo físico garantizado. Mejor caso de rechazo estructural puede parar antes. El espacio indicado es **memoria viva alcanzable adicional/salida** como cota superior; asignaciones acumuladas, memoria sin recolectar, buffers nativos y RSS son cosas distintas. Ni GC, JIT, compilación VM, coste de objetos, filesystem/caché ni scheduling tienen cota de latencia deducida aquí.

N, reloj y radios tienen límites normativos finitos. Usar familias paramétricas dentro de su dominio ayuda a explicar escala; no se ha probado un límite asintótico infinito sobre la máquina finita ni se propone ampliar ese dominio. No se usa número de entidades como variable libre para el contrato actual.

## Resumen por componente

| IDs | Ruta | Trabajo condicionado en una ejecución válida | Memoria viva / salida y riesgo |
|---|---|---|---|
| M01–M02 | Validar/copiar estado | Θ(S); validar recorre N, copy vuelve a validar y materializa N | Validar O(L); copy O(S). Repetición constante de scans no vuelve O(N²) por sí sola. |
| M03–M05 | Generar/elegir/inicializar | Generación Θ(N), selección Θ(N+κ), inicialización Θ(N+κ) con ID fijo | Grid+candidatos+copias O(N). No derivar coste esperado de rechazo sin supuesto de distribución. |
| M06–M08 | Acción/lifecycle/dinámica | Θ(S) aun cuando efecto físico local o regeneración0 | Acción/lifecycle O(L); dinámica O(L+g) para lista preparada. |
| M09–M10 | Observation/Feedback | Θ(S+Q) y O(Q+(e+1)L+e), respectivamente | Q registros de vista y copia de Feedback; guard no es medición. |
| M11 | Confirmación del tick | Θ(S), cantidad constante de validaciones/snapshots, eventos acotados | O(S) adicional, sin historial dentro del kernel. |
| M12–M14 | record_step/finalize/getters | Append O(D) amortizado; finalize/getter de prefijo O(S+iD+E_iL) | Historial O(Z); una exportación completa añade O(Z). Getter repetido puede sumar T². |
| M15 | WLS1/hash | Θ(S+B); B exacto abajo; hash recorre B | O(B+L), bytes materializados; entidades1, sort no añade log de N. |
| M16–M18 | Replay/control/continuidad | Replay O(a+S+TD+EL); continuidad por pasada O(a+S+TD+EL) | Replay retiene registros O(Z+a); proof sin Recorder O(S+Q+E+a) vivo, asigna mucho más en total. Helper con prefijo por tick suma O(T²D) para L/eventos acotados. |
| M19–M20 | Archivo/verificación | Pack/unpack O(Z+U+Ckeys+V+G); verify COMPLETED añade4T kernels y serializaciones | O(Z+U+C+V_mem) con varias representaciones y VM; guard de salida64MiB. |
| M21–M23 | Métricas/oráculo | Contar consumo Θ(E); measure Θ(T+E+N)+Csort(posiciones); comparar incluye payloads completos | Contador filter O(E); measure O(N+T); campaña/oráculo retienen múltiples artefactos O(ΣZ). |
| M24 | Ejecutor/supervisor | Suma de arranque/gate/worker/IPC/archivo/replay/análisis; no cota total=30s | Heap de hijo512MiB≠RSS; padre guarda objetos de P intentos; coste de proceso y guards repetidos. |
| M25–M27 | Conservar/verificar/restaurar | Watch relee R_j y parsea log con A_j² búsquedas; verify/restore O(I+K+bytes de objetos y archivos)+sort/I/O | Índices completos en memoria O(I), blob máximo, metadata actual. Deduplicación no elimina crecimiento de índices/logs. |
| M28 | FrontierMemory | Por step O(Q+v+Csort(v)), v alcanzables≤N en observaciones reales | Memoria conocida incluye OUT_OF_BOUNDS: ≤min(TQ,(w+2r)(h+2r)); no asumir≤N. |

## Derivaciones auditables

**SD-01 — ventana y guard CC-04.** Los dos bucles de `build_observation` ejecutan s×s iteraciones, incluso fuera de mapa. Plan exacto interno f(r)=64(2r+1)²+8(2r+1), creciente para r≥0. f(511)=66.986.040≤67.108.864 y f(512)=67.248.200>67.108.864; por monotonía y radio entero, el guard admite exactamente r≤511 antes de otras limitaciones de memoria. Para rechazar r512 ya se validó WORLD, así que ese rechazo no es O(1) respecto de N. Estas son operaciones aritméticas del programa; **no se materializó** ninguna ventana grande ni se midió su heap. Guardar una Observation y una Feedback exige más memoria que el estimado de una sola ventana; el historial puede multiplicar esa demanda.

**SD-02 — tamaño WLS1.** `serialize_world_state` suma24 bytes de cabecera/dimensiones/conteo,3 por celda,21+UTF8(id) por entidad y4 opcionales de rng. Con entidad única: B_WORLD=45+3N+L, B_FULL=B_WORLD+4. N144 y ID de7bytes producen484/488bytes por estado, derivación de formato, no archivo medido ni tamaño JS. `STATE_HASH_*` materializa bytes y FNV recorre cada uno; no conserva una caché incremental. Map.size=1 hace constante la ordenación de entidades en este dominio, aunque el código use `.sort`.

**SD-03 — estado persistido frente a cambio local.** `apply_action` llama `_action_type`, que llama assert_WorldState; MOVE vuelve a hacerlo mediante helpers. Lifecycle y regeneración lo validan también. `execute_tick_transaction` hace snapshots antes/después y compara el snapshot completo. Son un número constante de scans y copias de N; de ahí Θ(N+L), sin suponer que cada tick copia su historial. La constante puede ser grande y queda por medir. Regeneración0 omite la lista de cambios, no el scan de validación.

**SD-04 — historial.** `record_step` usa `_append`/`_prepare_step_input`, consulta solo el anterior y no llama `_prepare_step` (que sí valida el prefijo completo). Con append amortizado, T pasos suman O(TD) para L/eventos acotados; finalize añade otra cantidad lineal en el historial. `public_value(...,"steps")` copia i pasos; llamarlo en cada tick suma DΣi=D·T(T+1)/2. `replay_tick_transaction` permite export_prefix=false y `replay_trajectory` lo usa; `replay_confirmed_tick` lo fija true. Retener todos los prefijos añade también O(T²D) de salida; descartarlos mantiene salida final O(TD), sin asegurar cuándo GC libera los anteriores.

**SD-05 — verificación completa.** En `verifyArtifact` para COMPLETED exitoso: replay_trajectory ejecuta T kernels; validate_ReplayResult hace continuidad T; validate_replay valida original con continuidad T y vuelve a validar ReplayResult con continuidad T. Total4T invocaciones `execute_tick_transaction` en esas rutas, no cuatro estudios independientes. El bucle final añade4(T+1) serializaciones WORLD/FULL sobre antes/después; las demás capas además generan hashes. No se promete que cuatro pasadas cuesten exactamente cuatro veces en wall.

**SD-06 — preservación.** En `parseLog`, el FINISH k busca desde inicio entre k intentos, deteniéndose en el último abierto en el log secuencial habitual: Σk=A(A+1)/2 comparaciones. Cada snapshot vuelve a leer los archivos detectados como terminados y el log entero. La cota inferior de bytes leídos durante J pasadas es proporcional a ΣR_j; no solo a bytes nuevos. Logs distintos se conservan como objetos completos: almacenamiento de logs Σ|log_j|. Si hay una versión por intento y cada incremento tiene longitud fija acotada, esa suma es Θ(P²); si tamaño de cada FINISH varía, usar la suma exacta, no el exponente sin supuesto. Repetir parse sobre A_j≈j suma Θ(P³) inspecciones de intentos en esa familia. Índices incluyen listas completas de versiones; usar I/K reales para verificarlos y restaurarlos. No se ha medido que esto domine en P01 ni se pide corregirlo ahora.

**SD-07 — rechazo PRNG.** `_choose_initial_position` hace una llamada next_int, que puede hacer κ llamadas next. Escribir «una llamada API» no equivale a «una extracción». Bajo un modelo ideal de extracciones uniformes independientes podría calcularse esperanza de rechazo; Xorshift32 aquí es determinista/no-cero y ese supuesto no se ha demostrado. Se conserva κ en la cota. Esto no identifica un defecto del algoritmo ni autoriza cambiar su consumo.

## Límites de inferencia y contraste

La aritmética y el conteo de bucles se comprobaron documentalmente; no hubo simulaciones, nuevas suites, stress, importación del runtime ni muestras de rendimiento. Hash/revisión permite encontrar exactamente las funciones estudiadas, no probar su autoridad normativa completa. En RC1-C se propondrá contrastar las cantidades derivadas con N/Q/T y capas separadas, usando residuales y ratios dentro del dominio medido. Ajustar una recta o una potencia no demostrará una complejidad asintótica ni ausencia de mecanismos alternativos.
