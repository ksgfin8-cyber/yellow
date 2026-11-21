# TITAN-MVP-01 — Verificación independiente de equivalencia D4

Fecha de corte: **2026-11-20 (America/Guayaquil)**. Base auditada: `f814c3adead596cbb01f753fe07cc1df176a827b` (PR #59 integrado). Resultado: **FINITE_DIFFERENTIAL_PASS / SEQUENTIAL_PASS**. G2 permanece **HOLD**, sin autorización de ejecución.

## Pregunta, autoridad y método

Se ejecutó el contraste definido por [EQUIVALENCE_ANALYSIS.md](EQUIVALENCE_ANALYSIS.md), que conserva íntegramente su estado y contenido históricos. La conclusión analítica sigue siendo `ANALYTIC_RESULT_UNDER_D4`; este informe posterior añade evidencia computacional, sin convertirla en validación de TITAN v0.1/v0.3.

El [oráculo externo de prueba](../../../tests/oracles/titan-direct-priority.cjs) implementa dos recorridos N/E/S/W: primer RESOURCE no consumido; en su ausencia, primer FREE no visitado; en su ausencia, WAIT. No importa TITAN, sus funciones, costos, Φ, L ni selector. Ambos controladores mantienen memoria separada. El oráculo no se registra como agente del producto y no constituye un nuevo algoritmo científico aprobado.

La [suite](../../../tests/titan-equivalence.test.cjs) cubre las siete clases cardinales y las **2.401 combinaciones**. La geometría rectangular de cada fixture respeta sus bordes; la memoria se establece mediante feedback de visitas cardinales observadas y eventos crudos de consumo, sin inyectar conjuntos privados. Las historias de preparación son controles forzados físicamente realizables, **no trayectorias autónomas del agente**. No se afirma que cada combinación sea alcanzable por el generador o por la política autónoma.

## Evidencia ejecutada

Comando: `node --test tests/titan-equivalence.test.cjs`.

| Caso local | Criterio | Resultado |
|---|---|---|
| EQ-01 | 7⁴ combinaciones, acción y memoria iguales, sin mutación del feedback | PASS |
| EQ-02 | Cuatro direcciones, empates, recurso sobre FREE, hazards/bloqueos, ausencia de oportunidad | PASS |
| EQ-03 | Solo posición observada añade visited; solo evento añade consumed; reset vacía memoria | PASS |
| EQ-04 | Dos controladores distintos en integración real breve; acciones, estados, eventos y bytes WLS1 | PASS |
| EQ-05 | Fuente TITAN intacta; oráculo externo al registro de producto | PASS |

**5 pruebas aprobadas, 0 fallos; 7.903 comparaciones de feedback; divergencias observadas: 0.** El registro conserva cualquier primer punto divergente si una ejecución futura falla; la ejecución archivada tiene lista vacía. [Resultado íntegro](equivalence-evidence/results.json), [salida real](equivalence-evidence/tests.log), [dos resultados de integración](equivalence-evidence/integration.json).

Integración: semilla de desarrollo **1**, mundo **4×4**, radio1, horizonte12; **12 acciones y 13 estados por controlador**, 26 pares de bytes WORLD/FULL. Se usa el mismo motor, semilla y configuración física. Difiere el identificador externo de controlador (`titan_mvp_01` / `direct_priority_test_oracle`); no se afirma igualdad de esa etiqueta ni de toda la configuración/metadata. Es una prueba técnica autorizada, sin selección de episodios G2 ni pretensión de muestra científica.

SHA-256 TITAN sin cambios: `87893e2c57f5d5a55629e2a47d6db8bfa4e9c57063b8a6cabeb1475ae524483b`.
SHA-256 oráculo: `e938b5f665b0458907257b67c166403156c30acddd2f73037876b09d11139692`.

## Conclusión y límites

El resultado ejecutado respalda la equivalencia de la operacionalización D4 con la regla directa en este dominio finito, las secuencias comprobadas y la integración breve. No se encontró ventaja conductual distintiva frente a esa regla. No refuta ni valida la teoría TITAN, no acredita todos los inputs JavaScript o todas las historias posibles, y no demuestra interoperabilidad entre motores independientes. Rendimiento relativo, productividad y evaluación científica de120 episodios: **NOT_EVALUATED**.

No se modificaron TITAN, sus costos, las siete fuentes aprobadas, las fuentes matemáticas, WORLD, contratos ni protocolos. No se ejecutaron semillas2001–2012. Cualquier nueva pregunta científica exige diseño previo y autorización separada; no se altera G2 después de observar desarrollo.
