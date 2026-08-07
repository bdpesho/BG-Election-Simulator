// T22 regression: second term — time skip, state of the nation review, stat drop, term cap.
// Run: node tests/t22.js   (uses jsdom, a devDependency)
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
const g=window.module.exports;

let pass=0,fail=0;
function check(name,cond){if(cond){pass++;console.log("PASS | "+name);}else{fail++;console.log("FAIL | "+name);}}
function click(el){el.dispatchEvent(new window.MouseEvent("click",{bubbles:true}));}

// ---------- 1. fresh-state + migration ----------
const fresh=g.freshState();
check("fresh state starts at term 1",fresh.term===1&&Array.isArray(fresh.termHistory)&&fresh.termHistory.length===0);
g.startCampaign();
g.virusDisarm(); // T39: keep the random virus event out of term/save checks
const S0=g.state();
delete S0.term;delete S0.termHistory;
window.localStorage.setItem("121towin-save-v6",JSON.stringify(S0));
check("old v6 save without term migrates to term 1",g.loadGame()===true&&g.state().term===1&&g.state().termHistory.length===0);

// ---------- 2. run term 1 to the end ----------
function runTerm(){
  let S=g.state();
  S.eventQueue=[];S.paused=false;
  let weeks=0;
  while(S.phase==="campaign"&&weeks<25){
    g.endTurn();
    S=g.state();
    let guard=0;
    while(S.paused&&guard<60){
      if(S.debate&&S.debate.q){
        if(S.debate.i<0){const go=document.getElementById("db-go");if(go)click(go);}
        else{for(let qi=S.debate.i;qi<8;qi++)g.debateAnswer(0);const done=document.getElementById("db-done");if(done)click(done);}
        S=g.state();guard++;continue;
      }
      const btns=document.querySelectorAll("#modal-root .ev-opts .btn");
      if(!btns.length){S.paused=false;break;}
      click(btns[0]);
      S=g.state();
      guard++;
    }
    weeks++;
  }
  S=g.state();
  click(document.getElementById("btn-election-skip"));
  click(document.getElementById("btn-election-continue"));
  S=g.state();
  const btns=document.querySelectorAll("#modal-root .ev-opts .btn");
  if(btns.length)click(btns[0]);
  S=g.state();
  if(S.phase==="coalition"){
    click(document.getElementById("btn-give-up"));
    S=g.state();
  }
  return S;
}

g.startCampaign();
let S=runTerm();
check("term 1 election ended",S.phase==="end");
check("end screen shows Term 1 of 3",(document.getElementById("end-title").textContent||"").indexOf("Term 1 of 3")>=0);
check("continue-to-next-term button visible",document.getElementById("btn-next-term").style.display!=="none");
const sta1=g.getMaxStamina();

// ---------- 3. time skip -> review -> term 2 ----------
click(document.getElementById("btn-next-term"));
S=g.state();
check("review screen reached",S.phase==="review");
check("review is a state of the nation",(document.getElementById("review-title").textContent||"").indexOf("State of the Nation")>=0);
const entries=document.querySelectorAll("#review-list .rv-entry");
check("review has 8+ dated entries",entries.length>=8);
check("review mentions ministers",(document.getElementById("review-list").textContent||"").indexOf("minister")>=0||(document.getElementById("review-list").textContent||"").indexOf("Ministers")>=0);
check("review persisted to history",S.termHistory.length===1&&S.termHistory[0].term===1);
click(document.getElementById("btn-term-continue"));
S=g.state();
check("term 2 campaign started",S.phase==="campaign"&&S.term===2);
check("term-stamped log line",S.log.some(l=>l.html.indexOf("TERM 2 BEGINS")>=0));
check("stat drop: -1 max stamina",g.getMaxStamina()===sta1-1);
check("previous term state cleared",!S.results&&!S.coalition&&!S.interview);

// ---------- 4. term 2 run + term 3 cap ----------
S=runTerm();
check("term 2 election ended",S.phase==="end");
check("end screen shows Term 2 of 3",(document.getElementById("end-title").textContent||"").indexOf("Term 2 of 3")>=0);
click(document.getElementById("btn-next-term"));
S=g.state();
check("term 3 review reached",S.phase==="review"&&S.termHistory.length===2);
click(document.getElementById("btn-term-continue"));
S=g.state();
check("term 3 campaign started",S.phase==="campaign"&&S.term===3);
S=runTerm();
check("term 3 election ended",S.phase==="end");
check("end screen shows Term 3 of 3",(document.getElementById("end-title").textContent||"").indexOf("Term 3 of 3")>=0);
check("no next-term button after the cap",document.getElementById("btn-next-term").style.display==="none");
check("history holds the two completed reviews",S.termHistory.length===2&&S.termHistory[1].term===2);

// ---------- 5. save/load across the term transition ----------
g.state().phase="review";
g.state().termReport=S.termHistory[1].lines;
g.saveGame();
check("review phase resumes after reload",g.loadGame()===true&&g.state().phase==="review"&&document.getElementById("screen-review").classList.contains("active"));

check("no uncaught page errors",!(window.__errs&&window.__errs.length));
console.log(pass+" passed, "+fail+" failed");process.exit(fail?1:0);
