const io=require('./io.cjs');
const {fs,path,sha,need,name,directory,disjoint,stableRead,publish,load,verify}=io;
const STATIC=['execution.jsonl','campaign.json','analysis.json','freeze.json','authorization.json','authorization.sig','reviewer-public.pem','owner-ed25519-public.pem'];
const AGENTS=['wait','random','rule','frontier_memory_v1'];
function key(r){need(r&&Number.isSafeInteger(r.seed)&&r.seed>=0&&AGENTS.includes(r.agent)&&[1,2].includes(r.repetition),'INVALID_ATTEMPT');return `${r.seed}-${r.agent}-${r.repetition}`;}
function parseLog(bytes){
 const attempts=[],issues=[];if(!bytes)return {attempts,issues:['execution.jsonl missing'],tail:false};
 const text=new TextDecoder('utf-8',{fatal:true}).decode(bytes),lines=text.split('\n'),tail=lines.pop();if(tail)issues.push('partial trailing log line');
 for(let i=0;i<lines.length;i++){
  if(!lines[i])continue;let r,k;try{r=JSON.parse(lines[i]);if(!['START_REQUEST','FINISH'].includes(r.event)){issues.push(`unpaired operational log event at line${i+1}`);continue;}k=key(r);}catch(e){issues.push(`invalid log line${i+1}: ${e.message}`);continue;}
  if(r.event==='START_REQUEST')attempts.push({key:k,seed:r.seed,agent:r.agent,repetition:r.repetition,start_line:i+1,finish_line:null,finish:null});
  else {let a=attempts.find(x=>x.key===k&&x.finish_line===null);if(!a){issues.push('FINISH without START: '+k);a={key:k,seed:r.seed,agent:r.agent,repetition:r.repetition,start_line:null};attempts.push(a);}a.finish_line=i+1;a.finish=r;a.record_sha256=sha(Buffer.from(lines[i]));}
 }
 const seen=new Set();for(const a of attempts){if(seen.has(a.key))issues.push('duplicate request: '+a.key);seen.add(a.key);}
 return {attempts,issues,tail:!!tail};
}
function privateMaterial(bytes,file){
 need(!/-----BEGIN (?:[A-Z0-9]+ )*PRIVATE KEY-----|-----BEGIN OPENSSH PRIVATE KEY-----/.test(bytes.toString('utf8')),'PRIVATE_KEY_MATERIAL_REJECTED');
 if(file.endsWith('.pem')){const text=bytes.toString('utf8').trim();need(/^-----BEGIN PUBLIC KEY-----\r?\n[\s\S]+\r?\n-----END PUBLIC KEY-----$/.test(text),'ONLY_PUBLIC_KEY_PEM_ALLOWED');need(require('node:crypto').createPublicKey(bytes).asymmetricKeyType==='ed25519','PUBLIC_KEY_TYPE_MISMATCH');}
}
function session(source,destination,{campaignId=null,identity=null,readAttempts=2,maxBytes=io.MAX_BYTES}={}){
 source=directory(source);const resolvedDestination=path.resolve(destination);disjoint(source,resolvedDestination);destination=directory(resolvedDestination,true);
 need(!fs.existsSync(path.join(destination,'files')),'RESTORED_PACKAGE_IS_READONLY');
 for(const n of ['objects','conflicts','indexes'])directory(path.join(destination,n),true);
 let state=load(destination),body=state.latest?.body??null;
 need(!body||body.source.observed_directory===source,'SOURCE_DIRECTORY_CHANGED_USE_NEW_PACKAGE');
 if(body){need(!campaignId||!body.source.campaign_id_expected||campaignId===body.source.campaign_id_expected,'EXPECTED_CAMPAIGN_CHANGED');need(!identity||!body.source.freeze_id_expected||identity===body.source.freeze_id_expected,'EXPECTED_IDENTITY_CHANGED');campaignId=campaignId??body.source.campaign_id_expected;identity=identity??body.source.freeze_id_expected;}
 const priorIntegrity=state.latest?verify(destination).errors:[];
 function snapshot(){
  const files=structuredClone(body?.files??{}),conflicts=structuredClone(body?.conflicts??[]),errors=[...priorIntegrity],missing=[],semantic=[];
  const observed=new Map();let created=0,reused=0;
  function read(file,required=false){
   try{const b=stableRead(source,name(file),{attempts:readAttempts,maxBytes});privateMaterial(b,file);observed.set(file,b);return b;}
   catch(e){if(e.code==='ENOENT'){if(required)missing.push(file);}else errors.push({file,error:String(e)});return null;}
  }
  read('execution.jsonl',true);let parsed;
  try{parsed=parseLog(observed.get('execution.jsonl'));}catch(e){parsed={attempts:[],issues:[String(e)],tail:true};}semantic.push(...parsed.issues);
  for(const file of STATIC.filter(n=>n!=='execution.jsonl'))read(file,false);
  const finishes=[];
  for(const a of parsed.attempts){
   if(a.finish_line===null)continue;const r=a.finish,expected=[];
   for(const field of ['file','raw_file'])if(r[field]!==undefined){try{const file=name(r[field]);need(file===(field==='file'?a.key+'.wlx.gz':a.key+'.raw.gz'),'ATTEMPT_FILENAME_MISMATCH');expected.push(file);}catch(e){errors.push({file:String(r[field]),error:String(e)});}}
   const fallback=[a.key+'.wlx.gz',a.key+'.raw.gz',a.key+'.failure.json'];
   for(const file of new Set([...expected,...fallback]))if(!observed.has(file))read(file,expected.includes(file));
   if(!fallback.some(f=>observed.has(f)))semantic.push('FINISH has no returned artifact or diagnostic: '+a.key);
   finishes.push({key:a.key,start_line:a.start_line,finish_line:a.finish_line,record_sha256:a.record_sha256,operational_status:r.operational_status??null,files:fallback.filter(f=>observed.has(f))});
  }
  const peek=file=>{try{return JSON.parse(observed.get(file));}catch{return null;}},claimedCampaign=peek('campaign.json')?.campaign_id??peek('authorization.json')?.campaign_id??null,claimedIdentity=peek('campaign.json')?.freeze_id??peek('freeze.json')?.freeze_id??null;
  need(!claimedCampaign||!(campaignId??body?.source.campaign_id_observed)||claimedCampaign===(campaignId??body?.source.campaign_id_observed),'CAMPAIGN_ID_MISMATCH');
  need(!claimedIdentity||!(identity??body?.source.freeze_id_observed)||claimedIdentity===(identity??body?.source.freeze_id_observed),'FREEZE_ID_MISMATCH');
  for(const file of observed.keys()){
   const bytes=observed.get(file),digest=sha(bytes);let object='objects/'+digest+'.bin',copy;
   try{copy=publish(path.join(destination,'objects'),digest+'.bin',bytes);}
   catch(e){
    errors.push({file,error:String(e)});
    if(e.message==='DESTINATION_HASH_CONFLICT'){
     const old=sha(stableRead(path.join(destination,'objects'),digest+'.bin')),f=digest+'-'+old+'.bin';object='conflicts/'+f;copy=publish(path.join(destination,'conflicts'),f,bytes);
     const conflict={file,kind:'DESTINATION_CONTENT_CONFLICT',previous_sha256:old,incoming_sha256:digest,blocking:true};if(!conflicts.some(c=>JSON.stringify(c)===JSON.stringify(conflict)))conflicts.push(conflict);
    }else continue;
   }
   if(copy.created)created++;else reused++;
   const version={object,sha256:digest,bytes:bytes.length,state:'COPY_VERIFIED'},f=files[file]??{versions:[]};
   if(f.current&&f.current.sha256!==digest){
    let append=false;
    if(file==='execution.jsonl')try{const previous=io.objectBytes(destination,f.current);append=bytes.length>previous.length&&bytes.subarray(0,previous.length).equals(previous);}catch{}
    const conflict={file,kind:append?'APPEND_ONLY_LOG_VERSION':'SOURCE_CONTENT_CONFLICT',previous_sha256:f.current.sha256,incoming_sha256:digest,blocking:!append};
    if(!conflicts.some(c=>JSON.stringify(c)===JSON.stringify(conflict)))conflicts.push(conflict);
   }
   if(!f.versions.some(v=>v.object===object&&v.sha256===digest))f.versions.push(version);f.current=version;files[file]=f;
  }
  let manifest=null,authorization=null,freeze=null;
  function json(file){if(!observed.has(file))return null;try{return JSON.parse(observed.get(file));}catch{semantic.push('invalid JSON: '+file);return null;}}
  manifest=json('campaign.json');authorization=json('authorization.json');freeze=json('freeze.json');
  const observedCampaign=manifest?.campaign_id??authorization?.campaign_id??null,observedIdentity=manifest?.freeze_id??freeze?.freeze_id??null;
  if(campaignId&&observedCampaign&&campaignId!==observedCampaign)errors.push({file:'campaign identity',error:'CAMPAIGN_ID_MISMATCH'});
  if(identity&&observedIdentity&&identity!==observedIdentity)errors.push({file:'freeze identity',error:'FREEZE_ID_MISMATCH'});
  if(!observed.has('campaign.json'))missing.push('campaign.json');if(!observed.has('analysis.json'))missing.push('analysis.json');
  const startsWithoutFinish=parsed.attempts.filter(a=>a.finish_line===null).map(a=>({key:a.key,start_line:a.start_line}));
  const declared=manifest?.scope?.episodes??(Array.isArray(manifest?.seeds)&&Array.isArray(manifest?.agents)?manifest.seeds.length*manifest.agents.length*manifest.repetitions:null);
  if(!manifest||!Array.isArray(manifest.entries)||!Number.isSafeInteger(declared)||declared<1||manifest.entries.length!==declared||finishes.length!==declared)semantic.push('terminal manifest/count not complete');
  else if(JSON.stringify(manifest.entries.map(r=>{try{return key(r);}catch{return null;}}))!==JSON.stringify(finishes.map(f=>f.key)))semantic.push('terminal manifest and FINISH order differ');
  const uniqueErrors=[...new Map(errors.map(e=>[JSON.stringify(e),e])).values()];
  const complete=!missing.length&&!startsWithoutFinish.length&&!semantic.length&&!uniqueErrors.length&&!conflicts.some(c=>c.blocking);
  const next={source:{observed_directory:source,campaign_id_expected:campaignId,campaign_id_observed:observedCampaign,freeze_id_expected:identity,freeze_id_observed:observedIdentity},destination:{observed_directory:destination},files:Object.fromEntries(Object.entries(files).sort()),attempts_detected:parsed.attempts.length,finishes,start_without_finish:startsWithoutFinish,missing:[...new Set(missing)].sort(),source_issues:[...new Set(semantic)].sort(),conflicts,errors:uniqueErrors,source_complete:complete,final_manifest_present:observed.has('campaign.json'),manifest_valid_json:manifest!==null,copy_state:uniqueErrors.length?'COPY_ERROR':'COPY_VERIFIED',source_state:complete?'SOURCE_COMPLETE':'SOURCE_INCOMPLETE'};
  let newIndex=false;
  if(JSON.stringify(next)!==JSON.stringify(body)){
   const revision=state.snapshots.length+1,doc={format:io.FORMAT,revision,parent_sha256:state.snapshots.at(-1)?.sha256??null,body:next},bytes=Buffer.from(JSON.stringify(doc,null,2)+'\n'),hash=sha(bytes),file=String(revision).padStart(8,'0')+'.'+hash+'.json';
   publish(path.join(destination,'indexes'),file,bytes);state=load(destination);body=next;newIndex=true;
  }
  return {format:io.FORMAT,revision:state.latest.revision,new_index:newIndex,new_objects:created,reused_objects:reused,copy_state:next.copy_state,source_state:next.source_state,final_manifest_present:next.final_manifest_present,attempts_detected:next.attempts_detected,finishes:finishes.length,start_without_finish:startsWithoutFinish.length,missing:next.missing,conflicts:next.conflicts,errors:next.errors};
 }
 return {snapshot};
}
function snapshot(source,destination,options){return session(source,destination,options).snapshot();}
async function watch(source,destination,{intervalMs=15000,passes=Infinity,signal,onSnapshot=()=>{},...options}={}){
 need(Number.isInteger(intervalMs)&&intervalMs>=100&&intervalMs<=3600000,'INVALID_WATCH_INTERVAL');need(passes===Infinity||(Number.isInteger(passes)&&passes>0),'INVALID_PASS_COUNT');
 const s=session(source,destination,options);let last,count=0;
 while(!signal?.aborted&&count<passes){last=s.snapshot();count++;onSnapshot(last);if(count>=passes||signal?.aborted)break;await new Promise(resolve=>{const timer=setTimeout(done,intervalMs);function done(){clearTimeout(timer);signal?.removeEventListener('abort',done);resolve();}signal?.addEventListener('abort',done,{once:true});});}
 return {passes:count,last};
}
async function main(args){const [mode,source,destination,...rest]=args;need(['snapshot','watch'].includes(mode)&&source&&destination&&rest.length%2===0,'usage: preserve.cjs snapshot|watch <source> <package> [--campaign <id>] [--identity <id>] [--interval-ms <ms>] [--passes <n>] [--read-attempts <1..5>]');const opts={};for(let i=0;i<rest.length;i+=2){const names={'--campaign':'campaignId','--identity':'identity','--interval-ms':'intervalMs','--passes':'passes','--read-attempts':'readAttempts'};need(names[rest[i]],'UNKNOWN_OPTION');opts[names[rest[i]]]=rest[i].includes('ms')||rest[i].includes('passes')||rest[i].includes('attempts')?Number(rest[i+1]):rest[i+1];}
 if(mode==='snapshot'){const r=snapshot(source,destination,opts);console.log(JSON.stringify(r,null,2));if(r.copy_state==='COPY_ERROR')process.exitCode=1;}
 else{const ac=new AbortController(),stop=()=>ac.abort();process.on('SIGINT',stop);process.on('SIGTERM',stop);try{await watch(source,destination,{...opts,signal:ac.signal,onSnapshot:r=>console.log(JSON.stringify(r))});}finally{process.removeListener('SIGINT',stop);process.removeListener('SIGTERM',stop);}}
}
if(require.main===module)main(process.argv.slice(2)).catch(e=>{console.error(String(e));process.exitCode=1;});
module.exports={snapshot,watch,parseLog};
