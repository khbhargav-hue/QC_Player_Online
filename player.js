const video = document.getElementById("video");
const dropZone = document.getElementById("dropZone");
const paneA = document.getElementById("paneA");
const videoStage = document.getElementById("videoStage");
const emptyState = document.getElementById("emptyState");
const openBtn = document.getElementById("openBtn");
const openEmpty = document.getElementById("openEmpty");
const fileInput = document.getElementById("fileInput");
const playBtn = document.getElementById("playBtn");
const prevFrame = document.getElementById("prevFrame");
const nextFrame = document.getElementById("nextFrame");
const copyBtn = document.getElementById("copyBtn");
const timeline = document.getElementById("timeline");
const timecode = document.getElementById("timecode");
const status = document.getElementById("status");
const fpsEl = document.getElementById("fps");
const resolutionEl = document.getElementById("resolution");
const durationEl = document.getElementById("duration");
const fileNameEl = document.getElementById("fileName");
const toast = document.getElementById("toast");
const fsBtn = document.getElementById("fsBtn");
const muteBtn = document.getElementById("muteBtn");
const volumeSlider = document.getElementById("volumeSlider");
const speedSelect = document.getElementById("speedSelect");
const setInBtn = document.getElementById("setInBtn");
const setOutBtn = document.getElementById("setOutBtn");
const loopBtn = document.getElementById("loopBtn");
const loopLabel = document.getElementById("loopLabel");
const snapBtn = document.getElementById("snapBtn");
const compareBtn = document.getElementById("compareBtn");
const scriptBtn = document.getElementById("scriptBtn");
const paneScript = document.getElementById("paneScript");
const scriptDocUrl = document.getElementById("scriptDocUrl");
const scriptFrame = document.getElementById("scriptFrame");
const scriptEditModeBtn = document.getElementById("scriptEditModeBtn");
const videoB = document.getElementById("videoB");
const paneB = document.getElementById("paneB");
const emptyStateB = document.getElementById("emptyStateB");
const openB = document.getElementById("openB");
const paneLabelB = document.getElementById("paneLabelB");
const guidesBtn = document.getElementById("guidesBtn");
const guidesA = document.getElementById("guidesA");
const rulerBtn = document.getElementById("rulerBtn");
const rulerLines = document.getElementById("rulerLines");
const rulerTop = document.getElementById("rulerTop");
const rulerLeft = document.getElementById("rulerLeft");
const clearRulerBtn = document.getElementById("clearRulerBtn");
const fsBar = document.getElementById("fsBar");
const fsPrevFrame = document.getElementById("fsPrevFrame");
const fsPlayBtn = document.getElementById("fsPlayBtn");
const fsNextFrame = document.getElementById("fsNextFrame");
const fsCopyBtn = document.getElementById("fsCopyBtn");
const fsSetInBtn = document.getElementById("fsSetInBtn");
const fsSetOutBtn = document.getElementById("fsSetOutBtn");
const fsLoopBtn = document.getElementById("fsLoopBtn");
const swapSidesBtn = document.getElementById("swapSidesBtn");
const shortcutsBtn = document.getElementById("shortcutsBtn");
const shortcutsModal = document.getElementById("shortcutsModal");
const shortcutsCloseBtn = document.getElementById("shortcutsCloseBtn");
const fsTimecode = document.getElementById("fsTimecode");
const fsExitBtn = document.getElementById("fsExitBtn");
const gotoInput = document.getElementById("gotoInput");
const gotoBtn = document.getElementById("gotoBtn");
const fsGotoInput = document.getElementById("fsGotoInput");
const paneBBar = document.getElementById("paneBBar");
const timelineB = document.getElementById("timelineB");
const timecodeB = document.getElementById("timecodeB");
const syncBtn = document.getElementById("syncBtn");
const driveUrlA = document.getElementById("driveUrlA");
const driveGoA = document.getElementById("driveGoA");
const changeLinkBtn = document.getElementById("changeLinkBtn");
const changeLinkPopover = document.getElementById("changeLinkPopover");
const changeLinkInput = document.getElementById("changeLinkInput");
const changeLinkGoBtn = document.getElementById("changeLinkGoBtn");
const changeLinkCloseBtn = document.getElementById("changeLinkCloseBtn");
const tray = document.getElementById("tray");
const trayToggleBtn = document.getElementById("trayToggleBtn");
const trayFolderName = document.getElementById("trayFolderName");
const trayFileList = document.getElementById("trayFileList");
const trayGridBtn = document.getElementById("trayGridBtn");
const trayListBtn = document.getElementById("trayListBtn");
const trayBackBtn = document.getElementById("trayBackBtn");
const startFreshBtn = document.getElementById("startFreshBtn");
const playlistRow = document.getElementById("playlistRow");
const playlistPosition = document.getElementById("playlistPosition");
const prevVideoBtn = document.getElementById("prevVideoBtn");
const nextVideoBtn = document.getElementById("nextVideoBtn");
let folderFiles = [];
let folderIndex = -1;
let folderHistory = [];
let currentFolderId = null;
const loadingA = document.getElementById("loadingA");
const loadingLabelA = document.getElementById("loadingLabelA");
const progressFillA = document.getElementById("progressFillA");
const loadingPercentA = document.getElementById("loadingPercentA");
const driveUrlB = document.getElementById("driveUrlB");
const driveGoB = document.getElementById("driveGoB");
const loadingB = document.getElementById("loadingB");
const loadingLabelB = document.getElementById("loadingLabelB");
const progressFillB = document.getElementById("progressFillB");
const loadingPercentB = document.getElementById("loadingPercentB");

let fps = 25;
let fpsB = 25;
let loopIn = null;
let loopOut = null;
let loopActive = false;
let compareMode = false;
let scriptMode = false;
let videoBLoaded = false;
let syncLocked = true;
let pendingFileTarget = "A";

function pad(n, width = 2) {
  return String(Math.max(0, Math.floor(n))).padStart(width, "0");
}

function getFrameNumber(seconds, fpsValue = fps) {
  return Math.max(0, Math.floor(seconds * fpsValue + 1e-7));
}

function formatTimecode(seconds, fpsValue = fps) {
  const roundFps = Math.round(fpsValue);
  const totalFrames = getFrameNumber(seconds, fpsValue);
  const frames = totalFrames % roundFps;
  const totalSeconds = Math.floor(totalFrames / roundFps);
  const s = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const m = totalMinutes % 60;
  const h = Math.floor(totalMinutes / 60);
  return `${pad(h)}:${pad(m)}:${pad(s)}:${pad(frames)}`;
}

function parseTimecode(str, fpsValue = fps) {
  const m = String(str).trim().match(/^(\d{1,2}):(\d{1,2}):(\d{1,2}):(\d{1,3})$/);
  if (!m) return null;
  const h = Number(m[1]), mi = Number(m[2]), s = Number(m[3]), f = Number(m[4]);
  const roundFps = Math.round(fpsValue);
  if (mi > 59 || s > 59 || f >= roundFps) return null;
  return h * 3600 + mi * 60 + s + f / fpsValue;
}

function refreshUI() {
  const tc = formatTimecode(video.currentTime || 0);
  timecode.textContent = tc;
  fsTimecode.textContent = tc;
  timeline.value = video.currentTime || 0;
}

function refreshUIB() {
  timecodeB.textContent = formatTimecode(videoB.currentTime || 0, fpsB);
  timelineB.value = videoB.currentTime || 0;
}

function flash(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1400);
}

function formatDuration(seconds) {
  if (!Number.isFinite(seconds)) return "—";
  const s = Math.floor(seconds);
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
}

// FPS isn't readable from a container the way ffprobe gave it to the desktop
// app — there's no metadata reader in a browser. Instead this samples real
// presented frames via requestVideoFrameCallback and times them. It's a
// measurement, not a metadata read, so it stays editable in case it's off.
function sampleFps(videoEl) {
  return new Promise((resolve) => {
    if (!videoEl.requestVideoFrameCallback) { resolve(null); return; }
    let count = 0;
    let firstMediaTime = null;
    let settled = false;

    function finish(value) {
      if (settled) return;
      settled = true;
      videoEl.removeEventListener("ended", onInterrupt);
      videoEl.removeEventListener("pause", onInterrupt);
      resolve(value);
    }
    // A clip shorter than the sampling window ends (or gets paused) before
    // enough frames arrive — without this, playback would sit at "detecting"
    // forever instead of settling on whatever samples it managed to get.
    function onInterrupt() {
      const elapsed = firstMediaTime != null ? (videoEl.currentTime - firstMediaTime) : 0;
      const estimated = count > 1 && elapsed > 0 ? (count - 1) / elapsed : null;
      finish(estimated && Number.isFinite(estimated) && estimated > 1 ? estimated : null);
    }
    videoEl.addEventListener("ended", onInterrupt);
    videoEl.addEventListener("pause", onInterrupt);

    function tick(now, metadata) {
      if (settled) return;
      count++;
      if (firstMediaTime == null) firstMediaTime = metadata.mediaTime;
      const elapsed = metadata.mediaTime - firstMediaTime;
      if (count >= 40 || elapsed >= 1.2) {
        const estimated = elapsed > 0 ? (count - 1) / elapsed : null;
        finish(estimated && Number.isFinite(estimated) && estimated > 1 ? estimated : null);
        return;
      }
      videoEl.requestVideoFrameCallback(tick);
    }
    videoEl.requestVideoFrameCallback(tick);

    setTimeout(() => finish(null), 2500); // absolute safety net — never hang
  });
}

let userMuted = false;

async function detectFps(videoEl, loadId, targetPane) {
  if (!videoEl.paused) {
    const estimated = await sampleFps(videoEl);
    return estimated;
  }

  const wasMuted = videoEl.muted;
  videoEl.muted = true;
  try {
    await videoEl.play();
  } catch {
    videoEl.muted = userMuted;
    return null;
  }
  const estimated = await sampleFps(videoEl);
  const activeLoadId = targetPane === "A" ? loadIdA : loadIdB;
  if (activeLoadId === loadId && !videoEl.paused) {
    videoEl.pause();
    videoEl.currentTime = 0;
  }
  videoEl.muted = userMuted;
  return estimated;
}

function setFpsDisplay(value) {
  const isDropFrame = Math.abs(value - 29.97) < 0.02 || Math.abs(value - 23.976) < 0.02;
  fpsEl.value = value.toFixed(3).replace(/\.?0+$/, "") + (isDropFrame ? "~" : "");
  fpsEl.title = isDropFrame
    ? "29.97 / 23.976 fps — timecodes are approximate (±0.1s per minute). This is a broadcast drop-frame limitation, not a bug."
    : "Auto-detected — click to correct if it looks off";
}

let currentObjectUrlA = null;
let currentObjectUrlB = null;
let activeAbortControllers = { A: null, B: null };
let loadIdA = 0;
let loadIdB = 0;

const stageImg = document.getElementById("stageImg");

function stopCurrentMedia(target = "A") {
  if (target === "A") {
    try { video.pause(); } catch {}
    video.currentTime = 0;
    playBtn.textContent = "▶";
    fsPlayBtn.textContent = "▶";
    timecode.textContent = "00:00:00:00";
    fsTimecode.textContent = "00:00:00:00";
    timeline.value = 0;
    timeline.max = 0;
    durationEl.textContent = "—";
    fpsEl.value = "—";
    status.textContent = "Ready";

    if (changeLinkPopover) changeLinkPopover.classList.remove("show");

    video.removeAttribute("src");
    try { video.load(); } catch {}

    if (currentObjectUrlA) {
      try { URL.revokeObjectURL(currentObjectUrlA); } catch {}
      currentObjectUrlA = null;
    }
    if (stageImg) {
      stageImg.src = "";
      stageImg.style.display = "none";
    }
    updateGuideRect();
  } else if (target === "B") {
    try { videoB.pause(); } catch {}
    videoB.currentTime = 0;
    timecodeB.textContent = "00:00:00:00";
    timelineB.value = 0;
    timelineB.max = 0;

    videoB.removeAttribute("src");
    try { videoB.load(); } catch {}

    if (currentObjectUrlB) {
      try { URL.revokeObjectURL(currentObjectUrlB); } catch {}
      currentObjectUrlB = null;
    }
  }
}

async function loadVideo(url, displayName) {
  if (!url) return;
  const thisLoadId = ++loadIdA;
  const ext = (displayName.split(".").pop() || "").toLowerCase();
  const isImage = ["jpg","jpeg","png","gif","webp","bmp","svg"].includes(ext);

  status.textContent = "Reading file...";
  if (currentObjectUrlA && currentObjectUrlA !== url) URL.revokeObjectURL(currentObjectUrlA);
  currentObjectUrlA = url;
  emptyState.style.display = "none";
  fileNameEl.textContent = displayName || "file";

  if (isImage) {
    video.pause();
    video.style.display = "none";
    stageImg.src = url;
    stageImg.style.display = "block";
    timeline.max = 0;
    timeline.value = 0;
    durationEl.textContent = "Image";
    timecode.textContent = "00:00:00:00";
    fpsEl.value = "—";
    status.textContent = "Ready";

    stageImg.onload = () => {
      if (thisLoadId !== loadIdA) return;
      resolutionEl.textContent = `${stageImg.naturalWidth} × ${stageImg.naturalHeight}`;
      updateGuideRect();
    };
    refreshUI();
    return;
  }

  // Video or Audio file
  stageImg.style.display = "none";
  video.style.display = "block";
  video.src = url;
  video.muted = userMuted;
  video.volume = Number(volumeSlider.value) || 1;
  video.load();

  video.onloadedmetadata = async () => {
    if (thisLoadId !== loadIdA) return;
    timeline.max = video.duration || 0;
    durationEl.textContent = formatDuration(video.duration);

    const isAudio = ["mp3","aac","wav","flac","ogg","m4a"].includes(ext) || (!video.videoWidth && video.duration);
    resolutionEl.textContent = isAudio ? "Audio Only" : (video.videoWidth ? `${video.videoWidth} × ${video.videoHeight}` : "—");

    if (isAudio) {
      fpsEl.value = "—";
      status.textContent = "Ready";
    } else {
      fpsEl.value = "detecting…";
      status.textContent = "Detecting frame rate...";
      const detected = await detectFps(video, thisLoadId, "A");
      if (thisLoadId !== loadIdA) return;
      fps = detected || 25;
      setFpsDisplay(fps);
      status.textContent = "Ready";
    }
    refreshUI();
    updateGuideRect();
  };
}

fpsEl.addEventListener("change", () => {
  const val = parseFloat(fpsEl.value);
  if (Number.isFinite(val) && val > 0) {
    fps = val;
    setFpsDisplay(fps);
    refreshUI();
  } else {
    setFpsDisplay(fps);
  }
});

function stepFrame(direction) {
  if (!video.src) return;
  video.pause();
  const frame = getFrameNumber(video.currentTime);
  const maxFrame = Number.isFinite(video.duration) ? Math.floor(video.duration * fps) : Infinity;
  const target = Math.max(0, Math.min(maxFrame, frame + direction));
  video.currentTime = (target + 0.05) / fps;
  playBtn.textContent = "▶";
  fsPlayBtn.textContent = "▶";
  syncB();
}

function seekToTimecode(rawValue) {
  const seconds = parseTimecode(rawValue);
  if (seconds == null || !video.src) {
    flash("✕ Invalid timecode");
    return;
  }
  const clamped = Number.isFinite(video.duration) ? Math.min(seconds, video.duration) : seconds;
  video.pause();
  video.currentTime = clamped;
  playBtn.textContent = "▶";
  fsPlayBtn.textContent = "▶";
  refreshUI();
  syncB();
  flash(`→ ${formatTimecode(clamped)}`);
}

function wireGotoInput(inputEl) {
  inputEl.addEventListener("paste", (e) => {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData("text");
    inputEl.value = text.trim();
    seekToTimecode(text);
  });
  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      seekToTimecode(inputEl.value);
    }
  });
}

async function copyTimestamp() {
  const tc = formatTimecode(video.currentTime || 0);
  try {
    await navigator.clipboard.writeText(tc);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = tc;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
  }
  flash(`✓ Copied ${tc}`);
  status.textContent = `Copied ${tc}`;
}

function toggleFullscreen() {
  if (!document.fullscreenElement) dropZone.requestFullscreen?.();
  else document.exitFullscreen?.();
}

function updateMuteIcon() {
  muteBtn.textContent = (video.muted || video.volume === 0) ? "🔇" : "🔊";
}

function checkLoop() {
  if (loopActive && loopIn != null && loopOut != null && loopOut > loopIn) {
    if (video.currentTime >= loopOut) video.currentTime = loopIn;
  }
}

const annotateModal = document.getElementById("annotateModal");
const annotateCanvas = document.getElementById("annotateCanvas");
const annotateUndo = document.getElementById("annotateUndo");
const annotateClear = document.getElementById("annotateClear");
const annotateCancel = document.getElementById("annotateCancel");
const annotateSave = document.getElementById("annotateSave");
const colorSwatches = document.querySelectorAll(".colorSwatch");
const toolButtons = document.querySelectorAll(".toolBtn");

let annotateCtx = null;
let annotateBaseImage = null;
let annotateStrokes = [];
let annotateColor = "#ff3b6b";
let annotateTool = "pen";
let annotateFilenameBase = "frame";
let drawingStroke = false;
let currentStroke = null;

function takeSnapshot() {
  if (stageImg && stageImg.style.display !== "none" && stageImg.naturalWidth) {
    const canvas = document.createElement("canvas");
    canvas.width = stageImg.naturalWidth;
    canvas.height = stageImg.naturalHeight;
    canvas.getContext("2d").drawImage(stageImg, 0, 0);
    annotateFilenameBase = `${(fileNameEl.textContent || "image").replace(/\.[^.]+$/, "")}_snapshot`;
    openAnnotateModal(canvas);
    return;
  }

  if (!video.src || !video.videoWidth) return;
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  try {
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    const tc = formatTimecode(video.currentTime || 0).replace(/:/g, "-");
    annotateFilenameBase = `${(fileNameEl.textContent || "frame").replace(/\.[^.]+$/, "")}_${tc}`;
    openAnnotateModal(canvas);
  } catch (err) {
    if (err.name === "SecurityError") {
      flash("✕ Screenshot unavailable for cross-origin frames");
    } else {
      flash("✕ Couldn't capture this frame");
    }
  }
}

function openAnnotateModal(sourceCanvas) {
  annotateBaseImage = sourceCanvas;
  annotateCanvas.width = sourceCanvas.width;
  annotateCanvas.height = sourceCanvas.height;
  annotateCtx = annotateCanvas.getContext("2d");
  annotateStrokes = [];
  redrawAnnotation();
  annotateModal.classList.add("show");
}

function redrawAnnotation() {
  if (!annotateBaseImage || !annotateCtx) return;
  annotateCtx.drawImage(annotateBaseImage, 0, 0);
  for (const stroke of annotateStrokes) drawStroke(stroke);
}

function drawStroke(stroke) {
  annotateCtx.strokeStyle = stroke.color;
  annotateCtx.fillStyle = stroke.color;
  annotateCtx.lineCap = "round";
  annotateCtx.lineJoin = "round";
  annotateCtx.globalAlpha = 1;

  if (stroke.type === "pen" || stroke.type === "marker") {
    if (stroke.points.length < 2) return;
    annotateCtx.globalAlpha = stroke.type === "marker" ? 0.35 : 1;
    annotateCtx.lineWidth = stroke.type === "marker"
      ? Math.max(12, annotateBaseImage.width / 55)
      : Math.max(2, annotateBaseImage.width / 350);
    annotateCtx.beginPath();
    annotateCtx.moveTo(stroke.points[0].x, stroke.points[0].y);
    for (let i = 1; i < stroke.points.length; i++) annotateCtx.lineTo(stroke.points[i].x, stroke.points[i].y);
    annotateCtx.stroke();
    annotateCtx.globalAlpha = 1;
    return;
  }

  annotateCtx.lineWidth = Math.max(3, annotateBaseImage.width / 300);
  const { start, end } = stroke;

  if (stroke.type === "rect") {
    annotateCtx.strokeRect(
      Math.min(start.x, end.x), Math.min(start.y, end.y),
      Math.abs(end.x - start.x), Math.abs(end.y - start.y)
    );
  } else if (stroke.type === "circle") {
    const cx = (start.x + end.x) / 2, cy = (start.y + end.y) / 2;
    const rx = Math.abs(end.x - start.x) / 2, ry = Math.abs(end.y - start.y) / 2;
    annotateCtx.beginPath();
    annotateCtx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    annotateCtx.stroke();
  } else if (stroke.type === "arrow") {
    annotateCtx.beginPath();
    annotateCtx.moveTo(start.x, start.y);
    annotateCtx.lineTo(end.x, end.y);
    annotateCtx.stroke();
    const angle = Math.atan2(end.y - start.y, end.x - start.x);
    const headLen = Math.max(14, annotateBaseImage.width / 40);
    annotateCtx.beginPath();
    annotateCtx.moveTo(end.x, end.y);
    annotateCtx.lineTo(end.x - headLen * Math.cos(angle - Math.PI / 6), end.y - headLen * Math.sin(angle - Math.PI / 6));
    annotateCtx.moveTo(end.x, end.y);
    annotateCtx.lineTo(end.x - headLen * Math.cos(angle + Math.PI / 6), end.y - headLen * Math.sin(angle + Math.PI / 6));
    annotateCtx.stroke();
  }
}

function canvasPointFromEvent(e) {
  const rect = annotateCanvas.getBoundingClientRect();
  return {
    x: (e.clientX - rect.left) * (annotateCanvas.width / rect.width),
    y: (e.clientY - rect.top) * (annotateCanvas.height / rect.height)
  };
}

annotateCanvas.addEventListener("pointerdown", (e) => {
  drawingStroke = true;
  const pt = canvasPointFromEvent(e);
  currentStroke = (annotateTool === "pen" || annotateTool === "marker")
    ? { type: annotateTool, color: annotateColor, points: [pt] }
    : { type: annotateTool, color: annotateColor, start: pt, end: pt };
  annotateStrokes.push(currentStroke);
  annotateCanvas.setPointerCapture(e.pointerId);
});
annotateCanvas.addEventListener("pointermove", (e) => {
  if (!drawingStroke || !currentStroke) return;
  const pt = canvasPointFromEvent(e);
  if (currentStroke.type === "pen" || currentStroke.type === "marker") currentStroke.points.push(pt);
  else currentStroke.end = pt;
  redrawAnnotation();
});
annotateCanvas.addEventListener("pointerup", () => { drawingStroke = false; currentStroke = null; });
annotateCanvas.addEventListener("pointerleave", () => { drawingStroke = false; currentStroke = null; });

toolButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    annotateTool = btn.dataset.tool;
    toolButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  });
});
colorSwatches.forEach(btn => {
  btn.addEventListener("click", () => {
    annotateColor = btn.dataset.color;
    colorSwatches.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  });
});
annotateUndo.addEventListener("click", () => { annotateStrokes.pop(); redrawAnnotation(); });
annotateClear.addEventListener("click", () => { annotateStrokes = []; redrawAnnotation(); });
annotateCancel.addEventListener("click", () => annotateModal.classList.remove("show"));
annotateSave.addEventListener("click", () => {
  const a = document.createElement("a");
  a.href = annotateCanvas.toDataURL("image/png");
  a.download = `${annotateFilenameBase}.png`;
  a.click();
  annotateModal.classList.remove("show");
  flash("✓ Saved screenshot");
});

function syncB() {
  if (compareMode && videoBLoaded && syncLocked && Math.abs(videoB.currentTime - video.currentTime) > 0.03) {
    videoB.currentTime = video.currentTime;
  }
}

function setSyncLocked(locked) {
  syncLocked = locked;
  syncBtn.classList.toggle("active", locked);
  syncBtn.textContent = locked ? "🔗 Synced" : "🔓 Independent";
  if (locked) syncB();
}

async function loadVideoB(url, displayName) {
  if (!url) return;
  const thisLoadId = ++loadIdB;

  if (currentObjectUrlB && currentObjectUrlB !== url) URL.revokeObjectURL(currentObjectUrlB);
  currentObjectUrlB = url;
  videoB.src = url;
  videoB.muted = true;
  videoB.load();
  videoBLoaded = true;
  emptyStateB.style.display = "none";
  paneLabelB.textContent = displayName || "Video B";
  paneLabelB.style.display = "block";
  paneBBar.classList.add("show");
  setSyncLocked(true);

  videoB.onloadedmetadata = async () => {
    if (thisLoadId !== loadIdB) return;
    timelineB.max = videoB.duration || 0;
    const detected = await detectFps(videoB, thisLoadId, "B");
    if (thisLoadId !== loadIdB) return;
    fpsB = detected || 25;
    syncB();
    refreshUIB();
    if (!video.paused) videoB.play().catch(() => {});
  };
}

// --- Local file loading ---------------------------------------------------
function triggerFilePicker(target) {
  pendingFileTarget = target;
  fileInput.click();
}
fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  fileInput.value = "";
  if (!file) return;
  const url = URL.createObjectURL(file);
  if (pendingFileTarget === "B") { loadVideoB(url, file.name); }
  else { loadVideo(url, file.name); }
});

// --- Drive streaming (fetched into memory, never written to disk) --------
function extractGoogleId(url) {
  const str = String(url);
  let m = str.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (m) return m[1];
  m = str.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  return m ? m[1] : null;
}

function extractFolderId(url) {
  const str = String(url).trim();
  let m = str.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (m) return m[1];
  m = str.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (m && (str.includes("folderview") || str.includes("folder") || str.includes("open"))) return m[1];
  return null;
}

function extractResourceKey(url) {
  const m = String(url).match(/[?&]resourcekey=([a-zA-Z0-9_-]+)/);
  return m ? m[1] : null;
}

// Google's large-file warning page is an HTML form with several hidden
// fields (id, export, confirm, uuid, and others that vary over time). Only
// grabbing "confirm" and hand-reconstructing the rest breaks the moment
// Google's form has a field this code doesn't know about — which is exactly
// what caused the 400s on large files. This instead reads every field the
// form actually has and forwards all of them, so it isn't guessing.
function extractConfirmDownloadUrl(html, fileId) {
  const formMatch = html.match(/<form[^>]*action=["']([^"']*(?:drive\.usercontent\.google\.com|drive\.google\.com)\/download[^"']*)["'][^>]*>([\s\S]*?)<\/form>/i);

  if (formMatch) {
    const action = formMatch[1].replace(/&amp;/g, "&");
    const formBody = formMatch[2];
    const actionUrl = new URL(action, "https://drive.google.com/");

    const inputTags = formBody.match(/<input[^>]*>/gi) || [];
    for (const tag of inputTags) {
      const nameMatch = tag.match(/name=["']([^"']+)["']/);
      if (!nameMatch) continue;
      const valueMatch = tag.match(/value=["']([^"']*)["']/);
      const value = valueMatch
        ? valueMatch[1].replace(/&amp;/g, "&").replace(/&quot;/g, "\"").replace(/&#39;/g, "'")
        : "";
      actionUrl.searchParams.set(nameMatch[1], value);
    }
    if (!actionUrl.searchParams.has("id")) actionUrl.searchParams.set("id", fileId);
    return actionUrl.toString();
  }

  // Fallback for an older page shape: a bare confirm=TOKEN link, no form.
  const confirmMatch = html.match(/confirm=([0-9A-Za-z_-]+)/);
  if (confirmMatch) {
    return `https://drive.google.com/uc?export=download&confirm=${confirmMatch[1]}&id=${fileId}`;
  }
  return null;
}

// The actual download engine: follows Drive's redirect/confirmation chain
// (using whatever Google login this browser already has, via
// credentials:"include") until it reaches the real video bytes, then
// streams them into an in-memory Blob — nothing is ever written to disk.
// Throws "SIGNIN_REQUIRED" if the chain lands on Google's own sign-in page.

// Google's embeddedfolderview page is an older, simply-rendered listing
// (unlike the modern Drive folder UI, which is a JS app and wouldn't be
// readable via a plain fetch). It's a documented, Google-provided embed
// endpoint, not a scrape of the real Drive interface — but I still can't
// verify its exact current HTML from this sandbox, so this reads names off
// plain <a> tags with reasonably loose matching, and logs the raw response
// if nothing video-like turns up.
async function fetchFolderFiles(folderId, resourceKey = null) {
  const isExtension = location.protocol.startsWith("chrome-extension") || location.protocol.startsWith("moz-extension") || location.protocol === "file:";
  const isWebDeployment = location.protocol.startsWith("http");
  const queryParams = `id=${folderId}${resourceKey ? `&resourcekey=${resourceKey}` : ""}`;
  const rawTarget = `https://drive.google.com/embeddedfolderview?${queryParams}#list`;

  const endpoints = [rawTarget];
  if (isWebDeployment && !isExtension) {
    endpoints.push(`/api/folder?${queryParams}`);
    endpoints.push(`${location.origin}/drive-proxy/embeddedfolderview?${queryParams}#list`);
    endpoints.push(`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(rawTarget)}`);
    endpoints.push(`https://api.allorigins.win/raw?url=${encodeURIComponent(rawTarget)}`);
    endpoints.push(`https://corsproxy.io/?${encodeURIComponent(rawTarget)}`);
  }

  let html = "";
  let lastError = null;

  for (const url of endpoints) {
    try {
      const isExternalProxy = url.startsWith("http") && !url.startsWith(location.origin);
      const options = isExternalProxy ? {} : { credentials: isExtension ? "include" : "omit" };

      const res = await fetch(url, options);
      if (/accounts\.google\.com/i.test(res.url)) throw new Error("SIGNIN_REQUIRED");
      if (res.ok) {
        const text = await res.text();
        if (text && (text.includes("<title>") || text.includes("/file/d/") || text.includes("/folders/"))) {
          html = text;
          break;
        }
      } else {
        lastError = new Error(`Drive returned ${res.status}`);
      }
    } catch (err) {
      if (err.message === "SIGNIN_REQUIRED") throw err;
      lastError = err;
    }
  }

  if (!html) {
    if (lastError && lastError.message === "SIGNIN_REQUIRED") {
      throw lastError;
    }
    if (isWebDeployment && !isExtension) {
      throw new Error("Browser CORS blocked direct Drive folder reading on web page. Please use QC Player as a Chrome Extension for 100% native folder access!");
    }
    throw new Error("Unable to fetch folder. Make sure link is set to 'Anyone with the link' in Google Drive.");
  }

  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  const folderName = titleMatch ? titleMatch[1].replace(/&amp;/g, "&").trim() : "Folder";

  const files = [];
  const seen = new Set();
  
  // Extract subfolders
  const folderAnchorRe = /<a[^>]*href="[^"]*\/folders\/([a-zA-Z0-9_-]+)[^"]*"[^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = folderAnchorRe.exec(html))) {
    const id = m[1];
    const name = m[2].replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&quot;/g, "\"").replace(/&#39;/g, "'").trim();
    if (name && !seen.has(id)) { seen.add(id); files.push({ id, name, isFolder: true }); }
  }

  // Extract files
  const fileAnchorRe = /<a[^>]*href="[^"]*\/file\/d\/([a-zA-Z0-9_-]+)[^"]*"[^>]*>([\s\S]*?)<\/a>/gi;
  while ((m = fileAnchorRe.exec(html))) {
    const id = m[1];
    const name = m[2].replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&quot;/g, "\"").replace(/&#39;/g, "'").trim();
    if (name && !seen.has(id)) { seen.add(id); files.push({ id, name, isFolder: false }); }
  }

  const isMediaFile = (name) => /\.(mp4|mov|m4v|mkv|webm|avi|mp3|aac|wav|flac|ogg|m4a|jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(name);
  const playableFiles = files.filter(f => f.isFolder || isMediaFile(f.name));

  if (!playableFiles.length) {
    console.error("QC Player: folder listing found no playable media files or subfolders", html.slice(0, 2000));
  }
  return { folderName, files: playableFiles };
}

// The actual fetch-and-load for one file, shared by the single-link watch
// flow and the folder playlist so both go through the identical, proven path.
// Preloads the next video in a folder in the background, once the current
// one is actually playing (not while it's still loading, so the two fetches
// don't compete for bandwidth). When playback reaches the next index, the
// already-fetched blob is used instantly — no fetch, no loading screen.
// Costs extra memory while a preload is held (current + next both in RAM),
// same tradeoff as everything else about the in-memory streaming approach.
// Downloads the actual video bytes into an in-memory Blob (never written to
// disk) with progress reporting. This is the proven-working path — direct
// URL streaming was tried and failed twice against real Drive data in ways
// I can't reproduce or debug from this sandbox, so reliability wins over
// the (real, but no longer worth the risk) benefit of instant playback.
async function resolveAndFetchDriveVideo(fileId, onProgress, signal) {
  const isExtension = location.protocol.startsWith("chrome-extension") || location.protocol.startsWith("moz-extension") || location.protocol === "file:";
  const isWebDeployment = location.protocol.startsWith("http");
  let url = (isWebDeployment && !isExtension)
    ? `${location.origin}/drive-proxy/uc?export=download&id=${fileId}`
    : `https://drive.google.com/uc?export=download&id=${fileId}`;
  let hops = 0;

  while (hops < 6) {
    if (signal && signal.aborted) throw new DOMException("Aborted", "AbortError");

    let res;
    try {
      res = await fetch(url, { credentials: isWebDeployment ? "omit" : "include", priority: "high", signal });
    } catch (fetchErr) {
      if (fetchErr.name === "AbortError") throw fetchErr;
      const rawDriveUrl = url.replace(`${location.origin}/drive-proxy/`, "https://drive.google.com/");
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(rawDriveUrl)}`;
      res = await fetch(proxyUrl, { signal });
    }

    if (/accounts\.google\.com|\/signin\//i.test(res.url)) {
      throw new Error("SIGNIN_REQUIRED");
    }

    if (!res.ok) {
      const bodySnippet = await res.text().catch(() => "");
      console.error("QC Player: Drive request failed", res.status, url, bodySnippet.slice(0, 500));
      const reason = res.status === 400
        ? "Drive rejected the request (400) — its confirmation page may have changed format."
        : "the file may be private, deleted, or the link is wrong.";
      throw new Error(`Drive returned ${res.status} — ${reason}`);
    }

    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("text/html")) {
      const html = await res.text();
      const confirmUrl = extractConfirmDownloadUrl(html, fileId);
      if (!confirmUrl) {
        throw new Error("Drive returned a webpage instead of the video. Either this file isn't shared as \"Anyone with the link,\" or Drive's confirmation page changed format.");
      }
      url = confirmUrl;
      hops++;
      continue;
    }

    const totalBytes = Number(res.headers.get("content-length")) || 0;
    const reader = res.body.getReader();
    const chunks = [];
    let received = 0;
    let lastEmit = 0;

    try {
      while (true) {
        if (signal && signal.aborted) {
          reader.cancel().catch(() => {});
          throw new DOMException("Aborted", "AbortError");
        }
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        received += value.length;
        const now = Date.now();
        if (totalBytes && now - lastEmit > 150) {
          onProgress(received / totalBytes);
          lastEmit = now;
        }
      }
      onProgress(1);
      return new Blob(chunks, { type: contentType || "video/mp4" });
    } catch (err) {
      chunks.length = 0;
      throw err;
    }
  }

  throw new Error("Too many redirects trying to reach the actual file.");
}

// --- IndexedDB Cache Storage Engine ----------------------------------------
const DB_NAME = "QCPlayerCacheDB";
const DB_VERSION = 1;
const STORE_NAME = "video_blobs";

let dbPromise = null;
let cacheProgressMap = {}; // fileId -> number (0..1)
let activeQueueController = null;
let isQueueRunning = false;
const activeDownloadPromises = new Map(); // fileId -> { promise, listeners }

function fetchDriveMediaBlob(fileId, onProgress, signal) {
  if (activeDownloadPromises.has(fileId)) {
    const existing = activeDownloadPromises.get(fileId);
    if (onProgress) {
      existing.listeners.add(onProgress);
      const currentProg = cacheProgressMap[fileId] || 0;
      if (currentProg > 0) {
        try { onProgress(currentProg); } catch {}
      }
    }
    return existing.promise.finally(() => {
      if (onProgress) existing.listeners.delete(onProgress);
    });
  }

  const listeners = new Set();
  if (onProgress) listeners.add(onProgress);

  const combinedOnProgress = (pct) => {
    cacheProgressMap[fileId] = pct;
    for (const listener of listeners) {
      try { listener(pct); } catch {}
    }
  };

  const promise = resolveAndFetchDriveVideo(fileId, combinedOnProgress, signal)
    .finally(() => {
      activeDownloadPromises.delete(fileId);
    });

  activeDownloadPromises.set(fileId, {
    promise,
    listeners
  });

  return promise;
}

function getDB() {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "fileId" });
        }
      };
      request.onsuccess = (e) => resolve(e.target.result);
      request.onerror = (e) => reject(e.target.error);
    });
  }
  return dbPromise;
}

async function getCachedBlob(fileId) {
  try {
    const db = await getDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(fileId);
      req.onsuccess = () => resolve(req.result ? req.result.blob : null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

async function saveCachedBlob(fileId, blob, name) {
  try {
    const db = await getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.put({ fileId, blob, name, size: blob.size, timestamp: Date.now() });
      req.onsuccess = () => resolve(true);
      req.onerror = (e) => reject(e.target.error);
    });
  } catch (err) {
    console.warn("QC Player: failed to save to IndexedDB cache", err);
    return false;
  }
}

async function clearVideoCache() {
  cacheProgressMap = {};
  activeDownloadPromises.clear();
  if (activeQueueController) {
    activeQueueController.abort();
    activeQueueController = null;
  }
  isQueueRunning = false;
  try {
    const db = await getDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).clear();
  } catch {}
}

function updateTrayItemBadge(fileId) {
  const item = trayFileList.querySelector(`[data-file-id="${CSS.escape(fileId)}"]`);
  if (!item) return;
  let badgeEl = item.querySelector(".trayFileBadge");
  const prog = cacheProgressMap[fileId];

  if (prog === undefined) return;

  if (!badgeEl) {
    badgeEl = document.createElement("span");
    badgeEl.className = "trayFileBadge";
    const indexEl = item.querySelector(".fileIndex");
    item.insertBefore(badgeEl, indexEl);
  }

  if (prog >= 1) {
    badgeEl.className = "trayFileBadge badge-ready";
    badgeEl.textContent = "🟢 Ready";
  } else if (prog > 0 && prog < 1) {
    badgeEl.className = "trayFileBadge badge-downloading";
    badgeEl.textContent = `⚡ ${Math.round(prog * 100)}%`;
  } else {
    badgeEl.className = "trayFileBadge badge-cloud";
    badgeEl.textContent = "☁️";
  }
}

async function startFolderQueueCaching() {
  if (!folderFiles.length) return;
  if (activeQueueController) {
    activeQueueController.abort();
    activeQueueController = null;
  }

  const controller = new AbortController();
  activeQueueController = controller;
  isQueueRunning = true;

  for (const f of folderFiles) {
    if (f.isFolder) continue;
    if (cacheProgressMap[f.id] === undefined) {
      const cached = await getCachedBlob(f.id);
      if (cached) cacheProgressMap[f.id] = 1;
    }
  }
  renderFolderList();

  const startIndex = folderIndex >= 0 ? folderIndex : 0;
  const order = [];
  for (let i = startIndex; i < folderFiles.length; i++) order.push(i);
  for (let i = 0; i < startIndex; i++) order.push(i);

  for (const idx of order) {
    if (controller.signal.aborted) break;
    const file = folderFiles[idx];
    if (file.isFolder) continue;

    if (cacheProgressMap[file.id] === 1) continue;

    try {
      cacheProgressMap[file.id] = Math.max(0.01, cacheProgressMap[file.id] || 0);
      updateTrayItemBadge(file.id);

      const blob = await fetchDriveMediaBlob(file.id, (progress) => {
        cacheProgressMap[file.id] = Math.max(0.01, progress);
        updateTrayItemBadge(file.id);
      }, controller.signal);

      await saveCachedBlob(file.id, blob, file.name);
      cacheProgressMap[file.id] = 1;
      updateTrayItemBadge(file.id);
    } catch (err) {
      if (controller.signal.aborted) break;
      console.warn(`QC Player: background caching failed for ${file.name}`, err);
    }
  }

  isQueueRunning = false;
  if (activeQueueController === controller) activeQueueController = null;
}

async function loadDriveFileById(fileId, displayName, target) {
  if (activeAbortControllers[target]) {
    activeAbortControllers[target].abort();
  }
  const controller = new AbortController();
  activeAbortControllers[target] = controller;

  stopCurrentMedia(target);

  const t = driveTargets[target];
  t.empty.style.display = "none";
  t.label.textContent = `Loading ${displayName}…`;
  const initialProg = Math.round((cacheProgressMap[fileId] || 0) * 100);
  t.fill.style.width = `${initialProg}%`;
  t.percent.textContent = `${initialProg}%`;
  t.loading.classList.add("show");

  // 1. Check IndexedDB cache first for 0ms instant load!
  const cachedBlob = await getCachedBlob(fileId);
  if (cachedBlob && activeAbortControllers[target] === controller) {
    if (activeAbortControllers[target] === controller) {
      activeAbortControllers[target] = null;
    }
    t.loading.classList.remove("show");
    t.load(URL.createObjectURL(cachedBlob), displayName);
    cacheProgressMap[fileId] = 1;
    updateTrayItemBadge(fileId);
    if (target === "A" && folderFiles.length) startFolderQueueCaching();
    return true;
  }

  // 2. Not cached -> Attach to active download or fetch over network!
  try {
    const blob = await fetchDriveMediaBlob(fileId, (progress) => {
      const pct = Math.round(progress * 100);
      t.fill.style.width = `${pct}%`;
      t.percent.textContent = `${pct}%`;
      cacheProgressMap[fileId] = progress;
      updateTrayItemBadge(fileId);
    }, controller.signal);

    if (activeAbortControllers[target] === controller) {
      activeAbortControllers[target] = null;
    }

    saveCachedBlob(fileId, blob, displayName).catch(() => {});
    cacheProgressMap[fileId] = 1;
    updateTrayItemBadge(fileId);

    t.loading.classList.remove("show");
    t.load(URL.createObjectURL(blob), displayName);
    if (target === "A" && folderFiles.length) startFolderQueueCaching();
    return true;
  } catch (err) {
    if (err.name === "AbortError") {
      return false;
    }
    if (activeAbortControllers[target] === controller) {
      activeAbortControllers[target] = null;
    }
    t.loading.classList.remove("show");
    if (folderFiles.length) dropZone.classList.add("tray-open");
    else t.empty.style.display = "flex";
    if (err.message === "SIGNIN_REQUIRED") {
      flash("✕ Sign in to your Google account in this browser tab, then try again");
    } else {
      flash(`✕ ${err.message}`);
    }
    return false;
  }
}

function fileTypeIcon(name, isFolder) {
  if (isFolder) return "📁";
  const ext = (name.split(".").pop() || "").toLowerCase();
  if (["mp4","mov","m4v","mkv","webm","avi"].includes(ext)) return "🎬";
  if (["mp3","aac","wav","flac","ogg","m4a"].includes(ext)) return "🎵";
  if (["jpg","jpeg","png","gif","webp","bmp","svg"].includes(ext)) return "🖼";
  if (["pdf"].includes(ext)) return "📄";
  return "📄";
}

function renderFolderList() {
  trayFileList.innerHTML = "";
  folderFiles.forEach((f, i) => {
    const item = document.createElement("button");
    item.className = "trayFileItem" + (i === folderIndex ? " playing" : "") + (f.isFolder ? " folderItem" : "");
    item.dataset.fileId = f.id;

    let badgeHtml = "";
    if (!f.isFolder) {
      const prog = cacheProgressMap[f.id];
      if (prog >= 1) {
        badgeHtml = `<span class="trayFileBadge badge-ready">🟢 Ready</span>`;
      } else if (prog > 0 && prog < 1) {
        badgeHtml = `<span class="trayFileBadge badge-downloading">⚡ ${Math.round(prog * 100)}%</span>`;
      } else {
        badgeHtml = `<span class="trayFileBadge badge-cloud">☁️</span>`;
      }
    }

    item.innerHTML = `<span class="fileTypeIcon">${fileTypeIcon(f.name, f.isFolder)}</span><span class="fileName">${f.name}</span>${badgeHtml}<span class="fileIndex">${f.isFolder ? "" : (i + 1)}</span>`;
    item.addEventListener("click", () => playFolderIndex(i));
    trayFileList.appendChild(item);
  });
  if (folderFiles.length) dropZone.classList.add("tray-open");
}

function updatePlaylistNav() {
  const active = folderFiles.length > 0;
  playlistRow.classList.toggle("show", active);
  if (!active) return;
  playlistPosition.textContent = `File ${folderIndex + 1} of ${folderFiles.length}`;
  prevVideoBtn.disabled = folderIndex <= 0;
  nextVideoBtn.disabled = folderIndex >= folderFiles.length - 1;
}

async function playFolderIndex(i) {
  if (i < 0 || i >= folderFiles.length) return;
  const item = folderFiles[i];

  if (item.isFolder) {
    if (activeQueueController) { activeQueueController.abort(); activeQueueController = null; }
    startDriveWatchByFolderId(item.id, true);
    return;
  }

  folderIndex = i;
  updatePlaylistNav();
  renderFolderList();

  const success = await loadDriveFileById(item.id, item.name, "A");
  if (success) {
    video.play().catch(() => {});
  }
}

function updateTrayBackBtn() {
  if (!trayBackBtn) return;
  if (folderHistory.length > 0) {
    const parent = folderHistory[folderHistory.length - 1];
    trayBackBtn.style.display = "inline-flex";
    trayBackBtn.title = `Back to ${parent.folderName}`;
  } else {
    trayBackBtn.style.display = "none";
  }
}

if (trayBackBtn) {
  trayBackBtn.addEventListener("click", () => {
    if (!folderHistory.length) return;
    const parent = folderHistory.pop();
    startDriveWatchByFolderId(parent.folderId, false);
  });
}

async function startDriveWatchByFolderId(folderId, isSubfolderNav = false) {
  if (activeQueueController) { activeQueueController.abort(); activeQueueController = null; }
  if (isSubfolderNav && currentFolderId) {
    folderHistory.push({ folderId: currentFolderId, folderName: trayFolderName.textContent });
  }
  currentFolderId = folderId;
  updateTrayBackBtn();

  const t = driveTargets.A;
  t.empty.style.display = "none";
  t.label.textContent = "Reading folder…";
  t.fill.style.width = "0%";
  t.percent.textContent = "0%";
  t.loading.classList.add("show");
  try {
    const { folderName, files } = await fetchFolderFiles(folderId);
    t.loading.classList.remove("show");
    if (!files.length) {
      flash("✕ No playable media or folders found in that directory");
      return;
    }
    folderFiles = files;
    trayFolderName.textContent = folderName;
    updatePlaylistNav();
    dropZone.classList.add("tray-open");

    const firstMediaIndex = folderFiles.findIndex(f => !f.isFolder);
    if (firstMediaIndex !== -1) {
      playFolderIndex(firstMediaIndex);
    } else {
      renderFolderList();
    }
  } catch (err) {
    t.loading.classList.remove("show");
    if (err.message === "SIGNIN_REQUIRED") {
      flash("✕ Sign in to your Google account in this browser tab, then try again");
    } else {
      flash(`✕ ${err.message}`);
    }
  }
}

prevVideoBtn.addEventListener("click", () => playFolderIndex(folderIndex - 1));
nextVideoBtn.addEventListener("click", () => playFolderIndex(folderIndex + 1));

trayToggleBtn.addEventListener("click", () => dropZone.classList.toggle("tray-open"));

trayGridBtn.addEventListener("click", () => {
  trayFileList.classList.add("grid");
  trayGridBtn.classList.add("active");
  trayListBtn.classList.remove("active");
});
trayListBtn.addEventListener("click", () => {
  trayFileList.classList.remove("grid");
  trayListBtn.classList.add("active");
  trayGridBtn.classList.remove("active");
});

startFreshBtn.addEventListener("click", () => {
  clearVideoCache();
  if (activeAbortControllers.A) { activeAbortControllers.A.abort(); activeAbortControllers.A = null; }
  if (activeAbortControllers.B) { activeAbortControllers.B.abort(); activeAbortControllers.B = null; }
  if (currentObjectUrlA) { URL.revokeObjectURL(currentObjectUrlA); currentObjectUrlA = null; }
  if (currentObjectUrlB) { URL.revokeObjectURL(currentObjectUrlB); currentObjectUrlB = null; }
  folderFiles = [];
  folderIndex = -1;
  folderHistory = [];
  currentFolderId = null;
  updateTrayBackBtn();
  video.src = "";
  video.load();
  videoB.src = "";
  videoB.load();
  trayFileList.innerHTML = "";
  trayFolderName.textContent = "Files";
  dropZone.classList.remove("tray-open", "compare", "script-mode", "guides-on", "ruler-on");
  [compareBtn, scriptBtn, guidesBtn, rulerBtn].forEach(b => b.classList.remove("active"));
  emptyState.style.display = "";
  emptyStateB.style.display = "";
  updatePlaylistNav();
  flash("✓ Fresh start (cache cleared)");
});

const driveTargets = {
  A: { urlInput: driveUrlA, empty: emptyState, loading: loadingA, label: loadingLabelA, fill: progressFillA, percent: loadingPercentA, load: loadVideo },
  B: { urlInput: driveUrlB, empty: emptyStateB, loading: loadingB, label: loadingLabelB, fill: progressFillB, percent: loadingPercentB, load: loadVideoB }
};

async function startDriveWatch(target) {
  if (activeQueueController) { activeQueueController.abort(); activeQueueController = null; }
  const t = driveTargets[target];
  const url = t.urlInput.value.trim();
  if (!url) return;
  t.urlInput.blur();

  const folderId = extractFolderId(url);
  const resourceKey = extractResourceKey(url);
  if (folderId) {
    if (target !== "A") { flash("✕ Folders are only supported for the main video for now"); return; }
    t.empty.style.display = "none";
    t.label.textContent = "Reading folder…";
    t.fill.style.width = "0%";
    t.percent.textContent = "0%";
    t.loading.classList.add("show");
    try {
      const { folderName, files } = await fetchFolderFiles(folderId, resourceKey);
      t.loading.classList.remove("show");
      if (!files.length) {
        t.empty.style.display = "flex";
        flash("✕ No video files found in that folder");
        return;
      }
      folderFiles = files;
      folderIndex = -1;
      folderHistory = [];
      currentFolderId = folderId;
      updateTrayBackBtn();
      trayFolderName.textContent = folderName;
      renderFolderList();
      updatePlaylistNav();
      dropZone.classList.add("tray-open");

      const firstMediaIndex = folderFiles.findIndex(f => !f.isFolder);
      if (firstMediaIndex !== -1) {
        playFolderIndex(firstMediaIndex);
      }
      return;
    } catch (err) {
      t.loading.classList.remove("show");
      t.empty.style.display = "flex";
      if (err.message === "SIGNIN_REQUIRED") {
        flash("✕ Sign in to your Google account in this browser tab, then try again");
      } else {
        flash(`✕ ${err.message}`);
      }
      return;
    }
  }

  const fileId = extractGoogleId(url);
  if (!fileId) { flash("✕ Couldn't find a file ID in that link"); return; }
  folderFiles = [];
  folderIndex = -1;
  updatePlaylistNav();
  await loadDriveFileById(fileId, `drive-video-${fileId}.mp4`, target);
}

function setCompareMode(on) {
  compareMode = on;
  if (on && scriptMode) setScriptMode(false);
  dropZone.classList.toggle("compare", compareMode);
  compareBtn.classList.toggle("active", compareMode);
  if (compareMode) {
    syncB();
    if (videoBLoaded && !video.paused) videoB.play();
  } else {
    videoB.pause();
  }
  updateGuideRect();
}

function toggleSwapSides() {
  const on = dropZone.classList.toggle("swapped");
  swapSidesBtn.classList.toggle("active", on);
}

let lastScriptDocUrl = null;
let scriptEditMode = false;

// The /preview embed is the one Google explicitly supports for third-party
// iframes and is guaranteed to work. /edit is the real editor — it would
// show comments and allow editing if it loads, but Google may not permit a
// full editor session to be framed by an outside origin at all. That's not
// something verifiable without a live Google Doc in a real browser, so this
// is offered as a try-it toggle rather than a guaranteed feature.
function toGoogleDocEmbedUrl(url, mode) {
  const m = String(url).match(/\/document\/d\/([a-zA-Z0-9_-]+)/) || String(url).match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (!m) return null;
  return `https://docs.google.com/document/d/${m[1]}/${mode}`;
}

function loadScriptDoc(rawUrl) {
  const embedUrl = toGoogleDocEmbedUrl(rawUrl, scriptEditMode ? "edit" : "preview");
  if (!embedUrl) {
    flash("✕ No doc ID found — paste the full link from Share → Copy link");
    return;
  }
  lastScriptDocUrl = rawUrl;
  scriptFrame.src = embedUrl;
  scriptDocUrl.blur();
}

function toggleScriptEditMode() {
  scriptEditMode = !scriptEditMode;
  scriptEditModeBtn.classList.toggle("active", scriptEditMode);
  scriptEditModeBtn.textContent = scriptEditMode ? "👁 View Mode" : "✎ Edit Mode";
  if (lastScriptDocUrl) {
    flash(scriptEditMode ? "Trying edit mode — may not be allowed to embed" : "Back to view mode");
    loadScriptDoc(lastScriptDocUrl);
  }
}

function setScriptMode(on) {
  scriptMode = on;
  if (on && compareMode) setCompareMode(false);
  dropZone.classList.toggle("script-mode", scriptMode);
  scriptBtn.classList.toggle("active", scriptMode);
  updateGuideRect();
}

function toggleGuides() {
  const on = dropZone.classList.toggle("guides-on");
  guidesBtn.classList.toggle("active", on);
  if (on) updateGuideRect();
}

function toggleRuler() {
  const on = dropZone.classList.toggle("ruler-on");
  rulerBtn.classList.toggle("active", on);
  if (on) updateGuideRect();
}

function addRulerLine(orientation, pct) {
  const line = document.createElement("div");
  line.className = `rulerLine ${orientation}`;

  const tooltip = document.createElement("span");
  tooltip.className = "rulerTooltip";
  line.appendChild(tooltip);

  function setPos(p) {
    const clamped = Math.max(0, Math.min(100, p));
    if (orientation === "h") {
      line.style.top = `${clamped}%`;
      tooltip.textContent = `Y: ${clamped.toFixed(1)}%`;
    } else {
      line.style.left = `${clamped}%`;
      tooltip.textContent = `X: ${clamped.toFixed(1)}%`;
    }
  }
  setPos(pct);

  let dragging = false;

  line.addEventListener("pointerdown", (e) => {
    e.stopPropagation();
    dragging = true;
    line.classList.add("dragging");
    line.setPointerCapture(e.pointerId);
  });

  line.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const rect = rulerLines.getBoundingClientRect();
    let newPct;
    if (orientation === "h") {
      newPct = ((e.clientY - rect.top) / rect.height) * 100;
    } else {
      newPct = ((e.clientX - rect.left) / rect.width) * 100;
    }
    setPos(newPct);
  });

  const endDrag = (e) => {
    if (!dragging) return;
    dragging = false;
    line.classList.remove("dragging");
    try { line.releasePointerCapture(e.pointerId); } catch {}
  };

  line.addEventListener("pointerup", endDrag);
  line.addEventListener("pointercancel", endDrag);

  line.addEventListener("dblclick", (e) => {
    e.stopPropagation();
    line.remove();
  });

  rulerLines.appendChild(line);
}
rulerTop.addEventListener("click", (e) => {
  const rect = rulerLines.getBoundingClientRect();
  addRulerLine("v", ((e.clientX - rect.left) / rect.width) * 100);
});
rulerLeft.addEventListener("click", (e) => {
  const rect = rulerLines.getBoundingClientRect();
  addRulerLine("h", ((e.clientY - rect.top) / rect.height) * 100);
});
clearRulerBtn.addEventListener("click", () => {
  rulerLines.querySelectorAll(".rulerLine").forEach(el => el.remove());
});

// Safe-area guides and the ruler's guide lines are both sized to the actual
// rendered video rect (object-fit:contain can letterbox or pillarbox) within
// videoStage — not the pane, and not the ruler strips, which live outside
// the video entirely so they never cover any of the picture.
function updateGuideRect() {
  const isImg = stageImg && stageImg.style.display !== "none" && stageImg.naturalWidth > 0;
  const isVideo = video && video.style.display !== "none" && video.videoWidth > 0 && video.hasAttribute("src");

  if (emptyState.style.display !== "none" || (!isImg && !isVideo)) {
    guidesA.style.display = "none";
    return;
  }

  const contentWidth = isImg ? stageImg.naturalWidth : video.videoWidth;
  const contentHeight = isImg ? stageImg.naturalHeight : video.videoHeight;

  if (!contentWidth || !contentHeight) {
    guidesA.style.display = "none";
    return;
  }
  guidesA.style.display = dropZone.classList.contains("guides-on") ? "" : "none";
  const stageRect = videoStage.getBoundingClientRect();
  const contentAspect = contentWidth / contentHeight;
  const stageAspect = stageRect.width / stageRect.height;
  let w, h, left, top;
  if (contentAspect > stageAspect) {
    w = stageRect.width; h = w / contentAspect; left = 0; top = (stageRect.height - h) / 2;
  } else {
    h = stageRect.height; w = h * contentAspect; top = 0; left = (stageRect.width - w) / 2;
  }
  guidesA.style.left = `${left}px`; guidesA.style.top = `${top}px`;
  guidesA.style.width = `${w}px`; guidesA.style.height = `${h}px`;
  rulerLines.style.left = `${left}px`; rulerLines.style.top = `${top}px`;
  rulerLines.style.width = `${w}px`; rulerLines.style.height = `${h}px`;
}

function togglePlay() {
  if (video.paused) video.play();
  else video.pause();
}

const prefilledDriveUrl = new URLSearchParams(window.location.search).get("driveUrl");
if (prefilledDriveUrl) driveUrlA.value = prefilledDriveUrl;

compareBtn.addEventListener("click", () => setCompareMode(!compareMode));
scriptBtn.addEventListener("click", () => setScriptMode(!scriptMode));
swapSidesBtn.addEventListener("click", toggleSwapSides);
scriptEditModeBtn.addEventListener("click", toggleScriptEditMode);
shortcutsBtn.addEventListener("click", () => shortcutsModal.classList.add("show"));
shortcutsCloseBtn.addEventListener("click", () => shortcutsModal.classList.remove("show"));
scriptDocUrl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") { e.preventDefault(); loadScriptDoc(scriptDocUrl.value); }
});
guidesBtn.addEventListener("click", toggleGuides);
rulerBtn.addEventListener("click", toggleRuler);

speedSelect.addEventListener("change", () => { video.playbackRate = Number(speedSelect.value); });

openBtn.addEventListener("click", () => triggerFilePicker("A"));
openEmpty.addEventListener("click", () => triggerFilePicker("A"));
openB.addEventListener("click", () => triggerFilePicker("B"));
paneLabelB.addEventListener("click", () => triggerFilePicker("B"));

driveGoA.addEventListener("click", () => startDriveWatch("A"));

if (changeLinkBtn) {
  changeLinkBtn.addEventListener("click", () => {
    changeLinkPopover.classList.toggle("show");
    if (changeLinkPopover.classList.contains("show")) changeLinkInput.focus();
  });
}
changeLinkCloseBtn.addEventListener("click", () => changeLinkPopover.classList.remove("show"));
function submitChangeLink() {
  const url = changeLinkInput.value.trim();
  if (!url) return;
  changeLinkPopover.classList.remove("show");
  changeLinkInput.value = "";
  driveUrlA.value = url;
  startDriveWatch("A");
}
changeLinkGoBtn.addEventListener("click", submitChangeLink);
changeLinkInput.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); submitChangeLink(); } });
driveUrlA.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); startDriveWatch("A"); } });
driveGoB.addEventListener("click", () => startDriveWatch("B"));
driveUrlB.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); startDriveWatch("B"); } });

syncBtn.addEventListener("click", () => setSyncLocked(!syncLocked));
timelineB.addEventListener("input", () => {
  setSyncLocked(false);
  videoB.currentTime = Number(timelineB.value);
  refreshUIB();
});

wireGotoInput(gotoInput);
wireGotoInput(fsGotoInput);
gotoBtn.addEventListener("click", () => seekToTimecode(gotoInput.value));

playBtn.addEventListener("click", togglePlay);
fsPlayBtn.addEventListener("click", togglePlay);

fsBtn.addEventListener("click", toggleFullscreen);
fsExitBtn.addEventListener("click", () => document.exitFullscreen?.());
fsPrevFrame.addEventListener("click", () => stepFrame(-1));
fsNextFrame.addEventListener("click", () => stepFrame(1));
fsCopyBtn.addEventListener("click", copyTimestamp);

muteBtn.addEventListener("click", () => {
  userMuted = !video.muted;
  video.muted = userMuted;
  updateMuteIcon();
});
volumeSlider.addEventListener("input", () => {
  video.volume = Number(volumeSlider.value);
  userMuted = false;
  video.muted = false;
  updateMuteIcon();
});

function setLoopIn() {
  loopIn = video.currentTime || 0;
  loopLabel.textContent = `IN ${formatTimecode(loopIn)}  OUT ${loopOut != null ? formatTimecode(loopOut) : "—"}`;
}
function setLoopOut() {
  loopOut = video.currentTime || 0;
  loopLabel.textContent = `IN ${loopIn != null ? formatTimecode(loopIn) : "—"}  OUT ${formatTimecode(loopOut)}`;
}
function toggleLoopActive() {
  loopActive = !loopActive;
  loopBtn.classList.toggle("active", loopActive);
  fsLoopBtn.classList.toggle("active", loopActive);
}
setInBtn.addEventListener("click", setLoopIn);
setOutBtn.addEventListener("click", setLoopOut);
loopBtn.addEventListener("click", toggleLoopActive);
fsSetInBtn.addEventListener("click", setLoopIn);
fsSetOutBtn.addEventListener("click", setLoopOut);
fsLoopBtn.addEventListener("click", toggleLoopActive);

snapBtn.addEventListener("click", takeSnapshot);
video.addEventListener("timeupdate", checkLoop);

video.addEventListener("play", () => { playBtn.textContent = "❚❚"; fsPlayBtn.textContent = "❚❚"; if (compareMode && videoBLoaded) videoB.play(); });
video.addEventListener("pause", () => { playBtn.textContent = "▶"; fsPlayBtn.textContent = "▶"; if (compareMode && videoBLoaded) videoB.pause(); });
video.addEventListener("timeupdate", refreshUI);
video.addEventListener("timeupdate", syncB);
video.addEventListener("ended", () => {
  playBtn.textContent = "▶";
  fsPlayBtn.textContent = "▶";
  if (folderFiles.length && folderIndex < folderFiles.length - 1) {
    playFolderIndex(folderIndex + 1);
  }
});
videoB.addEventListener("timeupdate", refreshUIB);

timeline.addEventListener("input", () => {
  video.currentTime = Number(timeline.value);
  refreshUI();
  syncB();
});

prevFrame.addEventListener("click", () => stepFrame(-1));
nextFrame.addEventListener("click", () => stepFrame(1));
copyBtn.addEventListener("click", copyTimestamp);

document.addEventListener("fullscreenchange", () => {
  updateGuideRect();
  if (document.fullscreenElement) showFsBar();
});
window.addEventListener("resize", updateGuideRect);

let fsBarHideTimer = null;
function showFsBar() {
  fsBar.classList.add("visible");
  clearTimeout(fsBarHideTimer);
  fsBarHideTimer = setTimeout(() => fsBar.classList.remove("visible"), 2500);
}
function toggleFsBarManual() {
  if (!document.fullscreenElement) return;
  clearTimeout(fsBarHideTimer);
  fsBar.classList.toggle("visible");
}
dropZone.addEventListener("mousemove", () => {
  if (document.fullscreenElement) showFsBar();
});
fsBar.addEventListener("mouseenter", () => { clearTimeout(fsBarHideTimer); fsBar.classList.add("visible"); });
fsBar.addEventListener("mouseleave", () => { if (document.fullscreenElement) showFsBar(); });

document.addEventListener("click", (e) => {
  if (changeLinkPopover && changeLinkPopover.classList.contains("show")) {
    if (!changeLinkPopover.contains(e.target) && !changeLinkBtn.contains(e.target)) {
      changeLinkPopover.classList.remove("show");
    }
  }
});

video.addEventListener("error", () => {
  const currentSrc = video.getAttribute("src") || "";
  if (!currentSrc || currentSrc === "" || video.src === window.location.href) return;
  status.textContent = "This video failed to play — it may be an unsupported codec.";
  flash("✕ Video failed to load");
});
videoB.addEventListener("error", () => {
  const currentSrc = videoB.getAttribute("src") || "";
  if (!currentSrc || currentSrc === "" || videoB.src === window.location.href) return;
  flash("✕ Video B failed to load");
});

document.addEventListener("keydown", (e) => {
  if (["INPUT", "SELECT", "TEXTAREA"].includes(e.target.tagName)) return;
  if (annotateModal.classList.contains("show")) {
    if (e.key === "Escape") annotateModal.classList.remove("show");
    return;
  }
  if (shortcutsModal.classList.contains("show")) {
    if (e.key === "Escape") shortcutsModal.classList.remove("show");
    return;
  }
  if (e.ctrlKey || e.metaKey || e.altKey) return;

  if (e.code === "Space") { e.preventDefault(); togglePlay(); }
  else if (e.key === "ArrowLeft") { e.preventDefault(); stepFrame(-1); }
  else if (e.key === "ArrowRight") { e.preventDefault(); stepFrame(1); }
  else if (e.key.toLowerCase() === "c") { e.preventDefault(); copyTimestamp(); }
  else if (e.key.toLowerCase() === "f") { toggleFullscreen(); }
  else if (e.key.toLowerCase() === "i") { setLoopIn(); }
  else if (e.key.toLowerCase() === "o") { setLoopOut(); }
  else if (e.key.toLowerCase() === "l") { toggleLoopActive(); }
  else if (e.key.toLowerCase() === "r") { toggleRuler(); }
  else if (e.key.toLowerCase() === "h") { toggleFsBarManual(); }
  else if (e.key.toLowerCase() === "s") { if (compareMode || scriptMode) toggleSwapSides(); }
  else if (e.key === "Escape") { if (document.fullscreenElement) document.exitFullscreen?.(); }
});

["dragenter", "dragover"].forEach(type => {
  dropZone.addEventListener(type, e => { e.preventDefault(); document.body.classList.add("dragging"); });
});
["dragleave", "drop"].forEach(type => {
  dropZone.addEventListener(type, e => { e.preventDefault(); document.body.classList.remove("dragging"); });
});
dropZone.addEventListener("drop", (e) => {
  const file = e.dataTransfer.files[0];
  if (!file) return;
  loadVideo(URL.createObjectURL(file), file.name);
});

// --- Enterprise Auto-Updater Engine (Direct GitHub Integration) --------------
const GITHUB_REPO = "khbhargav-hue/QC_Player_Online";
const updateSoftwareBtn = document.getElementById("updateSoftwareBtn");

async function checkAndUpdateSoftware(isManual = true) {
  if (updateSoftwareBtn) {
    updateSoftwareBtn.disabled = true;
    updateSoftwareBtn.textContent = "⏳ Checking GitHub…";
  }

  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/commits/main`, { cache: "no-store" });
    if (!res.ok) throw new Error(`GitHub returned status ${res.status}`);
    const data = await res.json();
    const latestSha = data.sha ? data.sha.substring(0, 7) : null;
    const currentSha = localStorage.getItem("qc_player_sha");

    if (currentSha && latestSha && currentSha === latestSha) {
      if (isManual) flash(`✓ Software is up to date! (${latestSha})`);
      if (updateSoftwareBtn) {
        updateSoftwareBtn.disabled = false;
        updateSoftwareBtn.textContent = "✓ Up to Date";
        setTimeout(() => { if (updateSoftwareBtn) updateSoftwareBtn.textContent = "🔄 Check for Updates"; }, 3000);
      }
      return;
    }

    if (latestSha) {
      if (updateSoftwareBtn) updateSoftwareBtn.textContent = "⚡ Updating…";
      localStorage.setItem("qc_player_sha", latestSha);
      flash(`⚡ Software updated to latest GitHub commit (${latestSha})! Reloading…`);
      setTimeout(() => { location.reload(); }, 1200);
      return;
    }
  } catch (err) {
    console.warn("QC Player: GitHub update check failed", err);
    if (isManual) flash("✕ Couldn't reach GitHub repo. Check network connection.");
  } finally {
    if (updateSoftwareBtn) {
      updateSoftwareBtn.disabled = false;
      updateSoftwareBtn.textContent = "🔄 Check for Updates";
    }
  }
}

if (updateSoftwareBtn) {
  updateSoftwareBtn.addEventListener("click", () => checkAndUpdateSoftware(true));
}
