// T19 regression: shareable end-screen run card (1200x675 canvas, 2x PNG export).
// Run: node tests/t19.js   (headless stub-canvas part + jsdom part)
function makeEl(){
  const t={style:{},dataset:{},innerHTML:"",textContent:"",value:""};
  t.classList={add(){},remove(){},toggle(){}}; t.querySelector=()=>makeEl(); t.querySelectorAll=()=>[];
  t.appendChild=()=>{}; t.setAttribute=()=>{}; t.addEventListener=()=>{}; t.closest=()=>makeEl(); return t;
}
global.document={readyState:"complete",getElementById:()=>makeEl(),querySelectorAll:()=>[],createElementNS:()=>makeEl(),addEventListener:()=>{}};
global.localStorage={_d:{},getItem(k){return this._d[k]||null},setItem(k,v){this._d[k]=v},removeItem(k){delete this._d[k]}};
global.alert=()=>{};
Object.assign(global,require("../mapdata.js"));
const g=require("../game.js");

let pass=0,fail=0;
function check(name,cond){if(cond){pass++;console.log("PASS | "+name);}else{fail++;console.log("FAIL | "+name);}}

// ---------- 1. endingInfo + runCardData ----------
g.startCampaign();
g.virusDisarm(); // T39: keep the random virus event out of save/load checks
let S=g.state();
S.results={seats:{player:96,gerb:62,pb:40,ppdb:20,dps:12,bsp:10},natShare:{player:.32,gerb:.24,pb:.17,ppdb:.10,dps:.06,bsp:.05},totalVotes:1000000};
S.ending="majority";
S.stats={rallies:21,ads:8,hqs:3,campaigns:2,travels:12};
const info=g.endingInfo();
check("endingInfo gives the majority title",info.title==="Single-Party Majority!");
const data=g.runCardData();
check("run card data carries party + player",data.party.abbr==="NRM"&&data.player.name.length>0);
check("run card data carries the tally",data.tally.length===6&&data.tally[0].id==="player"&&data.tally[0].seats===96);
check("run card data carries seats/vote/stats",data.seats===96&&Math.abs(data.natShare-.32)<1e-9&&data.stats.rallies===21);

// ---------- 2. drawRunCard with a stub canvas ----------
const calls={fillRect:0,fillText:[],drawImage:0,strokeRect:0};
const ctx=new Proxy({},{get(t,p){
  if(p==="fillRect")return()=>{calls.fillRect++;};
  if(p==="strokeRect")return()=>{calls.strokeRect++;};
  if(p==="fillText")return(txt)=>{calls.fillText.push(String(txt));};
  if(p==="drawImage")return()=>{calls.drawImage++;};
  if(p==="measureText")return t=>{return{width:String(t).length*20};};
  if(p==="createLinearGradient")return()=>({addColorStop(){}});
  return ()=>{};
}});
const canvas={width:2400,height:1350,getContext:()=>ctx,toDataURL:()=>"data:image/png;base64,x"};
g.drawRunCard(canvas,data);
check("run card draws 60+ rects",calls.fillRect>=60&&calls.strokeRect>0);
check("run card draws the result title",calls.fillText.indexOf("Single-Party Majority!")>=0);
check("run card draws party + candidate",calls.fillText.some(t=>t.indexOf("NRM")>=0)&&calls.fillText.some(t=>t.indexOf(data.player.name)>=0));
check("run card draws the tally legend",calls.fillText.indexOf("player 96")>=0||calls.fillText.indexOf("GERB 62")>=0||calls.fillText.some(t=>/\d+ \d+/.test(t)));
check("run card footer names the game",calls.fillText.some(t=>t.indexOf("121 TO WIN")>=0));
check("run card skips cheat badge when clean",!calls.fillText.some(t=>t.indexOf("CHEAT MODE")>=0));
data.cheat=true;data.kosyo=true;
g.drawRunCard(canvas,data);
check("run card shows cheat + kosyo badges",calls.fillText.indexOf("CHEAT MODE")>=0&&calls.fillText.indexOf("KING KOSYO RULES")>=0);

// ---------- 3. grid portrait draws the face ----------
const pCalls={fillRect:0};
const pctx=new Proxy({},{get(t,p){if(p==="fillRect")return()=>{pCalls.fillRect++;};return()=>{};}});
g.drawGridPortrait(pctx,0,0,4,{...g.defaultAppearance(),hairStyle:"short",suitStyle:"classic"});
check("grid portrait draws 150+ pixels",pCalls.fillRect>=150);

// ---------- 4. jsdom: end-screen preview + download ----------
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
let pngCount=0;
window.HTMLCanvasElement.prototype.toDataURL=()=>{pngCount++;return "data:image/png;base64,QUFBQQ==";};
window.HTMLCanvasElement.prototype.getContext=()=>null;
for(const src of[fs.readFileSync(path.join(ROOT,"mapdata.js"),"utf8"),fs.readFileSync(path.join(ROOT,"game.js"),"utf8")]){
  const s=document.createElement("script");
  s.textContent=src;
  document.body.appendChild(s);
}
if(typeof window.init==="function")window.init();
const g2=window.module.exports;
function click(el){el.dispatchEvent(new window.MouseEvent("click",{bubbles:true}));}

(function(){
  click(document.getElementById("btn-new-game"));
  g2.startCampaign();
  g2.virusDisarm(); // T39: keep the random virus event out of save/load checks
  let S2=g2.state();
  S2.eventQueue=[];S2.paused=false;
  let weeks=0;
  while(S2.phase==="campaign"&&weeks<25){
    g2.endTurn();
    S2=g2.state();
    let guard=0;
    while(S2.paused&&guard<60){
      if(S2.debate&&S2.debate.q){
        if(S2.debate.i<0){const go=document.getElementById("db-go");if(go)click(go);}
        else{for(let qi=S2.debate.i;qi<8;qi++)g2.debateAnswer(0);const done=document.getElementById("db-done");if(done)click(done);}
        S2=g2.state();guard++;continue;
      }
      const btns=document.querySelectorAll("#modal-root .ev-opts .btn");
      if(!btns.length){S2.paused=false;break;}
      click(btns[0]);
      S2=g2.state();
      guard++;
    }
    weeks++;
  }
  S2=g2.state();
  click(document.getElementById("btn-election-skip"));
  click(document.getElementById("btn-election-continue"));
  S2=g2.state();
  const btns=document.querySelectorAll("#modal-root .ev-opts .btn");
  if(btns.length)click(btns[0]);
  S2=g2.state();
  if(S2.phase==="coalition"){click(document.getElementById("btn-give-up"));S2=g2.state();}
  check("end screen reached for run card",S2.phase==="end");
  const cv=document.getElementById("run-card");
  check("run card preview canvas exists at 1200x675",!!cv&&cv.width===1200&&cv.height===675);
  check("download button exists",!!document.getElementById("btn-download-card"));
  const dl=document.getElementById("btn-download-card");
  const before=pngCount;
  click(dl);
  check("download renders a PNG dataURL",pngCount>before);
  check("no uncaught page errors",!(window.__errs&&window.__errs.length));
  console.log(pass+" passed, "+fail+" failed");process.exit(fail?1:0);
})();
