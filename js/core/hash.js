// FNV-1a de 32 bits sobre bytes UTF-8.
// Contrato: js/core/hash.js según especificación §5.

const FNV_OFFSET_BASIS = 0x811c9dc5;
const FNV_PRIME = 0x01000193;

function fnv1a(text) {
    if (typeof text !== "string") {
        throw new Error("fnv1a: input must be a string");
    }

    // Convertir a UTF-8 explícitamente para evitar dependencias del navegador.
    const bytes = utf8_encode(text);

    let hash = FNV_OFFSET_BASIS >>> 0;
    for (let i = 0; i < bytes.length; i++) {
        hash = (hash ^ bytes[i]) >>> 0;
        // Multiplicación módulo 2^32 sin pérdida de precisión:
        // usar Math.imul para multiplicación de 32 bits.
        hash = Math.imul(hash, FNV_PRIME) >>> 0;
    }
    return hash >>> 0;
}

// Codificador UTF-8 mínimo y determinista.
// No depende de TextEncoder, aunque podría usarse en navegadores modernos.
function utf8_encode(str) {
    const bytes = [];
    for (let i = 0; i < str.length; i++) {
        let code = str.charCodeAt(i);

        // Pares subrogados
        if (code >= 0xD800 && code <= 0xDBFF && i + 1 < str.length) {
            const next = str.charCodeAt(i + 1);
            if (next >= 0xDC00 && next <= 0xDFFF) {
                code = 0x10000 + ((code - 0xD800) << 10) + (next - 0xDC00);
                i++;
            }
        }

        if (code < 0x80) {
            bytes.push(code);
        } else if (code < 0x800) {
            bytes.push(0xC0 | (code >> 6));
            bytes.push(0x80 | (code & 0x3F));
        } else if (code < 0x10000) {
            bytes.push(0xE0 | (code >> 12));
            bytes.push(0x80 | ((code >> 6) & 0x3F));
            bytes.push(0x80 | (code & 0x3F));
        } else {
            bytes.push(0xF0 | (code >> 18));
            bytes.push(0x80 | ((code >> 12) & 0x3F));
            bytes.push(0x80 | ((code >> 6) & 0x3F));
            bytes.push(0x80 | (code & 0x3F));
        }
    }
    return bytes;
}
