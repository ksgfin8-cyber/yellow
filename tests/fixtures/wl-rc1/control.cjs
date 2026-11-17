'use strict';
process.once('message',r=>{
 if(r.control==='hang'){while(true){}}
 if(r.control==='crash'){process.exit(7);}
 if(r.control==='flood'){process.stdout.write('x'.repeat(100000));return;}
 if(r.control==='block-controller'){process.send({type:'fatal',error:'fixture'});return;}
 process.send({type:'header',format:'WL-RC1-RAW-1',freeze_id:r.freeze_id,units:{time:'ns_decimal_string',cpu:'microseconds',memory:'bytes'}},()=>process.send({type:'done'},()=>process.disconnect()));
});
