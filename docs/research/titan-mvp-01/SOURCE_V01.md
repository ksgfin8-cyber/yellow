# FUENTE DE REFERENCIA — TITAN Mathematical Specification v0.1

**Origen:** texto aportado por el propietario en conversación el 20 de noviembre de 2026.  
**Estado:** REPRESENTACIÓN NORMALIZADA PARA LECTURA, NO COPIA LITERAL CERTIFICADA. No sustituye el texto original. Se conservan contenido y distinciones materiales; fórmulas reescritas con notación legible. Ninguna corrección aquí constituye aprobación de cambio de teoría.

## 0. Propósito

Marco matemático para modelar, evaluar y ejecutar decisiones bajo incertidumbre estructural y decidibilidad desconocida; no afirma resolver indecidibilidad. Independiente del dominio, agnóstico al contenido, orientado a decisión.

## 1. Preliminares

`X`: observaciones crudas. `H`: estados comprimidos. `M`: mecanismos. `R`: regímenes. En v0.1 un mecanismo `M_i:H→A` produce una acción en un espacio `A`. Costo `C:M×H→R_+` de rendimiento relativo.

## 2. Axiomas

1. Compresión suficiente: existe `Γ:X→H` que preserva estructura relevante para decisión.
2. No universalidad: se postula ausencia de un mecanismo `M*` óptimo para todos los estados.
3. Dependencia de régimen: `R:H→R`; los costos dependen del régimen `R(h)`.
4. Evaluabilidad relativa: mecanismos comparables para todo estado.
5. Decidibilidad local: `Φ:H→[0,1]`, resolubilidad práctica.
6. Opción nula: `∅∈A` es decisión válida.

## 3. Operadores

- `h=Γ(x)`
- `C_i(h)=C(M_i,h)`
- `M*(h) ∈ argmin_{M_i∈M} C(M_i,h)`
- `Φ(h)` cercano a 1 se interpreta como alta decidibilidad, cercano a 0 como baja.
- Política de umbral (v0.1): `Π(h)=M*(h)` si `Φ(h)>τ`, o `∅` si `Φ(h)≤τ`, con `τ∈[0,1]`.

## 4. Problema TITAN

Tupla `P=(X,H,M,C,R,Φ)` sometida a esos axiomas.

## 5. Propiedades declaradas

- Selectividad: `H_d={h:Φ(h)>τ}`.
- Región no decidible: `H_u={h:Φ(h)≤τ}`.
- Inacción: `h∈H_u ⇒ Π(h)=∅`.
- Dependencia contextual: se declara que mecanismos óptimos cambian con el régimen. **Observación crítica:** esa implicación no se deduce formalmente de solo `R(h)≠R(h')`; para este expediente queda como declaración de la fuente, no teorema verificado.

## 6. Definición operacional de decidibilidad

El documento considera decidible un estado si algún mecanismo supera un costo baseline: `∃M_i:C(M_i,h)<C_baseline(h)`; en caso contrario sugiere `Φ(h)≈0`. No proporciona una regla numérica completa para `Φ` cuando sí hay mejora.

## 7. Operador completo alternativo

`Π(h)=argmin_{M_i∈M} C(M_i,h)` cuando existe un mecanismo con `C(M_i,h)<C_baseline(h)`; de lo contrario `∅`. **No queda demostrado que este operador coincida para todos los estados con la política por umbral de §3.**

## 8. Invariantes declarados

I1 ausencia de decisión sin ventaja. I2 decisiones dependientes de `H` y no directamente de `X`. I3 solo evaluación relativa. I4 ausencia de mecanismo globalmente dominante.

## 9–11. Naturaleza, reducción e interpretación

El sistema se declara no predictivo esencialmente, selectivo, contextual, modular. La «reducción mínima» escribe un argmin multiplicado por `1_{Φ(h)>τ}`; se conserva como formulación informal, **no** como operador de acciones tipado (multiplicar un mecanismo por cero no es definir `∅`). Preguntas: «¿Es este estado decidible?» y «¿Cuál es el mejor mecanismo disponible?».

## Limitaciones para implementación

No aparecen fórmula computacional completa de `Γ`, cálculo numérico general de `Φ`, `C_baseline`, costos predecisionales ni mecanismo de conversión de la selección a acciones WORLD. El documento expresa reglas alternativas potencialmente no equivalentes. No se corregirán de manera implícita.

**Nota de procedencia:** el texto entregado en conversación era el único original accesible en este expediente; esta normalización permite a Codex leer sus objetos. Para una certificación de fuente textual exacta se requeriría adjuntar el documento original original en bytes.
