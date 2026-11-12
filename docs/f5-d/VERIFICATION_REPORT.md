# VERIFICATION_REPORT — F5-D

Base: `a3fb5b823bfdf74a981e9acf9e10bb30cc18b478`, merge PR #33.
Rama `dev/f5-d-normative-reconciliation`, creada directamente de origin/main.
La verificación se refiere a integridad del expediente y regresión; no certifica
conformidad, interoperabilidad ni completitud del universo histórico.

## Resultados ejecutados

[regression-results.json](regression-results.json) identifica cada suite, comando,
SHA del archivo y resultado. Se ejecutaron28 archivos existentes F1-A–F5-C:
**511 PASS / 0 FAIL**. Seis aserciones F3-G/H consultan el baseline histórico fijo
v0.2.5; las505 restantes corresponden a la revisión actual. No son511 tests canónicos.
No se crearon ni modificaron pruebas productivas ni expectativas.

Comandos: `node tests/<cada archivo f*.test.cjs>`, listados individualmente en JSON.
No se reejecutó navegador en F5-D; los15 casos Node de F4-A sí están incluidos.
La evidencia Chromium anterior se conserva como histórica, no una ejecución nueva.

Corpus completos, ejecutados a stdout sin tocar reportes fijados:

```bash
node conformance/runner.cjs --cases cases.json
node conformance/runner.cjs --cases cases-f5-b.json
node tests/f1-a-legacy.cjs
```

F5-A:50PASS/0FAIL/289BLOCKED. F5-B:114PASS/0FAIL/289BLOCKED. Bytes de ambos reportes
idénticos a `conformance/results/f5-a.json` y `f5-b.json`, SHA registrados en JSON.
Legacy exit1:13PASS/9FAIL conocidos. T06/07/08/20/22 consumen formas retiradas
(undefined.length); T12 makeResource, T13 EffectKind y T14 makeHazard retirados;
T16 initial_state legacy inválido. No se alteraron aserciones ni se ocultaron fallos.
No sumar corpus superpuestos ni convertir289BLOCKED enPASS.

## Integridad documental y de configuración

```bash
python -B docs/f5-d/build.py
python -B docs/f5-d/build_decisions.py
python -B docs/f5-d/freeze.py
python -B docs/f5-d/validate.py
node conformance/profile/validate.cjs
```

Los builders solo leen fuentes/catalogado manual y generan análisis. El validador
comprueba IDs únicos, estados, todos los campos requeridos, dependencias existentes,
65 familias y572 trazas bidireccionales sin fuentes omitidas,66 IDs opacos sin
inventar definición, fuentes/fragmentos/literales y hashes, enlaces/anchors, ausencia
de producto/norma/expectativas modificados frente al SHA base y separación A/B.
La comprobación estructural no puede probar que la interpretación semántica sea
universalmente completa ni que una captura de dueño autentique un original ausente.
No se añade un runner físico ni segunda implementación.

`manifest.json` fija los archivos nuevos y las fuentes/código/suites inspeccionados.
El manifiesto no se incluye a sí mismo; no hay ciclo de hashes. El catálogo mantiene
sin cambios los IDs anteriores de fragmentos y las65 familias son IDs propios WL-R,
no T históricos. Asociar contexto de cláusula no certifica cada parte del contrato.

`git diff --check` y comprobación de alcance deben pasar antes de commit; después
se comprueba árbol limpio. Producción, normas, corpus, expectativas, documentos
históricos y resultados archivados se preservan íntegros. Única modificación previa
permitida: actualización operacional en IMPLEMENTATION_STATUS, sin reescribir cortes.

## Equivalencia y límites

La matriz distingue32 reformulaciones documentales de partes determinadas y33
familias con referencias/semántica incompletas. Eso **no** demuestra equivalencia
observacional universal del motor. SUPERSEDED identifica sustituciones ya autorizadas,
no nuevos cambios. No se ha demostrado una contradicción irreconciliable vigente ni
una divergencia funcional contraria a contrato totalmente determinado. OBS-CAPACITY
es limitación operacional comprobada por F2F-17; su admisibilidad contractual sigue
abierta, no se silencia ni se transforma en radio inválido.

Revisión humana y nuevas fuentes siguen siendo necesarias. Las propuestas B no se
aplican al candidato A como norma, §37 no cambia, ningún corpus sustituto se aprueba.
Estado final del expediente: entregables preparados; recuperación PARTIAL; **HOLD**
por EXT-024/EXT-023 y contenidos incorporados no resueltos. No se concluye que haga
falta una nueva versión ni que baste una edición equivalente hasta reconciliarlos.


## Comprobaciones finales ejecutadas

Validador documental aprobado:65 IDs semánticos,572 trazas originales,66 referencias
opacas,191 enlaces locales del expediente y121 archivos previos protegidos.
Revisión adicional de documentación raíz:217 enlaces comprobados. Reconstrucción
determinista de24 archivos nuevos: bytes idénticos.25 rutas preparadas, todas dentro
del alcance documental autorizado, sin patrones de credenciales/clave privada ni
artefactos Python temporales. `git diff --cached --check` aprobado tras archivar
la orden original en base64, preservando sus bytes y espacios Markdown originales.
Las normas S025/S026, producción y todos los reportes/expectativas previos conservan
sus bytes frente a la base. La cuenta de enlaces no demuestra equivalencia semántica.
