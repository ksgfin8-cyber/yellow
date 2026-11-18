# Recuperación de pruebas RC1-R1

Estas son pruebas de preparación, no datos de un nuevo piloto. No contienen perfiles P1–P8 ejecutados, autorización del propietario ni clave privada.

- Archivo: [R1-validation-evidence.tar.gz](R1-validation-evidence.tar.gz), 22390 bytes.
- SHA-256: `dd2c524e3a547200107dd2e6c4253b0ed97a2e0e98a0ecc823f902325337088e`.
- [Checksum](R1-validation-evidence.tar.gz.sha256).
- Identidad R1: `e42a86ff8adcac7a05ccd5c41878b4775d06040aaa5056021ddd8a026efa3721`.

Verificar el hash antes de extraer en un directorio nuevo fuera del repositorio. No sobrescribir archivos originales. Desde la raíz del checkout:

```bash
sha256sum docs/research/wl-rc1-r1/R1-validation-evidence.tar.gz
mkdir /tmp/rc1-r1-review-restored
tar -xzf docs/research/wl-rc1-r1/R1-validation-evidence.tar.gz -C /tmp/rc1-r1-review-restored
node tools/research/wl-rc1-r1/cli.cjs verify /tmp/rc1-r1-review-restored/pair
```

Resultado observado al recuperar la entrega: VERIFIED, package_status COMPLETE, ocho muestras, cero errores, dos journals completos y cero etapas abiertas; scientific_acceptance=false. Las ocho muestras son dos workers tick 2×2/T2 con cuatro llamadas cada uno, no la matriz propuesta ni datos para su estimador primario de cinco warm.

Contenido adicional:

| Directorio | Propósito y resultado esperado |
|---|---|
| hang-PREPARE, hang-EXECUTE | Paradas sintéticas por tiempo; PARTIAL, última etapa abierta correspondiente, sin retry |
| error | Error sintético de preparación; PARTIAL, una sola unidad iniciada |
| blocked-controller | Watchdog al bloquear la verificación; sin envelope, PARTIAL_UNSEALED |
| rss | Umbral sintético RSS=1 byte; parada explícita PARTIAL |
| missing-samples | Fixture adversaria done sin muestras; outer PARTIAL, verify rechaza incomplete samples |
| candidate.json | Candidato exacto de las pruebas finales; igual al publicado R1-CANDIDATE.json |

Los fallos intencionales no deben reinterpretarse como científicos ni repararse para que aparezcan completos. Los JSONL/guardian y manifest conservan el detalle. `verify` lee el paquete sin reconstruir WORLD ni ejecutar replay; puede utilizarse sobre los directorios anteriores, esperando el estado indicado.

Se excluyeron el directorio restaurado corrompido intencionalmente y el recibo/firma/clave pública efímeros del test de autenticación. Su clave privada fue únicamente un objeto en memoria durante el test; no se generó una clave del propietario. Los logs completos de las cuatro revisiones del harness están en [validation/](validation/). Rutas `/tmp` y `/workspace` registran ubicaciones históricas, no enlaces públicos.

El archivo nuevo puede regenerarse como evidencia de pruebas solo en una nueva revisión identificada; esta entrega conserva exactamente sus bytes publicados. No regenerar ni tocar por ello el archivo científico v1. Su SHA permanece `04d6c0db808d73fdfca4e856df0a5f0b5d12d0f808ebd0c327d6c3f2718faa34`.
