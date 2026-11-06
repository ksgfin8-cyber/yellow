// Resultado operacional de una acción. Producido por World.
// F2-D engineering policy under §13; historical closed schema remains unverified.
// Closed result: {validity, reason, energy_delta, events}. See IMPLEMENTATION_STATUS.

const ActionResultValidity = Object.freeze({
    VALID: "VALID",
    INVALID: "INVALID",
    FAILED: "FAILED"
});

const ActionResultReason = Object.freeze({
    NONE: "NONE",
    ENTITY_NOT_ACTIVE: "ENTITY_NOT_ACTIVE",
    OUT_OF_BOUNDS: "OUT_OF_BOUNDS",
    BLOCKED_CELL: "BLOCKED_CELL",
    INSUFFICIENT_ENERGY: "INSUFFICIENT_ENERGY"
});

// World.apply_action() constructs fresh records. VALID/NONE, INVALID/spatial or
// inactive reason, FAILED/INSUFFICIENT_ENERGY; finite canonical net energy delta.
// F2-H replaces ACT-P04: accepted MOVE emits ENTITY_MOVED, then the executed
// RESOURCE_CONSUMED or HAZARD_TRIGGERED effect, as raw closed WorldEvent records.
// WAIT/rejected actions have no operational events; no death or Recorder metadata.
