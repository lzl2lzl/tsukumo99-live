(function () {
  "use strict";

  var FACES = { 1:[4], 2:[0,8], 3:[0,4,8], 4:[0,2,6,8], 5:[0,2,4,6,8], 6:[0,2,3,5,6,8] };
  var WORDS = ["DICE AWAY","ONCE AND FOR ALL","TSUKUMO99","DiŹ","ALL IN","WORLD TOUR","LAST BET","ROLL"];
  var MEMBERS = [
    { key:"V01", full:"MEMBER 01", color:"#7b63b8", ink:"#241a44", role:{cn:"主唱",en:"VOCAL",jp:"ボーカル"} },
    { key:"G02", full:"MEMBER 02", color:"#a6c9ae", ink:"#274332", role:{cn:"吉他",en:"GUITAR",jp:"ギター"} },
    { key:"B03", full:"MEMBER 03", color:"#c34a5c", ink:"#3d0f18", role:{cn:"贝斯",en:"BASS",jp:"ベース"} },
    { key:"K04", full:"MEMBER 04", color:"#e0cfab", ink:"#5c4622", role:{cn:"键盘",en:"KEYS",jp:"キーボード"} },
    { key:"D05", full:"MEMBER 05", color:"#b6bccd", ink:"#33384a", role:{cn:"鼓",en:"DRUMS",jp:"ドラム"} }
  ];
  var PRODUCTS = [
    { kind:{cn:"贴纸",en:"STICKER SET",jp:"ステッカー"}, name:"DICE PIPS", bg:"#ec0050", ink:"#3d0010" },
    { kind:{cn:"明信片",en:"POSTCARD",jp:"ポストカード"}, name:"WORLD TOUR", bg:"#7b63b8", ink:"#1d1440" },
    { kind:{cn:"应援收据",en:"RECEIPT",jp:"レシート"}, name:"ALL IN", bg:"#a6c9ae", ink:"#20402c" },
    { kind:{cn:"小卡",en:"PHOTO CARD",jp:"フォトカード"}, name:"DiŹ", bg:"#e0cfab", ink:"#5c4622" },
    { kind:{cn:"半券",en:"TICKET STUB",jp:"半券"}, name:"ADMIT ONE", bg:"#c34a5c", ink:"#3d0f18" },
    { kind:{cn:"立牌卡",en:"STANDEE CARD",jp:"スタンドカード"}, name:"ONCE & FOR ALL", bg:"#b6bccd", ink:"#2c3040" }
  ];
  var COPY = {
    cn:{ placeholder:"成员资料待企划正式公开。",
      shopTitle:"云购物", shopSub:"不收款，只印你的名字。选择一件无料，生成可保存的收藏 PNG。", free:"无料", choose:"选择",
      step:"印在上面的名字", namePh:"输入要印上去的名字", make:"生成收藏", ready:"收藏已生成", download:"下载 PNG", keep:"继续逛",
      note:"所有商品均为虚构同人企划无料，不涉及真实商品、地址或支付。" },
    en:{ placeholder:"Member details will be announced later.",
      shopTitle:"CLOUD SHOP", shopSub:"No payment. Just your name. Pick a free collectible and make a printable PNG.", free:"FREE", choose:"SELECT",
      step:"NAME TO PRINT", namePh:"Name to print", make:"GENERATE", ready:"READY TO KEEP", download:"DOWNLOAD PNG", keep:"KEEP SHOPPING",
      note:"All goods are fictional fan-made giveaways. No real products, address collection, or payment." },
    jp:{ placeholder:"メンバー情報は後日公開予定です。",
      shopTitle:"クラウドショップ", shopSub:"決済なし、名前を印字するだけ。無料コレクションを選び、PNGを生成できます。", free:"無料", choose:"選ぶ",
      step:"印字する名前", namePh:"印字する名前", make:"生成する", ready:"生成しました", download:"PNGを保存", keep:"続ける",
      note:"すべて架空ファン企画の無料コレクションです。実商品・住所収集・決済はありません。" }
  };

  var NEWS = [
    {date:"2026.08.02",cat:"tour",title:{cn:"北京站 · 今夜开演，现场应援指南公开",en:"Beijing · tonight — live cheer guide is up",jp:"北京公演 · 本日開演、応援ガイド公開"}},
    {date:"2026.07.26",cat:"tour",title:{cn:"广州站 · 余票紧张，建议尽早投骰选座",en:"Guangzhou · few seats left — roll early",jp:"広州公演 · 残席わずか、早めの抽選を"}},
    {date:"2026.07.18",cat:"tour",title:{cn:"上海站 · 巡演首夜，DiŹ 正式启程",en:"Shanghai · opening night — DiŹ begins",jp:"上海公演 · 初日、DiŹ 開幕"}},
    {date:"2026.07.15",cat:"site",title:{cn:"加载页与骰子交互更新",en:"Loader and dice interaction updated",jp:"ローディングとサイコロ演出を更新"}},
    {date:"2026.07.08",cat:"notice",title:{cn:"关于本站为非官方同人企划的说明",en:"On this being an unofficial fan project",jp:"非公式ファン企画についてのお知らせ"}},
    {date:"2026.07.01",cat:"ticket",title:{cn:"电子票 PNG 支持离线保存",en:"Ticket PNG export now works offline",jp:"チケットPNGがオフライン保存に対応"}},
    {date:"2026.06.20",cat:"tour",title:{cn:"上海站 · 追加场决定",en:"Shanghai · additional show added",jp:"上海公演 · 追加公演決定"}},
    {date:"2026.06.14",cat:"site",title:{cn:"主视觉公开",en:"Key visual revealed",jp:"キービジュアル公開"}},
    {date:"2026.06.10",cat:"shop",title:{cn:"云购物上线：挑选、署名、保存",en:"Cloud Shop is now live",jp:"クラウドショップ公開"}},
    {date:"2026.06.03",cat:"ticket",title:{cn:"投骰抽座功能上线",en:"Roll-the-dice seat draw is live",jp:"サイコロ抽選購入を実装"}},
    {date:"2026.06.01",cat:"tour",title:{cn:"DiŹ WORLD TOUR 2026 日程解禁",en:"DiŹ WORLD TOUR 2026 dates revealed",jp:"DiŹ WORLD TOUR 2026 全日程解禁"}}
  ];
  var CAT_COLORS={tour:"#ff86bd",ticket:"#ec0050",shop:"#e0cfab",site:"#a6c9ae",notice:"#b6bccd"};
  var NEWS_COPY={
    cn:{title:"情报",body:"占位正文——这里之后放这条公告的详细内容。目前用于展示展开后的排版与留白。",note:"公告内容为虚构占位，待企划文案正式补充。",cats:{all:"全部",tour:"巡演",ticket:"购票",shop:"周边",site:"站点",notice:"声明"},build:{h:"网站施工中",d:"以下均为占位内容，全站文案尚未完成 · 8.31 前持续更新，敬请期待。"}},
    en:{title:"INTEL",body:"Placeholder body — the full announcement text will go here later.",note:"Fictional placeholder announcements; final copy is still to come.",cats:{all:"ALL",tour:"TOUR",ticket:"TICKET",shop:"SHOP",site:"SITE",notice:"NOTICE"},build:{h:"UNDER CONSTRUCTION",d:"Everything below is placeholder — full copy is still in progress and will keep updating before Aug 31. Stay tuned."}},
    jp:{title:"情報",body:"仮本文——詳細情報は後日ここに掲載されます。",note:"架空の仮お知らせです。正式な文章は後日追加予定です。",cats:{all:"すべて",tour:"ツアー",ticket:"チケット",shop:"グッズ",site:"サイト",notice:"告知"},build:{h:"サイト制作中",d:"以下はすべて仮の内容です。全文章は未完成で、8/31 までに随時更新予定。お楽しみに。"}}
  };
  var state = { shopOpen:false, product:0, name:"", made:null, rolling:false, newsCat:"all", newsOpen:null };

  function esc(s) { return String(s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];}); }
  function pipGrid(face, color) {
    return '<span class="dc-pips">' + Array.from({length:9},function(_,i){return '<i style="background:' + (FACES[face].indexOf(i)>-1?color:"transparent") + '"></i>';}).join("") + '</span>';
  }
  function ribbons() {
    var rows = "";
    for (var r=0;r<9;r++) {
      var words = [];
      for (var i=0;i<10;i++) words.push(WORDS[(r*3+i)%WORDS.length]);
      var text = words.concat(words).join(" · ");
      rows += '<div class="impact-ribbon impact-ribbon--' + (r%2?"reverse":"forward") + '"><span>' + text + '</span></div>';
    }
    return rows;
  }
  function renderProfile(lang) {
    var c=COPY[lang];
    return '<main class="impact-page" id="impactPage">' +
      '<div class="impact-field" id="impactField">' + ribbons() + '</div>' +
      '<div class="impact-vignette"></div><div class="impact-flash" id="impactFlash"></div><div class="impact-ring" id="impactRing"></div>' +
      '<section class="impact-result" id="impactResult" aria-live="polite"></section>' +
      '<section class="impact-control">' +
        '<p class="impact-kicker">TSUKUMO99 LIVE · DiŹ</p><h1>ONCE AND FOR ALL, DICE AWAY.</h1>' +
        '<button class="impact-toggle" id="impactToggle" type="button" aria-label="随机查看成员"><span class="impact-knob" id="impactKnob">' + pipGrid(5,"#9d8f95") + '</span></button>' +
      '</section></main>';
  }
  function renderShop(lang) {
    var c=COPY[lang];
    var cards=PRODUCTS.map(function(p,i){
      return '<button class="cloud-product" type="button" data-dc-act="pickProduct" data-index="' + i + '">' +
        '<span class="cloud-product__art" style="--product-bg:' + p.bg + ';--product-ink:' + p.ink + '">' +
          '<span class="cloud-product__diamond">◈</span>' + pipGrid(1+(i%6),p.ink) +
          '<span class="cloud-product__name"><small>' + esc(p.kind[lang]) + '</small><strong>' + p.name + '</strong></span>' +
        '</span><span class="cloud-product__meta"><em>' + esc(p.kind[lang]) + '</em><b>' + esc(c.free) + '</b></span></button>';
    }).join("");
    return '<main class="cloud-shop"><header class="cloud-shop__head"><div><p>TSUKUMO99 · UNOFFICIAL FANWEB</p><h1>' + esc(c.shopTitle) + '</h1><span>' + esc(c.shopSub) + '</span></div></header>' +
      '<section class="cloud-grid">' + cards + '</section><p class="cloud-note">' + esc(c.note) + '</p>' + renderShopModal(lang) + '</main>';
  }
  function renderShopModal(lang) {
    if(!state.shopOpen) return "";
    var c=COPY[lang], p=PRODUCTS[state.product];
    if(state.made) return '<div class="cloud-modal" id="cloudBackdrop"><section class="cloud-dialog cloud-dialog--done"><button data-dc-act="closeShop" class="cloud-close" aria-label="Close">×</button><p>02 / ' + esc(c.ready) + '</p><h2>✓ ' + esc(c.ready) + '</h2><img id="cloudPreview" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" alt="Generated collectible preview"><div class="cloud-actions"><button data-dc-act="downloadProduct">' + esc(c.download) + '</button><button data-dc-act="closeShop">' + esc(c.keep) + '</button></div></section></div>';
    return '<div class="cloud-modal" id="cloudBackdrop"><section class="cloud-dialog"><button data-dc-act="closeShop" class="cloud-close" aria-label="Close">×</button>' +
      '<div class="cloud-dialog__sample" style="--product-bg:' + p.bg + ';--product-ink:' + p.ink + '">' + pipGrid(5,p.ink) + '<small>' + esc(p.kind[lang]) + '</small><strong>' + p.name + '</strong></div>' +
      '<div class="cloud-dialog__form"><p>01 / ' + esc(c.step) + '</p><h2>' + p.name + '</h2><label for="cloudName">' + esc(c.step) + '</label><input id="cloudName" maxlength="24" value="' + esc(state.name) + '" placeholder="' + esc(c.namePh) + '"><button data-dc-act="makeProduct" class="cloud-make"' + (state.name.trim()?"":" disabled") + '>' + esc(c.make) + '</button></div></section></div>';
  }

  function renderNews(lang) {
    var c=NEWS_COPY[lang],keys=["all","tour","site","notice"];
    var filters=keys.map(function(k){var color=k==="all"?"#ff86bd":CAT_COLORS[k];return '<button type="button" data-dc-act="newsCat" data-cat="'+k+'" class="'+(state.newsCat===k?"is-active":"")+'" style="--cat:'+color+'">'+esc(c.cats[k])+'</button>';}).join("");
    var items=NEWS.filter(function(n){return n.cat!=="ticket"&&n.cat!=="shop";}).filter(function(n){return state.newsCat==="all"||n.cat===state.newsCat;}).map(function(n,i){
      var open=state.newsOpen===n.date,color=CAT_COLORS[n.cat];
      return '<article class="dc-news-row" style="--delay:'+(Math.min(i,8)*.05)+'s"><button type="button" data-dc-act="newsToggle" data-key="'+n.date+'"><time>'+n.date+'</time><span style="--cat:'+color+'">'+esc(c.cats[n.cat])+'</span><strong>'+esc(n.title[lang])+'</strong><i class="'+(open?"is-open":"")+'">⌄</i></button><div class="dc-news-body '+(open?"is-open":"")+'"><p>'+esc(c.body)+'</p></div></article>';
    }).join("");
    return '<main class="dc-news"><div class="dc-build"><b>'+esc(c.build.h)+'</b><span>'+esc(c.build.d)+'</span></div><header><p>TSUKUMO99 · UNOFFICIAL FANWEB</p><h1>'+esc(c.title)+'</h1></header><nav class="dc-news-filters">'+filters+'</nav><section class="dc-news-list">'+items+'</section><p class="dc-news-note">'+esc(c.note)+'</p></main>';
  }
  function rollProfile(lang) {
    if(state.rolling) return;
    state.rolling=true;
    var c=COPY[lang], field=document.getElementById("impactField"), knob=document.getElementById("impactKnob");
    field.classList.add("is-rolling"); knob.classList.add("is-rolling");
    var ticker=setInterval(function(){var m=MEMBERS[Math.floor(Math.random()*MEMBERS.length)];knob.innerHTML='<strong>'+m.key+'</strong>';},110);
    setTimeout(function(){
      var m=MEMBERS[Math.floor(Math.random()*MEMBERS.length)], result=document.getElementById("impactResult");
      if (!result || !document.getElementById("impactFlash") || !document.getElementById("impactRing")) { state.rolling=false; return; }
      result.innerHTML='<div class="impact-member" style="--member:' + m.color + ';--member-ink:' + m.ink + '"><span class="impact-member__ghost">' + m.key + '</span><div class="impact-member__top"><small>TSUKUMO99 · ' + m.role.en + '</small><h2>' + m.full + '</h2></div><div class="impact-member__bio"><b>' + esc(m.role[lang]) + ' · ' + m.role.en + '</b><p>' + esc(c.placeholder) + '</p></div></div>';
      clearInterval(ticker);result.classList.add("is-visible"); field.classList.remove("is-rolling"); field.classList.add("is-settled"); knob.classList.remove("is-rolling"); knob.innerHTML='<strong>' + m.key + '</strong>';
      document.getElementById("impactFlash").classList.add("fire"); document.getElementById("impactRing").classList.add("fire");
      setTimeout(function(){var f=document.getElementById("impactFlash"),r=document.getElementById("impactRing");if(f)f.classList.remove("fire");if(r)r.classList.remove("fire");},800);
      state.rolling=false;
    }, matchMedia("(prefers-reduced-motion: reduce)").matches?50:1200);
  }
  function drawProduct(p,name,lang) {
    var canvas=document.createElement("canvas"), W=800,H=1000,D=2;canvas.width=W*D;canvas.height=H*D;var g=canvas.getContext("2d");g.scale(D,D);
    g.fillStyle=p.bg;g.fillRect(0,0,W,H);g.strokeStyle=p.ink;g.globalAlpha=.35;g.lineWidth=6;g.strokeRect(28,28,W-56,H-56);g.globalAlpha=1;
    g.fillStyle=p.ink;g.font="700 21px 'Space Mono',monospace";g.fillText("TSUKUMO99 · UNOFFICIAL FANWEB",58,90);g.font="700 112px Oswald,sans-serif";g.fillText(p.name,54,260);
    g.globalAlpha=.12;[[0,0],[2,0],[1,1],[0,2],[2,2]].forEach(function(pt){g.beginPath();g.arc(400+(pt[0]-1)*120,510+(pt[1]-1)*120,38,0,7);g.fill();});g.globalAlpha=1;
    g.font="700 18px 'Space Mono',monospace";g.fillText("FOR",58,720);g.font="700 92px Oswald,sans-serif";g.fillText(name,54,820);
    g.font="700 18px 'Space Mono',monospace";g.fillText("UNOFFICIAL / FAN-MADE · FREE GIVEAWAY",58,920);
    return canvas;
  }
  function wire(page,lang,rerender) {
    if(page==="profile"){var toggle=document.getElementById("impactToggle");if(toggle)toggle.addEventListener("click",function(){rollProfile(lang);});}
    document.querySelectorAll("[data-dc-act]").forEach(function(el){el.addEventListener("click",function(e){
      var act=el.dataset.dcAct;
      if(act==="pickProduct"){state.product=Number(el.dataset.index);state.name="";state.made=null;state.shopOpen=true;rerender();}
      if(act==="closeShop"){state.shopOpen=false;state.made=null;document.body.style.overflow="";rerender();}
      if(act==="makeProduct"&&state.name.trim()){state.made=drawProduct(PRODUCTS[state.product],state.name.trim(),lang);rerender();}
      if(act==="downloadProduct"&&state.made){state.made.toBlob(function(b){var u=URL.createObjectURL(b),a=document.createElement("a");a.href=u;a.download="TSUKUMO99-"+PRODUCTS[state.product].name.replace(/[^A-Za-z0-9]+/g,"-")+".png";a.click();setTimeout(function(){URL.revokeObjectURL(u);},1000);},"image/png");}
      if(act==="newsCat"){state.newsCat=el.dataset.cat;state.newsOpen=null;rerender();}
      if(act==="newsToggle"){state.newsOpen=state.newsOpen===el.dataset.key?null:el.dataset.key;rerender();}
    });});
    var input=document.getElementById("cloudName");if(input){input.focus();input.addEventListener("input",function(){state.name=input.value;var btn=document.querySelector(".cloud-make");if(btn)btn.disabled=!state.name.trim();});}
    var preview=document.getElementById("cloudPreview");if(preview&&state.made)preview.src=state.made.toDataURL("image/png");
  }
  window.DiZPages={renderProfile:renderProfile,renderShop:renderShop,renderNews:renderNews,wire:wire};
})();
