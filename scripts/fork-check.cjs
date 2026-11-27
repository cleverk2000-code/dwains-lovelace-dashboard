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
  ['header icon bottom align source', src('dwains-house-information-card.js'), /align-items: flex-end;[\s\S]{0,170}padding-bottom: 7px;/],
  ['header icon bottom align deployed', bundle, /align-items: flex-end;[\s\S]{0,170}padding-bottom: 7px;/],
  ['away icon uses matching wrapper', src('dwains-house-information-card.js'), /<div class="">\s*<ha-icon class="w-8 h-8 badge-icon" style="color: var\(--warning-color/],
  ['away badge source strict on', src('dwains-house-information-card.js'), /states\?\.\['input_boolean\.away_active'\]\?\.state !== 'on'/],
  ['away badge source after persons', src('dwains-house-information-card.js'), /\$\{this\.persons\.map\([\s\S]{0,100}\}\s*\$\{this\._renderAwayStatusCard\(\)\}\s*\$\{Object\.values\(this\.domains\)/],
  ['away badge deploy strict on', bundle, /"on"===this\._hass\?\.states\?\.\["input_boolean\.away_active"\]\?\.state/],
  ['away badge deploy after persons', bundle, /\$\{this\.persons\.map\([\s\S]{0,90}\}\s*\$\{this\._renderAwayStatusCard\(\)\}\s*\$\{Object\.values\(this\.domains\)/],
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
  ['heating off gray matches presence off', bundle, /const l=o\?[\s\S]{0,140}:"#A3A7AD"/],
  ['no numeric legacy motion badge', bundle, /if\(\["motion","occupancy","presence","moving"\]\.includes\(i\)\)return""/],
  ['hallway motion entity', bundle, /binary_sensor\.bogdo_bogdomosyeonsenseo_motion/],
];
for (const [label, content] of [['source', src('dwains-homepage-card.js')], ['bundle', bundle]]) {
  tests.push(
    ['AQI numeric badge '+label, content, /room-aqi-badge[\s\S]{0,300}aria-label=\$\{\x60AQI \$\{ddAqiValue\}\x60\}>\$\{ddAqiValue\}/],
    ['AQI directly paired with fan '+label, content, /domain === 'fan' && ddAqiValue !== null[\s\S]{0,180}room-fan-aqi-pair[^>]*>\$\{badge\}\$\{ddAqiBadge\}/],
    ['AQI equal fan row geometry '+label, content, /\.room-fan-aqi-pair\s*\{[\s\S]{0,160}grid-auto-rows: 1fr/],
  );
}
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
for (const [label, content] of [['source', src('dwains-homepage-card.js')], ['bundle', bundle]]) {
  try {
    const methods = content.match(/_roomAqiValue\(ids\) \{[\s\S]*?\n    _roomAqiColor\(value\) \{[\s\S]*?\n    \}/)?.[0];
    if (!methods) throw Error('AQI methods missing');
    const obj = vm.runInNewContext('({' + methods.replace(/\n\s*_roomAqiColor/, ', _roomAqiColor') + '})');
    const mk = (state, extra={}) => ({state, attributes:{device_class:'aqi',...extra}});
    obj._hass = {states:{
      'sensor.zero':mk('0'), 'sensor.low':mk('44'), 'sensor.high':mk('55'),
      'sensor.invalid':mk('unknown'), 'sensor.offline':mk('unavailable'),
      'sensor.empty':mk(' '), 'sensor.nan':mk('NaN'), 'sensor.inf':mk('Infinity'),
      'sensor.negative':mk('-1'), 'sensor.pm':mk('200',{device_class:'pm25'}),
      'sensor.summary':mk('300',{valid_sources:4,total_sources:4}),
      'fan.test':mk('400')
    }};
    const assert = require('node:assert/strict');
    assert.equal(obj._roomAqiValue(['sensor.zero']),0);
    assert.equal(obj._roomAqiValue(['sensor.low','sensor.high','sensor.summary','fan.test']),55);
    assert.equal(obj._roomAqiValue(['sensor.invalid','sensor.offline','sensor.empty','sensor.nan','sensor.inf','sensor.negative','sensor.pm','sensor.missing']),null);
    assert.equal(obj._roomAqiValue([]),null);
    assert.deepEqual([0,50,51,100,101,150,151,200,201,300,301,500].map(v=>obj._roomAqiColor(v)),
      ['#22c55e','#22c55e','#facc15','#facc15','#fb923c','#fb923c','#ef4444','#ef4444','#a855f7','#a855f7','#a52a46','#a52a46']);
    console.log('OK  AQI behavior '+label);
  } catch(e) { console.error('FAIL AQI behavior '+label+': '+e.message); errors++; }
}
if (errors) { console.error(errors + ' failed checks'); process.exitCode = 1; }
else console.log('All ' + (tests.length + 2) + ' static checks passed. Verify in Home Assistant.');
