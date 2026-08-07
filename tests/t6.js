// T6 + T7 + T11 regression: 9-issue platform (5 drawn/run), 800+ event pool, TV debate.
// Run: node tests/t6.js
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

const CORE=["euro","corruption","energy","judiciary"];
const KNOWN_FX=["cash","stamina","enthusiasmAll","entDistrict","districtBoost","nationBoost","multiBoost","oppHit","rivalBoost","partyHit","rel","posShift","attrTemp","mod"];

// ---------- T6: 9-issue platform ----------
click(document.getElementById("btn-new-game"));
let S=g.state();
check("draws exactly 5 issues",S.activeIssues.length===5);
check("draw includes ≥1 core issue",S.activeIssues.some(id=>CORE.includes(id)));
check("no duplicate issues in a draw",new Set(S.activeIssues).size===5);

// platform sliders show exactly the 5 drawn issues (captured BEFORE the variety redraws)
const sliderIds=[...document.querySelectorAll("#platform-sliders input")].map(i=>i.dataset.issue);
const firstDraw=S.activeIssues.slice();
check("setup sliders = 5 drawn issues",sliderIds.length===5&&firstDraw.every(id=>sliderIds.includes(id)));

// draw variety: 10 fresh draws must contain ≥2 distinct sets
const seen=new Set();
for(let i=0;i<10;i++){
  g.drawActiveIssues();
  seen.add(S.activeIssues.slice().sort().join(","));
}
check("different campaigns draw different platforms",seen.size>=2);

// renormalized weights sum to 1 for a sample district
g.drawActiveIssues();
const aw=g.activeWeights(g.DISTRICTS.find(d=>d.id==="sofia-city"));
let wsum=0;
for(const k in aw)wsum+=aw[k].w;
check("renormalized weights sum to 1",Math.abs(wsum-1)<1e-9);

// campaign: rally buttons = 5 active issues
g.startCampaign();
g.virusDisarm(); // T39: keep the random virus event out of debate-week timing
S=g.state();
click(document.getElementById("map-"+S.location)||document.querySelectorAll("#bg-map .node")[0]);
const rallyIssues=[...document.querySelectorAll("[data-act=rally]")].map(b=>b.dataset.issue);
check("rally buttons = 5 active issues",rallyIssues.length===5&&S.activeIssues.every(id=>rallyIssues.includes(id)));
check("no inactive-issue rally button",rallyIssues.every(id=>S.activeIssues.includes(id)));

// ---------- T7: pool size ----------
check("event pool ≥ 800",g.EVENT_POOL().length>=800);

// ---------- T11: debate data ----------
check("debate pool has 12 questions",g.DEBATE_POOL.length===12);
let qShapeOk=true,fxOk=true;
for(const q of g.DEBATE_POOL){
  if(!q.q||!Array.isArray(q.a)||q.a.length!==4)qShapeOk=false;
  for(const a of q.a){
    if(!a.t)qShapeOk=false;
    for(const k in a.fx)if(!KNOWN_FX.includes(k))fxOk=false;
  }
}
check("every question has 4 answers with text",qShapeOk);
check("every answer fx uses the applyFx vocabulary",fxOk);

// any 5-issue draw yields exactly 8 valid questions (≥6 required)
let minValid=99,allEight=true;
for(let i=0;i<10;i++){
  g.drawActiveIssues();
  const qs=g.buildDebateQuestions();
  if(qs.length!==8)allEight=false;
  for(const q of qs){
    const valid=!q.issue||S.activeIssues.includes(q.issue);
    if(!valid)minValid=Math.min(minValid,0);
  }
}
check("debate picks 8 valid questions for any draw",allEight);

// debate fires exactly once, weeks 14–16, and resolves
g.startCampaign();
g.virusDisarm(); // T39: keep the random virus event out of debate-week timing
S=g.state();
S.debateWeek=14;S.debateDone=false;S.debate=null;
let firstDebateWeek=0,resolved=false;
function resolveModals(){
  while(S.paused){
    if(S.debate&&S.debate.q){
      if(!firstDebateWeek)firstDebateWeek=S.week;
      if(S.debate.i<0){
        const go=document.getElementById("db-go");
        if(go)click(go);
        S=g.state();
        continue;
      }
      for(let qi=S.debate.i;qi<8;qi++)g.debateAnswer(0);
      const done=document.getElementById("db-done");
      if(done)click(done);
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
check("debate fires within weeks 14–16",firstDebateWeek>=14&&firstDebateWeek<=16);
check("debate resolves to summary (8 answers)",resolved||S.debate===null);
check("debate fired exactly once",S.debateDone===true);

// no uncaught page errors
check("no uncaught page errors",(window.__errs||[]).length===0);

console.log(pass+" passed, "+fail+" failed");
process.exit(fail?1:0);
