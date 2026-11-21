# TITAN-MVP-01 — G1: plan técnico de desarrollo

Especificación aprobada por la orden del propietario: siete documentos de este expediente en main posterior al PR56 `38bcb2116a31ecbaf4f401f41243d4adf88e98e3`. Se conservan sus bytes, incluidas SOURCE_V01/V03 (normalizaciones, no transcripciones certificadas). Este documento registra decisiones internas rutinarias y el smoke antes de ejecutarlo; no modifica D4 ni la evaluación120, que permanece HOLD.

## Implementación y frontera

- `js/agents/titan_mvp_01.js`: selector puro especializado en los cuatro IDs fijos. Acepta pares `[id,cost]` en cualquier orden; ordena por N/E/S/W, agrega NULL al final si empata y calcula Cap/gaps/global sobre mecanismos, no sobre NULL. La generalización a IDs arbitrarios era opcional y no se implementa. Núcleo numérico JS binary64, sin coerciones; política D4 usa solo enteros pequeños exactos. Con phi≤1 y L finito positivo no existe overflow de L×phi dentro del dominio válido; se comprueban igualmente finitud y fronteras inválidas que producirían overflow fuera del dominio.
- Adaptador: solo Feedback/Observation y memoria privada visited/consumed. Valida las entradas usadas antes de actualizar memoria; visited se actualiza desde self, nunca desde una propuesta. Recursos consumidos se conocen solo por eventos expuestos de la acción previa. Sin BFS/seed/stock/WORLD/host-clock. La oportunidad se calcula desde representaciones y memoria, separada del costo. Campos malformados provocan TypeError, no WAIT de reserva.
- `tools/titan-mvp-01/runtime.cjs`: carga el runtime existente sin editarlo y monta el nuevo classic script en su VM. Fábrica externa para TITAN; FrontierMemory/Wait/Random/Rule conservan sus constructores. No se registra TITAN en el registro web. Intercambio entre episodios.
- Diagnóstico privado separado, leído después de obtener la acción. Copias sin alias mutables; el agente no recibe callbacks ni consulta el sidecar. El runner agrega experiment_seed/code_sha256 fuera del sujeto. No hay campos nuevos en Action, Feedback, WORLD, StepRecord o ExperimentConfig.
- `verify.cjs`: inicialización desde semilla, replay canónico, comparación estructural completa y bytes WLS1 de cada estado; nueva instancia/reset del agente sobre feedbacks archivados para comparar decisiones/diagnósticos. Ningún step adicional terminal. Prueba del mismo motor, no interoperabilidad independiente.
- Transporte gzip usa codec existente sin modificarlo. Sidecar, contadores y metadatos host quedan fuera de la trayectoria canónica. No se usa la envoltura de archivo ni comparador científico P01, que están ligados a otro protocolo.

## Pruebas técnicas

Casos de selector/entradas malformadas, empates incluyendo NULL, costos ordinales D4, memoria/reset/movimiento rechazado, visibilidad, aislamiento del diagnóstico y modo sin diagnóstico; integración con fixtures pequeñas y semillas1–4; sustitución por controles sin modificar WORLD; archivo/restauración/corrupción; timeout técnico y siguiente proceso sano. Identificadores locales TITAN, no tests canónicos ni muestras científicas. Las fixtures de feedback para movimiento rechazado caracterizan memoria, no afirman que D4 elija BLOCKED en el perfil físico.

Solo semillas1–4 se admiten por config/requests/runtime del harness. Extra fields/banderas de evaluación no habilitan2001–2012, ni1001–1032. CLI no tiene modo de evaluación ni plan ejecutable120. El acceso directo al motor presupone código confiable: no se declara sandbox de plugins hostiles.

## Smoke prefijado

Configuración física exactamente la de EXPERIMENT_PROTOCOL §2/P01 referenciada:12×12, BOUNDED, obstáculos0,15, recursos0,12, hazard0; energía240; move/wait1; recurso8; regeneración0; death_threshold0; radio1;160ticks; cuatro flags true. Configuración literal propia en el harness, no modifica ni ejecuta el protocolo P01.

Orden de12intentos: TITAN seed1 rep1/2; Wait/Random/Rule/FrontierMemory seed1 rep1; TITAN seeds2,3,4 rep1/2, en ese orden. Cada intento usa proceso nuevo. Comprueba cuatro repeticiones deterministas TITAN y mundos iniciales comunes de cinco controladores en seed1; controles de seeds2–4 no se ensayan ni se imputan. No es la matriz científica, no prueba superioridad, no ajusta costos/proxy/L.

Identidad propia: SHA-256 de todas las fuentes base, siete documentos, nuevo agente/harness/tests/protocolo y runtime Node. Los archivos base deben coincidir con Git; candidate nuevo escrito antes del smoke y revalidado por worker/controlador. La autorización G1 procede de la orden actual; no se usan claves, firmas o freeze IDs P01/RC1.

## Salvaguardas de desarrollo y presupuesto

Se eligen ex ante **30s por worker, heap V8 384MiB,12intentos máximos, archivo64MiB y420s de admisión total**. Se justifica un margen conservador porque cada worker hace episodio160, copia/diagnóstico, replay y bytes WLS1 de161estados, más comprobación de identidad: es más trabajo que una sola acción. Son límites de desarrollo elegidos para esta implementación, no autorización heredada de P01/RC1 ni suficiencia empírica afirmada. El mismo valor nominal30s no transfiere permisos entre campañas.

Se reutiliza runChild de P01 como primitiva operacional inalterada, pasando límites explícitos. El padre aplica timeout externo al hijo, registra stdout/stderr y recursos de todo el worker, incluido replay. Devuelve TIMEOUT/WORKER_ERROR y se archiva el intento sin resultado inventado. Truncamiento diagnóstico produce parada explícita. Reserva1MiB para cierre; si un payload no cabe, se conserva la entrada/diagnóstico y se declara que su payload no se archivó, sin fingir resultado completo.

El tiempo total se comprueba entre workers, no mediante watchdog independiente del controlador. RSS se observa como máximo por proceso Linux, **no se impone ni se demuestra un cap agregado**. El proceso padre puede tardar en empaquetar/verificar; estas limitaciones son aceptables para G1 confiable acotado y deben resolverse/revisarse si se exigen garantías más fuertes en G2. No se presenta un timeout duro global ni tolerancia a pérdida del host.

Primer fallo operativo/de agente/replay/integridad: parar smoke, conservar lo recibido, sin sustituir semillas ni optimizar política para continuar. El directorio debe ser nuevo, fuera de repo/P01/RC1. Archivos `.partial` de escritura fallida no se sobrescriben. Error fatal de control puede dejar evidencia sin manifest terminal: no declarar completo ni reparar silenciosamente. Toda continuación requiere explicar el fallo.

Se registran resultados completos incluidos WAIT/estancamiento o consumos bajos. Recursos de smoke son observaciones de estas semillas; presupuesto G2 será una propuesta explícita después de medir, no extrapolación garantizada. Ningún resultado de desarrollo se incorporará como muestra de evaluación2001–2012.

## Entrega

Nuevos archivos únicamente en fronteras autorizadas. Informe con cobertura, hashes, pruebas/smoke, bloques y límites, registro prospectivo de esfuerzo (wall no equivale a horas activas/persona), identidad y propuesta G2. Estado READY_FOR_TITAN_MVP_01_REVIEW si integración verificada; evaluación120 HOLD. No se actualizan fuentes, acta RC1 ni cierres P01. PR sin merge automático.
