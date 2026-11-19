# WORLD-LAB RC1-R1 — resultado de la calibración instrumental v1

**Ejecución: CALIBRATION_COMPLETE. Integridad, equivalencia y recuperación: PASS. Siguiente puerta R1: NO-GO para autorizar el ejecutor128 actual. RC1-E: HOLD.** La calibración se completó correctamente, pero sus diagnósticos de perturbación y las condiciones pendientes no permiten convertirla en autorización del piloto.

Fecha operacional:18 de noviembre de2026, America/Guayaquil. Campaña `WL-RC1-R1-CALIBRATION-1`. Identidad aprobada y ejecutada `6763348852b6b4a133a3e6326e8e774d25b6244703457282035d41601b66fa90`. Checkout ejecutado `b3c060ee3e404eb7c560a629e91505c1f831b8bb`, mismo contenido que main posterior a PR53 `c988c2b` usado para esta publicación. No se modificaron las fuentes congeladas.

## Autorización, orden y cierre

El propietario aprobó expresamente una única ejecución24, con30s/worker,15min globales, RSS agregado muestreado1GiB y archivo64MiB, sin reintentos ni ampliación. Se conservan [registro de autorización](operations/OWNER_START_APPROVAL.md), [intención única y comando](operations/launch-intent.json), [preflight revalidado](operations/preflight.stdout.json), [inicio](operations/start.json), [salida](operations/exit.json) y [resultado completo del controlador](operations/controller.stdout.json).

Firma Ed25519 y pin DER-SPKI `3e65dff25d532c34504a2ddd317f85d8f66b0ba066277ffe634463380f521b5e` verificados inmediatamente antes del inicio; el propio comando run-calibration volvió a validar firma, identidad, destino y recursos. Destino exclusivo: `/workspace/shared/world-lab/wl-rc1/calibration-r1-v1`. Inicio19:32:55.359527−05:00, salida19:34:02.167659−05:00, código0, stderr vacío. **Una invocación, cero retries/resume.**

| Criterio | Resultado observado |
|---|---:|
| Condiciones previstas/iniciadas/completas |24/24/24 |
| Fallidas/censuradas/omitidas |0/0/0 |
| Muestras previstas/archivadas |216/216 |
| Testigos completos distintos |6 |
| Journals SYNC completos / etapas abiertas |12/0 |
| Errores operacionales / stops guardian |0/0 |
| Flags de resolución api<10×mediana reloj |0 |
| Archivos originales/restaurados idénticos |50/50 |
| Mismatches estructurales/WLS1 |0 |

Plan/orden comprobados contra las24entradas congeladas, sin duplicados/sustituciones: P1/tick, P3/observation, P7/record_append; dos bloques22001/22002; MINIMAL/DETAILED y SYNC/OFF. Orden inverso de cuatro tratamientos en el segundo bloque y finalización de la celda barata antes de la siguiente.9llamadas por proceso:1primera+3warm-up+5warm. No se ejecutaron perfiles/operaciones adicionales, el piloto128 o RC1-E.

## Integridad, estructuras y recuperación

[Verificación original](verify-original.json) y [restaurada](verify-restored.json): VERIFIED/COMPLETE,216muestras, cero errores. Los50archivos,704905bytes, coinciden byte a byte en la copia nueva; [inventario y hashes](source-integrity.json). El paquete exportado fue extraído en un tercer directorio nuevo y sus50originales volvieron a coincidir; [verificación del export restaurado](verify-export-restored.json).

Se decodificaron y compararon **estructuras completas**, no solo hashes: before/after, estados, resultados, eventos, reloj, RNG y arrays de bytes WORLD/FULL.192comparaciones entre llamadas dentro de cada worker y162entre tratamientos del mismo bloque/celda;354comparaciones de testigos completos, que incluyen1416comparaciones de sus cuatro arrays WLS1. Todas coinciden. Una [comprobación explícita adicional](deep-structural-verification.json), con [código de lectura](verify_structures.cjs), descomprime/decodifica de nuevo cada muestra, exige objetos distintos y compara los bytes: no depende del atajo de identidad de objetos en una caché. El archivo deduplica seis payloads por SHA; eso no equivale a un almacenamiento independiente de cada payload transmitido. Las semillas difieren entre bloques: no se exige igualdad de sus mundos. Estos conteos son comprobaciones dependientes, no354réplicas estadísticas independientes.

El análisis de datos originales y restaurados produjo siete archivos de resultados byte-idénticos; [reproducibilidad](analysis-reproducibility.json). Una implementación Python separada recalculó24balances y24contrastes predefinidos desde los JSONL, coincidiendo con los estimadores JS: [comprobación aritmética](independent-arithmetic-check.json), [reproducción](independent-reproduced.json). Es independencia de implementación aritmética sobre los mismos datos, no medición independiente ni interoperabilidad externa.

La verificación posterior no ejecutó nuevos WORLD, workers o replay. Comparó las salidas experimentales conservadas y recalculó sus métricas. La aceptación de integridad no establece conformidad normativa global.

## Costes observados

Tiempo del proceso controlador: **66,809692s**. Suma de ventanas de workers: **62,860114s**; diferencia3,949578s de arranque/coordinación/finalización y otros trabajos fuera de esas ventanas, sin asignación causal más fina. Latencia por worker: mínimo0,833341s, mediana1,488228s, máximo**5,691394s**, en P7/record_append, bloque2, DETAILED/OFF.

Los porcentajes siguientes usan como denominador la suma de wall de workers62,860114s, no el tiempo del controlador. API está contenida en EXECUTE; se descuenta antes de sumar. El residual se conserva sin atribuirlo a una causa.

| Ventana agregada | Segundos | % del wall de workers |
|---|---:|---:|
| Preparación |30,938076 |49,22 |
| API |1,560560 |2,48 |
| EXECUTE menos API |0,024123 |0,04 |
| Testigos, encode, JSON, hash y gzip |4,251983 |6,76 |
| Callbacks IPC por llamada |0,040649 |0,06 |
| Trabajo de proceso: identidad/carga/calibración/header/envíos/final_identity |22,178534 |35,28 |
| Escrituras/fsync journal completadas |1,520593 |2,42 |
| Residual no atribuido |2,345595 |3,73 |

IDENTITY suma7,487281s; FINAL_IDENTITY7,822147s; HEADER_SEND6,650617s. **HEADER_SEND incluye construir runtime/hash del binario Node y enviar la cabecera**, no es una medida pura del transporte IPC. El callback tampoco acredita persistencia durable en el padre. El gate de calibración inspecciona más archivos que R1; estos costes de arranque no predicen exactamente los del ejecutor128. El porcentaje journal.io tampoco mide todo su efecto causal: excluye close y no captura efectos sobre runtime/OS.

| Celda,8workers cada una | Rango wall/worker s | Preparación agregada s | API agregada s | Preparación / wall celda |
|---|---:|---:|---:|---:|
| P1/tick |0,833–1,773 |0,232469 |0,270811 |2,60% |
| P3/observation |1,323–1,873 |2,183970 |0,164666 |17,92% |
| P7/record_append |4,728–5,691 |28,521637 |1,125083 |68,34% |

Se conserva cada primera/warm-up/warm y su mediana/min/max por fase en [processes.json](data/processes.json), y las216filas en [samples.csv](samples.csv). Los JSONL originales contienen los demás contadores y diagnósticos. La copia CSV publicada usa LF para Git; el CSV CRLF original permanece intacto en el export y sus216filas coinciden ([registro](CSV_PUBLICATION.json)). Estas APIs difieren: la tabla no estima una ley de crecimiento espacial/temporal ni demuestra causalidad del horizonte.

## Perturbación: resultado negativo para la siguiente puerta

Se aplicaron las fórmulas prerregistradas, sin excluir lentos, cambiar normalización ni suprimir signos. Solo2bloques por comparación; cinco warm son submedidas dependientes. No IC/pvalor ni conclusión poblacional. La alarma |diferencia|>10% es un diagnóstico de ingeniería, no una hipótesis científica confirmada.

Contraste journal, porcentajes `100×(SYNC/OFF−1)`. Columnas B1/B2 conservan el orden invertido:

| Celda/modalidad | Wall B1% | Wall B2% | Mediana warm wrapper B1% | Mediana warm wrapper B2% |
|---|---:|---:|---:|---:|
| P1 MINIMAL |−29,579 |−7,582 |−14,444 |17,537 |
| P1 DETAILED |16,849 |39,684 |14,385 |−1,972 |
| P3 MINIMAL |0,961 |−4,433 |−37,734 |24,238 |
| P3 DETAILED |−0,193 |6,484 |26,386 |18,793 |
| P7 MINIMAL |−2,226 |18,356 |−3,130 |0,652 |
| P7 DETAILED |−6,453 |−8,782 |−1,966 |21,410 |

**4/12contrastes primarios de wall** y **8/12secundarios warm** superan10%;10/12superan al menos uno. No son diez efectos positivos: hay cambios de signo. OFF conserva cronómetros, testigos, archivo e IPC; no es una ejecución sin instrumento. El contraste no identifica el coste físico puro de fsync. [Contrastes completos](data/journal-perturbation.json) y [medianas/rangos de ambos bloques](data/balanced-journal.json).

Contraste de modalidad, `100×(mediana_DETAILED/mediana_MINIMAL−1)`:

| Celda/journal | Wrapper B1% | Wrapper B2% | API B1% | API B2% |
|---|---:|---:|---:|---:|
| P1 OFF |−11,507 |20,006 |−16,389 |4,034 |
| P1 SYNC |18,312 |0,087 |11,568 |−3,565 |
| P3 OFF |−33,357 |25,807 |−36,857 |20,801 |
| P3 SYNC |35,270 |20,293 |30,868 |16,846 |
| P7 OFF |5,001 |−9,328 |4,197 |−10,484 |
| P7 SYNC |6,262 |9,372 |5,575 |8,792 |

7/12contrastes wrapper y7/12API superan10%. [Resultados completos](data/modality.json) y [resumen de bloques](data/balanced-modality.json). Las cancelaciones no borran alarmas de bloques individuales. Orden, calentamiento, preparación, GC y scheduling son explicaciones posibles; este diseño no identifica sus contribuciones causales. No se declara inocuo el journal ni se atribuyen todos los cambios a su persistencia.

## Presupuesto y cobertura

| Magnitud | Observado | Cap autorizado | Margen prerregistrado | Resultado |
|---|---:|---:|---:|---|
| Máximo worker |5,691394s |30s |≤15s |PASS |
| Controlador completo |66,809692s |900s |Sin stop |PASS |
| Pico RSS agregado muestreado |520650752bytes=496,53125MiB |1GiB |≤0,8GiB |PASS |
| Archivo de campaña |704905bytes≈0,67225MiB |64MiB |≤32MiB |PASS |

No se observó primer límite de presupuesto: no hubo stop, timeout o censura. No debe inventarse una localización de interrupción inexistente. SYNC conserva12journals completos; OFF carece de checkpoint durable por diseño. El RSS es muestreado25ms, no un cap instantáneo. El cierre terminal tiene el límite de host/filesystem ya documentado.

**Recomendación de recursos:** los caps actuales bastaron en esta ejecución y las tres celdas cumplen sus márgenes; no hay fundamento para aumentarlos automáticamente. Conservar30s/15min/1GiB/64MiB como límites de referencia del diagnóstico, sin convertir el máximo observado en un límite universal ni reducir caps a posteriori. No se propone una nueva ejecución aquí.

El resultado **no valida30s/worker ni75min para el piloto128**. Solo se cubrieron3/32celdas perfil/operación: P1/tick, P3/observation, P7/record_append; no replay empírico, radio máximo P6, aspecto P8 ni otras combinaciones. Multiplicar tiempos observados por128 sería un escenario aritmético, no una garantía ni presupuesto empíricamente validado.

## Dictamen y condiciones pendientes

1. **CALIBRATION_COMPLETE / integridad PASS:**24condiciones y216muestras completas, equivalencia/recuperación sin discrepancias. No se condicionó el éxito operativo a diferencias favorables de tiempo.
2. **NO-GO para la siguiente puerta que autorizaría el ejecutor128 actual:** perturbación diagnóstica material requiere revisión según protocolo; AUD-C01 sigue en ese ejecutor congelado, y la cobertura deja incertidumbre relevante. La corrección del controlador de calibración no se traslada retrospectivamente al candidato e42a.
3. Antes de otra autorización: revisar la variabilidad y sus ventanas sin atribuciones causales falsas; corregir/verificar AUD-C01 en una revisión explícita del128, con nueva identidad; justificar el alcance y presupuesto que todavía no cubren estas celdas. No implica autorización para implementar o ejecutar otra campaña.

Piloto128 y RC1-E continúan HOLD. WORLD, Recorder, WLS1, contratos, P01 y evidencias anteriores inalterados. F6-N, conformidad global e interoperabilidad independiente no establecidos. No se repitió v1 ni se modificaron parámetros después de observar datos.

## Expediente y recuperación

[Paquete completo](WL-RC1-R1-calibration-v1-evidence.tar.gz):239079bytes, SHA-256 `e3c588f8cb1f66081283b13df7a198f5ee6e7429f814075d2241232841a4c8b3`. [Checksum](WL-RC1-R1-calibration-v1-evidence.tar.gz.sha256), [export](export.json), [instrucciones](RECOVERY.md). Incluye los50originales, firma/clave pública/recibo, operaciones y análisis, sin claves privadas. Se comprobó recepción/restauración local del export, **no recepción externa independiente**.

Las rutas /workspace y /tmp registradas son referencias históricas, no enlaces públicos. La publicación conserva informes y protocolos previos intactos; este informe registra la orden posterior de ejecución sin reescribir el encabezado histórico de preparación. check-after.json conserva calibration_started=false porque esa invocación solo comprueba identidad: no niega la ejecución histórica documentada ni habilita repetirla. El trabajo termina con este expediente, sin iniciar una nueva campaña.
