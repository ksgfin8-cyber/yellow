// Renderer. Solo lee WorldState. Nunca modifica.
// Contrato: js/visualization/renderer.js según especificación §21.

class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.cellSize = 20;
    }

    render(world) {
        const ctx = this.ctx;
        const cs = this.cellSize;

        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let y = 0; y < world.config.height; y++) {
            for (let x = 0; x < world.config.width; x++) {
                const cell = world.state.grid[y][x];
                const px = x * cs;
                const py = y * cs;

                if (cell.traversal === "BLOCKED") {
                    ctx.fillStyle = "#333";
                } else if (cell.effect && cell.effect.kind === "RESOURCE" && cell.effect.stock > 0) {
                    ctx.fillStyle = "#4caf50";
                } else if (cell.effect && cell.effect.kind === "HAZARD") {
                    ctx.fillStyle = "#f44336";
                } else {
                    ctx.fillStyle = "#eee";
                }
                ctx.fillRect(px, py, cs - 1, cs - 1);
            }
        }

        // Entidad.
        const e = world.get_experimental_entity();
        if (e) {
            ctx.fillStyle = "#2196f3";
            ctx.fillRect(e.position.x * cs, e.position.y * cs, cs - 1, cs - 1);
        }

        // Info textual.
        ctx.fillStyle = "#000";
        ctx.font = "14px monospace";
        if (e) {
            ctx.fillText("Energy: " + e.energy + "  Time: " + world.state.time, 10, this.canvas.height - 10);
        }
    }
}
