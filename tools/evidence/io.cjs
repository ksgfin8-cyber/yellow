// Local byte transport only; no experiment, agent or authorization execution.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const FORMAT='WL-EVIDENCE-COPY-1',MAX_BYTES=64*1024*1024;
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
function need(v,m){if(!v)throw Error(m);}
function name(s){need(typeof s==='string'&&/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(s)&&s!=='.'&&s!=='..','UNSAFE_RELATIVE_PATH');return s;}
function directory(p,create=false){
 const absolute=path.resolve(p),parts=absolute.slice(path.parse(absolute).root.length).split(path.sep).filter(Boolean);let current=path.parse(absolute).root;
 for(const part of parts){current=path.join(current,part);if(!fs.existsSync(current)&&create)fs.mkdirSync(current,{mode:0o700});const s=fs.lstatSync(current);need(s.isDirectory()&&!s.isSymbolicLink(),'UNSAFE_DIRECTORY');}
 return fs.realpathSync(absolute);
}
function disjoint(a,b){const within=(x,y)=>{const r=path.relative(x,y);return r===''||(!r.startsWith('..'+path.sep)&&r!=='..'&&!path.isAbsolute(r));};need(!within(a,b)&&!within(b,a),'SOURCE_DESTINATION_OVERLAP');}
function stamp(s){return [s.dev,s.ino,s.size,s.mtimeNs,s.ctimeNs].join('/');}
function stableRead(root,file,{attempts=2,maxBytes=MAX_BYTES}={}){
 name(file);need(Number.isSafeInteger(maxBytes)&&maxBytes>0,'INVALID_FILE_SIZE_LIMIT');need(Number.isInteger(attempts)&&attempts>=1&&attempts<=5,'INVALID_READ_ATTEMPTS');let last;
 for(let n=0;n<attempts;n++){
  let dirfd,fd;
  try{
   const beforeRoot=fs.lstatSync(root,{bigint:true});need(beforeRoot.isDirectory()&&!beforeRoot.isSymbolicLink(),'UNSAFE_DIRECTORY');
   dirfd=fs.openSync(root,fs.constants.O_RDONLY|(fs.constants.O_DIRECTORY||0)|(fs.constants.O_NOFOLLOW||0));
   const openedRoot=fs.fstatSync(dirfd,{bigint:true});need(openedRoot.dev===beforeRoot.dev&&openedRoot.ino===beforeRoot.ino,'SOURCE_CHANGED');
   const base=process.platform==='linux'?`/proc/self/fd/${dirfd}`:root,full=path.join(base,file),s=fs.lstatSync(full,{bigint:true});
   need(s.isFile()&&!s.isSymbolicLink(),'UNSAFE_SOURCE_FILE');need(s.size<=BigInt(maxBytes),'FILE_SIZE_LIMIT');
   fd=fs.openSync(full,fs.constants.O_RDONLY|(fs.constants.O_NOFOLLOW||0));const start=fs.fstatSync(fd,{bigint:true});need(stamp(start)===stamp(s),'SOURCE_CHANGED');
   const buffer=Buffer.alloc(Number(start.size)+1);let length=0;while(length<buffer.length){const n=fs.readSync(fd,buffer,length,buffer.length-length,null);if(n===0)break;length+=n;}
   const bytes=buffer.subarray(0,length),end=fs.fstatSync(fd,{bigint:true}),now=fs.lstatSync(full,{bigint:true}),rootNow=fs.lstatSync(root,{bigint:true});
   need(stamp(start)===stamp(end)&&stamp(end)===stamp(now)&&BigInt(bytes.length)===end.size&&beforeRoot.dev===rootNow.dev&&beforeRoot.ino===rootNow.ino&&!rootNow.isSymbolicLink(),'SOURCE_CHANGED');
   return bytes;
  }catch(e){last=e;if(e.message!=='SOURCE_CHANGED')throw e;}
  finally{if(fd!==undefined)fs.closeSync(fd);if(dirfd!==undefined)fs.closeSync(dirfd);}
 }
 throw last;
}
function syncDirectory(root){if(process.platform!=='win32'){const fd=fs.openSync(root,'r');try{fs.fsyncSync(fd);}finally{fs.closeSync(fd);}}}
function publish(root,file,bytes){
 directory(root,true);name(file);const destination=path.join(root,file),digest=sha(bytes);
 if(fs.existsSync(destination)){const b=stableRead(root,file);need(b.length===bytes.length&&sha(b)===digest,'DESTINATION_HASH_CONFLICT');return {created:false,sha256:digest,bytes:b.length};}
 const tmp='.pending-'+crypto.randomUUID();let created=false;
 try{const fd=fs.openSync(path.join(root,tmp),'wx',0o600);created=true;try{fs.writeFileSync(fd,bytes);fs.fsyncSync(fd);}finally{fs.closeSync(fd);}
  try{fs.linkSync(path.join(root,tmp),destination);}catch(e){if(e.code!=='EEXIST')throw e;const b=stableRead(root,file);need(sha(b)===digest&&b.length===bytes.length,'DESTINATION_HASH_CONFLICT');}
  syncDirectory(root);const saved=stableRead(root,file);need(sha(saved)===digest&&saved.length===bytes.length,'COPY_VERIFICATION_FAILED');return {created:true,sha256:digest,bytes:saved.length};
 }finally{if(created)fs.unlinkSync(path.join(root,tmp));}
}
function objectPath(s){need(typeof s==='string'&&/^(objects\/[a-f0-9]{64}\.bin|conflicts\/[a-f0-9]{64}-[a-f0-9]{64}\.bin)$/.test(s),'UNSAFE_OBJECT_PATH');return s.split('/');}
function objectBytes(root,version){const [sub,file]=objectPath(version.object);need(file.startsWith(version.sha256),'OBJECT_NAME_HASH_MISMATCH');need(/^[a-f0-9]{64}$/.test(version.sha256)&&Number.isSafeInteger(version.bytes)&&version.bytes>=0,'INVALID_OBJECT_METADATA');const b=stableRead(directory(path.join(root,sub)),file);need(b.length===version.bytes&&sha(b)===version.sha256,'STORED_OBJECT_HASH_MISMATCH: '+version.object);return b;}
function load(root){
 root=directory(root);need(fs.readdirSync(root).every(n=>['objects','conflicts','indexes','files'].includes(n)),'UNRECOGNIZED_PACKAGE_CONTENT');const indexes=path.join(root,'indexes');if(!fs.existsSync(indexes))return {root,snapshots:[],latest:null};directory(indexes);
 const files=fs.readdirSync(indexes).filter(f=>!f.startsWith('.pending-')).sort();const snapshots=[];let parent=null;
 for(const f of files){need(/^\d{8}\.[a-f0-9]{64}\.json$/.test(f),'INVALID_INDEX_FILE');const b=stableRead(indexes,f),h=sha(b),doc=JSON.parse(b);
  need(f===`${String(snapshots.length+1).padStart(8,'0')}.${h}.json`&&doc.format===FORMAT&&doc.revision===snapshots.length+1&&doc.parent_sha256===parent&&doc.body&&typeof doc.body.files==='object','INVALID_INDEX_CHAIN');
  for(const [file,v]of Object.entries(doc.body.files)){name(file);need(Array.isArray(v.versions)&&v.versions.length>0,'INVALID_VERSION_LIST');for(const version of v.versions)objectPath(version.object);need(v.versions.some(x=>x.object===v.current.object&&x.sha256===v.current.sha256&&x.bytes===v.current.bytes),'INVALID_CURRENT_VERSION');}
  snapshots.push({file:f,sha256:h,document:doc});parent=h;
 }
 return {root,snapshots,latest:snapshots.at(-1)?.document??null};
}
function verify(root){
 const p=load(root);need(p.latest,'NO_PUBLISHED_INDEX');const errors=[],seen=new Map();
 for(const snapshot of p.snapshots)for(const v of Object.values(snapshot.document.body.files))for(const version of v.versions){if(seen.has(version.object)){if(seen.get(version.object)!==version.sha256+'/'+version.bytes)errors.push({file:version.object,error:'CONTRADICTORY_OBJECT_METADATA'});continue;}seen.set(version.object,version.sha256+'/'+version.bytes);try{objectBytes(p.root,version);}catch(e){errors.push({file:version.object,error:String(e)});}}
 if(fs.existsSync(path.join(p.root,'files')))for(const [file,f]of Object.entries(p.latest.body.files))try{const b=stableRead(directory(path.join(p.root,'files')),file);need(b.length===f.current.bytes&&sha(b)===f.current.sha256,'RESTORED_FILE_HASH_MISMATCH');}catch(e){errors.push({file:'files/'+file,error:String(e)});}
 return {format:FORMAT,indexes:p.snapshots.length,objects_checked:seen.size,state:errors.length?'COPY_ERROR':'COPY_VERIFIED',preservation_state:p.latest.body.copy_state,preservation_errors:p.latest.body.errors,source_complete:p.latest.body.source_complete,final_manifest_present:p.latest.body.final_manifest_present,errors,package:p};
}
module.exports={fs,path,FORMAT,MAX_BYTES,sha,need,name,directory,disjoint,stableRead,publish,objectBytes,load,verify};
