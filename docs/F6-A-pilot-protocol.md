# WORLD-LAB — P01: exploración con memoria y recursos agotables

**P01, versión propuesta 1.0 · PROPOSED / NOT IMPLEMENTED / NOT EXECUTED.**
Preparado en F6-A, 2026-11-13 (America/Guayaquil), base
`48c7d208de4847588567ed8a8c0f7c9167ca891a`. La orden aprueba la dirección del
piloto, no un resultado ni una enmienda normativa. Antes de ejecutar evaluación,
F6-B debe fijar el manifiesto P01/implementación por hash y registrar cambios de
protocolo. Este documento permite implementarlo sin un framework general nuevo.

## Pregunta y alcance científico

**En la batería fija de escenarios válidos definida abajo, ¿FrontierMemory-v1
obtiene una media de consumos de recursos mayor que RandomAgent, con el mismo
mundo inicial y horizonte de acciones?** H+: media de diferencias pareadas >0;
H−: ≤0. Comparación principal única: FrontierMemory menos Random. Rule y Wait
son controles secundarios, sin convertirlos en otras hipótesis confirmatorias.

La comparación investiga una política combinada de planificación/exploración con
memoria, **no aísla causalmente el efecto de memoria sola**. Una atribución causal
necesitaría ablación futura. No es aprendizaje online: el algoritmo no se entrena
ni cambia parámetros entre episodios. No necesita otra llamada terminal a step.
No se elige una tarea de aprendizaje y luego se omite su transición terminal.

La unidad es un episodio sobre un mundo generado por una semilla de experimento.
El estimando se limita a esta batería finita, no a una población aleatoria global.
No habrá p-values ni intervalos inferenciales sin diseño de muestreo adicional.
Reportar toda la distribución de diferencias; las repeticiones idénticas verifican
determinismo y **no duplican el tamaño de la muestra**.

## Algoritmos y observación permitida

Cuatro agentes: `frontier_memory_v1` (nuevo), `random`, `rule`, `wait` (existentes).
Todos reciben exactamente el mismo tipo de Observation/Feedback y tienen el mismo
presupuesto de ticks, no el mismo número de movimientos aceptados ni tiempo CPU.
Random conserva su PRNG derivado actual; FrontierMemory, Rule y Wait no requieren
sorteos adicionales. No cambiar los baselines para favorecer al agente nuevo.

FrontierMemory-v1, política determinista propuesta y reproducible:

1. reset borra mapa conocido, posiciones visitadas y recursos consumidos. No hay
   estado compartido entre episodios ni entrenamiento sobre la batería final.
2. En cada step, incorporar las9 celdas de Observation.local_view de radio1 a un
   mapa absoluto, usando self.position. Conservar FREE/BLOCKED/RESOURCE/HAZARD/
   OUT_OF_BOUNDS observados. RESOURCE no revela stock.
3. Incorporar self.position a visitadas. Añadir a consumidos las posiciones de
   RESOURCE_CONSUMED en el último resultado expuesto. Usar solo información que
   Feedback suministra, no grid, seed de WORLD, snapshots, Recorder o replay.
4. Construir el grafo cardinal de celdas conocidas transitables (FREE/RESOURCE/
   HAZARD). BFS desde self.position, vecinos en orden N,E,S,W. No atravesar celdas
   desconocidas, BLOCKED u OUT_OF_BOUNDS.
5. Prioridad1: recursos conocidos, alcanzables y no consumidos. Elegir distancia
   BFS mínima, desempatar por y y luego x. Prioridad2, si no hay esos recursos:
   celdas conocidas transitables alcanzables con al menos un vecino cardinal aún
   desconocido (fronteras). Misma distancia y desempate. Se conocen también los
   OUT_OF_BOUNDS; no tratarlos como fronteras.
6. Ejecutar la primera acción de la ruta BFS elegida; si no hay destino/ruta de
   longitud positiva, WAIT. En radio1 los vecinos inmediatos de la posición actual
   ya están observados, por lo que esta no es una frontera desconocida.

El conjunto consumidos sigue siendo válido porque regeneración=0. Las asunciones
se archivan como parámetros del algoritmo, no se obtiene estado privilegiado.
Un evento de consumo de la última acción puede no llegar al agente, pero ya no
hay otra decisión: métricas usan la trayectoria registrada, no memoria del agente.
No llamar step una vez extra al terminar. Ante desacuerdo de implementación con
estas reglas, detener evaluación y versionar antes de cambiar el algoritmo.

## Configuración exacta

```json
{
  "max_ticks": 160,
  "world_config": {
    "width": 12, "height": 12, "topology": "BOUNDED",
    "obstacle_density": 0.15, "resource_density": 0.12, "hazard_density": 0,
    "initial_energy": 240, "move_cost": 1, "wait_cost": 1,
    "resource_effect": 8, "hazard_damage": 0, "resource_regeneration": 0,
    "death_threshold": 0, "observation_radius": 1
  },
  "feedback_config": {
    "expose_validity": true, "expose_reason": true,
    "expose_events": true, "expose_energy_delta": true
  }
}
```

Añadir solo los campos canónicos `experiment_seed` y `agent_type` de cada ejecución
para formar ExperimentConfig de cinco campos. No insertar IDs, parámetros del agente
o metadatos operacionales en ese esquema. Modo WITH_AGENT para los cuatro agentes.

La energía inicial evita que una política sin ganancias agote energía en160
acciones de coste1; obstáculos no son aleatoriedad nueva. Wait no recibe una ventaja
de coste cero. El estudio aísla exploración/recolección de muerte y hazards, sin
pretender demostrar comportamiento en esas otras condiciones. Recursos se agotan:
no puede optimizarse el indicador recolectando indefinidamente el mismo stock.
Energía final no será indicador de éxito: los intentos inválidos pueden no cobrar
coste bajo la política actual y confundirían esa comparación.

## Semillas y controles

- Desarrollo/smoke: `experiment_seed` en **1,2,3,4**. Solo integración, cálculos
  pequeños y medición de coste; no incorporar sus resultados a la comparación final.
- Evaluación: los **32 enteros consecutivos de1001 a1032**, ambos incluidos.
  No son una muestra IID declarada. No elegirlos ni reemplazarlos según desempeño.
- Dos repeticiones por combinación semilla/agente. Las dos tienen la misma semilla
  de experimento, namespace, parámetros y código. No introducir un nuevo seed de
  repetición: su función es comprobar igualdad, no medir variación estocástica extra.
- Mantener nombres de agente anteriores exactamente. Archivar namespace, semilla
  de experimento y ambas semillas derivadas. derive_seed(seed,"world") es común a
  los agentes; derive_seed(seed,agent_type) es específica del agente. Mismo número
  de semilla no significa mismo flujo aleatorio de los agentes.
- Comprobar igualdad del estado inicial y bytes WLS1 entre agentes para cada seed,
  no solo el hash. Mantener presupuesto y reglas de información idénticos.
- No entrenar/tunear en1001–1032. Cualquier cambio después de observar evaluación
  crea otra versión y evaluación futura; los resultados anteriores no se sustituyen.

Orden de lanzamiento secuencial determinista: seed ascendente; agentes
wait,random,rule,frontier_memory_v1; repetición1 y después2. Se conserva este orden
como procedimiento, sin utilizar tiempos del host para decidir acciones. No comparar
velocidad CPU entre algoritmos con estos tiempos de extremo a extremo.

## Métricas prefijadas y tratamiento de fallos

| Métrica | Definición y fuente |
|---|---|
| Principal C | Número de RecordedEvent con source=action y type=RESOURCE_CONSUMED durante el episodio. Con stock binario y regeneración0 cada ubicación se consume como máximo una vez. |
| Diferencia D(seed) | C(frontier_memory_v1)−C(random), una sola observación por seed tras comprobar repetición idéntica. Media exacta: suma de enteros D dividida por número de pares elegibles. H+ iff suma D>0. |
| Distribución | Tabla completa D, media/mediana/min/max, victorias/empates/derrotas. Comparaciones Rule/Wait descriptivas, no selección posterior de otra hipótesis principal. |
| Cobertura | Número de posiciones distintas de la entidad en initial_state y steps, incluido el inicio. No equivale a conocer todo el mapa ni visitar solo recursos. |
| Acciones rechazadas | Conteo por validity y reason tal como figuran en ActionResult. No reinterpretar FAILED como INVALID; fuente es la política implementada identificada. |
| Contexto y fallos | Pasos, terminación, consumos por ubicación, número inicial de recursos, estado de ejecución y diagnóstico; tasa de fallos sobre todos los intentos. No usar status COMPLETED como éxito de la política. |

El evaluador puede leer la trayectoria completa; el agente no. Verificar conteos
manualmente en fixtures mínimos antes de evaluación; no elaborar puntuaciones ni
normalizaciones después de observar resultados. Cero recursos iniciales se conserva
con C=0; no se excluye por hacer menos favorable la batería. No se necesita dividir
por número de recursos para la comparación pareada principal.

Inicialización inválida por falta de posición: registrar las cuatro respuestas y
ambas repeticiones, comprobar que el origen falló para todos con la misma seed;
ese escenario no tiene episodio y queda fuera de D por una regla independiente del
algoritmo. Conservar32 escenarios intentados y el número elegible, sin sustitución.
Si no hay pares elegibles, conclusión NOT_EVALUABLE, no victoria ni fracaso empírico.

Si en un mundo inicial válido ocurre FAILED de agente, excepción interna, timeout,
replay inválido o diferencia entre repeticiones, la campaña no obtiene aceptación
técnica. No quitar ese algoritmo/seed del promedio ni sustituir el caso: conservar
los datos y marcar la comparación final NOT_EVALUABLE hasta resolver mediante una
versión nueva. Los escenarios solo se excluyen por fallo inicial común, no por
resultados del algoritmo. Un agente que vuelve WAIT160 veces es un resultado
válido, no un fallo de integración.

## Repetición, archivo y aceptación

Cada ejecución exitosa debe exportarse y recargarse sin pérdida de Map, BigInt,
números admitidos y campos. Conservar forma canónica de datos separada de un
contenedor operacional con revisión del motor, artefacto del agente/parámetros,
protocolo/hash, runtime/entorno, seeds, ID de intento y mediciones del host.
Los timestamps/tiempos de CPU/IDs de ejecución **no** participan en igualdad de
repeticiones ni entran en hashes WLS1, WORLD o los esquemas cerrados.

Reproducir todas las trayectorias completas de este piloto con acciones grabadas,
modo WITH_AGENT y contexto explícito. Comparar estados/eventos/records/bytes, no
solo hashes. Replay no sustituye repetir decisiones del agente desde reset. No
atribuirle reproducción de la causa de un fallo externo del agente.

**Éxito técnico:** todos los escenarios válidos completos y deterministas, artefactos
recargables, verificación de replay, métricas correctas, fallos contados y procedencia
completa. **Éxito de H+:** D medio>0 en batería elegible aceptada técnicamente.
**H+ no sostenida:** D medio≤0; es un resultado científico válido, no un motivo para
cambiar semillas, esperado o métrica. No exigir que FrontierMemory gane para aceptar
el laboratorio. H+ se limita a este conjunto finito/configuración; no prueba eficacia
general, memoria como causa aislada, entrenamiento ni rendimiento en hazards/multiagente.

## Coste esperado, medición y límites operacionales

No hay medida de este algoritmo todavía; no prometer segundos, dinero ni porcentaje
de mejora. Trabajo planificado:16 episodios smoke y256 de evaluación; máximo
**43.520 ticks de ejecución** (2.560+40.960), excluidos replay/verificadores.144 celdas
por estado;160 snapshots de pasos implican23.040 celdas por trayectoria, antes de
copias de trabajo, entidades y observaciones. Registro completo crece con mundo×pasos.

Antes de evaluación, medir smoke por agente: wall-clock extremo a extremo, CPU,
maxRSS, bytes archivados y coste separado de replay/validación. Registrar Node/OS/CPU
y versión de código. Proyectar coste por medias observadas de smoke y64 episodios de
evaluación por agente; informar rango observado y que la proyección no es garantía.
No interpretar este diagnóstico como benchmark del tiempo exclusivo del algoritmo.

Topes operacionales **propuestos para F6-B, no mediciones ni dominios normativos**:
30segundos por proceso de episodio y512MiB de heap V8 mediante
`--max-old-space-size=512` (no es un límite exacto de RSS). Si smoke excede el tope,
detener antes de evaluación, reportar y revisar presupuesto/protocolo expresamente;
no aumentar el tope ni acortar episodios de forma silenciosa. Timeout debe poder
terminar el proceso hijo, registrarse fuera de ExperimentResult/Trajectory y no
fingir muerte o límite de ticks. Los valores requieren confirmación en la orden F6-B.

No se promete soportar toda configuración normativa: se declara el perfil usado.
Radio0 de RuleAgent y capacidad de observación grande siguen como limitaciones
separadas; este piloto radio1 no las prueba ni las corrige. Al cerrar P01 no se
declaran conformidad, interoperabilidad, Hitos B/C ni aprobación del perfil F5-C.
