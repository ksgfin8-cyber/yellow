# TITAN-MVP-01 — expediente de implementación e investigación

**Estado:** SPECIFICATION_PROPOSED / IMPLEMENTATION_NOT_STARTED / SCIENTIFIC_RUN_NOT_AUTHORIZED.  
**Fecha de preparación:** 2026-11-20 (America/Guayaquil).  
**Base Git:** `main@9705f923372a966fc757f3782098ccabc70b3fe9` (PR #55 integrado: congelación temporal de RC1).  
**Investigación:** TITAN-MVP-01, **separada** de RC1 y P01.  
**Propósito:** conectar un agente mínimo inspirado en la regla de decisión de TITAN al puerto lógico de control de la entidad WORLD-LAB `0987898`, observar comportamiento real y evaluar si WORLD-LAB permite investigar un sujeto nuevo sin modificar su motor.

## Índice de autoridad y lectura obligatoria

1. [SOURCE_V01.md](SOURCE_V01.md): reconstrucción normalizada del texto TITAN Mathematical Specification v0.1 facilitado por el propietario. **No es transcripción byte a byte, ni código normativo aprobado.** En caso de discrepancia, prevalece el documento original proporcionado por el propietario.
2. [SOURCE_V03.md](SOURCE_V03.md): reconstrucción normalizada de TITAN Versión Canónica 1 (v0.3 Final) facilitado por el propietario. Misma limitación de literalidad. Se respetan sus fórmulas, definiciones y tres teoremas, no se corrigen silenciosamente.
3. [DECISION_RECORD.md](DECISION_RECORD.md): comparación de fuentes, resolución operacional para este *experimento* y registro de hipótesis del adaptador. Autoridad **experimental**, no reforma matemática.
4. [IMPLEMENTATION_CONTRACT.md](IMPLEMENTATION_CONTRACT.md): contrato suficiente para programar TITAN-MVP-01 sin decisiones técnicas fundamentales implícitas.
5. [EXPERIMENT_PROTOCOL.md](EXPERIMENT_PROTOCOL.md): preguntas, controles, mediciones, pruebas y puertas de ejecución.
6. [CODEX_HANDOFF.md](CODEX_HANDOFF.md): orden de implementación y criterios de entrega.

## Límites de afirmación

El MVP **NO** constituye implementación conforme de TITAN v0.1/v0.3 completos, ni del operador original de TN-LAB; no demuestra `H ⊆ R^59`, compresión suficiente, decidibilidad geométrica original, costos empíricos originales, no universalidad, aprendizaje, independencia de dominio ni optimalidad de acciones. Implementa **el operador finito de selección de v0.3 bajo entradas experimentales explícitas**, y una política de prueba local determinista. Resultados positivos o negativos caracterizan **esta operacionalización** y la integración al laboratorio, no toda la teoría TITAN.

El código científico congelado de WORLD-LAB (WORLD, EXPERIMENT, Recorder, replay, WLS1, contratos, P01, RC1) no se modifica. La fábrica externa y el protocolo se mantienen fuera del motor.

## Identificación

- Entidad del WORLD: `entity.id = "0987898"` — identidad fija de la entidad, *no* identidad del algoritmo.
- Agente: `agent_type = "titan_mvp_01"` — identidad nominal exclusiva del adaptador experimental.
- Ejecuciones: `experiment_seed` más revisión de fuentes, configuración, versión del agente y manifiesto. Ninguno de esos campos por sí solo es identidad irrepetible.
- La sustitución de agentes ocurre **entre episodios**, no durante uno.
- La acción nula formal `∅` se **representa** en WORLD por `WAIT` solo como convención experimental; WAIT avanza el reloj y puede consumir energía.

## Estado y puerta

Se permite implementar documentación/código aislados, pruebas unitarias, fixtures y smoke de desarrollo **sin tocar datos previos**. No se habilita la evaluación principal por inferencia de este expediente: requiere revisión de implementación, congelación de identidad/protocolo y orden del propietario. RC1 permanece temporalmente congelado; AUD-C01 y piloto128 en HOLD. 
