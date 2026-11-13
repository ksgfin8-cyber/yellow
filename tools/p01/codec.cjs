// Review boundary around the existing test codec: canonical tags, no lossy Maps.
const wire=require('../../conformance/wire.cjs');
function check(v,message){if(!v)throw Error('archive: '+message);}
function exact(x,keys){return x!==null&&typeof x==='object'&&!Array.isArray(x)&&Object.keys(x).sort().join(',')===[...keys].sort().join(',');}
const canonical=value=>JSON.stringify(wire.encode(value));
function inspect(x){
 if(x===null||['string','number','boolean'].includes(typeof x))return;
 check(typeof x==='object','invalid wire value');
 if(Array.isArray(x)){x.forEach(inspect);return;}
 if(Object.hasOwn(x,'$type')){
  const shapes={bigint:['$type','value'],binary64:['$type','hex'],undefined:['$type'],map:['$type','entries'],bytes:['$type','hex']};
  check(Object.hasOwn(shapes,x.$type)&&exact(x,shapes[x.$type]),'invalid wire tag/fields');
  if(x.$type==='map'){
   check(Array.isArray(x.entries)&&x.entries.every(e=>Array.isArray(e)&&e.length===2&&typeof e[0]==='string'),'maps require string keys');
   check(new Set(x.entries.map(e=>e[0])).size===x.entries.length,'duplicate map key');
   x.entries.forEach(e=>e.forEach(inspect));
  }
 }else Object.values(x).forEach(inspect);
}
function decode(encoded){
 inspect(encoded);let value;
 try{value=wire.decode(encoded);}catch(e){throw Error('archive: invalid wire encoding: '+e.message);}
 check(JSON.stringify(wire.encode(value))===JSON.stringify(encoded),'noncanonical or lossy wire representation');return value;
}
module.exports={check,exact,canonical,encode:wire.encode,decode};
