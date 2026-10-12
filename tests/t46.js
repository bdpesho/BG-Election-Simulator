// T46: presidential mode — setup, real/own tickets, round 1 rules, runoff, endorsements,
// separate save slot, and no invented events about the real candidates.
const {boot,suite}=require("./harness");
const {check,done}=suite();
const {window:w,document:doc}=boot();
const run=c=>w.eval(c);
const settle=()=>run(`(function(){let n=0;while(S.paused&&n++<40){const b=document.querySelector("#modal-root #db-go, #modal-root [data-ai], #modal-root #db-done, #modal-root .ev-opts button");if(b)b.click();else S.paused=false;}})()`);

// ---- setup ----
check("title offers a presidential race",!!doc.getElementById("btn-new-pres"));
doc.getElementById("btn-new-pres").click();
check("setup switches to presidential labels",doc.getElementById("step-tab-1").textContent.indexOf("Running mate")>=0&&doc.getElementById("pres-ticket-picker").style.display==="");
check("ticket picker lists own + 6 real tickets",doc.querySelectorAll("#pres-ticket-picker-list [data-ticket]").length===7);
check("running mate picker is filled",doc.querySelectorAll("#pres-vp-list [data-vp]").length===4);

// real ticket: skip straight to launch, then start
doc.querySelector('#pres-ticket-picker-list [data-ticket="gyurov"]').click();
check("real ticket takes over the name",run("S.player.name")==="Andrey Gyurov"&&run("S.pres.ticket")==="gyurov");
check("real tickets play with neutral attributes",run("S.player.attrs.stamina+S.player.attrs.charisma+S.player.attrs.intelligence")===15);
doc.getElementById("btn-setup-next").click();
check("real ticket jumps to the launch step",run("S.setupStep")===2);
doc.getElementById("btn-setup-next").click();
check("race starts in campaign phase",run("S.phase")==="campaign"&&run("S.mode")==="presidential");
check("rivals are the other five tickets",run("AI_PARTIES.map(p=>p.id).sort().join()")==="hristanov,iotova,kostadinov,mihaylov,vasilev");
const nat=JSON.parse(run("JSON.stringify(nationalShares(false))"));
check("Iotova opens ahead, near her polling ("+(nat.iotova*100).toFixed(1)+"%)",nat.iotova>.42&&nat.iotova<.56);
check("playing as Gyurov opens near his polling ("+(nat.player*100).toFixed(1)+"%)",nat.player>.22&&nat.player<.33);
check("topbar counts 6 weeks",doc.getElementById("tb-clock").textContent==="WEEK 1/6");
const pollText=run("renderNationalPolls()").replace(/<[^>]+>/g," ");
check("polls tab speaks runoff, not seats",pollText.indexOf("runoff")>=0&&pollText.indexOf("seats")<0);

// events never accuse the real candidates of anything
run("buildEventPool()");
const pool=JSON.parse(run("JSON.stringify(EVENT_POOL.map(e=>e.title+' '+e.text))"));
const names=["Iotova","Gyurov","Kostadinov","Mihaylov","Vasilev","Hristanov","Valchev","Kandev","Volgin","Mateeva"];
check("event pool names no real candidate",!pool.some(t=>names.some(n=>t.indexOf(n)>=0)));
check("rival-scandal events are removed",!pool.some(t=>/^(Rival gaffe|Anonymous dossier|Leaked rival memo) /.test(t)));

// ---- round 1 ----
for(let i=0;i<6&&run("S.phase")==="campaign";i++){settle();run("endTurn()");settle();}
check("round 1 is held after week 6",run("S.phase")==="election"&&run("S.results.pres===true")&&run("S.results.round")===1);
run("finishElectionNight()");
check("election screen hides the seat strip",doc.getElementById("screen-election").classList.contains("pres"));
const r1=JSON.parse(run("JSON.stringify(S.results)"));
const top=r1.order[0];
const sum=Object.values(r1.natShare).reduce((a,b)=>a+b,0)+r1.others;
check("round-1 shares + others add up to 100%",Math.abs(sum-1)<1e-6);
check("turnout is presidential-low ("+(r1.turnout*100).toFixed(0)+"%)",r1.turnout>.3&&r1.turnout<.5);
check("no outright win below 50% turnout",r1.winner===null&&r1.finalists.length===2&&r1.finalists[0]===top);

// force the player into the runoff to exercise that branch
if(r1.finalists.indexOf("player")<0){
  run(`S.pres.rounds[1].finalists=S.results.finalists=[S.results.order[0],"player"]`);
}
run("presAfterCount()");
check("runoff modal offers outreach choices",doc.querySelectorAll("#modal-root [data-court]").length>=2);
doc.querySelector('#modal-root [data-court=""]').click();
check("runoff week starts",run("S.phase")==="campaign"&&run("S.pres.round")===2&&run("S.week")===7);
check("only one rival left",run("AI_PARTIES.length")===1);
check("topbar shows the runoff week",doc.getElementById("tb-clock").textContent==="RUNOFF WEEK");
settle();
run("endTurn()");settle();
check("runoff is counted",run("S.phase")==="election"&&run("S.results.round")===2);
run("finishElectionNight()");
const r2=JSON.parse(run("JSON.stringify(S.results)"));
check("runoff has exactly two candidates and a winner",Object.keys(r2.natShare).length===2&&!!r2.winner);
run("presAfterCount()");
check("race ends with a presidential ending",run("S.phase")==="end"&&/^pres_/.test(run("S.ending")));
check("end text is presidential",doc.getElementById("end-text").textContent.length>40&&doc.getElementById("end-stats").textContent.indexOf("Runoff")>=0);
check("no next-term button in presidential mode",doc.getElementById("btn-next-term").style.display==="none");

// ---- separate save slots ----
check("presidential save uses its own slot",!!w.localStorage.getItem("121towin-pres-save-v1"));
const parlSave=w.localStorage.getItem("121towin-save-v6");

// ---- own ticket, eliminated, endorses ----
doc.getElementById("btn-new-pres").click();
doc.querySelector('#pres-ticket-picker-list [data-ticket="own"]').click();
doc.querySelector('#pres-vp-list [data-vp="mayor"]').click();
run(`S.player.attrs={stamina:5,charisma:5,intelligence:5}`);
doc.getElementById("btn-setup-next").click();
doc.getElementById("btn-setup-next").click();
doc.getElementById("btn-setup-next").click();
check("own ticket starts as an outsider ("+(run("S.pollNat.player")*100).toFixed(1)+"%)",run("S.pollNat.player")>.02&&run("S.pollNat.player")<.09);
check("running mate perk applied",run("S.modifiers.some(m=>m.name.indexOf('Todor Kanev')>=0)")&&run("getMaxStamina()")===8+5+2);
check("own ticket rivals are all six tickets",run("AI_PARTIES.length")===6);
for(let i=0;i<6&&run("S.phase")==="campaign";i++){settle();run("endTurn()");settle();}
run("finishElectionNight()");
if(run("S.results.finalists&&S.results.finalists.indexOf('player')>=0")){
  run(`S.results.finalists=S.results.order.filter(k=>k!=="player").slice(0,2)`);
}
run("presAfterCount()");
check("eliminated player is asked to endorse",doc.querySelectorAll("#modal-root [data-endorse]").length===3);
const pickId=doc.querySelector("#modal-root [data-endorse]").dataset.endorse;
doc.querySelector("#modal-root [data-endorse]").click();
check("spectator runoff excludes the player",run("S.results.round")===2&&run("S.results.natShare.player===undefined"));
run("finishElectionNight()");run("presAfterCount()");
check("eliminated ending records the endorsement",run("S.ending")==="pres_out"&&doc.getElementById("end-text").textContent.indexOf("endorsed")>=0);

// ---- back to parliament ----
doc.getElementById("btn-new-game").click();
check("parliamentary setup restores the ten parties",run("AI_PARTIES.length")===10&&run("AI_PARTIES.some(p=>p.id==='gerb')"));
check("parliamentary labels are back",doc.getElementById("step-tab-1").textContent.indexOf("Party")>=0&&doc.getElementById("pres-ticket-picker").style.display==="none");
check("presidential games never touched the parliamentary save",w.localStorage.getItem("121towin-save-v6")===parlSave);

// ---- load a presidential save ----
run("loadGame(PRES_SAVE_KEY)");
check("loading a presidential save restores the tickets",run("S.mode")==="presidential"&&run("AI_PARTIES.every(p=>p.isTicket)"));

check("no uncaught page errors",!(w.__errs&&w.__errs.length));
done();
