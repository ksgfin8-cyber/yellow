# TITAN-MVP-01 — decisiones matemáticas, metodológicas y de arquitectura

**Estatus:** decisiones explícitas para **una operacionalización experimental**, sin modificar fuentes v0.1/v0.3. Si el propietario cambia cualquiera de estos supuestos, nueva versión del agente y del protocolo; no sobreescritura retrospectiva.

## D1. Objeto de investigación y alcance

Se pretende **hacer actuar** al primer agente TITAN mínimo en WORLD-LAB y observar decisiones, abstenciones y efectos sobre la misma entidad física `0987898`. Investigación doble: comportamiento de una regla de selección de inspiración TITAN y capacidad de conexión/reproducción del laboratorio. No es una prueba de teoremas aislada ni validación de teoría completa.

## D2. Divergencias entre las dos fuentes

| Tema | v0.1 | v0.3 | Resolución MVP |
|---|---|---|---|
| Tipo de mecanismo | `M_i:H→A` | alternativa `M_i∈A` junto con `∅` | Cada mecanismo `M_dir` devuelve una acción WORLD; núcleo escoge identificador de mecanismo; adaptador lo ejecuta |
| Selección | `argmin_M C` condicionado por `Φ>τ` o `C<C_baseline` | `argmin_{M∪{∅}} C` con `C(∅)=LΦ` | **Se selecciona exclusivamente operador v0.3** |
| Decidibilidad | umbral o ventaja frente a baseline | estructura geométrica medida, no ligada al costo | Proxy experimental separado, no `Φ_TN-LAB` |
| Estado | H abstracto | `H⊆R^59` ligado a TN-LAB | Estado local estructurado WORLD; **no** se afirma H canónico 59D |
| Costo | rendimiento relativo + baseline | costo empírico del pipeline | Heurística fija ex ante, **no** costos observados reales |
| Régimen | explícito | implícito en costos | No implementado |
| No universalidad | axioma | no necesario para teoremas | No verificado ni presupuesto |
| Desempates | no resueltos | regla determinista implícita | Orden experimental declarado |
| Acción nula | ∅ como acción | ∅ como mecanismo/alternativa | ∅ se proyecta a WAIT (acción no gratuita) |

No reconciliar v0.1/v0.3 ni generar un documento «v0.4».

## D3. Frontera matemática vs adaptador

**SOURCE_DERIVED_V03**: M finito no vacío, costos finitos no negativos, `0≤Φ≤1`, `L>0`, `C_null=LΦ`, `Cap`, `Gap`, conjunto `argmin` con la nula.

**EXPERIMENTAL_ADAPTER**: tomar Observation/Feedback de WORLD, observación cardinal, memoria de posiciones visitadas, eventos RESOURCE_CONSUMED visibles, heurística de costos de movimientos, proxy de oportunidad, `L=2`, selección determinista de empate, proyección `∅→WAIT`.

**NOT_IMPLEMENTED**: `Γ` original 59D, `Φ` geométrica TN-LAB, calibración empírica `L` en TN-LAB, costos causales/contrafactuales reales, régimen R, aprendizaje, planificación BFS, oráculo, optimalidad, evaluación de mecanismos con información futura.

## D4. Política experimental concreta (congelar antes de evaluación)

Para cada `step`, el estado accesible contiene la observación del tick actual, más `visited` y `consumed` acumulados **solo dentro del episodio**. Cuatro mecanismos candidatos `M_N, M_E, M_S, M_W` mapean a `MOVE_N/E/S/W`. Las acciones bloqueadas y peligrosas siguen siendo alternativas de costo **finito**, pero costosas.

- `RESOURCE` conocido y **no consumido**: costo 0.
- `FREE` y posición destino **no visitada**: costo 1.
- `FREE` ya visitada o `RESOURCE` consumido: costo 3.
- `HAZARD`: costo 4.
- `BLOCKED` o `OUT_OF_BOUNDS`: costo 5.
- No se trata ocupación de otros agentes: WORLD solo admite la entidad experimental en este dominio.
- `Φ_exp(h)=1` si **alguna** de las cuatro celdas es `RESOURCE` no consumido o `FREE` no visitada; `0` en otro caso. Es un **proxy binario de oportunidad local**, no una medida matemática de resolubilidad ni una función de los costos originales.
- `L_exp=2`; costo nulo 2 cuando hay oportunidad local, 0 en caso contrario.
- Orden de desempate del MVP, exclusivamente experimental: `M_N ≺ M_E ≺ M_S ≺ M_W ≺ ∅`; se calcula el conjunto completo de minimizadores y después se selecciona su primer elemento en ese orden.
- `∅` devuelve `{type:"WAIT"}`, conservando semántica física de WAIT del mundo.

Consecuencia **prevista**, no evidencia: si hay un recurso inmediato no consumido, se mueve a uno según orden; en ausencia de recursos, puede entrar a FREE no visitada; si no hay oportunidades cardinales inmediatas, se abstiene. Puede quedar atrapado, explorar poco o perder ante Random, Rule o FrontierMemory. **No optimizar tras mirar datos para volverlo competitivo**.

## D5. Motivación científica de la heurística

Se eligió una instanciación determinista, local, muy pequeña, capaz de producir tanto movimiento como abstención y de revelar diferencias entre mecanismo/costo y resultado ambiental. Es deliberadamente más simple que FrontierMemory y evita un algoritmo de planificación prestado que dificultaría atribuir el comportamiento a la estructura del selector. Los valores 0/1/3/4/5 y `L=2` son **decisiones de diseño**, no deducciones, mediciones calibradas ni afirmaciones de superioridad. La elección de un proxy local no prueba `Φ` de TITAN: mide un experimento sobre esa hipótesis de operacionalización.

## D6. Integración tipo «puerto»

`0987898` ya es `entity.id` fijo en `js/world/world.js`, *no* nombre de TITAN. Se mantiene constante para todos los controladores. `agent_type="titan_mvp_01"` es la etiqueta del controlador; `experiment_seed` el origen de semillas. Utilizar `run_experiment(config,agent_factory)`, `reset()` y `step(feedback)` sin cambiar WORLD/Recorder/EXPERIMENT. Un adaptador externo construye el nuevo agente. Intercambio **entre episodios** únicamente.

## D7. Separación de evidencia

Unit tests de la selección son corrección implementativa, no «TITAN científicamente validado». Eficiencia de recursos o supervivencia son resultados descriptivos de esta política. El resultado de P01 es independiente; sus 32 semillas no se reutilizan para selección/tuning confirmatorio. El coste de adaptación Q4 puede registrarse prospectivamente en horas/archivos/incidencias reales, sin inferir causalidad general a partir de un solo caso.

## D8. Puertas y autoridad

La autorización actual comprende preparar documentación, implementar agente/runner aislados y sus tests; se permite smoke de **desarrollo** en semillas reservadas y fixtures pequeños, sin producir conclusión final. La **campaña de evaluación** debe solicitar aprobación posterior sobre identidad, protocolo, semillas, recursos y archivo. No reabrir RC1 ni reutilizar firmas de P01/RC1.
