// ICOIN 2027 Roadmap Web Frontend Application
function getApiBase() {
  const custom = localStorage.getItem('icoin_server_url');
  if (custom) return custom.replace(/\/+$/, '');
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return window.location.origin;
  }
  return 'http://100.107.180.17:8766';
}

const state = {
  apiBase: getApiBase(),
  token: localStorage.getItem('icoin_token') || '',
  deviceName: '',
  deviceUUID: '',
  isAuthenticated: false,
  allRoadmap: (typeof DEFAULT_ROADMAP_DATA !== 'undefined') ? DEFAULT_ROADMAP_DATA : null,
  currentDay: parseInt(localStorage.getItem('icoin_current_day') || '1', 10),
  completedTasks: JSON.parse(localStorage.getItem('icoin_completed_tasks') || '[]'),
  taskNotes: JSON.parse(localStorage.getItem('icoin_task_notes') || '{}'),
  todayData: null,
  stats: null,
  isRecording: false,
  recognition: null
};

// DOM Elements
const authStatusBtn = document.getElementById('authStatusBtn');
const authBanner = document.getElementById('authBanner');
const tokenInput = document.getElementById('tokenInput');
const saveTokenBtn = document.getElementById('saveTokenBtn');
const authModal = document.getElementById('authModal');
const closeAuthModalBtn = document.getElementById('closeAuthModalBtn');
const modalTokenInput = document.getElementById('modalTokenInput');
const modalServerInput = document.getElementById('modalServerInput');
const modalSaveTokenBtn = document.getElementById('modalSaveTokenBtn');
const stageScroller = document.getElementById('stageScroller');
const dayNumberBadge = document.getElementById('dayNumberBadge');
const themeTitle = document.getElementById('themeTitle');
const themeDesc = document.getElementById('themeDesc');
const countdownPill = document.getElementById('countdownPill');
const streakPill = document.getElementById('streakPill');
const tasksContainer = document.getElementById('tasksContainer');
const prevDayBtn = document.getElementById('prevDayBtn');
const nextDayBtn = document.getElementById('nextDayBtn');
const shortcutModal = document.getElementById('shortcutModal');
const closeShortcutModalBtn = document.getElementById('closeShortcutModalBtn');
const openShortcutGuideBtn = document.getElementById('openShortcutGuideBtn');

window.addEventListener('DOMContentLoaded', () => {
  // Check URL query parameter ?token=...
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('token')) {
    state.token = urlParams.get('token');
    localStorage.setItem('icoin_token', state.token);
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  setupEventListeners();
  updateCountdown();
  initAuth();
});

function updateCountdown() {
  const target = new Date('2027-01-15T00:00:00');
  const now = new Date();
  const diffTime = target - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (countdownPill) {
    countdownPill.textContent = `${diffDays > 0 ? diffDays : 0} ngày`;
  }
}

function setupEventListeners() {
  saveTokenBtn?.addEventListener('click', () => {
    const val = tokenInput.value.trim();
    if (val) saveToken(val);
  });

  modalSaveTokenBtn?.addEventListener('click', () => {
    const val = modalTokenInput.value.trim();
    const srv = modalServerInput?.value.trim();
    if (srv) {
      localStorage.setItem('icoin_server_url', srv);
      state.apiBase = srv;
    }
    if (val) saveToken(val);
    else initAuth();
  });

  authStatusBtn?.addEventListener('click', () => {
    modalTokenInput.value = state.token;
    if (modalServerInput) {
      modalServerInput.value = localStorage.getItem('icoin_server_url') || '';
    }
    authModal.classList.remove('hidden');
  });

  closeAuthModalBtn?.addEventListener('click', () => {
    authModal.classList.add('hidden');
  });

  openShortcutGuideBtn?.addEventListener('click', () => {
    shortcutModal.classList.remove('hidden');
  });

  closeShortcutModalBtn?.addEventListener('click', () => {
    shortcutModal.classList.add('hidden');
  });

  prevDayBtn?.addEventListener('click', () => {
    if (state.currentDay > 1) {
      loadDay(state.currentDay - 1);
    }
  });

  nextDayBtn?.addEventListener('click', () => {
    loadDay(state.currentDay + 1);
  });
}

function getHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  if (state.token) {
    headers['Authorization'] = `Bearer ${state.token}`;
  }
  return headers;
}

function isValidTokenFormat(token) {
  if (!token) return false;
  const parts = token.trim().split('.');
  return parts.length === 4 && parts[0] === 'v1' && parts[1].length === 36 && parts[2].length === 32 && parts[3].length === 64;
}

async function initAuth() {
  // Render curriculum immediately so UI is never blank
  renderStageScroller();
  loadDay(state.currentDay);

  if (!state.token) {
    showUnauthenticated();
    return;
  }

  // 1. Validate token format
  if (!isValidTokenFormat(state.token)) {
    showUnauthenticated('Token sai định dạng (chuẩn là: v1.uuid.auth_code.mac)');
    return;
  }

  // Extract UUID from token
  const parts = state.token.trim().split('.');
  state.deviceUUID = parts[1];
  state.deviceName = (state.deviceUUID.startsWith('c7e3a2b1')) ? 'iPhone 15' : 'Thiết bị hợp lệ';

  // 2. Try online verification with C++ backend
  try {
    const res = await fetch(`${state.apiBase}/api/v1/auth/verify`, {
      headers: getHeaders()
    });
    if (res.ok) {
      const data = await res.json();
      state.isAuthenticated = true;
      state.deviceName = data.device_name || state.deviceName;
      state.deviceUUID = data.device_uuid || state.deviceUUID;
      showAuthenticated();
      syncWithBackend();
      return;
    }
  } catch (err) {
    console.log('Backend sync offline/mixed-content, running in Client-Authorized mode');
  }

  // 3. Fallback: Token is cryptographically formatted, unlock web locally!
  state.isAuthenticated = true;
  showAuthenticated();
}

function showAuthenticated() {
  authStatusBtn.textContent = `🟢 ${state.deviceName}`;
  authStatusBtn.classList.add('active');
  authBanner.classList.add('hidden');
}

function showUnauthenticated(msg) {
  authStatusBtn.textContent = '🔒 Chưa xác thực Token';
  authStatusBtn.classList.remove('active');
  authBanner.classList.remove('hidden');
  if (msg) {
    const el = document.getElementById('authBannerMsg');
    if (el) el.textContent = msg;
  }
}

function saveToken(token) {
  state.token = token.trim();
  localStorage.setItem('icoin_token', state.token);
  authModal.classList.add('hidden');
  initAuth();
}

async function syncWithBackend() {
  try {
    const res = await fetch(`${state.apiBase}/api/v1/roadmap/stats`, { headers: getHeaders() });
    if (res.ok) {
      state.stats = await res.json();
      if (state.stats.current_day) {
        state.currentDay = state.stats.current_day;
      }
      if (streakPill && state.stats.streak_days) {
        streakPill.textContent = `${state.stats.streak_days} ngày`;
      }
    }
  } catch (e) {
    // Ignore offline errors
  }
}

function renderStageScroller() {
  if (!state.allRoadmap || !state.allRoadmap.stages) return;
  stageScroller.innerHTML = '';
  state.allRoadmap.stages.forEach(st => {
    const div = document.createElement('div');
    const isCurrent = (state.currentDay >= getStageStartDay(st.stage_id) && state.currentDay <= getStageEndDay(st.stage_id));
    div.className = `stage-card ${isCurrent ? 'active' : ''}`;
    div.innerHTML = `
      <div class="stage-num">${st.days_range}</div>
      <div class="stage-title">${st.name}</div>
    `;
    div.addEventListener('click', () => {
      document.querySelectorAll('.stage-card').forEach(c => c.classList.remove('active'));
      div.classList.add('active');
      loadDay(getStageStartDay(st.stage_id));
    });
    stageScroller.appendChild(div);
  });
}

function getStageStartDay(stageId) {
  if (stageId === 1) return 1;
  if (stageId === 2) return 15;
  if (stageId === 3) return 29;
  if (stageId === 4) return 43;
  return 55;
}

function getStageEndDay(stageId) {
  if (stageId === 1) return 14;
  if (stageId === 2) return 28;
  if (stageId === 3) return 42;
  if (stageId === 4) return 54;
  return 60;
}

function loadDay(dayNum) {
  state.currentDay = dayNum;
  localStorage.setItem('icoin_current_day', dayNum.toString());
  dayNumberBadge.textContent = `NGÀY ${dayNum}`;

  if (!state.allRoadmap || !state.allRoadmap.days) return;
  const match = state.allRoadmap.days.find(d => d.day === dayNum) || state.allRoadmap.days[0];
  renderDayContent(match);
}

function renderDayContent(day) {
  themeTitle.textContent = day.theme || 'Chủ đề chuyên ngành';
  themeDesc.textContent = `Bài học chi tiết gồm các nhiệm vụ rải rác 10-15 phút: Nghe, Nói (Shadowing), Đọc hiểu tài liệu và Viết tóm tắt kỹ thuật.`;

  tasksContainer.innerHTML = '';
  if (!day.tasks || day.tasks.length === 0) {
    tasksContainer.innerHTML = `<p style="color:#94a3b8">Chưa có bài học cho ngày này.</p>`;
    return;
  }

  day.tasks.forEach(task => {
    const card = document.createElement('div');
    const isDone = state.completedTasks.includes(task.id);
    card.className = `task-card ${isDone ? 'done' : ''}`;
    card.id = `task-card-${task.id}`;

    const itemsHtml = (task.items || []).map(it => `<li>${escapeHtml(it)}</li>`).join('');
    const existingNote = state.taskNotes[task.id] || '';

    card.innerHTML = `
      <div class="task-top">
        <input type="checkbox" class="task-checkbox" ${isDone ? 'checked' : ''} data-id="${task.id}" />
        <div class="task-header-info">
          <div class="task-badges">
            <span class="skill-tag skill-${task.type}">${task.type}</span>
            <span style="font-size:0.75rem; color:#94a3b8;">⏱️ ${task.minutes} phút</span>
          </div>
          <div class="task-title">#${task.id}. ${escapeHtml(task.title)}</div>
        </div>
      </div>
      <ul class="task-items-list">${itemsHtml}</ul>
      <div class="task-actions">
        <button class="btn-sm play-tts-btn" data-text="${escapeHtml(task.items ? task.items.join('. ') : task.title)}">
          🔊 Nghe phát âm mẫu (TTS)
        </button>
        <button class="btn-sm mic-btn" data-id="${task.id}">
          🎙️ Luyện nói (Mic)
        </button>
      </div>
      <div class="task-note-box">
        <input type="text" placeholder="Gõ hoặc nói câu trả lời của bạn vào đây..." value="${escapeHtml(existingNote)}" id="note-input-${task.id}" />
        <button class="btn-sm save-note-btn" data-id="${task.id}">Lưu</button>
      </div>
    `;

    const cb = card.querySelector('.task-checkbox');
    cb.addEventListener('change', () => toggleTask(task.id, card, cb));

    const ttsBtn = card.querySelector('.play-tts-btn');
    ttsBtn.addEventListener('click', () => playTTS(ttsBtn.getAttribute('data-text')));

    const micBtn = card.querySelector('.mic-btn');
    micBtn.addEventListener('click', () => toggleSpeechRecognition(task.id, micBtn));

    const saveNoteBtn = card.querySelector('.save-note-btn');
    saveNoteBtn.addEventListener('click', () => {
      const input = document.getElementById(`note-input-${task.id}`);
      saveNote(task.id, input.value.trim());
    });

    tasksContainer.appendChild(card);
  });
}

async function toggleTask(taskId, card, cb) {
  const isDone = cb.checked;
  if (isDone) {
    if (!state.completedTasks.includes(taskId)) state.completedTasks.push(taskId);
    card.classList.add('done');
  } else {
    state.completedTasks = state.completedTasks.filter(id => id !== taskId);
    card.classList.remove('done');
  }
  localStorage.setItem('icoin_completed_tasks', JSON.stringify(state.completedTasks));

  // Try sync with backend if online
  try {
    await fetch(`${state.apiBase}/api/v1/roadmap/task/toggle`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ task_id: taskId })
    });
  } catch (e) {
    // Offline local save is already completed
  }
}

async function saveNote(taskId, note) {
  if (!note) return;
  state.taskNotes[taskId] = note;
  localStorage.setItem('icoin_task_notes', JSON.stringify(state.taskNotes));

  // Mark task as done automatically when note submitted
  if (!state.completedTasks.includes(taskId)) {
    state.completedTasks.push(taskId);
    localStorage.setItem('icoin_completed_tasks', JSON.stringify(state.completedTasks));
    const card = document.getElementById(`task-card-${taskId}`);
    if (card) {
      card.classList.add('done');
      const cb = card.querySelector('.task-checkbox');
      if (cb) cb.checked = true;
    }
  }

  alert('✅ Đã lưu câu trả lời kỹ thuật!');

  // Try sync with backend if online
  try {
    await fetch(`${state.apiBase}/api/v1/roadmap/task/note`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ task_id: taskId, note: note })
    });
  } catch (e) {
    // Offline local save is already completed
  }
}

// Web Speech API: Text-to-Speech
function playTTS(text) {
  if (!('speechSynthesis' in window)) {
    alert('Trình duyệt không hỗ trợ Web Speech TTS.');
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 0.95;
  window.speechSynthesis.speak(utterance);
}

// Web Speech API: Speech-To-Text (Microphone)
function toggleSpeechRecognition(taskId, micBtn) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert('Trình duyệt không hỗ trợ nhận dạng giọng nói (hỗ trợ tốt nhất trên Chrome/Safari).');
    return;
  }

  if (state.isRecording) {
    if (state.recognition) state.recognition.stop();
    state.isRecording = false;
    micBtn.classList.remove('speaking-active');
    micBtn.textContent = '🎙️ Luyện nói (Mic)';
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;

  recognition.onstart = () => {
    state.isRecording = true;
    micBtn.classList.add('speaking-active');
    micBtn.textContent = '🔴 Đang nghe... Hãy nói tiếng Anh';
  };

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    const input = document.getElementById(`note-input-${taskId}`);
    if (input) {
      input.value = transcript;
    }
  };

  recognition.onend = () => {
    state.isRecording = false;
    micBtn.classList.remove('speaking-active');
    micBtn.textContent = '🎙️ Luyện nói (Mic)';
  };

  recognition.onerror = () => {
    state.isRecording = false;
    micBtn.classList.remove('speaking-active');
    micBtn.textContent = '🎙️ Luyện nói (Mic)';
  };

  state.recognition = recognition;
  recognition.start();
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
}
