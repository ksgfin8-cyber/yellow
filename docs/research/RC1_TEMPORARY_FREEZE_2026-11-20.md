# WORLD-LAB — RC1: Acta de congelación temporal y transferencia de investigación

**Estado de esta acta:** `TEMPORARY_FREEZE_RECORDED` al integrarse en `main`; hasta entonces, **propuesta documental en rama**.  
**Fecha de corte:** 2026-11-20 (America/Guayaquil).  
**Autoridad:** decisión expresa del propietario de pausar RC1 y priorizar la siguiente investigación, sin declarar terminadas fases pendientes.  
**Base exacta de evidencia:** `main@182577d84c0af13d1c3b473aa0816f0c68fb86af` (PR #54).  
**Naturaleza:** registro de gestión y estado de evidencia; no es nueva prueba, ejecución, ratificación normativa, ni modificación de hipótesis o datos.  
**Política:** conservar resultados positivos y negativos, reproducibilidad e identidades; no editar originales.

## 1. Alcance y decisión

Se **congela temporalmente la ejecución y ampliación de la investigación WORLD-LAB Research Characterization 1 (RC1)** en el punto alcanzado tras la calibración R1. La construcción operacional de WORLD-LAB ya había sido cerrada en su alcance aprobado, pero esta acta **no congela todo el laboratorio** ni impide desarrollar, con protocolo y autorización independientes, investigaciones posteriores como un agente TITAN-MVP.

**No** se declara `RC1_COMPLETE`, `RC1-E_ACCEPTED`, `RC1-F_COMPLETE`, `RC1-G_COMPLETE` ni se reetiqueta una calibración como una campaña científica definitiva.

**Decisión:** `RC1_TEMPORARILY_FROZEN / SCIENTIFIC_CHARACTERIZATION_INCOMPLETE`. No se autoriza ninguna nueva ejecución por el mero hecho de registrar esta acta. La reapertura requiere una orden explícita, revisión de identidad/protocolo y resolución de los bloqueantes que corresponda.

## 2. Estado de fases respecto al plan A–G

| Fase | Producto actual | Estado de corte | No acreditado |
|---|---|---|---|
| RC1-A Inventario | Baseline, Q1–Q4, alcance y exclusiones, PR #48 | `DELIVERED_STATIC` | Respuestas experimentales completas |
| RC1-B Matemática | Modelos y mecanismos de complejidad derivados de código, PR #48 | `DELIVERED_STATIC` | Confirmación empírica de escalado |
| RC1-C Protocolo | Protocolo C/D inicial, revisión R1 y calibración, PR #49, #52, #53 | `IMPLEMENTED_REVIEW_REQUIRED` | Protocolo definitivo aceptado para campañas completas |
| RC1-D Instrumentación | Harness, tests focalizados, piloto parcial, calibración completa | `INSTRUMENTED_NOT_RELEASED_FOR_128` | Perturbación resuelta y controlador128 aceptable |
| RC1-E Campaña de caracterización | No ejecutada como campaña definitiva | `HOLD_NOT_COMPLETED` | Datos de caracterización Q1–Q3 completos |
| RC1-F Análisis científico | Resultados parciales metodológicos y análisis de calibración | `NOT_COMPLETED` | Contraste integral de modelos y evaluación científica final |
| RC1-G Evaluación estratégica | Riesgos y recomendaciones provisionales | `NOT_COMPLETED` | Dictamen final de optimización, capacidad y backlog validado |

Las aceptaciones históricas de P01 pertenecen a **otro ciclo**: no constituyen la ejecución de RC1-E.

## 3. Preguntas de investigación

- **Q1 WORLD/Observation:** existen cotas y mecanismos estáticos; no se validó la ley de escalado experimentalmente en la matriz propuesta.
- **Q2 Recorder/replay:** existen análisis estáticos de historial, copia, verificación y replay; no existe campaña definitiva suficiente para sus curvas de coste.
- **Q3 Coste de campaña:** la calibración revela descomposición temporal en tres celdas, pero no caracteriza todas las operaciones, perfiles ni atribuye causalidad completa.
- **Q4 Coste de adaptación:** **NOT_MEASURED**. No se reconstruyen horas históricas. Una futura integración realmente distinta, por ejemplo TITAN-MVP, puede aportar evidencia prospectiva siempre que se registre trabajo y alcance desde el inicio; sus resultados no se incorporan retrospectivamente como RC1-E.

## 4. Evidencia preservada y afirmaciones admitidas

### 4.1 Construcción operacional del laboratorio

El expediente `docs/CONSTRUCTION_CLOSURE.md` registra `CONSTRUCTION_CLOSED_WITHIN_APPROVED_OPERATIONAL_SCOPE`, con funcionamiento demostrado dentro de P01, modo autónomo y demostración web. **No** acredita conformidad normativa global, interoperabilidad independiente o generalidad de agentes. F6-N, G00 y 289 casos históricos BLOCKED siguen pendientes; BLOCKED no equivale automáticamente a FAIL.

### 4.2 Investigación P01, distinta de RC1

`docs/p01-cycle-closure/P01_RESEARCH_CYCLE_CLOSURE.md`: 256 episodios finales completos y reproducidos dentro del motor; en 32 semillas fijas, FrontierMemory-v1 superó a Random en consumos de recursos (diferencia media 11,125, 32 victorias). Es evidencia **limitada a P01**, no una superioridad universal, replicación en motor independiente ni validación de TITAN. La recepción de copia externa se verificó en el alcance documentado de copia local Windows; OneDrive no está verificado.

### 4.3 RC1-A/B: deducciones estáticas

`docs/research/wl-rc1-ab/REPORT.md`, `COMPLEXITY_MODELS.md` y `function-models.json` identifican posibles recorridos, copias, acumulación de historia y costos de verificación. Las cotas dependen de sus supuestos; no son mediciones ni demuestran cuál cuello de botella domina a escala.

### 4.4 Primer piloto RC1: resultado parcial

`docs/research/wl-rc1-pilot-v1/PILOT_REPORT.md` documenta `PILOT_PARTIAL`: 2/48 condiciones completas, una censurada y 45 no iniciadas; sus datos se conservan. No constituye caracterización completa ni se descartan sus resultados negativos.

### 4.5 Calibración instrumental R1: éxito operacional y NO-GO metodológico

`docs/research/wl-rc1-r1-calibration-results-v1/CALIBRATION_REPORT.md` registra una única ejecución autorizada: 24/24 workers, 216/216 muestras, 0 fallos y 0 discrepancias estructurales/WLS1, 50/50 archivos restaurados idénticos. Duración controlador 66,809692 s; máximo worker 5,691394 s; RSS agregado máximo **muestreado** 496,53125 MiB; archivo 704905 bytes. Los márgenes prefijados de recursos de esta calibración pasaron.

El tiempo agregado de workers fue 62,860114 s: preparación 49,22 %, ventanas de API 2,48 %, trabajo de proceso 35,28 %; los porcentajes no identifican por sí solos un sobrecoste causal universal ni caracterizan cada API individual.

Diagnósticos: 4/12 contrastes primarios SYNC/OFF de wall superaron 10 %; 8/12 secundarios de wrapper SYNC/OFF; 7/12 de modalidad sobre wrapper. Efectos de ambos signos y solo dos bloques por comparación. No se establecen estimadores poblacionales ni causalidad aislada.

Se cubrieron solo tres celdas perfil/operación: P1/tick, P3/observation y P7/record_append, de 32 contempladas en R1. Los límites de la calibración no validan automáticamente presupuesto ni seguridad del piloto128.

**Dictamen vigente:** `CALIBRATION_COMPLETE` en el alcance medido; `NO_GO` para iniciar el ejecutor128 actual; RC1-E `HOLD`. AUD-C01 (completitud comprobada demasiado tarde en el controlador128 original) queda pendiente en ese ejecutor. La protección del controlador de calibración no implica corrección retrospectiva de la variante128.

## 5. Afirmaciones expresamente no autorizadas por esta evidencia

No declarar: validación global de especificación WORLD-LAB; interoperabilidad independiente; capacidad de estudiar cualquier algoritmo sin adaptación; compatibilidad o validez científica de TITAN; superioridad general de FrontierMemory; complejidades asintóticas confirmadas por benchmarks; estabilidad instrumental del piloto128; productividad industrial compuesta; reducción demostrada del costo de integrar investigaciones; respaldo durable independiente más allá de las recepciones comprobadas.

No agregar conteos de pruebas históricas superpuestas como muestras científicas independientes. No tratar las verificaciones de integridad o réplicas deterministas como réplicas estadísticamente independientes.

## 6. Conservación, fronteras y reapertura

1. Conservar el SHA base de esta acta, las fuentes originales, hashes, informes, protocolos, resultados parciales, calibración y sus procedimientos de recuperación. No sobrescribir ni borrar evidencia.
2. Preservar los candidatos y recibos firmados asociados a sus campañas; no trasladar firmas, permisos ni freeze IDs a nuevas campañas.
3. Mantener `RC1-E/F/G` sin cerrar, `AUD-C01` pendiente y piloto128 en `HOLD`.
4. Mantener separados tres frentes: **conformidad normativa WORLD-LAB**, **caracterización RC1** e **investigación de un nuevo sujeto TITAN**.
5. Cualquier nueva campaña requiere protocolo, identidad, presupuesto y autorización propios. Esta congelación no permite ejecutar automáticamente TITAN, RC1 o P01.
6. Para reabrir RC1: auditar la versión exacta del ejecutor128; corregir/probar AUD-C01 con nueva identidad; revisar perturbación y cobertura; seleccionar la mínima prueba adicional necesaria; solicitar autorización antes de ejecutar. No hay obligación de reanudar RC1 antes de preparar TITAN.
7. Si se inicia TITAN-MVP, registrar prospectivamente el trabajo de integración para investigar Q4; no convertir estimaciones retrospectivas no observadas en datos.

## 7. Dictamen de transferencia

Existe evidencia suficiente para considerar **viable preparar** una nueva investigación con agente intercambiable mediante el contrato existente `run_experiment(config, agent_factory)`, `reset()`, `step(feedback)`. P01 documenta integración de FrontierMemory mediante fábrica externa y ejecución/replay en su dominio. Esto **justifica una prueba mínima de integración y comportamiento de TITAN**, no predice que TITAN funcione, rinda bien o sea conforme a su teoría.

**Autorización concedida por esta decisión:** preparar documentación, código aislado y pruebas de integración para una nueva investigación con puertas propias. **No concedida:** ejecutar campañas científicas sin aprobación posterior, cambiar WORLD/Recorder/WLS1 o declarar finalizado RC1.

## 8. Índice de procedencia

- `docs/CONSTRUCTION_CLOSURE.md` y `docs/IMPLEMENTATION_STATUS.md`.
- `docs/p01-cycle-closure/P01_RESEARCH_CYCLE_CLOSURE.md`.
- `docs/research/wl-rc1-ab/REPORT.md`, `COMPLEXITY_MODELS.md`, `QUESTIONS_AND_EVIDENCE.md`.
- `docs/research/wl-rc1-cd/PROTOCOL.md`, `VALIDATION_REPORT.md`.
- `docs/research/wl-rc1-pilot-v1/PILOT_REPORT.md`.
- `docs/research/wl-rc1-r1/REPORT.md`.
- `docs/research/wl-rc1-r1-calibration-results-v1/CALIBRATION_REPORT.md`, sus datos y export.

Esta acta es un **punto de conservación y transferencia**, no una declaración de éxito científico integral.
