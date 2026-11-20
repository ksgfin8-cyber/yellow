'use strict';
const fs=require('node:fs'),zlib=require('node:zlib'),assert=require('node:assert/strict');
const codec=require('../p01/codec.cjs'),{sha}=require('./identity.cjs');
const FORMAT='WL-TITAN-MVP01-DEVELOPMENT-ARCHIVE-1';
function pack(artifact){const body=codec.encode(artifact),text=JSON.stringify(body);assert.ok(Buffer.byteLength(text)<=32*1024*1024,'development artifact exceeds raw capacity');return zlib.gzipSync(JSON.stringify({format:FORMAT,body,sha256:sha(text)}));}
function unpack(bytes){const frame=JSON.parse(zlib.gunzipSync(bytes,{maxOutputLength:40*1024*1024}));assert.deepEqual(Object.keys(frame).sort(),['body','format','sha256']);assert.equal(frame.format,FORMAT);assert.equal(frame.sha256,sha(JSON.stringify(frame.body)));return codec.decode(frame.body);}
function write(file,bytes){const temporary=file+'.partial';fs.writeFileSync(temporary,bytes,{flag:'wx'});fs.linkSync(temporary,file);fs.unlinkSync(temporary);return {bytes:bytes.length,sha256:sha(bytes)};}
module.exports={FORMAT,pack,unpack,write};
