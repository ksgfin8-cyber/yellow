# Reconciliación de compromisos F6

Línea de referencia: plan aprobado incluido en la [orden](order.txt.b64), no los nombres de las ramas. Estados de esta auditoría, sin reescribir cortes históricos. `COMPLETE_VERIFIED` identifica entregables con comprobaciones actuales focalizadas y evidencia histórica complementaria; no totalidad normativa. `COMPLETE_DOCUMENTED` indica cumplimiento documental sin repetir ahora una verificación equivalente de la fase.

| Fase | Compromiso original | Entregable esperado | Artefacto real | Implementación | Evidencia | Brecha | Estado |
|---|---|---|---|---|---|---|---|
| A | Baseline/main, pruebas, decisiones y reglas, primer protocolo | ED, línea reproducible, protocolo | F6-A-readiness, ED-001…005, P01 | Commit A, sin producción nueva |28 suites511PASS históricos; logs/hash/base; inspección actual | No se repitió todo baseline; no obligación A pendiente identificada | COMPLETE_DOCUMENTED |
| B | Pregunta falsable, controles, métricas, semillas, algoritmo adicional y adaptación sin WORLD | P01 preregistrado + adaptador/tests | Protocolo intacto; FrontierMemoryAgent; runtime/factoría | B; fijación de revisión E, WORLD preservado | Ahora AG10/10; protocolo/hash; histórico B/E + E3 | No se probó universalidad de agentes/configs; no era promesa B | COMPLETE_VERIFIED |
| C | Headless, límites externos, transporte, procedencia, archivo recuperable | Ejecutor + archivo + recarga verificable | tools/p01; evaluación separada; tools/evidence | B/E/F, no entrega «C» artificial | Ahora EX5/5, AR7/7 con replay técnico; copia774; histórico E3/E4/C2 | Portabilidad demostrada acotada; no laboratorio externo prometido | COMPLETE_VERIFIED |
| D | Trayectorias como entrada pura, métricas/controles/fallos/incertidumbre/cálculo independiente | Métricas + comparaciones + recálculo separado | metrics.cjs, oráculo F6-F, descriptores E4 | B/E/F + scripts operacionales E4 | Ahora ME8/8; histórico F6-F13, E4 filas256/pares32 | Independencia de cálculo, no motor independiente ni inferencia poblacional | COMPLETE_VERIFIED |
| E | Investigación completa, repetición, restore/integridad/replay, portabilidad acotada, aceptación/preservación | E3/E4/E5/C2 y cierre | Expedientes p01-e3-final/e4/e5/c2-closure | Herramientas C/D reutilizadas; ejecución ya realizada | Histórico256 episodios,128 pares repetidos,256 replay restaurados, receipt Windows; hashes actuales | Nueva ejecución equivalente prohibida; copia externa sustentada por propietario, no OneDrive/R2 | COMPLETE_DOCUMENTED |
| N | Historia v0.2.4/v0.2.3, diferencias, decisiones, puerta normativa/interoperabilidad | Reconciliación y base de conformidad | F5-A/B/C/D, fragmentos y candidatos; G00 | Harness y preparación existen; no corpus completo recuperado |114PASS/289BLOCKED históricos; perfil candidato HOLD; lectura actual de fuentes | Fuentes completas, cláusulas/decisiones y referencias de aceptación no resueltas | BLOCKED |

## A — Control de configuración y decisiones

Commit `0ae7b8e90c5abf26044cdcfb8641f050134bcc82`, base `48c7d208de4847588567ed8a8c0f7c9167ca891a`; integración posterior `59bd859bf102be546f3dfb3bb0200fde0b90233b` usada como baseline del motor. Archivos: [readiness](../F6-A-readiness.md), [ED](../ENGINEERING_DECISIONS.md), [P01](../F6-A-pilot-protocol.md), `docs/f6-a/verification.log.b64` y captura de orden.

Pruebas históricas:28 archivos/511PASS, corpus F5-B114PASS/0FAIL/289BLOCKED, legacy13/9, Chromium adicional documentado. Se distinguen seis aserciones de baseline histórico de505 sobre revisión entonces actual. Condiciones A satisfechas: HEAD/base explícitos, reglas aprobadas, resultados conservados, protocolo propuesto. Dependencias: N para autoridad global, no para registrar línea base. Pendiente A: ninguno identificado. Dictamen documental, no nueva corrida equivalente de511 pruebas.

## B — Protocolo e integración del algoritmo

Implementación `750d357` y corrección de exportación `95e918f72b1c4026fc1b8d5c681179878363ef89`; el primero no se usa como revisión congelada corregida. [F6-B-report](../F6-B-report.md) conserva el incidente y ambos smoke. Perfil de evaluación refijado en `a2c989b67ee447cdeb4733b07f5f6b5887c27ed6`; manifiesto publicado `61b6e593f99c3c362c6d1a53c87a899b31d9c9db`. Agente `js/agents/frontier_memory_agent.js`; integración `tools/p01/runtime.cjs` y factoría existente de EXPERIMENT; protocolo `docs/F6-A-pilot-protocol.md`.

La pregunta H+ y consumo C están prefijados; control principal Random, Rule/Wait descriptivos; seeds1001–1032/dos repeticiones. Política BFS N/E/S/W, prioridad recursos, distancia/y/x y memoria de consumidos: no acceso a WORLD/seed del mundo. AG01–10 ahora10PASS, incluida factoría real/reset e información permitida. Histórico35 pruebas B y32 smoke finales. P01 SHA `74491ffdf9dbbafa260e53cc21dbb63424e0785d930653e11301d911d119146c` comprobado; motor sin cambios contra baseline B. E modificó explícitamente archive/metrics, no algoritmo/protocolo. Depende de A para baseline y C/D para ejecutar/medir. Sin obligación B pendiente dentro del perfil.

## C — Ejecución y recuperación, entregadas en B/E/F

Commits B `95e918f…`, E `a2c989b…`, F `9c5ee8cbc37cf1048ab4905e80b0534e3312f383`. Código: `tools/p01/{controller,worker,supervisor,runtime,codec,archive,provenance,freeze}.cjs`, `tools/p01/evaluation/`, `tools/evidence/{preserve,verify,io}.cjs`. Los nombres abreviados remiten a los SHA completos de este documento y del [informe F6-F](../F6-F-report.md).

Supervisor: timeout externo, SIGKILL y siguiente proceso útil; heap512MiB y30s finales, test de bloqueo1500ms/64MiB. Transporte tipado Map/BigInt/binary64/bytes; checksum no sustituye validación semántica. Procedencia: configuración, seeds derivadas, commit, fuentes/runtime/mediciones, raw antes de verificación en evaluación. Archivo exclusivo por intento; no inventar resultado ante fallo. Comprobaciones actuales: EX01–05 y AR01–07, **12PASS**, incluidos corrupciones y replay desde datos recuperados seed1. No recarga de E3 como otra campaña.

Histórico: B32/32 COMPLETE_MATCH y proceso frío; E3 256 intentos archivados,0fallos; E4 restauró519 archivos y ejecutó256 replay; F6-F16 pruebas de preservación. Ahora copia774 objetos/256 índices válida y paquetes originales inalterados. C2 acredita bytes recibidos fuera del workspace según confirmación del receptor. Esta portabilidad no prueba ejecución en Windows ni segundo motor. Dependencias A/B y D para analizar; no faltante C original identificado.

## D — Análisis y tratamiento de incertidumbre

Métricas B/E: `tools/p01/metrics.cjs` (pureza `measure`/`compareCampaign`), revisión B/E indicada arriba. Oráculo separado F `9c5ee8c…`: `tools/evidence/p01-independent-metrics.cjs`; descriptores completos separados en `docs/p01-e4/verification/p01-e4-independent-descriptors.cjs`, publicación E4 `25fec76804571f6d7f6356c3baad2aa96b3b01c7`.

C cuenta consumo real, D pareado por seed; cobertura, rechazos/categoría, duración, recursos iniciales y terminación definidos. Dos repeticiones no duplican n; fallos no se descartan para producir una media, exclusiones comunes documentadas sin reemplazo. Incertidumbre: batería finita/no IID inferido, sin p-valores poblacionales añadidos, resultados negativos también técnicamente aceptables. Esa delimitación cumple el tratamiento de incertidumbre comprometido; no era obligación inventar inferencia que el diseño no permite.

ME01–08 actuales8PASS (fixtures manuales de pureza, signo negativo/cero, faltantes, duplicados, repeticiones/exclusiones). F6-F histórico13PASS del oráculo e importaciones prohibidas; E4 documenta256 filas de descriptores concordantes y32 diferencias. Independencia es del cálculo, no del motor ni un auditor humano externo. Depende de C para datos íntegros y B para definiciones; sin obligación D original pendiente identificada. No se ha recalculado E4 durante esta auditoría.

## E — Investigación, repetición y aceptación

Checkout ejecutado `6fcc698681514a90e1dcd28a0f926967b2304884`; documentos C1 `33d0c9d8619f69373dfe7b24510be43164b5cef0`/PR41; E4 `25fec768…`/PR42; E5 `13bee0ece607735dcc7f5ddc82dfbfb060c4ebc8`/PR43; cierre C2 `3c0241a6bfdc7bc0e5c0bba094e6cebb847fb266`/PR44. [E3](../p01-e3-final/E3-operational-report.md), [E4](../p01-e4/E4-report.md), [E5](../p01-e5/FINAL_ACCEPTANCE_REPORT.md), [C2](../p01-c2-closure/C2_CLOSURE_REPORT.md).

256 combinaciones únicas de32seeds×4agentes×2repeticiones, cero fallos/exclusiones. Repetir investigación en el alcance aprobado significa las128 parejas de episodios desde reset, no otro estudio externo añadido ahora. E4 restaura519 archivos, verifica256 replay/41.216estados/82.432bytes-comparaciones,32 mundos comunes y cálculo independiente. H_PLUS_SUPPORTED solo P01, media D11,125 y32 victorias. E5 técnico/científico no depende de que gane el agente. C2 resuelve condición externa por confirmación local Windows, PR44 integrado; no se verifica OneDrive.

Ahora se comprueban inventarios publicados, conteos documentales, SHA/tamaño originales y continuidad del código. Eso no repite restauración/campaña ni sustituye resultados históricos por ejecuciones ficticias. Dependencias A–D satisfechas en P01. N y laboratorio externo no fueron condiciones de liberación operacional P01. Dictamen `COMPLETE_DOCUMENTED`; no compromiso E original insatisfecho identificado.

## N — Preparación terminada, reconciliación bloqueada

F5-A/B/C y F5-D `a4f7a54fd51644f761767fd5d40d5951ce7a52ca`, integrado por PR34 (`48c7d208…`). Fuentes: [F5-D](../f5-d/README.md), [G00 y decisiones](../f5-d/UNRESOLVED_DECISIONS.md), [perfil F5-C](../ACCEPTANCE_PROFILE_F5-C.md), `conformance/profile/` y `conformance/results/`. El expediente distingue32 familias directamente determinadas/31parciales/2indeterminadas, no universo histórico reconstruido.

Faltan fuente auténtica v0.2.4 completa y antecedentes v0.2.3 aplicables; I01–I66/§25.9/§36 y otros contratos incorporados no se reconstruyen desde legacy. DEC-G06 resuelto en su alcance no resuelve G00/G01–09 restantes. v0.2.5 y D-01 vigentes; candidato consolidado y propuestas no son nueva norma. Corpus histórico114PASS/0FAIL/289BLOCKED; no se ha ejecutado ahora. F3-G/H conflictos antiguos corregidos por D-01/F4-G no se reabren por leer un corte antiguo.

Para completar N: recibir fuente con bytes/procedencia verificables, reconciliar obligaciones realmente vigentes y decisiones; si fuera imposible, requiere acto normativo explícito para sustituir lo ausente, no permiso implícito de ingeniería. Fijar perfil/referencias autorizados, verificar obligaciones y contraste independiente antes de sus hitos. Dependencia externa de autoridad, no falta de ejecutor. `BLOCKED`; conformidad e interoperabilidad `NOT_ESTABLISHED`.
