const {loadRuntime}=require('../../tools/p01/runtime.cjs'),{config}=require('../../tools/p01/protocol.cjs');
process.once('message',()=>{
 const r=loadRuntime();
 r.api.run_experiment(new r.api.ExperimentConfig(config(1,'wait')),()=>({reset(){},step(){process.stdout.write('entered-blocking-step\n');while(true){}}}));
});
