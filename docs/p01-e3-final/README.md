# P01 — Registro público del cierre operacional E3

C1 publica evidencia documental de la campaña `p01-final-20261113-01`; no ejecuta E4.
Base verificada: `9a5d8ec203afcae17ee040048c9c6d5187a9db0f` (main posterior al PR #40).
El checkout histórico de E3 fue `6fcc698681514a90e1dcd28a0f926967b2304884`.

## Navegación

- [Informe operacional original íntegro](E3-operational-report.md).
- [Auditoría original íntegra](E3-audit-report.md), cuyo nombre fuente es audit-report.md.
- [Plan E4 original íntegro, sin ejecutar](E4-plan.md).
- [Manifiesto de integridad y procedencia](E3-evidence-manifest.json).
- [Estado de cierre, resultados y verificación C1](E3-closure-status.md).
- [Obtención y recuperación del expediente](RECOVERY.md).

## Preservación documental y referencias históricas

Los tres documentos originales se copiaron **byte a byte**: no se resumieron, corrigieron ni sustituyeron. Sus tamaños, SHA-256, fuentes y miembros del paquete se registran en el manifiesto. Este README y los documentos de estado/recuperación son contexto posterior separado.

**Todas las rutas `/workspace/...`, variables de rutas y enlaces relativos a evidencia dentro de esos originales son referencias históricas del entorno de ejecución, no enlaces públicos de GitHub.** Conservar su sintaxis original no publica esos destinos. Para acceder a la evidencia es necesario obtener el paquete externo y seguir RECOVERY.md. Los enlaces de navegación de este README sí apuntan a archivos públicos del expediente documental.

| Referencia conservada en el informe original | Localización dentro del paquete externo |
|---|---|
| ../p01-final-20261113-01/campaign.json | p01-final-20261113-01/campaign.json |
| ../p01-final-20261113-01/execution.jsonl | p01-final-20261113-01/execution.jsonl |
| E3-operational-result.json | p01-final-20261113-01-ops/E3-operational-result.json |
| source-sha256-manifest.json | p01-final-20261113-01-ops/source-sha256-manifest.json |
| preflight.json | p01-final-20261113-01-ops/preflight.json |
| snapshot-terminal.json | p01-final-20261113-01-ops/snapshot-terminal.json |
| copy-verify.json | p01-final-20261113-01-ops/copy-verify.json |
| check-after.json | p01-final-20261113-01-ops/check-after.json |

Los logs, recibo firmado y material público de autorización permanecen en el paquete externo; en este PR solo se publica su identificación por hash. No hay claves privadas ni datos voluminosos de episodios en Git. Un SHA-256 detecta diferencias respecto de una referencia conservada; no sustituye autenticación de origen o verificación científica.

## Antecedentes preservados

[Protocolo P01](../F6-A-pilot-protocol.md), [F6-B](../F6-B-report.md), [preparación F6-E](../F6-E-preparation.md), [F6-F](../F6-F-report.md), [hoja operacional](../E3-operational-integration.md) y [decisiones](../ENGINEERING_DECISIONS.md) conservan sus cortes históricos. Sus estados NOT EXECUTED o pendientes describen aquellas entregas; este expediente registra posteriormente E3_COMPLETE, sin reescribirlos ni cerrar E4/E5 o puertas normativas.
