const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('=== P1-6 REGRESSION SUITE: WEIGHT LABELS + CALENDAR STATUS ===');

let failCount = 0;
function check(label, passed) {
  console.log(label + ':', passed ? '✓ PASSED' : 'FAILED');
  if (!passed) failCount++;
}

const appJsContent = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8');

function extractFunctionSource(src, name) {
  const startIdx = src.indexOf(`function ${name}(`);
  if (startIdx === -1) return null;
  let depth = 0;
  let i = src.indexOf('{', startIdx);
  for (; i < src.length; i++) {
    if (src[i] === '{') depth++;
    if (src[i] === '}') {
      depth--;
      if (depth === 0) return src.slice(startIdx, i + 1);
    }
  }
  return null;
}

console.log('\n--- 1. Weight chart labels preserve kilogram values ---');
const weightFormatterSource = extractFunctionSource(appJsContent, 'formatWeightChartLabel');
check('Weight label formatter exists', !!weightFormatterSource);

if (weightFormatterSource) {
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(`${weightFormatterSource}\nthis.formatWeightChartLabel = formatWeightChartLabel;`, sandbox);
  check('76.5 is rendered without a thousands suffix', sandbox.formatWeightChartLabel(76.5) === '76.5');
  check('75 is rendered without a trailing decimal or suffix', sandbox.formatWeightChartLabel(75) === '75');
}

check(
  'SVG point labels call the weight formatter and do not append k',
  appJsContent.includes('${formatWeightChartLabel(p.weight)}</text>') &&
    !appJsContent.includes('${p.weight}k</text>')
);

console.log('\n--- 2. Calendar status distinguishes future and canonical completion data ---');
const completionLevelSource = extractFunctionSource(appJsContent, 'getHabitCompletionLevel');
const calendarStatusSource = extractFunctionSource(appJsContent, 'getCalendarDayStatus');
check('Calendar day-status helper exists', !!calendarStatusSource);

if (completionLevelSource && calendarStatusSource) {
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(
    `${completionLevelSource}\n${calendarStatusSource}\nthis.getCalendarDayStatus = getCalendarDayStatus;`,
    sandbox
  );

  const habits = [
    { completions: [], completionRecords: [{ localDate: '2026-08-10', completionLevel: 'ideal' }] },
    { completions: [], completionRecords: [] },
  ];

  check(
    'Future dates are neutral',
    sandbox.getCalendarDayStatus('2026-08-11', '2026-08-10', habits) === ''
  );
  check(
    'Today reads canonical completion records as Partial',
    sandbox.getCalendarDayStatus('2026-08-10', '2026-08-10', habits) === 'cal-some'
  );
  check(
    'A weight/food/review activity without a completed habit is still Partial',
    sandbox.getCalendarDayStatus('2026-08-10', '2026-08-10', [{ completions: [], completionRecords: [] }], true) === 'cal-some'
  );
  check(
    'A completed past day is Complete',
    sandbox.getCalendarDayStatus(
      '2026-08-09',
      '2026-08-10',
      [
        { completions: ['2026-08-09'], completionRecords: [] },
        { completions: ['2026-08-09'], completionRecords: [] },
      ]
    ) === 'cal-all'
  );
  check(
    'An elapsed day with no completions remains None',
    sandbox.getCalendarDayStatus('2026-08-09', '2026-08-10', habits) === 'cal-none'
  );
}

check(
  'Calendar renderer uses the shared day-status helper',
  appJsContent.includes('const colorClass = getCalendarDayStatus(dateStr, todayStr, state.habits, hasTrackedActivity);')
);

if (failCount > 0) {
  console.error(`\n${failCount} regression check(s) failed.`);
  process.exit(1);
}

console.log('\n=== ALL P1-6 REGRESSION CHECKS PASSED ===');
