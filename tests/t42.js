// T42 regression: phone sheet layout (<=600px) — map shell, six tabs,
// reparented inspector/news/log sheets, fixed actions, and desktop-safe behavior.
const fs=require("fs");
const path=require("path");
const {JSDOM}=require("jsdom");

const ROOT=path.join(__dirname,"..");
const html=fs.readFileSync(path.join(ROOT,"index.html"),"utf8");
const mapSrc=fs.readFileSync(path.join(ROOT,"mapdata.js"),"utf8");
const gameSrc=fs.readFileSync(path.join(ROOT,"game.js"),"utf8");
const css=fs.readFileSync(path.join(ROOT,"styles.css"),"utf8");
const DEFAULTS={euro:.60,corruption:.60,energy:.60,judiciary:.60,pensions:.60,healthcare:.60,defense:.50,rural:.60,migration:.50};

let pass=0,fail=0;
function check(name,cond){if(cond){pass++;console.log("PASS | "+name);}else{fail++;console.log("FAIL | "+name);}}
const dom=new JSDOM(html,{runScripts:"dangerously",pretendToBeVisual:true,url:"http://localhost/"});
const {window}=dom;
const {document}=window;
window.alert=()=>{};
Object.defineProperty(window,"matchMedia",{configurable:true,value:q=>({
  matches:q.indexOf("max-width:600px")>=0||q.indexOf("max-width:899px")>=0,media:q,addEventListener(){},addListener(){},removeListener(){}
})});
window.module={exports:{}};
window.addEventListener("error",e=>{window.__errs=(window.__errs||[]);window.__errs.push(String(e.message||e));});
for(const src of[mapSrc,gameSrc]){
  const s=document.createElement("script");
  s.textContent=src;
  document.body.appendChild(s);
}
if(typeof window.init==="function")window.init();
const g=window.module.exports;
g.setPlayer({name:"t42",abbr:"PHN",attrs:{stamina:8,charisma:4,intelligence:4},pos:DEFAULTS,difficulty:"normal"});
g.startCampaign();
g.virusDisarm();

check("phone tab bar has six sections",document.querySelectorAll("#mobile-tabbar [data-mobile-tab]").length===6);
check("phone shell keeps the map in the viewport",document.getElementById("map-panel").parentElement.id==="game-main"&&document.getElementById("mobile-tabbar"));
check("inspector moves into its sheet",document.getElementById("side-panel").parentElement.id==="mobile-inspector-slot");
check("news moves into its sheet",document.getElementById("news-bar").parentElement.id==="mobile-news-slot");
check("log moves into its sheet",document.getElementById("log-bar").parentElement.id==="mobile-log-slot");
check("End Week stays in the floating phone actions",!!document.getElementById("btn-mb-endturn"));

document.querySelector('[data-mobile-tab="district"]').click();
check("District tab opens the inspector sheet",document.getElementById("sheet-inspector").classList.contains("open")&&document.getElementById("mobile-inspector-title").textContent==="District");
document.querySelector('[data-mobile-tab="polls"]').click();
check("Polls tab reuses the inspector sheet",document.getElementById("sheet-inspector").classList.contains("open")&&document.getElementById("mobile-inspector-title").textContent==="National Polls");
document.querySelector('[data-mobile-tab="news"]').click();
check("News tab opens the news sheet",document.getElementById("sheet-news").classList.contains("open"));
check("Log badge counts unseen lines",!document.getElementById("mobile-log-badge").hidden);
document.querySelector('[data-mobile-tab="log"]').click();
check("Log tab opens the log sheet and clears its badge",document.getElementById("sheet-log").classList.contains("open")&&document.getElementById("mobile-log-badge").hidden);
document.querySelector('[data-mobile-tab="map"]').click();
check("Map tab closes the active sheet",!document.querySelector(".mobile-sheet.open")&&document.querySelector('[data-mobile-tab="map"]').classList.contains("active"));

check("phone CSS locks the campaign viewport",css.indexOf("#screen-game{\n    display:grid;")>=0&&css.indexOf("grid-template-rows:auto minmax(0,1fr) calc(44px + env(safe-area-inset-bottom));")>=0);
check("phone CSS allows sheet-body scrolling",css.indexOf(".sheet-body{flex:1; min-height:0; overflow-y:auto;")>=0);
check("phone CSS uses the 600px breakpoint",css.indexOf("@media (max-width:600px)")>=0);
check("no uncaught page errors",!(window.__errs&&window.__errs.length));
console.log(pass+" passed, "+fail+" failed");
process.exit(fail?1:0);
