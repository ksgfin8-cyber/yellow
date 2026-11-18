# WORLD-LAB RC1-R1 — preparación de calibración y GATE-R1

**Dictamen: READY_FOR_R1_CALIBRATION_APPROVAL.** Se prepararon protocolo, controles y presupuesto. **La calibración P1–P8 NO se ejecutó. El piloto128 y RC1-E continúan HOLD.** La fiabilidad/viabilidad empírica del plan128 aún no está demostrada.

Fecha:18 de noviembre de2026, America/Guayaquil. Base main/PR52 `89865a7a56ccb9d507a669ffcb900abebadf3e95`; rama `research/wl-rc1-r1-calibration`.

Identidad nueva de calibración:

`6763348852b6b4a133a3e6326e8e774d25b6244703457282035d41601b66fa90`

[CANDIDATE.json](CANDIDATE.json) vincula runtime, todos los520archivos de la base, módulos/pruebas nuevos, protocolo, matriz y plantilla de autorización. Coincide con el candidato usado en las pruebas finales. El candidato R1 `e42a86ff8adcac7a05ccd5c41878b4775d06040aaa5056021ddd8a026efa3721` sigue verificando sin cambios. Identidad nueva no significa autorización recibida.

## Auditoría y defecto comprobado

[AUDIT.md](AUDIT.md) recorre las ocho áreas pedidas y distingue observación, límite e hipótesis. El plan128 corresponde a su protocolo. Los tiempos de API/preparación/testigos/serialización/compresión/IPC están separados con los límites documentados; measure conserva la semántica MINIMAL/DETAILED. No se confunde callback IPC con persistencia ni ausencia de escritura dentro de api_ns con ausencia de perturbación.

**AUD-C01:** el controlador R1 congelado comprueba completitud después del lote. Una fixture con header válido y done sin muestras permite dos inicios antes del rechazo. El controlador separado de calibración comprueba cada prefijo y la completitud/journal antes de continuar; la misma anomalía, con header nuevo correcto, detiene tras un inicio. CAL-07 reproduce ambas conductas, sin perfiles experimentales. El defecto no se observó en el piloto v1 y no se atribuye a sus resultados.

Los instrumentos anteriores permanecen intactos: la corrección está en el ejecutor de calibración. AUD-C01 **no queda resuelto retrospectivamente para el ejecutor128 e42a**. Antes de utilizarlo se necesita una revisión explícita corregida, nueva identidad/aprobación o un ejecutor aprobado que incorpore la corrección. No se recomienda ejecutar el128 actual.

El módulo de transporte local conserva la lógica R1 y añade esa corrección; [SESSION_DELTA.diff](SESSION_DELTA.diff) permite revisar las diferencias sin reescribir fuentes congeladas. El worker específico agrega el contraste de persistencia SYNC/OFF, restringido a esta matriz. Se justifican por dos capacidades ausentes en el CLI R1: subconjunto firmado y control del journal. No se crean capas del motor, hooks, clonado de Recorder ni nuevas fuentes de aleatoriedad.

## Calibración mínima propuesta

| Orden | Celda propuesta | Finalidad |
|---|---|---|
| 1 | P1/tick,8×8,r1,T4 | Referencia pequeña |
| 2 | P3/observation,32×32,r1,T4 | Crecimiento espacial y testigos de estado |
| 3 | P7/record_append,16×16,r1,T16 | Mayor horizonte, prefijo y registro |

Dos bloques22001/22002, modalidades MINIMAL/DETAILED y journal SYNC/OFF: **24workers, máximo216llamadas**. En cada celda, el segundo bloque invierte el orden de los cuatro tratamientos. Finalizar la celda barata antes de pasar a la siguiente; primer fallo detiene todo, sin retry ni ampliación. [conditions.json](conditions.json) contiene el orden completo.

Tres celdas cubren los mecanismos mínimos solicitados, no son una muestra representativa de32celdas ni permiten estimar una ley espacial/temporal: las APIs difieren. Quedan fuera radio máximo P6, aspecto P8, replay empírico y el resto de la matriz. Las pruebas pequeñas sí incluyen semántica de replay, sin constituir su calibración de rendimiento.

Presupuesto propuesto:30s/hijo,256MiB heap hijo/512MiB controlador, RSS agregado1GiB/25ms y64MiB de archivo.24×30s=12min de ventanas; watchdog15min deja3min nominales para trabajo del controlador. Se asignan6MiB a journals,1MiB a guardian/envelope y57MiB a datos primarios, incluida su reserva. Es un **tope para obtener evidencia**, no una predicción de suficiencia ni aumento de límites tras observar datos.

El piloto v1 dejó un monolito censurado a10s y solo dos procesos completos; eso justifica medir riesgo/localización, no30s o75min como garantías. El gate de calibración verifica más archivos que R1: sus costes de identidad se registran aparte y su wall no se extrapola como arranque exacto del piloto128.

## Estimadores y aceptación fijados antes de datos

[PROTOCOL.md](PROTOCOL.md) fija ventanas, denominadores sin doble conteo y márgenes. Se reportarán preparación/API/envoltura/testigos/IPC/trabajo de proceso/journal como fracciones del wall, más residual sin causa atribuida. API está contenida en EXECUTE; se descuenta antes de sumar. Un worker censurado no recibe tiempos imputados ni balance completo.

Modalidad: diferencia porcentual de medianas de5WARM por proceso, separada para SYNC/OFF. Journal: contraste principal de wall_SYNC/wall_OFF y secundario de medianas warm. Ambos bloques individuales, mediana/rango y alarmas de magnitud>10% aunque sus signos se cancelen. No IC/pvalor, cinco submedidas no son cinco réplicas y no se identifica efecto físico puro de fsync. OFF conserva la instrumentación temporal, archivo, testigos e IPC.

Antes de considerar una recomendación del piloto: archivo/restauración/estructuras completas iguales, condiciones y muestras completas, revisión de resolución y perturbación. Márgenes operacionales propuestos: máximo worker≤15s, RSS muestreado≤0,8GiB y archivo≤32MiB; fallar impone HOLD sin ampliar límites automáticamente. Son criterios elegidos de ingeniería, no hechos empíricos. Incluso superarlos solo respalda el alcance ensayado y no elimina AUD-C01 ni autoriza128/RC1-E.

| Pregunta solicitada | Estado en esta preparación |
|---|---|
| Proporciones reales de tiempo P1–P8 | UNTESTED; fórmulas verificadas con valores sintéticos y fixtures pequeños |
| Duración real por worker P1–P8 | UNTESTED; no inferirla de fixtures |
| Primera limitación de presupuesto | UNTESTED; se preservará el primer stop/celda/checkpoint real |
| Perturbación material del journal en P1–P8 | UNTESTED; contraste factorial fijado, no se declara inocuo |
| Archivo/recuperación de parciales | VERIFIED en controles sintéticos, con límites de host/filesystem |
| Límites empíricos suficientes para128 | NOT_ESTABLISHED; riesgo explícito y criterios de margen preparados |

## Pruebas autorizadas ejecutadas

```bash
node --max-old-space-size=512 --test tests/wl-rc1-r1-calibration.test.cjs
node --max-old-space-size=512 --test tests/wl-rc1-r1.test.cjs
```

**10/10 pruebas nuevas y13/13 heredadas R1 aprobadas**, sin cambiar aserciones históricas. [Logs completos](validation/): preparación01,8/8PASS; preparación02,10/10PASS; regresiónR1,13/13PASS. La segunda revisión añadió fixture de done incompleto con header correcto y pruebas del nuevo controlador para timeout/RSS/watchdog; no ocultó fallos previos. Las dos ejecuciones de la suite nueva son revisiones del harness, no intentos de calibración.

| Pruebas | Evidencia |
|---|---|
| CAL-01–03 | Matriz fija/balance, identidad/base protegida, R1 aún válido, firma efímera/preflight sin workers; rechazo de dominios, alcance, destino y pin alterados |
| CAL-04 | Cuatro operaciones con fixture2×2/T2, ambos modos/SYNC-OFF; igualdad completa antes/después/resultados/reloj/RNG/bytes WLS1 frente a prepare/measure existentes |
| CAL-05 | Cuatro workers diminutos,16muestras y testigos iguales; IPC/balances no solapados, copia restaurada y corrupción detectada |
| CAL-06 | Estimadores manuales sintéticos, residual y rechazo de balances incompletos |
| CAL-07 | Divergencia tardía R1 y corrección temprana de calibración, dos solicitudes sintéticas, sin muestras científicas |
| CAL-08 | Sin entrada de piloto/final; invocaciones incompletas rechazadas antes de crear destino |
| CAL-09–10 | Timeout con checkpoint PREPARE, RSS sintético, ausencia de siguiente unidad y watchdog al bloquear verificación; PARTIAL/PARTIAL_UNSEALED preservados |

La suite R1 conserva sus13casos de semántica, archivos, límites, errores y aislamiento. Los tests no son T01–T280. Firmas de prueba usan clave efímera solo en memoria, no clave del propietario. El preflight de prueba firma una plantilla con clave de test y no inicia workers. El destino experimental permanece inexistente. No se ejecutó run-calibration, run-pilot ni RC1-E, ni replay físico del piloto original; sí replay pequeño como prueba semántica.

## Evidencia, autorización y recuperación

[AUTHORIZATION_AND_RECOVERY.md](AUTHORIZATION_AND_RECOVERY.md) fija el procedimiento del firmante y operador: recibo cerrado, nuevo dominio Ed25519, pin DER-SPKI aprobado expresamente para esta calibración, preflight sin ejecución y posterior orden expresa de inicio. Campaña `WL-RC1-R1-CALIBRATION-1`, destino exclusivo `/workspace/shared/world-lab/wl-rc1/calibration-r1-v1`. No existe aprobación ni recibo real para ejecutarla en esta entrega.

[PREPARATION_EVIDENCE.tar.gz](PREPARATION_EVIDENCE.tar.gz),43069bytes, SHA-256 `89b5a2b28bae34f987134f08084bd161dfd32930db4e115c750ca0d0e49fdee7`, conserva la última pareja factorial pequeña, candidatos y paradas sintéticas, excluyendo claves/recibos de test. [Checksum](PREPARATION_EVIDENCE.tar.gz.sha256). Recuperado en directorio nuevo y verificado: VERIFIED/COMPLETE,16muestras, cero errores,2journals, cero etapas abiertas, P1_P8_executed=false. Instrucciones exactas en [RECOVERY.md](RECOVERY.md). Integridad no equivale a aceptación científica.

[PRESERVATION.json](PRESERVATION.json) confirma los520archivos de main idénticos,36originales y36restaurados v1 sin diferencias y ambos archivos históricos v1/R1 intactos. La verificación de lectura v1 conserva385muestras/26testigos, PARTIAL y cero errores; no lo convierte en completo. Las rutas absolutas de logs son referencias históricas del workspace, no enlaces públicos ni respaldo externo acreditado.

No se editan WORLD, Recorder, WLS1, contratos, P01, fuentes congeladas ni datos anteriores. No se reescriben informes históricos. F6-N, conformidad global e interoperabilidad independiente permanecen no establecidos.

**Próxima puerta real:** aprobación por el propietario del expediente/candidato, presupuesto y clave para la calibración24. El trabajo se detiene aquí. La evidencia sintética no autoriza128 y AUD-C01 permanece una condición de revisión del ejecutor128 original.
