// T25 regression: real-data district stats (2021 census ethnicity, 2026 election-informed lean/geo/turnout).
// Run: node tests/t25.js
const path=require("path");
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
const ROOT=path.join(__dirname,"..");
Object.assign(global,require(path.join(ROOT,"mapdata.js")));
const g=require(path.join(ROOT,"game.js"));
const D=g.DISTRICTS;
const by={};D.forEach(d=>by[d.id]=d);

let pass=0,fail=0;
function check(name,cond){if(cond){pass++;console.log("PASS | "+name);}else{fail++;console.log("FAIL | "+name);}}

// issue weights/ideals sanity
check("Dobrich is ~80-90% pro-rural-development",by["dobrich"].ideal.rural>=0.8&&by["dobrich"].w.rural>=0.2);
let badW=0,badI=0;
for(const d of D){
  let ws=0;
  for(const k in d.w){if(d.w[k]<0||d.w[k]>0.5)badW++;ws+=d.w[k];}
  if(ws>2.2)badW++;
  for(const k in d.ideal)if(d.ideal[k]<0||d.ideal[k]>1)badI++;
}
check("all weights sane (0..0.5, Σ9 ≤ 2.2)",badW===0);
check("all ideals in [0,1]",badI===0);

// census ethnicity
check("Kardzhali is majority Turkish (≥50%)",by["kardzhali"].eth.turkish>=0.5);
check("Razgrad ~50% Turkish",by["razgrad"].eth.turkish>=0.4);
check("Sliven has a big Roma community (≥10%)",by["sliven"].eth.roma>=0.1);
check("Montana/Vratsa northwest Roma belt (≥8%)",by["montana"].eth.roma>=0.08&&by["vratsa"].eth.roma>=0.08);
check("Sofia City is ~95% Bulgarian",by["sofia-city"].eth.bulgarian>=0.9);
let badE=0;
for(const d of D){
  const s=d.eth.bulgarian+d.eth.turkish+d.eth.roma;
  if(s>1.01||Object.values(d.eth).some(v=>v<0||v>1))badE++;
}
check("every district's ethnic shares plausible (0..1, sum ≤1.01)",badE===0);

// geo axes
let badG=0;
for(const d of D)if(Object.values(d.geo).some(v=>v<0||v>1))badG++;
check("all geo axes in [0,1]",badG===0);
check("Sofia very pro-EU / pro-NATO / anti-Russia",by["sofia-city"].geo.proEU>=0.85&&by["sofia-city"].geo.proNATO>=0.85&&by["sofia-city"].geo.proRussia<=0.2);
check("Sliven/Yambol nationalist strongholds",by["sliven"].geo.nationalism>=0.6&&by["yambol"].geo.nationalism>=0.6);
check("Sofia City highly urbanised",by["sofia-city"].geo.urbanization>=0.9);

// real 2026 per-MIR turnout bases
const tbs=D.map(d=>d.tb);
check("turnout bases span the real 2026 range",Math.min.apply(null,tbs)<=0.35&&Math.max.apply(null,tbs)>=0.5);
check("Kardzhali has the lowest turnout (~30%)",by["kardzhali"].tb<=0.35);
check("Sofia/Smolyan highest turnout",by["sofia-city"].tb>=0.5&&by["smolyan"].tb>=0.5);

// 2026-informed leans
check("Kardzhali leans hard to DPS+APS (real winner belt)",(by["kardzhali"].lean.dps||0)+(by["kardzhali"].lean.aps||0)>=0.4);
check("Sofia City leans PP-DB (real exit poll: 30%)",(by["sofia-city"].lean.ppdb||0)>=0.1);
check("Vazrazhdane lean in Sliven/Yambol",(by["sliven"].lean.vaz||0)>=0.1&&(by["yambol"].lean.vaz||0)>=0.1);

// balance + T28 regression with the new turnout bases
g.startCampaign();
let S=g.state();
for(let wk=1;wk<=20;wk++){
  g.doRally(S.activeIssues[0]);
  g.buyAd();
  if(wk===1)g.buildHQ();
  g.endTurn();
  S=g.state();
  if(S.phase!=="campaign")break;
  S.eventQueue=[];S.paused=false;
}
S=g.state();
check("election reached with real-data districts",S.phase==="election");
const r=S.results;
const sum=Object.values(r.seats).reduce((a,b)=>a+b,0);
check("seats still sum to 240",sum===240);
const ts=Object.values(r.turnouts);
check("turnout per region stays in [0.25,0.60]",ts.every(t=>t>=0.25&&t<=0.60));
const ps=r.seats.player||0;
check("naive sim still competitive ("+ps+" seats)",ps>=20&&ps<=110&&(r.natShare.player||0)>=0.04);

console.log(pass+" passed, "+fail+" failed");
process.exit(fail?1:0);
