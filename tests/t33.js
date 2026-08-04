// T33 regression: exceptional BSP/ITN form without changing protected threshold parties.
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
let pass=0,fail=0;
function check(name,cond){if(cond){pass++;console.log("PASS | "+name);}else{fail++;console.log("FAIL | "+name);}}

let bspExceptional=0,itnSpikes=0,seenSurge=false,seenSlump=false,invalidRoll=false,maxBsp=0;
const protectedIn=["gerb","pb","ppdb","dps","vaz"];
const protectedOut=["mech","aps","velichie"];
for(let i=0;i<500;i++){
  g.startCampaign();
  const S=g.state();
  for(const id in S.perfMod){
    const m=S.perfMod[id];
    if(!["bsp","itn"].includes(id))invalidRoll=true;
    if(m.type==="surge"){
      seenSurge=true;
      if(m.value<.04||m.value>.07||m.factor<3.8||m.factor>5)invalidRoll=true;
    }
    if(m.type==="slump"){
      seenSlump=true;
      if(m.value!==-.03)invalidRoll=true;
    }
  }
  g.runElection();
  const share=S.results.natShare;
  maxBsp=Math.max(maxBsp,share.bsp||0);
  if((share.bsp||0)>=.15)bspExceptional++;
  if((share.itn||0)>=.04)itnSpikes++;
  for(const id of protectedIn)if((share[id]||0)<.04)invalidRoll=true;
  for(const id of protectedOut)if((share[id]||0)>=.04)invalidRoll=true;
}
check("BSP reaches 15% in at least 5% of runs",bspExceptional>=25);
check("ITN occasionally clears the threshold",itnSpikes>0);
check("performance rolls only use BSP and ITN",!invalidRoll);
check("surges and slumps both occur in the sample",seenSurge&&seenSlump);

console.log(pass+" passed, "+fail+" failed");
process.exit(fail?1:0);
