// Diagnostic runner for the unchanged legacy suite; not v0.2.5 acceptance.
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const {execFileSync} = require('node:child_process');
const root = path.resolve(__dirname, '..');
const baseline = process.argv.includes('--baseline');
const context = vm.createContext({console});
const read = src => baseline
    ? execFileSync('git',['show','ad7cc990201193714875f7b7dfba26375dee0b40:' + src],{cwd:root,encoding:'utf8'})
    : fs.readFileSync(path.join(root,src),'utf8');
const html = read('index.html');
let legacyLoaded = false;
for (const [,src] of html.matchAll(/<script src="([^"]+)"/g)) {
    if (src === 'js/main.js' || src.includes('visualization/')) continue;
    if (src === 'js/tests/tests.js') legacyLoaded = true;
    const file = path.join(root,src);
    if (!fs.existsSync(file)) { console.log('MISSING ' + src); continue; }
    const source = read(src);
    vm.runInContext(source,context,{filename:src});
}
// Historical assertions run explicitly, independently of the production page.
if (!legacyLoaded) vm.runInContext(read('js/tests/tests.js'),context,{filename:'js/tests/tests.js'});
const results = vm.runInContext('Tests.results',context);
for (const r of results) console.log(r.id, r.status, r.error || '');
console.log(JSON.stringify({mode:baseline?'baseline':'current',tests:results.length,pass:results.filter(r=>r.status==='PASS').length,fail:results.filter(r=>r.status==='FAIL').length}));
process.exitCode = results.length !== 22 || results.some(r=>r.status==='FAIL') ? 1 : 0;
