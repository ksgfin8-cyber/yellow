'use strict';
const path = require('node:path'), { journal } = require('../../../tools/research/wl-rc1-r1/journal.cjs');
process.once('message', r => {
  if (r.control === 'hang') {
    const j = journal(path.join(r.data_directory, `${String(r.index).padStart(3, '0')}.stage.jsonl`));
    j.sync('PREPARE', 'synthetic', () => { while (true) {} });
  } else process.send({ type: 'header', format: 'WL-RC1-RAW-1', revision: 'R1-CAL-1.0.0',
    freeze_id: r.freeze_id, condition: r.condition,
    units: { time: 'ns_decimal_string', cpu: 'microseconds', memory: 'bytes' } },
  () => process.send({ type: 'done', ipc_work_ns: [] }, () => process.disconnect()));
});
