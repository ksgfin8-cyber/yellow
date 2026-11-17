'use strict';
const fs=require('node:fs'),path=require('node:path');
function treeRss(parent){const rows=new Map();for(const name of fs.readdirSync('/proc'))if(/^\d+$/.test(name)){try{const s=fs.readFileSync(`/proc/${name}/status`,'utf8');rows.set(Number(name),{parent:Number(/^PPid:\s+(\d+)/m.exec(s)?.[1]),rss:Number(/^VmRSS:\s+(\d+)/m.exec(s)?.[1]??0)*1024});}catch{}}
 if(!rows.has(parent))throw Error('controller /proc unavailable');const pids=new Set([parent]);let changed=true;while(changed){changed=false;for(const [pid,r]of rows)if(pids.has(r.parent)&&!pids.has(pid)){pids.add(pid);changed=true;}}return {rss_bytes:[...pids].reduce((n,p)=>n+rows.get(p).rss,0),pids:[...pids]};}
function killGroup(pid){if(!pid)return;try{process.kill(-pid,'SIGKILL');}catch{try{process.kill(pid,'SIGKILL');}catch{}}}
if(require.main===module)process.once('message',config=>{
 const start=process.hrtime.bigint();let active=null,stopped=false,maxRSS=0,hard=null;
 const log=row=>fs.appendFileSync(path.join(config.directory,'guardian.jsonl'),JSON.stringify({...row,monotonic_ns:String(process.hrtime.bigint())})+'\n');
 function stop(reason,observed){if(stopped)return;stopped=true;clearInterval(timer);killGroup(active?.pid);log({type:'STOP',reason,observed,active,max_rss_bytes:maxRSS});process.send({type:'STOP',reason,observed,max_rss_bytes:maxRSS});hard=setTimeout(()=>{try{process.kill(config.parent,'SIGKILL');}catch{}process.exit(2);},250);}
 const timer=setInterval(()=>{try{const now=process.hrtime.bigint(),r=treeRss(config.parent);maxRSS=Math.max(maxRSS,r.rss_bytes);const elapsed=Number(now-start)/1e6;if(r.rss_bytes>config.limits.rss_bytes)return stop('RSS_LIMIT',r);if(elapsed>config.limits.total_ms)return stop('TOTAL_WATCHDOG',{elapsed_ms:elapsed});if(active&&Number(now-BigInt(active.started_ns))/1e6>config.limits.child_ms)return stop('CHILD_TIMEOUT',{elapsed_ms:Number(now-BigInt(active.started_ns))/1e6});}catch(e){stop('SUPERVISION_ERROR',{error:String(e)});}},config.limits.sample_ms);
 process.on('message',m=>{if(m.type==='ACK'){clearTimeout(hard);if(process.connected)process.disconnect();return;}if(m.type==='ACTIVE'){active={pid:m.pid,started_ns:m.started_ns};log({type:'ACTIVE',...active});}if(m.type==='IDLE')active=null;if(m.type==='CLOSE'){clearInterval(timer);clearTimeout(hard);log({type:'CLOSED',max_rss_bytes:maxRSS});process.send({type:'CLOSED',max_rss_bytes:maxRSS});process.disconnect();}});
 process.on('disconnect',()=>{clearInterval(timer);killGroup(active?.pid);});log({type:'READY',limits:config.limits});process.send({type:'READY'});
});
module.exports={treeRss,killGroup};
