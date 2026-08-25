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
  var encoreButton = document.getElementById("encoreButton");
  var soundButton = document.getElementById("soundButton");
  var roundNumber = document.getElementById("roundNumber");
  var roundTimer = document.getElementById("roundTimer");
  var hitCount = document.getElementById("hitCount");
  var targetField = document.getElementById("targetField");
  var effectLayer = document.getElementById("effectLayer");
  var hitCallout = document.getElementById("hitCallout");
  var audioStatus = document.getElementById("audioStatus");
  var laneButtons = Array.prototype.slice.call(document.querySelectorAll(".lane-button"));

  var audioFiles = {
    bubble: "assets/audio/grape-nectar/bubble-grain.wav",
    violet: "assets/audio/grape-nectar/violet-pad.wav",
    core: "assets/audio/grape-nectar/main-core.wav",
    full: "assets/audio/grape-nectar/full.wav"
  };
  var laneEffects = ["core", "bubble", "bubble", "violet"];
  var laneLetters = ["Z", "O", "O", "L"];
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var userAgent = navigator.userAgent || "";
  var isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(userAgent) ||
    (/Macintosh/i.test(userAgent) && navigator.maxTouchPoints > 1) ||
    (navigator.maxTouchPoints > 1 && Math.min(screen.width, screen.height) < 900);

  var state = "idle";
  var mobileAccepted = false;
  var currentRound = 1;
  var hits = 0;
  var roundEndsAt = 0;
  var spawnTimer = 0;
  var timerFrame = 0;
  var effectTimers = {};
  var statusTimer = 0;

  var audioContext = null;
  var masterGain = null;
  var audioBuffers = {};
  var fallbackAudio = {};
  var activeSources = {};
  var loadingPromise = null;
  var soundOn = true;

  Object.keys(audioFiles).forEach(function (name) {
    var audio = new Audio(audioFiles[name]);
    audio.preload = "auto";
    fallbackAudio[name] = audio;
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
      fallbackAudio[name].muted = !on;
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
    if (!audio) return;
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

  function showHitCallout() {
    hitCallout.classList.remove("show");
    hitCallout.getBoundingClientRect();
    hitCallout.classList.add("show");
  }

  function updateScore() {
    hitCount.textContent = padNumber(hits, 3);
  }

  function hitTarget(target) {
    if (state !== "playing" || !target || target.classList.contains("hit")) return;
    var rect = target.getBoundingClientRect();
    var effect = target.dataset.effect;
    target.style.animation = "none";
    target.style.left = rect.left + "px";
    target.style.top = rect.top + "px";
    target.style.width = rect.width + "px";
    target.style.transform = "scale(1)";
    target.getBoundingClientRect();
    target.classList.add("hit");
    hits += 1;
    updateScore();
    showHitCallout();
    triggerEffect(effect, rect.left + rect.width / 2, rect.top + rect.height / 2);
    window.setTimeout(function () { target.remove(); }, reduceMotion ? 30 : 340);
  }

  function spawnTarget() {
    if (state !== "playing") return;
    var lane = Math.floor(Math.random() * 4);
    var target = document.createElement("button");
    var targetX = [-36, -13, 13, 36][lane] + (-3 + Math.random() * 6);
    var targetY = window.innerHeight * (0.54 + Math.random() * 0.07);
    var flightTime = 4300 + Math.random() * 1500;
    target.type = "button";
    target.className = "flying-target" + (Math.random() < 0.16 ? " is-grape" : "");
    target.dataset.lane = String(lane);
    target.dataset.effect = laneEffects[lane];
    target.dataset.letter = laneLetters[lane];
    target.setAttribute("aria-label", "点击消除 " + laneLetters[lane] + " 轨道目标");
    target.style.setProperty("--target-x", targetX + "vw");
    target.style.setProperty("--target-y", targetY + "px");
    target.style.setProperty("--target-rotate", (-14 + Math.random() * 28) + "deg");
    target.style.setProperty("--flight-time", flightTime + "ms");
    target.innerHTML = '<span class="ryo-orb" aria-hidden="true"></span>';
    target.addEventListener("click", function () { hitTarget(target); });
    target.addEventListener("animationend", function () { target.remove(); });
    targetField.appendChild(target);
    if (reduceMotion) {
      target.style.animation = "none";
      target.style.opacity = "1";
      target.style.transform = "translate3d(calc(-50% + " + targetX + "vw), " + targetY + "px, 0) scale(1)";
      window.setTimeout(function () {
        if (!target.classList.contains("hit")) target.remove();
      }, flightTime);
    }
  }

  function scheduleTarget() {
    if (state !== "playing") return;
    var delay = 500 + Math.random() * 310;
    spawnTimer = window.setTimeout(function () {
      spawnTarget();
      scheduleTarget();
    }, delay);
  }

  function clearTargets() {
    Array.prototype.slice.call(targetField.querySelectorAll(".flying-target")).forEach(function (target) {
      target.classList.add("round-ended");
      window.setTimeout(function () { target.remove(); }, reduceMotion ? 20 : 260);
    });
  }

  function endRound() {
    if (state !== "playing") return;
    state = "result";
    window.clearTimeout(spawnTimer);
    window.cancelAnimationFrame(timerFrame);
    roundTimer.textContent = "00:00";
    laneButtons.forEach(function (button) { button.disabled = true; });
    broadcast.classList.remove("is-playing");
    clearTargets();
    playSound("full");
    resultScore.textContent = padNumber(hits, 3);
    window.setTimeout(function () {
      if (!isMobile || !window.matchMedia("(orientation: portrait)").matches) {
        resultGate.hidden = false;
      }
    }, 320);
  }

  function updateTimer(now) {
    if (state !== "playing") return;
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
    updateScore();
    roundNumber.textContent = padNumber(currentRound, 2);
    roundTimer.textContent = "00:30";
    roundGate.hidden = true;
    resultGate.hidden = true;
    startButton.disabled = false;
    startButton.textContent = "START ROUND";
    loadStatus.textContent = "点击后开启声音";
    laneButtons.forEach(function (button) { button.disabled = false; });
    broadcast.classList.add("is-playing");
    roundEndsAt = performance.now() + 30000;
    spawnTarget();
    window.setTimeout(spawnTarget, 280);
    scheduleTarget();
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

  function fireLane(lane) {
    var button = laneButtons[lane];
    if (!button || state !== "playing") return;
    fireButton(button);
    var target = targetField.querySelector('.flying-target[data-lane="' + lane + '"]:not(.hit)');
    if (target) {
      hitTarget(target);
      return;
    }
    var rect = button.getBoundingClientRect();
    triggerEffect(laneEffects[lane], rect.left + rect.width / 2, rect.top + rect.height / 2);
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
    button.addEventListener("click", function () {
      fireLane(Number(button.dataset.lane));
    });
  });

  joinButton.addEventListener("click", enterMobileLive);
  startButton.addEventListener("click", prepareRound);
  encoreButton.addEventListener("click", function () {
    currentRound += 1;
    startRound();
  });
  soundButton.addEventListener("click", function () {
    setSound(!soundOn);
    showAudioStatus(soundOn ? "声音已开启" : "声音已关闭");
  });

  document.addEventListener("keydown", function (event) {
    if (state !== "playing") return;
    var lane = { "1": 0, "2": 1, "3": 2, "4": 3 }[event.key];
    if (typeof lane === "number") {
      event.preventDefault();
      fireLane(lane);
    }
  });

  window.addEventListener("resize", syncOrientation);
  window.addEventListener("orientationchange", function () {
    window.setTimeout(syncOrientation, 120);
  });
  document.addEventListener("visibilitychange", function () {
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
