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
    el.innerHTML='<div class="page-loader__fx" aria-hidden="true"><span class="page-loader__beam b1"></span><span class="page-loader__beam b2"></span><span class="page-loader__beam b3"></span><span class="page-loader__glow"></span></div><svg class="page-loader__word" viewBox="70 -6 620 292" fill="none" aria-hidden="true"><g transform="translate(40,70)"><g transform="skewX(-13)" stroke="#fff4f7" stroke-width="46" stroke-linecap="butt" stroke-linejoin="miter" fill="none"><path class="page-loader__draw" pathLength="1" d="M104 194 L104 0 C224 0 258 58 258 97 C258 136 224 194 104 194"></path><path class="page-loader__draw" pathLength="1" d="M300 76 L300 194" style="animation-delay:.2s"></path><path class="page-loader__draw" pathLength="1" d="M356 18 L508 18 L366 194 L520 194" style="animation-delay:.35s"></path></g><rect class="page-loader__pop" x="262" y="30" width="46" height="46" transform="rotate(45 285 53) skewX(-13)" fill="#fff4f7" style="animation-delay:.55s"></rect><g class="page-loader__pop" transform="skewX(-13) rotate(12 512 -22)" fill="#fff4f7" style="animation-delay:.68s"><rect x="470" y="-64" width="84" height="84" rx="16" fill="none" stroke="#fff4f7" stroke-width="11"></rect><circle cx="491" cy="-43" r="8"></circle><circle cx="533" cy="-43" r="8"></circle><circle cx="512" cy="-22" r="8"></circle><circle cx="491" cy="-1" r="8"></circle><circle cx="533" cy="-1" r="8"></circle></g></g></svg><div class="page-loader__gate"><b>请复制链接，用浏览器打开</b><span>Copy the link &amp; open it in your browser</span></div>';
    return el;
  }
  var curtain=makeCurtain();
  document.body.prepend(curtain);
  if(arrival){
    curtain.style.transform="translate3d(0,-8%,0)";
    requestAnimationFrame(function(){requestAnimationFrame(function(){curtain.style.transform="";curtain.classList.add("is-revealing");});});
    window.setTimeout(function(){curtain.className="page-curtain";},reduce?220:540);
  }else{
    var loader=makeLoader();
    document.body.prepend(loader);
    window.setTimeout(function(){loader.classList.add("is-leaving");window.setTimeout(function(){loader.remove();},reduce?170:620);},reduce?80:1500);
  }

  // Utsugi's floating cheer button is shared by every non-LIVE page. Each
  // deliberate tap advances through the three supplied sound layers; a pause
  // resets the sequence so the next interaction starts from the core again.
  (function initCheerSounds(){
    var cheer=document.getElementById("cheer");
    var originalWave=window.wave;
    if(!cheer||typeof originalWave!=="function")return;

    var sources=[
      "assets/audio/grape-nectar/main-core.wav",
      "assets/audio/grape-nectar/bubble-grain.wav",
      "assets/audio/grape-nectar/violet-pad.wav"
    ];
    var volumes=[.68,.8,.92];
    var sounds=null;
    var activeSound=null;
    var soundStep=0;
    var lastTap=0;
    var resetTimer=0;

    function ensureSounds(){
      if(sounds)return sounds;
      sounds=sources.map(function(src,index){
        var audio=new Audio(src);
        audio.preload="auto";
        audio.volume=volumes[index];
        return audio;
      });
      return sounds;
    }

    function playCheerSound(){
      var now=Date.now();
      if(now-lastTap>2400)soundStep=0;
      lastTap=now;

      var audio=ensureSounds()[soundStep];
      if(activeSound&&activeSound!==audio){
        activeSound.pause();
        activeSound.currentTime=0;
      }
      audio.pause();
      audio.currentTime=0;
      activeSound=audio;
      var promise=audio.play();
      if(promise&&typeof promise.catch==="function")promise.catch(function(){});

      cheer.dataset.soundLayer=String(soundStep+1);
      soundStep=(soundStep+1)%sources.length;
      window.clearTimeout(resetTimer);
      resetTimer=window.setTimeout(function(){
        soundStep=0;
        cheer.removeAttribute("data-sound-layer");
      },2400);
    }

    window.wave=function(){
      playCheerSound();
      return originalWave.apply(this,arguments);
    };

    // Native buttons emit a detail=0 click for keyboard and assistive-tech
    // activation; pointer taps are already handled by the drag-aware code.
    cheer.addEventListener("click",function(event){
      if(event.detail===0)window.wave();
    });
    document.addEventListener("visibilitychange",function(){
      if(!document.hidden||!activeSound)return;
      activeSound.pause();
      activeSound.currentTime=0;
      activeSound=null;
    });
    window.addEventListener("load",ensureSounds,{once:true});
  })();

  document.addEventListener("click",function(event){
    var link=event.target.closest("a[href]");
    if(!link||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    var url;
    try{url=new URL(link.href,window.location.href);}catch(error){return;}
    if(url.origin!==window.location.origin||url.pathname===window.location.pathname||link.target==="_blank"||link.hasAttribute("download")||url.protocol==="mailto:"||url.protocol==="tel:")return;
    event.preventDefault();
    document.body.classList.remove("menu-open");
    curtain.className="page-curtain";curtain.style.transform="";curtain.getBoundingClientRect();curtain.classList.add("is-covering");
    window.setTimeout(function(){try{sessionStorage.setItem("diz-curtain-arrival","1");}catch(error){}window.location.href=url.href;},reduce?190:450);
  });
  window.addEventListener("pageshow",function(event){if(event.persisted){curtain.className="page-curtain";curtain.style.transform="";}});
})();
