const fs=require('node:fs'),path=require('node:path');
const read=f=>JSON.parse(fs.readFileSync(path.join(__dirname,f),'utf8'));
const atoms=read('atomic-obligations-f5-b.json'),report=read('results/f5-b.json');
const rows=atoms.map(a=>{
 const evidence=a.case_ids.map(id=>{const r=report.results.find(r=>r.id===id);return {id,status:r?.status||'UNTESTED',category:r?.category||null};});
 const decision=evidence.some(r=>r.status==='FAIL')?'REPRODUCIBLE_FAIL':evidence.some(r=>r.status!=='PASS')?'PARTIALLY_COVERED':a.decision_if_cases_pass;
 return {...a,decision,evidence,interpretation:'Decision applies only to listed preconditions and assertions, not universal scientific sufficiency'};
});
const counts=rows.reduce((o,r)=>(o[r.decision]++,o),Object.fromEntries(['SATISFIED_WITH_EXECUTED_EXAMPLES','PARTIALLY_COVERED','DOCUMENTATION_BLOCKED','REPRODUCIBLE_FAIL','NON_EXECUTABLE_ALTERNATIVE_EVIDENCE','INDEPENDENT_IMPLEMENTATION_REQUIRED'].map(k=>[k,0])));
const result={base:read('f5-b-manifest.json').base,classification:'F5B-ACCEPTANCE-BASIS-REVIEW',governance:'PROPOSED ONLY; §37 unchanged',canonical_conformance:'NOT ESTABLISHED',counts,rows};
fs.writeFileSync(path.join(__dirname,'results/preacceptance-f5-b.json'),JSON.stringify(result,null,2)+'\n');
let md='# F5-B — matriz de preaceptación\n\nDocumento informativo, no modificación normativa. Fuente completa y pre/postcondiciones: ../conformance/atomic-obligations-f5-b.json.\nLas decisiones SATISFIED se limitan a ejemplos ejecutados; todas las filas conservan domain_coverage=PARTIAL y universal_conformance_claim=false.\nEl número de filas/casos no constituye criterio de suficiencia.\n\n| ID / prioridad | Obligación observable | Casos y resultados | Decisión | Evidencia alternativa / límite |\n|---|---|---|---|---|\n';
for(const r of rows)md+=`| ${r.id} / ${r.priority} | ${r.scope} | ${r.evidence.map(x=>x.id+': '+x.status).join(', ')||'No ejecutable / sin fuente'} | ${r.decision} | ${r.alternative_evidence||'Solo entradas y aserciones fijadas; no cobertura universal'} |\n`;
md+='\nLas 289 entradas históricas bloqueadas de F5-A siguen intactas en el reporte. Las filas BLOCKED de esta matriz son brechas de obligaciones, no nuevos tests ni sustitutos de aquellos IDs.\nNo se ha ejecutado una implementación independiente. Los fallos de respuestas inyectadas se registran aparte en results/f5-b-mutants.json, no como defectos reales de producción.\nLa gobernanza de aceptación se propone en CONFORMANCE_ACCEPTANCE_PROPOSAL.md; §37 vigente permanece inalterado.\n';
fs.writeFileSync(path.join(__dirname,'../docs/CONFORMANCE_PREACCEPTANCE_F5-B.md'),md);
console.log(JSON.stringify(counts));
