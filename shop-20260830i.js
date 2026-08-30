/* TSUKUMO99 · DiŹ — Shop + cart + mock checkout (offline, vanilla).
   Products and unlocked LIVE rewards persist in localStorage; checkout is a
   pure front-end simulation — no real payment, no data leaves the browser. */
(function(){
  "use strict";
  var byId=function(id){return document.getElementById(id);};
  var money=function(n){return "◈"+n;};   // ◈ fictional currency

  /* ---------------- data ---------------- */
  var PRODUCT={
    id:"diz-album-01",
    cover:"assets/hero-desktop-square.jpg",
    price:128,
    cat:{cn:"专辑 · CD",jp:"アルバム · CD",en:"ALBUM · CD"},
    title:"ONCE AND FOR ALL",
    sub:{cn:"DiŹ 首张世界巡演纪念专辑",jp:"DiŹ 初のワールドツアー記念アルバム",en:"DiŹ First World Tour Album"},
    desc:{cn:"收录 2026 世界巡演同名主打及全部现场向曲目，附赠随机成员纪念卡与限定挂牌。",
          jp:"2026 ワールドツアーのタイトル曲とライブ楽曲を全収録。ランダム封入のメンバーカードと限定ラミネート付き。",
          en:"The 2026 World Tour title track plus every live cut, with a random member card and a limited laminate pass."},
    format:{cn:"限定盤 · CD + 纪念卡 + 挂牌",jp:"限定盤 · CD + カード + ラミネート",en:"Limited edition · CD + card + laminate"},
    tracks:["NEW SENSATION","BREAK THE LIMITATION","FIRE","WHAT YOU WANT","IMPERIAL CHAIN","NEVER LOSE MY RULE","ZONE OF OVERLAP","LOOK AT","POISONOUS GANGSTER"]
  };
  var PRODUCTS={};
  PRODUCTS[PRODUCT.id]=PRODUCT;
  function prod(id){return PRODUCTS[id];}

  var T={
    cn:{kicker:"GOODS · 限定发售",shopTitle:"周边",limited:"限定 / LIMITED",addCart:"加入购物车",buyNow:"立即购买",
        tracklist:"曲目",format:"规格",ships:"全球配送",
        cart:"购物车",cartEmpty:"购物车是空的",continueShop:"继续购物",qty:"数量",remove:"移除",
        subtotal:"小计",checkout:"去结算",
        coTitle:"结算",backShop:"← 返回商店",order:"订单",ship:"收货信息",name:"收货人姓名",
        phone:"手机号（选填）",address:"收货地址（选填）",pay:"支付方式",
        card:"卡号",exp:"有效期",cvv:"CVV",total:"合计",freeShip:"包邮",payNow:"立即支付",paying:"支付中…",
        okTitle:"支付成功",orderNo:"订单号",receiver:"收货人",amount:"实付",reward:"已解锁特典",invoice:"下载发票",invoiceTitle:"INVOICE",invoiceDate:"开具日期",invoiceItems:"商品",invoiceQty:"数量",invoiceTotal:"合计",
        backShop2:"返回商店",needName:"请填写虚构的收货人姓名",
        namePH:"输入将印在收据上的名字",phonePH:"仅供娱乐，请勿填写真实信息",addrPH:"仅供娱乐，请勿填写真实信息",cardPH:"0000 0000 0000 0000"},
    jp:{kicker:"数量限定",shopTitle:"GOODS",limited:"限定",addCart:"カートに入れる",buyNow:"今すぐ購入",
        tracklist:"収録曲",format:"仕様",ships:"世界配送",
        cart:"カート",cartEmpty:"カートは空です",continueShop:"買い物を続ける",qty:"数量",remove:"削除",
        subtotal:"小計",checkout:"レジへ進む",
        coTitle:"お会計",backShop:"← ショップに戻る",order:"注文",ship:"お届け先",name:"お名前",
        phone:"電話番号（任意）",address:"住所（任意）",pay:"お支払い方法",
        card:"カード番号",exp:"有効期限",cvv:"CVV",total:"合計",freeShip:"送料無料",payNow:"支払う",paying:"処理中…",
        okTitle:"支払い完了",orderNo:"注文番号",receiver:"お届け先",amount:"支払額",reward:"アンロック特典",invoice:"請求書をダウンロード",invoiceTitle:"INVOICE",invoiceDate:"発行日",invoiceItems:"商品",invoiceQty:"数量",invoiceTotal:"合計",
        backShop2:"ショップへ戻る",needName:"架空のお名前を入力してください",
        namePH:"領収書に印字する名前",phonePH:"娯楽用です。実際の個人情報は入力しないでください",addrPH:"娯楽用です。実際の個人情報は入力しないでください",cardPH:"0000 0000 0000 0000"},
    en:{kicker:"LIMITED DROP",shopTitle:"GOODS",limited:"LIMITED",addCart:"ADD TO CART",buyNow:"BUY NOW",
        tracklist:"TRACKLIST",format:"FORMAT",ships:"WORLDWIDE SHIPPING",
        cart:"CART",cartEmpty:"Your cart is empty",continueShop:"Continue shopping",qty:"QTY",remove:"Remove",
        subtotal:"Subtotal",checkout:"Checkout",
        coTitle:"CHECKOUT",backShop:"← Back to shop",order:"Order",ship:"Shipping",name:"Recipient name",
        phone:"Phone (optional)",address:"Address (optional)",pay:"Payment",
        card:"Card number",exp:"Expiry",cvv:"CVV",total:"Total",freeShip:"Free",payNow:"Pay now",paying:"Processing…",
        okTitle:"Payment complete",orderNo:"Order",receiver:"Recipient",amount:"Paid",reward:"UNLOCKED REWARD",invoice:"Download invoice",invoiceTitle:"INVOICE",invoiceDate:"ISSUED",invoiceItems:"ITEM",invoiceQty:"QTY",invoiceTotal:"TOTAL",
        backShop2:"Back to shop",needName:"Please enter a fictional recipient name",
        namePH:"Name to print on the receipt",phonePH:"For entertainment only. Do not enter real personal information.",addrPH:"For entertainment only. Do not enter real personal information.",cardPH:"0000 0000 0000 0000"}
  };

  /* ---------------- state ---------------- */
  var LANG=(window.DiZLang||"cn"); if(!T[LANG])LANG="cn";
  var pQty=1;                                   // product qty on detail page
  var curProdId=PRODUCT.id;                     // product shown on the detail page
  var form={name:"",phone:"",address:"",card:"",exp:"",cvv:""};
  var order=null;                               // set after mock payment

  /* ---------------- cart (localStorage) ---------------- */
  function getCart(){
    try{
      var parsed=JSON.parse(localStorage.getItem("dizCart")||"[]");
      if(!Array.isArray(parsed))return [];
      return parsed.filter(function(item){return item&&prod(item.id);}).map(function(item){
        var p=prod(item.id),qty=Math.max(1,Math.floor(Number(item.qty)||1));
        return {id:item.id,qty:p.lockedQty||qty};
      });
    }catch(e){return [];}
  }
  function saveCart(c){try{localStorage.setItem("dizCart",JSON.stringify(c));}catch(e){} updateBadge();}
  function cartCount(){return getCart().reduce(function(s,i){return s+i.qty;},0);}
  function subtotal(){return getCart().reduce(function(s,i){var p=prod(i.id);return s+i.qty*p.price;},0);}
  function addToCart(id,n){var c=getCart(),it=null;c.forEach(function(x){if(x.id===id)it=x;});
    if(it)it.qty+=n;else c.push({id:id,qty:n});saveCart(c);}
  function setQty(id,q){var c=getCart(),p=prod(id);c=c.map(function(x){return x.id===id?{id:id,qty:q>0&&p&&p.lockedQty?p.lockedQty:q}:x;}).filter(function(x){return x.qty>0;});saveCart(c);}

  function updateBadge(){var b=byId("cartCount");if(!b)return;var n=cartCount();b.textContent=n;b.style.display=n>0?"grid":"none";}

  /* ---------------- overview / listing page ---------------- */
  function renderOverview(){
    var app=byId("shopApp"); if(!app) return;
    var t=T[LANG];
    var cards=Object.keys(PRODUCTS).filter(function(id){return PRODUCTS[id].listing!==false;}).map(function(id){var p=PRODUCTS[id];
      return '<a class="prod-card" href="product.html?id='+id+'">'
        +'<div class="pc-cover"><img src="'+p.cover+'" alt="'+p.title+'" /><span class="pc-badge">'+t.limited+'</span></div>'
        +'<div class="pc-cat">'+esc(p.cat[LANG])+'</div>'
        +'<div class="pc-title">'+p.title+'</div>'
        +'<div class="pc-price">'+money(p.price)+'</div></a>';}).join("");
    app.innerHTML=
      '<div class="shop-head"><p class="shop-ey"><b>DiŹ</b>'+t.kicker+'</p><h1 class="shop-h1">'+t.shopTitle+'</h1></div>'
      +'<div class="prod-grid">'+cards+'</div>';
  }

  /* ---------------- detail page ---------------- */
  function renderProduct(){
    var app=byId("productApp"); if(!app) return;
    var t=T[LANG];
    var qid=(new URLSearchParams(location.search)).get("id");
    var p=prod(qid)||PRODUCT; curProdId=p.id;
    var tracks=p.tracks.map(function(tr,i){
      return '<li><span class="tl-no">'+("0"+(i+1)).slice(-2)+'</span>'+tr+'</li>';}).join("");
    app.innerHTML=
      '<a class="prod-back" href="shop.html">'+t.backShop+'</a>'
      +'<section class="shop-hero">'
      +'<div class="cover-wrap">'
        +'<img class="cover" src="'+p.cover+'" alt="'+p.title+'" />'
        +'<span class="cover-badge">'+t.limited+'</span>'
      +'</div>'
      +'<div class="album-info">'
        +'<p class="album-kicker"><b>DiŹ</b>'+t.kicker+'</p>'
        +'<h1 class="album-title">'+p.title+'</h1>'
        +'<p class="album-sub">'+esc(p.sub[LANG])+'</p>'
        +'<div class="album-price">'+money(p.price)+'</div>'
        +'<p class="album-desc">'+esc(p.desc[LANG])+'</p>'
        +'<div class="album-format"><span>'+t.format+'</span>'+esc(p.format[LANG])+'</div>'
        +'<div class="buy-row">'
          +'<div class="qtybox" aria-label="'+t.qty+'">'
            +'<button data-act="pdec" aria-label="-">−</button>'
            +'<span id="pQtyVal">'+pQty+'</span>'
            +'<button data-act="pinc" aria-label="+">+</button>'
          +'</div>'
          +'<button class="btn-primary" data-act="add">'+t.addCart+'</button>'
          +'<button class="btn-ghost" data-act="buy">'+t.buyNow+'</button>'
        +'</div>'
        +'<div class="ship-line">◈ '+t.ships+'</div>'
      +'</div>'
      +'</section>';
  }

  function renderCart(){
    var d=byId("cartDrawer"); if(!d) return;
    var t=T[LANG], c=getCart();
    var items;
    if(!c.length){
      items='<div class="cart-empty">'+t.cartEmpty+'</div>';
    } else {
      items='<div class="cart-items">'+c.map(function(i){var p=prod(i.id),locked=!!p.lockedQty;
        return '<div class="cart-item">'
          +'<img class="ci-cover" src="'+p.cover+'" alt="" />'
          +'<div class="ci-mid"><div class="ci-title">'+p.title+'</div>'
            +(locked?'<div class="ci-reward-meta">'+esc(p.cat[LANG])+' ×'+i.qty+'</div>':'<div class="ci-price">'+money(p.price)+'</div>')
            +(locked?'':'<div class="qtybox sm">'
              +'<button data-act="cdec" data-id="'+p.id+'" aria-label="-">−</button>'
              +'<span>'+i.qty+'</span>'
              +'<button data-act="cinc" data-id="'+p.id+'" aria-label="+">+</button>'
            +'</div>')
          +'</div>'
          +'<button class="ci-remove" data-act="crm" data-id="'+p.id+'" aria-label="'+t.remove+'">✕</button>'
          +'</div>';}).join("")+'</div>';
    }
    var can=c.length>0;
    d.innerHTML=
      '<div class="cart-head"><b>'+t.cart+'</b><button data-act="cartclose" aria-label="close">✕</button></div>'
      +items
      +'<div class="cart-foot">'
        +'<div class="cart-sub"><span>'+t.subtotal+'</span><b>'+money(subtotal())+'</b></div>'
        +'<a class="btn-checkout'+(can?'':' disabled')+'" '+(can?'href="checkout.html"':'aria-disabled="true"')+'>'+t.checkout+' →</a>'
        +'<button class="btn-ghost2" data-act="cartclose">'+t.continueShop+'</button>'
      +'</div>';
  }

  function openCart(){document.body.classList.add("cart-open");}
  function closeCart(){document.body.classList.remove("cart-open");}

  /* ---------------- checkout page ---------------- */
  function renderCheckout(){
    var app=byId("checkoutApp"); if(!app) return;
    var t=T[LANG], c=getCart();

    if(order){ app.innerHTML=successHTML(t); return; }

    if(!c.length){
      app.innerHTML='<div class="co-empty"><h1>'+t.coTitle+'</h1><p>'+t.cartEmpty
        +'</p><a class="btn-primary" href="shop.html">'+t.backShop2+'</a></div>';
      return;
    }
    var rows=c.map(function(i){var p=prod(i.id);
      return '<div class="co-line"><img src="'+p.cover+'" alt="" />'
        +'<div class="col-mid"><div class="col-t">'+p.title+'</div><div class="col-q">'+esc(p.cat[LANG])+' · ×'+i.qty+'</div></div>'
        +'<div class="col-p">'+(p.lockedQty?t.reward:money(p.price*i.qty))+'</div></div>';}).join("");

    app.innerHTML=
      '<a class="co-back" href="shop.html">'+t.backShop+'</a>'
      +'<h1 class="co-title">'+t.coTitle+'</h1>'
      +'<div class="co-grid">'
        +'<section class="co-summary">'
          +'<div class="co-sec-h">'+t.order+'</div>'+rows
          +'<div class="co-tot"><div class="co-tr"><span>'+t.subtotal+'</span><span>'+money(subtotal())+'</span></div>'
          +'<div class="co-tr"><span>'+t.freeShip+'</span><span>'+money(0)+'</span></div>'
          +'<div class="co-tr grand"><span>'+t.total+'</span><b>'+money(subtotal())+'</b></div></div>'
        +'</section>'
        +'<section class="co-form">'
          +'<div class="co-sec-h">'+t.ship+'</div>'
          +field("name",t.name,form.name,t.namePH)
          +field("phone",t.phone,form.phone,t.phonePH)
          +field("address",t.address,form.address,t.addrPH)
          +'<div class="co-sec-h">'+t.pay+'</div>'
          +field("card",t.card,form.card,t.cardPH)
          +'<div class="co-two">'+field("exp",t.exp,form.exp,"MM/YY")+field("cvv",t.cvv,form.cvv,"000")+'</div>'
          +'<button class="btn-pay" data-act="pay">'+t.payNow+'</button>'
          +'<p class="co-err" id="coErr"></p>'
        +'</section>'
      +'</div>';
  }
  function field(k,label,val,ph){
    return '<label class="field"><span>'+label+'</span>'
      +'<input data-f="'+k+'" value="'+esc(val)+'" placeholder="'+esc(ph)+'" autocomplete="off" /></label>';
  }
  function successHTML(t){
    return '<div class="co-ok">'
      +'<div class="ok-badge">✓</div>'
      +'<h1>'+t.okTitle+'</h1>'
      +'<div class="ok-card">'
        +'<div class="ok-row"><span>'+t.orderNo+'</span><b>'+order.no+'</b></div>'
        +'<div class="ok-row"><span>'+t.receiver+'</span><b>'+esc(order.name)+'</b></div>'
        +'<div class="ok-row"><span>'+t.amount+'</span><b>'+money(order.amount)+'</b></div>'
      +'</div>'
      +'<div class="ok-actions"><button class="btn-primary" data-act="invoice">↓ '+t.invoice+'</button><a class="btn-primary secondary" href="shop.html">'+t.backShop2+'</a></div>'
      +'</div>';
  }

  function canvasRoundRect(g,x,y,w,h,r){
    g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath();
  }
  function fitInvoiceText(g,value,maxWidth,size,weight){
    var text=String(value),fontSize=size;
    do{g.font=(weight||700)+" "+fontSize+"px 'Oswald','Noto Sans SC','Noto Sans JP',sans-serif";if(g.measureText(text).width<=maxWidth||fontSize<=22)break;fontSize-=2;}while(fontSize>22);
    return text;
  }
  function downloadCanvas(canvas,filename){
    function clickUrl(url){var a=document.createElement("a");a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();}
    if(canvas.toBlob){canvas.toBlob(function(blob){if(!blob)return;var url=URL.createObjectURL(blob);clickUrl(url);setTimeout(function(){URL.revokeObjectURL(url);},1500);},"image/png");}
    else clickUrl(canvas.toDataURL("image/png"));
  }
  function drawInvoice(){
    if(!order)return;
    var t=T[LANG],W=1600,H=1050,c=document.createElement("canvas"),g=c.getContext("2d"),items=order.items||[];
    c.width=W;c.height=H;
    var bg=g.createLinearGradient(0,0,W,H);bg.addColorStop(0,"#3a0014");bg.addColorStop(.58,"#170006");bg.addColorStop(1,"#4c001a");g.fillStyle=bg;g.fillRect(0,0,W,H);
    g.fillStyle="rgba(236,0,80,.16)";g.beginPath();g.arc(1380,80,420,0,Math.PI*2);g.fill();
    g.strokeStyle="#ff86bd";g.lineWidth=5;canvasRoundRect(g,32,32,W-64,H-64,28);g.stroke();
    g.fillStyle="#fff4f7";g.font="700 34px 'Space Mono',monospace";g.fillText("TSUKUMO99 · DiŹ WORLD TOUR",90,112);
    g.fillStyle="#ec0050";g.font="italic 700 132px 'Oswald',sans-serif";g.fillText(t.invoiceTitle,88,260);
    g.textAlign="right";g.fillStyle="#e4afbf";g.font="700 23px 'Space Mono',monospace";g.fillText(t.orderNo+"  "+order.no,1510,128);g.fillText(t.invoiceDate+"  "+new Intl.DateTimeFormat(LANG==='jp'?'ja-JP':LANG==='en'?'en-GB':'zh-CN').format(new Date()),1510,172);g.textAlign="left";
    g.strokeStyle="rgba(255,134,189,.34)";g.lineWidth=2;g.beginPath();g.moveTo(90,315);g.lineTo(1510,315);g.stroke();
    g.fillStyle="#ff86bd";g.font="700 22px 'Space Mono',monospace";g.fillText(t.receiver,92,374);g.fillStyle="#fff4f7";g.font="700 42px 'Oswald','Noto Sans SC','Noto Sans JP',sans-serif";g.fillText(fitInvoiceText(g,order.name,650,42),92,425);
    g.fillStyle="#ff86bd";g.font="700 20px 'Space Mono',monospace";g.fillText(t.invoiceItems,92,515);g.textAlign="center";g.fillText(t.invoiceQty,1240,515);g.textAlign="right";g.fillText(t.invoiceTotal,1505,515);g.textAlign="left";
    var y=580;
    items.slice(0,5).forEach(function(item){var p=prod(item.id);if(!p)return;g.fillStyle="#fff4f7";g.fillText(fitInvoiceText(g,p.title,850,36),92,y);g.fillStyle="#e4afbf";g.font="400 20px 'Space Mono',monospace";g.fillText(p.cat[LANG],92,y+35);g.textAlign="center";g.fillStyle="#fff4f7";g.font="700 30px 'Space Mono',monospace";g.fillText(String(item.qty),1240,y+12);g.textAlign="right";g.fillText(money(p.price*item.qty),1505,y+12);g.textAlign="left";g.strokeStyle="rgba(255,134,189,.16)";g.beginPath();g.moveTo(92,y+66);g.lineTo(1505,y+66);g.stroke();y+=116;});
    g.textAlign="right";g.fillStyle="#ff86bd";g.font="700 22px 'Space Mono',monospace";g.fillText(t.invoiceTotal,1265,880);g.fillStyle="#fff4f7";g.font="700 64px 'Oswald',sans-serif";g.fillText(money(order.amount),1505,890);g.textAlign="left";
    g.fillStyle="#ec0050";g.font="700 18px 'Space Mono',monospace";g.fillText("UNOFFICIAL / FAN-MADE",92,958);
    downloadCanvas(c,order.no+"-invoice.png");
  }
  function pay(){
    var t=T[LANG];
    if(!form.name.trim()){ var e=byId("coErr"); if(e)e.textContent=t.needName; return; }
    var btn=document.querySelector('[data-act="pay"]');
    if(btn){btn.disabled=true;btn.textContent=t.paying;}
    var amount=subtotal();
    var orderItems=getCart().map(function(item){return{id:item.id,qty:item.qty};});
    var rnd=Math.floor(Math.random()*1e6).toString().padStart(6,"0");
    setTimeout(function(){
      order={no:"DIZ-"+new Date().getFullYear()+"-"+rnd, name:form.name.trim(), amount:amount,items:orderItems};
      saveCart([]);            // clear cart
      renderCheckout(); updateBadge();
      try{window.scrollTo({top:0,behavior:"smooth"});}catch(_){}
    }, 850);
  }

  /* ---------------- misc ---------------- */
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});}

  function renderAll(){ renderOverview(); renderProduct(); renderCheckout(); renderCart(); updateBadge(); }

  function setLang(l){ if(!T[l])return; LANG=l; window.DiZLang=l; renderAll();
    document.querySelectorAll("button[data-lang]").forEach(function(x){x.classList.toggle("on",x.dataset.lang===l);}); }

  /* ---------------- events (delegated) ---------------- */
  document.addEventListener("click",function(e){
    var el=e.target.closest?e.target.closest("[data-act]"):null;
    if(el){
      var act=el.getAttribute("data-act"), id=el.getAttribute("data-id");
      if(act==="pinc"){pQty++;var v=byId("pQtyVal");if(v)v.textContent=pQty;}
      else if(act==="pdec"){if(pQty>1)pQty--;var v2=byId("pQtyVal");if(v2)v2.textContent=pQty;}
      else if(act==="add"){addToCart(curProdId,pQty);pQty=1;var v3=byId("pQtyVal");if(v3)v3.textContent=1;renderCart();openCart();}
      else if(act==="buy"){addToCart(curProdId,pQty);location.href="checkout.html";}
      else if(act==="cinc"){var c=getCart(),q=0;c.forEach(function(x){if(x.id===id)q=x.qty;});setQty(id,q+1);renderCart();}
      else if(act==="cdec"){var c2=getCart(),q2=0;c2.forEach(function(x){if(x.id===id)q2=x.qty;});setQty(id,q2-1);renderCart();}
      else if(act==="crm"){setQty(id,0);renderCart();}
      else if(act==="cartclose"){closeCart();}
      else if(act==="pay"){e.preventDefault();pay();}
      else if(act==="invoice"){e.preventDefault();drawInvoice();}
      return;
    }
    if(e.target.closest && e.target.closest("#cartBtn")){
      if(byId("cartDrawer")){document.body.classList.toggle("cart-open");}
      else{location.href="shop.html";}
    }
    if(e.target.id==="cartScrim"){closeCart();}
    var lb=e.target.closest?e.target.closest("button[data-lang]"):null;
    if(lb){setLang(lb.dataset.lang);}
  });
  document.addEventListener("input",function(e){
    var f=e.target.getAttribute&&e.target.getAttribute("data-f");
    if(f){form[f]=e.target.value; if(f==="name"){var er=byId("coErr");if(er)er.textContent="";}}
  });
  document.addEventListener("keydown",function(e){ if(e.key==="Escape")closeCart(); });

  renderAll();
})();
