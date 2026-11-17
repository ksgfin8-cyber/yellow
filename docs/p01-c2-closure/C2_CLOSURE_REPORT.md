# WORLD-LAB P01 — Cierre formal C2 y primer ciclo

**C2 = VERIFIED_EXTERNAL_BACKUP**, en el alcance de la copia local Windows cuya recepción y SHA-256 comunicó el propietario. Las condiciones documentadas pendientes de liberación del primer ciclo P01 están satisfechas; **se emite el cierre dentro del alcance P01** para revisión mediante este PR, sin afirmar su integración anticipada.

Fecha de registro: 2026-11-17T13:02:49.583429-05:00 (America/Guayaquil). Base main verificada: `afe902f47adc1ffb4e3e2b51c49e8391f462f8db`, que incorpora E3/C1 (PR #41), E4 (PR #42) y E5 (PR #43). Rama documental: `dev/p01-c2-external-backup-closure`.

## 1. Evidencia de recepción y nivel de verificación

La fuente es la **confirmación expresa del propietario en el chat**, no acceso de Codex a su computadora. El propietario informó que descargó los cuatro archivos en Windows fuera del workspace y ejecutó PowerShell `Get-FileHash -Algorithm SHA256` con coincidencia de ambos paquetes. Salida comunicada:

```text
EXITO: E3 y E4 descargados y verificados correctamente
```

[Declaración conservada](OWNER_CONFIRMATION.md) y [registro estructurado](OWNER_RECEIPT.json). Se registra la fecha de comunicación; la ruta local exacta y hora de la ejecución no fueron proporcionadas. No se fabrican una captura de consola, una inspección remota ni una firma criptográfica del mensaje.

| Paquete original | Bytes de referencia verificados en origen | SHA-256 esperado y comunicado por el propietario |
|---|---:|---|
| P01-E3-audited-evidence.tar.gz | 36.085.889 | `8a1df2ac58fa2069afa4de52368097d79859b59e4b784e99a72966fa5690b7c7` |
| P01-E4-scientific-validation.tar.gz | 309.971 | `47083b27d5875126ac3086fe8887adfdc813567673dec2e904a4e91bcf29db91` |

Los dos archivos .sha256 también fueron descargados según el propietario. No se atribuye al propietario una medición de tamaño ni un hash independiente de esos .sha256 que no haya comunicado. Codex volvió a leer en origen los paquetes y sus checksums: tamaños/hashes históricos intactos, sin reconstrucción ni regeneración.

El hash E4 identifica el paquete de resultados E4; la recuperación completa usa también el paquete E3. La confirmación cubre ambos. Los hashes detectan alteración respecto de las referencias conservadas; no son por sí solos prueba de identidad civil del emisor o durabilidad perpetua.

## 2. Transferencia y recuperación conservadas

La vía GitHub Releases estuvo bloqueada por proxy (`curl: (56) CONNECT tunnel failed, response 403`). Se utilizó la alternativa expresamente autorizada: rama exclusiva `transfer/p01-c2-evidence-20261117`, con blobs Git ordinarios, sin LFS, sin merge a main y sin transformar los cuatro originales.
Commit de los archivos: `72f1640d0b9e90a5f430eccf675934c74a9dd977`; registro técnico posterior: `72b97e29e168eb46cc6cf62d881e82d4b04335c0`. La comprobación técnica previa descargó por HTTPS los cuatro archivos con HTTP 200 y hashes coincidentes; una clonación remota nueva también recuperó los bytes completos. Esas comprobaciones del emisor se distinguen de la recepción local que ahora confirma el propietario.

[Registro técnico publicado](https://github.com/ksgfin8-cyber/yellow/blob/72b97e29e168eb46cc6cf62d881e82d4b04335c0/TRANSFER-VERIFICATION.json). La rama de transferencia se verificó todavía presente en su tip publicado. **Se conserva hasta una decisión posterior expresa de retención**, al igual que los originales del workspace; esta orden no autoriza borrarlos. Los objetos Git pueden permanecer retenidos por el servidor incluso después de eliminar una rama; no se promete borrado irreversible.
Las rutas /workspace del manifiesto son referencias históricas del entorno, no URLs públicas ni evidencia de sincronización externa adicional.

## 3. Revisión de condiciones de cierre P01

Se revisaron directamente [E3](../p01-e3-final/README.md), [E4](../p01-e4/README.md), [E5](../p01-e5/FINAL_ACCEPTANCE_REPORT.md), sus estados/manifiestos y el protocolo preregistrado. No se ejecutó de nuevo ninguno de sus procesos.

| Condición documentada | Evidencia | Conclusión actual |
|---|---|---|
| Ejecución E3 válida | 256 episodios terminados, 0 fallidos, archivo y autorización preservados | Satisfecha; resultado E3 intacto |
| Integridad/restauración y reproducibilidad E4 | 519 archivos coincidentes, 774 objetos históricos, 256 replay restaurados MATCH; métricas concordantes | Satisfecha por evidencia E4 previamente ejecutada |
| Decisión de aceptación E5 | Informe E5 integrado por PR #43; aceptación técnica/científica acotada | Conservada; no se reescribe el dictamen histórico |
| Evidencia de recepción externa y SHA-256 | Confirmación actual del propietario sobre ambos paquetes en Windows | Satisfecha para la copia local recibida |
| Autorización para cierre documental | Orden expresa actual del propietario | Satisfecha; publicación de este cierre para revisión, sin merge automático |

La condición C2 que mantenía HOLD_C2 en E5 queda satisfecha con la evidencia autorizada de recepción. **Dictamen actual: cierre del primer ciclo P01 dentro de sus límites documentados.** El estado histórico CONDITIONAL_ACCEPTANCE de E5 y sus menciones HOLD_C2 describen su fecha de emisión y se conservan íntegros; este expediente posterior registra la resolución de aquella condición, no una edición retroactiva.
El PR de este cierre permanece sujeto a revisión e integración del propietario. No se afirma que este nuevo PR ya haya sido aprobado o fusionado.

## 4. Resultados y límites científicos conservados

E3 PASS, E4 PASS y la aceptación técnica/científica acotada de E5 no cambian. Resultado: **H_PLUS_SUPPORTED solo para las 32 semillas P01 1001–1032**, media D=11,125, suma D=356, 32 victorias y cero empates/derrotas; repeticiones como control de determinismo, no 64 muestras independientes. Rule y Wait siguen siendo controles descriptivos.
No se generaliza a una población aleatoria, otras configuraciones o una plataforma científica universal; no se atribuye causalmente el resultado a la memoria sola. La independencia del cálculo de métricas no convierte al replay del mismo motor en interoperabilidad independiente.
**F6-N = NOT_ESTABLISHED; conformidad normativa global = NOT_ESTABLISHED; interoperabilidad independiente = NOT_ESTABLISHED.** G00 y los pendientes históricos de norma permanecen; no se ejecutó ni se reclasificó el corpus.

## 5. Alcance del respaldo y OneDrive

La recepción verificada cubre **una copia local en la computadora Windows del propietario**, fuera del workspace, sustentada por su comunicación de los hashes calculados localmente. No garantiza redundancia geográfica, copia periódica, disponibilidad futura o restauración en todo sistema.
**Sincronización OneDrive = NOT_VERIFIED.** No hay evidencia independiente de carga, estado sincronizado o recepción en el servicio remoto. Incluso si la carpeta local estuviera bajo OneDrive, esto no acreditaría sincronización. No se declara copia remota OneDrive ni se usa como condición ficticiamente satisfecha.

## 6. Cambios y verificaciones de este cierre

Se añade este expediente posterior y se actualizan únicamente los estados vigentes relacionados con C2/liberación en ED-002, ED-005 y ED-006. Se conserva una [captura íntegra de ED antes del cierre](ENGINEERING_DECISIONS-before-C2-closure.md.b64). No cambian decisiones aprobadas, ED-001/003/004, protocolo, código, contratos, algoritmos, semillas, E3/E4/E5, datos experimentales, paquetes o rama de transferencia.
Verificaciones documentales: manifiestos SHA-256 de las fuentes publicadas; hashes/tamaños de originales; concordancia con la confirmación del propietario; existencia/tip de la rama de transferencia; revisión de condiciones E5; captura ED idéntica a la base; enlaces, alcance del diff y git diff --check. No se presenta esto como un nuevo replay, experimento o acceso a la máquina del propietario.

[Estado actual](CLOSURE_STATUS.json), [manifiesto y procedencia](CLOSURE_MANIFEST.json), [comprobaciones documentales](DOCUMENTARY_CHECKS.json), [decisiones vigentes](../ENGINEERING_DECISIONS.md). Cualquier cambio futuro de retención requiere una decisión posterior; este expediente no la anticipa.
