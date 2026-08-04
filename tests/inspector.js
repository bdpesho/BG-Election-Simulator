// T8 regression: XP topbar (Start button), setup over-budget UI error, district inspector tabs + national polling estimate.
// Run: node tests/inspector.js   (uses jsdom, a devDependency)
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
window.alert=()=>{window.__alerts=(window.__alerts||0)+1;};
window.addEventListener("error",e=>{window.__errs=(window.__errs||[]);window.__errs.push(String(e.message||e));});
for(const src of[mapSrc,gameSrc]){
  const s=document.createElement("script");
  s.textContent=src;
  document.body.appendChild(s);
}
if(typeof window.init==="function")window.init();
const $=id=>document.getElementById(id);

let pass=0,fail=0;
function check(name,cond){if(cond){pass++;console.log("PASS | "+name);}else{fail++;console.log("FAIL | "+name);}}
function click(el){el.dispatchEvent(new window.MouseEvent("click",{bubbles:true}));}
function setAttr(k,v){const el=document.getElementById("in-attr-"+k);el.value=v;el.dispatchEvent(new window.Event("input",{bubbles:true}));}
function tabBy(t){return [...document.querySelectorAll(".insp-tab")].find(b=>b.dataset.tab===t);}

// 1. start setup
click(document.getElementById("btn-new-game"));
check("setup screen active",document.getElementById("screen-setup").classList.contains("active"));

// 2. over budget -> UI error, no alert()
setAttr("stamina",8);setAttr("charisma",8);setAttr("intelligence",8);
click(document.getElementById("btn-setup-next"));
const err=document.getElementById("setup-error");
check("over-budget shows UI error",err.style.display==="block"&&err.textContent.indexOf("budget of 15")>=0);
check("no alert() called",window.__alerts===undefined||window.__alerts===0);
check("still on step 0",document.getElementById("setup-step-0").classList.contains("active"));

// 3. fix budget, proceed through setup
setAttr("stamina",5);setAttr("charisma",5);setAttr("intelligence",5);
click(document.getElementById("btn-setup-next"));
check("error cleared on fixed attrs",err.style.display!=="block");
click(document.getElementById("btn-setup-next"));
click(document.getElementById("btn-setup-next"));
check("campaign screen active",document.getElementById("screen-game").classList.contains("active"));

// 4. inspector tabs
const tabs=document.querySelectorAll(".insp-tab");
check("three inspector tabs",tabs.length===3);
check("district view by default",document.querySelector("#district-card .dc-head b")!==null);
check("sofia selected on map",document.querySelectorAll(".node.sel").length===1);

// 4b. party machine tab
click(tabBy("party"));
check("party tab active",tabBy("party").classList.contains("active"));
check("map selection cleared on party tab",document.querySelectorAll(".node.sel").length===0);
check("party machine head renders",document.querySelector(".pm-head")!==null);
check("party machine form renders",document.querySelector(".pm-form")!==null&&document.querySelectorAll(".pm-form select").length===3);
check("party machine energy bar renders",document.querySelector(".pm-head .bar .fill")!==null);

// 5. national polling tab
click(tabBy("national"));
check("national tab active",tabBy("national").classList.contains("active"));
check("map selection cleared",document.querySelectorAll(".node.sel").length===0);
const npRows=document.querySelectorAll(".np-row");
check("national rows rendered",npRows.length>=10);
const seats=[...document.querySelectorAll(".np-seats")].map(e=>parseInt((e.textContent||"").replace("~",""),10)||0).reduce((a,b)=>a+b,0);
check("projected seats sum to 240",seats===240);
check("estimate caveat shown",document.querySelector(".np-note")!==null);
check("player projected seats shown",(document.querySelector(".np-sum")||{}).textContent?document.querySelector(".np-sum").textContent.indexOf("seats")>=0:false);

// 6. district tab with no selection -> empty state
click(tabBy("district"));
check("empty state when no district selected",document.querySelector(".dc-empty")!==null);

// 7. clicking a map node re-selects and switches back to the district tab
const node=document.querySelector('.node[data-id="plovdiv-obl"]');
node.dispatchEvent(new window.MouseEvent("click",{bubbles:true}));
const head=document.querySelector("#district-card .dc-head b");
check("map click shows plovdiv district",head!==null&&head.textContent==="Plovdiv Oblast");
check("map selection restored",document.querySelectorAll(".node.sel").length===1);
check("tab switched back to district",tabBy("district").classList.contains("active"));

// 8. XP topbar Start button opens the menu modal
const startBtn=document.getElementById("btn-start");
check("start button exists",startBtn!==null);
click(startBtn);
check("start button opens menu modal",document.getElementById("m-resume")!==null);

check("no uncaught page errors",(window.__errs||[]).length===0);
if((window.__errs||[]).length)console.log("errors:",window.__errs.join(" | "));
console.log(pass+" passed, "+fail+" failed");
dom.window.close();
process.exit(fail?1:0);
