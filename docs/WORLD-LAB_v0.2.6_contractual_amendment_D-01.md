# WORLD-LAB v0.2.6 — Contractual Amendment D-01

Estado: NORMATIVE CONTRACTUAL AMENDMENT, aprobada por orden ejecutiva F4-E.
Estado empírico al publicar contrato: UNTESTED; aprobación no implica conformidad.
Autoridad base: [v0.2.5 histórica inalterada](WORLD-LAB_v0.2.5_canonical_transcripcion.md).
Esta enmienda prevalece únicamente en las cláusulas enumeradas; hereda literalmente
el resto de v0.2.5 y sus referencias históricas disponibles. No altera teoría,
WORLD, acciones, dinámica, semillas, agentes, ciclo físico ni WLS1.

| Decisión | Clasificación | Cláusulas sustituidas/precisadas |
|---|---|---|
| D-01-A | Reparación de contradicción contractual | §25.2/25.3: contadores parciales en INVALID |
| D-01-B | Extensión semántica controlada de replay | §25.1/25.3.3 y §§18/21/23 para segmentos |
| D-01-C | Reparación de interfaz insuficiente | §25.3/25.3.1: contexto cerrado explícito |
| D-01-D | Explicitación de contexto experimental | §25.1/25.7: modos y firmas |
| D-01-E | Armonización y ampliación temporal | §§16/18/22/25/26.5: ticks/contadores uint64 |

§11.7 e initialize_world no cambian. Secuencias e expected_steps siguen Number
seguro. Se preservan independencia del agente, determinismo, único sync RNG,
atomicidad, orden de eventos, igualdad estructural, propiedad F4-C, precedencia
DEAD y distinción EXPERIMENT fail-stop/replay rollback. No hay nuevos estados.
Complete Experimental Trajectory comienza en inicialización normativa; Replay
Segment comienza en checkpoint suministrado y no certifica su procedencia.
El texto siguiente fija dominios, firmas, pre/postcondiciones, errores y aceptación;
las alternativas explican la selección aprobada y no son opciones de ejecución.

#### A/E — contadores inválidos y representación temporal

**Alternativas:** (a) copiar cualquier parámetro inválido en *_used destruye el
dominio cerrado y puede retener objetos mutables; (b) usar cero/otro número inventa
un parámetro; (c) null explícito para parámetro sin representación válida y ampliar
max/ticks válidos a uint64. Recomendada (c), como cambio contractual explícito. Un max_ticks grande válido no debe clasificarse como entrada inválida.

**SUSTITUCIÓN NORMATIVA — sustituir dominios en §§18,22,25.2 y compromisos §25.3:**

> StepRecord.tick y RecordedEvent.tick tienen dominio matemático uint64. Se admiten
> Number entero seguro no negativo o BigInt uint64 no negativo; comparaciones son
> exactas por valor entero. No hay conversión con pérdida. Para salidas nuevas se
> usa Number si el valor cabe exactamente en entero seguro, BigInt en otro caso.
> WorldState.time conserva su representación válida; su igualdad con tick es
> numérica exacta. sequence y expected_steps conservan Number seguro no negativo.
> max_ticks_used representa uint64 con la misma regla de salida segura.
> Solo en INVALID_REPLAY_INPUT cada *_used admite null. expected_steps_used es el
> expected_steps recibido si es Number seguro≥0; en otro caso null. max_ticks_used
> es el valor uint64 recibido, normalizado sin pérdida, si es válido; en otro caso
> null. Ambos campos se evalúan independientemente del primer error.
> Fuera de INVALID ambos son no nulos y equivalen exactamente a los parámetros
> válidos. En INVALID, null significa exclusivamente que ese parámetro no pertenece
> a su dominio; no significa cero ni parámetro omitido válido.

| Parámetro recibido | expected_steps_used normativo | max_ticks_used normativo |
|---|---|---|
| Number seguro≥0, incluido0 | Mismo Number | Mismo Number |
| BigInt uint64, incluido0n | null (no pertenece a expected_steps histórico) | Number exacto si ≤MAX_SAFE, BigInt si mayor |
| Number inseguro, aun aparentemente entero | null | null (no reconstruir precisión perdida) |
| Negativo, fracción, NaN, Infinity | null | null |
| String, booleano, null, undefined/ausente, objeto, símbolo | null | null; sin coerción/retener referencias |
| BigInt fuera de uint64 | null | null |

Si otro campo es inválido y ambos contadores son válidos, ambos conservan sus
valores; si ambos contadores son inválidos, ambos son null. Esquema de once claves
ReplayResult intacto; cambian dominios/nulabilidad, por tanto es una ruptura pública
aprobada por la orden F4-E. §25.3.2 compara max_ticks_used solo en estados no INVALID.
§24/WLS1 ya codifica time uint64: no modificar bytes ni función hash. Replay de
eventos grabados conserva su representación admitida, sin reenriquecimiento.

**SUSTITUCIÓN NORMATIVA — precedencia de §§25.1/25.3/26:**
Validar en orden WORLD config → Feedback config → initial_state → initial_events
→ estructura actions → expected_steps → max_ticks → time>max → execution_mode.
Cada fallo usa el catálogo actual; modo ausente/desconocido emplea invalid action
structure (ampliar explícitamente su definición, sin crear mensaje nuevo).
No ejecutar transiciones ante entrada inválida. Calcular *_used independientemente
con las funciones parciales anteriores. unused_actions=length(actions) si la lista
es estructuralmente válida, incluso con tipos de acción desconocidos; si no,0.
UNKNOWN_ACTION sigue siendo clasificación incremental tras entradas válidas.

Validador INVALID: verificar forma, salidas vacías, contador nulo solo si parámetro
inválido, valores exactos restantes, unused y primer diagnóstico del orden anterior.
No invocar prueba de continuidad ni comparar final_state con origen en INVALID.
Para los demás statuses validar contexto completo y aplicar P0-6 normalmente.

Aceptación posterior A/E: matriz de cada clase anterior×error de otro campo;
ambos inválidos; max_ticks=2^53/UINT64_MAX válidos; Number inseguro rechazado;
tick MAX_SAFE→MAX_SAFE+1 exacto en WORLD/Recorder/replay, evento en ese tick,
comparación/hints exactos y prevención de overflowUINT64_MAX. Verificación con
WLS1 byte a byte, sin truncar uint64 ni ampliar sequence. Casos enormes deben
usar segmentos/snapshots próximos al límite, nunca iterar2^53 pasos.

#### B — replay desde un estado efectivo positivo

**Alternativas:** (1) corregir §25.1 para exigir time=0: menos código pero pierde
reanudación histórica; (2) admitir segmentos con origen explícito y eventos locales.
Recomendada (2). No se pretende reconstruir eventos anteriores a partir de energía,
lifecycle o RNG. No se trasladan ni reetiquetan eventos históricos automáticamente.

**SUSTITUCIÓN NORMATIVA — §25.1/§25.3.3 y precisiones §§18/21/23:**

> Replay acepta WorldState efectivo válido con 0≤initial_state.time≤max_ticks.
> validate_replay_initial_events(state,events) valida RecordedEvent[] del segmento.
> Si time=0 conserva exactamente las reglas iniciales vigentes, incluida la muerte
> inicial y secuencia0; convierte a WorldEvent solo para llamar al validador WORLD
> existente como hace el adaptador actual. Si time>0 exige events=[] tanto ACTIVE
> como DEAD: lifecycle ya forma parte del snapshot y no se emite otra muerte por
> existir un estado DEAD. No se promete incluir el pasado del segmento.
> §25.3.3 llama a este validador específico antes de ejecutar. §11.7 y el procedimiento
> initialize_world no se modifican. El nuevo validador de replay falla con invalid
> initial_events. No usar eventos con tick0 para fingir origen histórico positivo.
> Recorder dispone de adopción privada de origen de replay sin generación ni
> lifecycle: valida/copia estado y eventos conforme a esa regla, preservando reloj
> y rng_state. finalize/verificación admiten ese origen solo en el contexto de
> segmento de replay. Inicialización experimental normal sigue exigiendo origen0.
> Secuencias son locales al segmento, globales entre sus ticks, contiguas desde0;
> no son continuación de un contador de un episodio ausente. En origen0 con una
> muerte inicial, esa muerte consume sequence0, como ahora.

Primer paso en origen t ACTIVE: tick=t+1, observación en t si modo observado;
reconstruir PRNG directamente desde rng_state, sin derive_seed, sorteos de mapa,
sync extra ni avance previo. DEAD inicial o time=max no ejecuta pasos; muerte
prevalece. expected_steps=0 devuelve OK con mismo estado efectivo incluso DEAD;
el hint se deriva del estado/límite, no del número solicitado. Si se solicitan
pasos y el origen es terminal, clasificar EARLY_TERMINATION o MAX_TICKS_REACHED
antes de inspeccionar acciones. No renumerar ticks para hacerlos empezar en1.

El alcance de igualdad/eventos es el segmento completo, nunca una trayectoria
histórica previa no suministrada. No añadir campos a Trajectory: initial_state.time
expresa el origen; documentar en §23 que puede representar un segmento. Comparación
exhaustiva valida origen/eventos de segmento con las mismas reglas específicas.

Aceptación B: t=1 ACTIVE dos pasos produce ticks2/3; t>0 DEAD sin eventos produce
cero pasos sin muerte duplicada; eventos históricos no vacíos rechazados; empate
muerte/límite; expected0; RNG efectivo restaurado distinto de semilla derivada;
secuencias0..k dentro del segmento; equivalencia snapshot al executed0. Repetir
casos cerca deMAX_SAFE/UINT64_MAX con A/E. Contrastar rollback F4-C sin perder origen.

#### C/D — contexto explícito y modo físico/observacional

**Alternativas C:** ampliar firma3 con parámetros separados, o unificar con el
contexto ya obligatorio del validador. Recomendada firma contextual de dos argumentos.
**Alternativas D:** inferir modo desde WAIT o borrar campos: inválidas por pérdida
de información; introducir modo explícito es la mínima información ausente.

**SUSTITUCIÓN NORMATIVA — firmas públicas de §§25.1/25.3/25.3.1/25.7:**

```text
replay_trajectory(initial_state, initial_events, actions,
                  world_config, feedback_config, expected_steps, max_ticks,
                  execution_mode) -> ReplayResult
validate_replay_continuity(rr, request_context) -> Valid | Invalid
validate_ReplayResult(rr, request_context) -> Valid | Invalid
validate_replay(original, rr, world_config, execution_mode) -> Match | Mismatch
```

request_context tiene exactamente ocho campos obligatorios:
{world_config,feedback_config,initial_state,initial_events,actions,expected_steps,
max_ticks,execution_mode}. Tipos/dominios son los de la solicitud corregida anterior;
execution_mode∈{"WITH_AGENT","WITHOUT_AGENT"}, sin default ni inferencia desde WAIT,
metadata o snapshots. execution_mode se añade también al contexto explícito del
comparador; este construye el request_context desde original y el modo recibido.
No se modifica ExperimentConfig ni Trajectory para inventar un campo histórico.
El modo de una trayectoria sin pasos debe proporcionarlo el llamador; no se puede
recuperar de una lista vacía. La documentación/API debe hacer visible ese requisito.

Valid/Invalid se representa mediante booleanos, conforme a la decisión JS F3H-P02.
El predicado de continuidad valida contexto, estructura y reproducción; ante entrada
malformada devuelve false, sin consultar globales/defaults ni arrojar una falsa
incompatibilidad para un replay válido. Delegar en el helper F3-H con contexto
explícito, extendiendo su validación de origen/mode; no duplicar el motor físico.
El predicado completo mantiene sus comprobaciones por status y llama a continuidad
con ese mismo contexto. INVALID usa la rama A y no exige que todos sus parámetros
sean válidos para poder validarlo.

WITH_AGENT: no invocar agente; ejecutar las acciones suministradas y construir
Observation/Feedback previos exactamente como el experimento observado.
WITHOUT_AGENT: exigir que toda acción estructuralmente válida tenga type=WAIT;
un tipo distinto invalida la solicitud con invalid action structure. Ejecutar
WAIT real con ActionResult no nulo; registrar observation=feedback=null en cada
paso. El modo conocido se comprueba sin inferirlo desde acciones. Para WITH_AGENT
los tipos desconocidos continúan produciendo UNKNOWN_ACTION incremental.
La comprobación de restricciones de modo ocurre tras validar el enum de modo,
sin adelantarse al orden de errores anterior.

Comparación siempre exhaustiva de todos los campos; si se pasa modo erróneo para
un original no vacío, rechazarlo por inconsistencia de nulabilidad, no proyectarlo.
Mismas acciones físicas entre modos pueden dar mismo WORLD/hash, pero no MATCH
entre StepRecords diferentes. Un original vacío no prueba qué modo lo produjo:
el contexto declarado fija qué ejecución vacía se verifica, sin inventar evidencia.

Aceptación C/D: costesWAIT1/2 sobre mismo snapshot producen resultados distintos;
contexto ausente/incorrecto false; las16 configuraciones Feedback; WAIT observado
versus sin agente generan WORLD igual y registros distintos; replay no-agente
produce MATCH completo con su original; mezcla de nulos rechazada; modo ausente,
inválido o erróneo detectado, incluido modo desconocido en cero pasos. Conservar
igualdad estructural de observaciones/eventos, no comparar solo hashes.

### Transversales preservadas y pseudocódigo del paquete

**PRECISIÓN NORMATIVA complementaria §25.7 (precisión de alcance, sin nuevos estados):**
Una trayectoria AGENT_CONTRACT_ERROR permite validar/reproducir su prefijo mediante
validate_ReplayResult con expected_steps=length(steps). Si el WORLD no es terminal,
OK no significa terminación: hint=null y derive_termination_reason=INDETERMINATE.
validate_replay sigue devolviendo MISMATCH para ese original completo, con diagnóstico
de prefijo válido pero fallo de agente no reproducido. No atribuir a replay el
fallo de un agente que no se ejecuta ni añadir AGENT_CONTRACT_ERROR a termination_hint.
La capacidad de certificar esa causa externa queda EXPLICIT LIMITATION, no un
bloqueo de la prueba del prefijo. Alternativa futura de certificación externa no
forma parte de D-01.

```text
validar solicitud en orden A (incluidos modo y restricciones de modo)
si inválida: INVALID vacío + contadores parciales A + primer error
validar origen/eventos según B; adoptar estado/RNG efectivo sin inicializar
si expected_steps == 0: OK con estado idéntico y hint terminal derivado
por cada paso solicitado:
    determinar terminación: muerte antes que límite
    aplicar precedencias actuales de agotamiento y acción desconocida
    preparar contexto observado o ambos nulos según execution_mode
    ejecutar kernel y registrar, con checkpoints F4-C/WORLD/RNG
    ante fallo restaurar prefijo y producir EXECUTION_ERROR como hoy
exportar prefijo; validar estructura/continuidad con request_context completo
```

La validación de origen/eventos pertenece a la fase de solicitud en el orden A;
no repetirla después de invalidar para cambiar el error prioritario. El ciclo
EXPERIMENT conserva fail-stop y replay su rollback específico. No se propone una
transacción conjunta nueva. Un hint válido no sustituye la prueba de continuidad;
null nunca prueba por sí solo ausencia de terminación. Rechazar hints de límite
cuando lifecycle=DEAD, incluso si se alcanza el límite.


La orden F4-E aprueba estas sustituciones. Ninguna API anterior con argumentos
implícitos se considera conforme a esta revisión. La conformidad global y los
hitos B/C siguen UNTESTED hasta pruebas canónicas e interoperabilidad independiente.

## Precisión D-01-E de las salidas de §16 y §26.5

Observation.tick y ConfirmedTickResult.tick tienen dominio uint64 y se emiten como
Number cuando son seguros, BigInt en otro caso. WorldState.time conserva su valor
y representación válidos; la igualdad con esos ticks es numérica exacta. Los
copiadores conservan valores admitidos sin pérdida; la canonicalización de salidas
nuevas no autoriza cambiar bits binary64 ni bytes WLS1. Esta precisión sustituye
únicamente la representación de esas salidas, no el orden del kernel, el reloj ni
la sincronización RNG. Ningún índice, expected_steps o sequence se amplía.

Orden completo de resultados tras validar solicitud: expected_steps=0 produce OK
con el estado efectivo; en otro caso, por tick, DEAD prevalece sobre límite,
seguido de agotamiento de acciones y tipo desconocido (solo WITH_AGENT). Se ejecuta
entonces la acción. OK al completar expected_steps no implica terminación física.
La validación temporal de UINT64_MAX rechaza cualquier confirmación que precisaría
incrementarlo, antes de mutar o consumir RNG; el fallo usa world transition failed.
