// Interfaz base del agente.
// Contrato: js/agents/agent.js según especificación §14.1.

class Agent {
    reset() {
        throw new Error("Agent.reset: not implemented");
    }

    step(feedback) {
        throw new Error("Agent.step: not implemented");
    }
}
