# WORLD-LAB P01 — Informe operacional E3

Dictamen: **E3_COMPLETE**. Resultado técnico del controlador: **PASS**, código de salida **0**.
Esta entrega cierra E3; no ejecuta la verificación independiente E4 ni emite aceptación científica E5.

## Identidad y autorización

- Campaña: `p01-final-20261113-01`.
- Freeze ID: `47155590f10358f6130a1f7eae261ec9ec1fc8035652c04dd23fcc9f92c63e7d`.
- Huella aprobada DER-SPKI SHA-256: `918d051d30ea8b193e554928953836d3c15e86e910ef9f5a5d1323e90cf0866a`.
- Checkout: `6fcc698681514a90e1dcd28a0f926967b2304884`, limpio antes y después.
- Registro: `P01-E3-OWNER-START-APPROVAL-20261114-01`, complementado por autorización explícita del propietario en el chat.
- Inicio UTC: 2026-11-14T18:39:18.947Z; cierre UTC: 2026-11-14T19:45:22.940Z.
- Firma de preflight: `VALID`; episodios iniciados en ese preflight: `0`.
- Gate de identidad y runtime verificado antes y después. Los tres archivos públicos conservan sus bytes originales, incluidos los archivados por el controlador.

## Ejecución y preservación

| Comprobación | Resultado |
|---|---:|
| Episodios previstos | 256 |
| Iniciados | 256 |
| Terminados | 256 |
| Fallidos | 0 |
| Pruebas de archivo/replay COMPLETE_MATCH archivadas por el controlador | 256 |
| Archivos raw.gz | 256 |
| Archivos wlx.gz | 256 |
| Archivos origen/copia idénticos byte a byte | 519 |
| Objetos históricos verificados en la copia | 774 |
| Revisiones del índice | 256 |
| Conflictos bloqueantes | 0 |
| Archivos ausentes | 0 |
| Intentos sin FINISH | 0 |

Se verificaron exactamente 512 filas START_REQUEST/FINISH, sin otros eventos ni solicitudes duplicadas: semillas 1001–1032, agentes wait/random/rule/frontier_memory_v1, repeticiones 1/2, en ese orden.
Las pruebas de replay indicadas son las ejecutadas por el controlador congelado; no constituyen una verificación E4 independiente.
No hubo reintentos de campaña ni episodios sustituidos. No se modificó código, configuración, contrato o identidad experimental.

El observador se inició y confirmó en espera antes del único arranque del controlador. Se comprobó su identidad de proceso antes de SIGTERM y terminó con código 0.
Snapshot terminal y verify finalizaron con código 0: `SOURCE_COMPLETE`, `COPY_VERIFIED`, sin errores de preservación.
Las 255 entradas APPEND_ONLY_LOG_VERSION son versiones históricas no bloqueantes del log creciente; no son discrepancias de contenido.

## Rutas y evidencia

- Fuente experimental intacta: `/workspace/shared/world-lab/p01-final-20261113-01`.
- Copia incremental: `/workspace/shared/world-lab/p01-final-20261113-01-evidence`.
- Registro operacional: `/workspace/shared/world-lab/p01-final-20261113-01-ops`.
- Manifiesto de campaña: [campaign.json](../p01-final-20261113-01/campaign.json).
- Log completo: [execution.jsonl](../p01-final-20261113-01/execution.jsonl).
- Resultado estructurado: [E3-operational-result.json](E3-operational-result.json).
- Hashes de todos los archivos fuente: [source-sha256-manifest.json](source-sha256-manifest.json).
- Preflight: [preflight.json](preflight.json).
- Snapshot terminal: [snapshot-terminal.json](snapshot-terminal.json).
- Verificación de copia: [copy-verify.json](copy-verify.json).
- Gate posterior: [check-after.json](check-after.json).
- Controlador: controller.stdout, controller.stderr (vacío), controller.exit, controller.pid.
- Observador: watch.jsonl, watch.stderr, watch.exit, watch.pid, watch-process-at-stop.txt.
- Autorizaciones: start-approval.txt, owner-start-order.txt, owner-explicit-chat-approval.txt. El recibo firmado no fue alterado.
- Scripts operacionales externos conservados en este directorio; no forman parte del código científico congelado.

## Incidencias y límites

Antes de E3, el sandbox impidió spawnSync git con EPERM durante check; se preservaron sandbox-attempt-check.json/stderr. La comprobación pasó al habilitar el permiso de ejecución necesario, sin cambios al gate. Esa incidencia no inició episodios.
La revisión automática había rechazado iniciar E3 con la autorización solo adjunta; el propietario la confirmó explícitamente en el chat antes del único arranque efectivo. No hubo otro intento experimental.

La fuente y la copia permanecen dentro del mismo workspace. No se ha realizado exportación externa porque no hay un destino externo designado. COPY_VERIFIED acredita integridad local, no durabilidad fuera del workspace.
E4 y E5 permanecen pendientes. Este resultado no declara victoria científica, conformidad normativa global ni interoperabilidad independiente.
