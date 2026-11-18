# Pasos necesarios del propietario/firmante RC1

Estos comandos son para el dispositivo del firmante, **fuera de Codex y del workspace**. No se han ejecutado aquí. No usar identidad/recibos P01 ni claves efímeras de tests. Protocolo/riesgo ya aprobados; faltan los insumos criptográficos y la orden posterior de arranque que la propia decisión GATE-2 conserva.

## 1. Descargar el recibo preparado sin convertir sus bytes

En Windows PowerShell, con Node instalado y directorios locales fuera de carpetas del workspace:

```powershell
New-Item -ItemType Directory -Force C:\RC1-public | Out-Null
Invoke-WebRequest -Uri 'https://raw.githubusercontent.com/ksgfin8-cyber/yellow/research/wl-rc1-pilot-gate2-readiness/docs/research/wl-rc1-pilot-gate2/authorization.json' -OutFile 'C:\RC1-public\authorization.json'
Get-FileHash 'C:\RC1-public\authorization.json' -Algorithm SHA256
```

Comparar con la entrada authorization.json del inventario publicado. No reserializar el JSON con Get-Content/Set-Content después de firmar. Confirmar campaña `wl-rc1-pilot-v1`, destino `/workspace/shared/world-lab/wl-rc1/pilot-rc1-cd-v1`, freeze `466e1dc53f6d5f6f0fe144d85e7f65643b01244acabee5b8caaa25dd34df15ac` y referencia de esta orden. Si algún campo debe cambiar, revisarlo antes de firmar; no ajustar silenciosamente el destino al ejecutar.

## 2. Preparar el helper local, designar clave RC1 y aprobar la huella

Para evitar diferencias de comillas entre versiones de PowerShell, guardar el siguiente helper público como archivo UTF-8 sin BOM. Este código solo se ejecuta en el dispositivo del firmante, nunca en Codex:

```powershell
$helper = @'
'use strict';
const fs = require('node:fs'), c = require('node:crypto');
const [command, a, b, destination] = process.argv.slice(2);
function ed(key) { if (key.asymmetricKeyType !== 'ed25519') throw Error('Ed25519 required'); return key; }
if (command === 'generate') {
  const k = c.generateKeyPairSync('ed25519');
  fs.writeFileSync(a, k.privateKey.export({type:'pkcs8',format:'pem'}), {flag:'wx',mode:0o600});
  fs.writeFileSync(b, k.publicKey.export({type:'spki',format:'pem'}), {flag:'wx'});
} else if (command === 'fingerprint') {
  const key = ed(c.createPublicKey(fs.readFileSync(a)));
  console.log(c.createHash('sha256').update(key.export({type:'spki',format:'der'})).digest('hex'));
} else if (command === 'sign') {
  const key = ed(c.createPrivateKey(fs.readFileSync(a))), receipt = fs.readFileSync(b);
  fs.writeFileSync(destination, c.sign(null, Buffer.concat([Buffer.from('WL-RC1-PILOT-AUTHORIZATION-1\n'), receipt]), key), {flag:'wx'});
} else throw Error('generate <new-private> <new-public> | fingerprint <public> | sign <private> <receipt> <new-signature>');
'@
[System.IO.File]::WriteAllText('C:\RC1-public\rc1-sign.cjs', $helper, (New-Object System.Text.UTF8Encoding($false)))
```

Usar una clave Ed25519 específica de RC1 en el dispositivo del firmante. Si no existe, la generación siguiente es **opcional y exclusivamente local**; no ejecutarla en el entorno de Codex:

```powershell
New-Item -ItemType Directory -Force C:\RC1-private | Out-Null
node 'C:\RC1-public\rc1-sign.cjs' generate 'C:\RC1-private\private.pem' 'C:\RC1-public\public.pem'
```

No sobrescribe claves existentes. La privada queda exclusivamente bajo control del firmante y nunca se adjunta a Codex/Git. Si la clave ya existe, exportar solo su pública con las herramientas locales del firmante.

Calcular la huella **DER-SPKI SHA256**, no el hash textual del PEM:

```powershell
node 'C:\RC1-public\rc1-sign.cjs' fingerprint 'C:\RC1-public\public.pem'
```

El propietario comunica por separado en el chat: «Apruebo para el piloto RC1 la clave pública Ed25519 cuya huella DER-SPKI SHA256 es [huella calculada]». La clave entregada no se convierte en confiable por llevar su propia huella; se requiere esa aprobación expresa. No se ha emitido ni simulado tal aprobación en este expediente.

## 3. Firmar exactamente el recibo

Después de designar/aprobar la clave, ejecutar localmente:

```powershell
node 'C:\RC1-public\rc1-sign.cjs' sign 'C:\RC1-private\private.pem' 'C:\RC1-public\authorization.json' 'C:\RC1-public\authorization.sig'
```

La firma es binaria Ed25519 separada. No cambiar newline/BOM/espacios del recibo firmado. Entregar únicamente `public.pem`, `authorization.json` y `authorization.sig`, por ejemplo en un ZIP público, además de la aprobación explícita de huella. **No incluir private.pem, contraseñas ni directorios privados.** No firmar con los valores de test ni la autorización P01. El helper no necesita adjuntarse.

## 4. Preflight real y autorización de inicio

Con esos tres archivos públicos fuera del repo, el ejecutor verificará firma, pins y campos. Comando previsto desde la raíz del checkout, con NODE_OPTIONS vacío:

```sh
node --max-old-space-size=512 tools/research/wl-rc1/cli.cjs preflight docs/research/wl-rc1-cd/PILOT-CANDIDATE.json /absolute/rc1-public/authorization.json /absolute/rc1-public/authorization.sig /absolute/rc1-public/public.pem 466e1dc53f6d5f6f0fe144d85e7f65643b01244acabee5b8caaa25dd34df15ac APPROVED_DER_SPKI_SHA256
```

Las rutas de los archivos públicos se sustituyen por sus ubicaciones reales; campaña y destino del recibo no se cambian. APPROVED_DER_SPKI_SHA256 procede de la aprobación del propietario, no de una confianza automática en lo adjuntado. El preflight debe devolver signature=VALID, freeze_id y output_directory exactos, episodes_started=0 y pilot_started=false. Se reevalúan recursos/destino en ese momento; el snapshot anterior no los reserva.

Tras revisar ese resultado, el propietario deberá emitir autorización expresa de inicio de este piloto/identidad/destino. Entonces podrá usarse el comando run-pilot de PILOT_REQUEST.md, sin nuevos parámetros, reintentos ni campaña definitiva. Esta aprobación GATE-2 previa y la firma no se interpretan por sí solas como aquella orden posterior.
