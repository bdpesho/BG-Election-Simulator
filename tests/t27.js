// T27 regression: post-election exit interview (outcome-based options, Bai Tosho easter egg)
// and final government formation (random AI coalition / "no parliament" outcome).
// Run: node tests/t27.js   (uses jsdom, a devDependency)
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

// ---------- 1. full campaign to the election ----------
click(document.getElementById("btn-new-game"));
g.startCampaign();
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
check("election reached for interview test",S.phase==="election");

// ---------- 2. election night skip -> interview modal ----------
click(document.getElementById("btn-election-skip"));
click(document.getElementById("btn-election-continue"));
const modalText=()=>document.getElementById("modal-root").textContent||"";
check("interview modal appears after election",modalText().indexOf("THE MORNING AFTER")>=0);
check("interview asks the headline question",modalText().indexOf("Are you happy about the results")>=0);
let opts=document.querySelectorAll("#modal-root .ev-opts .btn");
check("interview offers 3+ options",opts.length>=3);

// ---------- 3. answering proceeds the flow ----------
click(opts[0]);
S=g.state();
check("interview choice recorded",!!S.interview&&typeof S.interview.choice==="string"&&S.interview.choice.length>5);
check("interview choice logged (T3 format)",S.log.some(l=>l.html.indexOf("INTERVIEW —")>=0));
check("interview proceeds to coalition or end",S.phase==="coalition"||S.phase==="end");

// ---------- 4. giving up -> final government outcome ----------
if(S.phase==="coalition"){
  click(document.getElementById("btn-give-up"));
  S=g.state();
  check("end phase reached after give-up",S.phase==="end");
  check("ending is opposition or no-parliament",S.ending==="opposition"||S.ending==="noparliament");
  check("end screen text describes the outcome",(document.getElementById("end-text").textContent||"").length>40);
  if(S.ending==="opposition"){
    check("AI government reaches 121+ seats",!!S.government&&S.government.seats>=121);
    check("AI government has 2-3 parties, no player",!!S.government&&S.government.parties.length>=2&&S.government.parties.length<=3&&S.government.parties.indexOf("player")<0);
    check("end title says Into Opposition",(document.getElementById("end-title").textContent||"").indexOf("Opposition")>=0);
    check("government formation logged",S.log.some(l=>l.html.indexOf("The country has a government")>=0));
  }else{
    check("no-parliament has no government",!S.government);
    check("end title says No Parliament",(document.getElementById("end-title").textContent||"").indexOf("No Parliament")>=0);
  }
}else{
  check("give-up path reached",false);
}

// ---------- 5. unit: AI coalition search over synthetic parliaments ----------
function synth(seats){
  S=g.state();
  S.results={seats:seats,natShare:{},qualified:Object.keys(seats).filter(k=>k!=="player")};
}
synth({gerb:70,pb:60});
let gov=g.findAICoalition();
check("compatible pair forms a government",!!gov&&gov.seats>=121&&gov.parties.length===2);
check("PM is the largest partner",gov&&gov.pm==="gerb");
synth({gerb:50,pb:50,ppdb:50});
gov=g.findAICoalition();
check("three-party coalition can form",!!gov&&gov.parties.length===3);
synth({gerb:80,bsp:80,vaz:80});
gov=g.findAICoalition();
check("huge view differences block every coalition",gov===null);
synth({gerb:130,bsp:60,vaz:40});
gov=g.findAICoalition();
check("single-party AI majority forms alone",!!gov&&gov.parties.length===1&&gov.pm==="gerb");

// ---------- 6. Bai Tosho easter egg (leftist platform) ----------
g.startCampaign();
S=g.state();
S.interview=null;S.government=null;
S.party.pos.pensions=0.8;
S.party.pos.healthcare=0.8;
check("leftist detection rule fires",g.leftistParty()===true);
S.eventQueue=[];S.paused=false;
g.runElection();
click(document.getElementById("btn-election-skip"));
click(document.getElementById("btn-election-continue"));
check("leftist interview offers Bai Tosho",modalText().indexOf("Bai Tosho")>=0);
const eggBtn=[...document.querySelectorAll("#modal-root .ev-opts .btn")].find(b=>b.textContent.indexOf("Bai Tosho")>=0);
if(eggBtn){
  click(eggBtn);
  S=g.state();
  check("Bai Tosho choice recorded as easter egg",!!S.interview&&S.interview.easterEgg===true);
  check("Bai Tosho choice logged",S.log.some(l=>l.html.indexOf("Bai Tosho")>=0));
}else{
  check("Bai Tosho choice recorded as easter egg",false);
}

// ---------- 7. centrist platform gets no easter egg ----------
g.startCampaign();
S=g.state();
S.interview=null;S.government=null;
S.party.pos.pensions=0.5;
S.party.pos.healthcare=0.5;
check("centrist detection rule stays off",g.leftistParty()===false);
S.eventQueue=[];S.paused=false;
g.runElection();
click(document.getElementById("btn-election-skip"));
click(document.getElementById("btn-election-continue"));
check("centrist interview has no Bai Tosho",modalText().indexOf("Bai Tosho")<0);
click(document.querySelector("#modal-root .ev-opts .btn"));

// ---------- 8. below-threshold ending still names the government ----------
g.startCampaign();
S=g.state();
S.interview=null;S.government=null;
g.runElection();
S=g.state();
S.results.qualified=S.results.qualified.filter(k=>k!=="player");
g.continueAfterInterview();
S=g.state();
check("below-threshold run ends",S.phase==="end"&&S.ending==="threshold");
check("threshold title preserved",(document.getElementById("end-title").textContent||"").indexOf("4% Threshold")>=0);
check("threshold outcome names government or new elections",(document.getElementById("end-text").textContent||"").length>40);

check("no uncaught page errors",!(window.__errs&&window.__errs.length));
console.log(pass+" passed, "+fail+" failed");process.exit(fail?1:0);
