// Shared contractual errors; load before prng/hash/seed.
class ContractError extends Error {
    constructor(message) {
        super(message);
        this.name = "ContractError";
    }
}

// §6.4: Number values only, without conversion or rounding.
function canonicalize_binary64(value) {
    if (!Number.isFinite(value)) throw new ContractError("non-finite binary64");
    return value === 0 ? 0 : value;
}

// Structural records have own data fields; accessors are not contract data.
function has_exact_fields(value, fields) {
    if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
    const keys = Reflect.ownKeys(value);
    return keys.length === fields.length && fields.every(key => {
        const d = Object.getOwnPropertyDescriptor(value, key);
        return d !== undefined && Object.hasOwn(d, "value");
    });
}
function is_uint32(value) {
    return Number.isInteger(value) && value >= 0 && value <= 0xFFFFFFFF;
}
function is_uint64(value) {
    return (typeof value === "bigint" && value >= 0n && value <= 0xFFFFFFFFFFFFFFFFn) ||
        (Number.isSafeInteger(value) && value >= 0);
}

// v0.2.6 D-01-E: exact representation for newly emitted temporal values.
function represent_uint64(value) {
    if (!is_uint64(value)) throw new ContractError("invalid initial_state");
    return BigInt(value) <= BigInt(Number.MAX_SAFE_INTEGER) ? Number(value) : BigInt(value);
}
