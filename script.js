(function () {
  "use strict";

  var STOPS = [
    { code: "SH", status: "few", date: "2026.07.18", country: { cn: "中国", en: "CHINA", jp: "中国" }, city: { cn: "上海", en: "SHANGHAI", jp: "上海" }, venue: { cn: "上海 · 滨江文化中心", en: "SHANGHAI RIVERSIDE HALL", jp: "上海 リバーサイドホール" }, addr: { cn: "云锦路 88 号", en: "88 Yunjin Road", jp: "雲錦路88" } },
    { code: "GZ", status: "plenty", date: "2026.07.26", country: { cn: "中国", en: "CHINA", jp: "中国" }, city: { cn: "广州", en: "GUANGZHOU", jp: "広州" }, venue: { cn: "广州 · 珠江大剧场", en: "PEARL RIVER THEATRE", jp: "広州 珠江劇場" }, addr: { cn: "临江大道 66 号", en: "66 Riverside Avenue", jp: "臨江大通り66" } },
    { code: "BJ", status: "few", date: "2026.08.02", country: { cn: "中国", en: "CHINA", jp: "中国" }, city: { cn: "北京", en: "BEIJING", jp: "北京" }, venue: { cn: "北京 · 京城中央馆", en: "CAPITAL CENTRAL ARENA", jp: "北京 セントラルアリーナ" }, addr: { cn: "长安西路 21 号", en: "21 West Chang'an Rd", jp: "長安西路21" } },
    { code: "SE", status: "plenty", date: "2026.08.08", country: { cn: "韩国", en: "KOREA", jp: "韓国" }, city: { cn: "首尔", en: "SEOUL", jp: "ソウル" }, venue: { cn: "首尔 · 汉江巨蛋", en: "HAN RIVER DOME", jp: "ソウル ハンガンドーム" }, addr: { cn: "麻浦大路 45", en: "45 Mapo-daero", jp: "麻浦大路45" } },
    { code: "TK", status: "few", date: "2026.08.15", country: { cn: "日本", en: "JAPAN", jp: "日本" }, city: { cn: "东京", en: "TOKYO", jp: "東京" }, venue: { cn: "东京 · 临海竞技场", en: "BAYFRONT ARENA TOKYO", jp: "東京 ベイフロントアリーナ" }, addr: { cn: "台场 3-6", en: "3-6 Odaiba", jp: "台場3-6" } },
    { code: "OS", status: "plenty", date: "2026.08.19", country: { cn: "日本", en: "JAPAN", jp: "日本" }, city: { cn: "大阪", en: "OSAKA", jp: "大阪" }, venue: { cn: "大阪 · 中之岛音乐堂", en: "NAKANOSHIMA HALL", jp: "大阪 中之島ホール" }, addr: { cn: "中之岛 2-8", en: "2-8 Nakanoshima", jp: "中之島2-8" } },
    { code: "FK", status: "few", date: "2026.08.23", country: { cn: "日本", en: "JAPAN", jp: "日本" }, city: { cn: "福冈", en: "FUKUOKA", jp: "福岡" }, venue: { cn: "福冈 · 博多海湾馆", en: "HAKATA BAY HALL", jp: "福岡 博多ベイホール" }, addr: { cn: "须崎町 1-11", en: "1-11 Susaki", jp: "須崎町1-11" } },
    { code: "SY", status: "plenty", date: "2026.08.30", country: { cn: "澳大利亚", en: "AUSTRALIA", jp: "オーストラリア" }, city: { cn: "悉尼", en: "SYDNEY", jp: "シドニー" }, venue: { cn: "悉尼 · 海港穹顶", en: "HARBOUR DOME SYDNEY", jp: "シドニー ハーバードーム" }, addr: { cn: "达令港 12", en: "12 Darling Harbour", jp: "ダーリングハーバー12" } },
    { code: "TR", status: "plenty", date: "2026.09.05", country: { cn: "加拿大", en: "CANADA", jp: "カナダ" }, city: { cn: "多伦多", en: "TORONTO", jp: "トロント" }, venue: { cn: "多伦多 · 湖滨中心", en: "LAKESHORE CENTRE", jp: "トロント レイクショア" }, addr: { cn: "湖岸大道 77", en: "77 Lakeshore Blvd", jp: "レイクショア大通り77" } },
    { code: "VA", status: "few", date: "2026.09.09", country: { cn: "加拿大", en: "CANADA", jp: "カナダ" }, city: { cn: "温哥华", en: "VANCOUVER", jp: "バンクーバー" }, venue: { cn: "温哥华 · 海湾展演馆", en: "WATERFRONT PAVILION", jp: "バンクーバー ウォーターフロント" }, addr: { cn: "海堤路 44", en: "44 Seawall Road", jp: "シーウォール路44" } },
    { code: "NY", status: "plenty", date: "2026.09.14", country: { cn: "美国", en: "UNITED STATES", jp: "アメリカ" }, city: { cn: "纽约", en: "NEW YORK", jp: "ニューヨーク" }, venue: { cn: "纽约 · 曼哈顿广场馆", en: "MANHATTAN GARDEN", jp: "ニューヨーク マンハッタンガーデン" }, addr: { cn: "第七大道 909", en: "909 Seventh Avenue", jp: "セブンスアベニュー909" } },
    { code: "LD", status: "few", date: "2026.09.19", country: { cn: "英国", en: "UNITED KINGDOM", jp: "イギリス" }, city: { cn: "伦敦", en: "LONDON", jp: "ロンドン" }, venue: { cn: "伦敦 · 泰晤士竞技场", en: "THAMES ARENA", jp: "ロンドン テムズアリーナ" }, addr: { cn: "河岸街 13", en: "13 Riverside Street", jp: "リバーサイド街13" } },
    { code: "MC", status: "plenty", date: "2026.09.23", country: { cn: "英国", en: "UNITED KINGDOM", jp: "イギリス" }, city: { cn: "曼彻斯特", en: "MANCHESTER", jp: "マンチェスター" }, venue: { cn: "曼彻斯特 · 北方大厅", en: "NORTHERN HALL", jp: "マンチェスター ノーザンホール" }, addr: { cn: "运河街 36", en: "36 Canal Street", jp: "運河街36" } },
    { code: "PA", status: "few", date: "2026.09.27", country: { cn: "法国", en: "FRANCE", jp: "フランス" }, city: { cn: "巴黎", en: "PARIS", jp: "パリ" }, venue: { cn: "巴黎 · 塞纳穹顶", en: "LE DÔME SEINE", jp: "パリ セーヌドーム" }, addr: { cn: "河畔大道 27", en: "27 Quai de Seine", jp: "セーヌ河岸27" } },
    { code: "BE", status: "plenty", date: "2026.10.01", country: { cn: "德国", en: "GERMANY", jp: "ドイツ" }, city: { cn: "柏林", en: "BERLIN", jp: "ベルリン" }, venue: { cn: "柏林 · 施普雷会堂", en: "SPREE HALLE", jp: "ベルリン シュプレーホール" }, addr: { cn: "河湾街 15", en: "15 Uferstrasse", jp: "ウーファー通り15" } },
    { code: "OL", status: "few", date: "2026.10.05", country: { cn: "挪威", en: "NORWAY", jp: "ノルウェー" }, city: { cn: "奥斯陆", en: "OSLO", jp: "オスロ" }, venue: { cn: "奥斯陆 · 峡湾竞技场", en: "FJORD ARENA OSLO", jp: "オスロ フィヨルドアリーナ" }, addr: { cn: "海港路 9", en: "9 Havnegata", jp: "ハウネガータ9" } },
    { code: "ML", status: "plenty", date: "2026.10.10", country: { cn: "意大利", en: "ITALY", jp: "イタリア" }, city: { cn: "米兰", en: "MILAN", jp: "ミラノ" }, venue: { cn: "米兰 · 中央竞技馆", en: "ARENA CENTRALE MILANO", jp: "ミラノ アレーナチェントラーレ" }, addr: { cn: "河滨大道 12", en: "12 Viale Riva", jp: "リーヴァ大通り12" } }
  ];

  var ZONES = [
    { id: "vip", tier: "VIP", code: "V", price: 999,
      name: { cn: "VIP 前区站席", en: "VIP FRONT STANDING", jp: "VIPフロントスタンディング" },
      perks: { cn: ["前区站席 · 最靠近舞台", "优先通道提前入场", "限定周边礼包", "专属纪念挂牌", "演出场刊一本"],
               en: ["Front standing, closest to stage", "Priority early entry", "Limited merch bundle", "Exclusive laminate pass", "Printed tour programme"],
               jp: ["最前スタンディング", "優先入場", "限定グッズセット", "限定ラミネートパス", "ツアーパンフレット"] } },
    { id: "std", tier: "STANDARD", code: "S", price: 499,
      name: { cn: "普通座席", en: "GENERAL SEATING", jp: "一般席" },
      perks: { cn: ["对号入座座席", "标准入场通道", "电子场刊"],
               en: ["Reserved seating", "Standard entry", "Digital programme"],
               jp: ["指定席", "通常入場", "デジタルパンフレット"] } }
  ];

  var T = {
    cn: { heroBadge: "非官方同人企划 · 全流程为模拟购票演示 · 并非真实门票，不收集任何支付信息",
      tagline: "“Once and for all, dice away.”",
      getTickets: "选择场次", scroll: "向下滑动 · 全 17 站",
      tourEyebrow: "WORLD TOUR 2026", tourTitle: "全部巡演场次", tourSub: "17 场公演 · 11 座城市 · 横跨全球",
      from: "起", bookBtn: "选座购票", statusPlenty: "余票充足", statusFew: "仅剩少量", statusSold: "已售罄",
      chooseZone: "选择座位档", zoneHint: "在场馆图上点选一个区域，右侧查看该档位权益与价格。", includes: "包含权益",
      next: "下一步", back: "上一步", nameStep: "这张票印给谁？", nameLabel: "持票人姓名", namePlaceholder: "输入将印在票面上的名字", issueBtn: "生成电子票",
      ticketReady: "电子票已生成", download: "下载 PNG 票券", bookAnother: "再选一场", close: "关闭",
      lblCity: "城市", lblVenue: "场馆", lblDate: "日期", lblTier: "档位", lblZone: "区域", lblSeat: "座位", lblName: "持票人",
      footNote: "本网站为非官方粉丝同人企划，与任何真实艺人、乐队、场馆或票务平台无关。所有场次、地址、座位、票券均为虚构，购票流程为纯前端模拟，不收集任何姓名以外的信息，更不涉及任何真实支付。仅供娱乐。" },
    en: { heroBadge: "UNOFFICIAL FAN PROJECT · THE ENTIRE CHECKOUT IS A SIMULATION · NOT A REAL TICKET, NO PAYMENT DATA COLLECTED",
      tagline: "“Once and for all, dice away.”",
      getTickets: "GET TICKETS", scroll: "SCROLL · ALL 17 STOPS",
      tourEyebrow: "WORLD TOUR 2026", tourTitle: "ALL TOUR DATES", tourSub: "17 SHOWS · 11 CITIES · WORLDWIDE",
      from: "FROM", bookBtn: "BOOK", statusPlenty: "AVAILABLE", statusFew: "FEW LEFT", statusSold: "SOLD OUT",
      chooseZone: "CHOOSE YOUR ZONE", zoneHint: "Tap a zone on the map to see its tier perks and price on the right.", includes: "INCLUDES",
      next: "NEXT", back: "BACK", nameStep: "WHOSE NAME GOES ON IT?", nameLabel: "ATTENDEE NAME", namePlaceholder: "Name to print on the ticket", issueBtn: "ISSUE TICKET",
      ticketReady: "YOUR TICKET IS READY", download: "DOWNLOAD PNG", bookAnother: "BOOK ANOTHER", close: "CLOSE",
      lblCity: "CITY", lblVenue: "VENUE", lblDate: "DATE", lblTier: "TIER", lblZone: "ZONE", lblSeat: "SEAT", lblName: "ATTENDEE",
      footNote: "An unofficial, non-commercial fan project. Not affiliated with any real artist, band, venue or ticketing service. All dates, addresses, seats and tickets are fictional; the checkout is a front-end simulation that collects nothing beyond a name and involves no real payment whatsoever. For fun only." },
    jp: { heroBadge: "非公式ファン企画 · 購入フローはすべて模擬 · 実チケットではなく、決済情報は一切収集しません",
      tagline: "“Once and for all, dice away.”",
      getTickets: "チケットを選ぶ", scroll: "下へスクロール · 全17公演",
      tourEyebrow: "WORLD TOUR 2026", tourTitle: "全ツアー日程", tourSub: "全17公演 · 11都市 · 世界各地",
      from: "より", bookBtn: "予約する", statusPlenty: "販売中", statusFew: "残りわずか", statusSold: "完売",
      chooseZone: "ゾーンを選択", zoneHint: "マップでゾーンを選ぶと、右側に特典と料金が表示されます。", includes: "特典",
      next: "次へ", back: "戻る", nameStep: "チケットの名義は？", nameLabel: "氏名", namePlaceholder: "チケットに印字する名前", issueBtn: "チケット発行",
      ticketReady: "チケットが発行されました", download: "PNGを保存", bookAnother: "別の公演", close: "閉じる",
      lblCity: "都市", lblVenue: "会場", lblDate: "日付", lblTier: "ランク", lblZone: "ゾーン", lblSeat: "座席", lblName: "氏名",
      footNote: "非公式・非営利のファン企画です。実在のアーティスト・バンド・会場・チケット販売とは一切関係ありません。日程・住所・座席・チケットはすべて架空で、購入フローはフロントエンドの模擬です。氏名以外の情報は収集せず、実際の決済は一切行いません。娯楽目的のみ。" }
  };

  var state = {
    lang: "cn",
    open: false,
    stopIndex: null,
    step: "zone",
    zoneId: null,
    name: "",
    ticket: null
  };

  var cheerPlaying = false;
  var cheerTimer = null;
  var heroImg = new Image();
  heroImg.src = "assets/hero.jpg";
  var cheerPreload = new Image();
  cheerPreload.src = "assets/cheer.gif";

  var app = document.getElementById("app");

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function t() {
    return T[state.lang];
  }

  // ---------------------------------------------------------------- header

  function renderHeader() {
    var tt = t();
    function langBtn(code, label) {
      var active = state.lang === code;
      return (
        '<button type="button" class="lang-btn' + (active ? " active" : "") + '" data-act="setLang" data-lang="' + code + '" ' +
        'style="position:relative;white-space:nowrap;font-family:var(--mono);font-weight:700;font-size:.58rem;letter-spacing:.05em;padding:.34rem .5rem;border:0;border-radius:999px;background:transparent;color:var(--paper);cursor:pointer;">' +
        label +
        '<span class="lang-underline" style="position:absolute;left:22%;right:22%;bottom:1px;height:2px;border-radius:2px;background:var(--hot);box-shadow:0 0 8px var(--hot);"></span>' +
        "</button>"
      );
    }
    return (
      '<header style="position:fixed;z-index:60;top:0;left:0;width:100%;display:flex;align-items:center;justify-content:space-between;gap:.8rem;padding:clamp(.8rem,2.2vw,1.6rem) clamp(1rem,4vw,4rem);pointer-events:none;">' +
        '<a href="#top" style="pointer-events:auto;display:flex;flex-direction:column;line-height:.82;filter:drop-shadow(0 2px 12px rgba(23,0,6,.55));">' +
          '<span style="font-family:var(--mono);font-size:.48rem;font-weight:700;letter-spacing:.28em;color:var(--muted);margin-bottom:.35rem;">DiŹ WORLD TOUR 2026</span>' +
          '<span style="font-family:var(--display);font-weight:700;font-size:clamp(1.2rem,2vw,1.6rem);letter-spacing:.02em;color:var(--paper);">TSUKUMO<span style="color:var(--pink);">99</span></span>' +
        "</a>" +
        '<div style="pointer-events:auto;display:flex;align-items:center;gap:clamp(.4rem,1.4vw,.9rem);">' +
          '<div style="display:flex;align-items:center;gap:.1rem;padding:.26rem;border:1px solid rgba(255,244,247,.2);border-radius:999px;background:rgba(23,0,6,.55);backdrop-filter:blur(12px);">' +
            langBtn("cn", "中文") + langBtn("en", "EN") + langBtn("jp", "日本語") +
          "</div>" +
        "</div>" +
      "</header>"
    );
  }

  // ------------------------------------------------------------ hero badge

  function heroBadgeHtml(tt) {
    return (
      '<p style="margin:.9rem 0 0;display:inline-flex;max-width:34rem;font-family:var(--mono);font-size:.56rem;font-weight:700;letter-spacing:.05em;line-height:1.6;padding:.5rem .7rem;border:1px solid rgba(255,134,189,.4);border-radius:.3rem;background:rgba(23,0,6,.55);color:var(--pink);text-wrap:pretty;">' +
      "⚠ " + esc(tt.heroBadge) +
      "</p>"
    );
  }

  // -------------------------------------------------------- cheer button

  function cheerButtonHtml(size) {
    return (
      '<button type="button" class="cheer-btn" data-act="cheer" aria-label="cheer" style="position:relative;width:100%;aspect-ratio:1536/1774;display:block;padding:0;border:0;background:transparent;cursor:pointer;filter:drop-shadow(0 ' + size + ' 1.2rem rgba(23,0,6,.45));">' +
        '<span style="position:absolute;z-index:1;inset:0;overflow:hidden;-webkit-mask-image:radial-gradient(ellipse 67% 72% at 50% 64%,#000 58%,transparent 91%);mask-image:radial-gradient(ellipse 67% 72% at 50% 64%,#000 58%,transparent 91%);">' +
          '<img class="cheer-img" src="assets/cheer-still.png" alt="" style="width:100%;height:100%;object-fit:contain;object-position:center bottom;mix-blend-mode:multiply;filter:contrast(1.08) saturate(1.08);user-select:none;-webkit-user-drag:none;"/>' +
        "</span>" +
      "</button>"
    );
  }

  // --------------------------------------------------------------- hero

  function renderHeroMobile() {
    var tt = t();
    return (
      '<div class="hero-mobile">' +
      '<main style="position:relative;min-height:100svh;overflow:hidden;background:var(--ink);">' +
        '<img src="assets/hero.jpg" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:52% 6%;"/>' +
        '<div aria-hidden="true" style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(23,0,6,.18) 0%,transparent 26%,rgba(23,0,6,.4) 50%,rgba(23,0,6,.9) 80%,var(--ink) 100%);"></div>' +
        '<div aria-hidden="true" style="position:absolute;top:-15%;left:40%;width:6rem;height:80%;background:linear-gradient(180deg,rgba(255,219,232,.22),transparent 70%);filter:blur(1rem);transform:rotate(22deg);transform-origin:top center;animation:sweep 6s ease-in-out infinite;"></div>' +
        '<div style="position:absolute;z-index:12;right:clamp(.5rem,4vw,1.4rem);bottom:clamp(12.5rem,42vh,17rem);width:clamp(6.5rem,27vw,9rem);">' +
          cheerButtonHtml(".6rem") +
        "</div>" +
        '<div style="position:absolute;left:0;right:0;bottom:0;padding:0 clamp(1.2rem,6vw,2rem) clamp(1.7rem,6vh,2.6rem);display:flex;flex-direction:column;align-items:flex-start;gap:.45rem;">' +
          '<h1 style="margin:0;font-family:var(--display);font-weight:700;font-style:italic;text-transform:uppercase;line-height:.78;">' +
            '<span style="display:block;font-size:clamp(4.5rem,27vw,8rem);letter-spacing:-.02em;color:var(--hot);filter:drop-shadow(0 .05em 0 rgba(76,0,26,.7)) drop-shadow(0 0 1.8rem rgba(236,0,80,.55));">DiŹ</span>' +
          "</h1>" +
          '<div style="display:flex;align-items:baseline;gap:.5rem;flex-wrap:wrap;">' +
            '<span style="font-family:var(--display);font-weight:700;font-size:clamp(1.35rem,7.5vw,2rem);letter-spacing:.02em;color:var(--paper);text-transform:uppercase;">TSUKUMO<span style="color:var(--pink);">99</span></span>' +
            '<span style="font-family:var(--mono);font-weight:700;font-size:.58rem;letter-spacing:.22em;color:var(--pink);">WORLD TOUR 2026</span>' +
          "</div>" +
          '<p style="margin:.3rem 0 0;font-family:var(--display);font-style:italic;font-weight:500;font-size:clamp(.95rem,4.5vw,1.2rem);letter-spacing:.02em;color:var(--paper);opacity:.92;">' + esc(tt.tagline) + "</p>" +
          heroBadgeHtml(tt) +
          '<a href="#tour" class="btn-cta" style="margin-top:1rem;display:inline-flex;align-items:center;gap:.5rem;white-space:nowrap;font-family:var(--mono);font-weight:700;font-size:.8rem;letter-spacing:.12em;text-transform:uppercase;padding:.9rem 1.6rem;border-radius:.3rem;box-shadow:0 10px 30px rgba(236,0,80,.45);">' + esc(tt.getTickets) + ' <span style="font-size:1rem;">↓</span></a>' +
          '<span style="margin-top:.65rem;display:inline-flex;align-items:center;gap:.5rem;font-family:var(--mono);font-size:.58rem;letter-spacing:.14em;color:var(--muted);"><span style="display:inline-block;animation:bob 1.8s ease-in-out infinite;">↓</span>' + esc(tt.scroll) + "</span>" +
        "</div>" +
      "</main>" +
      "</div>"
    );
  }

  function renderHeroDesktop() {
    var tt = t();
    return (
      '<div class="hero-desktop">' +
      '<main style="position:relative;isolation:isolate;min-height:100svh;display:flex;align-items:center;overflow:hidden;background:linear-gradient(105deg,#1a0009 0%,#350013 46%,transparent 74%),var(--wine);width:100%;">' +
        '<div aria-hidden="true" style="position:absolute;z-index:-2;inset:0;">' +
          '<img src="assets/hero.jpg" alt="" style="position:absolute;top:0;right:0;width:min(72%,880px);height:100%;object-fit:cover;object-position:54% 20%;filter:saturate(1.04) contrast(1.03);"/>' +
          '<div style="position:absolute;inset:0;background:linear-gradient(95deg,#180008 0%,rgba(24,0,8,.9) 24%,rgba(24,0,8,.35) 52%,transparent 66%),linear-gradient(0deg,rgba(23,0,6,.72),transparent 40%);"></div>' +
        "</div>" +
        '<div aria-hidden="true" style="position:absolute;z-index:-1;top:-22%;left:47%;width:8rem;height:110%;background:linear-gradient(180deg,rgba(255,219,232,.22),transparent 70%);filter:blur(1.1rem);transform:rotate(24deg);transform-origin:top center;animation:sweep 6s ease-in-out infinite;"></div>' +
        '<div aria-hidden="true" style="position:absolute;z-index:-1;top:-22%;left:78%;width:8rem;height:110%;background:linear-gradient(180deg,rgba(255,219,232,.22),transparent 70%);filter:blur(1.1rem);transform:rotate(-23deg);transform-origin:top center;animation:sweep 7.5s ease-in-out infinite;"></div>' +
        '<section style="position:relative;z-index:5;width:min(48rem,100%);padding:6.5rem clamp(1.3rem,5vw,3rem) 7rem clamp(1.3rem,7vw,8rem);">' +
          '<h1 style="margin:0;font-family:var(--display);font-weight:700;font-style:italic;text-transform:uppercase;line-height:.76;">' +
            '<span style="display:block;font-size:clamp(5rem,19vw,14rem);letter-spacing:-.02em;color:var(--hot);filter:drop-shadow(0 .07em 0 rgba(76,0,26,.7)) drop-shadow(0 0 2.4rem rgba(236,0,80,.5));">DiŹ</span>' +
          "</h1>" +
          '<div style="display:flex;align-items:baseline;gap:.7rem;margin-top:.9rem;flex-wrap:wrap;">' +
            '<span style="font-family:var(--display);font-weight:700;font-size:clamp(1.5rem,4.5vw,2.8rem);letter-spacing:.02em;color:var(--paper);text-transform:uppercase;">TSUKUMO<span style="color:var(--pink);">99</span></span>' +
            '<span style="font-family:var(--mono);font-weight:700;font-size:clamp(.68rem,1.2vw,.95rem);letter-spacing:.3em;color:var(--pink);">WORLD TOUR 2026</span>' +
          "</div>" +
          '<p style="margin:1.1rem 0 0;font-family:var(--display);font-style:italic;font-weight:500;font-size:clamp(1rem,1.9vw,1.45rem);letter-spacing:.02em;color:var(--paper);opacity:.92;text-wrap:pretty;">' + esc(tt.tagline) + "</p>" +
          heroBadgeHtml(tt) +
          '<div style="display:flex;flex-wrap:wrap;align-items:center;gap:1rem;margin-top:1.8rem;">' +
            '<a href="#tour" class="btn-cta" style="display:inline-flex;align-items:center;gap:.6rem;white-space:nowrap;font-family:var(--mono);font-weight:700;font-size:.8rem;letter-spacing:.12em;text-transform:uppercase;padding:.9rem 1.6rem;border-radius:.3rem;box-shadow:0 10px 30px rgba(236,0,80,.45);">' + esc(tt.getTickets) + ' <span style="font-size:1rem;">↓</span></a>' +
            '<span style="display:inline-flex;align-items:center;gap:.5rem;font-family:var(--mono);font-size:.6rem;letter-spacing:.14em;color:var(--muted);"><span style="display:inline-block;animation:bob 1.8s ease-in-out infinite;">↓</span>' + esc(tt.scroll) + "</span>" +
          "</div>" +
        "</section>" +
        '<div style="position:absolute;z-index:12;right:clamp(1rem,7vw,7rem);bottom:clamp(.4rem,2vh,1.6rem);width:clamp(7.5rem,15vw,15rem);">' +
          cheerButtonHtml(".8rem") +
        "</div>" +
      "</main>" +
      "</div>"
    );
  }

  // -------------------------------------------------------------- tour

  function renderTour() {
    var tt = t();
    var lang = state.lang;
    var minPrice = Math.min.apply(null, ZONES.map(function (z) { return z.price; }));
    var rows = STOPS.map(function (s, i) {
      var firstOfRegion = i === 0 || STOPS[i - 1].country.en !== s.country.en;
      var soldOut = s.status === "sold";
      var bookable = !soldOut;
      var statusLabel = soldOut ? tt.statusSold : s.status === "few" ? tt.statusFew : tt.statusPlenty;
      var statusColor = soldOut ? "#8d6472" : s.status === "few" ? "#ec0050" : "#ff86bd";
      var regionHtml = firstOfRegion
        ? '<div style="display:flex;align-items:center;gap:.9rem;margin-top:.6rem;">' +
            '<span style="font-family:var(--display);font-weight:700;text-transform:uppercase;font-size:clamp(.95rem,1.9vw,1.35rem);letter-spacing:.12em;color:var(--pink);white-space:nowrap;">' + esc(s.country[lang]) + "</span>" +
            '<span style="flex:1;height:1px;background:linear-gradient(90deg,var(--crimson),transparent);"></span>' +
          "</div>"
        : "";
      var actionHtml = soldOut
        ? '<span style="font-family:var(--mono);font-weight:700;font-size:.7rem;letter-spacing:.1em;padding:.8rem 1.3rem;border:1px solid rgba(255,244,247,.22);border-radius:.3rem;color:var(--muted);text-transform:uppercase;">' + esc(tt.statusSold) + "</span>"
        : '<button type="button" class="stop-book-btn" data-act="book" data-idx="' + i + '" style="font-family:var(--mono);font-weight:700;font-size:.7rem;letter-spacing:.1em;text-transform:uppercase;padding:.8rem 1.3rem;border:0;border-radius:.3rem;background:var(--hot);color:var(--paper);cursor:pointer;box-shadow:0 6px 18px rgba(236,0,80,.35);">' + esc(tt.bookBtn) + "</button>";
      return (
        '<div style="display:flex;flex-direction:column;gap:clamp(1rem,2.2vw,1.7rem);">' +
          regionHtml +
          '<div style="display:grid;grid-template-columns:clamp(3rem,7vw,5.2rem) 1fr;gap:clamp(.75rem,2vw,1.6rem);">' +
            '<div style="position:relative;text-align:right;padding-right:1rem;">' +
              '<div style="font-family:var(--display);font-weight:700;font-size:clamp(1.4rem,3vw,2.3rem);line-height:1;color:var(--pink);">' + ("0" + (i + 1)).slice(-2) + "</div>" +
              '<div style="font-family:var(--mono);font-size:.56rem;letter-spacing:.02em;color:var(--muted);margin-top:.4rem;">' + s.date + "</div>" +
              '<div style="position:absolute;top:.4rem;bottom:-1.9rem;right:0;width:2px;background:linear-gradient(180deg,var(--crimson),rgba(141,0,44,.12));"></div>' +
              '<div style="position:absolute;top:.4rem;right:-5px;width:11px;height:11px;border-radius:50%;background:var(--hot);box-shadow:0 0 10px var(--hot);"></div>' +
            "</div>" +
            '<div style="position:relative;overflow:hidden;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:1rem;padding:clamp(1rem,2.2vw,1.6rem);border:1px solid rgba(255,134,189,.18);border-radius:.45rem;background:linear-gradient(135deg,var(--wine),var(--wine2));">' +
              '<div style="min-width:10rem;flex:1;">' +
                '<h3 style="margin:0;font-family:var(--display);font-weight:700;text-transform:uppercase;font-size:clamp(1.25rem,2.6vw,2rem);line-height:1;letter-spacing:.01em;color:var(--paper);">' + esc(s.city[lang]) + "</h3>" +
                '<p style="margin:.5rem 0 0;font-family:var(--mono);font-size:.7rem;font-weight:700;letter-spacing:.06em;color:var(--pink);">' + esc(s.venue[lang]) + "</p>" +
                '<p style="margin:.3rem 0 0;font-family:var(--body);font-size:.7rem;color:var(--muted);">' + esc(s.addr[lang]) + "</p>" +
              "</div>" +
              '<div style="display:flex;align-items:center;gap:clamp(.8rem,2vw,1.5rem);flex-wrap:wrap;">' +
                '<div style="text-align:right;">' +
                  '<div style="display:inline-flex;align-items:center;gap:.4rem;font-family:var(--mono);font-size:.58rem;font-weight:700;letter-spacing:.1em;color:' + statusColor + ';"><span style="width:.4rem;height:.4rem;border-radius:50%;background:' + statusColor + ';box-shadow:0 0 6px ' + statusColor + ';"></span>' + esc(statusLabel) + "</div>" +
                  '<div style="margin-top:.35rem;font-family:var(--mono);font-size:.6rem;color:var(--muted);">' + esc(tt.from) + " ◈" + minPrice + "</div>" +
                "</div>" +
                actionHtml +
              "</div>" +
            "</div>" +
          "</div>" +
        "</div>"
      );
    }).join("");

    return (
      '<section id="tour" style="position:relative;padding:clamp(3.5rem,9vw,7.5rem) clamp(1rem,5vw,5rem) clamp(3rem,7vw,6rem);background:radial-gradient(circle at 85% 4%,rgba(236,0,80,.14),transparent 40%),var(--ink);">' +
        '<div style="max-width:64rem;margin:0 auto;">' +
          '<p style="margin:0 0 .8rem;font-family:var(--mono);font-size:.66rem;font-weight:700;letter-spacing:.28em;color:var(--hot);">' + esc(tt.tourEyebrow) + "</p>" +
          '<h2 style="margin:0;font-family:var(--display);font-weight:700;text-transform:uppercase;font-size:clamp(1.8rem,5vw,3.4rem);line-height:.95;letter-spacing:-.01em;color:var(--paper);text-wrap:balance;">' + esc(tt.tourTitle) + "</h2>" +
          '<p style="margin:.9rem 0 0;font-family:var(--mono);font-size:.68rem;letter-spacing:.18em;color:var(--muted);">' + esc(tt.tourSub) + "</p>" +
          '<div style="margin-top:clamp(2.2rem,5vw,4rem);display:flex;flex-direction:column;gap:clamp(1rem,2.2vw,1.7rem);">' + rows + "</div>" +
        "</div>" +
      "</section>"
    );
  }

  // ------------------------------------------------------------- footer

  function renderFooter() {
    var tt = t();
    return (
      '<footer style="padding:clamp(2.5rem,5vw,4rem) clamp(1rem,5vw,5rem);background:var(--wine);border-top:1px solid rgba(255,134,189,.15);">' +
        '<div style="max-width:64rem;margin:0 auto;display:flex;flex-direction:column;gap:1.1rem;">' +
          '<div style="display:flex;align-items:baseline;gap:.7rem;flex-wrap:wrap;">' +
            '<span style="font-family:var(--display);font-weight:700;font-size:1.4rem;color:var(--paper);">TSUKUMO<span style="color:var(--pink);">99</span></span>' +
            '<span style="font-family:var(--mono);font-size:.53rem;letter-spacing:.22em;color:var(--muted);">DiŹ WORLD TOUR 2026</span>' +
          "</div>" +
          '<p style="margin:0;max-width:44rem;font-family:var(--body);font-size:.72rem;line-height:1.7;color:var(--muted);text-wrap:pretty;">' + esc(tt.footNote) + "</p>" +
          '<p style="margin:0;font-family:var(--mono);font-size:.53rem;letter-spacing:.14em;color:rgba(255,244,247,.4);">UNOFFICIAL / FAN-MADE, NOT A REAL TICKET · WEB PREVIEW 2026</p>' +
        "</div>" +
      "</footer>"
    );
  }

  // -------------------------------------------------------------- modal

  function computeCur() {
    return state.stopIndex != null ? STOPS[state.stopIndex] : null;
  }
  function computeSelZone() {
    return state.zoneId ? ZONES.filter(function (z) { return z.id === state.zoneId; })[0] : null;
  }

  function renderZoneStep() {
    var tt = t();
    var lang = state.lang;
    var cur = computeCur();
    var selZone = computeSelZone();

    function mapBtn(z) {
      var sel = state.zoneId === z.id;
      var border = sel ? "2px solid var(--hot)" : "1px solid rgba(255,134,189,.28)";
      var bg = sel ? "rgba(236,0,80,.22)" : "rgba(255,244,247,.04)";
      var shadow = sel ? "0 0 26px rgba(236,0,80,.5)" : "none";
      var color = z.id === "vip" ? "var(--hot)" : "var(--pink)";
      var pad = z.id === "vip" ? "1rem" : "1.3rem 1rem";
      var width = z.id === "vip" ? "82%;margin:.4rem auto 0;" : "100%;";
      return (
        '<button type="button" data-act="selectZone" data-zone="' + z.id + '" style="width:' + width + 'padding:' + pad + ';border-radius:.35rem;cursor:pointer;text-align:center;border:' + border + ";background:" + bg + ";box-shadow:" + shadow + ';">' +
          '<div style="font-family:var(--mono);font-size:.53rem;font-weight:700;letter-spacing:.16em;color:' + color + ';">' + z.tier + "</div>" +
          '<div style="margin-top:.25rem;font-family:var(--display);font-weight:700;text-transform:uppercase;font-size:clamp(.9rem,1.8vw,1.15rem);color:var(--paper);">' + esc(z.name[lang]) + "</div>" +
        "</button>"
      );
    }

    var vip = ZONES[0], std = ZONES[1];

    var detailHtml;
    if (!selZone) {
      detailHtml = '<div style="min-height:11rem;display:flex;align-items:center;justify-content:center;text-align:center;padding:1.5rem;border:1px dashed rgba(255,134,189,.3);border-radius:.45rem;font-family:var(--mono);font-size:.7rem;line-height:1.7;color:var(--muted);text-wrap:pretty;">' + esc(tt.zoneHint) + "</div>";
    } else {
      var perks = selZone.perks[lang].map(function (p) {
        return '<li style="display:flex;gap:.55rem;font-family:var(--body);font-size:.72rem;line-height:1.45;color:var(--paper);"><span style="color:var(--hot);flex-shrink:0;">◈</span>' + esc(p) + "</li>";
      }).join("");
      detailHtml = (
        '<div style="border:1px solid rgba(255,134,189,.3);border-radius:.45rem;padding:1.25rem;background:rgba(23,0,6,.4);">' +
          '<div style="display:flex;align-items:baseline;justify-content:space-between;gap:.6rem;">' +
            '<span style="font-family:var(--mono);font-size:.56rem;font-weight:700;letter-spacing:.14em;color:var(--pink);">' + selZone.tier + "</span>" +
            '<span style="font-family:var(--display);font-weight:700;font-size:1.4rem;color:var(--hot);">◈' + selZone.price + "</span>" +
          "</div>" +
          '<div style="margin-top:.2rem;font-family:var(--display);font-weight:700;text-transform:uppercase;font-size:1.1rem;color:var(--paper);">' + esc(selZone.name[lang]) + "</div>" +
          '<div style="margin-top:.85rem;font-family:var(--mono);font-size:.53rem;letter-spacing:.12em;color:var(--muted);">' + esc(tt.includes) + "</div>" +
          '<ul style="margin:.5rem 0 0;padding:0;list-style:none;display:flex;flex-direction:column;gap:.4rem;">' + perks + "</ul>" +
          '<button type="button" data-act="toName" class="btn-cta" style="margin-top:1.2rem;width:100%;font-family:var(--mono);font-weight:700;font-size:.75rem;letter-spacing:.12em;text-transform:uppercase;padding:.85rem;border:0;border-radius:.3rem;cursor:pointer;box-shadow:0 8px 22px rgba(236,0,80,.4);">' + esc(tt.next) + " →</button>" +
        "</div>"
      );
    }

    return (
      '<div>' +
        '<h3 style="margin:0;font-family:var(--display);font-weight:700;text-transform:uppercase;font-size:clamp(1.3rem,3vw,2rem);color:var(--paper);">' + esc(tt.chooseZone) + "</h3>" +
        '<p style="margin:.55rem 0 0;font-family:var(--mono);font-size:.66rem;letter-spacing:.04em;color:var(--pink);text-wrap:pretty;">' + ("0" + (state.stopIndex + 1)).slice(-2) + " · " + esc(cur.city[lang]) + " — " + esc(cur.venue[lang]) + " · " + cur.date + "</p>" +
        '<div style="margin-top:1.5rem;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,16rem),1fr));gap:clamp(1rem,2.5vw,1.8rem);align-items:start;">' +
          '<div style="background:radial-gradient(ellipse at 50% -10%,rgba(236,0,80,.32),transparent 62%),#1c0009;border:1px solid rgba(255,134,189,.15);border-radius:.45rem;padding:clamp(1rem,2.5vw,1.5rem);display:flex;flex-direction:column;gap:.8rem;">' +
            '<div style="text-align:center;font-family:var(--mono);font-size:.54rem;letter-spacing:.4em;color:var(--muted);">STAGE</div>' +
            '<div style="height:.45rem;border-radius:99px;background:linear-gradient(90deg,transparent,var(--hot),transparent);box-shadow:0 0 22px var(--hot);"></div>' +
            mapBtn(vip) + mapBtn(std) +
          "</div>" +
          "<div>" + detailHtml + "</div>" +
        "</div>" +
      "</div>"
    );
  }

  function renderNameStep() {
    var tt = t();
    var lang = state.lang;
    var cur = computeCur();
    var selZone = computeSelZone();
    var canIssue = !!state.zoneId && state.name.trim().length > 0;
    return (
      '<div style="max-width:34rem;">' +
        '<h3 style="margin:0;font-family:var(--display);font-weight:700;text-transform:uppercase;font-size:clamp(1.3rem,3vw,2rem);color:var(--paper);">' + esc(tt.nameStep) + "</h3>" +
        '<div style="margin-top:1.1rem;padding:.9rem 1.1rem;border:1px solid rgba(255,134,189,.2);border-radius:.4rem;background:rgba(23,0,6,.4);font-family:var(--mono);font-size:.66rem;line-height:1.7;color:var(--muted);">' +
          '<div style="color:var(--paper);">' + esc(cur.city[lang]) + " · " + esc(cur.venue[lang]) + "</div>" +
          "<div>" + cur.date + " · " + selZone.tier + " — " + esc(selZone.name[lang]) + ' · <span style="color:var(--hot);">◈' + selZone.price + "</span></div>" +
        "</div>" +
        '<label style="display:block;margin-top:1.4rem;font-family:var(--mono);font-size:.6rem;font-weight:700;letter-spacing:.14em;color:var(--pink);text-transform:uppercase;">' + esc(tt.nameLabel) + "</label>" +
        '<input id="nameInput" type="text" class="input-name" value="' + esc(state.name) + '" placeholder="' + esc(tt.namePlaceholder) + '" style="margin-top:.55rem;width:100%;font-family:var(--display);font-weight:500;font-size:1.35rem;letter-spacing:.02em;padding:.85rem 1rem;border:1.5px solid;border-radius:.4rem;outline:none;"/>' +
        '<div style="display:flex;flex-wrap:wrap;gap:.8rem;margin-top:1.5rem;">' +
          '<button type="button" data-act="backToZone" class="btn-outline" style="font-family:var(--mono);font-weight:700;font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;padding:.85rem 1.3rem;border:1px solid;border-radius:.3rem;cursor:pointer;">← ' + esc(tt.back) + "</button>" +
          '<button type="button" id="issueBtn" data-act="issue" class="btn-cta" style="display:' + (canIssue ? "" : "none") + ';flex:1;min-width:12rem;font-family:var(--mono);font-weight:700;font-size:.75rem;letter-spacing:.12em;text-transform:uppercase;padding:.85rem 1.3rem;border:0;border-radius:.3rem;cursor:pointer;box-shadow:0 8px 22px rgba(236,0,80,.4);">' + esc(tt.issueBtn) + "</button>" +
          '<span id="issueDisabled" style="display:' + (canIssue ? "none" : "") + ';flex:1;min-width:12rem;text-align:center;font-family:var(--mono);font-weight:700;font-size:.75rem;letter-spacing:.12em;text-transform:uppercase;padding:.85rem 1.3rem;border-radius:.3rem;background:rgba(236,0,80,.2);color:rgba(255,244,247,.5);cursor:not-allowed;">' + esc(tt.issueBtn) + "</span>" +
        "</div>" +
      "</div>"
    );
  }

  function renderTicketStep() {
    var tt = t();
    var lang = state.lang;
    var tkt = state.ticket;
    var s = STOPS[tkt.stopIndex];
    var z = ZONES.filter(function (x) { return x.id === tkt.zoneId; })[0];
    var seed = ticketSeed(tkt.ticketNo);
    var bars = [];
    for (var k = 0; k < 34; k++) bars.push(1 + ((seed * (k + 7)) % 4));
    var on = [true, false, true, false, true, false, true, false, true];

    var pipsHtml = on.map(function (v) {
      return '<span style="border-radius:50%;background:' + (v ? "var(--paper)" : "transparent") + ';"></span>';
    }).join("");
    var barsHtml = bars.map(function (b) {
      return '<span style="display:inline-block;width:' + b + "px;height:100%;background:var(--paper);\"></span>";
    }).join("");

    function field(label, value, hot) {
      return '<div><div style="font-family:var(--mono);font-size:.5rem;letter-spacing:.12em;color:var(--muted);">' + esc(label) + '</div><div style="font-family:var(--display);font-weight:700;font-size:1rem;color:' + (hot ? "var(--hot)" : "var(--paper)") + ';text-transform:uppercase;">' + esc(value) + "</div></div>";
    }

    return (
      '<div>' +
        '<h3 style="margin:0 0 1.2rem;font-family:var(--display);font-weight:700;text-transform:uppercase;font-size:clamp(1.3rem,3vw,2rem);color:var(--paper);">✓ ' + esc(tt.ticketReady) + "</h3>" +
        '<div style="display:flex;flex-wrap:wrap;border:2px solid var(--pink);border-radius:.5rem;overflow:hidden;background:linear-gradient(135deg,#3a0014,#170006 55%,#4c001a);box-shadow:0 20px 60px rgba(0,0,0,.5);">' +
          '<div style="flex:1;min-width:15rem;padding:clamp(1.1rem,3vw,1.7rem);position:relative;">' +
            '<div style="display:flex;align-items:baseline;justify-content:space-between;gap:.5rem;flex-wrap:wrap;">' +
              '<span style="font-family:var(--mono);font-size:.54rem;font-weight:700;letter-spacing:.2em;color:var(--muted);">TSUKUMO99 · DiŹ WORLD TOUR</span>' +
              '<span style="font-family:var(--mono);font-size:.54rem;letter-spacing:.1em;color:var(--pink);">' + tkt.ticketNo + "</span>" +
            "</div>" +
            '<div style="margin-top:.55rem;font-family:var(--display);font-weight:700;font-style:italic;text-transform:uppercase;font-size:clamp(2rem,6vw,2.8rem);line-height:.95;color:var(--hot);filter:drop-shadow(0 0 1rem rgba(236,0,80,.4));">DiŹ</div>' +
            '<div style="margin-top:1rem;display:grid;grid-template-columns:1fr 1fr;gap:.85rem .8rem;">' +
              field(tt.lblCity, s.city[lang]) + field(tt.lblDate, s.date) +
              field(tt.lblVenue, s.venue[lang]) + field(tt.lblTier, z.tier + " · ◈" + z.price, true) +
              field(tt.lblZone, z.name[lang]) + field(tt.lblSeat, tkt.row + "-" + tkt.seat) +
              '<div style="grid-column:1/-1;"><div style="font-family:var(--mono);font-size:.5rem;letter-spacing:.12em;color:var(--muted);">' + esc(tt.lblName) + '</div><div style="font-family:var(--display);font-weight:700;font-size:1.25rem;color:var(--paper);">' + esc(tkt.name) + "</div></div>" +
            "</div>" +
            '<div style="margin-top:1.1rem;font-family:var(--mono);font-size:.5rem;font-weight:700;letter-spacing:.08em;color:var(--hot);">UNOFFICIAL / FAN-MADE</div>' +
          "</div>" +
          '<div style="width:clamp(6.5rem,22%,9rem);border-left:2px dashed rgba(255,244,247,.45);padding:clamp(.9rem,2.5vw,1.3rem) .8rem;display:flex;flex-direction:column;align-items:center;justify-content:space-between;gap:.9rem;background:rgba(23,0,6,.35);">' +
            '<div style="font-family:var(--mono);font-size:.55rem;font-weight:700;letter-spacing:.3em;color:var(--pink);">ADMIT ONE</div>' +
            '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:.28rem;width:2.4rem;height:2.4rem;">' + pipsHtml + "</div>" +
            '<div style="display:flex;align-items:flex-end;gap:1px;height:2.4rem;">' + barsHtml + "</div>" +
            '<div style="font-family:var(--mono);font-size:.5rem;letter-spacing:.06em;color:var(--muted);word-break:break-all;text-align:center;">' + tkt.ticketNo + "</div>" +
          "</div>" +
        "</div>" +
        '<div style="display:flex;flex-wrap:wrap;gap:.8rem;margin-top:1.4rem;">' +
          '<button type="button" data-act="downloadTicket" class="btn-cta" style="flex:1;min-width:12rem;font-family:var(--mono);font-weight:700;font-size:.78rem;letter-spacing:.12em;text-transform:uppercase;padding:.9rem 1.3rem;border:0;border-radius:.3rem;cursor:pointer;box-shadow:0 8px 22px rgba(236,0,80,.4);">↓ ' + esc(tt.download) + "</button>" +
          '<button type="button" data-act="bookAnother" class="btn-outline" style="font-family:var(--mono);font-weight:700;font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;padding:.9rem 1.3rem;border:1px solid;border-radius:.3rem;cursor:pointer;">' + esc(tt.bookAnother) + "</button>" +
        "</div>" +
      "</div>"
    );
  }

  function renderModal() {
    if (!state.open) return "";
    var tt = t();
    var stepMap = { zone: { no: "01", label: tt.chooseZone }, name: { no: "02", label: tt.nameStep }, ticket: { no: "03", label: tt.ticketReady } };
    var sm = stepMap[state.step];
    var body = state.step === "zone" ? renderZoneStep() : state.step === "name" ? renderNameStep() : renderTicketStep();
    return (
      '<div id="modalBackdrop" data-act="backdrop" style="position:fixed;inset:0;z-index:100;background:rgba(8,0,4,.84);backdrop-filter:blur(9px);display:flex;align-items:center;justify-content:center;padding:clamp(.6rem,3vw,2rem);">' +
        '<div style="width:min(940px,100%);max-height:94svh;overflow:auto;background:linear-gradient(165deg,var(--wine),var(--ink));border:1px solid rgba(255,134,189,.28);border-radius:.6rem;box-shadow:0 30px 90px rgba(0,0,0,.6);animation:popIn 260ms ease-out;">' +
          '<div style="position:sticky;top:0;z-index:2;display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:1rem clamp(1.1rem,3vw,2rem);background:linear-gradient(180deg,var(--wine),rgba(58,0,20,.9));border-bottom:1px solid rgba(255,134,189,.15);backdrop-filter:blur(6px);">' +
            '<div style="font-family:var(--mono);font-size:.6rem;font-weight:700;letter-spacing:.14em;color:var(--pink);">' + sm.no + ' / 03 · <span style="color:var(--paper);">' + esc(sm.label) + "</span></div>" +
            '<button type="button" data-act="close" class="modal-close" style="font-family:var(--mono);font-size:.6rem;font-weight:700;letter-spacing:.08em;padding:.5rem .75rem;border:1px solid rgba(255,244,247,.25);border-radius:.3rem;background:transparent;color:var(--paper);cursor:pointer;text-transform:uppercase;">✕ ' + esc(tt.close) + "</button>" +
          "</div>" +
          '<div style="padding:clamp(1.2rem,3.5vw,2.4rem);">' + body + "</div>" +
        "</div>" +
      "</div>"
    );
  }

  // ---------------------------------------------------------- ticket png

  function ticketSeed(ticketNo) {
    var s = 0;
    for (var i = 0; i < ticketNo.length; i++) s += ticketNo.charCodeAt(i);
    return s;
  }

  function diceDots(g, cx, cy, s, color) {
    var rr = s * 0.085;
    var off = [0.24, 0.5, 0.76];
    var pts = [[0, 0], [2, 0], [1, 1], [0, 2], [2, 2]];
    g.fillStyle = color;
    pts.forEach(function (p) {
      g.beginPath();
      g.arc(cx - s / 2 + off[p[0]] * s, cy - s / 2 + off[p[1]] * s, rr, 0, 7);
      g.fill();
    });
  }

  function roundRect(g, x, y, w, h, r) {
    g.beginPath();
    g.moveTo(x + r, y);
    g.arcTo(x + w, y, x + w, y + h, r);
    g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r);
    g.arcTo(x, y, x + w, y, r);
    g.closePath();
  }

  function drawTicketCanvas(tkt) {
    var s = STOPS[tkt.stopIndex];
    var z = ZONES.filter(function (x) { return x.id === tkt.zoneId; })[0];
    var DPR = 2;
    var W = 2000, H = 700, M = 26, R = 34;
    var PHOTO = H - 2 * M, STUB = 1540;
    var c = document.createElement("canvas");
    c.width = W * DPR;
    c.height = H * DPR;
    var g = c.getContext("2d");
    g.scale(DPR, DPR);
    g.textBaseline = "alphabetic";

    g.save();
    roundRect(g, M, M, W - 2 * M, H - 2 * M, R);
    g.clip();
    var ix = M, iy = M, iw = W - 2 * M, ih = H - 2 * M;

    var bg = g.createLinearGradient(ix, iy, ix + iw, iy + ih);
    bg.addColorStop(0, "#4c001a");
    bg.addColorStop(0.5, "#2a000f");
    bg.addColorStop(1, "#170006");
    g.fillStyle = bg;
    g.fillRect(ix, iy, iw, ih);

    var glow = g.createRadialGradient(ix + iw * 0.42, iy - 60, 40, ix + iw * 0.42, iy - 60, 520);
    glow.addColorStop(0, "rgba(236,0,80,.42)");
    glow.addColorStop(1, "rgba(236,0,80,0)");
    g.fillStyle = glow;
    g.fillRect(ix, iy, iw, ih);

    g.save();
    g.globalAlpha = 0.06;
    diceDots(g, ix + iw * 0.63, iy + ih * 0.5, 460, "#ff86bd");
    g.restore();

    if (heroImg.complete && heroImg.naturalWidth) {
      g.save();
      g.beginPath();
      g.rect(ix, iy, PHOTO, PHOTO);
      g.clip();
      var S = PHOTO;
      var scale = Math.max(S / heroImg.naturalWidth, S / heroImg.naturalHeight);
      var dw = heroImg.naturalWidth * scale, dh = heroImg.naturalHeight * scale;
      g.drawImage(heroImg, ix + (S - dw) * 0.34, iy - S * 0.06, dw, dh);
      var fade = g.createLinearGradient(ix, 0, ix + PHOTO, 0);
      fade.addColorStop(0, "rgba(23,0,6,.05)");
      fade.addColorStop(0.7, "rgba(42,0,15,.18)");
      fade.addColorStop(1, "rgba(42,0,15,.55)");
      g.fillStyle = fade;
      g.fillRect(ix, iy, PHOTO, PHOTO);
      g.restore();
      g.fillStyle = "#ec0050";
      g.fillRect(ix + PHOTO - 2, iy, 3, ih);
      g.save();
      g.shadowColor = "rgba(236,0,80,.9)";
      g.shadowBlur = 18;
      g.fillRect(ix + PHOTO - 2, iy, 3, ih);
      g.restore();
    }

    var L = ix + PHOTO + 56;
    g.fillStyle = "#e4afbf";
    g.font = "700 19px 'Space Mono',monospace";
    g.fillText("TSUKUMO99   ·   WORLD TOUR 2026", L, iy + 56);
    g.save();
    g.shadowColor = "rgba(236,0,80,.5)";
    g.shadowBlur = 22;
    g.fillStyle = "#ec0050";
    g.font = "italic 700 120px 'Oswald',sans-serif";
    g.fillText("DiŹ", L, iy + 206);
    g.restore();

    g.strokeStyle = "rgba(255,134,189,.16)";
    g.lineWidth = 1;
    g.beginPath();
    g.moveTo(L, iy + 256);
    g.lineTo(STUB - 52, iy + 256);
    g.stroke();

    var c1 = L, c2 = L + 470, gy0 = iy + 308, step = 80;
    var Lcol = [["CITY", s.city.en, false], ["VENUE", s.venue.en, false], ["ZONE", z.name.en, false], ["ATTENDEE", tkt.name, false]];
    var Rcol = [["DATE", s.date, false], ["DOORS · SHOW", "18:30 · 19:30", false], ["TIER", z.tier + "  ◈ " + z.price, true], ["SEAT", tkt.row + "-" + tkt.seat, false]];
    function drawCol(col, cx, vFont) {
      var yy = gy0;
      col.forEach(function (r) {
        g.fillStyle = "#c98aa0";
        g.font = "700 15px 'Space Mono',monospace";
        g.fillText(r[0], cx, yy);
        g.fillStyle = r[2] ? "#ec0050" : "#fff4f7";
        g.font = vFont;
        g.fillText(r[1], cx, yy + 38);
        yy += step;
      });
    }
    drawCol(Lcol, c1, "700 34px 'Oswald',sans-serif");
    drawCol(Rcol, c2, "700 32px 'Oswald',sans-serif");

    g.fillStyle = "#ec0050";
    g.font = "700 15px 'Space Mono',monospace";
    g.fillText("UNOFFICIAL / FAN-MADE", c1, iy + ih - 26);

    g.strokeStyle = "rgba(255,244,247,.5)";
    g.lineWidth = 2;
    g.setLineDash([14, 12]);
    g.beginPath();
    g.moveTo(STUB, iy + 18);
    g.lineTo(STUB, iy + ih - 18);
    g.stroke();
    g.setLineDash([]);
    g.save();
    g.globalCompositeOperation = "destination-out";
    g.beginPath();
    g.arc(STUB, iy, 22, 0, 7);
    g.fill();
    g.beginPath();
    g.arc(STUB, iy + ih, 22, 0, 7);
    g.fill();
    g.restore();

    var seed = ticketSeed(tkt.ticketNo);
    var bLeft = STUB + 52, bRight = ix + iw - 96;
    var sc = (bLeft + bRight) / 2;
    g.textAlign = "center";
    g.fillStyle = "#ff86bd";
    g.font = "700 24px 'Space Mono',monospace";
    g.fillText("ADMIT ONE", sc, iy + 72);
    g.fillStyle = "#c98aa0";
    g.font = "700 14px 'Space Mono',monospace";
    g.fillText("TSUKUMO99 · DiŹ TOUR", sc, iy + 100);
    var bTop = iy + 170, bH = 300;
    var bx = bLeft;
    g.fillStyle = "#fff4f7";
    var k = 0;
    while (bx < bRight) {
      var w = 3 + ((seed * (k + 7)) % 6);
      if (k % 2 === 0) g.fillRect(bx, bTop, w, bH);
      bx += w + 3;
      k++;
    }
    g.fillStyle = "#fff4f7";
    g.font = "700 17px 'Space Mono',monospace";
    g.fillText(tkt.ticketNo, sc, bTop + bH + 42);
    g.fillStyle = "#c98aa0";
    g.font = "700 12px 'Space Mono',monospace";
    g.fillText("SCAN AT DOOR", sc, bTop + bH + 68);
    g.save();
    g.translate(ix + iw - 30, iy + ih / 2);
    g.rotate(-Math.PI / 2);
    g.fillStyle = "rgba(255,134,189,.45)";
    g.font = "700 13px 'Space Mono',monospace";
    g.fillText("WORLD TOUR 2026", 0, 0);
    g.restore();
    g.textAlign = "left";
    g.restore();

    g.save();
    roundRect(g, M, M, W - 2 * M, H - 2 * M, R);
    g.strokeStyle = "#ff86bd";
    g.lineWidth = 5;
    g.stroke();
    g.restore();
    return c;
  }

  function downloadTicket() {
    var tkt = state.ticket;
    if (!tkt) return;
    var c = drawTicketCanvas(tkt);
    c.toBlob(function (b) {
      var url = URL.createObjectURL(b);
      var a = document.createElement("a");
      a.href = url;
      a.download = tkt.ticketNo + ".png";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    }, "image/png");
  }

  // --------------------------------------------------------------- actions

  function setLang(l) {
    state.lang = l;
    render();
  }

  function openBooking(i) {
    state.open = true;
    state.stopIndex = i;
    state.step = "zone";
    state.zoneId = null;
    state.name = "";
    state.ticket = null;
    document.body.style.overflow = "hidden";
    render();
  }

  function closeBooking() {
    state.open = false;
    document.body.style.overflow = "";
    render();
  }

  function selectZone(id) {
    state.zoneId = id;
    render();
  }

  function toName() {
    if (state.zoneId) {
      state.step = "name";
      render();
    }
  }

  function backToZone() {
    state.step = "zone";
    render();
  }

  function bookAnother() {
    state.step = "zone";
    state.zoneId = null;
    state.name = "";
    state.ticket = null;
    render();
  }

  function issue() {
    if (!state.zoneId || !state.name.trim()) return;
    var s = STOPS[state.stopIndex];
    var z = ZONES.filter(function (x) { return x.id === state.zoneId; })[0];
    function r(n) {
      return Math.floor(Math.random() * Math.pow(10, n)).toString().padStart(n, "0");
    }
    var row = String.fromCharCode(65 + Math.floor(Math.random() * 8));
    var seat = 1 + Math.floor(Math.random() * 40);
    state.ticket = {
      stopIndex: state.stopIndex,
      zoneId: z.id,
      name: state.name.trim(),
      ticketNo: "ZL-DIZ-" + s.code + z.code + "-" + r(4),
      row: row,
      seat: seat
    };
    state.step = "ticket";
    render();
  }

  function cheer() {
    if (cheerPlaying) return;
    cheerPlaying = true;
    clearTimeout(cheerTimer);
    var nonce = Date.now();
    var btns = app.querySelectorAll(".cheer-btn");
    btns.forEach(function (btn) {
      var img = btn.querySelector(".cheer-img");
      btn.classList.remove("is-playing");
      img.src = "assets/cheer.gif?play=" + nonce;
      void btn.offsetWidth;
      btn.classList.add("is-playing");
    });
    cheerTimer = setTimeout(function () {
      btns.forEach(function (btn) {
        var img = btn.querySelector(".cheer-img");
        img.src = "assets/cheer-still.png";
        btn.classList.remove("is-playing");
      });
      cheerPlaying = false;
    }, 580);
  }

  // ---------------------------------------------------------------- wire

  function onAct(e) {
    var el = e.currentTarget;
    var act = el.dataset.act;
    if (act === "setLang") setLang(el.dataset.lang);
    else if (act === "book") openBooking(parseInt(el.dataset.idx, 10));
    else if (act === "close") closeBooking();
    else if (act === "selectZone") selectZone(el.dataset.zone);
    else if (act === "toName") toName();
    else if (act === "backToZone") backToZone();
    else if (act === "issue") issue();
    else if (act === "bookAnother") bookAnother();
    else if (act === "downloadTicket") downloadTicket();
    else if (act === "cheer") cheer();
  }

  function onNameInput(e) {
    state.name = e.target.value;
    var canIssue = !!state.zoneId && state.name.trim().length > 0;
    var issueBtn = document.getElementById("issueBtn");
    var issueDisabled = document.getElementById("issueDisabled");
    if (issueBtn) issueBtn.style.display = canIssue ? "" : "none";
    if (issueDisabled) issueDisabled.style.display = canIssue ? "none" : "";
  }

  function wireEvents() {
    var acts = app.querySelectorAll("[data-act]");
    for (var i = 0; i < acts.length; i++) {
      acts[i].addEventListener("click", onAct);
    }
    var backdrop = document.getElementById("modalBackdrop");
    if (backdrop) {
      backdrop.addEventListener("click", function (e) {
        if (e.target === backdrop) closeBooking();
      });
    }
    var nameInput = document.getElementById("nameInput");
    if (nameInput) {
      nameInput.focus();
      var v = nameInput.value;
      nameInput.value = "";
      nameInput.value = v;
      nameInput.addEventListener("input", onNameInput);
    }
  }

  // --------------------------------------------------------------- render

  function render() {
    app.innerHTML =
      renderHeader() +
      '<div id="top">' + renderHeroMobile() + renderHeroDesktop() + "</div>" +
      renderTour() +
      renderFooter() +
      renderModal();
    wireEvents();
  }

  render();
})();
