from pathlib import Path
import json,hashlib,tarfile,subprocess
repo=Path('/workspace/yellow');root=Path('/workspace/shared/world-lab');s=root/'p01-final-20261113-01';ops=Path(str(s)+'-ops');audit=Path(str(s)+'-audit-close');exports=Path(str(s)+'-exports');dest=repo/'docs/p01-e3-final'
sha=lambda b:hashlib.sha256(b).hexdigest()
verified=json.loads(Path('/tmp/p01-c1-read-only-verification/audit-result.json').read_text());assert verified['verdict']=='E3_COMPLETE' and verified['inputs_unchanged']
dest.mkdir()
originals=[(ops/'E3-operational-report.md','E3-operational-report.md'),(audit/'audit-report.md','E3-audit-report.md'),(audit/'E4-plan.md','E4-plan.md')]
original_entries=[]
for src,name in originals:
 b=src.read_bytes();(dest/name).write_bytes(b);assert (dest/name).read_bytes()==b
 original_entries.append({'repository_document':name,'historical_source':str(src),'package_member':str(src.relative_to(root)),'bytes':len(b),'sha256':sha(b),'preservation':'BYTE_IDENTICAL'})
archive=exports/'P01-E3-audited-evidence.tar.gz';hashvalue=sha(archive.read_bytes());assert hashvalue=='8a1df2ac58fa2069afa4de52368097d79859b59e4b784e99a72966fa5690b7c7'
with tarfile.open(archive,'r:gz') as tar:
 content=tar.extractfile('CONTENTS-SHA256.json').read();inventory=json.loads(content);members=tar.getmembers();assert len(members)==1684 and len({m.name for m in members})==1684
 for entry in inventory:
  m=tar.getmember(entry['file']);assert m.isfile();b=tar.extractfile(m).read();assert len(b)==entry['bytes'] and sha(b)==entry['sha256']
 for src,name in originals:assert tar.extractfile(str(src.relative_to(root))).read()==src.read_bytes()

def metadata(p):
 b=p.read_bytes();return {'historical_reference':str(p),'package_member':str(p.relative_to(root)),'bytes':len(b),'sha256':sha(b)}
references=[s/'campaign.json',s/'analysis.json',s/'execution.jsonl',s/'freeze.json',s/'authorization.json',s/'authorization.sig',s/'reviewer-public.pem']
references += [p for p in sorted(ops.iterdir()) if p.is_file()]
references += [audit/'audit-result.json',audit/'archived-replay-proof-audit.json',audit/'input-inventory-before.json',audit/'audit-report.md',audit/'E4-plan.md']
latest=sorted(Path(str(s)+'-evidence/indexes').glob('*.json'))[-1]; references.append(latest)
manifest={'format':'WL-P01-E3-DOCUMENTARY-EVIDENCE-1','authority':'OPERATIONAL_RECORD_NOT_NORMATIVE','campaign_id':s.name,'freeze_id':verified['freeze_id'],'publication_base':subprocess.check_output(['git','rev-parse','origin/main'],cwd=repo,text=True).strip(),'execution_checkout':'6fcc698681514a90e1dcd28a0f926967b2304884','status':{'E3':'E3_COMPLETE','E4':'NOT_EXECUTED','E5':'NOT_PERFORMED','external_backup':'EXTERNAL_BACKUP_PENDING','normative_conformity':'NOT_ESTABLISHED','independent_interoperability':'NOT_ESTABLISHED'},'verified_counts':verified,'preserved_original_documents':original_entries,'export':{'filename':archive.name,'historical_reference':str(archive),'bytes':archive.stat().st_size,'sha256':hashvalue,'members':len(members),'contents_manifest_sha256':sha(content),'member_checksums_verified_now':len(inventory),'external_receipt_verified':False,'public_download_url':None,'location_note':'Historical workspace path; package is outside Git. No public hosting or receiver confirmation asserted.'},'artifact_references':[metadata(p) for p in references],'experimental_source_files':json.loads((ops/'source-sha256-manifest.json').read_text()),'scope_note':'Only documentary metadata and intact original reports published. No episode archives, raw returns, copy objects, signed receipt or keys stored in this Git increment. Internal paths/relative links inside preserved originals describe the historical execution environment, not public URLs.'}
(dest/'E3-evidence-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
(dest/'README.md').write_text('''# P01 — Registro público del cierre operacional E3

C1 publica evidencia documental de la campaña `p01-final-20261113-01`; no ejecuta E4.
Base verificada: `9a5d8ec203afcae17ee040048c9c6d5187a9db0f` (main posterior al PR #40).
El checkout histórico de E3 fue `6fcc698681514a90e1dcd28a0f926967b2304884`.

## Navegación

- [Informe operacional original íntegro](E3-operational-report.md).
- [Auditoría original íntegra](E3-audit-report.md), cuyo nombre fuente es audit-report.md.
- [Plan E4 original íntegro, sin ejecutar](E4-plan.md).
- [Manifiesto de integridad y procedencia](E3-evidence-manifest.json).
- [Estado de cierre, resultados y verificación C1](E3-closure-status.md).
- [Obtención y recuperación del expediente](RECOVERY.md).

## Preservación documental y referencias históricas

Los tres documentos originales se copiaron **byte a byte**: no se resumieron, corrigieron ni sustituyeron. Sus tamaños, SHA-256, fuentes y miembros del paquete se registran en el manifiesto. Este README y los documentos de estado/recuperación son contexto posterior separado.

**Todas las rutas `/workspace/...`, variables de rutas y enlaces relativos a evidencia dentro de esos originales son referencias históricas del entorno de ejecución, no enlaces públicos de GitHub.** Conservar su sintaxis original no publica esos destinos. Para acceder a la evidencia es necesario obtener el paquete externo y seguir RECOVERY.md. Los enlaces de navegación de este README sí apuntan a archivos públicos del expediente documental.

| Referencia conservada en el informe original | Localización dentro del paquete externo |
|---|---|
| ../p01-final-20261113-01/campaign.json | p01-final-20261113-01/campaign.json |
| ../p01-final-20261113-01/execution.jsonl | p01-final-20261113-01/execution.jsonl |
| E3-operational-result.json | p01-final-20261113-01-ops/E3-operational-result.json |
| source-sha256-manifest.json | p01-final-20261113-01-ops/source-sha256-manifest.json |
| preflight.json | p01-final-20261113-01-ops/preflight.json |
| snapshot-terminal.json | p01-final-20261113-01-ops/snapshot-terminal.json |
| copy-verify.json | p01-final-20261113-01-ops/copy-verify.json |
| check-after.json | p01-final-20261113-01-ops/check-after.json |

Los logs, recibo firmado y material público de autorización permanecen en el paquete externo; en este PR solo se publica su identificación por hash. No hay claves privadas ni datos voluminosos de episodios en Git. Un SHA-256 detecta diferencias respecto de una referencia conservada; no sustituye autenticación de origen o verificación científica.

## Antecedentes preservados

[Protocolo P01](../F6-A-pilot-protocol.md), [F6-B](../F6-B-report.md), [preparación F6-E](../F6-E-preparation.md), [F6-F](../F6-F-report.md), [hoja operacional](../E3-operational-integration.md) y [decisiones](../ENGINEERING_DECISIONS.md) conservan sus cortes históricos. Sus estados NOT EXECUTED o pendientes describen aquellas entregas; este expediente registra posteriormente E3_COMPLETE, sin reescribirlos ni cerrar E4/E5 o puertas normativas.
''')
(dest/'E3-closure-status.md').write_text('''# C1 — Estado documental del cierre E3

**E3_COMPLETE**: cierre operacional comprobado. **E4 NOT_EXECUTED; E5 NOT_PERFORMED; EXTERNAL_BACKUP_PENDING.** No aceptación científica, conformidad normativa global o interoperabilidad independiente.

| Evidencia real reverificada para C1 | Resultado |
|---|---:|
| Episodios previstos / iniciados / terminados | 256 / 256 / 256 |
| Fallidos | 0 |
| Combinaciones / UUID de intento únicos | 256 / 256 |
| Replay COMPLETE_MATCH archivado y ligado a archivo/payload/log | 256 |
| Pasos registrados | 40.960 |
| Archivos fuente/copia idénticos | 519 |
| Objetos históricos verificados | 774 |
| Revisiones de índices / observaciones de watch | 256 / 257 |
| Marcas normales APPEND_ONLY_LOG_VERSION | 255 |
| Conflictos bloqueantes / ausencias / errores de preservación | 0 / 0 / 0 |
| Salida del controlador / observador | 0 / 0 |

Orden exacto: semillas 1001–1032, agentes wait/random/rule/frontier_memory_v1, repeticiones 1/2. Las 512 filas START_REQUEST/FINISH alternan sin duplicados ni omisiones. Los 256 retornos brutos coinciden con los 256 archivos de episodio y la procedencia; todos indican retorno normal y COMPLETED.

Freeze ID: `47155590f10358f6130a1f7eae261ec9ec1fc8035652c04dd23fcc9f92c63e7d`.
SHA-256 DER-SPKI aprobado: `918d051d30ea8b193e554928953836d3c15e86e910ef9f5a5d1323e90cf0866a`.
Expediente: `P01-E3-audited-evidence.tar.gz`, 36.085.889 bytes.
SHA-256: `8a1df2ac58fa2069afa4de52368097d79859b59e4b784e99a72966fa5690b7c7`.

## Verificación C1 y fuentes

Se repitieron únicamente lecturas: descompresión/codec tipado de los 256 pares raw/wlx; hashes de archivo/payload/fuentes; unicidad y orden de manifiesto/log/progreso; correspondencia de pruebas archivadas con las trayectorias; firma y pins mediante gate.authorize; cadena y 774 objetos de la copia mediante io.verify; comparación de 519 archivos y manifiesto previo; inventarios antes/después. Se verificó el tar existente y todos los miembros enumerados en CONTENTS-SHA256.json, sin reconstruir el paquete, extraerlo ni restaurar un experimento.

Comando ejecutado: `node /tmp/p01-c1-recheck.cjs` (script operacional de solo lectura conservado en este expediente como verification/C1-read-only-check.cjs; la ruta /tmp es histórica). Resultado: todas las aserciones aprobadas, E3_COMPLETE y bytes originales intactos. Utiliza conformance/wire.cjs, tools/evidence/io.cjs y gate.authorize; no importa ejecutores de episodios ni llama a verifyArtifact/replay. Su ejecución conserva informes nuevos fuera de las fuentes; no es un test canónico.

La publicación incluye el resultado estructurado de esa reverificación y el script de empaquetado documental como procedencia. La comparación de originales, el control de enlaces públicos, el escaneo de archivos del PR y `git diff --check` se ejecutan antes del commit. No se lanzaron suites que generan mundos ni el replay de E4.

## Incidencias y límites

No hay anomalía material nueva. Los EPERM del sandbox y el rechazo automático previo de autorización adjunta se resolvieron antes del único arranque E3. El log creciente conserva 255 versiones no bloqueantes; no deben presentarse como corrupciones.

Las 256 pruebas archivadas acreditan las comprobaciones del controlador original, no una segunda ejecución independiente de replay. E4 deberá restaurar, recalcular y reproducir según el plan original. No se concluye H+ ni aceptación E5 en C1.

El paquete sigue fuera de Git y sin recepción externa comprobada. Una carpeta hermana o un tar local no constituyen respaldo independiente. No se altera ENGINEERING_DECISIONS ni los informes históricos: la orden C1 autoriza este registro documental, no actualizar retrospectivamente estados generales.
''')
(dest/'RECOVERY.md').write_text('''# Obtención, integridad y recuperación — instrucciones sin ejecutar

Estado de transferencia: **EXTERNAL_BACKUP_PENDING**. El paquete no está alojado en Git ni existe aquí una URL pública de descarga acreditada. Solicitar al propietario el tar y su checksum entregados en el chat, o su copia externa verificada cuando exista.

Identidad: `P01-E3-audited-evidence.tar.gz` (36.085.889 bytes).
SHA-256 aprobado: `8a1df2ac58fa2069afa4de52368097d79859b59e4b784e99a72966fa5690b7c7`.
Ruta histórica del workspace: `/workspace/shared/world-lab/p01-final-20261113-01-exports/`; **no es una URL pública ni almacenamiento externo**. No reconstruir el paquete existente para cambiar nombres o contenido.

## Recepción futura en almacenamiento independiente

Guardar tar y .sha256 juntos, registrar fecha, ubicación lógica y operador; cotejar el checksum del tar tanto con este expediente como con el archivo recibido:

```bash
sha256sum P01-E3-audited-evidence.tar.gz
sha256sum -c P01-E3-audited-evidence.tar.gz.sha256
mkdir P01-E3-received-NEW
tar -tzf P01-E3-audited-evidence.tar.gz
tar -xzf P01-E3-audited-evidence.tar.gz -C P01-E3-received-NEW
```

Inspeccionar primero que la lista solo contenga archivos relativos seguros (sin rutas absolutas, '..' o enlaces). La extracción futura del contenedor no inicia E3 ni autoriza E4. Comprobar su inventario interno en el receptor:

```bash
python - <<'PYCODE'
from pathlib import Path
import json, hashlib
root = Path('P01-E3-received-NEW').resolve()
for item in json.loads((root / 'CONTENTS-SHA256.json').read_text()):
    target = root / item['file']
    assert not target.is_symlink() and root in target.resolve().parents
    data = target.read_bytes()
    assert len(data) == item['bytes']
    assert hashlib.sha256(data).hexdigest() == item['sha256']
print('Inventario recibido verificado')
PYCODE
```

Registrar SHA-256 en destino, fecha, ubicación lógica y resultado. Solo entonces se podrá afirmar EXTERNAL_BACKUP_VERIFIED. La verificación local previa no demuestra recepción ni recuperación en otro almacenamiento.

## Organización del paquete y restauración futura

- p01-final-20261113-01/: fuente E3 íntegra, incluidos 256 raw.gz y 256 wlx.gz, manifiesto y log.
- p01-final-20261113-01-evidence/: 256 índices y objetos históricos de preservación; no modificar.
- p01-final-20261113-01-ops/: informes y logs operacionales originales.
- p01-final-20261113-01-audit-close/: auditoría original y plan E4.
- p01-authorization/: solo materiales públicos de autorización; no concede otra ejecución.
- context/: snapshot de archivos científicos y documentales, no historial Git.

Usar un checkout limpio de la revisión de ejecución `6fcc698681514a90e1dcd28a0f926967b2304884`, con historial para git show de los commits congelados y runtime indicado en el plan. No modificar el recibo para adaptar sus rutas: describen el destino histórico firmado. El directorio receptor puede ser diferente.

La futura comprobación sin simulación `node tools/evidence/verify.cjs <paquete-recibido>/p01-final-20261113-01-evidence` verifica índices/objetos. La restauración `--restore <destino-NUEVO>`, el oráculo y el replay pertenecen al plan E4 pendiente de autorización; **no se ejecutan en C1**. [Plan E4 íntegro](E4-plan.md).

No invocar cli.cjs run, regenerar claves, repetir episodios, editar artefactos ni reemplazar resultados para superar una discrepancia. Conservar cualquier fallo y solicitar revisión del componente afectado.
''')
(dest/'verification').mkdir()
(dest/'verification/C1-read-only-result.json').write_bytes(Path('/tmp/p01-c1-read-only-verification/audit-result.json').read_bytes())
(dest/'verification/C1-read-only-check.cjs').write_bytes(Path('/tmp/p01-c1-recheck.cjs').read_bytes())
# Original checker points to operational roots and records historical assertions. For future use select a NEW output path before running; not a public API or evaluation command.
(dest/'verification/C1-documentation-build.py').write_bytes(Path('/tmp/p01-c1-docs.py').read_bytes())
checksums=[{'file':str(p.relative_to(dest)),'bytes':p.stat().st_size,'sha256':sha(p.read_bytes())} for p in sorted(dest.rglob('*')) if p.is_file()]
(dest/'PUBLICATION-SHA256.json').write_text(json.dumps(checksums,indent=2)+'\n')
print(json.dumps({'originals_preserved':original_entries,'export_sha256':hashvalue,'archive_members':len(members),'source_metadata_entries':len(manifest['experimental_source_files']),'publication_files':len(checksums)+1},indent=2))
