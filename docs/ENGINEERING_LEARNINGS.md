# Aprendizajes de ingeniería de WORLD-LAB

Registro **informativo**, sin autoridad para cambiar contratos FROZEN.
Corte original: DOC-01, `main c98243bf0be1b5a26503d78771179e907bfdf480`.
Revisión DOC-02: 2026-11-10 (America/Guayaquil). F3-A/EL-006 integrado en main;
F3-C/EL-007 observado únicamente en `0a6e245`, sin merge. Incorporar aquí su
conclusión documental no incorpora su implementación.
Para alcance main/rama y decisiones vigentes: [entrada de STATUS](IMPLEMENTATION_STATUS.md#doc02-scope)
y [índice de decisiones](IMPLEMENTATION_STATUS.md#decisiones-vigentes).
El detalle vivo, las fuentes y resultados ejecutados están en
[IMPLEMENTATION_STATUS](IMPLEMENTATION_STATUS.md); los informes
[F1-A](F1-A-deterministic-core.md) y [F1-B](F1-B-contracts.md) preservan historia.

Procedencia: VERIFIED = examinado aquí (se distingue lectura/ejecución);
REPORTED = declarado históricamente sin comprobación independiente aquí;
INFERRED = derivado de evidencia identificada; UNKNOWN = evidencia insuficiente.
Son categorías documentales; no reemplazan FROZEN/UNTESTED/VERIFIED/FAIL ni
OPEN-CRITICAL de §0.3. La norma v0.2.5 y su §0.1 prevalecen sobre este registro.

| ID | Observación | Evidencia | Implicación | Regla operacional |
|---|---|---|---|---|
| EL-001 | Código legacy y contratos nuevos coexisten durante migración; no toda incompatibilidad es un defecto del incremento reciente | VERIFIED por lectura/diff: F1-B cambia WorldConfig a hazard_damage/BOUNDED; en aquel corte WORLD conservaba hazard_effect y módulo; F2-D/F2-F corrigieron esos usos locales (TR-003/004); STATUS TR-002–004 y PR #2 | INFERRED: integración de productor/consumidor requiere pruebas distintas de validación aislada | Evaluar contra contrato y alcance implementados; revisar ambos extremos al migrar un campo y conservar como pendiente lo no integrado |
| EL-002 | PASS local no demuestra simulación, replay ni interoperabilidad; los bloqueos limitan conclusiones de regresión | VERIFIED por ejecución DOC-01: F1-A 18/18 y F1-B 12/12; legacy 4/22, 18 errores Cell; por lectura T18 captura su aserción y T20 solo repite runs; STATUS TR-008/009 | INFERRED: igualdad de conteos puede ocultar rutas no alcanzadas; UNKNOWN su comportamiento integrado | Toda aceptación declara qué se ejecutó y qué no; para resolver una divergencia, exigir prueba que alcance su operación, sin cambiar asserts para ocultar fallos |
| EL-003 | Referencias históricas pueden dejar contratos indisponibles para quien retoma el proyecto | VERIFIED por lectura/Git: §11.2/§18/§21/§25/§34 remiten a v0.2.4; antiguos docs/specifications contienen solo LF; STATUS TR-001 y política autorizada F2-D | INFERRED: rellenar orden RNG o bytes ausentes con el legacy puede propagar diferencias deterministas | Identificar cláusula, operación y fuente; no reconstruir contenido ausente. Si la política autorizada permite una decisión compatible, identificarla como ingeniería, con límites y pruebas; detener solo incompatibilidades demostradas |
| EL-004 | Informe histórico, plan y decisión interna tienen autoridad y vigencia distintas | VERIFIED: §0.1 prevalece; F1-A sitúa ContractError en prng.js, F1-B lo mueve a core/contracts.js; §10.3 no explicita todo el dominio de extremos de next_int | INFERRED: repetir una recomendación o descripción antigua puede convertirla indebidamente en requisito; REPORTED: afirmaciones históricas de ejecuciones originales | Etiquetar norma/decisión/hipótesis y su fuente; contrastar informes con código actual; no tratar un plan ni un resultado reportado como nueva autoridad normativa |
| EL-005 | La profundidad útil de verificación depende del modo de fallo, no solo del tamaño del cambio | VERIFIED por lectura y ejecución de tests/f1-a.test.cjs: vector, oráculo BigInt, rechazo forzado y restauración; tests/f1-b.test.cjs: dominios, campos, cardinalidad y bytes binary64 | INFERRED: cada técnica acredita propiedades diferentes; no justifica exigir auditoría global a cada cambio | Elegir pruebas focalizadas para los riesgos afectados, preservar criterios de aceptación aplicables y ampliar solo ante cambios, fallos o incertidumbre relevante |
| EL-006 | El estado PRNG interno y rng_state persistido son dos capturas distintas antes del punto de sync | VERIFIED F3A-31: antes del tick difieren; un fallo tras consumir/reemplazar PRNG restaura ambos valores y el generador original | Restablecer PRNG desde snapshot.rng_state perdería el estado interno previo; afecta a futuras transacciones/replay | Capturar y restaurar cada componente incluido en la atomicidad de su contrato; no sustituir estado PRNG vivo por su último valor persistido |
| EL-007 | Un esquema cerrado puede hacer que un test falle antes de alcanzar el fallo inyectado | VERIFIED por ejecución F3C-11 en rama F3-C, repetida DOC-02: inyección de full_snapshot en el prototipo y contador de alcance comprueban el error de asignación; añadir un método como campo propio de WorldState rompería antes su esquema | Una aserción de error/rollback sola no acredita la fase que pretendía probar | Inyectar fallos sin invalidar precondiciones ajenas y comprobar que se alcanzó la fase, además de comparar el estado anterior/posterior |
| EL-008 | La habilitación operacional puede atravesar archivos congelados aunque no cambie la política científica | VERIFIED F6-E: archive/metrics dependían del dominio de desarrollo; el candidato F6-B se rechaza tras esos dos cambios y el nuevo smoke conserva32 payloads y análisis idénticos. [Evidencia](F6-E-preparation.md) | INFERRED: reutilizar una aprobación antigua por equivalencia pretendida perdería identidad del código ejecutado | Revisar dependencias del manifiesto antes de habilitar ejecución, mantener fuentes científicas intactas cuando sea posible y refijar explícitamente los cambios indispensables; aprobar identidad nueva y comprobar archivos de evidencia reales |
| EL-009 | Restaurar WORLD no basta para reanudar un agente con memoria; replay de acciones y continuación del agente son operaciones distintas | VERIFIED en el caso técnico externo del 2026-11-25 sobre `5d40f08`: snapshot o reconstrucción desde 8 feedback producen 16 acciones nuevas y resultado completo iguales; reset solo diverge en tick 9; replay llama 0 veces al agente. [Informe y expediente íntegro](research/world-lab-resume-viability/REPORT.md) | La continuidad incluye mundo/RNG, memoria, último ActionResult y contexto/secuencia del recorder. La API pública actual reinicializa/reset y no ofrece checkpoint portable; la viabilidad observada es del arnés | Fijar un corte consistente y comparar nuevas decisiones, estados y terminación; distinguir ejecución continua, reanudación y replay. No extrapolar un caso a cualquier agente ni tratar la propuesta de interfaz como implementada |


## Actualización de conocimiento — 2026-11-25

EL-009 incorpora una ejecución técnica ya realizada, no una campaña nueva ni un contrato de reinicio. Las filas EL-001–EL-008 conservan su contenido y su procedencia histórica. La publicación de evidencia no transforma una propuesta de interfaz en una capacidad pública implementada.

Los siguientes conocimientos ya están documentados en expedientes específicos; este índice facilita recuperarlos sin duplicar informes ni convertirlos en normas:

| Expediente | Conocimiento recuperable | Evidencia y límite |
|---|---|---|
| P01 | Comparación pareada de políticas completas, unidades experimentales y separación entre aceptación técnica y resultado científico | [Cierre y conocimiento de P01](p01-cycle-closure/P01_RESEARCH_CYCLE_CLOSURE.md); 32 semillas, no 256 muestras independientes; no causalidad aislada de memoria |
| RC1 | Igualdad semántica no demuestra ausencia de perturbación temporal; preparación, medición, testigos e IPC deben distinguirse | [Calibración y resultados negativos](research/wl-rc1-r1-calibration-results-v1/CALIBRATION_REPORT.md); alcance limitado, NO-GO para 128 procesos y AUD-C01 pendientes |
| TITAN D4 | Una implementación decisional puede ser conductualmente equivalente a una regla directa; el oráculo independiente delimita lo demostrado | [Equivalencia ejecutada](research/titan-mvp-01/EQUIVALENCE_VERIFICATION.md); no valida/refuta teoría general; G2 HOLD |
| Observabilidad y métricas | Qué puede reconstruirse de observaciones/feedback, qué no identifica una trayectoria y cómo el modelo condiciona la métrica | [Caracterización H01–H12](research/WORLD_LAB_EPISTEMOLOGICAL_CHARACTERIZATION_2026-11-21.md); H04 mantiene su estado retrospectivo declarado y contrastado parcialmente, sin elevarlo a reproducción geométrica independiente |
| Marco metodológico | Separación entre disposiciones, derivaciones, recomendaciones y autoridad; no exigir éxito económico para cumplir un procedimiento | [Aplicación corregida](audits/RDL-PB-001_WORLD_LAB_APPLICATION_AND_VERDICT.md) e [inventario de decisiones](program/RDL-PB-001_v0.1_DECISION_DERIVATION_AND_VERDICT.md); adopción no equivale a cumplimiento integral |


## Proyección para orientar pruebas

**INFERRED — hipótesis no validada empíricamente**, plan histórico DOC-01, basado en las dependencias y
fronteras de §4–§5, §7–§15, §20–§26 y §34, junto con TR-001–010:

| Fase provisional | Exposición prevista | Orientación de verificación, no requisitos nuevos |
|---|---|---|
| F2 | Estructuras y migración | Probar productores/consumidores, copias, lifecycle y bordes que se autoricen |
| F3 | Orden temporal, atomicidad y terminación | Observar orden efectivo, reloj y restauración ante fallos según contratos recuperados |
| F4 | Serialización, hashes, eventos y equivalencia | Contrastar bytes/vectores y estados/eventos estructuralmente; hashes solos no bastan |
| F5–F6 | Integración que puede revelar diferencias anteriores | Recorrer rutas hasta entonces bloqueadas; reclasificar evidencia al ejecutarlas |

UNKNOWN: frecuencia, probabilidad y cantidad de defectos futuros. No se asignan
números ni se declara defectuosa ninguna fase por esta proyección. El reparto de
fases es planificación histórica, no secuencia vigente ni autorización. F3-C
ya trabaja parcialmente RECORDER en rama; no se lo renombra F4 ni se infiere el
siguiente incremento a partir de esta proyección.

## Uso y consolidación

Conservar solo aprendizajes capaces de cambiar una decisión futura. Si varios
hallazgos justifican la misma regla, consolidarlos aquí y referenciar la evidencia
en STATUS; no duplicar informes ni razonamientos intermedios. Actualizar una fila
cuando cambie su evidencia o aplicabilidad, sin acumular retrospectivas cronológicas.
Para cerrar incrementos posteriores, informar contratos, comportamiento, evidencia
y divergencias; remitir al estado vivo para pendientes. No añadir aprobaciones
para decisiones internas, auditorías generales repetidas, paneles ni métricas.
