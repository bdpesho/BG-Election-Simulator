// T12 + T28 + T30 regression: expected-effects previews, turnout/enthusiasm realism, 80% event frequency.
// Run: node tests/t12.js
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
function hover(el){el.dispatchEvent(new window.MouseEvent("mouseenter",{bubbles:true}));}
function leave(el){el.dispatchEvent(new window.MouseEvent("mouseleave",{bubbles:true}));}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));

(async function main(){
// ---------- T12: expected-effects preview (floating tooltip) ----------
click(document.getElementById("btn-new-game"));
g.startCampaign();
g.virusDisarm(); // T39: keep the random virus event out of poll-effect checks
let S=g.state();
const tip=()=>document.getElementById("preview-tip");
const tipText=()=>tip()?tip().textContent:"";
const tipVisible=()=>tip()&&tip().style.display==="block";

// every action button produces a floating preview on hover (after the 200ms delay)
const rallyBtn=document.querySelector("[data-act=rally]");
const adBtn=document.querySelector("[data-act=ad]");
const hqBtn=document.querySelector("[data-act=hq]");
hover(rallyBtn);
await sleep(250);
check("rally hover shows a floating preview",tipVisible()&&tipText().indexOf("YOU ≈")>=0);
check("tip follows the cursor (fixed, pointer-events none)",tip().style.position==="fixed"&&tip().style.pointerEvents==="none");
leave(rallyBtn);
check("preview hides on leave",!tipVisible()||tipText()==="");
hover(adBtn);
await sleep(250);
check("ad hover shows a preview",tipVisible()&&tipText().indexOf("YOU ≈")>=0);
leave(adBtn);
hover(hqBtn);
await sleep(250);
check("HQ hover shows a preview",tipVisible()&&(tipText().indexOf("YOU ≈")>=0||tipText().indexOf("income")>=0));
leave(hqBtn);

// tip does not appear instantly (200ms delay)
hover(rallyBtn);
await sleep(100);
check("tip does not appear before the delay",!tipVisible());
await sleep(200);
check("tip appears after the delay",tipVisible());
leave(rallyBtn);

// hovering never mutates state
const boostBefore=JSON.stringify(S.boost);
hover(rallyBtn);await sleep(250);leave(rallyBtn);hover(adBtn);await sleep(250);leave(adBtn);
check("hovering never mutates state",JSON.stringify(S.boost)===boostBefore);

// preview math matches the actual applied delta
const dId=S.location;
const before=S.districtPoll[dId].player;
const pv=g.previewRally(rallyBtn.dataset.issue);
click(rallyBtn);
S=g.state();
const after=S.districtPoll[dId].player;
check("preview rally delta == actual delta",Math.abs((after-before)-pv.youDelta)<0.0005);
check("preview rivals delta mirrors",Math.abs(pv.rivalDelta+pv.youDelta)<1e-9);

// travel preview shows cost + poll snapshot
click(document.querySelectorAll("#bg-map .node")[1]);
S=g.state();
const travelBtn=document.querySelector("[data-act=travel]");
hover(travelBtn);
await sleep(250);
check("travel preview shows SP cost + poll",tipVisible()&&tipText().indexOf("SP")>=0&&tipText().indexOf("Poll there")>=0);
leave(travelBtn);

// coalition demand hover preview
// run the campaign to the election, then into coalition
S.eventQueue=[];S.paused=false;
let weeks=0;
while(S.phase==="campaign"&&weeks<25){
  g.endTurn();
  S=g.state();
  let innerGuard=0;
  while(S.paused&&innerGuard<60){
    if(S.debate&&S.debate.q){
      if(S.debate.i<0){const go=document.getElementById("db-go");if(go)click(go);}
      else{for(let qi=S.debate.i;qi<8;qi++)g.debateAnswer(0);const done=document.getElementById("db-done");if(done)click(done);}
      S=g.state();
      innerGuard++;
      continue;
    }
    const btns=document.querySelectorAll("#modal-root .ev-opts .btn");
    if(!btns.length){S.paused=false;break;}
    click(btns[0]);
    S=g.state();
    innerGuard++;
  }
  weeks++;
}
S=g.state();
check("election reached for coalition test",S.phase==="election");
if(S.phase==="election"&&(S.results.seats.player||0)>0&&(S.results.seats.player||0)<121){
  g.startCoalition();
  S=g.state();
  const chip=document.querySelector("#coalition-cards .demand-chip:not([disabled])")||document.querySelector("#coalition-cards .demand-chip");
  if(chip){
    chip.dispatchEvent(new window.MouseEvent("mouseenter",{bubbles:true}));
    await sleep(250);
    check("coalition demand hover shows cost + willingness",tipVisible()&&tipText().indexOf("willingness")>=0&&(tipText().indexOf("CP")>=0||tipText().indexOf("лв")>=0));
    leave(chip);
  }else{check("coalition demand hover shows cost + willingness",false);}
}else{
  check("coalition demand hover shows cost + willingness",true);
}

// ---------- T28: turnout & enthusiasm realism ----------
S=g.state();
if(S.results&&S.results.turnouts){
  const ts=Object.values(S.results.turnouts);
  check("every district turnout in [0.25,0.60]",ts.every(t=>t>=0.25&&t<=0.60));
  check("national turnout in [0.25,0.60]",S.results.turnout>=0.25&&S.results.turnout<=0.60);
}else{
  check("every district turnout in [0.25,0.60]",false);
  check("national turnout in [0.25,0.60]",false);
}
// enthusiasm display: realistic re-based scale, label matches bar, never >100%
g.startCampaign();
S=g.state();
const enthUI=()=>({
  lbl:[...document.querySelectorAll("#district-card .dc-enthusiasm .mini-label span")].map(s=>s.textContent).join("|"),
  bar:document.querySelector("#district-card .dc-enthusiasm .bar .fill").style.width
});
click(document.querySelector('#bg-map .node[data-id="sofia-city"]'));
let ui=enthUI();
check("base district enthusiasm reads realistically ("+ui.lbl.split("|")[1]+")",ui.lbl.split("|")[1]==="64%"&&ui.bar==="64%");
for(const d of g.DISTRICTS)S.enthusiasm[d.id]=1.4;
g.recomputePolls();
click(document.querySelector('#bg-map .node[data-id="sofia-city"]'));
ui=enthUI();
check("max enthusiasm capped at 100%, bar matches",ui.lbl.split("|")[1]==="100%"&&ui.bar==="100%");
// election screen header shows a sane turnout percent (no 4508% style bug)
const subText=document.getElementById("election-sub").textContent;
const tm=subText.match(/Turnout (\d+)%/);
check("election screen turnout header sane ("+subText.slice(0,14)+")",tm&&+tm[1]>=25&&+tm[1]<=60);

// ---------- T30: ~80% of weeks have events ----------
g.startCampaign();
S=g.state();
const eventsPerCall=[];
window.showNextEvent=function(){
  eventsPerCall.push(S.eventQueue.length);
  S.eventQueue=[];S.paused=false;
};
for(let i=0;i<1000;i++)g.maybeEvents();
const evWeeks=eventsPerCall.filter(n=>n>0).length;
const pctEv=evWeeks/10;
check("events in ~80% of weeks ("+pctEv.toFixed(1)+"%)",pctEv>=76&&pctEv<=84);

// no uncaught page errors
check("no uncaught page errors",(window.__errs||[]).length===0);

console.log(pass+" passed, "+fail+" failed");
process.exit(fail?1:0);
})();
