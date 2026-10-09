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
