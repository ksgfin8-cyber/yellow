# Obtención, integridad y recuperación — instrucciones sin ejecutar

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
