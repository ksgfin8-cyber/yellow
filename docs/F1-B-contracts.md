# F1-B — Contratos estructurales

Base aprobada: a5d293d983fa419d210d2bd9a8498165549d6d22.
Fuente: WORLD-LAB v0.2.5, sin modificar. Matriz elaborada antes del código.

| Norma | Componente | Validador | Pruebas locales previstas |
|---|---|---|---|
| §10, §11.6 | core/contracts.js | ContractError compartido | F1-A 01–18 |
| §6.1–6.2, I-69–70 | world/world_config.js | validate_WorldConfig | B01–B04 |
| §6.4, I-81 | core/contracts.js | canonicalize_binary64 | B05 |
| §8, §1.3 | contracts/structures.js | validate_Cell | B06 |
| §9 | contracts/structures.js | validate_EntityState | B07 |
| §7, §8, §9 | contracts/structures.js | validate_WorldState | B08–B10 |
| §12 | interface/action.js | validate_Action_structural | B11 |
| §19, §11.6 | contracts/structures.js | inspect_ExperimentConfig_defined_fields (parcial) | B12 |
| §17 | FeedbackConfig | bloqueado: faltan nombres de cuatro flags | sin aceptación inventada |

## Dependencias pendientes

No se encontró v0.2.4 en las referencias accesibles tras `git fetch origin`.
Los antiguos archivos docs/specifications (909a43f, baa785e) y docs (764910f)
contienen solo un salto de línea. Faltan I-01–I-66 y §26.1–26.4 completos.
FeedbackConfig: no se inventa el cuarto flag ni se valida una lista anónima.
ExperimentConfig: falta el contrato completo de max_ticks/agent_type y feedback;
se ofrece inspección parcial explícita, no un validador completo de aceptación.
InitializationError: se aplaza el tipo completo, pues §11.1 envuelve todos los
fallos y §11.7 exige ContractError; no se centraliza una semántica inventada.
La excepción común implementada es solo ContractError; no envuelve errores de
inicialización ni cambia los del motor existente.

## Implementación y decisiones internas

- ContractError se trasladó sin cambios desde prng.js a core/contracts.js.
  Nombre, herencia y mensajes F1-A conservados. PRNG/seed/hash no cambian sus
  algoritmos. index.html y los cargadores de pruebas cargan contracts.js primero.
- WorldConfig tiene exactamente los 14 campos de §6.1. La multiplicación usa
  BigInt después de validar dimensiones uint32 para evitar overflow. No se
  convierten strings, booleanos, infinitos ni otros tipos. Constructor inválido:
  ContractError("invalid world_config"). defaults() conserva los valores previos
  con topology BOUNDED y hazard_damage (no hazard_effect).
- canonicalize_binary64 acepta solo Number finitos, convierte -0 en +0 y no
  redondea. El texto del error no finito es diagnóstico interno; §6.4 no fija
  uno. No se modifica energía ni se implementan transiciones.
- Los predicados validate_* devuelven booleanos sin mutar. assert_WorldState y
  assert_Action_structural lanzan ContractError con mensajes exactos del catálogo:
  "invalid initial_state" e "invalid action structure". No se inventan mensajes
  normativos para Cell o Entity: se ofrecen predicados.
- Registros con campos propios de datos; claves adicionales (incluidos Symbols),
  campos heredados como sustitutos y accessors no satisfacen un esquema cerrado.
  No hay serialización ni ejecución de getters para validar campos.
- Cell usa traversal/effect; RESOURCE usa kind/stock binario (§1.3, §8), HAZARD
  solo kind. Entity usa id/position/energy/lifecycle. La representación x/y y Map
  se conserva de la arquitectura existente, sin nueva mecánica. Se rechazan ids
  UTF-8 inválidos, posiciones no enteras o fuera de la configuración.
- WorldState acepta time como BigInt uint64 completo o Number entero seguro no
  negativo, ambos sin coerción. No se acepta Number que ya perdió precisión.
  entities es Map en el mismo ámbito JavaScript, con exactamente una entrada e
  id coincidente. Grid rectangular denso; ACTIVE debe ocupar FREE.
- Los validadores son la alternativa autorizada a crear nuevos tipos. No se
  alteran los constructores legacy Cell, EntityState y WorldState para fingir
  integración: EntityState aún carece de lifecycle y su copia no lo preserva.
  full_snapshot y la validación temporal de DEAD permanente/sin resurrección
  requieren integración posterior y no son garantías de estos predicados.
- validate_Action_structural comprueba {type:string}, sin enum ni restricción de
  longitud no especificada. UNKNOWN y cadena vacía son estructuralmente válidos;
  su interpretación operacional corresponde a otra fase. makeAction sigue siendo
  el helper legacy para acciones conocidas; no se usa como validador estructural.
- inspect_ExperimentConfig_defined_fields devuelve siempre complete:false.
  Comprueba presencia de cinco campos, dominio base de experiment_seed por §11.6
  y WorldConfig. No valida max_ticks, agent_type ni feedback_config; cero ticks
  no se rechaza en este inspector. Ausencia de issues NO significa aceptación.
  ExperimentConfig y FeedbackConfig legacy no se modifican ni se presentan como
  implementaciones canónicas. Faltan nombres de flags y contratos heredados.

## Pruebas ejecutadas y reproducción

Desde /workspace/yellow, Node.js v24.22.1:

```sh
node tests/f1-b.test.cjs
node tests/f1-a.test.cjs
node tests/f1-a-legacy.cjs --baseline
node tests/f1-a-legacy.cjs
git diff --check
```

| Verificación | Resultado | Exit |
|---|---|---|
| F1-B B01–B12 | 12 PASS, 0 FAIL, 0 omitidas | 0 |
| F1-A | 18 PASS, 0 FAIL, 0 omitidas | 0 |
| Legacy base ad7cc99 | 4 PASS, 18 FAIL | 1 |
| Legacy actual | 4 PASS, 18 FAIL | 1 |
| Diff whitespace | sin errores | 0 |

B01–B04 comprueban cada campo obligatorio, adicionales, inmutabilidad, tipos,
dominios, suma de densidades, producto y MAX_CELLS. B05 compara bytes binary64.
B06–B10 comprueban efectos, UTF-8, lifecycle estructural, cardinalidad, uint64,
RNG, dimensiones, huecos de arrays y no mutación. B11 separa forma/enum;
B12 exige explícitamente que el inspector parcial no afirme completitud.

Las pruebas heredadas no se editaron. Solo se cambió su runner de diagnóstico:
--baseline ahora carga también el HTML y todos los scripts originales desde Git,
para que la extracción de ContractError no contamine la línea base. El cargador
F1-A añade contracts.js y conserva las mismas 18 pruebas/aserciones.
Las 18 fallas legacy siguen siendo Cell is not defined. El HTML legacy continúa
referenciando cell.js y effect.js inexistentes. No se corrigió el arranque fuera
del alcance de contratos; el runner no convierte esos fallos en éxitos.

## Divergencias y límites

Los módulos operacionales legacy todavía usan hazard_effect, topología toroidal,
entidades sin lifecycle y otros contratos antiguos. El nuevo WorldConfig adopta
hazard_damage/BOUNDED por norma, sin adaptar el motor para esconder divergencias.
No se verificó simulación integrada; no se declara ausencia de regresiones en
rutas que la suite heredada no alcanza. No hay pruebas canónicas completas ni
conformidad global, replay o interoperabilidad verificados.

Los contratos heredados ausentes bloquean únicamente las partes señaladas arriba;
no se completaron con suposiciones. No se implementan generación, ticks,
observaciones, agentes, recorder, WLS1, replay, renderer o métricas. La fuente
normativa permanece idéntica a la base aprobada. No se inicia F2.
