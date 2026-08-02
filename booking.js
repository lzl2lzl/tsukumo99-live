/* TSUKUMO99 · DiŹ — Ticket booking flow (offline, vanilla). Rebuilt to match the DiZ Ticket design. */
(function(){
  var flow=document.getElementById("ticketFlow");
  if(!flow) return;

  var STOPS = [
    { code:'SH',status:'few',date:'2026.07.18',country:{cn:'中国',en:'CHINA',jp:'中国'},city:{cn:'上海',en:'SHANGHAI',jp:'上海'},venue:{cn:'上海 · 滨江文化中心',en:'SHANGHAI RIVERSIDE HALL',jp:'上海 リバーサイドホール'}},
    { code:'GZ',status:'plenty',date:'2026.07.26',country:{cn:'中国',en:'CHINA',jp:'中国'},city:{cn:'广州',en:'GUANGZHOU',jp:'広州'},venue:{cn:'广州 · 珠江大剧场',en:'PEARL RIVER THEATRE',jp:'広州 珠江劇場'}},
    { code:'BJ',status:'few',date:'2026.08.02',country:{cn:'中国',en:'CHINA',jp:'中国'},city:{cn:'北京',en:'BEIJING',jp:'北京'},venue:{cn:'北京 · 京城中央馆',en:'CAPITAL CENTRAL ARENA',jp:'北京 セントラルアリーナ'}},
    { code:'SE',status:'plenty',date:'2026.08.08',country:{cn:'韩国',en:'KOREA',jp:'韓国'},city:{cn:'首尔',en:'SEOUL',jp:'ソウル'},venue:{cn:'首尔 · 汉江巨蛋',en:'HAN RIVER DOME',jp:'ソウル ハンガンドーム'}},
    { code:'TK',status:'few',date:'2026.08.15',country:{cn:'日本',en:'JAPAN',jp:'日本'},city:{cn:'东京',en:'TOKYO',jp:'東京'},venue:{cn:'东京 · 临海竞技场',en:'BAYFRONT ARENA TOKYO',jp:'東京 ベイフロントアリーナ'}},
    { code:'OS',status:'plenty',date:'2026.08.19',country:{cn:'日本',en:'JAPAN',jp:'日本'},city:{cn:'大阪',en:'OSAKA',jp:'大阪'},venue:{cn:'大阪 · 中之岛音乐堂',en:'NAKANOSHIMA HALL',jp:'大阪 中之島ホール'}},
    { code:'FK',status:'few',date:'2026.08.23',country:{cn:'日本',en:'JAPAN',jp:'日本'},city:{cn:'福冈',en:'FUKUOKA',jp:'福岡'},venue:{cn:'福冈 · 博多海湾馆',en:'HAKATA BAY HALL',jp:'福岡 博多ベイホール'}},
    { code:'SY',status:'plenty',date:'2026.08.30',country:{cn:'澳大利亚',en:'AUSTRALIA',jp:'オーストラリア'},city:{cn:'悉尼',en:'SYDNEY',jp:'シドニー'},venue:{cn:'悉尼 · 海港穹顶',en:'HARBOUR DOME SYDNEY',jp:'シドニー ハーバードーム'}},
    { code:'TR',status:'plenty',date:'2026.09.05',country:{cn:'加拿大',en:'CANADA',jp:'カナダ'},city:{cn:'多伦多',en:'TORONTO',jp:'トロント'},venue:{cn:'多伦多 · 湖滨中心',en:'LAKESHORE CENTRE',jp:'トロント レイクショア'}},
    { code:'VA',status:'few',date:'2026.09.09',country:{cn:'加拿大',en:'CANADA',jp:'カナダ'},city:{cn:'温哥华',en:'VANCOUVER',jp:'バンクーバー'},venue:{cn:'温哥华 · 海湾展演馆',en:'WATERFRONT PAVILION',jp:'バンクーバー ウォーターフロント'}},
    { code:'NY',status:'plenty',date:'2026.09.14',country:{cn:'美国',en:'UNITED STATES',jp:'アメリカ'},city:{cn:'纽约',en:'NEW YORK',jp:'ニューヨーク'},venue:{cn:'纽约 · 曼哈顿广场馆',en:'MANHATTAN GARDEN',jp:'ニューヨーク マンハッタンガーデン'}},
    { code:'LD',status:'few',date:'2026.09.19',country:{cn:'英国',en:'UNITED KINGDOM',jp:'イギリス'},city:{cn:'伦敦',en:'LONDON',jp:'ロンドン'},venue:{cn:'伦敦 · 泰晤士竞技场',en:'THAMES ARENA',jp:'ロンドン テムズアリーナ'}},
    { code:'MC',status:'plenty',date:'2026.09.23',country:{cn:'英国',en:'UNITED KINGDOM',jp:'イギリス'},city:{cn:'曼彻斯特',en:'MANCHESTER',jp:'マンチェスター'},venue:{cn:'曼彻斯特 · 北方大厅',en:'NORTHERN HALL',jp:'マンチェスター ノーザンホール'}},
    { code:'PA',status:'few',date:'2026.09.27',country:{cn:'法国',en:'FRANCE',jp:'フランス'},city:{cn:'巴黎',en:'PARIS',jp:'パリ'},venue:{cn:'巴黎 · 塞纳穹顶',en:'LE DÔME SEINE',jp:'パリ セーヌドーム'}},
    { code:'BE',status:'plenty',date:'2026.10.01',country:{cn:'德国',en:'GERMANY',jp:'ドイツ'},city:{cn:'柏林',en:'BERLIN',jp:'ベルリン'},venue:{cn:'柏林 · 施普雷会堂',en:'SPREE HALLE',jp:'ベルリン シュプレーホール'}},
    { code:'ML',status:'plenty',date:'2026.10.10',country:{cn:'意大利',en:'ITALY',jp:'イタリア'},city:{cn:'米兰',en:'MILAN',jp:'ミラノ'},venue:{cn:'米兰 · 中央竞技馆',en:'ARENA CENTRALE MILANO',jp:'ミラノ アレーナチェントラーレ'}},
    { code:'MD',status:'few',date:'2026.10.14',country:{cn:'西班牙',en:'SPAIN',jp:'スペイン'},city:{cn:'马德里',en:'MADRID',jp:'マドリード'},venue:{cn:'马德里 · 太阳门礼堂',en:'PALACIO SOL',jp:'マドリード パラシオソル'}},
    { code:'SP',status:'plenty',date:'2026.10.24',country:{cn:'巴西',en:'BRAZIL',jp:'ブラジル'},city:{cn:'圣保罗',en:'SÃO PAULO',jp:'サンパウロ'},venue:{cn:'圣保罗 · 保利斯塔馆',en:'ARENA PAULISTA',jp:'サンパウロ アレーナ'}},
    { code:'MX',status:'few',date:'2026.10.28',country:{cn:'墨西哥',en:'MEXICO',jp:'メキシコ'},city:{cn:'墨西哥城',en:'MEXICO CITY',jp:'メキシコシティ'},venue:{cn:'墨西哥城 · 索卡洛穹顶',en:'DOMO ZÓCALO',jp:'メキシコシティ ドモ'}},
    { code:'DB',status:'plenty',date:'2026.11.06',country:{cn:'阿联酋',en:'UAE',jp:'アラブ首長国連邦'},city:{cn:'迪拜',en:'DUBAI',jp:'ドバイ'},venue:{cn:'迪拜 · 海湾竞技场',en:'GULF COAST ARENA',jp:'ドバイ ガルフアリーナ'}},
    { code:'SG',status:'few',date:'2026.11.14',country:{cn:'新加坡',en:'SINGAPORE',jp:'シンガポール'},city:{cn:'新加坡',en:'SINGAPORE',jp:'シンガポール'},venue:{cn:'新加坡 · 滨海湾馆',en:'MARINA BAY HALL',jp:'シンガポール マリーナベイ'}}];
  var ZONES = [
    { id:'vip',tier:'VIP',code:'V',price:999,die:'⚅',accent:'var(--hot)',name:{cn:'VIP 前区站席',en:'VIP FRONT STANDING',jp:'VIPフロントスタンディング'},
      seat:{cn:'整理番号制 · 站席',en:'ENTRY-NUMBER · STANDING',jp:'整理番号制 · スタンディング'},
      perks:{cn:['前区站席,最靠近舞台','优先通道提前入场','限定周边礼包 + 纪念挂牌'],en:['Front standing, closest to stage','Priority early entry','Limited merch + laminate pass'],jp:['最前スタンディング','優先入場','限定グッズ + ラミネート']} },
    { id:'std',tier:'STANDARD',code:'S',price:499,die:'⚂',accent:'var(--pink)',name:{cn:'普通座席',en:'GENERAL SEATING',jp:'一般席'},
      seat:{cn:'对号入座 · 系统配席',en:'RESERVED · AUTO-ASSIGNED',jp:'指定席 · 自動配席'},
      perks:{cn:['系统自动配席(区/排/座)','标准入场通道','电子场刊'],en:['Auto-assigned seat','Standard entry lane','Digital programme'],jp:['自動配席','通常入場','デジタルパンフ']} }];
  var T = {
    cn:{getTickets:'选择场次',lblOpen:'开场 / 开演',lblPrice:'票档',lblStatus:'余票',from:'起',chooseZone:'选择座位档',back:'返回',nameStep:'这张票印给谁?',nameLabel:'持票人姓名',namePlaceholder:'输入将印在票面上的名字',issueBtn:'生成电子票',ticketReady:'电子票已生成',download:'下载 PNG 票券',bookAnother:'再选一场',lblCity:'城市',lblVenue:'场馆',lblDate:'日期',lblTier:'档位',lblSeat:'座位',lblName:'持票人',statusFew:'仅剩少量',statusPlenty:'余票充足',downloadHint:'无法下载?试试用手机浏览器打开本站。'},
    en:{getTickets:'CHOOSE A SHOW',lblOpen:'DOORS / START',lblPrice:'FROM',lblStatus:'STATUS',from:'FROM',chooseZone:'CHOOSE YOUR ZONE',back:'BACK',nameStep:'WHOSE NAME GOES ON IT?',nameLabel:'ATTENDEE NAME',namePlaceholder:'Name to print on the ticket',issueBtn:'ISSUE TICKET',ticketReady:'YOUR TICKET IS READY',download:'DOWNLOAD PNG',bookAnother:'BOOK ANOTHER',lblCity:'CITY',lblVenue:'VENUE',lblDate:'DATE',lblTier:'TIER',lblSeat:'SEAT',lblName:'ATTENDEE',statusFew:'FEW LEFT',statusPlenty:'AVAILABLE',downloadHint:"Download not working? Open this site in your phone's browser."},
    jp:{getTickets:'公演を選ぶ',lblOpen:'開場 / 開演',lblPrice:'料金',lblStatus:'残席',from:'より',chooseZone:'ゾーンを選択',back:'戻る',nameStep:'チケットの名義は?',nameLabel:'氏名',namePlaceholder:'チケットに印字する名前',issueBtn:'チケット発行',ticketReady:'チケットが発行されました',download:'PNGを保存',bookAnother:'別の公演',lblCity:'都市',lblVenue:'会場',lblDate:'日付',lblTier:'ランク',lblSeat:'座席',lblName:'氏名',statusFew:'残りわずか',statusPlenty:'販売中',downloadHint:'ダウンロードできない場合はスマホの標準ブラウザで開き直してください。'}};

  var DICE=['\u2680','\u2681','\u2682','\u2683'];
  var STEPKEYS=['stop','zone','name','ticket'];
  var STEPLABELS={cn:['\u573a\u6b21','\u6863\u4f4d','\u7f72\u540d','\u51fa\u7968'],en:['SHOW','ZONE','NAME','TICKET'],jp:['\u516c\u6f14','\u30e9\u30f3\u30af','\u6c0f\u540d','\u767a\u5238']};
  var DOW=['SUN','MON','TUE','WED','THU','FRI','SAT'];
  var OPENSETS=[['16:30','17:30'],['17:00','18:00'],['17:30','18:30'],['18:00','19:00'],['13:00','14:00']];
  var minPrice=Math.min.apply(null,ZONES.map(function(z){return z.price;}));

  var state={ lang:(window.DiZLang||'cn'), step:'stop', stopIndex:null, zoneId:null, name:'', ticket:null };

  var hero=new Image(); hero.src='assets/hero-desktop-square.jpg';

  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  function pad2(n){return n<10?'0'+n:''+n;}
  function top(){try{window.scrollTo({top:0,behavior:'smooth'});}catch(e){}}

  /* ---------- canvas PNG export (ported verbatim) ---------- */
  function seedNo(n){ let s=0; for(let i=0;i<n.length;i++) s+=n.charCodeAt(i); return s; }
  function diceDots(g,cx,cy,s,color){ const rr=s*0.085,off=[0.24,0.5,0.76],pts=[[0,0],[2,0],[1,1],[0,2],[2,2]]; g.fillStyle=color; pts.forEach(p=>{g.beginPath();g.arc(cx-s/2+off[p[0]]*s,cy-s/2+off[p[1]]*s,rr,0,7);g.fill();}); }
  function roundRect(g,x,y,w,h,r){ g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath(); }

  function drawTicketCanvas(tkt){
    const s=STOPS[tkt.stopIndex], z=ZONES.find(x=>x.id===tkt.zoneId), lang=state.lang;
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
    const Rcol=[['DATE',s.date,false],['DOORS · SHOW','18:30 · 19:30',false],['TIER',z.tier+'  ◈ '+z.price,true],['SEAT',tkt.seat,false]];
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
  function pickStop(i){ state.step='zone'; state.stopIndex=i; state.zoneId=null; render(); top(); }
  function pickZone(id){ state.step='name'; state.zoneId=id; render(); top(); }
  function backToStop(){ state.step='stop'; state.zoneId=null; render(); }
  function backToZone(){ state.step='zone'; render(); }
  function issue(){
    if(!state.zoneId || !state.name.trim()) return;
    var s=STOPS[state.stopIndex], z=ZONES.filter(function(x){return x.id===state.zoneId;})[0];
    var r=function(n){return Math.floor(Math.random()*Math.pow(10,n)).toString().padStart(n,'0');};
    var seat;
    if(z.id==='vip'){ seat=String.fromCharCode(65+Math.floor(Math.random()*3))+'-'+(100+Math.floor(Math.random()*400)); }
    else { seat=(1+Math.floor(Math.random()*3))+'\u533a '+String.fromCharCode(65+Math.floor(Math.random()*10))+'-'+(1+Math.floor(Math.random()*40)); }
    state.ticket={ stopIndex:state.stopIndex, zoneId:z.id, name:state.name.trim(), no:'ZL-DIZ-'+s.code+z.code+'-'+r(4), seat:seat };
    state.step='ticket'; render(); top();
  }
  function bookAnother(){ state.step='stop'; state.stopIndex=null; state.zoneId=null; state.name=''; state.ticket=null; render(); top(); }
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
    var lang=state.lang, legN=0, rows='';
    for(var i=0;i<STOPS.length;i++){
      var s=STOPS[i], p=s.date.split('.');
      var d=new Date(+p[0],+p[1]-1,+p[2]), wd=d.getDay(), dow=DOW[wd];
      var first=(i===0)||(STOPS[i-1].country.en!==s.country.en);
      if(first) legN++;
      var set=OPENSETS[(s.code.charCodeAt(0)+s.code.charCodeAt(1)+ +p[2])%OPENSETS.length];
      var weekend=(wd===0||wd===6), open=weekend?set[0]:set[1];
      var start=open.split(':')[0]+':'+pad2((+open.split(':')[1]+30)%60);
      var vfull=s.venue[lang], vName=vfull.indexOf(' \u00b7 ')>=0?vfull.split(' \u00b7 ')[1]:vfull;
      var ym=p[0]+'.'+p[1], day=p[2];
      var revDelay=(Math.min(i,9)*0.045).toFixed(3)+'s';
      var legLabel='LEG '+pad2(legN);
      var header=first?('<div style="display:flex;align-items:center;gap:12px;margin:26px 0 4px;">'
        +'<span style="font-family:var(--display);font-weight:700;text-transform:uppercase;font-size:13px;letter-spacing:.2em;color:var(--pink);white-space:nowrap;">'+esc(s.country[lang])+'</span>'
        +'<span style="flex:1;height:1px;background:rgba(255,134,189,.16);"></span>'
        +'<span style="font-family:var(--mono);font-size:10px;letter-spacing:.1em;color:var(--muted);">'+legLabel+'</span></div>'):'';
      rows+='<div>'+header
        +'<button data-act="stop" data-i="'+i+'" class="row rvrow" style="animation-delay:'+revDelay+';width:100%;display:flex;align-items:center;gap:16px;padding:20px 14px;border:0;border-top:1px solid rgba(255,244,247,.09);background:transparent;color:inherit;text-align:left;cursor:pointer;">'
        +'<div style="flex-shrink:0;width:clamp(58px,12vw,74px);">'
        +'<div style="font-family:var(--mono);font-size:10px;letter-spacing:.1em;color:var(--muted);">'+ym+'</div>'
        +'<div style="display:flex;align-items:baseline;gap:5px;margin-top:3px;line-height:.8;">'
        +'<span style="font-family:var(--display);font-weight:700;font-size:clamp(34px,7vw,44px);color:var(--paper);">'+day+'</span>'
        +'<span style="font-family:var(--mono);font-weight:700;font-size:11px;letter-spacing:.08em;color:var(--pink);">'+dow+'</span></div></div>'
        +'<div style="flex:1;min-width:0;">'
        +'<div class="rcity" style="font-family:var(--display);font-weight:700;text-transform:uppercase;font-size:clamp(18px,3.4vw,23px);line-height:1;color:var(--paper);">'+esc(s.city[lang])+'</div>'
        +'<div style="margin-top:7px;font-family:var(--body);font-size:13px;color:var(--muted);">'+esc(vName)+'</div>'
        +'<div style="margin-top:11px;display:flex;flex-wrap:wrap;gap:18px 22px;">'
        +'<div><div style="font-family:var(--mono);font-size:9px;letter-spacing:.14em;color:var(--muted);text-transform:uppercase;">'+esc(t.lblOpen)+'</div><div style="margin-top:3px;font-family:var(--mono);font-weight:700;font-size:13px;color:var(--paper);">'+open+' <span style="color:var(--muted);font-weight:400;">START '+start+'</span></div></div>'
        +'<div><div style="font-family:var(--mono);font-size:9px;letter-spacing:.14em;color:var(--muted);text-transform:uppercase;">'+esc(t.lblPrice)+'</div><div style="margin-top:3px;font-family:var(--mono);font-weight:700;font-size:13px;color:var(--paper);white-space:nowrap;">\u25c8'+minPrice+' \u301c</div></div>'
        +'</div></div>'
        +'<span class="rchev" style="flex-shrink:0;align-self:center;font-family:var(--display);font-size:24px;color:var(--muted);">\u203a</span>'
        +'</button></div>';
    }
    return '<div class="tk-step">'
      +'<div style="display:flex;align-items:baseline;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:22px;">'
      +'<h1 style="margin:0;font-family:var(--display);font-weight:700;text-transform:uppercase;font-size:clamp(24px,5vw,34px);line-height:1;">'+esc(t.getTickets)+'</h1>'
      +'<span style="font-family:var(--mono);font-size:11px;letter-spacing:.14em;color:var(--muted);">Di\u0179 WORLD TOUR 2026</span></div>'
      +'<div style="display:flex;flex-direction:column;">'+rows+'</div></div>';
  }

  function renderZone(t){
    var lang=state.lang, s=STOPS[state.stopIndex];
    var cur={city:s.city[lang],venue:s.venue[lang],date:s.date}, cards='';
    for(var i=0;i<ZONES.length;i++){
      var z=ZONES[i], sel=(state.zoneId===z.id);
      var border=sel?'var(--hot)':'rgba(255,134,189,.24)', bg=sel?'rgba(236,0,80,.14)':'rgba(255,244,247,.03)';
      var perks=z.perks[lang].map(function(pk){return '<li style="display:flex;gap:7px;font-family:var(--body);font-size:12px;line-height:1.4;color:rgba(255,244,247,.78);"><span style="color:var(--hot);flex-shrink:0;">\u25c8</span>'+esc(pk)+'</li>';}).join('');
      cards+='<button data-act="zone" data-id="'+z.id+'" class="tcard" style="position:relative;overflow:hidden;text-align:left;cursor:pointer;border-radius:14px;padding:18px;border:1.5px solid '+border+';background:'+bg+';display:flex;flex-direction:column;gap:11px;min-height:200px;">'
        +'<span aria-hidden="true" style="position:absolute;right:-16px;bottom:-30px;font-size:130px;line-height:1;color:rgba(255,134,189,.06);pointer-events:none;">'+z.die+'</span>'
        +'<div style="position:relative;display:flex;align-items:baseline;justify-content:space-between;gap:8px;">'
        +'<span style="font-family:var(--mono);font-weight:700;font-size:11px;letter-spacing:.16em;color:'+z.accent+';">'+z.tier+'</span>'
        +'<span style="font-family:var(--display);font-weight:700;font-size:26px;color:var(--hot);">\u25c8'+z.price+'</span></div>'
        +'<div style="position:relative;font-family:var(--display);font-weight:700;text-transform:uppercase;font-size:20px;line-height:1;color:var(--paper);">'+esc(z.name[lang])+'</div>'
        +'<div style="position:relative;display:inline-flex;align-items:center;gap:6px;font-family:var(--mono);font-size:10px;letter-spacing:.04em;color:'+z.accent+';"><span style="width:6px;height:6px;border-radius:50%;background:'+z.accent+';"></span>'+esc(z.seat[lang])+'</div>'
        +'<ul style="position:relative;margin:2px 0 0;padding:0;list-style:none;display:flex;flex-direction:column;gap:5px;">'+perks+'</ul></button>';
    }
    return '<div class="tk-step">'
      +'<button data-act="back-stop" style="font-family:var(--mono);font-weight:700;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);background:none;border:0;cursor:pointer;padding:0 0 10px;">\u2190 '+esc(t.back)+'</button>'
      +'<h1 style="margin:0 0 4px;font-family:var(--display);font-weight:700;text-transform:uppercase;font-size:clamp(22px,4.5vw,30px);line-height:1;">'+esc(t.chooseZone)+'</h1>'
      +'<p style="margin:0 0 18px;font-family:var(--mono);font-size:11.5px;letter-spacing:.03em;color:var(--pink);">'+esc(cur.city)+' \u00b7 '+esc(cur.venue)+' \u00b7 '+cur.date+'</p>'
      +'<div style="margin-bottom:16px;padding:14px;border:1px solid rgba(255,134,189,.14);border-radius:12px;background:radial-gradient(ellipse at 50% 140%,rgba(236,0,80,.28),transparent 60%),#180008;">'
      +'<div style="height:6px;border-radius:99px;background:linear-gradient(90deg,transparent,var(--hot),transparent);box-shadow:0 0 20px var(--hot);"></div>'
      +'<div style="text-align:center;margin-top:8px;font-family:var(--mono);font-size:10px;letter-spacing:.42em;color:var(--muted);">STAGE</div></div>'
      +'<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr));gap:14px;">'+cards+'</div></div>';
  }

  function renderName(t){
    var lang=state.lang, s=STOPS[state.stopIndex], z=ZONES.filter(function(x){return x.id===state.zoneId;})[0];
    var cur={city:s.city[lang],venue:s.venue[lang],date:s.date};
    var can=!!state.zoneId && state.name.trim().length>0;
    var iBg=can?'var(--hot)':'rgba(236,0,80,.2)', iFg=can?'var(--paper)':'rgba(255,244,247,.5)', iCur=can?'pointer':'not-allowed', iSh=can?'0 8px 22px rgba(236,0,80,.4)':'none';
    return '<div class="tk-step" style="max-width:440px;">'
      +'<button data-act="back-zone" style="font-family:var(--mono);font-weight:700;font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);background:none;border:0;cursor:pointer;padding:0 0 10px;">\u2190 '+esc(t.back)+'</button>'
      +'<h1 style="margin:0 0 16px;font-family:var(--display);font-weight:700;text-transform:uppercase;font-size:clamp(22px,4.5vw,30px);line-height:1;">'+esc(t.nameStep)+'</h1>'
      +'<div style="padding:14px 16px;border:1px solid rgba(255,134,189,.2);border-radius:12px;background:rgba(23,0,6,.4);font-family:var(--mono);font-size:12px;line-height:1.7;">'
      +'<div style="color:var(--paper);">'+esc(cur.city)+' \u00b7 '+esc(cur.venue)+'</div>'
      +'<div style="color:var(--muted);">'+cur.date+' \u00b7 '+z.tier+' \u2014 '+esc(z.name[lang])+' \u00b7 <span style="color:var(--hot);">\u25c8'+z.price+'</span></div></div>'
      +'<label style="display:block;margin-top:18px;font-family:var(--mono);font-size:11px;font-weight:700;letter-spacing:.14em;color:var(--pink);text-transform:uppercase;">'+esc(t.nameLabel)+'</label>'
      +'<input data-act="name" value="'+esc(state.name)+'" placeholder="'+esc(t.namePlaceholder)+'" style="margin-top:10px;width:100%;font-family:var(--display);font-weight:500;font-size:22px;letter-spacing:.02em;padding:13px 15px;border:1.5px solid rgba(255,134,189,.35);border-radius:10px;background:rgba(23,0,6,.55);color:var(--paper);outline:none;">'
      +'<div style="display:flex;gap:10px;margin-top:20px;flex-wrap:wrap;">'
      +'<button data-act="issue" style="flex:1;min-width:160px;font-family:var(--mono);font-weight:700;font-size:13px;letter-spacing:.12em;text-transform:uppercase;padding:14px 18px;border:0;border-radius:9px;background:'+iBg+';color:'+iFg+';cursor:'+iCur+';box-shadow:'+iSh+';">'+esc(t.issueBtn)+'</button></div></div>';
  }

  function fieldCell(label,val,color,big){
    return '<div><div style="font-family:var(--mono);font-size:9px;letter-spacing:.12em;color:var(--muted);">'+label+'</div>'
      +'<div style="font-family:var(--display);font-weight:700;font-size:'+(big||16)+'px;color:'+(color||'var(--paper)')+';'+(big?'':'text-transform:uppercase;')+'">'+val+'</div></div>';
  }
  function renderTicket(t){
    var lang=state.lang, tkt=state.ticket, s=STOPS[tkt.stopIndex], z=ZONES.filter(function(x){return x.id===tkt.zoneId;})[0];
    var tk={city:s.city[lang],venue:s.venue[lang],date:s.date,tier:z.tier,name:tkt.name,no:tkt.no,seat:tkt.seat,price:'\u25c8'+z.price};
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
      +fieldCell('\u25c8',tk.price)
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
    flow.innerHTML='<div style="max-width:640px;margin:0 auto;">'+stepperHTML()+body+'</div>';
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
      else if(act==='issue') el.onclick=issue;
      else if(act==='download') el.onclick=download;
      else if(act==='book') el.onclick=bookAnother;
      else if(act==='name'){ el.oninput=function(){ state.name=el.value; updateIssue(); }; el.onkeydown=function(e){ if(e.key==='Enter') issue(); }; }
    })(els[i]); }
  }

  window.DiZTicketLang=function(l){ state.lang=l; render(); };
  render();
})();
