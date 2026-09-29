/* ============================================================
 * GEI — MUNDO DE SUPERVIVENCIA v0.1
 * Arquitectura: MODEL → RENDER → VIEW
 * ============================================================ */

/* ------------------------------------------------------------
 * 1. CONFIGURATION
 * ---------------------------------------------------------- */
const CONFIG = {
    TICKS_PER_HOUR: 4,          // 4 ticks = 1 hora
    HOURS_PER_DAY: 24,
    TICK_INTERVAL_MS: 500,      // velocidad de simulación
    MAX_EVENTS: 50,
    RESOURCE_MAX: {
        water: 100,
        food: 100,
        wood: 100,
        minerals: 100
    }
};

/* ------------------------------------------------------------
 * 2. RANDOMNESS ABSTRACTION (sección 27)
 * ---------------------------------------------------------- */
const RNG = (() => {
    let seed = 123456789;
    return {
        setSeed(s) { seed = s >>> 0; },
        next() {
            // xorshift32 — determinista, reproducible
            seed ^= seed << 13; seed >>>= 0;
            seed ^= seed >> 17;
            seed ^= seed << 5;  seed >>>= 0;
            return seed / 4294967296;
        },
        range(min, max) { return min + this.next() * (max - min); },
        int(min, max) { return Math.floor(this.range(min, max + 1)); },
        chance(p) { return this.next() < p; }
    };
})();

/* ------------------------------------------------------------
 * 3. WORLD DATA — definición estática de zonas
 * ---------------------------------------------------------- */
const WORLD_DATA = {
    zones: [
        {
            id: "M1", name: "Montaña", type: "mountain",
            connections: ["B1", "V1"],
            environment: { temperature: 5, humidity: 40, rain: 0, wind: 60, light: 50 },
            resources: { water: 30, food: 10, wood: 15, minerals: 80 },
            danger: 60,
            regen: { water: 0.1, food: 0.05, wood: 0.1, minerals: 0.0 }
        },
        {
            id: "B1", name: "Bosque", type: "forest",
            connections: ["M1", "L1", "A1"],
            environment: { temperature: 18, humidity: 65, rain: 0, wind: 20, light: 60 },
            resources: { water: 40, food: 70, wood: 90, minerals: 10 },
            danger: 25,
            regen: { water: 0.3, food: 0.4, wood: 0.5, minerals: 0.0 }
        },
        {
            id: "L1", name: "Llanura", type: "plain",
            connections: ["B1", "A1", "P1"],
            environment: { temperature: 20, humidity: 50, rain: 0, wind: 30, light: 70 },
            resources: { water: 50, food: 50, wood: 20, minerals: 15 },
            danger: 10,
            regen: { water: 0.2, food: 0.3, wood: 0.2, minerals: 0.0 }
        },
        {
            id: "A1", name: "Lago", type: "lake",
            connections: ["B1", "L1", "C1"],
            environment: { temperature: 17, humidity: 75, rain: 0, wind: 15, light: 65 },
            resources: { water: 95, food: 50, wood: 10, minerals: 5 },
            danger: 15,
            regen: { water: 0.8, food: 0.3, wood: 0.05, minerals: 0.0 }
        },
        {
            id: "P1", name: "Pantano", type: "swamp",
            connections: ["L1"],
            environment: { temperature: 22, humidity: 90, rain: 0, wind: 5, light: 45 },
            resources: { water: 80, food: 45, wood: 40, minerals: 20 },
            danger: 55,
            regen: { water: 0.6, food: 0.3, wood: 0.3, minerals: 0.0 }
        },
        {
            id: "C1", name: "Costa", type: "coast",
            connections: ["A1"],
            environment: { temperature: 21, humidity: 70, rain: 0, wind: 75, light: 75 },
            resources: { water: 70, food: 50, wood: 10, minerals: 15 },
            danger: 30,
            regen: { water: 0.5, food: 0.3, wood: 0.05, minerals: 0.0 }
        },
        {
            id: "V1", name: "Cueva", type: "cave",
            connections: ["M1"],
            environment: { temperature: 12, humidity: 55, rain: 0, wind: 0, light: 5 },
            resources: { water: 20, food: 5, wood: 0, minerals: 95 },
            danger: 45,
            regen: { water: 0.05, food: 0.0, wood: 0.0, minerals: 0.0 }
        }
    ],
    entities: [
        { id: "ENT-001", type: "plant",  position: "B1", state: "alive" },
        { id: "ENT-002", type: "plant",  position: "B1", state: "alive" },
        { id: "ENT-003", type: "animal", position: "L1", state: "alive" },
        { id: "ENT-004", type: "animal", position: "A1", state: "alive" },
        { id: "ENT-005", type: "plant",  position: "P1", state: "alive" },
        { id: "ENT-006", type: "animal", position: "M1", state: "alive" },
        { id: "ENT-007", type: "object", position: "V1", state: "inert" }
    ]
};

/* ------------------------------------------------------------
 * 4. STATE — estado autoritativo del mundo
 * ---------------------------------------------------------- */
let worldState = null;

function createInitialState() {
    const zones = {};
    for (const z of WORLD_DATA.zones) {
        zones[z.id] = {
            id: z.id,
            name: z.name,
            type: z.type,
            connections: [...z.connections],
            environment: { ...z.environment },
            resources: { ...z.resources },
            danger: z.danger,
            regen: { ...z.regen }
        };
    }
    const entities = {};
    for (const e of WORLD_DATA.entities) {
        entities[e.id] = { ...e };
    }
    return {
        time: { tick: 0, hour: 0, day: 1 },
        map: { zones },
        environment: { global: { temperature: 18, humidity: 60, rain: 0, wind: 25, light: 50 } },
        resources: {},          // los recursos viven por zona (referencia arquitectónica)
        entities,
        events: []
    };
}

function initializeWorld() {
    worldState = createInitialState();
    worldState.resources = worldState.map.zones; // alias arquitectónico
}

/* ------------------------------------------------------------
 * 5. CLOCK
 * ---------------------------------------------------------- */
function updateClock() {
    const t = worldState.time;
    t.tick += 1;
    if (t.tick >= CONFIG.TICKS_PER_HOUR) {
        t.tick = 0;
        t.hour += 1;
    }
    if (t.hour >= CONFIG.HOURS_PER_DAY) {
        t.hour = 0;
        t.day += 1;
    }
}

/* ------------------------------------------------------------
 * 6. ENVIRONMENT
 * ---------------------------------------------------------- */
function computeLightFromHour(hour) {
    // Curva simple: 0 en medianoche, 100 al mediodía
    return Math.round(50 - 50 * Math.cos((hour / 24) * 2 * Math.PI));
}

function updateEnvironment() {
    const hour = worldState.time.hour;
    const globalLight = computeLightFromHour(hour);
    const globalTemp = 12 + 10 * Math.sin(((hour - 6) / 24) * 2 * Math.PI);

    for (const id in worldState.map.zones) {
        const zone = worldState.map.zones[id];
        const env = zone.environment;

        // Temperatura local: base del bioma + variación horaria + ruido
        const baseTemp = WORLD_DATA.zones.find(z => z.id === id).environment.temperature;
        env.temperature = +(baseTemp + (globalTemp - 14) * 0.5 + RNG.range(-1, 1)).toFixed(1);

        // Humedad: deriva hacia la base + efecto de lluvia
        const baseHum = WORLD_DATA.zones.find(z => z.id === id).environment.humidity;
        env.humidity = clamp(env.humidity + (baseHum - env.humidity) * 0.05 + RNG.range(-1, 1), 0, 100);

        // Probabilidad de lluvia según humedad y temperatura
        const rainChance = (env.humidity / 100) * 0.15 * (1 - Math.abs(env.temperature - 15) / 30);
        if (RNG.chance(rainChance) && env.rain < 1) {
            env.rain = 1;
            logEvent("rain", zone.id);
        } else if (env.rain > 0 && RNG.chance(0.3)) {
            env.rain = 0;
        }

        // Viento: base del bioma + ruido
        const baseWind = WORLD_DATA.zones.find(z => z.id === id).environment.wind;
        env.wind = clamp(env.wind + (baseWind - env.wind) * 0.1 + RNG.range(-3, 3), 0, 100);

        // Luz local: global modulada por el tipo de bioma
        const lightFactor = (zone.type === "cave") ? 0.1 : 1;
        env.light = clamp(globalLight * lightFactor + RNG.range(-2, 2), 0, 100);
    }

    // Ambiente global (promedio)
    const zones = Object.values(worldState.map.zones);
    worldState.environment.global = {
        temperature: +(avg(zones, z => z.environment.temperature)).toFixed(1),
        humidity:    +(avg(zones, z => z.environment.humidity)).toFixed(1),
        rain:        zones.filter(z => z.environment.rain > 0).length,
        wind:        +(avg(zones, z => z.environment.wind)).toFixed(1),
        light:       +(avg(zones, z => z.environment.light)).toFixed(1)
    };
}

/* ------------------------------------------------------------
 * 7. RESOURCES
 * ---------------------------------------------------------- */
function updateResources() {
    for (const id in worldState.map.zones) {
        const zone = worldState.map.zones[id];
        const r = zone.resources;
        const regen = zone.regen;

        // Regeneración respetando máximos
        r.water    = clamp(r.water    + regen.water    * RNG.range(0.5, 1.5), 0, CONFIG.RESOURCE_MAX.water);
        r.food     = clamp(r.food     + regen.food     * RNG.range(0.5, 1.5), 0, CONFIG.RESOURCE_MAX.food);
        r.wood     = clamp(r.wood     + regen.wood     * RNG.range(0.3, 1.0), 0, CONFIG.RESOURCE_MAX.wood);
        r.minerals = clamp(r.minerals + regen.minerals, 0, CONFIG.RESOURCE_MAX.minerals);

        // Efecto de la lluvia sobre el agua superficial
        if (zone.environment.rain > 0) {
            r.water = clamp(r.water + 0.5, 0, CONFIG.RESOURCE_MAX.water);
        }

        // Redondeo para mantener legibilidad
        r.water    = +r.water.toFixed(2);
        r.food     = +r.food.toFixed(2);
        r.wood     = +r.wood.toFixed(2);
        r.minerals = +r.minerals.toFixed(2);
    }
}

/* ------------------------------------------------------------
 * 8. ENTITIES
 * ---------------------------------------------------------- */
function updateEntities() {
    for (const id in worldState.entities) {
        const e = worldState.entities[id];
        if (e.state !== "alive") continue;

        const zone = worldState.map.zones[e.position];
        if (!zone) continue;

        // Efecto ambiental: frío o sequía extremos pueden matar
        if (e.type === "plant" && (zone.environment.temperature < -5 || zone.resources.water < 5)) {
            if (RNG.chance(0.02)) {
                e.state = "dead";
                logEvent("entity_death", zone.id, { entity: e.id });
            }
        }
        if (e.type === "animal" && zone.resources.food < 5) {
            if (RNG.chance(0.03)) {
                e.state = "dead";
                logEvent("entity_death", zone.id, { entity: e.id });
            }
        }
    }
}

/* ------------------------------------------------------------
 * 9. RULES — orquestación de la transición W_t → W_{t+1}
 * ---------------------------------------------------------- */
function worldStep() {
    updateClock();
    updateEnvironment();
    updateResources();
    updateEntities();
    processEvents();
    validateWorldState();
    renderWorld();
}

/* ------------------------------------------------------------
 * 10. EVENTS
 * ---------------------------------------------------------- */
let eventCounter = 0;

function logEvent(type, zoneId, extra = {}) {
    eventCounter++;
    const evt = {
        id: `EVT-${String(eventCounter).padStart(4, "0")}`,
        type,
        time: worldState.time.day * 24 + worldState.time.hour,
        zone: zoneId,
        ...extra
    };
    worldState.events.push(evt);
    if (worldState.events.length > CONFIG.MAX_EVENTS) {
        worldState.events.shift();
    }
}

function processEvents() {
    // En v0.1 los eventos son solo registro. Sin lógica reactiva todavía.
}

/* ------------------------------------------------------------
 * 11. VALIDATION
 * ---------------------------------------------------------- */
function validateWorldState() {
    const errors = [];
    const t = worldState.time;

    if (t.day < 1) errors.push("time.day < 1");
    if (t.hour < 0 || t.hour >= 24) errors.push("time.hour fuera de rango");
    if (t.tick < 0 || t.tick >= CONFIG.TICKS_PER_HOUR) errors.push("time.tick fuera de rango");

    for (const id in worldState.map.zones) {
        const z = worldState.map.zones[id];
        for (const res of ["water", "food", "wood", "minerals"]) {
            if (z.resources[res] < 0) errors.push(`${id}.${res} < 0`);
            if (z.resources[res] > CONFIG.RESOURCE_MAX[res] + 0.01) errors.push(`${id}.${res} > max`);
        }
        for (const c of z.connections) {
            if (!worldState.map.zones[c]) errors.push(`${id} conecta con zona inexistente ${c}`);
        }
        for (const res of ["temperature", "humidity", "rain", "wind", "light"]) {
            if (typeof z.environment[res] !== "number") errors.push(`${id}.env.${res} no numérico`);
        }
    }

    if (errors.length > 0) {
        console.error("VALIDACIÓN FALLIDA:", errors);
        logEvent("validation_error", null, { errors: errors.length });
    }
}

/* ------------------------------------------------------------
 * 12. OBSERVATION INTERFACE (OBS)
 * ---------------------------------------------------------- */
function getObservation(observerId) {
    // Interfaz arquitectónica. En v0.1 devuelve un snapshot del estado.
    return {
        observerId,
        time: { ...worldState.time },
        global: { ...worldState.environment.global },
        zones: Object.values(worldState.map.zones).map(z => ({
            id: z.id, name: z.name, type: z.type,
            environment: { ...z.environment },
            resources: { ...z.resources },
            danger: z.danger,
            connections: [...z.connections]
        })),
        entities: Object.values(worldState.entities).map(e => ({ ...e }))
    };
}

/* ------------------------------------------------------------
 * 13. ACTION INTERFACE (ACT)
 * ---------------------------------------------------------- */
function applyAction(action) {
    // Interfaz arquitectónica. En v0.1 solo registra la acción.
    // No modifica el estado todavía (no hay participantes).
    logEvent("action_received", action.target || null, { action: action.type });
    return { accepted: false, reason: "v0.1 no implementa acciones" };
}

/* ------------------------------------------------------------
 * 14. RENDERING
 * ---------------------------------------------------------- */
let selectedZoneId = null;
let isRunning = true;
let loopHandle = null;

function renderWorld() {
    renderClock();
    renderMap();
    renderZoneInfo();
    renderWorldInfo();
    renderEvents();
}

function renderClock() {
    const t = worldState.time;
    document.getElementById("clock-day").textContent = `Día ${t.day}`;
    document.getElementById("clock-hour").textContent =
        `${String(t.hour).padStart(2, "0")}:00`;
    document.getElementById("clock-tick").textContent = `tick ${t.tick}`;
    document.getElementById("btn-toggle").textContent = isRunning ? "Pausar" : "Reanudar";
}

function renderMap() {
    const map = document.getElementById("map");
    map.innerHTML = "";
    for (const id of ["M1", "B1", "L1", "A1", "P1", "C1", "V1"]) {
        const z = worldState.map.zones[id];
        if (!z) continue;
        const div = document.createElement("div");
        div.className = "zone" + (selectedZoneId === id ? " selected" : "");
        div.dataset.id = id;
        div.innerHTML = `
            <div>
                <div class="zone-id">${z.id}</div>
                <div class="zone-name">${z.name}</div>
            </div>
            <div class="zone-env">
                ${z.environment.temperature}°C · ${Math.round(z.environment.humidity)}%<br>
                💧${Math.round(z.resources.water)} 🍎${Math.round(z.resources.food)}
            </div>
        `;
        div.addEventListener("click", () => {
            selectedZoneId = id;
            renderMap();
            renderZoneInfo();
        });
        map.appendChild(div);
    }
}

function renderZoneInfo() {
    const el = document.getElementById("zone-info");
    if (!selectedZoneId) {
        el.textContent = "Ninguna zona seleccionada.";
        return;
    }
    const z = worldState.map.zones[selectedZoneId];
    const dangerClass = z.danger < 25 ? "danger-low" : z.danger < 50 ? "danger-mid" : "danger-high";
    el.innerHTML = `
        <div><span class="label">ID:</span> ${z.id}</div>
        <div><span class="label">Nombre:</span> ${z.name}</div>
        <div><span class="label">Tipo:</span> ${z.type}</div>
        <div><span class="label">Conexiones:</span> ${z.connections.join(", ")}</div>
        <div><span class="label">Temperatura:</span> ${z.environment.temperature} °C</div>
        <div><span class="label">Humedad:</span> ${Math.round(z.environment.humidity)} %</div>
        <div><span class="label">Lluvia:</span> ${z.environment.rain ? "Sí" : "No"}</div>
        <div><span class="label">Viento:</span> ${Math.round(z.environment.wind)}</div>
        <div><span class="label">Luz:</span> ${Math.round(z.environment.light)}</div>
        <hr style="border-color:var(--border)">
        <div><span class="label">Agua:</span> ${z.resources.water.toFixed(1)} ${bar(z.resources.water)}</div>
        <div><span class="label">Alimento:</span> ${z.resources.food.toFixed(1)} ${bar(z.resources.food)}</div>
        <div><span class="label">Madera:</span> ${z.resources.wood.toFixed(1)} ${bar(z.resources.wood)}</div>
        <div><span class="label">Minerales:</span> ${z.resources.minerals.toFixed(1)} ${bar(z.resources.minerals)}</div>
        <div><span class="label">Peligro:</span> <span class="${dangerClass}">${z.danger}</span></div>
    `;
}

function renderWorldInfo() {
    const g = worldState.environment.global;
    const entities = Object.values(worldState.entities);
    const alive = entities.filter(e => e.state === "alive").length;
    const dead = entities.filter(e => e.state === "dead").length;
    document.getElementById("world-info").innerHTML = `
        <div><span class="label">Temp. global:</span> ${g.temperature} °C</div>
        <div><span class="label">Humedad:</span> ${g.humidity} %</div>
        <div><span class="label">Zonas con lluvia:</span> ${g.rain}</div>
        <div><span class="label">Viento medio:</span> ${g.wind}</div>
        <div><span class="label">Luz media:</span> ${g.light}</div>
        <hr style="border-color:var(--border)">
        <div><span class="label">Entidades:</span> ${entities.length} (vivas: ${alive}, muertas: ${dead})</div>
        <div><span class="label">Eventos:</span> ${worldState.events.length}</div>
    `;
}

function renderEvents() {
    const ul = document.getElementById("events-list");
    ul.innerHTML = "";
    const recent = worldState.events.slice(-10).reverse();
    for (const e of recent) {
        const li = document.createElement("li");
        li.textContent = `[${e.id}] ${e.type}${e.zone ? " @ " + e.zone : ""} (t=${e.time})`;
        ul.appendChild(li);
    }
}

function bar(value) {
    const pct = Math.max(0, Math.min(100, value));
    return `<span class="bar"><span style="width:${pct}%"></span></span>`;
}

/* ------------------------------------------------------------
 * 15. SIMULATION LOOP
 * ---------------------------------------------------------- */
function startLoop() {
    if (loopHandle) return;
    isRunning = true;
    loopHandle = setInterval(() => {
        if (isRunning) worldStep();
    }, CONFIG.TICK_INTERVAL_MS);
    renderClock();
}

function togglePause() {
    isRunning = !isRunning;
    renderClock();
}

function stepOnce() {
    worldStep();
}

/* ------------------------------------------------------------
 * 16. UTILITIES
 * ---------------------------------------------------------- */
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function avg(arr, fn) { return arr.reduce((a, x) => a + fn(x), 0) / arr.length; }

/* ------------------------------------------------------------
 * 17. BOOTSTRAP
 * ---------------------------------------------------------- */
function init() {
    RNG.setSeed(123456789);   // semilla fija → reproducible
    initializeWorld();

    document.getElementById("btn-toggle").addEventListener("click", togglePause);
    document.getElementById("btn-step").addEventListener("click", stepOnce);

    renderWorld();
    startLoop();

    // Exponer interfaces arquitectónicas para uso futuro
    window.GEI = {
        getObservation,
        applyAction,
        getState: () => worldState
    };
}

document.addEventListener("DOMContentLoaded", init);
