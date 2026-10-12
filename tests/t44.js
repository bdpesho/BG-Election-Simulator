// T44 regression: a second election in the same session (next term) rebuilds the results
// chart and district map instead of reusing the first election's DOM; a save made during
// the live count keeps counting after it is loaded in a fresh page.
const fs=require("fs");
const path=require("path");
const {JSDOM}=require("jsdom");

const ROOT=path.join(__dirname,"..");
const html=fs.readFileSync(path.join(ROOT,"index.html"),"utf8");
const mapSrc=fs.readFileSync(path.join(ROOT,"mapdata.js"),"utf8");
const gameSrc=fs.readFileSync(path.join(ROOT,"game.js"),"utf8");
let pass=0,fail=0;
function check(name,cond){if(cond){pass++;console.log("PASS | "+name);}else{fail++;console.log("FAIL | "+name);}}

function boot(){
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
return {window,document,g:window.module.exports};
}
const P1=boot(),{window,document}=P1,g=P1.g;

g.setPlayer({name:"First Leader",abbr:"ONE",attrs:{stamina:6,charisma:5,intelligence:4},difficulty:"normal"});
g.startCampaign();
g.virusDisarm();
g.runElection();
g.finishElectionNight();
const firstRegion=document.querySelector("#election-map .election-region");
const firstRow=document.querySelector('#election-results .res-row[data-party="player"] .rname');
check("first election renders the player row",!!firstRow&&firstRow.textContent.indexOf("ONE")>=0);

// next term, the player has renamed the party
const S=g.state();
S.party.name="Second Party";S.party.abbr="TWO";
g.startTimeSkip();
g.beginNextTerm();
g.virusDisarm();
g.runElection();
g.finishElectionNight();
const secondRegion=document.querySelector("#election-map .election-region");
const secondRow=document.querySelector('#election-results .res-row[data-party="player"] .rname');
check("second election rebuilds the district map",!!secondRegion&&secondRegion!==firstRegion);
check("second election shows the current party name",!!secondRow&&secondRow.textContent.indexOf("TWO")>=0&&secondRow.textContent.indexOf("ONE")<0);

// mid-count save -> fresh page -> Continue
g.beginNextTerm();g.virusDisarm();g.runElection();
setTimeout(()=>{
  g.saveGame();
  const saved=window.localStorage.getItem("121towin-save-v6");
  const savedProgress=JSON.parse(saved).electionNight.progress;
  const P2=boot();
  P2.window.localStorage.setItem("121towin-save-v6",saved);
  P2.g.loadGame();
  setTimeout(()=>{
    const now=P2.g.state().electionNight.progress;
    check("loaded mid-count save keeps counting",savedProgress<1&&now>savedProgress);
    P2.g.finishElectionNight();g.finishElectionNight();
    finish();
  },800);
},600);
function finish(){
  check("no uncaught page errors",!(window.__errs&&window.__errs.length));
  console.log(pass+" passed, "+fail+" failed");
  process.exit(fail?1:0);
}
