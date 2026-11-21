"""Read-only inventory of every tracked file; classifications are audit aids, not normative authority."""
from pathlib import Path
import sys, subprocess, json, hashlib, base64, tarfile, io, re, collections, datetime
root,out=map(Path,sys.argv[1:3]);out.mkdir(parents=True,exist_ok=True)
commit=subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip()
names=subprocess.check_output(['git','ls-tree','-rz',commit],cwd=root).split(b'\0')
rows=[];links=[];issues=[];counts=collections.Counter()
def family(name):
    if name.startswith('js/'):return 'production/'+name.split('/')[1]
    if name.startswith('tests/'):return 'tests'
    if name.startswith('conformance/'):return 'conformance'
    if name.startswith('tools/'):return 'tools/'+name.split('/')[1]
    if name.startswith('docs/research/'):return 'research/'+name.split('/')[2]
    if name.startswith('docs/'):return 'docs/'+name.split('/')[1].split('.')[0]
    return 'root'
def kind(name,text):
    if name.startswith('docs/WORLD-LAB_v0.2.'):return 'NORMATIVE_SOURCE'
    if name.startswith('docs/program/'):return 'PROPOSED_METHODOLOGICAL_SOURCE'
    if name.startswith('tests/'):return 'TEST'
    if name.startswith(('js/','tools/')) or name.endswith(('.cjs','.py')):return 'CODE_OR_AUDIT_SCRIPT'
    if name.endswith(('.tar.gz','.wlx.gz','.b64')):return 'PRIMARY_ARCHIVE_OR_SOURCE_CAPTURE'
    if name.endswith('.json'):return 'STRUCTURED_DATA_OR_EVIDENCE'
    if name.endswith('.md'):
        if any(x in name.upper() for x in ['PROPOSAL','CANDIDATE']):return 'PROPOSAL'
        if any(x in name.upper() for x in ['PROTOCOL','CONTRACT','DECISION','CLOSURE']):return 'CONTRACT_PROTOCOL_OR_HISTORICAL_DECISION'
        return 'REPORT_OR_DOCUMENTATION'
    return 'OTHER_DATA_OR_ASSET'
for raw in names:
    if not raw:continue
    header,bname=raw.split(b'\t',1);name=bname.decode();data=(root/name).read_bytes()
    assert hashlib.sha1(f'blob {len(data)}\0'.encode()+data).hexdigest()==header.split()[-1].decode(),name
    try:text=data.decode('utf8')
    except UnicodeDecodeError:text=None
    r={'path':name,'bytes':len(data),'sha256':hashlib.sha256(data).hexdigest(),'family':family(name),'classification':kind(name,text),'review':'MACHINE_READ_COMPLETE; semantic manual review not implied','utf8':text is not None}
    if text is not None:r['lines']=len(text.splitlines())
    if name.endswith('.json'):
        try:
            parsed=json.loads(text,parse_constant=lambda x:(_ for _ in ()).throw(ValueError(x)))
            r['json']='VALID';r['top_type']=type(parsed).__name__
            if isinstance(parsed,(dict,list)):r['top_size']=len(parsed)
        except Exception as e:r['json']='INVALID';issues.append({'file':name,'issue':'JSON_PARSE','error':str(e)})
    if name.endswith('.b64'):
        try:b=base64.b64decode(b''.join(data.split()),validate=True);r['decoded_bytes']=len(b);r['decoded_sha256']=hashlib.sha256(b).hexdigest()
        except Exception as e:issues.append({'file':name,'issue':'BASE64_PARSE','error':str(e)})
    if name.endswith('.tar.gz'):
        try:
            with tarfile.open(fileobj=io.BytesIO(data)) as archive:
                members=archive.getmembers();r['archive_members']=len(members);r['archive_file_count']=sum(x.isfile() for x in members)
                for m in members:
                    assert not m.issym() and not m.islnk() and not Path(m.name).is_absolute() and '..' not in Path(m.name).parts
                    if m.isfile():hashlib.sha256(archive.extractfile(m).read()).hexdigest()
                r['archive_read']='ALL_MEMBER_BYTES_READ_NO_EXTRACTION'
        except Exception as e:issues.append({'file':name,'issue':'TAR_READ','error':str(e)})
    if name.endswith('.md'):
        for number,line in enumerate(text.splitlines(),1):
            for target in re.findall(r'\]\(([^)]+)\)',line):
                if target.startswith(('http:','https:','mailto:','#','sandbox:')):continue
                target=target.split(' "')[0].split('#')[0].strip('<>')
                if target and not (root/name).parent.joinpath(target).exists():links.append({'file':name,'line':number,'target':target,'status':'UNRESOLVED_LOCAL_TARGET','manual_materiality_required':True})
    counts[r['family']]+=1;rows.append(r)
result={'base_commit':commit,'inventory_scope':'Every blob of current Git tree; remote branches and external workspace evidence tracked separately','files':rows,'family_counts':dict(sorted(counts.items())),'classification_counts':dict(collections.Counter(r['classification'] for r in rows)),'file_count':len(rows),'total_bytes':sum(r['bytes'] for r in rows),'machine_scan_issues':issues,'manual_semantic_exhaustiveness':False,'unresolved_local_links':links}
(out/'inventory.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps({k:v for k,v in result.items() if k not in ['files','unresolved_local_links']},indent=2));print('UNRESOLVED_LOCAL_TARGETS='+str(len(links)))
