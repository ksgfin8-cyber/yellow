// Production entry: authorize before loading an experiment runtime or generating a world.
const {authorize}=require('./gate.cjs'),profile=require('./profile.cjs');
process.once('message',request=>{
 const before=process.resourceUsage();let message;
 try{
  if(!request||Object.keys(request).sort().join(',')!=='agent,authorization,seed')throw Error('invalid evaluation worker request');
  authorize(request.authorization);profile.assertRequest({seed:request.seed,agent:request.agent});
  if(process.execArgv.length!==1||process.execArgv[0]!=='--max-old-space-size=512')throw Error('evaluation heap limit mismatch');
  const {loadRuntime}=require('../runtime.cjs');
  message={kind:'result',result:loadRuntime().run(profile.config(request.seed,request.agent))};
 }catch(error){message={kind:'error',diagnostic:String(error)};}
 const after=process.resourceUsage();message.resources={cpu_user_us:after.userCPUTime-before.userCPUTime,cpu_system_us:after.systemCPUTime-before.systemCPUTime,max_rss_kib:after.maxRSS};
 process.send(message,()=>process.disconnect());
});
