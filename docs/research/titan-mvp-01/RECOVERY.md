# TITAN-MVP-01 — recuperación de evidencia G1

Paquete [TITAN-MVP-01-G1-development-evidence.tar.gz](TITAN-MVP-01-G1-development-evidence.tar.gz),230497bytes. SHA-256:

`f5e8bfd1999c1028f4ab2a95e0b5678972b5df1914c6723d1ff6b4c263326fcf`

[Checksum](TITAN-MVP-01-G1-development-evidence.tar.gz.sha256), [inventario del export](EVIDENCE_EXPORT.json). Contenido: development-smoke-01/ (15originales), implementation-evidence/ (test log, operaciones, esfuerzo, verificación y análisis) y review/ (código de análisis, hashes, resultados y propuesta G2). No contiene claves privadas. No prueba recepción de backup externo.

Desde la raíz del checkout de esta implementación, verificar hash y extraer en **directorio nuevo**, fuera del repositorio/P01/RC1; no sobrescribir originales:

```bash
sha256sum docs/research/titan-mvp-01/TITAN-MVP-01-G1-development-evidence.tar.gz
mkdir /tmp/titan-mvp01-g1-recovered
tar -xzf docs/research/titan-mvp-01/TITAN-MVP-01-G1-development-evidence.tar.gz -C /tmp/titan-mvp01-g1-recovered
node tools/titan-mvp-01/cli.cjs check docs/research/titan-mvp-01/DEVELOPMENT_CANDIDATE.json
node tools/titan-mvp-01/cli.cjs verify /tmp/titan-mvp01-g1-recovered/development-smoke-01
```

Esperado: COMPLETE,15archivos,12entradas y12COMPLETE_MATCH; evaluación120 no ejecutada. `verify` realiza reproducción técnica de acciones/estados con el mismo motor, no120episodios científicos ni interoperabilidad independiente. Incluye validar inicialización desde semilla, trayectorias y bytes WORLD/FULL, y regenerar decisiones desde los feedbacks archivados, sin paso terminal extra.

Para recalcular solo métricas/diagnósticos desde los archivos, sin ejecutar WORLD ni agentes:

```bash
node docs/research/titan-mvp-01/analyze_development.cjs /tmp/titan-mvp01-g1-recovered/development-smoke-01 "$PWD" > /tmp/titan-mvp01-g1-results.json
```

Comparar el resultado con DEVELOPMENT_RESULTS.json: contiene12filas completas,4pares TITAN iguales y1280diagnósticos verificados. Las15fuentes del smoke se compararon byte a byte al copiar y al restaurar el export; el manifest cubre los archivos de cada intento y el candidato. No editar/normalizar datos para superar una discrepancia. Un `.partial`, intento fallido o directorio sin manifest terminal no es un smoke completo y se preserva como evidencia de fallo.

Los archivos `.json.gz` son transporte lossless Map/BigInt/binary64 con checksum, **no** una nueva serialización canónica WLS1. La configuración/resultado/sidecar/WLS1 están en payload.episode, separados de metadatos host/UUID/recursos de operación. No unir repeticiones deterministas como muestras nuevas. Las rutas /tmp y /workspace de registros son referencias históricas, no enlaces públicos.

No utilizar estos comandos como permiso para ejecutar la evaluación2001–2012. El harness actual los rechaza; G2 requiere revisión, controles y orden expresa nueva.
