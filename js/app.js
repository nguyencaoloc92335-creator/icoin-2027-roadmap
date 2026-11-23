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
  allRoadmap: null,
  currentDay: 1,
  todayData: null,
  stats: null,
  isRecording: false,
  recognition: null,
  dueVocab: []
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

// Chat Widget Elements
const chatBubbleBtn = document.getElementById('chatBubbleBtn');
const chatWidgetPanel = document.getElementById('chatWidgetPanel');
const closeChatWidgetBtn = document.getElementById('closeChatWidgetBtn');
const tabTranslateBtn = document.getElementById('tabTranslateBtn');
const tabDueVocabBtn = document.getElementById('tabDueVocabBtn');
const chatTranslateView = document.getElementById('chatTranslateView');
const chatDueVocabView = document.getElementById('chatDueVocabView');
const vocabInput = document.getElementById('vocabInput');
const vocabTranslateBtn = document.getElementById('vocabTranslateBtn');
const vocabLoading = document.getElementById('vocabLoading');
const vocabResultContainer = document.getElementById('vocabResultContainer');
const dueVocabListContainer = document.getElementById('dueVocabListContainer');
const dueCountBadge = document.getElementById('dueCountBadge');

window.addEventListener('DOMContentLoaded', () => {
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

  // Chat Bubble Toggle
  chatBubbleBtn?.addEventListener('click', () => {
    chatWidgetPanel.classList.toggle('hidden');
    if (!chatWidgetPanel.classList.contains('hidden')) {
      loadDueVocab();
    }
  });

  closeChatWidgetBtn?.addEventListener('click', () => {
    chatWidgetPanel.classList.add('hidden');
  });

  // Chat Tabs
  tabTranslateBtn?.addEventListener('click', () => {
    tabTranslateBtn.classList.add('active');
    tabDueVocabBtn.classList.remove('active');
    chatTranslateView.style.display = 'flex';
    chatDueVocabView.style.display = 'none';
  });

  tabDueVocabBtn?.addEventListener('click', () => {
    tabDueVocabBtn.classList.add('active');
    tabTranslateBtn.classList.remove('active');
    chatDueVocabView.style.display = 'flex';
    chatTranslateView.style.display = 'none';
    loadDueVocab();
  });

  // Vocab Translation
  vocabTranslateBtn?.addEventListener('click', () => {
    const w = vocabInput.value.trim();
    if (w) translateVocab(w);
  });

  vocabInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const w = vocabInput.value.trim();
      if (w) translateVocab(w);
    }
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
    const res = await fetch(`${state.apiBase}/api/v1/auth/verify`, {
      headers: getHeaders()
    });
    if (res.ok) {
      const data = await res.json();
      state.isAuthenticated = true;
      state.deviceName = data.device_name || 'Thiết bị hợp lệ';
      state.deviceUUID = data.device_uuid || '';
      showAuthenticated();
      await loadInitialData();
      loadDueVocab();
      return;
    } else {
      showUnauthenticated('Token không hợp lệ hoặc đã bị thu hồi');
    }
  } catch (err) {
    console.warn('Backend verification error:', err);
    showUnauthenticated('Không kết nối được server Backend C++');
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

async function loadInitialData() {
  try {
    const res = await fetch(`${state.apiBase}/api/v1/roadmap/all`, { headers: getHeaders() });
    if (res.ok) {
      state.allRoadmap = await res.json();
      renderStageScroller();
    }

    const statsRes = await fetch(`${state.apiBase}/api/v1/roadmap/stats`, { headers: getHeaders() });
    if (statsRes.ok) {
      state.stats = await statsRes.json();
      if (state.stats.current_day) {
        state.currentDay = state.stats.current_day;
      }
      if (streakPill && state.stats.streak_days) {
        streakPill.textContent = `${state.stats.streak_days} ngày`;
      }
    }

    loadDay(state.currentDay);
  } catch (e) {
    console.error('Failed to load initial data', e);
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

async function loadDay(dayNum) {
  state.currentDay = dayNum;
  dayNumberBadge.textContent = `NGÀY ${dayNum}`;

  try {
    const res = await fetch(`${state.apiBase}/api/v1/roadmap/today`, { headers: getHeaders() });
    if (res.ok) {
      const today = await res.json();
      state.todayData = today;
      renderDayContent(today);
      return;
    }
  } catch (e) {
    console.warn('API error, reading from cached roadmap', e);
  }

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
    const existingNote = task.note ? (task.note.text || task.note) : '';

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
  try {
    const res = await fetch(`${state.apiBase}/api/v1/roadmap/task/toggle`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ task_id: taskId })
    });
    if (res.ok) {
      const data = await res.json();
      cb.checked = data.is_done;
      if (data.is_done) card.classList.add('done');
      else card.classList.remove('done');
    }
  } catch (e) {
    console.error('Failed to toggle task', e);
  }
}

async function saveNote(taskId, note) {
  if (!note) return;
  try {
    const res = await fetch(`${state.apiBase}/api/v1/roadmap/task/note`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ task_id: taskId, note: note })
    });
    if (res.ok) {
      alert('✅ Đã lưu câu trả lời kỹ thuật lên máy chủ!');
      const card = document.getElementById(`task-card-${taskId}`);
      if (card) {
        card.classList.add('done');
        const cb = card.querySelector('.task-checkbox');
        if (cb) cb.checked = true;
      }
    }
  } catch (e) {
    console.error('Error saving note', e);
  }
}

// ----------------------------------------------------
// VOCABULARY TRANSLATION & SPACED REPETITION (SM-2)
// ----------------------------------------------------
async function translateVocab(word) {
  vocabLoading.style.display = 'block';
  vocabResultContainer.innerHTML = '';

  try {
    const res = await fetch(`${state.apiBase}/api/v1/vocab/translate`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ word: word })
    });

    vocabLoading.style.display = 'none';
    if (res.ok) {
      const data = await res.json();
      renderVocabResult(data);
      loadDueVocab();
    } else {
      vocabResultContainer.innerHTML = `<p style="color:#f87171; font-size:0.85rem;">Lỗi kết nối Quản gia dịch thuật.</p>`;
    }
  } catch (e) {
    vocabLoading.style.display = 'none';
    vocabResultContainer.innerHTML = `<p style="color:#f87171; font-size:0.85rem;">Không gọi được API dịch: ${e.message}</p>`;
  }
}

function renderVocabResult(item) {
  const srsBadge = item.is_revisit
    ? `<div class="vocab-srs-badge" style="background: rgba(245, 158, 11, 0.15); color: #fbbf24; border-color: rgba(245, 158, 11, 0.3);">
         🔄 <strong>Từ đã lưu trước đó:</strong> Bạn đã lưu từ này ngày ${escapeHtml(item.srs?.created_at || 'trước')} (đã tra lại ${item.srs?.revisits || 1} lần). Vì bạn đang cần xem lại, hệ thống tự động kéo từ này vào lịch ôn tập sáng mai để củng cố ngay!
       </div>`
    : `<div class="vocab-srs-badge">
         📅 Đã lên lịch nhắc SM-2 (+1d, +3d, +7d, +15d, +30d) & đồng bộ Quản gia Telegram!
       </div>`;

  vocabResultContainer.innerHTML = `
    <div class="vocab-result-card">
      <div class="vocab-word-head">
        <div>
          <span class="vocab-word-title">${escapeHtml(item.word)}</span>
          <span class="vocab-phonetic">${escapeHtml(item.phonetic || '')}</span>
        </div>
        <button class="btn-sm" onclick="playTTS('${escapeHtml(item.word)}')">🔊</button>
      </div>
      <div class="vocab-meaning">🇻🇳 ${escapeHtml(item.vietnamese || '')}</div>
      <div class="vocab-context">💡 <strong>Bối cảnh ICOIN:</strong> ${escapeHtml(item.technical_context || '')}</div>
      ${item.example_sentence ? `<div class="vocab-example">📝 "${escapeHtml(item.example_sentence)}"</div>` : ''}
      ${srsBadge}
    </div>
  `;
}

async function loadDueVocab() {
  try {
    const res = await fetch(`${state.apiBase}/api/v1/vocab/due`, {
      headers: getHeaders()
    });
    if (res.ok) {
      state.dueVocab = await res.json();
      dueCountBadge.textContent = state.dueVocab.length;
      renderDueVocabList();
    }
  } catch (e) {
    console.error('Error loading due vocab', e);
  }
}

function renderDueVocabList() {
  if (!state.dueVocab || state.dueVocab.length === 0) {
    dueVocabListContainer.innerHTML = `
      <p style="color:#94a3b8; font-size:0.88rem; text-align:center; padding:20px 0;">
        🎉 Không có từ vựng nào cần ôn hôm nay! Toàn bộ lịch nhắc ngắt quãng đã hoàn tất.
      </p>
    `;
    return;
  }

  dueVocabListContainer.innerHTML = '';
  state.dueVocab.forEach(item => {
    // Pick ONE random question from the 4 styles to keep review non-repetitive and engaging
    const questions = item.quiz_questions || [];
    const q = questions.length > 0 
      ? questions[Math.floor(Math.random() * questions.length)]
      : { type: 'recall', prompt: `Nghĩa và bối cảnh kỹ thuật của từ '${item.word}' là gì?`, answer: item.vietnamese };

    const box = document.createElement('div');
    box.className = 'srs-quiz-box';
    box.id = `srs-box-${escapeHtml(item.word)}`;

    let questionContent = `<div class="srs-prompt">${escapeHtml(q.prompt)}</div>`;
    if (q.options && q.options.length > 0) {
      questionContent += `<div class="srs-options-list">` +
        q.options.map(opt => `<button class="srs-opt-btn" onclick="revealAnswer('${escapeHtml(item.word)}')">${escapeHtml(opt)}</button>`).join('') +
        `</div>`;
    }

    box.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span class="srs-badge-type">Dạng bài: ${q.type}</span>
        <span style="font-size:0.75rem; color:#94a3b8;">Lần nhắc: #${item.srs ? item.srs.repetition + 1 : 1}</span>
      </div>
      ${questionContent}
      <button class="btn-sm" id="btn-reveal-${escapeHtml(item.word)}" onclick="revealAnswer('${escapeHtml(item.word)}')">
        👁️ Xem đáp án
      </button>
      <div id="answer-box-${escapeHtml(item.word)}" style="display:none;" class="srs-answer-reveal">
        <div><strong>Đáp án:</strong> ${escapeHtml(q.answer || item.word)}</div>
        <div style="margin-top:4px; font-size:0.8rem; color:#cbd5e1;">${escapeHtml(item.vietnamese || '')}</div>
        <div style="margin-top:8px; font-size:0.78rem;">Đánh giá mức độ nhớ của bạn:</div>
        <div class="srs-rating-buttons">
          <button class="btn-rate btn-rate-hard" onclick="gradeReview('${escapeHtml(item.word)}', 1)">Khó / Quên (Nhắc lại mai)</button>
          <button class="btn-rate btn-rate-good" onclick="gradeReview('${escapeHtml(item.word)}', 3)">Nhớ được (Tiến độ chuẩn)</button>
          <button class="btn-rate btn-rate-easy" onclick="gradeReview('${escapeHtml(item.word)}', 5)">Rất dễ (Giãn chu kỳ)</button>
        </div>
      </div>
    `;

    dueVocabListContainer.appendChild(box);
  });
}

window.revealAnswer = function(word) {
  const box = document.getElementById(`answer-box-${word}`);
  const btn = document.getElementById(`btn-reveal-${word}`);
  if (box) box.style.display = 'block';
  if (btn) btn.style.display = 'none';
};

window.gradeReview = async function(word, score) {
  try {
    const res = await fetch(`${state.apiBase}/api/v1/vocab/review`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ word: word, score: score })
    });
    if (res.ok) {
      const box = document.getElementById(`srs-box-${word}`);
      if (box) {
        box.innerHTML = `<div style="color:#34d399; font-size:0.85rem; padding:8px 0;">✅ Đã cập nhật chu kỳ ôn tập tiếp theo!</div>`;
        setTimeout(() => {
          loadDueVocab();
        }, 1200);
      }
    }
  } catch (e) {
    alert('Lỗi cập nhật tiến trình ôn tập.');
  }
};

// Web Speech API: Text-to-Speech
window.playTTS = function(text) {
  if (!('speechSynthesis' in window)) {
    alert('Trình duyệt không hỗ trợ Web Speech TTS.');
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 0.95;
  window.speechSynthesis.speak(utterance);
};

// Web Speech API: Speech-To-Text (Microphone)
function toggleSpeechRecognition(taskId, micBtn) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert('Trình duyệt không hỗ trợ nhận dạng giọng nói.');
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
