// Derivación determinista de semillas.
// Contrato: js/core/seed.js según especificación §6.

function derive_seed(base_seed, namespace) {
    if (!Number.isInteger(base_seed)) {
        throw new Error("derive_seed: base_seed must be an integer");
    }
    if (typeof namespace !== "string" || namespace.length === 0) {
        throw new Error("derive_seed: namespace must be a non-empty string");
    }

    const material = String(base_seed) + ":" + namespace;
    const hash = fnv1a(material);

    // El PRNG no admite estado 0. Si el hash es 0, forzar a 1.
    // Corrección obligatoria según especificación §6.2.
    return hash === 0 ? 1 : hash;
}
