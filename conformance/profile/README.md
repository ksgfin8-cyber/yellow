# Perfil candidato F5-C

**No aprobado; puerta HOLD.** Documento principal:
[ACCEPTANCE_PROFILE_F5-C.md](../../docs/ACCEPTANCE_PROFILE_F5-C.md).
Manifiesto solicitado: [acceptance-profile-candidate.json](../acceptance-profile-candidate.json).
El lock fija integridad, no autoridad ni aprobación.

Reproducción desde la raíz, sin instalar dependencias:

```bash
python conformance/profile/build_inventory.py
python conformance/profile/build_static_review.py
python conformance/profile/build_vectors.py
python conformance/profile/build_gaps.py
python conformance/profile/build_quality.py
python conformance/profile/build_candidate.py
node conformance/profile/validate.cjs /tmp/profile-validation.json
node tests/f5-c.test.cjs
```

Los builders no cargan el motor para definir obligaciones ni calcular esperados.
La revisión de arquitectura lee fuentes como evidencia con SHA/funciones/intervalos,
no como autoridad. Las propuestas de bytes usan Python; su comprobación independiente
usa el oráculo Buffer/BigInt, no un segundo WORLD.

- clause-inventory.json: fichas completas del texto disponible y referencias opacas.
  Indexar cada línea no reconstruye el significado de un documento ausente.
- contract-gaps.json + authority-breach-register.json: clases C/D/E y decisiones
  recomendadas con texto disponible/ausente, impacto, alternativas, precisión/tests.
- corpus-quality-review.json: revisión de114 casos, sin cambios de categoría/esperado.
- sufficiency-matrix.json: condición de suficiencia por unidad, sin promover los35
  ejemplos de F5-B. Solo tres conjuntos finitos de referencia están satisfechos.
- architecture-review.json: revisión acotada y5 notas P2 de comentarios legacy;
  no prueba formal universal ni corrección productiva.
- vector-candidates.json: nueve PV-F5C propuestos con estados/bytes/hashes exactos;
  cero V2–V10 recuperados/adoptados.
- sources-candidate.json y owner-fragments.md: prioridad vigente y fragmentos ya
  transmitidos por el responsable, con límites de atribución explícitos.

Los515 marcadores obligatorios no son515 obligaciones semánticas independientes:
se mantienen fragmentos/alias y66 IDs opacos para no omitirlos. El universo
contractual incorporado **no está completamente identificado**; por eso HOLD.
Todo criterio obligatorio permanece, aunque falte código, prueba o definición.

Las50 entradas F5-A, las114 F5-B, sus oráculos/reportes, normas y producción quedan
intactos. Los289 bloqueos originales no desaparecen. El nuevo manifiesto no cambia
el runner ni aprueba el corpus sustituto, y los tests del perfil no son nuevos T.
