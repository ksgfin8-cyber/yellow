// Local web integration evidence; these cases are not canonical T01–T280.
const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const scripts = Array.from(html.matchAll(/<script src="([^"]+)"/g), m => m[1]);
const copy = x => structuredClone(x);

function load() {
    const elements = new Map(), ready = [], draws = [];
    const ctx2d = {fillStyle: '', clearRect() { draws.length = 0; },
        fillRect(...rect) { draws.push({color: this.fillStyle, rect}); }};
    for (const id of ['demo-config', 'execution-status', 'summary', 'diagnostic', 'render-status', 'canvas', 'run-wait', 'run-random']) {
        elements.set(id, {textContent: '', hidden: ['diagnostic', 'render-status'].includes(id),
            handlers: {}, addEventListener(type, f) { this.handlers[type] = f; }, getContext() { return ctx2d; }});
    }
    const ctx = vm.createContext({document: {getElementById: id => elements.get(id)},
        window: {addEventListener(type, f) { assert.equal(type, 'DOMContentLoaded'); ready.push(f); }}});
    for (const p of scripts) vm.runInContext(fs.readFileSync(path.join(root, p), 'utf8'), ctx, {filename: p});
    vm.runInContext('Math.random = () => { throw new Error("Math.random forbidden"); };', ctx);
    return {ctx, elements, draws, ready, ...vm.runInContext('({WorldConfig,FeedbackConfig,ExperimentConfig,World,Cell,Renderer,run_web_experiment,present_experiment_result,web_demo_config,validate_WorldState})', ctx)};
}
function config(a, patch = {}, max = 3, agent_type = 'wait') {
    return new a.ExperimentConfig({experiment_seed: 12345, max_ticks: max, agent_type,
        world_config: {...a.WorldConfig.defaults(), width: 2, height: 2, obstacle_density: 0,
            resource_density: 0, hazard_density: 0, initial_energy: 20, wait_cost: 1, ...patch},
        feedback_config: a.FeedbackConfig.defaults()});
}
const text = (a, id) => a.elements.get(id).textContent;
const lastState = t => t.steps.length ? t.steps[t.steps.length - 1].world_state : t.initial_state;
function checkSummary(a, result) {
    const t = result.trajectory, s = lastState(t), summary = text(a, 'summary');
    assert.equal(text(a, 'execution-status'), result.status);
    for (const line of [`Pasos: ${t.steps.length}`, `Eventos: ${t.events.length}`,
        `Terminación: ${t.termination_reason}`, `Tiempo: ${s.time}`]) assert.ok(summary.includes(line), line);
    const e = s.entities.values().next().value;
    assert.ok(summary.includes(`posición (${e.position.x}, ${e.position.y})`));
    assert.deepEqual(a.draws.at(-1), {color: '#2196f3', rect: [e.position.x * 20, e.position.y * 20, 19, 19]});
}

test('F4A-01 actual HTML loads every runtime script once, with kernel and replay available', () => {
    assert.equal(new Set(scripts).size, scripts.length);
    assert.ok(!scripts.includes('js/tests/tests.js'));
    for (const [before, after] of [['experiment_config', 'tick_transaction'], ['tick_transaction', 'recorder'],
        ['hash_state', 'recorder'], ['recorder', 'experiment'], ['experiment', 'replay']]) {
        assert.ok(scripts.indexOf(`js/experiment/${before}.js`) < scripts.indexOf(`js/experiment/${after}.js`));
    }
    const a = load();
    assert.equal(vm.runInContext('typeof Tests', a.ctx), 'undefined');
    for (const name of ['execute_tick_transaction', 'validate_ReplayResult', 'validate_replay', 'STATE_HASH_WORLD']) {
        assert.equal(vm.runInContext(`typeof ${name}`, a.ctx), 'function');
    }
});
test('F4A-02 DOM ready starts a small real episode and wires both agent buttons', () => {
    const a = load(); assert.equal(a.ready.length, 1); a.ready[0]();
    assert.equal(text(a, 'execution-status'), 'COMPLETED');
    assert.match(text(a, 'demo-config'), /6×6, máximo 10 ticks/);
    for (const id of ['run-wait', 'run-random']) {
        a.elements.get(id).handlers.click();
        assert.equal(text(a, 'execution-status'), 'COMPLETED');
        assert.match(text(a, 'summary'), /Pasos: 10/);
    }
});
test('F4A-03 WaitAgent returns the four-field ExperimentResult and real last hashes', () => {
    const a = load(), r = a.run_web_experiment(config(a));
    assert.deepEqual(Object.keys(r).sort(), ['failure_details', 'failure_reason', 'status', 'trajectory']);
    assert.equal(r.status, 'COMPLETED'); assert.equal(r.trajectory.steps.length, 3);
    checkSummary(a, r);
    const s = r.trajectory.steps.at(-1);
    for (const [label, value] of [['WORLD', s.state_hash_world], ['FULL', s.state_hash_full]]) {
        assert.ok(text(a, 'summary').includes(`Hash ${label}: 0x${value.toString(16).padStart(8, '0')}`));
    }
});
test('F4A-04 RandomAgent is repeatable for the same seed/config and renders the last state', () => {
    const a = load(), c = config(a, {}, 5, 'random');
    const r1 = a.run_web_experiment(c), saved = copy(r1), r2 = a.run_web_experiment(c);
    assert.deepEqual(copy(r2), saved); assert.equal(r2.status, 'COMPLETED'); checkSummary(a, r2);
});
test('F4A-05 death after an action shows real lifecycle events and final energy', () => {
    const a = load(), r = a.run_web_experiment(config(a, {initial_energy: 1}));
    assert.equal(r.trajectory.termination_reason, 'ENTITY_DIED');
    assert.equal(r.trajectory.steps.length, 1); assert.equal(r.trajectory.events.length, 1);
    assert.match(text(a, 'summary'), /Energía: 0 · lifecycle: DEAD/); checkSummary(a, r);
});
test('F4A-06 initial death renders the initial Map and reports no last-step hashes', () => {
    const a = load(), r = a.run_web_experiment(config(a, {initial_energy: 0}));
    assert.equal(r.status, 'COMPLETED'); assert.equal(r.trajectory.steps.length, 0);
    assert.equal(r.trajectory.events.length, 1); checkSummary(a, r);
    assert.match(text(a, 'summary'), /Sin StepRecords/); assert.doesNotMatch(text(a, 'summary'), /Hash WORLD:/);
});
test('F4A-07 max_ticks zero renders the initial state without fabricating steps/events', () => {
    const a = load(), r = a.run_web_experiment(config(a, {}, 0));
    assert.equal(r.trajectory.termination_reason, 'MAX_TICKS_REACHED');
    assert.equal(r.trajectory.steps.length, 0); assert.equal(r.trajectory.events.length, 0); checkSummary(a, r);
});
test('F4A-08 initialization failure clears stale success and hides the canvas', () => {
    const a = load(); a.run_web_experiment(config(a));
    const r = a.run_web_experiment(config(a, {obstacle_density: 1}));
    assert.equal(r.status, 'FAILED'); assert.equal(r.trajectory, null);
    assert.match(text(a, 'diagnostic'), /INITIALIZATION_ERROR.*invalid initial_position/);
    assert.equal(a.elements.get('diagnostic').hidden, false); assert.equal(a.elements.get('canvas').hidden, true);
    assert.doesNotMatch(text(a, 'summary'), /Hash|Pasos:/);
});
test('F4A-09 agent error preserves FAILED and displays the real partial trajectory', () => {
    const a = load(); let calls = 0;
    const r = a.run_web_experiment(config(a), () => ({reset() {}, step() {
        if (calls++ === 0) return {type: 'WAIT'}; throw new Error('agent stopped');
    }}));
    assert.equal(r.status, 'FAILED'); assert.equal(r.failure_reason, 'AGENT_CONTRACT_ERROR');
    assert.equal(r.trajectory.steps.length, 1); checkSummary(a, r);
    assert.match(text(a, 'diagnostic'), /AGENT_CONTRACT_ERROR.*agent stopped/);
    assert.equal(a.elements.get('canvas').hidden, false);
});
test('F4A-10 configuration/internal errors do not create a fictitious ExperimentResult', () => {
    const a = load(), r = a.run_web_experiment({...config(a), max_ticks: '3'});
    assert.equal(r, null); assert.equal(text(a, 'execution-status'), 'Error de ejecución');
    assert.equal(a.elements.get('diagnostic').hidden, false); assert.equal(a.elements.get('canvas').hidden, true);
});
test('F4A-11 renderer accepts Map and exact BigInt time; only reads state, cells and entity', () => {
    const a = load(), c = config(a), w = new a.World(c.world_config); w.initialize(7);
    w.state.time = 9007199254740993n;
    const before = copy(w.state), s = w.state;
    // Freeze records; Map ownership is checked by the complete snapshot comparison.
    for (const row of s.grid) { for (const cell of row) { if (cell.effect) Object.freeze(cell.effect); Object.freeze(cell); } Object.freeze(row); }
    for (const e of s.entities.values()) { Object.freeze(e.position); Object.freeze(e); }
    Object.freeze(s.grid); Object.freeze(s);
    new a.Renderer(a.elements.get('canvas')).render({config: c.world_config, state: s});
    assert.deepEqual(copy(s), before); assert.ok(a.validate_WorldState(s, c.world_config));
    const e = s.entities.values().next().value;
    assert.deepEqual(a.draws.at(-1).rect.slice(0, 2), [e.position.x * 20, e.position.y * 20]);
});
test('F4A-12 renderer respects Cell effects and canonical row/column coordinates', () => {
    const a = load(), c = config(a, {width: 3, height: 2}), w = new a.World(c.world_config); w.initialize(7);
    w.state.grid[0][0] = new a.Cell('BLOCKED', null);
    w.state.grid[0][1] = new a.Cell('FREE', {kind: 'RESOURCE', stock: 1});
    w.state.grid[0][2] = new a.Cell('FREE', {kind: 'HAZARD'});
    w.state.grid[1][0] = new a.Cell('FREE', {kind: 'RESOURCE', stock: 0});
    w.get_experimental_entity().position = {x: 2, y: 1};
    const before = copy(w.state);
    new a.Renderer(a.elements.get('canvas')).render({config: c.world_config, state: w.state});
    assert.deepEqual(a.draws.map(d => d.color), ['#333', '#4caf50', '#f44336', '#eee', '#eee', '#eee', '#2196f3']);
    assert.deepEqual(a.draws[2].rect, [40, 0, 19, 19]); assert.deepEqual(copy(w.state), before);
});
test('F4A-13 renderer rejects malformed state before drawing; no normalization', () => {
    const a = load(), c = config(a), w = new a.World(c.world_config); w.initialize(7);
    w.state.grid[0][0].traversal = 'UNKNOWN';
    const before = copy(w.state);
    assert.throws(() => new a.Renderer(a.elements.get('canvas')).render({config: c.world_config, state: w.state}), {name: 'ContractError'});
    assert.equal(a.draws.length, 0); assert.deepEqual(copy(w.state), before);
});
test('F4A-14 visualization receives an independent final snapshot, never the result state', () => {
    const a = load(), r = a.run_web_experiment(config(a));
    let seen; a.Renderer.prototype.render = view => { seen = view.state; };
    a.present_experiment_result(r, config(a));
    assert.deepEqual(copy(seen), copy(lastState(r.trajectory))); assert.notEqual(seen, lastState(r.trajectory));
    seen.entities.values().next().value.energy = -999;
    assert.equal(lastState(r.trajectory).entities.values().next().value.energy, 17);
});
test('F4A-15 visualization failure cannot mutate trajectory or relabel a completed run', () => {
    const a = load(), c = config(a), r = a.run_web_experiment(c), before = copy(r);
    a.Renderer.prototype.render = view => { view.state.entities.values().next().value.energy = -999; throw new Error('canvas unavailable'); };
    a.present_experiment_result(r, c);
    assert.deepEqual(copy(r), before); assert.equal(text(a, 'execution-status'), 'COMPLETED');
    assert.match(text(a, 'render-status'), /canvas unavailable/);
    assert.equal(a.elements.get('render-status').hidden, false); assert.equal(a.elements.get('canvas').hidden, true);
});

// Optional real-browser verification, using the same HTML and public entry point.
// PLAYWRIGHT_MODULE and CHROMIUM_EXECUTABLE select existing installations.
if (process.argv.includes('--browser')) test('F4A-16 real Chromium: loader, agents, pixels, errors, purity and repeatability', async () => {
    const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
    const http = require('node:http');
    const server = http.createServer((req, res) => {
        const p = path.resolve(root, '.' + new URL(req.url, 'http://localhost').pathname);
        if (!p.startsWith(root + path.sep) && p !== root) { res.writeHead(403).end(); return; }
        const file = p === root ? path.join(root, 'index.html') : p;
        if (req.url === '/favicon.ico') { res.writeHead(204).end(); return; }
        try {
            res.setHeader('Content-Type', ({'.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css'})[path.extname(file)] || 'application/octet-stream');
            res.end(fs.readFileSync(file));
        } catch { res.writeHead(404).end(); }
    });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    let browser;
    try {
        browser = await chromium.launch({executablePath: process.env.CHROMIUM_EXECUTABLE || '/usr/bin/chromium',
            headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage']});
        const page = await browser.newPage({viewport: {width: 1000, height: 760}}), errors = [];
        page.on('pageerror', e => errors.push(String(e)));
        page.on('requestfailed', r => errors.push(r.url() + ': ' + r.failure()?.errorText));
        page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
        await page.goto(`http://127.0.0.1:${server.address().port}/`);
        assert.equal(await page.locator('#execution-status').textContent(), 'COMPLETED');
        for (const id of ['run-wait', 'run-random']) {
            await page.locator('#' + id).click();
            assert.equal(await page.locator('#execution-status').textContent(), 'COMPLETED');
            assert.match(await page.locator('#summary').textContent(), /Pasos: 10/);
        }
        const evidence = await page.evaluate(() => {
            const c = (patch = {}, max = 3, agent_type = 'wait') => ({experiment_seed: 12345, max_ticks: max, agent_type,
                world_config: {...WorldConfig.defaults(), width: 2, height: 2, obstacle_density: 0, resource_density: 0,
                    hazard_density: 0, initial_energy: 20, wait_cost: 1, ...patch}, feedback_config: FeedbackConfig.defaults()});
            const canvas = document.getElementById('canvas'), rows = [];
            for (const [name, cfg] of [['wait', c()], ['random', c({}, 3, 'random')], ['death', c({initial_energy: 1})],
                ['initial-death', c({initial_energy: 0})], ['zero', c({}, 0)], ['init-failure', c({obstacle_density: 1})]]) {
                const r = run_web_experiment(cfg), t = r.trajectory;
                let pixel = null;
                if (t) {
                    const s = t.steps.length ? t.steps[t.steps.length - 1].world_state : t.initial_state;
                    const e = s.entities.values().next().value;
                    pixel = Array.from(canvas.getContext('2d').getImageData(e.position.x * 20 + 5, e.position.y * 20 + 5, 1, 1).data);
                }
                rows.push({name, status: r.status, steps: t?.steps.length ?? null, events: t?.events.length ?? null,
                    termination: t?.termination_reason ?? null, diagnostic: document.getElementById('diagnostic').textContent,
                    canvasDisplay: getComputedStyle(canvas).display, pixel});
            }
            let n = 0;
            const failed = run_web_experiment(c(), () => ({reset() {}, step() { if (n++ === 0) return {type: 'WAIT'}; throw new Error('agent stopped'); }}));
            rows.push({name: 'agent-failure', status: failed.status, steps: failed.trajectory.steps.length,
                diagnostic: document.getElementById('diagnostic').textContent});
            const serialize = x => JSON.stringify(x, (_, v) => v instanceof Map ? [...v] : typeof v === 'bigint' ? v.toString() : v);
            const cfg = c({}, 3, 'random'), r1 = run_web_experiment(cfg), original = serialize(r1), r2 = run_web_experiment(cfg);
            const renderer = Renderer.prototype.render;
            let independent = false;
            Renderer.prototype.render = function(view) {
                independent = view.state !== r1.trajectory.steps[2].world_state;
                view.state.entities.values().next().value.energy = -999; throw new Error('injected visual failure');
            };
            present_experiment_result(r1, new ExperimentConfig(cfg));
            rows.push({name: 'visual-failure', unchanged: serialize(r1) === original, independent,
                status: document.getElementById('execution-status').textContent, canvasDisplay: getComputedStyle(canvas).display,
                diagnostic: document.getElementById('render-status').textContent});
            Renderer.prototype.render = renderer;
            const state = r2.trajectory.steps[2].world_state; state.time = 9007199254740993n;
            const before = serialize(state);
            new Renderer(canvas).render({config: cfg.world_config, state});
            const pure = before === serialize(state);
            run_web_experiment(web_demo_config('random'));
            return {rows, repeatable: original === serialize(run_web_experiment(cfg)), pure};
        });
        for (const row of evidence.rows.slice(0, 5)) {
            assert.equal(row.status, 'COMPLETED'); assert.deepEqual(row.pixel, [33, 150, 243, 255]);
            assert.equal(row.canvasDisplay, 'block');
        }
        assert.equal(evidence.rows[0].termination, 'MAX_TICKS_REACHED');
        assert.equal(evidence.rows[2].termination, 'ENTITY_DIED'); assert.equal(evidence.rows[3].steps, 0);
        assert.equal(evidence.rows[3].events, 1); assert.equal(evidence.rows[4].steps, 0);
        const init = evidence.rows[5], agent = evidence.rows[6], visual = evidence.rows[7];
        assert.equal(init.status, 'FAILED'); assert.equal(init.canvasDisplay, 'none');
        assert.match(init.diagnostic, /INITIALIZATION_ERROR/);
        assert.equal(agent.status, 'FAILED'); assert.equal(agent.steps, 1); assert.match(agent.diagnostic, /AGENT_CONTRACT_ERROR/);
        assert.ok(visual.unchanged && visual.independent); assert.equal(visual.status, 'COMPLETED');
        assert.equal(visual.canvasDisplay, 'none'); assert.match(visual.diagnostic, /injected visual failure/);
        assert.ok(evidence.repeatable && evidence.pure); assert.deepEqual(errors, []);
        await page.locator('#run-random').click();
        if (process.env.F4A_SCREENSHOT) await page.screenshot({path: process.env.F4A_SCREENSHOT, fullPage: true});
        console.log('Chromium ' + await browser.version() + ' evidence: ' + JSON.stringify(evidence));
    } finally {
        if (browser) await browser.close();
        await new Promise(resolve => server.close(resolve));
    }
});
