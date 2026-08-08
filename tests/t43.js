// T43 regression: named campaign triggers and their one-time flavor events.
const fs=require("fs");
const path=require("path");
const {JSDOM}=require("jsdom");

const ROOT=path.join(__dirname,"..");
const html=fs.readFileSync(path.join(ROOT,"index.html"),"utf8");
const mapSrc=fs.readFileSync(path.join(ROOT,"mapdata.js"),"utf8");
const gameSrc=fs.readFileSync(path.join(ROOT,"game.js"),"utf8");
let pass=0,fail=0;
function check(name,cond){if(cond){pass++;console.log("PASS | "+name);}else{fail++;console.log("FAIL | "+name);}}

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
const DEFAULTS={euro:.60,corruption:.60,energy:.60,judiciary:.60,pensions:.60,healthcare:.60,defense:.50,rural:.60,migration:.50};
function campaign(name){
  g.setPlayer({name:name,abbr:"T43",attrs:{stamina:8,charisma:4,intelligence:3},pos:DEFAULTS,difficulty:"hard"});
  g.startCampaign();
  g.virusDisarm();
  const S=g.state();
  S.eventQueue=[];S.paused=false;S.pigPending=false;S.debateWeek=99;
  return S;
}
function playerWins(id){
  const sh=g.districtShares(g.DISTRICTS.find(d=>d.id===id),false);
  const rivals=Object.keys(sh).filter(k=>k!=="player").map(k=>sh[k]);
  return sh.player>Math.max.apply(null,rivals);
}

let S=campaign("Mihail Stamboliev");
check("Mihail trigger is case-insensitive",S.misho===true&&S.martin===false&&S.brat===false);
check("Mihail always wins Yambol",playerWins("yambol"));
g.endTurn();
S=g.state();
check("Mihail event fires before week 10",S.week===2&&S.mishoFired===true&&/Zimnitsa/i.test(document.getElementById("modal-root").textContent)&&/Zimnishka rakia/i.test(document.getElementById("modal-root").textContent));
document.querySelector("#modal-root .ev-opts .btn").click();
check("Mihail event is one-time",S.mishoFired===true);

S=campaign("GEORGI MARTINOV");
check("Georgi trigger wins Sofia City",S.martin===true&&playerWins("sofia-city"));
g.endTurn();
check("Georgi event names Madjun and alcohol",S.sofiaFired===true&&/Madjun/i.test(document.getElementById("modal-root").textContent)&&/alcohol/i.test(document.getElementById("modal-root").textContent));

S=campaign("Nikola Bratanov");
check("Nikola trigger wins Sofia City",S.brat===true&&playerWins("sofia-city"));

S=campaign("stamboliev mihail");
check("reversed Mihail name does not trigger",S.misho===false&&!playerWins("yambol"));
check("no uncaught page errors",!(window.__errs&&window.__errs.length));
console.log(pass+" passed, "+fail+" failed");
process.exit(fail?1:0);
