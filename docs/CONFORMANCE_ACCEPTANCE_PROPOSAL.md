# WORLD-LAB — propuesta de base de aceptación F5-B

**PROPOSED ONLY / NO APROBADA / NO VIGENTE.**

Registro **F5B-ACCEPTANCE-BASIS-REVIEW**.
Naturaleza: *Methodological and Normative Acceptance-Governance Decision Preparation*.
Base: `b13d637dd405d363442803ad53821f5a6c6f4a62`, posterior al PR #31.
Autoridad vigente: v0.2.6 D-01 sobre v0.2.5. Este expediente no modifica §37,
hipótesis experimentales, reglas físicas, arquitectura ni teoría de agentes.

## Evidencia documental y alcance de la conclusión

La búsqueda final delimitada está en
[recovery-f5-b.json](../conformance/recovery-f5-b.json). Incluye historial Git
alcanzable, el objeto histórico docs/specifications (un byte LF), documentación,
fuentes ya capturadas y 27 órdenes adjuntas accesibles, con hashes/localizadores.
No produjo definiciones individuales completas T01–T280. El inventario conserva
248 referencias parciales y 32 IDs sin asignación (T61–80/T93–104).
H034/HINIT contienen cláusulas recuperadas sin recuperar un corpus de tests;
V1 sí tiene bytes literales, V2–V10 siguen sin valores de referencia fijados.

La conclusión es **no recuperable con las fuentes actualmente consultadas**,
no una prueba de inexistencia mundial. Las referencias externas a v0.2.1/v0.2.4
no equivalen a archivos disponibles. No se accede a la Biblioteca de ChatGPT.
Si el responsable dispone de un archivo verificable, debe incorporarse con
procedencia, versión, hash del original y localizadores; solo entonces se reabre
esa búsqueda. No se solicita una exportación cuya disponibilidad no consta.

Los 50 casos F5-A permanecen idénticos. F5-B añade casos identificados ND5B/ER5B;
ninguno recibe identidad T. Cualquier cantidad de PASS nuevos es insuficiente
para satisfacer por sí sola la exigencia histórica distinta de §37.

## Escenario A — recuperación del corpus original

Mantener §37 y obtener los T01–T280 auténticos con identificación, entrada,
procedimiento y esperado verificables. Para cada pieza: conservar texto literal,
hash, versión, autor/procedencia y relación con cláusulas. No tomar código ni
etiquetas de tests legacy como fuente normativa.

Antes de ejecutarlos, determinar las disposiciones sustituidas por D-01 y otras
aclaraciones autorizadas. Un caso que representa una regla histórica sustituida
se conserva y se ejecuta sobre su versión correspondiente; no decide por sí solo
conformidad vigente. Si §37 no determina cómo aceptar su sustitución, elevar esa
precisión normativa en lugar de cambiar silenciosamente el test histórico.
La recuperación por sí sola tampoco demuestra cumplimiento: se necesita ejecutar
el corpus aplicable, revisar invariantes/contratos y cerrar OPEN-CRITICAL.

Este escenario tiene prioridad si aparecen fuentes auténticas. F5-B no lo declara
imposible para siempre ni lo sustituye de forma automática.

## Escenario B — corpus sustituto con decisión normativa posterior

Preparar un corpus nuevo, por ejemplo **CA-[revisión aprobada]**, con IDs nuevos.
El nombre y número de revisión son marcadores de propuesta, no una norma publicada.
El corpus debe cubrir obligaciones vigentes y sustituir únicamente el requisito
de aceptación expresamente autorizado. No recrea retroactivamente T01–T280.

El inventario inicial está en
[atomic-obligations-f5-b.json](../conformance/atomic-obligations-f5-b.json), enlazado
con obligations.json de F5-A y con la
[matriz de preaceptación](CONFORMANCE_PREACCEPTANCE_F5-B.md). Cada obligación tiene
fuente/cláusula, precondiciones, operación, postcondición/oráculo, casos, resultado
y límites. La evidencia actual es parcial; no es el corpus sustituto aprobado.
Para cláusulas históricas aún indeterminadas, aprobar un corpus no basta: recuperar
la regla o decidir explícitamente su precisión normativa antes de certificarla.

### Criterios de suficiencia propuestos

1. **Cierre de autoridad:** ninguna obligación obligatoria depende de texto
   desconocido o de código usado como norma. Las decisiones de ingeniería se
   identifican y, cuando sean necesarias para interoperar, se aceptan expresamente
   como perfil de compatibilidad o se precisan por decisión normativa separada.
2. **Cobertura de obligaciones:** cada pre/postcondición, dominio, frontera,
   precedencia y responsabilidad tiene una justificación de cobertura. Se fijan
   particiones válidas/ inválidas, extremos y combinaciones relevantes por riesgo.
   No basta un caso relacionado para declarar toda una sección satisfecha.
3. **Calidad de oráculos:** expectativas publicadas antes del contraste, con
   cálculo independiente del motor. Literales auténticos, aritmética exacta,
   fixtures manuales y relaciones metamórficas se distinguen. Una relación
   metamórfica entre dos corridas de un motor no es una segunda implementación.
   Dependencias compartidas entre fixture y oráculo deben declararse y revisarse.
4. **Capacidad de refutación:** contrastes negativos pertinentes y fallos
   inyectados deben ser detectados. Corrupción de respuestas comprueba sensibilidad
   del comparador, pero no mide todos los defectos posibles del motor. Ningún
   porcentaje de mutación genérico reemplaza el análisis del contrato.
5. **Evidencia alternativa:** las prohibiciones arquitectónicas necesitan revisión
   estática/data-flow y de capacidades; la suficiencia metodológica necesita
   revisión explícita. Tests de ejecución aislados no prueban esos universales.
6. **Resultados completos:** no hay FAIL ni BLOCKED/UNTESTED en los casos y
   evidencias obligatorios del perfil aprobado. Excepciones o exclusiones deben
   tener razón normativa, alcance y aprobación explícitos; no sirven para ocultar
   defectos. Los bloqueos históricos siguen visibles aunque una enmienda autorice
   una base de aceptación distinta.
7. **Reproducibilidad y revisión:** manifiestos inmutables con hashes de entradas,
   fuentes, oráculos y resultados; revisión de correspondencia contrato→caso y
   caso→fuente/oráculo por una persona o proceso independiente de su autoría.
   Cualquier cambio de expectativa exige una revisión versionada, no acomodación
   al código observado.

No se propone un número objetivo de tests equivalente a 280. La suficiencia se
debe justificar obligación por obligación y mediante una decisión de aceptación.

### Exclusiones y vacíos que requieren decisión

- Procedencia legítima de un checkpoint anterior y causalidad externa de fallo
  de agente no forman parte de lo que certifica un segmento reproducido (D-01).
  Una afirmación adicional requeriría evidencia externa específica.
- Una segunda implementación sigue fuera de F5-B. No se excluye del Hito C.
- V2–V10 no pueden rellenarse con salidas del motor y llamarse referencia.
  Sus condiciones heredadas de Hito C requieren una fijación autorizada y contraste
  independiente, sin inventar valores en esta fase.
- Los contratos individuales I-01–I-66 y las mecánicas históricas incompletas
  permanecen brechas documentales. Una política compatible de implementación no
  los transforma automáticamente en obligaciones normativas recuperadas.
- Interfaz web/renderer tienen evidencia de integración de ingeniería y pureza
  en Chromium; no un conjunto canónico exhaustivo de consumidores.

## Texto exacto propuesto para §37 — no aplicado

La aprobación de este expediente sería una orden distinta de su implementación.
Se propone reemplazar el texto de §37 por el siguiente bloque **solo después de
aprobar y publicar el manifiesto de aceptación al que remite**:

> **§37 — Criterio de conformidad**
>
> Una implementación es conforme a una revisión normativa y a un perfil de
> aceptación identificados si y solo si:
>
> 1. Respeta los contratos vigentes de §§6–30, los invariantes vigentes de §31,
>    el orden normativo de §32 y Replay Invariant §25.9, considerando únicamente
>    las sustituciones expresamente aprobadas para esa revisión.
> 2. Se ha aprobado expresamente y publicado un manifiesto versionado del corpus
>    de aceptación aplicable. El manifiesto identifica obligaciones, fuentes,
>    pre/postcondiciones, particiones de dominio, entradas, procedimientos,
>    oráculos, evidencias alternativas obligatorias y exclusiones justificadas.
>    Sus expectativas son inmutables dentro de esa revisión del manifiesto.
> 3. Todos los casos y evidencias obligatorios de ese manifiesto han sido
>    ejecutados o revisados y aceptados. Ninguno permanece FAIL, BLOCKED o UNTESTED.
>    Existe evidencia adversarial pertinente y una revisión explícita de suficiencia
>    por obligación. Un total de PASS o una asociación temática no es suficiente.
> 4. No existe OPEN-CRITICAL ni una obligación obligatoria cuya definición dependa
>    de una fuente desconocida o de código tratado como autoridad normativa.
>
> Los T01–T280 auténticos recuperados conservan sus identificadores, versiones y
> estados de recuperación/ejecución. Los no recuperados no reciben PASS ni una
> definición inventada. Cuando no pueda recuperarse su especificación individual,
> un corpus sustituto derivado de obligaciones vigentes podrá satisfacer la base
> de aceptación únicamente mediante aprobación normativa expresa de su manifiesto
> y alcance. Ese corpus usa identificadores nuevos y no se presenta como recuperación
> del corpus original. La aprobación del corpus no modifica las reglas físicas ni
> resuelve por implicación cláusulas normativas ausentes.
>
> La recuperación posterior de una fuente histórica obliga a revisar trazabilidad,
> cobertura y posibles discrepancias con la revisión vigente. No autoriza cambiar
> silenciosamente una expectativa ni aplicar como actual una regla sustituida.
> Cualquier discrepancia se resuelve por la jerarquía de autoridad y una decisión
> documentada antes de mantener una declaración de conformidad afectada.
>
> Hito B requiere el cumplimiento de este criterio para el perfil/revisión
> identificados. Hito C requiere además replay y comparación estructural y binaria
> de los mismos casos aplicables entre al menos dos implementaciones independientes,
> con las condiciones y vectores de referencia normativos de esa revisión. Una
> regresión entre versiones del mismo código, o un oráculo parcial compartido,
> no constituye interoperabilidad independiente. Ningún hito se deduce de otro.

Este bloque propone sustituir la exigencia literal «Tests T01–T280 han sido
ejecutados y pasan» por un mecanismo de aprobación de corpus, manteniendo las
demás obligaciones y explicitando su gobernanza. No elimina fuentes/vectores
obligatorios ni convierte las decisiones ACT/DYN/F4C en historia recuperada.
La redacción deberá revisarse por el responsable antes de convertirse en norma.

## Comparación futura y tratamiento de fuentes nuevas

Fijar el manifiesto y sus SHA antes de ejecutar una segunda implementación.
Comparar las mismas entradas, valores/representaciones admitidos, estructuras,
eventos, bytes WLS1, errores aplicables y causas terminales, sin modificar
expectativas para hacer coincidir ambos motores. Los contadores internos de
helpers se mantienen como ingeniería de yellow y no se imponen a otro diseño.
Registrar por separado desacuerdo de motores, error de oráculo y ambigüedad de
norma; no usar el resultado mayoritario como autoridad.

Si aparece un T auténtico después de aprobar un sustituto: conservarlo íntegro,
determinar su versión y relación con D-01, ejecutarlo en el ámbito aplicable,
comparar sus obligaciones con el corpus aprobado y abrir una revisión versionada
si revela un vacío o contradicción. No renombrar ND/ER para simular identidad T.

## Recomendación y decisión pendiente

**GO para revisar este expediente; HOLD para resolver/declarar la base de
aceptación canónica.** Se necesita elegir A con nuevas fuentes verificables o
aprobar expresamente B y su manifiesto suficiente. B no queda aprobado por F5-B.
Primero cerrar las lagunas de autoridad o precisarlas mediante órdenes delimitadas;
después fijar el corpus aplicable y revisar su suficiencia. Solo tras esa revisión
podrá autorizarse el siguiente incremento, incluido un contraste independiente.
No se inicia otra implementación ni se declaran los hitos B/C aquí.
