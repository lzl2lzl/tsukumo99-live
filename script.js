const cheerButton = document.querySelector("#cheer-button");
const cheerImage = document.querySelector("#cheer-image");

// The source GIF has 7 frames at 80 ms each: one complete cheer lasts 560 ms.
const CHEER_DURATION_MS = 580;
let isPlaying = false;
let stopTimer;

function playCheerOnce() {
  if (isPlaying) return;

  isPlaying = true;
  cheerButton.disabled = true;
  cheerButton.classList.remove("is-playing");

  // A cache-busting query makes the browser restart the GIF from frame one.
  const gifSource = cheerButton.dataset.gif;
  cheerImage.src = `${gifSource}?play=${Date.now()}`;

  // Restart the CSS response even after several rapid replays.
  void cheerButton.offsetWidth;
  cheerButton.classList.add("is-playing");
  cheerButton.setAttribute("aria-label", "正在挥动荧光棒应援");

  window.clearTimeout(stopTimer);
  stopTimer = window.setTimeout(() => {
    cheerImage.src = cheerButton.dataset.still;
    cheerButton.classList.remove("is-playing");
    cheerButton.disabled = false;
    cheerButton.setAttribute("aria-label", "点击挥动荧光棒应援一次");
    isPlaying = false;
  }, CHEER_DURATION_MS);
}

cheerButton.addEventListener("click", playCheerOnce);

// Decode the animated asset early so the first click responds immediately.
const cheerPreload = new Image();
cheerPreload.src = cheerButton.dataset.gif;
