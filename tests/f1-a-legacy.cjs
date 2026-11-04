// Diagnostic runner for the unchanged legacy suite; not v0.2.5 acceptance.
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const {execFileSync} = require('node:child_process');
const root = path.resolve(__dirname, '..');
const baseline = process.argv.includes('--baseline');
const context = vm.createContext({console});
const html = fs.readFileSync(path.join(root,'index.html'),'utf8');
for (const [,src] of html.matchAll(/<script src="([^"]+)"/g)) {
    if (src === 'js/main.js' || src.includes('visualization/')) continue;
    const file = path.join(root,src);
    if (!fs.existsSync(file)) { console.log('MISSING ' + src); continue; }
    const source = baseline && src.startsWith('js/core/')
        ? execFileSync('git',['show','ad7cc990201193714875f7b7dfba26375dee0b40:' + src],{cwd:root,encoding:'utf8'})
        : fs.readFileSync(file,'utf8');
    vm.runInContext(source,context,{filename:src});
}
const results = vm.runInContext('Tests.results',context);
for (const r of results) console.log(r.id, r.status, r.error || '');
console.log(JSON.stringify({mode:baseline?'baseline':'F1-A',tests:results.length,pass:results.filter(r=>r.status==='PASS').length,fail:results.filter(r=>r.status==='FAIL').length}));
process.exitCode = results.length !== 22 || results.some(r=>r.status==='FAIL') ? 1 : 0;
