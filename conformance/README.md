# WORLD-LAB — infraestructura F5-A

Autoridad v0.2.6 D-01 sobre v0.2.5. Este directorio es infraestructura de prueba,
no una nueva especificación. No modifica el motor ni autentica textos ausentes.
La procedencia histórica de checkpoints y la causalidad externa de errores no
se deducen de la continuidad de un prefijo. No se declaran los hitos B/C.

Desde la raíz, con Node 24 (sin dependencias adicionales ni navegador):

```bash
node conformance/runner.cjs --out /tmp/worldlab-conformance.json
node tests/f5-a.test.cjs
node conformance/runner.cjs --select CR-FNV-A --out /tmp/selected.json
```

El runner devuelve exit0 si termina sin FAIL, exit1 si algún caso falla y exit2
si la infraestructura/solicitud es inválida. **Exit0 no significa conformidad:**
BLOCKED y UNTESTED permanecen visibles. El reporte siempre indica que la
conformidad global no está establecida. `--select` marca como UNTESTED todos los
ejecutables no seleccionados; no los borra ni los cuenta como PASS.

## Artefactos y categorías

- [corpus.json](corpus.json): 280 filas T y diez vectores, con versión, fuente,
  cláusula, entrada/procedimiento/esperado, recuperación, implementación y ejecución.
  Valores null significan contenido no recuperado, nunca un oráculo que pasa.
- [sources.json](sources.json): fuentes comprobables y SHA-256. S025/S026 son
  textos disponibles del repositorio. H034/HINIT son órdenes del propietario que
  reproducen fragmentos recuperados; se preservan literalmente mediante captura
  base64, incluidos CRLF y espacios originales. El manifiesto comprueba tanto
  archivo almacenado como original decodificado. Para leerlos:
  `base64 --decode conformance/sources/F3-D-2-recovered-order.b64`.
  No son copias completas ni autenticación independiente de todo v0.2.4.
- [recovery.json](recovery.json): alcance de búsqueda, objetos Git vacíos,
  historial y metadatos de 26 órdenes accesibles. No se afirma haber leído otras
  conversaciones, ramas no recuperadas o documentos históricos completos.
- [cases.json](cases.json): entradas y expectativas ejecutables, sin funciones
  del motor. Cada caso lleva categoría fija, fuente, cláusula y método del oráculo.
- [obligations.json](obligations.json) y [matriz](../docs/CONFORMANCE_MATRIX.md):
  norma→casos; cases.json/reporte permiten casos→norma→fuente→oráculo→resultado.
- [engineering-regressions.json](engineering-regressions.json): nombres y hashes
  de suites F1–F4-G. Sus IDs B01/T01/etc. permanecen acotados a archivo y familia;
  una coincidencia de nombre no autentica B-1 ni T01 canónicos.
- [results/f5-a.json](results/f5-a.json): ejecución íntegra, incluidos bloqueos,
  resumen por categoría/cláusula, excepciones/causas y datos exactos observados.

**CANONICAL-RECOVERED:** seis envolturas de vectores identificables por fuente:
FNV `""`, `"a"`, `"foobar"` (§24.5), semillas `(1,"world")`,
`(1,"random_agent")` (§11.6) y V1 de 59 bytes (§34.9 recuperado).
Los IDs CR-* identifican envolturas nuevas; **no son IDs históricos T**.
El campo original_reference conserva la identidad literal del vector. El estado
de entrada V1 se reconstruye sin ambigüedad desde sus bytes y layout recuperados,
sin inicialización ni resolución de lifecycle. Sus hashes calculados de nuevo
son ND-HASH-V1, no valores normativos históricos inventados.

**NORMATIVE-DERIVED:** 39 casos nuevos con cláusula y oráculo explícitos. No son
T01–T280. La tabla Xorshift §10.6 no fija expresamente la semilla en el texto
disponible: los casos de semilla 1/2^31/UINT32_MAX usan BigInt independiente y
se clasifican ND, sin afirmar recuperación íntegra de aquel vector.

**ENGINEERING-REGRESSION:** tres proyecciones completas de replay con los esquemas
y políticas actuales de ActionResult/Observation. Expectativas manuales y hashes
independientes mejoran su rigor, pero no convierten contratos históricos ausentes
en norma recuperada. Las suites F1–F4-G y las pruebas del runner son también
evidencia de ingeniería y se reportan separadamente. Se añaden dos casos ER de
instrumentación específica de yellow (reconstrucciones/llamadas); cinco ER en total.
Estos contadores no se exigen a otro motor como oráculo normativo.

Los 280 T incompletos y nueve vectores pendientes **no tienen categoría de test
ejecutable**. Se agrupan como UNCLASSIFIED-SOURCE-UNAVAILABLE, con category=null,
sin introducir una cuarta clase de pruebas ni calificarlos de recuperados.
248 T tienen referencia parcial en §36; 32 carecen de asignación (T61–80/T93–104).
Ni siquiera T266–T280 tienen entradas/procedimientos/esperados individuales
suficientes: su trazabilidad temática no reconstruye su identidad histórica.

## Oráculos y aislamiento

[oracles.cjs](oracles.cjs) usa BigInt para Xorshift/FNV y Buffer para BE uint64,
UTF-8, binary64 y WLS1. No importa el motor ni consulta sus salidas. V1/FNV/seed
recuperados mantienen literales de la fuente; los vectores nuevos se calculan
separadamente y quedan fijados en JSON. Los casos con resultado físico mínimo
usan snapshots manuales, WAIT de coste cero, límites pequeños o próximos a MAX,
sin generar mundos ni ejecutar cantidades astronómicas de pasos.

Cada caso crea un adaptador/VM nuevos. Las entradas se decodifican/copían antes
de pasarlas al adaptador, que no recibe el oráculo. La comparación inspecciona
todo campo, esquema, número y byte; nunca usa igualdad de hashes como sustituto
de igualdad estructural. Map se transporta con entradas explícitas (el dominio
WORLD actual tiene exactamente una entidad). Una diferencia de representación
de salida donde se exige canonicalización también es observable.

La inyección de fallo de rollback y los contadores de reconstrucción se limitan
al adaptador de prueba y a esa instancia; no escriben archivos productivos.
La independencia aquí es respecto del cálculo de expectativas, no una segunda
implementación completa ni una auditoría institucional externa.

## Interfaz para una implementación futura

```bash
node conformance/runner.cjs --adapter /ruta/otro-adaptador.cjs --out /tmp/otro.json
```

El módulo exporta `{id, createAdapter({root})}`. El runner invoca una fábrica por
caso; devuelve `{execute(operation, input)}`, síncrono o Promise. `operation` e
`input` son exactamente los fijados en cases.json. La expectativa no se envía al
adaptador. Un adaptador externo puede transportar `operation` y la entrada wire
a otro proceso y decodificar su respuesta; no debe modificar expectativas.

Wire JSON distingue `bigint` decimal, `binary64` excepcional por 16 dígitos hex,
`map` con entries, `bytes` con hex y undefined explícito. Números finitos JSON
conservan su valor binary64; -0 usa tag. `wire.cjs` implementa el codec. Los objetos
con `$type` están reservados al protocolo. Cada resultado registra operación,
entrada, expectativa, observado, excepción/causa, fuente y oráculo. No incluye
relojes de ejecución ni duraciones: dos ejecuciones idénticas producen los mismos
bytes. fixture_base identifica el contexto del corpus, no el commit de una futura
implementación externa. El ID del adaptador identifica qué implementación se probó.
Los hashes case_manifest_sha256 y corpus_manifest_sha256 permiten exigir exactamente
las mismas entradas/expectativas e inventario al contrastar reportes futuros.

Operaciones y DTO se fijan en cases.json/adapter.cjs: prng, derive_seed, fnv,
wls1, hash_state, config, termination, tick_order, rollback, dynamics, initial_events,
replay y validate. `state.config` en los DTO de operaciones aisladas suministra
contexto al adaptador; no se agrega ese campo al WorldState evaluado. Replay recibe
el contexto cerrado de ocho campos y retorna el ReplayResult completo. Validate
retorna ambos predicados. validate_work, solo en casos ER, añade contadores de
prueba/reconstrucción/transiciones específicos de yellow.
La instrumentación es una capacidad que el futuro adaptador debe implementar
explícitamente para esos ER, no una API productiva ni un requisito de conformidad
para otro motor. F5-B podrá seleccionar los IDs CR/ND sin alterar sus entradas u
oráculos; los ER se contrastan separadamente. F5-A no ejecuta otro adaptador ni
reclama interoperabilidad; esto prepara la frontera de F5-B.

## Reproducción y creación formal de un sustituto

```bash
node conformance/build-corpus.cjs
node conformance/build-trace.cjs
node conformance/runner.cjs --out /tmp/reproduced.json
```

Los dos builders no cargan el motor ni sus expectativas previas. Fuentes originales
deben conservar sus hashes; el runner rechaza una alteración. Para comparar con
la evidencia publicada: `cmp /tmp/reproduced.json conformance/results/f5-a.json`.
Regenerar una expectativa no autoriza cambiarla para acomodar el producto.

Si no aparecen nuevas fuentes auténticas, el procedimiento de corpus sustituto
es: (1) enumerar lagunas y obligación vigente exacta; (2) proponer nombres nuevos,
entradas, procedimiento, oráculo independiente y límites; (3) solicitar una orden
separada para aprobar ese corpus y cualquier revisión del criterio de aceptación;
(4) versionar/publicar expectativas antes de contrastarlas con otro motor;
(5) ejecutar ambos sin acomodar expectativas y registrar discrepancias.
Los ND autorizados en F5-A son evidencia parcial inicial, **no el corpus sustituto
completo ni una resolución automática del requisito T01–T280**. V2–V10 siguen
sin bytes fijados y no se rellenan con resultados del motor auditado.
