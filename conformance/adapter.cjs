// Implementation adapter only. Expected data and oracles are never loaded here.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const FILES=[
 'core/contracts','core/prng','core/hash','core/seed','world/world_config','contracts/structures',
 'world/cells','world/entity','world/world_state','world/world','interface/action','interface/action_result',
 'interface/observation','interface/feedback','experiment/experiment_config','experiment/trajectory',
 'experiment/hash_state','experiment/tick_transaction','experiment/recorder','experiment/experiment','experiment/replay'
];
function createAdapter({root}) {
 const ctx=vm.createContext({});
 for(const f of FILES)vm.runInContext(fs.readFileSync(path.join(root,'js',f+'.js'),'utf8'),ctx,{filename:f});
 vm.runInContext('Math.random=()=>{throw Error("forbidden random source");};',ctx);
 const a=vm.runInContext('({Map,PRNG,derive_seed,fnv1a_bytes,World,WorldState,WorldConfig,FeedbackConfig,ExperimentConfig,Recorder,canonical_full_state_bytes,STATE_HASH_WORLD,STATE_HASH_FULL,canonicalize_binary64,determine_termination,execute_tick,execute_tick_transaction,build_observation,build_feedback,run_experiment,run_without_agent,replay_trajectory,validate_ReplayResult,validate_replay_continuity,validate_termination_hint})',ctx);
 const state=s=>new a.WorldState(s.time,s.grid,new a.Map(s.entities),s.rng_state,s.config);
 const restore=s=>{const w=new a.World(new a.WorldConfig(s.config));w.state=state(s);w.experimental_entity_id=s.entities.keys().next().value;w.rng=new a.PRNG(s.rng_state);return w;};
 // Recreate cross-realm Maps; preserve every key, field and numeric representation.
 function realm(x){if(x instanceof Map)return new a.Map([...x].map(([k,v])=>[realm(k),realm(v)]));if(Array.isArray(x))return x.map(realm);if(x&&typeof x==='object')return Object.fromEntries(Object.entries(x).map(([k,v])=>[k,realm(v)]));return x;}
 return {execute(operation,input){
  if(operation.startsWith('f5b:'))return require('./adapter-f5-b.cjs').execute({a,ctx,state,restore,realm,root},operation.slice(4),input);
  if(operation==='prng'){const r=new a.PRNG(input.seed);return {values:Array.from({length:input.draws},()=>r.next()),state:r.get_state()};}
  if(operation==='derive_seed')return a.derive_seed(input.seed,input.namespace);
  if(operation==='fnv')return a.fnv1a_bytes([...input.bytes]);
  if(operation==='wls1')return Buffer.from(a.canonical_full_state_bytes(state(input.state)));
  if(operation==='hash_state'){const s=state(input.state);return {world:a.STATE_HASH_WORLD(s),full:a.STATE_HASH_FULL(s)};}
  if(operation==='config'){const c=new a.WorldConfig(input.config);return {value:c,frozen:Object.isFrozen(c)};}
  if(operation==='canonical_binary64')return a.canonicalize_binary64(input.value);
  if(operation==='termination')return a.determine_termination(restore(input.state),input.max_ticks);
  if(operation==='tick_order'){
   const w=restore(input.state),order=[];
   for(const [method,label]of [['apply_action','action'],['resolve_lifecycle','lifecycle'],['advance_dynamics','dynamics'],['sync_rng_state','sync']]){
    const old=w[method];w[method]=function(...args){order.push(label);return old.apply(this,args);};
   }
   const confirmed=a.execute_tick_transaction(w,input.action,input.max_ticks);
   return {order,tick:confirmed.tick,world_state:confirmed.world_state,rng:w.rng.get_state()};
  }
  if(operation==='rollback'){
   const w=restore(input.state);w.advance_dynamics=()=>{w.rng.next();w.state.entities.values().next().value.energy=999;throw Error('injected dynamics failure');};
   let message=null;try{a.execute_tick_transaction(w,input.action,input.max_ticks);}catch(e){message=e.message;}
   return {error:message,world_state:w.state,rng:w.rng.get_state()};
  }
  if(operation==='initial_events'){
   const w=restore(input.state),raw=w.resolve_lifecycle();
   const recorder=new a.Recorder(new a.ExperimentConfig(input.experiment_config));
   recorder.record_initial_state(w.state);recorder.record_initial_lifecycle_from_world(raw);
   return {raw,recorded:recorder.events,sequence:recorder.sequence_counter,world_state:w.state};
  }
  if(operation==='dynamics'){
   const w=restore(input.state),old=w.regenerate_resources;let calls=0;
   w.regenerate_resources=function(...args){calls++;return old.apply(this,args);};w.advance_dynamics();
   return {world_state:w.state,rng:w.rng.get_state(),regeneration_calls:calls};
  }
  if(operation==='replay'){
   const c=realm(input.context);
   return a.replay_trajectory(c.initial_state,c.initial_events,c.actions,c.world_config,c.feedback_config,c.expected_steps,c.max_ticks,c.execution_mode);
  }
  if(operation==='validate'||operation==='validate_work'){
   const c=realm(input.context),rr=realm(input.result);
   if(operation==='validate')return {continuity:a.validate_replay_continuity(rr,c),complete:a.validate_ReplayResult(rr,c)};
   ctx.work={proofs:0,rebuilds:0,ticks:0};
   vm.runInContext(`const originalProof=replay_continuity_proof,originalRebuild=replay_world_from_state,originalTick=execute_tick_transaction;
    replay_continuity_proof=(...args)=>{work.proofs++;return originalProof(...args);};
    replay_world_from_state=(...args)=>{work.rebuilds++;return originalRebuild(...args);};
    execute_tick_transaction=(...args)=>{work.ticks++;return originalTick(...args);};`,ctx);
   return {continuity:a.validate_replay_continuity(rr,c),complete:a.validate_ReplayResult(rr,c),work:ctx.work};
  }
  throw Error('unsupported operation: '+operation);
 }};
}
module.exports={id:'yellow-js-v026',createAdapter,FILES};
