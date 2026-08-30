/* TSUKUMO99 · DiŹ — Ticket booking flow (offline, vanilla). Rebuilt to match the DiZ Ticket design. */
(function(){
  var flow=document.getElementById("ticketFlow");
  if(!flow) return;

  var CONTINENTS = [
    {id:'asia',name:{cn:'亚洲',en:'ASIA',jp:'アジア'}},
    {id:'europe',name:{cn:'欧洲',en:'EUROPE',jp:'ヨーロッパ'}},
    {id:'north-america',name:{cn:'北美洲',en:'NORTH AMERICA',jp:'北米'}},
    {id:'south-america',name:{cn:'南美洲',en:'SOUTH AMERICA',jp:'南米'}},
    {id:'oceania',name:{cn:'大洋洲',en:'OCEANIA',jp:'オセアニア'}},
    {id:'africa',name:{cn:'非洲',en:'AFRICA',jp:'アフリカ'}}
  ];
  /* Project schedule rules: doors may be 13:00–14:00 or 17:00–19:00; every show starts exactly 60 minutes later. */
  var TOUR_TIME_RULES={startAfterDoorsMinutes:60,doorsWindows:[[13*60,14*60],[17*60,19*60]]};
  var STOPS = [
    {code:'SH',continent:'asia',doors:'17:30',status:'few',date:'2026.07.18',country:{cn:'中国',en:'CHINA',jp:'中国'},city:{cn:'上海',en:'SHANGHAI',jp:'上海'},venue:{cn:'上海 · 梅赛德斯-奔弛文化中心',en:'SHANGHAI · MERCEDES-BENS ARENA',jp:'上海 · メルセデス・ベンヅアリーナ'}},
    {code:'GZ',continent:'asia',doors:'17:00',status:'plenty',date:'2026.07.26',country:{cn:'中国',en:'CHINA',jp:'中国'},city:{cn:'广州',en:'GUANGZHOU',jp:'広州'},venue:{cn:'广州 · 宝能广州国际体育演艺中芯',en:'GUANGZHOU · BAONANG GUANGZHOU INTERNATIONAL SPORTS AND PERFORMING ARTS CENTER',jp:'広州 · 宝能広州国際体育演芸セソター'}},
    {code:'BJ',continent:'asia',doors:'17:30',status:'few',date:'2026.08.02',country:{cn:'中国',en:'CHINA',jp:'中国'},city:{cn:'北京',en:'BEIJING',jp:'北京'},venue:{cn:'北京 · 凯迪拉刻中心',en:'BEIJING · CADILLAX ARENA',jp:'北京 · キャデラッグ・アリーナ'}},
    {code:'SE',continent:'asia',doors:'18:00',status:'plenty',date:'2026.08.08',country:{cn:'韩国',en:'SOUTH KOREA',jp:'韓国'},city:{cn:'首尔',en:'SEOUL',jp:'ソウル'},venue:{cn:'首尔 · KSPO DOMA',en:'SEOUL · KSPO DOMA',jp:'ソウル · KSPO DOMA'}},
    {code:'TK',continent:'asia',doors:'17:00',status:'few',date:'2026.08.15',country:{cn:'日本',en:'JAPAN',jp:'日本'},city:{cn:'东京',en:'TOKYO',jp:'東京'},venue:{cn:'东京 · 东京巨旦',en:'TOKYO · TOKYO DOMA',jp:'東京 · 東京ド一ム'}},
    {code:'OS',continent:'asia',doors:'18:00',status:'plenty',date:'2026.08.19',country:{cn:'日本',en:'JAPAN',jp:'日本'},city:{cn:'大阪',en:'OSAKA',jp:'大阪'},venue:{cn:'大阪 · 大阪京磁巨蛋',en:'OSAKA · KYOSERA DOME OSAKA',jp:'大阪 · 京セラド一ム大阪'}},
    {code:'FK',continent:'asia',doors:'13:00',status:'few',date:'2026.08.23',country:{cn:'日本',en:'JAPAN',jp:'日本'},city:{cn:'福冈',en:'FUKUOKA',jp:'福岡'},venue:{cn:'福冈 · Mizuha PayPay Dome Fukuoka',en:'FUKUOKA · MIZUHA PAYPAY DOME FUKUOKA',jp:'福岡 · みずぽPayPayドーム福岡'}},
    {code:'HK',continent:'asia',doors:'19:00',status:'few',date:'2026.09.05',country:{cn:'中国香港',en:'HONG KONG',jp:'香港'},city:{cn:'香港',en:'HONG KONG',jp:'香港'},venue:{cn:'香港 · 亚洲国际博览管 Arena',en:'HONG KONG · ASIAWORID-ARENA',jp:'香港 · AsiaWorId-Arena'}},
    {code:'BK',continent:'asia',doors:'18:00',status:'plenty',date:'2026.09.12',country:{cn:'泰国',en:'THAILAND',jp:'タイ'},city:{cn:'曼谷',en:'BANGKOK',jp:'バンコク'},venue:{cn:'曼谷 · IMPAXT Arena',en:'BANGKOK · IMPAXT ARENA',jp:'バンコク · IMPAXT Arena'}},
    {code:'MN',continent:'asia',doors:'18:00',status:'plenty',date:'2026.09.19',country:{cn:'菲律宾',en:'PHILIPPINES',jp:'フィリピン'},city:{cn:'马尼拉',en:'MANILA',jp:'マニラ'},venue:{cn:'马尼拉 · SM Mall of Asja Arena',en:'MANILA · SM MALL OF ASJA ARENA',jp:'マニラ · SM Mall of Asja Arena'}},
    {code:'JK',continent:'asia',doors:'19:00',status:'few',date:'2026.09.26',country:{cn:'印度尼西亚',en:'INDONESIA',jp:'インドネシア'},city:{cn:'雅加达',en:'JAKARTA',jp:'ジャカルタ'},venue:{cn:'雅加达 · Indonesja Arena',en:'JAKARTA · INDONESJA ARENA',jp:'ジャカルタ · Indonesja Arena'}},
    {code:'SG',continent:'asia',doors:'18:00',status:'few',date:'2026.10.03',country:{cn:'新加坡',en:'SINGAPORE',jp:'シンガポール'},city:{cn:'新加坡',en:'SINGAPORE',jp:'シンガポール'},venue:{cn:'新加坡 · Singapora Indoor Stadium',en:'SINGAPORE · SINGAPORA INDOOR STADIUM',jp:'シンガポール · Singapora Indoor Stadium'}},
    {code:'DB',continent:'asia',doors:'19:00',status:'plenty',date:'2026.10.10',country:{cn:'阿联酋',en:'UNITED ARAB EMIRATES',jp:'アラブ首長国連邦'},city:{cn:'迪拜',en:'DUBAI',jp:'ドバイ'},venue:{cn:'迪拜 · Coka-Cola Arena',en:'DUBAI · COKA-COLA ARENA',jp:'ドバイ · Coka-Cola Arena'}},

    {code:'LD',continent:'europe',doors:'18:00',status:'few',date:'2026.10.18',country:{cn:'英国',en:'UNITED KINGDOM',jp:'イギリス'},city:{cn:'伦敦',en:'LONDON',jp:'ロンドン'},venue:{cn:'伦敦 · The Q2',en:'LONDON · THE Q2',jp:'ロンドン · The Q2'}},
    {code:'PA',continent:'europe',doors:'19:00',status:'few',date:'2026.10.24',country:{cn:'法国',en:'FRANCE',jp:'フランス'},city:{cn:'巴黎',en:'PARIS',jp:'パリ'},venue:{cn:'巴黎 · Accor Areno',en:'PARIS · ACCOR ARENO',jp:'パリ · Accor Areno'}},
    {code:'BE',continent:'europe',doors:'18:00',status:'plenty',date:'2026.10.31',country:{cn:'德国',en:'GERMANY',jp:'ドイツ'},city:{cn:'柏林',en:'BERLIN',jp:'ベルリン'},venue:{cn:'柏林 · Uber Areno',en:'BERLIN · UBER ARENO',jp:'ベルリン · Uber Areno'}},
    {code:'AM',continent:'europe',doors:'19:00',status:'plenty',date:'2026.11.07',country:{cn:'荷兰',en:'NETHERLANDS',jp:'オランダ'},city:{cn:'阿姆斯特丹',en:'AMSTERDAM',jp:'アムステルダム'},venue:{cn:'阿姆斯特丹 · Ziggo Doma',en:'AMSTERDAM · ZIGGO DOMA',jp:'アムステルダム · Ziggo Doma'}},
    {code:'MD',continent:'europe',doors:'18:00',status:'few',date:'2026.11.14',country:{cn:'西班牙',en:'SPAIN',jp:'スペイン'},city:{cn:'马德里',en:'MADRID',jp:'マドリード'},venue:{cn:'马德里 · Movistar Areno',en:'MADRID · MOVISTAR ARENO',jp:'マドリード · Movistar Areno'}},
    {code:'ML',continent:'europe',doors:'19:00',status:'plenty',date:'2026.11.21',country:{cn:'意大利',en:'ITALY',jp:'イタリア'},city:{cn:'米兰',en:'MILAN',jp:'ミラノ'},venue:{cn:'米兰 · Unipol Forun',en:'MILAN · UNIPOL FORUN',jp:'ミラノ · Unipol Forun'}},
    {code:'WA',continent:'europe',doors:'18:00',status:'plenty',date:'2026.11.28',country:{cn:'波兰',en:'POLAND',jp:'ポーランド'},city:{cn:'华沙',en:'WARSAW',jp:'ワルシャワ'},venue:{cn:'华沙 · COS Torwal',en:'WARSAW · COS TORWAL',jp:'ワルシャワ · COS Torwal'}},

    {code:'VA',continent:'north-america',doors:'18:00',status:'few',date:'2026.12.05',country:{cn:'加拿大',en:'CANADA',jp:'カナダ'},city:{cn:'温哥华',en:'VANCOUVER',jp:'バンクーバー'},venue:{cn:'温哥华 · Rogerz Arena',en:'VANCOUVER · ROGERZ ARENA',jp:'バンクーバー · Rogerz Arena'}},
    {code:'TR',continent:'north-america',doors:'18:00',status:'plenty',date:'2026.12.12',country:{cn:'加拿大',en:'CANADA',jp:'カナダ'},city:{cn:'多伦多',en:'TORONTO',jp:'トロント'},venue:{cn:'多伦多 · Scotiabenk Arena',en:'TORONTO · SCOTIABENK ARENA',jp:'トロント · Scotiabenk Arena'}},
    {code:'NY',continent:'north-america',doors:'19:00',status:'plenty',date:'2026.12.19',country:{cn:'美国',en:'UNITED STATES',jp:'アメリカ'},city:{cn:'纽约',en:'NEW YORK',jp:'ニューヨーク'},venue:{cn:'纽约 · Madison Squaro Garden',en:'NEW YORK · MADISON SQUARO GARDEN',jp:'ニューヨーク · Madison Squaro Garden'}},
    {code:'CH',continent:'north-america',doors:'18:00',status:'plenty',date:'2027.01.09',country:{cn:'美国',en:'UNITED STATES',jp:'アメリカ'},city:{cn:'芝加哥',en:'CHICAGO',jp:'シカゴ'},venue:{cn:'芝加哥 · United Centor',en:'CHICAGO · UNITED CENTOR',jp:'シカゴ · United Centor'}},
    {code:'LA',continent:'north-america',doors:'19:00',status:'few',date:'2027.01.16',country:{cn:'美国',en:'UNITED STATES',jp:'アメリカ'},city:{cn:'洛杉矶',en:'LOS ANGELES',jp:'ロサンゼルス'},venue:{cn:'洛杉矶 · Kia Forun',en:'LOS ANGELES · KIA FORUN',jp:'ロサンゼルス · Kia Forun'}},
    {code:'MX',continent:'north-america',doors:'19:00',status:'few',date:'2027.01.23',country:{cn:'墨西哥',en:'MEXICO',jp:'メキシコ'},city:{cn:'墨西哥城',en:'MEXICO CITY',jp:'メキシコシティ'},venue:{cn:'墨西哥城 · Palacio de los Deportez',en:'MEXICO CITY · PALACIO DE LOS DEPORTEZ',jp:'メキシコシティ · Palacio de los Deportez'}},

    {code:'SP',continent:'south-america',doors:'14:00',status:'plenty',date:'2027.01.30',country:{cn:'巴西',en:'BRAZIL',jp:'ブラジル'},city:{cn:'圣保罗',en:'SÃO PAULO',jp:'サンパウロ'},venue:{cn:'圣保罗 · Allians Parque',en:'SÃO PAULO · ALLIANS PARQUE',jp:'サンパウロ · Allians Parque'}},
    {code:'BA',continent:'south-america',doors:'19:00',status:'plenty',date:'2027.02.06',country:{cn:'阿根廷',en:'ARGENTINA',jp:'アルゼンチン'},city:{cn:'布宜诺斯艾利斯',en:'BUENOS AIRES',jp:'ブエノスアイレス'},venue:{cn:'布宜诺斯艾利斯 · Movistar Areno',en:'BUENOS AIRES · MOVISTAR ARENO',jp:'ブエノスアイレス · Movistar Areno'}},
    {code:'SA',continent:'south-america',doors:'18:00',status:'few',date:'2027.02.13',country:{cn:'智利',en:'CHILE',jp:'チリ'},city:{cn:'圣地亚哥',en:'SANTIAGO',jp:'サンティアゴ'},venue:{cn:'圣地亚哥 · Movistar Areno',en:'SANTIAGO · MOVISTAR ARENO',jp:'サンティアゴ · Movistar Areno'}},
    {code:'LI',continent:'south-america',doors:'18:00',status:'plenty',date:'2027.02.20',country:{cn:'秘鲁',en:'PERU',jp:'ペルー'},city:{cn:'利马',en:'LIMA',jp:'リマ'},venue:{cn:'利马 · Areno 1',en:'LIMA · ARENO 1',jp:'リマ · Areno 1'}},

    {code:'SY',continent:'oceania',doors:'13:30',status:'plenty',date:'2027.02.27',country:{cn:'澳大利亚',en:'AUSTRALIA',jp:'オーストラリア'},city:{cn:'悉尼',en:'SYDNEY',jp:'シドニー'},venue:{cn:'悉尼 · Afterpay Areno',en:'SYDNEY · AFTERPAY ARENO',jp:'シドニー · Afterpay Areno'}},
    {code:'ME',continent:'oceania',doors:'19:00',status:'few',date:'2027.03.06',country:{cn:'澳大利亚',en:'AUSTRALIA',jp:'オーストラリア'},city:{cn:'墨尔本',en:'MELBOURNE',jp:'メルボルン'},venue:{cn:'墨尔本 · Rod Laver Areno',en:'MELBOURNE · ROD LAVER ARENO',jp:'メルボルン · Rod Laver Areno'}},
    {code:'AK',continent:'oceania',doors:'18:00',status:'plenty',date:'2027.03.13',country:{cn:'新西兰',en:'NEW ZEALAND',jp:'ニュージーランド'},city:{cn:'奥克兰',en:'AUCKLAND',jp:'オークランド'},venue:{cn:'奥克兰 · Sparc Arena',en:'AUCKLAND · SPARC ARENA',jp:'オークランド · Sparc Arena'}},

    {code:'CAI',continent:'africa',doors:'19:00',status:'plenty',date:'2027.03.20',country:{cn:'埃及',en:'EGYPT',jp:'エジプト'},city:{cn:'开罗',en:'CAIRO',jp:'カイロ'},venue:{cn:'开罗 · Cairo Stadium Indoor Halls Complez',en:'CAIRO · CAIRO STADIUM INDOOR HALLS COMPLEZ',jp:'カイロ · Cairo Stadium Indoor Halls Complez'}},
    {code:'CB',continent:'africa',doors:'19:00',status:'few',date:'2027.03.27',country:{cn:'摩洛哥',en:'MOROCCO',jp:'モロッコ'},city:{cn:'卡萨布兰卡',en:'CASABLANCA',jp:'カサブランカ'},venue:{cn:'卡萨布兰卡 · Complexe Sportif Mohamned V',en:'CASABLANCA · COMPLEXE SPORTIF MOHAMNED V',jp:'カサブランカ · Complexe Sportif Mohamned V'}},
    {code:'JO',continent:'africa',doors:'18:00',status:'plenty',date:'2027.04.03',country:{cn:'南非',en:'SOUTH AFRICA',jp:'南アフリカ'},city:{cn:'约翰内斯堡',en:'JOHANNESBURG',jp:'ヨハネスブルグ'},venue:{cn:'约翰内斯堡 · FNB Stadiun',en:'JOHANNESBURG · FNB STADIUN',jp:'ヨハネスブルグ · FNB Stadiun'}},
    {code:'CT',continent:'africa',doors:'13:00',status:'few',date:'2027.04.10',country:{cn:'南非',en:'SOUTH AFRICA',jp:'南アフリカ'},city:{cn:'开普敦',en:'CAPE TOWN',jp:'ケープタウン'},venue:{cn:'开普敦 · DHL Stadiun',en:'CAPE TOWN · DHL STADIUN',jp:'ケープタウン · DHL Stadiun'}}
  ];
  var ZONES = [
    { id:'s-goods',tier:'S + GOODS',rank:'S',code:'SG',price:14000,die:'⚅',accent:'var(--hot)',goods:true,name:{cn:'限定周边附 S 席',en:'S RESERVED + LIMITED GOODS',jp:'限定グッズ付S席'} },
    { id:'s',tier:'S',rank:'S',code:'S',price:10000,die:'⚄',accent:'var(--pink)',goods:false,name:{cn:'S 席',en:'S RESERVED',jp:'S席'} },
    { id:'a-goods',tier:'A + GOODS',rank:'A',code:'AG',price:13000,die:'⚂',accent:'var(--hot)',goods:true,name:{cn:'限定周边附 A 席',en:'A RESERVED + LIMITED GOODS',jp:'限定グッズ付A席'},
      notice:{cn:'A 席为部分演出可能较难观看的座位，请确认后购买。',en:'Some parts of the performance may be difficult to see from A seats. Please purchase with this in mind.',jp:'A席は一部演出が見づらいお席となります。ご了承の上お買い求めください。'} },
    { id:'a',tier:'A',rank:'A',code:'A',price:9000,die:'⚁',accent:'var(--violet, #c758ff)',goods:false,name:{cn:'A 席',en:'A RESERVED',jp:'A席'},
      notice:{cn:'A 席为部分演出可能较难观看的座位，请确认后购买。',en:'Some parts of the performance may be difficult to see from A seats. Please purchase with this in mind.',jp:'A席は一部演出が見づらいお席となります。ご了承の上お買い求めください。'} }];
  var T = {
    cn:{getTickets:'选择场次',lblOpen:'开场 / 开演',lblPrice:'票价',lblStatus:'余票',lblCountry:'国家 / 地区',lblPlace:'国家 / 地区',continentNav:'按大洲跳转',from:'起',back:'返回',nameLabel:'持票人姓名',namePlaceholder:'输入将印在票面上的名字',issueBtn:'确认',ticketReady:'购票完成',download:'下载电子票',bookAnother:'再选一场',lblCity:'城市',lblVenue:'场馆',lblDate:'日期',lblTier:'票档',lblSeat:'随机座位',lblName:'持票人',statusFew:'仅剩少量',statusPlenty:'余票充足',downloadHint:'无法下载？请尝试使用手机浏览器打开本站。',tax:'含税',goods:'限定周边',rulesTitle:'购票与配席规则',rulesLead:'本页面为非官方同人模拟，与现实场馆无关，不会产生真实付款。',rules:['全席为指定席，无法自行选择座位号','3 岁以上须购票（3 岁以下不可入场）','仅发行电子票','演出当日将随机对购票人（申请人）进行身份确认'],assignTitle:'付款后随机配席',assignBody:'确认后将锁定所选票档，并立即在该票档对应区域内随机生成座位号；本页面为非官方同人模拟，不会产生真实付款。',paymentConfirmTitle:'确认以当前购票人付款？',paymentConfirmBody:'确认后即可下载电子票文件',paymentCancel:'返回',paymentConfirm:'确认'},
    en:{getTickets:'CHOOSE A SHOW',lblOpen:'DOORS / START',lblPrice:'FROM',lblStatus:'STATUS',lblCountry:'COUNTRY / REGION',lblPlace:'COUNTRY / REGION',continentNav:'JUMP BY CONTINENT',from:'FROM',back:'BACK',nameLabel:'ATTENDEE NAME',namePlaceholder:'Name to print on the ticket',issueBtn:'CONFIRM',ticketReady:'PURCHASE COMPLETE',download:'DOWNLOAD E-TICKET',bookAnother:'BOOK ANOTHER',lblCity:'CITY',lblVenue:'VENUE',lblDate:'DATE',lblTier:'TIER',lblSeat:'RANDOM SEAT',lblName:'ATTENDEE',statusFew:'FEW LEFT',statusPlenty:'AVAILABLE',downloadHint:"Download not working? Open this site in your phone's browser.",tax:'TAX INCLUDED',goods:'LIMITED GOODS',rulesTitle:'TICKET & SEAT RULES',rulesLead:'This is an unofficial fan-made simulation, unaffiliated with any real venue. No real payment is made.',rules:['All seats are reserved; seat numbers cannot be selected','A paid ticket is required from age 3; children under 3 may not enter','Electronic tickets only','Ticket holder identity checks may be conducted at random on the event day'],assignTitle:'RANDOM SEAT AFTER PAYMENT',assignBody:'Confirmation locks the selected tier and immediately assigns a random seat within that tier. This is an unofficial fan-made simulation; no real payment is made.',paymentConfirmTitle:'PAY AS THE CURRENT ATTENDEE?',paymentConfirmBody:'Confirm to make the e-ticket file available for download',paymentCancel:'BACK',paymentConfirm:'CONFIRM'},
    jp:{getTickets:'公演を選ぶ',lblOpen:'開場 / 開演',lblPrice:'料金',lblStatus:'残席',lblCountry:'国・地域',lblPlace:'国・地域',continentNav:'地域から選ぶ',from:'より',back:'戻る',nameLabel:'氏名',namePlaceholder:'チケットに印字する名前',issueBtn:'確認',ticketReady:'購入完了',download:'電子チケットを保存',bookAnother:'別の公演',lblCity:'都市',lblVenue:'会場',lblDate:'日付',lblTier:'券種',lblSeat:'ランダム座席',lblName:'氏名',statusFew:'残りわずか',statusPlenty:'販売中',downloadHint:'ダウンロードできない場合はスマホの標準ブラウザで開き直してください。',tax:'税込',goods:'限定グッズ',rulesTitle:'チケット・配席ルール',rulesLead:'本ページは非公式ファンメイドのシミュレーションであり、実在の会場とは関係なく、実際の決済は発生しません。',rules:['全席指定となり、座席番号はお選びいただけません','3歳以上有料（3歳未満入場不可）','電子チケットのみ発行します','当日会場にて購入者の本人確認をランダムに実施する場合があります'],assignTitle:'決済後ランダム配席',assignBody:'確定すると選択した券種が固定され、その券種の対象エリア内で座席番号がランダムに発行されます。本ページは非公式ファンメイドのシミュレーションであり、実際の決済は発生しません。',paymentConfirmTitle:'現在の購入者名義で決済しますか？',paymentConfirmBody:'確認後、電子チケットファイルをダウンロードできます',paymentCancel:'戻る',paymentConfirm:'確認'}};

  var DICE=['\u2680','\u2681','\u2682','\u2683'];
  var STEPKEYS=['stop','zone','name','ticket'];
  var STEPLABELS={cn:['场次','票档','确认','出票'],en:['SHOW','TIER','CONFIRM','TICKET'],jp:['公演','券種','確認','発券']};
  var DOW=['SUN','MON','TUE','WED','THU','FRI','SAT'];
  var minPrice=Math.min.apply(null,ZONES.map(function(z){return z.price;}));

  var state={ lang:(window.DiZLang||'cn'), step:'stop', stopIndex:null, zoneId:null, name:'', ticket:null, confirmOpen:false };
  var continentScrollHandler=null;

  var hero=new Image(); hero.crossOrigin='anonymous'; hero.src='assets/hero-desktop-square.jpg';

  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  function pad2(n){return n<10?'0'+n:''+n;}
  function timeToMinutes(value){var p=String(value).split(':');return (+p[0]*60)+(+p[1]);}
  function minutesToTime(value){var n=(value+1440)%1440;return pad2(Math.floor(n/60))+':'+pad2(n%60);}
  function showTimes(stop){
    var doors=timeToMinutes(stop.doors);
    var allowed=TOUR_TIME_RULES.doorsWindows.some(function(w){return doors>=w[0]&&doors<=w[1];});
    if(!allowed) throw new Error('Invalid doors time for '+stop.code+': '+stop.doors);
    return {doors:stop.doors,start:minutesToTime(doors+TOUR_TIME_RULES.startAfterDoorsMinutes)};
  }
  function formatPrice(value){return '¥'+String(value).replace(/\B(?=(\d{3})+(?!\d))/g,',');}
  function randomInt(min,max){
    var span=max-min+1;
    if(window.crypto&&window.crypto.getRandomValues){var n=new Uint32Array(1);window.crypto.getRandomValues(n);return min+(n[0]%span);}
    return min+Math.floor(Math.random()*span);
  }
  function assignSeat(zone){
    return zone.rank==='S'
      ?{section:'S',row:randomInt(1,18),number:randomInt(1,48)}
      :{section:'A',row:randomInt(19,38),number:randomInt(1,52)};
  }
  function formatSeat(seat,lang){
    if(!seat||typeof seat==='string')return seat||'';
    if(lang==='jp')return seat.section+'ブロック・'+seat.row+'列・'+seat.number+'番';
    if(lang==='en')return seat.section+' BLOCK · ROW '+pad2(seat.row)+' · SEAT '+pad2(seat.number);
    return seat.section+'区 · '+seat.row+'排 · '+seat.number+'号';
  }
  function top(){try{window.scrollTo({top:0,behavior:'smooth'});}catch(e){}}

  /* ---------- canvas PNG export (ported verbatim) ---------- */
  function seedNo(n){ let s=0; for(let i=0;i<n.length;i++) s+=n.charCodeAt(i); return s; }
  function diceDots(g,cx,cy,s,color){ const rr=s*0.085,off=[0.24,0.5,0.76],pts=[[0,0],[2,0],[1,1],[0,2],[2,2]]; g.fillStyle=color; pts.forEach(p=>{g.beginPath();g.arc(cx-s/2+off[p[0]]*s,cy-s/2+off[p[1]]*s,rr,0,7);g.fill();}); }
  function roundRect(g,x,y,w,h,r){ g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath(); }

  function drawTicketCanvas(tkt){
    const s=STOPS[tkt.stopIndex], z=ZONES.find(x=>x.id===tkt.zoneId), lang=state.lang;
    const times=showTimes(s);
    const DPR=2,W=2000,H=700,M=26,R=34,PHOTO=H-2*M,STUB=1540;
    const c=document.createElement('canvas'); c.width=W*DPR; c.height=H*DPR; const g=c.getContext('2d'); g.scale(DPR,DPR); g.textBaseline='alphabetic';
    g.save(); roundRect(g,M,M,W-2*M,H-2*M,R); g.clip();
    const ix=M,iy=M,iw=W-2*M,ih=H-2*M;
    let bg=g.createLinearGradient(ix,iy,ix+iw,iy+ih); bg.addColorStop(0,'#4c001a'); bg.addColorStop(.5,'#2a000f'); bg.addColorStop(1,'#170006'); g.fillStyle=bg; g.fillRect(ix,iy,iw,ih);
    let glow=g.createRadialGradient(ix+iw*0.42,iy-60,40,ix+iw*0.42,iy-60,520); glow.addColorStop(0,'rgba(236,0,80,.42)'); glow.addColorStop(1,'rgba(236,0,80,0)'); g.fillStyle=glow; g.fillRect(ix,iy,iw,ih);
    g.save(); g.globalAlpha=.06; diceDots(g,ix+iw*0.63,iy+ih*0.5,460,'#ff86bd'); g.restore();
    if(hero&&hero.complete&&hero.naturalWidth){
      g.save(); g.beginPath(); g.rect(ix,iy,PHOTO,PHOTO); g.clip();
      const S=PHOTO,scale=Math.max(S/hero.naturalWidth,S/hero.naturalHeight),dw=hero.naturalWidth*scale,dh=hero.naturalHeight*scale;
      g.drawImage(hero,ix+(S-dw)*0.34,iy-S*0.06,dw,dh);
      let fade=g.createLinearGradient(ix,0,ix+PHOTO,0); fade.addColorStop(0,'rgba(23,0,6,.05)'); fade.addColorStop(.7,'rgba(42,0,15,.18)'); fade.addColorStop(1,'rgba(42,0,15,.55)'); g.fillStyle=fade; g.fillRect(ix,iy,PHOTO,PHOTO); g.restore();
      g.fillStyle='#ec0050'; g.fillRect(ix+PHOTO-2,iy,3,ih);
      g.save(); g.shadowColor='rgba(236,0,80,.9)'; g.shadowBlur=18; g.fillRect(ix+PHOTO-2,iy,3,ih); g.restore();
    }
    const L=ix+PHOTO+56;
    g.fillStyle='#e4afbf'; g.font="700 19px 'Space Mono',monospace"; g.fillText('TSUKUMO99   ·   WORLD TOUR 2026',L,iy+56);
    g.save(); g.shadowColor='rgba(236,0,80,.5)'; g.shadowBlur=22; g.fillStyle='#ec0050'; g.font="italic 700 120px 'Oswald',sans-serif"; g.fillText('DiŹ',L,iy+206); g.restore();
    g.strokeStyle='rgba(255,134,189,.16)'; g.lineWidth=1; g.beginPath(); g.moveTo(L,iy+256); g.lineTo(STUB-52,iy+256); g.stroke();
    const c1=L,c2=L+470,gy0=iy+308,step=80;
    const Lcol=[['CITY',s.city.en,false],['VENUE',s.venue.en,false],['ZONE',z.name.en,false],['ATTENDEE',tkt.name,false]];
    const Rcol=[['DATE',s.date,false],['DOORS · SHOW',times.doors+' · '+times.start,false],['TIER',z.tier+'  '+formatPrice(z.price),true],['SEAT',formatSeat(tkt.seat,'en'),false]];
    const drawCol=(col,cx,vFont)=>{ let yy=gy0; col.forEach(r=>{ g.fillStyle='#c98aa0'; g.font="700 15px 'Space Mono',monospace"; g.fillText(r[0],cx,yy); g.fillStyle=r[2]?'#ec0050':'#fff4f7'; g.font=vFont; g.fillText(String(r[1]),cx,yy+38); yy+=step; }); };
    drawCol(Lcol,c1,"700 34px 'Oswald',sans-serif"); drawCol(Rcol,c2,"700 32px 'Oswald',sans-serif");
    g.fillStyle='#ec0050'; g.font="700 15px 'Space Mono',monospace"; g.fillText('UNOFFICIAL / FAN-MADE, NOT A REAL TICKET',c1,iy+ih-26);
    g.strokeStyle='rgba(255,244,247,.5)'; g.lineWidth=2; g.setLineDash([14,12]); g.beginPath(); g.moveTo(STUB,iy+18); g.lineTo(STUB,iy+ih-18); g.stroke(); g.setLineDash([]);
    g.save(); g.globalCompositeOperation='destination-out'; g.beginPath(); g.arc(STUB,iy,22,0,7); g.fill(); g.beginPath(); g.arc(STUB,iy+ih,22,0,7); g.fill(); g.restore();
    const seed=seedNo(tkt.no),bLeft=STUB+52,bRight=ix+iw-96,sc=(bLeft+bRight)/2;
    g.textAlign='center'; g.fillStyle='#ff86bd'; g.font="700 24px 'Space Mono',monospace"; g.fillText('ADMIT ONE',sc,iy+72);
    g.fillStyle='#c98aa0'; g.font="700 14px 'Space Mono',monospace"; g.fillText('TSUKUMO99 · DiŹ TOUR',sc,iy+100);
    const bTop=iy+170,bH=300; let bx=bLeft,k=0; g.fillStyle='#fff4f7';
    while(bx<bRight){ const w=3+((seed*(k+7))%6); if(k%2===0)g.fillRect(bx,bTop,w,bH); bx+=w+3; k++; }
    g.fillStyle='#fff4f7'; g.font="700 17px 'Space Mono',monospace"; g.fillText(tkt.no,sc,bTop+bH+42);
    g.fillStyle='#c98aa0'; g.font="700 12px 'Space Mono',monospace"; g.fillText('SCAN AT DOOR',sc,bTop+bH+68);
    g.save(); g.translate(ix+iw-30,iy+ih/2); g.rotate(-Math.PI/2); g.fillStyle='rgba(255,134,189,.45)'; g.font="700 13px 'Space Mono',monospace"; g.fillText('WORLD TOUR 2026',0,0); g.restore();
    g.textAlign='left'; g.restore();
    g.save(); roundRect(g,M,M,W-2*M,H-2*M,R); g.strokeStyle='#ff86bd'; g.lineWidth=5; g.stroke(); g.restore();
    return c;
  }
  function download(){ const tkt=state.ticket; if(!tkt)return; const c=drawTicketCanvas(tkt); c.toBlob(bl=>{ const url=URL.createObjectURL(bl); const a=document.createElement('a'); a.href=url; a.download=tkt.no+'.png'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(url),1000); },'image/png'); }

  /* ---------- actions ---------- */
  function pickStop(i){ state.step='zone'; state.stopIndex=i; state.zoneId=null; state.confirmOpen=false; render(); top(); }
  function pickZone(id){ state.step='name'; state.zoneId=id; state.confirmOpen=false; render(); top(); }
  function backToStop(){ state.step='stop'; state.zoneId=null; state.confirmOpen=false; render(); }
  function backToZone(){ state.step='zone'; state.confirmOpen=false; render(); }
  function openPaymentConfirm(){
    if(!state.zoneId || !state.name.trim()) return;
    state.confirmOpen=true; render();
  }
  function closePaymentConfirm(){
    state.confirmOpen=false; render();
    var btn=flow.querySelector('[data-act="issue"]'); if(btn) btn.focus();
  }
  function issue(){
    if(!state.zoneId || !state.name.trim()) return;
    var s=STOPS[state.stopIndex], z=ZONES.filter(function(x){return x.id===state.zoneId;})[0];
    var r=function(n){return Math.floor(Math.random()*Math.pow(10,n)).toString().padStart(n,'0');};
    var seat=assignSeat(z);
    state.ticket={ stopIndex:state.stopIndex, zoneId:z.id, name:state.name.trim(), no:'ZL-DIZ-'+s.code+z.code+'-'+r(4), seat:seat };
    state.confirmOpen=false; state.step='ticket'; render(); top();
  }
  function bookAnother(){ state.step='stop'; state.stopIndex=null; state.zoneId=null; state.name=''; state.ticket=null; state.confirmOpen=false; render(); top(); }
  function updateIssue(){
    var btn=flow.querySelector('[data-act="issue"]'); if(!btn) return;
    var can=!!state.zoneId && state.name.trim().length>0;
    btn.style.background=can?'var(--hot)':'rgba(236,0,80,.2)';
    btn.style.color=can?'var(--paper)':'rgba(255,244,247,.5)';
    btn.style.cursor=can?'pointer':'not-allowed';
    btn.style.boxShadow=can?'0 8px 22px rgba(236,0,80,.4)':'none';
  }

  /* ---------- render ---------- */
  function stepperHTML(){
    var si=STEPKEYS.indexOf(state.step), labels=STEPLABELS[state.lang], out='';
    for(var i=0;i<STEPKEYS.length;i++){
      var fg=i<=si?'var(--hot)':'rgba(255,134,189,.3)';
      var glow=i===si?'drop-shadow(0 0 8px rgba(236,0,80,.7))':'none';
      var tc=i<=si?'var(--paper)':'var(--muted)';
      var bar=i<3?'<span style="flex:1;height:2px;margin:0 8px;margin-bottom:18px;border-radius:2px;background:'+(i<si?'var(--hot)':'rgba(255,134,189,.18)')+';"></span>':'';
      out+='<div style="display:flex;align-items:center;flex:1;">'
        +'<div style="display:flex;flex-direction:column;align-items:center;gap:6px;">'
        +'<span style="font-size:30px;line-height:1;color:'+fg+';filter:'+glow+';transition:color .25s;">'+DICE[i]+'</span>'
        +'<span style="font-family:var(--mono);font-size:9px;letter-spacing:.08em;text-transform:uppercase;color:'+tc+';white-space:nowrap;">'+labels[i]+'</span>'
        +'</div>'+bar+'</div>';
    }
    return '<div style="display:flex;align-items:center;gap:0;margin-bottom:clamp(22px,4vw,32px);">'+out+'</div>';
  }

  function renderStop(t){
    var lang=state.lang;
    var nav=CONTINENTS.map(function(continent,index){return '<a href="#continent-'+continent.id+'"'+(index===0?' class="is-active" aria-current="location"':'')+'>'+esc(continent.name[lang])+'</a>';}).join('');
    var sections=CONTINENTS.map(function(continent){
      var rows='',groupIndex=0;
      for(var i=0;i<STOPS.length;i++){
        var s=STOPS[i]; if(s.continent!==continent.id)continue;
        var p=s.date.split('.'),d=new Date(+p[0],+p[1]-1,+p[2]),dow=DOW[d.getDay()],times=showTimes(s);
        var vfull=s.venue[lang],vName=vfull.indexOf(' \u00b7 ')>=0?vfull.split(' \u00b7 ')[1]:vfull;
        var revDelay=(Math.min(groupIndex,7)*0.04).toFixed(3)+'s'; groupIndex++;
        rows+='<button data-act="stop" data-i="'+i+'" class="row rvrow tour-row" style="animation-delay:'+revDelay+';">'
          +'<span class="tour-date"><span>'+p[0]+'.'+p[1]+'</span><strong>'+p[2]+'</strong><em>'+dow+'</em></span>'
          +'<span class="tour-place"><small>'+esc(s.country[lang])+'</small><strong class="rcity">'+esc(s.city[lang])+'</strong><span>'+esc(vName)+'</span></span>'
          +'<span class="tour-facts"><span class="tour-time"><small>'+esc(t.lblOpen)+'</small><strong>'+times.doors+' / '+times.start+'</strong></span><span class="tour-price"><small>'+esc(t.lblPrice)+'</small><strong>'+formatPrice(minPrice)+' \u301c</strong></span></span>'
          +'<span class="rchev" aria-hidden="true">\u203a</span>'
          +'</button>';
      }
      return '<section class="tour-continent" id="continent-'+continent.id+'"><h2>'+esc(continent.name[lang])+'</h2>'
        +'<div class="tour-table-head" aria-hidden="true"><span>'+esc(t.lblDate)+'</span><span>'+esc(t.lblPlace)+'</span><span><b>'+esc(t.lblOpen)+'</b><b>'+esc(t.lblPrice)+'</b></span><i></i></div>'
        +'<div class="tour-rows">'+rows+'</div></section>';
    }).join('');
    return '<div class="tk-step">'
      +'<h1 class="tour-page-title">'+esc(t.getTickets)+'</h1>'
      +'<nav class="continent-nav" aria-label="'+esc(t.continentNav)+'">'+nav+'</nav>'
      +sections+'</div>';
  }

  function renderZone(t){
    var lang=state.lang, s=STOPS[state.stopIndex];
    var venue=s.venue[lang], dot=venue.indexOf(' · ');
    var cur={city:s.city[lang],venue:dot>=0?venue.split(' · ')[1]:venue,date:s.date}, cards='';
    for(var i=0;i<ZONES.length;i++){
      var z=ZONES[i];
      cards+='<button data-act="zone" data-id="'+z.id+'" class="tier-option" data-die="'+z.die+'" style="--tier-accent:'+z.accent+';">'
        +'<span class="tier-top"><span class="tier-code">TIER '+z.tier+'</span>'+(z.goods?'<span class="tier-merch">'+esc(t.goods)+'</span>':'')+'</span>'
        +'<h3>'+esc(z.name[lang])+'</h3>'
        +'<span class="tier-price">'+formatPrice(z.price)+' <small>'+esc(t.tax)+'</small></span>'
        +(z.notice?'<p class="tier-warning">※ '+esc(z.notice[lang])+'</p>':'')
        +'</button>';
    }
    var rules=t.rules.map(function(rule){return '<li>'+esc(rule)+'</li>';}).join('');
    return '<div class="tk-step">'
      +'<button data-act="back-stop" style="font-family:var(--mono);font-weight:700;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);background:none;border:0;cursor:pointer;padding:0 0 10px;">\u2190 '+esc(t.back)+'</button>'
      +'<h1 style="margin:0 0 18px;font-family:var(--display);font-weight:700;font-size:clamp(18px,4vw,28px);line-height:1.25;letter-spacing:-.02em;">'+esc(cur.city)+' \u00b7 '+esc(cur.venue)+' \u00b7 '+cur.date+'</h1>'
      +'<section class="ticket-rules" aria-labelledby="ticketRulesTitle">'
      +'<div class="ticket-rules-head"><span class="ticket-rules-die" aria-hidden="true">⚄</span><div><h2 id="ticketRulesTitle">'+esc(t.rulesTitle)+'</h2><p>'+esc(t.rulesLead)+'</p></div></div>'
      +'<ol>'+rules+'</ol></section>'
      +'<div class="tier-grid">'+cards+'</div></div>';
  }

  function renderName(t){
    var lang=state.lang, s=STOPS[state.stopIndex], z=ZONES.filter(function(x){return x.id===state.zoneId;})[0];
    var venue=s.venue[lang], dot=venue.indexOf(' · ');
    var cur={city:s.city[lang],venue:dot>=0?venue.split(' · ')[1]:venue,date:s.date};
    var can=!!state.zoneId && state.name.trim().length>0;
    var iBg=can?'var(--hot)':'rgba(236,0,80,.2)', iFg=can?'var(--paper)':'rgba(255,244,247,.5)', iCur=can?'pointer':'not-allowed', iSh=can?'0 8px 22px rgba(236,0,80,.4)':'none';
    var paymentDialog=state.confirmOpen?'<div class="payment-confirm-backdrop"><section class="payment-confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="paymentConfirmTitle" aria-describedby="paymentConfirmBody">'
      +'<span class="payment-confirm-die" aria-hidden="true">⚄</span><h2 id="paymentConfirmTitle">'+esc(t.paymentConfirmTitle)+'</h2>'
      +'<strong class="payment-confirm-name">'+esc(state.name.trim())+'</strong><p id="paymentConfirmBody">'+esc(t.paymentConfirmBody)+'</p>'
      +'<div class="payment-confirm-actions"><button data-act="cancel-payment">'+esc(t.paymentCancel)+'</button><button data-act="confirm-payment">'+esc(t.paymentConfirm)+'</button></div>'
      +'</section></div>':'';
    return '<div class="tk-step" style="max-width:520px;">'
      +'<button data-act="back-zone" style="font-family:var(--mono);font-weight:700;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);background:none;border:0;cursor:pointer;padding:0 0 10px;">\u2190 '+esc(t.back)+'</button>'
      +'<div class="confirm-ticket"><div class="confirm-ticket-main"><div><div class="confirm-ticket-name">'+esc(z.name[lang])+'</div><div class="confirm-ticket-meta">'+esc(cur.city)+' · '+esc(cur.venue)+'<br>'+cur.date+' · '+z.tier+'</div></div><div class="confirm-ticket-price">'+formatPrice(z.price)+'</div></div>'
      +'<div class="random-assign"><b>'+esc(t.assignTitle)+'</b><p>'+esc(t.assignBody)+'</p></div></div>'
      +'<label style="display:block;margin-top:18px;font-family:var(--mono);font-size:11px;font-weight:700;letter-spacing:.14em;color:var(--pink);text-transform:uppercase;">'+esc(t.nameLabel)+'</label>'
      +'<input data-act="name" value="'+esc(state.name)+'" placeholder="'+esc(t.namePlaceholder)+'" style="margin-top:10px;width:100%;font-family:var(--display);font-weight:500;font-size:22px;letter-spacing:.02em;padding:13px 15px;border:1.5px solid rgba(255,134,189,.35);border-radius:10px;background:rgba(23,0,6,.55);color:var(--paper);outline:none;">'
      +'<div style="display:flex;gap:10px;margin-top:20px;flex-wrap:wrap;">'
      +'<button data-act="issue" style="flex:1;min-width:160px;font-family:var(--mono);font-weight:700;font-size:13px;letter-spacing:.12em;text-transform:uppercase;padding:14px 18px;border:0;border-radius:9px;background:'+iBg+';color:'+iFg+';cursor:'+iCur+';box-shadow:'+iSh+';">'+esc(t.issueBtn)+'</button></div></div>'+paymentDialog;
  }

  function fieldCell(label,val,color,big){
    return '<div><div style="font-family:var(--mono);font-size:9px;letter-spacing:.12em;color:var(--muted);">'+label+'</div>'
      +'<div style="font-family:var(--display);font-weight:700;font-size:'+(big||16)+'px;color:'+(color||'var(--paper)')+';'+(big?'':'text-transform:uppercase;')+'">'+val+'</div></div>';
  }
  function renderTicket(t){
    var lang=state.lang, tkt=state.ticket, s=STOPS[tkt.stopIndex], z=ZONES.filter(function(x){return x.id===tkt.zoneId;})[0];
    var tk={city:s.city[lang],venue:s.venue[lang],date:s.date,tier:z.tier,name:tkt.name,no:tkt.no,seat:formatSeat(tkt.seat,lang),price:formatPrice(z.price)};
    var on=[true,false,true,false,true,false,true,false,true];
    var pips=on.map(function(v){return '<span style="border-radius:50%;background:'+(v?'var(--paper)':'transparent')+';"></span>';}).join('');
    var seedV=seedNo(tkt.no), bars='';
    for(var k=0;k<34;k++){ var w=1+((seedV*(k+7))%4); bars+='<span style="display:inline-block;width:'+w+'px;height:100%;background:var(--paper);"></span>'; }
    var grid='<div style="margin-top:14px;display:grid;grid-template-columns:1fr 1fr;gap:12px 10px;">'
      +fieldCell(esc(t.lblCity),esc(tk.city))
      +fieldCell(esc(t.lblDate),tk.date)
      +fieldCell(esc(t.lblVenue),esc(tk.venue))
      +fieldCell(esc(t.lblTier),tk.tier,'var(--hot)')
      +fieldCell(esc(t.lblSeat),esc(tk.seat))
      +fieldCell(esc(t.lblPrice),tk.price)
      +'<div style="grid-column:1/-1;"><div style="font-family:var(--mono);font-size:9px;letter-spacing:.12em;color:var(--muted);">'+esc(t.lblName)+'</div><div style="font-family:var(--display);font-weight:700;font-size:22px;color:var(--paper);">'+esc(tk.name)+'</div></div>'
      +'</div>';
    return '<div class="tk-step">'
      +'<div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;">'
      +'<span style="display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:50%;background:var(--hot);color:var(--paper);font-size:16px;">\u2713</span>'
      +'<h1 style="margin:0;font-family:var(--display);font-weight:700;text-transform:uppercase;font-size:clamp(20px,4vw,28px);line-height:1;">'+esc(t.ticketReady)+'</h1></div>'
      +'<div style="display:flex;flex-wrap:wrap;border:2px solid var(--pink);border-radius:12px;overflow:hidden;background:linear-gradient(135deg,#3a0014,#170006 55%,#4c001a);box-shadow:0 20px 60px rgba(0,0,0,.5);">'
      +'<div style="flex:1;min-width:15rem;padding:20px;position:relative;">'
      +'<div style="display:flex;align-items:baseline;justify-content:space-between;gap:8px;flex-wrap:wrap;">'
      +'<span style="font-family:var(--mono);font-size:10px;font-weight:700;letter-spacing:.2em;color:var(--muted);">TSUKUMO99 \u00b7 Di\u0179 WORLD TOUR</span>'
      +'<span style="font-family:var(--mono);font-size:10px;letter-spacing:.1em;color:var(--pink);">'+tk.no+'</span></div>'
      +'<div style="margin-top:8px;font-family:var(--display);font-weight:700;font-style:italic;text-transform:uppercase;font-size:clamp(34px,7vw,44px);line-height:.95;color:var(--hot);filter:drop-shadow(0 0 14px rgba(236,0,80,.4));">Di\u0179</div>'
      +grid
      +'<div style="margin-top:16px;font-family:var(--mono);font-size:9px;font-weight:700;letter-spacing:.08em;color:var(--hot);">UNOFFICIAL / FAN-MADE, NOT A REAL TICKET</div></div>'
      +'<div style="width:clamp(6.5rem,22%,9rem);border-left:2px dashed rgba(255,244,247,.45);padding:16px 12px;display:flex;flex-direction:column;align-items:center;justify-content:space-between;gap:12px;background:rgba(23,0,6,.35);">'
      +'<div style="font-family:var(--mono);font-size:10px;font-weight:700;letter-spacing:.28em;color:var(--pink);">ADMIT ONE</div>'
      +'<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:5px;width:44px;height:44px;">'+pips+'</div>'
      +'<div style="display:flex;align-items:flex-end;gap:1px;height:40px;">'+bars+'</div>'
      +'<div style="font-family:var(--mono);font-size:8px;letter-spacing:.04em;color:var(--muted);word-break:break-all;text-align:center;">'+tk.no+'</div></div></div>'
      +'<div style="display:flex;gap:10px;margin-top:18px;flex-wrap:wrap;">'
      +'<button data-act="download" style="flex:1;min-width:150px;font-family:var(--mono);font-weight:700;font-size:14px;letter-spacing:.12em;text-transform:uppercase;padding:15px 20px;border:0;border-radius:10px;background:var(--hot);color:var(--paper);cursor:pointer;box-shadow:0 12px 32px rgba(236,0,80,.5);">\u2193 '+esc(t.download)+'</button>'
      +'<button data-act="book" style="font-family:var(--mono);font-weight:700;font-size:12px;letter-spacing:.1em;text-transform:uppercase;padding:15px 20px;border:1px solid rgba(255,244,247,.25);border-radius:10px;background:transparent;color:var(--paper);cursor:pointer;">'+esc(t.bookAnother)+'</button></div>'
      +'<p style="margin:12px 0 0;text-align:center;font-family:var(--mono);font-size:11px;line-height:1.5;color:var(--muted);">'+esc(t.downloadHint)+'</p></div>';
  }

  function render(){
    var t=T[state.lang], body;
    if(state.step==='stop') body=renderStop(t);
    else if(state.step==='zone') body=renderZone(t);
    else if(state.step==='name') body=renderName(t);
    else body=renderTicket(t);
    flow.innerHTML='<div style="max-width:'+(state.step==='stop'?'960px':'760px')+';margin:0 auto;">'+stepperHTML()+body+'</div>';
    document.body.classList.toggle('payment-confirm-open',state.confirmOpen);
    wire();
  }

  function wire(){
    var els=flow.querySelectorAll('[data-act]');
    for(var i=0;i<els.length;i++){ (function(el){
      var act=el.getAttribute('data-act');
      if(act==='stop') el.onclick=function(){ pickStop(+el.getAttribute('data-i')); };
      else if(act==='zone') el.onclick=function(){ pickZone(el.getAttribute('data-id')); };
      else if(act==='back-stop') el.onclick=backToStop;
      else if(act==='back-zone') el.onclick=backToZone;
      else if(act==='issue') el.onclick=openPaymentConfirm;
      else if(act==='confirm-payment') el.onclick=issue;
      else if(act==='cancel-payment') el.onclick=closePaymentConfirm;
      else if(act==='download') el.onclick=download;
      else if(act==='book') el.onclick=bookAnother;
      else if(act==='name'){ el.oninput=function(){ state.name=el.value; updateIssue(); }; el.onkeydown=function(e){ if(e.key==='Enter') openPaymentConfirm(); }; }
    })(els[i]); }
    flow.onkeydown=state.confirmOpen?function(e){ if(e.key==='Escape'){ e.preventDefault(); closePaymentConfirm(); } }:null;
    if(state.confirmOpen){ var confirmBtn=flow.querySelector('[data-act="confirm-payment"]'); if(confirmBtn) confirmBtn.focus(); }
    if(continentScrollHandler){ window.removeEventListener('scroll',continentScrollHandler); continentScrollHandler=null; }
    var continentNav=flow.querySelector('.continent-nav');
    var continentLinks=flow.querySelectorAll('.continent-nav a');
    var continentSections=flow.querySelectorAll('.tour-continent');
    if(!continentLinks.length) return;
    function setActiveContinent(id){
      var activeLink=null,changed=false;
      for(var j=0;j<continentLinks.length;j++){
        var active=continentLinks[j].getAttribute('href')==='#'+id;
        if(active!==continentLinks[j].classList.contains('is-active')) changed=true;
        continentLinks[j].classList.toggle('is-active',active);
        if(active){ continentLinks[j].setAttribute('aria-current','location'); activeLink=continentLinks[j]; }
        else continentLinks[j].removeAttribute('aria-current');
      }
      if(changed && activeLink && continentNav.scrollWidth>continentNav.clientWidth){
        continentNav.scrollTo({left:activeLink.offsetLeft-(continentNav.clientWidth-activeLink.offsetWidth)/2,behavior:'smooth'});
      }
    }
    for(var k=0;k<continentLinks.length;k++) continentLinks[k].onclick=function(){ setActiveContinent(this.getAttribute('href').slice(1)); };
    function updateActiveFromPosition(){
      var current=continentSections[0],cutoff=window.innerHeight*.3;
      for(var n=0;n<continentSections.length;n++){
        if(continentSections[n].getBoundingClientRect().top<=cutoff) current=continentSections[n];
        else break;
      }
      setActiveContinent(current.id);
    }
    var scrollTick=false;
    continentScrollHandler=function(){
      if(scrollTick) return;
      scrollTick=true;
      window.requestAnimationFrame(function(){ scrollTick=false; updateActiveFromPosition(); });
    };
    window.addEventListener('scroll',continentScrollHandler,{passive:true});
    updateActiveFromPosition();
  }

  window.DiZTicketLang=function(l){ state.lang=l; render(); };
  render();
})();
