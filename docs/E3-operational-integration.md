# E3 — Hoja operacional de integración P01 + F6-F

**READY_FOR_SIGNED_PREFLIGHT. Evaluación final HOLD.**
Base confirmada: `73eb23b873ffd02e3ce2a96836445d3a4cd88d82`, merge PR#39.
Identidad verificada, sin cambios:
`47155590f10358f6130a1f7eae261ec9ec1fc8035652c04dd23fcc9f92c63e7d`.
Rama de entrega: `dev/e3-operational-integration`. Solo documentación y evidencia.

Node v24.22.1/Linux x64, binario SHA256
`61ab14cd750fc24d5db53490ec5fc40f756e4b6e136b78cf7004265471d9bd1d`.
El gate confirma código, pruebas, protocolo y archivos smoke reales. Se conservan30s
por episodio y `--max-old-space-size=512`; no se interpreta como un cap total de RSS.
No hay clave/huella aprobada ni recibo firmado de producción disponibles en esta entrega.
No se completó preflight real ni se invocó run. No se generaron mundos, episodios o claves.

## Preparación común — comandos para la operación futura, no ejecutados aquí

Usar estas definiciones en ambas terminales. La huella se obtiene de la decisión
externa del propietario, no de un cálculo del propio ejecutor como prueba de aprobación.

```bash
set -euo pipefail
cd /workspace/yellow
export P01_CAMPAIGN='p01-final-20261113-01'
export P01_SOURCE='/workspace/shared/world-lab/p01-final-20261113-01'
export P01_COPY="${P01_SOURCE}-evidence"
export P01_OPS="${P01_SOURCE}-ops"
export P01_RESTORED="${P01_SOURCE}-restored"
export P01_EXPORT="${P01_SOURCE}-exports"
export P01_AUTH='/workspace/shared/world-lab/p01-authorization'
export P01_PROPOSAL='docs/f6-e/P01-evaluation-freeze.json'
export P01_FREEZE='47155590f10358f6130a1f7eae261ec9ec1fc8035652c04dd23fcc9f92c63e7d'
export P01_APPROVED_KEY_SHA256='<64 HEX APROBADOS EXTERNAMENTE>'
```

Fuente y copia son hermanas, no iguales ni anidadas; OPS/restauración/exportación son
rutas diferentes. Se comprobó la separación con io.disjoint. La fuente real y la copia
real siguen inexistentes. El padre `/workspace/shared/world-lab` existe fuera de Git.
**No crear P01_SOURCE:** el controlador usa mkdir exclusivo y debe crearlo él mismo.
No usar como destino de watch una copia ya materializada por restore.

## Orden obligatorio

**1. Identidad y entorno.** En el checkout limpio de la revisión aprobada:

```bash
test -z "${NODE_OPTIONS-}" || exit 1
node tools/p01/evaluation/cli.cjs check "$P01_PROPOSAL"
test -z "$(git status --porcelain)" || exit 1
test ! -e "$P01_SOURCE" && test ! -e "$P01_COPY"
```

Una diferencia de identidad, runtime, código o evidencia da HOLD; no corregir hashes
ni modificar el ejecutor para sortearla. Directorios de una ejecución anterior requieren
revisión, no borrado, cambio silencioso de nombre ni repetición de P01.

**2. Recepción.** Obtener solo clave pública, huella DER-SPKI aprobada, recibo exacto
WL-P01-AUTHORIZATION-1 y firma binaria64bytes. La privada queda con el propietario.
Seguir el [procedimiento de firma existente](f6-e3-gate/README.md); conservar los bytes
firmados y comprobar campaña/destino. No editar ni ampliar el recibo después de firmarlo.

**3. Preflight real, cuando existan esos materiales aprobados.** OPS es un directorio
nuevo de logs del operador, fuera de fuente/copia y del repositorio.

```bash
mkdir "$P01_OPS"
node tools/p01/evaluation/cli.cjs preflight "$P01_PROPOSAL" \
  "$P01_AUTH/authorization.json" "$P01_AUTH/authorization.sig" \
  "$P01_AUTH/owner-ed25519-public.pem" "$P01_FREEZE" "$P01_APPROVED_KEY_SHA256" \
  > "$P01_OPS/preflight.json"
node - <<'JS'
const fs=require('node:fs');
const p=JSON.parse(fs.readFileSync(process.env.P01_OPS+'/preflight.json'));
const r=JSON.parse(fs.readFileSync(process.env.P01_AUTH+'/authorization.json'));
if(p.freeze_id!==process.env.P01_FREEZE||p.signature!=='VALID'||p.episodes_started!==0||
   p.output_directory!==process.env.P01_SOURCE||r.campaign_id!==process.env.P01_CAMPAIGN)
  throw Error('HOLD: preflight/campaña/destino no coinciden');
JS
```

**4. Orden posterior del propietario.** Presentar el preflight y recibir autorización
expresa de inicio para esta identidad/clave/campaña/destino. Guardar su referencia en
OPS/start-approval.txt, separada del recibo cerrado. La firma aprueba el alcance; el
preflight no abre E3. Esta segunda puerta es procedimental: el código acepta los mismos
materiales para preflight y run y no comprueba por sí solo la existencia de otra orden.

**5. Terminal A: iniciar conservación, después de la orden de inicio y antes de E3.**
El proceso separado espera el log: no crea la fuente ni inicia/detiene P01. El log se
crea después de copiar los materiales de autorización. Espera máxima300s; si vence, HOLD.

```bash
(
  for ((P01_WAIT_ATTEMPT=0; P01_WAIT_ATTEMPT<300; P01_WAIT_ATTEMPT++)); do
    if test -f "$P01_SOURCE/execution.jsonl"; then break; fi
    sleep 1
  done
  test -f "$P01_SOURCE/execution.jsonl" || { echo 'HOLD: no apareció el log' >&2; exit 1; }
  exec node tools/evidence/preserve.cjs watch "$P01_SOURCE" "$P01_COPY" \
    --campaign "$P01_CAMPAIGN" --identity "$P01_FREEZE" --interval-ms 15000
) > "$P01_OPS/watch.jsonl" 2> "$P01_OPS/watch.stderr" &
P01_WATCH_PID=$!
printf '%s\n' "$P01_WATCH_PID" > "$P01_OPS/watch.pid"
```

Confirmar que A sigue esperando/observando antes de iniciar B. SOURCE_INCOMPLETE y
START sin FINISH son normales mientras haya actividad; COPY_ERROR o conflicto
bloqueante exigen revisión. No basta el exit code del watcher: revisar sus filas JSON.
Se puede reiniciar solo el observador con la misma fuente/copia para reconciliar hashes;
esto no autoriza reiniciar ni reanudar una ejecución experimental.

**6. Terminal B: E3, exclusivamente con la autorización posterior ya registrada.**
Bloque preparado para revisión; **NO ejecutado en esta entrega**.

```bash
if node tools/p01/evaluation/cli.cjs run "$P01_PROPOSAL" \
  "$P01_AUTH/authorization.json" "$P01_AUTH/authorization.sig" \
  "$P01_AUTH/owner-ed25519-public.pem" "$P01_FREEZE" "$P01_APPROVED_KEY_SHA256" \
  > "$P01_OPS/controller.stdout" 2> "$P01_OPS/controller.stderr"; then
  printf '0\n' > "$P01_OPS/controller.exit"
else
  printf '%s\n' "$?" > "$P01_OPS/controller.exit"
fi
```

No sustituir escenarios, relanzar resultados desfavorables ni ajustar parámetros.
Un fallo aplica las reglas P01; conservar fuente y diagnósticos. El observador no
gestiona procesos hijos del controlador ni concede permisos de ejecución.

**7. Terminal de cierre: snapshot y comprobación.** Cuando el controlador haya salido,
confirmar mediante ps que el PID guardado sigue siendo el observador de estas rutas;
no señalizar un PID obsoleto o al controlador. Detener solo ese observador con SIGTERM.

```bash
P01_WATCH_PID=$(cat "$P01_OPS/watch.pid")
[[ "$P01_WATCH_PID" =~ ^[1-9][0-9]*$ ]] || exit 1
ps -p "$P01_WATCH_PID" -o pid=,args=
# Confirmar identidad del proceso antes de enviar la señal; omitir si ya terminó.
kill -TERM "$P01_WATCH_PID"
# Esperar su cierre; wait "$P01_WATCH_PID" si sigue siendo hijo de esta terminal.
node tools/evidence/preserve.cjs snapshot "$P01_SOURCE" "$P01_COPY" \
  --campaign "$P01_CAMPAIGN" --identity "$P01_FREEZE" > "$P01_OPS/snapshot-terminal.json"
node tools/evidence/verify.cjs "$P01_COPY" > "$P01_OPS/copy-verify.json"
```

Revisar copy_state/state, preservation_state/errors, conflictos, ausencias y completitud.
COPY_VERIFIED no es aceptación científica. Si falta cierre, conservarlo como evidencia
parcial y declarar HOLD; no fabricar FINISH ni crear otro paquete para ocultar conflictos.
Preservar la fuente original, incluso los archivos de intentos sin FINISH que el perfil
F6-F no incorpora como episodios cerrados.

**8. Restauración y contraste E4.** Solo tras el cierre y dentro del alcance autorizado:

```bash
node tools/evidence/verify.cjs "$P01_COPY" --restore "$P01_RESTORED" > "$P01_OPS/restore.json"
node tools/evidence/p01-independent-metrics.cjs "$P01_RESTORED" > "$P01_OPS/independent-metrics.json"
```

El oráculo compara repeticiones/iniciales y calcula métricas desde datos recuperados;
usa proofs archivados y **no re-ejecuta replay**. E4 debe completar el replay existente
sobre la copia recuperada, además de comparar el análisis original y el independiente.
Reutilizar readArchive y verifyArtifact del mismo archiveFor(perfil de evaluación)
en esa etapa futura. No se invocaron aquí porque verifyArtifact reconstruye el mundo
inicial para validar replay. Revisar todos los intentos, incluidos fallos,
sin limitarse a los favorables. **9. Informe científico y decisión E5.** Distinguir validez técnica, resultado
científico, reproducibilidad y límites; una diferencia negativa no es fallo técnico.
Emitir la recomendación de aceptación solo con la evidencia de E3/E4, sin aprobar
conformidad normativa ni interoperabilidad independiente.

## Exportación verificable fuera del workspace

El origen, la copia y la restauración locales siguen compartiendo el riesgo del workspace.
No se ha designado/montado un almacenamiento externo en esta entrega. El propietario
elige su almacenamiento personal o equipo receptor y el mecanismo de transferencia.
Procedimiento preparado con tar/sha256sum, sin servicio nuevo:

```bash
mkdir "$P01_EXPORT"
P01_BUNDLE="$P01_CAMPAIGN-evidence-checkpoint01.tar.gz"
tar -czf "$P01_EXPORT/$P01_BUNDLE" -C /workspace/shared/world-lab \
  "$P01_CAMPAIGN-restored" "$P01_CAMPAIGN-ops"
(cd "$P01_EXPORT"; sha256sum "$P01_BUNDLE" > "$P01_BUNDLE.sha256")
# Transferir bundle y checksum al almacenamiento EXTERNO elegido, sin sobrescrituras.
# En el receptor, con Node/FS compatibles y checkout de las herramientas:
sha256sum -c "$P01_BUNDLE.sha256"
mkdir P01-received-NEW
tar -xzf "$P01_BUNDLE" -C P01-received-NEW
node tools/evidence/verify.cjs "P01-received-NEW/$P01_CAMPAIGN-restored"
```

El checksum usa un nombre relativo, no exige la ruta Linux original. Comprobar checksum
y paquete después de recibir/descomprimir. La clave privada nunca forma parte del bundle.
No ubicar el tar dentro de OPS, para evitar archivarse a sí mismo. OPS debe estar cerrado
mientras se empaqueta. Conservar versiones/checkpoints separados; no sobrescribirlos ni
mezclar campañas. Se puede transferir un checkpoint parcial verificado antes de E4 largo;
identificarlo como parcial. Añadir E4/E5 a un bundle posterior nuevo si procede. Usar en
Windows un entorno compatible o adaptar checksum con Get-FileHash; no se probó Windows.

## Evidencia y condiciones de parada

[Estado y preservación](e3-operational-integration/readiness.json),
[comprobación de identidad](e3-operational-integration/identity.log.b64),
[ensayo](e3-operational-integration/result.json), [log](e3-operational-integration/integration.log.b64),
[observador](e3-operational-integration/observer.log.b64), [fuente del ensayo](e3-operational-integration/smoke-harness.cjs.b64),
[espera ensayada](e3-operational-integration/observer-wait.sh.b64).
Se usaron solo archivos smoke existentes: observador separado antes de que existiera la
fuente; START parcial; primer FINISH;32 FINISH; parada limpia; snapshot idempotente;
35 archivos restaurados idénticos; métrica coincidente; empaquetado, recepción y verificación.
La transferencia se ensayó entre directorios locales, **no** prueba durabilidad externa.
No se ejecutó controlador P01, preflight real, run, replay nuevo ni generación de mundos,
episodios o claves. No hubo defecto demostrado que exigiera modificar código.

HOLD ante identidad/runtime distinto, materiales ausentes/inválidos, falta de orden posterior,
fuente preexistente antes del primer arranque, muerte del observador, COPY_ERROR, conflicto
bloqueante o evidencia terminal incompleta. Conservar todo; no alterar la congelación,
recibos o resultados ni reiniciar P01 automáticamente. El estado científico no evaluable
se informa conforme a P01; E5 no declara conformidad canónica ni interoperabilidad.
**Detenerse aquí para la recepción de materiales y autorización específica del propietario.**
