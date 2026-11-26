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
  dueVocab: [],
  allVocab: null,
  totalDueInitial: 0,
  activeMainTab: 'lesson'
};

// DOM Elements - Main Top Tabs & Views
const mainTabsNav = document.getElementById('mainTabsNav');
const mainTabLessonBtn = document.getElementById('mainTabLessonBtn');
const mainTabTranslateBtn = document.getElementById('mainTabTranslateBtn');
const mainTabReviewBtn = document.getElementById('mainTabReviewBtn');
const mainTabNotebookBtn = document.getElementById('mainTabNotebookBtn');
const viewLesson = document.getElementById('viewLesson');
const viewTranslate = document.getElementById('viewTranslate');
const viewReview = document.getElementById('viewReview');
const viewNotebook = document.getElementById('viewNotebook');

// Main Tab Translate Elements (Tab 2)
const mainTargetWordBox = document.getElementById('mainTargetWordBox');
const mainTargetWordDisplay = document.getElementById('mainTargetWordDisplay');
const mainTypingStatus = document.getElementById('mainTypingStatus');
const btnMainFillQuick = document.getElementById('btnMainFillQuick');
const mainVocabInput = document.getElementById('mainVocabInput');
const mainVocabTranslateBtn = document.getElementById('mainVocabTranslateBtn');
const mainVocabLoading = document.getElementById('mainVocabLoading');
const mainVocabResultContainer = document.getElementById('mainVocabResultContainer');

// Quick Word Translation Popover
const quickWordPopover = document.getElementById('quickWordPopover');
const popoverWord = document.getElementById('popoverWord');
const popoverIpa = document.getElementById('popoverIpa');
const popoverTtsBtn = document.getElementById('popoverTtsBtn');
const popoverCloseBtn = document.getElementById('popoverCloseBtn');
const popoverBody = document.getElementById('popoverBody');
const popoverSaveBtn = document.getElementById('popoverSaveBtn');
const popoverOpenTabBtn = document.getElementById('popoverOpenTabBtn');

// Red Dot Gamification Badges
const lessonRedDot = document.getElementById('lessonRedDot');
const reviewRedDot = document.getElementById('reviewRedDot');
const reviewCountBadge = document.getElementById('reviewCountBadge');
const reviewProgressText = document.getElementById('reviewProgressText');
const reviewProgressRatio = document.getElementById('reviewProgressRatio');
const reviewZeroInboxBadge = document.getElementById('reviewZeroInboxBadge');
const reviewProgressFill = document.getElementById('reviewProgressFill');
const mainDueVocabList = document.getElementById('mainDueVocabList');

// Main Notebook Elements (Tab 3)
const mainNotebookAuthLock = document.getElementById('mainNotebookAuthLock');
const mainNotebookContent = document.getElementById('mainNotebookContent');
const mainNotebookSearchInput = document.getElementById('mainNotebookSearchInput');
const mainNotebookTotalCount = document.getElementById('mainNotebookTotalCount');
const mainNotebookListContainer = document.getElementById('mainNotebookListContainer');
const btnOpenAuthFromMainNotebook = document.getElementById('btnOpenAuthFromMainNotebook');

// Header & Common Elements
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

// Chat Widget Elements (Quick Translation & Word Practice)
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
const bubbleDueBadge = document.getElementById('bubbleDueBadge');
const bubbleChatDueCount = document.getElementById('bubbleChatDueCount');
const scheduleReminderCard = document.getElementById('scheduleReminderCard');
const scheduleStatusText = document.getElementById('scheduleStatusText');
const scheduleButlerMoodText = document.getElementById('scheduleButlerMoodText');
const scheduleDueVocabText = document.getElementById('scheduleDueVocabText');
const scheduleDueBtnCount = document.getElementById('scheduleDueBtnCount');
const btnOpenDueVocabNow = document.getElementById('btnOpenDueVocabNow');
const btnTestReminderPing = document.getElementById('btnTestReminderPing');
const pingReminderFeedback = document.getElementById('pingReminderFeedback');

window.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('token')) {
    state.token = urlParams.get('token');
    localStorage.setItem('icoin_token', state.token);
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  setupEventListeners();
  updateSpeedButtonsAcrossUI();
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

  // Schedule Card Quick Actions & Main Tabs
  btnOpenDueVocabNow?.addEventListener('click', () => {
    window.switchMainTab('review');
  });

  btnOpenAuthFromMainNotebook?.addEventListener('click', () => {
    authModal.classList.remove('hidden');
  });

  mainNotebookSearchInput?.addEventListener('input', () => {
    const q = mainNotebookSearchInput.value.toLowerCase().trim();
    if (!state.allVocab) return;
    if (!q) {
      renderMainNotebookList(state.allVocab);
      return;
    }
    const filtered = state.allVocab.filter(item => {
      const w = (item.word || '').toLowerCase();
      const v = (item.vietnamese || '').toLowerCase();
      const c = (item.technical_context || '').toLowerCase();
      return w.includes(q) || v.includes(q) || c.includes(q);
    });
    renderMainNotebookList(filtered);
  });

  btnTestReminderPing?.addEventListener('click', async () => {
    if (btnTestReminderPing.disabled) return;
    btnTestReminderPing.disabled = true;
    btnTestReminderPing.textContent = '⏳ Đang gửi tin Telegram...';
    if (pingReminderFeedback) {
      pingReminderFeedback.style.display = 'none';
    }

    try {
      const res = await fetch(`${state.apiBase}/api/v1/study/remind-now`, {
        method: 'POST',
        headers: getHeaders()
      });
      const data = await res.json();
      if (data.success) {
        if (pingReminderFeedback) {
          pingReminderFeedback.textContent = '✅ Quản gia đã gửi câu hỏi & lịch nhắc tới Telegram của bạn!';
          pingReminderFeedback.style.display = 'inline-flex';
          pingReminderFeedback.style.color = '#34d399';
        }
      } else {
        if (pingReminderFeedback) {
          pingReminderFeedback.textContent = '⚠️ Lỗi gửi tin Telegram. Kiểm tra lại kết nối bot.';
          pingReminderFeedback.style.display = 'inline-flex';
          pingReminderFeedback.style.color = '#f87171';
        }
      }
    } catch (err) {
      if (pingReminderFeedback) {
        pingReminderFeedback.textContent = '❌ Lỗi kết nối backend C++.';
        pingReminderFeedback.style.display = 'inline-flex';
        pingReminderFeedback.style.color = '#f87171';
      }
    } finally {
      btnTestReminderPing.disabled = false;
      btnTestReminderPing.textContent = '🔔 Gửi tin kiểm tra Telegram ngay';
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

  // Quick fill button in floating chat
  btnFillQuick?.addEventListener('click', () => {
    const target = vocabInput?.dataset.targetWord || '';
    if (target && vocabInput) {
      vocabInput.value = target;
      vocabInput.dispatchEvent(new Event('input'));
      vocabInput.focus();
    }
  });

  // Main Tab Vocab Translation & Typing (Tab 2)
  mainVocabTranslateBtn?.addEventListener('click', () => {
    const w = mainVocabInput?.value.trim();
    if (w) translateVocab(w);
  });

  mainVocabInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const w = mainVocabInput?.value.trim();
      if (w) translateVocab(w);
    }
  });

  mainVocabInput?.addEventListener('input', () => {
    const target = (mainVocabInput.dataset.targetWord || '').trim();
    if (!target || !mainTargetWordDisplay || !mainTypingStatus) return;

    const val = mainVocabInput.value;
    if (!val) {
      mainTargetWordDisplay.textContent = target;
      mainTypingStatus.className = 'typing-status';
      mainTypingStatus.textContent = 'Hãy gõ lại từ trên vào ô bên dưới để nhớ mặt chữ...';
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

    mainTargetWordDisplay.innerHTML = matchedHtml;

    if (val.toLowerCase() === target.toLowerCase()) {
      mainTypingStatus.className = 'typing-status correct';
      mainTypingStatus.textContent = '✅ Rất tốt! Bạn đã gõ đúng 100%. Bấm "Dịch & Lưu Vào Sổ" để tiếp tục!';
    } else if (!isMatchSoFar) {
      mainTypingStatus.className = 'typing-status mismatch';
      mainTypingStatus.textContent = '⚠️ Có ký tự chưa khớp. Hãy kiểm tra lại từ mẫu ở trên!';
    } else {
      mainTypingStatus.className = 'typing-status';
      mainTypingStatus.textContent = `Đang gõ đúng: ${val.length}/${target.length} ký tự...`;
    }
  });

  btnMainFillQuick?.addEventListener('click', () => {
    const target = mainVocabInput?.dataset.targetWord || '';
    if (target && mainVocabInput) {
      mainVocabInput.value = target;
      mainVocabInput.dispatchEvent(new Event('input'));
      mainVocabInput.focus();
    }
  });

  // Quick Word Popover Actions
  popoverCloseBtn?.addEventListener('click', () => {
    hideQuickWordPopover();
  });

  popoverOpenTabBtn?.addEventListener('click', () => {
    const w = quickWordPopover?.dataset.currentWord;
    hideQuickWordPopover();
    window.switchMainTab('translate');
    if (w) {
      setWordToPractice(w);
      translateVocab(w);
    }
  });

  popoverSaveBtn?.addEventListener('click', async () => {
    const w = quickWordPopover?.dataset.currentWord;
    if (!w) return;
    popoverSaveBtn.disabled = true;
    popoverSaveBtn.textContent = '⏳ Đang lưu...';
    try {
      await translateVocab(w);
      popoverSaveBtn.textContent = '✅ Đã lưu vào sổ!';
      setTimeout(() => hideQuickWordPopover(), 1000);
    } catch (_) {
      popoverSaveBtn.textContent = '❌ Lỗi lưu';
      popoverSaveBtn.disabled = false;
    }
  });

  // Close popover when clicking outside
  document.addEventListener('click', (e) => {
    if (quickWordPopover && !quickWordPopover.classList.contains('hidden')) {
      if (!e.target.closest('#quickWordPopover')) {
        hideQuickWordPopover();
      }
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

// ====================================================
// MAIN PAGE TOP NAVIGATION TABS & RED DOT GAMIFICATION
// ====================================================
window.switchMainTab = function(tabName) {
  state.activeMainTab = tabName;
  mainTabLessonBtn?.classList.remove('active');
  mainTabTranslateBtn?.classList.remove('active');
  mainTabReviewBtn?.classList.remove('active');
  mainTabNotebookBtn?.classList.remove('active');

  if (viewLesson) viewLesson.style.display = 'none';
  if (viewTranslate) viewTranslate.style.display = 'none';
  if (viewReview) viewReview.style.display = 'none';
  if (viewNotebook) viewNotebook.style.display = 'none';

  if (tabName === 'lesson') {
    mainTabLessonBtn?.classList.add('active');
    if (viewLesson) viewLesson.style.display = 'block';
  } else if (tabName === 'translate') {
    mainTabTranslateBtn?.classList.add('active');
    if (viewTranslate) viewTranslate.style.display = 'block';
    setTimeout(() => mainVocabInput?.focus(), 120);
  } else if (tabName === 'review') {
    mainTabReviewBtn?.classList.add('active');
    if (viewReview) viewReview.style.display = 'block';
    loadDueVocab();
  } else if (tabName === 'notebook') {
    mainTabNotebookBtn?.classList.add('active');
    if (viewNotebook) viewNotebook.style.display = 'block';
    loadMainNotebook();
  }

  window.updateRedDots();
};

window.updateRedDots = function() {
  // 1. Check Daily Lesson Tasks for today
  const tasks = state.todayData?.tasks || [];
  const incompleteLessonTasks = tasks.filter(t => !t.is_done).length;
  if (lessonRedDot) {
    lessonRedDot.style.display = (incompleteLessonTasks > 0) ? 'inline-block' : 'none';
  }

  // 2. Check Due Vocab for Review
  const dueCount = (state.dueVocab || []).length;
  if (reviewRedDot) {
    reviewRedDot.style.display = (dueCount > 0) ? 'inline-block' : 'none';
  }
  if (reviewCountBadge) {
    reviewCountBadge.style.display = (dueCount > 0) ? 'inline-block' : 'none';
    reviewCountBadge.textContent = dueCount;
  }

  // Update Review Progress & Zero-Inbox Status
  if (dueCount > state.totalDueInitial) {
    state.totalDueInitial = dueCount;
  }
  const total = Math.max(state.totalDueInitial, dueCount);
  const completed = Math.max(0, total - dueCount);
  const pct = total > 0 ? Math.round((completed / total) * 100) : 100;

  if (reviewProgressRatio) {
    reviewProgressRatio.textContent = `${completed}/${total} từ (${pct}%)`;
  }
  if (reviewProgressFill) {
    reviewProgressFill.style.width = `${pct}%`;
  }
  if (reviewZeroInboxBadge) {
    if (dueCount === 0 && total > 0) {
      reviewZeroInboxBadge.className = 'zero-inbox-status cleared';
      reviewZeroInboxBadge.innerHTML = '🎉 Đã hoàn thành (0 chấm đỏ)!';
    } else if (dueCount === 0) {
      reviewZeroInboxBadge.className = 'zero-inbox-status cleared';
      reviewZeroInboxBadge.innerHTML = '🎉 Không có từ nợ';
    } else {
      reviewZeroInboxBadge.className = 'zero-inbox-status pending';
      reviewZeroInboxBadge.innerHTML = '<span class="red-dot-circle"></span> Còn từ chưa ôn';
    }
  }

  // Update Schedule Card & Floating Bubble
  if (scheduleDueVocabText) {
    scheduleDueVocabText.textContent = dueCount > 0 ? `${dueCount} từ cần ôn tập` : '0 từ (Đã hoàn tất 🎉)';
    scheduleDueVocabText.className = dueCount > 0 ? 'grid-val danger' : 'grid-val active';
  }
  if (scheduleDueBtnCount) {
    scheduleDueBtnCount.textContent = dueCount;
  }
  if (bubbleDueBadge) {
    bubbleDueBadge.textContent = dueCount;
    bubbleDueBadge.style.display = dueCount > 0 ? 'inline-flex' : 'none';
  }
  if (bubbleChatDueCount) {
    bubbleChatDueCount.textContent = dueCount;
  }

  // Update Butler Duolingo-style Emotional Mood Indicator
  if (scheduleButlerMoodText) {
    if (dueCount === 0 && incompleteLessonTasks === 0 && state.isAuthenticated) {
      scheduleButlerMoodText.textContent = '😌 Hài lòng & an tâm (Hôm nay đã xong!)';
      scheduleButlerMoodText.className = 'grid-val active';
    } else {
      const h = new Date().getHours();
      if (h >= 5 && h < 14) {
        scheduleButlerMoodText.textContent = '😊 Nhẹ nhàng, động viên (Mức 1/5)';
        scheduleButlerMoodText.className = 'grid-val active';
      } else if (h >= 14 && h < 17) {
        scheduleButlerMoodText.textContent = '🥺 Bắt đầu sốt ruột (Mức 2/5)';
        scheduleButlerMoodText.className = 'grid-val';
      } else if (h >= 17 && h < 20) {
        scheduleButlerMoodText.textContent = '😤 Tổn thương & gắt (Mức 3/5)';
        scheduleButlerMoodText.className = 'grid-val danger';
      } else if (h >= 20 && h < 22) {
        scheduleButlerMoodText.textContent = '🚨 Báo động đỏ cực gắt (Mức 4-5/5)';
        scheduleButlerMoodText.className = 'grid-val danger';
      } else {
        scheduleButlerMoodText.textContent = '💀 Tối hậu thư nửa đêm! (Mức 5/5)';
        scheduleButlerMoodText.className = 'grid-val danger';
      }
    }
  }
};

async function loadMainNotebook() {
  if (!state.isAuthenticated) {
    if (mainNotebookAuthLock) mainNotebookAuthLock.style.display = 'block';
    if (mainNotebookContent) mainNotebookContent.style.display = 'none';
    return;
  }

  if (mainNotebookAuthLock) mainNotebookAuthLock.style.display = 'none';
  if (mainNotebookContent) mainNotebookContent.style.display = 'block';
  if (mainNotebookListContainer) {
    mainNotebookListContainer.innerHTML = `<p style="color:#94a3b8; font-size:0.9rem; text-align:center; padding:20px 0;">⏳ Đang tải toàn bộ sổ từ vựng cá nhân từ máy chủ...</p>`;
  }

  try {
    const res = await fetch(`${state.apiBase}/api/v1/vocab/all`, {
      headers: getHeaders()
    });
    if (res.ok) {
      state.allVocab = await res.json();
      if (mainNotebookTotalCount) {
        mainNotebookTotalCount.textContent = `Tổng: ${state.allVocab.length} từ`;
      }
      renderMainNotebookList(state.allVocab);
    } else {
      if (mainNotebookListContainer) {
        mainNotebookListContainer.innerHTML = `<p style="color:#f87171; font-size:0.9rem;">Không tải được sổ từ vựng (${res.status}).</p>`;
      }
    }
  } catch (e) {
    if (mainNotebookListContainer) {
      mainNotebookListContainer.innerHTML = `<p style="color:#f87171; font-size:0.9rem;">Lỗi kết nối máy chủ: ${e.message}</p>`;
    }
  }
}

function renderMainNotebookList(vocabArray) {
  if (!mainNotebookListContainer) return;
  if (!vocabArray || vocabArray.length === 0) {
    mainNotebookListContainer.innerHTML = `<p style="color:#94a3b8; font-size:0.9rem; text-align:center; padding:30px 0;">Sổ từ vựng đang trống. Hãy tra và lưu các từ mới!</p>`;
    return;
  }

  mainNotebookListContainer.innerHTML = '';
  vocabArray.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'all-vocab-item-card';
    const wordJsSafe = item.word.replace(/'/g, "\\'");
    const srs = item.srs || {};
    const safeWord = escapeHtml(item.word);

    card.innerHTML = `
      <div class="all-vocab-head">
        <div>
          <span class="all-vocab-word">${safeWord}</span>
          ${item.phonetic ? `<span class="all-vocab-phonetic">${escapeHtml(item.phonetic)}</span>` : ''}
          ${item.part_of_speech ? `<span class="badge" style="font-size:0.75rem; background:#0f172a; color:#38bdf8; margin-left:6px;">${escapeHtml(item.part_of_speech)}</span>` : ''}
        </div>
        <button class="btn-sm" onclick="playTTS('${wordJsSafe}', this)">🔊 Nghe</button>
      </div>
      <div class="all-vocab-meaning">🇻🇳 ${escapeHtml(item.vietnamese || '')}</div>
      ${item.technical_context ? `<div style="font-size:0.82rem; color:#94a3b8; line-height:1.4; margin-top:4px;">💡 <strong>Bối cảnh:</strong> ${escapeHtml(item.technical_context)}</div>` : ''}
      
      <div class="speech-test-card" style="margin-top:8px; padding:8px 12px;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:0.8rem; color:#f1f5f9; font-weight:600;">🎙️ Luyện đọc từ này (≥ 80%):</span>
          <button class="btn-record-word" style="padding:4px 10px; font-size:0.75rem;" id="btn-main-all-speech-${index}" onclick="window.testWordPronunciation('${wordJsSafe}', 'btn-main-all-speech-${index}', 'main-all-speech-res-${index}')">
            🎙️ Đọc kiểm tra
          </button>
        </div>
        <div id="main-all-speech-res-${index}"></div>
      </div>

      <div class="all-vocab-meta">
        <span>📅 Chu kỳ tiếp theo: <strong>${escapeHtml(srs.next_review || 'Hôm nay')}</strong> (Giãn ${srs.interval_days || 1} ngày)</span>
        <span>${srs.revisits ? `🔄 Đã gặp lại: ${srs.revisits} lần` : `Lần ôn: #${srs.repetition || 0}`}</span>
      </div>
    `;

    mainNotebookListContainer.appendChild(card);
  });
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
  if (!range || !range.startContainer) {
    return '';
  }
  let node = range.startContainer;
  let offset = range.startOffset;
  if (node.nodeType === Node.ELEMENT_NODE) {
    if (node.childNodes && node.childNodes[offset] && node.childNodes[offset].nodeType === Node.TEXT_NODE) {
      node = node.childNodes[offset];
      offset = 0;
    } else if (node.firstChild && node.firstChild.nodeType === Node.TEXT_NODE) {
      node = node.firstChild;
      offset = 0;
    } else {
      return '';
    }
  }
  if (!node || node.nodeType !== Node.TEXT_NODE) {
    return '';
  }
  const text = node.textContent;
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

let popoverAbortController = null;

function showQuickWordPopover(word, clientX, clientY) {
  if (!quickWordPopover || !word) return;
  const cleaned = word.trim().replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '');
  if (!cleaned || cleaned.length < 2) return;

  quickWordPopover.dataset.currentWord = cleaned;

  if (popoverWord) popoverWord.textContent = cleaned;
  if (popoverIpa) popoverIpa.textContent = '';
  if (popoverBody) popoverBody.innerHTML = '<div class="popover-loading">⏳ Quản gia AI đang tra nghĩa...</div>';
  if (popoverSaveBtn) {
    popoverSaveBtn.disabled = false;
    popoverSaveBtn.textContent = '💾 Lưu vào Sổ';
  }

  // Show & calculate coordinates
  quickWordPopover.classList.remove('hidden');
  const popoverWidth = 320;
  const popoverHeight = 170;
  let posX = (clientX || window.innerWidth / 2) - popoverWidth / 2;
  let posY = (clientY || window.innerHeight / 2) + 15;

  if (posX < 10) posX = 10;
  if (posX + popoverWidth > window.innerWidth - 10) posX = window.innerWidth - popoverWidth - 10;
  if (posY + popoverHeight > window.innerHeight - 20) {
    posY = (clientY || window.innerHeight / 2) - popoverHeight - 15;
  }
  if (posY < 10) posY = 10;

  quickWordPopover.style.left = `${Math.round(posX)}px`;
  quickWordPopover.style.top = `${Math.round(posY)}px`;

  // Bind audio button
  if (popoverTtsBtn) {
    popoverTtsBtn.onclick = (ev) => {
      ev.stopPropagation();
      playTTS(cleaned, popoverTtsBtn);
    };
  }

  // Check local caches first
  const cached = (state.dueVocab || []).find(v => v.word.toLowerCase() === cleaned.toLowerCase()) ||
                 (state.allVocab || []).find(v => v.word.toLowerCase() === cleaned.toLowerCase());
  if (cached) {
    renderPopoverContent(cached);
    return;
  }

  if (popoverAbortController) {
    try { popoverAbortController.abort(); } catch (_) {}
  }
  popoverAbortController = new AbortController();

  fetch(`${state.apiBase}/api/v1/vocab/translate`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ word: cleaned }),
    signal: popoverAbortController.signal
  })
  .then(res => res.json())
  .then(data => {
    renderPopoverContent(data);
  })
  .catch(err => {
    if (err.name !== 'AbortError' && popoverBody) {
      popoverBody.innerHTML = `<span style="color:#f87171; font-size:0.8rem;">Lỗi tra cứu: ${escapeHtml(err.message)}</span>`;
    }
  });
}

function renderPopoverContent(data) {
  if (popoverIpa) popoverIpa.textContent = data.phonetic || '';
  if (popoverBody) {
    let html = `<div class="popover-meaning">🇻🇳 ${escapeHtml(data.vietnamese || '')}</div>`;
    if (data.technical_context) {
      html += `<div class="popover-context">💡 <strong>Bối cảnh:</strong> ${escapeHtml(data.technical_context)}</div>`;
    }
    if (data.example_sentence) {
      html += `<div style="font-size:0.78rem; color:#cbd5e1; margin-top:4px;">📝 <em>"${escapeHtml(data.example_sentence)}"</em></div>`;
    }
    popoverBody.innerHTML = html;
  }
}

function hideQuickWordPopover() {
  if (quickWordPopover) {
    quickWordPopover.classList.add('hidden');
  }
}

// Global helper to quickly translate any word and pop up dict
window.quickTranslateWord = function(word, ev) {
  if (ev && typeof ev.stopPropagation === 'function') {
    ev.stopPropagation();
  }
  let clientX = ev ? ev.clientX : undefined;
  let clientY = ev ? ev.clientY : undefined;
  if (clientX === undefined && ev && ev.changedTouches && ev.changedTouches.length > 0) {
    clientX = ev.changedTouches[0].clientX;
    clientY = ev.changedTouches[0].clientY;
  }
  showQuickWordPopover(word, clientX || window.innerWidth / 2, clientY || window.innerHeight / 2);
  setWordToPractice(word);
};

function handleWordClick(e) {
  // Ignore clicks inside popover, modals, rating buttons, audio player controls, or form editing fields
  if (e && e.target && e.target.closest && (
    e.target.closest('#quickWordPopover') || 
    e.target.closest('#floatingLessonPlayer') ||
    e.target.closest('.lesson-audio-player') ||
    e.target.closest('.speak-card-play-btn') ||
    e.target.closest('.modal-card') ||
    e.target.closest('.btn-record-word') ||
    e.target.closest('.btn-rate') ||
    e.target.closest('.main-nav-btn') ||
    e.target.closest('.chat-bubble-toggle') ||
    e.target.tagName === 'INPUT' || 
    e.target.tagName === 'TEXTAREA'
  )) {
    return;
  }

  let clientX = e.clientX;
  let clientY = e.clientY;
  if (clientX === undefined && e.changedTouches && e.changedTouches.length > 0) {
    clientX = e.changedTouches[0].clientX;
    clientY = e.changedTouches[0].clientY;
  } else if (clientX === undefined && e.touches && e.touches.length > 0) {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  }

  // 1. Check if user made a drag selection anywhere (prompts, options, answer reveals, lessons)
  const sel = window.getSelection();
  const selectedText = sel ? sel.toString().trim() : '';
  if (selectedText && selectedText.length >= 2 && selectedText.length <= 50 && !selectedText.includes('\n')) {
    const cleaned = selectedText.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '');
    if (cleaned && /[a-zA-Z]/.test(cleaned)) {
      showQuickWordPopover(cleaned, clientX || 150, clientY || 150);
      setWordToPractice(cleaned);
      return;
    }
  }

  // 2. Check if clicked on a clickable-term or element with data-word
  if (e.target && e.target.closest) {
    const termEl = e.target.closest('.clickable-term') || e.target.closest('[data-word]');
    if (termEl) {
      const termWord = termEl.dataset.word || termEl.textContent.trim();
      const cleaned = termWord.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '');
      if (cleaned && /[a-zA-Z]/.test(cleaned)) {
        showQuickWordPopover(cleaned, clientX, clientY);
        setWordToPractice(cleaned);
        return;
      }
    }
  }

  // 3. Extract word at click position (single click or double click on Edge PC, Chrome, iPhone Safari)
  if (typeof clientX === 'number' && typeof clientY === 'number') {
    const clickedWord = getWordAtPoint(clientX, clientY);
    if (clickedWord && clickedWord.length >= 2 && /[a-zA-Z]/.test(clickedWord)) {
      const cleaned = clickedWord.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '');
      if (cleaned) {
        showQuickWordPopover(cleaned, clientX, clientY);
        setWordToPractice(cleaned);
      }
    }
  }
}

function setWordToPractice(rawWord) {
  if (!rawWord) return;
  const cleaned = rawWord.trim().replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '');
  if (!cleaned || cleaned.length < 2) return;

  // Update Main Tab 2 (Dịch & Tra Từ Mới)
  if (mainTargetWordBox && mainTargetWordDisplay && mainTypingStatus) {
    mainTargetWordDisplay.textContent = cleaned;
    mainTypingStatus.className = 'typing-status';
    mainTypingStatus.textContent = 'Hãy gõ lại từ trên vào ô bên dưới để nhớ mặt chữ...';
    mainTargetWordBox.style.display = 'block';
  }
  if (mainVocabInput) {
    mainVocabInput.value = '';
    mainVocabInput.dataset.targetWord = cleaned;
    mainVocabInput.placeholder = `Gõ lại: ${cleaned}`;
  }

  // Also update floating chat widget
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
      await loadDueVocab();
      window.updateRedDots();
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
  loadDueVocab();
  window.updateRedDots();
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
  if (!m) {
    if (task.items && task.items.length > 0) {
      const itemsText = task.items.join(' ');
      if (/[a-zA-Z]{3,}/.test(itemsText)) {
        const playerId = `lesson-items-${task.id}`;
        registerLessonPlayer(playerId, `🎧 Bài học #${task.id}`, task.items, { playLabel: '▶️ Nghe nội dung' });
        return `<div class="task-material-box">
          <div class="material-title-bar">
            <span class="material-title">🎧 Nghe hướng dẫn & nội dung bài học</span>
          </div>
          ${renderLessonAudioPlayerHtml(playerId)}
        </div>`;
      }
    }
    return '';
  }

  let body = '';
  if (task.type === 'listening') {
    const audioText = m.audio_text || '';
    const playerId = `lesson-listen-${task.id}`;
    registerLessonPlayer(playerId, `🎧 Bài nghe #${task.id}`, audioText, { playLabel: '▶️ Nghe bài' });

    const kwHtml = (m.keywords || []).map(k => `
      <div class="keyword-pill"><strong>${escapeHtml(k.term)}:</strong> ${escapeHtml(k.definition)}</div>
    `).join('');

    body = `
      <div class="material-title-bar">
        <span class="material-title">🎧 Kịch bản âm thanh kỹ thuật (Audio Transcript)</span>
      </div>
      ${renderLessonAudioPlayerHtml(playerId)}
      <div class="material-passage">${renderHighlightablePassageHtml(playerId) || escapeHtml(audioText)}</div>
      ${kwHtml ? `<div style="font-size:0.78rem; color:#94a3b8; margin-top:6px;">🔑 Từ khóa trọng tâm:</div><div class="material-keywords-list">${kwHtml}</div>` : ''}
      ${m.question ? `<div style="margin-top:8px; font-weight:600; color:#e2e8f0;">❓ Câu hỏi trọng tâm: <span style="color:#38bdf8;">${escapeHtml(m.question)}</span></div>` : ''}
    `;
  } else if (task.type === 'speaking') {
    const sampleList = m.sample_sentences || [];
    const playerId = `lesson-speak-${task.id}`;
    registerLessonPlayer(playerId, `🗣️ Luyện nói #${task.id}`, sampleList.map(s => s.en || ''), {
      isSpeakingCards: true,
      playLabel: '▶️ Nghe tất cả mẫu câu'
    });

    const sentences = sampleList.map((s, idx) => `
      <div class="speaking-sentence-card" id="speak-card-${playerId}-${idx}">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px;">
          <div class="speaking-en">"${escapeHtml(s.en)}"</div>
          <button type="button" class="btn-sm speak-card-play-btn" style="padding:3px 9px; font-size:0.75rem; flex-shrink:0;" onclick="window.playSingleSentenceInPlayer('${playerId}', ${idx})">🔊 Nghe câu này</button>
        </div>
        <div class="speaking-ipa">${escapeHtml(s.ipa || '')}</div>
        <div class="speaking-vi">🇻🇳 ${escapeHtml(s.vi || '')}</div>
      </div>
    `).join('');

    body = `
      <div class="material-title-bar">
        <span class="material-title">🗣️ Mẫu câu giao tiếp & Shadowing chuyên ngành</span>
      </div>
      ${renderLessonAudioPlayerHtml(playerId)}
      ${sentences}
      ${m.intonation_tips ? `<div style="font-size:0.78rem; color:#fbbf24; margin-top:6px;">💡 Lưu ý ngữ điệu: ${escapeHtml(m.intonation_tips)}</div>` : ''}
    `;
  } else if (task.type === 'reading') {
    const title = m.datasheet_title || 'Trích đoạn tài liệu kỹ thuật STM32';
    const passage = m.passage || '';
    const playerId = `lesson-read-${task.id}`;
    registerLessonPlayer(playerId, `📖 Bài đọc #${task.id}`, passage, { playLabel: '▶️ Nghe bài đọc' });

    const vocabList = (m.vocabulary_highlights || []).map(v => `
      <div class="keyword-pill"><strong>${escapeHtml(v.term)}:</strong> ${escapeHtml(v.meaning)}</div>
    `).join('');

    body = `
      <div class="material-title-bar">
        <span class="material-title">📖 ${escapeHtml(title)}</span>
      </div>
      ${renderLessonAudioPlayerHtml(playerId)}
      <div class="material-passage">${renderHighlightablePassageHtml(playerId) || escapeHtml(passage)}</div>
      ${vocabList ? `<div style="font-size:0.78rem; color:#94a3b8; margin-top:6px;">🔍 Thuật ngữ then chốt:</div><div class="material-keywords-list">${vocabList}</div>` : ''}
      ${m.question ? `<div style="margin-top:8px; font-weight:600; color:#e2e8f0;">❓ Yêu cầu đọc hiểu: <span style="color:#38bdf8;">${escapeHtml(m.question)}</span></div>` : ''}
    `;
  } else if (task.type === 'writing') {
    const prompt = m.writing_prompt || '';
    const playerId = `lesson-write-${task.id}`;
    registerLessonPlayer(playerId, `✍️ Đề viết #${task.id}`, prompt, { playLabel: '▶️ Nghe đề bài' });

    const args = (m.suggested_arguments || []).map(a => `<li>${escapeHtml(a)}</li>`).join('');
    const vocabs = (m.academic_vocabulary || []).map(v => `<span class="badge" style="background:#1e293b; color:#38bdf8; margin-right:4px;">${escapeHtml(v)}</span>`).join('');

    body = `
      <div class="material-title-bar">
        <span class="material-title">✍️ Đề bài & Hướng dẫn Viết chuẩn Hội thảo IEEE / ICOIN</span>
      </div>
      ${renderLessonAudioPlayerHtml(playerId)}
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
  let solPlayerHtml = '';
  if (sol.answer && task.type !== 'speaking' && /[a-zA-Z]{4,}/.test(sol.answer)) {
    const solPlayerId = `lesson-sol-${task.id}`;
    registerLessonPlayer(solPlayerId, `🎯 Đáp án mẫu #${task.id}`, sol.answer, { playLabel: '▶️ Nghe đáp án mẫu' });
    solPlayerHtml = renderLessonAudioPlayerHtml(solPlayerId);
  }

  return `
    <div class="solution-details-box" id="solution-content-${task.id}">
      <h5>🎯 Đáp án & Lời giải mẫu chuẩn kỹ thuật:</h5>
      <div style="color:#38bdf8; font-weight:500; margin-bottom:8px;">${escapeHtml(sol.answer || '')}</div>
      ${solPlayerHtml}
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

  let improvedPlayerHtml = '';
  if (evalRes.improved_english) {
    const ieeePlayerId = `lesson-ieee-${task.id}`;
    registerLessonPlayer(ieeePlayerId, `📝 Câu chuẩn IEEE #${task.id}`, evalRes.improved_english, { playLabel: '▶️ Nghe câu gợi ý' });
    improvedPlayerHtml = renderLessonAudioPlayerHtml(ieeePlayerId);
  }

  return `
    <div class="ai-eval-result ${badgeClass}">
      <div class="eval-badge ${badgeClass}">${badgeText}</div>
      <div class="eval-feedback">${escapeHtml(evalRes.feedback || '')}</div>
      ${evalRes.improved_english ? `<div class="eval-improved-english">📝 <strong>Gợi ý câu chuẩn IEEE:</strong> "${escapeHtml(evalRes.improved_english)}"${improvedPlayerHtml}</div>` : ''}
      ${unlockBtn}
    </div>
  `;
}

function renderDayContent(day) {
  resetLessonAudioToIdle();
  Object.keys(lessonPlayersRegistry).forEach(k => delete lessonPlayersRegistry[k]);

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
            ${task.is_done 
              ? `<span class="task-status-badge task-status-done" id="task-badge-${task.id}">✅ Đã hoàn thành</span>`
              : `<span class="task-status-badge task-status-pending" id="task-badge-${task.id}"><span class="red-dot-circle"></span> Chưa hoàn thành</span>`
            }
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

  window.updateRedDots();
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
        const task = (state.todayData?.tasks || []).find(t => t.id === taskId);
        if (task) task.is_done = true;
        const badge = card.querySelector(`#task-badge-${taskId}`);
        if (badge) {
          badge.className = 'task-status-badge task-status-done';
          badge.innerHTML = '✅ Đã hoàn thành';
        }
        window.updateRedDots();
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
      const badge = card.querySelector(`#task-badge-${taskId}`);
      if (badge) {
        if (data.is_done) {
          badge.className = 'task-status-badge task-status-done';
          badge.innerHTML = '✅ Đã hoàn thành';
        } else {
          badge.className = 'task-status-badge task-status-pending';
          badge.innerHTML = '<span class="red-dot-circle"></span> Chưa hoàn thành';
        }
      }
      const task = (state.todayData?.tasks || []).find(t => t.id === taskId);
      if (task) task.is_done = data.is_done;
      window.updateRedDots();
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
        const task = (state.todayData?.tasks || []).find(t => t.id === taskId);
        if (task) task.is_done = true;
        const badge = card.querySelector(`#task-badge-${taskId}`);
        if (badge) {
          badge.className = 'task-status-badge task-status-done';
          badge.innerHTML = '✅ Đã hoàn thành';
        }
        window.updateRedDots();
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
  if (mainVocabTranslateBtn) {
    mainVocabTranslateBtn.disabled = true;
    mainVocabTranslateBtn.textContent = '⏳ Đang tra...';
  }
  if (vocabInput) vocabInput.disabled = true;
  if (mainVocabInput) mainVocabInput.disabled = true;
  if (vocabLoading) vocabLoading.style.display = 'block';
  if (mainVocabLoading) mainVocabLoading.style.display = 'block';
  if (vocabResultContainer) vocabResultContainer.innerHTML = '';
  if (mainVocabResultContainer) mainVocabResultContainer.innerHTML = '';

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
      const errHtml = `<p style="color:#f87171; font-size:0.85rem;">Lỗi kết nối Quản gia dịch thuật (${res.status}). Vui lòng bấm thử lại.</p>`;
      if (vocabResultContainer) vocabResultContainer.innerHTML = errHtml;
      if (mainVocabResultContainer) mainVocabResultContainer.innerHTML = errHtml;
    }
  } catch (e) {
    clearTimeout(timeoutId);
    const msg = e.name === 'AbortError'
      ? 'Hết thời gian chờ AI phản hồi (quá 9s). Vui lòng thử lại.'
      : e.message;
    const errHtml = `<p style="color:#f87171; font-size:0.85rem;">Không gọi được API dịch: ${escapeHtml(msg)}</p>`;
    if (vocabResultContainer) vocabResultContainer.innerHTML = errHtml;
    if (mainVocabResultContainer) mainVocabResultContainer.innerHTML = errHtml;
  } finally {
    if (vocabLoading) vocabLoading.style.display = 'none';
    if (mainVocabLoading) mainVocabLoading.style.display = 'none';
    if (vocabTranslateBtn) {
      vocabTranslateBtn.disabled = false;
      vocabTranslateBtn.textContent = 'Dịch & Lưu';
    }
    if (mainVocabTranslateBtn) {
      mainVocabTranslateBtn.disabled = false;
      mainVocabTranslateBtn.textContent = 'Dịch & Lưu Vào Sổ';
    }
    if (vocabInput) {
      vocabInput.disabled = false;
    }
    if (mainVocabInput) {
      mainVocabInput.disabled = false;
      mainVocabInput.focus();
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

  const html = `
    <div class="vocab-result-card">
      <div class="vocab-word-head">
        <div>
          <span class="vocab-word-title">${escapeHtml(item.word)}</span>
          <span class="vocab-phonetic">${escapeHtml(item.phonetic || '')}</span>
          ${item.part_of_speech ? `<span class="badge" style="font-size:0.75rem; background:#0f172a; color:#38bdf8; margin-left:6px;">${escapeHtml(item.part_of_speech)}</span>` : ''}
        </div>
        <button class="btn-sm" onclick="playTTS('${wordJsSafe}', this)">🔊 Nghe</button>
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
          <button class="btn-sm" onclick="playTTS('${wordJsSafe}', this)">🔊 Nghe mẫu</button>
          <button class="btn-record-word" id="btn-speech-${safeId}" onclick="window.testWordPronunciation('${wordJsSafe}', 'btn-speech-${safeId}', 'speech-res-${safeId}')">
            🎙️ Bấm để đọc từ này
          </button>
        </div>
        <div id="speech-res-${safeId}"></div>
      </div>

      ${srsBadge}
    </div>
  `;

  if (vocabResultContainer) vocabResultContainer.innerHTML = html;
  if (mainVocabResultContainer) mainVocabResultContainer.innerHTML = html;
}

async function loadDueVocab() {
  try {
    const res = await fetch(`${state.apiBase}/api/v1/vocab/due`, {
      headers: getHeaders()
    });
    if (res.ok) {
      state.dueVocab = await res.json();
      const count = state.dueVocab.length;
      if (dueCountBadge) dueCountBadge.textContent = count;

      // Update badge on floating bubble button
      if (bubbleDueBadge) {
        bubbleDueBadge.textContent = count;
        bubbleDueBadge.style.display = count > 0 ? 'inline-flex' : 'none';
      }

      // Update schedule status card
      if (scheduleDueVocabText) {
        scheduleDueVocabText.textContent = count > 0 ? `${count} từ cần ôn tập` : '0 từ (Đã hoàn tất 🎉)';
        scheduleDueVocabText.className = count > 0 ? 'grid-val danger' : 'grid-val active';
      }
      if (scheduleDueBtnCount) {
        scheduleDueBtnCount.textContent = count;
      }

      renderDueVocabList();
      window.updateRedDots();
    }
  } catch (e) {
    console.error('Error loading due vocab', e);
  }
}

function renderDueVocabList() {
  const container = mainDueVocabList || dueVocabListContainer;
  if (!container) return;

  if (!state.dueVocab || state.dueVocab.length === 0) {
    container.innerHTML = `
      <div style="background:#1e293b; border:1px solid #334155; border-radius:12px; padding:36px 20px; text-align:center;">
        <div style="font-size:2.6rem; margin-bottom:12px;">🎉</div>
        <h3 style="color:#34d399; font-size:1.25rem; margin-bottom:8px;">Tuyệt vời! Toàn bộ từ vựng đã được ôn tập xong!</h3>
        <p style="color:#94a3b8; font-size:0.92rem; max-width:480px; margin:0 auto; line-height:1.5;">
          Dấu chấm đỏ nhắc nhở đã được xoá sạch. Thuật toán Ebbinghaus SM-2 sẽ tự động xếp lịch ôn tập đợt kế tiếp cho bạn vào sáng mai.
        </p>
      </div>
    `;
    window.updateRedDots();
    return;
  }

  container.innerHTML = '';
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
    box.id = `srs-box-${safeId}`;

    let questionContent = `<div class="srs-prompt">${escapeHtml(q.prompt)}</div>`;
    if (q.options && q.options.length > 0) {
      questionContent += `<div class="srs-options-list">` +
        q.options.map(opt => `<button class="srs-opt-btn" onclick="revealAnswer('${safeId}')">${escapeHtml(opt)}</button>`).join('') +
        `</div>`;
    }

    box.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px;">
        <div style="display:flex; align-items:center; gap:8px;">
          <span class="srs-status-badge pending" id="srs-badge-${safeId}"><span class="red-dot-circle"></span> Cần ôn tập</span>
          <span class="srs-badge-type">Dạng bài: ${q.type}</span>
        </div>
        <span style="font-size:0.75rem; color:#94a3b8;">Lần nhắc: #${item.srs ? item.srs.repetition + 1 : 1}</span>
      </div>
      ${questionContent}
      
      <!-- Speech Pronunciation Test in Review (>= 80% to pass) -->
      <div class="speech-test-card" style="margin-top: 8px;">
        <div class="speech-test-word-row">
          <div class="speech-target-word-group">
            <span class="speech-target-word">${safeWord}</span>
            ${item.phonetic ? `<span class="speech-target-ipa">${escapeHtml(item.phonetic)}</span>` : ''}
          </div>
          <button class="btn-sm" onclick="playTTS('${wordJsSafe}', this)" title="Nghe mẫu phát âm chuẩn">🔊 Nghe mẫu</button>
        </div>

        <div class="speech-test-title" style="margin-top: 4px;">
          🗣️ Hãy đọc to từ trên theo phiên âm chuẩn (Cần đạt ≥ 80%):
        </div>
        <div class="speech-test-actions">
          <button class="btn-record-word" id="btn-due-speech-${safeId}" onclick="window.testWordPronunciation('${wordJsSafe}', 'btn-due-speech-${safeId}', 'due-speech-res-${safeId}')">
            🎙️ Bấm & Đọc để kiểm tra phát âm
          </button>
        </div>
        <div id="due-speech-res-${safeId}"></div>
      </div>

      <button class="btn-sm" id="btn-reveal-${safeId}" onclick="revealAnswer('${safeId}')">
        👁️ Xem đáp án & nghĩa tiếng Việt
      </button>
      <div id="answer-box-${safeId}" style="display:none;" class="srs-answer-reveal">
        <div style="display:flex; align-items:baseline; gap:8px; flex-wrap:wrap;">
          <strong>Đáp án:</strong> 
          <span style="color:#38bdf8; font-weight:700; font-size:1.02rem;" class="clickable-term" onclick="window.quickTranslateWord('${wordJsSafe}', event)">${escapeHtml(item.word)}</span>
          ${item.phonetic ? `<span class="speech-target-ipa">${escapeHtml(item.phonetic)}</span>` : ''}
          <button type="button" class="btn-sm" style="padding:2px 8px; font-size:0.72rem;" onclick="playTTS('${wordJsSafe}', this)">🔊 Nghe</button>
        </div>
        <div style="margin-top:6px; font-size:0.86rem; color:#f1f5f9; font-weight:500;">🇻🇳 <strong>Nghĩa:</strong> ${escapeHtml(item.vietnamese || '')}</div>
        ${item.technical_context ? `<div style="margin-top:4px; font-size:0.78rem; color:#94a3b8; line-height:1.4;">💡 <strong>Bối cảnh:</strong> ${escapeHtml(item.technical_context)}</div>` : ''}
        ${item.example_sentence ? `<div style="margin-top:4px; font-size:0.78rem; color:#cbd5e1; line-height:1.4;">📝 <strong>Ví dụ:</strong> <em>"${escapeHtml(item.example_sentence)}"</em></div>` : ''}
        <div style="margin-top:10px; font-size:0.78rem; color:#cbd5e1;">Đánh giá mức độ nhớ của bạn:</div>
        <div class="srs-rating-buttons">
          <button class="btn-rate btn-rate-hard" onclick="gradeReview('${wordJsSafe}', 1, '${safeId}')">Khó / Quên (Nhắc lại mai)</button>
          <button class="btn-rate btn-rate-good" onclick="gradeReview('${wordJsSafe}', 3, '${safeId}')">Nhớ được (Tiến độ chuẩn)</button>
          <button class="btn-rate btn-rate-easy" onclick="gradeReview('${wordJsSafe}', 5, '${safeId}')">Rất dễ (Giãn chu kỳ)</button>
        </div>
      </div>
    `;

    container.appendChild(box);
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

// ----------------------------------------------------
// LESSON AUDIO PLAYER ENGINE (Tua chậm, Tua lại, Dừng/Tiếp tục)
// ----------------------------------------------------
const LESSON_SPEED_OPTIONS = [
  { rate: 0.5, label: '0.5x', tag: 'Rất chậm' },
  { rate: 0.75, label: '0.75x', tag: 'Tua chậm' },
  { rate: 0.9, label: '0.9x', tag: 'Hơi chậm' },
  { rate: 1.0, label: '1.0x', tag: 'Chuẩn' },
  { rate: 1.25, label: '1.25x', tag: 'Nhanh' }
];

let lessonSpeed = parseFloat(localStorage.getItem('icoin_lesson_speed')) || 1.0;
if (!LESSON_SPEED_OPTIONS.some(o => Math.abs(o.rate - lessonSpeed) < 0.01)) {
  lessonSpeed = 1.0;
}

const lessonPlayersRegistry = {};
const sharedLessonAudio = new Audio();
sharedLessonAudio.preload = 'auto';

const lessonAudioSession = {
  playerId: null,
  status: 'idle', // 'idle' | 'loading' | 'playing' | 'paused'
  engine: 'html5', // 'html5' | 'webspeech'
  chunkIdx: 0,
  singleChunkOnly: false,
  playbackToken: 0,
  audioTime: 0,
  audioDuration: 0,
  html5ErrorStreak: 0,
  preferWebSpeech: false
};

function splitLongClause(clause, maxLen) {
  if (clause.length <= maxLen) return [clause];
  const out = [];
  let remaining = clause.trim();
  while (remaining.length > maxLen) {
    let splitAt = -1;
    const sub = remaining.slice(0, maxLen + 1);
    // Prefer splitting at comma, semicolon, colon, or em-dash
    const punctMatches = [sub.lastIndexOf(', '), sub.lastIndexOf('; '), sub.lastIndexOf(': '), sub.lastIndexOf('—'), sub.lastIndexOf(' - ')];
    for (const pos of punctMatches) {
      if (pos > maxLen * 0.35 && pos > splitAt) {
        splitAt = pos + 1;
      }
    }
    if (splitAt === -1) {
      splitAt = sub.lastIndexOf(' ');
    }
    if (splitAt <= 0) {
      splitAt = maxLen;
    }
    out.push(remaining.slice(0, splitAt).trim());
    remaining = remaining.slice(splitAt).trim();
  }
  if (remaining) out.push(remaining);
  return out;
}

function splitIntoTTSChunks(rawText, maxLen = 175) {
  if (!rawText || typeof rawText !== 'string') return [];
  const lines = rawText.split(/\n+/);
  const chunks = [];

  lines.forEach((rawLine, lineIdx) => {
    const line = rawLine.trim();
    if (!line) return;
    // Match sentences without lookbehind for full iOS Safari compatibility
    const sentences = line.match(/[^.!?]+[.!?]+(?=\s|$)|[^.!?]+$/g) || [line];
    sentences.forEach((rawSent, sentIdx) => {
      const sent = rawSent.trim();
      if (!sent) return;
      const parts = splitLongClause(sent, maxLen);
      parts.forEach((part, partIdx) => {
        chunks.push({
          text: part,
          lineBreakBefore: lineIdx > 0 && sentIdx === 0 && partIdx === 0
        });
      });
    });
  });

  return chunks;
}

function registerLessonPlayer(playerId, label, rawTextOrList, opts = {}) {
  let chunks = [];
  if (Array.isArray(rawTextOrList)) {
    rawTextOrList.forEach((item) => {
      const str = typeof item === 'string' ? item : (item && item.en ? item.en : '');
      const trimmed = str.trim();
      if (trimmed) {
        chunks.push({ text: trimmed, lineBreakBefore: false });
      }
    });
  } else {
    chunks = splitIntoTTSChunks(rawTextOrList, 175);
  }

  lessonPlayersRegistry[playerId] = {
    id: playerId,
    label: label || 'Bài học',
    chunks,
    isSpeakingCards: !!opts.isSpeakingCards,
    playLabel: opts.playLabel || '▶️ Nghe bài'
  };
  return lessonPlayersRegistry[playerId];
}

function renderLessonAudioPlayerHtml(playerId, opts = {}) {
  const player = lessonPlayersRegistry[playerId];
  if (!player || !player.chunks || player.chunks.length === 0) return '';
  const playLabel = opts.playLabel || player.playLabel || '▶️ Nghe bài';

  const speedButtonsHtml = LESSON_SPEED_OPTIONS.map(opt => {
    const isActive = Math.abs(lessonSpeed - opt.rate) < 0.01;
    const turtle = opt.rate <= 0.75 ? ' 🐢' : '';
    return `<button type="button" class="lap-speed-btn ${isActive ? 'active' : ''}" data-speed="${opt.rate}" onclick="window.setLessonPlaybackSpeed(${opt.rate}, '${playerId}')" title="${opt.tag}">${opt.label}${turtle}</button>`;
  }).join('');

  return `
    <div class="lesson-audio-player" id="player-box-${playerId}">
      <div class="lap-top-row">
        <div class="lap-controls-main">
          <button type="button" class="lap-btn lap-btn-play" id="lap-play-${playerId}" onclick="window.toggleLessonPlayPause('${playerId}')" title="Nghe / Dừng / Tiếp tục">
            ${playLabel}
          </button>
          <button type="button" class="lap-btn" onclick="window.rewindLessonAudio('${playerId}')" title="Tua lại 5 giây hoặc câu trước">
            ⏪ Tua lại
          </button>
          <button type="button" class="lap-btn" onclick="window.restartLessonAudio('${playerId}')" title="Nghe lại từ đầu">
            ⏮️ Từ đầu
          </button>
          <button type="button" class="lap-btn" onclick="window.nextLessonChunk('${playerId}')" title="Câu tiếp theo">
            ⏩ Câu sau
          </button>
          <button type="button" class="lap-btn lap-btn-stop" id="lap-stop-${playerId}" onclick="window.stopLessonAudio('${playerId}')" style="display:none;" title="Dừng hẳn">
            ⏹️ Tắt
          </button>
        </div>
        <div class="lap-status-text" id="lap-status-${playerId}">
          Sẵn sàng (${player.chunks.length} câu) · ${lessonSpeed}x
        </div>
      </div>
      <div class="lap-progress-row" onclick="window.seekLessonProgress('${playerId}', event)" title="Bấm để tua đến đoạn mong muốn">
        <div class="lap-progress-track">
          <div class="lap-progress-fill" id="lap-progress-${playerId}" style="width: 0%;"></div>
        </div>
      </div>
      <div class="lap-speed-row">
        <span class="lap-speed-label">🐢 Tốc độ (Tua chậm / nhanh):</span>
        <div class="lap-speed-pills">
          ${speedButtonsHtml}
        </div>
      </div>
    </div>
  `;
}

function renderHighlightablePassageHtml(playerId) {
  const player = lessonPlayersRegistry[playerId];
  if (!player || !player.chunks || player.chunks.length === 0) return '';
  return player.chunks.map((c, idx) => {
    const prefix = c.lineBreakBefore ? '\n' : (idx > 0 ? ' ' : '');
    return `${prefix}<span class="tts-chunk" id="tts-chunk-${playerId}-${idx}">${escapeHtml(c.text)}</span>`;
  }).join('');
}

function applyAudioPlaybackRate() {
  try {
    sharedLessonAudio.playbackRate = lessonSpeed;
    sharedLessonAudio.preservesPitch = true;
    sharedLessonAudio.mozPreservesPitch = true;
    sharedLessonAudio.webkitPreservesPitch = true;
  } catch (_) {}
}

function updateSpeedButtonsAcrossUI() {
  document.querySelectorAll('.lap-speed-btn').forEach(btn => {
    const r = parseFloat(btn.dataset.speed);
    if (Math.abs(r - lessonSpeed) < 0.01) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

function updateLessonProgressUI(playerId) {
  const targetId = playerId || lessonAudioSession.playerId;
  if (!targetId) return;
  const player = lessonPlayersRegistry[targetId];
  if (!player || !player.chunks.length) return;

  const total = player.chunks.length;
  let pct = 0;
  if (lessonAudioSession.playerId === targetId && lessonAudioSession.status !== 'idle') {
    const subRatio = (lessonAudioSession.audioDuration > 0)
      ? Math.min(1, lessonAudioSession.audioTime / lessonAudioSession.audioDuration)
      : 0;
    pct = Math.min(100, Math.max(0, ((lessonAudioSession.chunkIdx + subRatio) / total) * 100));
  }

  const fillEl = document.getElementById(`lap-progress-${targetId}`);
  if (fillEl) fillEl.style.width = `${pct.toFixed(1)}%`;

  if (lessonAudioSession.playerId === targetId) {
    const flpFill = document.getElementById('flpProgressFill');
    if (flpFill) flpFill.style.width = `${pct.toFixed(1)}%`;
  }
}

function clearAllAudioHighlights() {
  document.querySelectorAll('.tts-chunk-active').forEach(el => el.classList.remove('tts-chunk-active'));
  document.querySelectorAll('.tts-sentence-active').forEach(el => el.classList.remove('tts-sentence-active'));
  document.querySelectorAll('.lesson-audio-player.is-active').forEach(el => el.classList.remove('is-active'));
  document.querySelectorAll('.speak-card-play-btn').forEach(btn => {
    btn.textContent = '🔊 Nghe câu này';
    btn.classList.remove('is-playing', 'is-paused');
  });
}

function scrollChunkInsidePassage(chunkEl) {
  if (!chunkEl) return;
  const passage = chunkEl.closest('.material-passage');
  if (!passage) return;
  const pRect = passage.getBoundingClientRect();
  const cRect = chunkEl.getBoundingClientRect();
  const cTop = (cRect.top - pRect.top) + passage.scrollTop;
  const cBottom = cTop + cRect.height;
  const vTop = passage.scrollTop;
  const vBottom = vTop + passage.clientHeight;
  if (cTop < vTop + 8 || cBottom > vBottom - 8) {
    passage.scrollTo({
      top: Math.max(0, cTop - passage.clientHeight / 3),
      behavior: 'smooth'
    });
  }
}

function updateAllLessonAudioUIs() {
  clearAllAudioHighlights();
  updateSpeedButtonsAcrossUI();

  // Reset all inline player buttons/statuses first
  Object.keys(lessonPlayersRegistry).forEach(pid => {
    const player = lessonPlayersRegistry[pid];
    const playBtn = document.getElementById(`lap-play-${pid}`);
    const stopBtn = document.getElementById(`lap-stop-${pid}`);
    const statusEl = document.getElementById(`lap-status-${pid}`);
    const boxEl = document.getElementById(`player-box-${pid}`);

    if (!playBtn || !statusEl) return;

    if (lessonAudioSession.playerId === pid && lessonAudioSession.status !== 'idle') {
      if (boxEl) boxEl.classList.add('is-active');
      if (stopBtn) stopBtn.style.display = 'inline-flex';
      statusEl.classList.add('is-active');

      const total = player.chunks.length;
      const num = lessonAudioSession.chunkIdx + 1;
      const singleTag = lessonAudioSession.singleChunkOnly ? ' (1 câu)' : '';
      const speedTag = lessonSpeed <= 0.75 ? `${lessonSpeed}x 🐢` : `${lessonSpeed}x`;

      if (lessonAudioSession.status === 'loading') {
        playBtn.textContent = '⏳ Đang tải...';
        playBtn.classList.remove('is-playing', 'is-paused');
        statusEl.textContent = `Đang tải câu ${num}/${total}${singleTag} · ${speedTag}`;
      } else if (lessonAudioSession.status === 'playing') {
        playBtn.textContent = '⏸️ Dừng';
        playBtn.classList.add('is-playing');
        playBtn.classList.remove('is-paused');
        statusEl.textContent = `▶️ Câu ${num}/${total}${singleTag} · ${speedTag}`;
      } else if (lessonAudioSession.status === 'paused') {
        playBtn.textContent = '▶️ Tiếp tục';
        playBtn.classList.remove('is-playing');
        playBtn.classList.add('is-paused');
        statusEl.textContent = `⏸️ Tạm dừng (Câu ${num}/${total}) · ${speedTag}`;
      }
    } else {
      playBtn.textContent = player.playLabel || '▶️ Nghe bài';
      playBtn.classList.remove('is-playing', 'is-paused');
      if (stopBtn) stopBtn.style.display = 'none';
      statusEl.classList.remove('is-active');
      statusEl.textContent = `Sẵn sàng (${player.chunks.length} câu) · ${lessonSpeed}x`;
      const fillEl = document.getElementById(`lap-progress-${pid}`);
      if (fillEl) fillEl.style.width = '0%';
    }
  });

  // Highlight active chunk or speaking card & update floating mini-player
  const floatingEl = document.getElementById('floatingLessonPlayer');
  if (lessonAudioSession.playerId && lessonAudioSession.status !== 'idle') {
    const pid = lessonAudioSession.playerId;
    const cIdx = lessonAudioSession.chunkIdx;
    const player = lessonPlayersRegistry[pid];

    const chunkEl = document.getElementById(`tts-chunk-${pid}-${cIdx}`);
    if (chunkEl) {
      chunkEl.classList.add('tts-chunk-active');
      if (lessonAudioSession.status === 'playing') {
        scrollChunkInsidePassage(chunkEl);
      }
    }

    const speakCard = document.getElementById(`speak-card-${pid}-${cIdx}`);
    if (speakCard) {
      speakCard.classList.add('tts-sentence-active');
      const cardBtn = speakCard.querySelector('.speak-card-play-btn');
      if (cardBtn) {
        if (lessonAudioSession.status === 'playing') {
          cardBtn.textContent = '⏸️ Dừng';
          cardBtn.classList.add('is-playing');
        } else if (lessonAudioSession.status === 'paused') {
          cardBtn.textContent = '▶️ Tiếp tục';
          cardBtn.classList.add('is-paused');
        } else {
          cardBtn.textContent = '⏳ Đang tải...';
        }
      }
    }

    updateLessonProgressUI(pid);

    if (floatingEl && player) {
      floatingEl.classList.remove('hidden');
      const flpTitle = document.getElementById('flpTitle');
      const flpStatus = document.getElementById('flpStatus');
      const flpPlayBtn = document.getElementById('flpPlayBtn');
      const speedTag = lessonSpeed <= 0.75 ? `${lessonSpeed}x 🐢` : `${lessonSpeed}x`;

      if (flpTitle) flpTitle.textContent = player.label;
      if (flpStatus) {
        const stateLabel = lessonAudioSession.status === 'paused' ? 'Tạm dừng' : (lessonAudioSession.status === 'loading' ? 'Đang tải' : 'Đang đọc');
        flpStatus.textContent = `· Câu ${cIdx + 1}/${player.chunks.length} · ${speedTag} · ${stateLabel}`;
      }
      if (flpPlayBtn) {
        if (lessonAudioSession.status === 'playing') {
          flpPlayBtn.textContent = '⏸️ Dừng';
          flpPlayBtn.classList.add('is-playing');
          flpPlayBtn.classList.remove('is-paused');
        } else if (lessonAudioSession.status === 'paused') {
          flpPlayBtn.textContent = '▶️ Tiếp tục';
          flpPlayBtn.classList.remove('is-playing');
          flpPlayBtn.classList.add('is-paused');
        } else {
          flpPlayBtn.textContent = '⏳ ...';
          flpPlayBtn.classList.remove('is-playing', 'is-paused');
        }
      }
    }
  } else if (floatingEl) {
    floatingEl.classList.add('hidden');
  }
}

function resetLessonAudioToIdle() {
  lessonAudioSession.playbackToken++;
  try {
    sharedLessonAudio.pause();
    sharedLessonAudio.removeAttribute('src');
    sharedLessonAudio.load();
  } catch (_) {}
  try {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  } catch (_) {}

  lessonAudioSession.playerId = null;
  lessonAudioSession.status = 'idle';
  lessonAudioSession.chunkIdx = 0;
  lessonAudioSession.singleChunkOnly = false;
  lessonAudioSession.audioTime = 0;
  lessonAudioSession.audioDuration = 0;
  updateAllLessonAudioUIs();
}

function pauseLessonAudioInternal() {
  if (lessonAudioSession.status !== 'playing' && lessonAudioSession.status !== 'loading') return;
  lessonAudioSession.status = 'paused';
  if (lessonAudioSession.engine === 'html5') {
    try {
      lessonAudioSession.audioTime = sharedLessonAudio.currentTime || 0;
      sharedLessonAudio.pause();
    } catch (_) {}
  } else {
    // Invalidate current token so speechSynthesis.cancel() won't advance chunk
    lessonAudioSession.playbackToken++;
    try {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    } catch (_) {}
  }
  updateAllLessonAudioUIs();
}

window.pauseActiveLessonAudioIfPlaying = pauseLessonAudioInternal;

function advanceOrFinishLessonChunk() {
  const player = lessonPlayersRegistry[lessonAudioSession.playerId];
  if (!player) {
    resetLessonAudioToIdle();
    return;
  }
  if (lessonAudioSession.singleChunkOnly || lessonAudioSession.chunkIdx + 1 >= player.chunks.length) {
    resetLessonAudioToIdle();
    return;
  }
  playLessonChunk(player.id, lessonAudioSession.chunkIdx + 1, { singleChunkOnly: false });
}

function speakChunkWithWebSpeech(playerId, chunkIdx, token) {
  const player = lessonPlayersRegistry[playerId];
  if (!player || !player.chunks[chunkIdx] || lessonAudioSession.playbackToken !== token) return;

  if (!('speechSynthesis' in window)) {
    resetLessonAudioToIdle();
    alert('Trình duyệt không hỗ trợ phát âm thanh TTS.');
    return;
  }

  try {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
    const chunkText = player.chunks[chunkIdx].text.replace(/\s+/g, ' ').trim();
    const utter = new SpeechSynthesisUtterance(chunkText);
    window._activeLessonUtterance = utter;
    utter.lang = 'en-US';
    utter.rate = lessonSpeed;

    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      const enVoice = voices.find(v => v.lang && (v.lang === 'en-US' || v.lang.startsWith('en')));
      if (enVoice) utter.voice = enVoice;
    }

    lessonAudioSession.engine = 'webspeech';
    lessonAudioSession.status = 'playing';
    updateAllLessonAudioUIs();

    utter.onend = () => {
      if (lessonAudioSession.playbackToken !== token) return;
      advanceOrFinishLessonChunk();
    };
    utter.onerror = () => {
      if (lessonAudioSession.playbackToken !== token) return;
      resetLessonAudioToIdle();
    };

    window.speechSynthesis.speak(utter);
  } catch (e) {
    console.warn('Lesson Web Speech error:', e);
    if (lessonAudioSession.playbackToken === token) {
      resetLessonAudioToIdle();
    }
  }
}

function playLessonChunk(playerId, chunkIdx, opts = {}) {
  const player = lessonPlayersRegistry[playerId];
  if (!player || !player.chunks || player.chunks.length === 0) return;

  // Stop any single-word TTS
  if (currentPlayingAudio) {
    try {
      currentPlayingAudio.pause();
      currentPlayingAudio.currentTime = 0;
    } catch (_) {}
    currentPlayingAudio = null;
  }
  try {
    if ('speechSynthesis' in window && (window.speechSynthesis.speaking || window.speechSynthesis.pending)) {
      window.speechSynthesis.cancel();
    }
  } catch (_) {}

  const token = ++lessonAudioSession.playbackToken;
  lessonAudioSession.playerId = playerId;
  lessonAudioSession.chunkIdx = Math.max(0, Math.min(chunkIdx, player.chunks.length - 1));
  lessonAudioSession.singleChunkOnly = !!opts.singleChunkOnly;
  lessonAudioSession.status = 'loading';
  lessonAudioSession.audioTime = 0;
  lessonAudioSession.audioDuration = 0;

  updateAllLessonAudioUIs();

  if (opts.forceWebSpeech || lessonAudioSession.preferWebSpeech) {
    speakChunkWithWebSpeech(playerId, lessonAudioSession.chunkIdx, token);
    return;
  }

  const chunkText = player.chunks[lessonAudioSession.chunkIdx].text.replace(/\s+/g, ' ').trim();
  const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en&q=${encodeURIComponent(chunkText)}`;

  lessonAudioSession.engine = 'html5';
  sharedLessonAudio.onloadedmetadata = () => {
    if (lessonAudioSession.playbackToken !== token) return;
    applyAudioPlaybackRate();
    lessonAudioSession.audioDuration = sharedLessonAudio.duration || 0;
  };
  sharedLessonAudio.onplaying = () => {
    if (lessonAudioSession.playbackToken !== token) return;
    applyAudioPlaybackRate();
    lessonAudioSession.html5ErrorStreak = 0;
    lessonAudioSession.status = 'playing';
    updateAllLessonAudioUIs();
  };
  sharedLessonAudio.ontimeupdate = () => {
    if (lessonAudioSession.playbackToken !== token) return;
    lessonAudioSession.audioTime = sharedLessonAudio.currentTime || 0;
    lessonAudioSession.audioDuration = sharedLessonAudio.duration || 0;
    updateLessonProgressUI(playerId);
  };
  sharedLessonAudio.onended = () => {
    if (lessonAudioSession.playbackToken !== token) return;
    advanceOrFinishLessonChunk();
  };
  sharedLessonAudio.onerror = () => {
    if (lessonAudioSession.playbackToken !== token) return;
    lessonAudioSession.html5ErrorStreak++;
    if (lessonAudioSession.html5ErrorStreak >= 2) {
      lessonAudioSession.preferWebSpeech = true;
    }
    speakChunkWithWebSpeech(playerId, lessonAudioSession.chunkIdx, token);
  };

  try {
    sharedLessonAudio.src = audioUrl;
    applyAudioPlaybackRate();
    const playPromise = sharedLessonAudio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        if (lessonAudioSession.playbackToken !== token) return;
        console.warn('Lesson HTML5 Audio blocked/failed, switching to Web Speech:', err);
        lessonAudioSession.html5ErrorStreak++;
        if (lessonAudioSession.html5ErrorStreak >= 2) {
          lessonAudioSession.preferWebSpeech = true;
        }
        speakChunkWithWebSpeech(playerId, lessonAudioSession.chunkIdx, token);
      });
    }
  } catch (_) {
    if (lessonAudioSession.playbackToken === token) {
      speakChunkWithWebSpeech(playerId, lessonAudioSession.chunkIdx, token);
    }
  }
}

window.toggleLessonPlayPause = function(playerId) {
  const targetId = playerId || lessonAudioSession.playerId;
  if (!targetId) return;

  if (lessonAudioSession.playerId !== targetId || lessonAudioSession.status === 'idle') {
    playLessonChunk(targetId, 0, { singleChunkOnly: false });
    return;
  }

  if (lessonAudioSession.status === 'playing' || lessonAudioSession.status === 'loading') {
    pauseLessonAudioInternal();
    return;
  }

  if (lessonAudioSession.status === 'paused') {
    if (lessonAudioSession.engine === 'html5' && sharedLessonAudio.src) {
      const token = lessonAudioSession.playbackToken;
      lessonAudioSession.status = 'playing';
      applyAudioPlaybackRate();
      updateAllLessonAudioUIs();
      try {
        const p = sharedLessonAudio.play();
        if (p !== undefined) {
          p.catch(() => {
            if (lessonAudioSession.playbackToken !== token) return;
            playLessonChunk(targetId, lessonAudioSession.chunkIdx, {
              singleChunkOnly: lessonAudioSession.singleChunkOnly,
              forceWebSpeech: true
            });
          });
        }
      } catch (_) {
        playLessonChunk(targetId, lessonAudioSession.chunkIdx, {
          singleChunkOnly: lessonAudioSession.singleChunkOnly,
          forceWebSpeech: true
        });
      }
    } else {
      playLessonChunk(targetId, lessonAudioSession.chunkIdx, {
        singleChunkOnly: lessonAudioSession.singleChunkOnly,
        forceWebSpeech: true
      });
    }
  }
};

window.rewindLessonAudio = function(playerId) {
  const targetId = playerId || lessonAudioSession.playerId;
  if (!targetId) return;
  const player = lessonPlayersRegistry[targetId];
  if (!player || !player.chunks.length) return;

  if (lessonAudioSession.playerId !== targetId || lessonAudioSession.status === 'idle') {
    playLessonChunk(targetId, 0, { singleChunkOnly: false });
    return;
  }

  if (lessonAudioSession.engine === 'html5' && sharedLessonAudio.src) {
    const cur = sharedLessonAudio.currentTime || 0;
    if (cur > 2.2) {
      sharedLessonAudio.currentTime = Math.max(0, cur - 5.0);
      lessonAudioSession.audioTime = sharedLessonAudio.currentTime;
      if (lessonAudioSession.status === 'paused') {
        lessonAudioSession.status = 'playing';
        applyAudioPlaybackRate();
        sharedLessonAudio.play().catch(() => {});
      }
      updateAllLessonAudioUIs();
      return;
    }
  }

  const prevIdx = Math.max(0, lessonAudioSession.chunkIdx - 1);
  playLessonChunk(targetId, prevIdx, { singleChunkOnly: lessonAudioSession.singleChunkOnly });
};

window.restartLessonAudio = function(playerId) {
  const targetId = playerId || lessonAudioSession.playerId;
  if (!targetId) return;
  playLessonChunk(targetId, 0, { singleChunkOnly: false });
};

window.nextLessonChunk = function(playerId) {
  const targetId = playerId || lessonAudioSession.playerId;
  if (!targetId) return;
  const player = lessonPlayersRegistry[targetId];
  if (!player || !player.chunks.length) return;

  if (lessonAudioSession.playerId !== targetId || lessonAudioSession.status === 'idle') {
    playLessonChunk(targetId, 0, { singleChunkOnly: false });
    return;
  }
  const nextIdx = Math.min(player.chunks.length - 1, lessonAudioSession.chunkIdx + 1);
  playLessonChunk(targetId, nextIdx, { singleChunkOnly: false });
};

window.stopLessonAudio = function(playerId) {
  if (playerId && lessonAudioSession.playerId !== playerId) return;
  resetLessonAudioToIdle();
};

window.setLessonPlaybackSpeed = function(rate, playerId) {
  const numRate = parseFloat(rate);
  if (!numRate || Number.isNaN(numRate)) return;

  lessonSpeed = numRate;
  localStorage.setItem('icoin_lesson_speed', String(lessonSpeed));
  applyAudioPlaybackRate();

  if (lessonAudioSession.status === 'playing' && lessonAudioSession.engine === 'webspeech') {
    // Re-speak current sentence immediately at new speed
    playLessonChunk(lessonAudioSession.playerId, lessonAudioSession.chunkIdx, {
      singleChunkOnly: lessonAudioSession.singleChunkOnly,
      forceWebSpeech: true
    });
  } else {
    updateAllLessonAudioUIs();
    if (playerId && lessonAudioSession.playerId !== playerId && lessonAudioSession.status === 'idle') {
      const statusEl = document.getElementById(`lap-status-${playerId}`);
      const player = lessonPlayersRegistry[playerId];
      if (statusEl && player) {
        statusEl.textContent = `Sẵn sàng (${player.chunks.length} câu) · ${lessonSpeed}x`;
      }
    }
  }
};

window.seekLessonProgress = function(playerId, ev) {
  const targetId = playerId || lessonAudioSession.playerId;
  if (!targetId || !ev || !ev.currentTarget) return;
  const player = lessonPlayersRegistry[targetId];
  if (!player || !player.chunks.length) return;

  const rect = ev.currentTarget.getBoundingClientRect();
  const ratio = Math.min(1, Math.max(0, (ev.clientX - rect.left) / Math.max(1, rect.width)));
  const targetIdx = Math.min(player.chunks.length - 1, Math.floor(ratio * player.chunks.length));
  playLessonChunk(targetId, targetIdx, { singleChunkOnly: false });
};

window.playSingleSentenceInPlayer = function(playerId, chunkIdx) {
  if (
    lessonAudioSession.playerId === playerId &&
    lessonAudioSession.chunkIdx === chunkIdx &&
    (lessonAudioSession.status === 'playing' || lessonAudioSession.status === 'paused')
  ) {
    window.toggleLessonPlayPause(playerId);
    return;
  }
  playLessonChunk(playerId, chunkIdx, { singleChunkOnly: true });
};

// ----------------------------------------------------
// PRONUNCIATION TESTING & AUDIO ENGINE (iOS & Cross-Browser Safe)
// ----------------------------------------------------
let currentPlayingAudio = null;

// Dual-Engine Audio Player for Single Vocab Words (HTML5 Audio + Web Speech API Fallback)
window.playTTS = function(text, btnElement) {
  if (!text) return;

  // Pause active lesson audio gently so two tracks never overlap
  pauseLessonAudioInternal();

  // Stop any currently playing word audio
  if (currentPlayingAudio) {
    try {
      currentPlayingAudio.pause();
      currentPlayingAudio.currentTime = 0;
    } catch (_) {}
    currentPlayingAudio = null;
  }

  // Update button visual state if provided
  let origText = '';
  if (btnElement && btnElement.textContent) {
    origText = btnElement.textContent;
    btnElement.textContent = '🔊 Đang đọc...';
  }

  const resetBtn = () => {
    if (btnElement && origText) {
      btnElement.textContent = origText;
    }
  };

  // 1. Primary Engine: HTML5 Audio with Google Translate TTS (iOS Safari & Mobile 100% compatible)
  const trimmed = text.length > 200 ? text.substring(0, 200) : text;
  const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=en&q=${encodeURIComponent(trimmed)}`;

  try {
    const audio = new Audio(audioUrl);
    currentPlayingAudio = audio;

    audio.onended = () => {
      currentPlayingAudio = null;
      resetBtn();
    };

    audio.onerror = () => {
      // Fallback to Web Speech API
      currentPlayingAudio = null;
      playWebSpeechSynthesis(text, resetBtn);
    };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('HTML5 Audio playback error, falling back to Web Speech API:', err);
        currentPlayingAudio = null;
        playWebSpeechSynthesis(text, resetBtn);
      });
    }
  } catch (err) {
    playWebSpeechSynthesis(text, resetBtn);
  }
};

function playWebSpeechSynthesis(text, onComplete) {
  if (!('speechSynthesis' in window)) {
    if (onComplete) onComplete();
    alert('Trình duyệt không hỗ trợ phát âm thanh TTS.');
    return;
  }

  try {
    // On iOS Safari: NEVER call cancel() right before speak() in the same tick!
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    window._activeWordUtterance = utterance;
    utterance.lang = 'en-US';
    utterance.rate = 0.92;

    // Pick English voice if available
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      const enVoice = voices.find(v => v.lang && (v.lang === 'en-US' || v.lang.startsWith('en')));
      if (enVoice) utterance.voice = enVoice;
    }

    utterance.onend = () => {
      if (onComplete) onComplete();
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      if (onComplete) onComplete();
    };

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.error('SpeechSynthesis exception:', e);
    if (onComplete) onComplete();
  }
}

function buildWordMeaningHtml(item, targetWord) {
  const vn = item ? (item.vietnamese || '') : '';
  const ipa = item ? (item.phonetic || '') : '';
  const ctx = item ? (item.technical_context || '') : '';
  const ex = item ? (item.example_sentence || '') : '';
  const wordJsSafe = targetWord.replace(/'/g, "\\'");
  
  return `
    <div class="srs-auto-meaning-box">
      <div style="display:flex; align-items:baseline; gap:8px; flex-wrap:wrap;">
        <span class="srs-meaning-word clickable-term" onclick="window.quickTranslateWord('${wordJsSafe}', event)">${escapeHtml(targetWord)}</span>
        ${ipa ? `<span class="speech-target-ipa">${escapeHtml(ipa)}</span>` : ''}
        <button type="button" class="btn-sm" style="padding:2px 8px; font-size:0.72rem;" onclick="playTTS('${wordJsSafe}', this)">🔊 Nghe</button>
      </div>
      <div class="srs-meaning-vi">🇻🇳 <strong>Nghĩa:</strong> ${escapeHtml(vn || 'Đang cập nhật')}</div>
      ${ctx ? `<div class="srs-meaning-ctx">💡 <strong>Bối cảnh ICOIN:</strong> ${escapeHtml(ctx)}</div>` : ''}
      ${ex ? `<div class="srs-meaning-ex">📝 <strong>Ví dụ:</strong> <em>"${escapeHtml(ex)}"</em></div>` : ''}
    </div>
  `;
}

// Pronunciation test with intelligent iOS / HTTP Fallback
window.testWordPronunciation = function(targetWord, btnId, resultId, onPassCallback) {
  pauseLessonAudioInternal();
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const btn = document.getElementById(btnId);
  const resultEl = document.getElementById(resultId);
  const safeId = targetWord.toLowerCase().replace(/[^a-z0-9]/g, '_');

  const matchedItem = (state.dueVocab || []).find(v => v.word.toLowerCase() === targetWord.toLowerCase()) || 
                      (state.allVocab || []).find(v => v.word.toLowerCase() === targetWord.toLowerCase());
  const phonetic = matchedItem ? matchedItem.phonetic : '';

  const showFallbackUI = (reason) => {
    if (btn) {
      btn.classList.remove('recording');
      btn.textContent = '🎙️ Thử lại mic';
    }
    if (resultEl) {
      resultEl.innerHTML = `
        <div class="speech-fallback-card">
          <div style="font-weight:700; color:#fbbf24; font-size:0.82rem; margin-bottom:4px;">
            📱 Chế độ Hỗ trợ iPhone / Mic chưa khả dụng (${escapeHtml(reason)})
          </div>
          <p style="font-size:0.78rem; color:#cbd5e1; margin:0 0 8px; line-height:1.4;">
            Trên iPhone qua mạng nội bộ HTTP, Apple hạn chế quyền Micro trực tiếp. Bạn có thể tự xác nhận hoặc gõ nhanh từ này để hoàn tất ôn tập:
          </p>
          <div style="display:flex; gap:6px; flex-wrap:wrap; margin-bottom:8px;">
            <button type="button" class="btn-sm btn-rate-easy" onclick="window.confirmPronunciationPass('${targetWord.replace(/'/g, "\\'")}', '${resultId}', '${safeId}', ${onPassCallback ? 'true' : 'false'})">
              ✅ Tôi đã đọc to chuẩn (Cho qua)
            </button>
            <button type="button" class="btn-sm" style="background:#334155;" onclick="window.toggleTypingFallback('${safeId}')">
              ✍️ Gõ từ để kiểm tra
            </button>
            <button type="button" class="btn-sm" onclick="window.testWordPronunciation('${targetWord.replace(/'/g, "\\'")}', '${btnId}', '${resultId}', ${onPassCallback ? 'window._lastPassCallback' : 'null'})">
              🔄 Thử lại Mic
            </button>
          </div>
          <div id="typing-fallback-box-${safeId}" style="display:none; padding:8px; background:rgba(15,23,42,0.8); border-radius:6px; border:1px solid #475569;">
            <div style="font-size:0.75rem; color:#94a3b8; margin-bottom:4px;">
              Hãy gõ lại từ: <strong style="color:#38bdf8;">${escapeHtml(targetWord)}</strong> ${phonetic ? `<span class="speech-target-ipa" style="font-size:0.75rem;">${escapeHtml(phonetic)}</span>` : ''}
            </div>
            <div style="display:flex; gap:6px;">
              <input type="text" id="typing-fallback-input-${safeId}" placeholder="Gõ từ..." style="flex:1; padding:6px 8px; background:#0f172a; border:1px solid #334155; color:#fff; border-radius:4px; font-size:0.82rem;" />
              <button type="button" class="btn-sm btn-primary" onclick="window.verifyTypingFallback('${targetWord.replace(/'/g, "\\'")}', '${safeId}', '${resultId}', ${onPassCallback ? 'true' : 'false'})">Xác nhận</button>
            </div>
            <div id="typing-fallback-status-${safeId}" style="font-size:0.75rem; margin-top:4px;"></div>
          </div>
        </div>
      `;
    }
  };

  if (onPassCallback) {
    window._lastPassCallback = onPassCallback;
  }

  // Check if SpeechRecognition is supported
  if (!SpeechRecognition) {
    showFallbackUI('Trình duyệt chưa hỗ trợ Web Speech');
    return;
  }

  let recognitionActive = false;
  let recognitionTimeout = null;

  try {
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;

    if (btn) {
      btn.classList.add('recording');
      btn.textContent = '🔴 Đang nghe... Hãy đọc to!';
    }
    if (resultEl) {
      resultEl.innerHTML = `<span style="color:#38bdf8; font-size:0.78rem;">🎙️ Đang lắng nghe âm thanh từ microphone...</span>`;
    }

    // 8-second safety timeout so button is never permanently stuck
    recognitionTimeout = setTimeout(() => {
      if (recognitionActive) {
        try { recognition.stop(); } catch (_) {}
        recognitionActive = false;
        showFallbackUI('Hết thời gian chờ âm thanh');
      }
    }, 8000);

    recognition.onstart = () => {
      recognitionActive = true;
    };

    recognition.onresult = (event) => {
      clearTimeout(recognitionTimeout);
      recognitionActive = false;

      // Check all alternative transcripts for the highest similarity
      let bestScore = 0;
      let bestTranscript = '';
      if (event.results && event.results[0]) {
        for (let i = 0; i < event.results[0].length; i++) {
          const t = event.results[0][i].transcript;
          const s = calculatePronunciationScore(t, targetWord);
          if (s > bestScore) {
            bestScore = s;
            bestTranscript = t;
          }
        }
      }

      const isPass = bestScore >= 80;

      if (btn) {
        btn.classList.remove('recording');
        btn.textContent = '🎙️ Đọc lại từ này';
      }

      // Automatically reveal the answer box so user can view all answers
      if (typeof window.revealAnswer === 'function') {
        window.revealAnswer(safeId);
      }

      const meaningHtml = buildWordMeaningHtml(matchedItem, targetWord);

      if (resultEl) {
        resultEl.innerHTML = `
          <div class="speech-score-badge ${isPass ? 'pass' : 'fail'}">
            ${isPass ? '🟢 Đạt chuẩn' : '🔴 Chưa đạt'}: ${bestScore}% (Cần ≥ 80%)
          </div>
          <div class="speech-feedback-text">
            ${isPass 
              ? `🎉 Tuyệt vời! Bạn đã phát âm chính xác từ "<strong>${escapeHtml(targetWord)}</strong>" ${phonetic ? `<span class="speech-target-ipa" style="font-size:0.75rem;">${escapeHtml(phonetic)}</span>` : ''}.` 
              : `Máy nhận được: "<em>${escapeHtml(bestTranscript)}</em>" (Từ chuẩn: "<strong>${escapeHtml(targetWord)}</strong>" ${phonetic ? `<span class="speech-target-ipa" style="font-size:0.75rem;">${escapeHtml(phonetic)}</span>` : ''}). Hãy nghe lại mẫu và thử lại!`
            }
          </div>
          ${meaningHtml}
          ${isPass ? `
            <div class="srs-pass-action-row">
              <button type="button" class="btn-sm btn-rate-easy" style="padding:6px 14px; font-weight:600;" onclick="window.gradeReview('${targetWord.replace(/'/g, "\\'")}', 5, '${safeId}')">
                Tiếp tục sang từ tiếp theo ➔
              </button>
              <span style="font-size:0.75rem; color:#94a3b8; align-self:center;">(Hoặc chọn mức nhớ ở hộp đáp án bên dưới)</span>
            </div>
          ` : `
            <div style="margin-top:8px; display:flex; gap:6px; flex-wrap:wrap;">
              <button type="button" class="btn-sm btn-rate-easy" style="font-size:0.75rem; padding:4px 10px;" onclick="window.confirmPronunciationPass('${targetWord.replace(/'/g, "\\'")}', '${resultId}', '${safeId}', ${onPassCallback ? 'true' : 'false'})">
                Châm chước & Cho qua
              </button>
              <button type="button" class="btn-sm" style="background:#1e293b; border:1px solid #475569; font-size:0.75rem; padding:4px 10px;" onclick="window.revealAnswer('${safeId}')">
                👁️ Xem trước nghĩa & đáp án
              </button>
            </div>
          `}
        `;
      }

      if (isPass && onPassCallback) {
        onPassCallback(bestScore);
      }
    };

    recognition.onerror = (e) => {
      clearTimeout(recognitionTimeout);
      recognitionActive = false;
      const errName = e.error || 'Lỗi không xác định';
      showFallbackUI(errName);
    };

    recognition.onend = () => {
      clearTimeout(recognitionTimeout);
      if (recognitionActive) {
        recognitionActive = false;
        if (btn && btn.classList.contains('recording')) {
          btn.classList.remove('recording');
          btn.textContent = '🎙️ Thử lại';
        }
      }
    };

    recognition.start();
  } catch (err) {
    clearTimeout(recognitionTimeout);
    recognitionActive = false;
    showFallbackUI(err.name || 'Lỗi quyền truy cập');
  }
};

window.confirmPronunciationPass = function(word, resultId, safeId, hasCallback) {
  const resultEl = document.getElementById(resultId);
  const matched = (state.dueVocab || []).find(v => v.word.toLowerCase() === word.toLowerCase()) ||
                  (state.allVocab || []).find(v => v.word.toLowerCase() === word.toLowerCase());
  const phonetic = matched ? matched.phonetic : '';
  const targetId = safeId || word.toLowerCase().replace(/[^a-z0-9]/g, '_');

  if (typeof window.revealAnswer === 'function') {
    window.revealAnswer(targetId);
  }

  const meaningHtml = buildWordMeaningHtml(matched, word);

  if (resultEl) {
    resultEl.innerHTML = `
      <div class="speech-score-badge pass">
        🟢 Đã xác nhận đạt chuẩn: 100%
      </div>
      <div class="speech-feedback-text">
        🎉 Tuyệt vời! Bạn đã tự tin phát âm chuẩn từ "<strong>${escapeHtml(word)}</strong>" ${phonetic ? `<span class="speech-target-ipa" style="font-size:0.75rem;">${escapeHtml(phonetic)}</span>` : ''}.
      </div>
      ${meaningHtml}
      <div class="srs-pass-action-row">
        <button type="button" class="btn-sm btn-rate-easy" style="padding:6px 14px; font-weight:600;" onclick="window.gradeReview('${word.replace(/'/g, "\\'")}', 5, '${targetId}')">
          Tiếp tục sang từ tiếp theo ➔
        </button>
        <span style="font-size:0.75rem; color:#94a3b8; align-self:center;">(Hoặc chọn mức nhớ ở hộp đáp án bên dưới)</span>
      </div>
    `;
  }
};

window.toggleTypingFallback = function(safeId) {
  const box = document.getElementById(`typing-fallback-box-${safeId}`);
  if (box) {
    box.style.display = box.style.display === 'none' ? 'block' : 'none';
    if (box.style.display === 'block') {
      const inp = document.getElementById(`typing-fallback-input-${safeId}`);
      if (inp) inp.focus();
    }
  }
};

window.verifyTypingFallback = function(word, safeId, resultId, hasCallback) {
  const inp = document.getElementById(`typing-fallback-input-${safeId}`);
  const status = document.getElementById(`typing-fallback-status-${safeId}`);
  if (!inp) return;
  const val = inp.value.trim().toLowerCase();
  const target = word.trim().toLowerCase();

  if (val === target) {
    if (status) {
      status.style.color = '#34d399';
      status.textContent = '✅ Chính xác 100%! Đang chuyển bài...';
    }
    setTimeout(() => window.confirmPronunciationPass(word, resultId, safeId, hasCallback), 600);
  } else {
    if (status) {
      status.style.color = '#f87171';
      status.textContent = `❌ Chưa đúng mặt chữ. Cần gõ đúng: "${word}"`;
    }
  }
};

window.revealAnswer = function(idOrWord) {
  const safeId = idOrWord.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const box = document.getElementById(`answer-box-${safeId}`) || document.getElementById(`answer-box-${idOrWord}`);
  const btn = document.getElementById(`btn-reveal-${safeId}`) || document.getElementById(`btn-reveal-${idOrWord}`);
  if (box) box.style.display = 'block';
  if (btn) btn.style.display = 'none';
};

window.gradeReview = async function(word, score, safeId) {
  const targetId = safeId || word.toLowerCase().replace(/[^a-z0-9]/g, '_');
  try {
    const res = await fetch(`${state.apiBase}/api/v1/vocab/review`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ word: word, score: score })
    });
    if (res.ok) {
      const box = document.getElementById(`srs-box-${targetId}`) || document.getElementById(`srs-box-${word}`);
      if (box) {
        box.innerHTML = `
          <div style="color:#34d399; font-weight:700; font-size:0.95rem; padding:16px; background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.25); border-radius:8px; display:flex; align-items:center; gap:8px;">
            <span style="font-size:1.2rem;">✅</span>
            <span>Đã hoàn thành ôn tập từ "<strong>${escapeHtml(word)}</strong>"! Đã xoá 1 chấm đỏ.</span>
          </div>
        `;
      }
      // Optimistically remove from state.dueVocab and immediately refresh red dots
      state.dueVocab = (state.dueVocab || []).filter(v => v.word.toLowerCase() !== word.toLowerCase());
      window.updateRedDots();
      setTimeout(() => {
        loadDueVocab();
      }, 1200);
    }
  } catch (e) {
    alert('Lỗi cập nhật tiến trình ôn tập.');
  }
};

// Web Speech API: Speech-To-Text (Microphone for Note taking)
function toggleSpeechRecognition(taskId, micBtn) {
  pauseLessonAudioInternal();
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert('Trình duyệt của bạn chưa hỗ trợ nhận dạng giọng nói qua mic. Vui lòng gõ câu trả lời vào ô.');
    return;
  }

  if (state.isRecording) {
    if (state.recognition) {
      try { state.recognition.stop(); } catch (_) {}
    }
    state.isRecording = false;
    micBtn.classList.remove('speaking-active');
    micBtn.textContent = '🎙️ Luyện nói (Mic)';
    return;
  }

  try {
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
      state.isRecording = false;
      micBtn.classList.remove('speaking-active');
      micBtn.textContent = '🎙️ Luyện nói (Mic)';
      console.warn('SpeechRecognition error on task:', e);
    };

    state.recognition = recognition;
    recognition.start();
  } catch (err) {
    state.isRecording = false;
    micBtn.classList.remove('speaking-active');
    micBtn.textContent = '🎙️ Luyện nói (Mic)';
    alert('Không thể khởi động micro trên trình duyệt này. Bạn hãy gõ trực tiếp câu trả lời vào ô bên dưới.');
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
}
