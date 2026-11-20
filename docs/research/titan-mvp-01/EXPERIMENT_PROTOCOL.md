# TITAN-MVP-01 — protocolo de primer estudio en WORLD-LAB

**Estado:** PROPOSED / NOT_EXECUTED / OWNER_GATE_REQUIRED. Diseño prefijado antes de observar cualquier resultado de TITAN. **No** se emite conclusión científica ni permiso de evaluación en este documento.

## 1. Preguntas y estimandos

- **Q-T1 Integración tipo puerto:** ¿puede la nueva política controlar la entidad fija `0987898` mediante `agent_factory`, sin modificación del motor/Recorder/WLS1, y luego ser sustituida por otro agente?
- **Q-T2 Comportamiento:** ¿qué proporciones de acciones MOVE/WAIT, posiciones visitadas, recursos consumidos, terminaciones y rechazos ocurren para TITAN-MVP-01 en una batería fija?
- **Q-T3 Reproducción:** ¿son idénticas las decisiones reejecutadas desde reset y las trayectorias/estados/eventos/WLS1 restaurados con el mismo motor?
- **Q-T4 Comparación descriptiva:** ¿cómo varían las métricas frente a Random, Rule, Wait y FrontierMemory-v1 en mundos iniciales pareados?
- **Q-T5 Adaptación:** ¿qué cambios y esfuerzo reales requirió incorporar TITAN usando la interfaz preexistente? Evidencia para RC1-Q4 solo como observación prospectiva, **sin** convertir RC1 congelada en completada.

La condición de éxito primario de este primer estudio es **capacidad experimental e integridad**, no que TITAN obtenga más recursos. No existe hipótesis prerregistrada de superioridad. Se registran resultados negativos, incluido comportamiento nulo o estancamiento.

## 2. Entorno y controles

Se propone reutilizar la **configuración física del protocolo P01** de `docs/F6-A-pilot-protocol.md` **sin editar P01 ni reutilizar sus resultados como nueva campaña**: mundo 12×12 BOUNDED, densidad obstáculos 0,15, recursos 0,12, hazard 0; energía inicial 240; costo move1/wait1; efecto recurso8; regeneración0; umbral muerte0; radio1; máximo160 ticks. Las cuatro exposiciones de Feedback true.

Agentes: `titan_mvp_01`, `random`, `rule`, `wait`, `frontier_memory_v1`. Conservan código original de los controles; TITAN solo se implementa como nuevo agente externo. Todos con mismo tipo de observación, horizonte y mundo inicial por seed. Los PRNG de agentes se derivan por namespace `agent_type`; **no** se exige la misma secuencia pseudoaleatoria entre algoritmos.

**Semillas propuestas:** desarrollo únicamente 1–4. Evaluación **2001–2012 inclusivas** (12 semillas distintas de P01 1001–1032). No usarlas para pruebas de tuning ni ejecutar evaluación antes de autorización. El tamaño de batería es pequeño, elegido para primer estudio exploratorio de viabilidad, no para significación estadística general. El orden de ejecución para una futura campaña: seed ascendente, agentes `wait,random,rule,frontier_memory_v1,titan_mvp_01`, repetición 1 y luego 2 para cada agente/seed. Total **12×5×2=120 episodios planificados**; la cifra es *planificación*, no autorización ni gasto realizado. Antes de aprobar, Codex estimará límites con su implementación y pruebas de desarrollo; nunca heredarlos automáticamente del piloto RC1 o del P01 final.

## 3. Evidencia y métricas

**Principal operacional**: número de episodios planificados/ejecutados/completados/invalidables, identidad íntegra, diferencias estructurales y reproducción. Falta de un episodio o un resultado divergente no se oculta.

**Descriptivas por episodio**:
- conteo de `RecordedEvent` `source=action`, `type=RESOURCE_CONSUMED` (C);
- cobertura: cantidad de posiciones distintas en estado inicial y pasos;
- número de MOVE_N/E/S/W, WAIT, acciones rechazadas por `validity/reason`;
- ticks hasta fin, estado terminal, energía final solo descriptiva, no métrica principal de desempeño;
- para TITAN: `Φ_exp` binario por decisión, elección M_N/E/S/W/NULL, costos calculados, empates, frecuencia de abstención; fuente sidecar externo, no nuevo campo de WORLD.

Para cada semilla, comparaciones descriptivas de C y cobertura TITAN menos cada control, con media, mediana, mínimo/máximo y tabla completa. No excluir escenarios por resultado desfavorable; inicializaciones fallidas comunes identificadas aparte. No tratar repeticiones deterministas como muestras nuevas. Ninguna conclusión poblacional general por 12 semillas.

## 4. Riesgos, controles y criterios

- Si TITAN permanece en WAIT en ausencia de oportunidad inmediata, **resultado de política**, no un fallo del harness.
- Eventos de recursos consumidos están disponibles en el Feedback del perfil; agotados no se descubren por lectura de stock privilegiado.
- `NULL→WAIT` cobra el costo energético/temporal configurado; no afirmar inacción gratuita.
- `Φ_exp` es proxy artificial; **no** se prueba decidibilidad de TN-LAB ni correspondencia con `R^59`.
- La comparación con FrontierMemory es descriptiva: incorpora planificación BFS y representa otra clase de política.
- No asegurar sandbox de plugins no confiables: runner actual presupone código confiable.
- Comparaciones reejecutadas prueban mismo motor, no interoperabilidad externa independiente.
- Si el costo de integración exige tocar fuentes congeladas, registrar incompatibilidad y detener integración; no refactorizar WORLD para hacer pasar el MVP.

**Aceptación técnica futura:** implementación y configuración fijadas por hash; 120 intentos o fallos honestamente contabilizados; no corrupción; repeticiones con decisiones/estructuras y WLS1 idénticas; archivo y restauración verificados; evaluador sin acceso al sidecar para cambiar decisiones; fallos y timeouts informados sin sustitución; no modificaciones al motor. Si algún intento completo en mundo inicial válido falla por error de agente, timeout o replay mismatch, marcar campaña `NOT_EVALUABLE` para la comparación completa, conservar parciales y solicitar nueva revisión en lugar de eliminar casos.

**Aceptación científica:** describir comportamiento y alcance; no exigir superioridad sobre Random. Conclusión `TITAN_OPERATIONALIZATION_OBSERVED` solo si existe al menos un episodio válido con decisiones y evidencia verificable; `TITAN_THEORY_VALIDATED` está **prohibido** para este estudio.

## 5. Puertas, ejecución y archivo

**G0 DOCUMENTATION:** documento revisado.  
**G1 IMPLEMENTATION:** código aislado, pruebas unitarias y smoke de semillas1–4 (desarrollo), diff sin cambios a congelados.  
**G2 EVALUATION_START:** nueva orden **expresa** del propietario después de revisar candidato, identidad, límites de workers/RSS/archivo, nuevo directorio y plan de recuperación. No usar firmas/recibos P01 o RC1.  
**G3 ANALYSIS:** publicar artefactos y resultados, incluidos negativos y limitaciones, con identidad exacta. Ninguna optimización encubierta entre G2 y G3.

No hay permiso de ejecución de 120 episodios en este documento. Crear pruebas del agente, preparar scripts y estimar recursos sí está autorizado como implementación. El trabajo RC1 sigue congelado y separado.
