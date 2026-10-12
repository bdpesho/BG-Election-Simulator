// Shared jsdom harness for the newer regression tests: boots index.html with the game
// scripts and returns the page plus the game's test exports.
const fs=require("fs");
const path=require("path");
const {JSDOM}=require("jsdom");

const ROOT=path.join(__dirname,"..");
const html=fs.readFileSync(path.join(ROOT,"index.html"),"utf8");
const sources=["mapdata.js","game.js","presidential.js"].filter(f=>fs.existsSync(path.join(ROOT,f))).map(f=>fs.readFileSync(path.join(ROOT,f),"utf8"));

function boot(){
  const dom=new JSDOM(html,{runScripts:"dangerously",pretendToBeVisual:true,url:"http://localhost/"});
  const {window}=dom;
  const {document}=window;
  window.alert=()=>{};
  window.module={exports:{}};
  window.addEventListener("error",e=>{(window.__errs=window.__errs||[]).push(String(e.message||e));});
  for(const src of sources){
    const s=document.createElement("script");
    s.textContent=src;
    document.body.appendChild(s);
  }
  if(typeof window.init==="function")window.init();
  return {window,document,g:window.module.exports,P:window.__121Pres};
}

function suite(){
  let pass=0,fail=0;
  return {
    check(name,cond){ if(cond){pass++;console.log("PASS | "+name);}else{fail++;console.log("FAIL | "+name);} },
    done(){ console.log(pass+" passed, "+fail+" failed"); process.exit(fail?1:0); }
  };
}
module.exports={boot,suite,ROOT};
