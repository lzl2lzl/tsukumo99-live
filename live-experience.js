(function () {
  "use strict";

  var broadcast = document.getElementById("broadcast");
  var mobileInvite = document.getElementById("mobileInvite");
  var joinButton = document.getElementById("joinButton");
  var rotateGate = document.getElementById("rotateGate");
  var roundGate = document.getElementById("roundGate");
  var startButton = document.getElementById("startButton");
  var loadStatus = document.getElementById("loadStatus");
  var resultGate = document.getElementById("resultGate");
  var resultScore = document.getElementById("resultScore");
  var resultMaxCombo = document.getElementById("resultMaxCombo");
  var encoreButton = document.getElementById("encoreButton");
  var soundButton = document.getElementById("soundButton");
  var roundNumber = document.getElementById("roundNumber");
  var roundTimer = document.getElementById("roundTimer");
  var hitCount = document.getElementById("hitCount");
  var comboCount = document.getElementById("comboCount");
  var targetField = document.getElementById("targetField");
  var obstacleLayer = document.getElementById("obstacleLayer");
  var effectLayer = document.getElementById("effectLayer");
  var hitCallout = document.getElementById("hitCallout");
  var audioStatus = document.getElementById("audioStatus");
  var utsugiAssist = document.getElementById("utsugiAssist");
  var assistStatus = document.getElementById("assistStatus");
  var assistCount = document.getElementById("assistCount");
  var laneButtons = Array.prototype.slice.call(document.querySelectorAll(".lane-button"));
  var rhythmTracks = Array.prototype.slice.call(document.querySelectorAll(".rhythm-track"));
  var performerCards = Array.prototype.slice.call(document.querySelectorAll(".performer-card"));

  var audioFiles = {
    bubble: "assets/audio/grape-nectar/bubble-grain.wav",
    violet: "assets/audio/grape-nectar/violet-pad.wav",
    core: "assets/audio/grape-nectar/main-core.wav",
    full: "assets/audio/grape-nectar/full.wav"
  };
  var laneEffects = ["core", "bubble", "bubble", "violet"];
  var laneLetters = ["Z", "O", "O", "L"];
  var tailAngles = [23, 8, -8, -23];
  var partCrops = [
    { name: "脸", size: 300, x: 24, y: 24 },
    { name: "眼睛", size: 500, x: 29, y: 24 },
    { name: "嘴", size: 500, x: 35, y: 41 },
    { name: "头发", size: 400, x: 19, y: 13 },
    { name: "麦克风与手", size: 400, x: 21, y: 58 },
    { name: "抬起的手", size: 400, x: 97, y: 63 },
    { name: "衣领", size: 400, x: 40, y: 63 },
    { name: "舞台服", size: 350, x: 46, y: 85 }
  ];
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var userAgent = navigator.userAgent || "";
  var isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(userAgent) ||
    (/Macintosh/i.test(userAgent) && navigator.maxTouchPoints > 1) ||
    (navigator.maxTouchPoints > 1 && Math.min(screen.width, screen.height) < 900);

  var state = "idle";
  var mobileAccepted = false;
  var currentRound = 1;
  var hits = 0;
  var combo = 0;
  var maxCombo = 0;
  var misses = 0;
  var roundEndsAt = 0;
  var spawnTimer = 0;
  var obstacleTimer = 0;
  var assistTimer = 0;
  var timerFrame = 0;
  var effectTimers = {};
  var statusTimer = 0;
  var lastCropIndex = -1;
  var activeInputs = {};
  var laneOwners = [null, null, null, null];
  var performerTimers = [0, 0, 0, 0];
  var assistActive = false;
  var assistUsed = false;

  var audioContext = null;
  var masterGain = null;
  var audioBuffers = {};
  var fallbackAudio = {};
  var activeSources = {};
  var loadingPromise = null;
  var soundOn = true;

  Object.keys(audioFiles).forEach(function (name) {
    fallbackAudio[name] = null;
  });

  function padNumber(value, length) {
    return String(value).padStart(length, "0");
  }

  function showAudioStatus(message) {
    window.clearTimeout(statusTimer);
    audioStatus.textContent = message;
    audioStatus.classList.add("show");
    statusTimer = window.setTimeout(function () {
      audioStatus.classList.remove("show");
    }, 2200);
  }

  function setSound(on) {
    soundOn = on;
    soundButton.textContent = on ? "SOUND ON" : "SOUND OFF";
    soundButton.setAttribute("aria-pressed", String(on));
    if (masterGain && audioContext) {
      masterGain.gain.setTargetAtTime(on ? 0.72 : 0, audioContext.currentTime, 0.025);
    }
    Object.keys(fallbackAudio).forEach(function (name) {
      if (fallbackAudio[name]) fallbackAudio[name].muted = !on;
    });
  }

  function createAudioContext() {
    if (audioContext) return audioContext;
    var Context = window.AudioContext || window.webkitAudioContext;
    if (!Context) return null;
    audioContext = new Context();
    masterGain = audioContext.createGain();
    masterGain.gain.value = soundOn ? 0.72 : 0;
    masterGain.connect(audioContext.destination);
    return audioContext;
  }

  function decodeAudio(context, data) {
    return new Promise(function (resolve, reject) {
      var settled = false;
      function done(buffer) {
        if (!settled) {
          settled = true;
          resolve(buffer);
        }
      }
      function fail(error) {
        if (!settled) {
          settled = true;
          reject(error);
        }
      }
      try {
        var result = context.decodeAudioData(data, done, fail);
        if (result && typeof result.then === "function") result.then(done).catch(fail);
      } catch (error) {
        fail(error);
      }
    });
  }

  function loadAudio() {
    if (loadingPromise) return loadingPromise;
    var context = createAudioContext();
    if (!context) {
      loadingPromise = Promise.resolve(false);
      return loadingPromise;
    }
    context.resume().catch(function () {});
    loadingPromise = Promise.all(Object.keys(audioFiles).map(function (name) {
      return fetch(audioFiles[name]).then(function (response) {
        if (!response.ok) throw new Error("Audio fetch failed");
        return response.arrayBuffer();
      }).then(function (data) {
        return decodeAudio(context, data);
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

  function spawnBubbles(x, y, count) {
    if (reduceMotion) return;
    for (var index = 0; index < count; index += 1) {
      var particle = document.createElement("i");
      particle.className = "bubble-particle";
      particle.style.left = (x - 12 + Math.random() * 24) + "px";
      particle.style.top = (y - 8 + Math.random() * 18) + "px";
      particle.style.setProperty("--drift", (-70 + Math.random() * 140) + "px");
      particle.style.animationDelay = (Math.random() * 0.12) + "s";
      effectLayer.appendChild(particle);
      window.setTimeout((function (node) {
        return function () { node.remove(); };
      })(particle), 1700);
    }
  }

  function triggerEffect(effect, x, y) {
    var effectX = typeof x === "number" ? x : window.innerWidth / 2;
    var effectY = typeof y === "number" ? y : window.innerHeight * 0.62;
    restartClass("fx-hit", 250);
    if (effect === "core") restartClass("fx-core", 1550);
    if (effect === "violet") restartClass("fx-violet", 1350);
    if (effect === "bubble") spawnBubbles(effectX, effectY, 18);
    playSound(effect);
    vibrate(effect === "bubble" ? [12, 20, 12] : 20);
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

  function pulseTrack(lane) {
    var track = rhythmTracks[lane];
    if (!track) return;
    track.classList.remove("pulse");
    track.getBoundingClientRect();
    track.classList.add("pulse");
    window.setTimeout(function () { track.classList.remove("pulse"); }, 380);
  }

  function launchPerfectBeam(lane) {
    if (reduceMotion || !performerCards[lane]) return;
    var padRect = laneButtons[lane].querySelector(".letter").getBoundingClientRect();
    var cardRect = performerCards[lane].getBoundingClientRect();
    var startX = padRect.left + padRect.width / 2;
    var startY = padRect.top + padRect.height / 2;
    var endX = cardRect.left + cardRect.width / 2;
    var endY = cardRect.top + cardRect.height * 0.72;
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

  function freezeTarget(target, rect) {
    target.style.animation = "none";
    target.style.left = rect.left + "px";
    target.style.top = rect.top + "px";
    target.style.width = rect.width + "px";
    target.style.transform = "scale(1)";
    target.getBoundingClientRect();
  }

  function resolveHit(target, label, tone) {
    if (state !== "playing" || !target || target.classList.contains("resolved")) return;
    var rect = target.getBoundingClientRect();
    var lane = Number(target.dataset.lane);
    target.classList.add("resolved");
    window.clearTimeout(target._holdTimer);
    window.clearTimeout(target._reducedReadyTimer);
    window.clearTimeout(target._reducedTimer);
    freezeTarget(target, rect);
    target.classList.remove("holding");
    target.classList.add("hit");
    hits += 1;
    combo += 1;
    maxCombo = Math.max(maxCombo, combo);
    updateScore();
    showJudgment(label, tone);
    pulseTrack(lane);
    pulsePerformer(lane, label.indexOf("PERFECT") !== -1);
    triggerEffect(target.dataset.effect, rect.left + rect.width / 2, rect.top + rect.height / 2);
    window.setTimeout(function () { target.remove(); }, reduceMotion ? 30 : 340);
  }

  function markMiss(target, label, tone) {
    if (state !== "playing" || !target || target.classList.contains("resolved")) return;
    var rect = target.getBoundingClientRect();
    var lane = Number(target.dataset.lane);
    target.classList.add("resolved");
    window.clearTimeout(target._holdTimer);
    window.clearTimeout(target._reducedReadyTimer);
    window.clearTimeout(target._reducedTimer);
    freezeTarget(target, rect);
    target.classList.remove("holding");
    target.classList.add("missed");
    combo = 0;
    misses += 1;
    updateScore();
    showJudgment(label || "MISS", tone || "miss");
    pulseTrack(lane);
    vibrate([14, 22, 14]);
    window.setTimeout(function () { target.remove(); }, reduceMotion ? 30 : 300);
  }

  function findLaneCandidate(lane) {
    var padRect = laneButtons[lane].querySelector(".letter").getBoundingClientRect();
    var padX = padRect.left + padRect.width / 2;
    var padY = padRect.top + padRect.height / 2;
    var best = null;
    Array.prototype.slice.call(targetField.querySelectorAll('.flying-target[data-lane="' + lane + '"]:not(.resolved):not(.holding)')).forEach(function (target) {
      var rect = target.getBoundingClientRect();
      var distance = Math.hypot(rect.left + rect.width / 2 - padX, rect.top + rect.height / 2 - padY);
      if (!best || distance < best.distance) best = { target: target, distance: distance, padWidth: padRect.width };
    });
    return best;
  }

  function completeHold(target, token) {
    if (state !== "playing" || !target || target._inputToken !== token || !target.classList.contains("holding")) return;
    var record = activeInputs[token];
    if (record) {
      record.hold = false;
      record.target = null;
    }
    target._inputToken = null;
    laneButtons[Number(target.dataset.lane)].classList.remove("holding-pad");
    resolveHit(target, target._holdGrade === "PERFECT" ? "HOLD PERFECT" : "HOLD GOOD", "hold");
  }

  function beginHold(target, token, grade) {
    var lane = Number(target.dataset.lane);
    var holdMs = Number(target.dataset.holdMs);
    target._inputToken = token;
    target._holdGrade = grade;
    target.classList.add("holding");
    target.style.animationPlayState = "paused";
    activeInputs[token].hold = true;
    activeInputs[token].target = target;
    laneButtons[lane].classList.add("holding-pad");
    showJudgment("HOLD", "hold");
    pulseTrack(lane);
    vibrate(16);
    target._holdTimer = window.setTimeout(function () {
      completeHold(target, token);
    }, holdMs);
  }

  function breakHold(target, token) {
    if (!target || target._inputToken !== token || target.classList.contains("resolved")) return;
    var lane = Number(target.dataset.lane);
    target._inputToken = null;
    laneButtons[lane].classList.remove("holding-pad");
    markMiss(target, "HOLD BREAK", "break");
  }

  function judgeLane(lane, token) {
    var button = laneButtons[lane];
    var candidate = findLaneCandidate(lane);
    fireButton(button);
    if (!candidate) {
      showJudgment("NO NOTE", "early");
      pulseTrack(lane);
      vibrate(8);
      return;
    }
    var perfectWindow = candidate.padWidth * 0.62;
    var goodWindow = candidate.padWidth * 1.35;
    if (candidate.distance > goodWindow) {
      showJudgment("EARLY", "early");
      pulseTrack(lane);
      vibrate(8);
      return;
    }
    var grade = candidate.distance <= perfectWindow ? "PERFECT" : "GOOD";
    if (candidate.target.dataset.noteType === "hold") {
      beginHold(candidate.target, token, grade);
      return;
    }
    resolveHit(candidate.target, grade, grade.toLowerCase());
  }

  function handleLaneDown(lane, token) {
    if (state !== "playing" || lane < 0 || lane > 3 || activeInputs[token] || laneOwners[lane] !== null) return;
    laneOwners[lane] = token;
    activeInputs[token] = { lane: lane, hold: false, target: null };
    laneButtons[lane].classList.add("pressed");
    judgeLane(lane, token);
  }

  function handleLaneUp(token) {
    var record = activeInputs[token];
    if (!record) return;
    if (record.hold && record.target) breakHold(record.target, token);
    laneButtons[record.lane].classList.remove("pressed", "holding-pad");
    if (laneOwners[record.lane] === token) laneOwners[record.lane] = null;
    delete activeInputs[token];
  }

  function releaseAllInputs(breakHolds) {
    Object.keys(activeInputs).forEach(function (token) {
      var record = activeInputs[token];
      if (breakHolds && record.hold && record.target) breakHold(record.target, token);
      laneButtons[record.lane].classList.remove("pressed", "holding-pad");
    });
    activeInputs = {};
    laneOwners = [null, null, null, null];
  }

  function autoJudgeReadyTargets() {
    if (!assistActive || state !== "playing") return;
    Array.prototype.slice.call(targetField.querySelectorAll(".flying-target:not(.resolved):not(.holding)")).forEach(function (target) {
      var lane = Number(target.dataset.lane);
      var padRect = laneButtons[lane].querySelector(".letter").getBoundingClientRect();
      var targetRect = target.getBoundingClientRect();
      var distance = Math.hypot(
        targetRect.left + targetRect.width / 2 - (padRect.left + padRect.width / 2),
        targetRect.top + targetRect.height / 2 - (padRect.top + padRect.height / 2)
      );
      if (distance <= padRect.width * 0.72) resolveHit(target, "UTSUGI PERFECT", "perfect");
    });
  }

  function finishAssist() {
    window.clearTimeout(assistTimer);
    assistActive = false;
    utsugiAssist.classList.remove("assist-active");
    if (assistUsed) utsugiAssist.classList.add("is-spent");
    assistStatus.textContent = assistUsed ? "ASSIST USED" : "5 SEC AUTO PERFECT";
    assistCount.textContent = assistUsed ? "×0" : "×1";
    utsugiAssist.disabled = state !== "playing" || assistUsed;
  }

  function startAssist() {
    if (state !== "playing" || assistUsed) return;
    assistUsed = true;
    assistActive = true;
    utsugiAssist.disabled = true;
    utsugiAssist.classList.remove("is-spent");
    utsugiAssist.classList.add("assist-active");
    assistStatus.textContent = "AUTO PERFECT LIVE";
    assistCount.textContent = "LIVE";
    showAudioStatus("宇都木救场：5 秒自动 PERFECT");
    playSound("full");
    vibrate([18, 28, 18]);
    autoJudgeReadyTargets();
    assistTimer = window.setTimeout(finishAssist, 5000);
  }

  function spawnRyoObstacle() {
    if (state !== "playing" || reduceMotion) return;
    var variants = ["obstacle-peek", "obstacle-hand", "obstacle-sweep"];
    var variant = variants[Math.floor(Math.random() * variants.length)];
    var lane = Math.floor(Math.random() * 4);
    var padRect = laneButtons[lane].querySelector(".letter").getBoundingClientRect();
    var obstacle = document.createElement("i");
    obstacle.className = "ryo-obstacle " + variant;
    obstacle.style.setProperty("--obstacle-x", padRect.left + padRect.width / 2 + "px");
    obstacle.style.setProperty("--obstacle-y", 22 + Math.random() * 31 + "%");
    obstacleLayer.appendChild(obstacle);
    window.setTimeout(function () { obstacle.remove(); }, 1750);
  }

  function scheduleObstacle() {
    if (state !== "playing") return;
    obstacleTimer = window.setTimeout(function () {
      spawnRyoObstacle();
      scheduleObstacle();
    }, 4700 + Math.random() * 2500);
  }

  function clearObstacles() {
    window.clearTimeout(obstacleTimer);
    Array.prototype.slice.call(obstacleLayer.children).forEach(function (obstacle) { obstacle.remove(); });
  }

  function pickCrop() {
    var cropIndex = Math.floor(Math.random() * partCrops.length);
    if (cropIndex === lastCropIndex) cropIndex = (cropIndex + 1 + Math.floor(Math.random() * (partCrops.length - 1))) % partCrops.length;
    lastCropIndex = cropIndex;
    return partCrops[cropIndex];
  }

  function spawnTarget(options) {
    if (state !== "playing") return;
    var config = options || {};
    var lane = typeof config.lane === "number" ? config.lane : Math.floor(Math.random() * 4);
    var target = document.createElement("div");
    var crop = pickCrop();
    var cropX = Math.max(0, Math.min(100, crop.x + (-2 + Math.random() * 4)));
    var cropY = Math.max(0, Math.min(100, crop.y + (-2 + Math.random() * 4)));
    var flightTime = config.flightTime || (4100 + Math.random() * 1300);
    var isHold = typeof config.isHold === "boolean" ? config.isHold : Math.random() < 0.24;
    var holdMs = Math.round(850 + Math.random() * 550);
    var buttonFace = laneButtons[lane].querySelector(".letter");
    var buttonRect = buttonFace.getBoundingClientRect();
    var spawnY = window.innerHeight * (window.matchMedia("(max-height: 500px)").matches ? 0.12 : 0.15);
    var targetX = buttonRect.left + buttonRect.width / 2 - window.innerWidth / 2;
    var targetY = buttonRect.top + buttonRect.height / 2 - spawnY;
    target.className = "flying-target" + (isHold ? " is-hold" : "");
    target.dataset.lane = String(lane);
    target.dataset.effect = laneEffects[lane];
    target.dataset.letter = laneLetters[lane];
    target.dataset.part = crop.name;
    target.dataset.noteType = isHold ? "hold" : "tap";
    target.dataset.holdMs = String(holdMs);
    target.setAttribute("aria-hidden", "true");
    target.style.setProperty("--target-x", targetX + "px");
    target.style.setProperty("--target-y", targetY + "px");
    target.style.setProperty("--target-rotate", isHold ? "0deg" : (-8 + Math.random() * 16) + "deg");
    target.style.setProperty("--flight-time", flightTime + "ms");
    target.style.setProperty("--hold-duration", holdMs + "ms");
    target.style.setProperty("--hold-length", Math.round(82 + holdMs * 0.065) + "px");
    target.style.setProperty("--tail-angle", tailAngles[lane] + "deg");
    target.style.setProperty("--crop-size", crop.size + "%");
    target.style.setProperty("--crop-x", cropX + "%");
    target.style.setProperty("--crop-y", cropY + "%");
    target.innerHTML = (isHold ? '<span class="hold-tail"></span>' : "") + '<span class="note-shell"><span class="ryo-orb"></span></span>';
    target.addEventListener("animationend", function (event) {
      if (event.target === target && event.animationName === "targetFlight") markMiss(target, "MISS", "miss");
    });
    targetField.appendChild(target);
    if (reduceMotion) {
      target.style.animation = "none";
      target.style.opacity = "1";
      target.style.transform = "translate3d(calc(-50% + " + targetX * 0.64 + "px), calc(-50% + " + targetY * 0.64 + "px), 0) scale(.72)";
      target._reducedReadyTimer = window.setTimeout(function () {
        if (target.classList.contains("resolved")) return;
        target.style.transform = "translate3d(calc(-50% + " + targetX + "px), calc(-50% + " + targetY + "px), 0) scale(1)";
      }, flightTime * 0.74);
      target._reducedTimer = window.setTimeout(function () {
        markMiss(target, "MISS", "miss");
      }, flightTime);
    }
  }

  function spawnWave() {
    if (state !== "playing") return;
    var flightTime = 4200 + Math.random() * 1150;
    if (Math.random() < 0.22) {
      var firstLane = Math.floor(Math.random() * 4);
      var secondLane = (firstLane + 1 + Math.floor(Math.random() * 3)) % 4;
      spawnTarget({ lane: firstLane, flightTime: flightTime, isHold: false });
      spawnTarget({ lane: secondLane, flightTime: flightTime, isHold: false });
      return;
    }
    spawnTarget({ lane: Math.floor(Math.random() * 4), flightTime: flightTime, isHold: Math.random() < 0.24 });
  }

  function scheduleTarget() {
    if (state !== "playing") return;
    var delay = 620 + Math.random() * 340;
    spawnTimer = window.setTimeout(function () {
      spawnWave();
      scheduleTarget();
    }, delay);
  }

  function clearTargets() {
    Array.prototype.slice.call(targetField.querySelectorAll(".flying-target")).forEach(function (target) {
      window.clearTimeout(target._holdTimer);
      window.clearTimeout(target._reducedTimer);
      window.clearTimeout(target._reducedReadyTimer);
      target.classList.add("resolved", "round-ended");
      window.setTimeout(function () { target.remove(); }, reduceMotion ? 20 : 260);
    });
  }

  function endRound() {
    if (state !== "playing") return;
    state = "result";
    window.clearTimeout(spawnTimer);
    window.cancelAnimationFrame(timerFrame);
    finishAssist();
    clearObstacles();
    roundTimer.textContent = "00:00";
    releaseAllInputs(false);
    laneButtons.forEach(function (button) { button.disabled = true; });
    broadcast.classList.remove("is-playing");
    clearTargets();
    playSound("full");
    resultScore.textContent = padNumber(hits, 3);
    resultMaxCombo.textContent = padNumber(maxCombo, 3);
    window.setTimeout(function () {
      if (!isMobile || !window.matchMedia("(orientation: portrait)").matches) {
        resultGate.hidden = false;
      }
    }, 320);
  }

  function updateTimer(now) {
    if (state !== "playing") return;
    autoJudgeReadyTargets();
    var remaining = Math.max(0, roundEndsAt - now);
    var seconds = Math.ceil(remaining / 1000);
    roundTimer.textContent = "00:" + padNumber(seconds, 2);
    if (remaining <= 0) {
      endRound();
      return;
    }
    timerFrame = window.requestAnimationFrame(updateTimer);
  }

  function startRound() {
    state = "playing";
    hits = 0;
    combo = 0;
    maxCombo = 0;
    misses = 0;
    activeInputs = {};
    laneOwners = [null, null, null, null];
    assistUsed = false;
    assistActive = false;
    window.clearTimeout(assistTimer);
    clearObstacles();
    updateScore();
    roundNumber.textContent = padNumber(currentRound, 2);
    roundTimer.textContent = "00:30";
    roundGate.hidden = true;
    resultGate.hidden = true;
    startButton.disabled = false;
    startButton.textContent = "START ROUND";
    loadStatus.textContent = "点击后开启声音";
    laneButtons.forEach(function (button) {
      button.disabled = false;
      button.classList.remove("pressed", "holding-pad");
    });
    performerCards.forEach(function (card, lane) {
      window.clearTimeout(performerTimers[lane]);
      card.classList.remove("is-hit", "is-perfect");
    });
    utsugiAssist.disabled = false;
    utsugiAssist.classList.remove("assist-active", "is-spent");
    assistStatus.textContent = "5 SEC AUTO PERFECT";
    assistCount.textContent = "×1";
    broadcast.classList.add("is-playing");
    roundEndsAt = performance.now() + 30000;
    spawnWave();
    window.setTimeout(spawnWave, 340);
    scheduleTarget();
    scheduleObstacle();
    timerFrame = window.requestAnimationFrame(updateTimer);
  }

  function prepareRound() {
    if (state === "loading" || state === "playing") return;
    state = "loading";
    startButton.disabled = true;
    startButton.textContent = "CONNECTING...";
    loadStatus.textContent = "正在接入现场音效";
    loadAudio().then(function () {
      startRound();
    });
  }

  function isPortrait() {
    return window.matchMedia("(orientation: portrait)").matches;
  }

  function syncOrientation() {
    if (!isMobile || !mobileAccepted) return;
    var portrait = isPortrait();
    rotateGate.hidden = !portrait;
    if (portrait) {
      if (state === "idle" || state === "loading") roundGate.hidden = true;
      if (state === "result") resultGate.hidden = true;
      return;
    }
    if (state === "idle") roundGate.hidden = false;
    if (state === "result") resultGate.hidden = false;
  }

  function enterMobileLive() {
    mobileAccepted = true;
    mobileInvite.hidden = true;
    loadAudio();
    var fullscreenRequest = Promise.resolve();
    if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
      fullscreenRequest = document.documentElement.requestFullscreen().catch(function () {});
    }
    fullscreenRequest.then(function () {
      if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock("landscape").catch(function () {});
      }
    });
    syncOrientation();
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

  document.addEventListener("pointerup", function (event) {
    handleLaneUp("pointer-" + event.pointerId);
  });
  document.addEventListener("pointercancel", function (event) {
    handleLaneUp("pointer-" + event.pointerId);
  });

  joinButton.addEventListener("click", enterMobileLive);
  startButton.addEventListener("click", prepareRound);
  utsugiAssist.addEventListener("click", startAssist);
  encoreButton.addEventListener("click", function () {
    currentRound += 1;
    startRound();
  });
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
  window.addEventListener("resize", syncOrientation);
  window.addEventListener("orientationchange", function () {
    window.setTimeout(syncOrientation, 120);
  });
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) releaseAllInputs(true);
    if (!audioContext) return;
    if (document.hidden) audioContext.suspend().catch(function () {});
    else if (soundOn) audioContext.resume().catch(function () {});
  });

  setSound(true);
  if (isMobile) {
    mobileInvite.hidden = false;
  } else {
    roundGate.hidden = false;
  }
})();
