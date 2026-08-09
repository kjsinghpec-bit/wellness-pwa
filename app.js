/* Wellness PWA Main Application Script */

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
// 2. SECURE PASSCODE HASH SECURITY & CLOUD DATABASE ENGINE
// ---------------------------------------------------------------------------
const TARGET_PASSCODE_HASH = "434f4d14c1eb231306b51aaa160c021b63670ac6ca67fb8e403f4500983dd1e4";

async function sha256Hex(str) {
  const msgBuffer = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

const STORAGE_KEYS = {
  HABITS: 'wellness_habits_data',
  WEIGHT_LOGS: 'wellness_weight_logs_data',
  WEIGHT_GOAL: 'wellness_weight_goal_data',
  SESSION_UNLOCKED: 'wellness_session_unlocked',
  LAST_HEALTH_CHECK: 'wellness_last_health_check_date'
};

const CLOUD_SYNC_ENDPOINT = 'https://crudcrud.com/api/df9fe4cc2a2b4f0ba158f3f54b74b576/wellness/6a7872454db36503e87d5f2b';
const PUBLIC_LIVE_URL = 'https://kjsinghpec-bit.github.io/wellness-pwa/';

function getTodayStr() {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

function formatDateDisplay(dateStr) {
  const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', options);
}

const DEFAULT_HABITS = [
  {
    id: 'h1',
    name: 'Morning Hydration (500ml)',
    icon: '💧',
    createdAt: getTodayStr(),
    completions: [getTodayStr()]
  },
  {
    id: 'h2',
    name: '30 Min Workout / Walk',
    icon: '🏃',
    createdAt: getTodayStr(),
    completions: []
  },
  {
    id: 'h3',
    name: '10 Min Stoic Reading',
    icon: '📚',
    createdAt: getTodayStr(),
    completions: [getTodayStr()]
  }
];

const DEFAULT_WEIGHT_LOGS = [
  { id: 'w1', weight: 175.0, date: '2026-07-20' },
  { id: 'w2', weight: 173.8, date: '2026-07-27' },
  { id: 'w3', weight: 172.5, date: '2026-08-02' },
  { id: 'w4', weight: 171.2, date: '2026-08-09' }
];

const DEFAULT_GOAL = 165.0;

class AppState {
  constructor() {
    this.habits = this.load(STORAGE_KEYS.HABITS, DEFAULT_HABITS);
    this.weightLogs = this.load(STORAGE_KEYS.WEIGHT_LOGS, DEFAULT_WEIGHT_LOGS);
    this.weightGoal = this.load(STORAGE_KEYS.WEIGHT_GOAL, DEFAULT_GOAL);
    this.activeTab = 'habits';
    this.selectedHistoryDate = getTodayStr();
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

  saveHabits() {
    this.save(STORAGE_KEYS.HABITS, this.habits);
  }

  saveWeightLogs() {
    this.weightLogs.sort((a, b) => new Date(a.date) - new Date(b.date));
    this.save(STORAGE_KEYS.WEIGHT_LOGS, this.weightLogs);
  }

  saveWeightGoal() {
    this.save(STORAGE_KEYS.WEIGHT_GOAL, this.weightGoal);
  }

  async syncToCloud() {
    try {
      const payload = {
        habits: this.habits,
        weightLogs: this.weightLogs,
        weightGoal: this.weightGoal,
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
          this.weightGoal = record.weightGoal || DEFAULT_GOAL;
          
          localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(this.habits));
          localStorage.setItem(STORAGE_KEYS.WEIGHT_LOGS, JSON.stringify(this.weightLogs));
          localStorage.setItem(STORAGE_KEYS.WEIGHT_GOAL, JSON.stringify(this.weightGoal));

          renderHabitsView();
          renderWeightView();
          renderHistoryView();
        }
      }
    } catch (e) {}
  }
}

const state = new AppState();

// ---------------------------------------------------------------------------
// 3. SECURE PASSCODE UI CONTROLLER
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
        setTimeout(() => {
          verifyPasscode(currentPinInput);
        }, 120);
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
// 4. HABIT TRACKER CONTROLLER
// ---------------------------------------------------------------------------

function calculateStreak(completions) {
  if (!completions || completions.length === 0) return 0;
  
  const set = new Set(completions);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 0;
  let checkDate = new Date(today);

  const todayStr = checkDate.toISOString().split('T')[0];
  if (!set.has(todayStr)) {
    checkDate.setDate(checkDate.getDate() - 1);
    const yesterdayStr = checkDate.toISOString().split('T')[0];
    if (!set.has(yesterdayStr)) {
      return 0;
    }
  }

  while (true) {
    const dateStr = checkDate.toISOString().split('T')[0];
    if (set.has(dateStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
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

  if (state.habits.length === 0) {
    habitsListContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🌱</div>
        <p>No habits added yet. Tap <strong>+ Add Habit</strong> above to get started!</p>
      </div>
    `;
    completionPill.textContent = '0/0 Done';
    return;
  }

  const todayStr = getTodayStr();
  let doneTodayCount = 0;
  const daysWindow = getPast7Days();

  state.habits.forEach((habit) => {
    const isDoneToday = habit.completions.includes(todayStr);
    if (isDoneToday) doneTodayCount++;

    const streak = calculateStreak(habit.completions);

    const weeklyRowHtml = daysWindow.map(d => {
      const dateStr = d.toISOString().split('T')[0];
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
            <div class="streak-badge">
              🔥 ${streak} ${streak === 1 ? 'day' : 'days'} streak
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
      toggleHabitCompletion(habit.id);
    });

    card.querySelector('.delete-btn').addEventListener('click', () => {
      deleteHabit(habit.id);
    });

    habitsListContainer.appendChild(card);
  });

  completionPill.textContent = `${doneTodayCount}/${state.habits.length} Done`;
  habitsSubtitle.textContent = `${doneTodayCount} of ${state.habits.length} completed for today`;
}

function toggleHabitCompletion(habitId) {
  const habit = state.habits.find(h => h.id === habitId);
  if (!habit) return;

  const todayStr = getTodayStr();
  const idx = habit.completions.indexOf(todayStr);

  if (idx > -1) {
    habit.completions.splice(idx, 1);
  } else {
    habit.completions.push(todayStr);
  }

  state.saveHabits();
  renderHabitsView();
  renderHistoryView();
}

function deleteHabit(habitId) {
  if (confirm('Are you sure you want to delete this habit?')) {
    state.habits = state.habits.filter(h => h.id !== habitId);
    state.saveHabits();
    renderHabitsView();
    renderHistoryView();
  }
}

// ---------------------------------------------------------------------------
// 5. WEIGHT TRACKER CONTROLLER
// ---------------------------------------------------------------------------

function renderWeightView() {
  const logs = state.weightLogs;
  const goal = state.weightGoal;

  const statCurrent = document.getElementById('stat-current-weight');
  const statGoal = document.getElementById('stat-goal-weight');
  const statChange = document.getElementById('stat-net-change');
  const progressLabel = document.getElementById('progress-percentage-label');
  const progressBar = document.getElementById('progress-bar-fill');
  const logsList = document.getElementById('logs-list');

  statGoal.textContent = goal ? `${goal} lbs` : '--';

  if (logs.length === 0) {
    statCurrent.textContent = '--';
    statChange.textContent = '--';
    progressLabel.textContent = '0%';
    progressBar.style.width = '0%';
    logsList.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">⚖️</div>
        <p>No weight logs yet. Tap <strong>Log Weight</strong> to record your weight!</p>
      </div>
    `;
    renderWeightChart([]);
    return;
  }

  const latestLog = logs[logs.length - 1];
  const firstLog = logs[0];
  const currentWeight = latestLog.weight;

  statCurrent.textContent = `${currentWeight} lbs`;

  const diff = currentWeight - firstLog.weight;
  const diffFormatted = (diff >= 0 ? '+' : '') + diff.toFixed(1) + ' lbs';
  statChange.textContent = diffFormatted;
  statChange.className = `stat-card-value ${diff <= 0 ? 'emerald' : 'amber'}`;

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

  renderWeightChart(logs);

  logsList.innerHTML = '';
  [...logs].reverse().forEach(log => {
    const item = document.createElement('div');
    item.className = 'log-item';
    item.innerHTML = `
      <div>
        <div class="log-date">${formatDateDisplay(log.date)}</div>
      </div>
      <div style="display: flex; align-items: center; gap: 12px;">
        <span class="log-weight">${log.weight} lbs</span>
        <button class="delete-btn" data-log-id="${log.id}">&times;</button>
      </div>
    `;
    item.querySelector('.delete-btn').addEventListener('click', () => {
      deleteWeightLog(log.id);
    });
    logsList.appendChild(item);
  });
}

function renderWeightChart(logs) {
  const container = document.getElementById('chart-container');
  if (!logs || logs.length < 2) {
    container.innerHTML = `
      <div style="height: 100%; display: flex; align-items: center; justify-content: center; color: var(--text-muted); font-size: 0.85rem;">
        Log at least 2 entries to see your trend graph
      </div>
    `;
    return;
  }

  const width = 320;
  const height = 180;
  const padding = 25;

  const weights = logs.map(l => l.weight);
  const minW = Math.min(...weights) - 2;
  const maxW = Math.max(...weights) + 2;

  const rangeY = maxW - minW || 1;

  const points = logs.map((log, i) => {
    const x = padding + (i / (logs.length - 1)) * (width - padding * 2);
    const y = height - padding - ((log.weight - minW) / rangeY) * (height - padding * 2);
    return { x, y, weight: log.weight, date: log.date };
  });

  const pathD = points.reduce((acc, p, idx) => {
    return `${acc} ${idx === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x.toFixed(1)} ${height - padding} L ${points[0].x.toFixed(1)} ${height - padding} Z`;

  const circlesHtml = points.map(p => `
    <circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="4.5" fill="#38bdf8" stroke="#0b0f19" stroke-width="2"/>
    <text x="${p.x.toFixed(1)}" y="${(p.y - 10).toFixed(1)}" text-anchor="middle" fill="#94a3b8" font-size="10" font-weight="600">${p.weight}</text>
  `).join('');

  const firstDate = formatDateDisplay(logs[0].date).split(',')[0];
  const lastDate = formatDateDisplay(logs[logs.length - 1].date).split(',')[0];

  container.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}">
      <defs>
        <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.0"/>
        </linearGradient>
      </defs>

      <line x1="${padding}" y1="${padding}" x2="${width - padding}" y2="${padding}" stroke="rgba(255,255,255,0.05)" stroke-dasharray="4"/>
      <line x1="${padding}" y1="${height / 2}" x2="${width - padding}" y2="${height / 2}" stroke="rgba(255,255,255,0.05)" stroke-dasharray="4"/>
      <line x1="${padding}" y1="${height - padding}" x2="${width - padding}" y2="${height - padding}" stroke="rgba(255,255,255,0.1)"/>

      <path d="${areaD}" fill="url(#chartFill)"/>
      <path d="${pathD}" fill="none" stroke="#38bdf8" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>

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
    renderHistoryView();
  }
}

// ---------------------------------------------------------------------------
// 6. FULL HISTORY VIEW CONTROLLER (Database-backed lifetime inspection)
// ---------------------------------------------------------------------------

function renderHistoryView() {
  const datePicker = document.getElementById('history-date-picker');
  const selectedDateLabel = document.getElementById('history-selected-date-label');
  const daySummaryBadge = document.getElementById('history-day-summary-badge');
  const weightValBox = document.getElementById('history-weight-val');
  const habitsListContainer = document.getElementById('history-habits-list');
  const totalDaysPill = document.getElementById('history-total-days-pill');

  const selectedDate = state.selectedHistoryDate || getTodayStr();
  datePicker.value = selectedDate;

  // Calculate unique recorded dates across habits and weight logs
  const allRecordedDates = new Set();
  state.weightLogs.forEach(w => allRecordedDates.add(w.date));
  state.habits.forEach(h => h.completions.forEach(d => allRecordedDates.add(d)));
  
  totalDaysPill.textContent = `${allRecordedDates.size} Days Logged`;
  selectedDateLabel.textContent = formatDateDisplay(selectedDate);

  // Weight for selected date
  const weightLog = state.weightLogs.find(w => w.date === selectedDate);
  if (weightLog) {
    weightValBox.textContent = `${weightLog.weight} lbs`;
    weightValBox.style.color = 'var(--accent-emerald)';
  } else {
    weightValBox.textContent = 'No weight logged on this date';
    weightValBox.style.color = 'var(--text-muted)';
  }

  // Habits completed on selected date
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
      <div style="display: flex; align-items: center; gap: 8px;">
        <span>${habit.icon || '🎯'}</span>
        <span>${habit.name}</span>
      </div>
      <span class="${isDone ? 'history-badge-done' : 'history-badge-not-done'}">
        ${isDone ? '✓ Completed' : '○ Pending'}
      </span>
    `;
    habitsListContainer.appendChild(item);
  });

  daySummaryBadge.textContent = `${completedOnDateCount}/${state.habits.length} Done`;
}

function setupHistoryControls() {
  const datePicker = document.getElementById('history-date-picker');
  const prevBtn = document.getElementById('history-prev-day-btn');
  const todayBtn = document.getElementById('history-today-btn');
  const nextBtn = document.getElementById('history-next-day-btn');

  datePicker.addEventListener('change', (e) => {
    if (e.target.value) {
      state.selectedHistoryDate = e.target.value;
      renderHistoryView();
    }
  });

  prevBtn.addEventListener('click', () => {
    const d = new Date(state.selectedHistoryDate + 'T00:00:00');
    d.setDate(d.getDate() - 1);
    state.selectedHistoryDate = d.toISOString().split('T')[0];
    renderHistoryView();
  });

  todayBtn.addEventListener('click', () => {
    state.selectedHistoryDate = getTodayStr();
    renderHistoryView();
  });

  nextBtn.addEventListener('click', () => {
    const d = new Date(state.selectedHistoryDate + 'T00:00:00');
    d.setDate(d.getDate() + 1);
    state.selectedHistoryDate = d.toISOString().split('T')[0];
    renderHistoryView();
  });
}

// ---------------------------------------------------------------------------
// 7. STOIC REFLECTIONS CONTROLLER
// ---------------------------------------------------------------------------

let currentQuoteIndex = 0;

function getDailyQuoteIndex() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return dayOfYear % STOIC_QUOTES.length;
}

function renderStoicQuote(quoteObj, isDaily = true) {
  const quoteText = document.getElementById('quote-text');
  const quoteAuthor = document.getElementById('quote-author');
  const quoteExplanation = document.getElementById('quote-explanation');
  const quoteBadgeText = document.getElementById('quote-badge-text');

  quoteBadgeText.textContent = isDaily ? 'Daily Stoic Reflection' : 'Stoic Wisdom';
  quoteText.textContent = `"${quoteObj.quote}"`;
  quoteAuthor.textContent = `${quoteObj.author} (${quoteObj.source})`;
  quoteExplanation.textContent = quoteObj.explanation;
}

function initStoicSection() {
  currentQuoteIndex = getDailyQuoteIndex();
  renderStoicQuote(STOIC_QUOTES[currentQuoteIndex], true);

  document.getElementById('shuffle-quote-btn').addEventListener('click', () => {
    let nextIdx = Math.floor(Math.random() * STOIC_QUOTES.length);
    if (nextIdx === currentQuoteIndex) {
      nextIdx = (currentQuoteIndex + 1) % STOIC_QUOTES.length;
    }
    currentQuoteIndex = nextIdx;
    
    const card = document.getElementById('quote-hero-card');
    card.style.opacity = '0.5';
    card.style.transform = 'scale(0.98)';
    setTimeout(() => {
      renderStoicQuote(STOIC_QUOTES[currentQuoteIndex], false);
      card.style.opacity = '1';
      card.style.transform = 'scale(1)';
    }, 150);
  });
}

// ---------------------------------------------------------------------------
// 8. AUTOMATED DAILY HEALTH CHECK (Uptime, Persistence & Error Logging)
// ---------------------------------------------------------------------------

async function runDailyHealthCheck() {
  const todayStr = getTodayStr();
  const lastCheck = localStorage.getItem(STORAGE_KEYS.LAST_HEALTH_CHECK);

  // Run once per day on first session load
  if (lastCheck === todayStr) return;

  console.log('--- STARTING AUTOMATED DAILY HEALTH CHECK ---');
  let uptimeOk = false;
  let persistenceOk = false;
  let errors = [];

  // 1. Uptime Check (Production URL reachability)
  try {
    const res = await fetch(PUBLIC_LIVE_URL, { method: 'HEAD' });
    uptimeOk = res.ok || res.status === 200 || res.status === 304;
  } catch (e) {
    uptimeOk = false;
    errors.push('Uptime Check failed: ' + e.message);
  }

  // 2. Persistence Check (Cloud Database endpoint read)
  try {
    const dbRes = await fetch(CLOUD_SYNC_ENDPOINT);
    persistenceOk = dbRes.ok;
  } catch (e) {
    persistenceOk = false;
    errors.push('Persistence Check failed: ' + e.message);
  }

  // Log Summary
  console.log(`[Daily Health Check Summary ${todayStr}]`);
  console.log(`- Uptime Check: ${uptimeOk ? '✓ PASSED (200 OK)' : ' FAILED'}`);
  console.log(`- Persistence Check: ${persistenceOk ? '✓ PASSED (DB Active)' : ' FAILED'}`);
  console.log(`- Error Logging: ${errors.length === 0 ? '✓ ZERO ERRORS' : errors.join('; ')}`);

  localStorage.setItem(STORAGE_KEYS.LAST_HEALTH_CHECK, todayStr);
}

// ---------------------------------------------------------------------------
// 9. MODAL & NAVIGATION CONTROLLERS
// ---------------------------------------------------------------------------

function setupNavigation() {
  const navTabs = document.querySelectorAll('.nav-tab');
  const tabViews = document.querySelectorAll('.tab-view');
  const headerTitle = document.getElementById('header-title');
  const headerIcon = document.getElementById('header-brand-icon');
  const headerBtn = document.getElementById('header-action-btn');

  const navMap = {
    habits: { title: 'Habits', icon: '🌱', showBtn: true },
    weight: { title: 'Weight Tracker', icon: '⚖️', showBtn: false },
    history: { title: 'History Log', icon: '📅', showBtn: false },
    stoic: { title: 'Stoic Mind', icon: '🏛️', showBtn: false }
  };

  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.getAttribute('data-tab');

      navTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      tabViews.forEach(v => v.classList.remove('active'));
      document.getElementById(`${targetTab}-view`).classList.add('active');

      const config = navMap[targetTab];
      headerTitle.textContent = config.title;
      headerIcon.textContent = config.icon;
      headerBtn.style.display = config.showBtn ? 'flex' : 'none';

      state.activeTab = targetTab;
    });
  });

  document.getElementById('header-date').textContent = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
}

function setupModals() {
  const addHabitModal = document.getElementById('add-habit-modal');
  const logWeightModal = document.getElementById('log-weight-modal');
  const setGoalModal = document.getElementById('set-goal-modal');

  document.getElementById('header-action-btn').addEventListener('click', () => {
    addHabitModal.classList.add('active');
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

  let selectedEmoji = '🏃';
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
    const nameInput = document.getElementById('habit-name-input');
    const name = nameInput.value.trim();
    if (name) {
      state.habits.push({
        id: 'h_' + Date.now(),
        name: name,
        icon: selectedEmoji,
        createdAt: getTodayStr(),
        completions: []
      });
      state.saveHabits();
      renderHabitsView();
      renderHistoryView();
      nameInput.value = '';
      addHabitModal.classList.remove('active');
    }
  });

  document.getElementById('log-weight-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const weightVal = parseFloat(document.getElementById('weight-input').value);
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
      renderHistoryView();
      document.getElementById('weight-input').value = '';
      logWeightModal.classList.remove('active');
    }
  });

  document.getElementById('set-goal-form').addEventListener('submit', (e) => {
    e.preventDefault();
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
// 10. INITIALIZATION & SERVICE WORKER
// ---------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  setupPasscodeLock();
  setupNavigation();
  setupHistoryControls();
  setupModals();
  
  renderHabitsView();
  renderWeightView();
  renderHistoryView();
  initStoicSection();

  state.pullFromCloud();
  runDailyHealthCheck();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
      .then((reg) => console.log('Service Worker registered:', reg.scope))
      .catch((err) => console.error('Service Worker failed:', err));
  }
});
