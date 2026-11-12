# UNRESOLVED_DECISIONS — F5-D

**DRAFT / UNAPPROVED / NON-NORMATIVE.** DEC-G06 is resolved in scope, not a new semantic choice.

Norma, código, pruebas y decisión se separan por contrato en [matriz](contract-reconciliation.json). No se adopta una recomendación por estar ya implementada. La fuente externa identificada tiene prioridad sobre elegir una política nueva.


<a id="dec-g00"></a>
## DEC-G00 — EXTERNAL_SOURCE_REQUIRED

Prioridad: P1. Contratos: WL-R-AUTH, WL-R-SCOPE, WL-R-CELL, WL-R-MAP, WL-R-LIFECYCLE, WL-R-REPLAY-ORIGIN, WL-R-REPLAY-ATOMIC, WL-R-REPLAY-INVARIANT, WL-R-INVARIANTS, WL-R-INVARIANTS-LEGACY, WL-R-PSEUDOCODE, WL-R-REPRO, WL-R-TERMS.

**NORMA disponible:** S025 §§1.3/3/25.4/31/35/39/37 incorporan historia. F5D-001 identifica un manuscrito v0.2.4 externo y una pista v0.2.3.

**Información ausente:** Texto/procedencia de I54–I66, §25.9 y §36 anunciados; I01–I53, glosario/exclusiones/reproducibilidad/agentes y demás cláusulas completas según lo que realmente entreguen las fuentes.

**Alternativas:** Recibir copia verificable y reconciliar antes de decidir cambios; Si la recuperación concreta fracasa, proponer reemplazo explícito completo por autorización posterior

**Diferencias observables:** La fuente puede añadir obligaciones o contradecir políticas y cambiar la alternativa de versionado. No puede asumirse que todos los IDs sean requisitos distintos ni duplicados.

**Recomendación:** Priorizar la fuente identificada; mantener HOLD de equivalencia global y no aprobar ahora un reemplazo especulativo.

**Qué la refutaría:** Una copia íntegra con procedencia y ámbitos vigentes que cierre referencias permitiría abandonar HOLD; si demuestra ruptura necesaria, reevaluar línea base.

**Impacto potencial:** Sin cambios productivos ahora; análisis de impacto después de cotejar fuente. No renombrar ni alterar tests históricos.

**Aprobación:** Recuperación/consolidación equivalente no elige semántica nueva; cualquier sustitución requiere aprobación expresa.

**Compatibilidad aprobada:** ninguna propuesta revoca D-01, INIT-004 ni altera contratos determinados. Ingeniería autorizada de implementación no se presenta como fuente histórica completa.

**CÓDIGO/PRUEBAS:** See per-requirement implementation/evidence refs in contract-reconciliation.json; not authority.

<a id="dec-g01"></a>
## DEC-G01 — PARTIALLY_DETERMINED

Prioridad: P1. Contratos: WL-R-ENERGY, WL-R-ACTION-MOVE, WL-R-ACTION-RESULT, WL-R-ACTION-ENERGY.

**NORMA disponible:** §13 fija ActionResult, precedencia MOVE, fronteras y delta binary64. HINLINE fija lifecycle≤. F2-H preserva semántica existente de WAIT y efectos, sin recuperar todo el contrato de acciones.

**Información ausente:** Esquema/enums ActionResult, financiación del coste, orden aritmético, delta efectivo/nominal y casos WAIT negativos.

**Alternativas:** Recuperar §§13/18 originales; Si persiste indeterminación, coste previo/delta efectivo con rechazo sin mutación; Otras políticas explícitas de financiación/delta, con cambios de consumidores y evidencia propios

**Diferencias observables:** Con energía2^53,coste1,recurso1: coste→efecto deja2^53; efecto→coste deja2^53−1. WAIT sobre MAX_VALUE coste1 puede conservar energía: delta efectivo0 frente nominal−1. Son deducciones binary64, no tests nuevos ejecutados.

**Recomendación:** Esperar fuente antes de seleccionar. Si no determina la regla, preferir coste previo para que el recurso de destino no financie un paso no pagable, y delta efectivo para reconciliar estado/resultado. La razón es semántica contable, no conservar código.

**Qué la refutaría:** Fuente vigente que exija efecto primero/delta nominal, o intención experimental explícita de financiación por recurso, refutaría esta selección.

**Impacto potencial:** world.apply_action, ActionResult, Feedback y validadores/esperados de trayectorias si cambia la política; conservar regresiones como evidencia de la política anterior.

**Aprobación:** Sí para selección observable no recuperada; no para reproducir una regla histórica auténtica.

**Compatibilidad aprobada:** ninguna propuesta revoca D-01, INIT-004 ni altera contratos determinados. Ingeniería autorizada de implementación no se presenta como fuente histórica completa.

**CÓDIGO/PRUEBAS:** See per-requirement implementation/evidence refs in contract-reconciliation.json; not authority.

<a id="dec-g02"></a>
## DEC-G02 — PARTIALLY_DETERMINED

Prioridad: P1. Contratos: WL-R-DYNAMICS.

**NORMA disponible:** §15 llama regenerate_resources sin eventos; §35.6 S1 permite regeneración mismo tick con tasa≥1; stock binario/tasa uint32 conocidos.

**Información ausente:** Fórmula/unidad de tasa y tratamiento temporal completo.

**Alternativas:** Recuperar §15 y definiciones de recurso; si siguen incompletas, evaluar reposición binaria inmediata frente a otra interpretación temporal expresamente definida.

**Diferencias observables:** Reposición inmediata permite un recurso disponible al tick siguiente; un régimen temporal diferente puede producir stock distinto y alterar decisiones del agente aunque Observation no muestre stock.

**Recomendación:** No reabrir separación/noeventos/tipos. Recuperar fórmula. Solo si persiste laguna, preferir reposición determinista stock0→1 para tasa>0 por sencillez y ausencia de estado adicional; no introducir probabilidades ni temporizadores nuevos.

**Qué la refutaría:** Fuente auténtica que fije otra unidad/transición, o una consecuencia incompatible con S1 y el orden de tick, obliga a retirar la propuesta.

**Impacto potencial:** Solo regenerate_resources y expectativas físicas/registro que dependan de stock; no nuevo mecanismo por defecto.

**Aprobación:** Sí si se elige fórmula no determinada; no por equivalencia algebraica de una fórmula recuperada.

**Compatibilidad aprobada:** ninguna propuesta revoca D-01, INIT-004 ni altera contratos determinados. Ingeniería autorizada de implementación no se presenta como fuente histórica completa.

**CÓDIGO/PRUEBAS:** See per-requirement implementation/evidence refs in contract-reconciliation.json; not authority.

<a id="dec-g03"></a>
## DEC-G03 — PARTIALLY_DETERMINED

Prioridad: P1. Contratos: WL-R-OBS, WL-R-FEEDBACK-CONFIG, WL-R-FEEDBACK.

**NORMA disponible:** §16 fija tick/self/local_view, Chebyshev, OOB, occupied=false, pureza y stock indistinguible. F2-I recupera cuatro defaults/esquemas superiores y exige no fuga. D-01 fija ticks.

**Información ausente:** Subesquemas portables y marcadores ocultos de proyección.

**Alternativas:** Recuperar §§16/17 completos; Si persiste laguna, aprobar proyección con forma estable y marcadores de ausencia; Otra representación explícita que preserve esquema aprobado y nofuga

**Diferencias observables:** null/omisión/marcador pueden producir Feedback estructuralmente distinto; no todas las alternativas son válidas si un esquema recuperado las prohíbe.

**Recomendación:** Conservar las reglas ya determinadas. Si procede decidir, preferir forma estable, etiquetas ocultas=null, events=[] y delta+0 como marcadores constantes; no inventar enums ni reutilizar valores fuente. Debe declararse como proyección, no ActionResult crudo.

**Qué la refutaría:** Contrato auténtico de subregistros/marcadores distinto, o un par de entradas que difieran solo en valor oculto y produzcan salidas distintas, refuta la alternativa.

**Impacto potencial:** Observation/Feedback, agentes consumidores y validadores de Recorder/replay si cambia ABI; no tocar WORLD físico.

**Aprobación:** Sí para ABI observable no recuperada; representación interna sin efecto no requiere nueva física.

**Compatibilidad aprobada:** ninguna propuesta revoca D-01, INIT-004 ni altera contratos determinados. Ingeniería autorizada de implementación no se presenta como fuente histórica completa.

**CÓDIGO/PRUEBAS:** See per-requirement implementation/evidence refs in contract-reconciliation.json; not authority.

<a id="dec-g04"></a>
## DEC-G04 — PARTIALLY_DETERMINED

Prioridad: P1. Contratos: WL-R-EVENT-SCHEMA, WL-R-EVENT-ACTION.

**NORMA disponible:** WorldEvent3 campos, enriquecimiento exclusivo, no muerte en apply_action, acción antes de lifecycle y eventos de consumo/peligro son reglas recuperadas/órdenes expresas.

**Información ausente:** Orden interno exacto y alcance de eventos ante magnitud0; catálogo completo de eventos si existe fuera de lo recuperado.

**Alternativas:** Recuperar §18 y acciones; Si no resuelve, ordenar movimiento→efecto y definir activación como hecho, no magnitud; Orden alternativo explícito compatible con cronología y reglas conocidas

**Diferencias observables:** Mismo estado físico puede dar listas/sequence distintas. HAZARD_TRIGGERED con daño0 no equivale a ausencia de evento.

**Recomendación:** No reabrir tipos/esquemas/propiedad RECORDER ya fijados. Si persiste laguna, ordenar movimiento antes del efecto por causalidad espacial y emitir activación aunque magnitud0 cuando el hecho efectivamente ocurrió.

**Qué la refutaría:** Fuente auténtica contraria o evidencia de que la activación depende normativamente del daño positivo cambiaría propuesta.

**Impacto potencial:** Preparación de eventos y expectativas de secuencia/StepRecord/replay; no alterar energía, reloj o lifecycle por conveniencia.

**Aprobación:** Sí solo para disparo/orden no determinados.

**Compatibilidad aprobada:** ninguna propuesta revoca D-01, INIT-004 ni altera contratos determinados. Ingeniería autorizada de implementación no se presenta como fuente histórica completa.

**CÓDIGO/PRUEBAS:** See per-requirement implementation/evidence refs in contract-reconciliation.json; not authority.

<a id="dec-g05"></a>
## DEC-G05 — PARTIALLY_DETERMINED

Prioridad: P1. Contratos: WL-R-ENTITY, WL-R-INIT, WL-R-EXPERIMENT-CONFIG, WL-R-TICK-TRANSACTION, WL-R-RUN, WL-R-INIT-FAIL, WL-R-RECORD-INITIAL, WL-R-SEQUENCE, WL-R-RECORD-STEP, WL-R-TRAJECTORY, WL-R-REPLAY-STATUS.

**NORMA disponible:** D-01 fija contexto8 y representaciones temporales; §22 enumera11 campos, §23 enumera6; F3A-P02/P03 son ingeniería expresamente autorizada.

**Información ausente:** Esquemas completos ActionResult/Observation, salidas kernel, metadata y alcance de failure_details; el dominio agent_type no está plenamente recuperado.

**Alternativas:** Recuperar contratos de interfaz; Consolidar únicamente campos/semántica conocidos y preservar independencia de representación; Aprobar ABI portable de salidas si aún falta, sin imponer clases JS

**Diferencias observables:** Map/clase/array internos pueden ser equivalentes si la interfaz semántica/bytes se conserva; enums/campos externos distintos sí afectan interoperabilidad.

**Recomendación:** Separar adaptaciones internas de ABI observable. No exigir Map, instanceof, staging privado o retorno undefined a otro motor. Mantener campos públicos no recuperados como pendientes, incluida variante failure_details de error de agente.

**Qué la refutaría:** Fuente que fije otro esquema público o que demuestre que una supuesta adaptación interna escapa a salida obliga a reclasificar.

**Impacto potencial:** Validadores y adaptadores/transportes si cambia ABI; no se justifica migración global ni WLS1 nuevo.

**Aprobación:** No para libertad interna equivalente; sí para fijar ABI externo no definido.

**Compatibilidad aprobada:** ninguna propuesta revoca D-01, INIT-004 ni altera contratos determinados. Ingeniería autorizada de implementación no se presenta como fuente histórica completa.

**CÓDIGO/PRUEBAS:** See per-requirement implementation/evidence refs in contract-reconciliation.json; not authority.

<a id="dec-g06"></a>
## DEC-G06 — RESOLVED_SCOPED_CLARIFICATION

Prioridad: P2. Contratos: WL-R-INIT-EVENTS.

**NORMA disponible:** HINIT contiene INIT-004 autorizada: WORLD valida crudos, Recorder enriquece y valida tick/source/sequence. D-01 conserva initialize_world.

**Información ausente:** No falta una elección semántica para esa separación; el manuscrito completo sigue siendo otra dependencia.

**Alternativas:** Mantener aclaración con procedencia explícita; Consolidarla editorialmente con igual alcance

**Diferencias observables:** No debe producir ninguna diferencia de eventos, reloj, esquema ni número de llamadas lifecycle.

**Recomendación:** Consolidar la aclaración ya autorizada sin nueva elección. No presentar la incompatibilidad anterior como bloqueo actual.

**Qué la refutaría:** Una fuente/orden posterior explícita que revoque o sustituya INIT-004 requeriría reconciliación, no mera ausencia del manuscrito.

**Impacto potencial:** Ningún cambio productivo previsto; conservar F2-G/F3-C y trazabilidad.

**Aprobación:** No nueva aprobación semántica para la misma aclaración; su futura publicación normativa seguirá el control documental.

**Compatibilidad aprobada:** ninguna propuesta revoca D-01, INIT-004 ni altera contratos determinados. Ingeniería autorizada de implementación no se presenta como fuente histórica completa.

**CÓDIGO/PRUEBAS:** See per-requirement implementation/evidence refs in contract-reconciliation.json; not authority.

<a id="dec-g07"></a>
## DEC-G07 — PARTIALLY_DETERMINED

Prioridad: P1. Contratos: WL-R-CONFIG, WL-R-RNG, WL-R-INT.

**NORMA disponible:** PRNG/float/rechazo y dominios D-01 son determinados; n>2^32 da limit0 sin aceptación. Radio válido uint32. OBS-P03 rechaza r512 por presupuesto local.

**Información ausente:** Dominio completo de extremos next_int, contexto de semilla §10.6 y admisibilidad de fallo operacional de observación.

**Alternativas:** Recuperar dominio/seed y contrato de capacidad; Declarar capacidad/fallo operacional separado sin recortar radio semántico; Investigar otra materialización solo con autorización posterior, sin truncar observación

**Diferencias observables:** Un implementador soporta r512 y otro lanza error; igualdad de configuración no basta para equivalencia operacional. El64MiB concreto no es una regla física.

**Recomendación:** No cambiar algoritmo ni reducir silenciosamente WorldConfig. Separar validez y soporte operativo; fijar por decisión expresa qué garantía/error se acepta. Extremos seguros son representación JS aceptada, no imponerlos a otros lenguajes sin contrato portable.

**Qué la refutaría:** Fuente auténtica que exija totalidad sin fallo operacional, o demostración de que el error de capacidad ya está normativamente definido, cambia la recomendación.

**Impacto potencial:** Posible documentación/validación de capacidad o cambio focalizado de observación; sin autorización actual. PRNG no requiere cambio demostrado.

**Aprobación:** Sí para redefinir garantía/ABI de fallo; no para registrar un límite técnico real.

**Compatibilidad aprobada:** ninguna propuesta revoca D-01, INIT-004 ni altera contratos determinados. Ingeniería autorizada de implementación no se presenta como fuente histórica completa.

**CÓDIGO/PRUEBAS:** See per-requirement implementation/evidence refs in contract-reconciliation.json; not authority.

<a id="dec-g08"></a>
## DEC-G08 — PARTIALLY_DETERMINED

Prioridad: P1. Contratos: WL-R-BOUNDARIES, WL-R-NOLEARN, WL-R-AGENT-FAIL, WL-R-REPLAY-REQUEST, WL-R-REPLAY-CONTINUITY, WL-R-REPLAY-COMPARE, WL-R-ERRORS, WL-R-AGENT, WL-R-RENDERER, WL-R-METRICS.

**NORMA disponible:** Fronteras WORLD/AGENT, renderer snapshots, Metrics no muta Trajectory y firmas booleanas/contexto D-01 son expresas.

**Información ausente:** API/alcance completo Metrics, diagnósticos Match/Mismatch, glosario, agentes y reproducibilidad heredados.

**Alternativas:** Recuperar fuentes; Mantener interfaces semánticas explícitas y mensajes diagnósticos no fijados como noportables; Cambiar alcance solo mediante decisión expresa, no por falta de módulo

**Diferencias observables:** Comparar mensajes internos como si fueran ABI rechaza motores equivalentes; omitir un consumidor requerido puede impedir el uso experimental previsto.

**Recomendación:** Preservar fronteras y decisiones D-01 cerradas. No hacer Metrics opcional por ausencia ni inventar su API. Separar diagnósticos de presentación de error_message normativo.

**Qué la refutaría:** Fuente que determine diagnósticos o API concreta impone revisión; consumidor localizado con efectos distintos refuta inspección actual.

**Impacto potencial:** Consumidores/validadores si se recuperan obligaciones; no diseñar arquitectura nueva por anticipación.

**Aprobación:** Sí si se cambia alcance o ABI; no para cumplir una fuente recuperada.

**Compatibilidad aprobada:** ninguna propuesta revoca D-01, INIT-004 ni altera contratos determinados. Ingeniería autorizada de implementación no se presenta como fuente histórica completa.

**CÓDIGO/PRUEBAS:** See per-requirement implementation/evidence refs in contract-reconciliation.json; not authority.

<a id="dec-g09"></a>
## DEC-G09 — PENDING_REFERENCE_FIXING_AND_ACCEPTANCE

Prioridad: P1. Contratos: WL-R-RNG-REF, WL-R-HASH, WL-R-WLS1, WL-R-WLS1-REF, WL-R-CORPUS, WL-R-CONFORMANCE.

**NORMA disponible:** V1 está recuperado; §34.9 declara V2–V10 pendientes de generación independiente antes de Hito C. §37 exige T01–T280.

**Información ausente:** Definiciones de tests y conjunto de referencia todavía no fijado; la fuente externa §36 puede aportar detalle desconocido.

**Alternativas:** Recuperar tests/referencias auténticas; Aprobar explícitamente referencias nuevas/perfil sustituto tras cerrar contratos, manteniendo identidades históricas

**Diferencias observables:** Elegir nuevos vectores no recupera V2–V10 ni demuestra todos los invariantes; reemplazar solo tests puede omitir contratos desconocidos.

**Recomendación:** Conservar289BLOCKED. Revisar propuestas PV-F5C y fijarlas por acto autorizado antes de contraste independiente; no aprobar ahora un corpus sustituto ni §37 nuevo.

**Qué la refutaría:** Definiciones históricas completas o un fallo del cálculo independiente de bytes/hash obliga a revisar propuestas y clasificación.

**Impacto potencial:** No cambiar WLS1 por generar vectores. Pruebas posteriores nuevas mantienen IDs propios; históricos y reportes conservados.

**Aprobación:** Sí para aprobación de referencias y sustitución de aceptación; preparar propuestas no la concede.

**Compatibilidad aprobada:** ninguna propuesta revoca D-01, INIT-004 ni altera contratos determinados. Ingeniería autorizada de implementación no se presenta como fuente histórica completa.

**CÓDIGO/PRUEBAS:** See per-requirement implementation/evidence refs in contract-reconciliation.json; not authority.
