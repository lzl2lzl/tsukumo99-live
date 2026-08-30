(function () {
  "use strict";

  var CART_KEY = "dizCart";
  var PRODUCT_ID = "live-achievement-cert";
  var gate = document.getElementById("achievementGate");
  if (!gate) return;

  if (!document.getElementById("addAchievementCart")) {
    gate.innerHTML = '<div class="achievement-rays" aria-hidden="true"></div>'
      + '<span class="achievement-live">ACHIEVEMENT UNLOCKED</span>'
      + '<h1 id="achievementTitle">月云的兵</h1>'
      + '<p>恭喜你已获得成就“月云的兵”及限定证书！请前往商店，在购物车填写地址发货。</p>'
      + '<div class="achievement-actions"><button type="button" id="addAchievementCart">加入购物车</button><a href="index.html">退出游戏</a></div>'
      + '<small class="achievement-cart-status" id="achievementCartStatus" role="status" aria-live="polite"></small>';
  }

  if (!document.getElementById("certificateName")) {
    var legacy = document.createElement("div");
    legacy.hidden = true;
    legacy.innerHTML = '<input id="certificateName" value="月云的兵">'
      + '<small id="certificateError"></small>'
      + '<button id="downloadCertificate" type="button"></button>'
      + '<button id="closeAchievement" type="button"></button>';
    document.body.appendChild(legacy);
  }

  var style = document.createElement("style");
  style.textContent = '.achievement-gate>p{max-width:35rem;margin:.45rem 0 1.15rem;line-height:1.65;text-wrap:balance}'
    + '.achievement-actions{position:relative;display:grid;grid-template-columns:repeat(2,minmax(10.5rem,1fr));width:min(100%,31rem);border:1px solid rgba(255,134,189,.42)}'
    + '.achievement-actions button,.achievement-actions a{display:grid;place-items:center;min-height:48px;padding:.7rem 1rem;background:rgba(18,0,5,.86);color:#fff4f7;font-family:var(--mono);font-size:.62rem;letter-spacing:.06em;text-decoration:none}'
    + '.achievement-actions button{background:#fff4f7;color:#170006;font-weight:700}.achievement-actions button:disabled{background:#ec0050;color:#fff4f7;cursor:default}'
    + '.achievement-actions a{border-left:1px solid rgba(255,134,189,.42)}'
    + '.achievement-cart-status{position:relative;min-height:1.1rem;margin-top:.5rem;color:#ff86bd;font-family:var(--mono);font-size:.62rem;letter-spacing:.06em;opacity:0;transition:opacity .24s ease}.achievement-cart-status.show{opacity:1}'
    + '@media(max-height:560px){.achievement-gate>p{max-width:30rem;margin:.25rem 0 .7rem;font-size:.7rem;line-height:1.45}.achievement-actions{grid-template-columns:repeat(2,minmax(8.8rem,1fr));width:min(100%,27rem)}.achievement-actions button,.achievement-actions a{min-height:42px;padding:.48rem .65rem;font-size:.54rem}.achievement-cart-status{min-height:.8rem;margin-top:.25rem;font-size:.54rem}}';
  document.head.appendChild(style);

  var button = document.getElementById("addAchievementCart");
  var status = document.getElementById("achievementCartStatus");

  function readCart() {
    try {
      var cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
      return Array.isArray(cart) ? cart : [];
    } catch (error) {
      return [];
    }
  }

  function sync() {
    var added = readCart().some(function (item) { return item && item.id === PRODUCT_ID; });
    button.disabled = added;
    button.textContent = added ? "已加入购物车" : "加入购物车";
    if (added) {
      status.textContent = "已加入购物车";
      status.classList.add("show");
    }
  }

  button.addEventListener("click", function () {
    try {
      var cart = readCart();
      var item = cart.find(function (entry) { return entry && entry.id === PRODUCT_ID; });
      if (item) item.qty = 2;
      else cart.push({ id: PRODUCT_ID, qty: 2 });
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
      sync();
    } catch (error) {
      status.textContent = "加入失败，请确认浏览器允许保存网站数据后重试。";
      status.classList.add("show");
    }
  });

  sync();
})();
