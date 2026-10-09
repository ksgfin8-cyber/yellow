// Trayectoria. Tipo puro, sin lógica.
// Contrato: js/experiment/trajectory.js según especificación §18.2.

class Trajectory {
    constructor(experiment_config, initial_state, steps, events, termination_reason, metadata) {
        this.experiment_config = experiment_config;
        this.initial_state = initial_state;
        this.steps = steps;
        this.events = events;
        this.termination_reason = termination_reason;
        this.metadata = metadata;
    }
}
