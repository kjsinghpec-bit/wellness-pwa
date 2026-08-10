const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('=== P1-7 REGRESSION SUITE: CALENDAR FUTURE-DATE GUARD ===');

let failures = 0;
function check(label, passed) {
  console.log(`${label}:`, passed ? '✓ PASSED' : 'FAILED');
  if (!passed) failures++;
}

const source = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8');

function extractFunction(name) {
  const start = source.indexOf(`function ${name}(`);
  if (start < 0) return null;
  let depth = 0;
  const bodyStart = source.indexOf('{', start);
  for (let i = bodyStart; i < source.length; i++) {
    if (source[i] === '{') depth++;
    if (source[i] === '}') {
      depth--;
      if (depth === 0) return source.slice(start, i + 1);
    }
  }
  return null;
}

class FakeElement {
  constructor() {
    this.children = [];
    this.listeners = {};
    this.style = {};
    this.className = '';
    this.textContent = '';
    this.value = '';
    this.max = '';
    this.attributes = {};
    this._innerHTML = '';
    this.classes = new Set();
    this.classList = {
      add: name => this.classes.add(name),
      remove: name => this.classes.delete(name),
      contains: name => this.classes.has(name)
    };
  }
  set innerHTML(value) {
    this._innerHTML = value;
    if (value === '') this.children = [];
  }
  get innerHTML() { return this._innerHTML; }
  appendChild(child) { this.children.push(child); }
  addEventListener(type, listener) { this.listeners[type] = listener; }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  click() { if (this.listeners.click) this.listeners.click({ target: this }); }
}

function createCalendarEnvironment(selectedDate = null) {
  const ids = {};
  [
    'cal-month-title', 'cal-month-summary', 'calendar-days-grid',
    'history-selected-date-label', 'history-day-summary-badge',
    'history-weight-val', 'history-food-list', 'history-review-content',
    'history-habits-list', 'cal-prev-month-btn', 'cal-next-month-btn',
    'history-edit-weight-btn', 'weight-date-input', 'log-weight-modal'
  ].forEach(id => { ids[id] = new FakeElement(); });

  const toggleCalls = [];
  const sandbox = {
    Date,
    document: {
      getElementById: id => ids[id],
      createElement: () => new FakeElement()
    },
    state: {
      calendarYear: 2026,
      calendarMonth: 7,
      selectedHistoryDate: selectedDate,
      foodLogs: [],
      weightLogs: [],
      eveningReviews: {},
      habits: [{ id: 'walk', name: 'Walk', completions: [], completionRecords: [] }]
    },
    getTodayStr: () => '2026-08-10',
    isFutureDate: (dateStr, todayStr = '2026-08-10') => Boolean(dateStr) && dateStr > todayStr,
    formatDateDisplay: value => value,
    toggleHabitCompletion: (...args) => toggleCalls.push(args)
  };

  vm.createContext(sandbox);
  vm.runInContext([
    extractFunction('getHabitCompletionLevel'),
    extractFunction('getCalendarDayStatus'),
    extractFunction('renderCalendarView'),
    extractFunction('setupCalendarControls'),
    'this.renderCalendarView = renderCalendarView;',
    'this.setupCalendarControls = setupCalendarControls;'
  ].join('\n'), sandbox);

  sandbox.renderCalendarView();
  return { ids, sandbox, toggleCalls };
}

function findDayCell(env, day) {
  return env.ids['calendar-days-grid'].children.find(cell =>
    cell.innerHTML.includes(`<span class="cal-day-num">${day}</span>`)
  );
}

console.log('\n--- 1. Calendar selection and editor behavior ---');

const futureEnv = createCalendarEnvironment();
const futureCell = findDayCell(futureEnv, 11);
futureCell.click();
check('Future date remains visible', Boolean(futureCell));
check('Future date is neutral and marked inactive',
  !futureCell.className.includes('cal-all') &&
  !futureCell.className.includes('cal-some') &&
  !futureCell.className.includes('cal-none') &&
  futureCell.attributes['aria-disabled'] === 'true'
);
check('Future date cannot be selected', futureEnv.sandbox.state.selectedHistoryDate !== '2026-08-11');

const forcedFutureEnv = createCalendarEnvironment('2026-08-11');
forcedFutureEnv.sandbox.setupCalendarControls();
forcedFutureEnv.ids['history-edit-weight-btn'].click();
check('Future date cannot open the weight editor',
  !forcedFutureEnv.ids['log-weight-modal'].classes.has('active')
);

const todayEnv = createCalendarEnvironment();
findDayCell(todayEnv, 10).click();
todayEnv.sandbox.setupCalendarControls();
todayEnv.ids['history-edit-weight-btn'].click();
todayEnv.ids['history-habits-list'].children[0].click();
check('Today remains selectable', todayEnv.sandbox.state.selectedHistoryDate === '2026-08-10');
check('Today can open the weight editor',
  todayEnv.ids['log-weight-modal'].classes.has('active') &&
  todayEnv.ids['weight-date-input'].value === '2026-08-10'
);
check('Today habit completion remains editable',
  todayEnv.toggleCalls.some(call => call[1] === '2026-08-10')
);

const pastEnv = createCalendarEnvironment();
findDayCell(pastEnv, 9).click();
pastEnv.sandbox.setupCalendarControls();
pastEnv.ids['history-edit-weight-btn'].click();
pastEnv.ids['history-habits-list'].children[0].click();
check('Past date remains selectable', pastEnv.sandbox.state.selectedHistoryDate === '2026-08-09');
check('Past date can open the weight editor',
  pastEnv.ids['log-weight-modal'].classes.has('active') &&
  pastEnv.ids['weight-date-input'].value === '2026-08-09'
);
check('Past habit completion remains editable',
  pastEnv.toggleCalls.some(call => call[1] === '2026-08-09')
);

console.log('\n--- 2. Habit-completion mutation boundary ---');
const toggleSource = extractFunction('toggleHabitCompletion');
const completionSandbox = {
  Date,
  getTodayStr: () => '2026-08-10',
  isFutureDate: (dateStr, todayStr = '2026-08-10') => Boolean(dateStr) && dateStr > todayStr,
  triggerHapticFeedback: () => {},
  generateRecordId: () => 'record-1',
  syncDerivedCompletionArrays: habit => {
    habit.completions = habit.completionRecords.map(record => record.localDate);
  },
  calculateStreak: () => ({ streak: 0 }),
  checkStreakMilestone: () => {},
  renderTodayView: () => {},
  renderHabitsView: () => {},
  renderCalendarView: () => {},
  checkDaytimeReminderAlert: () => {},
  state: {
    habits: [{ id: 'walk', completions: [], completionRecords: [] }],
    saveHabitsCalls: 0,
    saveHabits() { this.saveHabitsCalls++; }
  }
};
vm.createContext(completionSandbox);
vm.runInContext(`${toggleSource}\nthis.toggleHabitCompletion = toggleHabitCompletion;`, completionSandbox);

completionSandbox.toggleHabitCompletion('walk', '2026-08-11', 'ideal');
check('Defensive guard rejects future habit completion',
  completionSandbox.state.habits[0].completionRecords.length === 0 &&
  completionSandbox.state.saveHabitsCalls === 0
);
completionSandbox.toggleHabitCompletion('walk', '2026-08-10', 'ideal');
completionSandbox.toggleHabitCompletion('walk', '2026-08-09', 'ideal');
check('Mutation boundary still accepts today and past completion',
  completionSandbox.state.habits[0].completionRecords.some(r => r.localDate === '2026-08-10') &&
  completionSandbox.state.habits[0].completionRecords.some(r => r.localDate === '2026-08-09')
);

console.log('\n--- 3. Weight-log mutation boundary ---');
const weightSaveSource = extractFunction('saveWeightLogForDate');
check('Weight-log mutation helper exists', Boolean(weightSaveSource));
if (weightSaveSource) {
  const weightSandbox = {
    Date,
    getTodayStr: () => '2026-08-10',
    isFutureDate: (dateStr, todayStr = '2026-08-10') => Boolean(dateStr) && dateStr > todayStr,
    state: {
      weightLogs: [],
      saveWeightLogsCalls: 0,
      saveWeightLogs() { this.saveWeightLogsCalls++; }
    }
  };
  vm.createContext(weightSandbox);
  vm.runInContext(`${weightSaveSource}\nthis.saveWeightLogForDate = saveWeightLogForDate;`, weightSandbox);
  check('Defensive guard rejects future weight log',
    weightSandbox.saveWeightLogForDate(75, '2026-08-11') === false &&
    weightSandbox.state.weightLogs.length === 0 &&
    weightSandbox.state.saveWeightLogsCalls === 0
  );
  check('Weight boundary still accepts today',
    weightSandbox.saveWeightLogForDate(75, '2026-08-10') === true
  );
  check('Weight boundary still accepts a past date',
    weightSandbox.saveWeightLogForDate(75.5, '2026-08-09') === true
  );
}

if (failures > 0) {
  console.error(`\n${failures} calendar future-date regression check(s) failed.`);
  process.exit(1);
}

console.log('\n=== ALL P1-7 CALENDAR FUTURE-DATE CHECKS PASSED ===');
