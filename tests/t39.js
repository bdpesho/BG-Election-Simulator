// T39 regression: "A NEW VIRUS HAS ARRIVED FROM INDIA" — random V. Tarnovo crisis
// (5% per turn, once per run: plane fly-in, zoom, gradient flash, popup,
//  3 weeks skipped, every party loses scaled support).
// Run: node tests/t39.js   (uses jsdom, a devDependency)
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
for(const file of["mapdata.js","game.js"]){
  const script=document.createElement("script");
  script.textContent=fs.readFileSync(path.join(ROOT,file),"utf8");
  document.body.appendChild(script);
}
if(typeof window.init==="function")window.init();
const g=window.module.exports;

let pass=0,fail=0;
function check(name,cond){if(cond){pass++;console.log("PASS | "+name);}else{fail++;console.log("FAIL | "+name);}}
function click(el){if(el)el.dispatchEvent(new window.MouseEvent("click",{bubbles:true}));}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const origRandom=window.Math.random;
const pct3=x=>(x*100).toFixed(1)+"%";

const DEFAULTS={euro:.60,corruption:.60,energy:.60,judiciary:.60,pensions:.60,healthcare:.60,defense:.50,rural:.60,migration:.50};
g.setPlayer({name:"t39",abbr:"NOV",attrs:{stamina:8,charisma:4,intelligence:4},pos:DEFAULTS,difficulty:"normal"});

(async()=>{
// ---------- 1. the 5% roll: threshold + once-per-run guard ----------
g.startCampaign();
check("5% roll fires under the threshold",(window.Math.random=()=>0.04,g.virusRoll()===true));
check("5% roll stays silent above the threshold",(window.Math.random=()=>0.06,g.virusRoll()===false));
window.Math.random=()=>0.04;
g.state().virusDone=true;
check("5% roll disarmed once fired (once per run)",g.virusRoll()===false);
g.state().virusDone=false;
window.Math.random=()=>0.04;
g.virusDisarm();
check("virusDisarm() disables the roll",g.virusRoll()===false);
window.Math.random=origRandom;

// ---------- 2. endTurn fires the event: campaign stops, plane flies ----------
g.startCampaign();
let S=g.state();
window.Math.random=()=>0.01;
g.endTurn();
window.Math.random=origRandom;
S=g.state();
check("endTurn rolls the virus and disarms it",S.virusDone===true);
check("the campaign stops (paused)",S.paused===true);
S.eventQueue=[];S.paused=false;
const plane=document.getElementById("virus-plane");
check("plane sprite flies across the map",!!plane&&!!plane.querySelector("svg"));
await sleep(60);
check("plane is airborne",plane&&plane.classList.contains("fly"));

// ---------- 3. arrival: zoom, gradient flash, popup ----------
g.virusArrive();
check("map zooms into V. Tarnovo",g.mapZoom()&&g.mapZoom().scale>=2);
const node=document.querySelector('#bg-map .node[data-id="velikotarnovo"]');
check("V. Tarnovo flashes the virus gradient",!!node&&node.classList.contains("virus-flash"));
await sleep(800);
const head=document.querySelector("#modal-root .ev-head span");
check("popup: A NEW VIRUS HAS ARRIVED FROM INDIA",!!head&&/INDIA/.test(head.textContent));

// ---------- 4. continue: 3 weeks skipped, scaled support loss ----------
const weekBefore=S.week;
const natB=g.nationalShares(false);
click(document.getElementById("virus-continue"));
S=g.state();
check("three weeks are skipped",S.week===weekBefore+3);
check("campaign resumes unpaused",S.paused===false);
const natA=g.nationalShares(false);
const partyIds=["player",...g.AI_PARTIES.map(p=>p.id)];
check("every party loses support (or holds at the floor)",partyIds.every(pid=>(natA[pid]||0)<=(natB[pid]||0)+1e-9));
check("the player party loses support too",(natA.player||0)<(natB.player||0));
const big=partyIds.reduce((a,b)=>((natB[a]||0)>(natB[b]||0)?a:b));
const target=Math.max(0.03,(natB[big]||0)*0.75-0.02);
check("a ~30%-size party collapses toward ~20% (biggest: "+pct3(natB[big]||0)+" → "+pct3(natA[big]||0)+")",Math.abs((natA[big]||0)-target)<=0.03);
const small=partyIds.filter(pid=>(natB[pid]||0)>=0.03&&(natB[pid]||0)<0.05);
check("4%-size parties land near the 3% floor",small.every(pid=>(natA[pid]||0)>=0.028));
check("the undecided vote absorbs the loss",(natA.others||0)>(natB.others||0));
check("V. Tarnovo flash clears after continue",!node.classList.contains("virus-flash"));
check("plane is gone after continue",!document.getElementById("virus-plane"));
check("virus roll stays disarmed after the event",g.virusRoll()===false);

// ---------- 5. skip near election day triggers the election ----------
g.startCampaign();
S=g.state();
S.week=19;
g.virusSkipTurns();
S=g.state();
check("skipping past election day calls the election",S.phase==="election");

// ---------- 6. debug console trigger ----------
g.startCampaign();
S=g.state();
S.cheat=true;
S.virusDone=true;
g.debugModal();
const dbgBtn=document.getElementById("dbg-virus");
check("cheat console offers a virus trigger",!!dbgBtn&&/virus/i.test(dbgBtn.textContent));
click(dbgBtn);
S=g.state();
check("debug trigger starts the virus",S.paused===true&&S.virusDone===true&&!!document.getElementById("virus-plane"));

// ---------- 7. no uncaught page errors ----------
check("no uncaught page errors",(window.__errs||[]).length===0);

console.log(pass+" passed, "+fail+" failed");
process.exit(fail?1:0);
})().catch(e=>{console.error("T39 CRASH:",e);process.exit(1);});
