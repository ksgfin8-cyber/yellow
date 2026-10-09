// Agente trivial: siempre WAIT.
// Contrato: js/agents/wait_agent.js según especificación §14.2.

class WaitAgent extends Agent {
    reset() {
        // Sin estado interno.
    }

    step(feedback) {
        return makeAction("WAIT");
    }
}
