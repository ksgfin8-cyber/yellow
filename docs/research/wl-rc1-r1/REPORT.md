# WORLD-LAB RC1-R1 — revisión focalizada posterior al piloto

**Dictamen: READY_FOR_R1_GATE_REVIEW.** Preparación y pruebas terminadas; propuesta de piloto pendiente del propietario. Piloto v1 continúa **PILOT_PARTIAL**, con archivo verificado y resultado científico incompleto. **RC1-E HOLD.** No se inició un piloto v2 ni se reutilizó autorización v1.

Fecha: 18 de noviembre de 2026, America/Guayaquil. Base: main posterior a PR51, `aab268dde2f20299234c6b407ce6ba9f54438076`. Rama de revisión: `research/wl-rc1-r1-review`.

## Auditoría y elección

La [auditoría y matriz de tres alternativas](AUDIT_AND_DECISION.md) confronta código v1 y archivos publicados del piloto. La [selección fechada con SHA-256](DESIGN_SELECTION.json) se registró antes de crear el instrumento R1; se conserva sin reescribirla tras las pruebas.

V1 inició tres de 48 workers: dos P1 completos y un P2 MINIMAL censurado; 45 quedaron sin ejecutar. Se conservaron 385 muestras y 144 pares estructurales iguales. La última muestra confirmada fue `history_getter/WARM/3`; la fase exacta del timeout no estaba instrumentada. No se atribuye ese timeout a la API, GC, IPC o preparación sin medición que lo demuestre.

`prep_ns` v1 mezclaba preparación con testigo de entrada; extracción de salida, codificación, JSON, hash y compresión no tenían ventanas separadas. El callback IPC no acredita persistencia durable. El watchdog se cerraba antes de sellar/verificar. Se observan costes agregados; las explicaciones causales permanecen hipótesis. Las 11/16 desviaciones diagnósticas de modalidades en P1 proceden de un único par de procesos y no prueban un efecto causal poblacional.

Se seleccionó **B: partición por operación**, sin compartir preparación mutable. A (más presupuesto monolítico) conserva confusión de orden y censura de la cola. C (reutilizar plantillas independientes) podría ahorrar trabajo, pero no hay clonado público del historial Recorder ni ahorro validado; no se usan sus detalles privados. La matriz documenta costes, cobertura, sesgos y reproducibilidad de las tres opciones.

## Propuesta que requiere revisión

El [protocolo 1.0.0](PROTOCOL.md), [condiciones exactas](conditions.json) y [candidato nuevo](R1-CANDIDATE.json), identidad `e42a86ff8adcac7a05ccd5c41878b4775d06040aaa5056021ddd8a026efa3721`, fijan antes de cualquier piloto R1:

- P1–P8 sin cambiar parámetros físicos; cuatro operaciones: tick, observation, record_append y replay. **4/16 operaciones**, no cobertura completa RC1. Las otras doce permanecen diferidas.
- Dos bloques pareados, semillas 21001/21002; orden AB/BA MINIMAL/DETAILED equilibrado, inversión de perfiles/operaciones. 128 procesos nuevos; por proceso una primera llamada, tres warm-up y cinco warm, con reconstrucción independiente en cada llamada.
- Estimador principal: mediana de cinco latencias wrapper por proceso; diferencia porcentual de medianas entre modalidades por bloque. Resumen de ambos bloques con mediana, rango y valores individuales. Indicador si algún bloque supera 10%, aunque signos contrarios se cancelen. Estimador por diferencias de índice es secundario. Sin IC, pvalor ni cinco llamadas tratadas como réplicas independientes.
- Censura y fallos se conservan; no se reemplazan condiciones ni se calculan resúmenes balanceados incompletos. FIRST_MEASURED no equivale a API fría porque preparar prefijos puede calentarla.

**Presupuesto propuesto:** 30 s por hijo, heap 256 MiB por hijo / 512 MiB controlador, RSS agregado muestreado 1 GiB cada 25 ms y archivo total 128 MiB. Las ventanas de 128 hijos suman 64 min; watchdog de trabajo/sellado/verificación de data de 75 min deja 11 min nominales para el controlador. El piloto v1 censuró un monolito de 16 operaciones a unos 10 s; particionar elimina esa acumulación, sin demostrar suficiencia para los perfiles mayores. El aumento a 30 s es un límite diagnóstico conservador a revisar, **no una predicción empírica de terminación**. La propuesta puede detenerse antes de completar su matriz; hacerlo no autoriza reintentar o aumentar límites.

No se midió el plan128 para justificarlo retrospectivamente. Más arranques/guards/archivos pueden dominar operaciones pequeñas. n=2 pares de procesos permite diagnóstico descriptivo, no inferencia precisa ni decisión definitiva RC1-E. El propietario debe aceptar expresamente cobertura, estimadores, presupuesto, identidad y un nuevo mecanismo firmado antes de otro piloto.

## Cambios limitados al instrumento

Todos los cambios son archivos nuevos. `tools/research/wl-rc1-r1/` añade plan fijo, candidato/autorización con dominio R1, worker de una operación, journal de fases, coordinación/verificación del paquete y estimadores. Reutiliza sin cambiar prepare/measure/codec, almacenamiento y guardian v1. No sustituye métodos WORLD/Recorder ni introduce RNG científico.

El journal fsync separa PREPARE, INPUT_WITNESS, EXECUTE, OUTPUT_WITNESS, ENCODE, SERIALIZE, HASH, COMPRESS e IPC_SEND_CALLBACK, además de identidad/carga/calibración. Escribe fuera de api_ns, conserva el último checkpoint abierto y declara su propio coste; no identifica instrucciones exactas ni elimina perturbación. La vigilancia continúa durante sellado y verificación de data. El primer error de operación detiene unidad y secuencia. Un `done` sin muestras completas no se acepta como unidad completa.

Se reservan 32 MiB para journals (256 KiB por worker), 1 MiB para guardian/envelope y 95 MiB para datos primarios, incluida su reserva final. No se silencian cuotas/diagnósticos excedidos. El envelope de raíz controla el estado global; un manifest de data no acredita por sí solo la verificación terminal.

## Evidencia ejecutada y trazabilidad

Comando final: `node --max-old-space-size=512 --test tests/wl-rc1-r1.test.cjs`. **13/13 PASS**, cero omitidas; duración y salida exactas en [log final](validation/tests-04.log). No son tests canónicos T01–T280. Se ejecutaron cuatro revisiones locales del harness, no cuatro pilotos: 12/12, 12/13, 13/13 y 13/13. En la segunda, la nueva fixture de mensajes incompletos omitía su freeze_id y fallaba antes del defecto que pretendía comprobar; se corrigió esa fixture. Se conservan los cuatro logs, sin cambiar expectativas de suites históricas.

| Requisito | Evidencia focalizada |
|---|---|
| Selección previa, plan128 y AB/BA | R1-01, registro de selección y conditions.json |
| Nueva identidad, rechazo de autorización/candidato v1 | R1-02–03; firma efímera de prueba, ningún piloto lanzado |
| Equivalencia semántica de las cuatro operaciones | R1-04: estado/resultados/reloj/RNG y bytes WLS1 completos, fixtures independientes en ambos modos |
| Perturbación observable, testigos, fases y recuperación | R1-05: dos workers diminutos tick 2×2/T2, ocho muestras; testigos completos iguales, copia restaurada verificada y corrupción detectada |
| Estimadores/censura y cancelación de signos | R1-06: valores sintéticos; dos bloques opuestos conservan alarma individual, sin IC |
| Localización y cuotas journal | R1-07–08: errores/cuota y bloqueo PREPARE frente a EXECUTE |
| Detención inmediata, sin continuar ni reintentar | R1-09: error de instrumento impide la siguiente unidad |
| Watchdog activo al verificar | R1-10: controlador bloqueado después del sellado y antes de verificar, SIGKILL y PARTIAL_UNSEALED |
| RSS agregado / cuotas totales | R1-11: umbral RSS sintético fuerza parada |
| Ninguna campaña final / retry v1 | R1-12: enumeración pura, sin entrada RC1-E |
| Incompletos nunca aceptados como completos | R1-13: done sin muestras causa PARTIAL y rechazo de verificación |

La última pareja pequeña produjo cuatro diferencias wrapper D−M: 549070, −472173, 779297 y −197749 ns. **No son una estimación de perturbación R1**, ni cinco warm por proceso; no se aplicó el estimador primario. El coste de journal, preparación, identidad y OS sigue afectando al proceso aunque quede fuera de api_ns. No se declara mejora de rendimiento ni perturbación menor del10%.

Los [archivos de validación](VALIDATION_RECOVERY.md) permiten inspección y verificación por lectura, incluidos fallos parciales intencionales. Las cuatro ejecuciones completas del harness generaron ocho workers diminutos de medición, no perfiles P1–P8; también ejecutaron operaciones directas pequeñas y fallos sintéticos. No se agregaron como réplicas científicas. No se reejecutaron suites generales del motor: ningún archivo previo cambió y se comprobó la identidad v1.

## Preservación y límites

[PRESERVATION_CHECK.json](PRESERVATION_CHECK.json) registra comparación del checkout previo con Git/PR51, SHA de selección, nuevo candidato, integridad de fuentes v1/paquete y originales/restauración del piloto cuando están disponibles. WORLD, contratos, Recorder, WLS1, P01, protocolo y evidencia v1 no cambian. El candidato v1 sigue verificando con su identidad original. Las rutas absolutas en logs son referencias históricas del entorno; no son enlaces públicos ni almacenamiento externo garantizado.

No existe autorización de piloto R1: identidad nueva no es aprobación. No se generó clave privada de producción, no se reutilizó la autorización consumida, no se ejecutó run-pilot ni RC1-E. Las claves efímeras del test permanecieron en memoria; no se incluyen sus recibos/firmas públicos entre los paquetes científicos.

Permanecen limitaciones: cobertura4/16; preparación reconstruida puede dominar; overhead/checkpoints y GC/orden no quedan causalmente separados; presupuesto de perfiles grandes no validado; muestreo RSS no es cap instantáneo; filesystem/host pueden perderse. El guardian se cierra tras verificar data; inspección/envelope terminal pequeño posterior no tiene garantía física de tiempo ni tolerancia a pérdida del host. Sin envelope se declara PARTIAL_UNSEALED, no éxito.

Se solicita únicamente revisión de esta propuesta y su candidato. Cierre operacional/P01 e informes históricos se conservan; F6-N, conformidad normativa global e interoperabilidad independiente siguen no establecidos. El trabajo se detiene en **READY_FOR_R1_GATE_REVIEW**, sin comenzar otro piloto.
