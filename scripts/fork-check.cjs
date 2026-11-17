'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..', 'custom_components', 'dwains_dashboard');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const bundle = read('js/dwains-dashboard.js');
const src = (p) => read('js/src/' + p);
const bytes = Buffer.from(bundle);
const revision = crypto.createHash('sha1').update('blob ' + bytes.length + '\0').update(bytes).digest('hex').slice(0, 8);
const constPath = path.join(root, 'const.py');
const mode = process.argv[2] || 'verify';
if (mode === 'stamp') {
  const old = read('const.py');
  const next = old.replace(/(FRONTEND_ASSET_REVISION\s*=\s*")[^"]+(")/, (_, a, b) => a + revision + b);
  if (!next.includes('FRONTEND_ASSET_REVISION = "' + revision + '"')) throw Error('revision stamp failed');
  if (next !== old) fs.writeFileSync(constPath, next);
} else if (mode !== 'verify') {
  console.error('Usage: node scripts/fork-check.cjs verify|stamp');
  process.exit(2);
}
const tests = [
  ['climate setpoint source', src('entity-aggregation.js'), /const hasTarget\s*=/],
  ['climate setpoint deploy', bundle, /Number\.isFinite\(Number\(o\)\)/],
  ['heating/humidifier badges source', src('dwains-homepage-card.js'), /room-device-badge/],
  ['heating/humidifier badges deploy', bundle, /room-device-badge/],
  ['full Korean translations', bundle, /ko:\{"global"/],
  ['forced Korean language', bundle, /const n="ko",s="ko"/],
  ['hidden room counting', src('dwains-homepage-card.js'), /areaEntities\.add\(entity\.entity_id\)/],
  ['editor labels', src('dwains-edit-entity-card.js'), /slot="label"/],
  ['motion on-off badge source', src('dwains-homepage-card.js'), /room-motion-badge/],
  ['motion on-off badge deploy', bundle, /room-motion-badge/],
  ['motion registry inclusion', src('dwains-homepage-card.js'), /ddMotionIds/],
  ['motion state colors', bundle, /ddMotionActive\?"#22c55e":"#A3A7AD"/],
  ['motion visual scaled inside existing 24px tile', bundle, /transform: scale\(0\.83\)/],
  ['presence badge placed after other domains', bundle, /\$\{d\.R9\.map[\s\S]*\$\{ddMotionEntities\.length\?n\.qy/],
  ['heating off gray matches presence off', bundle, /:#A3A7AD/],
  ['no numeric legacy motion badge', bundle, /if\(\["motion","occupancy","presence","moving"\]\.includes\(i\)\)return""/],
  ['hallway motion entity', bundle, /binary_sensor\.bogdo_bogdomosyeonsenseo_motion/],
];
let errors = 0;
for (const [name, content, re] of tests) {
  const ok = re.test(content);
  console.log((ok ? 'OK  ' : 'FAIL  ') + name);
  if (!ok) errors++;
}
const actual = read('const.py').match(/FRONTEND_ASSET_REVISION\s*=\s*"([^"]+)"/)?.[1];
if (actual !== revision) {
  console.error('FAIL revision: ' + actual + ', expected ' + revision + '; run stamp');
  errors++;
} else console.log('OK  frontend revision ' + revision);
try { new vm.Script(bundle); console.log('OK  bundle JavaScript syntax'); }
catch (e) { console.error('FAIL bundle JavaScript syntax: ' + e.message); errors++; }
if (errors) { console.error(errors + ' failed checks'); process.exitCode = 1; }
else console.log('All ' + (tests.length + 2) + ' static checks passed. Verify in Home Assistant.');
