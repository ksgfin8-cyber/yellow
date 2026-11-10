// F3-D PARTIAL: §34's incorporated WLS1 layout and V1 are unavailable.
// Fail explicitly; textual serialization is not a canonical hash implementation.
// Restore these operations only with authentic WLS1 bytes and verified vectors.
function serialize_world_state(state, include_rng) {
    throw new ContractError("recording failed");
}

function STATE_HASH_WORLD(state) {
    throw new ContractError("recording failed");
}

function STATE_HASH_FULL(state) {
    throw new ContractError("recording failed");
}
