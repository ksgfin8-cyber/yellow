# E4 — Plan exacto pendiente de autorización

ESTADO: PLAN_ONLY / NOT_EXECUTED. Los bloques de este documento son instrucciones para una ejecución E4 posterior, no resultados. No invocar cli.cjs run, agentes, campaign controller ni nuevas decisiones de agente.

## 1. Recepción y precondiciones

Descargar el tar.gz y su .sha256 juntos. En el almacenamiento receptor ejecutar `sha256sum -c P01-E3-audited-evidence.tar.gz.sha256`, extraer a un directorio NUEVO, y comprobar cada entrada de CONTENTS-SHA256.json. El checksum del tar debe contrastarse con el publicado en el chat, no solo con un fichero junto al tar. La extracción/verificación local efectuada para preparar la entrega no acredita recepción externa.

Usar checkout limpio de ksgfin8-cyber/yellow en 6fcc698681514a90e1dcd28a0f926967b2304884, con historial disponible para git show de los commits congelados. El snapshot contextual del paquete no sustituye ese historial. Runtime requerido por el gate: Node v24.22.1 Linux x64, binario SHA-256 61ab14cd750fc24d5db53490ec5fc40f756e4b6e136b78cf7004265471d9bd1d. Verificar el contexto incluido contra el checkout. No instalar o actualizar dependencias científicas para sortear una discrepancia.

```bash
cd /workspace/yellow
test -z "${NODE_OPTIONS-}"
test -z "$(git status --porcelain)"
node tools/p01/evaluation/cli.cjs check docs/f6-e/P01-evaluation-freeze.json
export P01_EVIDENCE='/workspace/shared/world-lab/p01-final-20261113-01-evidence'
export P01_RESTORED='/workspace/shared/world-lab/p01-final-20261113-01-restored'
export P01_E4='/workspace/shared/world-lab/p01-final-20261113-01-e4'
test ! -e "$P01_RESTORED"
test ! -e "$P01_E4"
mkdir "$P01_E4"
node tools/evidence/verify.cjs "$P01_EVIDENCE" > "$P01_E4/copy-before.json"
```

Para evidencia recibida fuera del workspace, P01_EVIDENCE debe señalar la carpeta del paquete recibido; P01_RESTORED y P01_E4 son directorios NUEVOS separados. No cambiar los campos internos del recibo o del manifiesto para adaptar esas rutas: son hechos históricos de E3.

Exigir COPY_VERIFIED, source_complete=true, final_manifest_present=true y listas de errores vacías. Revalidar firma con los bytes originales y el pin público aprobado. La firma no autoriza otra ejecución E3.

## 2. Restauración y métricas independientes

```bash
node tools/evidence/verify.cjs "$P01_EVIDENCE" --restore "$P01_RESTORED" > "$P01_E4/restore.json"
node tools/evidence/verify.cjs "$P01_RESTORED" > "$P01_E4/restored-verify.json"
node tools/evidence/p01-independent-metrics.cjs "$P01_RESTORED" > "$P01_E4/independent-metrics.json"
```

Exigir restauración VERIFIED_COMPLETE_EVIDENCE y 519 archivos materializados en P01_RESTORED/files, idénticos al manifiesto SHA-256 y a los objetos de la copia. El oráculo recibe la raíz restaurada, no la subcarpeta files. Este oráculo recuenta la métrica principal y revisa repeticiones y mundos iniciales; utiliza pruebas archivadas, NO reejecuta replay. Por eso el paso siguiente es obligatorio y separado.

## 3. Replay de las 256 trayectorias restauradas

El siguiente bloque se ejecutará solo al autorizar E4. Reutiliza el perfil FINAL explícito; el archiveFor predeterminado solo permite semillas de desarrollo. verifyArtifact reproduce WORLD a partir de las acciones grabadas y comprueba records/eventos/estados y bytes WLS1 WORLD/FULL, además de la inicialización desde la semilla. No ejecuta agentes ni episodios E3, pero sí reproduce transiciones WORLD: no se ha llamado durante la auditoría.

```bash
node - <<'JS' > "$P01_E4/restored-replay.jsonl" 2> "$P01_E4/restored-replay.stderr"
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {archiveFor}=require('./tools/p01/archive.cjs');
const archive=archiveFor(require('./tools/p01/evaluation/profile.cjs'));
const root=path.join(process.env.P01_RESTORED,'files');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'campaign.json')));
let failed=0;
for(const row of manifest.entries){
 try{
  const artifact=archive.readArchive(path.join(root,row.file));
  const proof=archive.verifyArtifact(artifact);
  assert.equal(proof.status,'COMPLETE_MATCH');
  assert.equal(proof.replay,true);
  assert.deepEqual(proof,row.verification);
  console.log(JSON.stringify({seed:row.seed,agent:row.agent,repetition:row.repetition,status:'MATCH',proof}));
 }catch(error){failed++;console.log(JSON.stringify({seed:row.seed,agent:row.agent,repetition:row.repetition,status:'MISMATCH',error:String(error)}));}
}
assert.equal(manifest.entries.length,256);
console.log(JSON.stringify({total:manifest.entries.length,failed}));
if(failed)process.exitCode=1;
JS
```

Registrar el código de salida. Completar todos los contrastes legibles y conservar fallos; no repetir E3 ni sustituir episodios. Si una discrepancia impide procesar un archivo, marcar E4 no aceptable o parcial sin rellenar datos. No usar un hash igual como sustituto de igualdad estructural y bytes.

## 4. Contrastes científicos y secundarios

Trabajar exclusivamente con los archivos restaurados y conservar la independencia del recuento: no importar tools/p01/metrics.cjs para calcular la métrica independiente.

- Recontar C por episodio desde los RecordedEvent source=action/type=RESOURCE_CONSUMED; comprobar unicidad de las posiciones consumidas porque regeneración=0.
- Exigir igualdad íntegra de artifact.data entre repeticiones, excluyendo procedencia operacional, UUID y tiempos del host; comprobar igualdad estructural de initial_state y bytes WLS1 iniciales entre los ocho episodios de cada semilla.
- Contrastar las 32 parejas, controles descriptivos, escenarios excluidos y distribución del oráculo con analysis.json restaurado, campo por campo. H+ iff suma D>0, con D=C(frontier_memory_v1)-C(random). Comparar también media, mediana, min/max y victorias/empates/derrotas. No basta comparar final_hypothesis.
- Verificar por recuento directo los descriptores preregistrados de cada trayectoria: cobertura (posiciones distintas incluido inicio), acciones rechazadas agrupadas por validity/reason, pasos/duración, terminación, recursos iniciales y consumos por ubicación; contrastarlos con las 256 filas originales de analysis.json. El oráculo existente no entrega todos estos descriptores; este contraste independiente sigue pendiente de ejecutar/documentar en E4, sin reciclar measure() como cálculo independiente.
- Conservar 32 escenarios intentados, todos los intentos y fallos. Solo excluir de la pareja un fallo inicial común de los ocho casos según el protocolo; no excluir por desempeño, cero recursos, timeout o error del agente. Cualquier fallo no permitido mantiene NOT_EVALUABLE hasta revisión, sin cambiar la batería.
- Usar una pareja por semilla, no 64 observaciones independientes: la segunda repetición verifica determinismo. Wait/Rule son controles secundarios, no hipótesis principales seleccionadas después.
- Separar resultado técnico de resultado científico. H+ no sostenida es válida. La inferencia se limita a esta batería finita/configuración; no se estiman p-values/intervalos poblacionales ni se atribuye causalidad a la memoria sola. No comparar velocidad CPU como benchmark de agentes con estos tiempos operacionales.

## 5. Evidencia de cierre E4 que deberá producirse

Guardar resultados de restauración, comprobaciones de hashes, métricas independientes, comparaciones exhaustivas por campo, 256 filas de replay y diagnósticos/códigos de salida, inventario SHA-256 de los resultados E4 y verificación posterior de que la fuente E3/copia permanecen intactas. Guardar scripts efectivamente usados y su identidad, sin modificar código congelado. Preparar un segundo paquete nuevo para E4, preservando el paquete E3 original.

Una discrepancia se registra con ruta/semilla/agente/repetición/campo/esperado/observado y alcance; no se corrigen resultados históricos. E4 requiere demostrar integridad, determinismo y métricas antes de formular un informe científico E5. Este plan no emite aceptación E5 ni conformidad/interoperabilidad global.
