// F4-A: presentation adapter only. ExperimentResult remains unchanged.
function web_demo_config(agent_type = "random") {
    return new ExperimentConfig({experiment_seed: 12345, max_ticks: 10,
        world_config: {...WorldConfig.defaults(), width: 6, height: 6},
        feedback_config: FeedbackConfig.defaults(), agent_type});
}
function present_experiment_result(result, config) {
    const status = document.getElementById("execution-status");
    const summary = document.getElementById("summary");
    const diagnostic = document.getElementById("diagnostic");
    const render_status = document.getElementById("render-status");
    const canvas = document.getElementById("canvas");
    status.textContent = result.status;
    diagnostic.hidden = result.status !== "FAILED";
    diagnostic.textContent = result.status === "FAILED" ?
        "La ejecución falló: " + result.failure_reason + ". " + (result.failure_details?.message ?? "") : "";
    render_status.hidden = true; render_status.textContent = "";
    canvas.hidden = true;
    if (result.trajectory === null) {
        summary.textContent = "Motivo de fallo: " + result.failure_reason;
        return;
    }
    const trajectory = result.trajectory;
    const last = trajectory.steps.length === 0 ? null : trajectory.steps[trajectory.steps.length - 1];
    const state = last === null ? trajectory.initial_state : last.world_state;
    const entity = state.entities.values().next().value;
    const lines = ["Pasos: " + trajectory.steps.length, "Eventos: " + trajectory.events.length,
        "Terminación: " + trajectory.termination_reason, "Tiempo: " + String(state.time),
        "Entidad: " + entity.id + " · posición (" + entity.position.x + ", " + entity.position.y + ")",
        "Energía: " + entity.energy + " · lifecycle: " + entity.lifecycle];
    if (last !== null) {
        const hex = value => "0x" + value.toString(16).padStart(8, "0");
        lines.push("Hash WORLD: " + hex(last.state_hash_world), "Hash FULL: " + hex(last.state_hash_full));
    } else lines.push("Sin StepRecords: no hay hashes de último paso.");
    summary.textContent = lines.join("\n");
    try {
        assert_WorldState(state, config.world_config);
        const renderer = new Renderer(canvas);
        canvas.width = config.world_config.width * renderer.cellSize;
        canvas.height = config.world_config.height * renderer.cellSize;
        // Independent copy preserves the result even if visualization fails.
        renderer.render({config: config.world_config, state: state.full_snapshot()});
        canvas.hidden = false;
    } catch (error) {
        render_status.textContent = "No se pudo visualizar el resultado: " + String(error);
        render_status.hidden = false;
    }
}
function run_web_experiment(config, agent_factory) {
    const canvas = document.getElementById("canvas");
    canvas.hidden = true;
    document.getElementById("execution-status").textContent = "Ejecutando…";
    document.getElementById("summary").textContent = "";
    document.getElementById("diagnostic").hidden = true;
    document.getElementById("render-status").hidden = true;
    let checked, result;
    try {
        checked = new ExperimentConfig(config);
        result = new Experiment(checked).run(agent_factory);
    } catch (error) {
        document.getElementById("execution-status").textContent = "Error de ejecución";
        const diagnostic = document.getElementById("diagnostic");
        diagnostic.textContent = "La ejecución se detuvo: " + String(error);
        diagnostic.hidden = false;
        return null; // No invented ExperimentResult for unspecified internal failures.
    }
    present_experiment_result(result, checked);
    return result;
}
window.addEventListener("DOMContentLoaded", () => {
    const demo = web_demo_config();
    document.getElementById("demo-config").textContent = "Demostración: semilla " + demo.experiment_seed +
        ", mapa " + demo.world_config.width + "×" + demo.world_config.height + ", máximo " + String(demo.max_ticks) + " ticks.";
    document.getElementById("run-wait").addEventListener("click", () => run_web_experiment(web_demo_config("wait")));
    document.getElementById("run-random").addEventListener("click", () => run_web_experiment(web_demo_config("random")));
    run_web_experiment(demo);
});
