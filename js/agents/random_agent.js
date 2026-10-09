// Agente aleatorio determinista.
// Contrato: js/agents/random_agent.js según especificación §14.3.

class RandomAgent extends Agent {
    constructor(seed) {
        super();
        this._initial_seed = seed;
        this.rng = new PRNG(seed);
    }

    reset() {
        // Restaurar el estado inicial exacto.
        this.rng = new PRNG(this._initial_seed);
    }

    step(feedback) {
        const idx = this.rng.next_int(0, 4);
        const actions = ["MOVE_N", "MOVE_S", "MOVE_E", "MOVE_W", "WAIT"];
        return makeAction(actions[idx]);
    }
}
