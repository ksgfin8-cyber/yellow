# TITAN-MVP-01 — contrato preciso de implementación

**Autoridad:** operacionalización experimental D4, no fuente normativa v0.3 original.  
**Base:** `main@9705f923372a966fc757f3782098ccabc70b3fe9`.  
**Objetivo:** Codex debe poder implementar sin inventar mecanismos de WORLD, política o datos privilegiados.

## 1. Frontera de cambios

Crear nuevas unidades bajo `js/agents/titan_mvp_01.js`, `tools/titan-mvp-01/`, `tests/titan-mvp-01.test.cjs` y `docs/research/titan-mvp-01/`. Si el loader actual requiere montaje para VM, modificar **solo** el cargador aislado de TITAN, no `index.html` ni `js/agents/registry.js` ni runtime P01. No editar WORLD, estado de entidad, core, PRNG, Experiment/Recorder/replay, WLS1, contratos, tests existentes o datos históricos. `agent_type` válido es una cadena no vacía; el registro estático predeterminado no tiene que conocer TITAN.

## 2. Contrato de integración

Código observado:
- `run_experiment(config, agent_factory)` acepta una fábrica externa.
- `agent_factory(type, seed)` devuelve objeto con `reset()` y `step(feedback)`.
- `feedback.observation` contiene `tick`, `self.id`, `self.position`, `self.energy`, `local_view` matriz impar de celdas con `representation` y `occupied`.
- `feedback.has_prior_action` y `feedback.last_action_result.events` existen con flags adecuados.
- `step` devuelve **exactamente** `{type:"MOVE_N"|"MOVE_E"|"MOVE_S"|"MOVE_W"|"WAIT"}`, no objeto `{mechanism:...}`.
- Entidad WORLD: `0987898`. `agent_type`: `titan_mvp_01`.
- El agente no inspecciona WORLD interno, grid, seed, Recorder, reloj del host, futuras acciones o datos de evaluación.

El adaptador/runner pasa `feedback_config` con las cuatro exposiciones `true`, en particular `expose_events=true`. Rechazar configuración incompatible con este contrato antes de ejecutar el agente; no simular eventos ocultos. Observación radio1 para protocolo v1; una vista diferente produce error explícito del adaptador, sin alterar WORLD.

## 3. Estado privado del agente

En `reset()`: `visited = new Set()`, `consumed = new Set()`; opcionalmente último diagnóstico para tests aislados, nunca modificar `feedback`. No mantener memoria entre episodios. Las claves de posición pueden usarse como strings `x,y` enteros, obtenidos solo de coordenadas observadas.

En cada `step(feedback)`:
1. Validar campos usados y `self.id==="0987898"` como **precondición del perfil** (no norma general del agente). Asegurar radio1/3×3, posiciones válidas, celdas cardinales válidas y array de eventos cuando exista acción previa. En caso de entrada malformada: fallar explícitamente, no inventar estados o elegir acciones silenciosas.
2. Marcar `self.position` como visitada.
3. Si `has_prior_action`, incorporar exclusivamente eventos con `type==="RESOURCE_CONSUMED"`, obteniendo posiciones del evento proyectado; no inferir stock invisible. No tomar del evento recursos del futuro.
4. Para N/E/S/W construir destino a partir de `self.position` y celdas `local_view[0][1]`, `[1][2]`, `[2][1]`, `[1][0]`; clasificar por representación y `visited/consumed`.
5. Costo y `Φ_exp` exactamente como D4.
6. Pasar `costs=[C_N,C_E,C_S,C_W]`, `Φ_exp`, `L=2` al núcleo puro (sin observaciones ni mundo).
7. Calcular `Cap=min(C_dir)`, `Gap_dir=C_dir-Cap`, `Gap_global=max(C_dir)-Cap`, `C_null=LΦ_exp`; calcular **todos** los minimizadores con igualdad exacta sobre enteros pequeños 0..5.
8. Seleccionar primero según orden `N,E,S,W,NULL`, convertir a `{type:MOVE_*|WAIT}`. Si el mínimo pertenece solo a NULL, devolver WAIT.
9. No realizar actualización de `visited` del destino hasta observar `self.position` en siguiente tick; movimientos inválidos no se consideran visitas. No hay `step` terminal adicional.

Los valores de costos son **ranks ordinales artificiales usados como números**; no equipararlos a pérdida empírica ni a unidades de energía. `Φ_exp` se calcula de oportunidad local, no de `C` ni de recompensa realizada. El criterio `L=2` está fijado únicamente para este experimento.

## 4. Núcleo puro de selección

Interfaz sugerida `selectMechanism({costs, phi, L}) -> {minimizers, selected, cNull, cap, gaps, gapGlobal}`. `costs` debe ser lista explícita de cuatro pares identificador/costo, no objeto cuyo orden dependa de enumeración implícita. Identificadores fijos: `M_N,M_E,M_S,M_W`; el núcleo general puede aceptar un conjunto finito no vacío de IDs distintos con prioridad declarada.

Validar costos `Number.isFinite(c)&&c>=0`, `phi` finito `[0,1]`, `L` finito positivo, `L*phi` finito y ausencia de claves reservadas/duplicadas. No introducir `Infinity` ni coerciones. `minimizers` incluye `NULL` en igualdad; el selector determinista del adaptador aplica la prioridad. Invariantes de núcleo: existencia de minimizador, gaps≥0, `Φ=0⇒NULL∈minimizers`, `C_null<Cap⇒minimizers=[NULL]`, `selected∈minimizers`.

Usar `NULL` como token reservado interno, no confundir con `null` JavaScript ni con la acción física WAIT. No presentar esta lista de interfaces sugeridas como función preexistente.

## 5. Diagnóstico sin modificación científica

Guardar diagnósticos de selección, si se necesitan, **fuera** de los esquemas cerrados WORLD/RecordedStep/WLS1. Preferir instrumentación externa de callback del agente y sidecar con `experiment_seed`, tick, estado proyectado, `Φ_exp`, costo por alternativa, minimizers, selected, action y SHA de código. No depender del sidecar para reproducir WORLD. Si el callback altera temporalmente la decisión o su semántica, separar modo diagnóstico y comparar resultados estructurales. No añadir campos extra al objeto `Action` ni a `ExperimentConfig`.

**Prohibido** modificar la política, añadir BFS, entrenamiento, autoajuste de L, costo de distancia, visión privilegiada o exploración fuera de D4 bajo el nombre TITAN-MVP-01.

## 6. Pruebas obligatorias

1. Selector: casos de mínimo único entre mecanismos, empate entre mecanismos, empate NULL/mecanismo, nulo único, `Φ=0`, costo no finito, M vacío y `L*phi` overflow.
2. Adaptador: recurso N, FREE no visitada E, sin oportunidad local devuelve WAIT, recurso ya consumido no tratado como nuevo, blocked/OOB rechazados por costos, HAZARD con costo alto, empate N/E, `reset()` borra memorias, movimiento inválido no marca destino visitado.
3. Interfaz: fábrica externa conecta TITAN con id `0987898`, exactamente 5 tipos de acción y sin campos adicionales, no altera contrato fuente.
4. Fiabilidad: mismo seed/config/código produce la misma secuencia de decisiones, estado, eventos y WLS1; se compara de manera estructural, no exclusivamente hash; si la herramienta reutilizada no expone toda evidencia, declarar límite sin inventarlo.
5. Desconexión: ejecutar otro agente existente mediante su propia fábrica sin TITAN; verificar que WORLD no cambió y no existe estado privado de TITAN persistente entre episodios.
6. Tests de error visibles: configuración de Feedback sin eventos o radio incompatible -> rechazo previo; valores numéricos inválidos -> rechazo, no WAIT silencioso.
7. Diff: solo archivos nuevos del agente, runner, pruebas, documentación; `git diff --check` y verificación de fuentes congeladas intactas.

No adaptar pruebas antiguas para volverlas verdes y no mezclar pruebas técnicas de desarrollo con muestras del experimento científico.

## 7. Entrega de implementación

Codex debe devolver rutas, diff, salida completa de tests nuevos, desviaciones verificables y coste real de integración (tareas, minutos/horas si hay registro, archivos tocados, incidentes, reuso de interfaces). Estado final de construcción: `READY_FOR_TITAN_MVP_01_REVIEW`; campaña científica en `HOLD`.
