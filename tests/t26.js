// T26 regression: election night reveal, early-voter bias, exact final result.
function makeEl(){
  const t={style:{},dataset:{},innerHTML:"",textContent:"",value:"",disabled:false};
  t.classList={add(){},remove(){},toggle(){}}; t.querySelector=()=>makeEl(); t.querySelectorAll=()=>[];
  t.appendChild=()=>{}; t.setAttribute=()=>{}; t.getAttribute=()=>null; t.addEventListener=()=>{}; t.closest=()=>makeEl(); return t;
}
global.document={readyState:"complete",getElementById:()=>makeEl(),querySelectorAll:()=>[],createElementNS:()=>makeEl(),addEventListener:()=>{}};
global.localStorage={_d:{},getItem(k){return this._d[k]||null},setItem(k,v){this._d[k]=v},removeItem(k){delete this._d[k]}};
global.alert=()=>{}; let timerCalls=0; const realSetTimeout=global.setTimeout;
global.setTimeout=(fn,ms)=>{timerCalls++;return realSetTimeout(fn,ms);};
Object.assign(global,require("../mapdata.js")); const g=require("../game.js");
timerCalls=0; // boot-time background loops (T37 alive map) schedule their first tick — the check below verifies the campaign/election logic itself is timer-free
let pass=0,fail=0; function check(name,cond){if(cond){pass++;console.log("PASS | "+name);}else{fail++;console.log("FAIL | "+name);}}
g.startCampaign(); g.runElection(); const S=g.state();
check("headless election reaches final reveal without timers",S.phase==="election"&&S.electionNight.step===5);
check("headless path schedules no timers",timerCalls===0);
check("election clock rolls from 08:00 to 20:00",g.electionNightClock(0)==="08:00"&&g.electionNightClock(.5)==="14:00"&&g.electionNightClock(1)==="20:00");
const final=S.results.natShare, shown=g.electionNightPoll(5), early=g.electionNightPoll(0);
check("final estimate exactly reuses final national result",Object.keys(final).every(k=>shown[k]===final[k]));
check("early exit poll over-represents BSP",(early.bsp||0)>(final.bsp||0));
check("early exit poll retains GERB in the field",(early.gerb||0)>0);
check("early exit poll targets BSP around 40%",Math.abs((early.bsp||0)-.40)<.01);
check("early exit poll keeps PB between 5% and 10%",(early.pb||0)>=.05&&(early.pb||0)<=.10);
const noon=g.electionNightPoll(1/3);
check("fictional early percentages converge by noon",Object.keys(final).every(k=>Math.abs((noon[k]||0)-final[k])<1e-9));
check("final vote count is available",S.results.totalVotes>0);
check("turnout mode is recorded",S.results.turnoutMode==="low"||S.results.turnoutMode==="high");
check("early estimate remains normalized",Math.abs(Object.values(early).reduce((a,b)=>a+b,0)-1)<1e-9);
check("district final shares are cached",S.results.districts.length===g.DISTRICTS.length);
check("district final vote totals are cached",S.results.districts.every(d=>d.totalVotes>0&&d.votes));
const byId={};S.results.districts.forEach(x=>byId[x.id]=x);
const morningOrder=g.DISTRICTS.slice().sort((a,b)=>b.seats-a.seats);
const bspMorning=morningOrder.filter((d,i)=>g.electionNightLeader(byId[d.id],.05,i)==="bsp").length;
check("BSP leads at least five regions in the morning count",bspMorning>=5);
check("PP-DB leads both Sofia districts until final",g.electionNightLeader(byId["sofia-city"],.9,0)==="ppdb"&&g.electionNightLeader(byId["sofia-obl"],.9,0)==="ppdb");
check("final reveal exposes every district",S.electionNight.revealed.length===g.DISTRICTS.length);
console.log(pass+" passed, "+fail+" failed"); process.exit(fail?1:0);
