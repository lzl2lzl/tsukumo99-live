/* TSUKUMO99 · DiŹ — Shop + cart + mock checkout (offline, vanilla).
   One product (the album) for now; cart persists in localStorage; checkout is a
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
  var PRODUCTS={}; PRODUCTS[PRODUCT.id]=PRODUCT;
  function prod(id){return PRODUCTS[id];}

  var T={
    cn:{kicker:"官方周边 · 限定发售",shopTitle:"商店",limited:"限定 / LIMITED",addCart:"加入购物车",buyNow:"立即购买",
        tracklist:"曲目",format:"规格",ships:"全球配送 · 模拟",
        cart:"购物车",cartEmpty:"购物车是空的",continueShop:"继续购物",qty:"数量",remove:"移除",
        subtotal:"小计",checkout:"去结算",note:"商品、库存与配送均为虚构占位，仅用于演示下单流程。",
        coTitle:"结算",backShop:"← 返回商店",order:"订单",ship:"收货信息",name:"收货人姓名",
        phone:"手机号（选填）",address:"收货地址（选填）",pay:"支付方式",mockPay:"模拟银行卡 · 可留空",
        card:"卡号",exp:"有效期",cvv:"CVV",total:"合计",freeShip:"包邮",payNow:"立即支付",paying:"支付中…",
        mockNote:"纯前端模拟：不会发生真实支付，也不会上传或收集任何信息。",
        okTitle:"支付成功",orderNo:"订单号",receiver:"收货人",amount:"实付",
        thanks:"感谢支持 · 这是一次模拟下单",backShop2:"返回商店",needName:"请填写收货人姓名",
        namePH:"将印在订单上的名字",phonePH:"仅本地演示，可留空",addrPH:"仅本地演示，可留空",cardPH:"0000 0000 0000 0000"},
    jp:{kicker:"公式グッズ · 数量限定",shopTitle:"ショップ",limited:"限定 / LIMITED",addCart:"カートに入れる",buyNow:"今すぐ購入",
        tracklist:"収録曲",format:"仕様",ships:"世界配送 · シミュレーション",
        cart:"カート",cartEmpty:"カートは空です",continueShop:"買い物を続ける",qty:"数量",remove:"削除",
        subtotal:"小計",checkout:"レジへ進む",note:"商品・在庫・配送はすべて架空のプレースホルダーで、購入フローのデモ用です。",
        coTitle:"お会計",backShop:"← ショップに戻る",order:"注文",ship:"お届け先",name:"お名前",
        phone:"電話番号（任意）",address:"住所（任意）",pay:"お支払い方法",mockPay:"ダミーカード · 空欄可",
        card:"カード番号",exp:"有効期限",cvv:"CVV",total:"合計",freeShip:"送料無料",payNow:"支払う",paying:"処理中…",
        mockNote:"フロントエンドのみのシミュレーション：実際の決済も情報収集も行いません。",
        okTitle:"支払い完了",orderNo:"注文番号",receiver:"お届け先",amount:"支払額",
        thanks:"ご支援ありがとうございます · これはシミュレーションです",backShop2:"ショップへ戻る",needName:"お名前を入力してください",
        namePH:"注文に印字される名前",phonePH:"ローカルデモのみ · 空欄可",addrPH:"ローカルデモのみ · 空欄可",cardPH:"0000 0000 0000 0000"},
    en:{kicker:"OFFICIAL GOODS · LIMITED DROP",shopTitle:"SHOP",limited:"LIMITED",addCart:"ADD TO CART",buyNow:"BUY NOW",
        tracklist:"TRACKLIST",format:"FORMAT",ships:"WORLDWIDE · SIMULATED",
        cart:"CART",cartEmpty:"Your cart is empty",continueShop:"Continue shopping",qty:"QTY",remove:"Remove",
        subtotal:"Subtotal",checkout:"Checkout",note:"Product, stock and shipping are fictional placeholders — a demo of the ordering flow only.",
        coTitle:"CHECKOUT",backShop:"← Back to shop",order:"Order",ship:"Shipping",name:"Recipient name",
        phone:"Phone (optional)",address:"Address (optional)",pay:"Payment",mockPay:"Dummy card · may be left blank",
        card:"Card number",exp:"Expiry",cvv:"CVV",total:"Total",freeShip:"Free",payNow:"Pay now",paying:"Processing…",
        mockNote:"Front-end simulation only: no real payment, nothing uploaded or collected.",
        okTitle:"Payment complete",orderNo:"Order",receiver:"Recipient",amount:"Paid",
        thanks:"Thanks for the support · this was a simulated order",backShop2:"Back to shop",needName:"Please enter a recipient name",
        namePH:"Name to print on the order",phonePH:"Local demo only · optional",addrPH:"Local demo only · optional",cardPH:"0000 0000 0000 0000"}
  };

  /* ---------------- state ---------------- */
  var LANG=(window.DiZLang||"cn"); if(!T[LANG])LANG="cn";
  var pQty=1;                                   // product qty on detail page
  var curProdId=PRODUCT.id;                     // product shown on the detail page
  var form={name:"",phone:"",address:"",card:"",exp:"",cvv:""};
  var order=null;                               // set after mock payment

  /* ---------------- cart (localStorage) ---------------- */
  function getCart(){try{return JSON.parse(localStorage.getItem("dizCart")||"[]");}catch(e){return [];}}
  function saveCart(c){try{localStorage.setItem("dizCart",JSON.stringify(c));}catch(e){} updateBadge();}
  function cartCount(){return getCart().reduce(function(s,i){return s+i.qty;},0);}
  function subtotal(){return getCart().reduce(function(s,i){return s+i.qty*prod(i.id).price;},0);}
  function addToCart(id,n){var c=getCart(),it=null;c.forEach(function(x){if(x.id===id)it=x;});
    if(it)it.qty+=n;else c.push({id:id,qty:n});saveCart(c);}
  function setQty(id,q){var c=getCart();c=c.map(function(x){return x.id===id?{id:id,qty:q}:x;}).filter(function(x){return x.qty>0;});saveCart(c);}

  function updateBadge(){var b=byId("cartCount");if(!b)return;var n=cartCount();b.textContent=n;b.style.display=n>0?"grid":"none";}

  /* ---------------- overview / listing page ---------------- */
  function renderOverview(){
    var app=byId("shopApp"); if(!app) return;
    var t=T[LANG];
    var cards=Object.keys(PRODUCTS).map(function(id){var p=PRODUCTS[id];
      return '<a class="prod-card" href="product.html?id='+id+'">'
        +'<div class="pc-cover"><img src="'+p.cover+'" alt="'+p.title+'" /><span class="pc-badge">'+t.limited+'</span></div>'
        +'<div class="pc-cat">'+esc(p.cat[LANG])+'</div>'
        +'<div class="pc-title">'+p.title+'</div>'
        +'<div class="pc-price">'+money(p.price)+'</div></a>';}).join("");
    app.innerHTML=
      '<div class="shop-head"><p class="shop-ey"><b>DiŹ</b>'+t.kicker+'</p><h1 class="shop-h1">'+t.shopTitle+'</h1></div>'
      +'<div class="prod-grid">'+cards+'</div>'
      +'<p class="shop-note">'+esc(t.note)+'</p>';
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
      +'</section>'
      +'<p class="shop-note">'+esc(t.note)+'</p>';
  }

  function renderCart(){
    var d=byId("cartDrawer"); if(!d) return;
    var t=T[LANG], c=getCart();
    var items;
    if(!c.length){
      items='<div class="cart-empty">'+t.cartEmpty+'</div>';
    } else {
      items='<div class="cart-items">'+c.map(function(i){var p=prod(i.id);
        return '<div class="cart-item">'
          +'<img class="ci-cover" src="'+p.cover+'" alt="" />'
          +'<div class="ci-mid"><div class="ci-title">'+p.title+'</div>'
            +'<div class="ci-price">'+money(p.price)+'</div>'
            +'<div class="qtybox sm">'
              +'<button data-act="cdec" data-id="'+p.id+'" aria-label="-">−</button>'
              +'<span>'+i.qty+'</span>'
              +'<button data-act="cinc" data-id="'+p.id+'" aria-label="+">+</button>'
            +'</div>'
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
        +'<div class="col-p">'+money(p.price*i.qty)+'</div></div>';}).join("");

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
          +'<div class="co-sec-h">'+t.pay+'<em>'+t.mockPay+'</em></div>'
          +field("card",t.card,form.card,t.cardPH)
          +'<div class="co-two">'+field("exp",t.exp,form.exp,"MM/YY")+field("cvv",t.cvv,form.cvv,"000")+'</div>'
          +'<p class="co-mock">'+esc(t.mockNote)+'</p>'
          +'<button class="btn-pay" data-act="pay">'+t.payNow+' · '+money(subtotal())+'</button>'
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
      +'<p class="ok-thanks">'+t.thanks+'</p>'
      +'<a class="btn-primary" href="shop.html">'+t.backShop2+'</a>'
      +'</div>';
  }
  function pay(){
    var t=T[LANG];
    if(!form.name.trim()){ var e=byId("coErr"); if(e)e.textContent=t.needName; return; }
    var btn=document.querySelector('[data-act="pay"]');
    if(btn){btn.disabled=true;btn.textContent=t.paying;}
    var amount=subtotal();
    var rnd=Math.floor(Math.random()*1e6).toString().padStart(6,"0");
    setTimeout(function(){
      order={no:"DIZ-"+new Date().getFullYear()+"-"+rnd, name:form.name.trim(), amount:amount};
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
