// T45 regression: every preset candidate fits the attribute budget and passes setup step 1.
const {boot,suite}=require("./harness");
const {check,done}=suite();
const {window,document,g}=boot();

check("every preset fits the budget",g.PRESET_LEADERS.every(p=>p.attrs.stamina+p.attrs.charisma+p.attrs.intelligence<=g.ATTR_BUDGET));
document.getElementById("btn-new-game").click();
document.querySelectorAll("#preset-leaders .preset-card").forEach((card,i)=>{
  card.click();
  const err=document.getElementById("setup-error");
  if(err)err.style.display="none";
  document.getElementById("btn-setup-next").click();
  const blocked=!!err&&err.style.display==="block";
  check("preset "+(i+1)+" passes step 1",!blocked&&g.state().setupStep===1);
  document.getElementById("btn-setup-back").click();
});
check("no uncaught page errors",!(window.__errs&&window.__errs.length));
done();
