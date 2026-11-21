# TITAN-MVP-01 — Análisis de equivalencia conductual del adaptador D4

**Estado:** `ANALYTIC_RESULT / DIFFERENTIAL_TEST_PENDING`.  
**Fecha de análisis:** 2026-11-20 (America/Guayaquil).  
**Código examinado:** `main@bc768f26be7f14fe6091d3a9a202af61b083c303`; `js/agents/titan_mvp_01.js`.  
**Autoridad:** resultado analítico sobre la **operacionalización D4**; no sustituye, modifica ni certifica los documentos originales de TITAN v0.1/v0.3.  
**Campaña:** TITAN-MVP-01 G2 `HOLD`; no se han iniciado episodios 2001–2012 por este análisis.  
**Fuentes:** `DECISION_RECORD.md`, `IMPLEMENTATION_CONTRACT.md`, `EXPERIMENT_PROTOCOL.md`, `IMPLEMENTATION_REPORT.md`.

## 1. Pregunta y criterio de decisión

¿La política ejecutable de TITAN-MVP-01 selecciona la misma acción que una política directa de prioridades locales, para toda clase de entrada válida de observación y memoria que satisface el contrato D4?

**Decisión dependiente:** limitar la interpretación científica de los episodios de TITAN-MVP-01 y determinar si una campaña G2 aporta evidencia adicional relevante, sin retocar sus parámetros después del smoke.

## 2. Dominio y definiciones

En cada decisión existen cuatro direcciones cardinales ordenadas N, E, S, W, y la opción nula `NULL` representada físicamente por `WAIT`. El agente usa la observación 3×3 actual de WORLD, el conjunto privado `visited` de ubicaciones efectivamente observadas de la entidad y `consumed` de posiciones de recursos con evento previo `RESOURCE_CONSUMED` expuesto. La actualización de memoria ocurre antes del cómputo de costos. No se observa stock oculto ni se supone movilidad a través de celdas desconocidas.

Para una dirección `d` con destino `p_d`, el costo contractual D4 es:

| Clase de la celda observada y memoria | `C_d` |
|---|---:|
| `RESOURCE` y `p_d ∉ consumed` | 0 |
| `FREE` y `p_d ∉ visited` | 1 |
| `RESOURCE` y `p_d ∈ consumed` | 3 |
| `FREE` y `p_d ∈ visited` | 3 |
| `HAZARD` | 4 |
| `BLOCKED` o `OUT_OF_BOUNDS` | 5 |

Sea `O` la proposición de existencia de al menos una celda cardinal `RESOURCE` no consumida o `FREE` no visitada. `Φ_exp = 1_O`, `L_exp = 2`, `C_NULL = 2Φ_exp`.

El selector devuelve el mínimo de `(C_N,C_E,C_S,C_W,C_NULL)`, con desempate exacto N ≺ E ≺ S ≺ W ≺ NULL.

## 3. Política de prioridades directa de contraste

La siguiente definición es una **referencia analítica externa**, no un mecanismo incorporado a TITAN ni una nueva teoría:

```text
DIRECT_PRIORITY(feedback, visited, consumed):
    actualizar memoria de forma idéntica a D4 con self.position
        y los eventos RESOURCE_CONSUMED de la acción previa
    para d en [N, E, S, W]:
        si destino d = RESOURCE no consumido: devolver MOVE_d
    para d en [N, E, S, W]:
        si destino d = FREE no visitado: devolver MOVE_d
    devolver WAIT
```

En una comparación diferencial independiente, no llamar al selector original dentro de `DIRECT_PRIORITY`, ni compartir con él la función de evaluación de costos: el oráculo debe implementar directamente este orden de condiciones. Se permite compartir únicamente tipos/fixture de feedback para asegurar igualdad de entradas, sin reutilizar lógica decisional.

## 4. Demostración por casos

**Caso A: `O` verdadero.** Existe por lo menos un `C_d∈{0,1}`; por tanto `min_d C_d≤1<2=C_NULL`. Ningún costo 3,4,5 ni NULL puede minimizar. Si existe al menos un recurso no consumido, el mínimo es 0 y se elige el primero N,E,S,W. En caso contrario, existe una celda FREE no visitada, el mínimo es 1 y se elige la primera N,E,S,W. Esto coincide con `DIRECT_PRIORITY`.

**Caso B: `O` falso.** Todos los costos direccionales pertenecen a `{3,4,5}`, mientras que `C_NULL=0`. NULL es minimizador único y su acción es WAIT. Esto coincide con `DIRECT_PRIORITY`.

**Conclusión lógica:** para entradas válidas con proyección y memoria D4 idénticas, `π_TITAN_MVP_01(o,m)=π_DIRECT_PRIORITY(o,m)` en cada decisión. Si ambos controladores comienzan con la misma memoria vacía, reciben el mismo feedback del mismo mundo determinista y actualizan memoria según el mismo contrato, la coincidencia de acciones se extiende inductivamente a cada tick de una ejecución correspondiente. Esta deducción **no** equivale a una comprobación experimental de que ambas implementaciones independientes están libres de defectos.

## 5. Contraste computacional focalizado pendiente

Objetivo: detectar desviaciones entre la implementación original y un oráculo directo independiente, sin añadir una campaña. Usar exclusivamente pruebas de desarrollo/fixtures: ninguna ejecución de semillas2001–2012.

1. Comparar las siete clases relevantes de vecinos `RESOURCE` consumido/no consumido, `FREE` visitado/no visitado, `HAZARD`, `BLOCKED`, `OUT_OF_BOUNDS`.
2. Para los cuatro vecinos cardinales, cubrir las `7^4=2401` combinaciones de clases, siempre que la construcción sintética de observación/memoria sea coherente con el contrato; de otro modo declarar expresamente qué clases de combinación están restringidas y qué cobertura se logró.
3. Probar los 4 empates direccionales, dominancia de recurso sobre FREE, oportunidad ausente y presencia de hazards/bloqueos.
4. Incluir trazas secuenciales donde se modifica `visited` solo al observar nueva posición, y `consumed` solo tras eventos válidos; cubrir `reset()`.
5. Hacer al menos una integración breve de desarrollo con dos controladores **distintos**, misma semilla/configuración, y comparar acciones/estados/eventos de trayectoria. No contar estas pruebas como muestras de la evaluación G2.
6. Mantener TITAN-MVP-01 exactamente idéntico en bytes; no alterar `WORLD`, Recorder, experiment, fuentes, controles o parámetros D4. Las pruebas nuevas deben vivir en ubicaciones aisladas.
7. Reportar resultados favorables, discrepancias y el primer punto de divergencia, si existe. Una sola discrepancia verificada invalida la afirmación sobre equivalencia ejecutable hasta investigar la causa.
8. Diferenciar `ANALYTIC_RESULT`, `FINITE_DIFFERENTIAL_PASS/FAIL`, `SEQUENTIAL_PASS/FAIL` y `NOT_EVALUATED`; no sustituir pruebas independientes por reproducción con la misma función original.

## 6. Interpretación científica permitida

La operacionalización D4 **implementa una regla de prioridades mediante la maquinaria del selector de costo mínimo v0.3**, dadas sus propias funciones de costo y oportunidad; no se ha demostrado ninguna ventaja distintiva de TITAN respecto a la regla directa. P01 y TITAN G1 permiten estudiar capacidad operacional de WORLD-LAB y conducta de estas políticas dentro de sus respectivos alcances. Las medidas de productividad o generalidad del laboratorio exigen evidencia adicional.

No declarar que la teoría TITAN v0.1/v0.3 es falsa, trivial en todos sus componentes, validada, refutada o equivalente globalmente a la política directa. No alterar el protocolo preregistrado después de conocer los datos de desarrollo; si se propone una nueva comparación científica, crear una versión nueva antes de ejecutarla.

## 7. Estado de decisión

- `ANALYTIC_EQUIVALENCE_ESTABLISHED_UNDER_D4`: **sí**, por casos.
- `INDEPENDENT_DIFFERENTIAL_TEST`: **pendiente de ejecución**.
- `TITAN_G1`: implementación revisada, smoke de desarrollo conservado.
- `TITAN_G2`: **HOLD**.
- `TITAN_THEORY_VALIDATED`: **NO**.
