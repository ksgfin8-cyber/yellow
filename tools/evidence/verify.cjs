const io=require('./io.cjs'),{fs,path,need,directory,disjoint,publish,objectBytes}=io;
function verify(root){const r=io.verify(root);return {format:r.format,state:r.state,preservation_state:r.preservation_state,preservation_errors:r.preservation_errors,indexes:r.indexes,objects_checked:r.objects_checked,source_complete:r.source_complete,final_manifest_present:r.final_manifest_present,errors:r.errors};}
function restore(root,destination){
 root=directory(root);disjoint(root,path.resolve(destination));const checked=io.verify(root);need(checked.state==='COPY_VERIFIED','RESTORE_REFUSED_CORRUPT_PACKAGE');
 fs.mkdirSync(destination,{mode:0o700});destination=directory(destination);
 for(const folder of ['objects','conflicts','indexes','files'])directory(path.join(destination,folder),true);
 const copied=new Set();
 for(const snapshot of checked.package.snapshots){for(const f of Object.values(snapshot.document.body.files))for(const v of f.versions){if(copied.has(v.object))continue;const [sub,file]=v.object.split('/');publish(path.join(destination,sub),file,objectBytes(root,v));copied.add(v.object);}publish(path.join(destination,'indexes'),snapshot.file,io.stableRead(path.join(root,'indexes'),snapshot.file));}
 for(const [file,f]of Object.entries(checked.package.latest.body.files))publish(path.join(destination,'files'),file,objectBytes(root,f.current));
 const again=verify(destination);need(again.state==='COPY_VERIFIED','RESTORE_VERIFICATION_FAILED');return {...again,scientific_acceptance:false,restored_files:Object.keys(checked.package.latest.body.files).length,restoration:again.source_complete?'VERIFIED_COMPLETE_EVIDENCE':'VERIFIED_PARTIAL_EVIDENCE_NOT_SCIENTIFIC_ACCEPTANCE'};
}
if(require.main===module){try{const [root,option,dest]=process.argv.slice(2);need(root&&(!option||(option==='--restore'&&dest)),'usage: verify.cjs <package> [--restore <NEW-directory>]');const r=option?restore(root,dest):verify(root);console.log(JSON.stringify(r,null,2));if(r.state!=='COPY_VERIFIED')process.exitCode=1;}catch(e){console.error(String(e));process.exitCode=1;}}
module.exports={verify,restore};
