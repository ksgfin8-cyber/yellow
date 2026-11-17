# WORLD-LAB — Engineering Decisions

Registro **informativo y operacional**, no autoridad normativa. Autorización:
orden F6-A del responsable, recibida el **2026-11-13 (America/Guayaquil)**;
[captura íntegra](f6-a/F6-A-order.b64), lectura mediante
`base64 --decode docs/f6-a/F6-A-order.b64`. Una aprobación ejecutiva no modifica
v0.2.5/D-01, §37 ni prueba conformidad. No sustituye decisiones técnicas anteriores.

Estados: **APPROVED**=decisión autorizada; **IMPLEMENTED**=mecanismo realizado en
un alcance identificado; **VERIFIED**=resultado ejecutado y comprobado;
**SUPERSEDED**=sustituida por otro ID explícito. Registrar por separado aprobación
y ejecución. No asignar VERIFIED a una intención, ni cerrar un alcance permanente
por una comprobación puntual. IDs estables: ED-001…ED-006; no reutilizarlos.

| ID / fecha | Problema y decisión aprobada | Justificación y evidencia | Ejecución / resultado verificable |
|---|---|---|---|
| ED-001 · 2026-11-13 · **APPROVED** | Conservar el núcleo actual; permitir correcciones focalizadas respaldadas por defectos demostrados | Hay implementación y regresiones sustanciales; no se demostró necesidad de reescritura. [Base y ejecución F6-A](F6-A-readiness.md#baseline) | **VERIFIED solo en F6-A:** ningún archivo previo de producción, norma o expectativas cambió. No certifica corrección global ni impide cambios futuros autorizados. |
| ED-002 · 2026-11-13 · **APPROVED** | Desarrollar un piloto científico reproducible de extremo a extremo, con algoritmo adicional relevante y baselines | La demo no cubre campaña/archivo/análisis. [Protocolo P01](F6-A-pilot-protocol.md) | **IMPLEMENTED / VERIFIED en P01 E3/E4; aceptación técnica/científica E5 conservada:** 256 episodios completos, 0 fallidos, 256 replay restaurados MATCH; H_PLUS_SUPPORTED solo en 32 semillas (media D=11,125). **C2 VERIFIED_EXTERNAL_BACKUP**, copia local Windows verificada por el propietario según confirmación comunicada. Condición HOLD_C2 satisfecha; [cierre P01 en su alcance](p01-c2-closure/C2_CLOSURE_REPORT.md) emitido para revisión. E5 histórico intacto; no aceptación normativa global. |
| ED-003 · 2026-11-13 · **APPROVED** | Continuar reconciliación normativa dirigida en paralelo al piloto, sin cambiar silenciosamente semántica | [Fuentes externas identificadas](f5-d/REQUIREMENTS_RECOVERY_REPORT.md), D-01 vigente y [condiciones de recepción](F6-A-readiness.md#g00) | G00 sigue **EXTERNAL_SOURCE_REQUIRED**. No se obtuvo ni cotejó el manuscrito completo; recuperación no agotada. Ninguna política técnica se convierte en norma. |
| ED-004 · 2026-11-13 · **APPROVED** | Posponer nuevas mecánicas, mundos, múltiples entidades, WORLD que aprende, distribución y GUI extensa sin necesidad demostrada | Conservar alcance experimental acotado evita ampliar estados sin pregunta científica. [Dependencias F6-B](F6-A-readiness.md#f6-b) | **IMPLEMENTED en alcance F6-A:** entrega únicamente documental y verificación. No se creó framework, métrica productiva, adaptador ni arquitectura nueva. Aislamiento externo de una ejecución se propone por necesidad operacional, no como sistema distribuido. |
| ED-005 · 2026-11-13 · **APPROVED** | Mantener declaraciones separadas de operación, conformidad e interoperabilidad, con adecuación científica transversal | [Tres niveles vigentes §0.4](WORLD-LAB_v0.2.5_canonical_transcripcion.md#04-tres-niveles-de-evidencia); [puertas F6-A](F6-A-readiness.md#gates) | **VERIFIED documentalmente en E5 y cierre C2:** operación, ciencia y preservación local externa diferenciadas. C2 VERIFIED_EXTERNAL_BACKUP en el alcance de la confirmación del propietario; cierre P01 emitido para revisión. **F6-N, conformidad global e interoperabilidad independiente NOT_ESTABLISHED; OneDrive NOT_VERIFIED.** [Alcance y evidencia](p01-c2-closure/C2_CLOSURE_REPORT.md). No cierre de Hitos B/C. |
| ED-006 · 2026-11-13 · **APPROVED preparación F6-E** | Separar evaluación y exigir autorización específica ligada a una identidad verificable; conservar candidato anterior y refijar cambios operacionales | Orden F6-E E1/E2; [auditoría, diff y puerta](F6-E-preparation.md). Implementación: recibo Ed25519, pins externos de freeze y clave; no nueva autoridad normativa | **IMPLEMENTED / VERIFIED en preparación y uso autorizado E3**, con puerta de identidad/recibo/pins y orden de inicio conservadas; E4 confirmó reproducción. E5 acotado preservado. **C2 VERIFIED_EXTERNAL_BACKUP** por recepción local Windows y hashes comunicados por el propietario; condición de liberación P01 satisfecha, cierre documental para revisión. [Registro posterior](p01-c2-closure/C2_CLOSURE_REPORT.md). Transferencia/originales retenidos; no nueva ejecución ni confianza universal en el operador. |

Actualización E5: **2026-11-14T20:43:44.619137-05:00** (America/Guayaquil), solo estados de ejecución ED-002/005/006. [Informe de aceptación acotada](p01-e5/FINAL_ACCEPTANCE_REPORT.md); [captura íntegra anterior](p01-e5/ENGINEERING_DECISIONS-before-E5.md.b64). Las decisiones aprobadas y los estados ED-001/003/004 no cambian. La aceptación P01 no cierra C2 ni acredita liberación definitiva.

Actualización C2: **2026-11-17T13:02:49.583429-05:00** (America/Guayaquil). El propietario confirma recepción y SHA-256 de ambos paquetes en Windows: **C2 VERIFIED_EXTERNAL_BACKUP** en la copia local recibida. Condición HOLD_C2 de E5 satisfecha; cierre P01 en su alcance emitido para revisión. [Informe posterior](p01-c2-closure/C2_CLOSURE_REPORT.md) y [captura previa de ED](p01-c2-closure/ENGINEERING_DECISIONS-before-C2-closure.md.b64). La actualización E5 anterior es histórica y se conserva; no acredita sincronización OneDrive ni conformidad/interoperabilidad.

La versión de un protocolo y sus expectativas debe fijarse antes de sus resultados.
Si cambia la física o una interfaz observada, conservar los artefactos anteriores,
identificar la nueva revisión y revisar qué conclusiones dejan de ser comparables.
No ejecutar una sustitución normativa por actualizar este registro.

No hay IDs SUPERSEDED en esta creación. No se añaden aprendizajes no ejecutados a
[ENGINEERING_LEARNINGS](ENGINEERING_LEARNINGS.md); allí permanecen las lecciones,
aquí las decisiones y sus estados. Los informes F5-C/F5-D se conservan como evidencia
histórica de sus bases, no como validadores universales de cambios futuros.
