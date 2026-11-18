'use strict';
const path=require('node:path'),{journal}=require('../../../tools/research/wl-rc1-r1/journal.cjs');
process.once('message',r=>{const j=journal(path.join(r.data_directory,`${String(r.index).padStart(3,'0')}.stage.jsonl`));
 if(r.control==='hang')j.sync(r.stage||'EXECUTE','synthetic',()=>{while(true){}});
 else if(r.control==='error'){try{j.sync('PREPARE','synthetic',()=>{throw Error('synthetic preparation error');});}catch{process.send({type:'operation_error',error:'synthetic preparation error',stage:'PREPARE'});setInterval(()=>{},1000);}}
 else {j.sync('SYNTHETIC','synthetic',()=>null);j.close();process.send({type:'header',format:'WL-RC1-RAW-1',revision:'R1-1.0.0',freeze_id:r.freeze_id,condition:r.condition,units:{time:'ns_decimal_string',cpu:'microseconds',memory:'bytes'}},()=>process.send({type:'done'},()=>process.disconnect()));}
});
