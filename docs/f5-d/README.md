# WORLD-LAB F5-D — expediente de reconciliación

**DRAFT / UNAPPROVED / NON-NORMATIVE. Decisión final: HOLD — INSUFFICIENT AUTHORITY.**
Base main PR #33: `a3fb5b823bfdf74a981e9acf9e10bb30cc18b478`.
Rama: `dev/f5-d-normative-reconciliation`. Sin aprobación normativa/productiva.

| Entrega obligatoria | Artefacto y propósito |
|---|---|
| REQUIREMENTS_RECOVERY_REPORT | [Informe de recuperación](REQUIREMENTS_RECOVERY_REPORT.md), [fuentes](sources.json) y [dependencias externas/66 IDs](recovery.json) |
| SEMANTIC_REQUIREMENTS_REGISTER | [65 familias contractuales](semantic-requirements.json), definiciones directas, partes conocidas/desconocidas y dependencias |
| CONTRACT_RECONCILIATION_MATRIX | [Fuente→contrato→código→evidencia→discrepancia](contract-reconciliation.json), supersesiones y argumentos de equivalencia |
| UNRESOLVED_DECISIONS | [Diez decisiones preliminares](UNRESOLVED_DECISIONS.md), incluido INIT-004 cerrado, y [datos](unresolved-decisions.json) |
| CONSOLIDATED_SPECIFICATION_CANDIDATE | [Producto A](CONSOLIDATED_SPECIFICATION_CANDIDATE.md), solo partes sustentadas y marcas editoriales; no completo todavía |
| NORMATIVE_CHANGE_PROPOSALS | [Producto B](NORMATIVE_CHANGE_PROPOSALS.md), opciones nuevas condicionales, no autoridad provisional |
| VERSIONING_DECISION_REPORT | [Alternativas, riesgos y condiciones](VERSIONING_DECISION_REPORT.md) |
| VERIFICATION_REPORT | [Verificaciones y límites](VERIFICATION_REPORT.md), [regresiones](regression-results.json) y manifiesto de integridad |

## Cómo contar e interpretar el registro

65 **familias de contratos/interfaces o propiedades**, no65 párrafos ni65 nuevos
invariantes. Definición directa:32 DETERMINED,31 PARTIALLY_DETERMINED,
2 INDETERMINATE. Una familia conserva subcondiciones de dominio/pre/post/orden;
no se agrupan reglas por mera similitud de redacción. Las referencias repetidas
se enlazan, no se presentan como nuevas reglas. I01–I66 forman una familia no
expandida y66 referencias individuales; no se afirma equivalencia entre ellas.
La cuenta no identifica el universo histórico total ni significa verificación.
Un contrato directamente determinado puede depender de otro parcial: no inferir
cierre transitivo ni conformidad del estado de definición directa.

El [rastro de572 fragmentos F5-C](fragment-trace.json) conserva todos los localizadores,
metadatos y referencias opacas. Las asociaciones son contexto de cláusula, **no
prueba de que cada fragmento soporte cada parte del contrato**, ni suficiencia.
La interpretación semántica está revisada en contracts.py; una herramienta de
integridad no puede autenticar una historia ausente ni demostrar equivalencia
universal. Los textos en autoridad D de F5-C no se convierten en norma.

## Reproducción acotada

```bash
python -B docs/f5-d/build.py
python -B docs/f5-d/build_decisions.py
python -B docs/f5-d/validate.py
```

build.py y build_decisions.py solo generan análisis desde catálogo revisado y
fuentes fijadas, sin importar el motor. recovery.py inventaría los adjuntos
accesibles: ejecutarlo de nuevo en otro entorno cambia esa evidencia de búsqueda,
no recupera el manuscrito; su resultado queda fijado como observación de esta sesión.
El manifiesto fija archivos/fuentes/código/suites examinados, sin ciclos de hash.
validate.py comprueba fuentes, referencias, dominios de estados, ID/dependencias,
trazas bidireccionales, separación A/B y protección de baseline. No añade tests
productivos ni altera corpus/expectativas anteriores.

## Siguiente entrada necesaria

EXT-024: copia íntegra verificable del documento anunciado de aproximadamente1300
líneas. EXT-023: fuente concreta para investigar I01–I53 según referencias reales.
No se ha agotado recuperación. Primero ingesta/reconciliación, después decidir
edición equivalente o revisión acotada; no asignar v0.2.7/v0.3.0 por anticipado.
