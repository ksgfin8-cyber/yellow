# VERSIONING_DECISION_REPORT — F5-D

**Decisión D: HOLD — INSUFFICIENT AUTHORITY OR UNRESOLVED CRITICAL CONTRADICTION.**
Aquí el motivo efectivo es **autoridad insuficiente**, no una contradicción crítica
actual demostrada. No hay nueva versión asignada ni autorización normativa/productiva.

## Evaluación comparada

| Alternativa | Completitud/consistencia | Verificabilidad e independencia | Compatibilidad y evidencias | WLS1/replay | Riesgo/coste/oportunidad/reversibilidad |
|---|---|---|---|---|---|
| A: seguir sobre v0.2.6 sin consolidar | Conserva contratos pero no resuelve referencias ausentes ni interpretación dispersa | No permite cerrar aceptación integral con fuentes actuales | Sin ruptura; evidencias existentes conservadas | Sin cambios | Poco coste inmediato, alto coste recurrente de interpretación; reversible, insuficiente para misión |
| B: edición autocontenida equivalente | Adecuada **solo** si fuente/argumentos cierran todas las obligaciones y prueban equivalencia | Facilita implementación independiente y pruebas contra texto único | Máxima continuidad; conservar origen y supersesión, no reescribir historia | Bytes y comportamientos idénticos dentro del dominio probado | Trabajo documental/revisión, riesgo de omitir cláusulas al consolidar; poca regresión física si equivalencia real; alta reversibilidad |
| C: revisión contractual acotada | Adecuada si quedan alternativas observables delimitadas tras recuperar fuente | Hace contrastables ABI, orden y capacidad si se especifican de forma completa | Puede requerir migración de consumidores/esperados nuevos; conservar baseline anterior | No presupone cambiar WLS1; revisar efectos sobre trayectorias/replay | Coste focalizado y riesgo de regresión donde cambia semántica; viable si cambios acotados, no probado hoy |
| D: nueva línea base sustantiva | Solo justificada por conjunto significativo de cambios necesarios | Reinicia parte del aseguramiento y requiere explicar rupturas | Mayor riesgo de perder comparabilidad experimental si no se preserva genealogía | Evaluar formato y replay por cambio, no cambiarlos por versión nominal | Mayor coste y demora de investigación; no hay evidencia actual que justifique ruptura; reversión más costosa |
| E: recuperar fuentes identificadas, reconciliar y luego elegir B o C | Conserva incertidumbre visible y evita inventar reglas recuperables | Fuente→contrato→oráculo antes de cambiar motor | Preserva historia y evidencias; puede descubrir divergencias que sí exijan corrección | WLS1 recuperado se mantiene salvo contradicción demostrada | Opción preferida de preparación; coste de lectura/revisión acotable por fuentes concretas, reversible; dependencia real del responsable |

## Recomendación y condiciones que la refutan

Elegir ahora E como procedimiento y **HOLD como puerta final**. Obtener EXT-024 y,
según sus referencias, EXT-023; reconciliar primero. No convertir esta dependencia
en una búsqueda infinita: cada búsqueda adicional debe tener referencia concreta.
Tampoco declarar recuperación agotada cuando el documento identificado aún no se
ha proporcionado. Conservar núcleo computacional salvo divergencia demostrada.

- Si las fuentes completas cierran semántica y se demuestra equivalencia, recomendar
  **A de la puerta solicitada: GO — EQUIVALENT CONSOLIDATION**. Edición consolidada
  equivalente de v0.2.6 identificada por versión editorial/hash, sin alterar física.
- Si tras recuperación quedan precisiones observables acotadas y compatibles con
  capacidades/formato, recomendar **B: CONDITIONAL GO — LIMITED NORMATIVE REVISION**,
  con sustituciones/compatibilidad y expectativas revisadas explícitas.
- Solo evidencia de cambios sustantivos necesarios justificaría **C: CONDITIONAL GO
  — NEW NORMATIVE BASELINE**. Un número de versión no prueba esa necesidad.

Una fuente auténtica que contradiga orden energético, schemas o tratamiento temporal
refutaría la propuesta de conservarlos por equivalencia y exigiría análisis de
impacto. Una demostración de que todos los contratos ya están completos y vigentes
refutaría HOLD. Un defecto productivo contrario a obligación determinada justificaría
corregir ese componente, no automáticamente rediseñar la arquitectura.

## Estado de los problemas y riesgos

No se ha demostrado una nueva contradicción **irreconciliable vigente**. Las
contradicciones/insuficiencias históricas de contadores INVALID, origen positivo y
contexto insuficiente tienen disposiciones SUPERSEDED por D-01 en la matriz.
INIT-004 permanece aclaración autorizada. La variante failure_details en §20.1
(esquema general con seed frente rama de agente sin seed) se registra como
ambigüedad de esquema, no como contradicción imposible: una unión por rama podría
resolverla sin cambiar ejecución, pero debe comprobarse con fuente y criterio.

No se declara IMPLEMENTATION_DIVERGENCE contra una obligación completamente
determinada sin evidencia suficiente. OBS-P03 sí demuestra limitación operacional:
radio512 válido en config lanza RangeError por64MiB estimados. Falta decidir si el
contrato admite ese fallo; no reducir silenciosamente radio ni afirmar soporte
completo. F5-D no corrige esa capacidad ni crea otra materialización.

| Prioridad | Efecto real | Acción propuesta |
|---|---|---|
| P0 funcional | Ninguno nuevo demostrado | No inventar un fallo sistémico por ausencia de fuente |
| P1 autoridad | Fuente obligatoria identificada no suministrada; bloqueo de equivalencia/aceptación | Recibir/reconciliar EXT-024/023 |
| P1 resultados/interoperabilidad | Orden energético/ABI/eventos/stock parcialmente determinados; capacidad operacional | Resolver desde fuentes antes de escoger política; contraejemplos en decisiones |
| P1 para declaración de conformidad | §37 exige corpus no definido íntegramente en entorno;289BLOCKED no son PASS | Conservar estados; aprobación futura expresa si se modifica criterio |
| P2 mantenimiento | Texto fragmentado, localizadores/clases JS confundibles con semántica | Consolidación trazable y libertad de representación interna |

## Impacto mínimo y evidencia futura

Si las fuentes confirman semántica actual, el cambio puede ser exclusivamente
documental. Si no: acciones pueden afectar world.js, ActionResult y consumidores;
proyección afecta Observation/Feedback/agentes/validadores; eventos afectan Recorder/
replay; capacidad puede exigir política aprobada o cambio focalizado de observación.
Ninguno se ejecuta ahora. No hay motivo demostrado para cambiar PRNG, WLS1 o arquitectura.

Antes de aprobación normativa: recepción/procedencia y aplicabilidad de fuentes;
identificación de cada obligación desconocida; cierre de dominios/pre/post/orden/
errores; prueba de equivalencia o lista explícita de cambios; revisión de contrapuestos;
corpus/oráculos independientes fijados antes de contraste; impacto sobre compatibilidad;
ninguna dispensa por falta de implementación/prueba; decisión del responsable
sobre texto y criterio. Después, otra orden autorizará cambios productivos necesarios.

## Aseguramiento proporcional

29148 orienta claridad/dominio/trazabilidad; IEEE1012 separa verificación contractual
de validación para uso previsto y nivel de independencia; NASA Handbook orienta
trazabilidad bidireccional, configuración y discrepancias. No se afirma cumplimiento
formal ni se exige una demostración universal por contar líneas o PASS. El usuario
puede investigar dentro de un perfil declarado mientras conformidad integral sigue
HOLD: conservar versiones/config/semillas/fallos y límites de inferencia, especialmente
una entidad y hazards estáticos. Hito C requiere contraste independiente adicional;
F5-D no inicia una segunda implementación.
