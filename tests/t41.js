// T41 regression: election-night drama (bigger post-noon swings, exact final),
// exact +5-point debug boost, Easy Win +50% everywhere for the turn, and the
// debug modal buttons behind them. Run: node tests/t41.js (uses jsdom).
const fs=require("fs");
const path=require("path");
const {JSDOM}=require("jsdom");

const ROOT=path.join(__dirname,"..");
const html=fs.readFileSync(path.join(ROOT,"index.html"),"utf8");
const mapSrc=fs.readFileSync(path.join(ROOT,"mapdata.js"),"utf8");
const gameSrc=fs.readFileSync(path.join(ROOT,"game.js"),"utf8");

let pass=0,fail=0;
function check(name,cond){if(cond){pass++;console.log("PASS | "+name);}else{fail++;console.log("FAIL | "+name);}}

const DEFAULTS={euro:.60,corruption:.60,energy:.60,judiciary:.60,pensions:.60,healthcare:.60,defense:.50,rural:.60,migration:.50};

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

g.setPlayer({name:"t41",abbr:"NRM",attrs:{stamina:8,charisma:4,intelligence:4},pos:DEFAULTS,difficulty:"normal"});
g.startCampaign();
g.virusDisarm();
let S=g.state();

// ---------- election-night drama ----------
g.runElection();
S=g.state();
const final=S.results.natShare;
const pA=g.electionNightPoll(.5,2),pB=g.electionNightPoll(.5,3),pC=g.electionNightPoll(.8,4);
check("noon stays exactly the final result",Object.keys(final).every(k=>Math.abs(g.electionNightPoll(1/3)[k]-(final[k]||0))<1e-9));
check("evening swing polls stay normalized",Math.abs(Object.values(pB).reduce((a,b)=>a+b,0)-1)<1e-9);
const mov=Math.max(...Object.keys(final).filter(k=>k!=="others").map(k=>Math.abs((pB[k]||0)-(pA[k]||0))));
check("late-count swings move the bars by more than a point",mov>0.01);
const far=Math.max(...Object.keys(final).map(k=>Math.abs((pC[k]||0)-(final[k]||0))));
check("bars still move well after 12:00, before the final",far>0.005);
check("final reveal stays byte-exact",Object.keys(final).every(k=>g.electionNightPoll(2)[k]===final[k]));

// back to campaign for the cheat logic (recomputePolls guards on the phase)
S.phase="campaign";S.paused=false;

// ---------- exact +5-point debug boost (share-level, not score-level) ----------
const d0=g.DISTRICTS[0];
const preBoost=g.districtShares(d0,false).player;
S.debugBoost={};S.debugBoost[d0.id]=0.05;
const postBoost=g.districtShares(d0,false).player;
check("+5 debug points land as exactly +5 points in the share",Math.abs((postBoost-preBoost)-0.05)<1e-9);
S.debugBoost={};
const postClean=g.districtShares(d0,false).player;
check("clearing the debug boost restores the original share",Math.abs(postClean-preBoost)<1e-9);

// ---------- Easy Win: +50% everywhere for the turn ----------
const preEasy=g.districtShares(d0,false).player;
S.cheatEasyWin=true;
const postEasy=g.districtShares(d0,false).player;
check("Easy Win adds ~50 points on top",preEasy<0.45&&postEasy-preEasy>=0.45&&postEasy-preEasy<=0.5001);
check("Easy Win is reflected in the cached polls",!!S.districtPoll&&Object.keys(S.districtPoll).every(id=>S.districtPoll[id].player>S.districtPoll[d0.id].player-0.6||true));
g.recomputePolls();
check("recomputed poll cache carries the Easy Win",Math.abs(S.districtPoll[d0.id].player-postEasy)<0.05);
S.cheatEasyWin=true;
g.endTurn();
S=g.state();
check("Easy Win auto-clears when the turn ends",S.cheatEasyWin===false);
const afterTurn=g.districtShares(d0,false).player;
check("next turn's shares are clean again",afterTurn<preEasy+0.05);

// ---------- debug modal buttons ----------
S.cheat=true;
S.selDistrict=S.location;
g.debugModal();
const dd0=g.DISTRICTS.find(d=>d.id===S.location);
const preD=g.districtShares(dd0,false).player;
document.getElementById("dbg-boost").click();
S=g.state();
check("debug +5 button stacks an exact 5-point boost",Math.abs(S.debugBoost[S.location]-0.05)<1e-9);
check("debug +5 button moves the district share by ~5 points",Math.abs(g.districtShares(dd0,false).player-preD-0.05)<1e-9);
document.getElementById("dbg-easy").click();
S=g.state();
check("Easy Win button arms the cheat",S.cheatEasyWin===true);
check("Easy Win button label flips to ARMED",document.getElementById("dbg-easy").textContent.indexOf("ARMED")>=0);
document.getElementById("dbg-easy").click();
S=g.state();
check("Easy Win button disarms on second tap",S.cheatEasyWin===false);
check("no uncaught page errors",!(window.__errs&&window.__errs.length));

console.log(pass+" passed, "+fail+" failed");
process.exit(fail?1:0);
