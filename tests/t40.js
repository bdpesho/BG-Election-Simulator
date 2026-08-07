// T40 regression: mobile-only UI rework — candidate top row (Start left, candidate
// centred, banner right), Fund/SP/Poll% strip hoisted under the topbar, clock row
// hoisted under the action cluster, district actions moved out of the inspector into
// a top cluster with a Rally popup (closes on outside tap), a News panel between the
// inspector and the log, and Help/Save/Debug/CHEAT folded into the Start menu.
// Desktop must stay untouched. Run: node tests/t40.js   (uses jsdom, a devDependency)
const fs=require("fs");
const path=require("path");
const {JSDOM}=require("jsdom");

const ROOT=path.join(__dirname,"..");
const html=fs.readFileSync(path.join(ROOT,"index.html"),"utf8");
const mapSrc=fs.readFileSync(path.join(ROOT,"mapdata.js"),"utf8");
const gameSrc=fs.readFileSync(path.join(ROOT,"game.js"),"utf8");
const css=fs.readFileSync(path.join(ROOT,"styles.css"),"utf8");

let pass=0,fail=0;
function check(name,cond){if(cond){pass++;console.log("PASS | "+name);}else{fail++;console.log("FAIL | "+name);}}

const DEFAULTS={euro:.60,corruption:.60,energy:.60,judiciary:.60,pensions:.60,healthcare:.60,defense:.50,rural:.60,migration:.50};

function boot(mobile){
  const dom=new JSDOM(html,{runScripts:"dangerously",pretendToBeVisual:true,url:"http://localhost/"});
  const {window}=dom;
  const {document}=window;
  window.alert=()=>{};
  if(mobile){
    Object.defineProperty(window,"matchMedia",{configurable:true,value:q=>({
      matches:q.indexOf("max-width:899px")>=0,media:q,
      addEventListener(){},addListener(){},removeListener(){}
    })});
  }
  window.module={exports:{}};
  window.addEventListener("error",e=>{window.__errs=(window.__errs||[]);window.__errs.push(String(e.message||e));});
  for(const src of[mapSrc,gameSrc]){
    const s=document.createElement("script");
    s.textContent=src;
    document.body.appendChild(s);
  }
  if(typeof window.init==="function")window.init();
  return dom;
}

// ---------- mobile (fake <=899px viewport) ----------
const domM=boot(true);
const {window:wm}=domM;
const {document:dm}=wm;
const gm=wm.module.exports;

check("mobile: HUD strip hoisted to top level under the topbar",!!dm.querySelector("#screen-game > #hud-stats")&&!dm.querySelector("#map-panel #hud-stats"));
check("mobile: clock row hoisted under the action cluster",!!dm.querySelector("#screen-game > .tb-center")&&!dm.querySelector("#topbar .tb-center"));
check("mobile: news panel markup exists below the main row",!!dm.querySelector("#screen-game > #news-bar")&&!!dm.querySelector("#news-bar #news-list"));
const mbActs=dm.getElementById("mobile-actions");
check("mobile: action cluster exists and starts empty",!!mbActs&&mbActs.textContent==="");

gm.setPlayer({name:"t40",abbr:"NOV",attrs:{stamina:8,charisma:4,intelligence:4},pos:DEFAULTS,difficulty:"normal"});
gm.startCampaign();
gm.virusDisarm(); // T39: keep the random virus event out of this flow
let Sm=gm.state();
check("mobile: action cluster shows the home district's actions immediately",!!dm.getElementById("btn-mb-rally"));
check("mobile: news panel becomes visible in campaign",dm.getElementById("news-bar").style.display==="flex");
check("mobile: news panel opens seeded with reports",dm.querySelectorAll("#news-list .news-line").length>=2);
gm.pushNews("<b>Election Commission</b> — test flash");
check("mobile: pushNews appends a line to the feed",dm.getElementById("news-list").textContent.indexOf("test flash")>=0);

const popM=dm.getElementById("mb-rally-pop");
check("mobile: rally options hidden in the popup until tapped",!!popM&&!popM.classList.contains("show")&&dm.querySelectorAll("#mb-rally-pop [data-act=rally]").length===5);
check("mobile: ads + HQ buttons moved to the top cluster",mbActs.textContent.indexOf("Local media ads")>=0&&mbActs.textContent.indexOf("Build Campaign HQ")>=0);
check("mobile: no travel button while the candidate is at home",mbActs.textContent.indexOf("Travel here")<0);
check("mobile: inspector still shows district info",dm.querySelector("#district-card .dc-head")!==null);

Sm.selDistrict=null;
gm.renderMobileActions();
check("mobile: no selection shows the tap hint",mbActs.textContent.indexOf("Tap a district")>=0);

const farNode=dm.querySelector('#bg-map .node[data-id="varna"]')||dm.querySelectorAll("#bg-map .node")[3];
farNode.dispatchEvent(new wm.MouseEvent("click",{bubbles:true}));
Sm=gm.state();
check("mobile: selecting a far district shows Travel instead",mbActs.textContent.indexOf("Travel here")>=0&&!dm.getElementById("btn-mb-rally"));
Sm.selDistrict=Sm.location;
gm.renderMobileActions();

dm.getElementById("btn-mb-rally").click();
const popM2=dm.getElementById("mb-rally-pop");
check("mobile: Rally button opens the popup with all 5 issue options",popM2.classList.contains("show")&&dm.querySelectorAll("#mb-rally-pop [data-act=rally]").length===5);
const rallyIssues=[...dm.querySelectorAll("#mb-rally-pop [data-act=rally]")].map(b=>b.dataset.issue);
check("mobile: rally options match the 5 active issues",rallyIssues.length===5&&Sm.activeIssues.every(id=>rallyIssues.includes(id))&&rallyIssues.every(id=>Sm.activeIssues.includes(id)));
dm.body.dispatchEvent(new wm.MouseEvent("pointerdown",{bubbles:true}));
check("mobile: tapping outside the cluster closes the rally popup",!dm.getElementById("mb-rally-pop").classList.contains("show"));
dm.getElementById("btn-mb-rally").click();
const spBefore=Sm.stamina;
dm.querySelectorAll("#mb-rally-pop [data-act=rally]")[0].click();
Sm=gm.state();
check("mobile: tapping a rally option spends SP",Sm.stamina<spBefore&&Sm.ralliesThisTurn===1);
check("mobile: rally popup collapses after use",!dm.getElementById("mb-rally-pop").classList.contains("show"));

Sm.cheat=true;
dm.getElementById("btn-start").click();
check("mobile: Start menu hosts Debug when cheat is on",!!dm.getElementById("m-debug"));
check("mobile: Start menu flags CHEAT MODE",dm.getElementById("modal-root").textContent.indexOf("CHEAT MODE ACTIVE")>=0);
dm.getElementById("m-debug").click();
check("mobile: Debug console opens from the Start menu",dm.getElementById("modal-root").textContent.indexOf("CHEAT CONSOLE")>=0);
check("mobile: no uncaught page errors",!(wm.__errs&&wm.__errs.length));

// ---------- desktop (default jsdom viewport) ----------
const domD=boot(false);
const {window:wd}=domD;
const {document:dd}=wd;
const gd=wd.module.exports;

check("desktop: HUD strip stays inside the map window",!!dd.querySelector("#map-panel #hud-stats #hud-cash")&&!!dd.querySelector("#map-panel #hud-stats #hud-stamina")&&!!dd.querySelector("#map-panel #hud-stats #hud-poll"));
check("desktop: clock row stays inside the topbar",!!dd.querySelector("#topbar .tb-center")&&!dd.querySelector("#screen-game > .tb-center"));
check("desktop: action cluster stays empty",dd.getElementById("mobile-actions").textContent==="");
gd.setPlayer({name:"t40",abbr:"NOV",attrs:{stamina:8,charisma:4,intelligence:4},pos:DEFAULTS,difficulty:"normal"});
gd.startCampaign();
gd.virusDisarm();
let Sd=gd.state();
check("desktop: news panel stays hidden",dd.getElementById("news-bar").style.display==="none");
const nodeD=dd.getElementById("map-"+Sd.location)||dd.querySelectorAll("#bg-map .node")[0];
nodeD.dispatchEvent(new wd.MouseEvent("click",{bubbles:true}));
Sd=gd.state();
check("desktop: rally buttons remain in the district inspector",dd.querySelectorAll("[data-act=rally]").length===5);
Sd.cheat=true;
dd.getElementById("btn-start").click();
check("desktop: Start menu has no Debug entry",!dd.getElementById("m-debug"));
check("desktop: no uncaught page errors",!(wd.__errs&&wd.__errs.length));

// ---------- mobile-only CSS knobs ----------
check("mobile CSS: help/save/debug/cheat leave the topbar",css.indexOf("#btn-help,#btn-save,#btn-debug,#tb-cheat{display:none!important;}")>=0);
check("mobile CSS: Start left, candidate centred, banner right",css.indexOf(".tb-left #btn-start{order:0; flex:none;}")>=0&&css.indexOf(".tb-left .pm-chip{order:1; flex:1; min-width:0; justify-content:center; text-align:center;}")>=0&&css.indexOf(".tb-left #tb-banner{order:2; flex:none;}")>=0);
check("mobile CSS: topbar stat chips hidden (HUD strip takes over)",css.indexOf(".tb-right{display:none;}")>=0);
check("mobile CSS: inspector action buttons hidden",css.indexOf(".dc-actions{display:none;}")>=0);
check("mobile CSS: rally options use a centred fixed popup",css.indexOf("#mb-rally-pop{display:none; position:fixed; inset:0; z-index:80; align-items:center; justify-content:center;")>=0&&css.indexOf("#mb-rally-pop.show{display:flex;}")>=0&&css.indexOf(".mb-rally-panel")>=0);
check("mobile CSS: clock row sits between the action cluster and the map",css.indexOf(".tb-center{order:4; width:100%; flex:none; justify-content:center; gap:2px;}")>=0);
check("mobile CSS: campaign screen locks to the viewport",css.indexOf("#screen-game{height:100dvh; min-height:0; overflow:hidden;")>=0&&css.indexOf("#game-main{order:5; flex:1 1 auto; min-height:0; overflow:hidden;}")>=0);
check("mobile CSS: inspector body scrolls internally",css.indexOf("#side-panel .window-body{max-height:none; overflow-y:auto; min-height:0;}")>=0);
check("mobile CSS: news and log have bounded inner panels",css.indexOf("#news-bar{order:6; display:flex; flex:0 0 clamp(64px,12dvh,100px);")>=0&&css.indexOf("#log-bar{order:7; flex:0 0 clamp(78px,14dvh,112px);")>=0);
check("mobile CSS: end screen owns its vertical scroll",css.indexOf("#screen-end{height:100dvh; min-height:0; overflow-x:hidden; overflow-y:auto;")>=0&&css.indexOf("#screen-end .end-wrap{width:calc(100% - 16px); margin:0 auto 20px; flex:0 0 auto;}")>=0);
check("mobile tooltip safety handles cancelled and scrolling gestures",gameSrc.indexOf("function bindMobilePreviewSafety()")>=0&&gameSrc.indexOf("[\"pointerup\",\"pointercancel\",\"touchend\",\"touchcancel\",\"touchmove\",\"scroll\"]")>=0);

console.log(pass+" passed, "+fail+" failed");
process.exit(fail?1:0);
