# WORLD-LAB — Alcance de auditoría de cierre y preparación de congelación

**Estado:** `AUDIT_SCOPE_PROPOSED / OPERATIONAL_FREEZE_NOT_YET_APPROVED`.  
**Fecha de corte:** 2026-11-20 (America/Guayaquil).  
**Referencia de código:** `main@bc768f26be7f14fe6091d3a9a202af61b083c303` (PR #57 integrado).  
**Marco de evaluación posterior:** `RDL-PB-001 v0.1`, propuesta operacional de nivel superior facilitada por el propietario; **no** sustituye norma WORLD-LAB ni es certificación vigente del laboratorio.  
**Objeto:** cerrar las verificaciones abiertas estrictamente necesarias, fijar identidad de un activo reusable y emitir un dictamen de congelación acotada sin falsear estados históricos.

## 1. Decisiones que debe habilitar la auditoría

**D-CL1 — Base operacional:** ¿se puede congelar esta revisión como instrumento WORLD-LAB reutilizable en investigaciones **compatibles** sin cambiar leyes físicas, contratos o Recorder?  
**D-CL2 — Evidencia demostrada:** ¿qué afirmaciones tienen soporte suficiente por fuente, ejecución, archivo y reproducción?  
**D-CL3 — Pendientes:** ¿qué incumplimientos, lagunas de autoridad normativa o capacidades no demostradas deben quedar fuera de la aceptación?  
**D-CL4 — Investigación siguiente:** ¿qué operaciones están autorizadas o en HOLD para TITAN G2, RC1 y campañas posteriores?  
**D-CL5 — Productividad:** ¿qué información existe y cuál falta para afirmar reducción del costo marginal de investigación?

## 2. Fuentes a contrastar, sin suponer que un documento sustituye su evidencia

### Norma y conformidad

- `docs/WORLD-LAB_v0.2.5_canonical_transcripcion.md`; `docs/WORLD-LAB_v0.2.6_contractual_amendment_D-01.md`.
- `docs/f5-d/` (incluyendo `UNRESOLVED_DECISIONS.md`, perfiles, reconciliación y trazas).
- `conformance/` (obligaciones, perfil, casos, resultados, referencias normativas y casos BLOCKED).
- `docs/CONFORMANCE_MATRIX.md`, `docs/CONFORMANCE_PREACCEPTANCE_F5-B.md`, `docs/ACCEPTANCE_PROFILE_F5-C.md`.

### Ingeniería del núcleo y fronteras

- `docs/CONSTRUCTION_CLOSURE.md`, `docs/f6-construction-closure/`, `docs/IMPLEMENTATION_STATUS.md`, `docs/ENGINEERING_DECISIONS.md`, `docs/ENGINEERING_LEARNINGS.md`.
- `js/core/`, `js/world/`, `js/experiment/`, `js/interface/`, `js/agents/`, `js/visualization/`, `index.html`, `tests/`.
- Distinguir códigos congelados, evidencia de suites **históricas** y verificaciones corridas nuevamente en auditoría.

### Evidencia de investigaciones

- `docs/F6-A-pilot-protocol.md`, `tools/p01/`, `docs/p01-e3-final/`, `docs/p01-e4/`, `docs/p01-e5/`, `docs/p01-c2-closure/`, `docs/p01-cycle-closure/`, `tools/evidence/`.
- `docs/research/wl-rc1-*/` y `tools/research/`, especialmente `RC1_TEMPORARY_FREEZE_2026-11-20.md`.
- `docs/research/titan-mvp-01/`, `js/agents/titan_mvp_01.js` y `tools/titan-mvp-01/`, incluyendo el análisis de equivalencia D4.

### Registro del programa

- Playbook RDL-PB-001 v0.1 suministrado por el propietario. Referenciar su nombre, versión y carácter propuesto; no afirmar que está incorporado a `main` mientras no exista un original versionado y autorizado.
- Cualquier especificación estratégica superior deberá identificarse por original y autoridad antes de alegar conformidad formal con ella; no inferirla del Playbook.

## 3. Método de auditoría

1. Inventario recursivo del árbol Git, con conteos por familia y clasificación de `norma / código / prueba / evidencia primaria / informe derivado / decisión histórica / propuesta / dato`. Marcar fuentes no inspeccionadas o inaccesibles; no afirmar auditoría exhaustiva si se utilizó muestreo.
2. Matriz bidireccional por afirmación relevante: `claim_id, pregunta, requisito/fuente, componente, ejecución, prueba/resultado, evidencia favorable, contraria, dominio, limitación, estado`.
3. Separar `IMPLEMENTED`, `VERIFIED_WITHIN_SCOPE`, `DOCUMENTED_HISTORICAL`, `UNTESTED`, `BLOCKED_BY_AUTHORITY`, `NOT_ESTABLISHED`, `CONTRADICTED`; estos son estados del informe, no sustitutos de etiquetas normativas históricas.
4. Auditar fronteras `WORLD↔Agent`, `WORLD↔Recorder`, `RecordedStep↔replay`, `experimento↔archivo↔análisis`, `experimento↔autorización`, `P01↔TITAN`. Identificar violaciones con ruta/línea, entrada y efecto; no conjeturar fallas no verificadas.
5. Correlacionar cierres P01, RC1 y TITAN con protocolos y originales. Una aceptación P01 no cierra RC1; una integración TITAN no prueba generalidad del mundo; replay del mismo motor no prueba interoperabilidad independiente.
6. Revisar casos `G00`, `F6-N`, `289 BLOCKED`, `CC-04/05`, `AUD-C01`, integridad de evidencia y costos instrumentales. No ejecutar campaña experimental como parte de esta auditoría sin nueva autorización.
7. Aplicar Playbook RDL-PB-001 como **lente de evaluación**: admisión, caracterización, preguntas, adecuación de protocolo, controles, reproducibilidad, afirmaciones, conocimiento reutilizable, costos, decisiones y falsación. Separar `PLAYBOOK_ADOPTION_NOT_ESTABLISHED` de defectos normativos WORLD.
8. Clasificar cada hallazgo `BLOCKER_FOR_SCOPED_FREEZE / NONBLOCKING_DEBT / RESEARCH_LIMITATION / HISTORICAL_ONLY`, con evidencia, impacto, mínima corrección o límite del alcance, responsable de la decisión y criterio de reapertura.

No convertir 289 BLOCKED en 289 fallos. No declarar mejora compuesta de productividad ni interoperabilidad sin evidencia. Si no hay contradicción verificable nueva en la línea base operacional, favorecer congelación **acotada**, no expansión arquitectónica.

## 4. Condiciones mínimas para proponer una congelación operacional

- Commit exacto de `main` revisado; hash/manifiesto de archivos científicos; separación de documentación histórica y estado vivo.
- Pruebas de contrato/integridad focalizadas con resultados realmente ejecutados y fecha, sin presupuestos engañosos sobre tests heredados.
- Matriz que distinga capacidades demostradas (P01 y G1 TITAN) de obligaciones bloqueadas (F6-N/G00), no evaluadas (interoperabilidad), RC1 en HOLD y TITAN G2 en HOLD.
- Registro de defectos P0/P1 actuales **demostrados** que impidan operar en el alcance que pretende congelarse, o declaración justificada de ausencia de defectos bloqueantes verificados **dentro del alcance auditado**, no «cero defectos».
- Rutas de recuperación de resultados y continuidad de herramientas. Congelar las fuentes existentes **sin prohibir nuevos adaptadores** fuera del núcleo, tal como se hizo con FrontierMemory y TITAN.
- Decisión del propietario sobre el alcance exacto y su autorización. La mera creación del acta no concede permisos nuevos.

## 5. Entregables genuinos de cierre

1. `WORLD_LAB_CLOSEOUT_AUDIT_REPORT.md`: hallazgos demostrables, evidencias vinculadas a SHA/paths, severidades, decisiones recomendadas y límites de lectura/ejecución.
2. `WORLD_LAB_CAPABILITY_AND_EVIDENCE_MATRIX.md`: capacidades probadas, pendientes y vínculos documentales a sus originales.
3. `WORLD_LAB_OPERATIONAL_FREEZE.md`: **solo si** la auditoría permite dictaminar GO y el propietario autoriza la congelación; identidad y restricciones de reutilización, sin declarar conformidad global ni cerrar RC1 o TITAN G2.
4. `PLAYBOOK_ASSESSMENT.md`: evaluación específica del laboratorio bajo el Playbook, con brechas de admisión→decisión, trazabilidad/reutilización, costo y falsación; estado explícito del propio Playbook como `PROPOSED`.

Los documentos de cierre **no** son instrucciones para Codex; son registros verificables de investigación, auditoría y decisiones. No generar archivos vacíos o resultados anticipados para satisfacer nombres de entregables.

## 6. Puertas

- `CL-A` Equivalencia TITAN: análisis estático fijado; prueba diferencial independiente pendiente.
- `CL-B` Auditoría técnica y científica: inventario, matrices, evidencia e informe revisados.
- `CL-C` Congelación de WORLD-LAB: solo tras dictamen y autorización expresa, con identidad nueva y alcance acotado.
- `CL-D` Evaluación final mediante Playbook: aplicar tras tener el objeto técnico y expediente cerrados, no imponer retroactivamente requisitos de un Playbook v0.1 todavía propuesto.

**No autorizados por este documento:** cambios de física, cambios matemáticos de TITAN, desarrollo del ejecutor G2, campaña TITAN de120 episodios, reanudación RC1, publicación de certificación global o uso de recibos de autorización de otras campañas.
