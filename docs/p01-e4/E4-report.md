# WORLD-LAB P01 — Verificación científica E4

**E4 PASS / VERIFIED en el alcance P01. H_PLUS_SUPPORTED en la batería finita preregistrada.**
**C2 HOLD_EXTERNAL_BACKUP_PENDING / EXTERNAL_BACKUP_PENDING. E5 NOT_PERFORMED.**
La autorización expresa del propietario permite E4 antes de resolver el respaldo externo; no declara C2 completado ni exime la preservación posterior.

## Identidad y procedimiento efectivamente ejecutado

Campaña `p01-final-20261113-01`; Freeze ID `47155590f10358f6130a1f7eae261ec9ec1fc8035652c04dd23fcc9f92c63e7d`.
Checkout de ejecución limpio: `6fcc698681514a90e1dcd28a0f926967b2304884`, exactamente el exigido por el plan. Runtime Node v24.22.1/Linux x64, verificado mediante gate antes y después; binario SHA-256 `61ab14cd750fc24d5db53490ec5fc40f756e4b6e136b78cf7004265471d9bd1d`.
Plan publicado: docs/p01-e3-final/E4-plan.md, conservado byte a byte durante la ejecución (SHA-256 `0e278f2159c71c8037bc7111f50088cbc107b80bd6a7173eb4d5226967d8017f`).
Inicio: 2026-11-14T19:45:25.625352-05:00; cierre operacional: 2026-11-14T20:23:18.100990-05:00 (America/Guayaquil).
El cierre operacional precede a la redacción y publicación de este informe.

Se usaron destinos nuevos y exclusivos, fuera del repositorio: p01-final-20261113-01-restored y p01-final-20261113-01-e4, bajo /workspace/shared/world-lab. Son **rutas históricas locales**, no enlaces públicos ni respaldo externo. No hubo ejecución de agentes, nuevos episodios, reintentos E3, cambios de semillas, métricas, exclusiones, contratos, expectativas o fuentes científicas.

## Integridad y restauración

- Se reverificaron los 256 pares raw/wlx, campos tipados, procedencia, firma y recibo, manifiesto, log y orden exacto de las 256 combinaciones. Solo lectura antes de restaurar.
- El tar E3 original conserva SHA-256 `8a1df2ac58fa2069afa4de52368097d79859b59e4b784e99a72966fa5690b7c7`; todos los miembros enumerados por su inventario interno se verificaron sin regenerar el paquete.
- Copia incremental: COPY_VERIFIED / SOURCE_COMPLETE, 774 objetos históricos y 256 índices; 255 versiones normales APPEND_ONLY_LOG_VERSION y cero conflictos bloqueantes.
- Restauración nueva: VERIFIED_COMPLETE_EVIDENCE; **519 archivos idénticos byte a byte** a la fuente E3 y al manifiesto SHA-256. Fuente E3, copia, OPS, auditoría y exportación conservaron el inventario íntegro antes/después.
- Gate y verificación de la copia original y restaurada al terminar: todos con salida 0 y sin errores. Repositorio limpio durante E4. Los cambios de publicación posteriores son únicamente documentales.

## Reproducción y determinismo

**256/256 replay restaurados MATCH, 0 MISMATCH**, con nuevas pruebas COMPLETE_MATCH idénticas a las archivadas. No se reutilizó el rótulo E3 como sustituto de ejecutar el replay.
Se verificaron 40.960 transiciones registradas y **41.216 estados** (incluido el inicial por episodio), con **82.432 comparaciones de bytes WLS1 WORLD/FULL** entre trayectoria y reproducción, además de comparaciones estructurales de registros/eventos/estados/contexto y terminación mediante el verificador existente.
Las 128 parejas de repeticiones son idénticas en todo artifact.data; se excluyen exclusivamente UUID, tiempos y procedencia operacional de esa igualdad. Los 32 mundos iniciales coinciden estructuralmente y por bytes WLS1 FULL entre los ocho episodios de cada semilla; cada replay también comprobó su correspondencia con el mundo inicial derivado de la semilla. Los bytes WORLD se contrastaron en cada estado contra su reproducción.
Las 256 combinaciones semilla/agente/repetición se preservan sin duplicados ni omisiones. Ningún escenario fue excluido. Fallos operacionales, de agente, inicialización, replay o descriptores: **0**.

## Independencia de las métricas y contrastes

Se ejecutó tools/evidence/p01-independent-metrics.cjs sobre la raíz restaurada: EVALUABLE, 32 pares elegibles, errores vacíos. Este oráculo no importa tools/p01/metrics.cjs y cuenta los RecordedEvent source=action/type=RESOURCE_CONSUMED; no usa analysis.json como fuente de la métrica.
Un script operacional separado recuenta directamente desde las trayectorias todos los descriptores preregistrados: consumos por ubicación, unicidad con regeneración=0, cobertura, acciones rechazadas por validity/reason, pasos/duración, recursos iniciales y terminación. Sus **256 filas coinciden íntegramente** con analysis.json. Recalcula también las 32 diferencias/distribución/controles y las contrasta campo por campo con el oráculo y el agregado archivado.
En otro proceso se llamó al measure existente del controlador sobre los datos restaurados: sus 256 filas también coinciden. Este último cálculo es corroboración del cálculo original, no se presenta como implementación independiente.

## Resultado principal preregistrado

C = consumos de recursos; D(seed) = C(FrontierMemory-v1) − C(RandomAgent).
Se usa una observación por semilla después de verificar sus dos repeticiones; **n=32, no 64**. La segunda repetición no aumenta el tamaño de la muestra.

| Estadístico | Resultado |
|---|---:|
| Suma D | 356 |
| Media D | 11.125 |
| Mediana D | 11 |
| Mínimo D / máximo D | 5 / 20 |
| Victorias / empates / derrotas | 32 / 0 / 0 |
| Escenarios intentados / elegibles / excluidos | 32 / 32 / 0 |
| FrontierMemory: suma C / media C | 463 / 14.46875 |
| Random: suma C / media C | 107 / 3.34375 |

**Dictamen científico E4:** H+ sostenida en esta batería/configuración porque la suma de diferencias =356>0 y la media =11,125>0, con evidencia técnica y métricas concordantes. Esta condición es la preregistrada; no se introdujeron umbrales ni métricas después de observar resultados.

## Tabla completa y controles descriptivos

| Semilla | FrontierMemory | Random | D | Rule | Wait |
|---|---:|---:|---:|---:|---:|
| 1001 | 19 | 1 | 18 | 0 | 0 |
| 1002 | 18 | 8 | 10 | 0 | 0 |
| 1003 | 14 | 1 | 13 | 0 | 0 |
| 1004 | 9 | 3 | 6 | 0 | 0 |
| 1005 | 7 | 2 | 5 | 1 | 0 |
| 1006 | 14 | 3 | 11 | 1 | 0 |
| 1007 | 14 | 2 | 12 | 0 | 0 |
| 1008 | 16 | 0 | 16 | 0 | 0 |
| 1009 | 11 | 4 | 7 | 0 | 0 |
| 1010 | 9 | 4 | 5 | 0 | 0 |
| 1011 | 16 | 5 | 11 | 0 | 0 |
| 1012 | 15 | 2 | 13 | 0 | 0 |
| 1013 | 16 | 3 | 13 | 0 | 0 |
| 1014 | 15 | 5 | 10 | 1 | 0 |
| 1015 | 12 | 0 | 12 | 0 | 0 |
| 1016 | 18 | 3 | 15 | 0 | 0 |
| 1017 | 23 | 4 | 19 | 0 | 0 |
| 1018 | 13 | 3 | 10 | 0 | 0 |
| 1019 | 15 | 4 | 11 | 1 | 0 |
| 1020 | 8 | 2 | 6 | 2 | 0 |
| 1021 | 13 | 7 | 6 | 0 | 0 |
| 1022 | 19 | 4 | 15 | 1 | 0 |
| 1023 | 22 | 2 | 20 | 0 | 0 |
| 1024 | 17 | 6 | 11 | 0 | 0 |
| 1025 | 12 | 3 | 9 | 0 | 0 |
| 1026 | 18 | 3 | 15 | 0 | 0 |
| 1027 | 13 | 5 | 8 | 1 | 0 |
| 1028 | 8 | 2 | 6 | 0 | 0 |
| 1029 | 14 | 4 | 10 | 0 | 0 |
| 1030 | 15 | 2 | 13 | 0 | 0 |
| 1031 | 18 | 6 | 12 | 2 | 0 |
| 1032 | 12 | 4 | 8 | 1 | 0 |

Rule: suma 11, media 0.34375; Wait: suma 0, media 0.0. Son controles secundarios descriptivos, sin hipótesis confirmatorias nuevas ni selección de otra comparación principal. Las métricas completas por episodio están en los JSON adjuntos y la tabla se conserva también en CSV.

## Límites y anomalías

No se detectó discrepancia material. No se corrigió ni omitió evidencia original. Los 12 comandos del protocolo ejecutado terminaron con salida 0; sus stderr están vacíos. No fue necesario repetir operaciones para ocultar fallos.

La independencia corresponde al recuento y contraste de métricas y al uso de archivos restaurados; el replay reutiliza el mismo motor y validadores aprobados. No demuestra interoperabilidad con una implementación independiente ni constituye revisión por otro equipo.
El resultado se limita a estas 32 semillas consecutivas y a P01: no son una muestra IID de una población global. No se estimaron p-values o intervalos inferenciales. No atribuye causalmente el efecto a la memoria sola (la política combina memoria y planificación), ni demuestra entrenamiento, eficacia general, hazards o multiagente. Los tiempos del host no se usan como benchmark entre algoritmos.
C2 permanece HOLD_EXTERNAL_BACKUP_PENDING. La restauración y el nuevo paquete E4 son locales al mismo workspace; no prueban durabilidad externa. E5 y cualquier conformidad normativa global continúan fuera del alcance.

## Comandos, resultados e identificación de evidencia

[Protocolo ejecutado y scripts](verification/README.md), [registro de comandos](verification/commands.jsonl), [integridad/restauración](integrity-results.json), [métricas independientes completas](independent-metrics.json), [descriptores y repeticiones](independent-descriptors.json), [recálculo del controlador](controller-recount.json), [256 resultados de replay](replay-results.json), [mundos iniciales/WLS1](initial-world-WLS1-comparison.json), [CSV pareado](paired-results.csv) y [manifiesto de integridad](E4-evidence-manifest.json).
Las salidas completas originales y los inventarios antes/después permanecen en el expediente externo identificado por hashes. Ninguna referencia histórica /workspace o /tmp se presenta como enlace público. La publicación no sobrescribe el plan ni los informes históricos E3.
