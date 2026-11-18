# RC1-R1 — instrumento diagnóstico separado

Estado y evidencia: [informe R1](../../../docs/research/wl-rc1-r1/REPORT.md). El instrumento v1 permanece intacto. Ningún comando de piloto está autorizado por esta entrega.

Desde la raíz del repositorio:

```bash
node tools/research/wl-rc1-r1/cli.cjs plan
node tools/research/wl-rc1-r1/cli.cjs check docs/research/wl-rc1-r1/R1-CANDIDATE.json
node --max-old-space-size=512 --test tests/wl-rc1-r1.test.cjs
```

`plan` enumera condiciones sin ejecutarlas. `check` compara el candidato, las fuentes protegidas de main/PR51, el protocolo, el nuevo instrumento y el binario Node. Las pruebas ejecutan fixtures pequeños y fallos sintéticos, nunca el plan P1–P8.

Recuperación del paquete de validación publicado: verificar su SHA-256, extraer en un directorio nuevo y ejecutar:

```bash
node tools/research/wl-rc1-r1/cli.cjs verify /ruta/nueva/pair
```

`verify` lee archivos, no ejecuta WORLD ni replay. Los paquetes sintéticos de parada conservan PARTIAL o PARTIAL_UNSEALED; `missing-samples` debe rechazarse. El candidato archivado identifica exactamente las fuentes de la validación final.

Una futura aprobación R1 necesitaría nuevo recibo cerrado con `format=WL-RC1-R1-AUTHORIZATION-1`, `decision=AUTHORIZE_RC1_R1_DIAGNOSTIC_ONLY`, `freeze_id`, `campaign_id`, `output_directory` absoluto nuevo fuera del repositorio/P01 y `owner_reference`. Firma Ed25519 sobre el prefijo UTF-8 `WL-RC1-R1-AUTHORIZATION-1` más LF, concatenado con los bytes originales del recibo. Clave/pin e identidad deberán ser aprobados para ese uso. No generar claves reales aquí ni usar el recibo v1.

La interfaz futura, **documentada pero no ejecutada**, es:

```text
node --max-old-space-size=512 tools/research/wl-rc1-r1/cli.cjs preflight <candidate> <receipt> <signature> <public-key> <approved-R1-freeze-pin> <approved-key-pin>
```

Requiere Linux/proc, Node y hash del runtime coincidentes, NODE_OPTIONS vacío, recursos disponibles y destino inexistente. Después de preflight haría falta autorización expresa de inicio para `run-pilot` con esos mismos seis argumentos. No existe modo RC1-E ni de reintento v1. Un proceso nuevo por operación reconstruye cada fixture; no se clona historial privado ni se reemplazan métodos de producción.

`worker` separa las fases mediante `journal`; `session` reutiliza almacenamiento/guardian v1 y mantiene vigilancia durante el sellado/verificación de data. El envelope terminal de raíz determina el estado global. Consultar límites de filesystem, atribución y perturbación en el protocolo: las ventanas no prueban causalidad y la escritura final del envelope no garantiza tolerancia a pérdida del host.
