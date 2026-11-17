'use strict';
const path=require('node:path'),{runSessions}=require('../../../tools/research/wl-rc1/runner.cjs'),{LIMITS}=require('../../../tools/research/wl-rc1/conditions.cjs');
runSessions({directory:process.argv[2],requests:[{control:'hang'}],freeze_id:'fixture',worker:path.join(__dirname,'control.cjs'),limits:{...LIMITS,total_ms:400,child_ms:5000}}).catch(()=>{});
setTimeout(()=>{while(true){}},100);
