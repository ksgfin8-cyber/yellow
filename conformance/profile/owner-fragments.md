# Fragmentos del responsable ya presentes en esta conversación

Contenedor informativo F5-C. Procedencia: mensajes visibles del responsable que
acompañaron las órdenes F2-B, F2-I y las resoluciones F3-C/F3-H. No se accedió a la
Biblioteca de ChatGPT ni se obtuvo el manuscrito histórico completo. Los hashes
fijan esta transcripción desde F5-C; no son hashes del original v0.2.4.
La atribución de recuperación histórica corresponde al responsable. Solo los
fragmentos delimitados se incorporan por referencia; las políticas señaladas como
técnicas no se convierten en historia normativa.

## OWNER-MAP — F2-B §2, algoritmo recuperado de v0.2.4

```yaml
generate_map(world, rng):
    FOR y = 0 TO height - 1:
        FOR x = 0 TO width - 1:
            r1 = rng.next_float()

            IF r1 < obstacle_density:
                grid[y][x] = BLOCKED
                CONTINUE

            r2 = rng.next_float()

            IF r2 < resource_density:
                grid[y][x] = FREE + RESOURCE(stock=1)
            ELSE IF r2 < resource_density + hazard_density:
                grid[y][x] = FREE + HAZARD
            ELSE:
                grid[y][x] = FREE + NONE
```

## OWNER-FEEDBACK — F2-I §2, §17 recuperado

```yaml
FeedbackConfig:
  expose_validity: boolean = true
  expose_reason: boolean = false
  expose_events: boolean = false
  expose_energy_delta: boolean = true

Feedback:
  observation
  has_prior_action
  last_action_result
```

La orden F2-I declara ambos esquemas cerrados. No aporta una representación
histórica completa de los campos ocultos de ActionResult proyectado.

## OWNER-RECORDED — resolución F3-C §2 y §4

```typescript
type RecordedEvent = {
    type: WorldEventType;
    entity_id: string;
    position: Position;
    tick: number;
    source: "action" | "lifecycle";
    sequence: number;
};
```

Los límites superiores no estaban explicitados en la recuperación. F3C-P01 era
una decisión técnica; D-01-E es ahora la autoridad explícita para ticks uint64 y
sequence Number seguro. No se conserva el dominio temporal histórico sustituido
como criterio de aceptación vigente.

```typescript
type EntityStates = Map<
    string,
    {
        id: string;
        position: {x: number; y: number};
        energy: number;
        lifecycle: "ACTIVE" | "DEAD";
    }
>;
```

La misma resolución aclara que la fuente fija un mapa semántico y que usar Map de
JavaScript es la decisión F3C-P02, no una representación histórica obligatoria.

## OWNER-LIFECYCLE — resolución F2-C, §§6.1 y 14 recuperados

La condición exacta es energy <= death_threshold.
- initial_energy admite valores negativos.
- death_threshold admite enteros seguros negativos.
- La entidad se crea inicialmente ACTIVE.
- resolve_lifecycle se ejecuta exactamente una vez durante initialize_world.
- Si se cumple la condición, pasa a DEAD y emite un único ENTITY_DIED.
- No hay resurrección ni emisión duplicada.

Esta condición fue respaldada por el responsable como texto de §6.1 de v0.2.4,
no como inferencia desde el código legacy.

## OWNER-TERMINATION — resolución F3-H §2

Firma histórica: derive_termination_reason(replay_result).
Salida: ENTITY_DIED | MAX_TICKS_REACHED | INDETERMINATE.
Precedencia transmitida por el responsable:
- termination_hint no nulo → devolver hint;
- final_state nulo → INDETERMINATE;
- entidad DEAD → ENTITY_DIED;
- time >= max_ticks_used → MAX_TICKS_REACHED;
- otro caso → INDETERMINATE.
Nunca inferir terminación del simple agotamiento de expected_steps. No consultar original.

El responsable atribuyó estas firmas detalladas a una versión histórica anterior
contrastada con v0.2.4/v0.2.5, sin aportar su manuscrito íntegro. D-01 determina las
firmas públicas actuales de replay y comparadores; este fragmento no las sustituye.
