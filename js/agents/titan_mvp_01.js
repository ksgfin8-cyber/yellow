// TITAN-MVP-01: finite v0.3-inspired selector + explicitly experimental D4 adapter.
// Not a TN-LAB/59D implementation. Only Observation/Feedback; no WORLD/seed/I/O.
const TITAN_MVP_01_DIRECTIONS = Object.freeze([
    Object.freeze({id: "M_N", type: "MOVE_N", dx: 0, dy: -1, row: 0, col: 1}),
    Object.freeze({id: "M_E", type: "MOVE_E", dx: 1, dy: 0, row: 1, col: 2}),
    Object.freeze({id: "M_S", type: "MOVE_S", dx: 0, dy: 1, row: 2, col: 1}),
    Object.freeze({id: "M_W", type: "MOVE_W", dx: -1, dy: 0, row: 1, col: 0})
]);
function titan_mvp_01_require(ok, message) {
    if (!ok) throw new TypeError("TITAN-MVP-01: " + message);
}
function selectTitanMVP01Mechanism({costs, phi, L}) {
    // Fixed four-ID specialization permitted by IMPLEMENTATION_CONTRACT §4.
    titan_mvp_01_require(Array.isArray(costs) && costs.length === 4, "four explicit cost pairs required");
    const byId = new Map();
    for (const pair of costs) {
        titan_mvp_01_require(Array.isArray(pair) && pair.length === 2 &&
            TITAN_MVP_01_DIRECTIONS.some(d => d.id === pair[0]) && !byId.has(pair[0]) &&
            typeof pair[1] === "number" && Number.isFinite(pair[1]) && pair[1] >= 0, "invalid/duplicate mechanism cost");
        byId.set(pair[0], pair[1]);
    }
    titan_mvp_01_require(typeof phi === "number" && Number.isFinite(phi) && phi >= 0 && phi <= 1, "invalid phi");
    titan_mvp_01_require(typeof L === "number" && Number.isFinite(L) && L > 0, "invalid L");
    const cNull = L * phi;
    titan_mvp_01_require(Number.isFinite(cNull), "nonfinite null cost");
    const ordered = TITAN_MVP_01_DIRECTIONS.map(d => [d.id, byId.get(d.id)]);
    const cap = Math.min(...ordered.map(p => p[1])), maximum = Math.max(...ordered.map(p => p[1]));
    const minimum = Math.min(cap, cNull);
    const minimizers = ordered.filter(p => p[1] === minimum).map(p => p[0]);
    if (cNull === minimum) minimizers.push("NULL");
    return {minimizers, selected: minimizers[0], cNull, cap,
        gaps: ordered.map(([id, cost]) => [id, cost - cap]), gapGlobal: maximum - cap};
}
function titan_mvp_01_copy(value) {
    if (Array.isArray(value)) return value.map(titan_mvp_01_copy);
    if (value !== null && typeof value === "object") {
        return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, titan_mvp_01_copy(v)]));
    }
    return value;
}
function titan_mvp_01_record(value, fields) {
    return value !== null && typeof value === "object" && !Array.isArray(value) &&
        Reflect.ownKeys(value).length === fields.length && fields.every(k => {
            const d = Object.getOwnPropertyDescriptor(value, k);
            return d && Object.hasOwn(d, "value");
        });
}
function titan_mvp_01_position(p) {
    return titan_mvp_01_record(p, ["x", "y"]) && Number.isSafeInteger(p.x) && p.x >= 0 &&
        Number.isSafeInteger(p.y) && p.y >= 0;
}
class TitanMVP01Agent extends Agent {
    #visited;
    #consumed;
    #diagnostic;
    constructor() { super(); this.reset(); }
    reset() { this.#visited = new Set(); this.#consumed = new Set(); this.#diagnostic = null; }
    getDiagnostic() { return titan_mvp_01_copy(this.#diagnostic); }
    step(feedback) {
        const require = titan_mvp_01_require;
        require(titan_mvp_01_record(feedback, ["observation", "has_prior_action", "last_action_result"]), "invalid feedback");
        require(typeof feedback.has_prior_action === "boolean", "invalid prior flag");
        const o = feedback.observation;
        require(titan_mvp_01_record(o, ["tick", "self", "local_view"]), "invalid observation");
        require((typeof o.tick === "number" && Number.isSafeInteger(o.tick) && o.tick >= 0) ||
            (typeof o.tick === "bigint" && o.tick >= 0n && o.tick <= (1n << 64n) - 1n), "invalid tick");
        const self = o.self;
        require(titan_mvp_01_record(self, ["id", "position", "energy"]) && self.id === "0987898" &&
            titan_mvp_01_position(self.position) && typeof self.energy === "number" && Number.isFinite(self.energy), "invalid profile self");
        require(Array.isArray(o.local_view) && o.local_view.length === 3, "radius1/3x3 required");
        for (let y = 0; y < 3; y++) {
            require(Array.isArray(o.local_view[y]) && o.local_view[y].length === 3, "invalid local view");
            for (let x = 0; x < 3; x++) {
                const cell = o.local_view[y][x];
                require(titan_mvp_01_record(cell, ["representation", "occupied"]) && cell.occupied === false &&
                    ["FREE", "RESOURCE", "HAZARD", "BLOCKED", "OUT_OF_BOUNDS"].includes(cell.representation), "invalid cell");
            }
        }
        const resources = [];
        if (feedback.has_prior_action) {
            const result = feedback.last_action_result;
            require(titan_mvp_01_record(result, ["validity", "reason", "energy_delta", "events"]) &&
                ["VALID", "INVALID", "FAILED"].includes(result.validity) &&
                ["NONE", "ENTITY_NOT_ACTIVE", "OUT_OF_BOUNDS", "BLOCKED_CELL", "INSUFFICIENT_ENERGY"].includes(result.reason) &&
                typeof result.energy_delta === "number" && Number.isFinite(result.energy_delta) && Array.isArray(result.events), "invalid exposed prior result");
            for (const event of result.events) {
                require(titan_mvp_01_record(event, ["type", "entity_id", "position"]) && event.entity_id === self.id &&
                    ["ENTITY_MOVED", "RESOURCE_CONSUMED", "HAZARD_TRIGGERED"].includes(event.type) &&
                    titan_mvp_01_position(event.position), "invalid prior event");
                if (event.type === "RESOURCE_CONSUMED") resources.push(`${event.position.x},${event.position.y}`);
            }
        } else require(feedback.last_action_result === null, "unexpected prior result");
        const neighbors = TITAN_MVP_01_DIRECTIONS.map(d => {
            const x = self.position.x + d.dx, y = self.position.y + d.dy;
            require(Number.isSafeInteger(x) && Number.isSafeInteger(y), "unsafe target coordinate");
            return {id: d.id, x, y, representation: o.local_view[d.row][d.col].representation};
        });
        // Validate all used inputs before updating memory. Never mark a proposed target visited.
        this.#visited.add(`${self.position.x},${self.position.y}`);
        resources.forEach(key => this.#consumed.add(key));
        const key = n => `${n.x},${n.y}`;
        // Opportunity is defined from observations/memory, not inferred from C or reward.
        const phi = Number(neighbors.some(n =>
            (n.representation === "RESOURCE" && !this.#consumed.has(key(n))) ||
            (n.representation === "FREE" && !this.#visited.has(key(n)))));
        const costs = neighbors.map(n => [n.id,
            n.representation === "RESOURCE" ? (this.#consumed.has(key(n)) ? 3 : 0) :
            n.representation === "FREE" ? (this.#visited.has(key(n)) ? 3 : 1) :
            n.representation === "HAZARD" ? 4 : 5]);
        const selection = selectTitanMVP01Mechanism({costs, phi, L: 2});
        const direction = TITAN_MVP_01_DIRECTIONS.find(d => d.id === selection.selected);
        const action = {type: direction ? direction.type : "WAIT"};
        this.#diagnostic = {tick: o.tick, entity_id: self.id,
            state_projected: {position: {x: self.position.x, y: self.position.y}, neighbors,
                visited: [...this.#visited], consumed: [...this.#consumed]},
            phi_exp: phi, L_exp: 2, costs, ...selection, action: {type: action.type}};
        return action;
    }
}
