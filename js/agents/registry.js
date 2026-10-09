// Registro de agentes. Vive fuera del mundo.
// Contrato: js/agents/registry.js según especificación §14.5.

const AGENT_REGISTRY = {
    "wait": WaitAgent,
    "random": RandomAgent,
    "rule": RuleAgent
};

function create_agent(type, seed) {
    if (!AGENT_REGISTRY[type]) {
        throw new Error("create_agent: unknown agent type '" + type + "'");
    }
    // RandomAgent necesita seed. Los demás no.
    if (type === "random") {
        return new AGENT_REGISTRY[type](seed);
    }
    return new AGENT_REGISTRY[type]();
}
