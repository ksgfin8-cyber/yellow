// Response corruption audit. This is fault injection, not another WORLD implementation.
const fs=require('node:fs'),path=require('node:path');
const {runCases}=require('./runner.cjs'),{createAdapter}=require('./adapter.cjs');
function corrupt(value){
 value=structuredClone(value);
 if(value instanceof Uint8Array){value[0]^=1;return value;}
 if(value===null||value===undefined)return 1;
 if(typeof value==='boolean')return !value;
 if(typeof value==='number')return value+1;
 if(Array.isArray(value))return value.slice(1);
 if(typeof value==='object'){delete value[Object.keys(value)[0]];return value;}
 return 'CORRUPTED';
}
async function audit(root=path.resolve(__dirname,'..')){
 const all=JSON.parse(fs.readFileSync(path.join(root,'conformance/cases-f5-b.json'),'utf8'));
 const added=all.filter(c=>/^(ND5B|ER5B)-/.test(c.id));
 const baseline=await runCases(added,()=>createAdapter({root}));
 const mutated=await runCases(added,()=>{
  const real=createAdapter({root});return {async execute(op,input){
   try{return corrupt(await real.execute(op,input));}catch(_error){return null;}
  }};
 });
 return {kind:'ENGINEERING FAULT-INJECTION EVIDENCE',method:'Corrupt first returned field/byte or suppress thrown exception after real execution; no oracle given to adapter',
  oracle_scope:'Response sensitivity only; not a mutation score of all possible implementation defects',results:added.map((c,i)=>({id:c.id,category:c.category,baseline:baseline[i].status,corrupted_response:mutated[i].status,caught:baseline[i].status==='PASS'&&mutated[i].status==='FAIL'}))};
}
if(require.main===module)audit().then(r=>{
 const output=JSON.stringify(r,null,2)+'\n';if(process.argv[2])fs.writeFileSync(process.argv[2],output);else process.stdout.write(output);
 process.exitCode=r.results.every(x=>x.caught)?0:1;
}).catch(e=>{process.stderr.write(String(e)+'\n');process.exitCode=2;});
module.exports={audit};
