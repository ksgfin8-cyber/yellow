# P01 — expediente F6-E3-GATE

**READY_FOR_OWNER_APPROVAL para el procedimiento. Clave y ejecución E3: HOLD.**
Base `2e8e84535667978dc03ac952f8fa51bc617c3cb8` (PR#37); rama
`dev/f6-e3-gate-readiness`. Fecha:2026-11-13 (America/Guayaquil).
La orden y su precisión posterior no autorizan evaluación1001–1032. Se entrega
únicamente procedimiento/evidencia; código y artefactos congelados se conservan.

## Estado verificado

| Elemento | Resultado |
|---|---|
| Identidad | `47155590f10358f6130a1f7eae261ec9ec1fc8035652c04dd23fcc9f92c63e7d` confirmada por el gate existente |
| Código y pruebas |41 fuentes del candidato y9 archivos adicionales del ejecutor/pruebas; blobs del commit `a2c989b67ee447cdeb4733b07f5f6b5887c27ed6` y8 archivos de pruebas F6-B comprobados |
| Evidencia smoke |Hashes de los35 archivos reales ligados al manifiesto, incluidos32 archivos de episodios, comprobados; no se regeneró smoke |
| Runtime |Node `v24.22.1`, Linux x64, binario SHA256 `61ab14cd750fc24d5db53490ec5fc40f756e4b6e136b78cf7004265471d9bd1d`; coincide exactamente con la congelación |
| Presupuesto |Supervisor existente:30.000ms y `--max-old-space-size=512`; proceso operacional con esos argumentos retorna correctamente. V8 reportó heap_size_limit=738197504bytes (704MiB); old-space512 no es un cap del heap total ni de RSS |
| Escritura |Padre externo `/workspace/shared/world-lab` existente, realpath comprobado; escritura exclusiva, fsync, lectura y copia con SHA256 idéntico. Más de59GiB disponibles en la observación |
| Clave de producción |No designada/aprobada, según responsable. No se generó. **Huella pública propuesta: ninguna** |
| Campaña propuesta |`p01-final-20261113-01` |
| Destino propuesto |`/workspace/shared/world-lab/p01-final-20261113-01`: absoluto, externo y aún inexistente; no se creó el directorio de campaña |
| Ejecución |Cero episodios finales. No se completó preflight de producción ni se cerró E3 |

[Manifiesto existente](../f6-e/P01-evaluation-freeze.json),
[candidato existente](../f6-e/P01-freeze-candidate.json),
[runtime observado](runtime.json), [prueba operacional](environment-probe.json),
[comprobación criptográfica](signing-check.json), [entorno Node ambiente](ambient-node.json). Kernel y espacio observados son
metadatos del host; los requisitos fijados son los que verifica el gate.

NODE_OPTIONS está ausente. NODE_PATH está configurado por el entorno; la ruta de
ejecución usa módulos node: y rutas relativas, sin imports de paquetes NPM externos.
El límite implementado coincide con el flag congelado. Si se exige un límite
estricto de512MiB para **todo** el heap, esta implementación no lo acredita:
esa exigencia requeriría HOLD y revisión explícita de presupuesto/flags/ejecutor,
pruebas de desarrollo y nueva congelación. No se hizo ese cambio aquí.

## 1. Firmante: generar o seleccionar la clave bajo su control

Estos comandos se preparan para **la máquina controlada por el responsable o por un
firmante expresamente designado**. No se han ejecutado para crear una clave real.
OpenSSL3.5.7 y el formato resultante se verificaron aquí con claves sintéticas.

```bash
umask 077
P01_SIGNING_DIR="$HOME/.world-lab-signing/p01"
mkdir -p "$P01_SIGNING_DIR"
P01_PRIVATE_KEY="$P01_SIGNING_DIR/owner-ed25519-private.pem"
P01_PUBLIC_KEY="$P01_SIGNING_DIR/owner-ed25519-public.pem"
# Solo para una clave NUEVA: abortar si ya existe; no sobrescribir.
test ! -e "$P01_PRIVATE_KEY" || exit 1
openssl genpkey -algorithm ED25519 -out "$P01_PRIVATE_KEY"
chmod 600 "$P01_PRIVATE_KEY"
openssl pkey -in "$P01_PRIVATE_KEY" -pubout -out "$P01_PUBLIC_KEY"
openssl pkey -pubin -in "$P01_PUBLIC_KEY" -outform DER -out "$P01_SIGNING_DIR/public.spki.der"
openssl dgst -sha256 "$P01_SIGNING_DIR/public.spki.der"
```

Si ya dispone de una clave Ed25519 autorizable, omitir genpkey, asignar su ruta local
a P01_PRIVATE_KEY y exportar únicamente la parte pública con los dos comandos pkey.
Una clave cifrada existente puede solicitar su contraseña localmente; no ponerla en
argumentos ni enviarla al chat. La privada nunca se copia a Git ni al ejecutor.
La huella solicitada es SHA256 del **DER SPKI público**, no del archivo PEM textual.
Presentar únicamente los64 caracteres hexadecimales en minúscula, sin el prefijo
descriptivo que imprime openssl.

## 2. Información pública y decisión que faltan

El responsable deberá recibir **PEM público y huella DER-SPKI concreta**, comprobarlos
y aprobar por un canal externo al recibo:

- Identidad exacta indicada arriba y [versión ejecutable/runtime](runtime.json),
  incluida la semántica del presupuesto: old-space512 mediante el flag congelado;
  límite total V8 observado704MiB.
- Identidad del firmante y huella de su clave pública, con su designación expresa.
- Campaña `p01-final-20261113-01` y destino absoluto propuestos; conservación/copia de
  evidencia que corresponda al almacenamiento elegido.
- Autorización específica de los256 episodios según P01 y sus límites30s/512MiB.

Registrar una referencia inequívoca a esa decisión. **Preparar este expediente no es
esa aprobación.** Una huella calculada desde una clave no se convierte por sí sola
en confiable. No existe todavía clave o firma de producción que presentar como aprobada.

## 3. Después de esa aprobación: completar y firmar el recibo

[receipt.template.json](receipt.template.json) tiene exactamente los8 campos del
esquema existente. Está **sin firmar**, con reviewer y approval_reference vacíos para
que falle la validación mientras no exista la decisión. Copiarla al espacio privado
del firmante y completar ambos campos con el responsable y la referencia reales.
Confirmar campaña y destino antes de firmar; no cambiar nada después de la firma.

En la máquina del firmante, desde su checkout revisado:

```bash
P01_RECEIPT="$P01_SIGNING_DIR/authorization.json"
test ! -e "$P01_RECEIPT" || exit 1
cp docs/f6-e3-gate/receipt.template.json "$P01_RECEIPT"
# Completar reviewer y approval_reference conforme a la decisión externa.
# Continuar SOLO cuando se hayan aprobado identidad, clave, campaña y destino.
P01_PAYLOAD="$P01_SIGNING_DIR/authorization.payload"
P01_SIGNATURE="$P01_SIGNING_DIR/authorization.sig"
test ! -e "$P01_PAYLOAD" || exit 1
test ! -e "$P01_SIGNATURE" || exit 1
node - "$P01_RECEIPT" "$P01_PAYLOAD" <<'JS'
const fs=require('node:fs');
const [receiptFile,payloadFile]=process.argv.slice(2);
const bytes=fs.readFileSync(receiptFile),r=JSON.parse(bytes);
if(!r.reviewer.trim()||!r.approval_reference.trim())throw Error('Falta decisión externa');
fs.writeFileSync(payloadFile,Buffer.concat([
  Buffer.from('WL-P01-AUTHORIZATION-1\n','utf8'),bytes
]),{flag:'wx',mode:0o600});
JS
openssl pkeyutl -sign -rawin -inkey "$P01_PRIVATE_KEY" -in "$P01_PAYLOAD" -out "$P01_SIGNATURE"
openssl pkeyutl -verify -rawin -pubin -inkey "$P01_PUBLIC_KEY" -in "$P01_PAYLOAD" -sigfile "$P01_SIGNATURE"
```

El prefijo lleva **un LF real**. Se firma prefijo+bytes completos del recibo; no su
hash, un texto base64 ni un JSON reserializado. La firma es un archivo binario de64bytes.
Transferir solo authorization.json, authorization.sig y la clave pública al ejecutor,
preservando los bytes. Las rutas siguientes se proponen fuera del repositorio:
`/workspace/shared/world-lab/p01-authorization/`. No se ha creado material real allí.

## 4. Operador: preflight posterior, todavía bloqueado

Antes de usarlo, comprobar que el destino de campaña sigue inexistente y que el padre
existe fuera del repositorio. Si cambia el destino, volver a obtener aprobación y
firma del recibo correspondiente. Mantener limpio el checkout del ejecutor.

```bash
cd /workspace/yellow
test -z "${NODE_OPTIONS-}" || exit 1
P01_APPROVED_FREEZE_ID='47155590f10358f6130a1f7eae261ec9ec1fc8035652c04dd23fcc9f92c63e7d'
P01_APPROVED_PUBLIC_KEY_SHA256='<HUELLA DER-SPKI CONFIRMADA EXTERNAMENTE POR EL RESPONSABLE>'
P01_AUTH_DIR='/workspace/shared/world-lab/p01-authorization'
P01_PROPOSAL='docs/f6-e/P01-evaluation-freeze.json'
node tools/p01/evaluation/cli.cjs check "$P01_PROPOSAL"
node tools/p01/evaluation/cli.cjs preflight "$P01_PROPOSAL" \
  "$P01_AUTH_DIR/authorization.json" "$P01_AUTH_DIR/authorization.sig" \
  "$P01_AUTH_DIR/owner-ed25519-public.pem" \
  "$P01_APPROVED_FREEZE_ID" "$P01_APPROVED_PUBLIC_KEY_SHA256"
```

No derivar el pin confiable automáticamente de la clave recibida y asumir aprobación.
La salida esperada es signature=VALID, ID exacto, destino aprobado y episodes_started=0.
No se obtuvo esa salida con material de producción en esta etapa.

## 5. Ejecución preparada, NO autorizada ni ejecutada

Únicamente tras decisión expresa que abra E3 y un preflight válido, el operador podría
utilizar los mismos archivos y pins aprobados:

```bash
# PREPARADO PARA REVISIÓN; NO EJECUTADO EN F6-E3-GATE
node tools/p01/evaluation/cli.cjs run "$P01_PROPOSAL" \
  "$P01_AUTH_DIR/authorization.json" "$P01_AUTH_DIR/authorization.sig" \
  "$P01_AUTH_DIR/owner-ed25519-public.pem" \
  "$P01_APPROVED_FREEZE_ID" "$P01_APPROVED_PUBLIC_KEY_SHA256"
```

No existe permiso para sustituir escenarios, relanzar en otro destino o ajustar
parámetros. Firmar la plantilla no reemplaza la autorización humana externa.

## Evidencia, incidencia e impedimentos

Verificaciones reproducibles sin autorización de producción:

```bash
node tests/f6-e-gate.cjs docs/f6-e/P01-evaluation-freeze.json
node --test --test-name-pattern='F6E-(0[1-9]|1[0-35-9]|2[0-4])' tests/f6-e.test.cjs
```

- 4 comprobaciones existentes de identidad/gate PASS;23 tests existentes de preparación
  PASS en la selección restringida, sin el caso14. No se añadieron tests ni código.
- OpenSSL→gate Node verificó un recibo de **identidad ficticia**, con claves sintéticas
  temporales eliminadas: DER/SPKI, huella, prefijo y firma64bytes coinciden. No se
  firmó la identidad real con esos materiales ni se propusieron como clave del dueño.
- Tres preflight reales negativos PASS: clave ausente, huella no confiable y recibo
  de otra identidad. Todos exit1 y cero episodios.
- Incidencia procedimental: la ejecución inicial de la suite completa incluyó
  F6E-14, que invocó dos CLI `run` con argumentos inválidos. Ambos terminaron en el
  error de uso, antes de authorize/importar el controlador/cargar el motor. Se debió
  excluir ese caso por la prohibición literal de la orden. Se conserva la salida
  inicial; la repetición restringida lo excluye. La ruta de ejecución autorizada y
  todas las semillas finales permanecieron sin ejecutar.
- El runtime coincide; no hace falta cambiar código ni refijar hashes. Si en otra
  máquina check falla por Node/OS/fuentes/evidencia, declarar HOLD y registrar la
  diferencia. Volver a la preparación de congelación bajo autorización explícita,
  preservar revisión anterior, repetir desarrollo y pedir aprobación de identidad
  nueva; no editar los hashes para superar el gate.
- La prueba de almacenamiento acredita escritura/fsync/lectura/copia local; no prueba
  recuperación después de pérdida completa del workspace. Debe conservarse la
  evidencia según el destino y política que apruebe el responsable.

[Salida de identidad](identity.log.b64), [suite inicial completa](preparation-tests.log.b64),
[selección restringida](restricted-tests.log.b64), [proceso y escritura](environment-probe.log.b64),
[firma y preflights negativos](signing-check.log.b64). Lectura:
`base64 --decode docs/f6-e3-gate/identity.log.b64`.
Las fuentes auxiliares se conservan como evidencia b64, no se instalan como nuevos
módulos: [probe](environment-probe.source.cjs.b64), [check sintético](signing-check.source.cjs.b64).

**Decisiones pendientes:** designar firmante y clave, aprobar su huella pública y esta
identidad junto con campaña/destino/entorno, registrar decisión y firmar el recibo;
posteriormente aprobar la apertura de E3. Clave y E3 siguen HOLD. No se declara
aceptación operacional, resultado científico, conformidad ni interoperabilidad.
