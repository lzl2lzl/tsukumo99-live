(function(){
  "use strict";

  var app=document.getElementById("liveApp");
  var modeGate=document.getElementById("modeGate");
  var gateNote=document.getElementById("gateNote");
  var modeLabel=document.getElementById("modeLabel");
  var soundButton=document.getElementById("soundButton");
  var viewButton=document.getElementById("viewButton");
  var readoutKicker=document.getElementById("readoutKicker");
  var readoutTitle=document.getElementById("readoutTitle");
  var readoutBody=document.getElementById("readoutBody");
  var finaleButton=document.getElementById("finaleButton");
  var burstField=document.getElementById("burstField");
  var endGate=document.getElementById("endGate");
  var endKicker=document.getElementById("endKicker");
  var endTitle=document.getElementById("endTitle");
  var endBody=document.getElementById("endBody");
  var encoreButton=document.getElementById("encoreButton");
  var switchModeButton=document.getElementById("switchModeButton");
  var audioStatus=document.getElementById("audioStatus");
  var pads=Array.prototype.slice.call(document.querySelectorAll(".stage-pad"));
  var stateMarks=Array.prototype.slice.call(document.querySelectorAll("[data-state]"));
  var reduceMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var audioFiles={
    bubble:"assets/audio/grape-nectar/bubble-grain.wav",
    violet:"assets/audio/grape-nectar/violet-pad.wav",
    core:"assets/audio/grape-nectar/main-core.wav",
    full:"assets/audio/grape-nectar/full.wav"
  };
  var audioContext=null;
  var masterGain=null;
  var audioBuffers={};
  var fallbackAudio={};
  var loadingPromise=null;
  var soundOn=true;
  var mode="live";
  var required={bubble:false,violet:false,core:false};
  var timers=[];
  var running=false;

  Object.keys(audioFiles).forEach(function(name){
    var audio=new Audio(audioFiles[name]);
    audio.preload="auto";
    fallbackAudio[name]=audio;
  });

  function queue(fn,delay){
    var timer=window.setTimeout(fn,delay);
    timers.push(timer);
    return timer;
  }

  function clearTimers(){
    timers.forEach(window.clearTimeout);
    timers=[];
  }

  function showAudioStatus(message){
    audioStatus.textContent=message;
    audioStatus.classList.add("show");
    queue(function(){audioStatus.classList.remove("show");},2600);
  }

  function setSound(on){
    soundOn=on;
    soundButton.textContent=on?"SOUND ON":"SOUND OFF";
    soundButton.setAttribute("aria-pressed",String(on));
    if(masterGain){masterGain.gain.setTargetAtTime(on ? .78 : 0,audioContext.currentTime,.025)}
    Object.keys(fallbackAudio).forEach(function(key){fallbackAudio[key].muted=!on});
  }

  function createAudioContext(){
    if(audioContext)return audioContext;
    var Context=window.AudioContext||window.webkitAudioContext;
    if(!Context)return null;
    audioContext=new Context();
    masterGain=audioContext.createGain();
    masterGain.gain.value=soundOn ? .78 : 0;
    masterGain.connect(audioContext.destination);
    return audioContext;
  }

  function loadAudio(){
    if(loadingPromise)return loadingPromise;
    var context=createAudioContext();
    if(!context){
      loadingPromise=Promise.resolve(false);
      return loadingPromise;
    }
    context.resume();
    loadingPromise=Promise.all(Object.keys(audioFiles).map(function(name){
      return fetch(audioFiles[name]).then(function(response){
        if(!response.ok)throw new Error("Audio fetch failed");
        return response.arrayBuffer();
      }).then(function(data){
        return context.decodeAudioData(data);
      }).then(function(buffer){
        audioBuffers[name]=buffer;
      });
    })).then(function(){return true}).catch(function(){
      showAudioStatus("音频解码失败，视觉 Demo 仍可继续");
      return false;
    });
    return loadingPromise;
  }

  function playSound(name){
    if(!soundOn)return;
    if(audioContext&&audioBuffers[name]){
      if(audioContext.state==="suspended")audioContext.resume();
      var source=audioContext.createBufferSource();
      source.buffer=audioBuffers[name];
      source.connect(masterGain);
      source.start(0);
      return;
    }
    var audio=fallbackAudio[name];
    if(audio){
      try{audio.currentTime=0;audio.play().catch(function(){})}catch(error){}
    }
  }

  function updateReadout(kicker,title,body){
    readoutKicker.textContent=kicker;
    readoutTitle.textContent=title;
    readoutBody.textContent=body;
  }

  function hitPad(effect){
    var pad=document.querySelector('[data-effect="'+effect+'"]');
    if(!pad)return;
    pad.classList.remove("hit");
    pad.getBoundingClientRect();
    pad.classList.add("hit");
    queue(function(){pad.classList.remove("hit")},240);
  }

  function vibrate(pattern){
    if(mode==="live"&&navigator.vibrate)navigator.vibrate(pattern);
  }

  function spawnParticles(count){
    if(reduceMotion)return;
    for(var i=0;i<count;i++){
      var particle=document.createElement("span");
      particle.className="particle";
      particle.style.left=(12+Math.random()*76)+"%";
      particle.style.bottom=(-3+Math.random()*18)+"%";
      particle.style.setProperty("--drift",(-80+Math.random()*160)+"px");
      particle.style.animationDelay=(Math.random()*.25)+"s";
      burstField.appendChild(particle);
      queue((function(node){return function(){node.remove()}})(particle),2200);
    }
  }

  function markRequired(effect){
    if(!Object.prototype.hasOwnProperty.call(required,effect))return;
    required[effect]=true;
    stateMarks.forEach(function(mark){
      if(mark.dataset.state===effect)mark.classList.add("on");
    });
    var pad=document.querySelector('[data-effect="'+effect+'"]');
    if(pad)pad.classList.add("done");
    if(required.bubble&&required.violet&&required.core){
      finaleButton.disabled=false;
      finaleButton.setAttribute("aria-hidden","false");
      finaleButton.classList.add("ready");
      updateReadout("ALL EFFECTS READY","OPEN THE STAGE","点击中央骰子，开启最终演出");
    }
  }

  function temporaryClass(name,duration){
    app.classList.remove(name);
    app.getBoundingClientRect();
    app.classList.add(name);
    queue(function(){app.classList.remove(name)},duration);
  }

  function triggerEffect(effect){
    if(!running)return;
    hitPad(effect);
    if(effect==="beam"){
      temporaryClass("fx-beam",1350);
      updateReadout("LIGHTING CONTROL","BEAM ONLINE","聚光灯已经接入现场");
      vibrate(18);
      return;
    }
    if(effect==="cheer"){
      temporaryClass("fx-cheer",1200);
      spawnParticles(14);
      updateReadout("AUDIENCE SIGNAL","CHEER RECEIVED","应援灯海正在扩散");
      vibrate([18,28,18]);
      return;
    }
    if(effect==="bubble"){
      spawnParticles(22);
      temporaryClass("fx-bubble",1700);
      updateReadout("STAGE EFFECT","BUBBLE GRAIN","粒子效果已点亮");
    }
    if(effect==="violet"){
      temporaryClass("fx-violet",1900);
      updateReadout("STAGE EFFECT","VIOLET PAD","紫色扫光已点亮");
    }
    if(effect==="core"){
      temporaryClass("fx-core",1850);
      updateReadout("SPECIAL CUT-IN","CORE SIGNAL","核心信号已经接入");
    }
    playSound(effect);
    markRequired(effect);
    vibrate(24);
  }

  function resetStage(){
    clearTimers();
    running=true;
    required={bubble:false,violet:false,core:false};
    app.className="live-shell";
    pads.forEach(function(pad){pad.classList.remove("done","hit");pad.disabled=false});
    stateMarks.forEach(function(mark){mark.classList.remove("on")});
    finaleButton.classList.remove("ready");
    finaleButton.disabled=true;
    finaleButton.setAttribute("aria-hidden","true");
    endGate.hidden=true;
    burstField.innerHTML="";
    updateReadout("SYSTEM READY","TOUCH THE STAGE","点亮三个核心效果，开启最终演出");
  }

  function showEnd(){
    running=false;
    app.classList.remove("finale-running");
    endKicker.textContent=mode==="archive"?"DIGEST ENDED":"LIVE COMPLETE";
    endTitle.innerHTML=mode==="archive"?"ARCHIVE<br>ENDED":"STAGE<br>OPENED";
    endBody.textContent=mode==="archive"?"本场公演片段播放完毕":"今晚的舞台效果已全部点亮";
    switchModeButton.textContent=mode==="archive"?"ENTER LIVE":"WATCH DIGEST";
    endGate.hidden=false;
  }

  function runFinale(){
    if(!running)return;
    running=false;
    pads.forEach(function(pad){pad.disabled=true});
    finaleButton.classList.remove("ready");
    finaleButton.disabled=true;
    app.classList.add("finale-running");
    spawnParticles(42);
    updateReadout("FINAL STAGE","FULL SIGNAL","所有舞台效果已接入");
    playSound("full");
    vibrate([24,40,24,40,48]);
    queue(showEnd,4250);
  }

  function startLive(){
    mode="live";
    resetStage();
    modeLabel.textContent="LIVE ATTENDANCE";
    updateReadout("SYSTEM READY","TOUCH THE STAGE","点亮 BUBBLE、VIOLET 和 CORE");
  }

  function startArchive(){
    mode="archive";
    resetStage();
    modeLabel.textContent="LIVE DIGEST / AUTO";
    pads.forEach(function(pad){pad.disabled=true});
    updateReadout("ARCHIVE PLAYBACK","STANDBY","公演片段即将开始");
    queue(function(){triggerEffect("beam")},450);
    queue(function(){triggerEffect("bubble")},1450);
    queue(function(){triggerEffect("violet")},3650);
    queue(function(){triggerEffect("core")},5850);
    queue(function(){triggerEffect("cheer")},6900);
    queue(runFinale,7850);
  }

  function begin(selectedMode){
    modeGate.classList.add("loading");
    gateNote.textContent="正在载入现场音效...";
    setSound(true);
    loadAudio().then(function(){
      modeGate.hidden=true;
      modeGate.classList.remove("loading");
      gateNote.textContent="点击后开启声音，建议佩戴耳机";
      if(selectedMode==="archive")startArchive();else startLive();
    });
  }

  document.querySelectorAll("[data-mode]").forEach(function(button){
    button.addEventListener("click",function(){begin(button.dataset.mode)});
  });

  pads.forEach(function(pad){
    pad.addEventListener("pointerdown",function(event){
      event.preventDefault();
      if(mode==="live")triggerEffect(pad.dataset.effect);
    });
  });

  finaleButton.addEventListener("click",runFinale);
  encoreButton.addEventListener("click",function(){if(mode==="archive")startArchive();else startLive()});
  switchModeButton.addEventListener("click",function(){if(mode==="archive")startLive();else startArchive()});
  soundButton.addEventListener("click",function(){setSound(!soundOn);showAudioStatus(soundOn?"声音已开启":"声音已关闭")});

  viewButton.addEventListener("click",function(){
    if(document.fullscreenElement){
      document.exitFullscreen().catch(function(){});
      return;
    }
    if(document.documentElement.requestFullscreen){
      document.documentElement.requestFullscreen().catch(function(){showAudioStatus("当前浏览器不支持网页全屏")});
    }else{
      showAudioStatus("当前浏览器不支持网页全屏");
    }
  });

  document.addEventListener("fullscreenchange",function(){
    viewButton.textContent=document.fullscreenElement?"EXIT VIEW":"FULL VIEW";
  });

  document.addEventListener("keydown",function(event){
    if(!modeGate.hidden||!endGate.hidden||mode!=="live")return;
    var key=event.key.toLowerCase();
    var map={"1":"beam","a":"beam","2":"bubble","s":"bubble","3":"core","d":"core","4":"violet","j":"violet","5":"cheer","k":"cheer"};
    if(map[key]){event.preventDefault();triggerEffect(map[key])}
    if(key==="enter"&&!finaleButton.disabled){event.preventDefault();runFinale()}
  });

  document.addEventListener("visibilitychange",function(){
    if(!audioContext)return;
    if(document.hidden)audioContext.suspend();
    else if(soundOn)audioContext.resume();
  });

  setSound(true);
})();
