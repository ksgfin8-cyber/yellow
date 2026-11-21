# WORLD-LAB — Caracterización epistemológica, metodológica e instrumental

**Fecha de registro:** 2026-11-21 (America/Guayaquil).

**Naturaleza:** informe de investigación retrospectiva y análisis estático; no es certificación, modificación normativa, protocolo nuevo ni autorización de ejecución.

**Procedencia:** informe entregado en el chat en respuesta a la «ORDEN — WORLD-LAB: Caracterización epistemológica, metodológica e instrumental». El propietario solicitó después conservarlo en documentación. Se preserva su contenido técnico y se adapta la navegación a esta ubicación.

**Marco metodológico:** [RDL-PB-001 v0.1 original](../program/RDL-PB-001_v0.1_original_propuesta.md), [adoptado e inmutable](../program/RDL-PB-001_v0.1_AUTHORITY_AND_ADOPTION.md). SHA-256 del original: `84019bd0c70206d9f90ec219d4fefbc1eb58041ba1762818687ae8a983317436`.

**Base examinada y de publicación:** `main@3718d61f301e01350c8ca6e7d1f924fc614d41ba`, posterior al PR #64.

**Alcance de ejecución del estudio:** lectura, análisis estático y recuentos retrospectivos sobre archivos existentes. No se ejecutaron WORLD, agentes, episodios, replay ni campañas. No se ejecutan recomendaciones por registrar este informe.

**Estados y datos históricos:** se conservan los expedientes originales. Los nuevos recuentos exploratorios se identifican como posteriores y no sustituyen las métricas, hipótesis ni decisiones preregistradas de P01.

WORLD-LAB permite producir evidencia válida sobre políticas computacionales concretas dentro de un modelo experimental delimitado. Su principal fortaleza es conectar condiciones iniciales, decisiones, consecuencias, registros y comprobaciones reproducibles. Esa capacidad no convierte automáticamente las trayectorias en explicaciones del mecanismo interno ni los resultados locales en generalizaciones.

El hallazgo retrospectivo más útil de este estudio es la **saturación del consumo geométricamente alcanzable atribuida a FrontierMemory en las 32 semillas P01**, conforme a un recuento sobre archivos históricos cuyo componente geométrico aún requiere reproducción independiente (§C.2.1). Si se confirma, repetir la misma comparación de consumo puede aportar menos información que investigar otras propiedades, siempre que estas afecten una decisión del propietario.

Este informe no autoriza ninguna de esas investigaciones.

## Fuentes, inventario y genealogía

Se identificó el inventario completo: **661 archivos versionados**, **462 artefactos bajo `docs/`**, incluidos **96 documentos Markdown**; el repositorio completo contiene **106 Markdown**. La lectura semántica se concentró en las fuentes y componentes pertinentes: este trabajo no se presenta como una nueva auditoría exhaustiva de integridad de todos los paquetes históricos.

Se contrastaron código y documentos, y se realizó análisis retrospectivo de archivos existentes. Durante la elaboración analítica no se modificaron archivos ni se abrió PR. La publicación documental posterior fue solicitada separadamente por el propietario.

La genealogía evita interpretar encabezados históricos como estados actuales:

| Expediente | Estado vigente pertinente |
|---|---|
| WORLD-LAB v0.2.5 y D-01 | Fuentes técnicas vigentes dentro de sus respectivos ámbitos; conformidad integral no establecida. |
| F1–F4 y registros de implementación | Historia de construcción y decisiones; los primeros estados parciales no sustituyen el código integrado posterior. |
| Conformidad F5/F6-N | Persisten fuentes históricas ausentes, G00 y 289 casos BLOCKED. Las propuestas no aprobadas no adquieren autoridad. |
| Preparación F6, gates e integración E3 | Antecedentes de la ejecución posterior; sus HOLD originales son cortes históricos. |
| P01 E3/E4/E5 | Ejecución, reproducción y aceptación científica acotadas, conservadas. |
| C2 y cierre P01 | Respaldo externo verificado en el alcance de la copia Windows comunicada por el propietario; OneDrive no verificado. |
| Construcción y congelación WORLD-LAB | Cierre y congelación operacional acotada aprobados. |
| RC1 A/B → C/D → piloto → R1 → calibración | Caracterización parcial; calibración completa en su alcance; investigación temporalmente congelada, ejecutor128 y RC1-E en HOLD. |
| TITAN | G1 y contraste de equivalencia D4 documentados; evaluación G2 no ejecutada y en HOLD. |
| Playbook y evaluaciones | Adopción normativa vigente; evaluación corregida mediante PR #63. Los documentos anteriores que dicen PROPOSED conservan su procedencia histórica. |

Fuentes de navegación:

- [Especificación v0.2.5](../WORLD-LAB_v0.2.5_canonical_transcripcion.md) y [enmienda D-01](../WORLD-LAB_v0.2.6_contractual_amendment_D-01.md).
- [Congelación operacional](../audits/WORLD_LAB_OPERATIONAL_FREEZE.md), [auditoría de cierre](../audits/WORLD_LAB_CLOSEOUT_AUDIT_REPORT.md) y [matriz de capacidades](../audits/WORLD_LAB_CAPABILITY_AND_EVIDENCE_MATRIX.md).
- [Evaluación metodológica histórica](../audits/PLAYBOOK_ASSESSMENT.md), [aplicación especializada corregida](../audits/RDL-PB-001_WORLD_LAB_APPLICATION_AND_VERDICT.md) e [inventario de decisiones derivadas](../program/RDL-PB-001_v0.1_DECISION_DERIVATION_AND_VERDICT.md).
- [Protocolo P01](../F6-A-pilot-protocol.md), [E3 y recuperación](../p01-e3-final/README.md), [E4](../p01-e4/E4-report.md), [E5](../p01-e5/FINAL_ACCEPTANCE_REPORT.md) y [cierre C2](../p01-c2-closure/CLOSURE_STATUS.json).
- [Acta temporal RC1](RC1_TEMPORARY_FREEZE_2026-11-20.md), [piloto parcial](wl-rc1-pilot-v1/PILOT_REPORT.md) y [calibración](wl-rc1-r1-calibration-results-v1/CALIBRATION_REPORT.md).
- [TITAN G1](titan-mvp-01/IMPLEMENTATION_REPORT.md), [equivalencia D4](titan-mvp-01/EQUIVALENCE_VERIFICATION.md) y [protocolo G2 no ejecutado](titan-mvp-01/EXPERIMENT_PROTOCOL.md).

## A. Caracterización de capacidades epistemológicas

WORLD-LAB permite responder principalmente cinco clases de preguntas:

| Clase de pregunta | Qué evidencia puede producir | Límite principal |
|---|---|---|
| **Contractual** | Si una implementación satisface determinados tipos, dominios, órdenes y condiciones comprobadas. | Los tests locales no prueban todos los contratos ni resuelven fuentes normativas ausentes. |
| **Conductual** | Qué acciones, recorridos, consumos, rechazos y terminaciones produce una política identificada. | Describe esa implementación y las condiciones estudiadas. |
| **Comparativa** | Diferencias entre políticas sobre mundos iniciales y presupuestos controlados. | Una comparación de políticas completas no identifica automáticamente qué componente explica la diferencia. |
| **Mecanicista acotada** | Relaciones entre entradas, estado interno conocido y selección de acciones, mediante código, pruebas diferenciales o diagnósticos. | La trayectoria del mundo por sí sola no identifica de forma única el mecanismo interno. |
| **Instrumental** | Integridad, reproducibilidad, recuperación, costes observados y limitaciones de los instrumentos. | La instrumentación puede preservar la semántica y, simultáneamente, alterar los tiempos medidos. |

Conviene distinguir la cadena epistemológica:

- **Observación:** posición, acción, evento, duración u otro dato registrado.
- **Resultado:** conteo o cálculo sobre esos datos.
- **Evidencia:** resultado pertinente para una afirmación delimitada.
- **Inferencia:** paso desde esa evidencia hasta una conclusión.
- **Explicación:** propuesta sobre por qué ocurre un comportamiento.
- **Causalidad:** atribución apoyada en intervenciones y controles adecuados.
- **Generalización:** extensión a condiciones no examinadas.
- **Transferencia:** aplicación en otro contexto, con revalidación de los supuestos pertinentes.

No hay implicación automática entre esos niveles.

### A.1. Indistinguibilidad de mecanismos

Dos algoritmos pueden producir las mismas acciones y trayectorias con mecanismos internos diferentes. TITAN D4 y el controlador directo de prioridades proporcionan un caso concreto.

Eso permite concluir equivalencia conductual en el dominio sustentado. **No permite identificar la teoría interna a partir de la trayectoria**, ni acreditar una ventaja distintiva del mecanismo más elaborado.

Tampoco significa que WORLD-LAB sea incapaz de estudiar mecanismos: necesita combinar la trayectoria con código, estados internos pertinentes, diagnósticos o intervenciones discriminativas. Los registros de salida no sustituyen esos instrumentos.

## B. Mapa de observabilidad y evidencia

El flujo implementado puede expresarse como:

\[
s_t \rightarrow o_t \rightarrow f_t \rightarrow
(a_t,m_{t+1}) \rightarrow s_{t+1}
\]

donde \(s_t\) es el estado del mundo, \(o_t\) la observación, \(f_t\) el feedback y \(m_t\) la memoria privada del agente.

Recorder conserva evidencia de esa interacción; replay reconstruye transiciones usando las acciones registradas.

| Frontera | Información disponible | Información ausente o condicionada |
|---|---|---|
| **WORLD** | Mapa completo, stock, entidad, energía, lifecycle, reloj y RNG del mundo. | No necesita conocer la memoria ni el mecanismo interno del agente. |
| **WORLD → Observation** | Tick, identificador, posición absoluta, energía y ventana local de celdas. | No entrega el mapa global ni el RNG; RESOURCE no distingue stock0/1. Lifecycle no aparece como campo de `self`. |
| **Observation → Feedback** | Observación y resultado anterior proyectado según cuatro flags. | Los campos ocultos se neutralizan; eso no garantiza que ninguna magnitud pueda inferirse mediante una historia de observaciones autorizadas. |
| **Feedback → Agent** | La entrada actual y la memoria que el agente conserva. Random dispone además de su PRNG propio. | No se entrega el snapshot privilegiado del mundo al agente. |
| **Agent → Action** | Un registro `{type}`. | No transporta una justificación, memoria completa, coste computacional ni prueba del mecanismo decisional. |
| **WORLD → Recorder** | Estado completo confirmado, acción, ActionResult, observación/feedback anteriores a la acción y eventos. | No incluye automáticamente la memoria privada o el RNG del agente. |
| **Recorder → Trajectory** | Estado inicial, pasos, eventos, estados completos, hashes y configuración. | No equivale a una traza de todas las instrucciones o fases internas ejecutadas. |
| **Trajectory → Replay** | Acciones y contexto suficientes para reproducir las transiciones del mundo. | El replay no vuelve a ejecutar la política del agente para demostrar que habría elegido esas acciones. |
| **Archivo → Analista** | Evidencia científica, procedencia, configuración y diagnósticos operacionales conservados. | Su alcance depende del paquete y del instrumento; un timeout puede impedir recibir el resultado que permanecía en memoria del worker. |

### B.1. Tres precisiones importantes

1. **Oculto en una observación no significa necesariamente irrecuperable.** Con stock inicialmente binario, regeneración0, una entidad y eventos completos, el historial permite inferir consumos que la representación RESOURCE no revela instantáneamente.

2. **La memoria privada no está registrada genéricamente, pero puede reconstruirse en casos concretos.** Para los agentes conocidos, con código exacto, reset, semillas e historial suficiente, sus actualizaciones deterministas pueden reconstruirse. Eso es diferente de haber observado directamente su estado. TITAN añade un diagnóstico externo con estados proyectados y cálculos decisionales.

3. **El reloj de entrada y el del registro representan momentos distintos.** La observación corresponde a \(t\); el paso confirmado corresponde a \(t+1\). Ignorar esta relación puede asignar a una acción información que el agente todavía no había recibido.

Además, `STATE_HASH_FULL` identifica el estado serializado del **mundo**, incluido su RNG. No es un hash del estado integral del experimento con toda la memoria del agente.

## C. Evaluación metodológica retrospectiva

### C.1. P01: comparación válida de políticas completas

P01 preguntó si FrontierMemory-v1 obtenía más consumos que Random en una batería fija, con mundos iniciales y horizonte pareados. No pretendió demostrar inteligencia general, aprendizaje ni el efecto aislado de la memoria.

Los candidatos cubren comportamientos diferentes:

| Agente | Diferencia implementada | Función y límite metodológico |
|---|---|---|
| **Wait** | Siempre WAIT. | Referencia de inacción espacial y comprobación operacional. No representa un competidor exploratorio. |
| **Random** | Selección uniforme entre cinco acciones mediante su PRNG. | Referencia no informada por el feedback. No representa todas las políticas estocásticas ni todos los exploradores sin memoria. |
| **Rule** | Busca recursos cardinales inmediatos; si no encuentra, espera. | Control reactivo local. Carece de exploración deliberada y memoria de agotamiento. |
| **FrontierMemory** | Mapa conocido, consumos recordados, BFS y objetivos de recursos/fronteras. | Política combinada. Su diferencia frente a Random no aísla memoria, planificación o selección de objetivos. |
| **TITAN D4** | Prioridades locales con memoria de visitas/consumos implementadas mediante selector de costes. | Operacionalización específica; su equivalencia con prioridades directas limita las atribuciones distintivas al selector. |

Todos reciben el mismo **tipo de información**, pero no la utilizan igual. FrontierMemory incorpora la ventana completa; Rule y TITAN deciden sobre vecinos cardinales; Random y Wait no explotan esa observación para seleccionar acciones. Esa diferencia es parte de las políticas comparadas, no prueba de acceso privilegiado.

También comparten presupuesto de **ticks**, no presupuesto idéntico de CPU ni número de movimientos aceptados.

**P01 admite una comparación intervencional total dentro del simulador:** se sustituye una política por otra, manteniendo mundo inicial y configuración, bajo los supuestos de ejecución aislada y transición determinista. No identifica por ello el efecto causal de la memoria sola ni una relación causal fuera del modelo.

### C.2. Nuevo resultado retrospectivo: saturación del indicador principal

Se realizó un análisis exploratorio de los archivos ya conservados:

1. Se leyó un estado inicial archivado por semilla.
2. Se recorrió su componente conexa desde la posición inicial, mediante movimientos cardinales por celdas transitables.
3. Se contaron los recursos iniciales de esa componente.
4. Se recontaron los eventos de consumo de FrontierMemory y se contrastaron con E4.
5. Se comprobaron los SHA-256 de **64 archivos** —Wait y FrontierMemory, primera repetición de cada semilla— contra `campaign.json`, y la igualdad de sus estados iniciales.

No se ejecutaron transiciones, agentes ni replay.

**Identificación de la evidencia:** fuente histórica local `/workspace/shared/world-lab/p01-final-20261113-01/`, `campaign.json` y archivos `1001-wait-1.wlx.gz` … `1032-wait-1.wlx.gz`, junto con sus correspondientes `*-frontier_memory_v1-1.wlx.gz`. Son referencias del entorno de análisis, no enlaces públicos. La recuperación del paquete original se documenta en [RECOVERY.md de E3](../p01-e3-final/RECOVERY.md). Los conteos por episodio se contrastaron con [independent-descriptors.json de E4](../p01-e4/independent-descriptors.json). La búsqueda de conectividad recorrió vecinos N/E/S/W con `traversal="FREE"`; contó celdas con efecto RESOURCE y stock1. Estos pasos describen el recuento retrospectivo realizado, no un protocolo experimental nuevo ni una orden de ejecución.

### C.2.1. Trazabilidad y reproducibilidad del descriptor geométrico H04

**Unidad de cálculo:** una semilla de la batería P01, sin contar dos veces su repetición determinista. **Entradas declaradas:** para cada semilla 1001–1032, el `initial_state` del archivo de la primera repetición de Wait (`<seed>-wait-1.wlx.gz`) y los eventos `RESOURCE_CONSUMED` de la primera repetición de FrontierMemory (`<seed>-frontier_memory_v1-1.wlx.gz`). Los nombres son miembros del paquete E3 identificado anteriormente; su contenido no se incorpora ni modifica aquí. Los SHA-256 declarados fueron contrastados por el análisis original con el manifiesto `campaign.json`. La reproducción necesita ese paquete y manifiesto exactos.

**Transformación geométrica declarada:** construir un grafo cuyas posiciones son las celdas transitables del mapa inicial (`cell.traversal === "FREE"`) y cuyas aristas unen únicamente vecinos cardinales N/E/S/W dentro de los límites BOUNDED. Partir de `initial_state` en la posición inicial de la entidad, recorrer mediante BFS/DFS las celdas transitables conectadas y contar, una sola vez por posición, las celdas visitadas con `cell.effect.kind === "RESOURCE"` y `cell.effect.stock === 1`. Denominar ese conteo `R_alcanzable(seed)`. Contar separadamente `R_total(seed)` sobre todas las celdas iniciales y `C_frontier(seed)` sobre eventos de consumo de fuente `action` de la trayectoria correspondiente. La comprobación por semilla es `C_frontier(seed) === R_alcanzable(seed)`, además de `R_alcanzable(seed) <= R_total(seed)`. Mantener distintas las posiciones inicialmente inalcanzables y las alcanzables no consumidas.

**Resultados declarados por el análisis original:** `sum R_total = 470`, `sum R_alcanzable = 463`, `sum C_frontier = 463`, e igualdad por semilla en 32/32; las siete unidades de diferencia se distribuyen entre los cinco mapas enumerados abajo. El recuento `C_frontier = 463`, `R_total = 470` y los cinco pares total/consumo son contrastables directamente con `docs/p01-e4/independent-descriptors.json`. **La reconstrucción independiente del BFS sobre los estados iniciales archivados no consta ejecutada en esta revisión documental.** En consecuencia, la igualdad con la cota geométrica sigue siendo un **resultado retrospectivo declarado y contrastado parcialmente**, no un contraste geométrico independiente adicional. El algoritmo anterior permite reproducirlo sin nuevas ejecuciones del mundo.

**Alcance de la cota:** la conectividad expresa accesibilidad geométrica bajo movimientos cardinales y mundo inicial estático. No garantiza que una política cualquiera pueda recolectar todos los recursos dentro de su horizonte o presupuesto energético. En P01, las condiciones de energía, ausencia de hazards y regeneración0 permiten interpretar la igualdad observada como saturación de consumo en la batería concreta; no como optimalidad general de la política.

| Magnitud, 32 semillas | Resultado |
|---|---:|
| Recursos iniciales totales | **470** |
| Recursos geométricamente alcanzables | **463** |
| Consumos FrontierMemory | **463** |
| Consumos Random | **107** |
| Consumos Rule | **11** |
| Semillas donde FrontierMemory iguala el número alcanzable | **32/32** |
| Recursos inaccesibles | **7**, distribuidos en cinco mapas |
| Tick del último consumo de FrontierMemory | **52–111**, media **82,3125** |

Los cinco mapas con recursos inaccesibles fueron:

| Semilla | Recursos totales | Alcanzables | Consumos FrontierMemory |
|---|---:|---:|---:|
| 1005 | 8 | 7 | 7 |
| 1009 | 12 | 11 | 11 |
| 1019 | 16 | 15 | 15 |
| 1030 | 17 | 15 | 15 |
| 1032 | 14 | 12 | 12 |

Con mapa estático, movimientos cardinales y regeneración0:

\[
C_s \le R_{\text{alcanzable},s}
\]

Según el recuento geométrico retrospectivo declarado, FrontierMemory alcanzó esa cota en cada mundo examinado y **habría saturado el consumo posible bajo esas inicializaciones y el horizonte registrado**. La reproducción independiente de la conectividad está pendiente si esta afirmación sostiene una decisión material (§C.2.1). No prueba rutas más cortas, menor CPU, eficiencia energética óptima ni comportamiento óptimo en otros mundos.

Es un **descriptor exploratorio posterior**, no una nueva hipótesis preregistrada, nueva muestra o sustitución del resultado P01. La comparación original permanece: media D=11,125 y 32 victorias.

La implicación decisional es **condicional a reproducir el cálculo geométrico de H04**: si la igualdad por semilla se confirma, en esta batería C no podría mostrar una mejora de consumo sobre FrontierMemory. Solo tendría sentido evaluar otras propiedades si una decisión concreta depende de ellas; la saturación no obliga por sí sola a investigar eficiencia temporal, CPU o transferencia.

### C.3. Energía y horizonte delimitan lo que P01 puede discriminar

P01 configura energía inicial240, coste1, horizonte160, ausencia de hazards y efecto de recurso positivo.

Por tanto:

\[
E_t \ge 240-t \ge 80
\]

en episodios válidos de esa configuración. La supervivencia no es una dimensión competitiva activa. Los registros confirman que los 256 episodios llegaron a160 ticks y terminaron por límite temporal.

Además, si \(I\) cuenta rechazos espaciales y \(C\) consumos:

\[
E_{\text{final}}=80+I+8C
\]

Los intentos espaciales inválidos no pagan energía, aunque consumen tick. **La energía final podría aumentar por rechazos**, sin que eso signifique mejor exploración. El protocolo ya anticipó este problema y no la eligió como éxito principal.

### C.4. RC1: información sobre el instrumento, no caracterización general completada

El piloto preservó un resultado parcial: dos condiciones completas, una censurada por timeout y45 no ejecutadas. El límite de localización también es un resultado: sin marcas por etapa no puede asignarse el timeout a una API concreta.

La calibración posterior completó24 workers y216 muestras en tres celdas perfil/operación. Conservó igualdad estructural y WLS1, pero detectó variaciones temporales y dejó pendiente la autorización del ejecutor128.

En la suma de ventanas de workers se registraron aproximadamente:

- **49,22 %** de preparación.
- **2,48 %** en ventanas de API.
- **35,28 %** de trabajo de proceso.

Esos porcentajes describen ventanas, no causas aisladas. Un contraste SYNC/OFF tampoco equivale a comparar “instrumentado” contra “sin instrumento”: OFF conserva otras mediciones, testigos y transporte.

La conclusión útil es que **la semántica puede coincidir mientras la medición temporal permanece perturbada o confundida**. No se ha demostrado una ley general de escalado ni un presupuesto suficiente para128 condiciones.

### C.5. TITAN: evidencia de integración y límite de identificabilidad

G1 demostró integración aislada, archivo y reproducción de desarrollo. El contraste posterior comparó una implementación independiente de prioridades con TITAN D4: 2.401 patrones y7.903 comparaciones sin divergencias.

Esto respalda la equivalencia delimitada, no la teoría completa.

Los costes D4 —0/1/3/4/5 y \(L=2\)— son **puntuaciones de la operacionalización**. No son mediciones de CPU, gasto energético del mundo ni coste económico. Que NULL tenga coste decisional0 no hace gratuito WAIT: el mundo aplica su coste y avanza el reloj.

La equivalencia responde a una pregunta concreta. No responde automáticamente a todas las preguntas descriptivas del protocolo G2, pero sí impide presentar una futura comparación conductual como validación distintiva del selector frente a la regla equivalente.

## D. Hallazgos verificables

Las categorías siguientes son analíticas. “Demostrado” identifica evidencia dentro del alcance; no transforma una revisión estática en un experimento nuevo.

| ID y afirmación | Archivo/componente y evidencia; fundamento metodológico | Estado, dominio y limitaciones | Impacto sobre futuras investigaciones |
|---|---|---|---|
| **H01 — La observación es una proyección incompleta, pero parte de lo oculto puede reconstruirse.** | `js/interface/observation.js`, `feedback.js` y estados de Recorder. Análisis de flujo y reconstruibilidad. | **DERIVADO.** Stock no expuesto instantáneamente; historia, eventos y reglas pueden permitir inferencias. No aplica automáticamente a agentes o dependencias desconocidas. | Antes de añadir campos o declarar pérdida, comprobar qué se deduce del historial existente. |
| **H02 — La trayectoria no identifica de forma única el mecanismo decisional.** | `titan_mvp_01.js`, oráculo y `EQUIVALENCE_VERIFICATION.md`. Análisis de identificabilidad y contraste diferencial. | **DEMOSTRADO en el contraste; DERIVADO bajo las premisas D4.** No acredita equivalencia global de teorías. | Usar referencias conductualmente equivalentes para separar implementación de mérito científico distintivo. |
| **H03 — El conjunto `visited` de FrontierMemory no interviene en su selección de acciones.** | `frontier_memory_agent.js`: se crea y actualiza, pero la elección consulta `known`, `consumed`, rutas y fronteras. Análisis estático de dependencias. | **DERIVADO**, para el código actual. No significa que toda su memoria sea irrelevante. | Una ablación que solo elimine `visited` no aislaría la memoria que realmente dirige la política. |
| **H04 — FrontierMemory saturó C en las32 semillas P01.** | Estados iniciales y eventos archivados; conectividad declarada en §C.2.1 y contraste de consumos/totales con `independent-descriptors.json`. | **RESULTADO RETROSPECTIVO DECLARADO Y CONTRASTADO PARCIALMENTE**: consumos y totales corroborados; BFS de los estados iniciales no reproducido independientemente en esta revisión. La cota condicional se **DERIVA** del modelo. No constituye nueva muestra. | Antes de invertir en otra comparación de consumo, verificar la cota si la decisión depende de ella; no proponer nuevas métricas sin pregunta decisional. |
| **H05 — P01 no discrimina supervivencia y su energía final mezcla consumo con rechazos.** | `World.apply_action`, configuración P01 y registros E4. Invariantes energéticos. | **DERIVADO**, con costes1, energía240, horizonte160 y sin daño. No se generaliza a otros perfiles. | Elegir métricas según el fenómeno; no interpretar energía final como calidad global de la política. |
| **H06 — La selección permite comparar políticas completas, no aislar componentes internos.** | Código de Wait/Random/Rule/FrontierMemory y protocolo P01. Análisis de controles y confusores. | Diferencias implementadas **DEMOSTRADAS por código**; contribución causal individual de memoria/BFS **NO ESTABLECIDA**. | Si importa un mecanismo particular, la comparación necesaria debe cambiar ese mecanismo, no varios a la vez. |
| **H07 — Algunas políticas tienen estados de espera persistente por diseño.** | `rule_agent.js` y D4: sin recurso cardinal Rule espera; sin oportunidad D4 espera. Mundo estático sin cambios que creen oportunidad. | **DERIVADO** bajo esas condiciones. No demuestra un error de integración. | Clasificar WAIT persistente como resultado conductual cuando procede, sin reparar artificialmente el agente. |
| **H08 — La regeneración implementada distingue0 de cualquier entero positivo, no distintas velocidades positivas.** | `World.regenerate_resources`: stock binario y `min(1, stock+rate)`. Análisis de equivalencia de parámetros. | **DERIVADO** para esa implementación y dominio. No afirma recuperación normativa completa de la fórmula histórica. | No diseñar una comparación de “dosis” positivas como si necesariamente produjeran dinámicas diferentes. El recuerdo permanente de agotamiento tampoco se transfiere sin revisión a regeneración positiva. |
| **H09 — Replay y múltiples derivados no añaden unidades experimentales independientes.** | `replay.js`, protocolo y resultados E4; WLS1 en `hash_state.js`. Análisis de dependencia y alcance de reproducción. | **DEMOSTRADO documentalmente/DERIVADO arquitectónicamente.** Replay aplica acciones registradas, no ejecuta la política. | Separar prueba de transición, reproducción de la política e independencia experimental. |
| **H10 — Igualdad semántica no demuestra ausencia de perturbación temporal.** | RC1 calibración y worker; TITAN calcula diagnóstico interno incluso cuando se omite su copia externa. Análisis de ventanas y controles. | **DEMOSTRADO** en los contrastes RC1; efecto causal puro y coste global del diagnóstico **NO ESTABLECIDOS**. | Definir qué desactiva realmente cada control antes de atribuir costes a la instrumentación. |
| **H11 — La preservación y atomicidad tienen fronteras diferentes.** | `tick_transaction.js`, `experiment.js`, `recorder.js`, `replay.js` y workers. Contraste arquitectónico y hallazgos previos. | **DERIVADO**, con defectos instrumentales previamente demostrados. WORLD revierte su tick; Experiment es fail-stop ante fallo posterior de Recorder; replay coordina restauración propia. | Antes de otra campaña, verificar dónde se conserva el último prefijo y qué ocurre si falla su transporte o verificación. |
| **H12 — Reutilización técnica y productividad económica siguen siendo afirmaciones distintas.** | `EFFORT_SUMMARY.json`, expedientes de integración y RDL §§16–17. Validez de medición y comparación. | Integración reutilizada **DEMOSTRADA en alcance**; mejora económica general **NO ESTABLECIDA**. | Registrar costes completos cuando la decisión lo requiera; no usar cantidad de documentos, tests o archivos como retorno económico. |

Dos consecuencias adicionales de H09:

- Los hashes FNV-1a de32bits no sustituyen la igualdad de estados o bytes: son resúmenes no inyectivos. El archivo completo conserva información que el hash solo no permitiría recuperar.
- Los 256 episodios P01 corresponden a **32 mundos ×4 políticas ×2 repeticiones deterministas**. No son256 escenarios independientes; tampoco los41.216 estados o los informes derivados constituyen nuevas investigaciones.

## E. Conocimiento metodológico reutilizable

| Conocimiento | Soporte actual | Condición de reutilización |
|---|---|---|
| **Buscar una cota de tarea antes de interpretar una puntuación.** | El recuento geométrico explica los siete recursos no consumibles y la saturación de C. | La cota debe corresponder a las reglas reales; conectividad sola no resuelve energía, riesgo o restricciones temporales en otros modelos. |
| **Separar información instantánea de información reconstruible.** | Observación parcial, eventos, snapshots y código determinista. | Contar con contexto, procedencia y reglas suficientes; no asumir reconstrucción de estados privados arbitrarios. |
| **Examinar dependencias reales del código antes de una ablación.** | `visited` almacenado pero no usado para decidir en FrontierMemory. | Aplicarlo a la versión exacta; no sustituye pruebas cuando hay dependencias dinámicas o externas. |
| **Usar equivalencias y oráculos pequeños para preguntas decisionales específicas.** | D4 y prioridades directas. | La prueba debe discriminar la pregunta. No sustituye una campaña que persiga otra propiedad. |
| **Separar igualdad semántica y calidad de la medición temporal.** | RC1 conserva estructuras, pero registra perturbaciones. | Identificar ventanas y controles; no interpretar OFF como ausencia total de instrumento. |
| **Preservar fallos y prefijos con su procedencia.** | Piloto parcial, censura y diferencias entre controladores. | Debe existir una vía efectiva de conservación; la intención de “guardar todo” no garantiza recibir lo que un proceso nunca emitió. |
| **Reutilizar por compatibilidad, no por parecido nominal.** | P01→TITAN conserva motor y parte de los instrumentos, pero requiere adaptador y límites propios. | Revisar diferencias, supuestos y garantías; no heredar conclusiones científicas. |

Está respaldada la utilidad de estos procedimientos para los casos examinados. **Su capacidad de reducir sistemáticamente el coste marginal del programa sigue siendo una hipótesis de mejora**, no un resultado económico demostrado.

## F. Decisiones recomendadas

Son recomendaciones para el propietario, no nuevas obligaciones ni autorizaciones.

| Decisión propuesta | Fundamento y aplicación concreta | Coste y autoridad |
|---|---|---|
| **Antes de comparar políticas, identificar si la métrica tiene techo en los casos disponibles.** | H04 plantea saturación en P01; consumos y totales son consistentes, pero la cota geométrica requiere reproducción independiente si sustenta una decisión material. | Análisis retrospectivo focalizado cuando afecte una decisión; no ampliar protocolos ni infraestructura automáticamente. |
| **Si una decisión futura requiere estudiar eficiencia, distinguir éxito de tarea y recursos necesarios para alcanzarlo.** | H04/H05: el informe registra últimos consumos entre ticks52–111; energía final puede favorecer rechazos. Eso no establece por sí mismo una prioridad de investigación. | Evaluar primero pertinencia y evidencia histórica; no introducir métricas confirmatorias retrospectivas, acortar P01 ni iniciar campaña sin autorización. |
| **Si se quiere atribuir un efecto a memoria o planificación, identificar primero los componentes que realmente influyen en la acción.** | H03/H06. Evita una ablación sobre estado causalmente inactivo. | Revisión estática focalizada de bajo coste; una intervención experimental posterior requiere otra autorización. |
| **Mantener controles por la función que cumplen.** | Wait, Random y Rule tienen propósitos distintos; ninguno representa toda una familia tecnológica. | Justificación previa del control y conservación de su versión. No exige añadir más algoritmos para aparentar rigor. |
| **No ejecutar TITAN G2 solo para volver a probar la equivalencia D4.** | Esa pregunta tiene respuesta delimitada. Las preguntas descriptivas restantes deben justificar su propio valor adicional. | Ahorra una ejecución redundante para esa pregunta; no cancela ni autoriza G2. Decide el propietario. |
| **Antes de depender de un ejecutor limitado, resolver la frontera concreta que afecta a la evidencia.** | H10/H11: completitud tardía, prefijos disponibles no devueltos, límites globales y RSS. | Corrección y verificación focalizadas, si una investigación seleccionada las necesita. No implica reconstruir WORLD ni reabrir RC1. |
| **Medir economía sobre el proceso completo cuando se reclame una mejora.** | H12 y preparación dominante en parte de RC1. No basta el tiempo de la API. | Coste proporcional a la decisión; usar registros existentes cuando basten. Recursos y cualquier intervención nueva requieren aprobación. |
| **Conservar el núcleo aprobado mientras no aparezca una necesidad concreta fuera de su alcance.** | La evidencia no muestra que nuevas mecánicas o infraestructura general sean necesarias para estas conclusiones. | Evita inversión prematura; no prohíbe mejoras futuras justificadas. |

## G. Incertidumbres y próximas verificaciones justificables

Solo se identifican las que podrían cambiar una decisión posterior:

| Incertidumbre | Decisión que podría cambiar | Verificación mínima pertinente, si se autoriza |
|---|---|---|
| Qué explica la ventaja de FrontierMemory | Elegir qué mecanismo desarrollar o conservar. | Delimitar componentes mediante código y, únicamente si sigue siendo relevante, una intervención que los distinga sin cambiar simultáneamente toda la política. |
| Qué diferencia a políticas que ya agotan todos los recursos alcanzables | Seleccionar una política por eficiencia u otra propiedad concreta. | Examinar primero las trayectorias conservadas y definir la propiedad de interés; la saturación por sí sola no elige una métrica nueva. |
| Qué información adicional aportarían las preguntas restantes de TITAN G2 | Invertir o diferir la campaña. | Precisar qué respuesta cambiaría una decisión y comprobar la suficiencia del instrumento. La equivalencia no resuelve todas esas preguntas. |
| Cuánto altera el instrumento las medidas relevantes de RC1 | Confiar en sus comparaciones y autorizar o no su continuación. | Separar ventanas y controles del defecto concreto, con alcance y presupuesto propios; no extrapolar desde tres celdas a toda la matriz. |
| Qué se conserva ante los modos de fallo pendientes | Usar el ejecutor en otra campaña. | Verificación focalizada de completitud, prefijos y recuperación en la revisión exacta propuesta. |
| Si hay mejora económica real por reutilización | Financiar infraestructura o adaptación adicional. | Coste completo y referencia comparable, controlando complejidad y calidad de la decisión. |
| Si una propiedad sobrevive fuera de P01 | Transferir el activo o generalizar la conclusión. | Verificar los supuestos que cambian en el contexto receptor. No se necesita una campaña externa mientras ninguna decisión dependa de esa transferencia. |

No se proponen pruebas para llenar casillas, ni repetir P01 para confirmar de nuevo su conclusión existente.

## H. Dictamen ejecutivo

**Se obtuvo conocimiento adicional sin construir otra infraestructura ni ejecutar nuevas campañas:**

1. **Una caracterización de qué observa cada componente y qué puede reconstruirse**, evitando confundir ocultamiento, ausencia de registro e irrecuperabilidad.
2. **Una explicación geométrica propuesta del techo de consumo P01:** el análisis retrospectivo declara 463 recursos alcanzables y siete fuera de las componentes iniciales; los 463 consumos están corroborados por E4, pero la conectividad requiere reproducción independiente (§C.2.1).
3. **Una delimitación más precisa de las métricas:** supervivencia no discriminativa en ese perfil; energía final confundida por rechazos; C saturado para FrontierMemory en esa batería.
4. **Una advertencia verificable sobre identificación de mecanismos:** trayectorias equivalentes no identifican teoría interna, y un estado almacenado puede no influir en la decisión.
5. **Un criterio instrumental:** preservar resultados semánticos no basta para validar medidas temporales, y completar una calibración no acredita automáticamente otra campaña.
6. **Una base para seleccionar mejor la próxima pregunta**, en lugar de aumentar episodios, controles o documentación por inercia.

WORLD-LAB conserva valor como instrumento de investigación **dentro de su representación y alcance comprobados**. P01 mantiene su conclusión científica; RC1 conserva sus resultados negativos y sus límites; TITAN conserva G1 y la equivalencia D4, con G2 en HOLD.

La evidencia permite mejorar la selección e interpretación de investigaciones futuras. **Todavía no demuestra que esas mejoras metodológicas produzcan mayor productividad económica del programa.**

No se reabrió ninguna investigación ni se ejecutó ninguna recomendación.
