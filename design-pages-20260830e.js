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
    {id:"news-guide",date:"2026.08.31",cat:"guide",title:{cn:"NEWS 页面导览",en:"How to use NEWS",jp:"NEWSページのご案内"},body:{
      cn:[
        "“声明”包含本站的非官方性质、隐私与数据安全、共创与署名等说明。",
        "“巡演”记录 TSUKUMO99 的故事，后续将持续更新。",
        "“站点”提供网站使用指南和常见问题说明。如果你在使用网页时遇到未被解答的问题，请联系作者"
      ],
      en:[
        "NOTICE covers the site's unofficial status, privacy and data safety, collaboration, and credits.",
        "TOUR follows the story of TSUKUMO99 and will continue to be updated.",
        "SITE contains website guides and answers to common questions. If you encounter an issue that is not covered here, please contact the creator."
      ],
      jp:[
        "「声明」には、非公式サイトであること、プライバシーとデータ保護、共同制作、クレジットに関する説明を掲載しています。",
        "「ツアー」ではTSUKUMO99の物語を紹介し、今後も更新していきます。",
        "「サイト」には、利用ガイドとよくある質問を掲載しています。解決しない問題がある場合は、制作者までご連絡ください。"
      ]
    }},
    {date:"2026.08.31",cat:"tour",title:{cn:"东京 · 出道演唱会公告",en:"Tokyo · Debut concert announcement",jp:"東京 · デビューライブのお知らせ"},body:{
      cn:["如你所见我没有ddl完！！哈哈！以后再补充"],
      en:["As you can see, I did not finish this before the deadline!! Haha! More details later."],
      jp:["ご覧のとおり、締切までに完成しませんでした！！はは！続きは後日追加します。"]
    }},
    {id:"guide-ticket-download",date:"2026.07.15",cat:"site",title:{cn:"电子票券下载与浏览器兼容",en:"E-ticket downloads and browser compatibility",jp:"電子チケットの保存とブラウザ互換性"},body:{
      cn:[
        "电子票券会在当前浏览器完成模拟付款与随机配席后生成。请点击“下载电子票”，并使用 Safari、Chrome 等手机系统浏览器打开本站；微信、QQ 等应用内浏览器可能会拦截下载。",
        "如果仍无反应，请确认浏览器允许下载文件，刷新页面后重新完成一次模拟购票。本站不会保存订单，重新操作也不会产生真实扣款。"
      ],
      en:[
        "Your e-ticket is generated in the current browser after the simulated payment and random seat assignment. Tap “Download e-ticket” and open the site in Safari, Chrome or another system browser; in-app browsers such as WeChat or QQ may block downloads.",
        "If nothing happens, allow file downloads in your browser, refresh the page and complete the simulated purchase again. Orders are not stored and no real charge is made."
      ],
      jp:[
        "電子チケットは、現在のブラウザで模擬決済とランダム配席が完了した後に生成されます。「電子チケットを保存」をタップし、SafariやChromeなど端末の標準ブラウザで本サイトを開いてください。WeChatやQQなどのアプリ内ブラウザでは、ダウンロードがブロックされる場合があります。",
        "反応がない場合は、ブラウザのファイルダウンロードを許可し、ページを更新して模擬購入をやり直してください。注文情報は保存されず、実際の請求も発生しません。"
      ]
    }},
    {id:"guide-live",date:"2026.07.14",cat:"site",title:{cn:"LIVE 互动使用指南",en:"LIVE interaction guide",jp:"LIVEインタラクションガイド"},body:{
      cn:[
        "手机端请先将设备横屏，建议使用页面内的全屏按钮，并开启声音或佩戴耳机。点击“开始游戏”后，在目标进入底部判定区域时按下对应的 Z／O／O／L 按钮；遇到长条目标时需要持续按住。",
        "每回合 15 秒，共 6 回合，难度会逐步提高。如果第 6 回合结束后仍未通关，将触发隐藏剧情。需要时可开启“宇都木代打”协助判定，也可以随时通过退出按钮离开游戏。"
      ],
      en:[
        "On mobile, rotate your device to landscape, use the in-page full-screen button, and turn on sound or wear headphones. After tapping “Start game”, press the matching Z / O / O / L button as a target reaches the judgment line; hold the button for long notes.",
        "Each round lasts 15 seconds, with six rounds in total, and the difficulty increases as you progress. If you have not cleared the game by the end of round 6, a hidden story will be triggered. Turn on Utsugi Assist if you want help with the judgments, or use Exit at any time to leave the game."
      ],
      jp:[
        "スマートフォンでは端末を横向きにし、ページ内の全画面ボタンを使用してください。音声をオンにするか、イヤホンの使用をおすすめします。「ゲーム開始」をタップしたら、ターゲットが下部の判定エリアに到達するタイミングで対応する Z／O／O／L ボタンを押し、ロングノーツは押し続けてください。",
        "1ラウンド15秒、全6ラウンドで、進むほど難しくなります。第6ラウンド終了後もクリアしていない場合は、隠しストーリーが発生します。必要に応じて「宇都木オート」をオンにすると判定を手伝ってくれます。終了ボタンからいつでもゲームを離れられます。"
      ]
    }},
    {id:"guide-about",date:"2026.07.13",cat:"site",title:{cn:"关于本站",en:"About this site",jp:"本サイトについて"},body:{
      cn:[
        "本站是非商业性质的同人共创企划，与原作官方及现实中的艺人、乐队、场馆、票务平台均无关联。",
        "作品权利、使用范围与创作者署名等详细信息，请查看“声明”分类。"
      ],
      en:[
        "This is a non-commercial, collaborative fan project and is not affiliated with the original rights holders or any real performers, bands, venues or ticketing platforms.",
        "See the Notice category for details about rights, permitted use and creator credits."
      ],
      jp:[
        "本サイトは非営利の共同ファン企画であり、原作公式および実在する出演者、バンド、会場、チケット販売事業者とは関係ありません。",
        "権利、利用範囲、制作者クレジットの詳細は「告知」カテゴリーをご確認ください。"
      ]
    }},
    {id:"guide-simulated-flow",date:"2026.07.12",cat:"site",title:{cn:"模拟购票与商品流程",en:"Simulated ticketing and goods flows",jp:"チケット・グッズの模擬フロー"},body:{
      cn:[
        "购票、随机配席、购物车、付款信息与支付动画均为前端模拟，不会发生真实交易、出票、发货或线下兑换。",
        "请把它当作演唱会主题的互动体验，并且不要填写真实银行卡号、地址等个人信息。"
      ],
      en:[
        "Ticketing, random seat assignment, the cart, payment details and payment animations are front-end simulations. There is no real transaction, ticket issuance, shipment or on-site redemption.",
        "Treat them as part of the concert-themed experience, and do not enter real card numbers, addresses or other personal information."
      ],
      jp:[
        "チケット購入、ランダム配席、カート、決済情報、支払い演出はすべてフロントエンド上のシミュレーションです。実際の取引、発券、発送、会場での引き換えは行われません。",
        "コンサートをテーマにした体験としてお楽しみいただき、実際のカード番号や住所などの個人情報は入力しないでください。"
      ]
    }},
    {id:"guide-data",date:"2026.07.11",cat:"site",title:{cn:"数据与隐私",en:"Data and privacy",jp:"データとプライバシー"},body:{
      cn:[
        "姓名等内容仅在当前浏览器中用于生成虚构票券或订单预览，本站不会主动将其上传至服务器。",
        "刷新页面、关闭浏览器或清除网站数据后，内容可能消失。建议使用昵称或虚构信息，不要填写真实个人与支付信息。"
      ],
      en:[
        "Names and other entries are used only in the current browser to create fictional ticket or order previews; the site does not intentionally upload them to a server.",
        "They may disappear after a refresh, browser close or site-data reset. Use a nickname or fictional details, never real personal or payment information."
      ],
      jp:[
        "氏名などの入力内容は、現在のブラウザで架空のチケットや注文プレビューを作成するためだけに使用され、サーバーへ意図的に送信されることはありません。",
        "ページの再読み込み、ブラウザの終了、サイトデータの削除によって内容が消える場合があります。実名ではなくニックネームや架空の情報を使用し、個人情報・決済情報は入力しないでください。"
      ]
    }},
    {id:"guide-local-progress",date:"2026.07.10",cat:"site",title:{cn:"本地数据与跨设备使用",en:"Local data and switching devices",jp:"ローカルデータと端末の変更"},body:{
      cn:[
        "部分购物车与解锁状态只保存在当前浏览器本地，不提供账号登录或跨设备同步。更换设备、浏览器、使用无痕模式或清除缓存后，记录可能消失。",
        "需要保留的电子票券或发票，请在生成后及时下载。"
      ],
      en:[
        "Some cart and unlock states are stored only in the current browser. There are no accounts or cross-device sync, so records may disappear after changing device or browser, using private mode, or clearing site data.",
        "Download any e-ticket or invoice you want to keep as soon as it is generated."
      ],
      jp:[
        "一部のカート情報や解除状況は現在のブラウザ内にのみ保存されます。アカウント機能や端末間同期はないため、端末・ブラウザの変更、プライベートモードの使用、サイトデータの削除によって記録が消える場合があります。",
        "残しておきたい電子チケットやINVOICEは、生成後すぐに保存してください。"
      ]
    }},
    {id:"guide-troubleshooting",date:"2026.07.09",cat:"site",title:{cn:"显示、音频与全屏故障排查",en:"Display, audio and full-screen troubleshooting",jp:"表示・音声・全画面のトラブルシューティング"},body:{
      cn:[
        "请先刷新页面，并使用最新版 Safari、Chrome 或 Edge 打开本站；微信、QQ 等应用内浏览器可能会限制全屏、下载或音频播放。",
        "LIVE 的声音需要由用户点击后才能播放。请检查页面内的声音开关、设备媒体音量与静音模式；横屏显示异常时，可以再次点击页面内的全屏按钮。"
      ],
      en:[
        "Refresh the page and use the latest Safari, Chrome or Edge. In-app browsers such as WeChat or QQ may restrict full-screen mode, downloads or audio playback.",
        "LIVE audio must be started by a user action. Check the in-page sound control, media volume and silent mode; if landscape layout looks wrong, tap the in-page full-screen button again."
      ],
      jp:[
        "まずページを再読み込みし、最新版のSafari、Chrome、Edgeで本サイトを開いてください。WeChatやQQなどのアプリ内ブラウザでは、全画面表示、ダウンロード、音声再生が制限される場合があります。",
        "LIVEの音声は、ユーザーの操作後に再生できます。ページ内の音声スイッチ、端末のメディア音量、消音モードをご確認ください。横画面の表示がおかしい場合は、ページ内の全画面ボタンをもう一度押してください。"
      ]
    }},
    {id:"notice-rights",date:"2026.07.08",cat:"notice",title:{cn:"本站为非官方性质的同人企划",en:"This is an unofficial fan project",jp:"本サイトは非公式のファン企画です"},body:{
      cn:[
        "本站与原作官方、相关公司、艺人、乐队、场馆及票务平台均无关联。原作角色、名称及相关权利归各自权利人所有；本站原创插画、文字、网页设计与音效的权利归对应创作者所有。",
        "未经许可，请勿转载、二次编辑或用于商业用途；如有任何问题，请联系小红书@并不知道什么叫做可爱。"
      ],
      en:[
        "This site is not affiliated with the original rights holders, related companies, performers, bands, venues or ticketing platforms. Characters, names and related rights belong to their respective rights holders; rights to the site's original illustrations, writing, web design and sound effects belong to their respective creators.",
        "Do not repost, edit or use this content commercially without permission. For any questions, contact Xiaohongshu @并不知道什么叫做可爱."
      ],
      jp:[
        "本サイトは、原作公式、関連企業、出演者、バンド、会場およびチケット販売事業者とは一切関係ありません。原作のキャラクター、名称および関連する権利は各権利者に帰属し、本サイト独自のイラスト、文章、ウェブデザイン、音響素材の権利は各制作者に帰属します。",
        "許可のない転載、二次編集、商用利用はご遠慮ください。ご質問がある場合は、小紅書 @并不知道什么叫做可爱 までご連絡ください。"
      ]
    }},
    {id:"notice-privacy",date:"2026.07.08",cat:"notice",title:{cn:"隐私/数据安全声明",en:"Privacy and data security",jp:"プライバシー／データセキュリティについて"},body:{
      cn:[
        "页面中填写的姓名等内容仅在当前浏览器内用于生成虚构票券或周边预览，不会主动上传至服务器；所有购票、商品与支付流程均为前端模拟，不会发生真实交易。",
        "为保证您的信息安全，请勿填写真实姓名、地址、银行卡号等个人或支付信息。"
      ],
      en:[
        "Names and other details entered on the site are used only in the current browser to generate fictional ticket or merchandise previews and are not intentionally uploaded to a server. All ticketing, merchandise and payment flows are front-end simulations; no real transaction takes place.",
        "To protect your information, do not enter a real name, address, card number or other personal or payment information."
      ],
      jp:[
        "ページに入力された氏名などは、現在のブラウザ内で架空のチケットやグッズのプレビューを生成するためだけに使用され、サーバーへ意図的に送信されることはありません。チケット、商品、決済の各フローはフロントエンド上のシミュレーションであり、実際の取引は発生しません。",
        "情報保護のため、実名、住所、カード番号などの個人情報・決済情報は入力しないでください。"
      ]
    }},
    {id:"notice-collaboration",date:"2026.07.08",cat:"notice",title:{cn:"共创声明",en:"Collaboration notice",jp:"共同制作について"},body:{
      cn:[
        "本站主视觉图由@兰澜提供，LIVE游戏的互动音效由@夏一页提供。",
        "如希望参与共创、引用本站内容、申请授权，或补充、更正署名，请联系小红书@并不知道什么叫做可爱；提交素材前请确认自己拥有相应权利，并说明可使用范围与署名方式。"
      ],
      en:[
        "The site's key visual was provided by @兰澜, and the interactive sound effects for the LIVE game were provided by @夏一页.",
        "To contribute, quote site content, request permission, or add or correct a credit, contact Xiaohongshu @并不知道什么叫做可爱. Before submitting material, confirm that you hold the necessary rights and state the permitted scope of use and preferred credit."
      ],
      jp:[
        "本サイトのメインビジュアルは @兰澜、LIVEゲームのインタラクティブ音響素材は @夏一页 より提供されています。",
        "共同制作への参加、内容の引用、利用許諾、クレジットの追加・訂正をご希望の場合は、小紅書 @并不知道什么叫做可爱 までご連絡ください。素材を提供する際は、必要な権利を保有していることを確認し、利用範囲と希望する表記をお知らせください。"
      ]
    }},
    {date:"2026.07.01",cat:"ticket",title:{cn:"电子票 PNG 支持离线保存",en:"Ticket PNG export now works offline",jp:"チケットPNGがオフライン保存に対応"}},
    {date:"2026.06.10",cat:"shop",title:{cn:"云购物上线：挑选、署名、保存",en:"Cloud Shop is now live",jp:"クラウドショップ公開"}},
    {date:"2026.06.03",cat:"ticket",title:{cn:"投骰抽座功能上线",en:"Roll-the-dice seat draw is live",jp:"サイコロ抽選購入を実装"}},
  ];
  var NEWS_COPY={
    cn:{body:"占位正文——这里之后放这条公告的详细内容。目前用于展示展开后的排版与留白。",cats:{all:"导览",tour:"巡演",ticket:"购票",shop:"周边",site:"站点",notice:"声明"}},
    en:{body:"Placeholder body — the full announcement text will go here later.",cats:{all:"GUIDE",tour:"TOUR",ticket:"TICKET",shop:"SHOP",site:"SITE",notice:"NOTICE"}},
    jp:{body:"仮本文——詳細情報は後日ここに掲載されます。",cats:{all:"ガイド",tour:"ツアー",ticket:"チケット",shop:"グッズ",site:"サイト",notice:"声明"}}
  };
  var state = { shopOpen:false, product:0, name:"", made:null, rolling:false, newsCat:"all", newsOpen:"news-guide" };

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
    var c=NEWS_COPY[lang],keys=["all","notice","tour","site"];
    var filters=keys.map(function(k){return '<button type="button" data-dc-act="newsCat" data-cat="'+k+'" class="'+(state.newsCat===k?"is-active":"")+'">'+esc(c.cats[k])+'</button>';}).join("");
    var items=NEWS.filter(function(n){return n.cat!=="ticket"&&n.cat!=="shop";}).filter(function(n){return state.newsCat==="all"?n.cat==="guide":n.cat===state.newsCat;}).map(function(n,i){
      var key=n.id||n.date,open=state.newsOpen===key;
      var paragraphs=(n.body&&n.body[lang]?n.body[lang]:[c.body]).map(function(p){return '<p>'+esc(p)+'</p>';}).join("");
      return '<article class="dc-news-row" style="--delay:'+(Math.min(i,8)*.05)+'s"><button type="button" data-dc-act="newsToggle" data-key="'+key+'" aria-expanded="'+open+'"><time>'+n.date+'</time><strong>'+esc(n.title[lang])+'</strong><i class="'+(open?"is-open":"")+'" aria-hidden="true">⌄</i></button><div class="dc-news-body '+(open?"is-open":"")+'"><div class="dc-news-copy">'+paragraphs+'</div></div></article>';
    }).join("");
    return '<main class="dc-news"><header><h1>NEWS</h1></header><nav class="dc-news-filters" aria-label="News categories">'+filters+'</nav><section class="dc-news-list">'+items+'</section></main>';
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
      if(act==="newsCat"){state.newsCat=el.dataset.cat;state.newsOpen=state.newsCat==="all"?"news-guide":null;rerender();}
      if(act==="newsToggle"){state.newsOpen=state.newsOpen===el.dataset.key?null:el.dataset.key;rerender();}
    });});
    var input=document.getElementById("cloudName");if(input){input.focus();input.addEventListener("input",function(){state.name=input.value;var btn=document.querySelector(".cloud-make");if(btn)btn.disabled=!state.name.trim();});}
    var preview=document.getElementById("cloudPreview");if(preview&&state.made)preview.src=state.made.toDataURL("image/png");
  }
  window.DiZPages={renderProfile:renderProfile,renderShop:renderShop,renderNews:renderNews,wire:wire};
})();
