# WORLD-LAB P01 — Final Acceptance Report E5

**Dictamen de ingeniería: CONDITIONAL_ACCEPTANCE.** Se acepta técnicamente y científicamente la capacidad experimental demostrada **dentro del alcance P01**. La **liberación definitiva permanece HOLD_C2**: `C2=HOLD_EXTERNAL_BACKUP_PENDING`. El PR de este dictamen queda pendiente de revisión del propietario; no se atribuye esa revisión a la ejecución documental de Codex.

Emitido: 2026-11-14T20:43:44.619137-05:00 (America/Guayaquil). Base revisada: `675f1210124b27db70a3bea5ba80cea04a4ccd6d`, main posterior al PR #42, que incorpora E3/C1 y E4. Rama: `dev/p01-e5-acceptance`.
Autoridad: orden E5 expresa del propietario; registro operacional, no enmienda normativa. Campaña `p01-final-20261113-01`; Freeze ID `47155590f10358f6130a1f7eae261ec9ec1fc8035652c04dd23fcc9f92c63e7d`.

## 1. Decisiones separadas

| Dimensión | Dictamen E5 | Evidencia y límite |
|---|---|---|
| Validez operacional E3 | ACCEPTED_WITHIN_P01 | Ejecución autorizada completa, archivo, orden de lanzamiento y preservación local verificados; no acredita durabilidad externa |
| Validez experimental y reproducibilidad E4 | ACCEPTED_WITHIN_P01 | Restauración íntegra, replay de las 256 trayectorias, igualdad de repeticiones/iniciales y métricas concordantes; mismo motor y entorno compatible |
| Resultado científico | H_PLUS_SUPPORTED, ACCEPTED_WITHIN_P01 | Media D=11,125>0 en las 32 semillas fijadas; alcance finito y comparación preregistrada |
| Respaldo externo C2 | HOLD_EXTERNAL_BACKUP_PENDING | Sin recepción y SHA-256 confirmados por el propietario en almacenamiento independiente |
| Liberación definitiva del primer ciclo | HOLD_C2 | La aceptación técnica/científica acotada no equivale a liberación definitiva con preservación externa satisfecha |
| Conformidad normativa global | NOT_ESTABLISHED | E3/E4 no resuelven las fuentes y discrepancias normativas pendientes |
| Interoperabilidad independiente | NOT_ESTABLISHED | No se ejecutó una segunda implementación del motor ni contraste entre implementaciones |

La capacidad P01 merece aceptación técnica porque cumple los criterios operacionales y de reproducibilidad fijados; esa aceptación no depende de que FrontierMemory gane. El soporte observado de H+ es una decisión científica separada, determinada por la comparación prefijada.

## 2. Validez operacional E3

Se revisaron directamente el informe operacional original, la auditoría original, el estado C1 y los manifiestos publicados en [E3](../p01-e3-final/README.md). Los documentos originales se mantienen íntegros y sus enlaces internos a evidencia se entienden como referencias históricas del workspace, no URLs públicas.

Evidencia aceptada: **256 episodios previstos, iniciados y terminados; 0 fallidos**, 256 combinaciones/UUID únicos y orden canónico de semillas/agentes/repeticiones. Hay 256 pruebas archivadas COMPLETE_MATCH ligadas a archivo/payload/log; códigos de salida de controlador y observador 0. La identidad, runtime y firma/recibo fueron verificados en sus etapas; la constancia textual del chat no se confunde con la firma criptográfica del recibo.

Preservación local: **519 archivos coincidentes**, **774 objetos históricos**, 256 revisiones de índice, **255 marcas normales de crecimiento del log**, cero conflictos bloqueantes y cero ausencias/errores de preservación. Las incidencias de sandbox y autorización adjunta se resolvieron antes del único arranque y se conservaron. No se cuentan como episodios repetidos.

E5 acepta las evidencias archivadas de esas verificaciones, cotejadas entre sí, sin repetir E3 ni convertir una intención en una prueba nueva.

## 3. Validez experimental y reproducibilidad E4

Se revisaron el [informe E4](../p01-e4/E4-report.md), los resultados de replay, métricas, descriptores, comparación de mundos iniciales, integridad y los doce comandos efectivamente ejecutados.

- Restauración a directorio nuevo: VERIFIED_COMPLETE_EVIDENCE, **519 archivos idénticos byte a byte** a la fuente/manifiesto.
- **256/256 replay restaurados MATCH**, cero discrepancias; 40.960 transiciones, 41.216 estados y 82.432 comparaciones de bytes WLS1 WORLD/FULL, además de comparaciones estructurales de registros/estados/eventos/contexto.
- **128 parejas de repeticiones** idénticas en datos científicos; **32 mundos iniciales** comunes entre los ocho episodios de cada semilla. UUID y tiempos del host no se usan para igualdad científica.
- Oráculo independiente y recuento independiente de descriptores: concordancia de las 256 filas y 32 pares/distribución con los agregados E3. El recálculo separado del controlador también coincide, pero no se presenta como un tercer cálculo independiente.
- **32 escenarios intentados y elegibles; 0 exclusiones**. Fallos operacionales, de agente, inicialización y replay registrados: cero. No se eliminó un resultado desfavorable.
- Los doce comandos E4 terminaron con salida 0. Sus verificaciones antes/después acreditaron que los originales y hashes no cambiaron.

La evidencia respalda reproducibilidad **observada en el alcance ejecutado**, no una prueba de corrección universal de todos los contratos o configuraciones.

## 4. Resultado científico preregistrado

[Protocolo P01 conservado](../F6-A-pilot-protocol.md), SHA-256 `74491ffdf9dbbafa260e53cc21dbb63424e0785d930653e11301d911d119146c`.
C es el número de RecordedEvent con source=action y type=RESOURCE_CONSUMED. La única comparación confirmatoria es D(seed)=C(FrontierMemory-v1)−C(RandomAgent). No se usa energía final como éxito ni se modifica esa definición después de observar los resultados.

| Estadístico de las 32 diferencias | Resultado |
|---|---:|
| Suma | 356 |
| Media | 11,125 |
| Mediana | 11 |
| Mínimo / máximo | 5 / 20 |
| Victorias / empates / derrotas | 32 / 0 / 0 |
| Semillas intentadas / elegibles / excluidas | 32 / 32 / 0 |

Por la regla preregistrada (suma D>0), **H_PLUS_SUPPORTED para las 32 semillas P01 1001–1032**. Media C FrontierMemory=14,46875; Random=3,34375. Rule (media 0,34375) y Wait (media 0) son controles descriptivos, sin nuevas hipótesis confirmatorias.
La tabla de las 32 semillas, distribución completa, consumos, cobertura, rechazos y contexto por episodio se conservan en [CSV pareado](../p01-e4/paired-results.csv), [métricas](../p01-e4/independent-metrics.json) y [descriptores](../p01-e4/independent-descriptors.json); E5 no los sustituye por un nuevo conjunto de datos.
Las dos repeticiones verifican determinismo: **n=32 pares de semillas, no 64 muestras independientes**.

## 5. Independencia, causalidad y alcance

El recuento independiente no importa el módulo de métricas del controlador y se basa en las trayectorias restauradas; el cálculo original se usa en una comparación separada. Eso aporta independencia de cálculo, no independencia de todo el sistema.
El replay usa el mismo motor, validadores y codificación aprobados. Los posibles defectos comunes del motor/codec no quedan excluidos por esa concordancia; no se ha demostrado interoperabilidad con otro motor, plataforma o equipo independiente. Codex ejecutó y revisó la evidencia; no se presenta como una evaluación realizada por un segundo equipo.

La batería de 32 semillas consecutivas no es una muestra IID declarada de una población general. No se infieren p-values ni intervalos de confianza poblacionales; el resultado describe esta batería finita y configuración congelada. FrontierMemory combina planificación y memoria: no se aísla causalmente el efecto de la memoria sola, no hay entrenamiento demostrado, y no se extrapola a hazards, multiagente u otras configuraciones. Los tiempos del host no son un benchmark aislado de agentes.

## 6. C2 y liberación definitiva

**C2=HOLD_EXTERNAL_BACKUP_PENDING.** No hay confirmación de descarga y checksum del propietario en otro almacenamiento. Un tar local, una carpeta hermana, una restauración local o documentos en GitHub no constituyen copia externa verificada del expediente experimental completo.
El paquete E3 original conserva como identidad de referencia SHA-256 `8a1df2ac58fa2069afa4de52368097d79859b59e4b784e99a72966fa5690b7c7`; el paquete E4 de resultados tiene SHA-256 `47083b27d5875126ac3086fe8887adfdc813567673dec2e904a4e91bcf29db91`. E5 no los regeneró ni transfirió. Las referencias /workspace y /tmp describen el entorno histórico, no enlaces públicos de recuperación.

La decisión del propietario permitió avanzar E4 y ahora la aceptación documental E5 con C2 en HOLD; no equivale a una excepción que declare la preservación externa cumplida. La falta de respaldo no invalida por sí misma las observaciones locales ya verificadas, pero mantiene un riesgo de pérdida común e impide declarar liberación definitiva del primer ciclo.

Para revisar HOLD_C2 deberá existir constancia verificable de recepción externa, identidad del paquete, SHA-256 calculado en destino, fecha/ubicación lógica y confirmación del propietario, conservando este corte histórico. No se requiere repetir episodios para cerrar una transferencia. E5 no concede nuevas autorizaciones de ejecución, transferencia, cambios científicos o merge.

## 7. Conformidad normativa e interoperabilidad

**Ambas NOT_ESTABLISHED.** Se conservan los pendientes de ED-003/G00 y los bloqueos históricos; no se ejecutó ni se actualizó el corpus normativo en E5. Los 289BLOCKED son el estado histórico documentado, no una nueva medición de esta tarea.
Validar P01 contra su protocolo es distinto de verificar toda la especificación canónica. Ningún estado FROZEN se considera prueba empírica. El alcance no demuestra WORLD-LAB como plataforma científica general plenamente validada, ni cierra F6-N, Hitos B/C o interoperabilidad independiente.

## 8. Capacidad demostrada y decisión de ingeniería

La evidencia acredita, en P01 y bajo sus límites, la cadena **Protocolo → Algoritmo → Ejecución → Archivo → Restauración → Verificación → Análisis → Decisión**. La preservación externa y la liberación definitiva siguen abiertas.
Se actualizan solo los estados de ejecución de **ED-002** (piloto implementado/verificado en P01), **ED-005** (separación efectiva de operación/ciencia/conformidad/interoperabilidad) y **ED-006** (puerta de autorización usada en E3, no solo preparada). Las decisiones aprobadas, IDs y los estados ED-001/003/004 se conservan. La [captura previa de ED](ENGINEERING_DECISIONS-before-E5.md.b64) permite recuperar sus bytes antes de esta actualización; el manifiesto identifica su SHA-256.

## 9. Revisión documental E5 y trazabilidad

E5 no ejecutó episodios, agentes, restauración, métricas desde trayectorias ni replay. Se inspeccionaron directamente las fuentes publicadas y se verificaron sus manifiestos SHA-256, consistencia de conteos y concordancia del CSV de 32 filas con las estadísticas publicadas. Ese cotejo documental no se presenta como una repetición de E4.
Los informes E3/E4, el protocolo, los planes y las evidencias congeladas permanecen intactos. No hay código, contratos, semillas, algoritmos, corpus o datos experimentales modificados. La rama parte de main `675f1210124b27db70a3bea5ba80cea04a4ccd6d`; publicación mediante commit/PR para revisión, sin merge automático.

[Estado estructurado](ACCEPTANCE_STATUS.json), [fuentes y hashes](E5-evidence-manifest.json), [comprobación documental](DOCUMENTARY_CHECKS.json) y [decisiones actualizadas](../ENGINEERING_DECISIONS.md). La revisión/aprobación del PR por el propietario y la resolución de C2 no se dan por realizadas en este informe.
