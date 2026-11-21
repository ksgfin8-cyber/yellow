# RDL-PB-001 v0.1 — Derivación normativa y dictamen de decisiones

**Fecha de registro:** 2026-11-21 (America/Guayaquil).

**Naturaleza:** informe analítico derivado; no es una norma, modificación del Playbook, autorización de ejecución ni aprobación de las recomendaciones.

**Procedencia:** informe entregado en el chat en respuesta a la «ORDEN DEFINITIVA — Derivación normativa y dictamen de decisiones desde RDL-PB-001 v0.1». Su registro en el repositorio fue solicitado posteriormente por el propietario. Se conserva su contenido técnico y se adapta la navegación a la ubicación documental.

**Fuente normativa exclusiva:** [RDL-PB-001 v0.1 original](RDL-PB-001_v0.1_original_propuesta.md). Los expedientes WORLD-LAB/P01/RC1/TITAN se utilizan únicamente como evidencia factual.

**Autoridad de aplicación:** [registro de adopción normativa](RDL-PB-001_v0.1_AUTHORITY_AND_ADOPTION.md). La adopción está vigente; el cumplimiento y las capacidades requieren evidencia propia.

**Base documental examinada:** `main@07247969cf417783da5de33b7815365e377924f5`, posterior a PR #63.

**SHA-256 del original:** `84019bd0c70206d9f90ec219d4fefbc1eb58041ba1762818687ae8a983317436`.

**Estado de las recomendaciones:** propuestas para decisión del propietario; no ejecutadas por este informe. El registro documental no reabre investigaciones ni modifica decisiones históricas.

El Playbook permite fundamentar decisiones de continuidad, suspensión, corrección, transferencia, inversión y cierre. No concede por sí mismo autoridad para ejecutarlas. Aplicado a la evidencia disponible, respalda conservar WORLD-LAB en su alcance operacional aprobado, mantener el cierre P01 y preservar los HOLD de RC1 y TITAN G2. No respalda declarar conformidad global, productividad económica demostrada ni validación general de TITAN.

Se examinaron las **23 secciones** del original. El análisis fue de solo lectura: no se modificaron archivos, ejecutaron experimentos ni aplicaron recomendaciones durante su elaboración. Esta publicación documental posterior no altera ese alcance.

## A. Mapa normativo de decisiones

Los identificadores siguientes son referencias de este informe, no categorías añadidas al Playbook.

Se distingue:

- **Expresa:** la disposición aparece directamente en el original.
- **Derivada:** la decisión resulta de aplicar disposiciones identificadas; se indica la inferencia.
- **Procedimental:** establece cómo decidir o qué límites respetar, sin crear una decisión autónoma.
- **Recomendación analítica:** aplicación propuesta a la evidencia disponible; no equivale a aprobación.

Para identificar las restricciones de autoridad en las tablas se utilizan tres referencias analíticas:

| Referencia | Límite de autoridad |
|---|---|
| **I — Investigación/instrumento** | Actuación dentro de un objeto, procedimiento y recursos ya autorizados. El Playbook no identifica quién tiene esa delegación en cada organización. |
| **N — Norma/contrato** | Interpretación, modificación o desviación que debe resolver la autoridad del documento técnico o normativo correspondiente. No puede aprobarla una evaluación por conveniencia. |
| **G — Gobierno/recursos** | Decisiones que afectan prioridades, programas, cartera, financiación o permisos de ejecución. Requieren la autoridad competente externa a este análisis. |

Estas referencias no crean cargos ni un organigrama.

### A.1. Las diez categorías expresas de §13.1

Se conservan sus nombres y significados originales. Las condiciones y las incertidumbres de la última columna explican su aplicación; no añaden umbrales universales.

| ID y categoría | Significado original | Condición, evidencia necesaria, incertidumbre y autoridad |
|---|---|---|
| **E01 — Continuar** | La evidencia justifica invertir en la siguiente etapa. | Requiere evidencia pertinente para esa etapa y una razón para la inversión adicional. Incertidumbre: información marginal esperada y coste. **I/G**. |
| **E02 — Corregir** | Se identificó un defecto modificable y se autoriza una nueva versión. | Requiere defecto localizado y una corrección evaluable. Incertidumbre: efectos secundarios y garantías que deben revalidarse. **I**, y **N** si afecta contratos o especificaciones. |
| **E03 — Ampliar investigación** | Existe una incertidumbre relevante que requiere nuevas pruebas. | Requiere una pregunta pendiente que pueda cambiar una decisión y pruebas capaces de discriminarla. Incertidumbre: suficiencia del método y presupuesto. **I/G**. |
| **E04 — Validar** | Se autoriza comprobar una propiedad o requisito mediante un procedimiento definido. | Requiere propiedad, referencia y procedimiento identificados. Puede producir cumplimiento verificado, incumplimiento o evidencia insuficiente. Incertidumbre: cobertura y calidad del instrumento. **I/N**. |
| **E05 — Transferir** | Se autoriza aplicar el conocimiento o activo a otro contexto, sujeto a las verificaciones requeridas. | Requiere comparación de contextos y verificaciones de §12. Puede resultar transferencia propuesta, ensayada, verificada o fallida. Incertidumbre: supuestos que dejan de cumplirse. **I/G**. |
| **E06 — Archivar por prioridad** | El trabajo se suspende por asignación de recursos, sin declarar refutada su hipótesis técnica. | Requiere una razón de priorización documentada. Incertidumbre: valor futuro y condiciones de reapertura. **G**, o delegación expresa dentro de una investigación. |
| **E07 — Suspender por limitación instrumental** | La capacidad de evaluación disponible no permite una conclusión suficiente. | Requiere identificar la limitación que impide concluir. No implica que la tecnología sea falsa o inútil. Incertidumbre: posibilidad y coste de resolver la limitación. **I/G**. |
| **E08 — Descartar por incumplimiento** | El candidato no satisface un requisito obligatorio demostrado y aplicable. | Requiere requisito obligatorio, aplicabilidad y evidencia de incumplimiento. Una fuente ausente o una prueba bloqueada no bastan. Incertidumbre: interpretación o calidad de la prueba. **I/N**. |
| **E09 — Descartar por evidencia contraria** | La evidencia contradice una hipótesis o ventaja que justificaba el desarrollo. | Requiere contradicción pertinente y un instrumento adecuado. Debe delimitarse qué hipótesis se descarta. Incertidumbre: explicaciones alternativas y alcance. **I/G**. |
| **E10 — Cerrar como inconcluso** | La investigación no resuelve la pregunta dentro del alcance y presupuesto aprobados. | Requiere documentar pregunta, resultados, límites y evidencia faltante. No equivale a confirmación ni refutación. Incertidumbre: qué información adicional cambiaría la decisión. **I/G**. |

**Fundamento común:** §13.1. Sus condiciones se complementan con §§6, 8, 10–12 y 13.3. Ninguna categoría autoriza automáticamente presupuesto, cambios normativos o una campaña.

### A.2. Decisiones y procedimientos distribuidos por el resto del Playbook

En cada fila se indican formulación, categoría aplicable, fuente, fundamento, condiciones, evidencia, resultados posibles, incertidumbres y límite de autoridad.

| ID y formulación; categoría relacionada | Fuente y fundamento | Condiciones y evidencia necesaria | Resultados posibles e incertidumbres | Autoridad |
|---|---|---|---|---|
| **D01 — Priorizar incertidumbres que cambien decisiones**, en lugar de maximizar ejecuciones o documentos. Relacionada con E01/E03/E06. | §§1.2–1.3, 6.1, 13.3 y 23. **Derivada:** si la finalidad es conocimiento útil por recursos, la prioridad debe depender de su valor decisional. | Preguntas identificadas, decisión afectada, evidencia existente y costes relevantes. | Priorizar, diferir o reformular. Incertidumbre: valor de información todavía no obtenido. | **I/G** |
| **D02 — Escalar contradicciones y preservar jerarquías.** No es una categoría adicional de cierre. | §§2.1–2.4. **Expresa/procedimental:** registrar conflicto y solicitar resolución; no corregir silenciosamente especificaciones. | Fuentes identificadas, cláusulas en conflicto y consecuencias observables. | Resolución competente, desviación autorizada o asunto pendiente. Incertidumbre: autoridad o fuente no disponible. | **N/G** |
| **D03 — Elegir profundidad y recorrido del proceso**, permitiendo descarte temprano o retorno a caracterización. E02/E08/E09/E10 cuando corresponda. | §§2.2 y 4.1–4.3. **Expresa/procedimental:** proporcionalidad, flujo no rígido, separación de responsabilidades y declaración de instrumentación invasiva. | Riesgo, coste del error, incertidumbre y efecto de la instrumentación. | Caracterizar más, avanzar, detener o declarar una excepción experimental. Incertidumbre: perturbación introducida. | **I**; **N** ante conflicto técnico |
| **D04 — Admitir y caracterizar un candidato con información explícita.** Relacionada con E01/E02/E04. | §§5.1–5.4. **Expresa:** registro de admisión; capacidades recomendadas; separación entre diseño, implementación y observación. | Identidad, origen, implementación, dependencias, restricciones y desconocidos. La información ausente se registra, no se inventa. | Caracterización suficiente, corrección, descarte justificado o investigación adicional. Incertidumbre: propiedades no caracterizadas. | **I** |
| **D05 — Formular o reformular preguntas y criterios de decisión.** E03/E04 o reformulación previa. | §§6.1–6.3. **Expresa/procedimental:** pregunta y decisión necesarias; descomposición y criterios anticipados son recomendaciones con su fuerza normativa propia. | Objeto, hipótesis, conocimiento inicial, relevancia, presupuesto y cierre. | Pregunta investigable, reformulación o diferimiento de gasto significativo. Incertidumbre: identificabilidad y sensibilidad. | **I/G** |
| **D06 — Seleccionar el instrumento de menor coste que resuelva adecuadamente la pregunta.** Relacionada con E04/E07. | §§7.1–7.2. **Expresa:** menor coste entre instrumentos adecuados, no simplemente la prueba más barata. | Alternativas pertinentes; preparación, ejecución, análisis, discriminación, validez y limitaciones. | Selección justificada o reconocimiento de insuficiencia instrumental. Incertidumbre: costes y sensibilidad estimados. | **I** |
| **D07 — Reutilizar un protocolo compatible o versionar su adaptación.** E02/E05. | §§7.3–7.4. **Expresa:** reutilizar cuando existe compatibilidad; identificar cambios y garantías a revalidar. La ficha de compatibilidad es recomendada. | Propósito, precondiciones, supuestos, métricas, elementos conservados y diferencias. | Reutilización, adaptación versionada o incompatibilidad. Incertidumbre: garantías que no sobreviven al cambio. | **I/N** |
| **D08 — Fijar diseño, controles y recursos antes de ejecutar; justificar ampliaciones.** E01/E03/E04. | §§8.1–8.4 y 13.3. **Expresa/procedimental.** | Variables, casos, réplicas, aleatoriedad, métricas, límites, criterios y datos a conservar. Presupuesto explícito cuando el coste es material. | Diseño apto, revisión, límite de ejecución o ampliación justificada. Incertidumbre: variabilidad y factores de confusión. | **I/G** |
| **D09 — Determinar registro e identidad suficientes y precisar la reproducibilidad comprobada.** E04. | §§9.1–9.4. **Expresa/procedimental:** procedencia recuperable, omisiones justificadas y niveles diferenciados. | Versiones, configuración, entorno, datos, errores y registros necesarios para la pregunta. | Evidencia trazable o insuficiente; repetibilidad, trayectoria, análisis, reproducción experimental o independiente, según lo comprobado. Incertidumbre: datos omitidos y dependencia común. | **I/N** |
| **D10 — Investigar discrepancias y tratar lo inconcluso sin atribución causal prematura.** E02/E03/E07/E10. | §§10.1–10.4. **Expresa/procedimental;** la secuencia de §10.2 es recomendada. | Datos íntegros, versiones, primera divergencia, alternativas y controles relevantes. | Error localizado, explicación respaldada, nueva prueba o inconclusión. Incertidumbre: una divergencia observable puede no ser la causa. | **I** |
| **D11 — Respaldar, delimitar, revisar o rechazar cada afirmación por separado.** E04/E08/E09/E10 según el caso. | §§11.1–11.4 y 12.1. **Expresa:** evidencia por afirmación, dimensiones separadas y dominio explícito. | Evidencia favorable, contraria y ambigua; calidad, independencia y suficiencia. | Afirmación respaldada en dominio, contradicha, insuficiente o no evaluable. Incertidumbre: extrapolaciones y errores compartidos. | **I/N** |
| **D12 — Evaluar transferencia y distinguir su estado.** E05. | §§12.2–12.3. **Expresa.** | Semejanzas, diferencias, supuestos, dependencias, métricas y verificaciones mínimas del contexto nuevo. | Transferencia propuesta, ensayada, verificada o fallida. Incertidumbre: validez fuera del contexto original. | **I/G** |
| **D13 — Utilizar puertas y decidir continuidad bajo presupuesto limitado.** E01/E03/E06/E07/E10. | §§13.2–13.3. **Expresa:** puertas recomendadas, no certificaciones universales; priorización por capacidad de cambiar una decisión. | Pregunta relevante, viabilidad, evidencia diferencial, fiabilidad, transferencia o inversión, según la puerta pertinente. | Avance, decisión negativa, suspensión o cierre delimitado. Incertidumbre: información faltante y coste de obtenerla. | **I/G** |
| **D14 — Recuperar antecedentes selectivamente y mantener conocimiento vinculado.** Procedimiento que fundamenta las demás decisiones. | §§14.1–14.5. **Expresa/procedimental:** relaciones, procedencia, estados y recuperación orientada a investigación. | Antecedente relevante, objeto/versiones, afirmaciones, límites y decisiones dependientes. | Antecedente reutilizable, pendiente de validación o no pertinente. Incertidumbre: validez histórica y utilidad en el contexto nuevo. | **I** |
| **D15 — Automatizar progresivamente y conservar intervención humana y trazabilidad.** E01/E02/E04 cuando corresponda. | §§15.1–15.4. **Expresa/procedimental:** utilidad antes de justificar la etapa siguiente; cambios versionados y selección explícita. | Tarea repetible, procedimiento estable, resultado verificable, coste o riesgo relevante. | Mantener trabajo manual, asistencia, orquestación o avance justificado. Incertidumbre: beneficio neto y errores automatizados. | **I/G** |
| **D16 — Proponer y validar mejoras del laboratorio mediante evidencia.** E02/E04. | §§16.1–16.3. **Expresa.** | Problema, línea base, intervención, indicador, éxito, efectos adversos, evaluación y decisión posterior. | Mejora propuesta, validada en alcance, fallida o inconclusa. Incertidumbre: causalidad y deterioro de otras propiedades. No exige rentabilidad positiva universal. | **I/G** |
| **D17 — Medir productividad y exigir comparación adecuada antes de afirmar mejoras.** Procedimiento para fundamentar E01/E06 y otras inversiones. | §§17.1–17.4. **Expresa.** | Unidades, denominadores, exclusiones, costes, calidad y referencia comparable cuando se reclame mejora. | Mejora respaldada, ausencia de mejora, evidencia insuficiente o no evaluada. Incertidumbre: coste total y atribución causal. | **I/G** |
| **D18 — Gestionar riesgos, registrar desviaciones y suspender conclusiones afectadas por incidentes de integridad.** Relacionada con E02/E07/E10. | §§18.1–18.3. **Expresa.** | Riesgo o desviación identificada, momento, ejecuciones afectadas, impacto y medidas. | Conclusión suspendida, evidencia válida con límites, revisión o invalidación fundada. Incertidumbre: alcance del incidente. No ordena detener indiscriminadamente todo el programa. | **I/N** |
| **D19 — Revisar antes y después de campañas y asignar estados sustentados.** E04. | §§19.1–19.3. **Expresa/procedimental.** | Correspondencia entre aprobado y ejecutado, trazabilidad, resultados adversos y alcance. | ESPECIFICADO, IMPLEMENTADO, VERIFICADO, OBSERVADO, AMBIGUO, NO EVALUADO o NO APLICABLE, según evidencia. Incertidumbre: cobertura y propiedades no examinadas. | **I/N** |
| **D20 — Implantar incrementalmente el procedimiento y justificar el avance de fase.** E01/E04. | §21, fases 1–5. **Expresa:** utilidad en investigaciones reales; documentación o código por sí solos no completan fases. | Ciclo trazable, reutilización con coste de adaptación, reproducción, recuperación de conocimiento y utilidad de automatización, según fase. | Fase sustentada en alcance, parcial o avance diferido. Incertidumbre: funcionamiento real y coste de adopción. | **I/G** |
| **D21 — Determinar aptitud operacional inicial mediante los doce criterios de §22.** E04. | §22. **Expresa/condicional:** la aptitud puede considerarse cuando se demuestran los criterios. | Consistencia, preguntas, protocolos, versiones, fuentes, resultados negativos, decisiones diferenciadas, reutilización, cambios versionados, cierre, investigación real y costes/límites. | Aptitud sustentada, parcial o no evaluada. Incertidumbre: criterios aún no demostrados. No exige automatización total ni resultados económicos positivos. | **I/G** |
| **D22 — Cerrar una investigación delimitando resuelto, desconocido y condiciones de revisión.** Se expresa mediante E01–E10 o declaración de apertura. | §§23 y 13.1. **Expresa;** la reapertura focalizada es **derivada** de las condiciones de revisión y de nueva evidencia relevante. | Decisión documentada, resultados y límites preservados, obligaciones pendientes identificadas. | Cierre en alcance, apertura justificada o propuesta de revisión posterior. Incertidumbre: nueva evidencia que cambie la decisión. | **I/G** |

### A.3. Disposiciones que no deben convertirse artificialmente en decisiones nuevas

| ID | Disposición | Consecuencia para el inventario |
|---|---|---|
| **R01 — Contrato semántico** | §§3.1–3.4 distinguen candidato, pregunta, observación, resultado, evidencia, interpretación, conclusión y activo. | No son diez puertas nuevas. Restringen el significado de todas las decisiones: una observación no se transforma automáticamente en explicación causal o conocimiento transferible. |
| **R02 — Contratos de información** | §§20.1–20.7 establecen registros semánticos versionados de candidato, pregunta, protocolo, diseño/ejecución, evidencia, decisión y activo. | Exigen información y relaciones, no siete servicios, archivos o bases de datos separados. No autorizan reescribir retrospectivamente el significado del historial. |
| **R03 — Fuerza y límites normativos** | §§2.1–2.4 distinguen obligaciones, prohibiciones, recomendaciones y posibilidades. | Una recomendación no se vuelve obligación universal. Una excepción a un requisito obligatorio necesita el procedimiento formal correspondiente. El análisis no puede aprobarla. |

Así quedan examinadas las **23 secciones**, incluidas aquellas que establecen restricciones y no decisiones autónomas. El inventario consolida disposiciones relacionadas; no pretende enumerar todas sus combinaciones hipotéticas.

## B. Matriz de niveles y autoridad

El original declara su **nivel documental operacional** y distingue en §2.1 la estrategia —misión, prioridades de inversión y programas— de su ejecución operacional. **No define una taxonomía formal de decisiones “estratégicas/tácticas/operacionales”.** La clasificación siguiente es analítica.

| Objeto y decisiones relacionadas | Nivel predominante | Efectos adicionales | Capacidad de fundamentar frente a autoridad de aprobación |
|---|---|---|---|
| Priorizar una siguiente prueba, instrumento, investigación o presupuesto acotado: D01, D05–D08, D13; E01/E03 | **Táctico** | Operacionales; estratégicos si modifica cartera o compromisos significativos. | El Playbook fundamenta pertinencia y proporcionalidad. La asignación efectiva corresponde a quien tenga autoridad sobre esos recursos. |
| Priorizar o archivar una línea del programa: E06 y aplicación institucional de D01 | **Estratégico** | Tácticos y operacionales. | Puede fundamentarse una recomendación de archivo; no se adquiere potestad para cambiar misión, cartera o prioridades aprobadas. |
| Caracterizar, ejecutar, registrar, analizar, auditar o cerrar técnicamente: D03–D04, D09–D11, D18–D19, D22; E02/E04/E07–E10 | **Operacional** | Tácticos cuando condiciona la siguiente etapa. | El procedimiento puede sustentar el juicio técnico. Su ejecución depende de la autorización existente y no permite modificar contratos por conveniencia. |
| Transferir o adaptar activos: D07/D12; E05 | **Táctico** | Operacionales; estratégicos si implica adopción o despliegue institucional. | Compatibilidad y evidencia fundamentan la recomendación. No sustituyen permisos de uso, financiación o aprobación del contexto receptor. |
| Automatizar, mejorar, implantar o aceptar un procedimiento: D15–D17, D20–D21 | **Táctico** | Operacionales; estratégicos al ampliar capacidades institucionales. | Una mejora puede recomendarse; inversión, adopción y despliegue requieren la autoridad correspondiente. |
| Mantener conocimiento y procedencia: D14/R01/R02 | **Operacional** | Tácticos por su uso en investigaciones posteriores. | El original exige relaciones y trazabilidad, pero no permite imponer una infraestructura concreta sin necesidad demostrada. |
| Resolver contradicciones normativas: D02/R03 | **Operacional para detectar; fuera de la autoridad del evaluador para resolver** | Puede alcanzar los tres niveles. | El evaluador identifica y escala. La autoridad documental competente resuelve; el Playbook no modifica la norma técnica afectada. |

Para el estado actual de WORLD-LAB, este dictamen tiene **predominio táctico**: recomienda qué trabajo conservar, diferir o considerar después y bajo qué condiciones. No redefine la estrategia institucional ni ejecuta nuevas actividades.

## C. Decisiones aplicables a la evidencia existente

Se utilizan las etiquetas solicitadas como **estados analíticos de las recomendaciones**, no como sustitutos de §19.3. La última columna separa expresamente fundamentación de aprobación.

Las principales fuentes factuales son:

- [Congelación operacional aprobada](../audits/WORLD_LAB_OPERATIONAL_FREEZE.md).
- [Auditoría de cierre](../audits/WORLD_LAB_CLOSEOUT_AUDIT_REPORT.md) y [matriz de capacidades](../audits/WORLD_LAB_CAPABILITY_AND_EVIDENCE_MATRIX.md).
- [Cierre P01/C2](../p01-c2-closure/CLOSURE_STATUS.json).
- [Congelación temporal RC1](../research/RC1_TEMPORARY_FREEZE_2026-11-20.md).
- [Equivalencia TITAN D4](../research/titan-mvp-01/EQUIVALENCE_VERIFICATION.md) y [protocolo del estudio TITAN](../research/titan-mvp-01/EXPERIMENT_PROTOCOL.md).

Estos expedientes se utilizan como evidencia, no para introducir obligaciones en RDL-PB-001.

| ID / recomendación | Fundamento normativo y evidencia factual | Estado y condición | Aprobación o ejecución |
|---|---|---|---|
| **C01 — Conservar WORLD-LAB como activo operacional acotado.** | D11/D19/D22; §§11, 19 y 23. Congelación aprobada y capacidades verificadas dentro del perfil identificado. | **FUNDAMENTADA.** No equivale a garantizar toda configuración legal ni a afirmar ausencia universal de defectos. | La aprobación existente se conserva. Este informe no emite una nueva congelación ni autoriza cambios. |
| **C02 — Mantener cerrado P01 y conservar su conclusión científica finita.** | §§9–11 y 23. E3/E4 documentados; 256 episodios y replay restaurados; media D=11,125 y 32 victorias en las 32 semillas fijadas. | **FUNDAMENTADA.** Sin superioridad universal, muestra IID, ablación causal de memoria ni validación de otros algoritmos. | No necesita repetición para sostener el cierre documentado. Cualquier nuevo estudio sería otra decisión. |
| **C03 — Mantener C2 en su alcance comprobado.** | §§9.3–9.4 y 11. C2 registra recepción y hashes de la copia local Windows comunicados por el propietario. | **FUNDAMENTADA.** No extender a OneDrive verificado, durabilidad indefinida o reproducción científica independiente. | No borrar originales ni ramas por implicación; la retención requiere su decisión correspondiente. |
| **C04 — Mantener separada la conformidad global pendiente.** | §§2, 11 y 19. F6-N/G00, corpus histórico incompleto y 289 casos BLOCKED. | **FUNDAMENTADA.** No convertir BLOCKED en PASS o FAIL ni eliminar las obligaciones pendientes. | Resolver fuentes o modificar normas queda **FUERA DE AUTORIDAD** de este análisis. La prioridad de recursos requiere gobierno del programa. |
| **C05 — Conservar G1 y la equivalencia D4 como resultados delimitados.** | §§5.4, 10–11. Demostración por casos y contraste independiente: 2.401 patrones, 7.903 comparaciones y secuencias sin divergencias. | **FUNDAMENTADA.** No demuestra ventaja distintiva frente a la regla directa ni valida o refuta TITAN general. | No modificar TITAN ni sus costes. No implica ejecución G2. |
| **C06 — Mantener TITAN G2 en HOLD; no financiarlo solo para volver a responder la equivalencia D4.** | §§6–8 y 13.3. Esa pregunta ya tiene evidencia suficiente en su dominio; existen limitaciones del ejecutor anteriores a G2. | **FUNDAMENTADA** para el HOLD actual. **CONDICIONADA** cualquier continuación a pregunta decisional pendiente, instrumento suficiente, presupuesto y autorización. | El inicio permanece **FUERA DE AUTORIDAD** de este informe. |
| **C07 — No declarar inútil toda la campaña TITAN de120 episodios por la equivalencia.** | §§10.4 y 11.1. El protocolo también pregunta por conducta descriptiva, comparación con controles y reproducción en otra batería. | **FUNDAMENTADA.** La equivalencia no responde automáticamente esas preguntas. Su valor adicional y prioridad siguen por decidir. | El propietario decide si esas respuestas justifican recursos; no se propone ejecutar ahora. |
| **C08 — Mantener RC1 suspendido/congelado, distinguiendo sus motivos.** | E06/E07; §§10.4, 13 y 18. Piloto parcial; calibración completa pero limitada, perturbación y AUD-C01 pendiente en el ejecutor128. | **FUNDAMENTADA.** La pausa por prioridad y la insuficiencia instrumental son razones diferentes. No constituyen refutación de WORLD-LAB. | La reapertura requiere decisión separada; no deriva de este informe. |
| **C09 — Considerar correcciones instrumentales únicamente si una investigación relevante necesita esos ejecutores.** | E02; §§7, 8 y 16. AUD-C01 y preservación de prefijos/control global-RSS de TITAN están documentados. | **CONDICIONADA.** Corregir y verificar el defecto antes de depender del instrumento, sin reconstruir el núcleo ni prometer que toda deuda debe resolverse ahora. | Requiere autorización de la revisión concreta. No se implementa aquí. |
| **C10 — Reutilizar las interfaces y herramientas existentes cuando sean compatibles.** | §§7.4 y 12. Integración externa de FrontierMemory y TITAN sin cambiar el núcleo; archivo y reproducción existentes. | **FUNDAMENTADA** como política de selección; **CONDICIONADA** cada aplicación a revisar diferencias y garantías. No heredar conclusiones científicas de P01. | No concede autorización para un nuevo candidato o campaña. |
| **C11 — No atribuir productividad económica demostrada a esa reutilización.** | §§1.3, 10.3 y 17. El esfuerzo TITAN registra una ventana parcial de 1.215,593649 s de pared, sin coste total ni referencia comparable. | **FUNDAMENTADA.** Automatización, integración y repetibilidad no son por sí solas una comparación económica. | Una afirmación de mejora exige evidencia; no puede aprobarse por decisión administrativa. |
| **C12 — Medir costes y utilidad dentro de un próximo trabajo pertinente ya autorizado, si resulta decisivo.** | §§8.4, 16–17 y 21. Faltan costes completos y evidencia comparativa sobre adaptación y uso del conocimiento. | **CONDICIONADA.** Proporcional al coste material y a la decisión. No exige iniciar una campaña solo para completar indicadores. | Recursos y ejecución requieren la autorización de ese trabajo. |
| **C13 — No iniciar una reconstrucción, plataforma genérica o expansión de infraestructura por capacidades todavía no demostradas.** | §§1.3, 15.1, 16 y 23. No se ha demostrado un bloqueante del núcleo dentro del perfil aprobado que exija esa inversión. | **FUNDAMENTADA** como recomendación actual. No es una prohibición permanente de mejorar infraestructura. | Una inversión futura requiere problema, comparación, beneficio esperado y autoridad correspondiente. |
| **C14 — Diferir una afirmación de transferencia o interoperabilidad independiente.** | §§9.4 y 12. Mismo motor y adaptación dentro de WORLD-LAB no acreditan un motor alternativo o un dominio externo. | **NO EVALUADA** para esas capacidades. Una investigación externa sería **CONDICIONADA** a una propiedad y contexto receptor definidos. | Selección del contexto, recursos y permisos no quedan autorizados aquí. |
| **C15 — Mantener la adopción del Playbook separada de su cumplimiento institucional demostrado.** | §§19–22. Adopción expresa vigente; prácticas históricas compatibles, pero relaciones institucionales, ciclo completo de mejora y costes siguen parcialmente verificados. | **FUNDAMENTADA.** §22.10 tiene evidencia histórica de cierre y oportunidades de mejora; eso no transforma todo P01/RC1/TITAN en ejecuciones formalmente realizadas bajo la norma adoptada después. | No se revoca la adopción ni se exige una campaña nueva para cerrar documentos. |

### C.1. Límites del descarte tecnológico

La evidencia actual **no fundamenta descartar WORLD-LAB** dentro de su alcance aprobado, ni **descartar TITAN v0.1/v0.3 como teoría general**.

Sí permite rechazar una afirmación concreta de ventaja conductual de D4 frente a la regla directa **si se formula dentro del dominio en que se ha establecido la equivalencia**. Tampoco permite usar el comportamiento WAIT de desarrollo como prueba de un defecto instrumental: el protocolo lo reconoce como posible resultado de la política.

## D. Decisiones indeterminadas

| Asunto | Información o autoridad faltante | Estado |
|---|---|---|
| Qué investigación sustantiva debe recibir la siguiente inversión del programa | Objetivo del propietario, alternativas, relevancia, presupuesto y valor esperado de la información. El Playbook no proporciona esas prioridades estratégicas concretas. | **FUERA DE AUTORIDAD** para aprobar; comparación concreta todavía **NO EVALUADA**. |
| Si conviene ejecutar las preguntas descriptivas restantes de TITAN G2 | Decisión que cambiarían sus respuestas, suficiencia instrumental, coste completo y autorización. | **CONDICIONADA**; no resuelta por la equivalencia D4. |
| Si y cuándo reabrir RC1 | Relevancia actual de Q1–Q4, necesidad del ejecutor, protección instrumental y valor de información adicional. | **CONDICIONADA**. |
| Cumplimiento de las obligaciones WORLD-LAB dependientes del corpus histórico | Fuentes auténticas, reconciliación y procedimientos de aceptación aplicables. | **CONDICIONADA** por evidencia; resolución normativa **FUERA DE AUTORIDAD**. |
| Rentabilidad, reducción del coste marginal o productividad compuesta | Coste total, proceso de referencia comparable, unidades estables y control de diferencias. | **NO EVALUADA** de manera suficiente; no afirmable actualmente. |
| Transferencia a otro dominio o interoperabilidad independiente | Contexto receptor, compatibilidad, implementación o procedimiento independiente y criterios de validez. | **NO EVALUADA**. |
| Cumplimiento integral del sistema institucional bajo el Playbook | Evidencia completa sobre relaciones semánticas, recuperación orientada a consultas, ciclo de mejora, costes y aplicación efectiva del procedimiento. | **NO EVALUADA** integralmente; no implica ausencia de todas esas prácticas. |
| Cambiar contratos, normas, objetivos estratégicos o definiciones matemáticas | Autoridad competente y decisión explícita correspondiente. | **FUERA DE AUTORIDAD**. |

La falta de información no justifica fabricar una decisión positiva, pero tampoco una negativa tecnológica definitiva.

## E. Priorización recomendada

Este orden utiliza importancia decisional, evidencia, coste y riesgo, sin puntuaciones artificiales:

1. **Conservar las decisiones ya respaldadas y sus límites.** WORLD-LAB operacional y P01 cerrado no requieren nuevas campañas para mantener su estado documentado. Coste bajo; evita reaperturas y generalizaciones indebidas.

2. **Mantener las restricciones sobre instrumentos que no están listos para su siguiente uso.** RC1 y TITAN G2 conservan sus HOLD. Es más importante evitar una campaña no interpretable o con evidencia incompleta que aumentar el número de episodios.

3. **Elegir primero la pregunta que podría cambiar una decisión futura.** Antes de financiar ejecución, corrección o expansión, determinar qué incertidumbre importa y por qué. No presupone seleccionar TITAN, RC1 u otra línea.

4. **Si una pregunta pertinente depende de un instrumento limitado, considerar la corrección mínima y su verificación focalizada.** Corregir AUD-C01 o el tratamiento de fallos no equivale a autorizar la campaña posterior ni a reconstruir WORLD-LAB.

5. **Reutilizar activos compatibles y aprovechar el siguiente uso autorizado para observar costes y utilidad.** Evitar tanto recrear herramientas innecesariamente como iniciar un proyecto adicional para medir indicadores sin decisión relevante.

6. **Priorizar recuperación normativa, transferencia o interoperabilidad según la decisión que dependa de ellas.** Sus pendientes siguen vigentes; su secuenciación no equivale a dispensar obligaciones ni a bloquear automáticamente toda investigación independiente.

7. **Diferir expansiones generales y afirmaciones económicas.** Su justificación actual es insuficiente. Una propuesta futura deberá identificar el problema y el beneficio esperado que no proporcionan las capacidades existentes.

## F. Dictamen ejecutivo

### F.1. Recomendaciones fundamentadas para adopción o conservación

- Conservar WORLD-LAB como activo reutilizable en su **alcance operacional aprobado**.
- Mantener P01 cerrado, sus resultados científicos finitos y el alcance exacto de C2.
- Conservar TITAN G1 y la equivalencia D4, sin atribuir validación general.
- Mantener RC1 y TITAN G2 en HOLD, diferenciando limitación instrumental y priorización.
- Seleccionar instrumentos adecuados y reutilizar activos compatibles antes de recrearlos.
- Mantener separadas adopción normativa, cumplimiento demostrado y capacidades no establecidas.

### F.2. Decisiones que conviene diferir

La siguiente campaña, la reapertura de RC1, las correcciones que solo servirían a trabajos todavía no seleccionados, la transferencia externa y cualquier aceptación institucional integral sin evidencia suficiente.

### F.3. Inversiones actualmente no justificadas

Reconstruir el núcleo; ampliar infraestructura por la mera existencia de capacidades pendientes; repetir campañas cerradas sin una incertidumbre nueva; ejecutar120 episodios únicamente para volver a contestar la equivalencia D4; o crear sistemas documentales para reproducir la taxonomía del Playbook.

### F.4. Asuntos fuera de autoridad

Modificar normas o contratos técnicos, alterar la teoría TITAN, cambiar prioridades estratégicas, comprometer recursos nuevos y autorizar ejecuciones. El Playbook permite fundamentar recomendaciones sobre esos asuntos, no apropiarse de su aprobación.

### F.5. Incertidumbres capaces de cambiar materialmente el dictamen

Un defecto demostrado en el perfil congelado; una nueva fuente normativa pertinente; una pregunta cuya respuesta altere una inversión; evidencia de transferencia independiente; o una comparación económica válida que demuestre beneficio, ausencia de beneficio o perjuicio.

**Este informe fundamenta decisiones; no las ejecuta ni sustituye el juicio del propietario.**
