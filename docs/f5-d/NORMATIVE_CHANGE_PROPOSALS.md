# NORMATIVE_CHANGE_PROPOSALS — Producto B

**DRAFT / UNAPPROVED / NON-NORMATIVE. NO APLICAR.**

Opciones condicionales para revisión, separadas del [Producto A](CONSOLIDATED_SPECIFICATION_CANDIDATE.md). La entrega de EXT-024/EXT-023 puede invalidarlas o volverlas innecesarias. No asignar versión por anticipado ni resolver por política una cláusula recuperable.

No se propone cambiar física/arquitectura por mera conveniencia; la selección de resultados hoy indeterminados sería una precisión nueva, no equivalencia histórica demostrada.

## P01 — Financiación y orden energético

Dependencia: [DEC-G01](UNRESOLVED_DECISIONS.md#dec-g01).

Justificación independiente del código: Sujeto a fuente externa; escoger coste previo evita financiar el movimiento con la recompensa de destino y permite explicar el presupuesto energético.

**Texto nuevo propuesto:** Para una acción aceptada, verificar disponibilidad antes del efecto; calcular energía tras coste y después aplicar el efecto de entrada, canonicalizando cada operación binary64. WAIT no reentra efectos. Un rechazo no cobra coste ni cambia WORLD. energy_delta es canonicalize_binary64(energía_final−energía_previa).

**Límite:** La disponibilidad/WAIT/delta son selección observable pendiente; no atribuir esta redacción al manuscrito histórico.

## P02 — ActionResult portable

Dependencia: [DEC-G01](UNRESOLVED_DECISIONS.md#dec-g01).

Justificación independiente del código: Un resultado mínimo estable puede comunicar ejecución y causa sin contexto redundante; la clasificación exacta es elección contractual.

**Texto nuevo propuesto:** Si se adopta esta alternativa: ActionResult cerrado={validity,reason,energy_delta,events}; VALID/NONE al ejecutar, INVALID para entidad inactiva/borde/bloqueo, FAILED/INSUFFICIENT_ENERGY para no pagar. Eventos crudos y delta finito canonicalizado.

**Límite:** Enums/clasificación son propuesta nueva condicionada, no norma original. Alternativas deben evaluarse con consumidores y fuentes.

## P03 — Regeneración binaria

Dependencia: [DEC-G02](UNRESOLVED_DECISIONS.md#dec-g02).

Justificación independiente del código: Reposición inmediata es una alternativa simple sin estado temporal ni RNG adicionales, si la fuente no determina otra regla.

**Texto nuevo propuesto:** Si se adopta: al ejecutar regenerate_resources, stock0 pasa a1 si resource_regeneration>0; tasa0 conserva stock y stock1 permanece1; no crear recursos ni cambiar entidad/tiempo/lifecycle/RNG ni emitir eventos.

**Límite:** No se impone esta fórmula por aparecer en legacy; unidad/timing pueden estar fijados en fuente externa.

## P04 — Proyección y subregistros

Dependencia: [DEC-G03](UNRESOLVED_DECISIONS.md#dec-g03).

Justificación independiente del código: Evitar fuga y distinguir una etiqueta ausente de un enum de acción inventado. La ABI debe fijarse antes de comparar motores.

**Texto nuevo propuesto:** Si se adopta forma estable: proyección de acción previa con validity/reason=null cuando ocultos, events=[] cuando ocultos y energy_delta=+0 cuando oculto. Habilitados preservan valores. La proyección no es un ActionResult crudo. Definir subesquemas self/local_view por revisión separada contra §16 recuperado antes de fijar ABI completa.

**Límite:** Texto no es una definición completa de Observation y no declara cerrada G03.

## P05 — Orden de eventos operacionales

Dependencia: [DEC-G04](UNRESOLVED_DECISIONS.md#dec-g04).

Justificación independiente del código: El movimiento antecede causalmente al efecto de entrada; una activación puede ser un hecho aun con magnitud0.

**Texto nuevo propuesto:** Si la fuente no determina lo contrario y se aprueba esta alternativa: MOVE aceptado emite ENTITY_MOVED antes del efecto; consumo stock1→0 emite RESOURCE_CONSUMED, entrada en peligro emite HAZARD_TRIGGERED incluso con daño0. WAIT/rechazos no inventan efectos; apply_action nunca emite muerte.

**Límite:** Los tipos/esquemas recuperados permanecen; solo disparo/orden indeterminado se propone.

## P06 — Salidas de tick sin clase obligatoria

Dependencia: [DEC-G05](UNRESOLVED_DECISIONS.md#dec-g05).

Justificación independiente del código: Snapshots y separación de eventos son observables; el contenedor interno de un mapa no debe limitar lenguajes.

**Texto nuevo propuesto:** Si se aprueba ABI F3A-P02/P03: TickResult={action_result,action_events,lifecycle_events}; ConfirmedTickResult={tick,world_state,action_result,action_events,lifecycle_events,termination}; snapshots independientes y action_events estructuralmente iguales a action_result.events; eventos crudos; tiempo/terminación según reglas vigentes. Mapas se interpretan semánticamente, sin exigir Map/instanceof de JS.

**Límite:** Requiere revisar campos frente a fuente externa; no modificar dominio D-01 ni WLS1.

## P07 — Capacidad operacional separada

Dependencia: [DEC-G07](UNRESOLVED_DECISIONS.md#dec-g07).

Justificación independiente del código: Un radio semánticamente válido no garantiza materialización; el fallo no debe fingir configuración física inválida ni producir observación truncada.

**Texto nuevo propuesto:** Se propone decidir explícitamente el perfil de soporte y categoría de fallo operacional de observación antes de aceptación. Preservar radio uint32 y ausencia de mutación/RNG ante fallo; no fijar64MiB como ley física ni asignar un nuevo error_message sin autorización.

**Límite:** No es cláusula operacional completa: categoría/garantía requieren decisión tras recuperar fuente. No cambia arquitectura ni código ahora.

## P08 — Aceptación y referencias nuevas

Dependencia: [DEC-G09](UNRESOLVED_DECISIONS.md#dec-g09).

Justificación independiente del código: Expectativas y suficiencia deben fijarse antes de contrastar implementaciones; un sustituto no puede omitir obligaciones desconocidas.

**Texto nuevo propuesto:** Solo después de cerrar contratos: revisar corpus/perfil y nuevos vectores por ID/versión/hash, con cálculo independiente. Una sustitución de T01–T280 o §37 requiere autorización normativa expresa; no renombrar PV-F5C como V2–V10 recuperados.

**Límite:** No se redacta ni aplica aquí un reemplazo aprobado de §37. La propuesta F5-C permanece sin aprobar.

INIT-004 y D-01 no son propuestas nuevas: se consolidan con su alcance ya autorizado en Producto A. Las libertades internas de representación no requieren inventar un nuevo contrato físico.

Cada eventual aprobación debe identificar cláusulas sustituidas, semántica elegida, compatibilidad, expectativas independientes y evidencia requerida. No cambiar tests existentes para convertir la selección en una falsa recuperación histórica.
