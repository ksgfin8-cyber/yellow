# WORLD-LAB — F6-B: instrumento P01 y verificación de desarrollo

**IMPLEMENTED / VERIFIED en desarrollo; candidato de congelación pendiente de revisión.**
No se ejecutó evaluación1001–1032. Hipótesis final **NOT_EVALUATED**.
Conformidad canónica e interoperabilidad **NOT ESTABLISHED**; permanecen289BLOCKED.
[Orden recibida](f6-b/F6-B-order.b64), [protocolo intacto](F6-A-pilot-protocol.md),
[uso del ejecutor](../tools/p01/README.md), [decisiones](ENGINEERING_DECISIONS.md),
[descripción preparada del PR](f6-b/PR.md).
Fecha de cierre:2026-11-13 UTC. El protocolo F6-A conserva su encabezado histórico;
este informe actualiza el estado operacional sin reescribirlo.

## Configuración controlada

Base y origin/main comprobados: `59bd859bf102be546f3dfb3bb0200fde0b90233b` (PR#35).
Rama: `dev/f6-b-p01-execution`. Commit de implementación congelado y limpio:
`95e918f72b1c4026fc1b8d5c681179878363ef89`. El commit documental posterior añade evidencia y ED;
no altera los bytes de fuente congelados ni exige un hash autorreferencial.
Los151 archivos anteriores se compararon byte a byte contra la base antes del cierre de smoke:
ninguno cambió. Al cierre, únicamente ED-002 se actualiza entre los documentos previos.
WORLD, PRNG, tick, Recorder, Replay, WLS1, baselines, HTML, norma, corpus y expectativas
permanecen intactos. ENGINEERING_LEARNINGS no cambia: no surgió una lección nueva
que exigiera otro registro.

La desconexión previa afectó al acceso al entorno de ejecución. Los archivos locales
se conservaron. Se revisaron y volvieron a probar; no se asume que una prueba previa
continuó ejecutándose durante la interrupción. Los procesos/Git de estas comprobaciones
se ejecutaron con la autorización del entorno necesaria para procesos hijos y red.
No se cambió autenticación ni política de red.

## Correspondencia entre alcance y evidencia

| Puerta | Implementación | Evidencia ejecutada |
|---|---|---|
| B1 | FrontierMemoryAgent; inyección por factoría existente, solo Feedback, mapa privado y reset; BFS N,E,S,W; recursos antes de fronteras, distancia/y/x | AG01–10: rutas, obstáculos, desconocidos, desempates, consumo, reset, entrada inmutable, factoría real y ejecución sin globals WORLD/Recorder/RNG |
| B2 | Worker por episodio y supervisor externo;30s/512MiB heap V8; muerte del proceso fuera del WORLD | EX01–05: bloqueo dentro de step, SIGKILL, episodio posterior correcto, crash, worker ausente y guardas de semillas |
| B3 | WL-P01-ARCHIVE-1; conformance/wire sin cambios; gzip y checksum externo, procedencia y escritura exclusiva | AR01–07 y CO01–05: Map/BigInt/-0/subnormal/bytes, archivos corruptos, estado/semillas inconsistentes, replay, proceso frío y ausencia de sobrescritura |
| B4 | measure/compareCampaign puras, métricas P01 e inclusión prefijada | ME01–08: conteos manuales, energía/costes de fixture independientes del perfil, diferencias negativas válidas, fallos, pares/repeticiones, origen distinto y fallos iniciales comunes |
| B5 | Campaña secuencial y archivo por episodio, recarga y replay completos, comparación de repeticiones y mundos iniciales |32/32 COMPLETE_MATCH;16 comparaciones de repeticiones;4 mundos comunes; SM01–04 y candidato por hashes |

Los IDs F6B son locales, no sustituyen T01–T280. No hay física duplicada.
El agente adicional no accede a semillas ni snapshots. Los fixtures pueden preparar
su memoria para probar BFS; la campaña real la construye exclusivamente desde Feedback.
La repetición reproduce decisiones del agente desde reset; replay ejecuta acciones grabadas
con el mismo motor. Son garantías diferentes y ninguna prueba interoperabilidad independiente.

## Pruebas y regresiones

| Comando / alcance | Resultado real |
|---|---|
| `node --test tests/f6-b-{agent,execution,archive,metrics,controller}.test.cjs` |35PASS/0FAIL:10+5+7+8+5 |
| `node tests/f6-b-smoke.cjs /tmp/p01-f6b-smoke-final-20261113 /tmp/p01-f6b-freeze.json` |4 comprobaciones PASS de evidencia/candidato, incluido proceso frío |
| `node tests/f*.test.cjs` individualmente, excluyendo f6-b |28 archivos,511PASS/0FAIL; tabla por archivo en log y resumen |
| runner cases.json |50PASS/0FAIL/289BLOCKED; reporte idéntico al histórico |
| runner cases-f5-b.json |114PASS/0FAIL/289BLOCKED; incluye los50 anteriores, no sumar164 |
| mutation-f5-b.cjs |64/64 corrupciones detectadas; reporte idéntico |
| conformance/profile/validate.cjs |exit0, VALID_CANDIDATE_ARTIFACT / HOLD |
| tests/f4-a.test.cjs --browser |16PASS/0FAIL:15 repetidas Node+1 Chromium real |
| tests/f1-a-legacy.cjs |13PASS/9FAIL conocidos, exit1 |
| python -B docs/f5-d/validate.py |exit1, Foreign changed file; alcance histórico fijado a rutas F5-D |
| git diff --check / comparación de archivos previos |sin errores; fuentes protegidas sin cambios |

Seis aserciones de F3-G/H se refieren al baseline histórico fijo v0.2.5; las505 restantes
al estado actual. No son511 tests canónicos. El validador F5-D ya rechazaba nuevas fases
en F6-A; no se cambia su alcance ni sus hashes. Su salida no constituye regresión
funcional ni aprobación semántica. Los fallos legacy son T06/07/08/20/22 por formas
retiradas undefined.length, T12 makeResource, T13 EffectKind, T14 makeHazard y T16
initial_state antiguo inválido. Se conservaron expectativas y causas.

Salidas íntegras y comandos: [unit](f6-b/unit.log.b64),
[regresiones](f6-b/regression.log.b64), [extendidas](f6-b/extended.log.b64),
[smoke](f6-b/smoke.log.b64), [aceptación](f6-b/acceptance.log.b64) e [integridad final](f6-b/integrity.log.b64).
Lectura: `base64 --decode docs/f6-b/unit.log.b64` (análogamente las demás).
F5-A SHA256: `db10137b77f3619008ca07e81bd150cd616ed0d89b019edd34db63b04a1ceae5`;
F5-B: `3d4f2638b2469d4799ba87b412124ddeaab1676df34d988df33420984faa0077`.
Los reportes originales no se reescriben.

## Smoke realizado y resultados descriptivos

Solo semillas1,2,3,4; agentes wait/random/rule/frontier_memory_v1; repetición1 y2.
La campaña final contiene32 episodios =16 primarios+16 verificaciones deterministas,
no32 muestras independientes. Hubo además una primera campaña de32 episodios completos
sobre750d357: aprobó replay/repeticiones, pero falló la generación del manifiesto por
una exportación ausente de assertEngineUnchanged. Se añadió la exportación y CO05;
se repitieron las35 pruebas y toda la campaña sobre el nuevo commit limpio.
No cambió política, física, parámetros ni métricas. Total de intentos de campaña de
desarrollo64, además de fixtures unitarios; evaluación0. Se preservan la primera
[campaña](f6-b/pre-freeze-smoke/campaign.json), archivos y [fallo](f6-b/first-freeze-failure.log.b64).
Los archivos pre-freeze conservan procedencia750d357; su verificación requiere ese
checkout histórico. No se reescribieron sus hashes con las fuentes actuales.
Los32 payloads de ambas campañas coinciden exactamente por SHA256; no se seleccionó
una corrida según desempeño ni se mezclaron campañas para aumentar pares.
No se eligieron ni sustituyeron escenarios. Fallos operacionales0/32, de agente0/32,
inicialización0/32; exclusiones0; pares elegibles4.
Cada episodio160 ticks,161 estados verificados incluidos el inicial y todos los pasos.
Los mundos iniciales coinciden estructuralmente y por bytes WLS1 entre agentes;
las repeticiones coinciden en todo el payload canónico, excluidos ID/tiempos del host.
La recarga y el replay se verificaron para los32 archivos completos. SM04 verifica
además un archivo real de campaña en un proceso Node nuevo, sin VM original.

| Semilla | FrontierMemory consumos | Random | Diferencia | Rule | Wait |
|---|---:|---:|---:|---:|---:|
| 1 | 10 | 2 | 8 | 0 | 0 |
| 2 | 14 | 2 | 12 | 0 | 0 |
| 3 | 17 | 3 | 14 | 0 | 0 |
| 4 | 13 | 2 | 11 | 1 | 0 |

Distribución de desarrollo: `{"differences": [8, 12, 14, 11], "sum": 45, "mean": 11.25, "median": 11.5, "min": 8, "max": 14, "wins": 4, "ties": 0, "losses": 0}`.
No sostiene ni rechaza la hipótesis final. No se usa para ajustar algoritmo,
configuración, métricas o semillas. Las filas completas, cobertura, rechazos y contexto
están en [analysis.json](f6-b/smoke/analysis.json).

## Coste observado y presupuesto

Runtime y CPU identificados en cada archivo. Node v24.22.1, Linux x64.
Topes autorizados por episodio:30s y512MiB de heap V8; heap no equivale a RSS.
El timeout se aplica al worker; archivo/replay posterior son operaciones separadas
con datos y tamaño del perfil limitados. No se presentan como trabajo de un agente
hostil aislado por el sistema operativo. En un kill, CPU puede no estar disponible;
RSS muestreado se identifica como cota inferior. En smoke los32 retornaron normalmente.
El coste incluye motor/registro, no solo decisiones del algoritmo; no es benchmark
comparativo de agentes. La primera campaña coincidió inicialmente con verificaciones heredadas; la campaña
final utilizó el mismo host. Los tiempos son observaciones de esta sesión.

| Agente (8 episodios) | Worker wall s media (rango) | CPU worker s media | Máx RSS MiB | Archivo KiB medio | Archivo s media | Replay/verificación s media | Total s media (rango) |
|---|---:|---:|---:|---:|---:|---:|---:|
| wait | 3.044 (2.826–3.377) | 3.089 | 61.1 | 17.1 | 0.589 | 7.751 | 11.531 (10.620–12.237) |
| random | 3.163 (3.054–3.496) | 3.221 | 62.2 | 21.3 | 0.543 | 8.276 | 12.140 (11.616–12.804) |
| rule | 3.094 (2.968–3.300) | 3.130 | 60.8 | 17.1 | 0.532 | 7.568 | 11.342 (10.965–12.015) |
| frontier_memory_v1 | 3.111 (2.981–3.273) | 3.165 | 62.6 | 22.2 | 0.536 | 8.000 | 11.799 (11.574–12.330) |

Controlador:wall 375.312s,
CPU 283.376s,
máx RSS 293.8MiB (no sumar picos no simultáneos).
Archivos de episodios comprimidos: 636770bytes.
Proyección aritmética para256 episodios finales,64 por agente, usando medias smoke:
49.9min totales con archivo/replay (wait: 12.3min; random: 12.9min; rule: 12.1min; frontier_memory_v1: 12.6min), sin promesa de coste ni ejecución.
Los límites fueron suficientes en este perfil; no se ampliaron ni se acortó el horizonte.

## Archivo, congelación y límites

[Campaña/procedencia](f6-b/smoke/campaign.json), [registro operacional](f6-b/smoke/execution.jsonl),
[candidato de congelación](f6-b/P01-freeze-candidate.json). Los32 archivos .wlx.gz
están junto a la campaña. SHA256 de cada uno y de su payload consta en el manifiesto.
Los metadatos del host no entran en WLS1 ni esquemas cerrados. El checksum no autentica
una fuente histórica. Map conserva claves string del dominio actual; Uint8Array puede
recuperarse como Buffer con los mismos bytes. El transporte operacional no es WLS1.

El candidato fija commit del motor y de implementación, fuentes/baselines/protocolo,
configuración, algoritmos y parámetros, métricas, inclusión, archivo, presupuestos,
pruebas y huellas de evidencia. `approved=false`, `evaluation_authorized=false`,
`evaluation_executed=false`; enumera1001–1032 sin ejecutarlas. Cambiar flags/config/hashes
invalida su comprobación. El código solo admite semillas de desarrollo; una futura
entrada de evaluación requiere nueva autorización, no basta editar el JSON.

Comprobación desde esta rama:

```bash
node tools/p01/cli.cjs check-freeze docs/f6-b/P01-freeze-candidate.json
node tests/f6-b-smoke.cjs docs/f6-b/smoke docs/f6-b/P01-freeze-candidate.json
# Revalidación completa opcional: lee y reproduce los32 archivos, no ejecuta evaluación
node tools/p01/cli.cjs analyze docs/f6-b/smoke
```

El guardado del candidato exigió checkout limpio de implementación; ahora los documentos
se añaden en otro commit, manteniendo exactamente esas fuentes. Los archivos requieren
el checkout correspondiente a sus hashes; no hay hot reload ni ejecución universal de
cualquier configuración. G00/fuentes históricas pendientes,289BLOCKED, restricciones
conocidas de radio0 y observación grande continúan. No hay nueva norma ni interoperabilidad
independiente demostrada. Evaluación final, merge y fases posteriores requieren revisión;
no se iniciaron. Se preparó el PR contra main para revisión, sin autorización de merge.
