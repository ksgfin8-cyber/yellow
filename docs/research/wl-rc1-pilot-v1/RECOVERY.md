# Recuperación del expediente RC1 parcial

Originales locales preservados: rutas de EVIDENCE_MANIFEST.json; no son enlaces públicos ni respaldo externo. El paquete publicado es [WL-RC1-pilot-v1-evidence.tar.gz](WL-RC1-pilot-v1-evidence.tar.gz), **163975bytes**, SHA-256:

`04d6c0db808d73fdfca4e856df0a5f0b5d12d0f808ebd0c327d6c3f2718faa34`

[Archivo SHA-256](WL-RC1-pilot-v1-evidence.tar.gz.sha256). No se regeneraron ni repararon los resultados de medición. El tar es una nueva exportación de esos originales, con todas sus partes completas/parciales y prueba de autorización pública. Nunca contiene privada.

## Windows PowerShell: comprobar después de descargar

```powershell
$actual = (Get-FileHash '.\WL-RC1-pilot-v1-evidence.tar.gz' -Algorithm SHA256).Hash.ToLowerInvariant()
if ($actual -ne '04d6c0db808d73fdfca4e856df0a5f0b5d12d0f808ebd0c327d6c3f2718faa34') { throw 'SHA-256 no coincide' }
```

Crear un destino NUEVO fuera de repo/P01, extraer conservando nombres y bytes. No extraer sobre los originales. En un checkout que contenga este PR y fuentes/runtime del candidato:

```sh
node tools/research/wl-rc1/cli.cjs check docs/research/wl-rc1-cd/PILOT-CANDIDATE.json
node tools/research/wl-rc1/cli.cjs verify /NEW-recovery/experiment
node docs/research/wl-rc1-pilot-v1/analyze.cjs /NEW-recovery/experiment /NEW-recovery/reanalysis
python docs/research/wl-rc1-pilot-v1/verify_results.py /NEW-recovery/experiment /NEW-recovery/reanalysis
```

Estos comandos leen datos existentes y reconstruyen medidas/estadísticas, **no** ejecutan WORLD, agentes ni replay físico. El resultado esperado es VERIFIED/package_status PARTIAL/385samples, análisis PILOT_PARTIAL,2completos/1timeout/45sin ejecutar,144pares estructurales iguales y11flags diagnósticos. Comparar reanalysis con los archivos de analysis incluidos: la reproducción local actual produjo siete JSON/CSV byteidénticos.

experiment contiene el manifest original y sus35entradas, las tres trazas de workers, guardian y26testigos. ops conserva preflight/checks, orden de inicio, launcher de único arranque, stdout/stderr/exit, inventarios y análisis preliminar con nota de corrección. analysis contiene los derivados finales y samples.json/CSV completos. analysis-source conserva los consumidores, también publicados como código en este expediente. PILOT_REPORT.md del paquete describe el dictamen; su copia Git enlaza los derivados publicados.

La primera pasada interna de análisis comparaba385registros con sus baselines incluyendo43comparaciones triviales; la salida final separa342repeticiones no triviales. Se conservaron ambas y la nota; no se modificaron mediciones. Los archivos analysis son los derivados de referencia, no la primera salida de desarrollo de ops.

VERIFIED acredita conservación de bytes y formato, no campaña completa, autoría universal, conformidad o aceptación científica. Una exportación publicada o copia en el mismo workspace no equivale a recepción externa comprobada por el propietario. La evidencia de C2 de P01 no se transfiere a RC1. No borrar fuente, copia, ops, exportación o rama de transferencia por estas instrucciones. RC1-E sigue HOLD y no hay comando de reanudación/reintento autorizado.
