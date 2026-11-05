// WORLD-LAB v0.2.5 §10. Classic script: no module loader required.
class PRNG {
    constructor(seed) {
        this.state = PRNG._validate_state(seed);
    }

    static _validate_state(state) {
        if (state === 0) throw new ContractError("rng zero state");
        if (!Number.isInteger(state) || state < 1 || state > 0xFFFFFFFF) {
            throw new ContractError("rng state must be a nonzero uint32");
        }
        return state;
    }

    next() {
        let x = PRNG._validate_state(this.state);
        const MASK32 = 0xFFFFFFFF;
        x = ((x ^ ((x << 13) & MASK32)) & MASK32) >>> 0;
        x = ((x ^ (x >>> 17)) & MASK32) >>> 0;
        x = ((x ^ ((x << 5) & MASK32)) & MASK32) >>> 0;
        if (x === 0) throw new ContractError("rng zero state");
        this.state = x;
        return x;
    }

    next_float() {
        return this.next() / 4294967296.0;
    }

    next_int(a, b) {
        // Supported exact Number interval: safe integer endpoints, at most 2^32 values.
        if (!Number.isSafeInteger(a) || !Number.isSafeInteger(b) || a > b) {
            throw new ContractError("invalid rng integer interval");
        }
        const n = b - a + 1;
        if (!Number.isSafeInteger(n) || n > 4294967296) {
            throw new ContractError("invalid rng integer interval");
        }
        const limit = 4294967296 - (4294967296 % n);
        while (true) {
            const u = this.next();
            if (u < limit) return a + (u % n);
        }
    }

    get_state() {
        return PRNG._validate_state(this.state);
    }

    set_state(state) {
        // Validate before committing, preserving the old state on failure.
        this.state = PRNG._validate_state(state);
    }
}
