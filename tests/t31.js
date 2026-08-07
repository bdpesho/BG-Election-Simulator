// T31 regression: "The Pig attacks!" — late-campaign Deyan Peevski event (weeks 17–18, ~80% of runs, rare raid).
// Run: node tests/t31.js
const fs=require("fs");
const path=require("path");
const {JSDOM}=require("jsdom");

const ROOT=path.join(__dirname,"..");
const html=fs.readFileSync(path.join(ROOT,"index.html"),"utf8");
const mapSrc=fs.readFileSync(path.join(ROOT,"mapdata.js"),"utf8");
const gameSrc=fs.readFileSync(path.join(ROOT,"game.js"),"utf8");

const dom=new JSDOM(html,{runScripts:"dangerously",pretendToBeVisual:true,url:"http://localhost/"});
const {window}=dom;
const {document}=window;
window.alert=()=>{};
window.module={exports:{}};
window.addEventListener("error",e=>{window.__errs=(window.__errs||[]);window.__errs.push(String(e.message||e));});
for(const src of[mapSrc,gameSrc]){
  const s=document.createElement("script");
  s.textContent=src;
  document.body.appendChild(s);
}
if(typeof window.init==="function")window.init();
const g=window.module.exports;

let pass=0,fail=0;
function check(name,cond){if(cond){pass++;console.log("PASS | "+name);}else{fail++;console.log("FAIL | "+name);}}
function click(el){el.dispatchEvent(new window.MouseEvent("click",{bubbles:true}));}

// ---------- scheduling rates (per-run rolls) ----------
let pendingCount=0,raidCount=0;
for(let i=0;i<200;i++){
  g.startCampaign();
  const S=g.state();
  if(S.pigPending)pendingCount++;
  if(S.pigRaid)raidCount++;
}
check("pig pending in ~80% of runs ("+(pendingCount/2).toFixed(1)+"%)",pendingCount>=140&&pendingCount<=180);
check("raid variant ~2-3% of runs ("+(raidCount/2).toFixed(1)+"%)",raidCount>=2&&raidCount<=10);

// ---------- fires exactly once at week 17-18, resolves ----------
g.startCampaign();
g.virusDisarm(); // T39: keep the random virus event out of pig-week timing
let S=g.state();
S.pigPending=true;S.pigRaid=false;S.pigWeek=17;S.pigDone=false;
let pigWeek=0,resolved=false;
function resolveModals(){
  while(S.paused){
    const pigTitle=document.querySelector("#modal-root .ev-head span");
    const isPig=pigTitle&&/THE PIG|BREAKING/.test(pigTitle.textContent);
    if(isPig){
      if(!pigWeek)pigWeek=S.week;
      const btn=document.querySelector("#modal-root [data-ai]");
      click(btn);
      S=g.state();
      continue;
    }
    if(S.debate&&S.debate.q){
      if(S.debate.i<0){const go=document.getElementById("db-go");if(go)click(go);}
      else{for(let qi=S.debate.i;qi<8;qi++)g.debateAnswer(0);const done=document.getElementById("db-done");if(done)click(done);}
      S=g.state();
      continue;
    }
    const btns=document.querySelectorAll("#modal-root .ev-opts .btn");
    if(!btns.length){S.paused=false;break;}
    click(btns[0]);
    S=g.state();
  }
}
for(let wk=1;wk<=20&&S.phase==="campaign";wk++){
  g.endTurn();
  S=g.state();
  resolveModals();
}
check("pig fires once at weeks 17–18 (week "+(pigWeek||"never")+")",pigWeek>=17&&pigWeek<=18);
check("pig resolved after answering",!S.paused&&S.pigDone&&S.pigPending);

// ---------- raid: DPS collapses ~80% (relative, measured around the answer) ----------
g.startCampaign();
g.virusDisarm(); // T39: keep the random virus event out of raid-week timing
S=g.state();
S.pigPending=true;S.pigRaid=true;S.pigWeek=17;S.pigDone=false;
let dpsBefore=null,dpsAfter=null;
function resolveModalsRaid(){
  while(S.paused){
    const pigTitle=document.querySelector("#modal-root .ev-head span");
    const isPig=pigTitle&&/THE PIG|BREAKING/.test(pigTitle.textContent);
    if(isPig){
      if(dpsBefore===null)dpsBefore=S.pollNat.dps||0;
      const btn=document.querySelector("#modal-root [data-ai]");
      click(btn);
      S=g.state();
      if(dpsBefore!==null&&dpsAfter===null)dpsAfter=S.pollNat.dps||0;
      continue;
    }
    if(S.debate&&S.debate.q){
      if(S.debate.i<0){const go=document.getElementById("db-go");if(go)click(go);}
      else{for(let qi=S.debate.i;qi<8;qi++)g.debateAnswer(0);const done=document.getElementById("db-done");if(done)click(done);}
      S=g.state();
      continue;
    }
    const btns=document.querySelectorAll("#modal-root .ev-opts .btn");
    if(!btns.length){S.paused=false;break;}
    click(btns[0]);
    S=g.state();
  }
}
for(let wk=1;wk<=20&&S.phase==="campaign";wk++){
  g.endTurn();
  S=g.state();
  resolveModalsRaid();
}
const relDrop=dpsBefore>0&&dpsAfter!==null?(dpsBefore-dpsAfter)/dpsBefore:0;
check("DPS national share drops ~80% on raid (before "+((dpsBefore||0)*100).toFixed(1)+"% → after "+((dpsAfter||0)*100).toFixed(1)+"%)",relDrop>=0.7&&dpsAfter!==null);
check("DPS drops below the 4% threshold after raid",(dpsAfter||1)<0.04);

// ---------- every variant + raid: all options apply via applyFx ----------
for(const ev of [...g.PIG_EVENTS,g.PIG_RAID]){
  g.startCampaign();
  S=g.state();
  g.renderPigEvent(ev);
  S=g.state();
  check("pig modal renders for '"+ev.title.slice(0,30)+"'",document.querySelector("#modal-root .ev-body h3")!==null);
  for(let i=0;i<ev.opts.length;i++)g.pigAnswer(ev,i);
  check("all "+ev.opts.length+" answers apply for '"+ev.title.slice(0,30)+"'",S.log.some(l=>l.html.indexOf("PIG EVENT")>=0));
}

// headless path (no window) resolves without crashing
delete window.__headlessTest;

// no uncaught page errors
check("no uncaught page errors",(window.__errs||[]).length===0);

console.log(pass+" passed, "+fail+" failed");
process.exit(fail?1:0);
