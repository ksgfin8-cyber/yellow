'use strict';
const fs=require('node:fs'),id=require('./identity.cjs'),p=require('./protocol.cjs');
async function main(args){const [cmd,...a]=args;
    if(cmd==='plan'&&!a.length)return {phase:'DEVELOPMENT_ONLY',plan:p.smokePlan(),limits:p.LIMITS,evaluation_120:'HOLD'};
    if(cmd==='freeze'&&a.length===1){const x=id.build();fs.writeFileSync(a[0],JSON.stringify(x,null,2)+'\n',{flag:'wx'});return {freeze_id:x.freeze_id,evaluation_120:'HOLD'};}
    if(cmd==='check'&&a.length===1)return {freeze_id:id.check(a[0]).freeze_id,evaluation_120:'HOLD'};
    if(cmd==='smoke'&&a.length===2)return require('./controller.cjs').smoke(a[0],a[1]);
    if(cmd==='verify'&&a.length===1)return require('./controller.cjs').verifyDirectory(a[0]);
    throw Error('TITAN development: plan | freeze <new-file> | check <candidate> | smoke <candidate> <new-directory> | verify <directory>; no scientific evaluation mode');
}
if(require.main===module)main(process.argv.slice(2)).then(x=>{console.log(JSON.stringify(x,null,2));if(x.status==='PARTIAL')process.exitCode=2;}).catch(e=>{console.error(String(e));process.exitCode=1;});
module.exports={main};
