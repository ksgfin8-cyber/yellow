const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),cp=require('node:child_process'),os=require('node:os');
const {ROOT,engineFiles,loadRuntime}=require('./runtime.cjs'),{PROTOCOL_PATH,AGENTS}=require('./protocol.cjs');
const ENGINE_COMMIT='59bd859bf102be546f3dfb3bb0200fde0b90233b';
const sha=data=>crypto.createHash('sha256').update(data).digest('hex');
const git=(...args)=>cp.execFileSync('git',args,{cwd:ROOT,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
function sourcePaths(){return [...new Set(['index.html',...engineFiles(),'js/agents/frontier_memory_agent.js','conformance/wire.cjs',PROTOCOL_PATH,
 ...fs.readdirSync(__dirname).filter(p=>p.endsWith('.cjs')).map(p=>'tools/p01/'+p)])].sort();}
function snapshot(){return Object.fromEntries(sourcePaths().map(p=>[p,sha(fs.readFileSync(path.join(ROOT,p)))]));}
function assertEngineUnchanged(){for(const p of ['index.html',...engineFiles(),'conformance/wire.cjs']){
 const expected=cp.execFileSync('git',['show',ENGINE_COMMIT+':'+p],{cwd:ROOT});
 if(!expected.equals(fs.readFileSync(path.join(ROOT,p))))throw Error('P01: engine baseline changed: '+p);
}}
function parameters(agent){return agent==='frontier_memory_v1'?{neighbors:['N','E','S','W'],target_tie:['distance','y','x'],regeneration_assumption:0}:{};}
function provenance(seed,agent){
 if(!AGENTS.includes(agent))throw Error('P01: unsupported algorithm');assertEngineUnchanged();
 const api=loadRuntime().api,file=agent==='frontier_memory_v1'?'js/agents/frontier_memory_agent.js':`js/agents/${agent}_agent.js`;
 return {engine_commit:ENGINE_COMMIT,implementation:{commit:git('rev-parse','HEAD'),working_tree_clean:git('status','--porcelain')==='',sources:snapshot()},
  algorithm:{id:agent,version:agent==='frontier_memory_v1'?'1':'baseline@'+ENGINE_COMMIT,file,sha256:sha(fs.readFileSync(path.join(ROOT,file))),parameters:parameters(agent)},
  protocol:{id:'P01',version:'1.0-proposed',path:PROTOCOL_PATH,sha256:sha(fs.readFileSync(path.join(ROOT,PROTOCOL_PATH)))},
  seeds:{experiment:seed,world:api.derive_seed(seed,'world'),agent:api.derive_seed(seed,agent)},execution_mode:'WITH_AGENT',
  runtime:{node:process.version,platform:process.platform,arch:process.arch,cpu:os.cpus()[0]?.model??'unknown'}};
}
function assertSources(p){
 if(p.engine_commit!==ENGINE_COMMIT)throw Error('archive: unsupported engine revision');
 const actual=snapshot();if(JSON.stringify(Object.keys(p.implementation.sources).sort())!==JSON.stringify(Object.keys(actual)))throw Error('archive: incomplete source snapshot');
 for(const [file,hash]of Object.entries(actual))if(p.implementation.sources[file]!==hash)throw Error('archive: source mismatch: '+file);
 assertEngineUnchanged();
}
module.exports={ENGINE_COMMIT,sha,git,parameters,sourcePaths,snapshot,assertEngineUnchanged,provenance,assertSources};
