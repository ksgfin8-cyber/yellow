# REQUIREMENTS_RECOVERY_REPORT — F5D-001

**Análisis documental; recuperación PARTIAL / EXTERNAL_SOURCE_REQUIRED.**
Base `a3fb5b823bfdf74a981e9acf9e10bb30cc18b478`, main posterior al PR #33.
No se ha agotado la recuperación: existe una fuente externa identificada por el
responsable que no está disponible entre los archivos suministrados.

## Fuentes verificadas

[sources.json](sources.json) fija bytes SHA-256 de S025/S026, H034/HINIT,
HINLINE y las capturas nuevas OWNER/ORDER. Normas vigentes completas disponibles:
v0.2.5 y D-01. H034 reproduce §34.1–9 y V1; HINIT contiene INIT-004. HINLINE y OWNER
preservan declaraciones concretas del responsable sobre mapa, lifecycle, eventos,
Feedback, entity_states y terminación, distinguiendo ingeniería de historia.
No se afirma autenticación independiente del manuscrito íntegro v0.2.4 ni que un
hash calculado hoy sea un hash histórico. ORDER es autorización de trabajo y pista,
no una enmienda normativa. F5-A/B/C siguen siendo evidencia, no autoridad.

Se inspeccionaron los documentos exigidos: v0.2.5, D-01, IMPLEMENTATION_STATUS,
CONFORMANCE_MATRIX, CONFORMANCE_ACCEPTANCE_PROPOSAL, ACCEPTANCE_PROFILE_F5-C,
conformance/profile y conformance/sources; además código y suites directamente
relacionadas. [recovery.json](recovery.json) conserva inventario de las30 órdenes/
consultas adjuntas accesibles, sus hashes al examen y nombres de rutas históricas
localizables en Git. No apareció una copia completa identificable de v0.2.4 o
v0.2.3. La búsqueda de nombres no prueba inexistencia global ni cobertura de ramas
remotas no recuperadas. No se accedió al archivo privado ni a Biblioteca de ChatGPT.

## Fuentes externas necesarias

| ID | Estado | Aportación anunciada y reconciliación |
|---|---|---|
| EXT-024 | EXTERNAL_SOURCE_REQUIRED | Documento del responsable titulado WORLD-LAB v0.2.4 — Especificación canónica consolidada, aproximadamente1300 líneas; anuncia I54–I66, §25.9 y §36. Debe verificarse qué otras cláusulas contiene. |
| EXT-023 | EXTERNAL_SOURCE_REQUIRED | Pista concreta de v0.2.3 para I01–I53; no se presupone que todos se definan allí ni cuál es su redacción. |

Ambas necesitan copia íntegra sin alteración, identificación de versión/origen y
procedencia proporcionada por el responsable. El hash se calculará **al recibir**
los bytes; original histórico y autenticación permanecen null. Cada cláusula se
contrastará con v0.2.5, D-01 y aclaraciones autorizadas, no se adoptará por antigüedad.
No se exige entregar credenciales ni acceso indiscriminado a conversaciones.

EXT-024 permite investigar al menos WL-R-INVARIANTS-LEGACY,
WL-R-REPLAY-INVARIANT y WL-R-CORPUS. Interfaces, acciones, eventos, dinámica,
§§35.1–4 y §39 son objetivos de inspección adicional cuando llegue; **no afirmaciones
sobre contenidos ya leídos**. EXT-023 se solicita para la familia anterior y su
vigencia, sin reconstruir I01–I53. [66 referencias opacas](recovery.json) permanecen
individualmente visibles; ninguna definición se inventa.

## Cierre que no se alcanza todavía

No puede afirmarse agotamiento, equivalencia global ni universo normativo completo.
La entrega F5-D termina el expediente con esa dependencia explícita; la ingesta de
las fuentes anunciadas es condición necesaria para decidir si bastará consolidar
v0.2.6 o hará falta una revisión. No aprobar por anticipado políticas sobre contratos
que esas fuentes podrían determinar.

La orden original se archiva en base64 para preservar exactamente sus espacios
Markdown sin introducir whitespace en el diff. Lectura: `base64 --decode
docs/f5-d/sources/F5D-001-order.b64`. Se verifican hash almacenado y decodificado;
esta captura no es el documento histórico requerido.
