// ICOIN 2027 Roadmap Web Frontend Application
// Determines API Base URL: allows custom Tailscale/Localhost IP when hosted on GitHub Pages
function getApiBase() {
  const custom = localStorage.getItem('icoin_server_url');
  if (custom) return custom.replace(/\/+$/, '');
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return window.location.origin;
  }
  return 'http://localhost:8766';
}

const state = {
  apiBase: getApiBase(),
  token: localStorage.getItem('icoin_token') || '',
  deviceName: '',
  deviceUUID: '',
  isAuthenticated: false,
  allRoadmap: null,
  currentDay: 1,
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

// Initialize
window.addEventListener('DOMContentLoaded', () => {
  // Check URL query parameter ?token=...
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('token')) {
    state.token = urlParams.get('token');
    localStorage.setItem('icoin_token', state.token);
    // Remove token from URL for clean view
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  setupEventListeners();
  initAuth();
});

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

async function initAuth() {
  if (!state.token) {
    showUnauthenticated();
    return;
  }

  try {
    const res = await fetch(`${getApiBase()}/api/v1/auth/verify`, {
      headers: getHeaders()
    });
    if (res.ok) {
      const data = await res.json();
      state.isAuthenticated = true;
      state.deviceName = data.device_name || 'Thiết bị hợp lệ';
      state.deviceUUID = data.device_uuid || '';
      showAuthenticated();
      loadInitialData();
    } else {
      showUnauthenticated('Token không hợp lệ hoặc đã bị thu hồi');
    }
  } catch (err) {
    console.warn('Backend verification offline/failed, loading local demo mode:', err);
    showUnauthenticated('Không kết nối được server backend C++');
  }
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
    document.getElementById('authBannerMsg').textContent = msg;
  }
}

function saveToken(token) {
  state.token = token;
  localStorage.setItem('icoin_token', token);
  authModal.classList.add('hidden');
  initAuth();
}

async function loadInitialData() {
  await Promise.all([loadStats(), loadAllRoadmap()]);
  loadDay(state.currentDay);
}

async function loadStats() {
  try {
    const res = await fetch(`${getApiBase()}/api/v1/roadmap/stats`, { headers: getHeaders() });
    if (res.ok) {
      state.stats = await res.json();
      countdownPill.textContent = `${state.stats.days_until_icoin_2027} ngày`;
      streakPill.textContent = `${state.stats.streak_days} ngày`;
      state.currentDay = state.stats.current_day || 1;
    }
  } catch (e) {
    console.error('Failed to load stats', e);
  }
}

async function loadAllRoadmap() {
  try {
    const res = await fetch(`${getApiBase()}/api/v1/roadmap/all`, { headers: getHeaders() });
    if (res.ok) {
      state.allRoadmap = await res.json();
      renderStageScroller();
    }
  } catch (e) {
    console.error('Failed to load roadmap stages', e);
  }
}

function renderStageScroller() {
  if (!state.allRoadmap || !state.allRoadmap.stages) return;
  stageScroller.innerHTML = '';
  state.allRoadmap.stages.forEach(st => {
    const div = document.createElement('div');
    div.className = `stage-card ${st.stage_id === 1 ? 'active' : ''}`;
    div.innerHTML = `
      <div class="stage-num">${st.days_range}</div>
      <div class="stage-title">${st.name}</div>
    `;
    div.addEventListener('click', () => {
      document.querySelectorAll('.stage-card').forEach(c => c.classList.remove('active'));
      div.classList.add('active');
      // Jump to first day of that stage
      if (st.stage_id === 1) loadDay(1);
      else if (st.stage_id === 2) loadDay(15);
      else if (st.stage_id === 3) loadDay(29);
      else if (st.stage_id === 4) loadDay(43);
      else if (st.stage_id === 5) loadDay(55);
    });
    stageScroller.appendChild(div);
  });
}

async function loadDay(dayNum) {
  state.currentDay = dayNum;
  dayNumberBadge.textContent = `NGÀY ${dayNum}`;

  try {
    // If authenticated, get live today data from server
    const res = await fetch(`${getApiBase()}/api/v1/roadmap/today`, { headers: getHeaders() });
    if (res.ok) {
      const today = await res.json();
      state.todayData = today;
      renderDayContent(today);
      return;
    }
  } catch (e) {
    console.warn('API error, reading from cached roadmap', e);
  }

  // Fallback to cached allRoadmap days
  if (state.allRoadmap && state.allRoadmap.days) {
    const match = state.allRoadmap.days.find(d => d.day === dayNum) || state.allRoadmap.days[0];
    renderDayContent(match);
  }
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
    card.className = `task-card ${task.is_done ? 'done' : ''}`;
    card.id = `task-card-${task.id}`;

    const itemsHtml = (task.items || []).map(it => `<li>${escapeHtml(it)}</li>`).join('');

    card.innerHTML = `
      <div class="task-top">
        <input type="checkbox" class="task-checkbox" ${task.is_done ? 'checked' : ''} data-id="${task.id}" />
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
        <input type="text" placeholder="Gõ hoặc nói câu trả lời của bạn vào đây..." value="${escapeHtml(task.note ? (task.note.text || task.note) : '')}" id="note-input-${task.id}" />
        <button class="btn-sm save-note-btn" data-id="${task.id}">Lưu</button>
      </div>
    `;

    // Event listener for toggle checkbox
    const cb = card.querySelector('.task-checkbox');
    cb.addEventListener('change', () => toggleTask(task.id, card, cb));

    // Event listener for TTS audio
    const ttsBtn = card.querySelector('.play-tts-btn');
    ttsBtn.addEventListener('click', () => playTTS(ttsBtn.getAttribute('data-text')));

    // Event listener for Mic speech-to-text
    const micBtn = card.querySelector('.mic-btn');
    micBtn.addEventListener('click', () => toggleSpeechRecognition(task.id, micBtn));

    // Event listener for save note
    const saveNoteBtn = card.querySelector('.save-note-btn');
    saveNoteBtn.addEventListener('click', () => {
      const input = document.getElementById(`note-input-${task.id}`);
      saveNote(task.id, input.value.trim());
    });

    tasksContainer.appendChild(card);
  });
}

async function toggleTask(taskId, card, cb) {
  try {
    const res = await fetch(`${getApiBase()}/api/v1/roadmap/task/toggle`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ task_id: taskId })
    });
    if (res.ok) {
      const data = await res.json();
      cb.checked = data.is_done;
      if (data.is_done) card.classList.add('done');
      else card.classList.remove('done');
      loadStats();
    }
  } catch (e) {
    console.error('Failed to toggle task', e);
  }
}

async function saveNote(taskId, note) {
  if (!note) return;
  try {
    const res = await fetch(`${getApiBase()}/api/v1/roadmap/task/note`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ task_id: taskId, note: note })
    });
    if (res.ok) {
      alert('✅ Đã lưu câu trả lời kỹ thuật thành công!');
      const card = document.getElementById(`task-card-${taskId}`);
      if (card) {
        card.classList.add('done');
        const cb = card.querySelector('.task-checkbox');
        if (cb) cb.checked = true;
      }
      loadStats();
    }
  } catch (e) {
    console.error('Error saving note', e);
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
  utterance.rate = 0.95; // slightly slower for clear technical pronunciation
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

  recognition.onerror = (e) => {
    console.error('Speech recognition error', e);
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
