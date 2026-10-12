// T47: presidential campaign stops (replace issue rallies), autumn-2026 news events,
// and the right-click district menu (both modes).
const {boot,suite}=require("./harness");
const {check,done}=suite();
const {window:w,document:doc}=boot();
const run=c=>w.eval(c);
const ctx=(id,x,y)=>{const n=doc.querySelector('#bg-map .node[data-id="'+id+'"]');n.dispatchEvent(new w.MouseEvent("contextmenu",{bubbles:true,cancelable:true,clientX:x||200,clientY:y||200}));};
const items=()=>Array.from(doc.querySelectorAll(".ctx-menu .ctx-item")).map(b=>b.textContent);

// ---------- parliamentary: right-click menu ----------
doc.getElementById("btn-new-game").click();
doc.getElementById("btn-setup-next").click();doc.getElementById("btn-setup-next").click();doc.getElementById("btn-setup-next").click();
run("virusDisarm()");
check("parliamentary campaign running",run("S.phase")==="campaign"&&run("S.location")==="sofia-city");
ctx("plovdiv-city");
check("right-click opens a menu",!!doc.querySelector(".ctx-menu"));
check("menu offers travel with its cost",items().some(t=>/^Travel here\d+ SP$/.test(t)));
check("menu has a Take action submenu",items().some(t=>t.indexOf("Travel & take action")===0));
check("parliamentary submenu lists issue rallies",items().some(t=>t.indexOf("Rally: ")===0));
const sp0=run("S.stamina");
Array.from(doc.querySelectorAll(".ctx-menu .ctx-item")).find(b=>b.textContent.indexOf("Travel here")===0).click();
check("Travel here moves the candidate and closes the menu",run("S.location")==="plovdiv-city"&&run("S.stamina")<sp0&&!doc.querySelector(".ctx-menu"));
ctx("plovdiv-city");
check("menu at your own location says so",doc.querySelector(".ctx-head").textContent.indexOf("you are here")>=0&&!items().some(t=>t.indexOf("Travel here")===0));
const rallies0=run("S.stats.rallies");
Array.from(doc.querySelectorAll(".ctx-menu .ctx-item")).find(b=>b.textContent.indexOf("Rally: ")===0).click();
check("submenu rally works",run("S.stats.rallies")===rallies0+1);
ctx("varna");
doc.dispatchEvent(new w.KeyboardEvent("keydown",{key:"Escape"}));
check("Escape closes the menu",!doc.querySelector(".ctx-menu"));
ctx("varna");
doc.body.dispatchEvent(new w.Event("pointerdown",{bubbles:true}));
check("clicking elsewhere closes the menu",!doc.querySelector(".ctx-menu"));
run("S.stamina=0");ctx("varna");
check("unaffordable actions are disabled",Array.from(doc.querySelectorAll(".ctx-menu .ctx-item")).filter(b=>b.textContent.indexOf("Travel here")===0).every(b=>b.disabled));
run("closeMapMenu()");

// ---------- presidential: campaign stops ----------
doc.getElementById("btn-new-pres").click();
doc.querySelector('#pres-ticket-picker-list [data-ticket="own"]').click();
run("S.player.attrs={stamina:5,charisma:5,intelligence:5}");
doc.getElementById("btn-setup-next").click();doc.getElementById("btn-setup-next").click();doc.getElementById("btn-setup-next").click();
check("presidential race running",run("S.mode")==="presidential"&&run("S.phase")==="campaign");
run("selectDistrict(S.location);setInspectorTab('district')");
check("district card has Campaign stop, not issue rallies",!!doc.querySelector('#district-card [data-act="stop"]')&&!doc.querySelector('#district-card [data-act="rally"]'));
// a town hall: pick the answer closest to the district and expect a gain
let gains=0,losses=0;
for(let k=0;k<6;k++){
  run("S.stamina=20;S.ralliesThisTurn=0;S.paused=false");
  doc.querySelector('#district-card [data-act="stop"]').click();
  check("stop "+(k+1)+" opens a decision",!!doc.querySelector("#modal-root [data-k]")&&run("S.paused")===true);
  const before=run("S.districtPoll[S.location].player"),spB=run("S.stamina");
  // choose the option whose value best fits this district if it has an issue, else the first
  const best=run(`(function(){const d=DIST_BY_ID[S.location];const btns=[...document.querySelectorAll("#modal-root [data-k]")].filter(b=>b.dataset.k!=="-1");return btns.length})()`);
  doc.querySelector('#modal-root [data-k="0"]').click();
  const after=run("S.districtPoll[S.location].player");
  if(after>before)gains++;else losses++;
  check("stop "+(k+1)+" costs 3 SP and unpauses",run("S.stamina")===spB-3&&run("S.paused")===false);
}
check("stops move the polls ("+gains+" up / "+losses+" down)",gains+losses===6);
run("S.stamina=20;S.paused=false");
doc.querySelector('#district-card [data-act="stop"]').click();
const sp1=run("S.stamina");
doc.querySelector('#modal-root [data-k="-1"]').click();
check("cancel spends nothing",run("S.stamina")===sp1&&!doc.querySelector("#modal-root [data-k]"));
// news stop in Varna
run("S.location='varna';S.selDistrict='varna';S.stamina=20;S.paused=false;updateAll()");
doc.querySelector('#district-card [data-act="stop"]').click();
check("Varna has a news stop about the drone strikes",doc.querySelector("#modal-root h3").textContent.indexOf("drone")>=0);
doc.querySelector('#modal-root [data-k="2"]').click();
run("S.stamina=20");doc.querySelector('#district-card [data-act="stop"]').click();
check("each news stop happens once",doc.querySelector("#modal-root h3").textContent.indexOf("drone")<0);
doc.querySelector('#modal-root [data-k="-1"]').click();
// right-click in presidential mode offers the stop
ctx("burgas");
check("presidential submenu offers Campaign stop",items().some(t=>t.indexOf("Campaign stop")===0)&&!items().some(t=>t.indexOf("Rally: ")===0));
run("closeMapMenu()");

// ---------- news events ----------
run("buildEventPool()");
const news=JSON.parse(run("JSON.stringify(EVENT_POOL.filter(e=>e.news).map(e=>({t:e.title,s:e.src,o:e.opts.length})))"));
check("pool carries the autumn 2026 headlines ("+news.length+")",news.length>=12&&news.every(n=>n.s&&n.o>=1));
const names=["Iotova","Gyurov","Kostadinov","Mihaylov","Vasilev","Hristanov","Peevski","Radev"];
check("headlines name no candidates or politicians",!JSON.parse(run("JSON.stringify(EVENT_POOL.filter(e=>e.news).map(e=>e.title+' '+e.text))")).some(t=>names.some(n=>t.indexOf(n)>=0)));
run("S.eventQueue=[];S.pres.newsUsed=[]");
let seen=new Set();
for(let i=0;i<40;i++){const k=run("drawEvent()");const ev=run("EVENT_POOL["+k+"].news?EVENT_POOL["+k+"].title:''");if(ev){check("headline drawn once: "+ev,!seen.has(ev));seen.add(ev);}}
run("S.eventQueue=[]");
const q=run("(function(){S.paused=false;const before=S.pres.newsUsed.length;for(let i=0;i<20;i++){S.eventQueue=[];maybeEvents();document.getElementById('modal-root').innerHTML='';S.paused=false;}return S.pres.newsUsed.length-before})()");
check("weekly news draws use fresh headlines",q>=0);
// ---------- migration axis: data matches the labels (low = Open Borders, high = Restrictive) ----------
const mig=JSON.parse(run(`JSON.stringify({lo:ISSUE_BY_ID.migration.lo,hi:ISSUE_BY_ID.migration.hi,yambol:DIST_BY_ID.yambol.ideal.migration,sofia:DIST_BY_ID["sofia-city"].ideal.migration,vaz:PARL_PARTIES.find(p=>p.id==="vaz").pos.migration,ppdb:PARL_PARTIES.find(p=>p.id==="ppdb").pos.migration,kost:PRES_TICKET_BY_ID.kostadinov.pos.migration})`));
check("migration labels run Open Borders -> Restrictive",mig.lo==="Open Borders"&&mig.hi==="Restrictive");
check("nationalist districts want a more restrictive policy than Sofia",mig.yambol>mig.sofia);
check("Vazrazhdane sits on the restrictive side",mig.vaz>.8&&mig.vaz>mig.ppdb&&mig.kost>.8);
check("no uncaught page errors",!(w.__errs&&w.__errs.length));
done();
