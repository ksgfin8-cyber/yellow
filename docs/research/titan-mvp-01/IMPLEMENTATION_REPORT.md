# TITAN-MVP-01 — implementación experimental G1

**Estado: READY_FOR_TITAN_MVP_01_REVIEW. Evaluación científica120: HOLD / NOT_EXECUTED.** Implementación, pruebas y smoke de desarrollo completos. No se declara TITAN_THEORY_VALIDATED ni conformidad canónica con TITAN/TN-LAB.

Base efectiva: main posterior al PR56, `38bcb2116a31ecbaf4f401f41243d4adf88e98e3`. La referencia9705f9… de los documentos iniciales corresponde a su base de preparación; se siguió el main posterior a la integración, como exige CODEX_HANDOFF y la orden del propietario. Acta de congelación RC1 del20de noviembre integrada y preservada. Se leyeron íntegramente los siete documentos y los contratos/código indicados en HANDOFF. Sus estados históricos PROPOSED/NOT_STARTED no se reescriben; la orden posterior autoriza esta implementación G1.

Identidad propia de desarrollo: `a8d1e8079d322e969170261a41b2992e1c0ebbccd586fdde4dbd4fc19d2b1ec0`, fijada antes del smoke; [candidato](DEVELOPMENT_CANDIDATE.json). Vincula los590archivos base, los siete documentos originales, nuevo código/pruebas, DEVELOPMENT_PROTOCOL y runtime Node. Ninguna política cambió tras mirar los resultados. No se usaron firmas o permisos P01/RC1.

## Qué se implementó

- **Núcleo puro:** `selectTitanMVP01Mechanism({costs,phi,L})`, costos finitos no negativos, C_null=L×phi, Cap, brechas por mecanismo y global, todos los minimizadores y selección por prioridad explícita. Especialización fija a los cuatro IDs permitida por contrato; no se simula un selector general infinito ni un threshold v0.1.
- **Adaptador D4:** `TitanMVP01Agent.reset/step`, memoria privada visited/consumed, observación cardinal3×3 y entidad0987898. Costos0/1/3/4/5, proxy de oportunidad0/1 y L=2 exactamente prefijados. Valida lo usado antes de actualizar memoria, nunca marca un destino propuesto como visitado. Solo incorpora consumos desde los eventos expuestos de la acción previa. Devuelve exclusivamente `{type:MOVE_*|WAIT}`. No RNG, seed, reloj host, WORLD, stock invisible, BFS ni ajuste de costos.
- **Puerto externo:** loader VM aislado monta el nuevo classic script sobre el runtime existente sin editarlo. Fábrica externa enruta `agent_type=titan_mvp_01` y mantiene constructores originales de los cuatro controles. `entity.id=0987898` permanece común; no es el nombre del algoritmo. No se cambia el registro estático ni la web.
- **Sidecar:** lectura externa del diagnóstico después de obtener la acción. Copias independientes con experiment_seed, tick de observación, estado proyectado, proxy/costos/empates/selección/acción y SHA de código. No modifica esquemas cerrados ni decide desde el sidecar. El agente no recibe callback. Modo silencioso probado para igualdad semántica; no implica eliminación de todo coste diagnóstico interno.
- **Harness G1:**12intentos fijos en semillas1–4, fuente/plan/configuración vinculados por SHA-256, workers supervisados, transporte propio, métricas, replay, restauración y análisis de lectura. CLI/config/requests rechazan2001–2012 y cualquier semilla no reservada al desarrollo; no hay modo de evaluación120.

Rutas de código: `js/agents/titan_mvp_01.js`; `tools/titan-mvp-01/{runtime,protocol,identity,worker,controller,archive,verify,metrics,cli}.cjs`; nueva prueba y fixture técnica. Se reutilizan sin cambios las interfaces run_experiment/factory, VM loader, codec, supervisor y constructores existentes; no el comparador científico ni el archivo ligado a P01.

## Autoridad y decisiones internas

| Clasificación | Contenido |
|---|---|
| SOURCE_DERIVED_V03 | Selección finita, costo nulo dado phi/L, Cap y brechas; propiedades condicionales probadas implementativamente |
| EXPERIMENTAL_ADAPTER aprobado D4 | Representación WORLD, memoria local, costos ordinales, oportunidad binaria, L2, prioridad y NULL→WAIT |
| Decisión técnica local | Núcleo de cuatro IDs fijos; TypeError explícito para entradas malformadas; actualización de memoria tras validar; getter diagnóstico copiado y fábrica observadora externa; archivos propios y desarrollo bloqueado a1–4 |
| NOT_IMPLEMENTED / NOT_ESTABLISHED | H59D, Gamma/phi geométrica TN-LAB, costo empírico causal, calibración de L original, régimen, aprendizaje, BFS/oráculo, optimalidad, no universalidad y validación de teoría completa |

Las SOURCES son normalizaciones leídas, no originales byte-certificados. Sus hashes preservan estos documentos concretos y no autentican textos originales ausentes. No se editaron ni reconciliaron artificialmente v0.1/v0.3. Sobre números: el núcleo usa Number binary64; la política real usa enteros pequeños exactos. Con phi≤1 y L finito positivo no hay producto overflow válido; se rechazan entradas fuera de dominio y se prueba la frontera máxima finita, sin inventar un caso válido que matemáticamente no existe.

## Matriz de cobertura y pruebas

Comando: `node --test tests/titan-mvp-01.test.cjs`. **18/18 PASS, cero omitidas o fallidas**,2263,389193ms en la ejecución registrada; [salida completa](implementation-evidence/tests-01.log). No se cambiaron expectativas de pruebas antiguas ni se suman estos tests como casos canónicos o réplicas científicas. Las suites históricas generales no se reejecutaron: no hubo modificaciones a sus fuentes, verificadas por hash.

| Contrato | Pruebas locales/evidencia |
|---|---|
| Selector, Cap/gaps, prioridades, NULL, dominios | TITAN01–04: mínimos/empates incluidos NULL, finitud/no coerción/M vacío/reservados/duplicados/fronteras;1875entradas del dominio pequeño verificadas |
| Costos D4, recurso/FREE, hazard/bloqueado/OOB, empate y WAIT | TITAN05–07 |
| Memorias/reset y no visitar movimiento propuesto/rechazado | TITAN07–08 |
| Error explícito y entradas congeladas sin mutación | TITAN05/09 |
| Diagnóstico sin alias, tick BigInt, ausencia de reloj/random en la política | TITAN10 |
| Fábrica externa, id0987898, agente no añadido al registro | TITAN11 |
| Repetición, silent/sidecar, estados/eventos/WLS1 y replay | TITAN11–12 y smoke/restauración |
| Desconexión por controles sin construir TITAN, mismo WORLD inicial | TITAN13 |
| Feedback incompatible/radio: rechazo previo a Experiment; semillas finales bloqueadas | TITAN14–15 |
| Archivo/restauración/corrupción/no sobrescritura | TITAN16 |
| Timeout técnico y proceso sano posterior | TITAN17 |
| Fuentes/spec preservadas y rutas separadas | TITAN18, candidato y revisión de publicación |

Las fixtures pequeñas usan6ticks/4×4 en seed1, además de feedback sintético; el test de movimiento rechazado caracteriza memoria sin afirmar que la política elige BLOCKED. No se utilizaron semillas de evaluación. Las pruebas del selector no validan phi/C para WORLD ni prueban los teoremas fuera de sus supuestos.

## Smoke de desarrollo: resultados completos, incluidos negativos

[Plan y límites previos](DEVELOPMENT_PROTOCOL.md): TITAN seed1 rep1/2; Wait/Random/Rule/FrontierMemory seed1 rep1; TITAN seeds2–4 rep1/2. Mismo perfil físico12×12/160ticks/Feedback completo del protocolo, sin sustituir semillas ni configuraciones. **12/12completos, cero fallos/reintentos; los12 replay son COMPLETE_MATCH.**1920acciones registradas,1280diagnósticos TITAN. Todas las trayectorias terminan MAX_TICKS_REACHED. Cuatro pares TITAN idénticos en decisiones, configuración, estados, resultados, eventos y bytes WLS1; en seed1los cinco controladores comparten el mismo estado inicial y bytes WORLD/FULL. No se hizo step terminal adicional.

| TITAN, primera repetición | Recursos C | Cobertura | MOVE intentados | WAIT/NULL | Rechazos |
|---|---:|---:|---:|---:|---:|
| Seed1 |1 |12 |11 |149 |0 |
| Seed2 |0 |5 |4 |156 |0 |
| Seed3 |4 |12 |11 |149 |0 |
| Seed4 |10 |28 |27 |133 |0 |

Las segundas repeticiones son idénticas y no constituyen nuevas muestras independientes. En seed2,156WAIT y energía final80 muestran que NULL no es físicamente gratuito: WAIT consume energía y tiempo aunque C_null artificial sea0. El agente se queda sin oportunidad cardinal local; eso es resultado de política prefijada, no fallo de integración. No se añadieron backtracking, BFS ni recuperación oportunista tras observarlo.

| Controles en seed1 solamente | Recursos C | Cobertura | MOVE intentados | WAIT | Rechazos |
|---|---:|---:|---:|---:|---:|
| Wait |0 |1 |0 |160 |0 |
| Random |2 |36 |130 |30 |38 |
| Rule |0 |1 |0 |160 |0 |
| FrontierMemory-v1 |10 |84 |104 |56 |0 |

Random conserva27rechazos BLOCKED_CELL y11OUT_OF_BOUNDS: no se ocultaron ni cambiaron sus expectativas. Son movimientos intentados, no ejecutados todos. En este único mundo de controles TITAN consumió menos que Random y FrontierMemory; no se exige ganar ni se infiere superioridad general. Controles de seeds2–4 **no ejecutados ni imputados**. La comparación descriptiva prevista para12semillas permanece sin ejecutar.

[Métricas y1280diagnósticos comprobados](DEVELOPMENT_RESULTS.json), archivos originales en el export. Los consumos se cuentan de RecordedEvent/source=action, no del sidecar. Un consumo terminal puede no incorporarse a memoria del agente porque no hay otra decisión; no se inventa un step para completarla. Se revalidaron tick/código/acción, costos/minimizadores/proxy en cada diagnóstico almacenado.

## Integridad y recuperación

La copia a directorio nuevo tiene **15archivos,501882bytes**, todos byte-idénticos al smoke original. La verificación restaurada reproduce los12episodios/decisiones con el mismo motor y compara estructuras completas de trayectorias y bytes WORLD/FULL de estado inicial y160estados por episodio, no solo hashes. [Inventario](implementation-evidence/source-integrity.json), [salida restaurada](implementation-evidence/verify-restored.json). Cada worker ya había verificado su salida antes de archivarla; las reproducciones técnicas no son episodios independientes de evaluación.

Los590archivos previos permanecen intactos, incluidas fuentes de WORLD/Experiment/Recorder/WLS1, contratos, agentes anteriores, P01/RC1 y los siete documentos. No hay modificación de arquitectura, UI, registro web o normas. El archivo gzip operacional no reemplaza WLS1. Export preservado de230497bytes, SHA-256 `f5e8bfd1999c1028f4ab2a95e0b5678972b5df1914c6723d1ff6b4c263326fcf`; los15originales también coinciden tras extraerlo en otro directorio nuevo. Rutas /workspace y /tmp de los logs son históricas, no enlaces públicos ni acreditación de backup externo. [Procedimiento de recuperación](RECOVERY.md).

## Esfuerzo observado y adaptación Q4

[Registro prospectivo](implementation-evidence/effort.jsonl): empieza20nov2026a18:32:54.882244−05:00, **después** de la lectura inicial, que no fue cronometrada. Registra fases de implementación, pruebas, smoke, recuperación y documentación; su cierre y conteos finales constan en EFFORT_SUMMARY.json. Son intervalos wall de esta sesión, con razonamiento/esperas/herramientas incluidos, no horas activas de una persona ni tiempos históricos reconstruidos.

Se creó un sujeto nuevo y fábrica/runner propios sin editar ninguna fuente previa; no apareció bloqueo que exigiera cambiar la política aprobada o el motor. Las18pruebas pasaron en su primera ejecución; el smoke no requirió correcciones ni tuning. Se conserva el trabajo realmente observado, sin declarar que integrar cualquier algoritmo resulte igual de sencillo o que se haya medido causalmente productividad. Esta observación no cierra retrospectivamente RC1-Q4 ni reabre RC1 temporalmente congelada.

## Costes observados y propuesta para G2

Smoke controlador **143,883s**. Worker mínimo10,490s, mediana11,323s, máximo**12,237s**, incluidos replay/identidad; pico máximo por proceso266108KiB=**259,871MiB**. Suma de ventanas run36,684s y verificación89,700s: no representan solo latencia de decisión TITAN, ni se usan para afirmar un efecto causal del sidecar. Máximo archivo por episodio33938bytes; los12archivos comprimidos suman371691bytes.

Los límites de desarrollo elegidos30s/worker,384MiB heap,64MiB archivo y420sde admisión entre workers bastaron en este smoke. **No** se impuso un cap RSS agregado ni watchdog independiente del controlador. La comparación sidecar/silencioso acredita igualdad semántica, no overhead cero; ambos calculan internamente diagnóstico. El supervisor presupone worker confiable y no entrega una trayectoria completa si el proceso muere antes de responder; los fallos se registran sin inventarla. Control puede dejar evidencia sin manifest al fallar; no se afirma atomicidad contra pérdida del host. El worker de desarrollo solo devuelve payload tras verificarlo: si el verificador lanza, conserva el diagnóstico pero no garantiza rescatar un prefijo de resultado ya disponible en memoria. Esta ruta no ocurrió en el smoke. G2 debe preservar esos prefijos/fallos antes de aceptarlos o rechazarlos y contar los START aunque falle el archivo; no se presenta el harness G1 como ejecutor científico completo.

**Propuesta G2, no aprobación ni ejecución:** mantener perfil160ticks y política/hash;120episodios en orden científico prefijado2001–2012×cinco agentes×dos repeticiones. Proponer30s por worker incluyendo reproducción, heap384MiB, RSS agregado muestreado1GiB, archivo64MiB y máximo70min para campaña+sellado/verificación.120×30s=60min más10min de margen: envolvente aritmética, no predicción ni suficiencia garantizada.30s conserva margen frente al máximo12,24s observado; el RSS debe comprobarse agregado, no inferirse sumando máximos no simultáneos.120×33938≈4,07MB sería una escala de tamaño observada, **no una cota** para semillas no utilizadas.

Antes de G2 deben revisarse identidad/protocolo/resultados y prepararse un ejecutor de evaluación propio, con bloqueo de semillas/orden, directorio nuevo, archivo de todos los intentos y garantías globales/RSS efectivas acordes al presupuesto. El harness actual deliberadamente no habilita esas semillas ni120episodios. Requiere nueva orden expresa del propietario; no se sustituyen permisos por cambiar un booleano y no se transfieren firmas P01/RC1. Cualquier límite insuficiente o fallo marcará NOT_EVALUABLE conforme al protocolo, sin descartar casos ni ajustar política para ganar.

## Límites y cierre G1

La política es local y puede quedar atrapada; costos son ranks, no pérdidas/energía empírica; phi es oportunidad artificial, no decidibilidad geométrica. No H59D/TN-LAB/Gamma original, aprendizaje/régimen, optimalidad o teoría completa. No se certifica literalidad de las fuentes normalizadas. No sandbox hostil, interoperabilidad externa ni conformidad normativa global. El loader es integración Node/VM, no nueva función web.

La evidencia demuestra este puerto experimental y su reproducción dentro del motor actual, no universalidad del laboratorio. Datos1–4 son exclusivamente desarrollo y no entran en evaluación2001–2012. No se declaran hipótesis finales, aceptación científica de120, ni TITAN_THEORY_VALIDATED. P01 permanece intacto, RC1 congelada y su AUD-C01/ejecutor128 pendientes. G1 termina **READY_FOR_TITAN_MVP_01_REVIEW**, sin merge automático ni siguiente campaña.
