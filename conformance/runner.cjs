const fs = require('node:fs'), path = require('node:path'), crypto = require('node:crypto');
const {encode, decode, compare} = require('./wire.cjs');
const CATEGORIES = ['CANONICAL-RECOVERED','NORMATIVE-DERIVED','ENGINEERING-REGRESSION'];
const STATUSES = ['PASS','FAIL','BLOCKED','UNTESTED'];
function validateCases(cases) {
    const ids = new Set();
    for (const c of cases) {
        if (!c.id || ids.has(c.id)) throw Error('duplicate or absent case identifier: '+c.id);
        ids.add(c.id);
        if (!CATEGORIES.includes(c.category) || !c.clauses?.length || !c.sources?.length) throw Error('missing classification/provenance: '+c.id);
        if (!c.oracle?.method || !['value','throws'].includes(c.oracle.kind) || !Object.hasOwn(c,'expected') || !c.operation || !Object.hasOwn(c,'input')) throw Error('absent oracle/input: '+c.id);
        if(c.oracle.kind==='throws' && (!c.expected || typeof c.expected.name!=='string' ||
            Object.keys(c.expected).some(k=>!['name','message'].includes(k)) ||
            (Object.hasOwn(c.expected,'message')&&typeof c.expected.message!=='string')))throw Error('invalid exception oracle: '+c.id);
    }
}
function exception(error) {
    return {name: String(error?.name || 'Error'), message: String(error?.message || error),
        cause: error?.cause === undefined ? null : typeof error.cause === 'object' ? exception(error.cause) : String(error.cause)};
}
async function runCases(cases, factory, select = null) {
    validateCases(cases);
    const results = [];
    for (const c of cases) {
        const row = {id:c.id, category:c.category, clauses:c.clauses, sources:c.sources,
            operation:c.operation,original_reference:c.original_reference,evidence_kind:c.evidence_kind,
            oracle:c.oracle, input:c.input, expected:c.expected, observed:null, exception:null};
        if (select && !select.has(c.id)) { results.push({...row,status:'UNTESTED',reason:'NOT SELECTED'}); continue; }
        try {
            // Factory/context and data are fresh for every case; no oracle is sent to the adapter.
            const adapter = await factory();
            let actual, thrown;
            try { actual = await adapter.execute(c.operation, structuredClone(decode(c.input))); }
            catch (error) { thrown = exception(error); }
            row.observed = thrown ? null : encode(structuredClone(actual)); row.exception = thrown || null;
            if (c.oracle.kind === 'throws') {
                if (!thrown) throw Error('expected exception was not thrown');
                const expected=decode(c.expected);
                compare(Object.fromEntries(Object.keys(expected).map(k=>[k,thrown[k]])),expected);
            } else {
                if (thrown) { results.push({...row,status:'FAIL',reason:'UNEXPECTED EXCEPTION'}); continue; }
                compare(actual,decode(c.expected));
            }
            results.push({...row,status:'PASS',reason:null});
        } catch (error) { results.push({...row,status:'FAIL',reason:'ORACLE/ADAPTER FAILURE',diagnostic:exception(error)}); }
    }
    return results;
}
function summary(rows, field) {
    const result = {};
    for (const row of rows) for (const key of field==='clauses'?row.clauses:[row.category || 'UNCLASSIFIED-SOURCE-UNAVAILABLE']) {
        result[key] ||= Object.fromEntries(STATUSES.map(s=>[s,0])); result[key][row.status]++;
    }
    return Object.fromEntries(Object.entries(result).sort(([a],[b])=>a.localeCompare(b,'en')));
}
async function run({root=path.resolve(__dirname,'..'), adapterPath=path.join(__dirname,'adapter.cjs'),select=null,caseFile='cases.json'}={}) {
    if(path.basename(caseFile)!==caseFile || !caseFile.endsWith('.json'))throw Error('invalid case manifest name');
    const read = name=>JSON.parse(fs.readFileSync(path.join(root,'conformance',name),'utf8'));
    const sources=read('sources.json'),cases=read(caseFile),corpus=read('corpus.json');
    for (const source of sources) {
        const bytes=fs.readFileSync(path.join(root,source.path));
        const actual=crypto.createHash('sha256').update(bytes).digest('hex');
        if(actual!==source.sha256) throw Error('source fingerprint mismatch: '+source.id);
        const original=source.encoding==='base64'?Buffer.from(bytes.toString(),'base64'):bytes;
        if(crypto.createHash('sha256').update(original).digest('hex')!==source.original_sha256)throw Error('decoded source fingerprint mismatch: '+source.id);
    }
    const sourceIDs=new Set(sources.map(s=>s.id));
    for(const c of cases)for(const id of c.sources)if(!sourceIDs.has(id))throw Error('unknown source: '+id);
    if(select)for(const id of select)if(!cases.some(c=>c.id===id))throw Error('unknown executable selection: '+id);
    const adapter=require(adapterPath);
    const rows=await runCases(cases,()=>adapter.createAdapter({root}),select);
    for(const c of [...corpus.tests,...corpus.vectors].filter(c=>!c.executable_case)) {
        rows.push({id:c.id,category:null,clauses:c.clauses,sources:c.sources,status:'BLOCKED',reason:c.recovery,
            input:null,expected:null,observed:null,exception:null,oracle:null});
    }
    if(new Set(rows.map(r=>r.id)).size!==rows.length)throw Error('duplicate report identifier');
    const digest=name=>crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'conformance',name))).digest('hex');
    return {format:'WORLD-LAB-CONFORMANCE-1',adapter:adapter.id,fixture_base:corpus.product_base,
        case_manifest_sha256:digest(caseFile),corpus_manifest_sha256:digest('corpus.json'),
        canonical_conformance:'NOT ESTABLISHED',sources,summary_by_category:summary(rows,'category'),
        summary_by_clause:summary(rows,'clauses'),results:rows};
}
if(require.main===module) {
    (async()=>{
        const args=process.argv.slice(2),option=k=>{const i=args.indexOf(k);if(i<0)return null;if(!args[i+1])throw Error('missing '+k);return args[i+1];};
        if(args.some((x,i)=>i%2===0&&!['--out','--adapter','--select','--cases'].includes(x)) || args.length%2)throw Error('invalid CLI options');
        const adapter=option('--adapter'),selection=option('--select');
        const report=await run({...(adapter?{adapterPath:path.resolve(adapter)}:{}),...(option('--cases')?{caseFile:option('--cases')}:{}),select:selection?new Set(selection.split(',')):null});
        const output=JSON.stringify(report,null,2)+'\n',out=option('--out');
        if(out)fs.writeFileSync(out,output);else process.stdout.write(output);
        process.exitCode=report.results.some(r=>r.status==='FAIL')?1:0;
    })().catch(error=>{process.stderr.write(JSON.stringify(exception(error))+'\n');process.exitCode=2;});
}
module.exports={run,runCases,validateCases,summary};
