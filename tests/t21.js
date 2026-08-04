// T21 regression: party machine — campaigns, staff, HQ upgrades, phases, revenue, AI flavor.
// Run: node tests/t21.js
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

g.startCampaign();
let S=g.state();

// 1. defaults
const pm0=g.freshState().partyMachine;
check("fresh state has party machine defaults",pm0.hqLevel===1&&pm0.energy===6&&pm0.staff.length===0&&pm0.campaigns.length===0&&pm0.history.length===0);
check("energy max is 6 at level 1",g.partyEnergyMax()===6);
check("staff cap is 3 at level 1",g.partyStaffCap()===3);
check("no upkeep with no staff",g.partyUpkeep()===0);

// 2. hire
const hireCost1=g.partyHireCost();
const h0=g.hireStaff();
check("hired first staff",!!h0&&h0.level===1);
check("hire cost deducted",S.cash===120000-hireCost1);
g.hireStaff();
g.hireStaff();
check("hire capped at staff cap",g.hireStaff()===null);

// 3. launch + validation
const actIssue=S.activeIssues[0];
const inactive=g.ISSUE_POOL.find(i=>S.activeIssues.indexOf(i.id)<0);
const beforeCash=S.cash;
const c1=g.launchCampaign({issue:actIssue,stance:"pro",target:"national",name:"Europe Forward!"});
check("national campaign launched",!!c1&&c1.phase===0&&c1.alloc.join(",")==="0,0,0");
check("launch cost deducted",beforeCash-S.cash===20000);
check("inactive issue rejected",g.launchCampaign({issue:inactive.id,stance:"pro",target:"national",name:"x"})===null);
check("bad stance rejected",g.launchCampaign({issue:actIssue,stance:"sideways",target:"national",name:"x"})===null);
check("bad target rejected",g.launchCampaign({issue:actIssue,stance:"pro",target:"atlantis",name:"x"})===null);

// 4. allocation rules
check("alloc 3 ok with 3 staff",g.allocateStaff(c1.id,3)===true);
check("energy spent",S.partyMachine.energy===3);
check("re-alloc same phase replaces, no extra cost",g.allocateStaff(c1.id,3)===true&&S.partyMachine.energy===3);
const cX=g.launchCampaign({issue:actIssue,stance:"pro",target:"plovdiv-city",name:"X"});
check("second campaign drains energy too",g.allocateStaff(cX.id,3)===true&&S.partyMachine.energy===0);
check("alloc beyond energy fails",g.allocateStaff(c1.id,1)===false);
check("alloc beyond 3 fails",g.allocateStaff(c1.id,4)===false);
g.allocateStaff(c1.id,0);g.allocateStaff(cX.id,0);
check("alloc reset refunds energy",S.partyMachine.energy===6);

// 5. campaign cap
const c2=g.launchCampaign({issue:actIssue,stance:"anti",target:"plovdiv-city",name:"B"});
const c3=g.launchCampaign({issue:actIssue,stance:"pro",target:"varna",name:"C"});
check("campaign cap is 3",g.launchCampaign({issue:actIssue,stance:"pro",target:"national",name:"D"})===null);
S.partyMachine.campaigns=[c1]; // clean up extras for the phase test
S.partyMachine.energy=6;

// 6. full loop: planning -> execution -> release
for(let ph=0;ph<3;ph++){
  g.allocateStaff(c1.id,3);
  g.endTurn();
  S=g.state();
  S.eventQueue=[];S.paused=false;
}
check("campaign released after 3 phases",S.partyMachine.campaigns.length===0);
const h1=S.partyMachine.history[0];
check("9 staff-weeks recorded",h1.staffWeeks===9);
check("national swing >= 1 pt",h1.swing>=1.0);
check("revenue positive",h1.rev>0);
check("revenue >= break-even-ish",h1.rev>=h1.cost*0.5);
check("history newest first",S.partyMachine.history.length===1&&h1.name==="Europe Forward!");
check("stats.campaigns incremented",S.stats.campaigns===1);
check("energy refilled weekly",S.partyMachine.energy===g.partyEnergyMax());
const logAll=S.log.map(l=>l.html).join(" | ");
check("phase log lines present",/planning complete/.test(logAll)&&/execution wrapped/.test(logAll));
check("release log line present",/released/.test(logAll));
check("launch log line present",/launched/.test(logAll));

// 7. district campaign + lean release
const beforeCash2=S.cash;
const c4=g.launchCampaign({issue:actIssue,stance:"anti",target:"sofia-city",name:""});
check("district campaign launched with auto-name",!!c4&&c4.name.length>0&&c4.target==="sofia-city");
for(let ph=0;ph<3;ph++){
  g.allocateStaff(c4.id,2);
  g.endTurn();
  S=g.state();
  S.eventQueue=[];S.paused=false;
}
const h2=S.partyMachine.history[0];
check("district campaign released",h2.target==="sofia-city"&&S.partyMachine.campaigns.length===0);
check("district release adds local boost",(S.boost["sofia-city"].player||0)>0.05);
const leanC=g.launchCampaign({issue:actIssue,stance:"pro",target:"varna",name:"Lean run"});
for(let i=0;i<3;i++){g.endTurn();S=g.state();S.eventQueue=[];S.paused=false;}
const h3=S.partyMachine.history[0];
check("zero-staff campaign still releases",h3.staffWeeks===0);
check("zero-staff swing is small",h3.swing<1.0);

// 8. HQ upgrade + staff training
S.cash=1000000;
const costUp=g.partyHqUpgradeCost();
check("HQ upgrade cost defined",costUp===30000);
check("HQ upgrade works",g.upgradePartyHQ()===true&&S.partyMachine.hqLevel===2);
check("energy max grows with level",g.partyEnergyMax()===8&&g.partyStaffCap()===4);
check("upgrade capped at level 5",(()=>{for(let i=0;i<10;i++)g.upgradePartyHQ();return S.partyMachine.hqLevel===5&&g.partyHqUpgradeCost()===null;})());
const trainCash=S.cash;
const tc1=g.partyTrainCost(h0);
check("train to level 2",g.trainStaff(h0.id)===true&&h0.level===2&&S.cash===trainCash-tc1);
check("train to level 3",g.trainStaff(h0.id)===true&&h0.level===3);
check("train capped at level 3",g.trainStaff(h0.id)===false);
check("quality improves with levels",g.partyQuality()>1);
check("upkeep scales with levels",g.partyUpkeep()===3*1000+2*500);
check("hire now works at cap 4",g.hireStaff()!==null);

// 9. persistence
const clone=JSON.parse(JSON.stringify(S));
check("party machine survives save/load round trip",clone.partyMachine.hqLevel===5&&clone.partyMachine.history.length===3&&clone.partyMachine.staff.length===4);
const stripped=JSON.parse(JSON.stringify(S));
delete stripped.partyMachine;
global.localStorage.setItem("121towin-save-v5",JSON.stringify(stripped));
check("old saves migrate a fresh party machine",(()=>{const ok=g.loadGame();return ok&&!!g.state().partyMachine&&g.state().partyMachine.hqLevel===1&&g.state().partyMachine.staff.length===0;})());
S=g.state();
S.eventQueue=[];S.paused=false;

// 10. full sim to election
let aiLines=0;
while(S.phase==="campaign"){
  g.endTurn();
  S=g.state();
  if(S.phase!=="campaign")break;
  aiLines+=S.log.filter(l=>/kicks off a new campaign/.test(l.html)).length;
  S.eventQueue=[];S.paused=false;
}
check("election reached",S.phase==="election");
let sum=0;for(const k in S.results.seats)sum+=S.results.seats[k];
check("seat sum still 240",sum===240);
check("player stays competitive",(S.results.natShare.player||0)>=0.08);
check("AI flavor campaigns appear",aiLines>=3);
let shSum=0;for(const k in S.results.natShare)shSum+=S.results.natShare[k];
check("national shares sum to 1",Math.abs(shSum-1)<0.01);

console.log(pass+" passed, "+fail+" failed");
process.exit(fail?1:0);
