// T38 regression: polish pass — layout (mobile overflow, bottom shelf, HUD beside map),
// alive-map pacing & text wrapping, centred mobile modals, party machine form state,
// and the clickable funds panel (current/expected/history).
// Run: node tests/t38.js   (uses jsdom, a devDependency)
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

const DEFAULTS={euro:.60,corruption:.60,energy:.60,judiciary:.60,pensions:.60,healthcare:.60,defense:.50,rural:.60,migration:.50};
g.setPlayer({name:"t38",abbr:"NOV",attrs:{stamina:8,charisma:4,intelligence:4},pos:DEFAULTS,difficulty:"normal"});
g.startCampaign();
g.virusDisarm(); // T39: keep the random virus event out of the ledger week check
const S=g.state();

// ---------- 1. layout skeleton ----------
check("inspector sits to the right of the map",!!document.querySelector("#game-main #map-panel")&&!!document.querySelector("#game-main #side-panel"));
check("campaign log is a full-width strip below the main row",!!document.querySelector("#screen-game > #log-bar")&&!document.querySelector("#bottom-shelf"));
check("HUD boxes live inside the map window",!!document.querySelector("#map-panel #hud-stats #hud-cash")&&!!document.querySelector("#map-panel #hud-stats #hud-stamina")&&!!document.querySelector("#map-panel #hud-stats #hud-poll"));
check("topbar stat chips carry icons",document.getElementById("tb-cash").querySelector(".sc-ico")!==null&&document.getElementById("tb-stamina").querySelector(".sc-ico")!==null&&document.getElementById("tb-poll").querySelector(".sc-ico")!==null);
check("HUD values mirror the topbar",document.getElementById("hud-cash").textContent.indexOf("лв")>=0&&document.getElementById("hud-stamina").textContent.indexOf("/")>=0&&document.getElementById("hud-poll").textContent.indexOf("%")>=0);

// ---------- 2. alive-map pacing: ~once per 15s, wrapped text ----------
check("alive loop waits >=13s between voices",g.ALIVE_MIN_WAIT>=13000);
const wrap=g.aliveWrap("Me imeto na baba mi — chervenata radula ot selo Draganovo, hora okolo, rakiya, musaka");
check("aliveWrap splits long quotes into lines",wrap.length>1);
check("aliveWrap caps at 3 lines",wrap.length<=3);
check("aliveWrap keeps lines inside the 250-unit width",wrap.every(l=>l.length*9.5<=250));
const wrapShort=g.aliveWrap("Kratko.");
check("aliveWrap keeps short quotes on one line",wrapShort.length===1&&wrapShort[0]==="Kratko.");
const sofia=g.DISTRICTS.find(d=>d.id==="sofia-city");
S.districtPoll["sofia-city"]={player:.45,gerb:.25,bsp:.15,dps:.05,others:.10};
const dot1=g.spawnAliveVoice();
const bx=document.getElementById("bg-map").querySelector("#alive-layer .alive-dot");
check("voice spawn respects text width margins",bx.getAttribute("cx")>=40&&bx.getAttribute("cx")<=960&&bx.getAttribute("cy")>=87&&bx.getAttribute("cy")<=533);

// ---------- 3. funds panel + history ----------
g.endTurn();
check("endTurn records the weekly cash ledger",Array.isArray(S.cashHist)&&S.cashHist.length===1&&S.cashHist[0].week===2&&S.cashHist[0].income>0);
check("history entry matches the new cash total",S.cashHist[0].cash===S.cash);
const bd=g.weeklyIncomeBreakdown();
check("expected weekly income is positive",bd.income>0);
check("income breakdown matches endTurn math",bd.income===S.cashHist[0].income);
g.openFundsModal();
const modal=document.getElementById("modal-root");
check("funds modal opens from the click path",modal.textContent.indexOf("CAMPAIGN FINANCES")>=0);
check("funds modal shows current funds",modal.textContent.indexOf("Current funds")>=0&&modal.textContent.indexOf("лв")>=0);
check("funds modal shows expected next week",modal.textContent.indexOf("Expected next week")>=0);
check("funds modal shows the ledger",modal.textContent.indexOf("Weekly cash history")>=0&&modal.textContent.indexOf("W2")>=0);
const closeBtn=document.getElementById("btn-close-funds");
check("funds modal has a working close button",!!closeBtn);
closeBtn.click();
check("funds modal closes",document.getElementById("modal-root").textContent==="");

// ---------- 4. party machine form state survives re-render ----------
S.paused=false;
const partyTab=[...document.querySelectorAll(".insp-tab")].find(b=>b.textContent.indexOf("Party Machine")>=0);
check("party machine tab exists",!!partyTab);
if(partyTab){
  partyTab.click();
  const issueEl=document.getElementById("pm-issue");
  check("party machine tab renders the campaign form",!!issueEl);
  if(issueEl&&issueEl.options.length>1){
    const pick1=issueEl.options[issueEl.options.length-1].value;
    issueEl.value=pick1;
    const nameEl=document.getElementById("pm-name");
    nameEl.value="Fresh start";
    g.renderDistrictCard();
    check("pm form selections persist across re-render",document.getElementById("pm-issue").value===pick1&&document.getElementById("pm-name").value==="Fresh start");
  }
}

// ---------- 5. colour picker is square and inline ----------
const cp=document.querySelector(".color-pickers input[type=color]");
check("custom colour picker sits beside the preset swatches",!!document.querySelector(".swatch-row #color-swatches")&&!!cp);
const cssA=fs.readFileSync(path.join(ROOT,"styles.css"),"utf8");
check("colour picker styled square like the preset swatches",cssA.indexOf("width:24px; height:24px; padding:0; background:#fff; border-radius:0;")>=0);

// ---------- 6. mobile CSS knobs present ----------
const css=fs.readFileSync(path.join(ROOT,"styles.css"),"utf8");
check("mobile: topbar right side wraps (no side-scroll)",css.indexOf(".tb-right{flex-wrap:wrap")>=0);
check("mobile: modals are centred, not bottom sheets",css.indexOf(".modal-back{align-items:center")>=0);
check("mobile: inspector is static and full-width under the map",css.indexOf("#side-panel{")>=0&&css.indexOf("position:static; width:100%")>=0);
check("mobile: inspector body stays inside the fixed campaign viewport",css.indexOf("#side-panel .window-body{max-height:none; overflow-y:auto; min-height:0;}")>=0&&css.indexOf("#screen-game{height:100dvh; min-height:0; overflow:hidden;")>=0);

check("no uncaught page errors",!(window.__errs&&window.__errs.length));
console.log(pass+" passed, "+fail+" failed");
process.exit(fail?1:0);
