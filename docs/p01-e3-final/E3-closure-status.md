# C1 — Estado documental del cierre E3

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
