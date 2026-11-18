# RC1-R1 — Protocolo diagnóstico 1.0.0 (propuesto)

**READY_FOR_R1_GATE_REVIEW al completar las pruebas; ningún piloto R1/v2 autorizado. RC1-E HOLD.** Sujeto: main PR51 `aab268dde2f20299234c6b407ce6ba9f54438076`. Motor/contratos/Recorder/WLS1/P01 y datos v1 permanecen inalterados. [Auditoría y selección previa](AUDIT_AND_DECISION.md), [registro temporal/hash de selección](DESIGN_SELECTION.json).

## Objeto, unidad y cobertura

Se mantienen Q1–Q4 y sus límites. Este diagnóstico estudia viabilidad, localización de censura y efecto observado de modalidades; no pretende confirmar toda la complejidad ni resolver Q4. Una unidad experimental es **un proceso nuevo para una operación/perfil/bloque/modalidad**. Operaciones: tick, observation, record_append, replay. Las otras12operaciones de v1 no se consideran verificadas por esta propuesta. Perfiles P1–P8 con w/h/r/T y configuración física sin cambios; WorldConfig se reutiliza del instrumento v1.

| Perfiles | Dimensiones/r/T |
|---|---|
| P1/P2/P3 |8×8/1/4;16×16/1/4;32×32/1/4 |
| P4/P5/P6 |16×16/0/4;16×16/4/4;16×16/16/4 |
| P7/P8 |16×16/1/16;4×64/1/4 |

Dos bloques con semillas21001/21002, cada uno MINIMAL/DETAILED emparejados por semilla/perfil/operación. Bloque1: perfilesP1–P8, operaciones tick/observation/record_append/replay, orden AB; bloque2: perfiles/operaciones en reverso, orden BA. Esto equilibra el orden, no aleatoriza ni identifica causalmente todos los efectos de periodo. **128procesos=8×4×2×2**; solo2pares de procesos por perfil/operación, no precisión poblacional ni dos observaciones independientes de cinco llamadas.

Por proceso:1FIRST_MEASURED,3WARMUP,5WARM. Fixture completamente nuevo antes de cada llamada, con prepare v1 sin modificar: generación, prefijo y ConfirmedTickResult/Observation/Feedback cuando correspondan. No se reutiliza preparación mutable, RNG, historial privado ni método reemplazado. PREPARE no incluye ya el testigo de entrada; INPUT_WITNESS lo registra separadamente. La preparación propia del método puede calentarlo: FIRST_MEASURED no es una API virgen fría. Identidad/carga/calibración se registran por separado del trabajo por llamada; proceso nuevo no garantiza runtime no expuesto al preparar prefijos.

## Límites de atribución y ventanas

MINIMAL/DETAILED reutilizan `measure` v1 inalterado. api_ns rodea invoke de la API completa, incluidas validaciones/snapshots internos; wrapper_ns añade el coste de instrumentación declarado. No se restan validadores para atribuir costes internos. DETAILED registra CPU/memory alrededor del invoke, MINIMAL deja esos camposnull; GC no observado ni forzado.

Journal externo por worker, con fsync y secuencia,BEGIN/END/ERROR por fase: IDENTITY,LOAD,CALIBRATION,HEADER_SEND,CALIBRATION_SEND y, por llamada, PREPARE,INPUT_WITNESS,EXECUTE,OUTPUT_WITNESS,ENCODE,SERIALIZE,HASH,COMPRESS,IPC_SEND_CALLBACK; finalmente FINAL_IDENTITY. Ninguna escritura journal ocurre dentro de la ventana api_ns. El BEGIN se publica/fsync antes del trabajo; END se publica después. `work_ns` mide el trabajo entre checkpoints excluyendo las escrituras journal de sus bordes; `elapsed_ns` contiene también BEGIN/write/fsync y bookkeeping hasta antes de publicarEND. `journal.io_ns` acumula escrituras/fsync completados, no todo overhead causal ni close. Mantener y calibrar esa perturbación es parte de la investigación.

Un BEGIN sin END localiza la **fase checkpoint abierta**; no prueba una instrucción CPU exacta ni que todo el tiempo transcurrido pertenezca a la API. Cola final parcial se identifica. IPC_SEND_CALLBACK mide espera hasta callback de send, no ack de persistencia durable del padre. Coste de almacenamiento del controlador no se presenta como descompuesto causalmente: total de sesión/RSS/archivo aparte. Testigos completos antes/después, acción/resultados/eventos/reloj/RNG y bytesWLS1 cuando aplican; codificados con codec v1, JSON,hash y gzip fuera de api_ns, sin sustituir estructura por digest.

Un error de operación aborta esa unidad y la secuencia, no continúa otras llamadas como hacía v1. No retries, seeds sustituidas ni aumento automático. Candidato y condición se verifican antes de cargar el sujeto; se comprueban de nuevo al terminar worker/controlador. No hay snapshot atómico de fuentes: prohibidas ediciones concurrentes y se conserva la limitación de filesystem.

## Estimadores fijados antes de medir R1

1. Por proceso/operación: conservar primeras/warm-up/warm separadas; estimador principal de latencia es **mediana de5WARM.wrapper_ns**; API, preparación y fases se reportan por separado con mediana/min/max y crudos. No son5réplicas independientes.
2. Por bloque pareado: `p=100*(median(DETAILED.wrapper_ns)/median(MINIMAL.wrapper_ns)-1)`. Diagnóstico de diferencia de magnitud>10% si abs(p)>10. Secundario: mediana de diferencias por índice dividida por medianaMINIMAL, siempre identificado. No seleccionar normalización por su signo.
3. Resumen por perfil/operación: mediana de los2valoresp, rango y valores AB/BA individuales. Conservar además el indicador de si algún bloque supera el diagnóstico del10%; diferencias opuestas no se ocultan por cancelarse su mediana. Sin IC poblacional/pvalor ni afirmación de ausencia de efecto de orden con n2. Diferencia de modalidades no se atribuye exclusivamente al instrumento por compartir JIT/GC/OS/preparación.
4. Calibración por proceso:200pares de reloj y200vacíos. Cada llamada api_ns<10×mediana del reloj queda flag resolución insuficiente; no se resta ruido. Si una unidad tiene menos de5WARM completos, **no entra en el estimador primario balanceado**: publicar su parcial, frontera/timeout/faltantes y reducir cobertura declarada, no borrar el caso.
5. No excluir lentos/outliers. Identidad/unidades/corrupción invalidan aceptación correspondiente; conservarlos como fallo de integridad. Censura por límite operativo no refuta el modelo asintótico. Si falta cualquiera de los dos bloques completos, no calcular el resumen balanceado como si existiera; no reemplazar ni reintentar.
6. Identidad y equivalencia completa son requisitos distintos del rendimiento. Posibilidad de diseñar RC1-E exige cobertura/medición suficiente para sus preguntas; este diagnóstico4/16 no acredita toda la plataforma ni autoriza RC1-E.

## Presupuesto propuesto, no ejecutado

30s nominales por hijo,256MiB heap; controlador512MiB y NODE_OPTIONS vacío. RSS agregado muestreado1GiB/25ms; guardian independiente reutilizado de v1, vigilando también identidad final/sellado/verificación de `data`.128hijos×30s=3840s=64min de ventanas; total de vigilancia **4500s=75min**,11min de margen para trabajo del controlador. No es una estimación de tiempo esperado ni prueba de suficiencia para P3/P6/P7. El coste de arranque/guards aumenta respecto de48monolíticos; podría dominar operaciones pequeñas.

Artefactos totales128MiB: journal≤256KiB/worker, reserva32MiB para128; reserva1MiB para log guardian/envelope de raíz; presupuesto de escritura primaria95MiB (incluye su propia reserva final1MiB). Los journals se escriben fuera del contador primario, pero tienen cuota estricta reservada:95+32+1=128MiB. Se verifican todos en el inventario; no silencios/truncamientos. Witness comprimido16MiB/descomprimido64MiB; stdout/stderr64KiB cada uno, exceso explícito con bytes recibidos/omitidos y parada.

El watchdog actúa hasta completar sellado/verificación de data; guardian.jsonl vive en la raíz, fuera del manifest de data para evitar que su crecimiento invalide hashes. Después se cierra guardian y se escribe un envelope pequeño de raíz (≤reserva1MiB junto a su log). Esa escritura terminal y latencias de host/filesystem no tienen un tope físico duro; pérdida del host puede dejar PARTIAL_UNSEALED. No se declara garantía transaccional contra pérdida del host ni capRSS instantáneo; no sumar picos no simultáneos.

Una unidad a la vez, detener ante timeout/RSS/cuota/error/identidad/archivo. Última fase abierta y último sample confirmado se preservan, sin reconstruir una duración faltante. El envelope de raíz controla estado global; un manifest interno de data sellado no implica que la sesión global haya completado su verificación. Sin bundle terminal, PARTIAL_UNSEALED.

## Puerta y separación

Nuevo candidato `WL-RC1-R1-CANDIDATE-1`, dominio de firma: texto UTF-8 `WL-RC1-R1-AUTHORIZATION-1` seguido de un único byte LF0x0A, recibo decision AUTHORIZE_RC1_R1_DIAGNOSTIC_ONLY y pins aprobados de nueva identidad/clave para este uso. No acepta candidato, firma o autorización v1. Ninguna clave real se genera en Codex; tests efímeros no representan al propietario. Preflight real + orden expresa nueva antes de run-pilot. La autorización v1 sigue consumida y no habilita R1.

Esta entrega ejecuta solo pruebas/fixtures2×2/T2 y stops sintéticos, no128condiciones, no v1 otra vez, no RC1-E. El propietario revisará diseño/cobertura/estimadores/candidato/presupuesto antes de cualquier piloto nuevo. F6-N,conformidad global e interoperabilidad independiente siguen NOT_ESTABLISHED; cierre operacional/P01 y sus archivos permanecen intactos.
