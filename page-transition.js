(function(){
  "use strict";
  var reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var arrival=false;
  try{arrival=sessionStorage.getItem("diz-curtain-arrival")==="1";sessionStorage.removeItem("diz-curtain-arrival");}catch(error){}
  function makeCurtain(){
    var el=document.createElement("div");
    el.className="page-curtain";
    el.setAttribute("aria-hidden","true");
    el.innerHTML='<svg class="page-curtain__wave" viewBox="0 0 100 20" preserveAspectRatio="none"><path d="M0 20 L0 12 Q 12.5 -2 25 8 T 50 8 T 75 8 T 100 8 L100 20 Z" fill="#ec0050"></path></svg><div class="page-curtain__body"></div>';
    return el;
  }
  function makeLoader(){
    var el=document.createElement("div");
    el.className="page-loader";
    el.setAttribute("aria-hidden","true");
    el.innerHTML='<div class="page-loader__meta">TSUKUMO99 · UNOFFICIAL FANWEB</div><svg class="page-loader__word" viewBox="0 0 700 320" fill="none" aria-hidden="true"><g transform="skewX(-13)" stroke="#fff4f7" stroke-width="46" stroke-linecap="butt" stroke-linejoin="miter" fill="none"><path class="page-loader__draw" pathLength="1" d="M104 286 L104 92 C224 92 258 150 258 189 C258 228 224 286 104 286"></path><path class="page-loader__draw" pathLength="1" d="M300 168 L300 286" style="animation-delay:.2s"></path><path class="page-loader__draw" pathLength="1" d="M356 110 L508 110 L366 286 L520 286" style="animation-delay:.35s"></path><path class="page-loader__draw" pathLength="1" d="M452 78 L506 34" style="animation-delay:.6s"></path></g></svg><div class="page-loader__note">请用浏览器打开 · OPEN IN A BROWSER</div>';
    return el;
  }
  var curtain=makeCurtain();
  document.body.prepend(curtain);
  if(arrival){
    curtain.style.transform="translateY(-8%)";
    requestAnimationFrame(function(){requestAnimationFrame(function(){curtain.style.transform="";curtain.classList.add("is-revealing");});});
    window.setTimeout(function(){curtain.className="page-curtain";},reduce?220:460);
  }else{
    var loader=makeLoader();
    document.body.prepend(loader);
    window.setTimeout(function(){loader.classList.add("is-leaving");window.setTimeout(function(){loader.remove();},reduce?170:620);},reduce?80:1500);
  }
  document.addEventListener("click",function(event){
    var link=event.target.closest("a[href]");
    if(!link||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    var url;
    try{url=new URL(link.href,window.location.href);}catch(error){return;}
    if(url.origin!==window.location.origin||url.pathname===window.location.pathname||link.target==="_blank"||link.hasAttribute("download")||url.protocol==="mailto:"||url.protocol==="tel:")return;
    event.preventDefault();
    document.body.classList.remove("menu-open");
    curtain.className="page-curtain";curtain.style.transform="";curtain.getBoundingClientRect();curtain.classList.add("is-covering");
    window.setTimeout(function(){try{sessionStorage.setItem("diz-curtain-arrival","1");}catch(error){}window.location.href=url.href;},reduce?190:430);
  });
  window.addEventListener("pageshow",function(event){if(event.persisted){curtain.className="page-curtain";curtain.style.transform="";}});
})();
