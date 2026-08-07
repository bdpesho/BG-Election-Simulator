// T34 regression: PP-DB campaigns only in its six city districts.
// Run: node tests/t34.js
function makeEl(){
  const t={style:{},dataset:{},innerHTML:"",textContent:"",value:""};
  t.classList={add(){},remove(){},toggle(){}};
  t.querySelector=()=>makeEl();
  t.querySelectorAll=()=>[];
  t.appendChild=()=>{};
  t.setAttribute=()=>{};
  t.addEventListener=()=>{};
  t.closest=()=>makeEl();
  return t;
}
global.document={readyState:"complete",getElementById:()=>makeEl(),querySelectorAll:()=>[],createElementNS:()=>makeEl(),addEventListener:()=>{}};
global.localStorage={_d:{},getItem(k){return this._d[k]||null},setItem(k,v){this._d[k]=v},removeItem(k){delete this._d[k]}};
global.alert=()=>{};
Object.assign(global,require("../mapdata.js"));
const g=require("../game.js");

let pass=0,fail=0;
function check(name,cond){if(cond){pass++;console.log("PASS | "+name);}else{fail++;console.log("FAIL | "+name);}}

const FOCUS=["sofia-city","sofia-obl","burgas","varna","plovdiv-city","plovdiv-obl"];
const ppdb=g.AI_PARTIES.find(p=>p.id==="ppdb");

check("PP-DB has a 6-city focus list",!!ppdb.focus&&ppdb.focus.sort().join(",")===FOCUS.slice().sort().join(","));
check("no other AI party has a focus list",g.AI_PARTIES.filter(p=>p.id!=="ppdb").every(p=>!p.focus));

// full sim: 20 weeks, no player action (events resolve headless)
g.startCampaign();
g.virusDisarm(); // T39: keep the random virus event out of AI-targeting checks
let S=g.state();
for(let wk=1;wk<=20;wk++){
  g.endTurn();
  S=g.state();
  if(S.phase!=="campaign")break;
  S.eventQueue=[];S.paused=false;
}

// 1. PP-DB total boost outside its focus districts ≈ 0
let nonFocusBoost=0;
for(const d of g.DISTRICTS){
  if(FOCUS.includes(d.id))continue;
  nonFocusBoost+=S.boost[d.id]&&S.boost[d.id].ppdb?S.boost[d.id].ppdb:0;
}
check("PP-DB total boost outside focus districts ≈ 0",nonFocusBoost<0.001);
let focusBoost=0;
for(const d of g.DISTRICTS){
  if(!FOCUS.includes(d.id))continue;
  focusBoost+=S.boost[d.id]&&S.boost[d.id].ppdb?S.boost[d.id].ppdb:0;
}
check("PP-DB concentrated boosts in its cities",focusBoost>0.02);

// 2. PP-DB share in the 6 cities ≥ its national share (roughly)
const natShare=S.results.natShare.ppdb||0;
let citySum=0;
for(const id of FOCUS){
  const sh=g.districtShares(g.DISTRICTS.find(d=>d.id===id),false);
  citySum+=sh.ppdb||0;
}
const cityAvg=citySum/FOCUS.length;
console.log("PP-DB national "+ (natShare*100).toFixed(1)+"% · city avg "+(cityAvg*100).toFixed(1)+"%");
check("PP-DB city share ≥ national share",cityAvg>=natShare-0.01);

// 3. no residual PP-DB boost anywhere outside focus (aiTurn + lean seed both excluded)
let residual=false;
for(const d of g.DISTRICTS){
  if(FOCUS.includes(d.id))continue;
  const b=S.boost[d.id]||{};
  if(b.ppdb!==undefined&&b.ppdb!==0)residual=true;
}
check("no residual PP-DB boost outside focus",!residual);

console.log(pass+" passed, "+fail+" failed");
process.exit(fail?1:0);
