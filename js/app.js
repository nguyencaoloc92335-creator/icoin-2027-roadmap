// ICOIN 2027 Roadmap Web Frontend Application
function getApiBase() {
  const custom = localStorage.getItem('icoin_server_url');
  if (custom) return custom.replace(/\/+$/, '');
  if (window.location.port === '8766' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
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
const tabAllVocabBtn = document.getElementById('tabAllVocabBtn');
const chatTranslateView = document.getElementById('chatTranslateView');
const chatDueVocabView = document.getElementById('chatDueVocabView');
const chatAllVocabView = document.getElementById('chatAllVocabView');
const vocabInput = document.getElementById('vocabInput');
const vocabTranslateBtn = document.getElementById('vocabTranslateBtn');
const vocabLoading = document.getElementById('vocabLoading');
const vocabResultContainer = document.getElementById('vocabResultContainer');
const dueVocabListContainer = document.getElementById('dueVocabListContainer');
const dueCountBadge = document.getElementById('dueCountBadge');
const allCountBadge = document.getElementById('allCountBadge');
const targetWordBox = document.getElementById('targetWordBox');
const targetWordDisplay = document.getElementById('targetWordDisplay');
const typingStatus = document.getElementById('typingStatus');
const btnFillQuick = document.getElementById('btnFillQuick');
const allVocabSearchInput = document.getElementById('allVocabSearchInput');
const btnOpenAuthFromVocab = document.getElementById('btnOpenAuthFromVocab');

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
  tabTranslateBtn?.addEventListener('click', () => showChatTab('translate'));
  tabDueVocabBtn?.addEventListener('click', () => showChatTab('due'));
  tabAllVocabBtn?.addEventListener('click', () => showChatTab('all'));

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

  // Typing verification on target word
  vocabInput?.addEventListener('input', () => {
    const target = (vocabInput.dataset.targetWord || '').trim();
    if (!target || !targetWordDisplay || !typingStatus) return;

    const val = vocabInput.value;
    if (!val) {
      targetWordDisplay.textContent = target;
      typingStatus.className = 'typing-status';
      typingStatus.textContent = 'Hãy gõ lại từ trên vào ô bên dưới để nhớ mặt chữ...';
      return;
    }

    let matchedHtml = '';
    let isMatchSoFar = true;

    for (let i = 0; i < target.length; i++) {
      const targetChar = target[i];
      const typedChar = val[i];

      if (typedChar === undefined) {
        matchedHtml += `<span class="char-untyped">${escapeHtml(targetChar)}</span>`;
      } else if (typedChar.toLowerCase() === targetChar.toLowerCase()) {
        matchedHtml += `<span class="char-matched">${escapeHtml(targetChar)}</span>`;
      } else {
        isMatchSoFar = false;
        matchedHtml += `<span style="color:#ef4444; text-decoration:underline;">${escapeHtml(targetChar)}</span>`;
      }
    }

    targetWordDisplay.innerHTML = matchedHtml;

    if (val.toLowerCase() === target.toLowerCase()) {
      typingStatus.className = 'typing-status correct';
      typingStatus.textContent = '✅ Rất tốt! Bạn đã gõ đúng 100%. Bấm "Dịch & Lưu" để tiếp tục!';
    } else if (!isMatchSoFar) {
      typingStatus.className = 'typing-status mismatch';
      typingStatus.textContent = '⚠️ Có ký tự chưa khớp. Hãy kiểm tra lại từ mẫu ở trên!';
    } else {
      typingStatus.className = 'typing-status';
      typingStatus.textContent = `Đang gõ đúng: ${val.length}/${target.length} ký tự...`;
    }
  });

  // Quick fill button
  btnFillQuick?.addEventListener('click', () => {
    const target = vocabInput?.dataset.targetWord || '';
    if (target && vocabInput) {
      vocabInput.value = target;
      vocabInput.dispatchEvent(new Event('input'));
      vocabInput.focus();
    }
  });

  // Real-time search in all saved vocab
  allVocabSearchInput?.addEventListener('input', () => {
    const q = allVocabSearchInput.value.toLowerCase().trim();
    if (!state.allVocab) return;
    if (!q) {
      renderAllVocabList(state.allVocab);
      return;
    }
    const filtered = state.allVocab.filter(item => {
      const w = (item.word || '').toLowerCase();
      const v = (item.vietnamese || '').toLowerCase();
      const c = (item.technical_context || '').toLowerCase();
      return w.includes(q) || v.includes(q) || c.includes(q);
    });
    renderAllVocabList(filtered);
  });

  btnOpenAuthFromVocab?.addEventListener('click', () => {
    authModal.classList.remove('hidden');
  });

  // Document word click, double-click, and selection listener (Supports Edge, Chrome, Safari)
  document.addEventListener('click', handleWordClick);
  document.addEventListener('dblclick', handleWordClick);
  document.addEventListener('touchend', handleWordClick);
}

function showChatTab(tabName) {
  tabTranslateBtn?.classList.remove('active');
  tabDueVocabBtn?.classList.remove('active');
  tabAllVocabBtn?.classList.remove('active');

  chatTranslateView.style.display = 'none';
  chatDueVocabView.style.display = 'none';
  chatAllVocabView.style.display = 'none';

  if (tabName === 'translate') {
    tabTranslateBtn?.classList.add('active');
    chatTranslateView.style.display = 'flex';
  } else if (tabName === 'due') {
    tabDueVocabBtn?.classList.add('active');
    chatDueVocabView.style.display = 'flex';
    loadDueVocab();
  } else if (tabName === 'all') {
    tabAllVocabBtn?.classList.add('active');
    chatAllVocabView.style.display = 'flex';
    loadAllStoredVocab();
  }
}

// Extract word under mouse coordinates (cross-browser: Edge, Chrome, Firefox, Safari)
function getWordAtPoint(x, y) {
  let range;
  if (document.caretRangeFromPoint) {
    range = document.caretRangeFromPoint(x, y);
  } else if (document.caretPositionFromPoint) {
    const pos = document.caretPositionFromPoint(x, y);
    if (pos) {
      range = document.createRange();
      range.setStart(pos.offsetNode, pos.offset);
      range.collapse(true);
    }
  }
  if (!range || !range.startContainer || range.startContainer.nodeType !== Node.TEXT_NODE) {
    return '';
  }
  const text = range.startContainer.textContent;
  const offset = range.startOffset;
  if (offset > text.length) return '';

  const isWordChar = (c) => /[a-zA-Z0-9_\-]/.test(c);
  let start = offset;
  let end = offset;

  if (offset < text.length && !isWordChar(text[offset])) {
    if (offset > 0 && isWordChar(text[offset - 1])) {
      start = offset - 1;
      end = offset - 1;
    } else {
      return '';
    }
  }

  while (start > 0 && isWordChar(text[start - 1])) start--;
  while (end < text.length && isWordChar(text[end])) end++;
  return text.slice(start, end).trim();
}

function handleWordClick(e) {
  // Ignore clicks inside chat widget, modals, form controls, buttons
  if (e && e.target && e.target.closest && (
    e.target.closest('#chatWidgetPanel') || 
    e.target.closest('#chatBubbleBtn') || 
    e.target.closest('.modal-card') ||
    e.target.closest('button') ||
    e.target.tagName === 'INPUT' || 
    e.target.tagName === 'TEXTAREA' || 
    e.target.tagName === 'BUTTON' ||
    e.target.tagName === 'A'
  )) {
    return;
  }

  // 1. Check if user made a drag selection
  const sel = window.getSelection();
  const selectedText = sel ? sel.toString().trim() : '';
  if (selectedText && selectedText.length >= 2 && selectedText.length <= 40 && !selectedText.includes('\n')) {
    setWordToPractice(selectedText);
    return;
  }

  // 2. Extract word at click position (single click or double click on Edge PC & mobile)
  if (typeof e.clientX === 'number' && typeof e.clientY === 'number') {
    const clickedWord = getWordAtPoint(e.clientX, e.clientY);
    if (clickedWord && clickedWord.length >= 2 && /[a-zA-Z]/.test(clickedWord)) {
      setWordToPractice(clickedWord);
    }
  }
}

function setWordToPractice(rawWord) {
  if (!rawWord) return;
  const cleaned = rawWord.trim().replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '');
  if (!cleaned || cleaned.length < 2) return;

  // 1. Open chat widget if closed
  if (chatWidgetPanel.classList.contains('hidden')) {
    chatWidgetPanel.classList.remove('hidden');
  }

  // 2. Switch to Translate tab
  showChatTab('translate');

  // 3. Update target word display card
  if (targetWordBox && targetWordDisplay && typingStatus) {
    targetWordDisplay.textContent = cleaned;
    typingStatus.className = 'typing-status';
    typingStatus.textContent = 'Hãy gõ lại từ trên vào ô bên dưới để nhớ mặt chữ...';
    targetWordBox.style.display = 'block';
  }

  if (vocabInput) {
    vocabInput.value = '';
    vocabInput.dataset.targetWord = cleaned;
    vocabInput.placeholder = `Gõ lại: ${cleaned}`;
    setTimeout(() => vocabInput.focus(), 150);
  }
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

function renderMaterialHtml(task) {
  const m = task.material;
  if (!m) return '';

  let body = '';
  if (task.type === 'listening') {
    const audioText = m.audio_text || '';
    const kwHtml = (m.keywords || []).map(k => `
      <div class="keyword-pill"><strong>${escapeHtml(k.term)}:</strong> ${escapeHtml(k.definition)}</div>
    `).join('');

    body = `
      <div class="material-title-bar">
        <span class="material-title">🎧 Kịch bản âm thanh kỹ thuật (Audio Transcript)</span>
        <button class="btn-sm" onclick="playTTS('${escapeHtml(audioText.replace(/'/g, "\\'"))}')">▶️ Nghe toàn bộ đoạn (TTS)</button>
      </div>
      <div class="material-passage">${escapeHtml(audioText)}</div>
      ${kwHtml ? `<div style="font-size:0.78rem; color:#94a3b8; margin-top:6px;">🔑 Từ khóa trọng tâm:</div><div class="material-keywords-list">${kwHtml}</div>` : ''}
      ${m.question ? `<div style="margin-top:8px; font-weight:600; color:#e2e8f0;">❓ Câu hỏi trọng tâm: <span style="color:#38bdf8;">${escapeHtml(m.question)}</span></div>` : ''}
    `;
  } else if (task.type === 'speaking') {
    const sentences = (m.sample_sentences || []).map((s) => `
      <div class="speaking-sentence-card">
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div class="speaking-en">"${escapeHtml(s.en)}"</div>
          <button class="btn-sm" style="padding:2px 8px; font-size:0.75rem;" onclick="playTTS('${escapeHtml(s.en.replace(/'/g, "\\'"))}')">🔊 Nghe</button>
        </div>
        <div class="speaking-ipa">${escapeHtml(s.ipa || '')}</div>
        <div class="speaking-vi">🇻🇳 ${escapeHtml(s.vi || '')}</div>
      </div>
    `).join('');

    body = `
      <div class="material-title-bar">
        <span class="material-title">🗣️ Mẫu câu giao tiếp & Shadowing chuyên ngành</span>
      </div>
      ${sentences}
      ${m.intonation_tips ? `<div style="font-size:0.78rem; color:#fbbf24; margin-top:6px;">💡 Lưu ý ngữ điệu: ${escapeHtml(m.intonation_tips)}</div>` : ''}
    `;
  } else if (task.type === 'reading') {
    const title = m.datasheet_title || 'Trích đoạn tài liệu kỹ thuật STM32';
    const passage = m.passage || '';
    const vocabList = (m.vocabulary_highlights || []).map(v => `
      <div class="keyword-pill"><strong>${escapeHtml(v.term)}:</strong> ${escapeHtml(v.meaning)}</div>
    `).join('');

    body = `
      <div class="material-title-bar">
        <span class="material-title">📖 ${escapeHtml(title)}</span>
      </div>
      <div class="material-passage">${escapeHtml(passage)}</div>
      ${vocabList ? `<div style="font-size:0.78rem; color:#94a3b8; margin-top:6px;">🔍 Thuật ngữ then chốt:</div><div class="material-keywords-list">${vocabList}</div>` : ''}
      ${m.question ? `<div style="margin-top:8px; font-weight:600; color:#e2e8f0;">❓ Yêu cầu đọc hiểu: <span style="color:#38bdf8;">${escapeHtml(m.question)}</span></div>` : ''}
    `;
  } else if (task.type === 'writing') {
    const prompt = m.writing_prompt || '';
    const args = (m.suggested_arguments || []).map(a => `<li>${escapeHtml(a)}</li>`).join('');
    const vocabs = (m.academic_vocabulary || []).map(v => `<span class="badge" style="background:#1e293b; color:#38bdf8; margin-right:4px;">${escapeHtml(v)}</span>`).join('');

    body = `
      <div class="material-title-bar">
        <span class="material-title">✍️ Đề bài & Hướng dẫn Viết chuẩn Hội thảo IEEE / ICOIN</span>
      </div>
      <div style="font-weight:600; color:#f1f5f9; margin-bottom:6px;">${escapeHtml(prompt)}</div>
      ${args ? `<div style="font-size:0.8rem; color:#94a3b8;">💡 Gợi ý luận điểm kỹ thuật:</div><ul style="margin:4px 0 8px 16px; font-size:0.82rem; color:#cbd5e1;">${args}</ul>` : ''}
      ${vocabs ? `<div style="font-size:0.78rem; color:#94a3b8;">📚 Từ vựng học thuật nên dùng: ${vocabs}</div>` : ''}
    `;
  }

  return `<div class="task-material-box">${body}</div>`;
}

function renderSolutionBox(task, solutionData) {
  const sol = solutionData || task.solution;
  if (!sol || (!sol.answer && !sol.detailed_explanation)) return '';

  const takeaways = (sol.key_takeaways || []).map(t => `<li class="solution-takeaway-item">${escapeHtml(t)}</li>`).join('');

  return `
    <div class="solution-details-box" id="solution-content-${task.id}">
      <h5>🎯 Đáp án & Lời giải mẫu chuẩn kỹ thuật:</h5>
      <div style="color:#38bdf8; font-weight:500; margin-bottom:8px;">${escapeHtml(sol.answer || '')}</div>
      ${sol.detailed_explanation ? `<div style="font-size:0.82rem; color:#cbd5e1; line-height:1.45; margin-bottom:8px;">${escapeHtml(sol.detailed_explanation)}</div>` : ''}
      ${takeaways ? `<div style="font-size:0.8rem; color:#fbbf24; font-weight:600;">📌 Điểm cốt lõi cần ghi nhớ:</div><ul style="margin:4px 0 0 0; padding-left:16px;">${takeaways}</ul>` : ''}
    </div>
  `;
}

function renderEvaluationHtml(evalRes, task) {
  if (!evalRes) return '';
  const status = evalRes.status;
  let badgeClass = 'incorrect';
  let badgeText = 'Chưa đạt yêu cầu';
  if (status === 'CORRECT') {
    badgeClass = 'correct';
    badgeText = `🟢 Chính xác (${evalRes.score || 100}/100)`;
  } else if (status === 'NEAR_CORRECT') {
    badgeClass = 'near';
    badgeText = `🟡 Gần đúng - Có nỗ lực suy nghĩ (${evalRes.score || 70}/100)`;
  } else {
    badgeClass = 'incorrect';
    badgeText = `🔴 Chưa đạt (${evalRes.score || 0}/100)`;
  }

  const isUnlocked = evalRes.can_unlock_solution || task.is_solution_unlocked;
  const solData = evalRes.solution || task.solution;

  const unlockBtn = isUnlocked
    ? `<div class="solution-container" id="solution-container-${task.id}">
         <button class="btn-toggle-solution" onclick="window.toggleSolutionBox(${task.id})">
           🔓 Xem AI Giải & Làm Mẫu Chi Tiết
         </button>
         <div id="solution-wrapper-${task.id}" style="display:none; margin-top:6px;">
           ${renderSolutionBox(task, solData)}
         </div>
       </div>`
    : `<div style="font-size:0.78rem; color:#94a3b8; margin-top:6px; font-style:italic;">
         🔒 Lời giải mẫu chỉ tự động mở khóa khi bạn đọc tài liệu và nỗ lực trả lời gần đúng (AI sẽ đánh giá tính chân thật).
       </div>`;

  return `
    <div class="ai-eval-result ${badgeClass}">
      <div class="eval-badge ${badgeClass}">${badgeText}</div>
      <div class="eval-feedback">${escapeHtml(evalRes.feedback || '')}</div>
      ${evalRes.improved_english ? `<div class="eval-improved-english">📝 <strong>Gợi ý câu chuẩn IEEE:</strong> "${escapeHtml(evalRes.improved_english)}"</div>` : ''}
      ${unlockBtn}
    </div>
  `;
}

function renderDayContent(day) {
  themeTitle.textContent = day.theme || 'Chủ đề chuyên ngành';
  themeDesc.textContent = `Bài học chi tiết gồm các nhiệm vụ rải rác 10-15 phút: Nghe, Nói (Shadowing), Đọc hiểu tài liệu và Viết tóm tắt kỹ thuật.`;

  tasksContainer.innerHTML = '';
  if (!day.tasks || day.tasks.length === 0) {
    tasksContainer.innerHTML = `<p style="color:#94a3b8">Chưa có bài học cho ngày này.</p>`;
    return;
  }

  const currentDayNum = day.day || 1;

  day.tasks.forEach(task => {
    const card = document.createElement('div');
    card.className = `task-card ${task.is_done ? 'done' : ''}`;
    card.id = `task-card-${task.id}`;

    const itemsHtml = (task.items || []).map(it => `<li>${escapeHtml(it)}</li>`).join('');
    const existingNote = task.note ? (task.note.text || task.note) : '';
    const materialHtml = renderMaterialHtml(task);
    const initialEvalHtml = task.last_evaluation ? renderEvaluationHtml(task.last_evaluation, task) : '';

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
      ${materialHtml}
      
      <div class="task-submission-row">
        <textarea class="task-textarea" rows="2" placeholder="Nhập câu trả lời hoặc bấm 🎙️ Luyện nói (Mic) để nói câu trả lời của bạn..." id="note-input-${task.id}">${escapeHtml(existingNote)}</textarea>
        <div class="submission-actions">
          <div style="display:flex; gap:6px;">
            <button class="btn-sm mic-btn" data-id="${task.id}">
              🎙️ Luyện nói (Mic)
            </button>
            <button class="btn-sm save-note-btn" data-id="${task.id}">
              💾 Lưu nháp
            </button>
          </div>
          <button class="btn-ai-submit" id="btn-submit-${task.id}">
            🚀 Nộp bài & AI Chấm điểm
          </button>
        </div>
      </div>

      <div id="eval-result-container-${task.id}">
        ${initialEvalHtml}
      </div>
    `;

    const cb = card.querySelector('.task-checkbox');
    cb.addEventListener('change', () => toggleTask(task.id, card, cb));

    const micBtn = card.querySelector('.mic-btn');
    micBtn.addEventListener('click', () => toggleSpeechRecognition(task.id, micBtn));

    const saveNoteBtn = card.querySelector('.save-note-btn');
    saveNoteBtn.addEventListener('click', () => {
      const input = document.getElementById(`note-input-${task.id}`);
      saveNote(task.id, input.value.trim());
    });

    const submitBtn = card.querySelector(`#btn-submit-${task.id}`);
    submitBtn.addEventListener('click', () => {
      submitTaskForEvaluation(currentDayNum, task.id, submitBtn, card);
    });

    tasksContainer.appendChild(card);
  });
}

async function submitTaskForEvaluation(currentDay, taskId, btn, card) {
  const input = document.getElementById(`note-input-${taskId}`);
  const answer = (input ? input.value : '').trim();
  if (!answer) {
    alert('Vui lòng nhập hoặc nói câu trả lời của bạn trước khi nộp!');
    return;
  }

  btn.disabled = true;
  const originalText = btn.innerHTML;
  btn.innerHTML = '⏳ AI Quản gia đang chấm bài...';

  try {
    const res = await fetch(`${state.apiBase}/api/v1/study/evaluate`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        day: currentDay,
        task_id: taskId,
        user_answer: answer
      })
    });

    btn.disabled = false;
    btn.innerHTML = originalText;

    if (res.ok) {
      const evalData = await res.json();
      const evalContainer = document.getElementById(`eval-result-container-${taskId}`);
      if (evalContainer) {
        const task = (state.todayData?.tasks || []).find(t => t.id === taskId) || { id: taskId };
        if (evalData.can_unlock_solution) {
          task.is_solution_unlocked = true;
          task.solution = evalData.solution;
        }
        evalContainer.innerHTML = renderEvaluationHtml(evalData, task);
      }

      if (evalData.status === 'CORRECT') {
        card.classList.add('done');
        const cb = card.querySelector('.task-checkbox');
        if (cb) cb.checked = true;
      }
    } else {
      alert('Lỗi kết nối máy chủ khi nộp bài.');
    }
  } catch (e) {
    btn.disabled = false;
    btn.innerHTML = originalText;
    alert(`Không gọi được AI chấm bài: ${e.message}`);
  }
}

window.toggleSolutionBox = function(taskId) {
  const wrapper = document.getElementById(`solution-wrapper-${taskId}`);
  if (wrapper) {
    wrapper.style.display = (wrapper.style.display === 'none' || !wrapper.style.display) ? 'block' : 'none';
  }
};

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
  if (!word || !word.trim()) return;
  const term = word.trim();

  if (vocabTranslateBtn) {
    vocabTranslateBtn.disabled = true;
    vocabTranslateBtn.textContent = '⏳ Đang tra...';
  }
  if (vocabInput) vocabInput.disabled = true;
  vocabLoading.style.display = 'block';
  vocabResultContainer.innerHTML = '';

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 9000);

  try {
    const res = await fetch(`${state.apiBase}/api/v1/vocab/translate`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ word: term }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      renderVocabResult(data);
      // Asynchronously refresh due list without blocking UI
      setTimeout(() => loadDueVocab(), 400);
    } else {
      vocabResultContainer.innerHTML = `<p style="color:#f87171; font-size:0.85rem;">Lỗi kết nối Quản gia dịch thuật (${res.status}). Vui lòng bấm thử lại.</p>`;
    }
  } catch (e) {
    clearTimeout(timeoutId);
    const msg = e.name === 'AbortError'
      ? 'Hết thời gian chờ AI phản hồi (quá 9s). Vui lòng thử lại.'
      : e.message;
    vocabResultContainer.innerHTML = `<p style="color:#f87171; font-size:0.85rem;">Không gọi được API dịch: ${escapeHtml(msg)}</p>`;
  } finally {
    vocabLoading.style.display = 'none';
    if (vocabTranslateBtn) {
      vocabTranslateBtn.disabled = false;
      vocabTranslateBtn.textContent = 'Dịch & Lưu';
    }
    if (vocabInput) {
      vocabInput.disabled = false;
      vocabInput.focus();
    }
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

  const wordJsSafe = item.word.replace(/'/g, "\\'");
  const safeId = item.word.toLowerCase().replace(/[^a-z0-9]/g, '_');

  vocabResultContainer.innerHTML = `
    <div class="vocab-result-card">
      <div class="vocab-word-head">
        <div>
          <span class="vocab-word-title">${escapeHtml(item.word)}</span>
          <span class="vocab-phonetic">${escapeHtml(item.phonetic || '')}</span>
          ${item.part_of_speech ? `<span class="badge" style="font-size:0.7rem; background:#0f172a; color:#38bdf8; margin-left:6px;">${escapeHtml(item.part_of_speech)}</span>` : ''}
        </div>
        <button class="btn-sm" onclick="playTTS('${wordJsSafe}')">🔊 Nghe</button>
      </div>
      <div class="vocab-meaning">🇻🇳 ${escapeHtml(item.vietnamese || '')}</div>
      <div class="vocab-context">💡 <strong>Bối cảnh ICOIN:</strong> ${escapeHtml(item.technical_context || '')}</div>
      ${item.example_sentence ? `<div class="vocab-example">📝 "${escapeHtml(item.example_sentence)}"</div>` : ''}
      
      <!-- Speech Pronunciation Test (>= 80% Threshold) -->
      <div class="speech-test-card">
        <div class="speech-test-title">
          🎙️ Kiểm tra Phát âm (AI Chấm điểm ≥ 80% để cho qua):
        </div>
        <div class="speech-test-actions">
          <button class="btn-sm" onclick="playTTS('${wordJsSafe}')">🔊 Nghe mẫu</button>
          <button class="btn-record-word" id="btn-speech-${safeId}" onclick="window.testWordPronunciation('${wordJsSafe}', 'btn-speech-${safeId}', 'speech-res-${safeId}')">
            🎙️ Bấm để đọc từ này
          </button>
        </div>
        <div id="speech-res-${safeId}"></div>
      </div>

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
      if (dueCountBadge) dueCountBadge.textContent = state.dueVocab.length;
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

    const wordJsSafe = item.word.replace(/'/g, "\\'");
    const safeWord = escapeHtml(item.word);
    const safeId = item.word.toLowerCase().replace(/[^a-z0-9]/g, '_');

    const box = document.createElement('div');
    box.className = 'srs-quiz-box';
    box.id = `srs-box-${safeWord}`;

    let questionContent = `<div class="srs-prompt">${escapeHtml(q.prompt)}</div>`;
    if (q.options && q.options.length > 0) {
      questionContent += `<div class="srs-options-list">` +
        q.options.map(opt => `<button class="srs-opt-btn" onclick="revealAnswer('${safeWord}')">${escapeHtml(opt)}</button>`).join('') +
        `</div>`;
    }

    box.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span class="srs-badge-type">Dạng bài: ${q.type}</span>
        <span style="font-size:0.75rem; color:#94a3b8;">Lần nhắc: #${item.srs ? item.srs.repetition + 1 : 1}</span>
      </div>
      ${questionContent}
      
      <!-- Speech Pronunciation Test in Review (>= 80% to pass) -->
      <div class="speech-test-card" style="margin-top: 8px;">
        <div class="speech-test-title">
          🗣️ Đọc to từ vựng tiếng Anh (Cần đạt ≥ 80% để cho qua):
        </div>
        <div class="speech-test-actions">
          <button class="btn-sm" onclick="playTTS('${wordJsSafe}')">🔊 Nghe mẫu</button>
          <button class="btn-record-word" id="btn-due-speech-${safeId}" onclick="window.testWordPronunciation('${wordJsSafe}', 'btn-due-speech-${safeId}', 'due-speech-res-${safeId}', (score) => {
            setTimeout(() => gradeReview('${wordJsSafe}', 5), 1200);
          })">
            🎙️ Phát âm để kiểm tra
          </button>
        </div>
        <div id="due-speech-res-${safeId}"></div>
      </div>

      <button class="btn-sm" id="btn-reveal-${safeWord}" onclick="revealAnswer('${safeWord}')">
        👁️ Xem đáp án
      </button>
      <div id="answer-box-${safeWord}" style="display:none;" class="srs-answer-reveal">
        <div><strong>Đáp án:</strong> ${escapeHtml(q.answer || item.word)}</div>
        <div style="margin-top:4px; font-size:0.8rem; color:#cbd5e1;">${escapeHtml(item.vietnamese || '')}</div>
        <div style="margin-top:8px; font-size:0.78rem;">Đánh giá mức độ nhớ của bạn:</div>
        <div class="srs-rating-buttons">
          <button class="btn-rate btn-rate-hard" onclick="gradeReview('${wordJsSafe}', 1)">Khó / Quên (Nhắc lại mai)</button>
          <button class="btn-rate btn-rate-good" onclick="gradeReview('${wordJsSafe}', 3)">Nhớ được (Tiến độ chuẩn)</button>
          <button class="btn-rate btn-rate-easy" onclick="gradeReview('${wordJsSafe}', 5)">Rất dễ (Giãn chu kỳ)</button>
        </div>
      </div>
    `;

    dueVocabListContainer.appendChild(box);
  });
}

// ----------------------------------------------------
// TAB 3: ALL STORED VOCABULARY NOTEBOOK (AUTHENTICATED)
// ----------------------------------------------------
async function loadAllStoredVocab() {
  const authLock = document.getElementById('allVocabAuthLock');
  const content = document.getElementById('allVocabContent');
  const container = document.getElementById('allVocabListContainer');

  if (!state.isAuthenticated) {
    if (authLock) authLock.style.display = 'block';
    if (content) content.style.display = 'none';
    return;
  }

  if (authLock) authLock.style.display = 'none';
  if (content) content.style.display = 'block';
  if (container) container.innerHTML = `<p style="color:#94a3b8; font-size:0.85rem; text-align:center;">⏳ Đang tải danh sách từ vựng cá nhân...</p>`;

  try {
    const res = await fetch(`${state.apiBase}/api/v1/vocab/all`, {
      headers: getHeaders()
    });
    if (res.ok) {
      state.allVocab = await res.json();
      if (allCountBadge) allCountBadge.textContent = state.allVocab.length;
      renderAllVocabList(state.allVocab);
    } else {
      if (container) container.innerHTML = `<p style="color:#f87171; font-size:0.85rem;">Không tải được danh sách từ (${res.status}).</p>`;
    }
  } catch (e) {
    if (container) container.innerHTML = `<p style="color:#f87171; font-size:0.85rem;">Lỗi kết nối: ${e.message}</p>`;
  }
}

function renderAllVocabList(vocabArray) {
  const container = document.getElementById('allVocabListContainer');
  if (!container) return;

  if (!vocabArray || vocabArray.length === 0) {
    container.innerHTML = `<p style="color:#94a3b8; font-size:0.85rem; text-align:center; padding:20px 0;">Sổ từ vựng đang trống. Hãy tra và lưu các từ mới!</p>`;
    return;
  }

  container.innerHTML = '';
  vocabArray.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'all-vocab-item-card';
    const wordJsSafe = item.word.replace(/'/g, "\\'");
    const srs = item.srs || {};
    const safeWord = escapeHtml(item.word);
    const cardId = `all-card-${index}`;

    card.innerHTML = `
      <div class="all-vocab-head">
        <div>
          <span class="all-vocab-word">${safeWord}</span>
          <span class="all-vocab-phonetic">${escapeHtml(item.phonetic || '')}</span>
          ${item.part_of_speech ? `<span class="badge" style="font-size:0.7rem; background:#0f172a; color:#38bdf8; margin-left:4px;">${escapeHtml(item.part_of_speech)}</span>` : ''}
        </div>
        <button class="btn-sm" onclick="playTTS('${wordJsSafe}')">🔊 Nghe</button>
      </div>
      <div class="all-vocab-meaning">🇻🇳 ${escapeHtml(item.vietnamese || '')}</div>
      ${item.technical_context ? `<div style="font-size:0.78rem; color:#94a3b8; line-height:1.4;">💡 ${escapeHtml(item.technical_context)}</div>` : ''}
      
      <div class="speech-test-card" style="margin-top:6px; padding:6px 10px;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:0.75rem; color:#f1f5f9; font-weight:600;">🎙️ Luyện đọc (≥ 80%):</span>
          <button class="btn-record-word" style="padding:3px 8px; font-size:0.72rem;" id="btn-all-speech-${index}" onclick="window.testWordPronunciation('${wordJsSafe}', 'btn-all-speech-${index}', 'all-speech-res-${index}')">
            🎙️ Đọc kiểm tra
          </button>
        </div>
        <div id="all-speech-res-${index}"></div>
      </div>

      <div class="all-vocab-meta">
        <span>📅 Ôn tiếp: <strong>${escapeHtml(srs.next_review || 'Chưa có')}</strong> (Cách ${srs.interval_days || 1}d)</span>
        <span>${srs.revisits ? `🔄 Đã tra lại: ${srs.revisits} lần` : `Lần ôn: #${srs.repetition || 0}`}</span>
      </div>
    `;

    container.appendChild(card);
  });
}

// ----------------------------------------------------
// PRONUNCIATION GRADING (>= 80% THRESHOLD TO PASS)
// ----------------------------------------------------
function calculatePronunciationScore(spoken, target) {
  if (!spoken || !target) return 0;
  const s = spoken.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  const t = target.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  if (s === t) return 100;
  if (!s || !t) return 0;

  // Levenshtein distance calculation
  const track = Array(t.length + 1).fill(null).map(() =>
    Array(s.length + 1).fill(null));
  for (let i = 0; i <= t.length; i += 1) track[i][0] = i;
  for (let j = 0; j <= s.length; j += 1) track[0][j] = j;
  for (let i = 1; i <= t.length; i += 1) {
    for (let j = 1; j <= s.length; j += 1) {
      const indicator = t[i - 1] === s[j - 1] ? 0 : 1;
      track[i][j] = Math.min(
        track[i - 1][j] + 1,
        track[i][j - 1] + 1,
        track[i - 1][j - 1] + indicator
      );
    }
  }
  const distance = track[t.length][s.length];
  const maxLen = Math.max(t.length, s.length);
  const similarity = Math.max(0, 1 - (distance / maxLen));
  return Math.round(similarity * 100);
}

window.testWordPronunciation = function(targetWord, btnId, resultId, onPassCallback) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const btn = document.getElementById(btnId);
  const resultEl = document.getElementById(resultId);

  if (!SpeechRecognition) {
    if (resultEl) {
      resultEl.innerHTML = `<span style="color:#fbbf24; font-size:0.78rem;">Trình duyệt không hỗ trợ Mic. Tạm tính đạt chuẩn: 100%</span>`;
      if (onPassCallback) onPassCallback(100);
    }
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;

  if (btn) {
    btn.classList.add('recording');
    btn.textContent = '🔴 Đang nghe... Hãy đọc to!';
  }

  recognition.onresult = (event) => {
    const spoken = event.results[0][0].transcript;
    const score = calculatePronunciationScore(spoken, targetWord);
    const isPass = score >= 80;

    if (btn) {
      btn.classList.remove('recording');
      btn.textContent = '🎙️ Đọc lại từ này';
    }

    if (resultEl) {
      resultEl.innerHTML = `
        <div class="speech-score-badge ${isPass ? 'pass' : 'fail'}">
          ${isPass ? '🟢 Đạt chuẩn' : '🔴 Chưa đạt'}: ${score}% (Cần ≥ 80%)
        </div>
        <div class="speech-feedback-text">
          ${isPass 
            ? `🎉 Tuyệt vời! Bạn đã phát âm chính xác từ "<strong>${escapeHtml(targetWord)}</strong>". Đã cho qua!` 
            : `Bạn đã đọc thành: "<em>${escapeHtml(spoken)}</em>" (Từ chuẩn: "<strong>${escapeHtml(targetWord)}</strong>"). Hãy nghe lại mẫu và thử lại!`
          }
        </div>
      `;
    }

    if (isPass && onPassCallback) {
      onPassCallback(score);
    }
  };

  recognition.onerror = (e) => {
    if (btn) {
      btn.classList.remove('recording');
      btn.textContent = '🎙️ Thử lại';
    }
    if (resultEl) {
      resultEl.innerHTML = `<span style="color:#f87171; font-size:0.78rem;">Lỗi mic: ${e.error}. Hãy cho phép quyền micro trên trình duyệt.</span>`;
    }
  };

  recognition.start();
};

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
