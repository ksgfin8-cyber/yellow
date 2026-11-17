# Solicitud GO/NO-GO — piloto WL-RC1, no RC1-E

**READY_FOR_GATE_2_REVIEW. PILOT HOLD / OWNER_APPROVAL_REQUIRED. RC1-E definitiva NOT_AUTHORIZED.**

Se solicita revisión del protocolo1.0.0, instrumento validado y candidato `PILOT-CANDIDATE.json`, identidad **`466e1dc53f6d5f6f0fe144d85e7f65643b01244acabee5b8caaa25dd34df15ac`**. Base sujeto `c1e80c5249002fccaf8508ee9d9397d6bbeb1b7c`; modelos A/B de `030ec332…` continúan aplicables al código sin cambios. El freeze liga las fuentes reales, protocolo/condiciones, instrumento/pruebas y runtime/binario Node. Informe de validación e inventario publican evidencia posterior sin modificar los bytes ligados.

## Objeto preciso de la aprobación solicitada

Solo P1–P8 ×3bloques ×2modalidades, máximo48 workers, exactamente conditions.json,16 operaciones por worker con1 FIRST_MEASURED/3 WARMUP/5 WARM. No aprobar una campaña definitiva, otras seeds, perfiles, stress r511/512 ni cambio de física/norma. Primero firmado preflight sin inicio, luego orden expresa de inicio del propietario. No existe autorización real emitida por este incremento; las claves de tests son efímeras y no son identidad aprobada para RC1.

Destino propuesto exclusivo: `/workspace/shared/world-lab/wl-rc1/pilot-rc1-cd-v1`. Mantener su directorio padre existente; el destino final debe no existir. Conservación posterior en otro destino disjunto a designar; recepción externa todavía NOT_ESTABLISHED. P01, originales y rama de transferencia se conservan.

## Comandos exactos después de aprobación, no ejecutados ahora

Revisión previa, sin piloto:

```sh
node tools/research/wl-rc1/cli.cjs check docs/research/wl-rc1-cd/PILOT-CANDIDATE.json
node tools/research/wl-rc1/cli.cjs plan
```

El firmante autorizado copia `authorization.template.json` fuera del repo, sustituye REPLACE_WITH_OWNER_APPROVAL_REFERENCE y confirma campaña/destino/freeze. El propietario debe aprobar expresamente la clave pública Ed25519 y SHA256 DER-SPKI por un canal distinto del propio recibo. No subir ni facilitar clave privada al ejecutor. Si aún no existe clave designada, se mantiene HOLD; la preparación ya está concluida sin ella.

En el dispositivo del firmante, con una clave privada Ed25519 aprobada existente y Node, firmar los bytes exactos (sin conversión BOM/CRLF posterior):

```sh
node -e 'const fs=require("fs"),c=require("crypto"); const b=fs.readFileSync(process.argv[1]); fs.writeFileSync(process.argv[3],c.sign(null,Buffer.concat([Buffer.from("WL-RC1-PILOT-AUTHORIZATION-1\n"),b]),fs.readFileSync(process.argv[2])));' /secure/authorization.json /secure/private.pem /secure/authorization.sig
node -e 'const fs=require("fs"),c=require("crypto"),k=c.createPublicKey(fs.readFileSync(process.argv[1])); console.log(c.createHash("sha256").update(k.export({type:"spki",format:"der"})).digest("hex"));' /secure/public.pem
```

La privada queda en aquel dispositivo, fuera del repo/workspace. Solo se entregan recibo, firma y pública. Huella e identidad se reciben del propietario; no se confían automáticamente por calcularlas desde archivos entregados.

En el ejecutor (sustituir KEY_PIN_APPROVED por la huella ya aprobada):

```sh
node --max-old-space-size=512 tools/research/wl-rc1/cli.cjs preflight docs/research/wl-rc1-cd/PILOT-CANDIDATE.json /secure/authorization.json /secure/authorization.sig /secure/public.pem 466e1dc53f6d5f6f0fe144d85e7f65643b01244acabee5b8caaa25dd34df15ac KEY_PIN_APPROVED
# Solo después de preflight válido y autorización expresa de inicio:
node --max-old-space-size=512 tools/research/wl-rc1/cli.cjs run-pilot docs/research/wl-rc1-cd/PILOT-CANDIDATE.json /secure/authorization.json /secure/authorization.sig /secure/public.pem 466e1dc53f6d5f6f0fe144d85e7f65643b01244acabee5b8caaa25dd34df15ac KEY_PIN_APPROVED
```

Preflight exige firma/pins/identidad, flags correctos, Linux/proc, RSS actual bajo umbral, espacio libre≥cuota y destino nuevo. Informa episodes_started=0. No sustituye la orden humana posterior ni garantiza disponibilidad durante la ejecución. Después de la ejecución autorizada, repetir `check` del candidato antes de interpretar resultados; una diferencia de identidad mantiene HOLD aunque el archivo sea íntegro. Mantener fuentes sin ediciones concurrentes: el hash de archivos no es un snapshot atómico de filesystem. No cambiar el destino para superar validación: emitir otra autorización revisada si hay incompatibilidad.

## Presupuesto y parada revisados

Se conservan48procesos/10s por hijo/12min total/256MiB heap hijo/128MiB artefactos/1GiB RSS agregado; parent512MiB. Reserva interna1MiB incluida en128MiB. Un worker medidor a la vez; guardian independiente con25ms nominal. Se demostraron stops con umbrales pequeños, no se corrieron12min ni se reservaron1GiB para una prueba. Diagnósticos/tamaño de testigo tienen límites declarados y fallan visiblemente.

**Viabilidad de completar P1–P8 dentro de10s por worker: NOT_ESTABLISHED.** Los fixtures2×2/T2 no permiten escalar a1024celdas ni a la reconstrucción repetida de prefijos.16operaciones×9llamadas por worker añaden preparación/testigos y pueden consumir la ventana antes de terminar. El límite es aplicable, no garantía de suficiencia. No se alargaron timeouts ni se recortaron operaciones/repeticiones para mostrar éxito. El piloto sirve también para evaluar esa viabilidad; si se censura, se detiene, conserva lo observado y requiere revisión versionada y autorización nueva, sin retries automáticos. Alternativa del propietario: NO-GO hasta resolver por revisión explícita esta incertidumbre de presupuesto; no es un cambio productivo pendiente.

GO técnico **para revisión**: controles D01–D08 y preservación probados en fixtures; no se demostraron todas las escalas ni perturbación<10%. NO-GO de inicio si falta clave/pins/recibo aprobado, identidad coincide mal, no hay Linux/proc/recursos/destino válido o persiste cualquier fallo instrumental. RSS muestreado y deadlines nominales no son aislamiento duro ni techo físico instantáneo. Un fallo de almacenamiento o host puede dejar archivo parcial identificado.

## Decisiones que quedan al propietario

Aceptar protocolo/instrumento/candidato, riesgo de suficiencia del presupuesto, destino y conservación; designar/aprobar clave y recibir preflight firmado; autorizar inicio del piloto específicamente. Mantener RC1-E en HOLD incluso si el piloto se aprueba. Los ajustes tras piloto deberán motivarse con evidencia y versiones; no reutilizar autorización de otra identidad.
