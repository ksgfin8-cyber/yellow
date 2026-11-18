# Autorización y operación futuras — no ejecutadas

Esta entrega prepara el mecanismo; **no autoriza calibración ni piloto128**. La próxima puerta requiere que el propietario apruebe PROTOCOL.md, condiciones24, límites, candidato nuevo y pin de clave pública para este uso. El recibo v1 consumido y el recibo R1-piloto no son aceptados. No hay clave privada de producción en esta entrega.

## Firmante y datos que aprobar

1. Revisar el commit/rama, protocolo, diff, evidencia y freeze_id de CANDIDATE.json. Comprobar `check` en el checkout y runtime registrados.
2. Designar una clave Ed25519 para esta autorización y comunicar únicamente public.pem y su huella DER-SPKI SHA-256. La aprobación anterior de una clave/recibo no implica aprobación de esta calibración. No subir clave privada.
3. Copiar authorization.template.json fuera del repositorio, sustituir los dos placeholders y conservar el JSON como bytes. El freeze_id debe ser el candidato de calibración aprobado, no e42a. El recibo cierra exactamente seis campos y fija campaña/destino.
4. Firmar el prefijo `WL-RC1-R1-CALIBRATION-AUTHORIZATION-1` seguido de LF0x0A y los bytes del recibo. No firmar una serialización diferente ni agregar newline al JSON después de firmar.

Comandos orientativos que ejecutará **el firmante fuera de Codex**, nunca durante esta preparación:

```powershell
# Solo si el propietario decide crear otra clave en su computadora:
openssl genpkey -algorithm Ed25519 -out owner-private.pem
openssl pkey -in owner-private.pem -pubout -out public.pem
openssl pkey -pubin -in public.pem -outform DER -out public.der
Get-FileHash -Algorithm SHA256 public.der
```

Con Node y OpenSSL disponibles localmente, crear la entrada binaria preservando los bytes originales y firmarla:

```powershell
node -e "const f=require('node:fs');f.writeFileSync('authorization.signing-input.bin',Buffer.concat([Buffer.from('WL-RC1-R1-CALIBRATION-AUTHORIZATION-1\n'),f.readFileSync('authorization.json')]))"
openssl pkeyutl -sign -rawin -inkey owner-private.pem -in authorization.signing-input.bin -out authorization.sig
openssl pkeyutl -verify -rawin -pubin -inkey public.pem -in authorization.signing-input.bin -sigfile authorization.sig
```

El firmante aporta solo public.pem, authorization.json, authorization.sig. El propietario comunica la aprobación explícita del pin y freeze_id; el operador no los obtiene como autoridad del propio ZIP. El archivo privado y signing-input no son necesarios para el preflight remoto.

## Operador, tras aprobación del candidato y clave

1. Checkout limpio del commit revisado; comprobar que no hay ediciones concurrentes. Runtime exacto del candidato, NODE_OPTIONS vacío, Linux/proc y recursos. Preservar fuentes/evidencias previas.
2. Extraer los tres archivos públicos fuera del repositorio, sin recodificarlos. Verificar firma/campos/destino y ejecutar preflight. El destino debe no existir; su padre `/workspace/shared/world-lab/wl-rc1` sí debe existir. No cambiar el destino para superar un fallo.

```text
node tools/research/wl-rc1-r1-calibration/cli.cjs check docs/research/wl-rc1-r1-calibration/CANDIDATE.json
node --max-old-space-size=512 tools/research/wl-rc1-r1-calibration/cli.cjs preflight <candidate> <authorization.json> <authorization.sig> <public.pem> <approved-calibration-freeze-id> <approved-key-pin>
```

Salida exigida: signature VALID, freeze_id aprobado, destino exclusivo, workers_started=0. Ante cualquier discrepancia: HOLD, no editar el recibo ni las fuentes. **Después del preflight, esperar orden expresa de inicio.** Esta preparación no la contiene.

3. Solo tras esa orden futura: guardar stdout/stderr del proceso controlador fuera de su destino, ejecutar **una sola vez** `run-calibration` con exactamente los seis argumentos anteriores, sin filtros ni flags adicionales. No se incluye aquí un comando ya autorizado. El modo ejecuta únicamente24unidades y rechaza candidato/firma antiguos. No da acceso al piloto128 ni RC1-E.
4. Primer fallo detiene; no retry/resume, sustitución ni aumento de recursos. Conservar parciales, destino, logs externos y recibo. Un destino existente bloquea otro inicio. Comparaciones semánticas se revisan desde testigos completos recuperados antes de recomendar otra ejecución.

## Recuperación y revisión

No regenerar datos. Copiar directorio entero a otro destino nuevo; registrar inventario SHA-256 externo antes/después y verificar coincidencia de todos los bytes. Mantener originales. El `data/manifest.json` protege archivos de datos/journals; bundle.json referencia manifest y guardian de raíz. Conservar también logs externos del controlador. Un digest no prueba por sí solo independencia de almacenamiento.

```text
node tools/research/wl-rc1-r1-calibration/cli.cjs verify <original>
node tools/research/wl-rc1-r1-calibration/cli.cjs verify <copy-restored>
```

`verify` solo lee archivos: no carga WORLD ni ejecuta replay. Si no existe envelope: PARTIAL_UNSEALED y conservar todos los bytes; no inventar hashes faltantes. Si faltan muestras o hay discrepancias, publicar rechazo y causa, no reparar el resultado. OFF no tiene journal de fases: usar última muestra/guardian y mantener ese límite de localización.

Después de una calibración autorizada se aplicarán los estimadores predefinidos, estructuras completas y balances sin solapamientos. Publicar cada worker, ambos bloques/factores, tiempos/recursos y todos los fallos. No declarar suficientes30s/75min a partir de fixtures ni extrapolar garantías de tres celdas al plan completo. El defecto tardío AUD-C01 sigue pendiente en el ejecutor128 original; requiere revisión separada antes de utilizarlo.
