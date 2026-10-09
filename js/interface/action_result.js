// Resultado operacional de una acción. Producido por World.
// Contrato: js/interface/action_result.js según especificación §13.1.

const ActionResultValidity = Object.freeze({
    VALID: "VALID",
    INVALID: "INVALID",
    FAILED: "FAILED"
});

const ActionResultReason = Object.freeze({
    NONE: "NONE",
    BLOCKED_CELL: "BLOCKED_CELL",
    INSUFFICIENT_ENERGY: "INSUFFICIENT_ENERGY"
});

// World.apply_action() devuelve directamente el objeto.
// No hay clase separada para evitar duplicación innecesaria.
