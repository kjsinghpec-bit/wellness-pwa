/* Wellness PWA Main Application Script - v2.1.0 (P0A-1A Hardened Backup & Inspector) */

// ---------------------------------------------------------------------------
// 1. STOIC QUOTES DATASET
// ---------------------------------------------------------------------------
const STOIC_QUOTES = [
  {
    id: 1,
    author: "Marcus Aurelius",
    source: "Meditations",
    quote: "You have power over your mind - not outside events. Realize this, and you will find strength.",
    explanation: "Focus strictly on your internal choices and reactions. When external situation changes, your inner strength remains undisturbed."
  },
  {
    id: 2,
    author: "Seneca",
    source: "Letters from a Stoic",
    quote: "We suffer more often in imagination than in reality.",
    explanation: "Don't stress over hypothetical future disasters. Handle today's actual events as they happen rather than worrying about tomorrow."
  },
  {
    id: 3,
    author: "Epictetus",
    source: "Enchiridion",
    quote: "It's not what happens to you, but how you react to it that matters.",
    explanation: "Events themselves are neutral; your judgment creates emotional distress. Frame obstacles as opportunities to practice resilience."
  },
  {
    id: 4,
    author: "Marcus Aurelius",
    source: "Meditations",
    quote: "The happiness of your life depends upon the quality of your thoughts.",
    explanation: "Audit your self-talk daily. Replace self-criticism and doubt with constructive, deliberate thinking."
  },
  {
    id: 5,
    author: "Seneca",
    source: "On the Shortness of Life",
    quote: "It is not that we have a short time to live, but that we waste a lot of it.",
    explanation: "Prioritize what truly matters today. Cut out mindless distractions and focus your energy on meaningful actions."
  },
  {
    id: 6,
    author: "Epictetus",
    source: "Discourses",
    quote: "No man is free who is not master of himself.",
    explanation: "True freedom comes from self-discipline over impulses, temptations, and emotional outbursts."
  },
  {
    id: 7,
    author: "Marcus Aurelius",
    source: "Meditations",
    quote: "Waste no more time arguing about what a good man should be. Be one.",
    explanation: "Stop intellectualizing your values. Demonstrate your character directly through your daily habits and choices."
  },
  {
    id: 8,
    author: "Seneca",
    source: "Letters from a Stoic",
    quote: "Luck is what happens when preparation meets opportunity.",
    explanation: "Build your skills and stamina consistently when times are calm so you're ready when big moments arise."
  },
  {
    id: 9,
    author: "Epictetus",
    source: "Enchiridion",
    quote: "Wealth consists not in having great possessions, but in having few wants.",
    explanation: "Cultivate contentment with what you already own. Reducing unnecessary desires creates instant freedom."
  },
  {
    id: 10,
    author: "Marcus Aurelius",
    source: "Meditations",
    quote: "When you arise in the morning think of what a privilege it is to be alive, to think, to enjoy, to love.",
    explanation: "Begin every morning with genuine gratitude for the simple opportunity to experience another day."
  },
  {
    id: 11,
    author: "Seneca",
    source: "Letters from a Stoic",
    quote: "If a man knows not which port he sails on, no wind is favorable.",
    explanation: "Set clear long-term goals for your health and life, or else daily efforts will drift aimlessly."
  },
  {
    id: 12,
    author: "Epictetus",
    source: "Discourses",
    quote: "First say to yourself what you would be; and then do what you have to do.",
    explanation: "Define your ideal self, then align your daily habits explicitly with that identity."
  },
  {
    id: 13,
    author: "Marcus Aurelius",
    source: "Meditations",
    quote: "The obstacle is the way.",
    explanation: "Whenever you hit a setback, treat it as direct practice for building fortitude and problem-solving skills."
  },
  {
    id: 14,
    author: "Seneca",
    source: "Moral Letters",
    quote: "Difficulties strengthen the mind, as labor does the body.",
    explanation: "Embrace uncomfortable challenges like workouts or tough tasks; they are resistance training for your character."
  },
  {
    id: 15,
    author: "Epictetus",
    source: "Enchiridion",
    quote: "He is a wise man who does not grieve for the things which he has not, but rejoices for those which he has.",
    explanation: "Shift your focus from what is missing in your life to honoring the gifts already in your presence."
  },
  {
    id: 16,
    author: "Marcus Aurelius",
    source: "Meditations",
    quote: "Accept the things to which fate binds you, and love the people with whom fate brings you together, but do so with all your heart.",
    explanation: "Embrace reality as it unfolds and nurture your key relationships wholeheartedly."
  },
  {
    id: 17,
    author: "Seneca",
    source: "Letters from a Stoic",
    quote: "Begin at once to live, and count each separate day as a separate life.",
    explanation: "Don't put off living or improving your life for next month. Make today a complete masterpiece."
  },
  {
    id: 18,
    author: "Epictetus",
    source: "Discourses",
    quote: "Don't explain your philosophy. Embody it.",
    explanation: "Actions speak far louder than words. Let your calm demeanour and consistent routines speak for you."
  },
  {
    id: 19,
    author: "Marcus Aurelius",
    source: "Meditations",
    quote: "Look back over the past, with its changing empires that rose and fell, and you can foresee the future, too.",
    explanation: "Keep a historical perspective on current stress. Most worries pass quickly in the grand passage of time."
  },
  {
    id: 20,
    author: "Seneca",
    source: "On Providence",
    quote: "A gem cannot be polished without friction, nor a man perfected without trials.",
    explanation: "Reframe discomfort as necessary friction that refines your wisdom and resilience."
  },
  {
    id: 21,
    author: "Epictetus",
    source: "Enchiridion",
    quote: "Circumstances don't make the man, they only reveal him to himself.",
    explanation: "Under pressure, your true habits and priorities surface. Prepare yourself before crisis hits."
  },
  {
    id: 22,
    author: "Marcus Aurelius",
    source: "Meditations",
    quote: "Dwell on the beauty of life. Watch the stars, and see yourself running with them.",
    explanation: "Take time out daily to appreciate nature and connect with the vastness of the universe."
  }
];

// ---------------------------------------------------------------------------
// 2. CONSTANTS, SCHEMA VERSION & UTILITIES (P0A-1A HARDENED)
// ---------------------------------------------------------------------------
const APP_SCHEMA_VERSION = 1;
const APP_VERSION = "2.1.0";
const TARGET_PASSCODE_HASH = "434f4d14c1eb231306b51aaa160c021b63670ac6ca67fb8e403f4500983dd1e4";

async function sha256Hex(str) {
  const msgBuffer = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Canonical Key-Sorted Stringification for SHA-256 Integrity Checksum
function toCanonicalJsonString(obj) {
  if (obj === null || typeof obj !== 'object') {
    return JSON.stringify(obj);
  }
  if (Array.isArray(obj)) {
    return '[' + obj.map(toCanonicalJsonString).join(',') + ']';
  }
  const sortedKeys = Object.keys(obj).sort();
  const parts = sortedKeys.map(k => JSON.stringify(k) + ':' + toCanonicalJsonString(obj[k]));
  return '{' + parts.join(',') + '}';
}

const STORAGE_KEYS = {
  HABITS: 'wellness_habits_data',
  WEIGHT_LOGS: 'wellness_weight_logs_data',
  WEIGHT_GOAL: 'wellness_weight_goal_data',
  FOOD_LOGS: 'wellness_food_logs_data',
  EVENING_REVIEWS: 'wellness_evening_reviews_data',
  SAVED_QUOTES: 'wellness_saved_quotes_data',
  DAILY_REACTIONS: 'wellness_daily_reactions_data',
  SETTINGS: 'wellness_app_settings_data',
  HEALTH_HISTORY: 'wellness_health_history_logs',
  SESSION_UNLOCKED: 'wellness_session_unlocked',
  LAST_HEALTH_CHECK: 'wellness_last_health_check_date'
};

const CLOUD_SYNC_ENDPOINT = 'https://crudcrud.com/api/df9fe4cc2a2b4f0ba158f3f54b74b576/wellness/6a7872454db36503e87d5f2b';
const PUBLIC_LIVE_URL = 'https://kjsinghpec-bit.github.io/wellness-pwa/';

function getTodayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function formatDateDisplay(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-').map(Number);
  const d = new Date(parts[0], parts[1] - 1, parts[2]);
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

function triggerHapticFeedback() {
  if ('vibrate' in navigator) {
    try { navigator.vibrate(15); } catch (e) {}
  }
}

// ---------------------------------------------------------------------------
// 3. DEFAULTS & STATE MANAGEMENT
// ---------------------------------------------------------------------------
const DEFAULT_HABITS = [
  {
    id: 'h1',
    name: 'Call Wife 📞 (Every 3 hrs active)',
    icon: '📞',
    category: 'Family',
    createdAt: getTodayStr(),
    completions: [getTodayStr()]
  },
  {
    id: 'h2',
    name: 'Morning Hydration (500ml)',
    icon: '💧',
    category: 'Health',
    createdAt: getTodayStr(),
    completions: [getTodayStr()]
  },
  {
    id: 'h3',
    name: '30 Min Workout / Walk',
    icon: '🏃',
    category: 'Health',
    createdAt: getTodayStr(),
    completions: []
  }
];

function generateDefaultWeightLogs() {
  const today = new Date();
  const d1 = new Date(today); d1.setDate(d1.getDate() - 20);
  const d2 = new Date(today); d2.setDate(d2.getDate() - 13);
  const d3 = new Date(today); d3.setDate(d3.getDate() - 7);
  const d4 = new Date(today);

  const format = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  return [
    { id: 'w1', weight: 76.5, date: format(d1) },
    { id: 'w2', weight: 75.8, date: format(d2) },
    { id: 'w3', weight: 75.0, date: format(d3) },
    { id: 'w4', weight: 74.2, date: format(d4) }
  ];
}

const DEFAULT_FOOD_LOGS = [
  {
    id: 'f1',
    date: getTodayStr(),
    mealType: 'Lunch',
    description: '2 Chapati, Dal Tadka, Bhindi Sabzi, Curd & Salad',
    tags: ['Homemade', 'High Protein'],
    timestamp: '13:30'
  },
  {
    id: 'f2',
    date: getTodayStr(),
    mealType: 'Snack / Tea',
    description: 'Masala Tea & 2 Marie Biscuits',
    tags: ['Light'],
    timestamp: '17:00'
  }
];

const DEFAULT_SETTINGS = {
  reminderStart: '09:00',
  reminderEnd: '21:00',
  streakGraceEnabled: true
};

class AppState {
  constructor() {
    this.habits = this.load(STORAGE_KEYS.HABITS, DEFAULT_HABITS);
    this.weightLogs = this.load(STORAGE_KEYS.WEIGHT_LOGS, generateDefaultWeightLogs());
    this.weightGoal = this.load(STORAGE_KEYS.WEIGHT_GOAL, 70.0);
    this.foodLogs = this.load(STORAGE_KEYS.FOOD_LOGS, DEFAULT_FOOD_LOGS);
    this.eveningReviews = this.load(STORAGE_KEYS.EVENING_REVIEWS, {});
    this.savedQuotes = this.load(STORAGE_KEYS.SAVED_QUOTES, []);
    this.dailyReactions = this.load(STORAGE_KEYS.DAILY_REACTIONS, {});
    this.settings = this.load(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    this.healthHistory = this.load(STORAGE_KEYS.HEALTH_HISTORY, []);

    this.activeTab = 'habits';
    this.activeCategoryFilter = 'ALL';
    
    const today = new Date();
    this.selectedHistoryDate = getTodayStr();
    this.calendarYear = today.getFullYear();
    this.calendarMonth = today.getMonth();
  }

  load(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  save(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      this.syncToCloud();
    } catch (e) {
      console.error('Save error:', e);
    }
  }

  saveHabits() { this.save(STORAGE_KEYS.HABITS, this.habits); }
  saveWeightLogs() {
    this.weightLogs.sort((a, b) => new Date(a.date) - new Date(b.date));
    this.save(STORAGE_KEYS.WEIGHT_LOGS, this.weightLogs);
  }
  saveWeightGoal() { this.save(STORAGE_KEYS.WEIGHT_GOAL, this.weightGoal); }
  saveFoodLogs() { this.save(STORAGE_KEYS.FOOD_LOGS, this.foodLogs); }
  saveEveningReviews() { this.save(STORAGE_KEYS.EVENING_REVIEWS, this.eveningReviews); }
  saveSavedQuotes() { this.save(STORAGE_KEYS.SAVED_QUOTES, this.savedQuotes); }
  saveDailyReactions() { this.save(STORAGE_KEYS.DAILY_REACTIONS, this.dailyReactions); }
  saveSettings() { this.save(STORAGE_KEYS.SETTINGS, this.settings); }

  async syncToCloud() {
    try {
      const payload = {
        habits: this.habits,
        weightLogs: this.weightLogs,
        weightGoal: this.weightGoal,
        foodLogs: this.foodLogs,
        eveningReviews: this.eveningReviews,
        updatedAt: new Date().toISOString()
      };
      fetch(CLOUD_SYNC_ENDPOINT, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(() => {});
    } catch (e) {}
  }

  async pullFromCloud() {
    try {
      const res = await fetch(CLOUD_SYNC_ENDPOINT);
      if (res.ok) {
        const record = await res.json();
        if (record && record.habits && record.habits.length > 0) {
          this.habits = record.habits;
          this.weightLogs = record.weightLogs || [];
          this.weightGoal = record.weightGoal || 70.0;
          this.foodLogs = record.foodLogs || [];
          this.eveningReviews = record.eveningReviews || {};

          localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(this.habits));
          localStorage.setItem(STORAGE_KEYS.WEIGHT_LOGS, JSON.stringify(this.weightLogs));
          localStorage.setItem(STORAGE_KEYS.WEIGHT_GOAL, JSON.stringify(this.weightGoal));
          localStorage.setItem(STORAGE_KEYS.FOOD_LOGS, JSON.stringify(this.foodLogs));
          localStorage.setItem(STORAGE_KEYS.EVENING_REVIEWS, JSON.stringify(this.eveningReviews));

          renderHabitsView();
          renderFoodView();
          renderWeightView();
          renderCalendarView();
        }
      }
    } catch (e) {}
  }
}

const state = new AppState();

// ---------------------------------------------------------------------------
// 4. PASSCODE AUTO-LOCK ENGINE
// ---------------------------------------------------------------------------
let currentPinInput = "";

function setupPasscodeLock() {
  const overlay = document.getElementById('passcode-overlay');
  const dotsContainer = document.getElementById('pin-dots');
  const errorContainer = document.getElementById('passcode-error');
  const lockBtn = document.getElementById('header-lock-btn');

  const isUnlocked = sessionStorage.getItem(STORAGE_KEYS.SESSION_UNLOCKED) === 'true';

  if (isUnlocked) {
    overlay.classList.remove('active');
  } else {
    overlay.classList.add('active');
  }

  document.querySelectorAll('.keypad-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      triggerHapticFeedback();
      const key = btn.getAttribute('data-key');
      errorContainer.textContent = "";

      if (key === 'C') {
        currentPinInput = "";
      } else if (key === 'DEL') {
        currentPinInput = currentPinInput.slice(0, -1);
      } else if (currentPinInput.length < 4) {
        currentPinInput += key;
      }

      updatePinDots();

      if (currentPinInput.length === 4) {
        setTimeout(() => verifyPasscode(currentPinInput), 120);
      }
    });
  });

  function updatePinDots() {
    const dots = dotsContainer.children;
    for (let i = 0; i < 4; i++) {
      if (i < currentPinInput.length) {
        dots[i].classList.add('filled');
      } else {
        dots[i].classList.remove('filled');
      }
    }
  }

  async function verifyPasscode(inputPin) {
    const inputHash = await sha256Hex(inputPin);
    if (inputHash === TARGET_PASSCODE_HASH) {
      sessionStorage.setItem(STORAGE_KEYS.SESSION_UNLOCKED, 'true');
      overlay.classList.remove('active');
      currentPinInput = "";
      updatePinDots();
      checkDaytimeReminderAlert();
    } else {
      errorContainer.textContent = "Incorrect passcode. Try again.";
      currentPinInput = "";
      updatePinDots();
      
      dotsContainer.style.transform = 'translateX(-10px)';
      setTimeout(() => dotsContainer.style.transform = 'translateX(10px)', 80);
      setTimeout(() => dotsContainer.style.transform = 'translateX(-5px)', 160);
      setTimeout(() => dotsContainer.style.transform = 'translateX(0)', 240);
    }
  }

  lockBtn.addEventListener('click', () => {
    sessionStorage.removeItem(STORAGE_KEYS.SESSION_UNLOCKED);
    currentPinInput = "";
    updatePinDots();
    overlay.classList.add('active');
  });
}

// ---------------------------------------------------------------------------
// 5. ESCALATING STREAK TOAST & DAYTIME REMINDER BANNER
// ---------------------------------------------------------------------------
function checkStreakMilestone(habitName, streak) {
  if (streak === 7) {
    showMilestoneToast('✨ Checkmark!', `Solid discipline! You hit a 7-day streak on "${habitName}".`, '✨');
  } else if (streak === 14) {
    showMilestoneToast('🔥 14-Day Streak!', `Impressive momentum! 2 full weeks on "${habitName}".`, '🔥');
  } else if (streak >= 30 && streak % 10 === 0) {
    showMilestoneToast('🎉 Master Milestone!', `Outstanding commitment! ${streak} days in a row on "${habitName}".`, '🎉');
  }
}

function showMilestoneToast(title, desc, icon = '🎉') {
  triggerHapticFeedback();
  const toast = document.getElementById('milestone-toast');
  document.getElementById('milestone-icon').textContent = icon;
  document.getElementById('milestone-title').textContent = title;
  document.getElementById('milestone-desc').textContent = desc;

  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4500);
}

function checkDaytimeReminderAlert() {
  const callWifeHabit = state.habits.find(h => h.name.includes('Call Wife'));
  if (!callWifeHabit) return;

  const todayStr = getTodayStr();
  const isDoneToday = callWifeHabit.completions.includes(todayStr);

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const [sH, sM] = (state.settings.reminderStart || '09:00').split(':').map(Number);
  const [eH, eM] = (state.settings.reminderEnd || '21:00').split(':').map(Number);

  const startMinutes = sH * 60 + sM;
  const endMinutes = eH * 60 + eM;

  const isDaytimeActive = currentMinutes >= startMinutes && currentMinutes <= endMinutes;

  const banner = document.getElementById('reminder-fallback-banner');
  if (isDaytimeActive && !isDoneToday) {
    banner.style.display = 'block';
  } else {
    banner.style.display = 'none';
  }

  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  } else if ('Notification' in window && Notification.permission === 'granted' && isDaytimeActive && !isDoneToday) {
    try {
      new Notification('Reminder: Call Wife 📞', {
        body: 'Take a minute during your active hours to check in!',
        icon: 'apple-touch-icon.png'
      });
    } catch (e) {}
  }
}

function setupReminderBanner() {
  document.getElementById('reminder-done-btn').addEventListener('click', () => {
    const callWifeHabit = state.habits.find(h => h.name.includes('Call Wife'));
    if (callWifeHabit) {
      toggleHabitCompletion(callWifeHabit.id, getTodayStr());
    }
    document.getElementById('reminder-fallback-banner').style.display = 'none';
  });

  document.getElementById('reminder-close-btn').addEventListener('click', () => {
    document.getElementById('reminder-fallback-banner').style.display = 'none';
  });
}

// ---------------------------------------------------------------------------
// 6. HABIT TRACKER CONTROLLER
// ---------------------------------------------------------------------------

function calculateStreak(completions, allowGrace = state.settings.streakGraceEnabled) {
  if (!completions || completions.length === 0) return { streak: 0, inGrace: false };

  const set = new Set(completions);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 0;
  let inGrace = false;
  let missedAllowed = allowGrace ? 1 : 0;

  let checkDate = new Date(today);
  const todayStr = getTodayStr();

  if (!set.has(todayStr)) {
    checkDate.setDate(checkDate.getDate() - 1);
    const yesterdayStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
    
    if (!set.has(yesterdayStr)) {
      if (missedAllowed > 0) {
        missedAllowed--;
        inGrace = true;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        return { streak: 0, inGrace: false };
      }
    }
  }

  while (true) {
    const dateStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
    if (set.has(dateStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (missedAllowed > 0) {
      missedAllowed--;
      inGrace = true;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return { streak, inGrace };
}

function calculateConsistency30Day(completions) {
  const set = new Set(completions);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let doneCount = 0;
  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    if (set.has(dateStr)) doneCount++;
  }

  return Math.round((doneCount / 30) * 100);
}

function getPast7Days() {
  const days = [];
  const curr = new Date();
  curr.setHours(0, 0, 0, 0);

  for (let i = 6; i >= 0; i--) {
    const d = new Date(curr);
    d.setDate(d.getDate() - i);
    days.push(d);
  }
  return days;
}

function renderHabitsView() {
  const habitsListContainer = document.getElementById('habits-list');
  const completionPill = document.getElementById('completion-stat-pill');
  const habitsSubtitle = document.getElementById('habits-subtitle');

  habitsListContainer.innerHTML = '';

  const category = state.activeCategoryFilter || 'ALL';
  const filteredHabits = category === 'ALL' ? state.habits : state.habits.filter(h => h.category === category);

  if (filteredHabits.length === 0) {
    habitsListContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🌱</div>
        <p>No habits found in this category. Tap <strong>+ Add Habit</strong> to create one!</p>
      </div>
    `;
    completionPill.textContent = '0/0 Done';
    return;
  }

  const todayStr = getTodayStr();
  let doneTodayCount = 0;
  const daysWindow = getPast7Days();

  state.habits.forEach(h => { if (h.completions.includes(todayStr)) doneTodayCount++; });

  filteredHabits.forEach((habit) => {
    const isDoneToday = habit.completions.includes(todayStr);
    const streakInfo = calculateStreak(habit.completions);
    const consistencyPct = calculateConsistency30Day(habit.completions);

    const weeklyRowHtml = daysWindow.map(d => {
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const isDone = habit.completions.includes(dateStr);
      const isToday = dateStr === todayStr;
      const dayLabel = d.toLocaleDateString('en-US', { weekday: 'narrow' });
      return `
        <div class="day-cell ${isDone ? 'done' : ''} ${isToday ? 'today' : ''}">
          <span class="day-label">${dayLabel}</span>
          <div class="day-dot">${isDone ? '✓' : ''}</div>
        </div>
      `;
    }).join('');

    const card = document.createElement('div');
    card.className = `habit-card ${isDoneToday ? 'completed' : ''}`;
    card.innerHTML = `
      <div class="habit-header">
        <div class="habit-info">
          <div class="habit-icon">${habit.icon || '🎯'}</div>
          <div>
            <div class="habit-name">${habit.name}</div>
            <div class="habit-meta-row">
              <span class="streak-badge">
                🔥 ${streakInfo.streak} ${streakInfo.streak === 1 ? 'day' : 'days'}
              </span>
              <span class="consistency-badge" title="Rolling 30-Day Completion Rate">
                🎯 ${consistencyPct}% 30-day
              </span>
              ${streakInfo.inGrace ? `<span class="grace-badge">🛡️ Grace Active</span>` : ''}
              <span class="category-tag">${habit.category || 'General'}</span>
            </div>
          </div>
        </div>
        <button class="habit-toggle-btn" data-id="${habit.id}" aria-label="Toggle habit completion">
          ✓
        </button>
      </div>
      <div class="habit-weekly-row">
        ${weeklyRowHtml}
      </div>
      <div class="habit-card-footer">
        <button class="delete-btn" data-delete-id="${habit.id}">Remove</button>
      </div>
    `;

    card.querySelector('.habit-toggle-btn').addEventListener('click', () => {
      toggleHabitCompletion(habit.id, todayStr);
    });

    card.querySelector('.delete-btn').addEventListener('click', () => {
      deleteHabit(habit.id);
    });

    habitsListContainer.appendChild(card);
  });

  completionPill.textContent = `${doneTodayCount}/${state.habits.length} Done`;
  habitsSubtitle.textContent = `${doneTodayCount} of ${state.habits.length} habits completed today`;
}

function toggleHabitCompletion(habitId, dateStr = getTodayStr()) {
  triggerHapticFeedback();
  const habit = state.habits.find(h => h.id === habitId);
  if (!habit) return;

  const idx = habit.completions.indexOf(dateStr);

  if (idx > -1) {
    habit.completions.splice(idx, 1);
  } else {
    habit.completions.push(dateStr);
    const streakInfo = calculateStreak(habit.completions);
    checkStreakMilestone(habit.name, streakInfo.streak);
  }

  state.saveHabits();
  renderHabitsView();
  renderCalendarView();
  checkDaytimeReminderAlert();
}

function deleteHabit(habitId) {
  if (confirm('Are you sure you want to delete this habit?')) {
    state.habits = state.habits.filter(h => h.id !== habitId);
    state.saveHabits();
    renderHabitsView();
    renderCalendarView();
  }
}

function setupCategoryChips() {
  document.querySelectorAll('#category-chips .cat-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#category-chips .cat-chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeCategoryFilter = btn.getAttribute('data-cat');
      renderHabitsView();
    });
  });
}

// ---------------------------------------------------------------------------
// 7. DAILY FOOD JOURNAL CONTROLLER
// ---------------------------------------------------------------------------

function renderFoodView() {
  const foodListContainer = document.getElementById('food-logs-list');
  const subtitle = document.getElementById('food-subtitle');

  const todayStr = getTodayStr();
  const todayFood = state.foodLogs.filter(f => f.date === todayStr);

  foodListContainer.innerHTML = '';
  subtitle.textContent = `${todayFood.length} meal ${todayFood.length === 1 ? 'entry' : 'entries'} logged for today`;

  renderFoodSummaryStrip();

  if (todayFood.length === 0) {
    foodListContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🍲</div>
        <p>No meals logged today yet. Tap <strong>+ Log Meal</strong> above to record your food!</p>
      </div>
    `;
    return;
  }

  todayFood.forEach(item => {
    const tagsHtml = (item.tags || []).map(t => `<span class="food-tag-pill">${t}</span>`).join('');

    const card = document.createElement('div');
    card.className = 'food-card';
    card.innerHTML = `
      <div class="food-card-header">
        <span class="food-badge ${item.mealType.replace(/\s+/g, '')}">${item.mealType}</span>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 0.75rem; color: var(--text-muted);">${item.timestamp || ''}</span>
          <button class="delete-btn" data-food-id="${item.id}">Delete</button>
        </div>
      </div>
      <div class="food-desc">${item.description}</div>
      ${tagsHtml ? `<div class="food-tags-row">${tagsHtml}</div>` : ''}
    `;

    card.querySelector('.delete-btn').addEventListener('click', () => {
      deleteFoodLog(item.id);
    });

    foodListContainer.appendChild(card);
  });
}

function renderFoodSummaryStrip() {
  const past7Days = getPast7Days();

  let totalMealsWeek = 0;
  let fullMealDays = 0;
  let homemadeCount = 0;
  let totalTaggedMeals = 0;

  past7Days.forEach(d => {
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const dayMeals = state.foodLogs.filter(f => f.date === dateStr);

    totalMealsWeek += dayMeals.length;

    const slots = new Set(dayMeals.map(f => f.mealType));
    if (slots.has('Breakfast') && slots.has('Lunch') && slots.has('Dinner') && slots.has('Snack / Tea')) {
      fullMealDays++;
    }

    dayMeals.forEach(m => {
      if (m.tags && m.tags.length > 0) {
        totalTaggedMeals++;
        if (m.tags.includes('Homemade')) homemadeCount++;
      }
    });
  });

  document.getElementById('meals-logged-count').textContent = totalMealsWeek;
  document.getElementById('green-meal-days').textContent = `${fullMealDays}/7`;
  
  const homemadePct = totalTaggedMeals > 0 ? Math.round((homemadeCount / totalTaggedMeals) * 100) : 100;
  document.getElementById('homemade-pct').textContent = `${homemadePct}%`;
}

function deleteFoodLog(foodId) {
  if (confirm('Delete this food entry?')) {
    state.foodLogs = state.foodLogs.filter(f => f.id !== foodId);
    state.saveFoodLogs();
    renderFoodView();
    renderCalendarView();
  }
}

function setupFoodSection() {
  document.getElementById('open-food-modal-btn').addEventListener('click', () => {
    document.getElementById('food-date-input').value = getTodayStr();
    document.getElementById('log-food-modal').classList.add('active');
  });

  document.querySelectorAll('.chip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const meal = btn.getAttribute('data-meal');
      document.getElementById('food-meal-type').value = meal;
      document.getElementById('food-date-input').value = getTodayStr();
      document.getElementById('log-food-modal').classList.add('active');
    });
  });

  document.querySelectorAll('#frequent-dishes-chips .freq-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const text = chip.getAttribute('data-text');
      document.getElementById('food-desc-input').value = text;
    });
  });

  document.querySelectorAll('#food-tag-chips .tag-chip').forEach(tagChip => {
    tagChip.addEventListener('click', () => {
      tagChip.classList.toggle('selected');
    });
  });

  document.getElementById('log-food-form').addEventListener('submit', (e) => {
    e.preventDefault();
    triggerHapticFeedback();
    const mealType = document.getElementById('food-meal-type').value;
    const desc = document.getElementById('food-desc-input').value.trim();
    const dateVal = document.getElementById('food-date-input').value;

    const selectedTags = [];
    document.querySelectorAll('#food-tag-chips .tag-chip.selected').forEach(tc => {
      selectedTags.push(tc.getAttribute('data-tag'));
    });

    if (desc && dateVal) {
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      state.foodLogs.push({
        id: 'f_' + Date.now(),
        date: dateVal,
        mealType: mealType,
        description: desc,
        tags: selectedTags,
        timestamp: timeStr
      });

      state.saveFoodLogs();
      renderFoodView();
      renderCalendarView();

      document.getElementById('food-desc-input').value = '';
      document.getElementById('log-food-modal').classList.remove('active');
    }
  });
}

// ---------------------------------------------------------------------------
// 8. WEIGHT TRACKER CONTROLLER
// ---------------------------------------------------------------------------

let activeRotatorWeight = 74.5;

function setupWeightRotator() {
  const valDisplay = document.getElementById('rotator-weight-val');
  const rangeSlider = document.getElementById('weight-rotator-slider');
  const fastInput = document.getElementById('fast-weight-input');

  function updateRotatorDisplay(newVal) {
    activeRotatorWeight = Math.round(newVal * 10) / 10;
    valDisplay.textContent = activeRotatorWeight.toFixed(1);
    rangeSlider.value = activeRotatorWeight;
    if (fastInput) fastInput.value = activeRotatorWeight.toFixed(1);
  }

  if (state.weightLogs.length > 0) {
    activeRotatorWeight = state.weightLogs[state.weightLogs.length - 1].weight;
  }
  updateRotatorDisplay(activeRotatorWeight);

  rangeSlider.addEventListener('input', (e) => updateRotatorDisplay(parseFloat(e.target.value)));
  if (fastInput) {
    fastInput.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      if (!isNaN(val)) updateRotatorDisplay(val);
    });
  }

  document.getElementById('rot-minus-1').addEventListener('click', () => updateRotatorDisplay(activeRotatorWeight - 1.0));
  document.getElementById('rot-minus-01').addEventListener('click', () => updateRotatorDisplay(activeRotatorWeight - 0.1));
  document.getElementById('rot-plus-01').addEventListener('click', () => updateRotatorDisplay(activeRotatorWeight + 0.1));
  document.getElementById('rot-plus-1').addEventListener('click', () => updateRotatorDisplay(activeRotatorWeight + 1.0));
}

function calculate7DayMovingAverage(logs) {
  return logs.map((log, idx) => {
    const start = Math.max(0, idx - 6);
    const slice = logs.slice(start, idx + 1);
    const avg = slice.reduce((sum, item) => sum + item.weight, 0) / slice.length;
    return Math.round(avg * 10) / 10;
  });
}

function calculateProjectedGoalDate(logs, goal) {
  if (!logs || logs.length < 2 || !goal) return 'Est. N/A';

  const firstLog = logs[0];
  const latestLog = logs[logs.length - 1];

  const dFirst = new Date(firstLog.date);
  const dLatest = new Date(latestLog.date);
  const daysDiff = Math.max(1, Math.round((dLatest - dFirst) / (1000 * 60 * 60 * 24)));

  const weightDiff = latestLog.weight - firstLog.weight;
  const ratePerDay = weightDiff / daysDiff;

  if ((goal < latestLog.weight && ratePerDay >= 0) || (goal > latestLog.weight && ratePerDay <= 0)) {
    return 'Maintain Rate';
  }

  const remainingKg = Math.abs(latestLog.weight - goal);
  const estimatedDays = Math.round(remainingKg / Math.abs(ratePerDay));

  const targetDate = new Date(dLatest);
  targetDate.setDate(targetDate.getDate() + estimatedDays);

  return targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function renderWeightView() {
  const logs = state.weightLogs;
  const goal = state.weightGoal;

  const statCurrent = document.getElementById('stat-current-weight');
  const statGoal = document.getElementById('stat-goal-weight');
  const statChange = document.getElementById('stat-net-change');
  const progressLabel = document.getElementById('progress-percentage-label');
  const progressBar = document.getElementById('progress-bar-fill');
  const movingAvgBadge = document.getElementById('moving-avg-val');
  const projectedGoalBadge = document.getElementById('projected-goal-date');
  const logsList = document.getElementById('logs-list');

  statGoal.textContent = goal ? `${goal} kg` : '--';

  if (logs.length === 0) {
    statCurrent.textContent = '--';
    statChange.textContent = '--';
    movingAvgBadge.textContent = '-- kg';
    projectedGoalBadge.textContent = '--';
    progressLabel.textContent = '0%';
    progressBar.style.width = '0%';
    logsList.innerHTML = `<div class="empty-state">No weight logs yet.</div>`;
    renderWeightChart([]);
    return;
  }

  const latestLog = logs[logs.length - 1];
  const firstLog = logs[0];
  const currentWeight = latestLog.weight;

  statCurrent.textContent = `${currentWeight} kg`;

  const diff = currentWeight - firstLog.weight;
  const diffFormatted = (diff >= 0 ? '+' : '') + diff.toFixed(1) + ' kg';
  statChange.textContent = diffFormatted;
  statChange.className = `stat-card-value ${diff <= 0 ? 'emerald' : 'amber'}`;

  const movingAvgs = calculate7DayMovingAverage(logs);
  const latestAvg = movingAvgs[movingAvgs.length - 1];
  movingAvgBadge.textContent = `${latestAvg} kg`;

  const projectedDate = calculateProjectedGoalDate(logs, goal);
  projectedGoalBadge.textContent = projectedDate;

  if (goal && firstLog.weight !== goal) {
    const totalDist = Math.abs(firstLog.weight - goal);
    const coveredDist = Math.abs(firstLog.weight - currentWeight);
    
    let pct = 0;
    if ((goal < firstLog.weight && currentWeight <= firstLog.weight) ||
        (goal > firstLog.weight && currentWeight >= firstLog.weight)) {
      pct = Math.min(100, Math.round((coveredDist / totalDist) * 100));
    }
    progressLabel.textContent = `${pct}%`;
    progressBar.style.width = `${pct}%`;
  } else {
    progressLabel.textContent = '100%';
    progressBar.style.width = '100%';
  }

  renderWeightChart(logs, movingAvgs);

  logsList.innerHTML = '';
  [...logs].reverse().forEach(log => {
    const item = document.createElement('div');
    item.className = 'log-item';
    item.innerHTML = `
      <div>
        <div class="log-date">${formatDateDisplay(log.date)}</div>
      </div>
      <div style="display: flex; align-items: center; gap: 12px;">
        <span class="log-weight">${log.weight} kg</span>
        <button class="delete-btn" data-log-id="${log.id}">Delete</button>
      </div>
    `;
    item.querySelector('.delete-btn').addEventListener('click', () => deleteWeightLog(log.id));
    logsList.appendChild(item);
  });
}

function renderWeightChart(logs, movingAvgs = []) {
  const container = document.getElementById('chart-container');
  if (!logs || logs.length < 2) {
    container.innerHTML = `<div style="height: 100%; display: flex; align-items: center; justify-content: center; color: var(--text-muted); font-size: 0.85rem;">Log at least 2 entries to view trend line & 7-day average</div>`;
    return;
  }

  const width = 320;
  const height = 180;
  const padding = 25;

  const weights = logs.map(l => l.weight);
  const minW = Math.min(...weights) - 1.5;
  const maxW = Math.max(...weights) + 1.5;
  const rangeY = maxW - minW || 1;

  const points = logs.map((log, i) => {
    const x = padding + (i / (logs.length - 1)) * (width - padding * 2);
    const y = height - padding - ((log.weight - minW) / rangeY) * (height - padding * 2);
    return { x, y, weight: log.weight, date: log.date };
  });

  const pathD = points.reduce((acc, p, idx) => `${acc} ${idx === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`, '');

  let avgPathD = '';
  if (movingAvgs && movingAvgs.length === logs.length) {
    const avgPoints = movingAvgs.map((avgVal, i) => {
      const x = padding + (i / (logs.length - 1)) * (width - padding * 2);
      const y = height - padding - ((avgVal - minW) / rangeY) * (height - padding * 2);
      return { x, y };
    });
    avgPathD = avgPoints.reduce((acc, p, idx) => `${acc} ${idx === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`, '');
  }

  const areaD = `${pathD} L ${points[points.length - 1].x.toFixed(1)} ${height - padding} L ${points[0].x.toFixed(1)} ${height - padding} Z`;

  const circlesHtml = points.map(p => `
    <circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="4.5" fill="#38bdf8" stroke="#0b0f19" stroke-width="2"/>
    <text x="${p.x.toFixed(1)}" y="${(p.y - 10).toFixed(1)}" text-anchor="middle" fill="#94a3b8" font-size="9" font-weight="600">${p.weight}k</text>
  `).join('');

  const firstDate = formatDateDisplay(logs[0].date).split(',')[0];
  const lastDate = formatDateDisplay(logs[logs.length - 1].date).split(',')[0];

  container.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}">
      <defs>
        <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.25"/>
          <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.0"/>
        </linearGradient>
      </defs>

      <line x1="${padding}" y1="${padding}" x2="${width - padding}" y2="${padding}" stroke="rgba(255,255,255,0.05)" stroke-dasharray="4"/>
      <line x1="${padding}" y1="${height / 2}" x2="${width - padding}" y2="${height / 2}" stroke="rgba(255,255,255,0.05)" stroke-dasharray="4"/>
      <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="rgba(255,255,255,0.1)"/>

      <path d="${areaD}" fill="url(#chartFill)"/>
      <path d="${pathD}" fill="none" stroke="#38bdf8" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      ${avgPathD ? `<path d="${avgPathD}" fill="none" stroke="#10b981" stroke-width="2" stroke-dasharray="4" stroke-linecap="round"/>` : ''}

      ${circlesHtml}

      <text x="${padding}" y="${height - 5}" text-anchor="start" fill="#64748b" font-size="9">${firstDate}</text>
      <text x="${width - padding}" y="${height - 5}" text-anchor="end" fill="#64748b" font-size="9">${lastDate}</text>
    </svg>
  `;
}

function deleteWeightLog(logId) {
  if (confirm('Delete this weight entry?')) {
    state.weightLogs = state.weightLogs.filter(l => l.id !== logId);
    state.saveWeightLogs();
    renderWeightView();
    renderCalendarView();
  }
}

// ---------------------------------------------------------------------------
// 9. REAL INTERACTIVE MONTHLY CALENDAR GRID
// ---------------------------------------------------------------------------

function renderCalendarView() {
  const monthTitle = document.getElementById('cal-month-title');
  const monthSummary = document.getElementById('cal-month-summary');
  const daysGrid = document.getElementById('calendar-days-grid');
  const selectedDateLabel = document.getElementById('history-selected-date-label');
  const daySummaryBadge = document.getElementById('history-day-summary-badge');
  const weightValBox = document.getElementById('history-weight-val');
  const foodListContainer = document.getElementById('history-food-list');
  const reviewBoxContainer = document.getElementById('history-review-content');
  const habitsListContainer = document.getElementById('history-habits-list');

  const year = state.calendarYear;
  const month = state.calendarMonth;

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  monthTitle.textContent = `${monthNames[month]} ${year}`;

  daysGrid.innerHTML = '';

  const firstDayObj = new Date(year, month, 1);
  let startingDayOfWeek = firstDayObj.getDay();
  startingDayOfWeek = (startingDayOfWeek === 0) ? 6 : startingDayOfWeek - 1;

  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < startingDayOfWeek; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.className = 'cal-day-cell other-month';
    daysGrid.appendChild(emptyCell);
  }

  const totalHabitsCount = state.habits.length;
  const todayStr = getTodayStr();

  let greenDaysCount = 0;

  for (let day = 1; day <= totalDaysInMonth; day++) {
    const monthStr = String(month + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateStr = `${year}-${monthStr}-${dayStr}`;

    let doneCount = 0;
    state.habits.forEach(h => { if (h.completions.includes(dateStr)) doneCount++; });

    let colorClass = 'cal-none';
    if (totalHabitsCount > 0) {
      if (doneCount === totalHabitsCount) {
        colorClass = 'cal-all';
        greenDaysCount++;
      } else if (doneCount > 0) {
        colorClass = 'cal-some';
      } else {
        colorClass = 'cal-none';
      }
    }

    const hasFood = state.foodLogs.some(f => f.date === dateStr);
    const hasReview = !!state.eveningReviews[dateStr];

    const isSelected = dateStr === state.selectedHistoryDate;
    const isToday = dateStr === todayStr;

    const cell = document.createElement('div');
    cell.className = `cal-day-cell ${colorClass} ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`;
    
    let indicatorsHtml = '';
    if (hasFood || hasReview) {
      indicatorsHtml = `<div class="cell-indicators">${hasFood ? '🍲' : ''}${hasReview ? '📝' : ''}</div>`;
    }

    cell.innerHTML = `
      <span class="cal-day-num">${day}</span>
      ${indicatorsHtml}
    `;

    cell.addEventListener('click', () => {
      state.selectedHistoryDate = dateStr;
      renderCalendarView();
    });

    daysGrid.appendChild(cell);
  }

  const greenPct = Math.round((greenDaysCount / totalDaysInMonth) * 100);
  monthSummary.textContent = `${greenDaysCount}/${totalDaysInMonth} Green Days this Month (${greenPct}%)`;

  const selectedDate = state.selectedHistoryDate || todayStr;
  selectedDateLabel.textContent = formatDateDisplay(selectedDate);

  const weightLog = state.weightLogs.find(w => w.date === selectedDate);
  if (weightLog) {
    weightValBox.textContent = `${weightLog.weight} kg`;
    weightValBox.style.color = 'var(--accent-emerald)';
  } else {
    weightValBox.textContent = 'No weight logged for this date';
    weightValBox.style.color = 'var(--text-muted)';
  }

  const foodLogOnDate = state.foodLogs.filter(f => f.date === selectedDate);
  foodListContainer.innerHTML = '';
  if (foodLogOnDate.length === 0) {
    foodListContainer.innerHTML = `<div style="font-size: 0.85rem; color: var(--text-muted);">No meals recorded for this date</div>`;
  } else {
    foodLogOnDate.forEach(f => {
      const item = document.createElement('div');
      item.style.padding = '6px 0';
      item.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
      item.innerHTML = `
        <span class="food-badge ${f.mealType.replace(/\s+/g, '')}">${f.mealType}</span>
        <span style="font-size: 0.9rem; color: var(--text-primary); margin-left: 8px;">${f.description}</span>
      `;
      foodListContainer.appendChild(item);
    });
  }

  const review = state.eveningReviews[selectedDate];
  if (review) {
    reviewBoxContainer.innerHTML = `
      <div style="margin-bottom: 6px;"><strong>Virtues:</strong> ${review.well || 'N/A'}</div>
      <div style="margin-bottom: 6px;"><strong>Lapses:</strong> ${review.short || 'N/A'}</div>
      <div><strong>Tomorrow Goal:</strong> ${review.tomorrow || 'N/A'}</div>
    `;
    reviewBoxContainer.style.color = 'var(--text-primary)';
  } else {
    reviewBoxContainer.textContent = 'No review recorded for this date';
    reviewBoxContainer.style.color = 'var(--text-muted)';
  }

  habitsListContainer.innerHTML = '';
  if (state.habits.length === 0) {
    habitsListContainer.innerHTML = `<div class="empty-state">No habits created yet.</div>`;
    daySummaryBadge.textContent = '0 Completed';
    return;
  }

  let completedOnDateCount = 0;
  state.habits.forEach(habit => {
    const isDone = habit.completions.includes(selectedDate);
    if (isDone) completedOnDateCount++;

    const item = document.createElement('div');
    item.className = `history-habit-item ${isDone ? 'done' : 'not-done'}`;
    item.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <span>${habit.icon || '🎯'}</span>
        <span>${habit.name}</span>
      </div>
      <span class="${isDone ? 'history-badge-done' : 'history-badge-not-done'}">
        ${isDone ? '✓ Completed' : '○ Pending'}
      </span>
    `;

    item.addEventListener('click', () => toggleHabitCompletion(habit.id, selectedDate));
    habitsListContainer.appendChild(item);
  });

  daySummaryBadge.textContent = `${completedOnDateCount}/${state.habits.length} Done`;
}

function setupCalendarControls() {
  document.getElementById('cal-prev-month-btn').addEventListener('click', () => {
    state.calendarMonth--;
    if (state.calendarMonth < 0) {
      state.calendarMonth = 11;
      state.calendarYear--;
    }
    renderCalendarView();
  });

  document.getElementById('cal-next-month-btn').addEventListener('click', () => {
    state.calendarMonth++;
    if (state.calendarMonth > 11) {
      state.calendarMonth = 0;
      state.calendarYear++;
    }
    renderCalendarView();
  });

  document.getElementById('history-edit-weight-btn').addEventListener('click', () => {
    document.getElementById('weight-date-input').value = state.selectedHistoryDate;
    document.getElementById('log-weight-modal').classList.add('active');
  });
}

// ---------------------------------------------------------------------------
// 10. STOIC REFLECTIONS, EVENING REVIEW & SAVED QUOTES
// ---------------------------------------------------------------------------

let currentQuoteIndex = 0;

function getDailyQuoteIndex() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  return Math.floor(diff / (1000 * 60 * 60 * 24)) % STOIC_QUOTES.length;
}

function renderStoicQuote(quoteObj, isDaily = true) {
  const quoteText = document.getElementById('quote-text');
  const quoteAuthor = document.getElementById('quote-author');
  const quoteExplanation = document.getElementById('quote-explanation');
  const quoteBadgeText = document.getElementById('quote-badge-text');
  const favBtn = document.getElementById('fav-quote-btn');
  const reactionInput = document.getElementById('daily-reaction-input');

  quoteBadgeText.textContent = isDaily ? 'Daily Stoic Reflection' : 'Stoic Wisdom';
  quoteText.textContent = `"${quoteObj.quote}"`;
  quoteAuthor.textContent = `${quoteObj.author} (${quoteObj.source})`;
  quoteExplanation.textContent = quoteObj.explanation;

  const isSaved = state.savedQuotes.includes(quoteObj.id);
  favBtn.className = `fav-quote-btn ${isSaved ? 'saved' : ''}`;
  favBtn.textContent = isSaved ? '❤️' : '🤍';

  const todayStr = getTodayStr();
  reactionInput.value = state.dailyReactions[todayStr] || '';
}

function renderSavedQuotes(filterAuthor = 'ALL') {
  const savedContainer = document.getElementById('saved-quotes-list');
  savedContainer.innerHTML = '';

  const savedObjs = STOIC_QUOTES.filter(q => state.savedQuotes.includes(q.id));
  const filtered = filterAuthor === 'ALL' ? savedObjs : savedObjs.filter(q => q.author === filterAuthor);

  if (filtered.length === 0) {
    savedContainer.innerHTML = `<div class="empty-state"><p>No saved quotes in this category yet. Bookmark quotes using the ❤️ button!</p></div>`;
    return;
  }

  filtered.forEach(q => {
    const card = document.createElement('div');
    card.className = 'saved-quote-card';
    card.innerHTML = `
      <div style="font-size: 0.95rem; font-style: italic; color: var(--text-primary); margin-bottom: 8px;">"${q.quote}"</div>
      <div style="font-size: 0.8rem; font-weight: 700; color: var(--accent-primary);">${q.author}</div>
    `;
    savedContainer.appendChild(card);
  });
}

function initStoicSection() {
  currentQuoteIndex = getDailyQuoteIndex();
  renderStoicQuote(STOIC_QUOTES[currentQuoteIndex], true);

  document.getElementById('stoic-tab-quote').addEventListener('click', () => {
    switchStoicPanel('stoic-panel-quote', 'stoic-tab-quote');
  });
  document.getElementById('stoic-tab-review').addEventListener('click', () => {
    switchStoicPanel('stoic-panel-review', 'stoic-tab-review');
    preloadEveningReview();
  });
  document.getElementById('stoic-tab-saved').addEventListener('click', () => {
    switchStoicPanel('stoic-panel-saved', 'stoic-tab-saved');
    renderSavedQuotes('ALL');
  });

  function switchStoicPanel(panelId, tabId) {
    document.querySelectorAll('.stoic-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.stoic-tab-btn').forEach(t => t.classList.remove('active'));

    document.getElementById(panelId).classList.add('active');
    document.getElementById(tabId).classList.add('active');
  }

  document.getElementById('fav-quote-btn').addEventListener('click', () => {
    triggerHapticFeedback();
    const currObj = STOIC_QUOTES[currentQuoteIndex];
    const idx = state.savedQuotes.indexOf(currObj.id);

    if (idx > -1) {
      state.savedQuotes.splice(idx, 1);
    } else {
      state.savedQuotes.push(currObj.id);
    }

    state.saveSavedQuotes();
    renderStoicQuote(currObj, false);
  });

  document.getElementById('save-reaction-btn').addEventListener('click', () => {
    triggerHapticFeedback();
    const text = document.getElementById('daily-reaction-input').value.trim();
    state.dailyReactions[getTodayStr()] = text;
    state.saveDailyReactions();
    alert('Personal thought saved for today!');
  });

  document.getElementById('evening-review-form').addEventListener('submit', (e) => {
    e.preventDefault();
    triggerHapticFeedback();
    const well = document.getElementById('review-well').value.trim();
    const short = document.getElementById('review-short').value.trim();
    const tomorrow = document.getElementById('review-tomorrow').value.trim();

    state.eveningReviews[getTodayStr()] = { well, short, tomorrow, timestamp: new Date().toISOString() };
    state.saveEveningReviews();
    renderCalendarView();
    alert('Evening Stoic Review saved successfully!');
  });

  document.getElementById('shuffle-quote-btn').addEventListener('click', () => {
    let nextIdx = Math.floor(Math.random() * STOIC_QUOTES.length);
    if (nextIdx === currentQuoteIndex) nextIdx = (currentQuoteIndex + 1) % STOIC_QUOTES.length;
    currentQuoteIndex = nextIdx;
    
    const card = document.getElementById('quote-hero-card');
    card.style.opacity = '0.5';
    setTimeout(() => {
      renderStoicQuote(STOIC_QUOTES[currentQuoteIndex], false);
      card.style.opacity = '1';
    }, 150);
  });
}

function preloadEveningReview() {
  const review = state.eveningReviews[getTodayStr()];
  if (review) {
    document.getElementById('review-well').value = review.well || '';
    document.getElementById('review-short').value = review.short || '';
    document.getElementById('review-tomorrow').value = review.tomorrow || '';
  }
}

// ---------------------------------------------------------------------------
// 11. EXECUTIVE INSIGHTS DASHBOARD & SETTINGS/DATA BACKUP
// ---------------------------------------------------------------------------

function renderInsightsDashboard() {
  let activeStreaks = 0;
  let totalConsistencySum = 0;

  state.habits.forEach(h => {
    const sInfo = calculateStreak(h.completions);
    if (sInfo.streak > 0) activeStreaks++;
    totalConsistencySum += calculateConsistency30Day(h.completions);
  });

  document.getElementById('insight-active-streaks').textContent = activeStreaks;

  const avgConsistency = state.habits.length > 0 ? Math.round(totalConsistencySum / state.habits.length) : 0;
  document.getElementById('insight-consistency-pct').textContent = `${avgConsistency}%`;

  if (state.weightLogs.length > 0) {
    const latest = state.weightLogs[state.weightLogs.length - 1];
    const first = state.weightLogs[0];
    const diff = latest.weight - first.weight;
    const arrow = diff <= 0 ? '↓' : '↑';
    document.getElementById('insight-weight-arrow').textContent = `${arrow} ${Math.abs(diff).toFixed(1)} kg`;

    const avgs = calculate7DayMovingAverage(state.weightLogs);
    document.getElementById('insight-weight-7d').textContent = `7-Day Avg: ${avgs[avgs.length - 1]} kg`;
  }

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const totalHabits = state.habits.length;

  let greenDays = 0;
  for (let day = 1; day <= totalDays; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    let done = 0;
    state.habits.forEach(h => { if (h.completions.includes(dateStr)) done++; });
    if (totalHabits > 0 && done === totalHabits) greenDays++;
  }

  document.getElementById('insight-green-days').textContent = greenDays;
  document.getElementById('insight-green-pct').textContent = `${Math.round((greenDays / totalDays) * 100)}% of month`;

  const breakdownContainer = document.getElementById('insights-habits-breakdown');
  breakdownContainer.innerHTML = '';
  state.habits.forEach(h => {
    const sInfo = calculateStreak(h.completions);
    const cPct = calculateConsistency30Day(h.completions);

    const item = document.createElement('div');
    item.style.padding = '8px 12px';
    item.style.background = 'rgba(255,255,255,0.03)';
    item.style.borderRadius = 'var(--radius-md)';
    item.style.display = 'flex';
    item.style.alignItems = 'center';
    item.style.justifyContent = 'space-between';

    item.innerHTML = `
      <span>${h.icon || '🎯'} ${h.name}</span>
      <span style="font-size: 0.8rem; font-weight: 700; color: var(--accent-emerald);">🔥 ${sInfo.streak}d | 🎯 ${cPct}%</span>
    `;
    breakdownContainer.appendChild(item);
  });
}

// ---------------------------------------------------------------------------
// 12. P0A-1A DATA BACKUP & DRY-RUN INSPECTOR ENGINE (HARDENED)
// ---------------------------------------------------------------------------

function calculatePayloadRecordCounts(payload) {
  if (!payload || typeof payload !== 'object') return { habits: 0, completions: 0, weightLogs: 0, foodLogs: 0, eveningReviews: 0, dailyReactions: 0, savedQuotes: 0 };
  
  let completionsCount = 0;
  const habits = Array.isArray(payload.habits) ? payload.habits : [];
  habits.forEach(h => { completionsCount += (h.completions || []).length; });

  return {
    habits: habits.length,
    completions: completionsCount,
    weightLogs: Array.isArray(payload.weightLogs) ? payload.weightLogs.length : 0,
    foodLogs: Array.isArray(payload.foodLogs) ? payload.foodLogs.length : 0,
    eveningReviews: typeof payload.eveningReviews === 'object' && payload.eveningReviews !== null ? Object.keys(payload.eveningReviews).length : 0,
    dailyReactions: typeof payload.dailyReactions === 'object' && payload.dailyReactions !== null ? Object.keys(payload.dailyReactions).length : 0,
    savedQuotes: Array.isArray(payload.savedQuotes) ? payload.savedQuotes.length : 0
  };
}

async function computeEnvelopeChecksum(envelope) {
  const checksumEnvelope = {
    schemaVersion: envelope.schemaVersion,
    appVersion: envelope.appVersion,
    exportTimestamp: envelope.exportTimestamp,
    timezone: envelope.timezone,
    recordCounts: envelope.recordCounts,
    payload: envelope.payload
  };
  const canonicalString = toCanonicalJsonString(checksumEnvelope);
  return await sha256Hex(canonicalString);
}

async function generatePersonalDataBackup() {
  const payload = {
    habits: state.habits,
    weightLogs: state.weightLogs,
    weightGoal: state.weightGoal,
    foodLogs: state.foodLogs,
    eveningReviews: state.eveningReviews,
    dailyReactions: state.dailyReactions,
    savedQuotes: state.savedQuotes,
    settings: state.settings,
    healthHistory: state.healthHistory
  };

  const recordCounts = calculatePayloadRecordCounts(payload);

  const rawEnvelope = {
    schemaVersion: APP_SCHEMA_VERSION,
    appVersion: APP_VERSION,
    exportTimestamp: new Date().toISOString(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata',
    recordCounts: recordCounts,
    payload: payload
  };

  const checksum = await computeEnvelopeChecksum(rawEnvelope);

  const backupPackage = {
    ...rawEnvelope,
    checksum: checksum
  };

  downloadFile(`wellness_backup_${getTodayStr()}.json`, JSON.stringify(backupPackage, null, 2), 'application/json');
}

async function validateBackupEnvelope(jsonText) {
  const res = {
    parseValid: false,
    structureValid: false,
    checksumValid: false,
    schemaCompatible: false,
    recordCountsValid: false,
    legacyFormat: false,
    issues: [],
    backup: null,
    actualCounts: null
  };

  let backup;
  try {
    backup = JSON.parse(jsonText);
    res.parseValid = true;
    res.backup = backup;
  } catch (err) {
    res.issues.push('Invalid JSON formatting.');
    return res;
  }

  if (!backup || typeof backup !== 'object') {
    res.issues.push('Root JSON entity is not an object.');
    return res;
  }

  // Check Legacy Unversioned Backup vs Formal Schema
  if (backup.schemaVersion === undefined || backup.schemaVersion === null) {
    res.legacyFormat = true;
    res.schemaCompatible = true;
    
    // Legacy backup payload check
    const legacyPayload = backup.payload || backup;
    if (typeof legacyPayload === 'object' && (legacyPayload.habits || legacyPayload.weightLogs || legacyPayload.foodLogs)) {
      res.structureValid = true;
      res.actualCounts = calculatePayloadRecordCounts(legacyPayload);
      res.recordCountsValid = true;
    } else {
      res.issues.push('Legacy backup is missing valid payload collections.');
    }
    return res;
  }

  // Formal Schema Validation
  if (typeof backup.schemaVersion !== 'number') {
    res.issues.push('Invalid schemaVersion type.');
  }

  if (!backup.payload || typeof backup.payload !== 'object') {
    res.issues.push('Missing or invalid payload object.');
    return res;
  }
  res.structureValid = true;

  // Schema Compatibility
  if (backup.schemaVersion <= APP_SCHEMA_VERSION) {
    res.schemaCompatible = true;
  } else {
    res.issues.push(`Incompatible future schema version v${backup.schemaVersion}.`);
  }

  // Calculate & Compare Record Counts
  res.actualCounts = calculatePayloadRecordCounts(backup.payload);
  if (backup.recordCounts && typeof backup.recordCounts === 'object') {
    let countsMatch = true;
    Object.keys(res.actualCounts).forEach(k => {
      if (backup.recordCounts[k] !== undefined && backup.recordCounts[k] !== res.actualCounts[k]) {
        countsMatch = false;
      }
    });
    res.recordCountsValid = countsMatch;
    if (!countsMatch) {
      res.issues.push('Declared record counts do not match calculated payload inventory.');
    }
  } else {
    res.issues.push('Missing recordCounts inventory.');
  }

  // SHA-256 Integrity Checksum Validation over Envelope
  if (backup.checksum && typeof backup.checksum === 'string') {
    const expectedChecksum = await computeEnvelopeChecksum(backup);
    if (backup.checksum === expectedChecksum) {
      res.checksumValid = true;
    } else {
      res.issues.push('Failed integrity checksum validation (tampered or altered metadata/payload).');
    }
  } else {
    res.issues.push('Missing integrity checksum in metadata.');
  }

  return res;
}

async function inspectBackupDryRun(jsonText) {
  const previewModal = document.getElementById('dryrun-preview-modal');
  const timestampEl = document.getElementById('dryrun-timestamp');
  const appVerEl = document.getElementById('dryrun-app-version');
  const schemaVerEl = document.getElementById('dryrun-schema-version');
  const tzEl = document.getElementById('dryrun-timezone');
  const checksumStatusEl = document.getElementById('dryrun-checksum-status');
  const compatStatusEl = document.getElementById('dryrun-compat-status');
  const countsContainer = document.getElementById('dryrun-counts-container');

  const validation = await validateBackupEnvelope(jsonText);

  if (!validation.parseValid) {
    alert('❌ Invalid JSON File: Could not parse backup contents.');
    return;
  }

  const backup = validation.backup;

  if (validation.legacyFormat) {
    schemaVerEl.textContent = 'Legacy backup — schema version not recorded';
    appVerEl.textContent = backup.appVersion || 'Legacy / v1';
    timestampEl.textContent = backup.exportTimestamp ? formatDateDisplay(backup.exportTimestamp.split('T')[0]) : 'Not Recorded';
    tzEl.textContent = backup.timezone || 'Not Recorded';
    checksumStatusEl.textContent = '⚠️ Unchecksummed Legacy Backup';
    checksumStatusEl.style.color = 'var(--accent-amber)';
    compatStatusEl.textContent = '✓ Legacy Format Compatible';
    compatStatusEl.style.color = 'var(--accent-emerald)';
  } else {
    schemaVerEl.textContent = `Version ${backup.schemaVersion}`;
    appVerEl.textContent = backup.appVersion || 'Unknown';
    timestampEl.textContent = backup.exportTimestamp ? formatDateDisplay(backup.exportTimestamp.split('T')[0]) + ' ' + backup.exportTimestamp.split('T')[1].slice(0,5) : 'Unknown';
    tzEl.textContent = backup.timezone || 'Unknown';

    if (validation.checksumValid) {
      checksumStatusEl.textContent = '✓ Passed Integrity Checksum';
      checksumStatusEl.style.color = 'var(--accent-emerald)';
    } else {
      checksumStatusEl.textContent = '❌ Integrity Checksum Mismatch';
      checksumStatusEl.style.color = 'var(--accent-rose)';
    }

    if (validation.schemaCompatible) {
      compatStatusEl.textContent = `✓ Compatible (App Schema v${APP_SCHEMA_VERSION})`;
      compatStatusEl.style.color = 'var(--accent-emerald)';
    } else {
      compatStatusEl.textContent = `❌ Incompatible (Future Schema v${backup.schemaVersion})`;
      compatStatusEl.style.color = 'var(--accent-rose)';
    }
  }

  const counts = validation.actualCounts || { habits: 0, completions: 0, weightLogs: 0, foodLogs: 0, eveningReviews: 0, dailyReactions: 0, savedQuotes: 0 };
  const countsMismatchNotice = (!validation.legacyFormat && !validation.recordCountsValid) ? `<div style="grid-column: 1 / -1; color: var(--accent-amber); font-weight: 700; margin-top: 4px;">⚠️ Record Inventory Mismatch Detected</div>` : '';

  countsContainer.innerHTML = `
    <div><strong>Habits:</strong> ${counts.habits}</div>
    <div><strong>Completions:</strong> ${counts.completions}</div>
    <div><strong>Weight Entries:</strong> ${counts.weightLogs}</div>
    <div><strong>Food Entries:</strong> ${counts.foodLogs}</div>
    <div><strong>Stoic Reviews:</strong> ${counts.eveningReviews}</div>
    <div><strong>Saved Quotes:</strong> ${counts.savedQuotes}</div>
    ${countsMismatchNotice}
  `;

  previewModal.classList.add('active');
}

function setupDataExport() {
  document.getElementById('export-json-btn').addEventListener('click', () => {
    generatePersonalDataBackup();
  });

  const fileInput = document.getElementById('import-backup-file-input');
  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        inspectBackupDryRun(event.target.result);
        fileInput.value = '';
      };
      reader.readAsText(file);
    }
  });
}

function downloadFile(filename, text, type) {
  const blob = new Blob([text], { type: type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ---------------------------------------------------------------------------
// 13. AUTOMATED DAILY HEALTH CHECK & DIAGNOSTICS LOG
// ---------------------------------------------------------------------------

async function runDailyHealthCheck() {
  const todayStr = getTodayStr();
  const lastCheck = localStorage.getItem(STORAGE_KEYS.LAST_HEALTH_CHECK);

  let uptimeOk = false;
  let persistenceOk = false;
  let errors = [];

  try {
    const res = await fetch(PUBLIC_LIVE_URL, { method: 'HEAD' });
    uptimeOk = res.ok || res.status === 200 || res.status === 304;
  } catch (e) {
    errors.push('Uptime Check failed: ' + e.message);
  }

  try {
    const dbRes = await fetch(CLOUD_SYNC_ENDPOINT);
    persistenceOk = dbRes.ok;
  } catch (e) {
    persistenceOk = false;
    errors.push('Persistence Check failed: ' + e.message);
  }

  const statusText = `[${todayStr}] Uptime: ${uptimeOk ? 'OK' : 'FAIL'} | DB: ${persistenceOk ? 'OK' : 'FAIL'}`;
  
  state.healthHistory.unshift(statusText);
  state.healthHistory = state.healthHistory.slice(0, 7);
  localStorage.setItem(STORAGE_KEYS.HEALTH_HISTORY, JSON.stringify(state.healthHistory));

  const dot = document.getElementById('health-status-dot');
  const textEl = document.getElementById('health-status-text');
  const logBox = document.getElementById('health-log-box');

  if (dot && textEl && logBox) {
    if (uptimeOk && persistenceOk) {
      dot.className = 'status-dot-indicator green';
      textEl.textContent = `Last check (${todayStr}): Operational`;
    } else {
      dot.className = 'status-dot-indicator red';
      textEl.textContent = `Last check (${todayStr}): Issues detected (${errors.join('; ')})`;
    }
    logBox.innerHTML = state.healthHistory.map(l => `<div>${l}</div>`).join('');
  }

  localStorage.setItem(STORAGE_KEYS.LAST_HEALTH_CHECK, todayStr);
}

// ---------------------------------------------------------------------------
// 14. MODAL & NAVIGATION CONTROLLERS
// ---------------------------------------------------------------------------

function setupNavigation() {
  const navTabs = document.querySelectorAll('.nav-tab');
  const tabViews = document.querySelectorAll('.tab-view');
  const headerTitle = document.getElementById('header-title');
  const headerIcon = document.getElementById('header-brand-icon');
  const headerBtn = document.getElementById('header-action-btn');
  const headerBtnText = document.getElementById('header-btn-text');

  const navMap = {
    habits: { title: 'Habits', icon: '🌱', showBtn: true, btnText: 'Add Habit' },
    food: { title: 'Food Journal', icon: '🍲', showBtn: true, btnText: 'Log Meal' },
    weight: { title: 'Weight Tracker', icon: '⚖️', showBtn: false, btnText: '' },
    history: { title: 'Calendar History', icon: '📅', showBtn: false, btnText: '' },
    stoic: { title: 'Stoic Mind', icon: '🏛️', showBtn: false, btnText: '' }
  };

  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      triggerHapticFeedback();
      const targetTab = tab.getAttribute('data-tab');

      navTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      tabViews.forEach(v => v.classList.remove('active'));
      document.getElementById(`${targetTab}-view`).classList.add('active');

      const config = navMap[targetTab];
      headerTitle.textContent = config.title;
      headerIcon.textContent = config.icon;
      headerBtn.style.display = config.showBtn ? 'flex' : 'none';
      if (headerBtnText && config.btnText) headerBtnText.textContent = config.btnText;

      state.activeTab = targetTab;
    });
  });

  document.getElementById('header-date').textContent = formatDateDisplay(getTodayStr());
}

function setupModals() {
  const addHabitModal = document.getElementById('add-habit-modal');
  const logWeightModal = document.getElementById('log-weight-modal');
  const setGoalModal = document.getElementById('set-goal-modal');
  const logFoodModal = document.getElementById('log-food-modal');
  const insightsModal = document.getElementById('insights-modal');
  const settingsModal = document.getElementById('settings-modal');

  document.getElementById('header-action-btn').addEventListener('click', () => {
    if (state.activeTab === 'food') {
      document.getElementById('food-date-input').value = getTodayStr();
      logFoodModal.classList.add('active');
    } else {
      addHabitModal.classList.add('active');
    }
  });

  document.getElementById('insights-btn').addEventListener('click', () => {
    renderInsightsDashboard();
    insightsModal.classList.add('active');
  });

  document.getElementById('settings-btn').addEventListener('click', () => {
    settingsModal.classList.add('active');
  });

  document.getElementById('log-weight-btn').addEventListener('click', () => {
    document.getElementById('weight-date-input').value = getTodayStr();
    logWeightModal.classList.add('active');
  });

  document.getElementById('set-goal-btn').addEventListener('click', () => {
    document.getElementById('goal-weight-input').value = state.weightGoal || '';
    setGoalModal.classList.add('active');
  });

  document.querySelectorAll('.close-modal-btn, .modal-overlay').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target === el || e.target.classList.contains('modal-close-btn')) {
        document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
      }
    });
  });

  let selectedEmoji = '📞';
  const emojiOptions = document.querySelectorAll('.emoji-option');
  emojiOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      emojiOptions.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      selectedEmoji = opt.getAttribute('data-emoji');
    });
  });

  document.getElementById('add-habit-form').addEventListener('submit', (e) => {
    e.preventDefault();
    triggerHapticFeedback();
    const nameInput = document.getElementById('habit-name-input');
    const categoryInput = document.getElementById('habit-category-input');
    const name = nameInput.value.trim();
    if (name) {
      state.habits.push({
        id: 'h_' + Date.now(),
        name: name,
        icon: selectedEmoji,
        category: categoryInput.value || 'General',
        createdAt: getTodayStr(),
        completions: []
      });
      state.saveHabits();
      renderHabitsView();
      renderCalendarView();
      nameInput.value = '';
      addHabitModal.classList.remove('active');
    }
  });

  document.getElementById('log-weight-form').addEventListener('submit', (e) => {
    e.preventDefault();
    triggerHapticFeedback();
    const weightVal = activeRotatorWeight;
    const dateVal = document.getElementById('weight-date-input').value;

    if (weightVal && dateVal) {
      const existingIdx = state.weightLogs.findIndex(l => l.date === dateVal);
      if (existingIdx > -1) {
        state.weightLogs[existingIdx].weight = weightVal;
      } else {
        state.weightLogs.push({
          id: 'w_' + Date.now(),
          weight: weightVal,
          date: dateVal
        });
      }
      state.saveWeightLogs();
      renderWeightView();
      renderCalendarView();
      logWeightModal.classList.remove('active');
    }
  });

  document.getElementById('set-goal-form').addEventListener('submit', (e) => {
    e.preventDefault();
    triggerHapticFeedback();
    const goalVal = parseFloat(document.getElementById('goal-weight-input').value);
    if (goalVal) {
      state.weightGoal = goalVal;
      state.saveWeightGoal();
      renderWeightView();
      setGoalModal.classList.remove('active');
    }
  });
}

// ---------------------------------------------------------------------------
// 15. INITIALIZATION & SERVICE WORKER
// ---------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  setupPasscodeLock();
  setupNavigation();
  setupCategoryChips();
  setupFoodSection();
  setupWeightRotator();
  setupCalendarControls();
  setupReminderBanner();
  setupModals();
  setupDataExport();
  
  renderHabitsView();
  renderFoodView();
  renderWeightView();
  renderCalendarView();
  initStoicSection();

  state.pullFromCloud();
  runDailyHealthCheck();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
      .then((reg) => console.log('Service Worker registered:', reg.scope))
      .catch((err) => console.error('Service Worker failed:', err));
  }
});
