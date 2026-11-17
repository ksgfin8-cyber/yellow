# WL-RC1-C/D — Validación instrumental y entrega para GATE-2

**READY_FOR_GATE_2_REVIEW. PILOT HOLD / OWNER_APPROVAL_REQUIRED; RC1-E NOT_AUTHORIZED.** 2026-11-17, America/Guayaquil. Se completan preparación C e implementación/validación focalizada D, no la validación científica de las48 condiciones ni una campaña definitiva.

Candidato: **`466e1dc53f6d5f6f0fe144d85e7f65643b01244acabee5b8caaa25dd34df15ac`**. [Protocolo1.0.0](PROTOCOL.md), [condiciones](conditions.json), [candidato](PILOT-CANDIDATE.json), [solicitud GO/NO-GO](PILOT_REQUEST.md), [código/uso y recuperación](../../../tools/research/wl-rc1/README.md).

Base `main` PR48 `c1e80c5249002fccaf8508ee9d9397d6bbeb1b7c`; rama `research/wl-rc1-cd-instrumentation`. El código bajo estudio permanece byteidéntico al analizado por A/B (`030ec332…`); los cambios de PR47/48 fueron documentales. Fuentes y versiones del instrumento se ligan por contenido, sin hash autorreferencial del commit que publica el candidato. Se conserva el cierre de construcción, F6-N/G00/289BLOCKED/CC-04/05 y la falta de interoperabilidad, sin nuevas declaraciones de conformidad.

## Pruebas realmente ejecutadas

Comando final: `node --test tests/wl-rc1-cd.test.cjs`. **14 PASS /0 FAIL**, exit0. [Log íntegro final](tests-05.log.b64). No se ejecutaron suites canónicas ni se alteraron expectativas históricas. Las comprobaciones adicionales son sintaxis, identidad, hashes, recuperación y alcance del diff; no pruebas científicas definitivas.

| Criterio | Evidencia focalizada | Resultado y límite |
|---|---|---|
| D01 identidad | Candidato contra Git/bytes/runtime; plan y conditions exactos;8WorldConfig validados sin generar mundos; flags implícitos NODE_OPTIONS rechazados; heap parent/hijo declarado; firma/pins inválidos rechazados | PASS preparación. Clave efímera de test válida solo para preflight sin inicio; ninguna clave real RC1 aprobada/creada. |
| D02 semántica | Dos workers MINIMAL/DETAILED con fixture2×2/r1/T2;64 muestras cada uno; cada llamada reconstruye entrada. Comparación estructural completa de testigos, salida, estado/reloj/RNG y bytes WORLD/FULL, no solo hashes |128 muestras técnicas finales coincidentes; mismo testigo repetido por operación demuestra restauración en esos fixtures. No extrapola a P1–P8. |
| D02 eventos efectivos | Fixtures aparte de MOVE con RESOURCE y HAZARD/muerte; ambas modalidades comparadas | Eventos ENTITY_MOVED/RESOURCE_CONSUMED/HAZARD_TRIGGERED/ENTITY_DIED y tiempo/RNG/bytes iguales. No se alteran perfiles piloto. |
| D03 registro | Medidas/unidades/versiones, errores por etapa, testigos completos comprimidos, cuota, diagnóstico censurado explícito; unidades/headers/bytes corruptos rechazados | PASS; no inventa samples al fallar. Transporte íntegro no equivale a ciencia aceptada. |
| D04 resolución |200 diferencias de relojes y200 vacíos por worker; datos crudos/mediana y flag<10× disponibles | PASS del detector. No certifica resolución adecuada para todas las operaciones/escalas. |
| D05 perturbación | Pareja de procesos del fixture, diferencias de wrapper y tiempos API calculables; CPU/memory null en MINIMAL y presentes en DETAILED | PASS del mecanismo de comparación. Datos varían; perturbación<10% en P1–P8 NOT_ESTABLISHED. No se sustrae ruido para fabricar resultado. |
| D06 recursos | Watchdog externo mata hijo bloqueado; otra ejecución independiente útil posterior; RSS agregado con umbral sintético pequeño; controlador bloqueado terminado por guard; cuota antes de escribir, crash y flujo excesivo | PASS de controles a escala de pruebas. No se ejecutó timeout12min,48workers ni stress de1GiB. Scheduling/muestreo no son límites físicos duros. |
| D07 recuperación | Copia nueva del paquete final, verificación de archivos/testigos/unidades; corrupción detectada; interrupción sin manifiesto identificada | PASS. Paquete y scripts recuperables desde repo/archivo publicado sin memoria conversacional. No se declara respaldo externo recibido. |
| D08 separación | Destinos repo/P01 rechazados, sin entrada RC1-E; piloto exigefirma/pins/identidad yflags; diff solo instrumento/tests/documentos nuevos | PASS dentro del modelo de operador confiable. No sandbox de código hostil. |

## Alcance de las ejecuciones de desarrollo

Se hicieron cinco ejecuciones de la suite mientras se añadían controles demostrablemente necesarios: primera13PASS; restantes14PASS cada una. Los logs01–05 se conservan; no se suman como69 tests independientes ni se mezclan sus tiempos. Cada ejecución incluyó una pareja de workers medidores **VALIDATION_ONLY 2×2/T2**, en total10workers pequeños/640muestras técnicas de desarrollo, además de fixtures semánticos directos y procesos sintéticos de bloqueo/crash. Ninguna condición P1–P8 se lanzó. Los planes48 se enumeraron sin ejecutarlos. Hubo preflights de prueba con claves efímeras; episodes_started=0, sin directorio de piloto creado.

Las primeras cuatro iteraciones no eran una revisión congelada; sus logs son evidencia de desarrollo, no base de aceptación del candidato final. El paquete publicado contiene los fixtures del último run y su candidato coincidente. Se preservan en sus rutas originales temporales; no se reescriben resultados previos. E3/E4/P01 no se ejecutaron ni modificaron. Ninguna vista cercana a r511/r512 se materializó.

## Decisiones instrumentales significativas

| ID | Precisión adoptada | Justificación y límite |
|---|---|---|
| RCD-01 | Fixtures nuevos por llamada, prefixT−1/T preparado fuera de API | Evita mutación acumulada; preparación puede dominar worker y calentar métodos, se registra explícitamente. |
| RCD-02 | FIRST_MEASURED no equivale a API virgen fría; cold de proceso separado | La preparación y operaciones anteriores ya usan validadores/registro. Evita atribución falsa de JIT. |
| RCD-03 | Transporte RC1 de codec/gzip separado del pack/gate P01 | No se fuerzan perfiles RC1 en metadatos P01 ni se cambian guards; cobertura completa de archivo/proveniencia/Q3 sigue parcial. |
| RCD-04 | Guardian en proceso externo, no solo setTimeout del controlador | Prueba de controlador bloqueado demuestra actuación independiente; muestreo aún puede sobrepasar nominales. |
| RCD-05 | Firma Ed25519/pins específicos para PILOT_ONLY | Reutiliza patrón de confianza de P01 sin reutilizar su recibo/dominio/identidad. Pins requieren aprobación humana fuera del propio recibo. |
| RCD-06 | Testigos completos deduplicados e inventario propio | Permite comparar estructura/bytes y recuperar sin depender de digests solos; witness64MiB descomprimido/16MiB comprimido son límites operacionales declarados. |
| RCD-07 | Reserva1MiB dentro de128MiB, diagnóstico limitado con omisiones explícitas | Evita truncamiento silencioso y conserva inventario/control; una caída dura puede dejar PARTIAL_UNSEALED. |
| RCD-08 | Flags parent512/hijo256 comprobados, NODE_OPTIONS vacío; GC no observado | Evita afirmar que heap equivale aRSS o que se registraron eventosGC sin método. |

## Riesgos y presupuesto revisado

Se mantiene el presupuesto inicial porque no hubo medición autorizada de P1–P8 que justifique modificarlo. Lo demostrado es que los mecanismos de parada/cuota/identidad se aplican; **no** que48condiciones completen dentro de10s por worker. Reconstruir prefijos para16operaciones×9llamadas tiene coste importante. Pilot HOLD hasta que el propietario acepte ese riesgo o requiera revisión del presupuesto. Un timeout detiene la sesión, conserva datos y exige revisión antes de otra ejecución.

El operador debe mantener fuentes sin ediciones concurrentes y repetir check al terminar: no hay snapshot atómico del filesystem ni defensa frente al operador que reescribe código. También pendientes: ruido/perturbación por escala, muestras bajo resolución, GC/JIT/caché/carga compartida, RAM nativa y buffers, observaciones efímeras entre muestras/procesos, efectos de sincronía de archivos, caída del host, transporte del expediente a otro almacenamiento, completitud Q3 y coste longitudinal Q4. No se infiere independencia del motor ni autoridad normativa del profiling. Son límites de esta investigación, no reapertura del cierre.

**Recomendación:** entregar protocolo/instrumento/candidato para revisión de GATE-2; no iniciar piloto automáticamente. La [solicitud](PILOT_REQUEST.md) contiene comandos, autoridad requerida, destino, límites y NO-GO. La aprobación del piloto seguirá separada de RC1-E definitiva.

## Preservación publicada

[validation-fixtures.tar.gz](validation-fixtures.tar.gz) conserva paquete final de128samples, testigos, evidencia de stops y candidato; [SHA-256](validation-fixtures.tar.gz.sha256). [REVIEW.json](REVIEW.json) identifica tamaños/hashes, fuente y comandos; [PUBLICATION-SHA256.json](PUBLICATION-SHA256.json) fija los archivos de esta entrega. Los logs b64 conservan salidas completas; leer con `base64 --decode`. Rutas /tmp o /workspace son referencias históricas del entorno, no enlaces públicos. Verificación/recepción externa del archivo RC1 no está establecida.
