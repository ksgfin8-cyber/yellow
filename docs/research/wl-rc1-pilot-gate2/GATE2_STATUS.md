# WL-RC1 — GATE-2 aprobado; preparación de preflight firmado

**Resultado: PILOT_BLOCKED. GATE-2 ejecutivo: APPROVED. Inicio: HOLD, pendiente de firma/pin RC1 y posterior autorización expresa de arranque. RC1-E definitiva: HOLD / NOT_AUTHORIZED.**

Registro del2026-11-17 (America/Guayaquil). La [orden del propietario](owner-order.txt.b64) aprueba el candidato `466e1dc53f6d5f6f0fe144d85e7f65643b01244acabee5b8caaa25dd34df15ac`, acepta el riesgo de timeout10s y mantiene expresamente el recibo firmado/preflight y una orden de inicio como condiciones separadas (§§2–3). No se vuelve a solicitar aprobación del protocolo ni del riesgo ya aceptados.

## Base e inspección realizada

Base main `8ea64018f633319ef59f0ada8a76dd4e1d648fce`, merge PR #49; implementación RC1-C/D `4d23724268e3a01f23c6774dc1e6994f0598dcde`. Rama nueva `research/wl-rc1-pilot-gate2-readiness`. No cambian protocolo, condiciones, candidato, instrumento, sujeto ni fuentes históricas. Los28 modelos y las14 pruebas del incremento anterior conservan su condición de evidencia histórica; no se repitieron aquí.

Comprobación independiente con Node parent `--max-old-space-size=512`: **identidad MATCH**,61 bindings del sujeto y13 del instrumento verificados por el gate existente, runtime/binario coincidentes y NODE_OPTIONS vacío. Destino `/workspace/shared/world-lab/wl-rc1/pilot-rc1-cd-v1` no existe; padre real existente y accesible. Linux/proc disponible; RSS agregado observado bajo1GiB y espacio libre observado≥128MiB. Son observaciones puntuales, **no** recursos reservados ni un preflight firmado. Valores exactos/versiones/fecha en [UNSIGNED_READINESS.json](UNSIGNED_READINESS.json).

Se conserva el plan P1–P8/3bloques/2modalidades/48workers máximo,10s nominales por hijo,12min nominales totales, heap256/512MiB, RSS agregado1GiB y artefactos128MiB. La supervisión externa permanece implementada y con sus pruebas anteriores documentadas; no se ejecutó de nuevo un worker para estas comprobaciones. Ni capacidad de completar el presupuesto ni perturbación/resolución por escala se infieren del snapshot.

## Dependencia que impide iniciar

| Condición | Estado actual |
|---|---|
| Aprobación ejecutiva GATE-2 y riesgo de timeout | APPROVED por orden actual |
| Candidato/fuentes/runtime | MATCH, comprobados ahora |
| Campaña y destino del recibo | Preparados con los valores ya propuestos en el expediente aprobado |
| Clave pública Ed25519 RC1 y huella aprobada expresamente | NOT_SUPPLIED / NOT_APPROVED_FOR_RC1 en esta tarea |
| Recibo RC1 firmado y firma | NOT_SUPPLIED; solo se prepara recibo **sin firmar** |
| Preflight firmado real | NOT_EXECUTED por faltar esos materiales |
| Orden expresa de inicio después del preflight | PENDING, como exige la orden actual |

En la búsqueda acotada en adjuntos y directorio RC1 no se localizó un paquete público firmado RC1 aportado para esta orden. Existe un ZIP de autorización **P01**, que se excluye: no se abrió, reutilizó ni validó como autorización RC1. No se buscaron claves privadas ni credenciales; no se toman claves efímeras de tests como identidad del propietario. Esto no es un fallo demostrado del motor/instrumento ni de conectividad: falta un insumo y aprobación criptográficos que solo puede aportar el propietario/firmante.

## Recibo preparado y continuación exacta

[authorization.json](authorization.json) es un **borrador sin firmar**, con esquema cerrado del ejecutor, campaña `wl-rc1-pilot-v1` y destino exacto. Su decision expresa el objeto a firmar, no evidencia de que la firma o el inicio ya existan. `owner_reference=WL-RC1-GATE2-OWNER-APPROVAL-20261117` es una referencia documental local asignada a esta orden comunicada en el chat, no una firma ni un documento externo supuesto. No se modifica para superar validaciones; cualquier cambio posterior requiere revisión y nueva firma.

El [procedimiento del firmante](SIGNER_STEPS.md) contiene descarga, generación opcional de clave exclusivamente en su dispositivo, huella DER-SPKI, firma con dominio correcto y archivos públicos a entregar. La privada debe permanecer fuera de repo/workspace/Codex. No se pide enviarla. Después de recibir pública/recibo/firma y aprobación de la huella, se verificarán sus bytes y se ejecutará **solo preflight**. Solo tras su resultado válido y la orden posterior del propietario podrá ejecutarse run-pilot. No se amplían ni se omiten condiciones por la autorización general del piloto.

## Informe de no ejecución, sin resultados fabricados

| Pregunta del informe de piloto | Resultado disponible |
|---|---|
| Procesos completados de48 |0, no se arrancó el piloto |
| Fallidos/censurados/sin ejecutar |0/0/48; falta de inicio no es timeout ni censura de una muestra |
| Equivalencia/resolución/perturbación/viabilidad por escala |NOT_ESTABLISHED por datos piloto; se conservan solo pruebas técnicas previas |
| CPU/memoria/tiempo/almacenamiento del piloto |NO_DATA; snapshot de readiness separado, sin sustituir mediciones |
| Revisar presupuesto u operaciones |No hay evidencia empírica piloto para recomendar cambios; no se modifican |
| Suficiencia para diseñar RC1-E |No se obtuvo nueva evidencia empírica; recomendación NO-GO de inicio RC1-E, sigue HOLD |

No hay manifest de campaña ni resultado que aparente ejecución completa; el inventario publicado aquí identifica **documentos de preparación**, no mediciones. Workers/condiciones iniciados=0; sin reintentos, claves reales creadas o episodios P01/E3/E4. Se conservan originales y rama de transferencia. [Comprobaciones documentales](DOCUMENTARY_CHECKS.json) e [inventario](PUBLICATION-SHA256.json).
