// Acciones admitidas.
// Contrato: js/interface/action.js según especificación §11.1.

const ActionType = Object.freeze({
    MOVE_N: "MOVE_N",
    MOVE_S: "MOVE_S",
    MOVE_E: "MOVE_E",
    MOVE_W: "MOVE_W",
    WAIT: "WAIT"
});

function makeAction(type) {
    if (!ActionType[type]) {
        throw new Error("makeAction: unknown action type '" + type + "'");
    }
    return { type: type };
}

// §12: structural validation deliberately does not check the enum.
function validate_Action_structural(action) {
    return has_exact_fields(action, ["type"]) && typeof action.type === "string";
}
function assert_Action_structural(action) {
    if (!validate_Action_structural(action)) throw new ContractError("invalid action structure");
    return action;
}
