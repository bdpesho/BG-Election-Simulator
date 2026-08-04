// T36 regression: political compass click selector and slider synchronization.
const fs=require("fs");
const path=require("path");
const {JSDOM}=require("jsdom");

const ROOT=path.join(__dirname,"..");
const dom=new JSDOM(fs.readFileSync(path.join(ROOT,"index.html"),"utf8"),{runScripts:"dangerously",pretendToBeVisual:true,url:"http://localhost/"});
const {window}=dom;
window.alert=()=>{};
window.module={exports:{}};
for(const file of["mapdata.js","game.js"]){
  const script=window.document.createElement("script");
  script.textContent=fs.readFileSync(path.join(ROOT,file),"utf8");
  window.document.body.appendChild(script);
}
if(typeof window.init==="function")window.init();
const g=window.module.exports;
const document=window.document;
let pass=0,fail=0;
function check(name,cond){if(cond){pass++;console.log("PASS | "+name);}else{fail++;console.log("FAIL | "+name);}}

document.getElementById("btn-new-game").click();
const compass=document.getElementById("political-compass");
const S=g.state();
check("compass appears during platform setup",!!compass&&document.getElementById("platform-sliders").children.length===5);
check("compass has four standard quadrants",["compass-auth-left","compass-auth-right","compass-lib-left","compass-lib-right"].every(c=>compass.querySelector("."+c)));
const sliders=document.getElementById("platform-sliders");
check("banner workshop precedes platform sliders",!!document.getElementById("banner-preview")&&!!(document.getElementById("banner-preview").compareDocumentPosition(sliders)&window.Node.DOCUMENT_POSITION_FOLLOWING));
check("compass and sliders share the platform controls",compass.closest(".platform-controls")===sliders.closest(".platform-controls"));

Object.defineProperty(compass,"getBoundingClientRect",{value:()=>({left:0,top:0,width:300,height:300})});
compass.dispatchEvent(new window.MouseEvent("click",{bubbles:true,clientX:270,clientY:30}));
check("top-right click stores compass coordinates",S.party.compass.x>.7&&S.party.compass.y>.7);
check("top-right click changes the platform sliders",S.party.pos.euro>.5&&S.party.pos.migration>.5&&S.party.pos.energy<.5);
check("top-right click updates visible slider values",[...document.querySelectorAll("#platform-sliders input")].some(i=>i.value!=="60"));

compass.dispatchEvent(new window.MouseEvent("pointerdown",{bubbles:true,clientX:270,clientY:30}));
compass.dispatchEvent(new window.MouseEvent("pointermove",{bubbles:true,clientX:30,clientY:270}));
compass.dispatchEvent(new window.MouseEvent("pointerup",{bubbles:true,clientX:30,clientY:270}));
check("dragging moves the compass continuously",S.party.compass.x<-.7&&S.party.compass.y<-.7);
compass.dispatchEvent(new window.MouseEvent("pointerdown",{bubbles:true,clientX:30,clientY:30}));
check("authoritarian-left maps healthcare near Public Care",S.party.compass.x<-.7&&S.party.compass.y>.7&&S.party.pos.healthcare>.9);
compass.dispatchEvent(new window.MouseEvent("pointerup",{bubbles:true,clientX:30,clientY:30}));
const hitArea=compass.querySelector(".compass-hit-area");
hitArea.dispatchEvent(new window.MouseEvent("click",{bubbles:true,clientX:0,clientY:300}));
check("bottom-left edge remains clickable",S.party.compass.x<=-0.99&&S.party.compass.y<=-0.99);

g.setCompassPosition(0,0);
const manualSlider=document.querySelector("#platform-sliders input");
const compassBefore=S.party.compass.x;
manualSlider.value="0";
manualSlider.dispatchEvent(new window.Event("input",{bubbles:true}));
check("manual slider changes update compass position",Math.abs(S.party.compass.x-compassBefore)>.01);
check("compass marker has an accessible position title",!!document.getElementById("compass-marker").title);

console.log(pass+" passed, "+fail+" failed");
process.exit(fail?1:0);
