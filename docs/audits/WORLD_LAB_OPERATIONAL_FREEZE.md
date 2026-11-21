# WORLD-LAB — Acta de aprobación de congelación operacional acotada

**Estado de decisión:** `APPROVED_BY_OWNER / OPERATIONAL_FREEZE_WITHIN_SCOPE`.  
**Fecha de la decisión:** 2026-11-20, zona `America/Guayaquil`.  
**Autoridad:** aprobación expresa del propietario: «aprobado», tras recibir el dictamen GO de auditoría y la propuesta concreta de congelar el candidato con sus exclusiones y obligaciones abiertas.  
**Naturaleza:** acto de aprobación de una **línea base operacional identificada**, no una modificación de la norma WORLD-LAB, firma Ed25519, autorización experimental, certificación global ni adopción del Playbook.  
**Entrada formal:** `docs/audits/WORLD_LAB_OPERATIONAL_FREEZE_CANDIDATE.json`.  
**Auditoría:** `docs/audits/WORLD_LAB_CLOSEOUT_AUDIT_REPORT.md` y `docs/audits/WORLD_LAB_CAPABILITY_AND_EVIDENCE_MATRIX.md`, integradas por PR #60.

## 1. Decisión

Se **APRUEBA la congelación operacional ACOTADA** de WORLD-LAB bajo la identidad del candidato auditado y **sin cambiar ni ampliar** el alcance recomendado por la auditoría.

La congelación constituye una referencia estable para el núcleo y los contratos operacionales probados. No prohíbe crear nuevas investigaciones, agentes o adaptadores externos compatibles. Toda modificación futura al núcleo congelado exige una nueva versión, evaluación del delta y autorización según su impacto; no altera retroactivamente esta decisión.

La aprobación **no** indica que todas las investigaciones estén completas ni resuelve bloqueos normativos no examinados.

## 2. Identidad exacta aprobada

- **Candidate ID SHA-256:** `8ebe62d7032c0676a0e1b66bdf9a2b4c898c1d2d64b8f48c24a8112617be2c13`.
- **Commit científico/auditoría del candidato:** `1c7929734f46a437fb6b036d71dd36f1d39f1d3b`.
- **Árbol Git del candidato:** `0ebf7337553deb343c2abca4e099d6216b2c1cb8`.
- **Base de referencia auditada:** `f814c3adead596cbb01f753fe07cc1df176a827b`.
- **Manifiesto de archivos:** `docs/audits/closeout-evidence/candidate-files.json`.
- **SHA-256 del manifiesto:** `4aea60ea6990e038c24ee1557a9219f8e95d47dcebd8a11aebf88d6e4c313786`.
- **Commit main al crear esta acta:** `e22a212aeec7d55adf1e25ee82827426688d512b` (merge del PR #60).
- **Identidad de P01 preservada:** `47155590f10358f6130a1f7eae261ec9ec1fc8035652c04dd23fcc9f92c63e7d`.

El commit y el árbol científico aprobados **no se redefinen** por la incorporación posterior del presente documento. Los dos archivos de envoltura de aprobación indicados en el candidato están excluidos del árbol científico identificado; esta acta no altera su identidad. GitHub confirmó que el commit candidato corresponde al árbol declarado. La identidad de aprobación se refiere a ese candidato, no al HEAD variable de `main`.

## 3. Alcance aprobado

1. Núcleo operacional WORLD-LAB **BOUNDED**, de una entidad experimental, dentro de los contratos y condiciones que la auditoría verificó.
2. Perfil P01 ya aprobado: mundo 12×12, radio de observación 1, `max_ticks=160`, cuatro políticas preregistradas y los límites de inferencia de su expediente.
3. Modo autónomo `WAIT` y demostración web existente, **solo en las configuraciones ensayadas**.
4. Integración `TITAN-MVP-01` en estado **G1**, y equivalencia conductual del adaptador D4 con un controlador directo de prioridades respaldada por demostración y contraste independiente. Esto **no** incluye validación completa de la teoría TITAN ni campaña G2.

Para la evidencia detallada, aplicar el informe de auditoría, la matriz de capacidades, los manifiestos y los expedientes P01/TITAN. Las pruebas focalizadas y los replay del mismo motor no autorizan extrapolaciones universales.

## 4. Exclusiones y obligaciones que permanecen abiertas

| Objeto | Estado preservado | Límite operativo |
|---|---|---|
| RC1 (incluido ejecutor128) | `HOLD_TEMPORARILY_FROZEN` | No reanudar campañas; AUD-C01 pendiente |
| TITAN evaluación científica G2 | `HOLD_NOT_AUTHORIZED` | No ejecutar semillas2001–2012 ni campaña120 |
| F6-N / DEC-G00 y corpus histórico | `PENDING_INDEPENDENT_WORKSTREAM` | 289 casos históricos BLOCKED; no declararlos FAIL ni PASS |
| Conformidad canónica global, Hitos B/C | `NOT_ESTABLISHED` | No certificación normativa integral |
| Interoperabilidad con motor independiente | `NOT_ESTABLISHED` | Replay del mismo motor no basta |
| CC-04 | `OPEN_OUTSIDE_APPROVED_PROFILE` | Radio legal grande no demostrado operacional |
| CC-05 | `OPEN_OUTSIDE_APPROVED_PROFILE` | Rule/radio0 no soportado |
| Harness TITAN CL-T01/02 | `OPEN_BEFORE_G2` | Falta política de prefijo/errores y control efectivo global/RSS |
| OneDrive / respaldo independiente | `NOT_VERIFIED` | La verificación local documentada no equivale a OneDrive verificado |
| Productividad marginal/compuesta | `NOT_ESTABLISHED` | Un caso de adaptación no demuestra causalidad ni economía recurrente |
| RDL-PB-001 v0.1 | `PROPOSED_NOT_ADOPTED` | Su evaluación definitiva CL-D es un proceso separado |

También permanece la deuda legacy documentada (9 pruebas con expectativas históricas incompatibles); no se reescriben archivos, resultados ni categorías de aceptación para aparentar cumplimiento.

## 5. Evidencia aceptada y límites de la aceptación

Se recibe el dictamen `GO_WITHIN_APPROVED_OPERATIONAL_SCOPE` del cierre técnico, sustentado por 616 pruebas de contrato actuales PASS, cinco pruebas focalizadas TITAN PASS, 2.401 combinaciones y 7.903 contrastes sin divergencias, inventario de 630 archivos base preservados, revisión de integridad documental y expediente P01 recuperable. **Estos conteos son propiedades de ejecuciones identificadas, no afirmaciones de cobertura universal ni independencia estadística.**

La matriz y el informe explican los nueve fallos legacy, la ausencia del corpus normativo auténtico y la limitación de lectura semántica manual selectiva. Se aprueba la congelación a pesar de estas exclusiones **porque no se identificó un bloqueante demostrado dentro del perfil operacional elegido**, no porque se haya demostrado ausencia general de defectos.

La aceptación del presente acto no autoriza migraciones, cambios funcionales, reejecuciones de evidencia histórica ni publicación de información privada.

## 6. Control posterior de cambios y reapertura

- Mantener el núcleo y los contratos identificados por el árbol congelado como baseline; nuevos adaptadores podrán trabajar fuera del núcleo sin alterar su historial.
- Ante un cambio al núcleo, discrepancia en hashes, defecto bloqueante verificado en el perfil aprobado o nueva fuente normativa relevante, abrir revisión focalizada y registrar nuevo identificador de versión.
- Ante una nueva campaña, requerir identidad, protocolo, recursos, autorización y protecciones del ejecutor propias; **esta aprobación no es un permiso de `run`**.
- Mantener las evidencias y resultados negativos originales inmutables, con sus referencias e identidades.
- No cerrar RC1, TITAN G2 ni F6-N por implicación. Sus puertas requieren decisiones separadas.

## 7. Siguiente trabajo: evaluación estratégica-operacional del Playbook

WORLD-LAB, como activo técnico, queda aprobado **en su alcance operacional**. Se procederá de forma separada a examinar `RDL-PB-001 v0.1`, su trazabilidad a la especificación estratégica, los doce criterios de §22, los costos de adopción, su capacidad para servir a investigaciones tecnológicas distintas y los ajustes focalizados necesarios. No se transformará retrospectivamente la documentación histórica para aparentar conformidad con una propuesta posterior.

**Decisión final de esta acta:** `WORLD_LAB_OPERATIONAL_FREEZE_APPROVED_WITH_EXCLUSIONS`. No se declara `WORLD_LAB_GLOBALLY_CONFORMANT`, `TITAN_G2_APPROVED`, `RC1_COMPLETE` ni `PLAYBOOK_ADOPTED`.

---
*Procedencia de aprobación: mensaje explícito del propietario en esta conversación el 20 de noviembre de 2026, posterior al examen del candidato y de su dictamen. La autoridad se registra como decisión humana; no se atribuye ninguna firma criptográfica ni ejecución adicional.*
