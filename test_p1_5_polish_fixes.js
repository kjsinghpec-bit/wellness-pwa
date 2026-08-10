const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('=== P1-5 REGRESSION SUITE: TIMER COMPLETION TEXT + HABIT REMOVE TAP TARGET ===');

let failCount = 0;
function check(label, passed) {
  console.log(label + ':', passed ? '✓ PASSED' : 'FAILED');
  if (!passed) failCount++;
}

const appJsPath = path.join(__dirname, 'app.js');
const htmlPath = path.join(__dirname, 'index.html');
const cssPath = path.join(__dirname, 'styles.css');
const appJsContent = fs.readFileSync(appJsPath, 'utf8');
const htmlContent = fs.readFileSync(htmlPath, 'utf8');
const cssContent = fs.readFileSync(cssPath, 'utf8');

// ---------------------------------------------------------------------------
// 1. Timer "ideal completion" text bug - underlying state machine unchanged
// ---------------------------------------------------------------------------
console.log('\n--- 1. Timer Completion Logic Untouched ---');

check(
  'Elapsed-timer state transition still sets completed_minimum (state machine unchanged)',
  appJsContent.includes("timerState.state = 'completed_minimum';")
);
check(
  'Completion recording still uses timerState.targetLevel (recorded level unchanged)',
  appJsContent.includes("toggleHabitCompletion(timerState.habitId, timerState.startDate, timerState.targetLevel || 'minimum');")
);
check(
  'continueToIdealTimer() still starts a fresh ideal-level timer (unchanged)',
  appJsContent.includes("startActivationTimer(habit.id, 'ideal');")
);

console.log('\n--- 2. Timer Completion Text Now Reflects the Actual Target Level ---');

check(
  'applyTimerCompletionText() helper is defined',
  /function applyTimerCompletionText\(targetLevel\)/.test(appJsContent)
);
check(
  'Helper is invoked when timer elapses (updateTimerTick)',
  (appJsContent.match(/applyTimerCompletionText\(timerState\.targetLevel\)/g) || []).length >= 2
);
check(
  'index.html exposes ids for the dynamic completion text',
  htmlContent.includes('id="timer-confirm-title"') &&
  htmlContent.includes('id="timer-options-title"') &&
  htmlContent.includes('id="timer-options-subtitle"')
);

// Execute the real helper (not a re-implementation) against a minimal fake DOM
// to prove the displayed text is correct for both target levels.
function makeFakeEl() {
  return { _text: '', style: {}, set textContent(v) { this._text = v; }, get textContent() { return this._text; } };
}

function extractFunctionSource(src, name) {
  const startIdx = src.indexOf(`function ${name}(`);
  if (startIdx === -1) throw new Error(`${name} not found`);
  let depth = 0;
  let i = src.indexOf('{', startIdx);
  const bodyStart = i;
  for (; i < src.length; i++) {
    if (src[i] === '{') depth++;
    if (src[i] === '}') { depth--; if (depth === 0) { i++; break; } }
  }
  return src.slice(startIdx, i);
}

const fnSource = extractFunctionSource(appJsContent, 'applyTimerCompletionText');

function runWithFakeDom(targetLevel) {
  const els = {
    'timer-confirm-title': makeFakeEl(),
    'timer-yes-done-btn': makeFakeEl(),
    'timer-options-title': makeFakeEl(),
    'timer-options-subtitle': makeFakeEl(),
    'timer-continue-btn': makeFakeEl(),
  };
  const sandbox = {
    document: { getElementById: (id) => els[id] || null },
    console,
  };
  vm.createContext(sandbox);
  vm.runInContext(`${fnSource}\napplyTimerCompletionText(${JSON.stringify(targetLevel)});`, sandbox);
  return els;
}

const minEls = runWithFakeDom('minimum');
check('Minimum completion title text correct', minEls['timer-confirm-title'].textContent === 'Minimum time reached');
check('Minimum completion button text correct', minEls['timer-yes-done-btn'].textContent === 'Yes, minimum done');
check('Minimum options title text correct', minEls['timer-options-title'].textContent === 'Minimum complete ✓');
check('Minimum "Continue toward ideal" button stays visible', minEls['timer-continue-btn'].style.display === 'flex');

const idealEls = runWithFakeDom('ideal');
check('Ideal completion title no longer says "Minimum"', idealEls['timer-confirm-title'].textContent === 'Ideal target reached');
check('Ideal completion button text no longer says "minimum done"', idealEls['timer-yes-done-btn'].textContent === 'Yes, ideal done');
check('Ideal options title no longer says "Minimum complete"', idealEls['timer-options-title'].textContent === 'Ideal complete ✓');
check(
  'Ideal completion hides the nonsensical "Continue toward ideal" option',
  idealEls['timer-continue-btn'].style.display === 'none'
);

// ---------------------------------------------------------------------------
// 3. Habit-card "Remove" control: 44x44 tap target, low emphasis preserved
// ---------------------------------------------------------------------------
console.log('\n--- 3. Habit Remove Button Tap Target ---');

check(
  'Habit card Remove button uses a dedicated habit-delete-btn class',
  appJsContent.includes('<button class="habit-delete-btn" data-delete-id="${habit.id}">Remove</button>')
);
check(
  'Click handler wired to the renamed class, still calls deleteHabit() directly (no new confirmation flow)',
  /card\.querySelector\('\.habit-delete-btn'\)\.addEventListener\('click', \(\) => \{\s*deleteHabit\(habit\.id\);\s*\}\);/.test(appJsContent)
);
check(
  'No confirm()/prompt() dialog was introduced around habit deletion',
  !/habit-delete-btn[\s\S]{0,120}confirm\(/.test(appJsContent)
);
check(
  'Food and Weight delete buttons still use the original shared .delete-btn class (scope not broadened)',
  appJsContent.includes('<button class="delete-btn" data-food-id="${item.id}">Delete</button>') &&
  appJsContent.includes('<button class="delete-btn" data-log-id="${log.id}">Delete</button>')
);

const habitDeleteRuleMatch = cssContent.match(/\.habit-delete-btn\s*\{([^}]*)\}/);
check('.habit-delete-btn CSS rule exists', !!habitDeleteRuleMatch);

if (habitDeleteRuleMatch) {
  const rule = habitDeleteRuleMatch[1];
  check('Tap target is at least 44px wide', /min-width:\s*44px/.test(rule));
  check('Tap target is at least 44px tall', /min-height:\s*44px/.test(rule));
  check('Background stays transparent (no visual prominence added)', /background:\s*transparent/.test(rule));
  check('No border added', /border:\s*none/.test(rule));

  const originalDeleteRuleMatch = cssContent.match(/\.delete-btn\s*\{([^}]*)\}/);
  const originalRule = originalDeleteRuleMatch ? originalDeleteRuleMatch[1] : '';
  const extractProp = (rule, prop) => (rule.match(new RegExp(prop + ':\\s*([^;]+);')) || [])[1];
  check(
    'Label color matches the original low-emphasis .delete-btn styling',
    extractProp(rule, 'color') === extractProp(originalRule, 'color')
  );
  check(
    'Font size matches the original low-emphasis .delete-btn styling',
    extractProp(rule, 'font-size') === extractProp(originalRule, 'font-size')
  );
}

// ---------------------------------------------------------------------------
// 4. Safety: nothing touched schemas/migrations/passcode/storage/service-worker
// ---------------------------------------------------------------------------
console.log('\n--- 4. Safety Invariants Preserved ---');

check('APP_SCHEMA_VERSION unchanged at 3', appJsContent.includes('APP_SCHEMA_VERSION = 3;'));
check(
  'Passcode hash constant unchanged',
  appJsContent.includes('const TARGET_PASSCODE_HASH = "434f4d14c1eb231306b51aaa160c021b63670ac6ca67fb8e403f4500983dd1e4";')
);
const swContent = fs.readFileSync(path.join(__dirname, 'sw.js'), 'utf8');
check('Service worker retains the existing network-first strategy with offline fallback',
  swContent.includes("fetch(event.request, { cache: 'no-cache' })") &&
  swContent.includes("caches.match(event.request)") &&
  swContent.includes("caches.match('./index.html')")
);
check('Service worker caches the current Askesis icon assets',
  swContent.includes("'./askesis-icon.svg'") &&
  swContent.includes("'./askesis-icon-192.png'") &&
  swContent.includes("'./askesis-icon-512.png'") &&
  swContent.includes("'./askesis-apple-touch-icon.png'")
);

if (failCount === 0) {
  console.log('\n=== ALL P1-5 POLISH-FIX REGRESSION SCENARIOS PASSED PERFECTLY ===');
} else {
  console.log(`\n=== ${failCount} P1-5 SCENARIO(S) FAILED ===`);
  process.exit(1);
}
