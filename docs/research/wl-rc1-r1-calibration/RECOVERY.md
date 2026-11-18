# Evidencia de preparación — recuperación por lectura

Paquete PREPARATION_EVIDENCE.tar.gz,43069bytes; SHA-256:

`89b5a2b28bae34f987134f08084bd161dfd32930db4e115c750ca0d0e49fdee7`

```bash
sha256sum docs/research/wl-rc1-r1-calibration/PREPARATION_EVIDENCE.tar.gz
mkdir /tmp/calibration-preparation-restored
tar -xzf docs/research/wl-rc1-r1-calibration/PREPARATION_EVIDENCE.tar.gz -C /tmp/calibration-preparation-restored
node tools/research/wl-rc1-r1-calibration/cli.cjs verify /tmp/calibration-preparation-restored/tiny
```

Esperado para tiny: VERIFIED, COMPLETE,16muestras, cero errores,2journals y P1_P8_executed=false. El candidato incluido coincide con CANDIDATE.json. No se ejecuta WORLD ni replay al verificar. Para validar identidad con el checkout/runtime, usar `check` sobre el candidato publicado.

Otros directorios son **fallos sintéticos intencionales**:

- CHILD_TIMEOUT: PARTIAL, checkpoint PREPARE abierto y ninguna segunda unidad.
- RSS_LIMIT: PARTIAL, límite RSS ficticio de1byte, no una medición del presupuesto real.
- blocked-controller: PARTIAL_UNSEALED; watchdog mata el controlador durante la verificación. Conservar sin fabricar envelope.
- early-new: PARTIAL; done incompleto rechazado antes de iniciar la siguiente unidad. Sin muestras esperadas completas.
- late-old: reproducción del defecto AUD-C01 en el controlador R1 congelado; dos inicios y rechazo final. Su verificador R1 debe rechazar las muestras incompletas; **no** usar el verificador de calibración para convertirlo en paquete válido.

No interpretar estas carpetas como campañas o resultados científicos, ni repararlas para producir éxito. Logs de ambas revisiones nuevas y suite R1 están en validation/. Se omitieron el directorio de copia corrompido deliberadamente, claves públicas/recibos/firmas efímeros de test y cualquier material privado. Las claves privadas de prueba no se escribieron a disco.

Las rutas /tmp y /workspace que figuran en los logs son históricas; no prueban disponibilidad externa. La recuperación aquí documentada demuestra copia local verificable de las pruebas, no C2 ni una nueva aceptación experimental.
