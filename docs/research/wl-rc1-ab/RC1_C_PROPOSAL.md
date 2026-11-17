# RC1-C — Propuesta concreta para decisión posterior

**PROPOSED / NOT_PREREGISTERED / NOT_EXECUTED.** Esta es la propuesta exigida en A/B, no ejecución de RC1-C/D/E. GATE-1 debe aceptar preguntas/modelos; GATE-2 deberá aprobar protocolo definitivo, identidad del instrumento y presupuesto. Toda modificación se versionará antes de medir; nunca se seleccionarán datos según rendimiento.

## Preguntas estimables e hipótesis refutables

- **C-Q1:** estimar coste de validate/copy/tick y Observation/Feedback respecto de N,Q. H1: al fijar Q,T y régimen del runtime, el conteo de trabajo de estado crece con N; H2: materializar Q incluye OUT_OF_BOUNDS y el coste no se satura al superar Q a N. Desacuerdo empírico fuerza revisar modelo/constantes/instrumento, no demuestra por sí solo otra complejidad.
- **C-Q2:** estimar append, finalize, getters, WLS1 y replay por etapa. H3: el coste acumulado del append interno crece aproximadamente con T en el rango estable; exportar cada prefijo cambia la curva de trabajo a Σi. Distinguir contar copias de medir wall; no extrapolar ajustando potencias con dos puntos.
- **C-Q3:** descomponer latencia, CPU, memoria y bytes de intento/campaña. Estimar cuánto corresponde a arranque/guard, motor/registro, IPC, archivo, verificación y análisis; contraste posterior observador OFF/ON emparejado. H4: el coste de operación completa no queda explicado únicamente por el wall del hijo. No ejecutar el controlador final P01 para probarlo.
- **C-Q4:** diseñar registro longitudinal de esfuerzo por investigación: alcance solicitado, horas por actividad, rutas/contratos cambiados, retrabajo, decisiones y defectos. Sin comparación equivalente/contrafactual no informar «ahorro demostrado». Q4 no tendrá respuesta causal en RC1-E inicial.

## Unidad experimental, controles y condiciones

Unidad primaria de rendimiento: **un proceso nuevo** con perfil/seed/modo de instrumento fijados y resultado completo de sus etapas. Iteraciones internas son submuestras dependientes; no aumentan n de procesos. Separar cold (primera llamada, incluido arranque medido aparte) y warm (tras warm-up fijo) en campos distintos; no restar el arranque suponiendo que es constante.

Factores independientes: N y forma w/h, Q, T, operación pública/capa, modo de instrumento y fase cold/warm. Factores de validación secundaria: stocks/efectos/regeneración y modo con/sin agente, solo mediante perfiles específicos posteriores; no mezclarlos silenciosamente con el control. Variables dependientes: wall monotónico de cada etapa y total, CPU user/system por proceso, RSS/heap/buffers y muestras temporales, bytes originales/JSON/gzip/índices, éxito/error/timeout, igualdad observable y datos truncados/censurados.

Controles: mismas entradas/copias y trazas de acciones para comparación emparejada, fuentes/configs sin cambios; medir una operación vacía/reloj y coste de preparar/restaurar fixture separadamente. Núcleo micro usa WAIT pagado, sin política costosa para aislar infraestructura. Si se añade FrontierMemory u otra política al análisis end-to-end, medirla por separado y respetar solo Feedback; no darle snapshots/semillas del mundo. Estudio de P01 solo con archivos históricos leídos, sin llamar run/replay final de E3/E4.

No insertar hooks ni cambiar fuentes privadas para medir. Proponer envoltorios externos de APIs públicas y `process.hrtime.bigint`, `process.cpuUsage/resourceUsage/memoryUsage`, `perf_hooks`; perfiles opcionales de inspector en sesiones separadas si GATE-2 los acepta. Un wrapper que requiera reemplazar métodos cambiaría el objeto estudiado: detener esa operación y pedir decisión específica antes de hacerlo. No introducir framework permanente.

## Piloto acotado propuesto — requiere autorización posterior

| Perfil | w×h / N | r / Q | T | Contraste que justifica el punto |
|---|---|---|---|---|
| P1 |8×8 /64 |1 /9 |4 | Base pequeña y resolución del reloj |
| P2 |16×16 /256 |1 /9 |4 | Área×4, radio fijo |
| P3 |32×32 /1024 |1 /9 |4 | Segunda razón×4 para detectar curvatura/resolución insuficiente |
| P4 |16×16 /256 |0 /1 |4 | Ventana mínima válida sin RuleAgent |
| P5 |16×16 /256 |4 /81 |4 | Ventana intermedia, N fijo |
| P6 |16×16 /256 |16 /1089 |4 | Q>N y OUT_OF_BOUNDS; sin ventana cercana a agotamiento |
| P7 |16×16 /256 |1 /9 |16 | Historial×4; getter/prefijo comparado con append |
| P8 |4×64 /256 |1 /9 |4 | Forma distinta al mismo N; filas/bordes como confusor |

Ocho puntos responden a contrastes específicos, no a una pretensión de exhaustividad. No usan MAX_CELLS ni r511 como stress. El borde r511/512 se caracteriza ahora solo por aritmética; cualquier ensayo real cerca del guard necesita presupuesto y autorización específicos tras estimar Q×T y representaciones simultáneas. No inferir admisibilidad normativa de esa prueba.

Configuración preliminar para fijar en C: BOUNDED, una entidad, energíainicial240/umbral0, costesMOVE/WAIT1, densidades0/0/0, recurso8/daño0, regeneración0, cuatro flags Feedback true para la ruta con contexto. T≤16 evita muerte por costes del control. La vista se construye para mediciones aunque la traza WAIT venga prescrita externamente: no llamarlo episodio de una política nueva. El modo sin agente usa su contrato real, con contexto null. Efectos/regeneración positivos se incorporarán en una segunda matriz solo si su pregunta justifica el coste. Validar todos los perfiles antes de medir.

Reserva propuesta de seeds RC1 `20001–20003`, una por bloque emparejado; no se usaron aquí. No son seeds finales P01, ni se introducen en el worker que solo acepta desarrollo1–4. El caso densidades0 no estima variabilidad de mapas: las seeds sirven a reproducibilidad, no a inferencia sobre escenarios. RC1-D deberá preparar una entrada externa propia aprobada, sin tocar protocolo/guards/freeze P01 ni presentar la identidad de P01 como identidad RC1.

Repeticiones piloto: tres bloques emparejados instrumentación mínima/básica por perfil, **8×3×2=48 procesos como máximo**. Tres no certifica precisión; permite detectar fallos, dispersión grande y perturbación antes de elegir n definitivo por objetivo de precisión y presupuesto. Dentro de cada proceso: tres llamadas de warm-up fuera del resumen warm, y lote fijo inicialmente de cinco llamadas medidas por operación/fixture; cold separado. Si preparación excede presupuesto o una llamada queda cerca de resolución del reloj, no alargar de forma adaptativa para obtener un resultado: informar y proponer protocolo v2.

Orden: perfiles P1–P8 en primer bloque, orden inverso en segundo, rotación fija en tercero; dentro del par AB/BA/AB para evitar que instrumento siempre vaya segundo. Un solo hijo a la vez. Registrar que este orden fijo balancea tendencias pero no garantiza aleatorización ni independencia de OS. No ejecutar otros benchmarks simultáneos; si aparece carga ajena, registrarla y conservar las muestras. No forzar GC como si fuera comportamiento natural; sesiones con GC forzado serían otra condición explícita.

## Presupuesto propuesto y condiciones de parada

- Hijo:10s timeout, heap V8 256MiB. Máximo48 hijos,480s de ventanas nominales; watchdog total del piloto **12min** incluyendo preparación/archivo. Son límites propuestos, no coste observado ni garantía de que todos terminen. El permiso de preparación A/B no los activa.
- Controlador: heap512MiB; mismo host Linux/Node fijado, registrar binario y flags. Monitor externo del conjunto con umbral de parada RSS agregado1GiB, sin prometer que un muestreo impide todo sobrepaso. Si no hay capacidad/autorización de supervisión externa verificable, piloto HOLD antes de arrancar.
- Máximo128MiB de nuevos artefactos del piloto y directorios nuevos fuera del repositorio, por ejemplo `/workspace/shared/world-lab/wl-rc1/pilot-<protocol-id>/`. Raíz distinta de todo P01; copia en otro destino disjunto e inventario SHA. Límite de archivos/bytes por registro definido en C, sin truncamiento silencioso.
- Presupuesto motivado por N≤1024,Q≤1089,T≤16 y observaciones históricas de preparación/archivo; las medias F6-B no se multiplican como garantía. El piloto comprobará viabilidad/resolución/perturbación. Antes de una campaña definitiva, fijar inventario de condiciones/n, proyección desde piloto con margen explícito, límites por etapa y total, almacenamiento/preservación y aprobación GATE-2. **No existe presupuesto de E definitiva aprobado todavía.**
- Parar ante fuentes/configs cambiadas, pérdida de igualdad, fallo de archivo/integridad, límite de recursos, imposibilidad de medir sin truncar o pérdida de autoridad. Conservar todo intento y causa; sin retry automático, reemplazo ni selección de otra seed.

## Validación instrumental y datos censurados

RC1-D deberá comprobar con fixtures pequeños que las dos modalidades producen estados, acciones/resultados, eventos, reloj/RNG y bytes WLS1 iguales; hash solo no basta. El instrumento registra versión del esquema, commit/hash del sujeto y del propio instrumento, Node/V8/binario/flags, OS/CPU/memoria y carga observable, perfil/seed/orden/warm-up, reloj/unidades, medidas originales y errores. No congelar un identificador del instrumento antes de implementarlo.

Cuantificar perturbación mediante diferencias/ratios emparejados AB/BA y coste del reloj/operación vacía. Si una medida queda por debajo de10veces el coste mediano del reloj o la perturbación mediana supera10%, clasificar esa escala como resolución/instrumentación insuficiente y proponer revisión; son umbrales técnicos iniciales para revisión, no normas ni evidencia presente. No corregir restando ruido hasta hacer aparecer una tendencia.

Timeout no equivale a duración exacta ni muerte WORLD; registrar umbral, momento observado del kill y datos disponibles como censura, CPU/RSS faltantes explícitos. Un error de configuración es diferente de un límite de capacidad o ejecución. No excluir ejecuciones lentas, pérdidas o picos por ser desfavorables. Excluir del agregado numérico solo datos imposibles de interpretar por corrupción/unidades/identidad inválidas bajo regla prefijada, preservándolos con motivo. No repetirlos automáticamente.

## Análisis y aceptación propuesta

Resultados piloto: filas completas por proceso/etapa y plots N/Q/T contra tiempo/CPU/bytes/RAM, mediana y rango observados por condición, diferencias emparejadas de instrumento. No usar las cinco llamadas internas como cinco procesos independientes. Los intervalos de incertidumbre para E definitiva deberán elegirse en C a partir del objetivo de precisión y diseño en bloques; no fijar una cantidad por aparentar cobertura ni presentar n=3 como suficiente para IC poblacional.

Contrastación: comparar fórmulas de trabajo/bytes y predicciones cualitativas con residuales; mantener modelos alternativos/constantes de arranque/GC. Solo el mecanismo controlado y la intervención pertinente permiten una atribución causal dentro del dominio. No inferir «memoria provoca superioridad» ni coste general I+D desde tiempos de una versión.

**GO para preparar C tras GATE-1:** preguntas útiles, definiciones/supuestos aceptados y baseline identificable. **GO para piloto en D:** C versionado, instrumento pequeño validado, calibración/registro/limites/parada efectivos y autorización específica de ese presupuesto. **GO para E definitiva:** aprobación expresa GATE-2 de protocolo/instrumento/inventario/presupuesto congelados, más nueva verificación de identidad y destinos. A/B no satisface por sí misma esas puertas. **NO-GO:** falta de control/medida/preservación o requerimiento de modificar producción; continuar únicamente partes independientes.

Entregables futuros F/G: contraste de modelos, límites del entorno, validez/sensibilidad, acoplamientos y costes de evolución, sin conclusiones anticipadas; tabla problema→evidencia→impacto→alternativas→beneficio→coste→riesgo→recomendación→prueba. Implementar mejoras requerirá autorización separada, no una decisión automática del benchmark.
