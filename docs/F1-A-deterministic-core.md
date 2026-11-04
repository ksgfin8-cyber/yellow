# WORLD-LAB F1-A — Núcleo determinista

## Alcance y fuente

Rama: `dev/f1-a-deterministic-core`. Base: `ad7cc990201193714875f7b7dfba26375dee0b40`.
Fuente normativa leída: `docs/WORLD-LAB_v0.2.5_canonical_transcripcion.md`
en el objeto Git `0b4b048b4306d57c2cb4df2d464cbe89dc7456df` (la copia
local base todavía no contiene ese documento). No se modifica la fuente normativa.

Incremento limitado a `js/core/prng.js`, `js/core/seed.js`, la dependencia
UTF-8/FNV `js/core/hash.js`, pruebas específicas y este informe.
WORLD, EXPERIMENT, RECORDER, REPLAY y las pruebas originales quedan intactos.
No se ejecuta F1-B, no se hace merge ni despliegue.

## Contratos implementados

- §10.1, §10.4, I-67–I-68: Xorshift32 con reducciones uint32 y desplazamiento
  lógico. Estado/semilla: Number entero entre 1 y 4294967295. No se truncan,
  convierten ni envuelven entradas inválidas. Cero produce
  `ContractError("rng zero state")`. Se valida el candidato antes de guardarlo.
- §10.2: `next_float()` consume una extracción y devuelve `next()/4294967296.0`.
- §10.3: `next_int(a,b)` usa `n=b-a+1`,
  `limit=2^32-(2^32 mod n)` y acepta exclusivamente `u < limit`,
  devolviendo `a+(u mod n)`. No se reemplaza este algoritmo por escalado float.
- Estado: `get_state()` y `set_state()` permiten restaurar exactamente la
  secuencia; un setter inválido no modifica el estado previo.
- §11.6: `derive_seed` exige base uint32 no cero y namespace Unicode válido.
  Material: decimal ASCII sin ceros iniciales + byte `:` + namespace, sin
  normalización. FNV-1a de sus bytes UTF-8; hash cero se convierte en semilla 1.
- §24.1: FNV-1a conserva offset 0x811c9dc5 y primo 0x01000193.
  La multiplicación modular usa `Math.imul`.

## Decisiones internas

Se mantienen scripts clásicos y las APIs existentes; no se añade gestor de
paquetes ni dependencias externas. Orden de carga: `prng.js`, `hash.js`,
`seed.js`, igual que en index.html. `ContractError` se define en prng.js para
no introducir un nuevo script ni alterar el HTML fuera del incremento.
Los consumidores aislados de hash/seed deben cargar antes prng.js.

UTF-8 valida parejas de surrogates y rechaza cualquier surrogate aislado.
Admite namespace vacío, NUL, caracteres astrales y secuencias canónicamente
equivalentes sin normalizarlas. En el dominio uint32, `String(base_seed)`
produce exactamente DECIMAL_ASCII, sin exponente ni ceros iniciales.

El intervalo soportado por `next_int` tiene extremos Number enteros seguros,
`a <= b` y entre 1 y 2^32 valores. Se valida antes de consumir RNG. Es una
frontera de representación de esta implementación, no una ampliación del
contrato normativo: §10.3 no explicita el dominio completo de los extremos.
Con n > 2^32 su algoritmo daría limit=0 y no terminaría; esta implementación
lo rechaza. Un contrato posterior que exija otros dominios necesita revisión.
No se establece soporte BigInt para los parámetros públicos.

El singleton consume una extracción, como prescribe el pseudocódigo.
La selección con rechazo puede consumir más de una; restaurar el estado
reproduce también ese consumo. No se cambia el algoritmo para compensar la
exclusión normativa del estado cero de Xorshift32 ni se añade otra distribución.

Los mensajes diagnósticos de dominios inválidos no fijados en §10/§11 son
internos. Su integración con el catálogo global de errores queda fuera de F1-A.

## Requisitos y pruebas nuevas

IDs locales F1A; no se presentan como implementaciones de T266/T276 completos.

| Requisito | Pruebas |
|---|---|
| Xorshift32, máscaras, vector normativo | F1A-01, F1A-02 |
| Dominio uint32, cero y confirmación de estado | F1A-03, F1A-04 |
| Restauración exacta y setter atómico | F1A-05, F1A-06 |
| Float, divisor y consumo | F1A-07 |
| Rechazo, igualdad con limit y consumo múltiple | F1A-08 |
| Singleton y rango completo de 2^32 valores | F1A-09 |
| Intervalos inválidos sin consumo; extremos seguros | F1A-10, F1A-11 |
| FNV normativo | F1A-12 |
| Vectores derive_seed | F1A-13 |
| Dominio de semilla base | F1A-14 |
| Codificación UTF-8 y pares astrales | F1A-15 |
| Surrogates aislados y tipos inválidos | F1A-16 |
| Decimal ASCII, vacío, NUL, no normalización | F1A-17 |
| Hash cero → semilla 1 | F1A-18 |

F1A-02 compara 1000 transiciones de cada semilla 1, 0x7fffffff,
0x80000000 y 0xffffffff con un oráculo BigInt independiente de los bitwise
Number. F1A-17 calcula FNV con Buffer UTF-8 y multiplicación BigInt.
F1A-08 inyecta extracciones para forzar el rechazo; F1A-18 inyecta hash cero
para cubrir esa rama, sin afirmar haber encontrado una preimagen real.

## Vectores comprobados

| Entrada | Resultado |
|---|---|
| Xorshift32, semilla 1, extracciones 1–3 | 270369, 67634689, 2647435461 |
| FNV-1a de cadena vacía | 0x811c9dc5 |
| FNV-1a de `a` | 0xe40c292c |
| FNV-1a de `foobar` | 0xbf9cf968 |
| derive_seed(1, "world") | 2448580590 / 0x91f25fee |
| derive_seed(1, "random_agent") | 84506387 / 0x05097713 |

## Ejecución

Directorio: `/workspace/yellow`. Runtime: Node.js v24.22.1.

```sh
node tests/f1-a.test.cjs
```

Resultado: **18 pruebas, 18 PASS, 0 FAIL, 0 omitidas; exit 0**.
Se usa ejecución directa de node:test: en este runtime `node --test` solo
reporta un contenedor de archivo; la ejecución directa expone los 18 casos.

Comparación de pruebas heredadas, con los mismos archivos HTML y suite original:

```sh
node tests/f1-a-legacy.cjs --baseline
node tests/f1-a-legacy.cjs
```

| Implementación core | Ejecutadas | PASS | FAIL | Salida |
|---|---:|---:|---:|---:|
| Base ad7cc99 | 22 | 4 | 18 | 1 |
| F1-A | 22 | 4 | 18 | 1 |

En ambas, T01, T02, T03 y T18 pasan. Las otras 18 fallan con
`Cell is not defined`; index.html referencia cell.js y effect.js inexistentes.
No se cambia su carga para ocultar el fallo. T18 captura cualquier excepción,
incluida su propia aserción, por lo que PASS no demuestra su intención.
El runner usa `git show` para leer únicamente los tres módulos core anteriores;
no cambia el checkout. En este sandbox el modo baseline necesitó ejecución
con permisos para lanzar el subproceso Git; su primer intento EPERM no se
contó como ejecución de pruebas. El reintento sí ejecutó los 22 casos.

`git diff --check`: sin errores.

## Diferencias respecto a la base

- PRNG rechaza semillas/estados que antes truncaba o envolvía mediante `>>> 0`.
- next() conserva los vectores y valida cero antes de confirmar estado.
- next_float mantiene su cálculo y secuencia para semillas válidas.
- next_int cambia de escalado float a rechazo y módulo; sus resultados y,
  cuando hay rechazo, el consumo RNG cambian intencionalmente.
- derive_seed conserva los vectores ASCII, restringe base_seed a uint32 no cero,
  admite namespace vacío y rechaza UTF-8 inválido en vez de codificar surrogates.
- hash.js conserva FNV para Unicode válido; endurece la codificación inválida.

## Límites y bloqueos

F1-A tiene evidencia unitaria de los contratos indicados. No implica
conformidad global, replay ni interoperabilidad verificados. No se ejecutó
la suite canónica T01–T280 ni se verificó integración de WORLD.
No se implementaron WLS1, agentes, ciclo de ticks ni rollback del experimento.
Las ausencias de v0.2.4 y de pruebas canónicas siguen pendientes para fases
posteriores. El dominio completo de next_int y la integración del catálogo
global requieren documentación adicional si se amplía el alcance.
No se modificaron reglas FROZEN ni se equiparó congelación con prueba empírica.
