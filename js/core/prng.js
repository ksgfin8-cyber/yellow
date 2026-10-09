// PRNG determinista Xorshift32.
// Contrato: js/core/prng.js según especificación §4.

class PRNG {
    constructor(seed) {
        this.state = PRNG._normalize(seed);
        if (this.state === 0) {
            throw new Error("PRNG: seed produces state 0, which is forbidden");
        }
    }

    static _normalize(seed) {
        if (!Number.isFinite(seed)) {
            throw new Error("PRNG: seed must be finite");
        }
        // Forzar a uint32 sin signo.
        let s = seed >>> 0;
        if (s === 0) {
            throw new Error("PRNG: seed must not be zero after normalization");
        }
        return s;
    }

    next() {
        let x = this.state;
        x = (x ^ (x << 13)) >>> 0;
        x = (x ^ (x >>> 17)) >>> 0;
        x = (x ^ (x << 5)) >>> 0;
        this.state = x;
        return x;
    }

    next_float() {
        return this.next() / 4294967296; // 2^32
    }

    next_int(min, max) {
        if (!Number.isInteger(min) || !Number.isInteger(max)) {
            throw new Error("PRNG.next_int: min and max must be integers");
        }
        if (min > max) {
            throw new Error("PRNG.next_int: min must be <= max");
        }
        const range = max - min + 1;
        return min + Math.floor(this.next_float() * range);
    }

    get_state() {
        return this.state >>> 0;
    }

    set_state(state) {
        const s = PRNG._normalize(state);
        this.state = s;
    }
}
