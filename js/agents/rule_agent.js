// Agente de reglas simple. Solo para probar el contrato.
// Contrato: js/agents/rule_agent.js según especificación §14.4.

class RuleAgent extends Agent {
    reset() {
        // Sin estado interno.
    }

    step(feedback) {
        const view = feedback.observation.local_view;
        const r = (view.length - 1) / 2;

        // Orden canónico: N, E, S, W.
        const directions = [
            { type: "MOVE_N", dx: 0, dy: -1 },
            { type: "MOVE_E", dx: 1, dy: 0 },
            { type: "MOVE_S", dx: 0, dy: 1 },
            { type: "MOVE_W", dx: -1, dy: 0 }
        ];

        for (const dir of directions) {
            const x = r + dir.dx;
            const y = r + dir.dy;
            const cell = view[y][x];
            if (cell.representation === "RESOURCE" && !cell.occupied) {
                return makeAction(dir.type);
            }
        }

        return makeAction("WAIT");
    }
}
