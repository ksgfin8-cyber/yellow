// Configuración del experimento.
// Contrato: js/experiment/experiment_config.js según especificación §15.

class ExperimentConfig {
    constructor(params) {
        if (!Number.isInteger(params.experiment_seed) || params.experiment_seed === 0) {
            throw new Error("ExperimentConfig: experiment_seed must be a non-zero integer");
        }
        if (!Number.isInteger(params.max_ticks) || params.max_ticks <= 0) {
            throw new Error("ExperimentConfig: max_ticks must be a positive integer");
        }
        if (!(params.world_config instanceof WorldConfig)) {
            throw new Error("ExperimentConfig: world_config must be a WorldConfig");
        }
        if (!(params.feedback_config instanceof FeedbackConfig)) {
            throw new Error("ExperimentConfig: feedback_config must be a FeedbackConfig");
        }
        if (typeof params.agent_type !== "string") {
            throw new Error("ExperimentConfig: agent_type must be a string");
        }
        if (!AGENT_REGISTRY[params.agent_type]) {
            throw new Error("ExperimentConfig: agent_type '" + params.agent_type + "' is not registered");
        }

        this.experiment_seed = params.experiment_seed >>> 0;
        this.max_ticks = params.max_ticks;
        this.world_config = params.world_config;
        this.feedback_config = params.feedback_config;
        this.agent_type = params.agent_type;

        Object.freeze(this);
    }
}
