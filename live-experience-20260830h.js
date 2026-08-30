(function () {
  "use strict";

  var broadcast = document.getElementById("broadcast");
  var mobileInvite = document.getElementById("mobileInvite");
  var joinButton = document.getElementById("joinButton");
  var rotateGate = document.getElementById("rotateGate");
  var roundGate = document.getElementById("roundGate");
  var startButton = document.getElementById("startButton");
  var guideBack = document.getElementById("guideBack");
  var guideProgress = document.getElementById("guideProgress");
  var guidePages = Array.prototype.slice.call(document.querySelectorAll("[data-guide-page]"));
  var guideDots = Array.prototype.slice.call(document.querySelectorAll(".rule-dots i"));
  var resultGate = document.getElementById("resultGate");
  var resultScore = document.getElementById("resultScore");
  var resultMaxCombo = document.getElementById("resultMaxCombo");
  var encoreButton = document.getElementById("encoreButton");
  var beGate = document.getElementById("beGate");
  var beReveal = document.getElementById("beReveal");
  var beStory = document.getElementById("beStory");
  var beBack = document.getElementById("beBack");
  var beNext = document.getElementById("beNext");
  var beExit = document.getElementById("beExit");
  var bePages = Array.prototype.slice.call(document.querySelectorAll("[data-be-page]"));
  var achievementGate = document.getElementById("achievementGate");
  if (achievementGate && !document.getElementById("addAchievementCart")) {
    achievementGate.innerHTML = '<div class="achievement-rays" aria-hidden="true"></div>'
      + '<span class="achievement-live">ACHIEVEMENT UNLOCKED</span>'
      + '<h1 id="achievementTitle">月云的兵</h1>'
      + '<p>恭喜你已获得成就“月云的兵”及限定证书！请前往商店，在购物车填写地址发货。</p>'
      + '<div class="achievement-actions"><button type="button" id="addAchievementCart">加入购物车</button><a href="index.html">退出游戏</a></div>'
      + '<small class="achievement-cart-status" id="achievementCartStatus" role="status" aria-live="polite"></small>';
  }
  var addAchievementCart = document.getElementById("addAchievementCart");
  var achievementCartStatus = document.getElementById("achievementCartStatus");
  var soundButton = document.getElementById("soundButton");
  var fullscreenButton = document.getElementById("fullscreenButton");
  var rotateFullscreenButton = document.getElementById("rotateFullscreenButton");
  var roundNumber = document.getElementById("roundNumber");
  var roundTimer = document.getElementById("roundTimer");
  var hitCount = document.getElementById("hitCount");
  var comboCount = document.getElementById("comboCount");
  var canvas = document.getElementById("rhythmCanvas");
  var context = canvas.getContext("2d", { alpha: true });
  var obstacleLayer = document.getElementById("obstacleLayer");
  var effectLayer = document.getElementById("effectLayer");
  var hitCallout = document.getElementById("hitCallout");
  var audioStatus = document.getElementById("audioStatus");
  var utsugiAssist = document.getElementById("utsugiAssist");
  var utsugiAutoplay = document.getElementById("utsugiAutoplay");
  var ryoTaunt = document.getElementById("ryoTaunt");
  var laneButtons = Array.prototype.slice.call(document.querySelectorAll(".lane-button"));
  var performerCards = Array.prototype.slice.call(document.querySelectorAll(".performer-card"));

  var ROUND_MS = 30000;
  var BEAT_MS = 500;
  var TRAVEL_MS = 3200;
  var PERFECT_WINDOW = 78;
  var GOOD_WINDOW = 175;
  var ROUND_LABELS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "9.9"];
  var laneLetters = ["Z", "O", "O", "L"];
  var laneMembers = ["TORAO", "HARUKA", "TOMA", "MINAMI"];
  var CHARGE_KEY = "tsukumo99-live-charge-v1";
  var ACHIEVEMENT_KEY = "tsukumo99-live-achievement-v1";
  var CART_KEY = "dizCart";
  var ACHIEVEMENT_PRODUCT_ID = "live-achievement-cert";
  var trackColor = { solid: "#ec0050", soft: "rgba(236,0,80,.2)", pale: "rgba(255,134,189,.78)" };
  var laneColors = [trackColor, trackColor, trackColor, trackColor];
  var cropRects = [
    { name: "脸", x: .11, y: .13, w: .38, h: .43 },
    { name: "眼睛", x: .21, y: .23, w: .22, h: .22 },
    { name: "嘴", x: .28, y: .33, w: .2, h: .2 },
    { name: "头发", x: .08, y: .08, w: .36, h: .34 },
    { name: "麦克风与手", x: .09, y: .47, w: .36, h: .34 },
    { name: "抬起的手", x: .76, y: .37, w: .22, h: .31 },
    { name: "衣领", x: .27, y: .5, w: .28, h: .28 },
    { name: "舞台服", x: .2, y: .65, w: .44, h: .32 }
  ];
  var lanePatterns = [
    [0, 1, 2, 3, 1, 2, 0, 3],
    [3, 2, 1, 0, 2, 0, 3, 1],
    [0, 2, 1, 3, 0, 1, 3, 2]
  ];

  var audioFiles = {
    bubble: "assets/audio/grape-nectar/bubble-grain.wav",
    violet: "assets/audio/grape-nectar/violet-pad.wav",
    core: "assets/audio/grape-nectar/main-core.wav",
    full: "assets/audio/grape-nectar/full.wav"
  };
  var tapSoundSequence = ["core", "bubble", "violet"];

  var heroImage = new Image();
  heroImage.src = "assets/hero-desktop-square.jpg";
  heroImage.addEventListener("load", function () { renderCanvas(performance.now()); });

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var userAgent = navigator.userAgent || "";
  var isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(userAgent) ||
    (/Macintosh/i.test(userAgent) && navigator.maxTouchPoints > 1) ||
    (navigator.maxTouchPoints > 1 && Math.min(screen.width, screen.height) < 900);

  var state = "idle";
  var mobileAccepted = false;
  var guidePage = 0;
  var currentRound = 1;
  var hits = 0;
  var combo = 0;
  var maxCombo = 0;
  var misses = 0;
  var roundStartedAt = 0;
  var roundEndsAt = 0;
  var frameRequest = 0;
  var obstacleTimer = 0;
  var helperTapTimer = 0;
  var tauntTimer = 0;
  var achievementEndTimer = 0;
  var statusTimer = 0;
  var effectTimers = {};
  var performerTimers = [0, 0, 0, 0];
  var lanePulseEnds = [0, 0, 0, 0];
  var laneOwners = [null, null, null, null];
  var activeInputs = {};
  var chartNotes = [];
  var noteSequence = 0;
  var lastCropIndex = -1;
  var assistActive = false;
  var bePage = 0;
  var beEndingPending = false;
  var chargeValues = loadChargeValues();
  var achievementEarned = readStoredValue(ACHIEVEMENT_KEY) === "1";
  var achievementPending = achievementEarned && !achievementInCart();

  var geometry = {
    width: 1,
    height: 1,
    dpr: 1,
    spawnY: 1,
    spawnCenterX: 1,
    lanes: [],
    pads: []
  };

  var audioContext = null;
  var masterGain = null;
  var audioBuffers = {};
  var fallbackAudio = {};
  var activeSources = {};
  var loadingPromise = null;
  var soundOn = true;
  var tapSoundIndex = 0;

  Object.keys(audioFiles).forEach(function (name) { fallbackAudio[name] = null; });

  function clamp(value, minimum, maximum) {
    return Math.max(minimum, Math.min(maximum, value));
  }

  function lerp(start, end, amount) {
    return start + (end - start) * amount;
  }

  function padNumber(value, length) {
    return String(value).padStart(length, "0");
  }

  function readStoredValue(key) {
    try { return window.localStorage.getItem(key); } catch (error) { return null; }
  }

  function loadChargeValues() {
    try {
      var stored = JSON.parse(window.localStorage.getItem(CHARGE_KEY));
      if (!Array.isArray(stored) || stored.length !== 4) return [0, 0, 0, 0];
      return stored.map(function (value) { return clamp(Number(value) || 0, 0, 99); });
    } catch (error) {
      return [0, 0, 0, 0];
    }
  }

  function saveChargeValues() {
    try { window.localStorage.setItem(CHARGE_KEY, JSON.stringify(chargeValues)); } catch (error) {}
  }

  function renderChargeValues() {
    performerCards.forEach(function (card, lane) {
      var value = chargeValues[lane];
      var output = card.querySelector(".charge-value");
      card.style.setProperty("--charge", value);
      card.style.setProperty("--charge-empty", 100 - value);
      card.classList.toggle("is-full", value >= 99);
      card.setAttribute("aria-label", laneLetters[lane] + " 轨道 " + laneMembers[lane] + "，应援能量 " + value + "%");
      if (output) output.textContent = value + "%";
    });
  }

  function unlockAchievement() {
    if (achievementEarned || achievementPending) return;
    achievementEarned = true;
    achievementPending = true;
    try { window.localStorage.setItem(ACHIEVEMENT_KEY, "1"); } catch (error) {}
    showAudioStatus("成就解锁：月云的兵");
    playSound("full");
    vibrate([24, 34, 24, 34, 60]);
    window.clearTimeout(achievementEndTimer);
    achievementEndTimer = window.setTimeout(function () {
      if (state === "playing") endRound();
    }, 720);
  }

  function chargePerformer(lane) {
    if (chargeValues[lane] >= 99) return;
    chargeValues[lane] = Math.min(99, chargeValues[lane] + 1);
    saveChargeValues();
    renderChargeValues();
    if (chargeValues[lane] >= 99) celebrateFullCard(lane);
    if (chargeValues.every(function (value) { return value >= 99; })) unlockAchievement();
  }

  function showAudioStatus(message) {
    window.clearTimeout(statusTimer);
    audioStatus.textContent = message;
    audioStatus.classList.add("show");
    statusTimer = window.setTimeout(function () { audioStatus.classList.remove("show"); }, 2200);
  }

  function setSound(on) {
    soundOn = on;
    soundButton.textContent = on ? "SOUND ON" : "SOUND OFF";
    soundButton.setAttribute("aria-pressed", String(on));
    if (masterGain && audioContext) masterGain.gain.setTargetAtTime(on ? .72 : 0, audioContext.currentTime, .025);
    Object.keys(fallbackAudio).forEach(function (name) {
      if (fallbackAudio[name]) fallbackAudio[name].muted = !on;
    });
  }

  function createAudioContext() {
    if (audioContext) return audioContext;
    var AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    audioContext = new AudioContextClass();
    masterGain = audioContext.createGain();
    masterGain.gain.value = soundOn ? .72 : 0;
    masterGain.connect(audioContext.destination);
    return audioContext;
  }

  function decodeAudio(targetContext, data) {
    return new Promise(function (resolve, reject) {
      var settled = false;
      function done(buffer) {
        if (settled) return;
        settled = true;
        resolve(buffer);
      }
      function fail(error) {
        if (settled) return;
        settled = true;
        reject(error);
      }
      try {
        var result = targetContext.decodeAudioData(data, done, fail);
        if (result && typeof result.then === "function") result.then(done).catch(fail);
      } catch (error) {
        fail(error);
      }
    });
  }

  function loadAudio() {
    if (loadingPromise) return loadingPromise;
    var targetContext = createAudioContext();
    if (!targetContext) {
      loadingPromise = Promise.resolve(false);
      return loadingPromise;
    }
    targetContext.resume().catch(function () {});
    loadingPromise = Promise.all(Object.keys(audioFiles).map(function (name) {
      return fetch(audioFiles[name]).then(function (response) {
        if (!response.ok) throw new Error("Audio fetch failed");
        return response.arrayBuffer();
      }).then(function (data) {
        return decodeAudio(targetContext, data);
      }).then(function (buffer) {
        audioBuffers[name] = buffer;
      });
    })).then(function () {
      return true;
    }).catch(function () {
      showAudioStatus("音效载入失败，仍可继续体验视觉效果");
      return false;
    });
    return loadingPromise;
  }

  function playSound(name) {
    if (!soundOn) return;
    if (audioContext && audioBuffers[name]) {
      if (audioContext.state === "suspended") audioContext.resume().catch(function () {});
      if (activeSources[name]) {
        try { activeSources[name].stop(); } catch (error) {}
      }
      var source = audioContext.createBufferSource();
      source.buffer = audioBuffers[name];
      source.connect(masterGain);
      source.onended = function () {
        if (activeSources[name] === source) delete activeSources[name];
      };
      activeSources[name] = source;
      source.start(0);
      return;
    }
    var audio = fallbackAudio[name];
    if (!audio) {
      audio = new Audio();
      audio.preload = "auto";
      audio.src = audioFiles[name];
      audio.muted = !soundOn;
      fallbackAudio[name] = audio;
    }
    try {
      audio.pause();
      audio.currentTime = 0;
      audio.play().catch(function () {});
    } catch (error) {}
  }

  function playNextTapSound() {
    var name = tapSoundSequence[tapSoundIndex];
    tapSoundIndex = (tapSoundIndex + 1) % tapSoundSequence.length;
    playSound(name);
  }

  function vibrate(pattern) {
    if (navigator.vibrate) navigator.vibrate(pattern);
  }

  function restartClass(className, duration) {
    window.clearTimeout(effectTimers[className]);
    broadcast.classList.remove(className);
    broadcast.getBoundingClientRect();
    broadcast.classList.add(className);
    effectTimers[className] = window.setTimeout(function () {
      broadcast.classList.remove(className);
    }, duration);
  }

  function fireButton(button) {
    button.classList.remove("firing");
    button.getBoundingClientRect();
    button.classList.add("firing");
    window.setTimeout(function () { button.classList.remove("firing"); }, 180);
  }

  function spawnBubbles(x, y, count, color, variant) {
    if (reduceMotion) return;
    for (var index = 0; index < count; index += 1) {
      var particle = document.createElement("i");
      particle.className = "bubble-particle" + (variant === "charge" ? " charge-bubble" : "");
      particle.style.left = x - 12 + Math.random() * 24 + "px";
      particle.style.top = y - 8 + Math.random() * 18 + "px";
      particle.style.setProperty("--bubble-color", color || "#ff86bd");
      particle.style.setProperty("--drift", -70 + Math.random() * 140 + "px");
      particle.style.animationDelay = Math.random() * .12 + "s";
      effectLayer.appendChild(particle);
      window.setTimeout((function (node) {
        return function () { node.remove(); };
      })(particle), variant === "charge" ? 2050 : 1700);
    }
  }

  function celebrateFullCard(lane) {
    var card = performerCards[lane];
    if (!card) return;
    card.classList.remove("just-full");
    card.getBoundingClientRect();
    card.classList.add("just-full");
    var rect = card.getBoundingClientRect();
    spawnBubbles(rect.left + rect.width / 2, rect.bottom - 6, 28, laneColors[lane].solid, "charge");
    vibrate([18, 24, 18, 24, 42]);
    window.setTimeout(function () { card.classList.remove("just-full"); }, 1450);
  }

  function triggerEffect() {
    restartClass("fx-hit", 250);
    vibrate(20);
  }

  function showJudgment(label, tone) {
    hitCallout.textContent = label;
    hitCallout.className = "hit-callout judgment-" + tone;
    hitCallout.getBoundingClientRect();
    hitCallout.classList.add("show");
  }

  function updateScore() {
    hitCount.textContent = padNumber(hits, 3);
    comboCount.textContent = padNumber(combo, 3);
  }

  function projectProgress(rawProgress) {
    return Math.pow(clamp(rawProgress, 0, 1), 1.5);
  }

  function resizeCanvas() {
    var rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    geometry.width = rect.width;
    geometry.height = rect.height;
    geometry.dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(rect.width * geometry.dpr);
    canvas.height = Math.round(rect.height * geometry.dpr);
    context.setTransform(geometry.dpr, 0, 0, geometry.dpr, 0, 0);
    calculateGeometry();
    renderCanvas(performance.now());
  }

  function calculateGeometry() {
    var canvasRect = canvas.getBoundingClientRect();
    var compact = geometry.height <= 500;
    var topGap = Math.min(geometry.width * .023, compact ? 15 : 31);
    geometry.spawnCenterX = geometry.width / 2;
    geometry.spawnY = geometry.height * (compact ? .145 : .19);
    geometry.pads = laneButtons.map(function (button) {
      var rect = button.querySelector(".letter").getBoundingClientRect();
      return {
        x: rect.left - canvasRect.left + rect.width / 2,
        y: rect.top - canvasRect.top + rect.height / 2,
        radius: rect.width / 2
      };
    });
    geometry.lanes = geometry.pads.map(function (pad, lane) {
      var start = {
        x: geometry.spawnCenterX + (lane - 1.5) * topGap,
        y: geometry.spawnY
      };
      return {
        start: start,
        control: {
          x: lerp(start.x, pad.x, .34),
          y: lerp(start.y, pad.y, .43)
        },
        end: { x: pad.x, y: pad.y }
      };
    });
  }

  function lanePosition(lane, progress) {
    var curve = geometry.lanes[lane];
    var amount = clamp(progress, 0, 1);
    var inverse = 1 - amount;
    return {
      x: inverse * inverse * curve.start.x + 2 * inverse * amount * curve.control.x + amount * amount * curve.end.x,
      y: inverse * inverse * curve.start.y + 2 * inverse * amount * curve.control.y + amount * amount * curve.end.y
    };
  }

  function boundaryPosition(boundary, progress) {
    var centers = geometry.lanes.map(function (_, lane) { return lanePosition(lane, progress); });
    if (boundary === 0) {
      return {
        x: centers[0].x - (centers[1].x - centers[0].x) * .52,
        y: centers[0].y - (centers[1].y - centers[0].y) * .06
      };
    }
    if (boundary === 4) {
      return {
        x: centers[3].x + (centers[3].x - centers[2].x) * .52,
        y: centers[3].y + (centers[3].y - centers[2].y) * .06
      };
    }
    return {
      x: (centers[boundary - 1].x + centers[boundary].x) / 2,
      y: (centers[boundary - 1].y + centers[boundary].y) / 2
    };
  }

  function traceCurve(getPoint, reverse) {
    var steps = 30;
    for (var index = 0; index <= steps; index += 1) {
      var amount = reverse ? 1 - index / steps : index / steps;
      var point = getPoint(amount);
      if (index === 0) context.moveTo(point.x, point.y);
      else context.lineTo(point.x, point.y);
    }
  }

  function drawHighway(now) {
    var alpha = state === "playing" ? 1 : .5;
    var top = geometry.spawnY;
    var bottom = geometry.pads[0] ? geometry.pads[0].y : geometry.height * .9;
    for (var lane = 0; lane < 4; lane += 1) {
      var gradient = context.createLinearGradient(0, top, 0, bottom);
      gradient.addColorStop(0, "rgba(255,244,247,.025)");
      gradient.addColorStop(.45, trackColor.soft);
      gradient.addColorStop(1, trackColor.soft);
      context.save();
      context.globalAlpha = alpha * (now < lanePulseEnds[lane] ? .9 : .48);
      context.beginPath();
      traceCurve(function (amount) { return boundaryPosition(lane, amount); }, false);
      traceCurve(function (amount) { return boundaryPosition(lane + 1, amount); }, true);
      context.closePath();
      context.fillStyle = gradient;
      context.fill();
      context.restore();
    }

    for (var boundary = 0; boundary <= 4; boundary += 1) {
      context.save();
      context.beginPath();
      traceCurve((function (edge) {
        return function (amount) { return boundaryPosition(edge, amount); };
      })(boundary), false);
      context.lineWidth = boundary === 0 || boundary === 4 ? 1.45 : 1;
      context.strokeStyle = "rgba(236,0,80,.62)";
      context.shadowColor = "rgba(236,0,80,.48)";
      context.shadowBlur = 10;
      context.globalAlpha = alpha;
      context.stroke();
      context.restore();
    }

    geometry.lanes.forEach(function (_, lane) {
      context.save();
      context.beginPath();
      traceCurve(function (amount) { return lanePosition(lane, amount); }, false);
      context.lineWidth = now < lanePulseEnds[lane] ? 2.2 : .8;
      context.strokeStyle = now < lanePulseEnds[lane] ? trackColor.pale : "rgba(255,244,247,.18)";
      context.shadowColor = trackColor.solid;
      context.shadowBlur = now < lanePulseEnds[lane] ? 18 : 0;
      context.globalAlpha = alpha;
      context.stroke();
      context.restore();
    });

    if (geometry.pads.length === 4) {
      context.save();
      context.beginPath();
      context.moveTo(geometry.pads[0].x - geometry.pads[0].radius * 1.4, geometry.pads[0].y - geometry.pads[0].radius * .16);
      context.bezierCurveTo(
        geometry.width * .32, geometry.pads[0].y - geometry.height * .08,
        geometry.width * .68, geometry.pads[3].y - geometry.height * .08,
        geometry.pads[3].x + geometry.pads[3].radius * 1.4, geometry.pads[3].y - geometry.pads[3].radius * .16
      );
      context.lineWidth = 2;
      context.strokeStyle = "rgba(255,244,247,.64)";
      context.shadowColor = "rgba(236,0,80,.42)";
      context.shadowBlur = 18;
      context.globalAlpha = alpha;
      context.stroke();
      context.restore();
    }

    var beatPhase = state === "playing" ? ((now - roundStartedAt) % BEAT_MS) / BEAT_MS : 0;
    context.save();
    context.beginPath();
    context.arc(geometry.spawnCenterX, geometry.spawnY, 14 + beatPhase * 28, 0, Math.PI * 2);
    context.strokeStyle = "rgba(255,134,189," + (.52 * (1 - beatPhase)) + ")";
    context.lineWidth = 1.4;
    context.stroke();
    context.restore();
  }

  function noteRawProgress(note, now) {
    return (now - note.spawnAt) / (note.hitAt - note.spawnAt);
  }

  function notePosition(note, now) {
    if (note.state === "holding" || note.state === "hit" || note.state === "miss") return lanePosition(note.lane, 1);
    return lanePosition(note.lane, projectProgress(noteRawProgress(note, now)));
  }

  function strokeLaneSegment(lane, start, end, width, color, alpha) {
    context.save();
    context.beginPath();
    var steps = 18;
    for (var index = 0; index <= steps; index += 1) {
      var amount = lerp(start, end, index / steps);
      var point = lanePosition(lane, amount);
      if (index === 0) context.moveTo(point.x, point.y);
      else context.lineTo(point.x, point.y);
    }
    context.lineCap = "round";
    context.lineWidth = width;
    context.strokeStyle = color;
    context.globalAlpha = alpha;
    context.shadowColor = color;
    context.shadowBlur = width * 1.8;
    context.stroke();
    context.lineWidth = Math.max(2, width * .22);
    context.strokeStyle = "rgba(255,244,247,.68)";
    context.shadowBlur = 0;
    context.stroke();
    context.restore();
  }

  function drawHoldTail(note, now, radius) {
    var tailStart;
    if (note.state === "holding") {
      var remaining = clamp((note.holdEndAt - now) / note.holdDuration, 0, 1);
      tailStart = projectProgress(1 - remaining * note.holdDuration / TRAVEL_MS);
    } else {
      var raw = noteRawProgress(note, now);
      tailStart = projectProgress(raw - note.holdDuration / TRAVEL_MS);
    }
    var headProgress = note.state === "holding" ? 1 : projectProgress(noteRawProgress(note, now));
    strokeLaneSegment(note.lane, clamp(tailStart, 0, 1), clamp(headProgress, 0, 1), Math.max(8, radius * .42), laneColors[note.lane].solid, .78);
  }

  function drawCrop(note, radius) {
    var crop = cropRects[note.crop];
    context.save();
    context.beginPath();
    context.arc(0, 0, radius * .72, 0, Math.PI * 2);
    context.clip();
    context.fillStyle = "#3a0014";
    context.fillRect(-radius, -radius, radius * 2, radius * 2);
    if (heroImage.complete && heroImage.naturalWidth) {
      context.drawImage(
        heroImage,
        crop.x * heroImage.naturalWidth,
        crop.y * heroImage.naturalHeight,
        crop.w * heroImage.naturalWidth,
        crop.h * heroImage.naturalHeight,
        -radius * .82,
        -radius * .82,
        radius * 1.64,
        radius * 1.64
      );
    }
    context.fillStyle = "rgba(236,0,80,.17)";
    context.fillRect(-radius, -radius, radius * 2, radius * 2);
    context.restore();
  }

  function drawNoteHead(note, now, position, radius, alpha) {
    context.save();
    context.translate(position.x, position.y);
    context.globalAlpha = alpha;
    context.shadowColor = laneColors[note.lane].solid;
    context.shadowBlur = radius * .72;
    context.beginPath();
    context.arc(0, 0, radius * .8, 0, Math.PI * 2);
    context.fillStyle = "rgba(18,0,5,.9)";
    context.fill();
    context.lineWidth = Math.max(2, radius * .09);
    context.strokeStyle = note.kind === "hold" ? "#fff4f7" : laneColors[note.lane].solid;
    context.stroke();
    drawCrop(note, radius);

    context.lineWidth = Math.max(2, radius * .1);
    for (var segment = 0; segment < 4; segment += 1) {
      context.beginPath();
      context.arc(0, 0, radius, segment * Math.PI / 2 + .12, segment * Math.PI / 2 + .95);
      context.strokeStyle = segment % 2 ? "rgba(255,244,247,.86)" : laneColors[note.lane].solid;
      context.stroke();
    }
    if (note.kind === "hold") {
      context.beginPath();
      context.arc(0, 0, radius * 1.14, -.7, .7);
      context.strokeStyle = "rgba(255,244,247,.7)";
      context.lineWidth = 2;
      context.stroke();
    }
    context.restore();
  }

  function drawChordLinks(now) {
    var chordGroups = {};
    chartNotes.forEach(function (note) {
      if (!note.chord || note.state !== "waiting" || now < note.spawnAt) return;
      if (!chordGroups[note.chord]) chordGroups[note.chord] = [];
      chordGroups[note.chord].push(note);
    });
    Object.keys(chordGroups).forEach(function (key) {
      var group = chordGroups[key];
      if (group.length !== 2) return;
      var first = notePosition(group[0], now);
      var second = notePosition(group[1], now);
      context.save();
      context.beginPath();
      context.moveTo(first.x, first.y);
      context.lineTo(second.x, second.y);
      context.strokeStyle = "rgba(255,244,247,.58)";
      context.lineWidth = 2;
      context.shadowColor = "rgba(255,134,189,.72)";
      context.shadowBlur = 12;
      context.stroke();
      context.restore();
    });
  }

  function drawNotes(now) {
    drawChordLinks(now);
    chartNotes.slice().sort(function (first, second) {
      return noteRawProgress(first, now) - noteRawProgress(second, now);
    }).forEach(function (note) {
      if (now < note.spawnAt) return;
      if (note.state === "hit" || note.state === "miss") {
        var age = now - note.resolvedAt;
        if (age > 380) return;
        var resolvedAlpha = 1 - age / 380;
        var pad = geometry.pads[note.lane];
        context.save();
        context.beginPath();
        context.arc(pad.x, pad.y, pad.radius * (.68 + age / 360), 0, Math.PI * 2);
        context.lineWidth = note.state === "hit" ? 4 : 2;
        context.strokeStyle = note.state === "hit" ? laneColors[note.lane].pale : "rgba(236,0,80,.85)";
        context.globalAlpha = resolvedAlpha;
        context.shadowColor = laneColors[note.lane].solid;
        context.shadowBlur = 20;
        context.stroke();
        context.restore();
        return;
      }
      var raw = noteRawProgress(note, now);
      if (raw < 0 || raw > 1.12) return;
      var position = notePosition(note, now);
      var padRadius = geometry.pads[note.lane].radius;
      var radius = lerp(Math.max(7, padRadius * .24), padRadius * .72, Math.pow(clamp(raw, 0, 1), .7));
      if (note.kind === "hold") drawHoldTail(note, now, radius);
      drawNoteHead(note, now, position, radius, clamp(raw * 7, 0, 1));
    });
  }

  function renderCanvas(now) {
    if (!context || !geometry.width || !geometry.height) return;
    context.clearRect(0, 0, geometry.width, geometry.height);
    drawHighway(now);
    if (state === "playing") drawNotes(now);
  }

  function pickCrop() {
    var cropIndex = Math.floor(Math.random() * cropRects.length);
    if (cropIndex === lastCropIndex) cropIndex = (cropIndex + 1 + Math.floor(Math.random() * (cropRects.length - 1))) % cropRects.length;
    lastCropIndex = cropIndex;
    return cropIndex;
  }

  function addChartNote(lane, hitAt, kind, holdDuration, chord) {
    chartNotes.push({
      id: ++noteSequence,
      lane: lane,
      letter: laneLetters[lane],
      crop: pickCrop(),
      kind: kind || "tap",
      hitAt: hitAt,
      spawnAt: hitAt - TRAVEL_MS,
      holdDuration: holdDuration || 0,
      holdEndAt: hitAt + (holdDuration || 0),
      chord: chord || "",
      state: "waiting",
      grade: "",
      inputToken: null,
      autoHold: false,
      resolvedAt: 0
    });
  }

  function buildChart(startTime) {
    chartNotes = [];
    var pattern = lanePatterns[(currentRound - 1) % lanePatterns.length];
    var laneBusyUntil = [0, 0, 0, 0];
    var hitAt = startTime + TRAVEL_MS;
    var step = 0;
    while (hitAt <= startTime + ROUND_MS - 320) {
      var lane = pattern[step % pattern.length];
      for (var attempt = 0; attempt < 4 && laneBusyUntil[lane] > hitAt; attempt += 1) lane = (lane + 1) % 4;
      var isHold = step > 2 && (step % 11 === 5 || step % 17 === 9);
      var holdDuration = isHold ? (step % 2 ? BEAT_MS * 1.5 : BEAT_MS * 2) : 0;
      var chordId = "";
      if (!isHold && step > 0 && step % 8 === 7) chordId = "chord-" + step;
      addChartNote(lane, hitAt, isHold ? "hold" : "tap", holdDuration, chordId);
      if (isHold) laneBusyUntil[lane] = hitAt + holdDuration + BEAT_MS * .45;
      if (chordId) {
        var secondLane = (lane + 2) % 4;
        if (laneBusyUntil[secondLane] > hitAt) secondLane = (secondLane + 1) % 4;
        addChartNote(secondLane, hitAt, "tap", 0, chordId);
      }
      hitAt += BEAT_MS;
      step += 1;
    }
  }

  function launchPerfectBeam(lane) {
    if (reduceMotion || !performerCards[lane]) return;
    var padRect = laneButtons[lane].querySelector(".letter").getBoundingClientRect();
    var cardRect = performerCards[lane].getBoundingClientRect();
    var startX = padRect.left + padRect.width / 2;
    var startY = padRect.top + padRect.height / 2;
    var endX = cardRect.left + cardRect.width / 2;
    var endY = cardRect.top + cardRect.height * .72;
    var deltaX = endX - startX;
    var deltaY = endY - startY;
    var beam = document.createElement("i");
    beam.className = "perfect-beam";
    beam.style.setProperty("--beam-x", startX + "px");
    beam.style.setProperty("--beam-y", startY + "px");
    beam.style.setProperty("--beam-length", Math.hypot(deltaX, deltaY) + "px");
    beam.style.setProperty("--beam-angle", Math.atan2(deltaX, -deltaY) * 180 / Math.PI + "deg");
    effectLayer.appendChild(beam);
    window.setTimeout(function () { beam.remove(); }, 700);
  }

  function pulsePerformer(lane, perfect) {
    var card = performerCards[lane];
    if (!card) return;
    window.clearTimeout(performerTimers[lane]);
    card.classList.remove("is-hit", "is-perfect");
    card.getBoundingClientRect();
    card.classList.add("is-hit");
    if (perfect) {
      card.classList.add("is-perfect");
      launchPerfectBeam(lane);
    }
    performerTimers[lane] = window.setTimeout(function () {
      card.classList.remove("is-hit", "is-perfect");
    }, perfect ? 760 : 440);
  }

  function pulseLane(lane, duration) {
    lanePulseEnds[lane] = performance.now() + (duration || 360);
  }

  function resolveNote(note, label, tone, now) {
    if (state !== "playing" || !note || note.state === "hit" || note.state === "miss") return;
    note.state = "hit";
    note.resolvedAt = now;
    note.inputToken = null;
    hits += 1;
    combo += 1;
    maxCombo = Math.max(maxCombo, combo);
    updateScore();
    showJudgment(label, tone);
    pulseLane(note.lane, label.indexOf("PERFECT") !== -1 ? 620 : 360);
    pulsePerformer(note.lane, label.indexOf("PERFECT") !== -1);
    chargePerformer(note.lane);
    triggerEffect();
  }

  function missNote(note, label, tone, now) {
    if (state !== "playing" || !note || note.state === "hit" || note.state === "miss") return;
    note.state = "miss";
    note.resolvedAt = now;
    note.inputToken = null;
    combo = 0;
    misses += 1;
    updateScore();
    showJudgment(label || "MISS", tone || "miss");
    showRyoTaunt();
    pulseLane(note.lane, 240);
    vibrate([14, 22, 14]);
  }

  function beginHold(note, token, grade, auto) {
    note.state = "holding";
    note.grade = grade;
    note.inputToken = auto ? null : token;
    note.autoHold = !!auto;
    if (!auto && activeInputs[token]) {
      activeInputs[token].hold = true;
      activeInputs[token].note = note;
      laneButtons[note.lane].classList.add("holding-pad");
    }
    showJudgment("HOLD", "hold");
    pulseLane(note.lane, 520);
    vibrate(16);
  }

  function completeHold(note, now) {
    if (!note || note.state !== "holding") return;
    if (note.inputToken && activeInputs[note.inputToken]) {
      activeInputs[note.inputToken].hold = false;
      activeInputs[note.inputToken].note = null;
    }
    laneButtons[note.lane].classList.remove("holding-pad");
    resolveNote(note, "HOLD " + (note.grade || "PERFECT"), note.grade === "GOOD" ? "hold" : "perfect", now);
  }

  function breakHold(note, now) {
    if (!note || note.state !== "holding") return;
    laneButtons[note.lane].classList.remove("holding-pad");
    missNote(note, "HOLD BREAK", "break", now);
  }

  function processNotes(now) {
    chartNotes.forEach(function (note) {
      if (note.state === "waiting" && now > note.hitAt + GOOD_WINDOW) missNote(note, "MISS", "miss", now);
      if (note.state === "holding" && now >= note.holdEndAt) completeHold(note, now);
    });
  }

  function findLaneCandidate(lane, now) {
    var best = null;
    chartNotes.forEach(function (note) {
      if (note.lane !== lane || note.state !== "waiting" || now < note.spawnAt) return;
      var difference = Math.abs(now - note.hitAt);
      if (!best || difference < best.difference) best = { note: note, difference: difference, delta: now - note.hitAt };
    });
    return best;
  }

  function judgeLane(lane, token, now) {
    fireButton(laneButtons[lane]);
    var candidate = findLaneCandidate(lane, now);
    if (!candidate) {
      showJudgment("NO NOTE", "early");
      pulseLane(lane, 180);
      vibrate(8);
      return;
    }
    if (candidate.difference > GOOD_WINDOW) {
      showJudgment(candidate.delta < 0 ? "EARLY" : "LATE", "early");
      pulseLane(lane, 180);
      vibrate(8);
      return;
    }
    var grade = candidate.difference <= PERFECT_WINDOW ? "PERFECT" : "GOOD";
    if (candidate.note.kind === "hold") {
      beginHold(candidate.note, token, grade, false);
      return;
    }
    resolveNote(candidate.note, grade, grade.toLowerCase(), now);
  }

  function handleLaneDown(lane, token) {
    if (state !== "playing" || lane < 0 || lane > 3 || activeInputs[token] || laneOwners[lane] !== null) return;
    playNextTapSound();
    laneOwners[lane] = token;
    activeInputs[token] = { lane: lane, hold: false, note: null };
    laneButtons[lane].classList.add("pressed");
    judgeLane(lane, token, performance.now());
  }

  function handleLaneUp(token) {
    var record = activeInputs[token];
    if (!record) return;
    if (record.hold && record.note && record.note.state === "holding") {
      var now = performance.now();
      if (now >= record.note.holdEndAt - 45) completeHold(record.note, now);
      else breakHold(record.note, now);
    }
    laneButtons[record.lane].classList.remove("pressed", "holding-pad");
    if (laneOwners[record.lane] === token) laneOwners[record.lane] = null;
    delete activeInputs[token];
  }

  function releaseAllInputs(breakHolds) {
    Object.keys(activeInputs).forEach(function (token) {
      var record = activeInputs[token];
      if (breakHolds && record.hold && record.note) breakHold(record.note, performance.now());
      laneButtons[record.lane].classList.remove("pressed", "holding-pad");
    });
    activeInputs = {};
    laneOwners = [null, null, null, null];
  }

  function autoJudgeReadyNotes(now) {
    if (!assistActive || state !== "playing") return;
    chartNotes.forEach(function (note) {
      if (note.state !== "waiting" || now < note.hitAt - PERFECT_WINDOW) return;
      moveUtsugiToLane(note.lane);
      fireButton(laneButtons[note.lane]);
      if (note.kind === "hold") beginHold(note, null, "PERFECT", true);
      else resolveNote(note, "PERFECT", "perfect", now);
    });
  }

  function moveUtsugiToLane(lane, immediate) {
    if (!utsugiAutoplay || !laneButtons[lane]) return;
    var pad = laneButtons[lane].querySelector(".letter").getBoundingClientRect();
    if (immediate) utsugiAutoplay.style.transition = "none";
    utsugiAutoplay.style.setProperty("--helper-x", pad.left + pad.width / 2 + "px");
    utsugiAutoplay.style.setProperty("--helper-y", pad.top + pad.height * .22 + "px");
    if (immediate) {
      utsugiAutoplay.getBoundingClientRect();
      utsugiAutoplay.style.transition = "";
    }
    window.clearTimeout(helperTapTimer);
    utsugiAutoplay.classList.remove("is-tapping");
    utsugiAutoplay.getBoundingClientRect();
    utsugiAutoplay.classList.add("is-tapping");
    helperTapTimer = window.setTimeout(function () { utsugiAutoplay.classList.remove("is-tapping"); }, 380);
  }

  function setAssist(active) {
    assistActive = !!active && state === "playing";
    utsugiAssist.disabled = state !== "playing";
    utsugiAssist.classList.toggle("assist-active", assistActive);
    utsugiAssist.setAttribute("aria-pressed", String(assistActive));
    utsugiAssist.setAttribute("aria-label", assistActive ? "宇都木正在代打，点击停止" : "宇都木救救！点击呼叫代打");
    utsugiAutoplay.classList.toggle("is-active", assistActive);
    if (assistActive) moveUtsugiToLane(1, true);
    else utsugiAutoplay.classList.remove("is-tapping");
  }

  function toggleAssist() {
    if (state !== "playing") return;
    setAssist(!assistActive);
    showAudioStatus(assistActive ? "宇都木代打 ON" : "宇都木代打 OFF");
    if (assistActive) {
      playSound("full");
      vibrate([18, 28, 18]);
      autoJudgeReadyNotes(performance.now());
    }
  }

  function showRyoTaunt() {
    if (!ryoTaunt) return;
    window.clearTimeout(tauntTimer);
    ryoTaunt.classList.remove("show");
    ryoTaunt.getBoundingClientRect();
    ryoTaunt.classList.add("show");
    tauntTimer = window.setTimeout(function () { ryoTaunt.classList.remove("show"); }, 1220);
  }

  function spawnRyoObstacle() {
    if (state !== "playing" || reduceMotion) return;
    var variants = ["obstacle-peek", "obstacle-hand", "obstacle-hand", "obstacle-hand", "obstacle-sweep"];
    var variant = variants[Math.floor(Math.random() * variants.length)];
    var obstacle = document.createElement("i");
    obstacle.className = "ryo-obstacle " + variant;
    if (variant === "obstacle-hand") {
      var lane = Math.floor(Math.random() * 4);
      var padRect = laneButtons[lane].querySelector(".letter").getBoundingClientRect();
      obstacle.style.setProperty("--obstacle-x", padRect.left + padRect.width / 2 + "px");
      obstacle.style.setProperty("--obstacle-y-px", padRect.top + padRect.height / 2 + "px");
      obstacle.style.setProperty("--obstacle-size", Math.max(padRect.width, padRect.height) * 1.2 + "px");
      obstacle.setAttribute("aria-label", "月云了挡住了这个按键");
      obstacle.addEventListener("pointerdown", function (event) {
        event.preventDefault();
        event.stopPropagation();
        vibrate([12, 18, 12]);
      });
    } else if (variant === "obstacle-peek") {
      obstacle.classList.add(Math.random() < .5 ? "is-left" : "is-right");
      var peekCopy = document.createElement("b");
      peekCopy.textContent = "挡你视线~";
      obstacle.appendChild(peekCopy);
    } else {
      obstacle.style.setProperty("--obstacle-y", 18 + Math.random() * 26 + "%");
      var sweepCopy = document.createElement("b");
      sweepCopy.textContent = "啦啦啦~~~";
      obstacle.appendChild(sweepCopy);
    }
    obstacleLayer.appendChild(obstacle);
    window.setTimeout(function () { obstacle.remove(); }, 1750);
  }

  function scheduleObstacle() {
    if (state !== "playing") return;
    obstacleTimer = window.setTimeout(function () {
      spawnRyoObstacle();
      scheduleObstacle();
    }, 2800 + Math.random() * 1800);
  }

  function clearObstacles() {
    window.clearTimeout(obstacleTimer);
    Array.prototype.slice.call(obstacleLayer.children).forEach(function (obstacle) { obstacle.remove(); });
  }

  function gameFrame(now) {
    if (state !== "playing") return;
    autoJudgeReadyNotes(now);
    processNotes(now);
    renderCanvas(now);
    var remaining = Math.max(0, roundEndsAt - now);
    roundTimer.textContent = "00:" + padNumber(Math.ceil(remaining / 1000), 2);
    if (remaining <= 0) {
      endRound();
      return;
    }
    frameRequest = window.requestAnimationFrame(gameFrame);
  }

  function endRound() {
    if (state !== "playing") return;
    state = "result";
    window.cancelAnimationFrame(frameRequest);
    window.clearTimeout(achievementEndTimer);
    setAssist(false);
    clearObstacles();
    roundTimer.textContent = "00:00";
    releaseAllInputs(false);
    laneButtons.forEach(function (button) { button.disabled = true; });
    broadcast.classList.remove("is-playing");
    playSound("full");
    resultScore.textContent = padNumber(hits, 3);
    resultMaxCombo.textContent = padNumber(maxCombo, 3);
    beEndingPending = currentRound >= ROUND_LABELS.length && !chargeValues.every(function (value) { return value >= 99; });
    encoreButton.hidden = currentRound >= ROUND_LABELS.length;
    renderCanvas(performance.now());
    window.setTimeout(function () {
      if (!isMobile || !window.matchMedia("(orientation: portrait)").matches) {
        showRoundOutcome();
      }
    }, 320);
  }

  function showRoundOutcome() {
    beGate.hidden = !beEndingPending;
    achievementGate.hidden = beEndingPending || !achievementPending;
    resultGate.hidden = beEndingPending || achievementPending;
    if (beEndingPending) resetBeEnding();
    else if (achievementPending) window.setTimeout(function () { addAchievementCart.focus(); }, 180);
  }

  function startRound() {
    state = "playing";
    hits = 0;
    combo = 0;
    maxCombo = 0;
    misses = 0;
    tapSoundIndex = 0;
    activeInputs = {};
    laneOwners = [null, null, null, null];
    lanePulseEnds = [0, 0, 0, 0];
    assistActive = false;
    window.clearTimeout(achievementEndTimer);
    clearObstacles();
    resizeCanvas();
    updateScore();
    roundNumber.textContent = ROUND_LABELS[Math.min(currentRound - 1, ROUND_LABELS.length - 1)];
    roundTimer.textContent = "00:30";
    roundGate.hidden = true;
    resultGate.hidden = true;
    beGate.hidden = true;
    achievementGate.hidden = true;
    encoreButton.hidden = false;
    startButton.disabled = false;
    startButton.textContent = "开始游戏";
    laneButtons.forEach(function (button) {
      button.disabled = false;
      button.classList.remove("pressed", "holding-pad");
    });
    performerCards.forEach(function (card, lane) {
      window.clearTimeout(performerTimers[lane]);
      card.classList.remove("is-hit", "is-perfect");
    });
    broadcast.classList.add("is-playing");
    roundStartedAt = performance.now();
    roundEndsAt = roundStartedAt + ROUND_MS;
    buildChart(roundStartedAt);
    setAssist(false);
    scheduleObstacle();
    window.cancelAnimationFrame(frameRequest);
    frameRequest = window.requestAnimationFrame(gameFrame);
  }

  function prepareRound() {
    if (state === "loading" || state === "playing") return;
    state = "loading";
    startButton.disabled = true;
    startButton.textContent = "加载中……";
    loadAudio().then(startRound);
  }

  function renderGuide() {
    guidePages.forEach(function (page, index) {
      var active = index === guidePage;
      page.classList.toggle("is-active", active);
      page.setAttribute("aria-hidden", String(!active));
    });
    guideDots.forEach(function (dot, index) { dot.classList.toggle("is-active", index === guidePage); });
    guideProgress.textContent = guidePage + 1 + " / " + guidePages.length;
    guideBack.hidden = guidePage === 0;
    startButton.textContent = guidePage === guidePages.length - 1 ? "开始游戏" : "下一页";
  }

  function renderBeEnding() {
    bePages.forEach(function (page, index) {
      var active = index === bePage;
      page.classList.toggle("is-active", active);
      page.setAttribute("aria-hidden", String(!active));
    });
    beBack.hidden = bePage === 0;
    beNext.hidden = bePage === bePages.length - 1;
    beExit.hidden = bePage !== bePages.length - 1;
  }

  function resetBeEnding() {
    bePage = 0;
    beGate.classList.remove("is-cleared");
    beReveal.hidden = false;
    beStory.hidden = true;
    renderBeEnding();
    window.setTimeout(function () { beReveal.focus(); }, 120);
  }

  function revealBeEnding() {
    beGate.classList.add("is-cleared");
    beReveal.hidden = true;
    window.setTimeout(function () {
      beStory.hidden = false;
      renderBeEnding();
      beNext.focus();
    }, reduceMotion ? 0 : 620);
  }

  function achievementInCart() {
    try {
      var cart = JSON.parse(window.localStorage.getItem(CART_KEY) || "[]");
      return Array.isArray(cart) && cart.some(function (item) { return item && item.id === ACHIEVEMENT_PRODUCT_ID; });
    } catch (error) {
      return false;
    }
  }

  function showAchievementCartStatus(message, isError) {
    achievementCartStatus.textContent = message;
    achievementCartStatus.classList.toggle("is-error", !!isError);
    achievementCartStatus.classList.add("show");
  }

  function syncAchievementCartState() {
    var added = achievementInCart();
    addAchievementCart.disabled = added;
    addAchievementCart.textContent = added ? "已加入购物车" : "加入购物车";
    if (added) showAchievementCartStatus("已加入购物车", false);
  }

  function addAchievementToCart() {
    try {
      var cart = JSON.parse(window.localStorage.getItem(CART_KEY) || "[]");
      if (!Array.isArray(cart)) cart = [];
      var item = cart.find(function (entry) { return entry && entry.id === ACHIEVEMENT_PRODUCT_ID; });
      if (item) item.qty = 2;
      else cart.push({ id: ACHIEVEMENT_PRODUCT_ID, qty: 2 });
      window.localStorage.setItem(CART_KEY, JSON.stringify(cart));
      syncAchievementCartState();
    } catch (error) {
      showAchievementCartStatus("加入失败，请确认浏览器允许保存网站数据后重试。", true);
    }
  }

  function isPortrait() {
    return window.matchMedia("(orientation: portrait)").matches;
  }

  function fullscreenElement() {
    return document.fullscreenElement || document.webkitFullscreenElement || null;
  }

  function fullscreenSupported() {
    return !!(document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen);
  }

  function requestImmersiveView() {
    var root = document.documentElement;
    var request = root.requestFullscreen || root.webkitRequestFullscreen;
    var fullscreenRequest = Promise.resolve();
    if (request && !fullscreenElement()) {
      try {
        fullscreenRequest = Promise.resolve(request.call(root)).catch(function () {});
      } catch (error) {
        fullscreenRequest = Promise.resolve();
      }
    }
    return fullscreenRequest.then(function () {
      if (screen.orientation && screen.orientation.lock) {
        return screen.orientation.lock("landscape").catch(function () {});
      }
    }).finally(function () {
      window.setTimeout(function () {
        syncViewportHeight();
        resizeCanvas();
        syncOrientation();
        syncFullscreenButtons();
      }, 120);
    });
  }

  function toggleFullscreen() {
    if (!fullscreenElement()) {
      requestImmersiveView();
      return;
    }
    var exit = document.exitFullscreen || document.webkitExitFullscreen;
    if (!exit) return;
    try { Promise.resolve(exit.call(document)).catch(function () {}); } catch (error) {}
  }

  function syncFullscreenButtons() {
    var available = isMobile && fullscreenSupported();
    var active = !!fullscreenElement();
    fullscreenButton.hidden = !available;
    fullscreenButton.textContent = active ? "退出全屏" : "开启全屏";
    fullscreenButton.setAttribute("aria-label", active ? "退出全屏" : "开启全屏");
    rotateFullscreenButton.hidden = !(available && mobileAccepted && isPortrait());
  }

  function syncViewportHeight() {
    var viewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    if (viewportHeight) document.documentElement.style.setProperty("--live-viewport-height", Math.round(viewportHeight) + "px");
  }

  function syncOrientation() {
    syncViewportHeight();
    syncFullscreenButtons();
    if (!isMobile || !mobileAccepted) return;
    var portrait = isPortrait();
    rotateGate.hidden = !portrait;
    if (portrait) {
      if (state === "idle" || state === "loading") roundGate.hidden = true;
      if (state === "result") {
        resultGate.hidden = true;
        achievementGate.hidden = true;
        beGate.hidden = true;
      }
      return;
    }
    if (state === "idle") {
      achievementGate.hidden = !achievementPending;
      roundGate.hidden = achievementPending;
    }
    if (state === "result") {
      showRoundOutcome();
    }
  }

  function enterMobileLive() {
    mobileAccepted = true;
    mobileInvite.hidden = true;
    loadAudio();
    requestImmersiveView();
    syncOrientation();
    window.setTimeout(resizeCanvas, 120);
  }

  laneButtons.forEach(function (button) {
    button.disabled = true;
    button.addEventListener("pointerdown", function (event) {
      event.preventDefault();
      try { button.setPointerCapture(event.pointerId); } catch (error) {}
      handleLaneDown(Number(button.dataset.lane), "pointer-" + event.pointerId);
    });
    button.addEventListener("click", function (event) { event.preventDefault(); });
    button.addEventListener("contextmenu", function (event) { event.preventDefault(); });
  });

  document.addEventListener("pointerup", function (event) { handleLaneUp("pointer-" + event.pointerId); });
  document.addEventListener("pointercancel", function (event) { handleLaneUp("pointer-" + event.pointerId); });
  joinButton.addEventListener("click", enterMobileLive);
  startButton.addEventListener("click", function () {
    if (guidePage < guidePages.length - 1) {
      guidePage += 1;
      renderGuide();
      return;
    }
    prepareRound();
  });
  guideBack.addEventListener("click", function () {
    guidePage = Math.max(0, guidePage - 1);
    renderGuide();
  });
  fullscreenButton.addEventListener("click", toggleFullscreen);
  rotateFullscreenButton.addEventListener("click", requestImmersiveView);
  utsugiAssist.addEventListener("click", toggleAssist);
  encoreButton.addEventListener("click", function () {
    if (currentRound >= ROUND_LABELS.length) return;
    currentRound += 1;
    startRound();
  });
  beReveal.addEventListener("click", revealBeEnding);
  beBack.addEventListener("click", function () {
    bePage = Math.max(0, bePage - 1);
    renderBeEnding();
  });
  beNext.addEventListener("click", function () {
    bePage = Math.min(bePages.length - 1, bePage + 1);
    renderBeEnding();
  });
  addAchievementCart.addEventListener("click", addAchievementToCart);
  soundButton.addEventListener("click", function () {
    setSound(!soundOn);
    showAudioStatus(soundOn ? "声音已开启" : "声音已关闭");
  });

  document.addEventListener("keydown", function (event) {
    if (state !== "playing" || event.repeat) return;
    var lane = { "1": 0, "2": 1, "3": 2, "4": 3 }[event.key];
    if (typeof lane === "number") {
      event.preventDefault();
      handleLaneDown(lane, "key-" + event.key);
    }
  });
  document.addEventListener("keyup", function (event) {
    var lane = { "1": 0, "2": 1, "3": 2, "4": 3 }[event.key];
    if (typeof lane === "number") {
      event.preventDefault();
      handleLaneUp("key-" + event.key);
    }
  });

  window.addEventListener("blur", function () { releaseAllInputs(true); });
  window.addEventListener("resize", function () {
    resizeCanvas();
    syncOrientation();
  });
  window.addEventListener("orientationchange", function () {
    window.setTimeout(function () {
      resizeCanvas();
      syncOrientation();
    }, 120);
  });
  window.addEventListener("pageshow", function () {
    syncViewportHeight();
    syncFullscreenButtons();
    window.setTimeout(resizeCanvas, 80);
  });
  document.addEventListener("fullscreenchange", syncFullscreenButtons);
  document.addEventListener("webkitfullscreenchange", syncFullscreenButtons);
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", function () {
      syncViewportHeight();
      resizeCanvas();
    });
  }
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) releaseAllInputs(true);
    if (!audioContext) return;
    if (document.hidden) audioContext.suspend().catch(function () {});
    else if (soundOn) audioContext.resume().catch(function () {});
  });

  setSound(true);
  renderChargeValues();
  syncAchievementCartState();
  renderGuide();
  syncViewportHeight();
  syncFullscreenButtons();
  resizeCanvas();
  if (isMobile) mobileInvite.hidden = false;
  else {
    achievementGate.hidden = !achievementPending;
    roundGate.hidden = achievementPending;
  }
})();
