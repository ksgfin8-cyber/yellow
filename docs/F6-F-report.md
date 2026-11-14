# WORLD-LAB — F6-F: conservación y oráculo independiente

**F6-F PASS / recomendación GO para revisión de este incremento. E3 no autorizado ni ejecutado.**
Base `d107eaed709cfdd7be964b43c1bc9d697076a2e5`; rama `dev/f6-f-evidence-oracle`.
Identidad P01 conservada: `47155590f10358f6130a1f7eae261ec9ec1fc8035652c04dd23fcc9f92c63e7d`.
Commit de código/pruebas F6-F: `9c5ee8cbc37cf1048ab4905e80b0534e3312f383`.
Solo se añaden4 módulos en tools/evidence,2 suites F6-F y este informe/evidencia.
No se alteran archivos anteriores, código científico, manifiestos, candidatos ni smoke.
[95 bindings comprobados antes del cambio](f6-f/protected-bindings.json).
Los tests se llaman f6-f, fuera del patrón f6-e fijado por la congelación.

## Instrumento y contrato operacional

- [preserve.cjs](../tools/evidence/preserve.cjs): snapshot/watch, lectura de START_REQUEST/FINISH,
  archivos cerrados y evidencia de fallos, sin escribir en la campaña ni administrar sus procesos.
- [verify.cjs](../tools/evidence/verify.cjs): hashes/longitudes, cadena de índices, recuperación
  a un directorio nuevo y comparación de materialización con el índice.
- [p01-independent-metrics.cjs](../tools/evidence/p01-independent-metrics.cjs): conteo propio,
  emparejamiento y distribución; no importa measure/compareCampaign ni su módulo.
- [io.cjs](../tools/evidence/io.cjs): rutas seguras, lectura delimitada/estable y publicación
  atómica sin sobrescritura compartidas por las dos utilidades.

Formato WL-EVIDENCE-COPY-1: `objects/<sha256>.bin` conserva los bytes originales;
`indexes/<revision>.<sha256>.json` conserva índices inmutables encadenados. Cada índice
mapea nombres relativos a versiones, hashes, longitudes, intentos/FINISH, START pendientes,
ausencias, errores y conflictos. Las rutas absolutas observadas son contexto, no requisitos
para restaurar. No hay una ruta Linux de origen que deba existir durante recuperación.

Se abre la fuente solo para lectura. Se rechazan rutas absolutas/traversal en referencias,
symlinks y tipos no regulares. En Linux se ancla la lectura a un descriptor de directorio;
se comparan inode/tamaño/mtime/ctime antes/después. Se leen como máximo tamaño inicial+1
bytes, con límite64MiB por archivo y2 intentos por defecto (configurables1–5 intentos).
Un archivo cambiante no se confirma estable. La publicación usa temporal+fsync+hardlink
exclusivo+verificación de bytes; datos e índices existentes nunca se sustituyen.

Un cambio de contenido con el mismo identificador conserva ambas versiones y registra
conflicto. Los prefijos crecientes de execution.jsonl se registran explícitamente como
APPEND_ONLY_LOG_VERSION no bloqueante; un cambio no append es conflictivo. La corrupción
de un blob destino se detecta, se mantiene y se retiene la entrada válida en conflicts/;
no se repara silenciosamente. Una copia dañada no se presenta como verificada.

Estados independientes: COPY_VERIFIED verifica los bytes declarados; COPY_ERROR informa
fallos de preservación/integridad; SOURCE_INCOMPLETE identifica evidencia fuente incompleta;
final_manifest_present equivale a FINAL_MANIFEST_PRESENT y no valida ciencia. verify distingue
state (bytes almacenados) de preservation_state/preservation_errors (fallos observados al
copiar). Recuperación parcial válida devuelve VERIFIED_PARTIAL_EVIDENCE_NOT_SCIENTIFIC_ACCEPTANCE;
toda recuperación lleva scientific_acceptance=false. Sin manifiestos finales se conservan
los episodios cerrados disponibles. Un START solo no se convierte en episodio completado.

Se copia únicamente el perfil plano P01: log, manifiestos, archivos .wlx.gz/.raw.gz/.failure.json
asociados a FINISH, recibo/firma/freeze y claves **públicas** conocidas si existen. Archivos de
clave privada quedan fuera; se rechazan marcadores PEM privados y claves no públicas bajo
nombres públicos. No es un detector universal de secretos ocultos en datos binarios.
No se generó ni se necesitó ninguna clave o autorización real.

## Verificación ejecutada

| Verificación | Resultado |
|---|---|
| `node --test tests/f6-f-preservation.test.cjs tests/f6-f-metrics.test.cjs` |29PASS/0FAIL:16 conservación y13 oráculo/integración |
| `node tests/f6-b-metrics.test.cjs` |8PASS/0FAIL; fixtures de desarrollo, sin motor |
| CLI P01 `check` |READY_FOR_AUTHORIZATION, ID protegido idéntico, evaluation_executed=false |
| Snapshot+watch CLI (2 pasadas acotadas) |35 archivos verificados; segunda observación idempotente, sin objetos/índices duplicados |
| Integración progresiva F6F-M11 |3 índices,37 objetos; START interrumpido retenido;32 FINISH al final |
| Recuperación tras borrar fuente temporal y trasladar paquete |35 archivos iguales byte a byte; índices y versiones parciales preservados |
| Oráculo frente a agregado archivado y cálculo existente |32 conteos,4 pares, controles y distribución coinciden exactamente |
| Guarda independiente en proceso Node |Prohibió importar metrics.cjs, lanzar procesos, inicializar mundos, ejecutar agentes o replay; el oráculo siguió funcionando |

Los fixtures incluyen0/1/múltiples consumos, eventos ajenos, diferencias negativas,
repeticiones distintas, ausencia, inicialización común, duplicados, fallos de agente/
ejecución/replay y hashes inválidos. F6F-P15 recupera Map, BigInt, -0, subnormal y bytes
sin convertir el original en JSON plano. La prueba con analysis.json deliberadamente
incorrecto calcula45 desde las trayectorias y deja el agregado incorrecto intacto.

La primera ejecución del lanzador Node --test en sandbox terminó exit1 sin desglose de
subpruebas. Se conserva su salida, sin contarla como PASS. La ejecución autorizada con
subprocesos para la guarda independiente produjo los29 resultados explícitos. No se
cambió ningún test heredado. Durante desarrollo se corrigió la referencia al nombre de
índice al recargarlo; la lectura/reanudación/idempotencia queda cubierta por P01/P12.
Los reportes históricos y sus289BLOCKED permanecen intactos; no se ejecutó el corpus.
No se repitieron suites que generan mundos: esta orden prohíbe generarlos incluso para
la verificación. Las regresiones pertinentes son las8 puras y la invariancia byte a byte
más la comprobación de identidad. No se ejecutó el comando run de evaluación ni se
usaron datos/semillas finales como fixtures.

Evidencia: [29 pruebas](f6-f/acceptance-tests.log.b64), [regresiones](f6-f/regressions.log.b64),
[intento sandbox](f6-f/sandbox-attempt.log.b64), [integración](f6-f/integration.json),
[comparación de35 archivos](f6-f/byte-comparison.json), [identidad](f6-f/identity.log.b64).
Las salidas b64 se leen con `base64 --decode <archivo>`.

## Resultado independiente de desarrollo

| Seed | FrontierMemory | Random | Diferencia |
|---|---:|---:|---:|
|1|10|2|8|
|2|14|2|12|
|3|17|3|14|
|4|13|2|11|

Suma45, media11,25, mediana11,5, mínimo8, máximo14; victorias4, empates0, derrotas0.
Wait0 en todos; Rule0,0,0,1. Las dos repeticiones se comprueban en todo el payload y
no duplican observaciones. La comparación principal sigue siendo FrontierMemory−Random.
[Oráculo](f6-f/independent-metrics.json), [tres cálculos](f6-f/metric-comparison.json).
Es desarrollo: final_hypothesis=NOT_EVALUATED. Un efecto negativo técnicamente válido
se acepta en los fixtures; no se eligen semillas ni se afinan políticas por el resultado.

El oráculo lee bytes recuperados y usa unpack/validadores estructurales existentes.
Calcula eventos source=action/type=RESOURCE_CONSUMED mediante lógica propia; la distribución
se construye desde frecuencias de diferencias. analysis.json nunca es fuente del cálculo.
Después, un contraste separado invoca el cálculo existente y compara los agregados archivados.

La elegibilidad comprueba matriz P01, duplicados, identidades, igualdad de repeticiones,
iniciales/bytes WLS1 y pruebas de replay archivadas ligadas al SHA del archivo y payload.
Reporta falta de evidencia, ejecución/agente fallido o replay inválido como no evaluable;
solo excluye inicialización común sin reemplazarla. No vuelve a generar el mundo ni
re-ejecuta replay: verifica estructura y vinculación de los proofs existentes. No sustituye
el verificador/replay ni autentica por sí solo un productor que falsifique toda la evidencia.
El modo lector final queda disponible para datos futuros; no se utilizó ni ensayó con
semillas1001–1032 en esta entrega. No se declara compatibilidad general con otros protocolos.

## Uso reproducible

Todos los destinos de ejemplo son paquetes de copia; no son directorios de ejecución E3.
Desde el repositorio, seleccionar rutas nuevas o reusar el mismo paquete para la misma
fuente. No mezclar campañas; las etiquetas esperadas no constituyen aprobación criptográfica.

```bash
node tools/evidence/preserve.cjs snapshot docs/f6-e/smoke /tmp/P01-copy-package \
  --campaign P01-development-F6F \
  --identity 47155590f10358f6130a1f7eae261ec9ec1fc8035652c04dd23fcc9f92c63e7d
node tools/evidence/preserve.cjs watch docs/f6-e/smoke /tmp/P01-copy-package \
  --interval-ms 15000
# Ctrl+C/SIGTERM detiene solo la copia. Para un ensayo acotado: --passes 2.
node tools/evidence/verify.cjs /tmp/P01-copy-package
node tools/evidence/verify.cjs /tmp/P01-copy-package --restore /tmp/P01-restored-NEW
node tools/evidence/p01-independent-metrics.cjs /tmp/P01-restored-NEW
```

Para exportación, escoger un destino externo al workspace y usar --restore hacia un
paquete nuevo en ese almacenamiento, o transportar una copia restaurada verificada con
archivado habitual y su SHA256; volver a verificar tras descomprimir. Las utilidades no usan
Internet/Drive/servidor; la publicación Git del incremento es independiente de la copia. **Otro directorio en este mismo workspace no es copia durable
independiente.** No se promete sobrevivir a pérdida simultánea de origen y destino.

## Coste y límites

Medición del perfil smoke local, Node24.22.1/Linux, sin nuevas simulaciones:

| Operación | Wall s | CPU s | Máx RSS MiB |
|---|---:|---:|---:|
| snapshot | 0.211 | 0.178 | 37.8 |
| watch | 0.235 | 0.154 | 41.4 |
| restore | 0.209 | 0.169 | 37.5 |
| oracle | 9.322 | 11.033 | 334.6 |

[Recursos y comandos exactos](f6-f/resources.json). Los tiempos son observaciones de esta
sesión, con otras verificaciones concurrentes; no un benchmark general ni coste del agente.
La decodificación/validación domina el oráculo. Un snapshot completo guarda35 objetos;
la prueba progresiva guarda37 por las versiones del log. Mantener cada versión completa
del log cuesta espacio proporcional a sus observaciones acumuladas; frecuencia configurable
por defecto15s, mínimo100ms. Reutiliza blobs idénticos, sin volver a publicarlos.

Un único escritor por paquete; no se promete serialización entre observadores simultáneos.
La reanudación requiere la misma ruta fuente y mantiene etiquetas esperadas anteriores;
si se muda la fuente, crear otro paquete. Paquetes materializados por restore son de lectura,
no destino de watch. Lectura limitada64MiB/archivo, hardlinks y fsync probados en Linux;
otros sistemas de archivos/OS no se presentan como verificados. Un error de I/O se conserva
como COPY_ERROR; las copias ya publicadas permanecen, sin una transacción global de campaña.
Índices encadenados/SHA256 detectan alteración respecto del índice conservado, no autentican
historia contra quien reescriba tanto metadatos como objetos; puede conservarse el hash del
índice final como referencia externa. Evidencia y recibos nunca autorizan ejecutar agentes.

F6-N permanece independiente: [README](f5-d/README.md),
[decisiones abiertas](f5-d/UNRESOLVED_DECISIONS.md),
[recuperación de requisitos](f5-d/REQUIREMENTS_RECOVERY_REPORT.md).
DEC-G00 y fuentes históricas pendientes no quedan resueltos. No conformidad normativa,
interoperabilidad independiente, merge, despliegue ni E3. El incremento se detiene para
revisión de aceptación F6-F.
