// WORLD-LAB §19 + F3A-P01. Registry/factory availability is not config validity.
const EXPERIMENT_CONFIG_FIELDS = Object.freeze([
    "experiment_seed", "max_ticks", "world_config", "feedback_config", "agent_type"
]);
function validate_experiment_agent_type(value) {
    // F3B-P01: minimal identifier policy, not a recovered historical character set.
    return is_unicode_string(value) && value.length > 0;
}
function validate_ExperimentConfig(params) {
    return has_exact_fields(params, EXPERIMENT_CONFIG_FIELDS) &&
        is_uint32(params.experiment_seed) && params.experiment_seed !== 0 &&
        is_uint64(params.max_ticks) && validate_WorldConfig(params.world_config) &&
        validate_FeedbackConfig(params.feedback_config) && validate_experiment_agent_type(params.agent_type);
}
class ExperimentConfig {
    constructor(params) {
        ExperimentConfig._validate(params);
        this.experiment_seed = params.experiment_seed; // validated, never reduced with >>> 0
        this.max_ticks = params.max_ticks; // preserve Number/BigInt and exact value
        this.world_config = new WorldConfig(params.world_config);
        this.feedback_config = new FeedbackConfig(params.feedback_config);
        this.agent_type = params.agent_type; // preserve exact Unicode; no trimming/normalization
        Object.freeze(this);
    }
    static _validate(params) {
        if (!has_exact_fields(params, EXPERIMENT_CONFIG_FIELDS) ||
            !is_uint32(params.experiment_seed) || params.experiment_seed === 0) {
            throw new ContractError("world transition failed");
        }
        if (!is_uint64(params.max_ticks)) throw new ContractError("invalid max_ticks");
        WorldConfig._validate(params.world_config);
        FeedbackConfig._validate(params.feedback_config);
        if (!validate_experiment_agent_type(params.agent_type)) throw new ContractError("world transition failed");
    }
}
