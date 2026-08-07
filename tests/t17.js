// T17 regression: mobile friendliness — drawer, collapsible log, map zoom, mobile CSS.
// Run: node tests/t17.js   (uses jsdom, a devDependency)
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
for(const src of[fs.readFileSync(path.join(ROOT,"mapdata.js"),"utf8"),fs.readFileSync(path.join(ROOT,"game.js"),"utf8")]){
  const s=document.createElement("script");
  s.textContent=src;
  document.body.appendChild(s);
}
if(typeof window.init==="function")window.init();
const g=window.module.exports;

let pass=0,fail=0;
function check(name,cond){if(cond){pass++;console.log("PASS | "+name);}else{fail++;console.log("FAIL | "+name);}}
function click(el){el.dispatchEvent(new window.MouseEvent("click",{bubbles:true}));}

// ---------- 1. mobile CSS + markup present ----------
const css=fs.readFileSync(path.join(ROOT,"styles.css"),"utf8");
check("media query for <=899px exists",css.indexOf("@media (max-width:899px)")>=0);
check("map canvas wrapper exists",!!document.getElementById("map-canvas")&&!!document.getElementById("bg-map"));
check("drawer backdrop exists",!!document.getElementById("drawer-backdrop"));
check("inspector drawer toggle button exists",!!document.getElementById("btn-panel-toggle"));
check("tap targets enforced at 44px on mobile",css.indexOf("min-height:44px")>=0);
check("rally buttons become a 2x2 grid on mobile",css.indexOf("grid-template-columns:repeat(2,1fr)")>=0);
check("modals stay centred on mobile (T38)",css.indexOf(".modal-back{align-items:center")>=0);
check("labels declutter when zoomed out",css.indexOf("zoomed-out")>=0);
check("map canvas disables touch scrolling",css.indexOf("touch-action:none")>=0);

// ---------- 2. drawer toggle ----------
click(document.getElementById("btn-new-game"));
g.startCampaign();
const panel=document.getElementById("side-panel");
const backdrop=document.getElementById("drawer-backdrop");
check("drawer closed by default",!panel.classList.contains("open")&&!backdrop.classList.contains("show"));
click(document.getElementById("btn-panel-toggle"));
check("toggle opens the drawer",panel.classList.contains("open")&&backdrop.classList.contains("show"));
click(document.getElementById("btn-panel-toggle"));
check("toggle closes the drawer",!panel.classList.contains("open")&&!backdrop.classList.contains("show"));
click(document.getElementById("btn-panel-toggle"));
click(backdrop);
check("backdrop click closes the drawer",!panel.classList.contains("open"));
click(document.getElementById("btn-panel-toggle"));
click(document.querySelector('#bg-map .node[data-id="plovdiv-city"]')||document.getElementById("map-canvas"));
if(panel.classList.contains("open")){
  click(document.getElementById("btn-panel-toggle"));
}
check("drawer can be re-closed after map selection",!panel.classList.contains("open"));

// ---------- 3. collapsible log ----------
const logBar=document.getElementById("log-bar");
const logTitle=logBar.querySelector(".title-bar");
click(logTitle);
check("log collapses on title-bar click",logBar.classList.contains("collapsed"));
click(logTitle);
check("log re-expands",!logBar.classList.contains("collapsed"));

// ---------- 4. map zoom: wheel + reset ----------
const canvas=document.getElementById("map-canvas");
const svg=document.getElementById("bg-map");
canvas.dispatchEvent(new window.WheelEvent("wheel",{deltaY:-300,bubbles:true,cancelable:true}));
check("wheel zooms the map in",(svg.style.transform||"").indexOf("scale(1.5")>=0||parseFloat((svg.style.transform||"scale(1)").match(/scale\(([\d.]+)\)/)[1])>1);
check("zoomed-out class toggles",canvas.classList.contains("zoomed-out")===false);
canvas.dispatchEvent(new window.WheelEvent("wheel",{deltaY:2000,bubbles:true,cancelable:true}));
const sc=parseFloat((svg.style.transform||"scale(1)").match(/scale\(([\d.]+)\)/)[1]);
check("zoom clamps at 0.6",sc>=0.6&&sc<=4);
check("zoomed-out class appears when small",canvas.classList.contains("zoomed-out")===true);
canvas.dispatchEvent(new window.MouseEvent("dblclick",{bubbles:true}));
check("dblclick resets the zoom",(svg.style.transform||"").indexOf("scale(1)")>=0&&!canvas.classList.contains("zoomed-out"));

// ---------- 5. click-through: a tap must not pan/capture, a drag must pan ----------
canvas.getBoundingClientRect=()=>({left:0,top:0,right:800,bottom:400,x:0,y:0,width:800,height:400,toJSON:()=>{}});
const pd=(id,x,y)=>canvas.dispatchEvent(new window.PointerEvent("pointerdown",{pointerId:id,clientX:x,clientY:y,bubbles:true}));
const pm=(id,x,y)=>canvas.dispatchEvent(new window.PointerEvent("pointermove",{pointerId:id,clientX:x,clientY:y,bubbles:true}));
const pu=(id,x,y)=>canvas.dispatchEvent(new window.PointerEvent("pointerup",{pointerId:id,clientX:x,clientY:y,bubbles:true}));
pd(1,10,10);pu(1,10,10);
check("plain tap leaves the map transform untouched",(svg.style.transform||"translate(0px,0px) scale(1)").indexOf("scale(1)")>=0);
canvas.dispatchEvent(new window.WheelEvent("wheel",{deltaY:-600,clientX:0,clientY:0,bubbles:true,cancelable:true}));
pd(1,10,10);pm(1,-40,-20);pu(1,-40,-20);
const panT=(svg.style.transform||"").match(/translate\(([-\d.]+)px,([-\d.]+)px\)/);
check("drag pans the map",panT&&Math.abs(parseFloat(panT[1])+50)<0.5&&Math.abs(parseFloat(panT[2])+30)<0.5);
canvas.dispatchEvent(new window.MouseEvent("dblclick",{bubbles:true}));

// ---------- 6. wheel + pinch anchor at the pointer, not the top-left ----------
canvas.dispatchEvent(new window.WheelEvent("wheel",{deltaY:-300,clientX:100,clientY:50,bubbles:true,cancelable:true}));
const s2=parseFloat((svg.style.transform||"scale(1)").match(/scale\(([\d.]+)\)/)[1]);
const t2=(svg.style.transform||"").match(/translate\(([-\d.]+)px,([-\d.]+)px\)/);
const worldX=t2?(100-parseFloat(t2[1]))/s2:100;
check("wheel keeps the point under the cursor fixed",Math.abs(worldX-100)<0.01);
canvas.dispatchEvent(new window.MouseEvent("dblclick",{bubbles:true}));
pd(1,200,100);pd(2,300,150);
pm(2,330,175);
const s3=parseFloat((svg.style.transform||"scale(1)").match(/scale\(([\d.]+)\)/)[1]);
check("pinch zooms in around the finger midpoint",s3>1&&s3<2.5);
pu(1,220,110);pu(2,330,175);
canvas.dispatchEvent(new window.MouseEvent("dblclick",{bubbles:true}));
check("dblclick resets after gestures",(svg.style.transform||"").indexOf("scale(1)")>=0);

check("no uncaught page errors",!(window.__errs&&window.__errs.length));
console.log(pass+" passed, "+fail+" failed");process.exit(fail?1:0);
