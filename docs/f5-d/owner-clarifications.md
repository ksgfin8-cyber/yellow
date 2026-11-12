# Captura acotada de instrucciones del responsable

Procedencia: mensajes visibles en esta conversación. Se conserva lo que el
responsable declaró como recuperado o autorizó; no se obtuvo una copia completa
ni autenticación independiente del manuscrito histórico. Hashes nuevos fijan esta
captura, no la antigüedad ni la identidad de un original externo.

## F2-H — Eventos recuperados y límites

> WorldEvent tiene exactamente type, entity_id, position.
> WORLD no añade tick, source ni sequence.
> apply_action no emite ENTITY_DIED.
> Los eventos de acción preceden a los de lifecycle.
> RESOURCE_CONSUMED y HAZARD_TRIGGERED son eventos operacionales definidos.
> RECORDER es el único responsable del enriquecimiento temporal.

La orden distingue efectos realmente ejecutados, consumo stock1→0 y peligro
activado; WAIT no inventa desplazamientos ni efectos de entrada. No proporciona
por sí sola todo el catálogo ni el orden interno MOVE/efecto de v0.2.4.

## F2-I — Configuración y pureza

El responsable transmite FeedbackConfig cerrado de cuatro booleanos con defaults
true,false,false,true y Feedback de tres campos. Exige validación estricta,
inmutabilidad, independencia de referencias, pureza y no transmisión indirecta
de campos ocultos. Autoriza escoger una representación determinista documentada
cuando la fuente no la fija. Esa autorización de ingeniería no convierte la
representación elegida en contrato histórico.

## F3-A — Salidas de ingeniería autorizadas

El responsable declara expresamente que TickResult y ConfirmedTickResult son
F3A-P02/P03 de ingeniería autorizada, no campos recuperados de §26.5. La aprobación
de su implementación no prueba equivalencia documental con el manuscrito ausente.
D-01 fija posteriormente representación temporal y otras sustituciones expresas.

## F5-D — Fuente externa identificada

La orden F5D-001, archivada íntegra en sources/F5D-001-order.b64, identifica un
manuscrito v0.2.4 de aproximadamente1300 líneas y anuncia I54–I66, §25.9 y §36.
No entrega esos contenidos. Es una pista concreta pendiente, no recuperación ni
agotamiento de la búsqueda. v0.2.3 es otra pista concreta para I01–I53, sin garantía
previa de que su contenido exacto cierre toda la familia.
