(function(){
  "use strict";
  var reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var curtain=document.createElement("div");
  curtain.className="page-curtain";
  curtain.setAttribute("aria-hidden","true");
  var status=document.createElement("p");
  status.className="page-curtain__status";
  "LOADING".split("").forEach(function(letter,index){
    var span=document.createElement("span");
    span.className="page-curtain__char";
    span.textContent=letter;
    span.style.transitionDelay=(index*55)+"ms";
    status.appendChild(span);
  });
  curtain.appendChild(status);
  document.body.prepend(curtain);
  var chars=Array.prototype.slice.call(status.children);
  requestAnimationFrame(function(){chars.forEach(function(char){char.classList.add("is-lit");});});
  var revealed=false;
  function reveal(){
    if(revealed)return;
    revealed=true;
    window.setTimeout(function(){
      curtain.classList.add("is-clear");
      window.setTimeout(function(){curtain.className="page-curtain is-ready";},reduce?200:760);
    },reduce?0:430);
  }
  if(document.readyState==="complete")reveal();
  else window.addEventListener("load",reveal,{once:true});
  window.setTimeout(reveal,2200);
  document.addEventListener("click",function(event){
    var link=event.target.closest("a[href]");
    if(!link||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    var url;
    try{url=new URL(link.href,window.location.href);}catch(error){return;}
    if(url.origin!==window.location.origin||url.pathname===window.location.pathname||link.target==="_blank"||link.hasAttribute("download")||url.protocol==="mailto:"||url.protocol==="tel:")return;
    event.preventDefault();
    document.body.classList.remove("menu-open");
    curtain.className="page-curtain is-ready";
    curtain.getBoundingClientRect();
    curtain.classList.add("is-covering");
    window.setTimeout(function(){window.location.href=url.href;},reduce?190:600);
  });
  window.addEventListener("pageshow",function(event){if(event.persisted){revealed=false;reveal();}});
})();
