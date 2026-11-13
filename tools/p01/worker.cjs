const {loadRuntime}=require('./runtime.cjs'),{assertRequest,config}=require('./protocol.cjs');
process.once('message',request=>{
 const before=process.resourceUsage();let message;
 try{
  assertRequest(request);const runtime=loadRuntime();
  message={kind:'result',result:runtime.run(config(request.seed,request.agent))};
 }catch(error){message={kind:'error',diagnostic:String(error)};}
 const after=process.resourceUsage();message.resources={cpu_user_us:after.userCPUTime-before.userCPUTime,cpu_system_us:after.systemCPUTime-before.systemCPUTime,max_rss_kib:after.maxRSS};
 process.send(message,()=>process.disconnect());
});
