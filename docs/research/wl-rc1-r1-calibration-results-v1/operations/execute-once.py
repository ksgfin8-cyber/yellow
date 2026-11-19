from pathlib import Path
import json, subprocess, datetime, time

repo = Path('/workspace/yellow')
ops = Path('/workspace/shared/world-lab/wl-rc1/calibration-r1-v1-ops')
auth = Path('/workspace/shared/world-lab/wl-rc1/authorization-r1-cal-public-zjwza7y2')
destination = Path('/workspace/shared/world-lab/wl-rc1/calibration-r1-v1')
freeze = '6763348852b6b4a133a3e6326e8e774d25b6244703457282035d41601b66fa90'
key = '3e65dff25d532c34504a2ddd317f85d8f66b0ba066277ffe634463380f521b5e'
def now(): return datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=-5))).isoformat()
assert not destination.exists(), 'Existing destination: do not retry/resume'
assert not (ops/'launch-intent.json').exists(), 'One invocation only'
assert not subprocess.check_output(['git', 'status', '--porcelain'], cwd=repo)
arguments = [str(repo/'docs/research/wl-rc1-r1-calibration/CANDIDATE.json'), str(auth/'authorization.json'), str(auth/'authorization.sig'), str(auth/'public.pem'), freeze, key]
prefix = ['node', '--max-old-space-size=512', 'tools/research/wl-rc1-r1-calibration/cli.cjs']
preflight = subprocess.run(prefix+['preflight']+arguments, cwd=repo, capture_output=True)
(ops/'preflight.stdout.json').write_bytes(preflight.stdout)
(ops/'preflight.stderr.txt').write_bytes(preflight.stderr)
assert preflight.returncode == 0, preflight.stderr.decode()
p = json.loads(preflight.stdout)
assert p == {'signature':'VALID', 'freeze_id':freeze, 'output_directory':str(destination), 'workers_started':0, 'calibration_started':False}
print('SIGNED_PREFLIGHT_REVALIDATED: '+json.dumps(p), flush=True)
command = prefix+['run-calibration']+arguments
intent = {'campaign':'WL-RC1-R1-CALIBRATION-1', 'issued_at':now(), 'command':command, 'run_invocations':1, 'retries_authorized':False, 'checkout':subprocess.check_output(['git','rev-parse','HEAD'],cwd=repo,text=True).strip()}
with (ops/'launch-intent.json').open('x') as f: json.dump(intent,f,indent=2); f.write('\n')
t = time.monotonic_ns()
with (ops/'controller.stdout.json').open('xb') as out, (ops/'controller.stderr.txt').open('xb') as err:
    process = subprocess.Popen(command, cwd=repo, stdout=out, stderr=err, start_new_session=True)
    (ops/'start.json').write_text(json.dumps({'pid':process.pid, 'started_at':now(), 'monotonic_ns':str(t)},indent=2)+'\n')
    print('ONE_CALIBRATION_INVOCATION_STARTED pid='+str(process.pid), flush=True)
    code = process.wait()
record = {'exit_code':code, 'finished_at':now(), 'controller_wall_ns':str(time.monotonic_ns()-t), 'retries':0}
(ops/'exit.json').write_text(json.dumps(record,indent=2)+'\n')
print('CONTROLLER_EXIT: '+json.dumps(record), flush=True)
print((ops/'controller.stdout.json').read_text(), flush=True)
print('STDERR: '+(ops/'controller.stderr.txt').read_text(), flush=True)
