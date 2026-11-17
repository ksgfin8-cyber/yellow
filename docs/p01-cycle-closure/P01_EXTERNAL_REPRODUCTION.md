# P01 External Computational Reproduction Protocol

**Procedimiento para un intento futuro; no ejecutado como reproducción externa en esta tarea.** Organiza R1–R4 como niveles documentales de independencia, no norma nueva, certificación o madurez universal. No autoriza nuevos episodios ni reapertura P01. Un tercero debe disponer de permiso aplicable y registrar lo que realmente ejecute.

## 1. Qué se puede afirmar antes de empezar

- **R1 — Verificación de artefactos:** tamaño, SHA-256, estructura, procedencia e inventario. Hay comprobaciones del emisor y recepción Windows con hashes **comunicada por el propietario**; no hay inspección independiente de esa computadora. La nueva auditoría Codex volvió a descargar cuatro archivos HTTP200 y comparó bytes/hashes: evidencia de disponibilidad desde ese cliente, no de cálculo externo.
- **R2 — Reproducción computacional:** mismos datos/código para repetir cálculos y replay. E4 aporta ejecución histórica interna sobre archivos restaurados; **R2 por un laboratorio ajeno NOT_ESTABLISHED**. Los pasos de este protocolo fuera de aquel entorno están NOT_TESTED.
- **R3 — Replicación experimental:** nuevo estudio comparable, con diferencias de protocolo registradas. **NOT_ESTABLISHED y fuera del permiso de esta entrega**; no contiene comandos de lanzamiento de episodios.
- **R4 — Interoperabilidad independiente:** implementación distinta de contratos y contraste entre motores. **NOT_ESTABLISHED**, condicionado además a autoridad contractual completa. No es una etiqueta que otorgue replay del mismo motor.

La [matriz CL02/03/08/09/19/28](P01_EVIDENCE_MATRIX.md) y A §6 precisan evidencia y referencias conceptuales M1–M3. No atribuir badges ACM, cumplimiento FAIR o participación institucional.

## 2. Identidades, derechos y artefactos

Experimento `p01-final-20261113-01`; Freeze ID `47155590f10358f6130a1f7eae261ec9ec1fc8035652c04dd23fcc9f92c63e7d`.

| Identidad | Revisión/valor |
|---|---|
| Protocolo P01 | docs/F6-A-pilot-protocol.md; SHA-256 `74491ffdf9dbbafa260e53cc21dbb63424e0785d930653e11301d911d119146c` |
| Commit original del protocolo | `0ae7b8e90c5abf26044cdcfb8641f050134bcc82` |
| Baseline físico requerido por provenance | `59bd859bf102be546f3dfb3bb0200fde0b90233b` |
| Código congelado de preparación | `a2c989b67ee447cdeb4733b07f5f6b5887c27ed6` |
| Checkout exacto utilizado E3/E4 | `6fcc698681514a90e1dcd28a0f926967b2304884` |
| Scripts/resultados documentados E4 | `25fec76804571f6d7f6356c3baad2aa96b3b01c7` |
| Registro de cierre actual de referencia | main `5cdceeedb08b5e8a4f00d284cce499a459aa8c06` |
| Commit inmutable de los cuatro archivos | `72f1640d0b9e90a5f430eccf675934c74a9dd977` |
| Registro de transferencia | `72b97e29e168eb46cc6cf62d881e82d4b04335c0` |
| Runtime de referencia | Node v24.22.1, Linux x64; binario SHA-256 `61ab14cd750fc24d5db53490ec5fc40f756e4b6e136b78cf7004265471d9bd1d` |

**Derechos:** no se localizó licencia explícita LICENSE/COPYING/NOTICE en el árbol inspeccionado, ni se recibió aquí una autorización general para uso, modificación o redistribución por terceros. El acceso público no equivale a una licencia abierta. El propietario sí autorizó la transferencia documental de estos originales, no toda explotación derivada. Antes de una reutilización que requiera permisos no concedidos, solicitar aclaración al titular (G-01). Este documento no concede derechos ni emite asesoría legal. La recepción del propietario tampoco establece licencias de dependencias o del runtime para redistribuirlo.

| Archivo original | Bytes exactos | SHA-256 |
|---|---:|---|
| P01-E3-audited-evidence.tar.gz | 36.085.889 | `8a1df2ac58fa2069afa4de52368097d79859b59e4b784e99a72966fa5690b7c7` |
| P01-E3-audited-evidence.tar.gz.sha256 | 97 | `da7bbb55d4aaea5eb7f8de641781a28d78012e3212a9a983ce649a41e7a7e6c1` |
| P01-E4-scientific-validation.tar.gz | 309.971 | `47083b27d5875126ac3086fe8887adfdc813567673dec2e904a4e91bcf29db91` |
| P01-E4-scientific-validation.tar.gz.sha256 | 102 | `53451288e8dac7eb58334c1117649308eaef704e7bb30cab3121bee5c3bfdd7b` |

Descargas inmutables: [E3](https://raw.githubusercontent.com/ksgfin8-cyber/yellow/72f1640d0b9e90a5f430eccf675934c74a9dd977/P01-E3-audited-evidence.tar.gz), [checksum E3](https://raw.githubusercontent.com/ksgfin8-cyber/yellow/72f1640d0b9e90a5f430eccf675934c74a9dd977/P01-E3-audited-evidence.tar.gz.sha256), [E4](https://raw.githubusercontent.com/ksgfin8-cyber/yellow/72f1640d0b9e90a5f430eccf675934c74a9dd977/P01-E4-scientific-validation.tar.gz), [checksum E4](https://raw.githubusercontent.com/ksgfin8-cyber/yellow/72f1640d0b9e90a5f430eccf675934c74a9dd977/P01-E4-scientific-validation.tar.gz.sha256).

La rama `transfer/p01-c2-evidence-20261117` se conserva; no es una URL de Release ni garantía perpetua de alojamiento. La recuperación alternativa es un clone solo de esa rama y cotejo de hashes, sin LFS. No borrarla por iniciativa del reproductor. Git puede retener objetos tras borrar refs. [Registro técnico](https://github.com/ksgfin8-cyber/yellow/blob/72b97e29e168eb46cc6cf62d881e82d4b04335c0/TRANSFER-VERIFICATION.json).

**Datos originales:** paquetes/archivos publicados por hash, inmutables. **Restaurados:** copias materializadas desde índices/objetos, sin afirmar nueva procedencia física. **Derivados:** métricas, logs o adaptadores del intento externo; se guardan en destino nuevo con sus propios hashes. El tar E4 es de resultados, no sustituye las entradas E3. La carpeta context del E3 es snapshot de archivos, no historial Git ni distribución del binario Node.

## 3. Entorno y condiciones de parada

Para R1: cliente HTTPS/Git y SHA-256; PowerShell en Windows permite recepción. Para extracción y el perfil de cálculo de referencia: Linux x64, Python3, Git con historial de los commits identificados y Node v24.22.1; no hay npm install, paquetes de aplicación, claves privadas o servidor que iniciar. La validación exacta del gate exige además el binario Node identificado. **No se ha publicado/validado aquí un instalador que garantice obtener ese mismo binario** (G-02).

Los tar contienen 173.870.512 bytes de payload E3 y 2.142.653 E4, además de los ficheros comprimidos descargados; hacen falta espacio adicional para restauración y resultados. Esto no es un mínimo total de disco/RAM certificado. Los 512MiB fueron heap de los workers de episodios, no presupuesto garantizado del replay/oráculo. Si falta un recurso, registrar BLOCKED; no acortar datos ni cambiar heap/horizonte científico silenciosamente.

Cada destino debe ser NUEVO. No sustituir paquetes con una compresión regenerada. Un checksum distinto es FAIL de integridad, no permiso para «corregir» el esperado. No ejecutar evaluación CLI `run`, smoke que genere mundos/episodios o agentes. `verifyArtifact` sí reconstruye el mundo inicial y reproduce transiciones desde acciones grabadas para comprobarlas; no llama a agent.step ni crea un estudio nuevo.

Todos los bloques siguientes son **instrucciones no ejecutadas aquí como sesión externa completa**. Para cada bloque `python`, guardar el texto en un archivo nuevo de la carpeta de trabajo (p.ej. validate-containers.py, compare-restored.py, adapt-paths.py y check-replay.py) y ejecutar `python3 nombre-del-archivo.py` en la sesión con las variables exportadas; no guardarlos en el checkout científico. Reutilizan herramientas comprobadas históricamente en S21; la parametrización, extracción y adaptación de helpers son procedimientos derivados cuya ejecución externa sigue NOT_TESTED. El lector debe revisar código recibido y registrar versiones antes de correrlo.

## 4. R1: recepción Windows o Linux

### 4.1. Windows PowerShell: transferencia y hashes, sin cálculo científico

Crear carpeta nueva y descargar bytes directamente; no pasar gzip por Get-Content/Set-Content ni conversión de texto:

```powershell
$ErrorActionPreference = 'Stop'
$Dest = Join-Path $HOME 'P01-received-NEW'
if (Test-Path -LiteralPath $Dest) { throw 'El destino debe ser nuevo' }
New-Item -ItemType Directory -Path $Dest | Out-Null
Set-Location $Dest
$Base = 'https://raw.githubusercontent.com/ksgfin8-cyber/yellow/72f1640d0b9e90a5f430eccf675934c74a9dd977/'
$Expected = @(
 @{Name='P01-E3-audited-evidence.tar.gz';Bytes=36085889;Hash='8a1df2ac58fa2069afa4de52368097d79859b59e4b784e99a72966fa5690b7c7'},
 @{Name='P01-E3-audited-evidence.tar.gz.sha256';Bytes=97;Hash='da7bbb55d4aaea5eb7f8de641781a28d78012e3212a9a983ce649a41e7a7e6c1'},
 @{Name='P01-E4-scientific-validation.tar.gz';Bytes=309971;Hash='47083b27d5875126ac3086fe8887adfdc813567673dec2e904a4e91bcf29db91'},
 @{Name='P01-E4-scientific-validation.tar.gz.sha256';Bytes=102;Hash='53451288e8dac7eb58334c1117649308eaef704e7bb30cab3121bee5c3bfdd7b'}
)
foreach ($Entry in $Expected) {
 Invoke-WebRequest -UseBasicParsing -Uri ($Base+$Entry.Name) -OutFile $Entry.Name
 if ((Get-Item -LiteralPath $Entry.Name).Length -ne $Entry.Bytes) { throw 'Tamaño incorrecto' }
 if ((Get-FileHash -LiteralPath $Entry.Name -Algorithm SHA256).Hash -ne $Entry.Hash) { throw 'SHA-256 incorrecto' }
 Write-Output ('PASS '+$Entry.Name)
}
```

La salida R1 no prueba que se ejecutó R2. Para cálculo de referencia usar un Linux x64 compatible y verificar de nuevo los archivos al moverlos; WSL/Windows nativo no se presentan como equivalencia empírica demostrada. No es necesario entrar en conversaciones privadas: las referencias están publicadas.

### 4.2. Linux: rutas parametrizadas y descarga

Elegir un nombre aún inexistente. Mantener esta sesión para los pasos posteriores:

```bash
set -euo pipefail
set -C
export P01_HOME="$HOME/P01-reproduction-NEW"
test ! -e "$P01_HOME"
mkdir "$P01_HOME" "$P01_HOME/downloads"
export P01_CODE="$P01_HOME/code"
export P01_RECEIVED="$P01_HOME/received-e3"
export P01_E4_RECEIVED="$P01_HOME/received-e4"
export P01_RESTORED="$P01_HOME/restored"
export P01_E4="$P01_HOME/results"
export P01_BASE='https://raw.githubusercontent.com/ksgfin8-cyber/yellow/72f1640d0b9e90a5f430eccf675934c74a9dd977'
cd "$P01_HOME/downloads"
for name in P01-E3-audited-evidence.tar.gz P01-E3-audited-evidence.tar.gz.sha256 P01-E4-scientific-validation.tar.gz P01-E4-scientific-validation.tar.gz.sha256; do
 curl --fail --location --silent --show-error "$P01_BASE/$name" -o "$name"
done
sha256sum -c P01-E3-audited-evidence.tar.gz.sha256
sha256sum -c P01-E4-scientific-validation.tar.gz.sha256
```

Además de .sha256, los valores deben coincidir con los fijados en §2. El siguiente paso compara esos valores externos antes de confiar en el inventario interno; no basta que un atacante cambie tar y checksum juntos.

## 5. R1: validación segura antes de extraer

Este bloque usa únicamente biblioteca estándar Python y no importa motor. Fija hash/tamaño del contenedor; prohíbe duplicados, enlaces, rutas absolutas, `..`, barras Windows y miembros no regulares; valida todos los bytes listados antes de escribir en destinos nuevos. No usa extractall. Una excepción es FAIL de estructura/integridad; falta de disco/permiso es BLOCKED de entorno. Conservar el diagnóstico.

```python
import os, json, hashlib, tarfile
from pathlib import Path, PurePosixPath
home = Path(os.environ['P01_HOME'])
plans = [
 ('P01-E3-audited-evidence.tar.gz', 36085889,
  '8a1df2ac58fa2069afa4de52368097d79859b59e4b784e99a72966fa5690b7c7',
  'CONTENTS-SHA256.json', '', 'README.txt', Path(os.environ['P01_RECEIVED'])),
 ('P01-E4-scientific-validation.tar.gz', 309971,
  '47083b27d5875126ac3086fe8887adfdc813567673dec2e904a4e91bcf29db91',
  'p01-final-20261113-01-e4/E4-SHA256.json', 'p01-final-20261113-01-e4/', None,
  Path(os.environ['P01_E4_RECEIVED']))
]
for name, size, expected, invname, prefix, extra, dest in plans:
    archive = home / 'downloads' / name
    data = archive.read_bytes()
    assert len(data) == size and hashlib.sha256(data).hexdigest() == expected
    assert not dest.exists(), 'El destino debe ser nuevo'
    with tarfile.open(archive, 'r:gz') as tar:
        members = tar.getmembers()
        names = [m.name for m in members]
        assert len(names) == len(set(names))
        for m in members:
            q = PurePosixPath(m.name)
            assert m.isfile() and not q.is_absolute()
            assert '..' not in q.parts and chr(92) not in m.name and ':' not in m.name
        inventory = json.loads(tar.extractfile(invname).read())
        wanted = {prefix + item['file'] for item in inventory} | {invname}
        if extra is not None:
            wanted.add(extra)
        assert set(names) == wanted
        assert len(inventory) == len({item['file'] for item in inventory})
        for item in inventory:
            payload = tar.extractfile(prefix + item['file']).read()
            assert len(payload) == item['bytes']
            assert hashlib.sha256(payload).hexdigest() == item['sha256']
        dest.mkdir()
        root = dest.resolve()
        for m in members:
            target = root.joinpath(*PurePosixPath(m.name).parts)
            assert root in target.resolve().parents
            target.parent.mkdir(parents=True, exist_ok=True)
            with target.open('xb') as output:
                output.write(tar.extractfile(m).read())
    print('PASS contenedor e inventario:', name)
```

Ejecutarlo como script Python3 revisado, desde la sesión donde se exportaron variables. El propio inventario/README no se autoautentican: el SHA-256 externo del tar los liga a la referencia. La copia extraída del E3 incluye 1684 miembros y el E4 47; no eliminar versiones históricas para reducir tamaño. Comprobar también los hashes de fuentes frente al checkout al preparar R2.

## 6. Preparación del código y perfil de referencia

Solo después de aclarar los permisos de uso aplicables. Clone completo con historial, no snapshot context ni clone superficial que omita `git show` del baseline. Los registros publicados de aceptación se consultan en el commit de documentación, no se copian sobre el código histórico:

```bash
cd "$P01_HOME"
git clone --no-checkout --single-branch --branch main https://github.com/ksgfin8-cyber/yellow.git "$P01_CODE"
git -C "$P01_CODE" checkout --detach 6fcc698681514a90e1dcd28a0f926967b2304884
cd "$P01_CODE"
test -z "$(git status --porcelain)"
git cat-file -e 59bd859bf102be546f3dfb3bb0200fde0b90233b^{commit}
git cat-file -e 25fec76804571f6d7f6356c3baad2aa96b3b01c7^{commit}
test -z "${NODE_OPTIONS-}"
node --version
python3 --version
git --version
test ! -e "$P01_E4"
mkdir "$P01_E4"
node tools/p01/evaluation/cli.cjs check docs/f6-e/P01-evaluation-freeze.json > "$P01_E4/freeze-check.json" 2> "$P01_E4/freeze-check.stderr"
```

`check` no ejecuta la campaña. Su rótulo `READY_FOR_AUTHORIZATION` y el booleano congelado `evaluation_executed=false` describen el manifiesto, no revocan los hechos E3. No ejecutar `preflight` o `run` para reproducir cálculos archivados.
Si el runtime no coincide, el gate puede fallar por scope/runtime: registrar FAIL de identidad del perfil y BLOCKED de R2 de referencia, no «resultado científico refutado». No editar el manifiesto o el hash del binario para que pase. El autor del intento puede estudiar compatibilidad como otro alcance, registrando diferencias y permiso; este documento no lo presenta como verificado.

Los 30s/512MiB eran límites de episodio, no parámetros para truncar la reproducción. El checkout debe permanecer limpio; outputs fuera de P01_CODE. No hay servidor HTTP que iniciar.

### 6.1. Firma del recibo histórico sin reproducir rutas absolutas

`gate.verifyReceipt` usa realpath del padre del destino histórico; ese padre puede no existir en otro laboratorio. No crear directorios históricos ni editar el recibo para superarlo. La firma puede contrastarse sobre los bytes originales con crypto estándar, conservando la restricción histórica como dato. Este bloque no es una nueva API normativa ni firma/autorización de otra campaña:

```bash
node - <<'JS' > "$P01_E4/historical-receipt.json"
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const dir=path.join(process.env.P01_RECEIVED,'p01-authorization');
const bytes=fs.readFileSync(path.join(dir,'authorization.json'));
const key=crypto.createPublicKey(fs.readFileSync(path.join(dir,'owner-ed25519-public.pem')));
assert.equal(key.asymmetricKeyType,'ed25519');
assert.equal(crypto.createHash('sha256').update(key.export({format:'der',type:'spki'})).digest('hex'),
 '918d051d30ea8b193e554928953836d3c15e86e910ef9f5a5d1323e90cf0866a');
assert(crypto.verify(null,Buffer.concat([Buffer.from('WL-P01-AUTHORIZATION-1\n'),bytes]),key,
 fs.readFileSync(path.join(dir,'authorization.sig'))));
const r=JSON.parse(bytes);
assert.equal(r.freeze_id,'47155590f10358f6130a1f7eae261ec9ec1fc8035652c04dd23fcc9f92c63e7d');
assert.equal(r.campaign_id,'p01-final-20261113-01');
assert.equal(r.decision,'AUTHORIZE_P01_FINAL_EVALUATION');
assert.equal(r.output_directory,'/workspace/shared/world-lab/p01-final-20261113-01');
console.log(JSON.stringify({signature:'VALID',historical_campaign:r.campaign_id,new_execution_authorized:false}));
JS
```

La confianza en el pin procede del registro del propietario conservado; no se deduce de la clave recibida. El bloque es derivado del contrato criptográfico leído y permanece NOT_TESTED en un laboratorio externo. No contiene ni requiere clave privada. No reemplaza un futuro análisis de autenticidad si cambia la fuente o el pin.

## 7. R2: restauración y métricas desde entradas recuperadas

Utilizar herramientas existentes. La entrada es la raíz del paquete de evidencia; no una carpeta con solo wlx ni la subcarpeta files de la restauración:

```bash
export P01_PACKAGE="$P01_RECEIVED/p01-final-20261113-01-evidence"
cd "$P01_CODE"
node tools/evidence/verify.cjs "$P01_PACKAGE" > "$P01_E4/copy-before.json"
node tools/evidence/verify.cjs "$P01_PACKAGE" --restore "$P01_RESTORED" > "$P01_E4/restore.json"
node tools/evidence/verify.cjs "$P01_RESTORED" > "$P01_E4/restored-verify.json"
node tools/evidence/p01-independent-metrics.cjs "$P01_RESTORED" > "$P01_E4/independent-metrics.json"
```

Exigir `state=COPY_VERIFIED`, `preservation_state=COPY_VERIFIED`, errores vacíos, `source_complete=true`; restauración `VERIFIED_COMPLETE_EVIDENCE` y `restored_files=519`. Un exit0 de verify no basta por sí solo para aceptar completitud o ciencia. Ningún artefacto inicial con `scientific_acceptance=false` es un fallo: expresa separación de garantías.

Cotejar bytes restaurados contra el manifiesto E3 y originales extraídos, sin normalizar Map/BigInt a JSON plano:

```python
import os, json, hashlib
from pathlib import Path
received = Path(os.environ['P01_RECEIVED'])
restored = Path(os.environ['P01_RESTORED']) / 'files'
ops = received / 'p01-final-20261113-01-ops'
source = received / 'p01-final-20261113-01'
inventory = json.loads((ops / 'source-sha256-manifest.json').read_text())
assert len(inventory) == 519
assert {p.name for p in restored.iterdir()} == {item['file'] for item in inventory}
for item in inventory:
    data = (restored / item['file']).read_bytes()
    assert len(data) == item['bytes']
    assert hashlib.sha256(data).hexdigest() == item['sha256']
    assert data == (source / item['file']).read_bytes()
print('PASS 519 archivos restaurados idénticos')
```

El oráculo cuenta la métrica principal y verifica repeticiones/iniciales usando pruebas archivadas; **no reejecuta replay**. Contrastar su estado y todos los agregados, no solo el signo final:

```bash
node - <<'JS' > "$P01_E4/aggregate-comparison.json"
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {canonical}=require('./tools/p01/codec.cjs');
const original=JSON.parse(fs.readFileSync(path.join(process.env.P01_RESTORED,'files','analysis.json')));
const actual=JSON.parse(fs.readFileSync(path.join(process.env.P01_E4,'independent-metrics.json')));
assert.equal(actual.status,'EVALUABLE');assert.equal(actual.errors.length,0);
assert.equal(actual.eligible_pairs,32);assert.equal(actual.observed_attempts,256);
for(const field of ['pairs','descriptive_controls','distribution','excluded_scenarios'])
 assert.equal(canonical(actual[field]),canonical(original[field]),field);
assert.equal(actual.distribution.sum,356);assert.equal(actual.distribution.mean,11.125);
assert.equal(actual.distribution.wins,32);assert.equal(actual.final_hypothesis,original.final_hypothesis);
console.log(JSON.stringify({status:'PASS',compared:'all_pairs_controls_distribution_exclusions'}));
JS
```

### 7.1. Descriptores completos y recálculo separado del controlador

El oráculo no entrega toda la cobertura/rechazos/contexto. Los helpers publicados en E4 sí lo hicieron, pero tienen requires absolutos. Recuperar sus bytes del commit documental y producir **copias derivadas fuera del checkout**, sustituyendo solo los requires identificados. Guardar original, adaptación y diff; una sustitución inesperada es FAIL de procedimiento, no permiso para modificar más código. La adaptación es nueva instrucción documental, NOT_TESTED externamente, no una afirmación de portabilidad ya demostrada.

```bash
export P01_DOCS='25fec76804571f6d7f6356c3baad2aa96b3b01c7'
git show "$P01_DOCS:docs/p01-e4/verification/p01-e4-independent-descriptors.cjs" > "$P01_E4/descriptors-original.cjs"
git show "$P01_DOCS:docs/p01-e4/verification/p01-e4-controller-recount.cjs" > "$P01_E4/controller-original.cjs"
```

```python
import os, hashlib
from pathlib import Path
out = Path(os.environ['P01_E4'])
for original, derived, modules in [
 ('descriptors-original.cjs', 'descriptors-portable.cjs', ['codec']),
 ('controller-original.cjs', 'controller-portable.cjs', ['codec', 'metrics'])
]:
    text = (out / original).read_text()
    for module in modules:
        old = "require('/workspace/yellow/tools/p01/" + module + ".cjs')"
        new = "require(require('node:path').join(process.env.P01_CODE,'tools/p01/" + module + ".cjs'))"
        assert text.count(old) == 1
        text = text.replace(old, new)
    with (out / derived).open('x') as target:
        target.write(text)
    print(original, derived, hashlib.sha256((out / derived).read_bytes()).hexdigest())
```

```bash
cd "$P01_CODE"
diff -u "$P01_E4/descriptors-original.cjs" "$P01_E4/descriptors-portable.cjs" > "$P01_E4/descriptors-path.diff" || test "$?" -eq 1
diff -u "$P01_E4/controller-original.cjs" "$P01_E4/controller-portable.cjs" > "$P01_E4/controller-path.diff" || test "$?" -eq 1
node "$P01_E4/descriptors-portable.cjs" > "$P01_E4/descriptors.log"
node "$P01_E4/controller-portable.cjs" > "$P01_E4/controller.log"
```

Exigir las 256 filas concordantes, errors=[] y 128 parejas idénticas. El primer helper recuenta desde datos sin importar metrics.cjs; el segundo sí llama al measure original como contraste separado. No llamarlos dos oráculos independientes del motor. Revisión de las copias adaptadas y hashes obligatoria antes de ejecución por el tercero; no se instalan en producción.

## 8. R2: replay real de las 256 trayectorias

Recuperar el bloque histórico exacto y ejecutarlo **por stdin desde P01_CODE**. Un `node archivo.cjs` desde la carpeta de resultados resolvería sus requires relativos respecto a otra ubicación: no es equivalente. Este es el motivo del stdin.

```bash
cd "$P01_CODE"
git show "$P01_DOCS:docs/p01-e4/verification/p01-e4-restored-replay.cjs" > "$P01_E4/replay-original.cjs"
node < "$P01_E4/replay-original.cjs" > "$P01_E4/restored-replay.jsonl" 2> "$P01_E4/restored-replay.stderr"
```

Registrar exit code de cada comando en la plantilla; si el shell se detiene, conservar todas las salidas sin rellenar los faltantes. El bloque reusa `archiveFor(evaluation/profile)` y `verifyArtifact`: valida archivo/contexto, reconstruye inicial desde semilla, reproduce acciones WITH_AGENT y contrasta todos los registros/eventos/estados, bytes WORLD/FULL y prueba archivada. No `run_experiment`, no decisiones nuevas del agente.

Exigir **256 filas MATCH**, 0 MISMATCH y cierre `{total:256,failed:0}`, además de cobertura exacta y 161 estados por trayectoria. Comprobar el resultado y la igualdad de iniciales por semilla:

```python
import os, json, hashlib
from pathlib import Path
out = Path(os.environ['P01_E4'])
rows = [json.loads(line) for line in (out / 'restored-replay.jsonl').read_text().splitlines()]
cases = rows[:-1]
expected = [(seed, agent, repetition) for seed in range(1001,1033)
            for agent in ['wait','random','rule','frontier_memory_v1'] for repetition in [1,2]]
assert [(r['seed'],r['agent'],r['repetition']) for r in cases] == expected
assert rows[-1] == {'total':256,'failed':0}
assert all(r['status']=='MATCH' and r['proof']['states_verified']==161 for r in cases)
for seed in range(1001,1033):
    group = [r for r in cases if r['seed']==seed]
    assert len(group)==8
    assert all(r['proof']['initial_full_hex']==group[0]['proof']['initial_full_hex'] for r in group)
print('PASS 256 replay y 32 grupos iniciales; estados:', sum(r['proof']['states_verified'] for r in cases))
```

Sin tolerancias de float, redondeos ni hash-equality como sustituto de bytes/estructura. Para las métricas de P01 se esperan exactamente suma356, media11,125 y 32 victorias, pero igualar esos tres números sin cumplir todas las comparaciones no obtiene PASS de R2.

## 9. Cierre del intento y preservación

- Verificar de nuevo el inventario de fuente/paquetes y la copia preservada; comprobar `git status --porcelain` vacío en P01_CODE. No publicar resultados derivados como si fueran originales.
- Guardar comandos realmente ejecutados, stdout/stderr, versiones, adaptaciones/hashes y cada discrepancia con semilla/agente/repetición/campo/esperado/observado. Conservar también una ejecución parcial.
- Elaborar un manifiesto SHA-256 de resultados fuera del código. Conservarlo con los paquetes de entrada sin sobrescribirlos; no prometer que un hash solo garantiza alojamiento persistente.
- Antes de entregar a terceros, revisar que los logs no incluyan credenciales, datos personales o claves privadas. No se requiere ninguna clave privada para estos cálculos.
- Declarar R2 PASS solo si todas las etapas exigidas pasaron; si hay FAIL/BLOCKED, emitir esa conclusión con alcance. Una reproducción de mismo código no establece R4 ni cambia F6-N.

En esta tarea no se ejecutó ninguno de esos cálculos/extracciones: se validó la sintaxis de los ejemplos y las interfaces por lectura. Ni esa revisión ni la recepción del propietario equivalen a un ensayo externo completo.

## 10. Criterios por operación

**PASS**=predicados exigidos satisfechos; **FAIL**=condición evaluable contradicha; **BLOCKED**=no evaluable por dependencia identificada; **NOT_TESTED**=no ejecutada. Un estado posterior no reescribe un resultado anterior.

| Etapa | PASS requerido | FAIL | BLOCKED / condición no probada |
|---|---|---|---|
| Acceso/descarga R1 | Cuatro archivos obtenidos y tamaños/hashes §2 exactos | Archivo obtenido con hash/tamaño distinto | Red, permiso o archivo inaccesible; no es un fallo científico |
| Contenedor/inventario R1 | Miembros seguros, únicos, bytes/hashes internos exactos | Ruta/enlace prohibido, miembro o hash incorrecto | Herramienta/disco faltante; extracción parametrizada externa NOT_TESTED |
| Derechos y entorno | Permisos aplicables aclarados, commits/historial y perfil disponibles | Identidad de archivo/versión exigida difiere | Derechos sin aclarar o runtime no obtenible; R2 referencia BLOCKED |
| Perfil congelado | Gate verifica fuentes/smoke/runtime sin editar expectativas | Identidad/scope/runtime diferente | Dependencia Git/binario inaccesible; no refutación científica por sí sola |
| Recibo histórico | Firma Ed25519 y pin/alcance histórico coinciden | Firma/pin/campos distintos | Fuentes faltantes; adaptación offline externa NOT_TESTED |
| Restauración | COPY_VERIFIED, errores vacíos, completa; 519 archivos idénticos | Objeto/cadena/materialización incorrectos | FS/Node/espacio; recuperación incompleta no recibe PASS global |
| Métrica/descriptores | 256 filas, 32 pares, distribución/control/exclusiones y descriptores exactos | Cualquier campo comparado diverge | Datos/helpers/contexto faltantes; no sustituir por la media sola |
| Repeticiones/iniciales | 128 parejas y 32 grupos de ocho idénticos; igualdad estructural/bytes | Alguna diferencia científica | Registro incompleto; hash solo no basta |
| Replay R2 | 256 MATCH, estructura/eventos/WLS1/proofs exactos y sin errores | Una discrepancia reproducible registrada | Runtime/datos/contexto insuficientes; resultados faltantes NOT_TESTED |
| Conclusión científica | Regla preregistrada aplicada tras integridad/reproducción válidas | Datos o cálculos no satisfacen una afirmación requerida | No calculable si hay dependencias; no cambiar selección o hipótesis |
| R3/R4 | Necesitan otro diseño/implementación y evidencia propia | No evaluados por este protocolo | NOT_ESTABLISHED; fuera de esta autorización |

## 11. Plantilla mínima de registro externo

Copiar a una salida nueva y completar únicamente con hechos observados. No requiere acceso al chat del propietario:

```text
P01 EXTERNAL ATTEMPT
Evaluator/laboratory (voluntary):
Date/time/timezone:
Permission or licence basis (reference, not secret):
OS/architecture/CPU; Python/Git/Node version and Node binary SHA-256:
Code checkout; engine commit; documentation/helper commits:
Freeze ID; package names, sizes and SHA-256 actually observed:
Input location; output location; independence from original workspace:
Helper adaptations and exact diff/hash (if any):
Commands actually executed (in order), exit codes, stdout/stderr locations:
V01 Download/hash: NOT_TESTED | PASS | FAIL | BLOCKED + evidence
V02 Archive safety/inventory: NOT_TESTED | PASS | FAIL | BLOCKED + evidence
V03 Rights/profile/code/signature: NOT_TESTED | PASS | FAIL | BLOCKED + evidence
V04 Restoration/519 files: NOT_TESTED | PASS | FAIL | BLOCKED + evidence
V05 Independent metric/descriptors/controller contrast: NOT_TESTED | PASS | FAIL | BLOCKED
V06 Repetitions/initial worlds: NOT_TESTED | PASS | FAIL | BLOCKED
V07 Fresh replay/256 cases: NOT_TESTED | PASS | FAIL | BLOCKED
Discrepancy: file/seed/agent/repetition/field/expected/observed; environment conditions
Unexecuted operations and exact missing dependencies:
Conclusion R1/R2 and scope; R3/R4 not established unless independently evidenced:
Scientific conclusion conditional on valid calculations; limits:
Result manifest hash, retention and public report location (if permission allows):
```

Las etiquetas de la plantilla no son resultados precargados. El receptor decide qué identidad declarar voluntariamente; no publicar detalles personales innecesarios. Un informe externo debe ser recibido, inspeccionado y contrastado antes de atribuir reproducción a ese laboratorio.

## 12. Brechas reales y acción mínima

| ID / operación | Dependencia/evidencia del bloqueo | Impacto | Acción mínima, sin autorización automática de implementación |
|---|---|---|---|
| G-01 uso/redistribución | CL20: no licencia explícita localizada | No afirmar reutilización abierta ni derechos de modificación | Decisión de licencia/permiso del titular; documentar alcance antes de reutilizar |
| G-02 perfil exacto | Binario Node fijado por SHA; no distribución validada para terceros | Gate de referencia puede quedar BLOCKED | Obtener de fuente autorizada un binario coincidente o registrar/autorizar estudio de compatibilidad separado; no cambiar el hash |
| G-03 helpers/rutas | S21 requires absolutos; gate realpath de destino histórico; CL21 | Scripts de expediente no son ejecutables portables sin contexto | Parámetros y adaptación externa declarada §6.1/7.1; revisión/ensayo por receptor; no parchear producción |
| G-04 historial Git | assertSources usa git show de 59bd859…; context no es repo | Snapshot o clone sin esos commits falla | Clone con historial y commits exactos; registrar pérdida/inaccesibilidad si ocurre |
| G-05 autenticación/persistencia de acceso | Rama temporal conservada, sin DOI ni garantía de hosting; permisos API/proxy limitados | Disponibilidad futura no garantizada | Mantener copias propias verificadas y refs; no eliminar la rama ni desplegar nuevo servicio aquí |
| G-06 reproducción ajena | C2 solo recepción/hash; ningún registro externo R2 completo | No atribuir reproducción científica a otro laboratorio | Intento autorizado y plantilla externa con resultados realmente ejecutados |
| G-07 autoridad R4 | G00/fuentes históricas y perfil de conformidad pendientes | R2 no permite certificar interoperabilidad o conformance | Continuar F6-N por fuentes concretas, sin inventar obligaciones |
| G-08 consulta metodológica | M1/M2/M3 oficiales bloqueados por proxy en esta tarea | No se afirma consulta literal íntegra ni acreditación | Lectura posterior de las fuentes por el revisor con acceso; no red nueva ni referencia institucional fabricada |

No toda brecha bloquea toda operación: G-01 afecta derechos de uso pertinentes, no el cálculo de un checksum público; G-02/G-03 afectan el perfil R2, no la recepción ya documentada. Ninguna carencia autoriza por sí sola reconstruir los originales, cambiar ciencia o montar infraestructura adicional.
