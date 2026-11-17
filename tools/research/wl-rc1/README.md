# Instrumento específico WL-RC1-C/D

Sujeto inmutable: main posterior a PR48. No modifica el motor ni importa episodios P01. [Protocolo](../../../docs/research/wl-rc1-cd/PROTOCOL.md), [condiciones](../../../docs/research/wl-rc1-cd/conditions.json), [solicitud del piloto](../../../docs/research/wl-rc1-cd/PILOT_REQUEST.md).

Desde la raíz del repo, con Node fijado por el candidato y NODE_OPTIONS vacío:

```sh
node tools/research/wl-rc1/cli.cjs plan
node tools/research/wl-rc1/cli.cjs check docs/research/wl-rc1-cd/PILOT-CANDIDATE.json
node --test tests/wl-rc1-cd.test.cjs
```

`plan` y `check` no generan mundos. La suite ejecuta fixtures pequeños y procesos sintéticos de parada, no P1–P8. `validate <candidate> <NEW-directory>` está limitado a exactamente dos workers de validación2×2/T2, una pareja MINIMAL/DETAILED; no permite override de perfil/seed/repeticiones. No confundirlo con un piloto. Cada ejecución técnica crea su propio destino; no sobrescribe ni reintenta.

El piloto solo se ejecuta con `run-pilot` tras firma y pins aprobados, en Node parent heap512MiB, workers256MiB, con plan48 fijo. No existe entrada para una campaña definitiva RC1-E. El recibo debe tener decisión AUTHORIZE_RC1_PILOT_ONLY y freeze_id coincidente, firma Ed25519 sobre prefijo de dominio + bytes exactos, huella pública SHA256 DER-SPKI aprobada separadamente. La aprobación de una clave no se deriva de la propia firma ni de un booleano. Operador con control del código puede eludir herramientas: no se promete sandbox hostil ni autenticación de identidad civil.

## Preservación y recuperación

Cada muestra se guarda incrementalmente como JSONL, con units/versiones y referencia a testigo `.json.gz` íntegro. Sus contenidos incluyen estados/acciones/eventos/relojes/RNG/bytes cuando son aplicables. La deduplicación conserva contenidos completos; el digest es de JSON tipado sin comprimir y el inventario además fija SHA de cada archivo comprimido. stdout/stderr son binarios acotados; un exceso detiene, conserva prefijo y cuenta omisiones explícitas. Guardian escribe evidencia de stops independientemente del event loop del controlador. No se archiva clave privada ni se solicita para ejecutar/verificar.

```sh
node tools/research/wl-rc1/cli.cjs verify /absolute/RC1-package
# Copiar solo a un destino NUEVO; no usar directorios P01:
cp -a /absolute/RC1-package /absolute/RC1-restored-new
node tools/research/wl-rc1/cli.cjs verify /absolute/RC1-restored-new
```

Comparar freeze_id con el candidato aprobado, comprobar el candidato con `check` y conservar externamente SHA256 de manifest.json/paquete. `verify` comprueba inventario completo, archivos y testigos/codec/unidades; VERIFIED significa integridad de transporte, **scientific_acceptance=false**. No demuestra por sí solo firma/autoría de todo el archivo ni ciencia válida. Sin manifiesto terminal informa PARTIAL_UNSEALED: conservar originales y guardian/raw logs, no regenerar un inventario que aparente cierre. No hay reanudación/reintento automático.

Los [fixtures publicados](../../../docs/research/wl-rc1-cd/VALIDATION_REPORT.md) permiten recuperación sin conversación previa. Las rutas /tmp o /workspace de los logs son referencias históricas locales, no enlaces públicos ni respaldo externo. Una copia dentro del workspace no es respaldo independiente; exportar después a destino autorizado y confirmar recepción/hash antes de declarar esa preservación externa. No aplicar automáticamente la recepción C2 de P01 a RC1.

Se requiere mantener las fuentes sin ediciones concurrentes durante cada ejecución. Las verificaciones de archivos no son un snapshot atómico del filesystem; comprobar también el candidato después del piloto y mantener HOLD de interpretación si cambia identidad. No mezclar resultados de identidades distintas.
