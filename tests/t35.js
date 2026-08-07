// T35 regression: DIKSY + Konstantin Milev name cheats.
// Run: node tests/t35.js   (headless part + jsdom DOM part)
function makeEl(){
  const t={style:{},dataset:{},innerHTML:"",textContent:"",value:"",disabled:false};
  t.classList={add(){},remove(){},toggle(){}}; t.querySelector=()=>makeEl(); t.querySelectorAll=()=>[];
  t.appendChild=()=>{}; t.setAttribute=()=>{}; t.getAttribute=()=>null; t.addEventListener=()=>{}; t.closest=()=>makeEl(); return t;
}
global.document={readyState:"complete",getElementById:()=>makeEl(),querySelectorAll:()=>[],createElementNS:()=>makeEl(),addEventListener:()=>{}};
global.localStorage={_d:{},getItem(k){return this._d[k]||null},setItem(k,v){this._d[k]=v},removeItem(k){delete this._d[k]}};
global.alert=()=>{};
Object.assign(global,require("../mapdata.js"));
const g=require("../game.js");
const origRandom=Math.random;

let pass=0,fail=0;
function check(name,cond){if(cond){pass++;console.log("PASS | "+name);}else{fail++;console.log("FAIL | "+name);}}
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}

g.startCampaign(); // prime S once so every run follows the same non-reset path
let S=g.state();

// ---------- 1. exact-name triggering (trimmed, case-insensitive) ----------
S.player.name="  DIKSY ";
g.startCampaign(); S=g.state();
check("DIKSY triggers diksy mode only",S.diksy===true&&S.cheat===false&&S.kosyo===false);
S.player.name="konstantin milev";
g.startCampaign(); S=g.state();
check("Konstantin Milev triggers kosyo mode only",S.kosyo===true&&S.cheat===false&&S.diksy===false);
S.player.name="EASY WIN";
g.startCampaign(); S=g.state();
check("EASY WIN still triggers cheat only",S.cheat===true&&S.diksy===false&&S.kosyo===false);
S.player.name="DIKSY WIN";
g.startCampaign(); S=g.state();
check("lookalike names do not trigger",S.cheat===false&&S.diksy===false&&S.kosyo===false);

// ---------- 2. byte-for-byte: DIKSY run == normal run (same seed, same actions) ----------
const basePos=JSON.stringify(g.state().party.pos);
function runToElection(name){
  S=g.state();
  S.player.name=name;
  S.party.pos=JSON.parse(basePos);
  S.results=null;
  Math.random=mulberry32(987654321);
  g.startCampaign();
  S=g.state();
  for(let wk=1;wk<=20;wk++){
    g.doRally(S.activeIssues[0]);
    g.buyAd();
    if(wk===1)g.buildHQ();
    if(wk===2)g.travelTo("plovdiv-city");
    g.endTurn();
    S=g.state();
    if(S.phase!=="campaign")break;
    S.eventQueue=[];S.paused=false;
  }
  S=g.state();
  const c=JSON.parse(JSON.stringify(S));
  c.diksy=false;
  c.player.name="";
  c.log=c.log.filter(l=>l.html.indexOf("MODE ENABLED")<0);
  return JSON.stringify(c);
}
const normalRun=runToElection("Aleksandar Vasilev");
const diksyRun=runToElection("DIKSY");
check("DIKSY run outcome byte-for-byte matches normal run",normalRun===diksyRun);

// ---------- 3. Konstantin Milev: landslide ----------
S.player.name="Konstantin Milev";
Math.random=mulberry32(555);
g.startCampaign(); S=g.state();
const cm=g.candidateModifiers(g.DISTRICTS[0]);
check("kosyo gives a permanent nationwide appeal boost",cm.appealMult>=0.25);
for(let wk=1;wk<=20;wk++){
  g.doRally(S.activeIssues[0]);
  g.buyAd();
  g.endTurn();
  S=g.state();
  if(S.phase!=="campaign")break;
  S.eventQueue=[];S.paused=false;
}
S=g.state();
check("kosyo guarantees a 50%+ national share",(S.results.natShare.player||0)>=0.50);
check("kosyo landslide wins 121+ seats",(S.results.seats.player||0)>=121);
Math.random=origRandom;

// ---------- 4. jsdom: DIKSY display layer + KM red map / ending ----------
const fs=require("fs");
const path=require("path");
const {JSDOM}=require("jsdom");
const ROOT=path.join(__dirname,"..");
const dom=new JSDOM(fs.readFileSync(path.join(ROOT,"index.html"),"utf8"),{runScripts:"dangerously",pretendToBeVisual:true,url:"http://localhost/"});
const {window}=dom;
const {document}=window;
window.alert=()=>{};
window.module={exports:{}};
window.addEventListener("error",e=>{window.__errs=(window.__errs||[]);window.__errs.push(String(e.message||e));});
for(const src of[fs.readFileSync(path.join(ROOT,"mapdata.js"),"utf8"),fs.readFileSync(path.join(ROOT,"game.js"),"utf8")]){
  const s=document.createElement("script");
  s.textContent=src;
  document.body.appendChild(s);
}
if(typeof window.init==="function")window.init();
const g2=window.module.exports;
function click(el){el.dispatchEvent(new window.MouseEvent("click",{bubbles:true}));}
function setName(name){
  click(document.getElementById("btn-new-game"));
  const inp=document.getElementById("in-cand-name");
  inp.value=name;
  inp.dispatchEvent(new window.Event("input",{bubbles:true}));
  g2.startCampaign();
  return g2.state();
}

let S2=setName("DIKSY");
check("diksy mode active in DOM run",S2.diksy===true);
g2.diksyOverlay();
const logLines=document.querySelectorAll("#log-list .log-line");
check("log lines render DIKSY",logLines.length>=2&&[...logLines].every(l=>l.textContent==="DIKSY"));
check("topbar name chip renders DIKSY",document.getElementById("tb-pm").textContent==="DIKSY");
check("name input value is DIKSY",document.getElementById("in-cand-name").value==="DIKSY");
g2.openModal("<h3>TEST TITLE</h3><p>modal body text</p><button class=\"btn\">Keep Me</button>");
g2.diksyOverlay();
const mroot=document.getElementById("modal-root");
check("modal title and body are DIKSY",mroot.querySelector("h3").textContent==="DIKSY"&&mroot.querySelector("p").textContent==="DIKSY");
check("modal buttons untouched",mroot.querySelector("button").textContent==="Keep Me");
check("numbers/costs untouched",document.getElementById("tb-cash").textContent.indexOf("лв")>=0&&document.getElementById("tb-clock").textContent.indexOf("WEEK")>=0);
check("action buttons untouched",document.getElementById("btn-endturn").textContent==="End Week ▸");
g2.closeModal();

S2=setName("Konstantin Milev");
check("kosyo mode active in DOM run",S2.kosyo===true);
g2.redrawMap();
const fills=[...document.querySelectorAll("#bg-map .node .body")].map(b=>b.getAttribute("fill"));
check("map fully player-coloured ("+fills.length+" regions)",fills.length===29&&fills.every(f=>f===S2.party.color));
g2.finishGame("majority");
check("King Kosyo ending text",(document.getElementById("end-text").textContent||"").indexOf("King Kosyo now rules over Bulgaria")>=0);

S2=setName("Aleksandar Vasilev");
check("normal run has no cheat flags",S2.cheat===false&&S2.diksy===false&&S2.kosyo===false);

(async function(){
  // observer regression: repeated renders must converge (no infinite mutation loop)
  S2=setName("DIKSY");
  g2.endTurn();
  g2.endTurn();
  await new Promise(r=>setTimeout(r,50));
  const again=document.querySelectorAll("#log-list .log-line");
  check("observer overlay converges across renders",again.length>=2&&[...again].every(l=>l.textContent==="DIKSY"));
  check("no uncaught page errors",!(window.__errs&&window.__errs.length));
  console.log(pass+" passed, "+fail+" failed");process.exit(fail?1:0);
})();
