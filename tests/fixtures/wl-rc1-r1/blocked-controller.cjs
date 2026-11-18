'use strict';
const path=require('node:path'),{run}=require('../../../tools/research/wl-rc1-r1/session.cjs'),{LIMITS}=require('../../../tools/research/wl-rc1-r1/plan.cjs');
run({directory:process.argv[2],requests:[{kind:'R1_CONTROL',control:'ok',condition:{},freeze_id:'control'}],freeze_id:'control',worker:path.join(__dirname,'control.cjs'),limits:{...LIMITS,total_ms:1500},beforeVerify:()=>{while(true){}}}).catch(()=>{});
