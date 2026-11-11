// Additional test operations, not a physical reference implementation.
const vm=require('node:vm');
const {encode}=require('./wire.cjs');
const copy=x=>structuredClone(x),equal=(a,b)=>JSON.stringify(encode(copy(a)))===JSON.stringify(encode(copy(b)));
function execute({a,ctx,state,restore,realm},op,input){
 if(op==='rng_restore'){
  const r=new a.PRNG(input.seed);for(let i=0;i<input.advance;i++)r.next();const saved=r.get_state();
  const first=[r.next(),r.next_float(),r.next_int(input.a,input.b)];r.set_state(saved);
  return {saved,first,repeated:[r.next(),r.next_float(),r.next_int(input.a,input.b)]};
 }
 if(op==='rng_rejection'||op==='rng_float'){
  const r=new a.PRNG(1);let calls=0;r.next=()=>{if(calls===input.draws.length)throw Error('unexpected RNG draw');return input.draws[calls++];};
  const value=op==='rng_float'?r.next_float():r.next_int(input.a,input.b);return {value,calls};
 }
 if(op==='kernel_fault'){
  const w=restore(input.state);
  if(input.phase==='validate'){const old=w.advance_dynamics;w.advance_dynamics=function(){old.call(this);this.state.grid[0][0].traversal='UNKNOWN';};}
  else w[input.phase]=()=>{w.rng.next();w.state.entities.values().next().value.energy=999;throw Error('injected '+input.phase);};
  let error=null;try{a.execute_tick_transaction(w,input.action,input.max_ticks);}catch(e){error=e.message;}
  return {error,world_state:w.state,rng:w.rng.get_state()};
 }
 if(op==='execute_tick'){
  const w=restore(input.state),order=[];let sync=0;
  for(const [m,label]of [['apply_action','action'],['resolve_lifecycle','lifecycle'],['advance_dynamics','dynamics']]){
   const old=w[m];w[m]=function(...args){order.push(label);return old.apply(this,args);};
  }
  w.sync_rng_state=()=>{sync++;};a.execute_tick(w,input.action);
  return {order,sync,time:w.state.time,rng:w.rng.get_state()};
 }
 if(op==='snapshot'){
  const w=restore(input.state),r=a.execute_tick_transaction(w,input.action,input.max_ticks),saved=copy(r.world_state);
  w.state.entities.values().next().value.energy=999;
  const first=equal(r.world_state,saved);r.world_state.entities.values().next().value.position.x=999;
  return {snapshot_independent:first,world_position_unchanged:w.state.entities.values().next().value.position.x===0};
 }
 if(op==='observe'){
  const w=restore(input.state),before=copy(w.state),rng=w.rng.get_state(),e=w.get_experimental_entity();
  const o=a.build_observation(w,e,input.radius);
  return {keys:Object.keys(o).sort(),tick:o.tick,dimensions:[o.local_view.length,o.local_view[0].length],
   out_of_bounds:o.local_view.map(row=>row.map(c=>c.representation==='OUT_OF_BOUNDS')),
   occupied_false:o.local_view.every(row=>row.every(c=>c.occupied===false)),unchanged:equal(before,w.state),rng_unchanged:w.rng.get_state()===rng};
 }
 if(op==='feedback_config'){const c=new a.FeedbackConfig(input.config);return c;}
 if(op==='energy_round'){
  const w=restore(input.state),before=copy(w.state),value=a.World._finite_energy_sum(input.energy,input.delta);
  return {value,state_unchanged:equal(before,w.state),rng:w.rng.get_state()};
 }
 if(op==='lifecycle'){
  const w=restore(input.state),first=w.resolve_lifecycle();if(input.raise_after_first)w.get_experimental_entity().energy=999;
  const second=w.resolve_lifecycle();return {first,second,lifecycle:w.get_experimental_entity().lifecycle,time:w.state.time,rng:w.rng.get_state()};
 }
 if(op==='effect_policy'){
  const w=restore(input.state);w.apply_action({type:'MOVE_E'});const before=copy(w.state);w.advance_dynamics();
  return {after_action:before,after_dynamics:w.state,rng:w.rng.get_state()};
 }
 if(op==='world_action'){
  const w=restore(input.state),before=copy(w.state),r=w.apply_action(input.action);
  return {time:w.state.time,lifecycle:w.get_experimental_entity().lifecycle,rng:w.rng.get_state(),
   no_death_events:r.events.every(e=>e.type!=='ENTITY_DIED'),position:w.get_experimental_entity().position,
   cell_domain_valid:vm.runInContext('validate_Cell',ctx)(w.state.grid[0][0]),structural_map: w.state.grid.map(row=>row.map(c=>c.traversal)),
   before_time:before.time};
 }
 if(op==='recorder_owned'){
  const w=restore(input.state),rec=new a.Recorder(new a.ExperimentConfig(input.experiment_config));
  rec.record_initial_state(w.state);rec.record_initial_lifecycle_from_world([]);
  const confirmed=a.execute_tick_transaction(w,{type:'WAIT'},input.experiment_config.max_ticks),before=copy(w.state);
  rec.record_step(confirmed,null,null,{type:'WAIT'});const saved=copy(rec.steps);
  const query=rec.steps;query[0].world_state.entities.values().next().value.energy=999;
  confirmed.world_state.entities.values().next().value.energy=888;
  return {query_independent:equal(rec.steps,saved),world_unchanged:equal(w.state,before)};
 }
 if(op==='experiment'){
  let resets=0,calls=0,keys=[],seedArgs;
  const factory=(type,seed)=>{seedArgs=[type,seed];return {counter:0,reset(){resets++;},step(f){calls++;this.counter++;keys=Object.keys(f).sort();
   if(input.behavior==='throw'&&calls===2)throw Error('specified agent failure');
   if(input.behavior==='malformed'&&calls===2)return {type:1};return {type:'WAIT'};}};};
  const r=input.with_agent?a.run_experiment(input.config,factory):a.run_without_agent(input.config),t=r.trajectory;
  if(!t)return {status:r.status,failure_reason:r.failure_reason,trajectory_null:true};
  return {status:r.status,failure_reason:r.failure_reason,termination:t.termination_reason,ticks:t.steps.map(s=>s.tick),
   all_wait:t.steps.every(s=>s.action.type==='WAIT'&&s.action_result!==null),
   null_contexts:t.steps.every(s=>s.observation===null&&s.feedback===null),resets,calls,feedback_keys:keys,seed_args:seedArgs||null};
 }
 if(op==='agent_isolation'){
  const run=burn=>a.run_experiment(input.config,(_type,seed)=>{const rng=new a.PRNG(seed);return {reset(){},step(){for(let i=0;i<burn;i++)rng.next();return {type:'WAIT'};}};});
  const x=run(1),y=run(17);return {same_world_trajectory:equal(x.trajectory,y.trajectory),status:x.status};
 }
 throw Error('unsupported F5-B operation: '+op);
}
module.exports={execute};
