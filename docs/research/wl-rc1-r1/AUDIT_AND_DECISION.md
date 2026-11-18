# RC1-R1 — Auditoría focalizada y elección previa a implementación

**Diseño seleccionado: B, partición por operación, sin reutilización de preparación mutable.** Decisión de ingeniería adoptada dentro de la orden R1 antes de implementar; propuesta de nuevo piloto pendiente del propietario. Estado objetivo READY_FOR_R1_GATE_REVIEW, no autorización de ejecución.

Base main PR51 `aab268dde2f20299234c6b407ce6ba9f54438076`, rama `research/wl-rc1-r1-review`; v1 aceptado PILOT_PARTIAL. Fuentes inspeccionadas: tools/research/wl-rc1/{worker,operations,runner,storage,guardian,identity,conditions}.cjs y docs/research/wl-rc1-pilot-v1/{processes,operation-summaries,paired-perturbation,analysis-summary}.json. La revisión conserva íntegros esos archivos y el candidato466e1dc5…34df15ac; R1 vive en otro directorio y tendrá identidad nueva.

## Auditoría código ↔ datos observados (v1, no mediciones R1)

| Capa | Qué hace v1 | Registro realmente disponible | Conclusión permitida / límite |
|---|---|---|---|
| Identidad/arranque | Gate lee fuentes/Git/binario Node; después carga VM | Wall del proceso, load_ns y versión; CPU total al done | No hay duración individual de todos los guards; no asignar residual a un componente. |
| Preparación | `prepare` reconstruye WORLD; para append/finalize/replay construye prefijos T−1/T; `f.before()` clona estado y serializa WORLD/FULL | prep_ns agrega ambas partes | P1 sumó3,137709s MINIMAL y5,389669s DETAILED en preparación. No es prueba causal de overhead de counters ni coste puro de inicializar. |
| API | `measure` cronometra invoke; algunas APIs incluyen validación, snapshots, hashes y varias transiciones de prueba | api_ns; wrapper_ns y CPU/memory detallados | No restar validate_state para declarar el coste interno de tick. Wrapper incluye instrumento; API sigue afectada por runtime/historia. |
| Testigo | after/result/estado; codec.encode y JSON.stringify, SHA cada llamada | JSON bytes y referencia SHA, testigo completo | No hay tiempo explícito de extracción/encode/JSON/hash; no estimarlo como el residual completo. |
| Compresión | gzip solo para un hash nuevo del worker | bytes gzip en archivo; no latencia por fase | Deduplicación hace trabajo de compresión desigual; el testigo sí se construye/serializa en cada llamada. |
| IPC/almacenamiento | worker espera callback de send; padre gunzip/hash y escribe | wall total/raw recibido; sin reloj individual de send ni ack durable | Callback IPC no equivale a flush/fsync del archivo ni mide todo almacenamiento. |
| Supervisión | guardian externo /proc25ms, límite por hijo incluye arranque/preparación/testigos | STOP10018,376707ms; close10041,487866ms, RSS agregado501096448bytes | Deadline nominal efectivo; no muestra la fase de una llamada incompleta ni un límite duro instantáneo de RSS. |
| Finalización | Guardian se cierra antes de sellar/verificar el paquete v1 | Archivo PARTIAL íntegro | El watchdog v1 no cubre todo el sellado/verificación final. R1 extiende vigilancia a esas fases con log separado. |
| Errores | worker envía operation_error pero continúa el bucle; padre marca fallo y espera close |0operation_error reales en v1 | No invalidó v1, pero no es fail-stop inmediato ante error. R1 abortará la unidad al primer error. |

Datos v1:2workers completos P1,1censurado P2/MINIMAL,45sin ejecutar;385muestras;144pares estructurales iguales. Última confirmada P2 history_getter/WARM/3; **fase de interrupción desconocida**. No se ha demostrado que history_getter fuera la causa del timeout.

Desglose observado de las cuatro operaciones seleccionadas, sumando9llamadas de cada operación cuando existen:

| Operación | P1 MINIMAL prep/API s | P1 DETAILED prep/API s | P2 MINIMAL prep/API s |
|---|---:|---:|---:|
| tick |0,026407 /0,021076 |0,023220 /0,021332 |0,076380 /0,061226 |
| observation |0,025693 /0,001768 |0,021897 /0,001862 |0,182529 /0,005506 |
| record_append |0,264549 /0,044064 |0,273213 /0,045661 |0,804042 /0,127792 |
| replay |0,413431 /0,352649 |0,779990 /0,704178 |sin muestras |

Los cuatro cubren mecanismos distintos (tick/contexto/registro/reproducción), incluido trabajo costoso, no solo los más rápidos. Dos procesos completados y un parcial no justifican una ley asintótica, un timeout universal o una explicación GC.11/16desviaciones diagnósticas de P1, n=1par de procesos, no identifican causalmente el efecto del instrumento.

## Tres alternativas comparadas

| Alternativa | Coste computacional / presupuesto ilustrativo | Sesgos | Reproducibilidad y cobertura | Decisión |
|---|---|---|---|---|
| A. Mantener procesos monolíticos, nuevo presupuesto |48workers para16operaciones/3bloques/2modos; a30s/hijo,1440s nominales. Menor coste repetido de arranque; mayor preparación/carga conjunta por proceso.30s no es suficiencia demostrada. | Orden fijo de16operaciones comparte JIT/GC/memoria; timeout trunca siempre la cola; mezcla costes. Más wall no resuelve atribución/censura por operación. | Mantiene cobertura v1 y entradas reconstruidas; requiere journal de etapas y validación nueva de perturbación. | No seleccionada: aumentar tiempo solo no corrige la unidad ni la confusión entre operaciones. |
| B. Particionar por operación | Cada proceso mide una operación. Matriz completa8×16×3×2=768workers: mayor coste de guards/VM/archivos; a30s son6h24m nominales. Propuesta diagnóstica reducida explícita:8×4operaciones×2bloques×2modos=128workers/64min nominales. | Elimina calentamiento cruzado de otras operaciones, no el causado por preparar el propio prefijo. Cada proceso conserva sus llamadas dependientes. | Identidad por unidad, entradas y testigos completos; fase de censura localizable. La propuesta no cubre las12operaciones restantes; no se presenta como RC1-E completo. | **Seleccionada** por unidad y diagnóstico interpretables, sin tocar producción ni compartir preparación mutable. |
| C. Reutilizar preparación con unidades independientes | Podría construir plantilla inmutable y restaurarla por muestra/proceso; reducir generación/prefijos si existe una vía pública correcta. No hay ahorro cuantitativo demostrado. | Cache/estado compartido altera calentamiento; restauración incompleta rompe independencia; costes de copia pueden sustituir preparación sin desaparecer. | WORLD admite copias públicas; Recorder no ofrece clonado público de su historial privado. No usar checkpoints privados o hooks para saltar contratos. Requiere prueba por operación. | Diferida: coste/beneficio no establecido y riesgo alto para prefijos de Recorder; no se implementa por analogía. |

## Selección concreta R1 y cambios autorizados

- Mantener los8perfiles P1–P8 de v1. Medir `tick`, `observation`, `record_append`, `replay`, una operación por worker. Las otras12 quedan DEFERRED_FROM_DIAGNOSTIC, no completadas ni opcionales por norma.
- Dos bloques emparejados con orden AB/BA exactamente equilibrado; semillas21001/21002. n=2pares de procesos por perfil/operación es diagnóstico de viabilidad/orden, no estimación poblacional precisa. Se necesitan más réplicas para inferencia definitiva.
- Tres warm-up y cinco llamadas warm, una primera llamada medida; fixture nuevo por llamada mediante prepare v1 inalterado. No reutilizar contexto/historial mutable ni sustituir métodos privados.
- Journal propio fsync con BEGIN/END por fase, fuera de api_ns; verificar cuota. El journal añade perturbación, se mide y declara. Último BEGIN sin END significa fase checkpoint abierta, no que todo el intervalo se gastara dentro de esa fase.
-30s nominales por hijo;75min de watchdog para trabajo y verificación de datos;256/512MiB heap, RSS muestreado1GiB y128MiB total.64min de ventanas de128hijos +11min de margen operacional; **presupuesto propuesto, no suficiencia observada**. Full16 no cabe en esta autorización propuesta.
- Formato/identidad/dominio de autorización R1 nuevos, sin aceptar recibo/firma/freeze v1. No se genera clave real ni se ejecuta plan128; solo fixtures pequeños y stops sintéticos.

Registro R1-D01: selecciónB y cobertura4/16 por economía/interpretabilidad, no cambio favorable de parámetros físicos. R1-D02: no reutilizar preparación. R1-D03: n=2procesos pareados y AB/BA con análisis descriptivo; no IC ficticio. R1-D04: journal de etapas y vigilancia de sellado, con coste declarado. R1-D05: nueva identidad y autorización requerida. Esta matriz/elección se escribió antes de implementar R1; el informe de validación posterior identifica los cambios concretos y sus pruebas.
