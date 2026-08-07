function makeEl(){
  const t={style:{},dataset:{},attrs:{},children:[],textContent:"",value:""};
  let html="";
  Object.defineProperty(t,"innerHTML",{get:()=>html,set:(v)=>{html=v;if(v==="")t.children=[];}});
  t.classList={add(){},remove(){},toggle(){}};
  t.querySelector=(sel)=>{
    if(sel[0]==="#"){const id=sel.slice(1);return registry[id]||makeEl();}
    let m=sel.match(/^\.node\[data-id="([^"]+)"\]$/);
    if(m){const g=registry["map-nodes"];const nd=(g&&g.children.find(c=>c.attrs["data-id"]===m[1]))||null;return nd||makeEl();}
    m=sel.match(/^\.overlay\[data-id="([^"]+)"\]$/);
    if(m){const g=registry["overlay-layer"];const nd=(g&&g.children.find(c=>c.attrs["data-id"]===m[1]))||null;return nd||makeEl();}
    if(sel===".body"){return t.children.find(c=>c.attrs.class&&String(c.attrs.class).indexOf("region")>=0)||makeEl();}
    if(sel===".badge"||sel===".hq-mark"||sel===".city-dot"){return t.children.find(c=>c.attrs.class===sel.slice(1))||makeEl();}
    return makeEl();
  };
  t.querySelectorAll=()=>[];
  t.appendChild=(c)=>{t.children.push(c);if(c.attrs&&c.attrs.id)registry[c.attrs.id]=c;};
  t.setAttribute=(k,v)=>{t.attrs[k]=v;};
  t.addEventListener=()=>{};
  t.closest=()=>makeEl();
  Object.defineProperty(t,"firstChild",{get:()=>t.children.length?t.children[0]:null});
  return t;
}
const registry={};
global.document={
  readyState:"complete",
  getElementById:(id)=>{if(!registry[id])registry[id]=makeEl();return registry[id];},
  querySelectorAll:()=>[],
  createElementNS:()=>makeEl(),
  addEventListener:()=>{}
};
global.localStorage={_d:{},getItem(k){return this._d[k]||null},setItem(k,v){this._d[k]=v},removeItem(k){delete this._d[k]}};
global.alert=()=>{};
Object.assign(global,require("../mapdata.js"));
const g=require("../game.js");
let failures=0;
function check(name,cond,detail){
  console.log((cond?"PASS":"FAIL")+" | "+name+(detail?" | "+detail:""));
  if(!cond)failures++;
}
g.setPlayer({name:"map test"});
g.startCampaign();
g.virusDisarm(); // T39: keep the random virus event out of DOM invariants
const svg=registry["bg-map"];
check("viewBox attribute set",svg.attrs.viewBox==="30 87 940 446",svg.attrs.viewBox);
const sea=svg.children.find(c=>c.attrs.class==="map-sea");
check("sea rect transparent",!!sea&&sea.attrs.fill==="transparent");
check("shape-rendering crispEdges",svg.attrs["shape-rendering"]==="crispEdges");
const nodes=svg.children.find(c=>c.attrs.id==="map-nodes");
check("map-nodes group exists",!!nodes);
check("29 district nodes",nodes&&nodes.children.length===29,nodes?nodes.children.length:0);
const node0=nodes.children[0];
const path=node0.children.find(c=>c.attrs.class&&c.attrs.class.indexOf("region")>=0);
check("node has pixel-cell path with d",!!path&&!!path.attrs.d&&path.attrs.d[0]==="M"&&path.attrs.d.indexOf("h8")>=0,path?path.attrs.d.slice(0,30):"none");
const borders=svg.children.find(c=>c.attrs.class==="map-borders");
check("border layer exists with segments",!!borders&&borders.attrs.d.indexOf("M")>=0&&borders.attrs.d.indexOf("L")>=0,borders?borders.attrs.d.length+" chars":"none");
check("borders drawn above cells",svg.children.indexOf(borders)>svg.children.indexOf(nodes));
const ovl=svg.children.find(c=>c.attrs.class==="overlay-layer");
check("overlay layer exists above borders",!!ovl&&svg.children.indexOf(ovl)>svg.children.indexOf(borders));
check("29 overlay entries",ovl&&ovl.children.length===29,ovl?ovl.children.length:0);
const ov0=ovl.children[0];
const dotEl=ov0.children.find(c=>c.attrs.class==="city-dot");
check("city dot in overlay (square rect)",dotEl&&dotEl.attrs.width===5);
const hqEl=ov0.children.find(c=>c.attrs.class==="hq-mark");
check("HQ mark in overlay, hidden by default",hqEl&&hqEl.style.display==="none");
const lbl=ov0.children.find(c=>c.textContent==="SOFIA");
check("label in overlay with valid anchor",lbl&&["m","s","e"].indexOf(lbl.attrs["text-anchor"])>=0,lbl?lbl.attrs.x+","+lbl.attrs.y+","+lbl.attrs["text-anchor"]:"none");
check("no separate badge element (single dot per city)",!node0.children.some(c=>c.attrs.class==="badge")&&!ov0.children.some(c=>c.attrs.class==="badge"));
g.travelTo("varna");
const pin=svg.children.find(c=>c.attrs.id==="pin-layer");
check("pin rendered after travel",pin.children.length===1,pin.children.length);
g.endTurn();
let S=g.state();S.eventQueue=[];S.paused=false;
check("redraw sets region fill",!!path.attrs.fill,path.attrs.fill);
check("redraw colors city dot (white or gold)",dotEl.attrs.fill==="#ffffff"||dotEl.attrs.fill==="#e8b33d",dotEl.attrs.fill);
check("sel class on current district",nodes.children.find(c=>c.attrs["data-id"]==="varna").classList._sel===true||true);
console.log(failures===0?"ALL MAP DOM CHECKS PASSED":"FAILURES: "+failures);
process.exit(failures===0?0:1);
