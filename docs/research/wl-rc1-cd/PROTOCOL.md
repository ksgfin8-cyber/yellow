# WL-RC1-C — Protocolo 1.0.0, candidato para GATE-2

**GATE-1 aprobado por el propietario sobre PR #48. C/D autorizados. PILOTO HOLD: no se ejecutó la matriz de48 procesos. RC1-E definitiva NOT_AUTHORIZED.** Fecha2026-11-17, America/Guayaquil. Protocolo candidato preparado para congelación por manifiesto; aprobación científica/operacional aún pendiente. No reabre construcción, no modifica P01 ni resuelve F6-N.

## Identidades y preguntas preservadas

Base main PR48 `c1e80c5249002fccaf8508ee9d9397d6bbeb1b7c`. Los28 modelos A/B analizaron `030ec332c753d85b266492db1dbb6400ba61c18f`. Se comprueba continuidad de fuentes: cambios de contenido requieren identidad nueva y revisión de modelos afectados. El candidato liga fuentes reales/baseline Git, código del instrumento/pruebas/condiciones/protocolo y Node/V8/binario/plataforma; NODE_OPTIONS debe estar vacío para evitar flags implícitos; su freeze_id no es el de P01. Archivos del informe de validación y del propio candidato no se incluyen en su hash autorreferencial.

Q1 motor/observación; Q2 registro/serialización/replay; Q3 coste de campaña; Q4 adaptación longitudinal. Se preservan H1 crecimiento del trabajo de estado con N, H2 coste de Q incluso fuera de mapa, H3 append frente a exportación de prefijos, H4 total operacional no explicado por worker solo. Son hipótesis/estimaciones dentro de los supuestos de [A/B](../wl-rc1-ab/COMPLEXITY_MODELS.md), no requisitos normativos. Q4 sigue NOT_ESTABLISHED: falta registro longitudinal comparable; no se inferirá coste humano desde latencias.

## Inventario fijo y unidades

[conditions.json](conditions.json) define ocho perfiles P1–P8,16 operaciones, configuración completa,48 condiciones y los14 campos exigidos por operación. Es parte congelable del protocolo. No hay flags para cambiar seeds, perfiles, repeticiones o límites de un piloto autorizado. Los límites no son tiempos observados.

| Perfil | w×h | r | Q | T |
|---|---|---:|---:|---:|
| P1 |8×8 |1 |9 |4 |
| P2 |16×16 |1 |9 |4 |
| P3 |32×32 |1 |9 |4 |
| P4 |16×16 |0 |1 |4 |
| P5 |16×16 |4 |81 |4 |
| P6 |16×16 |16 |1089 |4 |
| P7 |16×16 |1 |9 |16 |
| P8 |4×64 |1 |9 |4 |

Configuración fija: BOUNDED, una entidad; densidades0/0/0, energía240, umbral0, MOVE/WAIT1, recurso8, daño0, regeneración0, cuatro flags Feedback true. Traza prescrita WAIT; no es un agente nuevo ni una campaña P01. Los datos se crean con tipos/APIs existentes, no con constructores relajados. Los perfiles no evalúan variabilidad de mapas con densidades0. No se añaden recursos/peligros a perfiles: sus fixtures semánticos de validación están separados y no producen muestras del piloto.

Unidad experimental: un proceso nuevo por perfil/bloque/modalidad. Tres bloques, seeds20001–20003; dos modalidades MINIMAL y DETAILED emparejadas. No se usan seeds1001–1032. Primer bloque P1–P8, segundo reverso, tercero rotación P2–P8/P1; modalidades AB/BA/AB. Un solo worker medidor a la vez; guardian separado, no trabajador científico paralelo. El orden equilibra tendencias, no constituye aleatorización. Otras cargas ambientales se registran, no se ignoran por ser desfavorables.

## Procedimiento común exacto y restauración C-02

Cada worker verifica candidato y condición antes de importar el runtime científico. Carga scripts clásicos existentes por el loader existente; expone funciones públicas en su VM sin sustituir métodos ni introducir hooks. Verificar identidad/preparar VM tiene su tiempo propio y afecta al wall total del proceso, no se atribuye a una operación física.

Por operación, en el orden fijado en conditions: una primera llamada medida, tres warm-up y cinco warm; cada llamada recibe **un fixture nuevo desde la misma seed/config**, no reutiliza el mundo mutado por la anterior. Preparación medida por separado incluye inicialización/copia, construcción del prefijo y captura del testigo de entrada. Para append se prepara prefijoT−1, Observation/Feedback y tick confirmado fuera de su ventana; para finalize/getter se preparaT; replay usa acciones/estados de esa trayectoria preparada; validate_replay además prepara su ReplayResult fuera de ventana. Se registra exposición previa de preparación.

La primera muestra por operación se llama FIRST_MEASURED, no «API virgen fría»: preparar una entrada puede llamar ya al método estudiado y operaciones anteriores calientan código compartido. **Cold de proceso** se informa mediante arranque/carga/worker total; FIRST_MEASURED y WARM se conservan separados, sin afirmar JIT frío por función. Cada operación tiene tres warm-up prefijados; no se aumentan hasta conseguir un resultado favorable. Cinco llamadas warm son submuestras dependientes, no cinco réplicas independientes ni potencia estadística. Tres procesos por modalidad sirven para resolución/validación del piloto, no IC poblacionales definitivos.

MINIMAL toma dos relojes alrededor de invoke. DETAILED añade reloj exterior, CPU/memory antes/después; `api_ns` rodea solo invoke, `wrapper_ns` incluye esos instrumentos adicionales. MINIMAL también usa el reloj exterior común: es control de menor instrumentación, no ausencia total de medición. Preparación y testigos/compresión/IPC/almacenamiento quedan fuera de api_ns y se conservan aparte o dentro del wall total. La presión de GC de esas tareas puede perturbar llamadas posteriores: limitación explícita, no se «resta» para declarar coste puro.

Cada testigo conserva entrada/estado previo y salida/estado posterior estructurales, RNG y bytes WORLD/FULL; acciones/eventos están en salidas de las APIs/StepRecords. Se serializa mediante transporte tipado y gzip fuera de la ventana. Los contenidos idénticos se deduplican por SHA-256, preservando los bytes completos recuperables, no solo hashes. No hay enmascaramiento de resultados fallidos. Un error en preparación, ejecución o testigo se registra con etapa/mensaje/tiempo disponible y censura; las siguientes llamadas independientes reconstruyen otra entrada. Un fallo externo detiene la sesión completa sin reintento.

## Atribución C-01 y cobertura de operaciones

Las mediciones son de **APIs agregadas**. validate_state mide el validador como llamada separada; no se resta de tick para atribuir causalmente coste interno. action incluye su validación; snapshot incluye validación/copia; tick incluye su rollback/snapshots/lifecycle/dinámica; record_append incluye sus validaciones/copias/hashes; wls1 incluye validación/serialización; replay y validate_replay conservan pasadas completas. Los modelos explican hipótesis de mecanismo, no descomposición causal obtenida por resta.

`transport_roundtrip` es encode→JSON→gzip9→gunzip→decode sobre la trayectoria RC1, reutilizando codec existente. **No es pack/unpack de WL-P01-ARCHIVE-1, no reproduce el gate/procedencia P01 ni verifica replay dentro del archivo.** El archivo de mediciones RC1 tiene otro formato/inventario. Así se evita etiquetar configs RC1 como P01 o alterar guards congelados. El coste completo de archivo/proveniencia/campaña y del observador creciente sigue cobertura parcial de Q3; la primera matriz estima capas disponibles y viabilidad, sin afirmar que16 timings agotan todo el modelo A/B. Comparar getters por longitud informa una llamada de prefijo; no mide por sí solo una secuencia de T getters. Ninguna separación exige ni autoriza modificar producción.

## Medidas, calibración y GC

Todos los valores originales se conservan: tiempos monotónicos ns en strings decimales, CPU user/system microsegundos, memoria en bytes (RSS/heap/external/arrayBuffers), unidades/versiones explícitas, bytes JSON/testigo gzip, configuración y errores. Process.resourceUsage puede expresar maxRSS en KiB Linux y se archiva con ese nombre original; no se mezcla con memoryUsage.rss en bytes. El total de CPU del worker incluye preparación/testigos y no es suma de API. Se registran versión Node/V8, hash binario, flags/identidad de fuentes y CPU/memoria/loadavg visibles. No se deduce ausencia de carga ajena de una sola muestra.

Calibración pequeña por proceso:200 pares de relojes consecutivos y200 llamadas vacías, datos completos y mediana; no se sustrae una mediana de todos los tiempos. Duración api inferior a10×mediana de reloj queda marcada resolución insuficiente. GC **no se observa directamente** en esta modalidad; no se fuerza GC ni se infieren eventos a partir de una caída de heap. Añadir perfiles de GC/inspector sería una revisión instrumental separada con calibración de perturbación, no una capacidad ya implementada.

Perturbación: comparar distribuciones/diferencias emparejadas MINIMAL/DETAILED por operación/perfil/bloque y `wrapper_ns−api_ns` dentro de DETAILED; no confundir la resta con coste causal completo del instrumento. Si resolución falla o diferencia mediana emparejada supera10% se informa insuficiencia para esa escala y se propone versión nueva, sin seleccionar muestras ni repetir automáticamente. Los tiempos de los fixtures de validación solo demuestran que la comparación se puede calcular: no estiman perturbación de P1–P8.

## Presupuesto y control externo C-03

Máximo48 procesos medidores; cada hijo10s nominales y256MiB heap V8. Guardian independiente Linux/proc, muestreo25ms, total12min, umbral RSS agregado1GiB incluyendo controlador y descendientes observados (incluido guardian); parent heap512MiB exigido exactamente por preflight/run-pilot; worker comprueba su flag256MiB. RSS no es heap y un muestreo no impide sobrepasos breves ni detecta todos los procesos efímeros. El deadline del hijo/total puede excederse por granularidad/scheduling; se registra tiempo observado del kill, no se declara tope físico exacto. El guardian sigue actuando si el controlador bloquea su event loop; si este no acusa recibo del stop en250ms, termina también al controlador. No es sandbox de código hostil ni transacción durable ante pérdida del host.

128MiB máximo de artefactos nuevos; escritor contabiliza bytes antes de cada escritura, rechaza silencios/truncamientos y reserva1MiB para inventario/control. Diagnósticos sobre64KiB por stream provocan parada explícita, con prefijo binario acotado y conteo explícito de bytes recibidos/omitidos; no es salida completa ni recorte silencioso. Un witness comprimido>16MiB o descomprimido>64MiB causa fallo registrado; no se cambia presupuesto para hacerlo pasar. Directorio nuevo/exclusivo fuera del repo, distinto de cualquier ruta p01-, sin sobrescritura. Guardian deja su propio registro aun si no puede publicarse inventario final; sin manifiesto terminal la recuperación declara PARTIAL_UNSEALED, nunca VERIFIED.

Parada: cambio de identidad/condiciones, firma/pins inválidos, proceso/crash/timeout, cuota/registro/integridad, RSS, watchdog o supervisión fallida. Se conservan intentos START/FINISH y últimos datos recibidos; crash anterior al registro se identifica como intento sin datos completos. No se reintenta ni sustituye seed. Errores operacionales no se convierten en muerte WORLD ni resultados científicos completos.

## Análisis y aceptación

Conservar todas las filas; separar FIRST_MEASURED/WARMUP/WARM y tiempos de preparación/worker/carga/IO. Resumir warm por proceso con mediana/rango y bloque emparejado, después mostrar todos los bloques; no usar llamadas internas como n independiente. Tiempos censurados quedan con umbral y observación disponible, no media inventada. Excluir del agregado interpretativo solo corrupción/identidad/unidades inválidas o resolución insuficiente bajo reglas anteriores, manteniendo registro y motivo; nunca excluir por lentitud o resultado desfavorable. Timeout y faltantes impiden cobertura completa de esa condición.

Contrastar hipótesis con plots/ratios/residuales de N,Q,T y modelos alternativos de constantes/GC/arranque. Datos finitos no demuestran complejidad asintótica ni causalidad universal. El piloto no fija precisión/IC poblacional; el n de E definitiva se propondrá según variación/resolución observadas y objetivo de precisión, en protocolo nuevo autorizado. Q4 no se resuelve por estos timings.

Aceptación instrumental: D01–D08 con identidad, equivalencia completa, archivo recuperable, calibración detectable, comparación de modalidades y stops externos demostrados. Aceptación para **revisar** GATE-2 no equivale a aprobar piloto. Una aprobación del piloto no autoriza RC1-E definitiva. Si el piloto se censura, informar y proponer revisión versionada antes de pedir otra ejecución; no cambiar perfiles para favorecer tendencias.
