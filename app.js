import { DEFAULT_SONGS } from './songs.js';

const STORAGE_KEY = 'duet_prompter_songs_v4';
const PREFS_KEY = 'duet_prompter_prefs_v1';

// ==================== STATE ====================
const state = {
  songs: loadSongs(),
  currentSongId: null,
  mode: 'youtube', // 'youtube' | 'timer'
  isPlaying: false,
  currentTime: 0,
  lastFrameTs: 0,
  activeLineIndex: -1,
  lyricScale: 1,
  videoVisible: false,

  // YouTube player state
  ytApiReady: false,
  ytPlayer: null,
  ytLoadedVideoId: null,

  // Sync recording state
  syncMode: false,
  syncIndex: 0,
  syncDraftTimes: [],

  // Wake Lock
  wakeLock: null,

  // Editor draft
  editorLinesDraft: []
};

// ==================== DOM REFS ====================
const $ = (id) => document.getElementById(id);

const els = {
  songTabs: $('songTabs'),
  partLegend: $('partLegend'),
  songTitle: $('songTitle'),
  songSubtitle: $('songSubtitle'),
  sectionPills: $('sectionPills'),
  stage: $('stage'),
  lyricsList: $('lyricsList'),
  toast: $('toast'),

  ytDrawer: $('ytDrawer'),
  ytExternalLink: $('ytExternalLink'),
  btnToggleVideo: $('btnToggleVideo'),
  btnCloseVideo: $('btnCloseVideo'),

  btnFontDown: $('btnFontDown'),
  btnFontUp: $('btnFontUp'),
  btnFullscreen: $('btnFullscreen'),
  btnWakeLock: $('btnWakeLock'),
  btnEditSong: $('btnEditSong'),
  btnSyncMode: $('btnSyncMode'),

  syncBanner: $('syncBanner'),
  syncTargetLine: $('syncTargetLine'),
  btnSyncTap: $('btnSyncTap'),
  btnSyncUndo: $('btnSyncUndo'),
  btnSyncDone: $('btnSyncDone'),
  btnSyncCancel: $('btnSyncCancel'),

  modeYoutube: $('modeYoutube'),
  modeTimer: $('modeTimer'),
  timeCurrent: $('timeCurrent'),
  timeTotal: $('timeTotal'),
  timeScrubber: $('timeScrubber'),

  btnRestart: $('btnRestart'),
  btnPrevLine: $('btnPrevLine'),
  btnPlayPause: $('btnPlayPause'),
  btnNextLine: $('btnNextLine'),
  btnToggleDockHint: $('btnToggleDockHint'),

  // Editor modal
  editorModal: $('editorModal'),
  edTitle: $('edTitle'),
  edSubtitle: $('edSubtitle'),
  edYoutube: $('edYoutube'),
  edDuration: $('edDuration'),
  edPartA: $('edPartA'),
  edPartB: $('edPartB'),
  editorLines: $('editorLines'),
  btnNewSong: $('btnNewSong'),
  btnExportJson: $('btnExportJson'),
  btnResetSongs: $('btnResetSongs'),
  btnCloseEditor: $('btnCloseEditor'),
  btnCancelEditor: $('btnCancelEditor'),
  btnSaveEditor: $('btnSaveEditor'),
  btnDeleteSong: $('btnDeleteSong'),
  btnAddSoloLine: $('btnAddSoloLine'),
  btnAddSplitLine: $('btnAddSplitLine'),
  btnAddCueLine: $('btnAddCueLine'),

  // Help modal
  helpModal: $('helpModal'),
  btnCloseHelp: $('btnCloseHelp')
};

// ==================== HELPERS ====================
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function loadSongs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Failed to load songs from storage:', e);
  }
  return deepClone(DEFAULT_SONGS);
}

function saveSongs() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.songs));
  } catch (e) {
    console.warn('Failed to save songs:', e);
  }
}

function loadPrefs() {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return;
    const prefs = JSON.parse(raw);
    if (typeof prefs.lyricScale === 'number') {
      state.lyricScale = Math.min(1.6, Math.max(0.7, prefs.lyricScale));
    }
    if (prefs.mode === 'youtube' || prefs.mode === 'timer') {
      state.mode = prefs.mode;
    }
    if (prefs.currentSongId && state.songs.some((s) => s.id === prefs.currentSongId)) {
      state.currentSongId = prefs.currentSongId;
    }
  } catch (e) {
    // ignore
  }
}

function savePrefs() {
  try {
    localStorage.setItem(
      PREFS_KEY,
      JSON.stringify({
        lyricScale: state.lyricScale,
        mode: state.mode,
        currentSongId: state.currentSongId
      })
    );
  } catch (e) {
    // ignore
  }
}

function getCurrentSong() {
  return state.songs.find((s) => s.id === state.currentSongId) || state.songs[0];
}

function formatTime(sec) {
  if (!Number.isFinite(sec) || sec < 0) sec = 0;
  const total = Math.floor(sec);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function extractYoutubeId(input) {
  if (!input) return '';
  const trimmed = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  try {
    const url = new URL(trimmed);
    if (url.hostname.includes('youtu.be')) {
      return url.pathname.replace('/', '').slice(0, 11);
    }
    if (url.searchParams.get('v')) {
      return url.searchParams.get('v').slice(0, 11);
    }
    const parts = url.pathname.split('/').filter(Boolean);
    const embedIdx = parts.findIndex((p) => p === 'embed' || p === 'shorts' || p === 'live');
    if (embedIdx >= 0 && parts[embedIdx + 1]) {
      return parts[embedIdx + 1].slice(0, 11);
    }
  } catch {
    // not a valid URL
  }
  return trimmed;
}

let toastTimer = null;
function showToast(msg, duration = 1800) {
  els.toast.textContent = msg;
  els.toast.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    els.toast.classList.add('hidden');
  }, duration);
}

function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ==================== RENDERING ====================
function applyFontScale() {
  document.documentElement.style.setProperty('--lyric-scale', state.lyricScale.toFixed(2));
}

function renderSongTabs() {
  els.songTabs.innerHTML = state.songs
    .map(
      (song, idx) => `
      <button
        class="song-tab ${song.id === state.currentSongId ? 'active' : ''}"
        role="tab"
        aria-selected="${song.id === state.currentSongId}"
        data-song-id="${escapeHtml(song.id)}"
      >
        ${idx + 1}. ${escapeHtml(song.title)}
      </button>
    `
    )
    .join('');

  els.songTabs.querySelectorAll('.song-tab').forEach((btn) => {
    btn.addEventListener('click', () => selectSong(btn.dataset.songId));
  });
}

function renderHeaderMeta() {
  const song = getCurrentSong();
  els.songTitle.textContent = song.title;
  els.songSubtitle.textContent = song.subtitle || '';

  const partA = song.parts?.A || 'Part A';
  const partB = song.parts?.B || 'Part B';
  const partBoth = song.parts?.both || '함께';

  els.partLegend.innerHTML = `
    <span class="legend-pill part-a"><span class="legend-dot"></span>${escapeHtml(partA)}</span>
    <span class="legend-pill part-b"><span class="legend-dot"></span>${escapeHtml(partB)}</span>
    <span class="legend-pill part-both"><span class="legend-dot"></span>${escapeHtml(partBoth)}</span>
  `;

  // Section quick-jump pills
  const sections = [];
  song.lines.forEach((line, index) => {
    if (line.section) {
      sections.push({ label: line.section, index, time: line.time });
    }
  });

  els.sectionPills.innerHTML = sections
    .map(
      (sec) => `
      <button class="section-pill" data-line-index="${sec.index}" title="${formatTime(sec.time)}로 이동">
        ${escapeHtml(sec.label)}
      </button>
    `
    )
    .join('');

  els.sectionPills.querySelectorAll('.section-pill').forEach((btn) => {
    btn.addEventListener('click', () => {
      jumpToLine(Number(btn.dataset.lineIndex), true);
    });
  });

  // Update timeline bounds
  const dur = getSongDuration(song);
  els.timeScrubber.max = String(dur);
  els.timeTotal.textContent = formatTime(dur);

  // YouTube external link
  if (song.youtubeId) {
    els.ytExternalLink.href = `https://www.youtube.com/watch?v=${encodeURIComponent(song.youtubeId)}`;
    els.ytExternalLink.classList.remove('hidden');
  } else {
    els.ytExternalLink.classList.add('hidden');
  }
}

function getSongDuration(song) {
  const lastLineTime = song.lines.length ? song.lines[song.lines.length - 1].time + 12 : 180;
  return Math.max(song.duration || 180, lastLineTime);
}

function renderLyrics() {
  const song = getCurrentSong();
  const partA = song.parts?.A || 'Part A';
  const partB = song.parts?.B || 'Part B';
  const partBoth = song.parts?.both || '함께';

  const html = [];

  song.lines.forEach((line, idx) => {
    if (line.section) {
      html.push(`<div class="section-divider">${escapeHtml(line.section)}</div>`);
    }

    const timeLabel = formatTime(line.time);

    if (line.type === 'split') {
      const showSplitLabels = idx === 0 || Boolean(line.section) || song.lines[idx - 1]?.type !== 'split';
      html.push(`
        <article class="lyric-card part-split" data-index="${idx}">
          <div class="lyric-meta">
            <span class="time-tag">${timeLabel}</span>
          </div>
          <div class="split-grid">
            <div class="split-col col-a">
              ${showSplitLabels ? `<div class="split-col-label">${escapeHtml(partA)}</div>` : ''}
              <div class="split-text">${escapeHtml(line.left?.text || '')}</div>
              ${line.left?.sub ? `<div class="split-sub">${escapeHtml(line.left.sub)}</div>` : ''}
            </div>
            <div class="split-divider" aria-hidden="true"></div>
            <div class="split-col col-b">
              ${showSplitLabels ? `<div class="split-col-label">${escapeHtml(partB)}</div>` : ''}
              <div class="split-text">${escapeHtml(line.right?.text || '')}</div>
              ${line.right?.sub ? `<div class="split-sub">${escapeHtml(line.right.sub)}</div>` : ''}
            </div>
          </div>
          <div class="line-progress"></div>
        </article>
      `);
    } else if (line.type === 'cue') {
      html.push(`
        <article class="lyric-card part-cue" data-index="${idx}">
          <div class="lyric-meta">
            <span class="time-tag">${timeLabel}</span>
          </div>
          <div class="lyric-main">${escapeHtml(line.text)}</div>
          ${line.sub ? `<div class="lyric-sub">${escapeHtml(line.sub)}</div>` : ''}
          <div class="line-progress"></div>
        </article>
      `);
    } else {
      const partKey = line.part === 'B' ? 'b' : line.part === 'both' ? 'both' : 'a';
      const partLabel = partKey === 'b' ? partB : partKey === 'both' ? partBoth : partA;
      const prevLine = song.lines[idx - 1];
      const showSingerLabel =
        idx === 0 || Boolean(line.section) || prevLine?.type !== 'solo' || prevLine?.part !== line.part;
      html.push(`
        <article class="lyric-card part-${partKey}" data-index="${idx}">
          <div class="lyric-meta">
            ${showSingerLabel ? `<span class="part-badge ${partKey}">${escapeHtml(partLabel)}</span>` : ''}
            <span class="time-tag">${timeLabel}</span>
          </div>
          <div class="lyric-main">${escapeHtml(line.text)}</div>
          ${line.sub ? `<div class="lyric-sub">${escapeHtml(line.sub)}</div>` : ''}
          <div class="line-progress"></div>
        </article>
      `);
    }
  });

  els.lyricsList.innerHTML = html.join('');

  els.lyricsList.querySelectorAll('.lyric-card').forEach((card) => {
    card.addEventListener('click', () => {
      const idx = Number(card.dataset.index);
      if (state.syncMode) {
        state.syncIndex = idx;
        updateSyncBanner();
        highlightSyncTarget();
        return;
      }
      jumpToLine(idx, true);
    });
  });

  state.activeLineIndex = -1;
  updateActiveLine(true);
}

function findLineIndexForTime(song, t) {
  if (!song.lines.length) return -1;
  let active = 0;
  for (let i = 0; i < song.lines.length; i++) {
    if (t + 0.05 >= song.lines[i].time) {
      active = i;
    } else {
      break;
    }
  }
  return active;
}

function updateActiveLine(forceScroll = false) {
  const song = getCurrentSong();
  if (!song.lines.length) return;

  const newIdx = findLineIndexForTime(song, state.currentTime);
  const cards = els.lyricsList.querySelectorAll('.lyric-card');

  if (newIdx !== state.activeLineIndex) {
    state.activeLineIndex = newIdx;

    cards.forEach((card, idx) => {
      card.classList.remove(
        'active',
        'dist-0',
        'dist-past-1',
        'dist-past-2',
        'dist-past-far',
        'dist-next-1',
        'dist-next-2',
        'dist-next-far'
      );

      const diff = idx - newIdx;
      if (diff === 0) {
        card.classList.add('active', 'dist-0');
      } else if (diff === -1) {
        card.classList.add('dist-past-1');
      } else if (diff === -2) {
        card.classList.add('dist-past-2');
      } else if (diff < -2) {
        card.classList.add('dist-past-far');
      } else if (diff === 1) {
        card.classList.add('dist-next-1');
      } else if (diff === 2) {
        card.classList.add('dist-next-2');
      } else {
        card.classList.add('dist-next-far');
      }

      const bar = card.querySelector('.line-progress');
      if (bar && idx !== newIdx) bar.style.width = idx < newIdx ? '100%' : '0%';
    });

    // Update active section pill
    let currentSectionIdx = -1;
    for (let i = newIdx; i >= 0; i--) {
      if (song.lines[i].section) {
        currentSectionIdx = i;
        break;
      }
    }
    els.sectionPills.querySelectorAll('.section-pill').forEach((pill) => {
      pill.classList.toggle('active', Number(pill.dataset.lineIndex) === currentSectionIdx);
    });

    // Smooth center scroll active line
    const activeCard = cards[newIdx];
    if (activeCard && !state.syncMode) {
      activeCard.scrollIntoView({
        behavior: forceScroll ? 'auto' : 'smooth',
        block: 'center'
      });
    }
  }

  // Update progress bar inside active card
  const activeCard = cards[newIdx];
  if (activeCard) {
    const start = song.lines[newIdx].time;
    const nextStart =
      newIdx + 1 < song.lines.length ? song.lines[newIdx + 1].time : getSongDuration(song);
    const span = Math.max(0.5, nextStart - start);
    const pct = Math.min(100, Math.max(0, ((state.currentTime - start) / span) * 100));
    const bar = activeCard.querySelector('.line-progress');
    if (bar) bar.style.width = `${pct.toFixed(1)}%`;
  }
}

function updateTimelineUI() {
  els.timeCurrent.textContent = formatTime(state.currentTime);
  els.timeScrubber.value = String(state.currentTime.toFixed(1));

  els.btnPlayPause.textContent = state.isPlaying ? '⏸ 일시정지' : '▶ 재생';
  els.btnPlayPause.classList.toggle('playing', state.isPlaying);

  els.modeYoutube.classList.toggle('active', state.mode === 'youtube');
  els.modeTimer.classList.toggle('active', state.mode === 'timer');
}

// ==================== SONG SELECTION & PLAYBACK ====================
function selectSong(songId) {
  if (state.syncMode) exitSyncMode(false);
  pausePlayback();

  state.currentSongId = songId;
  state.currentTime = 0;
  state.activeLineIndex = -1;
  savePrefs();

  const song = getCurrentSong();
  if (!song.youtubeId && state.mode === 'youtube') {
    state.mode = 'timer';
  }

  renderSongTabs();
  renderHeaderMeta();
  renderLyrics();
  updateTimelineUI();

  if (song.youtubeId) {
    loadYoutubeVideo(song.youtubeId);
  }
}

function setMode(newMode) {
  const song = getCurrentSong();
  if (newMode === 'youtube' && !song.youtubeId) {
    showToast('이 곡에는 유튜브 링크가 없어 타이머 모드를 사용합니다.');
    state.mode = 'timer';
    updateTimelineUI();
    return;
  }

  if (state.mode === newMode) return;

  const wasPlaying = state.isPlaying;
  const savedTime = state.currentTime;

  if (newMode === 'timer') {
    // Pause YT silently and hand off clock seamlessly
    if (state.ytPlayer && typeof state.ytPlayer.pauseVideo === 'function') {
      state.ytPlayer.pauseVideo();
    }
    state.mode = 'timer';
    state.currentTime = savedTime;
    state.lastFrameTs = performance.now();
    state.isPlaying = wasPlaying;
    showToast('별도 반주(타이머) 모드 — 태블릿 소리 없이 가사만 진행합니다');
  } else {
    state.mode = 'youtube';
    loadYoutubeVideo(song.youtubeId, savedTime, wasPlaying);
    showToast('유튜브 반주 모드로 전환했습니다');
  }

  savePrefs();
  updateTimelineUI();
}

function playPlayback() {
  const song = getCurrentSong();
  requestWakeLock();

  if (state.mode === 'youtube' && song.youtubeId) {
    if (!state.ytPlayer || !state.ytApiReady) {
      loadYoutubeVideo(song.youtubeId, state.currentTime, true);
      setVideoDrawerVisible(true);
      showToast('유튜브 반주를 불러오는 중...');
      return;
    }
    try {
      state.ytPlayer.seekTo(state.currentTime, true);
      state.ytPlayer.playVideo();
      state.isPlaying = true;
    } catch (e) {
      showToast('유튜브 재생을 시작하려면 영상 영역을 한 번 탭해 주세요.');
      setVideoDrawerVisible(true);
    }
  } else {
    state.isPlaying = true;
    state.lastFrameTs = performance.now();
  }

  updateTimelineUI();
}

function pausePlayback() {
  state.isPlaying = false;
  if (state.ytPlayer && typeof state.ytPlayer.pauseVideo === 'function') {
    try {
      state.ytPlayer.pauseVideo();
    } catch {
      // ignore
    }
  }
  updateTimelineUI();
}

function togglePlayPause() {
  if (state.isPlaying) {
    pausePlayback();
  } else {
    playPlayback();
  }
}

function seekTo(seconds, showFeedback = false) {
  const song = getCurrentSong();
  const dur = getSongDuration(song);
  state.currentTime = Math.min(dur, Math.max(0, seconds));
  state.lastFrameTs = performance.now();

  if (state.mode === 'youtube' && state.ytPlayer && typeof state.ytPlayer.seekTo === 'function') {
    try {
      state.ytPlayer.seekTo(state.currentTime, true);
    } catch {
      // ignore
    }
  }

  updateActiveLine(false);
  updateTimelineUI();
  if (showFeedback) {
    showToast(`위치 이동: ${formatTime(state.currentTime)}`, 1100);
  }
}

function nudgeTime(delta) {
  seekTo(state.currentTime + delta, false);
  const sign = delta > 0 ? '+' : '';
  showToast(`싱크 ${sign}${delta}초 (${formatTime(state.currentTime)})`, 1100);
}

function jumpToLine(index, notify = false) {
  const song = getCurrentSong();
  if (!song.lines.length) return;
  const clamped = Math.min(song.lines.length - 1, Math.max(0, index));
  const line = song.lines[clamped];
  seekTo(line.time, false);
  if (notify) {
    const label = line.section ? `${line.section} · ` : '';
    showToast(`${label}${formatTime(line.time)}로 이동`, 1200);
  }
}

function stepLine(dir) {
  const song = getCurrentSong();
  if (!song.lines.length) return;
  const cur = state.activeLineIndex < 0 ? 0 : state.activeLineIndex;
  jumpToLine(cur + dir, true);
}

// ==================== MAIN ANIMATION LOOP ====================
function tick(now) {
  const song = getCurrentSong();
  const dur = getSongDuration(song);

  if (state.isPlaying) {
    if (state.mode === 'youtube' && state.ytPlayer && typeof state.ytPlayer.getCurrentTime === 'function') {
      const ytTime = state.ytPlayer.getCurrentTime();
      if (Number.isFinite(ytTime)) {
        state.currentTime = ytTime;
      }
      const ytDur = state.ytPlayer.getDuration?.();
      if (Number.isFinite(ytDur) && ytDur > 10 && Math.abs(ytDur - Number(els.timeScrubber.max)) > 2) {
        els.timeScrubber.max = String(Math.ceil(ytDur));
        els.timeTotal.textContent = formatTime(ytDur);
      }
    } else {
      const dt = (now - state.lastFrameTs) / 1000;
      state.lastFrameTs = now;
      if (dt > 0 && dt < 1) {
        state.currentTime += dt;
      }
      if (state.currentTime >= dur) {
        state.currentTime = dur;
        state.isPlaying = false;
      }
    }

    updateActiveLine(false);
    updateTimelineUI();
  } else {
    state.lastFrameTs = now;
  }

  requestAnimationFrame(tick);
}

// ==================== YOUTUBE IFRAME API ====================
function ensureYoutubeApi() {
  if (window.YT && window.YT.Player) {
    state.ytApiReady = true;
    return Promise.resolve();
  }
  if (window._ytApiPromise) return window._ytApiPromise;

  window._ytApiPromise = new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (typeof prev === 'function') prev();
      state.ytApiReady = true;
      resolve();
    };
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
  });

  return window._ytApiPromise;
}

async function loadYoutubeVideo(videoId, startSeconds = 0, autoPlay = false) {
  if (!videoId) return;
  await ensureYoutubeApi();

  if (state.ytPlayer && typeof state.ytPlayer.loadVideoById === 'function') {
    if (state.ytLoadedVideoId !== videoId) {
      state.ytLoadedVideoId = videoId;
      if (autoPlay) {
        state.ytPlayer.loadVideoById({ videoId, startSeconds });
      } else {
        state.ytPlayer.cueVideoById({ videoId, startSeconds });
      }
    } else {
      state.ytPlayer.seekTo(startSeconds, true);
      if (autoPlay) state.ytPlayer.playVideo();
    }
    return;
  }

  state.ytLoadedVideoId = videoId;
  state.ytPlayer = new window.YT.Player('ytPlayerContainer', {
    videoId,
    playerVars: {
      playsinline: 1,
      rel: 0,
      modestbranding: 1,
      start: Math.floor(startSeconds)
    },
    events: {
      onReady: (e) => {
        const dur = e.target.getDuration?.();
        if (Number.isFinite(dur) && dur > 10) {
          els.timeScrubber.max = String(Math.ceil(dur));
          els.timeTotal.textContent = formatTime(dur);
        }
        if (autoPlay) {
          e.target.seekTo(startSeconds, true);
          e.target.playVideo();
        }
      },
      onStateChange: (e) => {
        if (state.mode !== 'youtube') return;
        const YTState = window.YT.PlayerState;
        if (e.data === YTState.PLAYING) {
          state.isPlaying = true;
          requestWakeLock();
          updateTimelineUI();
        } else if (e.data === YTState.PAUSED || e.data === YTState.ENDED) {
          state.isPlaying = false;
          updateTimelineUI();
        }
      }
    }
  });
}

function setVideoDrawerVisible(visible) {
  state.videoVisible = visible;
  els.ytDrawer.classList.toggle('hidden', !visible);
  els.btnToggleVideo.classList.toggle('primary', visible);
}

// ==================== TAP-TO-SYNC MODE ====================
function enterSyncMode() {
  const song = getCurrentSong();
  if (!song.lines.length) return;

  state.syncMode = true;
  state.syncDraftTimes = song.lines.map((l) => l.time);
  state.syncIndex = 0;

  els.syncBanner.classList.remove('hidden');
  els.btnSyncMode.classList.add('active');
  updateSyncBanner();
  highlightSyncTarget();
  showToast('반주를 재생하고 각 줄이 시작할 때 버튼을 탭하세요!', 2600);
}

function exitSyncMode(save) {
  const song = getCurrentSong();
  if (save) {
    song.lines.forEach((line, i) => {
      line.time = state.syncDraftTimes[i];
    });
    saveSongs();
    renderHeaderMeta();
    renderLyrics();
    showToast('싱크 타임스탬프가 저장되었습니다!', 2000);
  } else {
    showToast('싱크 기록을 취소했습니다.', 1400);
  }

  state.syncMode = false;
  els.syncBanner.classList.add('hidden');
  els.btnSyncMode.classList.remove('active');
  els.lyricsList.querySelectorAll('.lyric-card').forEach((c) => c.classList.remove('sync-target'));
}

function recordSyncTap() {
  const song = getCurrentSong();
  if (state.syncIndex >= song.lines.length) {
    showToast('모든 줄 기록 완료! [✓ 저장 완료]를 눌러주세요.');
    return;
  }

  const stamped = Math.round(state.currentTime * 10) / 10;
  state.syncDraftTimes[state.syncIndex] = stamped;

  // Immediately update visible time tag on card
  const card = els.lyricsList.querySelector(`.lyric-card[data-index="${state.syncIndex}"]`);
  if (card) {
    const tag = card.querySelector('.time-tag');
    if (tag) tag.textContent = formatTime(stamped);
  }

  state.syncIndex += 1;
  updateSyncBanner();
  highlightSyncTarget();

  if (state.syncIndex >= song.lines.length) {
    showToast('마지막 줄까지 기록 완료! [✓ 저장 완료]를 눌러주세요.', 2500);
  }
}

function undoSyncTap() {
  if (state.syncIndex > 0) {
    state.syncIndex -= 1;
    updateSyncBanner();
    highlightSyncTarget();
  }
}

function updateSyncBanner() {
  const song = getCurrentSong();
  if (state.syncIndex >= song.lines.length) {
    els.syncTargetLine.textContent = '모든 줄 기록 완료! 저장을 눌러주세요.';
    return;
  }
  const line = song.lines[state.syncIndex];
  const preview =
    line.type === 'split'
      ? `[스플릿] ${line.left?.text || ''} / ${line.right?.text || ''}`
      : line.text;
  els.syncTargetLine.textContent = `(${state.syncIndex + 1}/${song.lines.length}) ${preview}`;
}

function highlightSyncTarget() {
  const cards = els.lyricsList.querySelectorAll('.lyric-card');
  cards.forEach((c, idx) => {
    c.classList.toggle('sync-target', idx === state.syncIndex);
  });
  const target = cards[state.syncIndex];
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// ==================== SONG & LYRICS EDITOR ====================
function openEditorModal() {
  pausePlayback();
  const song = getCurrentSong();

  els.edTitle.value = song.title || '';
  els.edSubtitle.value = song.subtitle || '';
  els.edYoutube.value = song.youtubeId ? `https://www.youtube.com/watch?v=${song.youtubeId}` : '';
  els.edDuration.value = song.duration || 180;
  els.edPartA.value = song.parts?.A || 'Part A';
  els.edPartB.value = song.parts?.B || 'Part B';

  state.editorLinesDraft = deepClone(song.lines);
  renderEditorLines();

  els.btnDeleteSong.disabled = state.songs.length <= 1;
  els.editorModal.classList.remove('hidden');
}

function closeEditorModal() {
  els.editorModal.classList.add('hidden');
}

function renderEditorLines() {
  els.editorLines.innerHTML = state.editorLinesDraft
    .map((line, idx) => {
      const isSplit = line.type === 'split';
      const isCue = line.type === 'cue';

      return `
        <div class="ed-line-row" data-idx="${idx}">
          <div class="ed-line-top">
            <input type="number" step="0.1" min="0" data-field="time" value="${line.time}" title="시작 시간(초)" placeholder="초" />
            <input type="text" data-field="section" value="${escapeHtml(line.section || '')}" placeholder="구간명 (예: 1절)" />
            <select data-field="type">
              <option value="solo" ${line.type === 'solo' ? 'selected' : ''}>일반/솔로</option>
              <option value="split" ${isSplit ? 'selected' : ''}>좌우 스플릿(동시가창)</option>
              <option value="cue" ${isCue ? 'selected' : ''}>전주/간주 큐</option>
            </select>
            ${
              line.type === 'solo'
                ? `
                <select data-field="part">
                  <option value="A" ${line.part === 'A' ? 'selected' : ''}>Part A (노랑)</option>
                  <option value="B" ${line.part === 'B' ? 'selected' : ''}>Part B (하늘)</option>
                  <option value="both" ${line.part === 'both' ? 'selected' : ''}>함께 (초록)</option>
                </select>
              `
                : ''
            }
            <button class="icon-btn small" data-action="up" title="위로">↑</button>
            <button class="icon-btn small" data-action="down" title="아래로">↓</button>
            <button class="icon-btn small danger" data-action="remove" title="삭제">✕</button>
          </div>
          ${
            isSplit
              ? `
              <div class="ed-line-inputs">
                <input type="text" data-field="leftText" value="${escapeHtml(line.left?.text || '')}" placeholder="왼쪽 (Part A) 가사" />
                <input type="text" data-field="rightText" value="${escapeHtml(line.right?.text || '')}" placeholder="오른쪽 (Part B) 가사" />
                <input type="text" data-field="leftSub" value="${escapeHtml(line.left?.sub || '')}" placeholder="왼쪽 보조/해석 (선택)" />
                <input type="text" data-field="rightSub" value="${escapeHtml(line.right?.sub || '')}" placeholder="오른쪽 보조/해석 (선택)" />
              </div>
            `
              : `
              <div class="ed-line-inputs single">
                <input type="text" data-field="text" value="${escapeHtml(line.text || '')}" placeholder="가사 또는 안내 문구" />
                <input type="text" data-field="sub" value="${escapeHtml(line.sub || '')}" placeholder="보조 텍스트 / 해석 / 호흡 메모 (선택)" />
              </div>
            `
          }
        </div>
      `;
    })
    .join('');

  els.editorLines.querySelectorAll('.ed-line-row').forEach((row) => {
    const idx = Number(row.dataset.idx);
    const item = state.editorLinesDraft[idx];

    row.querySelectorAll('input, select').forEach((input) => {
      input.addEventListener('change', (e) => {
        const field = e.target.dataset.field;
        const val = e.target.value;

        if (field === 'time') {
          item.time = Math.max(0, parseFloat(val) || 0);
        } else if (field === 'section') {
          item.section = val.trim() || undefined;
        } else if (field === 'type') {
          item.type = val;
          if (val === 'split') {
            item.left = item.left || { text: item.text || '', sub: '' };
            item.right = item.right || { text: '', sub: '' };
          } else if (val === 'solo') {
            item.part = item.part || 'A';
            item.text = item.text || item.left?.text || '';
          } else {
            item.text = item.text || '';
          }
          renderEditorLines();
        } else if (field === 'part') {
          item.part = val;
        } else if (field === 'text') {
          item.text = val;
        } else if (field === 'sub') {
          item.sub = val;
        } else if (field === 'leftText') {
          item.left = item.left || {};
          item.left.text = val;
        } else if (field === 'leftSub') {
          item.left = item.left || {};
          item.left.sub = val;
        } else if (field === 'rightText') {
          item.right = item.right || {};
          item.right.text = val;
        } else if (field === 'rightSub') {
          item.right = item.right || {};
          item.right.sub = val;
        }
      });
    });

    row.querySelectorAll('button[data-action]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.action;
        if (action === 'up' && idx > 0) {
          [state.editorLinesDraft[idx - 1], state.editorLinesDraft[idx]] = [
            state.editorLinesDraft[idx],
            state.editorLinesDraft[idx - 1]
          ];
          renderEditorLines();
        } else if (action === 'down' && idx < state.editorLinesDraft.length - 1) {
          [state.editorLinesDraft[idx + 1], state.editorLinesDraft[idx]] = [
            state.editorLinesDraft[idx],
            state.editorLinesDraft[idx + 1]
          ];
          renderEditorLines();
        } else if (action === 'remove') {
          state.editorLinesDraft.splice(idx, 1);
          renderEditorLines();
        }
      });
    });
  });
}

function addEditorLine(type) {
  const lastTime = state.editorLinesDraft.length
    ? state.editorLinesDraft[state.editorLinesDraft.length - 1].time + 8
    : 0;

  if (type === 'split') {
    state.editorLinesDraft.push({
      type: 'split',
      time: lastTime,
      left: { text: '', sub: '' },
      right: { text: '', sub: '' }
    });
  } else if (type === 'cue') {
    state.editorLinesDraft.push({
      type: 'cue',
      time: lastTime,
      text: '간주 (Interlude)',
      sub: ''
    });
  } else {
    state.editorLinesDraft.push({
      type: 'solo',
      part: 'A',
      time: lastTime,
      text: '',
      sub: ''
    });
  }
  renderEditorLines();
  els.editorLines.lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function saveEditorChanges() {
  const song = getCurrentSong();
  song.title = els.edTitle.value.trim() || '제목 없는 곡';
  song.subtitle = els.edSubtitle.value.trim();
  song.youtubeId = extractYoutubeId(els.edYoutube.value);
  song.duration = Math.max(30, parseInt(els.edDuration.value, 10) || 180);
  song.parts = {
    A: els.edPartA.value.trim() || 'Part A',
    B: els.edPartB.value.trim() || 'Part B',
    both: '함께'
  };

  // Sort lines by timestamp to ensure consistent prompter sync
  song.lines = deepClone(state.editorLinesDraft).sort((a, b) => a.time - b.time);

  saveSongs();
  closeEditorModal();
  selectSong(song.id);
  showToast('곡 정보가 저장되었습니다.');
}

function createNewSong() {
  const id = `song-${Date.now()}`;
  const newSong = {
    id,
    title: `${state.songs.length + 1}번 새 곡`,
    subtitle: '',
    youtubeId: '',
    duration: 210,
    parts: { A: 'Part A', B: 'Part B', both: '함께' },
    lines: [
      { type: 'cue', section: '전주', time: 0, text: '전주 (Intro)', sub: '' },
      { type: 'solo', section: '1절', part: 'A', time: 10, text: '첫 번째 가사 줄', sub: '' }
    ]
  };
  state.songs.push(newSong);
  saveSongs();
  state.currentSongId = id;
  openEditorModal();
  renderSongTabs();
}

function deleteCurrentSong() {
  if (state.songs.length <= 1) return;
  const song = getCurrentSong();
  if (!confirm(`"${song.title}" 곡을 삭제할까요?`)) return;
  state.songs = state.songs.filter((s) => s.id !== song.id);
  saveSongs();
  closeEditorModal();
  selectSong(state.songs[0].id);
  showToast('곡을 삭제했습니다.');
}

// ==================== WAKE LOCK & FULLSCREEN ====================
async function requestWakeLock() {
  if (!('wakeLock' in navigator)) return;
  try {
    if (state.wakeLock) return;
    state.wakeLock = await navigator.wakeLock.request('screen');
    els.btnWakeLock.classList.add('wake-on');
    state.wakeLock.addEventListener('release', () => {
      state.wakeLock = null;
      els.btnWakeLock.classList.remove('wake-on');
    });
  } catch {
    // ignore if browser denies
  }
}

async function toggleWakeLock() {
  if (state.wakeLock) {
    await state.wakeLock.release();
    state.wakeLock = null;
    els.btnWakeLock.classList.remove('wake-on');
    showToast('화면 꺼짐 방지 해제');
  } else {
    await requestWakeLock();
    showToast('화면 꺼짐 방지 켜짐');
  }
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen?.().catch(() => {});
  } else {
    document.exitFullscreen?.().catch(() => {});
  }
}

// ==================== EVENT BINDINGS ====================
function bindEvents() {
  // Font size
  els.btnFontDown.addEventListener('click', () => {
    state.lyricScale = Math.max(0.7, +(state.lyricScale - 0.1).toFixed(2));
    applyFontScale();
    savePrefs();
  });
  els.btnFontUp.addEventListener('click', () => {
    state.lyricScale = Math.min(1.6, +(state.lyricScale + 0.1).toFixed(2));
    applyFontScale();
    savePrefs();
  });

  // Video drawer
  els.btnToggleVideo.addEventListener('click', () => {
    const song = getCurrentSong();
    if (!song.youtubeId) {
      showToast('이 곡에 연결된 유튜브 링크가 없습니다.');
      return;
    }
    setVideoDrawerVisible(!state.videoVisible);
    if (state.videoVisible) loadYoutubeVideo(song.youtubeId, state.currentTime, false);
  });
  els.btnCloseVideo.addEventListener('click', () => setVideoDrawerVisible(false));

  // Fullscreen & Wake Lock
  els.btnFullscreen.addEventListener('click', toggleFullscreen);
  els.btnWakeLock.addEventListener('click', toggleWakeLock);

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && state.isPlaying) {
      requestWakeLock();
    }
  });

  // Mode switch
  els.modeYoutube.addEventListener('click', () => setMode('youtube'));
  els.modeTimer.addEventListener('click', () => setMode('timer'));

  // Scrubber
  els.timeScrubber.addEventListener('input', (e) => {
    seekTo(parseFloat(e.target.value), false);
  });

  // Transport controls
  els.btnPlayPause.addEventListener('click', togglePlayPause);
  els.btnRestart.addEventListener('click', () => seekTo(0, true));
  els.btnPrevLine.addEventListener('click', () => stepLine(-1));
  els.btnNextLine.addEventListener('click', () => stepLine(1));

  document.querySelectorAll('.ctrl-btn.nudge').forEach((btn) => {
    btn.addEventListener('click', () => nudgeTime(parseFloat(btn.dataset.nudge)));
  });

  // Sync mode
  els.btnSyncMode.addEventListener('click', () => {
    if (state.syncMode) {
      exitSyncMode(false);
    } else {
      enterSyncMode();
    }
  });
  els.btnSyncTap.addEventListener('click', recordSyncTap);
  els.btnSyncUndo.addEventListener('click', undoSyncTap);
  els.btnSyncDone.addEventListener('click', () => exitSyncMode(true));
  els.btnSyncCancel.addEventListener('click', () => exitSyncMode(false));

  // Editor modal
  els.btnEditSong.addEventListener('click', openEditorModal);
  els.btnCloseEditor.addEventListener('click', closeEditorModal);
  els.btnCancelEditor.addEventListener('click', closeEditorModal);
  els.btnSaveEditor.addEventListener('click', saveEditorChanges);
  els.btnNewSong.addEventListener('click', createNewSong);
  els.btnDeleteSong.addEventListener('click', deleteCurrentSong);
  els.btnAddSoloLine.addEventListener('click', () => addEditorLine('solo'));
  els.btnAddSplitLine.addEventListener('click', () => addEditorLine('split'));
  els.btnAddCueLine.addEventListener('click', () => addEditorLine('cue'));

  els.btnExportJson.addEventListener('click', async () => {
    const json = JSON.stringify(getCurrentSong(), null, 2);
    try {
      await navigator.clipboard.writeText(json);
      showToast('현재 곡 JSON이 클립보드에 복사되었습니다!');
    } catch {
      prompt('아래 JSON을 복사하세요:', json);
    }
  });

  els.btnResetSongs.addEventListener('click', () => {
    if (!confirm('모든 곡 데이터를 처음 기본값으로 되돌릴까요?')) return;
    state.songs = deepClone(DEFAULT_SONGS);
    saveSongs();
    closeEditorModal();
    selectSong(state.songs[0].id);
    showToast('기본 곡 데이터로 초기화되었습니다.');
  });

  // Help modal
  els.btnToggleDockHint.addEventListener('click', () => els.helpModal.classList.remove('hidden'));
  els.btnCloseHelp.addEventListener('click', () => els.helpModal.classList.add('hidden'));
  els.helpModal.addEventListener('click', (e) => {
    if (e.target === els.helpModal) els.helpModal.classList.add('hidden');
  });

  // Keyboard & Bluetooth pedal shortcuts
  window.addEventListener('keydown', (e) => {
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    if (!els.editorModal.classList.contains('hidden')) return;

    if (e.code === 'Space') {
      e.preventDefault();
      if (state.syncMode) {
        recordSyncTap();
      } else {
        togglePlayPause();
      }
    } else if (e.code === 'ArrowRight' || e.code === 'PageDown') {
      e.preventDefault();
      stepLine(1);
    } else if (e.code === 'ArrowLeft' || e.code === 'PageUp') {
      e.preventDefault();
      stepLine(-1);
    } else if (e.key === '[') {
      e.preventDefault();
      nudgeTime(-0.5);
    } else if (e.key === ']') {
      e.preventDefault();
      nudgeTime(0.5);
    } else if (e.key === 'r' || e.key === 'R') {
      e.preventDefault();
      seekTo(0, true);
    } else if (e.key === 'f' || e.key === 'F') {
      e.preventDefault();
      toggleFullscreen();
    }
  });
}

// ==================== INIT ====================
function init() {
  loadPrefs();
  applyFontScale();
  bindEvents();

  const initialId = state.currentSongId || state.songs[0].id;
  selectSong(initialId);

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }

  requestAnimationFrame(tick);
}

init();
