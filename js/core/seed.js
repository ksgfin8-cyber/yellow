// Derivación determinista de semillas.
// Contrato: js/core/seed.js según WORLD-LAB v0.2.5 §11.6.

function derive_seed(base_seed, namespace) {
    if (!Number.isInteger(base_seed) || base_seed < 1 || base_seed > 0xFFFFFFFF) {
        throw new ContractError("derive_seed: base_seed must be a nonzero uint32");
    }
    if (typeof namespace !== "string") {
        throw new ContractError("derive_seed: namespace must be a Unicode string");
    }

    const material = String(base_seed) + ":" + namespace;
    const hash = fnv1a(material);

    // El PRNG no admite estado 0. Si el hash es 0, forzar a 1.
    // WORLD-LAB v0.2.5 §11.6.
    return hash === 0 ? 1 : hash;
}
