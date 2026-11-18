# Auditoría previa de preparación R1

Base main/PR52 `89865a7a56ccb9d507a669ffcb900abebadf3e95`. Autoridad de esta revisión: orden de calibración; no se añade norma a WORLD-LAB. Las observaciones siguientes proceden del código y de archivos existentes, no de una campaña R1 ejecutada.

| Aspecto | Evidencia revisada | Resultado y límite |
|---|---|---|
| Protocolo/plan | R1 PROTOCOL.md, conditions.json, plan.cjs, testR1-01 |128entradas únicas=8perfiles×4operaciones×2bloques×2modos, semillas21001/21002, AB/BA. Los campos de plan y JSON coinciden. Cobertura4/16 explícita. |
| Identidad | R1 identity.cjs y candidato e42a…3721; check existente |Fuentes, runtime, protocolo y plan vinculados. La identidad original debe seguir verificando; no se modifica para permitir calibración. No es aprobación de ejecución. |
| MINIMAL/DETAILED | measure v1 importado por R1 |Ambos miden invoke; DETAILED añade cpuUsage/memoryUsage alrededor de la API. MINIMAL conserva cronómetros, validaciones, testigos y archivo. Las modalidades no equivalen a presencia/ausencia de toda instrumentación. |
| Ventanas | worker.cjs R1 y journal.cjs |PREPARE separado de INPUT_WITNESS; API dentro de EXECUTE; extracción, encode, JSON, hash y gzip después. Callback IPC separado en journal, no ack durable. Journal no escribe dentro de api_ns, pero puede perturbar caches/GC/scheduling. |
| Journal | secuencia BEGIN/END/ERROR, cap256KiB; inspect |work_ns no incluye escrituras de bordes; elapsed incluye BEGIN hasta antes de END; io_ns no incluye close. Última etapa abierta localiza intervalo, no instrucción. Errores, cola parcial y cuota se detectan. |
| Error explícito | session/worker R1 |operation_error/fatal provoca kill y detención de secuencia; las pruebas sintéticas lo comprueban. No se observó operation_error en v1; no atribuirle su timeout. |
| Completitud estructural | validateRaw R1 después del bucle y sellado |**AUD-C01: validación tardía demostrada.** Un worker falso con header correcto y done sin muestras permite iniciar una segunda unidad antes de que validateRaw rechace el lote. No ocurrió en los registros del piloto v1; no se afirma un resultado científico corrupto. |
| Límites | guardian/storage/session R1 |Tiempo por hijo incluye arranque/identidad/preparación/testigos; RSS agregado muestreado25ms; gzip y diagnósticos limitados.95MiB+32MiB+1MiB=128MiB. No demuestra suficiencia de30s/75min, ni capRSS instantáneo. |
| Finalización | session R1 |Guardian cubre sellado/verificación de data. Inspección de journals y envelope pequeño posterior quedan fuera; pérdida del host puede dejar PARTIAL_UNSEALED. Límite documentado, no discrepancia oculta. |
| Semántica | tests R1-04/05 y paquete de validación publicado |Fixtures independientes y comparación completa en cuatro operaciones; bytes WORLD/FULL, reloj y RNG conservados. Evidencia de mecanismo pequeño, no equivalencia universal ni viabilidad P1–P8. |

Fuentes obligatorias leídas: REPORT.md, PROTOCOL.md, AUDIT_AND_DECISION.md y conditions.json R1; todos sus módulos y pruebas directamente relacionadas; código de operaciones/measure/storage/guardian/identidad v1; piloto v1 analysis-summary/processes/operation-summaries, manifiesto, JSONL y testigos archivados mediante verificación de lectura. No se repite replay físico del piloto.

## Corrección contenida y necesidad de los cambios

No se edita ningún archivo de main/PR52, incluidos instrumentos y candidatos previos. El CLI R1 existente solo permite el plan128 bajo su recibo de piloto, o fixtures2×2; tampoco dispone del contraste journalOFF necesario para caracterizar la persistencia. Usarlo para un subconjunto/calibración requeriría falsificar su clase de petición o cambiar su identidad. Por eso se añade un ejecutor de calibración separado, con dominio/plan/destino propios.

Para AUD-C01, el transporte de calibración conserva la lógica R1 en un módulo local y añade validación incremental de prefijos y de completitud/journal antes de iniciar otra unidad. La prueba CAL-07 reproduce dos inicios con el controlador congelado y uno con el nuevo, frente a done incompleto. No se acepta el viejo esquema del fake como formato nuevo: la fixture de calibración emite header R1-CAL correcto y se rechaza por muestras ausentes. CAL-09/10 comprueban la supervisión del módulo nuevo.

Este cambio está limitado a R1/calibración, no a producción. La copia local de transporte y el pequeño worker específico son necesarios para conservar fuentes congeladas y controlar otro recibo/plan/checkpoints. Se reutilizan sin alterar operaciones científicas, measure, codec, almacenamiento, guardian y journal SYNC. No se añaden hooks al motor, una capa de transacciones ni preparación compartida.

AUD-C01 permanece documentado en el **ejecutor128 congelado**, que no se ejecuta. Antes de usar ese ejecutor se requiere incorporar una corrección equivalente en una revisión explícita con nueva identidad/aprobación, o autorizar otro ejecutor que la contenga; no se atribuye retrospectivamente la corrección al candidato e42a. Esto no impide calibrar con el instrumento separado corregido, y sí impide recomendar sin reservas el ejecutor128 actual.

## Evidencia histórica y límites empíricos

V1:3workers iniciados de48,2completos P1 y1P2/MINIMAL censurado;385muestras,26testigos,144comparaciones modales estructurales iguales. Wall7,132891s/9,395222s/10,041488s; STOP observado10018,376707ms. Pico agregado muestreado501096448bytes. Última muestra P2 history_getter/WARM/3; fase final desconocida. El conjunto de36archivos es PARTIAL y verificable. Ninguno de estos números acredita el presupuesto R1 o el coste específico del journal nuevo.

Preparación v1 suma3,137709354s/5,389668920s en los dos P1 completos, incluyendo testigo de entrada. API suma0,960590464s/1,941777669s; wrapper0,960926204s/1,956386755s. No son porcentajes causales separados; los tiempos de ventanas se solapan por diseño. Las hipótesis de JIT/GC/IPC no están identificadas por esos agregados.

No hay otra divergencia demostrada en las ocho áreas revisadas. Permanecen incertidumbres de cobertura, perturbación y presupuesto, que se responden mediante la calibración propuesta cuando sea autorizada. Ausencia de nueva divergencia en esta revisión focalizada no declara conformidad normativa global.
