// P01 FrontierMemory-v1. Operational research agent, not a WORLD rule.
// Only Observation/Feedback and private episode memory; no WORLD/Recorder access.
class FrontierMemoryAgent extends Agent {
    constructor() { super(); this.reset(); }
    reset() {
        this.known = new Map();
        this.visited = new Set();
        this.consumed = new Set();
    }
    static key(x, y) { return `${x},${y}`; }
    step(feedback) {
        const {self, local_view} = feedback.observation;
        const radius = (local_view.length - 1) / 2;
        for (let y = 0; y < local_view.length; y++) for (let x = 0; x < local_view[y].length; x++) {
            const cell = {x: self.position.x + x - radius, y: self.position.y + y - radius,
                representation: local_view[y][x].representation};
            this.known.set(FrontierMemoryAgent.key(cell.x, cell.y), cell);
        }
        const start = FrontierMemoryAgent.key(self.position.x, self.position.y);
        this.visited.add(start);
        if (feedback.has_prior_action) for (const event of feedback.last_action_result.events) {
            if (event.type === 'RESOURCE_CONSUMED') this.consumed.add(FrontierMemoryAgent.key(event.position.x, event.position.y));
        }
        const directions = [
            {type: 'MOVE_N', dx: 0, dy: -1}, {type: 'MOVE_E', dx: 1, dy: 0},
            {type: 'MOVE_S', dx: 0, dy: 1}, {type: 'MOVE_W', dx: -1, dy: 0}
        ];
        const traversable = c => c && ['FREE', 'RESOURCE', 'HAZARD'].includes(c.representation);
        const reached = new Map([[start, {distance: 0, first: null}]]), queue = [start];
        for (let i = 0; i < queue.length; i++) {
            const key = queue[i], cell = this.known.get(key), route = reached.get(key);
            for (const d of directions) {
                const next = FrontierMemoryAgent.key(cell.x + d.dx, cell.y + d.dy);
                if (!reached.has(next) && traversable(this.known.get(next))) {
                    reached.set(next, {distance: route.distance + 1, first: route.first ?? d.type});
                    queue.push(next);
                }
            }
        }
        const resources = [], frontiers = [];
        for (const [key, route] of reached) {
            const cell = this.known.get(key), candidate = {...cell, ...route};
            if (cell.representation === 'RESOURCE' && !this.consumed.has(key)) resources.push(candidate);
            if (directions.some(d => !this.known.has(FrontierMemoryAgent.key(cell.x + d.dx, cell.y + d.dy)))) frontiers.push(candidate);
        }
        const candidates = resources.length ? resources : frontiers;
        candidates.sort((a, b) => a.distance - b.distance || a.y - b.y || a.x - b.x);
        return {type: candidates[0]?.first ?? 'WAIT'};
    }
}
