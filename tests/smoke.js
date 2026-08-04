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
g.startCampaign();
let S=g.state();
console.log("events in pool:",S.eventBag.length);
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
if(!S.debateDone)throw new Error("debate never fired");
console.log("debate: fired once, resolved headless");
if(S.phase!=="election")throw new Error("election not reached: "+S.phase);
const r=S.results;
const sum=Object.values(r.seats).reduce((a,b)=>a+b,0);
if(sum!==240)throw new Error("seat sum "+sum);
console.log("seat sum:",sum);
console.log("player:",((r.natShare.player*100).toFixed(1))+"%",r.seats.player||0,"seats");
if((r.seats.player||0)>0&&(r.seats.player||0)<121){
  g.startCoalition();
  console.log("coalition CP:",g.state().coalition.cp);
}
console.log("SIMULATION OK");

// T6/T7 extended checks: pool size, no inactive-issue references, force-apply every entry
g.startCampaign();
S=g.state();
const pool=g.EVENT_POOL();
if(pool.length<800)throw new Error("event pool "+pool.length+" < 800");
console.log("pool size:",pool.length);
const activeSet=new Set(S.activeIssues);
for(const ev of pool){
  for(const o of ev.opts){
    if(o.fx&&o.fx.posShift&&!activeSet.has(o.fx.posShift.issue))throw new Error("event references inactive issue: "+ev.title);
  }
}
for(const ev of pool)for(const o of ev.opts)g.applyFx(o.fx);
console.log("all "+pool.length+" pool entries force-applied without crashing");
console.log("EXTENDED CHECKS OK");
