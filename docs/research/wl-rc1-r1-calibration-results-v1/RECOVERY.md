# Recuperación de la calibración RC1-R1 v1

Archivo WL-RC1-R1-calibration-v1-evidence.tar.gz,239079bytes. SHA-256:

`e3c588f8cb1f66081283b13df7a198f5ee6e7429f814075d2241232841a4c8b3`

Contiene calibration-r1-v1/ (50originales exactos), operations/ (autorización, preflight, invocación única, stdout/stderr, inicio/cierre), analysis/ (inventarios, métricas, código de lectura y comprobaciones). No hay claves privadas. La firma de calibración no se debe reutilizar para un nuevo destino/ejecutor ni para repetirla.

Desde la raíz de un checkout que conserve el candidato/módulos aprobados, verificar checksum y extraer en **directorio nuevo**, fuera del repositorio/P01. No sobrescribir originales:

```bash
sha256sum docs/research/wl-rc1-r1-calibration-results-v1/WL-RC1-R1-calibration-v1-evidence.tar.gz
mkdir /tmp/rc1-calibration-v1-recovery
tar -xzf docs/research/wl-rc1-r1-calibration-results-v1/WL-RC1-R1-calibration-v1-evidence.tar.gz -C /tmp/rc1-calibration-v1-recovery
node tools/research/wl-rc1-r1-calibration/cli.cjs verify /tmp/rc1-calibration-v1-recovery/calibration-r1-v1
```

Esperado: VERIFIED/COMPLETE,216muestras, cero errores,12journals, cero fases abiertas. El campo P1_P8_executed=true distingue ejecución de perfiles de fixtures; **no significa que se ejecutaron los ocho perfiles**, solo P1/P3/P7 en las operaciones publicadas.

Para recalcular resultados desde el archivo sin ejecutar WORLD/replay:

```bash
node docs/research/wl-rc1-r1-calibration-results-v1/analyze.cjs /tmp/rc1-calibration-v1-recovery/calibration-r1-v1 /tmp/rc1-calibration-v1-recomputed "$PWD"
python docs/research/wl-rc1-r1-calibration-results-v1/verify_arithmetic.py /tmp/rc1-calibration-v1-recovery/calibration-r1-v1 /tmp/rc1-calibration-v1-recomputed
node docs/research/wl-rc1-r1-calibration-results-v1/verify_structures.cjs /tmp/rc1-calibration-v1-recovery/calibration-r1-v1 "$PWD"
```

El output de análisis debe ser nuevo: los archivos se abren con exclusión de sobrescritura. Comparar summary/processes/modality/journal-perturbation/balanced-modality/balanced-journal con los publicados en data/; samples.json completo está en el export junto a las216filas CSV. No modificar el original para hacer coincidir una comprobación.

analyze.cjs usa los estimadores congelados y codec, lee/decomprime testigos y compara estructuras completas. verify_arithmetic.py implementa separadamente las fórmulas con biblioteca estándar Python. Ninguno ejecuta episodios, workers ni replay. No confundir recalcular datos archivados con repetir la calibración.

La copia y exportación se verificaron localmente; no se declara respaldo externo recibido ni interoperabilidad independiente. Las rutas históricas dentro de los registros no son enlaces públicos. Ante discrepancias, preservar y reportar; no reconstruir ni reemplazar evidencia.
