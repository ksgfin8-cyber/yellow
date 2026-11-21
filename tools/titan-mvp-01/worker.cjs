'use strict';
const {assertRequest,config}=require('./protocol.cjs'),{check}=require('./identity.cjs');
process.once('message',request=>{
    const before=process.resourceUsage();let message;
    try{
        assertRequest(request.episode);const pinned=check(request.candidate);
        if(pinned.freeze_id!==request.freeze_id)throw Error('development identity mismatch');
        const runtime=require('./runtime.cjs').loadRuntime(),start=process.hrtime.bigint();
        const episode=runtime.run(config(request.episode.seed,request.episode.agent));
        const run_ns=String(process.hrtime.bigint()-start),verifyStart=process.hrtime.bigint();
        const verification=require('./verify.cjs').verifyEpisode(episode);
        const verify_ns=String(process.hrtime.bigint()-verifyStart);
        check(request.candidate);
        message={kind:'result',result:{episode,verification,metrics:require('./metrics.cjs').measure(episode),timing:{run_ns,verify_ns}}};
    }catch(error){message={kind:'error',diagnostic:String(error)};}
    const after=process.resourceUsage();message.resources={cpu_user_us:after.userCPUTime-before.userCPUTime,
        cpu_system_us:after.systemCPUTime-before.systemCPUTime,max_rss_kib:after.maxRSS};
    process.send(message,()=>process.disconnect());
});
