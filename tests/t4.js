// T4 regression: pixel portrait system + candidate identity effects.
// Run: node tests/t4.js
function makeEl(){
  const t={style:{},dataset:{},innerHTML:"",textContent:"",value:""};
  t.classList={add(){},remove(){},toggle(){}};
  t.querySelector=()=>makeEl();
  t.querySelectorAll=()=>[];
  t.appendChild=()=>{};
  t.setAttribute=()=>{};
  t.addEventListener=()=>{};
  t.closest=()=>makeEl();
  return t;
}
global.document={readyState:"complete",getElementById:()=>makeEl(),querySelectorAll:()=>[],createElementNS:()=>makeEl(),addEventListener:()=>{}};
global.localStorage={_d:{},getItem(k){return this._d[k]||null},setItem(k,v){this._d[k]=v},removeItem(k){delete this._d[k]}};
global.alert=()=>{};
Object.assign(global,require("../mapdata.js"));
const g=require("../game.js");

let pass=0,fail=0;
function check(name,cond){if(cond){pass++;console.log("PASS | "+name);}else{fail++;console.log("FAIL | "+name);}}
function district(id){return g.DISTRICTS.find(d=>d.id===id);}
function shareOf(id){return g.districtShares(district(id),false).player;}

g.startCampaign();
const S=g.state();

// 1. pixel grids are all exactly 24 wide, chars from the allowed set
const pf=g.PIXEL_FACE;
const CHARS=new Set((".KNE MmHSTt").replace(/ /g,"").split(""));
let gridRows=0,gridBad=0;
(function walk(o){
  if(typeof o==="string"){gridRows++;if(o.length!==24)gridBad++;for(const c of o){if(!CHARS.has(c))gridBad++;}return;}
  if(Array.isArray(o)){o.forEach(walk);return;}
  if(o&&typeof o==="object"){for(const k in o)walk(o[k]);}
})(pf);
check("pixel grids: all rows 24 chars, valid charset",gridRows>=36&&gridBad===0);

// 2. pixel face renders as SVG with a healthy number of rects
const svg=g.faceSVG(g.defaultAppearance());
check("faceSVG renders pixel face",(svg.match(/<rect/g)||[]).length>30&&svg.indexOf("shape-rendering=\"crispEdges\"")>=0);

// 3. ≥24 visually distinct portrait combinations reachable
const combos=g.SKIN_TONES.length*g.HAIR_STYLES.length*g.SUIT_STYLES.length*Object.keys(g.ETHNICITY_NAMES).length;
check("≥24 distinct combinations reachable ("+combos+")",combos>=24);
const distinct=[];for(const f of[{skin:0,hairStyle:"short",suitStyle:"classic"},{skin:5,hairStyle:"bald",suitStyle:"blouse"},{skin:2,hairStyle:"bun",suitStyle:"vest"}])distinct.push(g.faceSVG({...g.defaultAppearance(),...f}));
check("portrait variants differ",new Set(distinct).size===3);

// 4. identity effects: Turkish minority boosts Kardzhali, hurts Yambol
S.player.appearance=g.defaultAppearance();
S.player.appearance.ethnicity="bulgarian";
const kardBase=shareOf("kardzhali");
S.player.appearance.ethnicity="turkish";
const kardTurk=shareOf("kardzhali");
check("turkish candidate stronger in Kardzhali",kardTurk>kardBase);
const yamBase=shareOf("yambol");
S.player.appearance.ethnicity="bulgarian";
const yamB=shareOf("yambol");
S.player.appearance.ethnicity="turkish";
check("turkish candidate weaker in Yambol",shareOf("yambol")<yamB);

// 5. Roma + in Vidin; female + in Sofia City
S.player.appearance.ethnicity="bulgarian";S.player.appearance.gender="male";
const vidinBase=shareOf("vidin");
S.player.appearance.ethnicity="roma";
check("roma candidate stronger in Vidin",shareOf("vidin")>vidinBase);
S.player.appearance.ethnicity="bulgarian";S.player.appearance.gender="female";
const sofiaBase=shareOf("sofia-city");
S.player.appearance.gender="male";
const sofiaM=shareOf("sofia-city");
S.player.appearance.gender="female";
check("female candidate stronger in Sofia City",shareOf("sofia-city")>sofiaM);

// 6. no effect exceeds ±8% (per modifier and per-district share delta)
let maxMod=0,maxDelta=0;
for(const d of g.DISTRICTS){
  const cm=g.candidateModifiers(d);
  maxMod=Math.max(maxMod,Math.abs(cm.appealMult),Math.abs(cm.entBonus));
}
S.player.appearance.ethnicity="bulgarian";S.player.appearance.gender="male";
const baseShares={};for(const d of g.DISTRICTS)baseShares[d.id]=g.districtShares(d,false).player;
S.player.appearance.ethnicity="turkish";
for(const d of g.DISTRICTS)maxDelta=Math.max(maxDelta,Math.abs(g.districtShares(d,false).player-baseShares[d.id]));
check("modifier values ≤ 8%",maxMod<=0.08);
check("share deltas < 8 pts",maxDelta<0.08);

// 7. appearance persists through save/load
S.player.appearance.suitColor="#8a1f1f";
S.player.appearance.gender="female";
g.saveGame();
g.loadGame();
const S2=g.state();
check("appearance survives save/load",S2.player.appearance&&S2.player.appearance.suitColor==="#8a1f1f"&&S2.player.appearance.gender==="female");

// 8. uploaded photo still wins over the pixel portrait
S2.player.photo="data:image/jpeg;base64,AAA";
check("photo still takes priority",g.portraitHTML().indexOf("<img")===0);
S2.player.photo=null;

console.log(pass+" passed, "+fail+" failed");
process.exit(fail?1:0);
