# P01 operational execution (F6-B)

Development only. This tool does not authorize evaluation1001–1032, canonical
conformance, or independent interoperability. The existing engine and baselines
are loaded unchanged from the HTML runtime order; FrontierMemory is injected
through the existing factory. [Preregistered protocol](../../docs/F6-A-pilot-protocol.md).

From repository root, Node24 and Git, no npm dependencies:

```bash
node tools/p01/cli.cjs episode 1 wait /tmp/episode.wlx.gz
node tools/p01/cli.cjs verify /tmp/episode.wlx.gz
node tools/p01/cli.cjs smoke /tmp/p01-smoke-new
node tools/p01/cli.cjs analyze /tmp/p01-smoke-new
node tools/p01/cli.cjs freeze /tmp/p01-smoke-new /tmp/p01-freeze-candidate.json
node tools/p01/cli.cjs check-freeze /tmp/p01-freeze-candidate.json
node tests/f6-b-smoke.cjs /tmp/p01-smoke-new /tmp/p01-freeze-candidate.json
```

Output paths must be new/empty. Files are never silently overwritten. `smoke`
launches seeds1–4, agents wait/random/rule/frontier_memory_v1, repetitions1 then2,
sequentially. It includes16 reruns for determinism in addition to16 primary smoke
episodes; these are not32 independent scenarios. No evaluation command exists;
parent and worker reject final seeds before generation. No automatic resume or
protocol tuning. Freeze requires a clean implementation checkout and outputs
outside the repository. A candidate has approved=false and cannot unlock evaluation.

Each episode runs in its own child with30s timeout and512MiB V8 heap. Controller
START_REQUEST/FINISH records, wall/CPU/maxRSS, output and errors are operational.
The parent kills a nonreturning step without manufacturing a WORLD death or an
ExperimentResult. On kill, CPU may be unavailable (null); /proc RSS sampling is a
lower bound, explicitly identified. V8 heap is not a cap on total RSS. These
processes are not an OS security sandbox for hostile plugins. Only trusted fixed
P01 agents are available. Replay verification is separate trusted bounded work,
not another call into an arbitrary agent.

`WL-P01-ARCHIVE-1` is gzip JSON with canonical typed encoding around the existing
conformance/wire.cjs. Map keys are strings (the actual state-map domain), BigInt,
binary64 -0/subnormals and byte arrays are retained. Uint8Array bytes may decode
as Node Buffer: byte identity, not JS container prototype, is the contract.
Unpacked JSON is limited to64MiB as an operational file bound. Maps with duplicate
keys, unknown tags/fields, invalid state shapes, inconsistent config/seeds and bad
checksums are rejected. Checksums detect damage, not historical authenticity.

`readArchive` checks framing, types and structure/provenance consistency.
`verifyArtifact` additionally checks current source hashes, regenerates the supplied
initial seed with the existing engine, invokes existing replay/validation, compares
records and WLS1 bytes. This is same-engine replay, not independent implementation.
An archived plain WorldState is reconstructed by existing runtime constructors;
no original object instance is needed. Source changes require the corresponding
checkout; hot reload is unsupported. The source set is fixed across a campaign.

The canonical data payload is separate from host times, IDs, limits and resources.
Repetition compares full typed data, and initial worlds compare structure and WLS1
bytes, not FNV equality alone. Operational failures carry canonical result=null.
A legitimate agent failure may have its real partial trajectory; its external cause
is not certified by replay. No fictitious partial history is exported after a kill.

Campaign artifacts, execution.jsonl, campaign.json and analysis.json preserve every
attempt. Pure metrics implement only P01; a common initialization failure can be
excluded without replacement, but any other failure/missing/changed repetition
makes the campaign NOT_EVALUABLE. Development differences are descriptive only;
no final hypothesis is declared, and a negative difference is not a technical fail.

The freeze candidate fixes source hashes, engine/implementation commits, baselines,
agent parameters, protocol/config/seed lists, operational format/budgets, metrics,
inclusion rules and acceptance tests. It references smoke evidence hashes, without
a self hash cycle. Future evaluation needs a new explicit order and controlled
execution entry; flipping a JSON approval flag is insufficient.
