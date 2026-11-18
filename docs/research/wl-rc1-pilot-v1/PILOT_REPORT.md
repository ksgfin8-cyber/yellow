# WL-RC1 — Informe del piloto controlado v1

**Dictamen: PILOT_PARTIAL. Recomendación: NO-GO de inicio de RC1-E; revisar diseño instrumental y presupuesto antes de otra autorización. RC1-E permanece HOLD.** El archivo es íntegro; el protocolo completo no pudo terminar con los límites aprobados. No se trata de un PILOT_PASS ni de una refutación del modelo de complejidad.

## Identidad, autorización y único arranque

Base main PR50 `21e0dd5d0ad680140192f0db240ffce31031a85c`; rama `research/wl-rc1-pilot-v1-results`. Identidad autorizada `466e1dc53f6d5f6f0fe144d85e7f65643b01244acabee5b8caaa25dd34df15ac`. Campaña `wl-rc1-pilot-v1`; destino firmado `/workspace/shared/world-lab/wl-rc1/pilot-rc1-cd-v1`. Clave pública Ed25519 DER-SPKI SHA256 `3e65dff25d532c34504a2ddd317f85d8f66b0ba066277ffe634463380f521b5e`.

[Orden expresa de inicio](OWNER_START_APPROVAL.md), recibo/firma públicos y preflight válido conservados. [Preflight inmediatamente anterior](preflight-before-start.json) revalidó identidad, firma, flags512MiB, recursos y destino nuevo, sin empezar episodios. El launcher operacional externo registra un único comando run-pilot y ningún retry en [start-record](start-record.json)/[exit-record](exit-record.json). Código de salida del controlador **2**, correspondiente al archivo PARTIAL según su CLI congelada.

Inicio del comando: **2026-11-18T16:50:26.584890-05:00**; retorno: **2026-11-18T16:50:54.872945-05:00**, America/Guayaquil; intervalo externo 28.288055s. El intervalo incluye arranque/checks/controlador/verificación final; no es la suma exclusiva de las APIs. Las rutas /workspace y /tmp de los registros son referencias históricas locales, no enlaces públicos ni prueba de respaldo externo.

## 1. Procesos y cobertura real

| Índice | Perfil / modalidad / bloque | Resultado | Wall worker s | Muestras completas | CPU proceso user+system s | Pico RSS proceso MiB |
|---|---|---|---:|---:|---:|---:|
| 0 | P1 / MINIMAL / bloque1 | COMPLETE | 7.132891 | 144/144 | 7.138247 | 281.926 |
| 1 | P1 / DETAILED / bloque1 | COMPLETE | 9.395222 | 144/144 | 9.190763 | 282.281 |
| 2 | P2 / MINIMAL / bloque1 | CHILD_TIMEOUT | 10.041488 | 97/144 | NO_DATA | NO_DATA |

De48condiciones: **3iniciadas,2completas,1timeout censurado,0otros fallos,45sin ejecutar**. No hubo un segundo arranque, reintento automático, reemplazo de seed ni ampliación del límite. La [cobertura completa de48 filas](condition-coverage.json) distingue cada combinación y los casos no iniciados. Un worker medidor a la vez; tres ACTIVE/START y sus tres FINISH concuerdan con el orden congelado. No se ejecutaron las modalidades/bloques restantes ni nuevas campañas P01/E3/E4.

Se conservaron **385muestras exitosamente registradas** (incluidos FIRST_MEASURED/WARMUP/WARM), de6912que habría generado la matriz íntegra. Estos385registros no son385réplicas experimentales: la unidad es el proceso. P1 solo tiene **un par de procesos**, bloque1, con5llamadas warm dependientes por operación; bloques2/3 no existen en esta ejecución.

P2/MINIMAL conserva9llamadas por cada una de las diez primeras operaciones y7del history_getter: última muestra confirmada `history_getter/WARM/3`. No hay registro done ni contadores finales de CPU/RSS del worker2. El próximo trabajo en curso no tiene marca por etapa: **no puede localizarse si el kill ocurrió durante preparación, ejecución, testigo o IPC**. No asignar los10s a una sola API ni fabricar la duración de una llamada censurada.

## 2. Parada y límites observados

Guardian externo: **CHILD_TIMEOUT**, elapsed observado **10018.376707ms**, SIGKILL. Wall hasta close del hijo **10041,487866ms**. El pequeño sobrepaso respecto de10000ms es visible y consistente con un límite nominal muestreado y entrega de señales; no se ocultó ni se presentó como tope físico exacto. El guardian y el controlador pararon la secuencia antes de la cuarta condición. No se observaron errores instrumentales de operación, diagnósticos truncados u otra causa de fallo en los registros disponibles.

Pico RSS agregado **501096448bytes (477.883MiB)**, inferior a1GiB; son muestras del árbol controlador/descendientes, incluido guardian, no cota de todos los procesos del workspace ni picos efímeros entre muestras. El pico RSS de un worker puede superar256MiB sin violar el límite de heap V8: los flags reales son256MiB por worker y512MiB de controlador, no un cap RSS.

Archivo experimental original: **36archivos/266344bytes**, muy por debajo de128MiB. No se alcanzaron cuota, RSS ni watchdog total12min. Los controles fueron efectivos en esta parada; no se generaliza su precisión a toda condición/OS.

CPU de la tabla procede de resourceUsage al terminar cada worker completo, acumulada durante toda la vida del proceso y en microsegundos originales; el objeto done también contiene otra ventana CPU desde preparación/carga, que se conserva separada. Para P2 no hay retorno: CPU/pico individual **NO_DATA**, no cero ni estimación retrospectiva. Los deltas de CPU/memoria por llamada existen solo en DETAILED; se conservan en el archivo raw y resúmenes. GC no se observó directamente y no se fuerza ninguna explicación basada en GC.

## 3. Integridad, semántica y restauración

El verificador congelado devuelve **VERIFIED / package_status=PARTIAL**,385samples,0errores de archivo,26testigos completos distintos. El manifest original declara honestamente PARTIAL y CHILD_TIMEOUT. Verificación posterior del candidato: MATCH, sin cambio de identidad. Se restauraron los36archivos en un directorio nuevo y su inventario de bytes/SHA256 coincide íntegramente con la fuente. Firma y pin se volvieron a verificar desde esa copia, sin re-enriquecimiento, ejecución del motor ni nuevo replay físico. El mismo consumidor Node en otro proceso sobre fuente/restauración produjo siete archivos JSON/CSV byteidénticos. Un recuento Python separado confirmó35entradas del manifiesto,385samples,144pares de testigos wire iguales y las16comparaciones/11flags; se distingue esa independencia de cálculo de una implementación experimental independiente.

La comparación de modalidades realizó **144comparaciones estructurales completas** de testigos P1, con estados, salidas/acciones/eventos aplicables, reloj, RNG y bytes WLS1 WORLD/FULL, sin divergencias. Además342comparaciones no triviales de repetición dentro de grupos confirmaron restauración de entrada y salida;43primeros registros son baselines de grupo. Ningún hash se usó como sustituto de la igualdad estructural. Para P2 falta DETAILED: equivalencia entre modalidades allí **NOT_ESTABLISHED**.

Las operaciones de la matriz usan WAIT y densidades0: no se ejercitaron nuevos eventos de entrada/recurso/peligro. Los fixtures semánticos del incremento anterior no se repitieron ni se contabilizan como mediciones del piloto. Integridad de transporte y equivalencia observada no constituyen conformidad normativa global ni interoperabilidad entre motores independientes.

## 4. Resolución y perturbación

Medianas de pares de reloj por worker:99ns,155ns y97ns. **0/385flags de api_ns inferior a10×esa mediana** en las llamadas registradas. Esto satisface únicamente el detector de resolución prefijado; no certifica exactitud, ausencia de ruido/JIT/GC o representatividad de llamadas no completadas. Se conservan las200lecturas y200vacíos de cada proceso.

Tabla P1/bloque1: mediana warm de5submuestras por proceso; unidades **ms de wrapper**, sin IC poblacionales ni aumento ficticio de n. M=MINIMAL; D=DETAILED.

| Operación | M mediana ms | D mediana ms | p:mediana de diferencias emparejadas % | q:diferencia de medianas % | \|p\|>10% |
|---|---:|---:|---:|---:|---|
| validate_state | 0.1176 | 0.2272 | +36.09% | +93.15% | SÍ |
| snapshot | 0.4271 | 0.4712 | +8.03% | +10.33% | no |
| initialize | 1.8066 | 1.8797 | +8.49% | +4.05% | no |
| action | 0.1462 | 0.2127 | +46.96% | +45.50% | SÍ |
| dynamics | 0.1613 | 0.1691 | +4.87% | +4.85% | no |
| observation | 0.1538 | 0.1932 | +27.54% | +25.65% | SÍ |
| feedback | 0.0422 | 0.0873 | +111.23% | +107.16% | SÍ |
| tick | 2.0061 | 2.1409 | +13.13% | +6.72% | SÍ |
| record_append | 4.6221 | 4.7599 | +2.61% | +2.98% | no |
| finalize | 7.9536 | 8.2605 | +0.71% | +3.86% | no |
| history_getter | 1.6957 | 1.9260 | +13.58% | +13.58% | SÍ |
| wls1 | 0.1886 | 0.2291 | +21.93% | +21.44% | SÍ |
| replay | 36.3900 | 87.5234 | +140.51% | +140.51% | SÍ |
| validate_replay | 42.3656 | 93.9259 | +128.96% | +121.70% | SÍ |
| transport_roundtrip | 1.9419 | 2.5192 | +14.19% | +29.73% | SÍ |
| metrics | 0.0585 | 0.1138 | +75.42% | +94.58% | SÍ |

p=100·median(D_i−M_i)/median(M_i); q=100·(median(D)−median(M))/median(M). La mediana no es lineal: ambas descripciones se publican junto con cada diferencia cruda, sin escoger una para enverdecer resultados. La normalización exacta no estaba completamente fijada por el protocolo: esta precisión de reporte se identifica como decisión de análisis, no un criterio confirmatorio nuevo. El diagnóstico conservador de magnitud \|p\|>10% señala **11/16operaciones**. [paired-perturbation.json](paired-perturbation.json) conserva ambas normalizaciones, deltas api y wrapper−api dentro de DETAILED.

Esas diferencias son **desviaciones observadas, no efecto causal puro del instrumento**. Solo existe un orden AB y un bloque; faltan BA y los otros bloques, hay preparación y asignaciones compartidas con JIT/GC/carga ambiental. Ni una llamada lenta ni la diferencia de replay identifica por sí sola un cuello de botella o demuestra una ley asintótica. La perturbación aceptable para la matriz completa **no queda establecida**.

## 5. Preparación, ejecución y escalas viables

Sumas de ventanas registradas, incluyendo primeras llamadas/warm-up/warm; **s**, sin doble contar wrapper y API como componentes independientes:

| Proceso | Preparación registrada | API registrada | Wrapper registrado (incluye API) | Carga del runtime |
|---|---:|---:|---:|---:|
| 0 | 3.137709 | 0.960590 | 0.960926 | 0.011460 |
| 1 | 5.389669 | 1.941778 | 1.956387 | 0.013090 |
| 2 | 4.944268 | 0.811474 | 0.812018 | 0.027476 |

Preparación incluye construir/restaurar fixtures/prefijos y capturar entrada; API es la llamada pública agregada. No se resta el validador aislado de otra API para fingir causalidad. Diferencia con wall incluye tareas no cubiertas por ventanas —identidad/arranque, testigos, compresión/IPC/esperas y, en el censurado, trabajo incompleto—; no se reparte sin medición. La preparación es material en los procesos observados, pero esos valores no autorizan extrapolar su proporción a todas las escalas.

P1(N64,Q9,T4) **completó ambas modalidades del bloque1** con7,13/9,40s; eso no demuestra que sus bloques posteriores hubieran completado ni estabilidad de una muestra cercana al límite. P2(N256,Q9,T4) **no completó** MINIMAL dentro del presupuesto global de worker. P3–P8, variación de Q/radio/forma y T16, y bloques2/3: **sin medición**. Los datos permiten describir viabilidad de esta ejecución y problemas de medición; no estimar exponentes, contrastar H1–H3 con cobertura adecuada o responder Q4 longitudinal.

## 6. Recomendación para RC1-E y cambios a decidir

**NO-GO para ejecutar RC1-E definitiva.** Hay evidencia suficiente para justificar una revisión focalizada del instrumento/protocolo y su presupuesto, no para lanzar la campaña definitiva ni para cambiar el motor. El riesgo aceptado de timeout se materializó; no es un fallo científico del modelo estático. La revisión deberá tener identidad nueva y autorización posterior; no se implementó ahora ni se reanudó este piloto.

| Necesidad demostrada | Opciones de revisión | Aceptación antes de nueva ejecución |
|---|---|---|
| P2 no completa10s con16operaciones×9llamadas y sus preparaciones | Repartir trabajo por familia de operación o revisar explícitamente presupuesto/repeticiones/alcance. No aumentar timeout automáticamente ni prometer un número suficiente para P3–P8 a partir de este único caso. | Protocolo y presupuesto versionados, calibración acotada autorizada y comparación semántica completa. |
| No se conoce la etapa del kill | Registrar límites de etapa por operación fuera del reloj principal, midiendo su perturbación. | Stop sintético localizable y cero cambios observables de transición; identidad instrumental nueva. |
|11/16desviaciones diagnósticas, n=1par de procesos | Estimar de forma emparejada por proceso, completar orden/bloques previstos y revisar instrumentación para escalas pequeñas; no seleccionar solo llamadas favorables. | Criterio de perturbación/normalización fijado antes de nueva ejecución; resolución y sensibilidad con evidencia suficiente. |
| Q3 completo y Q4 sin cobertura | Separar consumidor elemental, archivo/proveniencia/supervisión y adaptación longitudinal. Mantener transport_roundtrip identificado como transporte RC1, no archivo P01. | Pregunta/operación y costes incluidos explícitos; no declarar ahorro I+D ni causalidad desde este piloto parcial. |

No se recomienda reescribir WORLD-LAB ni eliminar validación, snapshots o contratos por preferencia arquitectónica. La siguiente decisión mínima es revisar qué trabajo cabe en una unidad experimental, cómo localizar censura y cómo medir perturbación; no comenzar otra campaña por el mero hecho de haber conservado el archivo.

## Preservación y entrega

Las métricas completas por operación/fase,385filas CSV,48filas de cobertura y recursos/versiones originales se publican junto al informe. [EVIDENCE_MANIFEST.json](EVIDENCE_MANIFEST.json) liga archivos/fuentes/resultados; archivo descargable y SHA se identifican en [RECOVERY.md](RECOVERY.md). No se incluyen claves privadas; recibo/firma/pública aprobados son públicos. La primera pasada interna de análisis contó baselines propios entre385registros; se conserva con nota de corrección y script en ops, mientras la salida publicada distingue342comparaciones no triviales. No cambió ninguna medición.

Los originales permanecen intactos y el archivo parcial no se sustituye por un cierre artificial. Copia/restauración local y publicación Git no se describen como respaldo externo recibido por el propietario. No se fusiona automáticamente ni se ejecutan RC1-E, nuevos episodios o replay P01/E3/E4.
