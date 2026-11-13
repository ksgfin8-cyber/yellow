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
| ED-002 · 2026-11-13 · **APPROVED** | Desarrollar un piloto científico reproducible de extremo a extremo, con algoritmo adicional relevante y baselines | La demo no cubre campaña/archivo/análisis. [Protocolo P01](F6-A-pilot-protocol.md) | **IMPLEMENTED / VERIFIED en desarrollo F6-B:** FrontierMemory, procesos aislados, archivo sin pérdida y métricas;35 pruebas nuevas y32 episodios smoke con semillas1–4, replay y repeticiones. [Evidencia y límites](F6-B-report.md). Protocolo histórico conservado; candidato de congelación pendiente de revisión. Evaluación1001–1032 **NOT EXECUTED**; piloto final y resultado científico **no VERIFIED**. |
| ED-003 · 2026-11-13 · **APPROVED** | Continuar reconciliación normativa dirigida en paralelo al piloto, sin cambiar silenciosamente semántica | [Fuentes externas identificadas](f5-d/REQUIREMENTS_RECOVERY_REPORT.md), D-01 vigente y [condiciones de recepción](F6-A-readiness.md#g00) | G00 sigue **EXTERNAL_SOURCE_REQUIRED**. No se obtuvo ni cotejó el manuscrito completo; recuperación no agotada. Ninguna política técnica se convierte en norma. |
| ED-004 · 2026-11-13 · **APPROVED** | Posponer nuevas mecánicas, mundos, múltiples entidades, WORLD que aprende, distribución y GUI extensa sin necesidad demostrada | Conservar alcance experimental acotado evita ampliar estados sin pregunta científica. [Dependencias F6-B](F6-A-readiness.md#f6-b) | **IMPLEMENTED en alcance F6-A:** entrega únicamente documental y verificación. No se creó framework, métrica productiva, adaptador ni arquitectura nueva. Aislamiento externo de una ejecución se propone por necesidad operacional, no como sistema distribuido. |
| ED-005 · 2026-11-13 · **APPROVED** | Mantener declaraciones separadas de operación, conformidad e interoperabilidad, con adecuación científica transversal | [Tres niveles vigentes §0.4](WORLD-LAB_v0.2.5_canonical_transcripcion.md#04-tres-niveles-de-evidencia); [puertas F6-A](F6-A-readiness.md#gates) | **IMPLEMENTED documentalmente** en ED y P01; cierre operacional del piloto pendiente. Conformidad/Hitos B–C no declarados. Resolver norma es precondición de conformidad, no evidencia de cumplimiento del código. |
| ED-006 · 2026-11-13 · **APPROVED preparación F6-E** | Separar evaluación y exigir autorización específica ligada a una identidad verificable; conservar candidato anterior y refijar cambios operacionales | Orden F6-E E1/E2; [auditoría, diff y puerta](F6-E-preparation.md). Implementación: recibo Ed25519, pins externos de freeze y clave; no nueva autoridad normativa | **IMPLEMENTED / VERIFIED solo en preparación:**24 tests nuevos,35 F6-B,32 smoke de desarrollo y4 comprobaciones de puerta. Dos archivos operacionales refijados; algoritmos/protocolo/motor intactos. **E3–E5 NOT EXECUTED; aprobación específica pendiente.** |

La versión de un protocolo y sus expectativas debe fijarse antes de sus resultados.
Si cambia la física o una interfaz observada, conservar los artefactos anteriores,
identificar la nueva revisión y revisar qué conclusiones dejan de ser comparables.
No ejecutar una sustitución normativa por actualizar este registro.

No hay IDs SUPERSEDED en esta creación. No se añaden aprendizajes no ejecutados a
[ENGINEERING_LEARNINGS](ENGINEERING_LEARNINGS.md); allí permanecen las lecciones,
aquí las decisiones y sus estados. Los informes F5-C/F5-D se conservan como evidencia
histórica de sus bases, no como validadores universales de cambios futuros.
