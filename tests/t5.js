// T5 regression: full party colour picker + expanded banner backgrounds.
// Run: node tests/t5.js
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

// open the setup screen so S exists with party state
click(document.getElementById("btn-new-game"));

// helper to grab the live game state through the exported API (state isn't exposed on window,
// but setPartyColor/renderSwatches touch the DOM we can read)
const hexField=document.getElementById("in-party-hex");
const colorInput=document.getElementById("in-party-color");
const preview=document.getElementById("banner-preview");
const swatches=()=>document.querySelectorAll("#color-swatches .swatch").length;

// 1. banner background library
check("BGSTYLES expanded (≥10)",g.BGSTYLES.length>=10);
check("names match styles",g.BGSTYLE_NAMES.length===g.BGSTYLES.length);
let allBgValid=true;
for(const fn of g.BGSTYLES){
  const s=fn("#00966e","#005b42");
  if(typeof s!=="string"||s.indexOf("background:")!==0)allBgValid=false;
}
check("every style produces a background string",allBgValid);

// 2. hex validation
check("valid #rrggbb accepted",g.normHex("#00966e")==="#00966e");
check("bare 6-digit accepted",g.normHex("00FF00")==="#00ff00");
check("3-digit expands",g.normHex("#0f0")==="#00ff00");
check("invalid rejected",g.normHex("#zzzzzz")===null&&g.normHex("red")===null&&g.normHex("#12345")===null);

// 3. hex field applies valid colours
hexField.value="#112233";
hexField.dispatchEvent(new window.Event("input",{bubbles:true}));
check("hex input applies colour",preview.innerHTML.indexOf("#112233")>=0);
check("color input synced",colorInput.value==="#112233");
check("swatches re-rendered",swatches()>0);

// 4. invalid hex does not apply, flags the field
hexField.value="nope";
hexField.dispatchEvent(new window.Event("input",{bubbles:true}));
check("invalid hex ignored",preview.innerHTML.indexOf("#112233")>=0&&preview.innerHTML.indexOf("nope")<0);
check("invalid class set",hexField.classList.contains("invalid"));
hexField.dispatchEvent(new window.Event("change",{bubbles:true}));
check("change reverts invalid text",hexField.value==="#112233"&&!hexField.classList.contains("invalid"));

// 5. swatch click still works and picks palette colours
const firstSwatch=document.querySelector("#color-swatches .swatch");
click(firstSwatch);
check("swatch click applies",preview.innerHTML.indexOf(firstSwatch.dataset.c)>=0);

// 6. banner style carousel cycles through all 13
const bgLabel=document.getElementById("bg-label");
const startLabel=bgLabel.textContent;
let seen=new Set(),clicks=0;
while(clicks<g.BGSTYLES.length){
  click(document.getElementById("btn-bg-next"));
  seen.add(bgLabel.textContent);
  clicks++;
}
check("carousel visits every style",seen.size===g.BGSTYLES.length);
check("carousel wraps to start",bgLabel.textContent===startLabel);

// 7. contrast works for wild colours
check("contrast: black→white text",g.contrast("#000000")==="#ffffff");
check("contrast: white→dark text",g.contrast("#ffffff")==="#101826");

// 7b. color picker is not inside a label (label click re-opens the native popup — bugfix)
check("color input not wrapped in a label",document.getElementById("in-party-color").closest("label")===null);
check("banner text now carries a readability glow",preview.innerHTML.indexOf("text-shadow:0 0 4px")>=0);

// 7c. emblem library expanded and every emblem renders
check("EMBLEM_IDS expanded (≥20)",g.EMBLEM_IDS.length>=20);
let allEmblemsOk=true;
for(const id of g.EMBLEM_IDS){
  const svg=g.emblemSVG(id,"#ffffff",52);
  if(svg.indexOf("<svg")!==0||svg.indexOf("<g")<0)allEmblemsOk=false;
}
check("every emblem id renders",allEmblemsOk);
const embLabel=document.getElementById("emb-label");
const embStart=embLabel.textContent;
let embSeen=new Set(),embClicks=0;
while(embClicks<g.EMBLEM_IDS.length){
  click(document.getElementById("btn-emb-next"));
  embSeen.add(embLabel.textContent);
  embClicks++;
}
check("emblem carousel visits every emblem",embSeen.size===g.EMBLEM_IDS.length);
check("emblem carousel wraps",embLabel.textContent===embStart);

// 8. custom colour persists through save/load and reaches the campaign UI
hexField.value="#112233";
hexField.dispatchEvent(new window.Event("input",{bubbles:true}));
document.getElementById("btn-setup-next").click();
document.getElementById("btn-setup-next").click();
document.getElementById("btn-setup-next").click();
g.saveGame();
g.loadGame();
const tb=document.getElementById("tb-banner");
check("custom colour reaches the campaign UI",tb&&tb.style.background==="rgb(17, 34, 51)");

check("no uncaught page errors",(window.__errs||[]).length===0);
if((window.__errs||[]).length)console.log("errors:",window.__errs.join(" | "));
console.log(pass+" passed, "+fail+" failed");
dom.window.close();
process.exit(fail?1:0);
