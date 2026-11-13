# P01 final evaluation — preparation only (F6-E E1/E2)

No final episode is authorized by this delivery. Review the new freeze proposal,
complete E2 diff, tests and development evidence before giving specific approval.
Do not run `run` during preparation. The old development CLI/worker still reject
1001–1032. Constructing a config or listing the 256 requests generates no world.

The separate evaluator reuses F6-B runtime, supervisor, provenance, archive and
metrics. Two frozen operational files require explicit refreezing:

- `archive.cjs`: a local `archiveFor(profile)` closure, with unchanged default
  development checks, transport/schema, validation and replay. No global patching.
- `metrics.cjs`: an explicit final phase selects the 32 seed labels and scales
  completeness to256 attempts. Counting, pairing, inclusion and statistical
  definitions remain identical; `measure` is unchanged. Pure calculations do not
  certify authorization. Synthetic tests are not experimental observations.

No algorithm, protocol, motor, PRNG, physics, Recorder, Replay or WLS1 change.
The previous candidate and all evidence stay intact. The replacement candidate
requires a new clean-code development smoke and approval of its new identity.
The evaluation proposal additionally binds the evaluator sources/tests, actual
smoke bytes, Node binary/version/platform, and the old candidate SHA256.

Preparation commands (no final episodes):

```bash
node tools/p01/evaluation/cli.cjs prepare docs/f6-e/P01-freeze-candidate.json docs/f6-e/smoke /tmp/P01-evaluation-freeze.json
node tools/p01/evaluation/cli.cjs check /tmp/P01-evaluation-freeze.json
node tests/f6-e-gate.cjs /tmp/P01-evaluation-freeze.json
```

`prepare` only works once evaluator sources/tests are committed and match the
candidate code commit. Documentation may be added afterward without a self hash.
`check` hashes every bound file and checks Git blobs and runtime identity. It does
not issue approval or generate episodes. Candidate booleans remain false.

## Specific approval, required before launch

The project owner must approve **the exact freeze ID and reviewer public-key
fingerprint**, through the external approval channel, after reviewing this delivery.
No trusted signing key or production approval is created by F6-E preparation.
Private keys must remain with the reviewer; never put them in this repository.
A key read from the receipt or proposal is not its own trust anchor. At launch,
pass the two approved pins explicitly, from the owner's approval, not by computing
them from untrusted input and assuming approval. This authenticates possession of
the approved key; it does not independently establish a person's civil identity.
It does not defend against an operator rewriting the tool or lying about the pins.

Receipt exact schema, signed as raw UTF-8 bytes with the prefix
`WL-P01-AUTHORIZATION-1\n` (actual LF), using Ed25519:

```json
{
  "format": "WL-P01-AUTHORIZATION-1",
  "decision": "AUTHORIZE_P01_FINAL_EVALUATION",
  "freeze_id": "<exact reviewed SHA256 identity>",
  "reviewer": "<responsible reviewer>",
  "approval_reference": "<specific approval message/record reference>",
  "campaign_id": "<reviewed unique campaign ID>",
  "output_directory": "<reviewed absolute NEW output directory>"
}
```

Public-key fingerprint = SHA256 of the Ed25519 public key exported as DER SPKI.
Signature file = raw64-byte signature, not base64 text. Unknown fields, Boolean
approvals, a wrong key, missing pins, altered receipt, altered sources/evidence,
wrong runtime or a different freeze identity fail closed. The output directory is
signed and must not already exist, including an empty directory; no silent resume,
replacement or rerun after inspecting outcomes. Parent directory must exist and resolve outside the repository, to preserve clean provenance.

After **specific** authorization only, an operator may use:

```bash
node tools/p01/evaluation/cli.cjs preflight <proposal> <receipt> <signature> <public-key> <APPROVED_FREEZE_ID> <APPROVED_PUBLIC_KEY_SHA256>
# RUN IS NOT AUTHORIZED BY THE PREPARATION ORDER
node tools/p01/evaluation/cli.cjs run <proposal> <receipt> <signature> <public-key> <APPROVED_FREEZE_ID> <APPROVED_PUBLIC_KEY_SHA256>
```

No config/seed/budget override is accepted. The parent and every child verify the
proposal and signature before any runtime execution. Worker heap must be512MiB;
parent uses the existing30s supervisor. Source/authorization drift stops launching
new episodes. Fixed order:1001–1032, wait/random/rule/frontier_memory_v1,1 then2.

Each attempted execution logs START/FINISH and preserves an operational raw typed
return **before** archive validation/replay. `*.raw.gz` uses the existing wire codec
with format WL-P01-RAW-ATTEMPT-1; it is a recovery record, not a canonical trajectory.
Failures before a return get a separate diagnostic record. A normal canonical
archive reuses WL-P01-ARCHIVE-1 with the explicit evaluation profile. No timeout is
converted into a WORLD event or fabricated ExperimentResult. Storage failure stops
new launches; an abrupt controller/host loss may leave a START without FINISH and
requires review, not an automatic retry. Authorization material is copied externally
to canonical schemas. Provenance retains source hashes and host resource metadata.

The prepared loop writes every attempted row; any failure makes the technical
analysis NOT_EVALUABLE. A negative paired effect remains technically acceptable.
This is readiness tooling, not an E3/E4/E5 result or independent interoperability.
