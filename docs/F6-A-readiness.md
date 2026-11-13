# WORLD-LAB — F6-A: baseline y preparación de cierre experimental

**F6-A preparado documentalmente; P01 PROPOSED, no ejecutado.** Fecha:
2026-11-13 (America/Guayaquil). [Decisiones aprobadas](ENGINEERING_DECISIONS.md),
[protocolo y parámetros completos](F6-A-pilot-protocol.md). No cambia producción,
autoridad normativa, expectativas, corpus ni §37. No se inicia F6-B en esta entrega.

<a id="baseline"></a>
## Línea base y configuración

- Repositorio: ksgfin8-cyber/yellow.
- `origin/main` y base de la rama: `48c7d208de4847588567ed8a8c0f7c9167ca891a`.
- Último incremento integrado: **PR #34, F5-D**. Padres:
  `a3fb5b823bfdf74a981e9acf9e10bb30cc18b478` y
  `a4f7a54fd51644f761767fd5d40d5951ce7a52ca`.
- Rama nueva: `dev/f6-a-experimental-readiness`, creada directamente de origin/main.
- Copia limpia antes del trabajo; diff de contenido entre rama previa F5-D y main
  vacío. La actualización remota era el merge #34, no otra implementación.
- F5-C remoto: `dev/f5-c-acceptance-profile` en
  `cc9aaac4fd18fb62e1dbbbef721b95eaf3e51c5b` (integrado PR #33).
- F5-D remoto: `dev/f5-d-normative-reconciliation` en
  `a4f7a54fd51644f761767fd5d40d5951ce7a52ca` (integrado PR #34).
- No había ramas `dev/f6-*` remotas en la consulta previa a publicación. Main
  coincide exactamente con la referencia de la orden: no fase posterior integrada.
- Git prueba esos merges/refs, no el inventario de PR abiertos. La consulta API
  `gh pr list --repo ksgfin8-cyber/yellow --state all --limit 8 --json number,state,headRefName,baseRefName,mergedAt`
  recibió `Post "https://api.github.com/graphql": Forbidden`; no afirmar que no
  existen PR pendientes. No se solicitó acceso adicional ni se cambió autenticación.

Comandos Git usados: `git status --porcelain`, `git branch --show-current`,
`git rev-parse HEAD`, `git fetch origin`, `git rev-parse origin/main`,
`git log -3 origin/main --format='%H %P %s'`, `git diff --stat HEAD origin/main`,
`git ls-remote --heads origin main dev/f5-c-acceptance-profile dev/f5-d-normative-reconciliation dev/f6-a-experimental-readiness`,
`git ls-remote --heads origin 'dev/f6-*'`,
`git switch -c dev/f6-a-experimental-readiness origin/main`.
No reset, force push, merge ni despliegue.

## Regresiones realmente ejecutadas

Node v24.22.1; Chromium155.0.8059.79. Salidas exactas y comandos individuales en
[verification.log.b64](f6-a/verification.log.b64), preservados sin normalizar
espacios/timings. Lectura: `base64 --decode docs/f6-a/verification.log.b64`.
Los tiempos de test no son una medición del piloto ni una promesa de coste.

| Archivo | PASS | FAIL | Exit |
|---|---:|---:|---:|
| tests/f1-a.test.cjs | 18 | 0 | 0 |
| tests/f1-b.test.cjs | 12 | 0 | 0 |
| tests/f2-a.test.cjs | 14 | 0 | 0 |
| tests/f2-b.test.cjs | 13 | 0 | 0 |
| tests/f2-c.test.cjs | 21 | 0 | 0 |
| tests/f2-d.test.cjs | 28 | 0 | 0 |
| tests/f2-e.test.cjs | 16 | 0 | 0 |
| tests/f2-f.test.cjs | 18 | 0 | 0 |
| tests/f2-g.test.cjs | 21 | 0 | 0 |
| tests/f2-h.test.cjs | 15 | 0 | 0 |
| tests/f2-i.test.cjs | 18 | 0 | 0 |
| tests/f3-a.test.cjs | 40 | 0 | 0 |
| tests/f3-b.test.cjs | 18 | 0 | 0 |
| tests/f3-c.test.cjs | 24 | 0 | 0 |
| tests/f3-d.test.cjs | 12 | 0 | 0 |
| tests/f3-d2.test.cjs | 15 | 0 | 0 |
| tests/f3-e.test.cjs | 24 | 0 | 0 |
| tests/f3-f.test.cjs | 23 | 0 | 0 |
| tests/f3-g.test.cjs | 27 | 0 | 0 |
| tests/f3-h.test.cjs | 23 | 0 | 0 |
| tests/f4-a.test.cjs | 15 | 0 | 0 |
| tests/f4-b.test.cjs | 18 | 0 | 0 |
| tests/f4-c.test.cjs | 20 | 0 | 0 |
| tests/f4-e.test.cjs | 17 | 0 | 0 |
| tests/f4-f.test.cjs | 12 | 0 | 0 |
| tests/f5-a.test.cjs | 12 | 0 | 0 |
| tests/f5-b.test.cjs | 6 | 0 | 0 |
| tests/f5-c.test.cjs | 11 | 0 | 0 |

Total moderno: **28 archivos,511PASS/0FAIL**. Seis aserciones F3-G/H corresponden
al baseline histórico fijo v0.2.5; las505 restantes a la revisión actual, incluidas
pruebas de infraestructura documental. No son511 pruebas canónicas ni una cobertura
completa. No modificar expectativas para suprimir incompatibilidades.

| Verificación | Resultado | Alcance |
|---|---|---|
| F5-A completo | 50PASS/0FAIL/289BLOCKED/0UNTESTED, exit0 | Bytes idénticos al reporte archivado |
| F5-B completo | 114PASS/0FAIL/289BLOCKED/0UNTESTED, exit0 | Incluye los50 F5-A; no sumar como164 casos distintos |
| Corrupción F5-B | 64/64 detectadas, exit0; reporte idéntico | Sensibilidad del comparador a respuestas corruptas, no todos los defectos posibles |
| Perfil F5-C | exit0, VALID_CANDIDATE_ARTIFACT / HOLD | Integridad del candidato, no aprobación ni conformidad |
| Expediente F5-D sobre base | exit0, VALID_DOCUMENTARY_CANDIDATE / HOLD | Foto documental fijada; no prueba equivalencia semántica |
| Expediente F5-D tras staging F6-A | exit1: Foreign changed file | Protección de rutas históricas; no regresión productiva ni criterio global de F6 |
| Navegador existente | 16PASS/0FAIL, exit0 |15 casos Node repetidos +1 caso real Chromium; no sumar16 casos únicos nuevos |
| Legacy actual | 13PASS/9FAIL, exit1 esperado | Incompatibilidades conocidas conservadas |

Comandos de corpus y verificadores (archivos nuevos de salida solo en /tmp):

```bash
node conformance/runner.cjs --cases cases.json --out /tmp/f6-a-f5-a.json
node conformance/runner.cjs --cases cases-f5-b.json --out /tmp/f6-a-f5-b.json
node conformance/mutation-f5-b.cjs /tmp/f6-a-mutants.json
node conformance/profile/validate.cjs
python -B docs/f5-d/validate.py
PLAYWRIGHT_MODULE=/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.js node tests/f4-a.test.cjs --browser
node tests/f1-a-legacy.cjs
```

SHA-256 de reportes repetidos:
F5-A `db10137b77f3619008ca07e81bd150cd616ed0d89b019edd34db63b04a1ceae5`;
F5-B `3d4f2638b2469d4799ba87b412124ddeaab1676df34d988df33420984faa0077`.
Los originales `conformance/results/*` no se reescribieron.

Legacy: T06/07/08/20/22 fallan por lectura de formas retiradas (undefined.length);
T12 makeResource, T13 EffectKind, T14 makeHazard retirados; T16 initial_state
legacy inválido. Se preservan salidas completas, exit1 y sus aserciones.
Los289BLOCKED (280T y9 vectores históricos) no se convierten enPASS.

El verificador F5-D se ejecuta sobre main fijado **antes de preparar el diff F6-A**.
Contiene una protección que solo permite rutas F5-D/IMPLEMENTATION_STATUS; por diseño
no es un gate general que acepte nuevas fases. Se volvió a ejecutar tras staging y devolvió exactamente
`ValueError: Foreign changed file` (exit1), porque los documentos nuevos están fuera
de ese alcance. Ambas salidas se archivan. No cambiarlo ni regenerar sus hashes
para acomodar F6-A. La comprobación final de F6-A usa alcance del diff y comparación
de bytes de **todos los146 archivos previos** contra main48c7d208, además de enlaces
y git diff --check. Se distinguen así evidencia histórica y verificación del cambio.

<a id="f6-b"></a>
## Dependencias concretas de F6-B

| Pieza | Reutilizar | Trabajo focalizado propuesto / aceptación |
|---|---|---|
| Algoritmo adicional | Agent/reset/step, Feedback y factoría configurable de Experiment.run | FrontierMemory-v1 según P01; inyectarlo con factoría por agent_type, sin cambiar WORLD, Recorder o registry existente por obligación. Pruebas locales nuevas de BFS/desempates/depleción/solo información observada; no IDs T históricos. |
| Entrada headless | Patrón existente de carga de scripts/VM en tests y adaptadores | Un ejecutor Node pequeño por episodio y un bucle de campaña secuencial; no migración ESM ni framework. Mantener un orden de carga comprobado y no duplicar física. |
| Archivo sin pérdida | conformance/wire.cjs y reconstrucción de Map/WorldState usada en adaptadores | Revisar y versionar transporte operacional; respetar tipos/representaciones, sin importar clases privadas. Probar ida/vuelta y replay desde datos recargados; JSON nativo no basta. El codec de pruebas no pasa a norma por reutilizarlo. |
| Procedencia | ExperimentConfig/Trajectory vigentes, hashes WLS1 y revisión Git | Contenedor **externo** con ID de intento, protocolo/hash, commit/árbol limpio o diff identificado, runtime/OS/CPU, artefacto del agente y parámetros, seeds, modo, resultado y mediciones del host. No agregar campos a esquemas cerrados ni corregir metadata.version dentro de Trajectory. |
| Ejecución que no retorna | Proceso hijo del sistema operativo | Timeout del padre termina solo ese episodio. Archivar fallo operacional y ausencia de resultado/prefijo si no existe; no inventar ExperimentResult, muerte o trayectoria parcial. No es arquitectura distribuida. Confirmar topes propuestos de P01. |
| Métricas/comparación | Trayectorias y eventos completos | Funciones puras pequeñas según definiciones P01 y tabla pareada/CSV. No módulo general de métricas; evaluador puede leer verdad de estado, agente no. Fixtures manuales para revisar contabilidad. |
| Repetición/verificación | Replay con contexto explícito, comparación estructural y bytes | Dos ejecuciones desde reset; recargar/verificar todas las trayectorias completas del piloto, incluidos estados/eventos y bytes, no solo hashes. Distinguir replay de repetición de decisiones del agente. |
| Cierre de aprendizaje | No necesario en P01, que no entrena | No añadir done/callback ni una llamada step terminal por anticipación. Si otra pregunta exige aprendizaje online, definir protocolo antes de ese uso y revisar fuente/autoridad. |

No basta escribir un algoritmo que sepa el mapa por seed: la revisión debe comprobar
que solo recibe Feedback, no WORLD/Recorder/snapshots ni la semilla de WORLD. El
parametrizado externo no puede filtrar información privilegiada. Las semánticas de
ACT/OBS/FB que afecten P01 quedan identificadas por revisión y parámetros; no se
presentan como contratos históricos totalmente recuperados.

<a id="g00"></a>
## Dependencia histórica dirigida

G00 sigue abierto según [recuperación F5-D](f5-d/REQUIREMENTS_RECOVERY_REPORT.md).
En docs/conformance/sources y los adjuntos accesibles no se recibió una copia
completa identificable del manuscrito v0.2.4 anunciado. Esto no prueba inexistencia
fuera del entorno. No hay acceso automático a Biblioteca del responsable.

Mecanismo concreto de recepción posterior: el responsable adjunta el archivo íntegro
original TXT/MD en el chat, o proporciona ruta y commit de una copia en una rama.
Conservar bytes sin corrección editorial; registrar tamaño, SHA-256 **al recibir**,
versión/título, origen y declaración de procedencia. Archivar como **candidate source**,
no como norma aprobada solo por su hash. Si hay espacios/CRLF que preservar, usar
captura base64 como H034/HINIT. No inventar hash histórico ni autenticar antigüedad
por una suma calculada ahora.

Cotejar primero I54–I66, §25.9 y §36 anunciados; seguir las referencias reales hacia
I01–I53/v0.2.3 y contratos que efectivamente aporte el documento. Comparar con
v0.2.5, sustituciones D-01 e INIT-004 antes de reclasificar. No reconstruir cláusulas
desde código ni marcar todo G00 resuelto por recibir parte del texto. Ninguna nueva
línea base normativa se inicia aquí. La recepción/reconciliación es independiente
de implementar un ejecutor sobre la revisión operacional declarada.

<a id="gates"></a>
## Puertas, riesgos y decisiones pendientes

- **F6-A:** línea base y regresión comprobadas; registro ejecutivo creado; P01 y
  dependencias definidos. No es el piloto ejecutado. ED-002 no se marca VERIFIED.
- **F6-B propuesto:** implementar P01, ejecutor/archivo y análisis mínimo con topes
  externos. Antes de evaluar1001–1032, fijar implementación/manifiesto/expectativas
  y confirmar topes30s/512MiB de heap como presupuesto, no como medición real.
- **Resultado científico:** positivo, negativo o no evaluable bajo reglas prefijadas;
  no exigir que el agente nuevo gane para aceptar el instrumento.
- **Conformidad/interoperabilidad:** HOLD; siguen §37,289BLOCKED, fuentes pendientes
  y ausencia de contraste completo entre implementaciones independientes. No HitosB/C.

Riesgos: coste real de snapshots/replay aún por medir; agente que no retorna necesita
control externo; exportación y procedencia aún no implementadas; hipótesis finita
no generalizable; no aislar memoria como causa; campos/contratos históricos parciales.
Se evitan energía negativa, insuficiencia, muerte, hazard y regen positiva en este
primer estudio, reduciendo dependencias sin afirmar esos dominios resueltos.

No hay defecto crítico nuevo demostrado por estas verificaciones. RuleAgent radio0,
capacidad de observación grande y argumentos de equivalencia F5-D siguen cuestiones
separadas conocidas; P01 no las corrige ni las usa para cambiar la norma. No repetir
auditoría general, crear otra taxonomía ni modificar ENGINEERING_LEARNINGS sin una
lección nueva comprobada. No se midió rendimiento del nuevo algoritmo: no existe aún.

## Comprobación del protocolo sin ejecutar resultados

Se extrajo el bloque JSON de P01 y se construyeron/validaron las144 combinaciones
(36 seeds de desarrollo/evaluación ×4 agentes), además de derivar32 seeds WORLD
distintas para evaluación. No se generaron mundos, episodios ni resultados de P01;
la factoría del agente adicional todavía no existe. Pasar ExperimentConfig no implica
que el algoritmo esté implementado. Esta comprobación de dominio no seleccionó
semillas por desempeño ni cambió parámetros después de observar resultados.

## Alcance de entrega y preservación

Solo cinco archivos nuevos: ENGINEERING_DECISIONS, este informe, P01 y las capturas
b64 de orden/salidas. Se mantienen todos los archivos previos, incluido el corte
histórico IMPLEMENTATION_STATUS. El informe actual y ED enlazan el estado F6-A
sin reescribir cortes anteriores ni invalidar sus fuentes fijadas.

Antes de publicar: verificar referencias locales/anchors, original/decodificado de
capturas,146 archivos previos byte a byte, alcance exacto del índice y git diff
--cached --check. Después del commit: árbol limpio y SHA remoto de rama; sin merge.

## Huellas de las capturas

SHA-256 calculados al archivar esta entrega, no hashes históricos de v0.2.4.

| Captura | Bytes archivados | Original decodificado |
|---|---|---|
| F6-A-order.b64 | `840e1d724ba16fa995a61cb2f341b800d20669cac449fd6628eae3573ef12299` | `493520a32f1b955df8721a1b44975b6afbce332332a213135d09550118f7acab` |
| verification.log.b64 | `7c1adcb655d37f2b5cda1c3d10b535d61eefd821fd22439821053a5681f33b83` | `71d16ffeeed4debca6ee82971fab3881f6dfb45ec63afccd6f134ba387462a51` |
