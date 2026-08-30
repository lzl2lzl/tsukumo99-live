(function () {
  "use strict";

  try {
    if (window.localStorage.getItem("tsukumo99-live-achievement-v1") === "1") {
      window.localStorage.removeItem("tsukumo99-live-achievement-seen-v1");
    }
  } catch (error) {}
})();
