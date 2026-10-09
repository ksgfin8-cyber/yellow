// Punto de entrada. Crea el experimento, lo ejecuta y lo visualiza.
// Contrato: js/main.js según especificación §2.

window.addEventListener("DOMContentLoaded", () => {
    // Ejecutar tests.
    console.log("=== Tests ===");
    for (const r of Tests.results) {
        console.log(r.status + " " + r.id + " " + r.name + (r.error ? " — " + r.error : ""));
    }

    // Crear experimento.
    const cfg = new ExperimentConfig({
        experiment_seed: 12345,
        max_ticks: 200,
        world_config: WorldConfig.defaults(),
        feedback_config: FeedbackConfig.defaults(),
        agent_type: "random"
    });

    const experiment = new Experiment(cfg);
    const trajectory = experiment.run();

    console.log("=== Trajectory ===");
    console.log("Steps:", trajectory.steps.length);
    console.log("Termination:", trajectory.termination_reason);
    console.log("Events:", trajectory.events.length);

    // Renderizar el estado final.
    const canvas = document.getElementById("canvas");
    canvas.width = cfg.world_config.width * 20;
    canvas.height = cfg.world_config.height * 20;
    const renderer = new Renderer(canvas);

    // Reconstruir un mundo a partir del estado final para renderizar.
    // (En v0.1, el renderer lee el estado final de la trayectoria).
    const lastStep = trajectory.steps[trajectory.steps.length - 1];
    if (lastStep) {
        const world = new World(cfg.world_config);
        world.state = lastStep.world_state;
        world.experimental_entity_id = Object.keys(lastStep.entity_states)[0];
        renderer.render(world);
    }
});
