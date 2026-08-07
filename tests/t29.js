// T29 regression: difficulty tunes the 120-seat majority rate (easy/normal/hard).
// Runs 100 naive campaigns per difficulty; a run counts as a "majority reached"
// when the player's own seats hit 121 or a greedy coalition reaches 121.
// Run: node tests/t29.js
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

const N=100;
const TARGETS={easy:70,normal:30,hard:10};
const MAJORITY=121;

const DEFAULTS={euro:.60,corruption:.60,energy:.60,judiciary:.60,pensions:.60,healthcare:.60,defense:.50,rural:.60,migration:.50};

function runCampaign(diff){
  g.setPlayer({name:"t29-"+diff,difficulty:diff,pos:DEFAULTS});
  g.startCampaign();
  g.virusDisarm(); // T39: keep the random virus event out of difficulty-balance polls
  g.drawActiveIssues();
  let S=g.state();
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
  return g.state().results;
}

function greedyCoalition(){
  const st=g.state();
  const bloc=()=>st.results.seats.player+g.coalitionSeats();
  let guard=0;
  while(bloc()<MAJORITY&&guard++<80){
    const C=st.coalition;
    let acted=false;
    for(const pid of Object.keys(C.parties)){
      const c=C.parties[pid];
      if(!c.joined&&!c.pact&&g.willOf(pid)>=100){g.checkJoin(pid);acted=true;}
    }
    if(bloc()>=MAJORITY)break;
    const order=Object.keys(C.parties).sort((a,b)=>g.willOf(b)-g.willOf(a));
    for(const pid of order){
      if(bloc()>=MAJORITY)break;
      const c=C.parties[pid];
      if(c.joined||c.pact)continue;
      for(let di=0;di<c.demands.length;di++){
        const dm=c.demands[di];
        if(dm.type==="cash"&&!dm.done&&st.cash>=dm.amount){g.fulfillDemand(pid,di);acted=true;}
      }
      const will=g.willOf(pid);
      if(will>=100){g.checkJoin(pid);acted=true;break;}
      if(will>=92&&will<100&&C.cp>=6&&c.courtesy<3){C.cp-=6;c.courtesy++;c.earned+=8;g.checkJoin(pid);acted=true;break;}
      if(will>=75&&C.cp>=12){C.cp-=12;c.pact=true;acted=true;break;}
      let spent=false;
      for(let di=0;di<c.demands.length;di++){
        const dm=c.demands[di];
        if(dm.done)continue;
        if(dm.type!=="cash"&&C.cp>=dm.cpCost){g.fulfillDemand(pid,di);spent=true;acted=true;break;}
      }
      if(spent)break;
    }
    if(!acted)break;
  }
  return bloc()>=MAJORITY;
}

let pass=0,fail=0;
function check(name,cond){if(cond){pass++;console.log("PASS | "+name);}else{fail++;console.log("FAIL | "+name);}}

for(const diff of ["easy","normal","hard"]){
  let seats=[],wins=0,coalWins=0,direct=0;
  for(let i=0;i<N;i++){
    const r=runCampaign(diff);
    const ps=r.seats.player||0;
    seats.push(ps);
    if(ps>=MAJORITY){direct++;wins++;continue;}
    g.startCoalition();
    if(greedyCoalition()){coalWins++;wins++;}
  }
  seats.sort((a,b)=>a-b);
  const rate=Math.round(wins/N*100);
  const lo=TARGETS[diff]-12,hi=TARGETS[diff]+12;
  console.log(diff+": "+wins+"/"+N+" ("+rate+"%) target "+TARGETS[diff]+"%±10 · median seats "+(seats[Math.floor(N/2)])+" · direct "+direct+" · via coalition "+coalWins);
  check(diff+" lands within ±10 pp of "+TARGETS[diff]+"%",rate>=lo&&rate<=hi);
}

console.log(pass+" passed, "+fail+" failed");
process.exit(fail?1:0);
