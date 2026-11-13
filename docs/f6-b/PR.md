Implementa P01 sobre el motor aprobado en 59bd859, con FrontierMemory-v1, un worker aislado por episodio, transporte operacional sin pérdida y métricas puras. WORLD, PRNG, Recorder, Replay, WLS1, baselines y especificaciones permanecen intactos.

La campaña de desarrollo usa solo semillas 1–4: 32 episodios (16 primarios y 16 repeticiones). Cada archivo se recupera y verifica mediante replay completo; se comparan estructuras y bytes WLS1. El candidato de congelación fija fuentes, protocolo, parámetros, métricas, pruebas y evidencia. No autoriza evaluación 1001–1032.

Validación: 35 pruebas nuevas, 511 anteriores y cuatro comprobaciones de aceptación smoke. Corpus F5-B: 114 PASS y 289 BLOCKED, sin cambios; legacy: 13 PASS y nueve fallos conocidos. El verificador documental F5-D mantiene su rechazo histórico de rutas posteriores; no se amplía para producir PASS.

Detalles, costes observados, resultados descriptivos y límites: docs/F6-B-report.md. Evidencia y candidato: docs/f6-b/. No se declara conformidad canónica, interoperabilidad independiente ni resultado de la hipótesis final. Se conserva una campaña previa completa y el fallo de exportación detectado al congelar; se corrigió y repitió todo el smoke sin cambiar la política. Los 32 payloads coinciden entre campañas. No realizar merge automático.
