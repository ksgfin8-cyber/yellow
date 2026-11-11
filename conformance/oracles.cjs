// Reference calculations: Buffer/BigInt only; never import or invoke yellow.
function fnv(bytes){let h=2166136261n;for(const b of bytes)h=((h^BigInt(b))*16777619n)&0xffffffffn;return Number(h);}
function xorshift(seed,count){let x=BigInt(seed);const out=[];for(let i=0;i<count;i++){x=(x^(x<<13n))&0xffffffffn;x=(x^(x>>17n))&0xffffffffn;x=(x^(x<<5n))&0xffffffffn;out.push(Number(x));}return {values:out,state:Number(x)};}
function bytes(s){
 const u32=n=>{const b=Buffer.alloc(4);b.writeUInt32BE(n);return b;},time=Buffer.alloc(8);time.writeBigUInt64BE(BigInt(s.time));
 const p=[Buffer.from('WLS1'),time,u32(s.grid[0].length),u32(s.grid.length)];
 for(const row of s.grid)for(const c of row)p.push(Buffer.from([c.traversal==='FREE'?0:1,c.effect===null?0:c.effect.kind==='RESOURCE'?1:2,c.effect?.kind==='RESOURCE'?c.effect.stock:0]));
 const entities=[...s.entities.values()].map(e=>[Buffer.from(e.id,'utf8'),e]).sort(([a],[b])=>Buffer.compare(a,b));
 p.push(u32(entities.length));for(const [id,e]of entities){const energy=Buffer.alloc(8);energy.writeDoubleBE(e.energy===0?0:e.energy);p.push(u32(id.length),id,u32(e.position.x),u32(e.position.y),energy,Buffer.from([e.lifecycle==='ACTIVE'?0:1]));}
 const world=Buffer.concat(p);return {world,full:Buffer.concat([world,u32(s.rng_state)])};
}
module.exports={fnv,xorshift,bytes};
