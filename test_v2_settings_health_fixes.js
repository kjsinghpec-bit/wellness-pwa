const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('=== V2 SETTINGS & HEALTH CHECK FIXES AUTOMATED TEST SUITE ===');

let failCount = 0;
function check(label, passed) {
  console.log(label + ':', passed ? '✓ PASSED' : 'FAILED');
  if (!passed) failCount++;
}

class MockLocalStorage {
  constructor() { this.store = {}; }
  getItem(key) { return this.store[key] !== undefined ? this.store[key] : null; }
  setItem(key, val) { this.store[key] = String(val); }
  removeItem(key) { delete this.store[key]; }
  clear() { this.store = {}; }
}
const mockLocalStorage = new MockLocalStorage();

class MockSessionStorage {
  constructor() { this.store = {}; }
  getItem(key) { return this.store[key] !== undefined ? this.store[key] : null; }
  setItem(key, val) { this.store[key] = String(val); }
  removeItem(key) { delete this.store[key]; }
  clear() { this.store = {}; }
}
const mockSessionStorage = new MockSessionStorage();

class MockElement {
  constructor(id, tag = 'div') {
    this.id = id;
    this.tag = tag;
    this.value = '';
    this.checked = false;
    this.textContent = '';
    this.style = {};
    this.listeners = {};
    this.innerHTML = '';
    this.className = '';
    this.classList = {
      add: (cls) => {
        const classes = this.className.split(' ').filter(Boolean);
        if (!classes.includes(cls)) {
          classes.push(cls);
          this.className = classes.join(' ');
        }
      },
      remove: (cls) => {
        const classes = this.className.split(' ').filter(Boolean);
        const idx = classes.indexOf(cls);
        if (idx !== -1) {
          classes.splice(idx, 1);
          this.className = classes.join(' ');
        }
      },
      toggle: (cls, force) => {
        const classes = this.className.split(' ').filter(Boolean);
        const hasCls = classes.includes(cls);
        const wantCls = force !== undefined ? !!force : !hasCls;
        if (wantCls && !hasCls) {
          classes.push(cls);
        } else if (!wantCls && hasCls) {
          const idx = classes.indexOf(cls);
          classes.splice(idx, 1);
        }
        this.className = classes.join(' ');
        return wantCls;
      },
      contains: (cls) => {
        return this.className.split(' ').filter(Boolean).includes(cls);
      }
    };
    this.querySelector = (sel) => getOrCreateElement('dummy-inner-' + sel);
    this.querySelectorAll = (sel) => [getOrCreateElement('dummy-inner-list-' + sel)];
    this.appendChild = (child) => {};
    this.removeChild = (child) => {};
  }
  addEventListener(event, cb) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(cb);
  }
  setAttribute(name, value) {
    if (!this.attributes) this.attributes = {};
    this.attributes[name] = String(value);
  }
  dispatchEvent(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(data));
    }
  }
}

const elements = {};
function getOrCreateElement(id, tag = 'div') {
  if (!elements[id]) {
    elements[id] = new MockElement(id, tag);
  }
  return elements[id];
}

const mockDocument = {
  getElementById: (id) => getOrCreateElement(id),
  querySelectorAll: (selector) => {
    if (selector === '.nav-tab' || selector === '.tab-view' || selector === '.close-modal-btn, .modal-overlay') {
      return [getOrCreateElement('dummy')];
    }
    return [];
  },
  querySelector: (selector) => {
    return getOrCreateElement('dummy-selector');
  },
  createElement: (tag) => new MockElement('new-el', tag),
  body: {
    appendChild: () => {},
    removeChild: () => {}
  },
  addEventListener: (event, cb) => {
    if (event === 'DOMContentLoaded') {
      cb();
    }
  }
};

let fetchCallCount = 0;
let fetchUrls = [];
const mockFetch = async (url, options) => {
  fetchCallCount++;
  fetchUrls.push(url);
  return {
    ok: true,
    status: 200,
    json: async () => ({})
  };
};

const mockWindow = {
  addEventListener: () => {},
  document: mockDocument,
  localStorage: mockLocalStorage,
  sessionStorage: mockSessionStorage,
  fetch: mockFetch,
  location: { href: 'https://kjsinghpec-bit.github.io/wellness-pwa/' },
  navigator: {
    serviceWorker: { register: async () => ({}) },
    vibrate: () => {}
  },
  Notification: {
    permission: 'granted',
    requestPermission: async () => 'granted'
  },
  Intl: {
    DateTimeFormat: () => ({
      resolvedOptions: () => ({ timeZone: 'UTC' })
    })
  }
};

const sandbox = {
  ...mockWindow,
  window: mockWindow,
  document: mockDocument,
  localStorage: mockLocalStorage,
  sessionStorage: mockSessionStorage,
  fetch: mockFetch,
  console,
  setTimeout,
  setInterval,
  Intl: mockWindow.Intl,
  Notification: mockWindow.Notification,
  navigator: mockWindow.navigator,
  URL: {
    createObjectURL: () => '',
    revokeObjectURL: () => {}
  },
  Blob: function() {}
};

// Prepare local storage defaults
mockLocalStorage.setItem('wellness_app_settings_data', JSON.stringify({
  reminderStart: '08:00',
  reminderEnd: '20:00',
  streakGraceEnabled: true
}));

const appJsPath = path.join(__dirname, 'app.js');
const appJsContent = fs.readFileSync(appJsPath, 'utf8');

const context = vm.createContext(sandbox);
vm.runInContext(appJsContent, context);

// Extract script-scoped variables from VM context
const state = vm.runInContext('state', context);
const runDailyHealthCheck = vm.runInContext('runDailyHealthCheck', context);
const getTodayStr = vm.runInContext('getTodayStr', context);

// Now execute tests
(async () => {
  // Test 1: Saved settings populate all three controls
  console.log('\n--- Test 1: Populate Controls from Settings ---');
  const settingsBtn = getOrCreateElement('settings-btn');
  settingsBtn.dispatchEvent('click', {});

  const startTime = getOrCreateElement('reminder-start-time');
  const endTime = getOrCreateElement('reminder-end-time');
  const graceToggle = getOrCreateElement('streak-grace-toggle');

  check('Start time populated correctly', startTime.value === '08:00');
  check('End time populated correctly', endTime.value === '20:00');
  check('Grace toggle populated correctly', graceToggle.checked === true);

  // Test 2: Changing each control updates state.settings and persists it
  console.log('\n--- Test 2: Controls Modification Updates State & Persists ---');
  startTime.value = '10:00';
  startTime.dispatchEvent('change', {});
  check('State settings reminderStart updated', state.settings.reminderStart === '10:00');

  endTime.value = '22:00';
  endTime.dispatchEvent('change', {});
  check('State settings reminderEnd updated', state.settings.reminderEnd === '22:00');

  graceToggle.checked = false;
  graceToggle.dispatchEvent('change', {});
  check('State settings grace toggle updated', state.settings.streakGraceEnabled === false);

  const savedSettings = JSON.parse(mockLocalStorage.getItem('wellness_app_settings_data'));
  check('Persisted settings reminderStart matches', savedSettings.reminderStart === '10:00');
  check('Persisted settings reminderEnd matches', savedSettings.reminderEnd === '22:00');
  check('Persisted settings grace toggle matches', savedSettings.streakGraceEnabled === false);

  // Test 3: Invalid active-hour values are handled safely
  console.log('\n--- Test 3: Invalid Active Hour Ranges Handled Safely ---');
  // Revert range test
  startTime.value = '23:00';
  startTime.dispatchEvent('change', {});
  check('Invalid range (start >= end) reverted startTime value in UI', startTime.value === '10:00');
  check('Invalid range did not modify state settings', state.settings.reminderStart === '10:00');

  // Format validation test
  endTime.value = 'invalid';
  endTime.dispatchEvent('change', {});
  check('Invalid format reverted endTime value in UI', endTime.value === '22:00');
  check('Invalid format did not modify state settings', state.settings.reminderEnd === '22:00');

  // Test 4: Grace-toggle state survives reload
  console.log('\n--- Test 4: Grace Toggle State Survives Reload ---');
  const newMockStorage = new MockLocalStorage();
  newMockStorage.setItem('wellness_app_settings_data', JSON.stringify({
    reminderStart: '10:00',
    reminderEnd: '22:00',
    streakGraceEnabled: false
  }));
  const newSandbox = { ...sandbox, localStorage: newMockStorage };
  const newContext = vm.createContext(newSandbox);
  vm.runInContext(appJsContent, newContext);
  const newState = vm.runInContext('state', newContext);
  check('Loaded grace toggle matches persisted false state', newState.settings.streakGraceEnabled === false);

  // Test 5: The health check performs network requests on the first run of the day
  console.log('\n--- Test 5: Health Check First Run Performs Network Calls ---');
  fetchCallCount = 0;
  mockLocalStorage.removeItem('wellness_last_health_check_date');
  await runDailyHealthCheck();
  check('Fetch was called', fetchCallCount > 0);

  // Test 6: A second launch on the same day performs zero health-check network requests
  console.log('\n--- Test 6: Health Check Second Run Performs Zero Network Calls ---');
  fetchCallCount = 0;
  const todayStr = getTodayStr();
  mockLocalStorage.setItem('wellness_last_health_check_date', todayStr);
  await runDailyHealthCheck();
  check('Fetch was not called', fetchCallCount === 0);

  // Test 7: A new day performs the health check again
  console.log('\n--- Test 7: Health Check Run on a New Day Performs Network Calls ---');
  fetchCallCount = 0;
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const yesterdayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  mockLocalStorage.setItem('wellness_last_health_check_date', yesterdayStr);
  await runDailyHealthCheck();
  check('Fetch was called again for a new day', fetchCallCount > 0);

  // Test 8: Saved status/history still render when today’s network check is skipped
  console.log('\n--- Test 8: History Renders When Network Check is Skipped ---');
  fetchCallCount = 0;
  mockLocalStorage.setItem('wellness_last_health_check_date', todayStr);
  state.healthHistory = [`[${todayStr}] Uptime: OK | DB: OK`];
  const statusTextEl = getOrCreateElement('health-status-text');
  statusTextEl.textContent = '';
  await runDailyHealthCheck();
  check('Uptodate status displayed', statusTextEl.textContent.includes('Operational'));
  check('No network requests made', fetchCallCount === 0);

  // Test 9: Today run with empty health history performs zero network requests and shows neutral status
  console.log('\n--- Test 9: Today Run with Empty Health History Performs Zero Network Calls ---');
  fetchCallCount = 0;
  mockLocalStorage.setItem('wellness_last_health_check_date', todayStr);
  state.healthHistory = [];
  statusTextEl.textContent = '';
  await runDailyHealthCheck();
  check('Fetch was not called when history is empty', fetchCallCount === 0);
  check('Neutral status displayed when details are missing', statusTextEl.textContent.includes('details unavailable'));

  console.log('\n=============================================================');
  if (failCount === 0) {
    console.log('=== ALL 9 SETTINGS & HEALTH CHECK REGRESSION TESTS PASSED ===');
    process.exit(0);
  } else {
    console.log(`=== ${failCount} SETTINGS & HEALTH CHECK REGRESSION TEST(S) FAILED ===`);
    process.exit(1);
  }
})();
