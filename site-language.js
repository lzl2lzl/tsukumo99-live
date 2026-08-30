(function () {
  "use strict";

  var STORAGE_KEY = "tsukumo99.site.language";
  var VALID = { cn: true, jp: true, en: true };
  var current = readUrlLanguage() || readStoredLanguage() || "cn";
  var observer = null;

  function normalize(value) {
    value = String(value || "").toLowerCase();
    if (value === "zh" || value === "zh-cn" || value === "zh-hans") return "cn";
    if (value === "ja" || value === "ja-jp") return "jp";
    return VALID[value] ? value : null;
  }

  function readUrlLanguage() {
    try {
      return normalize(new URL(window.location.href).searchParams.get("lang"));
    } catch (error) {
      return null;
    }
  }

  function readStoredLanguage() {
    try {
      return normalize(window.localStorage.getItem(STORAGE_KEY));
    } catch (error) {
      return null;
    }
  }

  function storeLanguage(lang) {
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch (error) {}
  }

  function htmlLanguage(lang) {
    return lang === "jp" ? "ja" : lang === "en" ? "en" : "zh-CN";
  }

  function updateCurrentUrl(lang) {
    try {
      var url = new URL(window.location.href);
      url.searchParams.set("lang", lang);
      window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
    } catch (error) {}
  }

  function routeUrl(raw, lang) {
    if (!raw || raw.charAt(0) === "#" || /^(?:mailto:|tel:|javascript:|data:)/i.test(raw)) return raw;
    try {
      var url = new URL(raw, document.baseURI);
      if (url.origin !== window.location.origin || !/\.html$/i.test(url.pathname)) return raw;
      url.searchParams.set("lang", normalize(lang) || current);
      return url.pathname + url.search + url.hash;
    } catch (error) {
      return raw;
    }
  }

  function collect(root, selector) {
    var nodes = [];
    if (root && root.nodeType === 1 && root.matches(selector)) nodes.push(root);
    if (root && root.querySelectorAll) nodes = nodes.concat(Array.prototype.slice.call(root.querySelectorAll(selector)));
    return nodes;
  }

  function sync(root) {
    collect(root || document, "a[href]").forEach(function (link) {
      var next = routeUrl(link.getAttribute("href"), current);
      if (next && next !== link.getAttribute("href")) link.setAttribute("href", next);
    });
    collect(root || document, "button[data-lang]").forEach(function (button) {
      var active = normalize(button.getAttribute("data-lang")) === current;
      button.classList.toggle("on", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    });
  }

  function emitChange(lang) {
    try {
      document.dispatchEvent(new CustomEvent("dizlanguagechange", { detail: { lang: lang } }));
    } catch (error) {}
  }

  function set(lang, options) {
    lang = normalize(lang);
    if (!lang) return current;
    options = options || {};
    current = lang;
    window.DiZLang = lang;
    document.documentElement.lang = htmlLanguage(lang);
    storeLanguage(lang);
    if (options.updateUrl !== false) updateCurrentUrl(lang);
    sync(document);
    if (options.emit !== false) emitChange(lang);
    return current;
  }

  function boot() {
    sync(document);
    if (window.MutationObserver && !observer) {
      observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
          Array.prototype.forEach.call(mutation.addedNodes || [], function (node) {
            if (node.nodeType === 1) sync(node);
          });
        });
      });
      observer.observe(document.documentElement, { childList: true, subtree: true });
    }
  }

  window.DiZLanguage = {
    get: function () { return current; },
    set: set,
    url: routeUrl,
    sync: sync
  };

  set(current, { emit: false });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();

  document.addEventListener("click", function (event) {
    var button = event.target.closest ? event.target.closest("button[data-lang]") : null;
    if (button) set(button.getAttribute("data-lang"));
  }, true);

  window.addEventListener("popstate", function () {
    var next = readUrlLanguage() || readStoredLanguage() || "cn";
    if (next !== current) set(next, { updateUrl: false });
  });
})();
