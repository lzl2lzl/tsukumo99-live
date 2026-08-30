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
  var roundChapter = document.getElementById("roundChapter");
  var roundChapterNumber = document.getElementById("roundChapterNumber");
  var roundChapterTitle = document.getElementById("roundChapterTitle");
  var resultGate = document.getElementById("resultGate");
  var resultRoundLabel = document.getElementById("resultRoundLabel");
  var resultScore = document.getElementById("resultScore");
  var encoreButton = document.getElementById("encoreButton");
  var beGate = document.getElementById("beGate");
  var beWeatherCanvas = document.getElementById("beWeatherCanvas");
  var beWeatherContext = beWeatherCanvas.getContext("2d", { alpha: true });
  var beStormIntro = document.getElementById("beStormIntro");
  var beReveal = document.getElementById("beReveal");
  var beStory = document.getElementById("beStory");
  var beSignal = document.getElementById("beSignal");
  var beProgress = document.getElementById("beProgress");
  var beBack = document.getElementById("beBack");
  var beContinue = document.getElementById("beContinue");
  var beExit = document.getElementById("beExit");
  var beBadgeStorm = document.getElementById("beBadgeStorm");
  var bePages = Array.prototype.slice.call(document.querySelectorAll("[data-be-page]"));
  var achievementGate = document.getElementById("achievementGate");
  if (achievementGate && !document.getElementById("achievementExit")) {
    achievementGate.innerHTML = '<div class="achievement-rays" aria-hidden="true"></div>'
      + '<span class="achievement-live">ACHIEVEMENT UNLOCKED</span>'
      + '<h1 id="achievementTitle">月云的兵</h1>'
      + '<p>恭喜你已获得成就“月云的兵”！</p>'
      + '<div class="achievement-actions"><button type="button" id="achievementRestart">重新开始</button>'
      + '<a href="index.html" id="achievementExit">退出游戏</a></div>';
  }
  var achievementRestart = document.getElementById("achievementRestart");
  var achievementExit = document.getElementById("achievementExit");
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

  var ROUND_MS = 15000;
  var BEAT_MS = 500;
  var TRAVEL_MS = 3200;
  var ROUND_LABELS = ["1", "2", "3", "4", "5", "6"];
  var ROUND_TITLES = [
    "RYO想要毁灭偶像",
    "TOMA召集大家思考对策",
    "MINAMI说这种事他习惯了",
    "TORAO说要不带RYO去他家饭店",
    "HARU邀请RYO成为ROCK STAR",
    "直到世界末日SHIRO的人生还是充满麻烦"
  ];
  var MIN_ROUND_DIFFICULTY = .5;
  var MAX_ROUND_DIFFICULTY = 2.35;
  var ROUND_DIFFICULTY_RATIO = Math.pow(MAX_ROUND_DIFFICULTY / MIN_ROUND_DIFFICULTY, 1 / (ROUND_LABELS.length - 1));
  var coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  var PERFECT_WINDOW = coarsePointer ? 105 : 86;
  var GOOD_WINDOW = coarsePointer ? 230 : 190;
  var laneLetters = ["Z", "O", "O", "L"];
  var laneMembers = ["TORAO", "HARUKA", "TOMA", "MINAMI"];
  var CHARGE_KEY = "tsukumo99-live-charge-v1";
  var ACHIEVEMENT_KEY = "tsukumo99-live-achievement-v1";
  var LEGACY_ACHIEVEMENT_SEEN_KEY = "tsukumo99-live-achievement-seen-v1";
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
  heroImage.src = "assets/hero-desktop-square.webp";
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
  var helperTapFrame = 0;
  var tauntTimer = 0;
  var statusTimer = 0;
  var chapterTimer = 0;
  var effectTimers = {};
  var effectFrames = {};
  var performerTimers = [0, 0, 0, 0];
  var performerFrames = [0, 0, 0, 0];
  var lanePulseEnds = [0, 0, 0, 0];
  var laneOwners = [null, null, null, null];
  var activeInputs = {};
  var chartNotes = [];
  var noteSequence = 0;
  var lastCropIndex = -1;
  var assistActive = false;
  var bePage = 0;
  var beLineStep = 0;
  var beEndingPending = false;
  var beWeatherFrame = 0;
  var beWeatherRunning = false;
  var beWeatherLastTime = 0;
  var beWeatherWidth = 1;
  var beWeatherHeight = 1;
  var beWeatherDpr = 1;
  var beCloudTexture = null;
  var beCloudTextureFar = null;
  var beCloudOpening = 0;
  var beCloudOpeningTarget = 0;
  var beCloudShift = 0;
  var beRainDrops = [];
  var beRainSplashes = [];
  var beNextLightningAt = 0;
  var currentRoundProfile = getRoundProfile(1);
  var openingNoteCounts = countOpeningNotes();
  var chargeGainByLane = openingNoteCounts.map(function (count) { return count ? 99 / count : 99; });
  var chargeValues = loadChargeValues();
  var achievementEarned = readStoredValue(ACHIEVEMENT_KEY) === "1" || chargeValues.every(function (value) { return value >= 99; });
  var achievementPending = achievementEarned;

  if (achievementEarned) {
    try {
      window.localStorage.setItem(ACHIEVEMENT_KEY, "1");
      window.localStorage.removeItem(LEGACY_ACHIEVEMENT_SEEN_KEY);
    } catch (error) {}
  }

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
  var lastCanvasFrameAt = 0;

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

  function roundTo25(value) {
    return Math.max(200, Math.round(value / 25) * 25);
  }

  function seededRandom(seed) {
    return function () {
      seed |= 0;
      seed = seed + 0x6D2B79F5 | 0;
      var value = Math.imul(seed ^ seed >>> 15, 1 | seed);
      value = value + Math.imul(value ^ value >>> 7, 61 | value) ^ value;
      return ((value ^ value >>> 14) >>> 0) / 4294967296;
    };
  }

  function buildNoiseLayer(columns, rows, random) {
    var values = new Float32Array(columns * rows);
    for (var index = 0; index < values.length; index += 1) values[index] = random();
    return { columns: columns, rows: rows, values: values };
  }

  function sampleNoiseLayer(layer, u, v) {
    var x = clamp(u, 0, 1) * (layer.columns - 1);
    var y = clamp(v, 0, 1) * (layer.rows - 1);
    var x0 = Math.floor(x);
    var y0 = Math.floor(y);
    var x1 = Math.min(layer.columns - 1, x0 + 1);
    var y1 = Math.min(layer.rows - 1, y0 + 1);
    var tx = x - x0;
    var ty = y - y0;
    tx = tx * tx * (3 - 2 * tx);
    ty = ty * ty * (3 - 2 * ty);
    var top = lerp(layer.values[y0 * layer.columns + x0], layer.values[y0 * layer.columns + x1], tx);
    var bottom = lerp(layer.values[y1 * layer.columns + x0], layer.values[y1 * layer.columns + x1], tx);
    return lerp(top, bottom, ty);
  }

  function createCloudTexture(seed, depth) {
    var texture = document.createElement("canvas");
    var textureWidth = Math.max(240, Math.min(560, Math.round(beWeatherWidth / 2.5)));
    var textureHeight = Math.max(130, Math.min(340, Math.round(beWeatherHeight / 2.2)));
    texture.width = textureWidth;
    texture.height = textureHeight;
    var textureContext = texture.getContext("2d");
    var image = textureContext.createImageData(textureWidth, textureHeight);
    var random = seededRandom(seed);
    var broad = buildNoiseLayer(7, 5, random);
    var body = buildNoiseLayer(17, 10, random);
    var detail = buildNoiseLayer(39, 22, random);
    var tint = depth ? { r: 20, g: 22, b: 35 } : { r: 25, g: 25, b: 38 };

    for (var y = 0; y < textureHeight; y += 1) {
      for (var x = 0; x < textureWidth; x += 1) {
        var u = x / Math.max(1, textureWidth - 1);
        var v = y / Math.max(1, textureHeight - 1);
        var noise = sampleNoiseLayer(broad, u, v) * .52
          + sampleNoiseLayer(body, u, v) * .31
          + sampleNoiseLayer(detail, u, v) * .17;
        var dome = Math.pow(Math.sin(clamp(v, 0, 1) * Math.PI), .42);
        var ceiling = 1 - Math.max(0, v - .6) * .58;
        var density = clamp((noise + dome * .3 + ceiling * .09 - .48) * 2.25, 0, 1);
        var shade = clamp(noise * .88 + dome * .2, 0, 1);
        var pixel = (y * textureWidth + x) * 4;
        image.data[pixel] = tint.r + shade * 31;
        image.data[pixel + 1] = tint.g + shade * 34;
        image.data[pixel + 2] = tint.b + shade * 45;
        image.data[pixel + 3] = density * (depth ? 205 : 238);
      }
    }
    textureContext.putImageData(image, 0, 0);
    return texture;
  }

  function resetBeRain() {
    var random = seededRandom(Math.round(beWeatherWidth * 13 + beWeatherHeight * 7));
    var count = Math.max(78, Math.min(250, Math.round(beWeatherWidth * beWeatherHeight / 4200)));
    beRainDrops = [];
    beRainSplashes = [];
    for (var index = 0; index < count; index += 1) {
      var depth = .28 + random() * .72;
      beRainDrops.push({
        x: random() * (beWeatherWidth + 220),
        y: random() * beWeatherHeight,
        depth: depth,
        length: 8 + depth * 34,
        speed: 8 + depth * 17,
        alpha: .1 + depth * .48
      });
    }
  }

  function resizeBeWeather() {
    var rect = broadcast.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    beWeatherWidth = rect.width;
    beWeatherHeight = rect.height;
    beWeatherDpr = Math.min(coarsePointer ? 1.2 : 1.5, window.devicePixelRatio || 1);
    beWeatherCanvas.width = Math.max(1, Math.round(beWeatherWidth * beWeatherDpr));
    beWeatherCanvas.height = Math.max(1, Math.round(beWeatherHeight * beWeatherDpr));
    beWeatherCanvas.style.width = beWeatherWidth + "px";
    beWeatherCanvas.style.height = beWeatherHeight + "px";
    beWeatherContext.setTransform(beWeatherDpr, 0, 0, beWeatherDpr, 0, 0);
    beCloudTextureFar = createCloudTexture(9919, true);
    beCloudTexture = createCloudTexture(20999, false);
    resetBeRain();
  }

  function drawSplitCloudLayer(texture, opening, drift, alpha, overscan) {
    if (!texture) return;
    var width = beWeatherWidth + overscan * 2;
    var height = beWeatherHeight + overscan * 2;
    var split = beWeatherWidth / 2;
    var travel = opening * beWeatherWidth * .46;
    beWeatherContext.save();
    beWeatherContext.globalAlpha = alpha;
    beWeatherContext.beginPath();
    beWeatherContext.rect(0, 0, split, beWeatherHeight);
    beWeatherContext.clip();
    beWeatherContext.drawImage(texture, -overscan + drift - travel, -overscan, width, height);
    beWeatherContext.restore();

    beWeatherContext.save();
    beWeatherContext.globalAlpha = alpha;
    beWeatherContext.beginPath();
    beWeatherContext.rect(split, 0, split, beWeatherHeight);
    beWeatherContext.clip();
    beWeatherContext.drawImage(texture, -overscan + drift + travel, -overscan, width, height);
    beWeatherContext.restore();
  }

  function drawBeClouds() {
    var context = beWeatherContext;
    var opening = beCloudOpening;
    context.fillStyle = "rgba(3,5,10," + (.56 * (1 - opening * .8)) + ")";
    context.fillRect(0, 0, beWeatherWidth, beWeatherHeight);
    drawSplitCloudLayer(beCloudTextureFar, opening * .72, Math.sin(beCloudShift * .45) * 18, .82, 28);
    drawSplitCloudLayer(beCloudTexture, opening, Math.cos(beCloudShift * .62) * 12, .96, 16);

    if (opening > .02) {
      context.save();
      context.globalCompositeOperation = "destination-out";
      context.translate(beWeatherWidth / 2, beWeatherHeight * .5);
      context.scale(1.65, 1);
      var radius = Math.max(beWeatherWidth, beWeatherHeight) * (.03 + opening * .55);
      var clearing = context.createRadialGradient(0, 0, radius * .08, 0, 0, radius);
      clearing.addColorStop(0, "rgba(0,0,0,1)");
      clearing.addColorStop(.68, "rgba(0,0,0,.94)");
      clearing.addColorStop(1, "rgba(0,0,0,0)");
      context.fillStyle = clearing;
      context.fillRect(-beWeatherWidth, -beWeatherHeight, beWeatherWidth * 2, beWeatherHeight * 2);
      context.restore();
    }
  }

  function drawBeRain(delta) {
    var context = beWeatherContext;
    var intensity = bePage === bePages.length - 1 && beGate.classList.contains("is-cleared") ? .18 : 1;
    context.lineCap = "round";
    for (var index = 0; index < beRainDrops.length; index += 1) {
      var drop = beRainDrops[index];
      var travel = delta / 16.67;
      drop.x -= drop.speed * .32 * travel;
      drop.y += drop.speed * travel;
      if (drop.y > beWeatherHeight + drop.length || drop.x < -drop.length) {
        if (drop.depth > .72 && Math.random() < .32) {
          beRainSplashes.push({ x: clamp(drop.x, 0, beWeatherWidth), life: 1, depth: drop.depth });
        }
        drop.x = Math.random() * (beWeatherWidth + 180) + 80;
        drop.y = -drop.length - Math.random() * beWeatherHeight * .35;
      }
      if (index / beRainDrops.length > intensity) continue;
      context.beginPath();
      context.moveTo(drop.x, drop.y);
      context.lineTo(drop.x + drop.length * .22, drop.y - drop.length);
      context.strokeStyle = "rgba(205,222,239," + (drop.alpha * intensity) + ")";
      context.lineWidth = .45 + drop.depth * 1.35;
      context.stroke();
    }

    for (var splashIndex = beRainSplashes.length - 1; splashIndex >= 0; splashIndex -= 1) {
      var splash = beRainSplashes[splashIndex];
      splash.life -= delta / 280;
      if (splash.life <= 0) {
        beRainSplashes.splice(splashIndex, 1);
        continue;
      }
      var spread = (1 - splash.life) * 15 * splash.depth;
      context.beginPath();
      context.moveTo(splash.x, beWeatherHeight - 2);
      context.quadraticCurveTo(splash.x - spread * .55, beWeatherHeight - 4 - spread * .4, splash.x - spread, beWeatherHeight - 2);
      context.moveTo(splash.x, beWeatherHeight - 2);
      context.quadraticCurveTo(splash.x + spread * .55, beWeatherHeight - 4 - spread * .4, splash.x + spread, beWeatherHeight - 2);
      context.strokeStyle = "rgba(218,232,247," + (splash.life * .4) + ")";
      context.lineWidth = 1;
      context.stroke();
    }
  }

  function triggerBeLightning(now) {
    if (bePage === bePages.length - 1 && beGate.classList.contains("is-cleared")) return;
    beGate.classList.remove("is-lightning");
    void beGate.offsetWidth;
    beGate.classList.add("is-lightning");
    window.setTimeout(function () { beGate.classList.remove("is-lightning"); }, 360);
    beNextLightningAt = now + 3600 + Math.random() * 4300;
  }

  function renderBeWeather(now) {
    if (!beWeatherRunning || beGate.hidden) {
      beWeatherRunning = false;
      return;
    }
    var delta = Math.min(40, Math.max(8, now - (beWeatherLastTime || now - 16)));
    beWeatherLastTime = now;
    beCloudOpening += (beCloudOpeningTarget - beCloudOpening) * Math.min(1, delta * .0048);
    beCloudShift += delta * .00055;
    beWeatherContext.setTransform(beWeatherDpr, 0, 0, beWeatherDpr, 0, 0);
    beWeatherContext.clearRect(0, 0, beWeatherWidth, beWeatherHeight);
    drawBeClouds();
    if (!reduceMotion) drawBeRain(delta);
    if (reduceMotion) {
      beWeatherRunning = false;
      return;
    }
    if (!reduceMotion && now >= beNextLightningAt) triggerBeLightning(now);
    beWeatherFrame = window.requestAnimationFrame(renderBeWeather);
  }

  function startBeWeather() {
    resizeBeWeather();
    beWeatherRunning = true;
    beWeatherLastTime = 0;
    beNextLightningAt = performance.now() + 850;
    window.cancelAnimationFrame(beWeatherFrame);
    beWeatherFrame = window.requestAnimationFrame(renderBeWeather);
  }

  function getRoundProfile(round) {
    var index = clamp(Math.round(Number(round) || 1) - 1, 0, ROUND_LABELS.length - 1);
    var difficulty = MIN_ROUND_DIFFICULTY * Math.pow(ROUND_DIFFICULTY_RATIO, index);
    var progress = index / (ROUND_LABELS.length - 1);
    return {
      index: index,
      label: ROUND_LABELS[index],
      difficulty: difficulty,
      stepMs: roundTo25(BEAT_MS / difficulty),
      holdRate: index === 0 ? 0 : .035 * difficulty,
      chordRate: index < 2 ? 0 : .045 * difficulty,
      obstacleMeanMs: 3700 / difficulty,
      obstacleJitter: .22,
      obstacleDuration: Math.round(1450 + 600 * progress),
      handChance: .5 + .2 * progress
    };
  }

  function occursAtRate(step, rate, phase) {
    if (!rate) return false;
    return Math.floor((step + 1) * rate + phase) > Math.floor(step * rate + phase);
  }

  function createRoundPlan(round, startTime) {
    var profile = getRoundProfile(round);
    var pattern = lanePatterns[profile.index % lanePatterns.length];
    var laneBusyUntil = [0, 0, 0, 0];
    var plan = [];
    var hitAt = startTime + TRAVEL_MS;
    var finalHitAt = startTime + ROUND_MS - 320;
    var step = 0;
    while (hitAt <= finalHitAt) {
      var lane = pattern[step % pattern.length];
      for (var attempt = 0; attempt < 4 && laneBusyUntil[lane] > hitAt; attempt += 1) lane = (lane + 1) % 4;

      var candidateHoldDuration = Math.max(650, Math.round(profile.stepMs * (step % 2 ? 2 : 2.5)));
      var isHold = profile.index > 0 && occursAtRate(step, profile.holdRate, .8) && hitAt + candidateHoldDuration <= startTime + ROUND_MS - 250;
      var isOpeningChord = profile.index === 1 && hitAt + profile.stepMs > finalHitAt;
      var isChord = !isHold && (isOpeningChord || occursAtRate(step, profile.chordRate, .43));
      var holdDuration = isHold ? candidateHoldDuration : 0;
      var chordId = isChord ? "chord-" + profile.label + "-" + step : "";

      plan.push({ lane: lane, hitAt: hitAt, kind: isHold ? "hold" : "tap", holdDuration: holdDuration, chord: chordId });
      if (isHold) laneBusyUntil[lane] = hitAt + holdDuration + profile.stepMs * .4;
      if (isChord) {
        var secondLane = (lane + 2) % 4;
        for (var secondAttempt = 0; secondAttempt < 4 && (secondLane === lane || laneBusyUntil[secondLane] > hitAt); secondAttempt += 1) secondLane = (secondLane + 1) % 4;
        if (secondLane !== lane && laneBusyUntil[secondLane] <= hitAt) {
          plan.push({ lane: secondLane, hitAt: hitAt, kind: "tap", holdDuration: 0, chord: chordId });
        }
      }
      hitAt += profile.stepMs;
      step += 1;
    }
    return plan;
  }

  function countOpeningNotes() {
    var counts = [0, 0, 0, 0];
    [1, 2].forEach(function (round) {
      createRoundPlan(round, 0).forEach(function (note) { counts[note.lane] += 1; });
    });
    return counts;
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
      var displayValue = Math.min(99, Math.floor(value + .0001));
      var output = card.querySelector(".charge-value");
      card.style.setProperty("--charge", value);
      card.style.setProperty("--charge-empty", 100 - value);
      card.classList.toggle("is-full", value >= 99);
      card.setAttribute("aria-label", laneLetters[lane] + " 轨道 " + laneMembers[lane] + "，应援能量 " + displayValue + "%");
      if (output) output.textContent = displayValue + "%";
    });
  }

  function unlockAchievement() {
    if (achievementEarned || achievementPending) return;
    achievementEarned = true;
    achievementPending = true;
    try {
      window.localStorage.setItem(ACHIEVEMENT_KEY, "1");
      window.localStorage.removeItem(LEGACY_ACHIEVEMENT_SEEN_KEY);
    } catch (error) {}
    showAudioStatus("成就解锁：月云的兵");
    playSound("full");
    vibrate([24, 34, 24, 34, 60]);
  }

  function chargePerformer(lane) {
    if (chargeValues[lane] >= 99) return;
    var nextValue = chargeValues[lane] + chargeGainByLane[lane];
    chargeValues[lane] = nextValue >= 98.999 ? 99 : Math.min(99, nextValue);
    saveChargeValues();
    renderChargeValues();
    if (chargeValues[lane] >= 99) celebrateFullCard(lane);
    if (chargeValues.every(function (value) { return value >= 99; })) unlockAchievement();
  }

  function restartAchievementRun() {
    if (state === "loading" || state === "playing") return;
    achievementRestart.disabled = true;
    window.cancelAnimationFrame(frameRequest);
    window.clearTimeout(obstacleTimer);
    window.clearTimeout(helperTapTimer);
    window.clearTimeout(tauntTimer);
    Object.keys(effectTimers).forEach(function (className) {
      window.clearTimeout(effectTimers[className]);
      broadcast.classList.remove(className);
    });
    effectTimers = {};
    performerTimers.forEach(function (timer) { window.clearTimeout(timer); });
    performerTimers = [0, 0, 0, 0];
    releaseAllInputs(false);
    clearObstacles();
    setAssist(false);
    effectLayer.replaceChildren();
    hitCallout.textContent = "";
    hitCallout.className = "hit-callout";
    chartNotes = [];
    noteSequence = 0;
    lastCropIndex = -1;
    currentRound = 1;
    hits = 0;
    combo = 0;
    maxCombo = 0;
    misses = 0;
    chargeValues = [0, 0, 0, 0];
    achievementEarned = false;
    achievementPending = false;
    beEndingPending = false;
    bePage = 0;
    try {
      window.localStorage.removeItem(CHARGE_KEY);
      window.localStorage.removeItem(ACHIEVEMENT_KEY);
      window.localStorage.removeItem(LEGACY_ACHIEVEMENT_SEEN_KEY);
    } catch (error) {}
    renderChargeValues();
    updateScore();
    roundNumber.textContent = ROUND_LABELS[0];
    roundTimer.textContent = "00:15";
    resultGate.hidden = true;
    beGate.hidden = true;
    achievementGate.hidden = true;
    showAudioStatus("应援值已清零 · ROUND 1");
    startRound();
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
    // Large WAV files must never block the round. playSound() already has a
    // streaming fallback, so each layer is fetched only when it is first used.
    loadingPromise = Promise.resolve(true);
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
    window.cancelAnimationFrame(effectFrames[className]);
    broadcast.classList.remove(className);
    effectFrames[className] = window.requestAnimationFrame(function () {
      broadcast.classList.add(className);
      effectTimers[className] = window.setTimeout(function () {
        broadcast.classList.remove(className);
      }, duration);
    });
  }

  function fireButton(button) {
    window.clearTimeout(button._firingTimer);
    window.cancelAnimationFrame(button._firingFrame);
    button.classList.remove("firing");
    button._firingFrame = window.requestAnimationFrame(function () {
      button.classList.add("firing");
      button._firingTimer = window.setTimeout(function () { button.classList.remove("firing"); }, 180);
    });
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
    window.cancelAnimationFrame(hitCallout._judgmentFrame);
    hitCallout._judgmentFrame = window.requestAnimationFrame(function () {
      hitCallout.classList.add("show");
    });
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
    geometry.dpr = Math.min(coarsePointer ? 1.35 : 1.75, window.devicePixelRatio || 1);
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
    createRoundPlan(currentRound, startTime).forEach(function (note) {
      addChartNote(note.lane, note.hitAt, note.kind, note.holdDuration, note.chord);
    });
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
    window.cancelAnimationFrame(performerFrames[lane]);
    card.classList.remove("is-hit", "is-perfect");
    performerFrames[lane] = window.requestAnimationFrame(function () {
      card.classList.add("is-hit");
      if (perfect) {
        card.classList.add("is-perfect");
        launchPerfectBeam(lane);
      }
      performerTimers[lane] = window.setTimeout(function () {
        card.classList.remove("is-hit", "is-perfect");
      }, perfect ? 760 : 440);
    });
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
    var pad = geometry.pads[lane];
    if (!pad) return;
    if (immediate) utsugiAutoplay.style.transition = "none";
    utsugiAutoplay.style.setProperty("--helper-x", pad.x + "px");
    utsugiAutoplay.style.setProperty("--helper-y", pad.y - pad.radius * .56 + "px");
    if (immediate) {
      utsugiAutoplay.getBoundingClientRect();
      utsugiAutoplay.style.transition = "";
    }
    window.clearTimeout(helperTapTimer);
    window.cancelAnimationFrame(helperTapFrame);
    utsugiAutoplay.classList.remove("is-tapping");
    helperTapFrame = window.requestAnimationFrame(function () {
      utsugiAutoplay.classList.add("is-tapping");
      helperTapTimer = window.setTimeout(function () { utsugiAutoplay.classList.remove("is-tapping"); }, 380);
    });
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
    window.cancelAnimationFrame(ryoTaunt._tauntFrame);
    ryoTaunt.classList.remove("show");
    ryoTaunt._tauntFrame = window.requestAnimationFrame(function () {
      ryoTaunt.classList.add("show");
      tauntTimer = window.setTimeout(function () { ryoTaunt.classList.remove("show"); }, 1220);
    });
  }

  function spawnRyoObstacle() {
    if (state !== "playing" || reduceMotion) return;
    var obstacleRoll = Math.random();
    var variant = obstacleRoll < currentRoundProfile.handChance ? "obstacle-hand" : (obstacleRoll < currentRoundProfile.handChance + (1 - currentRoundProfile.handChance) * .48 ? "obstacle-peek" : "obstacle-sweep");
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
    window.setTimeout(function () { obstacle.remove(); }, currentRoundProfile.obstacleDuration);
  }

  function scheduleObstacle() {
    if (state !== "playing") return;
    var jitter = 1 + (Math.random() * 2 - 1) * currentRoundProfile.obstacleJitter;
    obstacleTimer = window.setTimeout(function () {
      spawnRyoObstacle();
      scheduleObstacle();
    }, currentRoundProfile.obstacleMeanMs * jitter);
  }

  function clearObstacles() {
    window.clearTimeout(obstacleTimer);
    Array.prototype.slice.call(obstacleLayer.children).forEach(function (obstacle) { obstacle.remove(); });
  }

  function gameFrame(now) {
    if (state !== "playing") return;
    autoJudgeReadyNotes(now);
    processNotes(now);
    // Keep judgments at native refresh rate, but avoid redrawing the whole
    // stage 90/120 times per second on high-refresh mobile displays.
    if (!lastCanvasFrameAt || now - lastCanvasFrameAt >= 14.5) {
      renderCanvas(now);
      lastCanvasFrameAt = now;
    }
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
    setAssist(false);
    clearObstacles();
    roundTimer.textContent = "00:00";
    releaseAllInputs(false);
    laneButtons.forEach(function (button) { button.disabled = true; });
    broadcast.classList.remove("is-playing");
    playSound("full");
    var roundIndex = Math.min(currentRound - 1, ROUND_LABELS.length - 1);
    resultRoundLabel.textContent = "ROUND " + ROUND_LABELS[roundIndex] + "　" + ROUND_TITLES[roundIndex];
    resultScore.textContent = padNumber(hits, 3);
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
    else if (achievementPending) {
      achievementRestart.disabled = false;
      window.setTimeout(function () { achievementRestart.focus(); }, 180);
    }
  }

  function beginRoundGameplay() {
    state = "playing";
    hits = 0;
    combo = 0;
    maxCombo = 0;
    misses = 0;
    tapSoundIndex = 0;
    lastCanvasFrameAt = 0;
    activeInputs = {};
    laneOwners = [null, null, null, null];
    lanePulseEnds = [0, 0, 0, 0];
    assistActive = false;
    clearObstacles();
    resizeCanvas();
    updateScore();
    currentRoundProfile = getRoundProfile(currentRound);
    roundNumber.textContent = ROUND_LABELS[Math.min(currentRound - 1, ROUND_LABELS.length - 1)];
    roundTimer.textContent = "00:15";
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

  function startRound() {
    var roundIndex = Math.min(currentRound - 1, ROUND_LABELS.length - 1);
    state = "chapter";
    window.clearTimeout(chapterTimer);
    roundNumber.textContent = ROUND_LABELS[roundIndex];
    roundTimer.textContent = "00:15";
    roundGate.hidden = true;
    resultGate.hidden = true;
    beGate.hidden = true;
    achievementGate.hidden = true;
    roundChapterNumber.textContent = "ROUND " + ROUND_LABELS[roundIndex];
    roundChapterTitle.textContent = ROUND_TITLES[roundIndex];
    roundChapter.hidden = false;
    laneButtons.forEach(function (button) { button.disabled = true; });
    playSound(currentRound === 1 ? "core" : "bubble");
    chapterTimer = window.setTimeout(function () {
      roundChapter.hidden = true;
      beginRoundGameplay();
    }, reduceMotion ? 550 : 1750);
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

  function getBeLines(page) {
    return page ? Array.prototype.slice.call(page.querySelectorAll("[data-be-line]")) : [];
  }

  function createBadgeStorm() {
    var fragment = document.createDocumentFragment();
    beBadgeStorm.innerHTML = "";
    for (var index = 0; index < 36; index += 1) {
      var badge = document.createElement("i");
      badge.className = "crop-" + index % 4;
      badge.style.setProperty("--badge-left", Math.random() * 98 + "%");
      badge.style.setProperty("--badge-size", 34 + Math.random() * 46 + "px");
      badge.style.setProperty("--badge-duration", 3.4 + Math.random() * 3.2 + "s");
      badge.style.setProperty("--badge-delay", -Math.random() * 5.8 + "s");
      badge.style.setProperty("--badge-drift", -8 + Math.random() * 16 + "vw");
      badge.style.setProperty("--badge-spin", -180 + Math.random() * 720 + "deg");
      fragment.appendChild(badge);
    }
    beBadgeStorm.appendChild(fragment);
  }

  function renderBeEnding() {
    bePages.forEach(function (page, index) {
      var active = index === bePage;
      page.classList.toggle("is-active", active);
      page.setAttribute("aria-hidden", String(!active));
      getBeLines(page).forEach(function (line, lineIndex) {
        line.classList.toggle("is-revealed", active && lineIndex <= beLineStep);
      });
    });
    beProgress.textContent = bePage + 1 + " / " + bePages.length;
    beGate.classList.toggle("is-bad-world", bePage === 1);
    beGate.classList.toggle("is-fakeout", bePage === 3);
    beSignal.lastChild.nodeValue = bePage === 3 ? "SIGNAL BACK" : "SIGNAL LOST";
    if (bePage === 1 && !beBadgeStorm.classList.contains("is-active")) {
      createBadgeStorm();
      beBadgeStorm.classList.add("is-active");
    } else if (bePage !== 1) {
      beBadgeStorm.classList.remove("is-active");
    }
    beBack.hidden = bePage === 0;
    beExit.hidden = bePage !== bePages.length - 1;
    beContinue.hidden = bePage === bePages.length - 1;
  }

  function advanceBeEnding() {
    var lines = getBeLines(bePages[bePage]);
    if (beLineStep < lines.length - 1) {
      beLineStep += 1;
      renderBeEnding();
      playNextTapSound();
      vibrate(8);
      return;
    }
    if (bePage >= bePages.length - 1) return;
    bePage += 1;
    beLineStep = 0;
    renderBeEnding();
    playSound(bePage === 1 ? "violet" : bePage === 3 ? "full" : "bubble");
    vibrate(bePage === 1 ? [18, 26, 18] : 10);
  }

  function resetBeEnding() {
    bePage = 0;
    beLineStep = 0;
    beCloudOpening = 0;
    beCloudOpeningTarget = 0;
    beBadgeStorm.innerHTML = "";
    beBadgeStorm.classList.remove("is-active");
    beGate.classList.remove("is-cleared", "is-bad-world", "is-fakeout", "is-lightning");
    beStormIntro.hidden = false;
    beStormIntro.removeAttribute("aria-hidden");
    beReveal.hidden = false;
    beStory.hidden = true;
    renderBeEnding();
    startBeWeather();
    window.setTimeout(function () { beReveal.focus(); }, 120);
  }

  function revealBeEnding() {
    beGate.classList.add("is-cleared");
    beCloudOpeningTarget = 1;
    playSound("full");
    vibrate([16, 32, 18]);
    if (reduceMotion) {
      beCloudOpening = 1;
      startBeWeather();
    }
    beReveal.hidden = true;
    window.setTimeout(function () {
      beStormIntro.hidden = true;
      beStormIntro.setAttribute("aria-hidden", "true");
      beStory.hidden = false;
      renderBeEnding();
      beStory.focus({ preventScroll: true });
    }, reduceMotion ? 0 : 900);
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
  beBack.addEventListener("click", function (event) {
    event.stopPropagation();
    bePage = Math.max(0, bePage - 1);
    beLineStep = Math.max(0, getBeLines(bePages[bePage]).length - 1);
    renderBeEnding();
    playSound("bubble");
  });
  beStory.addEventListener("click", function (event) {
    if (event.target.closest("a,button")) return;
    advanceBeEnding();
  });
  beStory.addEventListener("keydown", function (event) {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    advanceBeEnding();
  });
  achievementRestart.addEventListener("click", restartAchievementRun);
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
    if (!beGate.hidden) resizeBeWeather();
    syncOrientation();
  });
  window.addEventListener("orientationchange", function () {
    window.setTimeout(function () {
      resizeCanvas();
      if (!beGate.hidden) resizeBeWeather();
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
      if (!beGate.hidden) resizeBeWeather();
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
  renderGuide();
  syncViewportHeight();
  syncFullscreenButtons();
  resizeCanvas();
  if (isMobile) mobileInvite.hidden = false;
  else {
    achievementGate.hidden = !achievementPending;
    roundGate.hidden = achievementPending;
  }
  window.requestAnimationFrame(function () {
    window.requestAnimationFrame(function () {
      document.documentElement.classList.add("live-ready");
      var liveBoot = document.getElementById("liveBoot");
      if (liveBoot) window.setTimeout(function () { liveBoot.remove(); }, 360);
    });
  });
})();
