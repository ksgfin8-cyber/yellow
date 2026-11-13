# WORLD-LAB — F6-E E1/E2: puerta de evaluación P01

**E1: FREEZE_READY para revisión de la identidad nueva. E2: IMPLEMENTED / VERIFIED en preparación.**
**E3, E4 y E5: NOT EXECUTED. Evaluación1001–1032: cero episodios.**
La puerta de autorización sigue **HOLD / APPROVAL REQUIRED**. FREEZE_READY no es
OPERATIONAL_ACCEPTANCE ni autorización de ejecución. Fecha:2026-11-13 (America/Guayaquil).

## Identidad entregada para aprobación específica

| Artefacto | Identidad |
|---|---|
| Base main, PR#36 integrado | `d5478244465be235c4ee1e8368255e2bb383cb33` |
| Rama | `dev/f6-e-evaluation-preparation` |
| Código ejecutable y pruebas congelados | `a2c989b67ee447cdeb4733b07f5f6b5887c27ed6` |
| Motor conservado | `59bd859bf102be546f3dfb3bb0200fde0b90233b` |
| Identidad de evaluación que se solicita revisar | `47155590f10358f6130a1f7eae261ec9ec1fc8035652c04dd23fcc9f92c63e7d` |
| SHA256 candidato científico/operacional nuevo | `32804aeac7d26875132f80d449d7e5b061aa5099daf15c155501e7d23b68e988` |
| SHA256 candidato F6-B conservado | `f503593e47ec59daf607d10c169f99aacfac722612d94f63543b6c093fe6d65a` |
| Protocolo P01 conservado | `74491ffdf9dbbafa260e53cc21dbb63424e0785d930653e11301d911d119146c` |

[Manifiesto de evaluación](f6-e/P01-evaluation-freeze.json),
[candidato actualizado](f6-e/P01-freeze-candidate.json),
[procedimiento y formato de autorización](../tools/p01/evaluation/README.md).
El ID es SHA256 del cuerpo tipado canónico del manifiesto: liga candidato, fuentes,
pruebas, protocolo, runtime/binario Node y **bytes reales** de la evidencia smoke.
El commit documental posterior no modifica esas fuentes; no hay hash autorreferencial.
El candidato anterior permanece íntegro e identifica una revisión diferente.

## E1 — Auditoría de congelación

Se revisaron íntegramente P01, F6-B-report, candidato, tools/p01 y los cuatro agentes.
En la base aprobada, assertCandidate comprobó41 fuentes y8 archivos de pruebas contra
los blobs Git95e918f. Se leyeron los32 archivos .wlx.gz reales: longitud, SHA256,
checksum, tipos, config/seeds/procedencia, payload, orden y log de intentos. Se recalcularon
las métricas desde datos recuperados: igualdad exacta con analysis.json.
[Auditoría inicial ejecutada](f6-e/E1-original-audit.json).

No se presenta esa lectura como una nueva ejecución de replay32/32: E1 conserva los
proofs F6-B ligados a los hashes comprobados. La revisión nueva sí ejecutó posteriormente
32 replay completos durante su smoke, además de recuperación en un proceso frío.
La ausencia de cambios de políticas se respalda por el diff, pruebas y comparación de
datos de desarrollo; no constituye una prueba matemática de equivalencia universal.

| Componente | Resultado |
|---|---|
| FrontierMemory | Mapa solo desde Feedback, reset, N/E/S/W, recursos antes de fronteras, distancia/y/x, consumidos y WAIT según P01; código/versión/parámetros intactos |
| Random, Rule, Wait | Código, nombres, namespaces y parámetros intactos; no favorecidos retrospectivamente |
| Configuración y reglas P01 |160ticks,12x12, cuatro flags expuestos, densidades/costes/energía/regeneración iguales; inclusión, fallos y comparación principal sin cambios |
| Tiempo/PRNG/acciones/registro/replay/WLS1 | Fuentes de producción intactas; no se duplicó motor |
| Evidencia anterior | Candidato y archivos F6-B preservados; hashes de campaña, análisis y32 archivos comprobados, además del log |
| Documentación histórica | Encabezado PROPOSED/NOT IMPLEMENTED de P01 es el corte F6-A; no se reescribe para cambiar su hash. La nota de coste16 smoke no contaba las16 repeticiones; F6-B ya explicitaba32. La evaluación sigue siendo256. |
| Conformidad |289BLOCKED conservados; no conformidad canónica ni interoperabilidad independiente |

## Cambios congelados explícitos y nueva revisión

El análisis de dependencias encontró guards de desarrollo en archive.cjs y una batería
fija de cuatro semillas en metrics.cjs. Habilitar protocolo.cjs globalmente habría
abierto también la entrada de desarrollo. Se eligió un ejecutor separado con perfil
explícito y dos extensiones locales; no se reconstruyeron las capacidades F6-B.

| Archivo congelado modificado | Motivo / efecto |
|---|---|
| tools/p01/archive.cjs | archiveFor(profile) crea un cierre local; la exportación por defecto conserva el guard de desarrollo. Transporte, esquema, validación y replay son los mismos. Permite reutilizar archivo sin parchear globals. |
| tools/p01/metrics.cjs | Fase final explícita selecciona32 semillas y exige256 filas. measure, conteo, emparejamiento, exclusiones, comparaciones y distribución permanecen. Los rótulos H_PLUS_SUPPORTED/H_PLUS_NOT_SUPPORTED expresan únicamente el signo de la suma prefijada cuando la campaña sea técnicamente válida. |

protocol.cjs, provenance.cjs, freeze.cjs y controller.cjs originales no cambian. El
sourcePaths histórico no enumera subdirectorios: por eso el manifiesto de evaluación
liga por separado los6 módulos nuevos, su README y2 archivos de pruebas. El motor,
los agentes y el protocolo conservan sus hashes; cambia el candidato que contiene los
dos módulos operacionales. El gate exige coincidencia de configuración, algoritmos,
protocolo, definiciones, límites, semillas y demás fuentes con el candidato anterior.

[Diff completo E2](f6-e/E2-source.patch): cambios íntegros de los11 archivos de código,
pruebas y README contra main indicado, con contexto0 para conservar una copia legible
sin espacios de contexto al final de línea. Para inspección con contexto:
`git diff d547824...a2c989b -- tools/p01/archive.cjs tools/p01/metrics.cjs tools/p01/evaluation tests/f6-e.test.cjs tests/f6-e-gate.cjs`.
El diff total de la rama incluye también informes y evidencia, sin modificar expedientes
previos. [Rechazo esperado del candidato histórico](f6-e/historical-gate.log.b64):
`invalid or stale freeze candidate: sources`. No se sobrescribió para hacer pasar el check.

## E2 — Puerta y ejecución preparada

La CLI de evaluación admite prepare/check/preflight/run, sin overrides de seed,
agentes, configuración, horizonte ni presupuesto. El plan puro contiene256 filas:
1001–1032, wait/random/rule/frontier_memory_v1, repetición1 y2. Listarlo no genera mundos.
La CLI y el worker de desarrollo siguen rechazando las semillas finales.

Antes de ejecutar, padre y cada worker comprueban el manifiesto, archivos reales,
fuentes y pruebas en el commit identificado, configuración P01, versión/plataforma y
SHA256 del binario Node. Exigen un recibo de aprobación específico con firma Ed25519,
ligado al freeze_id, responsable/referencia, campaña y directorio de salida. Dos pins
se reciben expresamente del canal de aprobación del responsable: freeze_id y SHA256
de la clave pública DER SPKI. No se derivan de un Booleano o del propio recibo como
prueba de confianza. Una firma válida con una clave no aprobada no autoriza la campaña.
No se emitió un recibo real ni se registró una clave confiable durante esta preparación.
Las claves efímeras de tests se usan con un ID sintético y se eliminan.

El directorio firmado debe ser nuevo y estar fuera del repositorio. No hay reanudación,
reemplazo de semillas ni relanzamiento silencioso. Los30s por worker y512MiB de heap
V8 se conservan; heap no es RSS. El supervisor y el runtime existentes se reutilizan.
Cada retorno se conserva antes de validación/replay en un archivo operacional raw,
además del archivo P01 normal. Errores anteriores al retorno tienen diagnóstico separado;
no se fabrican ExperimentResult, eventos ni trayectorias. Fallos de almacenamiento o
cambio de autorización detienen nuevos lanzamientos y quedan pendientes de revisión.
Una caída abrupta del host puede dejar START sin FINISH: no se promete persistencia
transaccional ante pérdida del sistema ni recuperación automática de memoria perdida.

La confianza en la huella de la clave procede de la aprobación humana externa; el
programa no autentica por sí mismo una identidad civil ni defiende contra un operador
que reescribe el código o miente al aportar los pins. No hay secreto privado en Git.
La comparación calcula resultados futuros; E4 seguirá requiriendo recálculo desde
archivos recuperados y la revisión independiente de métricas. E5 no se decide aquí.

## Pruebas ejecutadas y evidencia

| Alcance / comando | Resultado |
|---|---|
| node --test tests/f6-e.test.cjs (incluido en ejecución conjunta final) |24PASS/0FAIL; firmas sintéticas, pins, guard antes de runtime, parámetros,256 filas puras, métricas manuales negativas, fallos simulados/archivo/rerun/storage |
| node --test cinco suites tests/f6-b-*.test.cjs |35PASS/0FAIL; junto a las24 anteriores:59PASS/0FAIL |
| node tests/f6-e-gate.cjs docs/f6-e/P01-evaluation-freeze.json |4 comprobaciones PASS: archivos reales; presupuesto/semillas/orden/repeticiones/runtime/Booleanos alterados y rehasheados; hashes falsos; falta de firma/pins |
| node tests/f6-b-smoke.cjs /tmp/p01-f6-e-development-smoke /tmp/f6-e-freeze-candidate.json |4 comprobaciones PASS del candidato nuevo, proofs32/32 y recuperación fría |
|28 suites anteriores, cada node tests/f*.test.cjs (excluyendo F6) |511PASS/0FAIL;6 aserciones de baseline histórico y505 actuales; no tests canónicos nuevos |
| Corpus cases-f5-b.json |114PASS/0FAIL/289BLOCKED, reporte byteidéntico al histórico |
| conformance/profile/validate.cjs |VALID_CANDIDATE_ARTIFACT / HOLD |
| tests/f1-a-legacy.cjs |13PASS/9FAIL conocidos: T06/07/08/20/22 formas retiradas; T12/13/14 helpers retirados; T16 initial_state inválido |
| git diff --check y comparación de archivos anteriores |sin errores; solo cuatro archivos previos autorizados cambian: archive,metrics,ED,EL |

Pruebas de firmas y rótulos finales usaron fixtures sintéticos sin motor, PRNG ni
generación de mundo; no son episodios finales. Las pruebas VM verifican que una
solicitud1001 sin aprobación no alcanza siquiera la importación del runtime.
La ruta real de256 episodios con aprobación todavía es UNTESTED por diseño: no se
simula su aceptación con una firma de pruebas sobre la identidad real.

Salidas exactas: [preparación59](f6-e/all-preparation.log.b64),
[regresiones por archivo](f6-e/regressions.log.b64), [corpus y legacy](f6-e/extended.log.b64),
[smoke](f6-e/smoke.log.b64), [candidato](f6-e/candidate-acceptance.log.b64),
[manifiesto](f6-e/proposal-preparation.log.b64), [puerta real](f6-e/gate-acceptance.log.b64).
Lectura b64: `base64 --decode docs/f6-e/all-preparation.log.b64`.
Una invocación auxiliar de auditoría tuvo un escape de salto de línea incorrecto en
node -e; se repitió por stdin, con éxito y sin cambiar fuentes ni repetir la campaña.
Ambas salidas están conservadas en el log del candidato.
El verificador documental F5-D, fijado a su alcance histórico, no se modifica ni se
usa como gate universal de fases posteriores. Sus expedientes/reportes permanecen.

## Desarrollo repetido y ausencia de contaminación anticipada

Tras commit limpioa2c989b, se ejecutó únicamente el nuevo smoke
con semillas1–4:32 episodios, dos repeticiones por cuatro agentes. Todos completaron
160ticks con161 estados verificados, replay y bytes WLS1; cero fallos y exclusiones.
Los32 payloads y el analysis.json completo son idénticos a F6-B: no se ajustó política
ni se seleccionó otra configuración después de observar desarrollo.
[Comparación ejecutada](f6-e/development-comparison.json),
[auditoría nueva](f6-e/E1-refreeze-audit.json), [campaña nueva](f6-e/smoke/campaign.json).
No se repiten aquí las cifras de desempeño como conclusión científica de evaluación.

Evidencia de no apertura de batería final en este trabajo: comandos archivados,
plan fijo separado, guards comprobados antes de motor, cero llamadas autorizadas al
worker final y todos los archivos reales de episodios incorporados con semillas1–4.
No existe recibo/firma/clave de autorización de producción ni directorio de campaña
final generado. Se inspeccionó el repositorio y los artefactos de esta ejecución;
esto no pretende probar ausencia de datos en sistemas externos inaccesibles.
El nuevo smoke duró420.00s en este host;
no mide ni garantiza el coste de los checks adicionales del worker final autorizado.

## Entrega a la puerta — detenerse aquí

Se solicita revisar esta identidad, el candidato, diff E2, pruebas y evidencia.
Para E3 hará falta una aprobación específica que confirme el ID y la huella de la
clave firmante, y un recibo firmado asociado a esa aprobación. Los Booleanos del
candidato siguen false y no se utilizan como autorización. Hasta entonces no se
puede abrir la batería final mediante el procedimiento entregado.

```bash
node tools/p01/evaluation/cli.cjs check docs/f6-e/P01-evaluation-freeze.json
node tests/f6-e-gate.cjs docs/f6-e/P01-evaluation-freeze.json
```

E1 FREEZE_READY recomienda la revisión de congelación. No se emiten resultados
OPERATIONAL_ACCEPTANCE/CONDITIONAL_ACCEPTANCE de campaña, hipótesis final, conformidad
canónica ni interoperabilidad independiente. No merge, despliegue o E3–E5 ejecutados.

## Publicación para revisión

La rama se publicó con git push -u origin dev/f6-e-evaluation-preparation.
La API de creación automática del PR devolvió
`Post "https://api.github.com/graphql": Forbidden` (exit1).
[Crear PR manualmente](https://github.com/ksgfin8-cyber/yellow/compare/main...dev/f6-e-evaluation-preparation?expand=1),
con la [descripción preparada](f6-e/PR.md). El bloqueo afecta a abrir el PR,
no a la rama ni a sus artefactos publicados. No se intentó otra autenticación.
