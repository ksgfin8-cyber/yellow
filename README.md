# WORLD-LAB P01 — transferencia C2

Rama temporal EXCLUSIVA de transferencia, sin padres ni historial científico. No fusionar a main. Contiene los cuatro archivos originales E3/E4 y sus checksums, intactos, como blobs Git normales; no usa Git LFS.

C2 sigue HOLD_EXTERNAL_BACKUP_PENDING hasta que el propietario confirme recepción en almacenamiento independiente y los dos SHA-256. Que GitHub acepte los archivos no cierra C2. No se ejecutó E3/E4 ni se modificaron resultados científicos.

## Archivos

- [P01-E3-audited-evidence.tar.gz](https://raw.githubusercontent.com/ksgfin8-cyber/yellow/refs/heads/transfer/p01-c2-evidence-20261117/P01-E3-audited-evidence.tar.gz) — 36085889 bytes, SHA-256 `8a1df2ac58fa2069afa4de52368097d79859b59e4b784e99a72966fa5690b7c7`.
- [P01-E3-audited-evidence.tar.gz.sha256](https://raw.githubusercontent.com/ksgfin8-cyber/yellow/refs/heads/transfer/p01-c2-evidence-20261117/P01-E3-audited-evidence.tar.gz.sha256) — 97 bytes, SHA-256 `da7bbb55d4aaea5eb7f8de641781a28d78012e3212a9a983ce649a41e7a7e6c1`.
- [P01-E4-scientific-validation.tar.gz](https://raw.githubusercontent.com/ksgfin8-cyber/yellow/refs/heads/transfer/p01-c2-evidence-20261117/P01-E4-scientific-validation.tar.gz) — 309971 bytes, SHA-256 `47083b27d5875126ac3086fe8887adfdc813567673dec2e904a4e91bcf29db91`.
- [P01-E4-scientific-validation.tar.gz.sha256](https://raw.githubusercontent.com/ksgfin8-cyber/yellow/refs/heads/transfer/p01-c2-evidence-20261117/P01-E4-scientific-validation.tar.gz.sha256) — 102 bytes, SHA-256 `53451288e8dac7eb58334c1117649308eaef704e7bb30cab3121bee5c3bfdd7b`.

## Recuperación Windows PowerShell

Descargar por enlace directo guardando como archivo, sin abrir y volver a guardar como texto. Los scripts download-and-verify.ps1 y TRANSFER-MANIFEST.json contienen URLs, nombres, tamaños y hashes originales.

Alternativa si el navegador no permite raw: `git clone --depth 1 --single-branch --branch transfer/p01-c2-evidence-20261117 https://github.com/ksgfin8-cyber/yellow.git P01-C2-received`, entrar en esa carpeta y ejecutar `powershell -ExecutionPolicy Bypass -File .\download-and-verify.ps1 -VerifyOnly`. El clone descarga blobs regulares, no punteros LFS. El script solo descarga/verifica estos cuatro archivos y no ejecuta simulaciones.

Conservar el resultado Get-FileHash y confirmar al propietario lógico de este chat que ambos paquetes se recibieron fuera del workspace. No borrar la rama hasta esa confirmación. Los objetos Git pueden permanecer retenidos incluso después de eliminarla; no se promete borrado completo del servidor.

El paquete E3 incluye los datos y los materiales públicos previamente auditados; el paquete E4 es de resultados y requiere E3 para recuperar las entradas. No hay claves privadas. No se publicaron nuevas claves o credenciales.
