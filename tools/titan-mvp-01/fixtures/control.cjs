'use strict';
process.once('message',request=>{
    if(request.mode==='hang'){while(true){}}
    else process.send({kind:'result',result:'technical fixture only'},()=>process.disconnect());
});
