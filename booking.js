/* TSUKUMO99 · DiŹ — booking + PNG ticket engine.
   Self-contained overlay: window.Booking.open([stopIndex]).
   The drawTicketCanvas() PNG export is preserved verbatim from the original site. */
(function () {
  "use strict";

  // ---- component CSS (buttons / inputs / flow layout), injected once ----
  var css =
    ".btn-cta{background:var(--hot);color:var(--paper);}" +
    ".btn-cta:hover{background:var(--pink);color:var(--wine);}" +
    ".btn-outline{background:transparent;color:var(--paper);border-color:rgba(255,244,247,.25)!important;}" +
    ".btn-outline:hover{border-color:var(--pink)!important;}" +
    ".input-name{background:rgba(23,0,6,.55);color:var(--paper);border-color:rgba(255,134,189,.35)!important;}" +
    ".input-name:focus{border-color:var(--hot)!important;}" +
    ".b-row{transition:background .18s ease,box-shadow .18s ease;}" +
    "@media(hover:hover){.b-row:hover{background:linear-gradient(90deg,rgba(236,0,80,.09),transparent 70%);box-shadow:inset 3px 0 0 var(--hot);}}" +
    ".tk-head{display:flex;flex-wrap:wrap;align-items:flex-end;gap:.8rem 1.2rem;justify-content:space-between;margin-bottom:clamp(1.4rem,4vw,2.2rem);}" +
    ".tk-head h1{margin:.2rem 0 0;font-family:var(--display);font-weight:700;text-transform:uppercase;font-size:clamp(1.8rem,5.5vw,3.2rem);line-height:.95;}" +
    ".tk-back{font-family:var(--mono);font-weight:700;font-size:.68rem;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);padding:.5rem 0;background:none;border:0;cursor:pointer;}" +
    ".tk-back:hover{color:var(--pink);}" +
    ".tk-body{animation:tkIn .35s ease;}@keyframes tkIn{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:none;}}" +
    ".tk-foot{margin-top:clamp(1.4rem,4vw,2.2rem);}";
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  var STOPS = [
    { code:"SH",status:"few",date:"2026.07.18",country:{cn:"中国",en:"CHINA",jp:"中国"},city:{cn:"上海",en:"SHANGHAI",jp:"上海"},venue:{cn:"上海 · 滨江文化中心",en:"SHANGHAI RIVERSIDE HALL",jp:"上海 リバーサイドホール"},addr:{cn:"云锦路 88 号",en:"88 Yunjin Road",jp:"雲錦路88"}},
    { code:"GZ",status:"plenty",date:"2026.07.26",country:{cn:"中国",en:"CHINA",jp:"中国"},city:{cn:"广州",en:"GUANGZHOU",jp:"広州"},venue:{cn:"广州 · 珠江大剧场",en:"PEARL RIVER THEATRE",jp:"広州 珠江劇場"},addr:{cn:"临江大道 66 号",en:"66 Riverside Avenue",jp:"臨江大通り66"}},
    { code:"BJ",status:"few",date:"2026.08.02",country:{cn:"中国",en:"CHINA",jp:"中国"},city:{cn:"北京",en:"BEIJING",jp:"北京"},venue:{cn:"北京 · 京城中央馆",en:"CAPITAL CENTRAL ARENA",jp:"北京 セントラルアリーナ"},addr:{cn:"长安西路 21 号",en:"21 West Chang'an Rd",jp:"長安西路21"}},
    { code:"SE",status:"plenty",date:"2026.08.08",country:{cn:"韩国",en:"KOREA",jp:"韓国"},city:{cn:"首尔",en:"SEOUL",jp:"ソウル"},venue:{cn:"首尔 · 汉江巨蛋",en:"HAN RIVER DOME",jp:"ソウル ハンガンドーム"},addr:{cn:"麻浦大路 45",en:"45 Mapo-daero",jp:"麻浦大路45"}},
    { code:"TK",status:"few",date:"2026.08.15",country:{cn:"日本",en:"JAPAN",jp:"日本"},city:{cn:"东京",en:"TOKYO",jp:"東京"},venue:{cn:"东京 · 临海竞技场",en:"BAYFRONT ARENA TOKYO",jp:"東京 ベイフロントアリーナ"},addr:{cn:"台场 3-6",en:"3-6 Odaiba",jp:"台場3-6"}},
    { code:"OS",status:"plenty",date:"2026.08.19",country:{cn:"日本",en:"JAPAN",jp:"日本"},city:{cn:"大阪",en:"OSAKA",jp:"大阪"},venue:{cn:"大阪 · 中之岛音乐堂",en:"NAKANOSHIMA HALL",jp:"大阪 中之島ホール"},addr:{cn:"中之岛 2-8",en:"2-8 Nakanoshima",jp:"中之島2-8"}},
    { code:"FK",status:"few",date:"2026.08.23",country:{cn:"日本",en:"JAPAN",jp:"日本"},city:{cn:"福冈",en:"FUKUOKA",jp:"福岡"},venue:{cn:"福冈 · 博多海湾馆",en:"HAKATA BAY HALL",jp:"福岡 博多ベイホール"},addr:{cn:"须崎町 1-11",en:"1-11 Susaki",jp:"須崎町1-11"}},
    { code:"SY",status:"plenty",date:"2026.08.30",country:{cn:"澳大利亚",en:"AUSTRALIA",jp:"オーストラリア"},city:{cn:"悉尼",en:"SYDNEY",jp:"シドニー"},venue:{cn:"悉尼 · 海港穹顶",en:"HARBOUR DOME SYDNEY",jp:"シドニー ハーバードーム"},addr:{cn:"达令港 12",en:"12 Darling Harbour",jp:"ダーリングハーバー12"}},
    { code:"TR",status:"plenty",date:"2026.09.05",country:{cn:"加拿大",en:"CANADA",jp:"カナダ"},city:{cn:"多伦多",en:"TORONTO",jp:"トロント"},venue:{cn:"多伦多 · 湖滨中心",en:"LAKESHORE CENTRE",jp:"トロント レイクショア"},addr:{cn:"湖岸大道 77",en:"77 Lakeshore Blvd",jp:"レイクショア大通り77"}},
    { code:"VA",status:"few",date:"2026.09.09",country:{cn:"加拿大",en:"CANADA",jp:"カナダ"},city:{cn:"温哥华",en:"VANCOUVER",jp:"バンクーバー"},venue:{cn:"温哥华 · 海湾展演馆",en:"WATERFRONT PAVILION",jp:"バンクーバー ウォーターフロント"},addr:{cn:"海堤路 44",en:"44 Seawall Road",jp:"シーウォール路44"}},
    { code:"NY",status:"plenty",date:"2026.09.14",country:{cn:"美国",en:"UNITED STATES",jp:"アメリカ"},city:{cn:"纽约",en:"NEW YORK",jp:"ニューヨーク"},venue:{cn:"纽约 · 曼哈顿广场馆",en:"MANHATTAN GARDEN",jp:"ニューヨーク マンハッタンガーデン"},addr:{cn:"第七大道 909",en:"909 Seventh Avenue",jp:"セブンスアベニュー909"}},
    { code:"LD",status:"few",date:"2026.09.19",country:{cn:"英国",en:"UNITED KINGDOM",jp:"イギリス"},city:{cn:"伦敦",en:"LONDON",jp:"ロンドン"},venue:{cn:"伦敦 · 泰晤士竞技场",en:"THAMES ARENA",jp:"ロンドン テムズアリーナ"},addr:{cn:"河岸街 13",en:"13 Riverside Street",jp:"リバーサイド街13"}},
    { code:"MC",status:"plenty",date:"2026.09.23",country:{cn:"英国",en:"UNITED KINGDOM",jp:"イギリス"},city:{cn:"曼彻斯特",en:"MANCHESTER",jp:"マンチェスター"},venue:{cn:"曼彻斯特 · 北方大厅",en:"NORTHERN HALL",jp:"マンチェスター ノーザンホール"},addr:{cn:"运河街 36",en:"36 Canal Street",jp:"運河街36"}},
    { code:"PA",status:"few",date:"2026.09.27",country:{cn:"法国",en:"FRANCE",jp:"フランス"},city:{cn:"巴黎",en:"PARIS",jp:"パリ"},venue:{cn:"巴黎 · 塞纳穹顶",en:"LE DÔME SEINE",jp:"パリ セーヌドーム"},addr:{cn:"河畔大道 27",en:"27 Quai de Seine",jp:"セーヌ河岸27"}},
    { code:"BE",status:"plenty",date:"2026.10.01",country:{cn:"德国",en:"GERMANY",jp:"ドイツ"},city:{cn:"柏林",en:"BERLIN",jp:"ベルリン"},venue:{cn:"柏林 · 施普雷会堂",en:"SPREE HALLE",jp:"ベルリン シュプレーホール"},addr:{cn:"河湾街 15",en:"15 Uferstrasse",jp:"ウーファー通り15"}},
    { code:"OL",status:"few",date:"2026.10.05",country:{cn:"挪威",en:"NORWAY",jp:"ノルウェー"},city:{cn:"奥斯陆",en:"OSLO",jp:"オスロ"},venue:{cn:"奥斯陆 · 峡湾竞技场",en:"FJORD ARENA OSLO",jp:"オスロ フィヨルドアリーナ"},addr:{cn:"海港路 9",en:"9 Havnegata",jp:"ハウネガータ9"}},
    { code:"ML",status:"plenty",date:"2026.10.10",country:{cn:"意大利",en:"ITALY",jp:"イタリア"},city:{cn:"米兰",en:"MILAN",jp:"ミラノ"},venue:{cn:"米兰 · 中央竞技馆",en:"ARENA CENTRALE MILANO",jp:"ミラノ アレーナチェントラーレ"},addr:{cn:"河滨大道 12",en:"12 Viale Riva",jp:"リーヴァ大通り12"}}
  ];
  var ZONES = [
    { id:"vip",tier:"VIP",code:"V",price:999,name:{cn:"VIP 前区站席",en:"VIP FRONT STANDING",jp:"VIPフロントスタンディング"} },
    { id:"std",tier:"STANDARD",code:"S",price:499,name:{cn:"普通座席",en:"GENERAL SEATING",jp:"一般席"} }
  ];
  var T = {
    cn:{getTickets:"选择场次",from:"起",chooseZone:"选择座位档",back:"上一步",nameStep:"这张票印给谁？",nameLabel:"持票人姓名",namePlaceholder:"输入将印在票面上的名字",issueBtn:"生成电子票",ticketReady:"电子票已生成",download:"下载 PNG 票券",bookAnother:"再选一场",close:"关闭",lblCity:"城市",lblVenue:"场馆",lblDate:"日期",lblTier:"档位",lblZone:"区域",lblSeat:"座位",lblName:"持票人",downloadHint:"无法下载？试试用浏览器打开网站！"},
    en:{getTickets:"CHOOSE A SHOW",from:"FROM",chooseZone:"CHOOSE YOUR ZONE",back:"BACK",nameStep:"WHOSE NAME GOES ON IT?",nameLabel:"ATTENDEE NAME",namePlaceholder:"Name to print on the ticket",issueBtn:"ISSUE TICKET",ticketReady:"YOUR TICKET IS READY",download:"DOWNLOAD PNG",bookAnother:"BOOK ANOTHER",close:"CLOSE",lblCity:"CITY",lblVenue:"VENUE",lblDate:"DATE",lblTier:"TIER",lblZone:"ZONE",lblSeat:"SEAT",lblName:"ATTENDEE",downloadHint:"Download not working? Try opening this site in your phone's browser."},
    jp:{getTickets:"公演を選ぶ",from:"より",chooseZone:"ゾーンを選択",back:"戻る",nameStep:"チケットの名義は？",nameLabel:"氏名",namePlaceholder:"チケットに印字する名前",issueBtn:"チケット発行",ticketReady:"チケットが発行されました",download:"PNGを保存",bookAnother:"別の公演",close:"閉じる",lblCity:"都市",lblVenue:"会場",lblDate:"日付",lblTier:"ランク",lblZone:"ゾーン",lblSeat:"座席",lblName:"氏名",downloadHint:"ダウンロードできない場合は、スマホの標準ブラウザでこのサイトを開き直してください。"}
  };

  var state = { lang:"cn", open:false, stopIndex:null, step:"stop", zoneId:null, name:"", ticket:null };
  var heroImg = new Image(); heroImg.src = "assets/hero.avif";
  var root = null;

  function esc(s){ return String(s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];}); }
  function t(){ return T[state.lang] || T.cn; }
  function computeCur(){ return state.stopIndex != null ? STOPS[state.stopIndex] : null; }
  function computeSelZone(){ return state.zoneId ? ZONES.filter(function(z){return z.id===state.zoneId;})[0] : null; }

  function renderStopStep(){
    var lang=state.lang;
    var rows=STOPS.map(function(s,i){
      return '<button type="button" class="b-row" data-act="pickStop" data-idx="'+i+'" style="width:100%;display:flex;align-items:center;gap:.8rem 1.2rem;padding:1rem .6rem;border:0;border-bottom:1px solid rgba(255,134,189,.12);background:transparent;color:inherit;text-align:left;cursor:pointer;">'+
        '<div style="flex:1 1 11rem;min-width:10rem;"><div style="font-family:var(--display);font-weight:700;text-transform:uppercase;font-size:1.15rem;line-height:1;color:var(--paper);">'+esc(s.city[lang])+'</div><div style="margin-top:.28rem;font-family:var(--mono);font-size:.6rem;color:var(--pink);">'+esc(s.venue[lang])+'</div></div>'+
        '<span style="font-family:var(--mono);font-weight:700;font-size:.62rem;color:var(--muted);">'+s.date+'</span>'+
        '<span aria-hidden="true" style="font-family:var(--display);font-size:1.4rem;color:var(--hot);">→</span></button>';
    }).join("");
    return { content:'<div style="max-width:100%;">'+rows+'</div>', footer:"" };
  }

  function renderZoneStep(){
    var lang=state.lang,cur=computeCur();
    function mapBtn(z){
      var color=z.id==="vip"?"var(--hot)":"var(--pink)";
      var width=z.id==="vip"?"82%;margin:.4rem auto 0;":"100%;";
      var pad=z.id==="vip"?"1rem":"1.3rem 1rem";
      return '<button type="button" data-act="selectZone" data-zone="'+z.id+'" style="width:'+width+'padding:'+pad+';display:flex;align-items:center;justify-content:space-between;gap:.6rem;border-radius:.35rem;cursor:pointer;text-align:left;border:1px solid rgba(255,134,189,.28);background:rgba(255,244,247,.04);">'+
        '<span><span style="display:block;font-family:var(--mono);font-size:.53rem;font-weight:700;letter-spacing:.16em;color:'+color+';">'+z.tier+'</span><span style="display:block;margin-top:.2rem;font-family:var(--display);font-weight:700;text-transform:uppercase;font-size:clamp(.9rem,1.8vw,1.15rem);color:var(--paper);">'+esc(z.name[lang])+'</span></span>'+
        '<span style="flex-shrink:0;font-family:var(--display);font-weight:700;font-size:1.2rem;color:var(--hot);">◈'+z.price+'</span></button>';
    }
    var content='<div style="max-width:28rem;">'+
      '<p style="margin:0;font-family:var(--mono);font-size:.66rem;letter-spacing:.04em;color:var(--pink);text-wrap:pretty;">'+esc(cur.city[lang])+' — '+esc(cur.venue[lang])+' · '+cur.date+'</p>'+
      '<div style="margin-top:1.1rem;background:radial-gradient(ellipse at 50% -10%,rgba(236,0,80,.32),transparent 62%),#1c0009;border:1px solid rgba(255,134,189,.15);border-radius:.45rem;padding:clamp(.9rem,2.5vw,1.5rem);display:flex;flex-direction:column;gap:.6rem;">'+
        '<div style="text-align:center;font-family:var(--mono);font-size:.54rem;letter-spacing:.4em;color:var(--muted);">STAGE</div>'+
        '<div style="height:.4rem;border-radius:99px;background:linear-gradient(90deg,transparent,var(--hot),transparent);box-shadow:0 0 22px var(--hot);"></div>'+
        mapBtn(ZONES[0])+mapBtn(ZONES[1])+
      '</div></div>';
    return { content:content, footer:"" };
  }

  function renderNameStep(){
    var tt=t(),lang=state.lang,cur=computeCur(),selZone=computeSelZone();
    var canIssue=!!state.zoneId&&state.name.trim().length>0;
    var content='<div style="max-width:34rem;">'+
      '<div style="padding:.9rem 1.1rem;border:1px solid rgba(255,134,189,.2);border-radius:.4rem;background:rgba(23,0,6,.4);font-family:var(--mono);font-size:.66rem;line-height:1.7;color:var(--muted);">'+
        '<div style="color:var(--paper);">'+esc(cur.city[lang])+' · '+esc(cur.venue[lang])+'</div>'+
        '<div>'+cur.date+' · '+selZone.tier+' — '+esc(selZone.name[lang])+' · <span style="color:var(--hot);">◈'+selZone.price+'</span></div>'+
      '</div>'+
      '<label style="display:block;margin-top:1.4rem;font-family:var(--mono);font-size:.6rem;font-weight:700;letter-spacing:.14em;color:var(--pink);text-transform:uppercase;">'+esc(tt.nameLabel)+'</label>'+
      '<input id="nameInput" type="text" class="input-name" value="'+esc(state.name)+'" placeholder="'+esc(tt.namePlaceholder)+'" style="margin-top:.55rem;width:100%;font-family:var(--display);font-weight:500;font-size:1.35rem;letter-spacing:.02em;padding:.85rem 1rem;border:1.5px solid;border-radius:.4rem;outline:none;"/>'+
    '</div>';
    var footer='<div style="display:flex;flex-wrap:wrap;gap:.8rem;">'+
      '<button type="button" data-act="backToZone" class="btn-outline" style="font-family:var(--mono);font-weight:700;font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;padding:.85rem 1.3rem;border:1px solid;border-radius:.3rem;cursor:pointer;">← '+esc(tt.back)+'</button>'+
      '<button type="button" id="issueBtn" data-act="issue" class="btn-cta" style="display:'+(canIssue?"":"none")+';flex:1;min-width:10rem;font-family:var(--mono);font-weight:700;font-size:.75rem;letter-spacing:.12em;text-transform:uppercase;padding:.85rem 1.3rem;border:0;border-radius:.3rem;cursor:pointer;box-shadow:0 8px 22px rgba(236,0,80,.4);">'+esc(tt.issueBtn)+'</button>'+
      '<span id="issueDisabled" style="display:'+(canIssue?"none":"")+';flex:1;min-width:10rem;text-align:center;font-family:var(--mono);font-weight:700;font-size:.75rem;letter-spacing:.12em;text-transform:uppercase;padding:.85rem 1.3rem;border-radius:.3rem;background:rgba(236,0,80,.2);color:rgba(255,244,247,.5);cursor:not-allowed;">'+esc(tt.issueBtn)+'</span>'+
    '</div>';
    return { content:content, footer:footer };
  }

  function renderTicketStep(){
    var tt=t(),lang=state.lang,tkt=state.ticket,s=STOPS[tkt.stopIndex],z=ZONES.filter(function(x){return x.id===tkt.zoneId;})[0];
    var seed=ticketSeed(tkt.ticketNo),bars=[];for(var k=0;k<34;k++)bars.push(1+((seed*(k+7))%4));
    var on=[true,false,true,false,true,false,true,false,true];
    var pipsHtml=on.map(function(v){return '<span style="border-radius:50%;background:'+(v?"var(--paper)":"transparent")+';"></span>';}).join("");
    var barsHtml=bars.map(function(bb){return '<span style="display:inline-block;width:'+bb+'px;height:100%;background:var(--paper);"></span>';}).join("");
    function field(label,value,hot){return '<div><div style="font-family:var(--mono);font-size:.5rem;letter-spacing:.12em;color:var(--muted);">'+esc(label)+'</div><div style="font-family:var(--display);font-weight:700;font-size:1rem;color:'+(hot?"var(--hot)":"var(--paper)")+';text-transform:uppercase;">'+esc(value)+'</div></div>';}
    var content='<div><div style="display:flex;flex-wrap:wrap;border:2px solid var(--pink);border-radius:.5rem;overflow:hidden;background:linear-gradient(135deg,#3a0014,#170006 55%,#4c001a);box-shadow:0 20px 60px rgba(0,0,0,.5);">'+
      '<div style="flex:1;min-width:15rem;padding:clamp(1.1rem,3vw,1.7rem);position:relative;">'+
        '<div style="display:flex;align-items:baseline;justify-content:space-between;gap:.5rem;flex-wrap:wrap;"><span style="font-family:var(--mono);font-size:.54rem;font-weight:700;letter-spacing:.2em;color:var(--muted);">TSUKUMO99 · DiŹ WORLD TOUR</span><span style="font-family:var(--mono);font-size:.54rem;letter-spacing:.1em;color:var(--pink);">'+tkt.ticketNo+'</span></div>'+
        '<div style="margin-top:.55rem;font-family:var(--display);font-weight:700;font-style:italic;text-transform:uppercase;font-size:clamp(2rem,6vw,2.8rem);line-height:.95;color:var(--hot);filter:drop-shadow(0 0 1rem rgba(236,0,80,.4));">DiŹ</div>'+
        '<div style="margin-top:1rem;display:grid;grid-template-columns:1fr 1fr;gap:.85rem .8rem;">'+
          field(tt.lblCity,s.city[lang])+field(tt.lblDate,s.date)+field(tt.lblVenue,s.venue[lang])+field(tt.lblTier,z.tier+' · ◈'+z.price,true)+field(tt.lblZone,z.name[lang])+field(tt.lblSeat,tkt.row+'-'+tkt.seat)+
          '<div style="grid-column:1/-1;"><div style="font-family:var(--mono);font-size:.5rem;letter-spacing:.12em;color:var(--muted);">'+esc(tt.lblName)+'</div><div style="font-family:var(--display);font-weight:700;font-size:1.25rem;color:var(--paper);">'+esc(tkt.name)+'</div></div>'+
        '</div>'+
        '<div style="margin-top:1.1rem;font-family:var(--mono);font-size:.5rem;font-weight:700;letter-spacing:.08em;color:var(--hot);">UNOFFICIAL / FAN-MADE</div>'+
      '</div>'+
      '<div style="width:clamp(6.5rem,22%,9rem);border-left:2px dashed rgba(255,244,247,.45);padding:clamp(.9rem,2.5vw,1.3rem) .8rem;display:flex;flex-direction:column;align-items:center;justify-content:space-between;gap:.9rem;background:rgba(23,0,6,.35);">'+
        '<div style="font-family:var(--mono);font-size:.55rem;font-weight:700;letter-spacing:.3em;color:var(--pink);">ADMIT ONE</div>'+
        '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:.28rem;width:2.4rem;height:2.4rem;">'+pipsHtml+'</div>'+
        '<div style="display:flex;align-items:flex-end;gap:1px;height:2.4rem;">'+barsHtml+'</div>'+
        '<div style="font-family:var(--mono);font-size:.5rem;letter-spacing:.06em;color:var(--muted);word-break:break-all;text-align:center;">'+tkt.ticketNo+'</div>'+
      '</div>'+
    '</div></div>';
    var footer='<div><div style="display:flex;flex-wrap:wrap;gap:.8rem;">'+
      '<button type="button" data-act="downloadTicket" class="btn-cta" style="flex:1;min-width:10rem;font-family:var(--mono);font-weight:700;font-size:.78rem;letter-spacing:.12em;text-transform:uppercase;padding:.9rem 1.3rem;border:0;border-radius:.3rem;cursor:pointer;box-shadow:0 8px 22px rgba(236,0,80,.4);">↓ '+esc(tt.download)+'</button>'+
      '<button type="button" data-act="bookAnother" class="btn-outline" style="font-family:var(--mono);font-weight:700;font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;padding:.9rem 1.3rem;border:1px solid;border-radius:.3rem;cursor:pointer;">'+esc(tt.bookAnother)+'</button>'+
    '</div><p style="margin:.65rem 0 0;text-align:center;font-family:var(--mono);font-size:.6rem;letter-spacing:.02em;line-height:1.5;color:var(--muted);">'+esc(tt.downloadHint)+'</p></div>';
    return { content:content, footer:footer };
  }

  function renderFlow(){
    var tt=t();
    var stepLabel={stop:tt.getTickets,zone:tt.chooseZone,name:tt.nameStep,ticket:tt.ticketReady}[state.step];
    var parts=state.step==="stop"?renderStopStep():state.step==="zone"?renderZoneStep():state.step==="name"?renderNameStep():renderTicketStep();
    var back="";
    if(state.step==="zone")back='<button type="button" data-act="backToStop" class="tk-back">← '+esc(tt.back)+'</button>';
    else if(state.step==="name")back='<button type="button" data-act="backToZone" class="tk-back">← '+esc(tt.back)+'</button>';
    return '<div class="tk-head"><h1>'+esc(stepLabel)+'</h1>'+back+'</div>'+
      '<div class="tk-body">'+parts.content+'</div>'+
      (parts.footer?'<div class="tk-foot">'+parts.footer+'</div>':"");
  }

  // ---- ticket PNG (preserved) ----
  function ticketSeed(n){var s=0;for(var i=0;i<n.length;i++)s+=n.charCodeAt(i);return s;}
  function diceDots(g,cx,cy,s,color){var rr=s*0.085,off=[0.24,0.5,0.76],pts=[[0,0],[2,0],[1,1],[0,2],[2,2]];g.fillStyle=color;pts.forEach(function(p){g.beginPath();g.arc(cx-s/2+off[p[0]]*s,cy-s/2+off[p[1]]*s,rr,0,7);g.fill();});}
  function roundRect(g,x,y,w,h,r){g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath();}
  function drawTicketCanvas(tkt){
    var s=STOPS[tkt.stopIndex],z=ZONES.filter(function(x){return x.id===tkt.zoneId;})[0];
    var DPR=2,W=2000,H=700,M=26,R=34,PHOTO=H-2*M,STUB=1540;
    var c=document.createElement("canvas");c.width=W*DPR;c.height=H*DPR;var g=c.getContext("2d");g.scale(DPR,DPR);g.textBaseline="alphabetic";
    g.save();roundRect(g,M,M,W-2*M,H-2*M,R);g.clip();
    var ix=M,iy=M,iw=W-2*M,ih=H-2*M;
    var bg=g.createLinearGradient(ix,iy,ix+iw,iy+ih);bg.addColorStop(0,"#4c001a");bg.addColorStop(0.5,"#2a000f");bg.addColorStop(1,"#170006");g.fillStyle=bg;g.fillRect(ix,iy,iw,ih);
    var glow=g.createRadialGradient(ix+iw*0.42,iy-60,40,ix+iw*0.42,iy-60,520);glow.addColorStop(0,"rgba(236,0,80,.42)");glow.addColorStop(1,"rgba(236,0,80,0)");g.fillStyle=glow;g.fillRect(ix,iy,iw,ih);
    g.save();g.globalAlpha=0.06;diceDots(g,ix+iw*0.63,iy+ih*0.5,460,"#ff86bd");g.restore();
    if(heroImg.complete&&heroImg.naturalWidth){
      g.save();g.beginPath();g.rect(ix,iy,PHOTO,PHOTO);g.clip();
      var S=PHOTO,scale=Math.max(S/heroImg.naturalWidth,S/heroImg.naturalHeight),dw=heroImg.naturalWidth*scale,dh=heroImg.naturalHeight*scale;
      g.drawImage(heroImg,ix+(S-dw)*0.34,iy-S*0.06,dw,dh);
      var fade=g.createLinearGradient(ix,0,ix+PHOTO,0);fade.addColorStop(0,"rgba(23,0,6,.05)");fade.addColorStop(0.7,"rgba(42,0,15,.18)");fade.addColorStop(1,"rgba(42,0,15,.55)");g.fillStyle=fade;g.fillRect(ix,iy,PHOTO,PHOTO);g.restore();
      g.fillStyle="#ec0050";g.fillRect(ix+PHOTO-2,iy,3,ih);
      g.save();g.shadowColor="rgba(236,0,80,.9)";g.shadowBlur=18;g.fillRect(ix+PHOTO-2,iy,3,ih);g.restore();
    }
    var L=ix+PHOTO+56;
    g.fillStyle="#e4afbf";g.font="700 19px 'Space Mono',monospace";g.fillText("TSUKUMO99   ·   WORLD TOUR 2026",L,iy+56);
    g.save();g.shadowColor="rgba(236,0,80,.5)";g.shadowBlur=22;g.fillStyle="#ec0050";g.font="italic 700 120px 'Oswald',sans-serif";g.fillText("DiŹ",L,iy+206);g.restore();
    g.strokeStyle="rgba(255,134,189,.16)";g.lineWidth=1;g.beginPath();g.moveTo(L,iy+256);g.lineTo(STUB-52,iy+256);g.stroke();
    var c1=L,c2=L+470,gy0=iy+308,step=80;
    var Lcol=[["CITY",s.city.en,false],["VENUE",s.venue.en,false],["ZONE",z.name.en,false],["ATTENDEE",tkt.name,false]];
    var Rcol=[["DATE",s.date,false],["DOORS · SHOW","18:30 · 19:30",false],["TIER",z.tier+"  ◈ "+z.price,true],["SEAT",tkt.row+"-"+tkt.seat,false]];
    function drawCol(col,cx,vFont){var yy=gy0;col.forEach(function(r){g.fillStyle="#c98aa0";g.font="700 15px 'Space Mono',monospace";g.fillText(r[0],cx,yy);g.fillStyle=r[2]?"#ec0050":"#fff4f7";g.font=vFont;g.fillText(r[1],cx,yy+38);yy+=step;});}
    drawCol(Lcol,c1,"700 34px 'Oswald',sans-serif");drawCol(Rcol,c2,"700 32px 'Oswald',sans-serif");
    g.fillStyle="#ec0050";g.font="700 15px 'Space Mono',monospace";g.fillText("UNOFFICIAL / FAN-MADE",c1,iy+ih-26);
    g.strokeStyle="rgba(255,244,247,.5)";g.lineWidth=2;g.setLineDash([14,12]);g.beginPath();g.moveTo(STUB,iy+18);g.lineTo(STUB,iy+ih-18);g.stroke();g.setLineDash([]);
    g.save();g.globalCompositeOperation="destination-out";g.beginPath();g.arc(STUB,iy,22,0,7);g.fill();g.beginPath();g.arc(STUB,iy+ih,22,0,7);g.fill();g.restore();
    var seed=ticketSeed(tkt.ticketNo),bLeft=STUB+52,bRight=ix+iw-96,sc=(bLeft+bRight)/2;
    g.textAlign="center";g.fillStyle="#ff86bd";g.font="700 24px 'Space Mono',monospace";g.fillText("ADMIT ONE",sc,iy+72);
    g.fillStyle="#c98aa0";g.font="700 14px 'Space Mono',monospace";g.fillText("TSUKUMO99 · DiŹ TOUR",sc,iy+100);
    var bTop=iy+170,bH=300,bx=bLeft;g.fillStyle="#fff4f7";var k=0;
    while(bx<bRight){var w=3+((seed*(k+7))%6);if(k%2===0)g.fillRect(bx,bTop,w,bH);bx+=w+3;k++;}
    g.fillStyle="#fff4f7";g.font="700 17px 'Space Mono',monospace";g.fillText(tkt.ticketNo,sc,bTop+bH+42);
    g.fillStyle="#c98aa0";g.font="700 12px 'Space Mono',monospace";g.fillText("SCAN AT DOOR",sc,bTop+bH+68);
    g.save();g.translate(ix+iw-30,iy+ih/2);g.rotate(-Math.PI/2);g.fillStyle="rgba(255,134,189,.45)";g.font="700 13px 'Space Mono',monospace";g.fillText("WORLD TOUR 2026",0,0);g.restore();
    g.textAlign="left";g.restore();
    g.save();roundRect(g,M,M,W-2*M,H-2*M,R);g.strokeStyle="#ff86bd";g.lineWidth=5;g.stroke();g.restore();
    return c;
  }
  function downloadTicket(){
    var tkt=state.ticket;if(!tkt)return;
    var c=drawTicketCanvas(tkt);
    c.toBlob(function(bl){var url=URL.createObjectURL(bl);var a=document.createElement("a");a.href=url;a.download=tkt.ticketNo+".png";document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(url);},1000);},"image/png");
  }

  // ---- actions ----
  function issue(){
    if(!state.zoneId||!state.name.trim())return;
    var s=STOPS[state.stopIndex],z=ZONES.filter(function(x){return x.id===state.zoneId;})[0];
    function r(n){return Math.floor(Math.random()*Math.pow(10,n)).toString().padStart(n,"0");}
    var row=String.fromCharCode(65+Math.floor(Math.random()*8)),seat=1+Math.floor(Math.random()*40);
    state.ticket={stopIndex:state.stopIndex,zoneId:z.id,name:state.name.trim(),ticketNo:"ZL-DIZ-"+s.code+z.code+"-"+r(4),row:row,seat:seat};
    state.step="ticket";render();
  }
  function scrollTop(){try{window.scrollTo({top:0,behavior:"smooth"});}catch(e){window.scrollTo(0,0);}}
  function pickStop(i){state.stopIndex=i;state.step="zone";render();scrollTop();}
  function selectZone(id){state.zoneId=id;state.step="name";render();scrollTop();}
  function backToStop(){state.step="stop";state.zoneId=null;render();scrollTop();}
  function backToZone(){state.step="zone";render();scrollTop();}
  function bookAnother(){state.step="stop";state.stopIndex=null;state.zoneId=null;state.name="";state.ticket=null;render();scrollTop();}

  function onAct(e){
    var el=e.currentTarget,act=el.dataset.act;
    if(act==="pickStop")pickStop(parseInt(el.dataset.idx,10));
    else if(act==="selectZone")selectZone(el.dataset.zone);
    else if(act==="backToStop")backToStop();
    else if(act==="backToZone")backToZone();
    else if(act==="issue")issue();
    else if(act==="bookAnother")bookAnother();
    else if(act==="downloadTicket")downloadTicket();
  }
  function onNameInput(e){
    state.name=e.target.value;
    var canIssue=!!state.zoneId&&state.name.trim().length>0;
    var ib=document.getElementById("issueBtn"),idd=document.getElementById("issueDisabled");
    if(ib)ib.style.display=canIssue?"":"none";
    if(idd)idd.style.display=canIssue?"none":"";
  }
  function wireEvents(){
    var acts=root.querySelectorAll("[data-act]");
    for(var i=0;i<acts.length;i++)acts[i].addEventListener("click",onAct);
    var ni=document.getElementById("nameInput");
    if(ni){ni.focus();var v=ni.value;ni.value="";ni.value=v;ni.addEventListener("input",onNameInput);ni.addEventListener("keydown",function(e){if(e.key==="Enter")issue();});}
  }
  function render(){
    if(!root)return;
    root.innerHTML=renderFlow();
    wireEvents();
  }

  // ---- init: this runs on the ticket page (needs a #ticketFlow container) ----
  root=document.getElementById("ticketFlow");
  if(root){
    if(window.DiZLang&&T[window.DiZLang])state.lang=window.DiZLang;
    var params=new URLSearchParams(location.search);
    var sp=params.get("stop");
    if(sp!=null&&sp!==""&&!isNaN(sp)){state.stopIndex=parseInt(sp,10);state.step="zone";}
    render();
  }
})();
