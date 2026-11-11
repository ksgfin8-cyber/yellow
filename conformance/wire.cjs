// Portable, lossless JSON data contract. Maps remain ordered entries; no hash equality shortcut.
const assert = require('node:assert/strict');
function encode(value) {
    if (typeof value === 'bigint') return {$type: 'bigint', value: String(value)};
    if (typeof value === 'number' && (!Number.isFinite(value) || Object.is(value, -0))) {
        const b = Buffer.alloc(8); b.writeDoubleBE(value);
        return {$type: 'binary64', hex: b.toString('hex')};
    }
    if (value === undefined) return {$type: 'undefined'};
    if (value instanceof Map) return {$type: 'map', entries: [...value].map(([k,v]) => [encode(k),encode(v)])};
    if (value instanceof Uint8Array) return {$type: 'bytes', hex: Buffer.from(value).toString('hex')};
    if (Array.isArray(value)) return value.map(encode);
    if (value !== null && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map(k => [k, encode(value[k])]));
    if (value === null || ['string','number','boolean'].includes(typeof value)) return value;
    throw new TypeError('unsupported wire value');
}
function decode(value) {
    if (Array.isArray(value)) return value.map(decode);
    if (value === null || typeof value !== 'object') return value;
    if (value.$type === 'bigint') {
        if (!/^-?(0|[1-9][0-9]*)$/.test(value.value)) throw Error('invalid bigint wire value');
        return BigInt(value.value);
    }
    if (value.$type === 'binary64') {
        if (!/^[a-f0-9]{16}$/.test(value.hex)) throw Error('invalid binary64 wire value');
        return Buffer.from(value.hex,'hex').readDoubleBE();
    }
    if (value.$type === 'undefined') return undefined;
    if (value.$type === 'map') return new Map(value.entries.map(([k,v]) => [decode(k),decode(v)]));
    if (value.$type === 'bytes') {
        if (!/^(?:[a-f0-9]{2})*$/.test(value.hex)) throw Error('invalid bytes wire value');
        return Buffer.from(value.hex,'hex');
    }
    if (Object.hasOwn(value,'$type')) throw Error('unknown wire tag');
    return Object.fromEntries(Object.entries(value).map(([k,v]) => [k,decode(v)]));
}
function compare(actual, expected) {
    // Sort object keys, preserve exact numeric representations, compare every byte/field.
    assert.deepStrictEqual(encode(structuredClone(actual)), encode(structuredClone(expected)));
}
module.exports = {encode, decode, compare};
