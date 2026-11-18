# RC1-R1 — Calibración instrumental propuesta 1.0.0

**PREPARACIÓN SOLAMENTE. P1–P8, piloto128 y RC1-E no autorizados.** Protocolo/estimadores fijados antes de medir las condiciones aquí propuestas. No cambia las preguntas científicas, parámetros físicos ni resultados v1/R1/P01.

Base: main/PR52 `89865a7a56ccb9d507a669ffcb900abebadf3e95`. Candidato R1 preservado: `e42a86ff8adcac7a05ccd5c41878b4775d06040aaa5056021ddd8a026efa3721`. Instrumento de calibración separado: `tools/research/wl-rc1-r1-calibration/`. Los archivos congelados no se editan. Importa prepare/measure/codec/storage/guardian y journal existentes; el worker/calibración restringe una matriz nueva y el controlador valida cada unidad antes de continuar.

## Preguntas, unidades y selección mínima

Una unidad es un proceso nuevo para una celda perfil/operación, bloque, modalidad y política de checkpoints. Entrada reconstruida antes de cada llamada, sin reutilizar WORLD/RNG/historial. No es un episodio P01 ni una repetición v1.

| Orden de coste propuesto | Celda | Justificación | Cobertura que NO proporciona |
|---|---|---|---|
| 1 | P1,8×8,r1,T4,tick | Referencia pequeña de transición; coste API/preparación v1 disponible | No todo P1 ni todas las operaciones |
| 2 | P3,32×32,r1,T4,observation | Crecimiento espacial frente a la referencia; testigos WORLD/FULL recorren estado | No compara una misma API a diferentes tamaños; no estima escalamiento causal |
| 3 | P7,16×16,r1,T16,record_append | Mayor horizonte y preparación de prefijo; incluye registro | No cubre replay ni radio máximo P6, relación de aspecto P8 o interacción completa |

Se ensayan las dos modalidades MINIMAL/DETAILED y dos políticas de journal SYNC/OFF en cada celda/bloque. Dos bloques, semillas22001/22002. En cada celda: bloque1 MINIMAL/OFF → MINIMAL/SYNC → DETAILED/OFF → DETAILED/SYNC; bloque2 orden inverso. Se completa la celda barata antes de pasar a la siguiente. **24 workers=3×2×2×2**, máximo216 llamadas:1FIRST_MEASURED+3WARMUP+5WARM por worker. Solo2bloques por comparación, no5réplicas independientes. Sin aleatorización ni inferencia poblacional.

OFF elimina únicamente la persistencia de checkpoints; conserva wrappers temporales, testigos completos, IPC, archivo de muestras, guardian y la misma API. No es ejecución sin instrumento. SYNC reutiliza exactamente el journal fsync R1. OFF permite medir el contraste del paquete de persistencia/contabilidad de checkpoints; no identifica el coste físico puro de fsync ni garantiza igualdad JIT/GC/OS. No hay hooks ni reemplazo de métodos del motor.

La matriz24, identidad, destino, semilla, límites y políticas son cerrados; no hay filtros/subconjuntos/overrides desde CLI. El test permitido utiliza solamente un fixture2×2,T2 con block0 y cuatro llamadas, nunca un perfil P1–P8. La enumeración de planes no carga WORLD.

## Ventanas y balance temporal

Se conserva measure R1/v1: api_ns=invoke completo; wrapper_ns añade contadores CPU/memory en DETAILED. MINIMAL deja CPU/memory null; no elimina validaciones internas. No restar tiempos de validadores para inventar primitivas internas. GC no observado ni forzado.

Por llamada: PREPARE, INPUT_WITNESS, EXECUTE, OUTPUT_WITNESS, ENCODE, SERIALIZE, HASH, COMPRESS e IPC_SEND_CALLBACK. Todos fuera de la ventana API salvo el invoke cronometrado. El callback IPC no es ack durable. Las ocho primeras duraciones viajan en la muestra; los tiempos de callback viajan en done, por call-id. Si falta done, los callbacks OFF incompletos permanecen desconocidos. SYNC añade BEGIN/END/ERROR durables por fase; OFF no tiene journal ni localización fina de una llamada interrumpida: solo última muestra recibida y guardian.

Para cada worker completo, usando tiempos enteros ns antes de convertir proporciones:

- P=sum PREPARE; A=sum api_ns.
- X=sum(EXECUTE−api_ns): envoltura temporal/instrumental alrededor de API, no efecto causal puro.
- W=sum(INPUT_WITNESS+OUTPUT_WITNESS+ENCODE+SERIALIZE+HASH+COMPRESS).
- I=sum IPC_SEND_CALLBACK del done; G=sum process_work_ns (identidad/carga/calibración/envíos/final_identity).
- J=journal.io_ns, escrituras/fsync completados, no close; OFF J=0 por diseño.
- Denominador observado L=wall_ns del controlador. Reportar P/L,A/L,X/L,W/L,I/L,G/L,J/L y residual `L−(P+A+X+W+I+G+J)`. No sumar api a EXECUTE sin descontarla. El residual no se asigna a una causa: incluye arranque, cierre, colas, bookkeeping y trabajo no cubierto. Valores negativos inconsistentes se investigan, no se truncan a cero.

Un proceso censurado conserva tiempos realmente observados, última muestra/checkpoint y wall del intento; no imputar tiempos faltantes ni publicar la misma descomposición completa. Coste controlador/sellado/guardian se informa aparte a nivel sesión, sin sumarle picos no simultáneos. La identidad de calibración verifica más archivos que el gate R1; ese coste se registra en IDENTITY/FINAL_IDENTITY y **no se presenta como predicción exacta del arranque R1 original**.

## Estimadores fijados

1. Por worker: mediana/min/max de5WARM para API, wrapper y cada fase; primera/warm-up separadas. Conservar todos los crudos, sin excluir lentos ni outliers.
2. Por celda/bloque/journal: `100*(mediana_WARM_wrapper_D/mediana_WARM_wrapper_M−1)` para modalidad. API por separado. Comparaciones SYNC/OFF no se mezclan.
3. Por celda/bloque/modalidad: estimador principal del contraste journal `100*(wall_SYNC/wall_OFF−1)`; secundario `100*(mediana_WARM_wrapper_SYNC/mediana_WARM_wrapper_OFF−1)`. Reportar también bytes/eventos, J/L y diferencias de fases. No reemplazar el contraste por J/L: son preguntas distintas.
4. Dos bloques: valores individuales, mediana y rango; cualquier |diferencia|>10% activa diagnóstico material a revisar aunque signos opuestos cancelen la mediana. El10% es criterio de ingeniería diagnóstico heredado de R1, no nuevo resultado científico confirmado. No IC/pvalor con este diseño; no afirmar ausencia de perturbación por no superar el umbral.
5. Flags api_ns<10×clock_median_ns. Ausencia de flags no certifica precisión. Si faltan5WARM o algún bloque, no calcular el estimador balanceado de esa comparación; publicar parciales, razón y cobertura reducida.
6. Comparar **estructuras completas** de before/after/resultados/eventos/reloj/RNG y bytes WLS1 entre tratamientos del mismo bloque/celda y entre llamadas del mismo fixture. Diferente semilla entre bloques impide exigir mundos iguales entre bloques. Los hashes solo identifican testigos, no sustituyen comparar sus contenidos.

## Presupuesto y parada

Propuesta, no suficiencia demostrada:30s por worker,256MiB heap hijo/512MiB controlador, RSS agregado1GiB/25ms.24×30s=720s, vigilancia de900s=15min deja180s nominales de margen. No ampliar automáticamente esos límites ni asumir suficientes75min para piloto128. La calibración es24/128=18,75% de procesos del piloto propuesto, pero no una muestra aleatoria ni cobertura equivalente; tres de32celdas perfil/operación.

Archivo total64MiB:6MiB para24journals×256KiB (también se reservan posiciones OFF),1MiB guardian/envelope y57MiB escritura primaria, incluida reserva terminal1MiB. Límites gzip16MiB/expandido64MiB y stdout/stderr64KiB por stream sin truncamiento silencioso, iguales al transporte R1. Un worker a la vez. Guardian permanece activo al sellar/verificar data; escritura terminal de envelope pequeño posterior no tiene garantía física de tiempo ni tolerancia a pérdida del host. RSS muestreado no es límite instantáneo duro.

Ante primer timeout/RSS/cuota/error/identidad/estructura/journal/equivalencia demostrada: detener secuencia, conservar intento y ausencias, **no retry/resume**. El controlador nuevo comprueba cada prefijo y la completitud/journal al cerrar la unidad antes de iniciar la siguiente. No se hereda como suficiente la comprobación tardía de muestras de R1. Comparación estructural entre tratamientos se efectúa durante recuperación/análisis; si allí aparece discrepancia, invalidar aceptación y no lanzar ninguna nueva ejecución.

Primer límite de presupuesto=primer stop realmente registrado y su celda/factor/fase, no perfil supuesto. Si no hay stop, solo se concluye no haberlo observado en estas24unidades. Cualquier continuación necesita una orden y nueva revisión; no reemplazar semillas ni condiciones.

## Criterios de gate tras una calibración futura

Integridad: identidad/firma válidas,24condiciones únicas completas,216muestras esperadas, cero errores/omisiones y comparación estructural completa; inventarios/restauración coinciden. Parciales íntegros son evidencia útil, no completitud. Mantener evidencia y motivos de censura.

Medición: ventanas/IPC y resolución inspeccionadas, dos bloques por contraste, magnitudes/signos y flags del10% publicados; perturbación material o resolución insuficiente exige revisión antes del piloto128. No afirmar causalidad aislada ni declarar universalmente inocuo el journal.

Viabilidad: criterio de margen propuesto antes de datos: máximo wall por worker≤15s (50% del cap30), pico agregado muestreado≤0,8GiB y archivo total≤32MiB (50% del cap64), sin stop. Son márgenes operacionales elegidos, no leyes empíricas. Si fallan, **HOLD del piloto128**, sin ampliar automáticamente. Aun si pasan, P6/radio, replay y demás celdas no ensayadas mantienen incertidumbre: no autorizar piloto128 automáticamente ni RC1-E.

La preparación termina READY_FOR_R1_CALIBRATION_APPROVAL, no READY_FOR_RC1_E. Resultados empíricos de estas preguntas: **UNTESTED**, hasta autorización específica y ejecución futura. Las pruebas pequeñas solo verifican mecanismos.

## Autorización y recuperación

Campaña propuesta `WL-RC1-R1-CALIBRATION-1`; destino exclusivo `/workspace/shared/world-lab/wl-rc1/calibration-r1-v1`, nuevo y fuera del repositorio/P01. No crear ese destino en esta preparación. Nuevo candidato/domain/receipt, decisión AUTHORIZE_CALIBRATION_24_ONLY; candidato R1/piloto v1 no habilitan este modo. El propietario deberá aprobar identidad, pin DER-SPKI y firmar **dominio UTF-8 WL-RC1-R1-CALIBRATION-AUTHORIZATION-1 +LF0x0A +bytes exactos del recibo**. Sin claves reales generadas aquí. Tests efímeros no representan al propietario.

Comandos futuros y recuperación: ver AUTHORIZATION_AND_RECOVERY.md. No existe run-pilot ni RC1-E en la CLI de calibración. Preflight firmado por sí mismo no inicia workers; la orden expresa posterior de inicio sigue siendo obligatoria operacionalmente. Un firmante podría autorizar un ejecutor modificado fuera del gate; la firma no sustituye el control de fuentes.
