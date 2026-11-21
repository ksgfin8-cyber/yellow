# WORLD-LAB — Aplicación especializada y dictamen bajo RDL-PB-001 v0.1

**Tipo:** evaluación del activo tecnológico y del proceso de investigación; **no** modificación de WORLD-LAB ni del Playbook.  
**Estado:** `EVALUATION_COMPLETED_FROM_AVAILABLE_EVIDENCE / OWNER_REVIEW`.  
**Fecha de corte documental:** 2026-11-20 (America/Guayaquil).  
**Marco de autoridad:** [registro de adopción](../program/RDL-PB-001_v0.1_AUTHORITY_AND_ADOPTION.md), que reconoce uso **normativo operacional** del [texto ORIGINAL intacto](../program/RDL-PB-001_v0.1_original_propuesta.md).  
**Línea de referencia examinada:** `main@e82aff03a74f5a03f8ebce15c39b2bd00c389f7f`, PR #61 integrado.  
**Congelación científica aprobada:** candidato `8ebe62d7032c0676a0e1b66bdf9a2b4c898c1d2d64b8f48c24a8112617be2c13`, commit `1c7929734f46a437fb6b036d71dd36f1d39f1d3b`; [acta](WORLD_LAB_OPERATIONAL_FREEZE.md).  
**Lectura temporal:** los expedientes anteriores muestran sus estados en su fecha. Una aprobación posterior no reescribe documentos históricos.

## 1. Objeto, preguntas y decisiones (§§1, 5–6 y 13)

El objeto primario es **WORLD-LAB como instrumento experimental**, no TITAN como teoría ni el programa nacional/institucional completo. Se examina su capacidad para admitir políticas compatibles, ejecutarlas en un mundo determinista BOUNDED de entidad única, preservar y comprobar resultados, apoyar afirmaciones científicas delimitadas y reducir eventualmente el costo de investigaciones sucesivas.

| ID | Pregunta que cambia una decisión | Decisión admisible con evidencia actual |
|---|---|---|
| PB-WL-Q01 | ¿Puede WORLD-LAB operar de forma recuperable en el dominio aprobado? | **Sí, dentro del alcance P01 y contratos probados**; conservar baseline operacional congelada |
| PB-WL-Q02 | ¿Puede incorporar otro candidato externo sin modificar el núcleo? | **Sí para TITAN-MVP-01 G1**; no implica compatibilidad universal |
| PB-WL-Q03 | ¿Permite detectar e interpretar resultados negativos relevantes? | **Sí, dentro de P01, RC1 y contraste TITAN**; sin convertir NO-GO en falla universal |
| PB-WL-Q04 | ¿Es íntegramente conforme, interoperable o transferible entre dominios? | **No establecido**; conservar F6-N/G00/289 BLOCKED e interoperabilidad fuera de certificación |
| PB-WL-Q05 | ¿Mejora cuantificablemente la productividad tecnológica por unidad de recursos? | **No establecido**; conservar observaciones de reutilización sin atribución económica causal |
| PB-WL-Q06 | ¿Debe reconstruirse o ampliarse antes de utilizarse otra vez? | **No se ha demostrado la necesidad** dentro de la baseline congelada; evaluar cambios solo ante pregunta o defecto real |

Decisión rectoral: `RETAIN_FOR_SCOPED_RESEARCH` y `NO_UNSUPPORTED_GENERALIZATION`. El cierre de una fase de construcción no equivale a haber completado todas las investigaciones, ni el acto de congelar acredita todas las propiedades posibles del instrumento.

## 2. Alcance de revisión y procedencia de evidencias

Se revisó el inventario Git recursivo de la línea base (658 archivos/blobs, 727 entradas, excluyendo directorios, en el corte indicado), y el contenido de **103 documentos Markdown** junto con los expedientes JSON de evidencias y conformidad. Una consulta a `conformance/profile/clause-inventory.json` devolvió texto truncado por tamaño; **no** se atribuye inspección íntegra de ese JSON en esta revisión. Los paquetes `.gz` y archivos `.b64` de historial no se decodificaron ni reejecutaron aquí: para su integridad y verificaciones se utiliza, con el alcance declarado por la auditoría de cierre, [inventario](closeout-evidence/inventory.json), [registro de cobertura](closeout-evidence/coverage-ledger.json) y [verificación de evidencias](closeout-evidence/evidence-verification.json).

El [informe de auditoría](WORLD_LAB_CLOSEOUT_AUDIT_REPORT.md) documenta verificación de **630 archivos base** sin modificación, **616 pruebas contractuales PASS**, **5 pruebas de contraste TITAN PASS**, **289 casos históricos BLOCKED** y **9 fallos legacy** de expectativas incompatibles; no se han reejecutado estas pruebas durante la presente evaluación metodológica. Leer un informe y comprobar un hash **no** equivale a repetir su experimento.

Fuentes principales: [norma WORLD-LAB v0.2.5](../WORLD-LAB_v0.2.5_canonical_transcripcion.md), [enmienda D-01](../WORLD-LAB_v0.2.6_contractual_amendment_D-01.md), [matriz de conformidad](../CONFORMANCE_MATRIX.md), [F5-D](../f5-d/UNRESOLVED_DECISIONS.md), [cierre F6](../f6-construction-closure/READINESS_REPORT.md), [matriz de capacidades](WORLD_LAB_CAPABILITY_AND_EVIDENCE_MATRIX.md), [P01](../p01-cycle-closure/P01_RESEARCH_CYCLE_CLOSURE.md), [RC1](../research/RC1_TEMPORARY_FREEZE_2026-11-20.md), [TITAN G1](../research/titan-mvp-01/IMPLEMENTATION_REPORT.md) y [equivalencia](../research/titan-mvp-01/EQUIVALENCE_VERIFICATION.md). Los valores aquí reproducidos proceden de esos registros, no de ejecuciones nuevas.

**Importante:** la especificación estratégica superior del programa no forma parte del repositorio auditado. El Playbook define explícitamente su subordinación estratégica (§2), pero este informe no puede certificar alineación literal con una especificación estratégica no presentada.

## 3. Matriz de aplicación — 23 secciones del Playbook

Los estados siguientes son **juicios de suficiencia de evidencia para preguntas delimitadas**, no un nuevo sistema de conformidad que reemplace el §19.3 del Playbook o la norma WORLD-LAB: `EVIDENCIADO EN ALCANCE`, `PARCIAL`, `NO EVALUADO/NO ESTABLECIDO` y `APLICADO COMO PRINCIPIO`.

| § RDL-PB-001 | Interpretación especializada: pregunta o procedimiento | Evidencia / límite específico | Dictamen |
|---|---|---|---|
| **1 Propósito y mandato** | ¿Produce información accionable, no simplemente tests? | P01 fue cerrado con resultados delimitados; RC1 justifica NO-GO instrumental y congelación | **EVIDENCIADO EN ALCANCE** para decisiones; beneficio compuesto no establecido |
| **2 Autoridad y alcance** | ¿Se conservan autoridades estratégica, metodológica, normativa y experimental? | Acta de congelación y registro de adopción separados; estrategia superior original no aportada | **PARCIAL** |
| **3 Taxonomía** | ¿Se distinguen candidato, hipótesis, resultado, evidencia, decisión y activo? | Matrices CL, informes, puertas P01/RC1/TITAN; estados históricos legibles | **EVIDENCIADO EN ALCANCE**; sin modelo institucional universal certificado |
| **4 Modelo operativo** | ¿Se separan entorno, sujeto, registro, análisis y visualización por contrato? | WORLD/Experiment, Agent, Recorder/replay, ejecutores externos, métricas, renderer | **EVIDENCIADO EN ALCANCE**; límites fail-stop y sin aislamiento hostil |
| **5 Admisión/caracterización** | ¿Se puede identificar un nuevo sujeto y sus restricciones? | Expediente TITAN D4 y contrato de interfaz; no `H⊂R^59` implementado | **PARCIAL**; no se probó registro formal universal de candidatos |
| **6 Preguntas y decisión** | ¿Existieron preguntas contrastables capaces de cambiar una inversión? | P01 H+, RC1 Q1–Q4, TITAN equivalencia D4; RC1 Q4 no cerrado retrospectivamente | **EVIDENCIADO EN ALCANCE** |
| **7 Selección y compatibilidad** | ¿Se escogió prueba discriminativa de coste proporcional? | Demostración D4 y oráculo directo de 2.401 patrones/7.903 comparaciones antes de campaña120 | **EVIDENCIADO EN ALCANCE**; selección automática de protocolos no evaluada |
| **8 Diseño/control** | ¿Están declarados semillas, configuraciones, controles, hipótesis y límites? | P01 preregistrado, 32 semillas, 256 ejecuciones; comparadores finitos, no IID | **EVIDENCIADO EN ALCANCE P01** |
| **9 Registro/reproducción** | ¿Puede verificarse la genealogía y reproducir trayectorias? | E3/E4 y relectura auditada: 256 replay históricos MATCH, archivo, WLS1 y hashes; copia local Windows comunicada | **EVIDENCIADO EN ALCANCE**; sin réplica independiente de otro motor |
| **10 Análisis** | ¿Se separan cálculos de interpretación y se preservan inconclusos? | Recuento P01 media D=11,125 en 32 semillas; RC1 PILOT_PARTIAL/NO-GO | **EVIDENCIADO EN ALCANCE** |
| **11 Evidencia/falsación** | ¿Se evalúa cada afirmación por dominio y se buscan contrastes adversos? | TITAN equivalencia D4 respaldada, sin inferir teoría TITAN validada; RC1 resultado adverso conservado | **EVIDENCIADO EN ALCANCE** |
| **12 Generalización/transferencia** | ¿Se comprobó transferencia a otro instrumento o dominio? | Nuevo adaptador TITAN G1 demuestra extensibilidad en mismo WORLD; sin segundo motor ni dominio físico independiente | **PARCIAL** para reutilización de interfaz; transferencia externa **NO ESTABLECIDA** |
| **13 Decisiones/puertas** | ¿Se separa GO, HOLD, NO-GO, inconcluso y archivo por prioridad? | P01 cierre, RC1 temporalmente congelado, TITAN G2 HOLD, F6-N bloqueado | **EVIDENCIADO EN ALCANCE** |
| **14 Conocimiento institucional** | ¿Se recuperan antecedentes que evitan decisiones equivocadas? | Expedientes indexados y reutilización de protocolo P01/TITAN; no reducción comprobada de coste por recuperación | **PARCIAL** |
| **15 Automatización** | ¿Se automatizan tareas repetibles con controles visibles? | Headless, supervisores, oráculos, archivo, verificación; AUD-C01/prefijos TITAN no resueltos fuera de su perfil | **EVIDENCIADO EN ALCANCE**; pipeline genérico automatizado no establecido |
| **16 Mejora continua** | ¿Hay decisiones de cambio a partir de evidencia, no de estética? | RC1 encuentra perturbación y se congela; pruebas focalizadas corrigen interpretación TITAN sin reescribir política | **PARCIAL**; ganancia neta económica no demostrada |
| **17 Productividad/costos** | ¿Existe línea base comparable y costo total por decisión? | TITAN registra 1.215,59 s wall de ventana parcial; no horas humanas completas ni contrafactual comparable | **NO ESTABLECIDO** |
| **18 Riesgos/desviaciones** | ¿Se preservan errores y límites? | CC-04/05, AUD-C01, CL-T01/02, 289 BLOCKED, fallos legacy y RC1 parcial explícitos | **EVIDENCIADO EN ALCANCE** |
| **19 Calidad/auditoría** | ¿Separamos especificado, implementado y verificado? | 616+5 pruebas registradas, revisión documental selectiva, matriz de alcance y NO-GO externos | **EVIDENCIADO EN ALCANCE**; conformidad canónica global **NO ESTABLECIDA** |
| **20 Contratos de información** | ¿Se reconstruyen candidato→pregunta→protocolo→run→evidencia→decisión→activo? | Relaciones distribuidas en expedientes y manifests; los siete tipos no existen como contrato transversal único validado | **PARCIAL**, sin obligación de crear siete archivos/servicios |
| **21 Implantación incremental** | ¿Se pudo recorrer un ciclo real y reutilizar componentes? | P01 end-to-end y TITAN G1 bajo metodología previa; no hay prueba prospectiva de adopción completa de RDL | **PARCIAL**; no declarar fases1–5 aprobadas |
| **22 Aceptación del procedimiento** | ¿Se cumplen los 12 criterios de aptitud para uso? | Véase tabla específica §4 de este informe | **PARCIAL/CONDICIONADA A ALCANCE** |
| **23 Cierre operacional** | ¿Se documentó decisión, evidencia, pendientes y condiciones de reapertura? | P01 y WORLD-LAB tienen cierres identificados; RC1 y TITAN G2 siguen abiertos en sentido preciso | **EVIDENCIADO EN ALCANCE** |

## 4. Aplicación de los doce criterios §22

Esta tabla **no concede certificación formal universal**. Diferencia que WORLD-LAB demostró ciertas prácticas compatibles con RDL-PB-001 **antes** de la decisión de adopción de este. No se pueden retroetiquetar esas investigaciones como ejecutadas bajo una norma aún no adoptada.

| Criterio §22 | Evidencia actual | Evaluación respecto a WORLD-LAB |
|---|---|---|
| 1. Definiciones consistentes | Normativa, glosarios y matrices; distinción entre fuentes originales e informes derivados | **PARCIAL** — consistencia institucional transversal no auditada |
| 2. Preguntas vinculadas a decisiones | H+ P01; RC1 parcial/NO-GO; equivalencia TITAN | **EVIDENCIADO EN ALCANCE** |
| 3. Propósito, compatibilidad y límites de protocolos | P01 y TITAN perfil de radio1; límites explícitos | **EVIDENCIADO EN ALCANCE** |
| 4. Versiones y condiciones identificables | Congelaciones, commits, semillas y configuraciones | **EVIDENCIADO EN ALCANCE** |
| 5. Trazabilidad de resultados | E3/E4, manifiestos, hashes, replay, registros | **EVIDENCIADO EN ALCANCE** |
| 6. Evidencia contraria e inconclusa conservadas | RC1 partial/NO-GO, TITAN estancamiento/equivalencia | **EVIDENCIADO EN ALCANCE** |
| 7. Decisiones diferenciadas | HOLD no es FAIL; P01 cerrado, RC1 archivado por prioridad | **EVIDENCIADO EN ALCANCE** |
| 8. Condiciones de reutilización conservadas | Interface agentes, contratos P01/TITAN y exclusiones de congelación | **EVIDENCIADO EN ALCANCE** |
| 9. Modificaciones metodológicas versionadas | Expedientes de protocolos RC1 y oráculos TITAN sin reescribir ciencia | **EVIDENCIADO EN ALCANCE** |
| 10. Cierre que incorpora conocimiento y mejora | P01 y congelación WORLD-LAB con hallazgos y reapertura | **PARCIAL** — reutilización de conocimiento no probada económicamente |
| 11. Ciclo probado con una investigación real | P01 end-to-end histórico, TITAN segundo adaptador G1 | **EVIDENCIA DE VIABILIDAD**, no prueba prospectiva del Playbook adoptado |
| 12. Costos y límites del procedimiento identificados | Límites detallados, esfuerzo TITAN parcial medido | **PARCIAL** — costo total de investigación y comparación de productividad ausentes |

**Lectura admisible:** los precedentes WORLD-LAB aportan evidencia favorable a la **viabilidad de aplicar** el Playbook en este dominio. La conformidad formal del procedimiento institucional bajo RDL-PB-001 desde su adopción **todavía no puede atribuirse retrospectivamente**. La aceptación del propio texto como normativa es una **decisión de autoridad**, distinta de la verificación de cómo se aplica en investigaciones nuevas.

## 5. Hallazgos adversariales que afectan decisiones reales

| ID | Evidencia y mecanismo de riesgo | Severidad para la decisión | Tratamiento de menor costo |
|---|---|---|---|
| PB-WL-F01 — falsa generalidad | WORLD-LAB tiene interfaces para problemas discretos cardinales, no equivalencia demostrada para clasificación, optimización continua o multiagente | **ALTA para afirmaciones generales**, no bloquea baseline | Restringir ofertas de uso a candidatos/protocolos compatibles (§§7,12) |
| PB-WL-F02 — productividad atribuida sin contrafactual | 1.215,59 s de TITAN son tiempo transcurrido parcial, sin medida completa de mano de obra ni control comparativo | **ALTA para retorno sobre inversión**, no bloquea operación | Registrar esfuerzo prospectivo en investigaciones posteriores cuando sea decisivo (§17) |
| PB-WL-F03 — evidencias múltiples dependientes | Replay, CSV e informes derivados pueden provenir del mismo conjunto de episodios P01; no son muestras independientes | **ALTA para generalización** | Identificar unidad de evidencia y fuente común (§§9–11) |
| PB-WL-F04 — conformidad global no acreditada | F6-N, G00, corpus original ausente, 289 BLOCKED; CC-04/05 fuera del perfil | **ALTA para certificación universal**, no bloquea P01 probado | Mantener alcance exacto y recuperar autoridad solo si una nueva decisión lo exige (§§2,19) |
| PB-WL-F05 — fallos instrumentales ante campañas | AUD-C01, prefijos TITAN y watchdog/RSS G2 insuficientes | **BLOQUEANTE para ampliar esos ejecutores**, no para congelación vigente | Gate específico antes de cada nueva campaña; no transformar el núcleo (§§8,15,18) |
| PB-WL-F06 — arbitrariedad experimental de D4 | TITAN D4 equivale a prioridades locales en 2.401 casos y secuencias; G1 mostró WAIT frecuente | **ALTA para atribución de mérito a teoría TITAN** | Registrar equivalencia y no anunciar validación de teoría; G2 separado (§§5,10,11) |
| PB-WL-F07 — sesgo retrospectivo de adopción | Los expedientes P01/RC1/TITAN preceden a la adopción normativa explícita del Playbook | **ALTA para declarar conformidad histórica** | Tratar pruebas anteriores como evidencias de viabilidad, no certificación retrospectiva (§§2,19–22) |

No hay obligación de resolver todos estos hallazgos antes de **usar** WORLD-LAB dentro del alcance congelado. Sí son condiciones para **afirmaciones adicionales** o ejecuciones concretas que dependan de esas capacidades.

## 6. Conclusión de inversión y uso tecnológico (§§13, 16–17 y 23)

**Decisión A — Activo WORLD-LAB:** `GO / RETAIN_SCOPED_OPERATIONAL_BASELINE`. Conserva utilidad demostrada para estudiar agentes discretos compatibles, con registro y reproducción en perfiles verificados. No se justifica reconstrucción o expansión del núcleo en ausencia de un defecto bloqueante o nueva pregunta concreta.

**Decisión B — Conformidad integral, transferencia, productividad:** `NOT_ESTABLISHED`. No asignar calificación global numérica ni afirmar retorno compuesto con los datos actuales.

**Decisión C — Investigación TITAN:** G1 y equivalencia D4 están documentados; G2 `HOLD`. El contraste más barato ya fijó el límite científico de la operacionalización, sin requerir el experimento120 para esa pregunta.

**Decisión D — RC1:** `TEMPORARILY_FROZEN` con resultados negativos y restricciones instrumentales. No reabrir para completar burocráticamente fases; requiere relevancia decisional nueva.

**Decisión E — Aplicación de RDL-PB-001:** `ADOPTED_AS_NORMATIVE_REFERENCE` por autoridad del propietario; **no se modifica** el texto original. La primera investigación posterior a la adopción podrá demostrar, con sus datos originales y coste real, cumplimiento prospectivo de un ciclo. **No se exige ejecutar esa investigación para cerrar esta evaluación documental**.

**Tratamiento de los activos:** conservar normas, P01, RC1, G1 TITAN, matriz, hashes, resultados negativos, límites y esta evaluación como conocimiento vinculado a su procedencia. No crear bases de datos, servicios, puntuaciones de madurez o paquetes de plantillas solo para imitar la taxonomía de RDL.

## 7. Condición de reapertura

Una nueva investigación puede justificar revisión focalizada de WORLD-LAB si exige otra interfaz, expone una desviación actual en el perfil congelado, necesita fuentes normativas completas para certificar una propiedad o revela una oportunidad de reutilización medible. Las nuevas autorizaciones de ejecución, presupuestos y firmas, cuando corresponda, son **independientes** de la congelación y del acto de adopción del Playbook.

**Dictamen final:** WORLD-LAB es **apto como instrumento de investigación tecnológica en el dominio operacional verificado**; **no** está acreditado como laboratorio universal, infraestructura interoperable independiente ni multiplicador económico probado. RDL-PB-001 se aplica **sin cambios** como criterio transversal del programa, y esta evaluación especializada **no** modifica las obligaciones del documento fuente.
