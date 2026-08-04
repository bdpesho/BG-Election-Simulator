// T15 regression: district geo axes, demographics, districtsWhere, and geo-driven identity modifiers.
// Run: node tests/t15.js
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

const AXES=["proEU","proRussia","proNATO","proUS","nationalism","turkishMinority","urbanization"];
const DEMO=["turkishShare","romaShare"];

// 1. every district carries all axes + demographics, values in [0,1]
let axesOk=true,demoOk=true,ethMirror=true;
for(const d of g.DISTRICTS){
  for(const a of AXES.concat(DEMO)){
    const v=d.geo&&d.geo[a];
    if(typeof v!=="number"||v<0||v>1)axesOk=false;
  }
  for(const k of DEMO)if(d.geo[k]!==(d.eth[k.replace("Share","")]||0))demoOk=false;
  if(d.geo.turkishMinority!==(d.eth.turkish||0))ethMirror=false;
}
check("all 29 districts have the 7 geo axes in [0,1]",axesOk&&g.DISTRICTS.length===29);
check("turkishShare/romaShare mirror the census eth field",demoOk);
check("turkishMinority axis mirrors eth.turkish",ethMirror);

// 2. districtsWhere behaves
const proRussia=()=>g.districtsWhere("proRussia",0.5);
const proRussiaList=proRussia();
check("districtsWhere('proRussia',0.5) is non-empty",proRussiaList.length>0);
check("northwest + nationalist belt are pro-Russia",["vidin","montana","vratsa","sliven","yambol"].every(id=>proRussiaList.includes(id)));
check("Sofia City is NOT pro-Russia",!proRussiaList.includes("sofia-city"));
const turkishBelt=g.districtsWhere("turkishMinority",0.28).sort();
check("Turkish belt = Kardzhali, Razgrad, Targovishte, Shumen",turkishBelt.join(",")==="kardzhali,razgrad,shumen,targovishte");
const urban=g.districtsWhere("urbanization",0.85).sort();
check("urban core = Sofia City, Plovdiv, Varna",urban.join(",")==="plovdiv-city,sofia-city,varna");
check("max bound respected",g.districtsWhere("urbanization",0.9,0.96).length===0);

// 3. identity modifiers still match the previous hardcoded-list behaviour
const OLD_TURKISH=["kardzhali","razgrad","targovishte","shumen"];
const OLD_NATIONALIST=["sliven","yambol"];
const OLD_POVERTY=["vidin","montana","vratsa","silistra"];
const OLD_URBAN=["sofia-city","plovdiv-city","varna"];
let parity=true;
for(const d of g.DISTRICTS){
  g.setPlayer({name:"p",pos:{euro:.6,corruption:.6,energy:.6,judiciary:.6,pensions:.6,healthcare:.6,defense:.5,rural:.6,migration:.5}});
  const base={appealMult:0,entBonus:0};
  const oldVals={turkish:{appealMult:0,entBonus:0},roma:{appealMult:0,entBonus:0},bulgarian:{appealMult:0,entBonus:0},female:{appealMult:0,entBonus:0}};
  for(const e of["turkish","roma","bulgarian"]){
    oldVals[e].appealMult=OLD_TURKISH.includes(d.id)&&e==="turkish"?0.06:0;
    oldVals[e].appealMult+=(OLD_NATIONALIST.includes(d.id)&&e==="turkish"?-0.05:0);
    oldVals[e].entBonus=(OLD_POVERTY.includes(d.id)&&e==="roma"?0.07:0);
  }
  oldVals.female.entBonus=OLD_URBAN.includes(d.id)?0.03:0;
  for(const e of["turkish","roma","bulgarian"]){
    g.state().player.appearance.ethnicity=e;
    g.state().player.appearance.gender="male";
    const cm=g.candidateModifiers(d);
    if(cm.appealMult!==oldVals[e].appealMult||cm.entBonus!==oldVals[e].entBonus)parity=false;
  }
  g.state().player.appearance.gender="female";
  g.state().player.appearance.ethnicity="bulgarian";
  const cmf=g.candidateModifiers(d);
  if(cmf.entBonus!==oldVals.female.entBonus)parity=false;
}
check("identity modifiers unchanged (geo thresholds reproduce old lists)",parity);

// 4. district card shows top geo axes
document.getElementById("btn-new-game").click();
const S=g.state();
S.phase="campaign";
S.selDistrict="sofia-city";
const detailHtml=g.renderDistrictDetail();
check("district card includes geo chips",detailHtml.indexOf("geo-chip")>=0&&detailHtml.indexOf("Pro-EU")>=0&&detailHtml.indexOf("Urban")>=0);

// 5. axis-keyed events are in the pool
const pool=g.EVENT_POOL();
check("oligarch event present for pro-Russia districts",pool.some(ev=>ev.title.indexOf("Oligarch courts you")>=0));
check("EU grant event present for pro-EU districts",pool.some(ev=>ev.title.indexOf("EU grant for")>=0));
check("patriotic association event present",pool.some(ev=>ev.title.indexOf("Patriotic association")>=0));

// 6. no uncaught page errors
check("no uncaught page errors",(window.__errs||[]).length===0);
if((window.__errs||[]).length)console.log("errors:",window.__errs.join(" | "));
console.log(pass+" passed, "+fail+" failed");
process.exit(fail?1:0);
