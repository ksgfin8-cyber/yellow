# F5-B — cobertura y preparación de aceptación

Base: `b13d637dd405d363442803ad53821f5a6c6f4a62`. Autoridad vigente S026 sobre
S025. **No se modifica §37 ni se aprueba un corpus sustituto.**

```bash
node conformance/build-f5-b.cjs
node conformance/build-atomic-f5-b.cjs
node conformance/runner.cjs --cases cases-f5-b.json --out conformance/results/f5-b.json
node conformance/build-preacceptance-f5-b.cjs
node conformance/mutation-f5-b.cjs conformance/results/f5-b-mutants.json
node tests/f5-a.test.cjs
node tests/f5-b.test.cjs
```

Sin `--cases`, el runner sigue ejecutando exactamente F5-A: 50 entradas y los 289
bloqueos originales. La opción elige otro manifiesto bajo conformance/ sin alterar
la comparación, aislamiento, categorías o resultados del runner. No es un rediseño.
`cases.json`, sus 50 expectativas/oráculos y results/f5-a.json permanecen intactos;
el test F5B-INFRA-01 compara el reporte completo con el artefacto previo.

## Artefactos y lectura de resultados

- [cases-f5-b.json](cases-f5-b.json): las 50 entradas heredadas, idénticas y en
  el mismo orden, seguidas de 64 nuevas (58 ND y seis ER). Las nuevas se ordenan
  por prioridad de riesgo; esa prioridad no altera su autoridad.
- [f5-b-manifest.json](f5-b-manifest.json): SHA del manifiesto heredado, base e IDs
  añadidos. `fixture_base` del reporte conserva el contexto F5-A; la base de este
  incremento está en este manifiesto. El motor productivo no cambia entre ambas.
- [atomic-obligations-f5-b.json](atomic-obligations-f5-b.json): 48 filas enlazadas
  a obligations.json, con fuentes/localizadores, pre/postcondiciones, operación,
  oráculo, casos y evidencia alternativa. No reemplaza ni reescribe el inventario
  histórico. Cada fila mantiene explícita cobertura de dominio parcial.
- [results/f5-b.json](results/f5-b.json): **114 PASS / 0 FAIL / 289 BLOCKED /
  0 UNTESTED**. Categorías: seis vectores recuperados, 97 derivados, once ER.
  Un PASS se limita a la entrada/aserción concreta, no equivale a suficiencia
  universal ni a un T histórico ejecutado.
- [results/preacceptance-f5-b.json](results/preacceptance-f5-b.json) y
  [matriz legible](../docs/CONFORMANCE_PREACCEPTANCE_F5-B.md): 35 filas satisfechas
  para ejemplos ejecutados, cinco parciales, cuatro bloqueadas por documentación,
  cero FAIL reproducibles, tres de evidencia alternativa no ejecutable y una
  que necesita otra implementación. Estos números son filas de obligaciones,
  no tests ni los 289 bloqueos del corpus.
- [recovery-f5-b.json](recovery-f5-b.json): búsqueda final delimitada. No se obtuvo
  otro archivo histórico verificable; no hay acceso a la Biblioteca de ChatGPT.
- [propuesta de aceptación](../docs/CONFORMANCE_ACCEPTANCE_PROPOSAL.md): escenarios
  A/B y texto exacto propuesto para §37, marcado no aprobado/no vigente.

## Independencia y capacidad de refutación

Las expectativas se construyen sin cargar yellow: BigInt para PRNG/FNV, Buffer
para bytes WLS1 y binary64 (incluidos dos empates ties-to-even y -0), fixtures manuales, reglas de dominio y relaciones
metamórficas declaradas. RNG-rechazo usa una secuencia de draws prescrita para
alcanzar exactamente el límite y medir su rechazo. Rollback inyecta fallos en
acción, lifecycle, dinámica, sync y validación con estado efectivo/RNG conocidos.

Los prefijos positivos completos MOVE/WAIT dependen de políticas actuales de
ActionResult/Feedback: son ER, con referencia al corte operativo anterior. Los
ND negativos reciben esos fixtures como entradas explícitas y contrastan rechazo
por una obligación normativa identificada; su precondición de compatibilidad
de esquema queda declarada. No recuperan un contrato histórico de salida ausente.
La regeneración/entrada de recursos, hazards y propiedad de registros se mantienen
ER cuando la precisión procede de una decisión de ingeniería.

Los contrastes incluyen una colisión FNV real con iguales hashes WORLD/FULL
para energías distintas (collision-f5-b.json), hashes retenidos con estado diferente, estado incorrecto
rehasheado independientemente, salto temporal, eventos tipados desordenados,
secuencias no contiguas, costes/flags distintos, Observation/Feedback divergentes,
origen/RNG alterados, Number inseguro y representaciones Number/BigInt admisibles.
Cada rechazo se empareja con un fixture positivo que también se ejecuta.

[mutation-f5-b.cjs](mutation-f5-b.cjs) ejecuta realmente cada caso nuevo y después
corrompe un campo/byte de respuesta o suprime la excepción. **64/64 corrupciones
se detectan como FAIL, con baseline PASS**. Son fallos inyectados de prueba, no
64 defectos productivos. Esta auditoría comprueba sensibilidad de comparación,
no equivale a un mutation score exhaustivo de implementaciones incorrectas.
Los reportes evitan duraciones/relojes variables y se comparan byte a byte.

La separación WORLD/AGENT se contrasta variando draws de un RNG privado del agente
sin cambiar WAIT. Es una relación metamórfica dentro de un motor, no otra
implementación ni prueba estática completa de ausencia de flujos prohibidos.
Para ello la matriz solicita evidencia alternativa específica. Renderer conserva
la evidencia de integración de ingeniería en Chromium, sin nuevo oracle canónico
exhaustivo de interfaz.

## Reproducción y gobernanza

```bash
node conformance/runner.cjs --out /tmp/f5a-unchanged.json
cmp conformance/results/f5-a.json /tmp/f5a-unchanged.json
node conformance/runner.cjs --cases cases-f5-b.json --out /tmp/f5b-repeat.json
cmp conformance/results/f5-b.json /tmp/f5b-repeat.json
```

Los IDs y expectativas F5-A no se acomodan al código. Los T sin definición y
V2–V10 siguen BLOCKED. La propuesta sobre aceptación necesita aprobación expresa
posterior; ningún total de PASS la aprueba. **GO para revisión de cobertura y del
expediente; HOLD para resolver/declarar la base de aceptación canónica.** No se
inicia otra implementación ni se declaran hitos B/C.
