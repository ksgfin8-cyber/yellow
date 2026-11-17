# F6 — Reconciliación y preparación del cierre de construcción

**Dictamen: GO_CONSTRUCTION_CLOSURE para la primera versión operacional descrita aquí.** Recomendación de auditoría para revisión del propietario; no declaración automática de cierre ni aprobación de Hitos B/C.

Auditoría del 2026-11-17 (America/Guayaquil). Base `origin/main` posterior al PR #45: `0ed485661241a571ba726cfb31a49541f40bd4fa`. Rama documental nueva: `dev/f6-construction-closure-audit`. [Orden íntegra](order.txt.b64), [matriz F6](PHASE_RECONCILIATION.md), [componentes y pendientes](COMPONENTS_AND_FINDINGS.md), [comprobaciones](VERIFICATION.json).

## Resultado ejecutivo

F6-A–F6-E satisfacen los entregables originales **en su alcance operacional**, con el nivel de evidencia diferenciado en la matriz: A/E `COMPLETE_DOCUMENTED`; B/C/D `COMPLETE_VERIFIED`. La auditoría no repitió la verificación completa de A ni la campaña de E. F6-C y F6-D no quedaron sin implementar: ejecutor, archivo y métricas se entregaron principalmente en F6-B, se habilitaron para evaluación en F6-E y se reforzaron con conservación/oráculo F6-F y validación E4. Esto reconcilia compromisos con resultados, sin inventar retrospectivamente entregas ni alterar Git.

**F6-N: BLOCKED**, reconciliación efectiva `NOT_ESTABLISHED`. La preparación F5-A/B/C/D existe, pero G00 exige fuentes auténticas completas y decisiones aún no resueltas. La construcción operacional no dispensa esas obligaciones. No hay un defecto demostrado que impida el uso de la versión de referencia dentro del dominio comprometido; sí hay límites de soporte y de autoridad fuera de él, enumerados sin convertirlos en requisitos opcionales.

## Alcance formal de la versión que puede cerrarse

Infraestructura de investigación determinista, de una entidad y topología BOUNDED, con configuración validada, PRNG/semillas, acciones, lifecycle, dinámica, observación/feedback, integración de agentes, reloj discreto, registro tipado, WLS1/hashes, replay, consumidores de métricas y archivo recuperable. Las responsabilidades permanecen separadas; no hay aprendizaje del WORLD ni enriquecimiento de eventos en WORLD.

El **perfil integral de referencia es P01**, fijado antes de sus resultados: 12×12, radio1; densidades obstáculo/recurso/peligro 0,15/0,12/0; energía240, umbral0; MOVE/WAIT coste1, recurso+8, daño0, regeneración0; 160ticks; cuatro flags Feedback expuestos; Wait, Random, Rule y FrontierMemory-v1 mediante factoría headless. Dos repeticiones de 32 semillas finales ya archivadas. Su identidad permanece `47155590f10358f6130a1f7eae261ec9ec1fc8035652c04dd23fcc9f92c63e7d`. El ejecutor mantiene 30s y 512MiB de **heap V8**, no límite RSS.

El alcance incluye además **modo autónomo real WAIT sin agente**, y la **demo web existente**, 6×6/radio1/10ticks por defecto con botones Wait/Random, estado final y diagnóstico. No se promete FrontierMemory en la GUI: la integración aprobada fue por factoría headless. Recursos agotados, regeneración positiva/máxima, peligros, muerte, errores e inicialización se respaldan por fixtures técnicos específicos; no por extrapolar P01, que no ejercita varios de esos casos.

Esto no acredita toda combinación legal de configuración: la capacidad de observación grande y Rule con radio0 siguen límites abiertos. Tampoco promete API de paquetes general, GUI extensa, múltiples entidades, motor para código hostil, soporte universal de runtimes o laboratorio externo. Es el alcance previsto en [F6-A](../F6-A-readiness.md#f6-b) y ED-002/004, corroborado por el plan aprobado de esta orden, no una reducción posterior para ocultar un fallo indispensable.

## Evidencia actual frente a evidencia histórica

| Momento / método | Resultado y límite |
|---|---|
| Ahora: ocho suites existentes focalizadas | **100 PASS / 0 FAIL**, sin aserciones modificadas: F2-E16, F2-H15, F3-F23, F4-A16, F6-B agente10/supervisor5/archivo7/métricas8. F4-A incluye15 casos Node y **un** caso Chromium real con varios escenarios; no16 navegadores independientes. |
| Ahora: legacy sin adaptar expectativas | **13 PASS / 9 FAIL**, exit1. Mismos IDs y causas documentados en F6-A/B/E; no se suman como pruebas modernas verdes. |
| Ahora: integridad | Gate `check` conserva freeze ID; verifica fuentes, runtime y bytes smoke ligados. Copia `COPY_VERIFIED`, 256 índices, 774 objetos, sin errores. SHA/tamaños de ambos paquetes originales coinciden. Inventarios de publicación de E3/E4/E5/C2 y continuidad de código examinados. |
| Histórico A/B/E | Baseline28 suites/511PASS; seis aserciones consultan baseline histórico v0.2.5. F6-B35PASS y32 smoke finales; preparación E59PASS; F6-F29PASS. Son cortes distintos, no sumandos de cobertura ni nuevas ejecuciones actuales. |
| Histórico E3 | 256 completos,0fallidos,256 COMPLETE_MATCH;519 archivos coincidentes,774 objetos,255 versiones normales append-only,0 conflictos bloqueantes. |
| Histórico E4 | 256 replay restaurados MATCH,41.216 estados,82.432 contrastes de bytes;128 parejas de repeticiones y32 mundos comunes; métricas independientes concordantes. No se ha vuelto a ejecutar E4. |
| Histórico E5/C2, integrado | Aceptación técnica/científica acotada; C2 `VERIFIED_EXTERNAL_BACKUP` **según confirmación del propietario de sus hashes locales Windows**. OneDrive `NOT_VERIFIED`. C2 integrado en PR #44, aunque su informe original decía revisión pendiente. |

Las comprobaciones actuales se eligieron por preguntas concretas: integración sin agente y límites, UI real, componentes no ejercitados por P01, factoría del agente adicional, proceso bloqueado, recarga tipada/replay de fixture y pureza de métricas. No se lanzó campaña ni `run` de evaluación, ni se ejecutaron agentes con semillas finales. Los tests existentes sí crean mundos pequeños y fixtures de desarrollo; supervisor y archivo usan seed1/Wait, y el archivo verifica replay de ese fixture. No se presenta esto como «cero episodios técnicos» ni como repetición de E3/E4. Logs íntegros y comandos en [evidencia](VERIFICATION.json) y [salidas](checks.log.b64).

La integridad/hash de una evidencia demuestra conservación de bytes, no la verdad universal de sus afirmaciones. Los 256 replay E4 conservan condición de **resultado histórico documentado**, no nueva ejecución por leer su informe. Los SHA-256 de paquetes no se confunden con los hashes FNV de estado. No hay implementación experimental independiente ni evaluación formal de estándares de ingeniería.

## Cinco decisiones separadas

**D1 — Plan F6.** A/B/C/D/E completos en sus compromisos originales y niveles indicados; ninguna obligación operacional original identificada como pendiente. A/E conservan estado documental porque no se repitió su ejecución equivalente. C/D se mapearon a módulos reales de B/E/F, con fuentes y resultados. N permanece bloqueada por G00 y decisiones contractuales; la preparación concluida no equivale a reconciliación concluida.

**D2 — Construcción.** Hay integración funcional de los componentes esenciales, demostrada por perfiles/fixtures identificados. Se recomienda cerrar esa primera versión operacional. **Lista de bloqueantes de construcción demostrados dentro de ese alcance: vacía.** La ausencia de verificación universal no se convierte por sí sola en defecto; un defecto fuera de soporte tampoco se oculta como corrección completada.

**D3 — Conformidad.** `NOT_ESTABLISHED`. Persisten 289 casos históricos bloqueados (280T y nueve vectores), fuentes incorporadas incompletas, perfil candidato F5-C no aprobado y decisiones G00/G01–09 pendientes según su estado real. No se reejecutó ni reclasificó el corpus. Hito B no se cierra; una aprobación de operación no modifica §37 ni sustituye requisitos.

**D4 — Replay/interoperabilidad.** Replay restaurado e igualdad observada están documentados dentro del mismo motor. Recarga tipada/replay de fixture funcionan ahora. Contraste entre motores independientes y Hito C `NOT_ESTABLISHED`; la recepción Windows demuestra transferencia de bytes, no ejecución independiente. Ni el oráculo de métricas separado ni la repetición de semillas prueban interoperabilidad.

**D5 — Después de construir.** Nuevas hipótesis/perfiles, estudios causales, aprendizaje online, GUI extensa y generalización a otros entornos pueden ser trabajos futuros autorizados, no deudas de construcción añadidas retrospectivamente. F6-N, referencia normativa completa y contratos pendientes **no** son capacidades opcionales: siguen su puerta propia. Laboratorio externo R2 no fue condición original de F6-E y no se exige ahora; tampoco se declara logrado.

## Punto de cierre y mínima acción

La construcción termina cuando existe la cadena aprobada de configuración → ejecución/registro → archivo → recuperación/replay → análisis/aceptación en el alcance de referencia, junto con el modo autónomo y la demo comprometidos. La evidencia disponible satisface ese punto; operación científica posterior comienza al formular otra pregunta y protocolo, no al reconstruir herramientas ya existentes.

La mínima acción restante para **declarar** terminada la construcción es que el propietario revise este dictamen y apruebe su cierre acotado mediante la revisión documental correspondiente. No exige otro algoritmo, nueva campaña, repetición E3/E4, número de fase artificial ni condición externa no preregistrada. Esta auditoría prepara la decisión; no la adopta automáticamente por él. Si se amplía el dominio operativo, habrá que verificarlo y resolver los hallazgos aplicables antes de prometerlo.

Documentación consolidada ahora: resumen vigente de [IMPLEMENTATION_STATUS](../IMPLEMENTATION_STATUS.md), sin tocar sus cortes previos. ED-002/005/006 ya reflejan E3/E4/E5/C2; no se reescriben. Informes F6-A/B/E y E3/E4/E5/C2 mantienen sus estados históricos; esta vista posterior resuelve su lectura cronológica. La matriz, el registro de pendientes y la evidencia enlazan las fuentes sin duplicar campañas ni crear otra norma. Originales y rama de transferencia se conservan.
