"""Prepare a NEW external workspace; does not run agents, episodes or replay.

Usage: python3 prepare.py /path/to/yellow /new/external/directory
"""
import datetime
import hashlib
import json
from pathlib import Path
import shutil
import subprocess
import sys

repo, out = Path(sys.argv[1]).resolve(), Path(sys.argv[2]).resolve()
support = Path(__file__).resolve().parent
base = '5d40f08fbb36c5bbe075628a5b9a9078ce9c017c'
assert out != repo and repo not in out.parents, 'Output must be outside the repository'
assert not out.exists(), 'Refuse to overwrite an existing workspace'
assert not subprocess.check_output(['git', 'status', '--porcelain'], cwd=repo), 'Use a clean checkout'
out.mkdir(parents=True)
(out / 'source').mkdir()
archive = out / 'source.tar'
with archive.open('wb') as stream:
    subprocess.run(['git', 'archive', base], cwd=repo, stdout=stream, check=True)
subprocess.run(['tar', '-xf', str(archive), '-C', str(out / 'source')], check=True)
for name in ['protocol.json', 'harness.cjs', 'analyze.cjs', 'analyze-v1.cjs', 'verify.py', 'prepare.py']:
    shutil.copyfile(support / name, out / name)
sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
source = {}
for record in subprocess.check_output(['git', 'ls-tree', '-rz', base], cwd=repo).split(b'\0'):
    if not record:
        continue
    meta, name = record.split(b'\t')
    _, kind, oid = meta.split()
    assert kind == b'blob'
    name = name.decode()
    data = (out / 'source' / name).read_bytes()
    assert hashlib.sha1(b'blob ' + str(len(data)).encode() + b'\0' + data).hexdigest() == oid.decode()
    source[name] = sha(out / 'source' / name)
assert sha(out / 'source/docs/program/RDL-PB-001_v0.1_original_propuesta.md') == '84019bd0c70206d9f90ec219d4fefbc1eb58041ba1762818687ae8a983317436'
record = {'utc': datetime.datetime.now(datetime.timezone.utc).isoformat(), 'purpose': 'NEW_R01_V1_REPRODUCTION_WORKSPACE',
    'protocol_commit': subprocess.check_output(['git', 'rev-parse', '283353e'], cwd=repo, text=True).strip(),
    'instrument_commit': subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=repo, text=True).strip(),
    'source_commit': base, 'source_files_verified': len(source), 'source_hashes': source,
    'repository_hashes_before': {n: sha(repo / n) for n in subprocess.check_output(['git', 'ls-files'], cwd=repo, text=True).splitlines()},
    'instrument_hashes': {n: sha(out / n) for n in ['protocol.json', 'harness.cjs', 'analyze.cjs']},
    'original_analysis_v1_sha256': sha(out / 'analyze-v1.cjs'), 'execution_attempts_before': 0}
(out / 'pre-execution.json').write_text(json.dumps(record, indent=2) + '\n')
print(json.dumps({'status': 'PREPARED_NO_EPISODES', 'directory': str(out), 'source_files_verified': len(source)}))
