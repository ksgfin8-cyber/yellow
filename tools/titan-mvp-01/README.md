# TITAN-MVP-01 — isolated G1 development harness

Read the approved seven-file dossier in `docs/research/titan-mvp-01/`, then DEVELOPMENT_PROTOCOL.md and IMPLEMENTATION_REPORT.md. This is one experimental operationalization, not full TITAN/TN-LAB conformity. Scientific evaluation2001–2012 (120episodes) is HOLD and has no execution entry here.

```bash
node --test tests/titan-mvp-01.test.cjs
node tools/titan-mvp-01/cli.cjs plan
node tools/titan-mvp-01/cli.cjs check docs/research/titan-mvp-01/DEVELOPMENT_CANDIDATE.json
```

The classic agent file is mounted only by this VM loader. `createAgentFactory` supplies `TitanMVP01Agent` to existing `run_experiment(config,factory)`; old registry, browser/index, WORLD and existing agents are unchanged. All five controllers keep entity0987898. TITAN does not receive a seed/world; experiment/agent seeds remain provenance outside the subject. Four exposed feedback flags and radius1 are mandatory before starting an experiment.

The pure selector uses fixed M_N/E/S/W IDs, finite nonnegative costs and explicit priority N/E/S/W/NULL. The adapter uses only cardinal representations and episode-local visited/consumed sets. Diagnostics are copied after the returned action into an external sidecar. They are not Action/ExperimentConfig/Trajectory extensions and cannot guide the policy. Silent mode suppresses collection, not the agent's internal diagnostic calculation.

`smoke <candidate> <new-absolute-directory>` is development-only (seeds1–4),12fixed attempts with explicitly chosen limits. The delivered smoke already ran; do not treat these commands as authorization for another campaign. See protocol for external child timeout, heap/quota and limitations of total-time admission/RSS observation. The runner expects trusted code, not hostile plugins.

`verify <copied-smoke-directory>` checks transport hashes and replays recorded traces/agent decisions with the same engine; it executes technical reproduction, not a scientific evaluation. It may take significant CPU time. Source identity must match the delivered candidate; use a fresh output for any analysis. Files and recovery commands are in docs/research/titan-mvp-01/RECOVERY.md.

The archive format is operational gzip/codec with SHA-256 framing, distinct from WLS1. Episode data include canonical ExperimentResult, configuration, seed namespaces, decision sidecar and actual WORLD/FULL state bytes. Host resources/UUID/time stay outside scientific records. TIMEOUT/WORKER_ERROR records retain diagnostics without inventing a trajectory; an abrupt controller failure may leave an unsealed directory. No global crash transaction or independent interoperability is claimed.
