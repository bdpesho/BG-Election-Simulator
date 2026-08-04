// T32 regression: two platform-tailored debate ambushes with only negative/zero answers.
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
function valuesAreNonPositive(value){
  if(typeof value!=="object"||value===null)return typeof value!=="number"||value<=0;
  return Object.values(value).every(valuesAreNonPositive);
}

g.setPlayer({name:"T32 test"});
g.state().activeIssues=["euro","energy","rural","defense","healthcare"];
g.setPlayer({pos:{euro:.92,energy:.1,rural:.5,defense:.5,healthcare:.5}});
const qs=g.buildDebateQuestions();
const ambush=qs.filter(q=>q.damageControl);
check("debate still draws eight questions",qs.length===8);
check("draw contains at least two damage-control questions",ambush.length>=2);
check("ambushes match strongest platform stance",ambush.length>=2&&ambush.every(q=>q.issue==="euro"));
check("every damage-control answer is negative or zero",ambush.every(q=>q.a.every(a=>valuesAreNonPositive(a.fx))));
check("ambush questions have four answers",ambush.every(q=>q.a.length===4));

console.log(pass+" passed, "+fail+" failed");
process.exit(fail?1:0);
