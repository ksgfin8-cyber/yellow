'use strict';
const vm=require('node:vm'),zlib=require('node:zlib');
const {loadRuntime}=require('../../p01/runtime.cjs'),codec=require('../../p01/codec.cjs'),metric=require('../../p01/metrics.cjs'),{worldConfig,OPERATIONS}=require('./conditions.cjs');
function load(){const r=loadRuntime();return vm.runInContext('({Cell,World,WorldConfig,ExperimentConfig,FeedbackConfig,Recorder,initialize_world,build_observation,build_feedback,validate_WorldState,execute_tick_transaction,determine_termination,canonical_world_state_bytes,canonical_full_state_bytes,replay_trajectory,validate_replay})',r.ctx);}
const feedbackConfig=()=>({expose_validity:true,expose_reason:true,expose_events:true,expose_energy_delta:true});
function fixture(api,c){const wc=new api.WorldConfig(worldConfig(c.profile)),world=new api.World(wc),initial=world.initialize(c.seed),config=new api.ExperimentConfig({experiment_seed:c.seed,max_ticks:c.profile.ticks,world_config:wc,feedback_config:feedbackConfig(),agent_type:'wait'});return {api,c,wc,world,initial,config};}
function state(api,w){return {state:structuredClone(w.state),rng:w.rng.get_state(),WORLD:[...api.canonical_world_state_bytes(w.state)],FULL:[...api.canonical_full_state_bytes(w.state)]};}
function context(f,last=null){const a=f.api,w=f.world,o=a.build_observation(w,w.get_experimental_entity(),f.c.profile.radius);return {observation:o,feedback:a.build_feedback(o,last,new a.FeedbackConfig(feedbackConfig())),action:{type:'WAIT'}};}
function recorder(f,n){const r=new f.api.Recorder(f.config);r.record_initial_state(f.initial.world_state);r.record_initial_lifecycle_from_world(f.initial.initial_events);let last=null;for(let i=0;i<n;i++){const x=context(f,last),confirmed=f.api.execute_tick_transaction(f.world,x.action,f.c.profile.ticks);r.record_step(confirmed,x.observation,x.feedback,x.action);last=confirmed.action_result;}return {r,last};}
function replayArgs(f,t){const acts=t.steps.map(s=>s.action);return [t.initial_state,t.events.filter(e=>e.tick===0),acts,f.wc,new f.api.FeedbackConfig(feedbackConfig()),acts.length,f.c.profile.ticks,'WITH_AGENT'];}
function prepare(api,c,operation){if(!OPERATIONS.includes(operation))throw Error('unknown operation');const f=fixture(api,c);let invoke,extract=x=>x,exposure='Initialization validates/copies state; prior operations in the process may warm shared code.';
 switch(operation){
 case 'validate_state':invoke=()=>api.validate_WorldState(f.world.state,f.wc);break;
 case 'snapshot':invoke=()=>f.world.full_snapshot();break;
 case 'initialize':invoke=()=>api.initialize_world(f.wc,c.seed);break;
 case 'action':invoke=()=>f.world.apply_action({type:'WAIT'});break;
 case 'dynamics':invoke=()=>{f.world.advance_dynamics();return null;};break;
 case 'observation':invoke=()=>api.build_observation(f.world,f.world.get_experimental_entity(),c.profile.radius);break;
 case 'feedback':{const x=context(f),flags=new api.FeedbackConfig(feedbackConfig());invoke=()=>api.build_feedback(x.observation,null,flags);break;}
 case 'tick':invoke=()=>api.execute_tick_transaction(f.world,{type:'WAIT'},c.profile.ticks);break;
 case 'record_append':{const {r,last}=recorder(f,c.profile.ticks-1),x=context(f,last),confirmed=api.execute_tick_transaction(f.world,x.action,c.profile.ticks);invoke=()=>{r.record_step(confirmed,x.observation,x.feedback,x.action);return null;};extract=()=>({steps:r.steps,events:r.events});exposure+=` Preparation executed ${c.profile.ticks-1} append calls.`;break;}
 case 'finalize':case 'history_getter':case 'replay':case 'validate_replay':case 'transport_roundtrip':case 'metrics':{const {r}=recorder(f,c.profile.ticks);r.set_termination_reason(api.determine_termination(f.world,c.profile.ticks));
  if(operation==='finalize'){invoke=()=>r.finalize();break;}
  if(operation==='history_getter'){invoke=()=>r.steps;break;}
  const t=r.finalize(),args=replayArgs(f,t);
  if(operation==='replay')invoke=()=>api.replay_trajectory(...args);
  if(operation==='validate_replay'){const rr=api.replay_trajectory(...args);invoke=()=>api.validate_replay(t,rr,f.wc,'WITH_AGENT');exposure+=' Preparation already replayed the trace; this is not virgin API cold latency.';}
  if(operation==='transport_roundtrip'){const data=structuredClone(t);invoke=()=>codec.decode(JSON.parse(zlib.gunzipSync(zlib.gzipSync(JSON.stringify(codec.encode(data)),{level:9})).toString('utf8')));}
  if(operation==='metrics'){const result={status:'COMPLETED',trajectory:structuredClone(t),failure_reason:null,failure_details:null};invoke=()=>metric.measure(result);}
  break;
 }
 case 'wls1':invoke=()=>api.canonical_full_state_bytes(f.world.state);break;
 }
 return {invoke,before:()=>state(api,f.world),after:result=>({result:structuredClone(extract(result)),...state(api,f.world)}),exposure};
}
module.exports={load,prepare,codec};
