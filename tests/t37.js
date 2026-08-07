// T37 regression: the alive map — floating voices from the provinces.
// Run: node tests/t37.js   (uses jsdom, a devDependency)
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
for(const file of["mapdata.js","game.js"]){
  const script=document.createElement("script");
  script.textContent=fs.readFileSync(path.join(ROOT,file),"utf8");
  document.body.appendChild(script);
}
if(typeof window.init==="function")window.init();
const g=window.module.exports;

let pass=0,fail=0;
function check(name,cond){if(cond){pass++;console.log("PASS | "+name);}else{fail++;console.log("FAIL | "+name);}}

const DEFAULTS={euro:.60,corruption:.60,energy:.60,judiciary:.60,pensions:.60,healthcare:.60,defense:.50,rural:.60,migration:.50};
g.setPlayer({name:"t37",abbr:"NOV",attrs:{stamina:8,charisma:4,intelligence:4},pos:DEFAULTS,difficulty:"normal"});
g.startCampaign();
const S=g.state();
const sofia=g.DISTRICTS.find(d=>d.id==="sofia-city");
const varna=g.DISTRICTS.find(d=>d.id==="varna");

// ---------- 1. quote pool integrity ----------
check("bulgarism pool has >=100 sayings",g.VOICES_BULGARISM.length>=100);
check("poll pool has >=100 templates total",g.VOICES_POLL.win.length+g.VOICES_POLL.close.length+g.VOICES_POLL.lose.length+Object.values(g.VOICES_POLL.rival).reduce((a,b)=>a+b.length,0)>=100);
check("every rival has a quote bucket",["gerb","bsp","dps","vaz","ppdb","itn","pb","mech","aps","velichie"].every(id=>g.VOICES_POLL.rival[id]&&g.VOICES_POLL.rival[id].length>0));
check("every bulgarism is a non-empty string",g.VOICES_BULGARISM.every(q=>typeof q==="string"&&q.trim().length>0));
check("bulgarisms carry no unreplaced placeholders",g.VOICES_BULGARISM.every(q=>q.indexOf("{")<0));
check("all poll templates are non-empty",Object.values(g.VOICES_POLL).flatMap(v=>Array.isArray(v)?v:Object.values(v)).flat().every(t=>typeof t==="string"&&t.length>0));

// ---------- 2. context + template filling ----------
S.districtPoll["sofia-city"]={player:.45,gerb:.25,bsp:.15,dps:.05,others:.10};
const ctx=g.voiceCtx(sofia);
check("voiceCtx computes player share",ctx.N===45);
check("voiceCtx identifies the leader",ctx.leader==="player"&&ctx.margin>0.19);
const filled=g.fillVoice("{P} at {N}% in {D} — {R} at {V}%, nat {NAT}%, week {W}. {PN} — {RN}.",ctx);
check("fillVoice substitutes every placeholder",filled.indexOf("{")<0&&filled.indexOf("NOV")>=0&&filled.indexOf("45")>=0&&filled.indexOf(sofia.name)>=0);
check("fillVoice renders rival name in losing context",(()=>{
  S.districtPoll["varna"]={player:.20,gerb:.41,bsp:.15,others:.24};
  const c=g.voiceCtx(varna);
  const f=g.fillVoice("{R} leads {D} with {V}% ({RN}).",c);
  return f.indexOf("{")<0&&f.indexOf("GERB")>=0&&f.indexOf("41")>=0;
})());

// ---------- 3. state-aware pick buckets (stubbed window.Math.random) ----------
const origRandom=window.Math.random;
try{
  window.Math.random=()=>0;
  S.districtPoll["sofia-city"]={player:.45,gerb:.25,bsp:.15,dps:.05,others:.10};
  check("player leading picks the win bucket",g.pickPollVoice(sofia).tpl===g.VOICES_POLL.win[0]);
  S.districtPoll["sofia-city"]={player:.31,gerb:.30,bsp:.19,others:.20};
  check("knife-edge picks the close bucket",g.pickPollVoice(sofia).tpl===g.VOICES_POLL.close[0]);
  S.districtPoll["varna"]={player:.20,gerb:.41,bsp:.15,others:.24};
  check("rival leading picks that rival's bucket",g.pickPollVoice(varna).tpl===g.VOICES_POLL.rival.gerb[0]);
  window.Math.random=()=>0.9;
  S.districtPoll["varna"]={player:.20,gerb:.41,bsp:.15,others:.24};
  const seq=[0.9,0.05];let si=0;
  window.Math.random=()=>seq[si++];
  check("rival leading may fall back to the generic lose bucket",g.pickPollVoice(varna).tpl===g.VOICES_POLL.lose[0]);
}finally{window.Math.random=origRandom;}

// ---------- 4. aliveQuote formatting ----------
Math.random=origRandom;
const q1=g.aliveQuote(sofia);
check("aliveQuote wraps the voice in Bulgarian quotes",q1.charCodeAt(0)===0x201E&&q1.charCodeAt(q1.length-1)===0x201D&&q1.length>3);

// ---------- 5. runtime: dots flash, voices float ----------
check("aliveActive false while paused",(()=>{S.paused=true;const v=g.aliveActive();S.paused=false;return !v;})());
check("aliveActive false outside campaign",(()=>{const p=S.phase;S.phase="election";const v=g.aliveActive();S.phase=p;return !v;})());
check("aliveActive true during the campaign screen",g.aliveActive()===true);
const dot1=g.spawnAliveVoice();
check("spawn adds a dot to the map",!!dot1&&!!document.getElementById("bg-map").querySelector("#alive-layer .alive-dot"));
const box=document.getElementById("bg-map").querySelector("#alive-layer .alive-dot");
check("spawn point stays inside the map viewBox",box.getAttribute("cx")>=40&&box.getAttribute("cx")<=960);
check("dot count caps at 4",(()=>{
  for(let i=0;i<6;i++)g.spawnAliveVoice();
  return g.aliveCountNow()<=4;
})());
setTimeout(()=>{
  const layer=document.getElementById("bg-map").querySelector("#alive-layer");
  const dotGone=layer?layer.querySelectorAll(".alive-dot").length===0:false;
  const voices=layer?layer.querySelectorAll(".alive-text").length:0;
  const quoted=layer&&voices>0?layer.querySelector(".alive-text").textContent.charCodeAt(0)===0x201E:false;
  check("dot disappears after the flash",dotGone);
  check("floating voice appears in Bulgarian quotes",quoted&&voices>=1);
  g.aliveKillAll();
  check("cleanup removes the alive layer",!document.getElementById("bg-map").querySelector("#alive-layer"));
  check("cleanup resets the counter",g.aliveCountNow()===0);
  check("no uncaught page errors",!(window.__errs&&window.__errs.length));
  console.log(pass+" passed, "+fail+" failed");
  process.exit(fail?1:0);
},1500);
