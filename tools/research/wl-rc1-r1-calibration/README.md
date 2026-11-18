# Preparación de calibración RC1-R1

[Expediente y estado](../../../docs/research/wl-rc1-r1-calibration/REPORT.md). Instrumento separado; no modifica fuentes congeladas ni autoriza ejecutar perfiles P1–P8.

```bash
node tools/research/wl-rc1-r1-calibration/cli.cjs plan
node tools/research/wl-rc1-r1-calibration/cli.cjs check docs/research/wl-rc1-r1-calibration/CANDIDATE.json
node --max-old-space-size=512 --test tests/wl-rc1-r1-calibration.test.cjs
```

Plan/check no cargan WORLD. Los tests solo usan fixtures2×2/T2, firmas efímeras y fallos sintéticos. `verify <bundle>` lee el archivo sin ejecutar transiciones. Consultar el protocolo y AUTHORIZATION_AND_RECOVERY.md para preflight firmado y futura ejecución: no hay autorización real en esta entrega. El recibo de piloto v1/R1 no funciona para calibración.

La matriz24 es cerrada y usa ambas modalidades/SYNC-OFF; no expone filtros ni parámetros para llegar al piloto128. El controlador local incorpora validación incremental y completitud antes de la siguiente unidad, cuya necesidad está demostrada en AUD-C01. El worker reutiliza operaciones/measure/codec originales; SYNC importa el journal R1 y OFF elimina su persistencia manteniendo los wrappers. Comparaciones de rendimiento siguen pendientes.
