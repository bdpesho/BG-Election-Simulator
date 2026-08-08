"use strict";
const fs=require("fs");
const path=require("path");
const vm=require("vm");
const sandbox={};
vm.runInNewContext(fs.readFileSync(path.join(__dirname,"..","mapdata.js"),"utf8")+"\n;globalThis.__E=globalThis.__121_MAPDATA__;",sandbox);
const {REGION_PATHS,REGION_LABELS,CITY_DOTS,MAP_VIEWBOX,LABEL_POS,MAP_NAMES}=sandbox.__E;
let failures=0;
function check(name,cond,detail){
  console.log((cond?"PASS":"FAIL")+" | "+name+(detail?" | "+detail:""));
  if(!cond)failures++;
}
const ALL_IDS=["sofia-city","sofia-obl","plovdiv-city","plovdiv-obl","varna","burgas","blagoevgrad","stara-zagora","pleven","ruse","velikotarnovo","pazardzhik","haskovo","shumen","sliven","dobrich","vratsa","montana","kyustendil","pernik","lovech","gabrovo","kardzhali","yambol","targovishte","razgrad","silistra","smolyan","vidin"];

function pathToRings(d){
  const tokens=d.match(/([MLZ]|-?\d+(?:\.\d+)?)/g);
  const rings=[];let cur=[];
  for(const t of tokens){
    if(t==="M"||t==="L"){continue;}
    if(t==="Z"){if(cur.length>=6)rings.push(cur);cur=[];continue;}
    cur.push(parseFloat(t));
  }
  return rings.map(r=>{const pts=[];for(let i=0;i<r.length-1;i+=2)pts.push([r[i],r[i+1]]);return pts;});
}
function pointInRing(pt,ring){
  const [px,py]=pt;
  let inside=false;
  for(let i=0,j=ring.length-1;i<ring.length;j=i++){
    const xi=ring[i][0],yi=ring[i][1],xj=ring[j][0],yj=ring[j][1];
    if(((yi>py)!==(yj>py))&&(px<(xj-xi)*(py-yi)/(yj-yi)+xi))inside=!inside;
  }
  return inside;
}
function pointInPath(pt,d){
  for(const ring of pathToRings(d))if(pointInRing(pt,ring))return true;
  return false;
}
function bbox(d){
  let minX=1e9,minY=1e9,maxX=-1e9,maxY=-1e9;
  for(const ring of pathToRings(d))for(const [x,y] of ring){minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x);maxY=Math.max(maxY,y);}
  return [minX,minY,maxX,maxY];
}

check("29 regions present",ALL_IDS.every(id=>REGION_PATHS[id]),Object.keys(REGION_PATHS).length+" paths");
let badPath=0;
for(const id of ALL_IDS){
  const d=REGION_PATHS[id];
  if(typeof d!=="string"||!/^M/.test(d)||!/Z$/.test(d)||/NaN/.test(d))badPath++;
}
check("all paths well-formed",badPath===0,badPath+" bad");
let dotFail=0,bad=0;
for(const id of ALL_IDS){
  const dot=CITY_DOTS[id];
  if(!pointInPath(dot,REGION_PATHS[id])){dotFail++;console.log("  dot outside own region:",id,JSON.stringify(dot));}
  const [minX,minY,maxX,maxY]=bbox(REGION_PATHS[id]);
  if(minX<MAP_VIEWBOX[0]||minY<MAP_VIEWBOX[1]||maxX>MAP_VIEWBOX[0]+MAP_VIEWBOX[2]||maxY>MAP_VIEWBOX[1]+MAP_VIEWBOX[3]){bad++;console.log("  bbox out of viewBox:",id);}
}
check("all city dots inside their own region",dotFail===0,dotFail+" outside");
let close=0;
for(let i=0;i<ALL_IDS.length;i++)for(let j=i+1;j<ALL_IDS.length;j++){
  const a=CITY_DOTS[ALL_IDS[i]],b=CITY_DOTS[ALL_IDS[j]];
  if(Math.hypot(a[0]-b[0],a[1]-b[1])<24){close++;console.log("  dots too close:",ALL_IDS[i],JSON.stringify(a),ALL_IDS[j],JSON.stringify(b));}
}
check("no two city dots within 24 units",close===0,close+" pairs");
check("sofia-obl dot not inside sofia-city ring",!pointInPath(CITY_DOTS["sofia-obl"],REGION_PATHS["sofia-city"]));
check("plovdiv-obl dot not inside plovdiv-city ring",!pointInPath(CITY_DOTS["plovdiv-obl"],REGION_PATHS["plovdiv-city"]));
check("all region bboxes inside viewBox",bad===0,bad+" outside");
const SHORTS={"sofia-city":"Sofia City","sofia-obl":"Sofia Prov.","plovdiv-city":"Plovdiv","plovdiv-obl":"Plovdiv Prov.","varna":"Varna","burgas":"Burgas","blagoevgrad":"Blagoevgrad","stara-zagora":"Stara Zagora","pleven":"Pleven","ruse":"Ruse","velikotarnovo":"V. Tarnovo","pazardzhik":"Pazardzhik","haskovo":"Haskovo","shumen":"Shumen","sliven":"Sliven","dobrich":"Dobrich","vratsa":"Vratsa","montana":"Montana","kyustendil":"Kyustendil","pernik":"Pernik","lovech":"Lovech","gabrovo":"Gabrovo","kardzhali":"Kardzhali","yambol":"Yambol","targovishte":"Targovishte","razgrad":"Razgrad","silistra":"Silistra","smolyan":"Smolyan","vidin":"Vidin"};
const labelBoxes={};
let labFail=0,dotTouch=0,labelOverlap=0;
for(const id of ALL_IDS){
  const lp=LABEL_POS[id];
  if(!lp){labFail++;console.log("  missing label pos:",id);continue;}
  const w=(MAP_NAMES[id]||"X").length*7;
  let box;
  if(lp[2]==="m")box=[lp[0]-w/2,lp[1]-9,lp[0]+w/2,lp[1]+1];
  else if(lp[2]==="s")box=[lp[0],lp[1]-9,lp[0]+w,lp[1]+1];
  else box=[lp[0]-w,lp[1]-9,lp[0],lp[1]+1];
  labelBoxes[id]=box;
  const pts=[[box[0],box[1]],[box[2],box[1]],[box[0],box[3]],[box[2],box[3]],[(box[0]+box[2])/2,box[1]],[(box[0]+box[2])/2,box[3]],[box[0],(box[1]+box[3])/2],[box[2],(box[1]+box[3])/2]];
  const insideCount=pts.filter(p=>pointInPath(p,REGION_PATHS[id])).length;
  if(insideCount<4){labFail++;console.log("  label mostly outside:",id,insideCount+"/8",JSON.stringify(box));}
  const dot=CITY_DOTS[id];
  const dx=Math.max(box[0]-dot[0],0,dot[0]-box[2]);
  const dy=Math.max(box[1]-dot[1],0,dot[1]-box[3]);
  if(Math.hypot(dx,dy)<7)dotTouch++;
  for(const other of ALL_IDS){
    if(other===id)continue;
    const od=CITY_DOTS[other];
    const ox=Math.max(box[0]-od[0],0,od[0]-box[2]);
    const oy=Math.max(box[1]-od[1],0,od[1]-box[3]);
    if(Math.hypot(ox,oy)<8)dotTouch++;
  }
}
const lbIds=Object.keys(labelBoxes);
for(let i=0;i<lbIds.length;i++)for(let j=i+1;j<lbIds.length;j++){
  const a=labelBoxes[lbIds[i]],b=labelBoxes[lbIds[j]];
  if(!(a[2]<=b[0]||b[2]<=a[0]||a[3]<=b[1]||b[3]<=a[1]))labelOverlap++;
}
check("all label positions defined",labFail===0,labFail+" missing/mostly-outside");
check("no label touches any city dot",dotTouch===0,dotTouch+" touches");
check("no label-label overlaps",labelOverlap===0,labelOverlap+" overlaps");
check("viewBox sane",MAP_VIEWBOX[2]>700&&MAP_VIEWBOX[3]>300&&MAP_VIEWBOX[2]<1200,JSON.stringify(MAP_VIEWBOX));
for(const id of ["sofia-city","plovdiv-city","varna","vidin","silistra","kardzhali"]){
  check("label in viewBox: "+id,REGION_LABELS[id][0]>MAP_VIEWBOX[0]&&REGION_LABELS[id][0]<MAP_VIEWBOX[0]+MAP_VIEWBOX[2],JSON.stringify(REGION_LABELS[id]));
}
console.log(failures===0?"ALL MAP GEOMETRY CHECKS PASSED":"FAILURES: "+failures);
process.exit(failures===0?0:1);
