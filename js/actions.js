/* ---------- actions ---------- */
function modal(html,onsubmit){const m=document.createElement("div");m.className="modal";m.innerHTML=`<div class="panel" role="dialog">${html}</div>`;document.body.append(m);const close=()=>{m.remove();removeEventListener("keydown",k)},k=e=>e.key=="Escape"&&close();addEventListener("keydown",k);m.onclick=e=>{if(e.target==m||e.target.dataset.x)close()};m.querySelector("form").onsubmit=e=>{e.preventDefault();onsubmit(Object.fromEntries(new FormData(e.target)),close)}}
function paintTheme(){$$(".theme").forEach(b=>b.outerHTML=themeBtn())}
const A={
theme(){const r=document.documentElement,n=r.dataset.theme=="dark"?"light":"dark";r.dataset.theme=n;try{localStorage.setItem(KEY+"-theme",n)}catch(e){}paintTheme()},
at(v){at=v;authView()},eye(v,b){const i=b.previousElementSibling,s=i.type=="password";i.type=s?"text":"password";b.textContent=s?"Hide":"Show"},
demo(v){const u=usr(+v);$("[name=e]").value=u.email;$("[name=p]").value=u.pw;$("[name=p]").type="text";toast("Demo credentials filled. Press Sign in.")},
out(){DB.sess=null;me=null;save();view="overview";first=true;render()},
nav(v){view=v;q="";flt="all";page();scrollTo({top:0,behavior:"smooth"})},
tab(v){tab=v;page()},flt(v){flt=v;page()},
frz(v){const a=acc(+v);a.frozen=!a.frozen;save();page();toast(a.frozen?"Account frozen":"Account unfrozen")},
del(v){const a=acc(+v);if(a.bal>0)return toast("Move the "+fmt(a.bal)+" balance out before closing",1);DB.accs=DB.accs.filter(x=>x!=a);DB.cards=DB.cards.filter(c=>c.acc!=a.id);save();page();toast("Account closed")},
newacc(){modal(`<h2 style="margin-bottom:14px">Open account</h2><form><label>Account type<select name="t"><option>Current</option><option>Savings</option></select></label><div class="row"><button type="button" class="btn ghost" data-x="1">Cancel</button><button class="btn">Open account</button></div></form>`,(d,c)=>{const a={id:DB.nid++,uid:me.id,type:d.t,no:"NG"+rnd(6),bal:0,frozen:false};DB.accs.push(a);save();c();page();toast("Account "+a.no+" opened")})},
newcard(){const a=mine().filter(x=>!x.frozen);if(!a.length)return toast("Open an active account first",1);DB.cards.push({id:DB.nid++,uid:me.id,acc:a[0].id,no:"5321 "+rnd(4)+" "+rnd(4)+" "+rnd(4),exp:"0"+(1+Math.floor(Math.random()*9))+"/30",frozen:false});save();page();toast("Card issued and linked to "+accName(a[0].id))},
reveal(v){const c=DB.cards.find(x=>x.id==+v),el=$("#cn"+v),h=el.dataset.s;el.dataset.s=h?"":1;el.textContent=h?"•••• •••• •••• "+c.no.slice(-4):c.no},
cfrz(v){const c=DB.cards.find(x=>x.id==+v);c.frozen=!c.frozen;save();page();toast(c.frozen?"Card frozen":"Card unfrozen")},
repay(v){const l=DB.loans.find(x=>x.id==+v),m=Math.round(monthly(l.amt,l.months)*100)/100,a=mine().find(x=>!x.frozen&&x.bal>=m);if(!a)return toast("No active account has "+fmt(m)+" available",1);post(a.id,"out",m,"Loan installment");l.paid++;if(l.paid>=l.months)l.status="paid";save();page();toast("Installment of "+fmt(m)+" paid")},
approve(v){const l=DB.loans.find(x=>x.id==+v),a=DB.accs.find(x=>x.uid==l.uid&&!x.frozen);if(!a)return toast("Customer has no active account to credit",1);l.status="active";post(a.id,"in",l.amt,"Loan disbursed");save();page();toast("Loan approved and credited")},
reject(v){DB.loans.find(x=>x.id==+v).status="rejected";save();page();toast("Loan rejected")},
cust(v){const a=DB.accs.filter(x=>x.uid==+v),fz=a.length&&a.every(x=>x.frozen);a.forEach(x=>x.frozen=!fz);save();page();toast(fz?"Accounts unfrozen":"Accounts frozen")}};
root.onclick=e=>{const b=e.target.closest("[data-a]");if(b&&A[b.dataset.a])A[b.dataset.a](b.dataset.v,b)};
const bad=(f,id,m)=>{$("#"+id).textContent=m;f.classList.remove("shake");void f.offsetWidth;f.classList.add("shake")};
const enter=u=>{me=u;DB.sess=u.id;save();view="overview";first=true;render();toast("Welcome, "+u.name.split(" ")[0])};
root.onsubmit=e=>{e.preventDefault();const f=e.target,d=Object.fromEntries(new FormData(f)),id=f.id;
 if(id=="lf"){const u=DB.users.find(x=>x.email==(d.e||"").trim().toLowerCase()&&x.pw==d.p);return u?enter(u):bad(f,"err","Email or password is wrong. Check both, or use a demo account below.")}
 if(id=="rf"){const em=(d.e||"").trim().toLowerCase();if(!d.n.trim())return bad(f,"err","Enter your full name.");if(!/^\S+@\S+\.\S+$/.test(em))return bad(f,"err","Enter a valid email address.");if(d.p.length<6)return bad(f,"err","Password needs at least 6 characters.");if(DB.users.some(x=>x.email==em))return bad(f,"err","That email already has an account. Sign in instead.");
  const u={id:DB.nid++,name:d.n.trim(),email:em,pw:d.p,role:"customer"};DB.users.push(u);DB.accs.push({id:DB.nid++,uid:u.id,type:"Current",no:"NG"+rnd(6),bal:0,frozen:false});return enter(u)}
 if(id=="mf"){const amt=Math.round(parseFloat(d.amt)*100)/100,a=acc(+d.a);if(!a)return bad(f,"err","Open an account first.");if(!(amt>0))return bad(f,"err","Enter an amount greater than zero.");if(a.frozen)return bad(f,"err","This account is frozen. Unfreeze it on the Accounts page.");
  if(tab!="deposit"&&a.bal<amt)return bad(f,"err","Not enough funds. Available: "+fmt(a.bal));
  if(tab=="transfer"){const b=DB.accs.find(x=>x.no==(d.to||"").trim().toUpperCase());if(!b)return bad(f,"err","No account has that number.");if(b==a)return bad(f,"err","Pick a different receiving account.");if(b.frozen)return bad(f,"err","The receiving account is frozen.");post(a.id,"out",amt,d.note||"Transfer to "+b.no);post(b.id,"in",amt,d.note||"Transfer from "+a.no)}
  else if(tab=="bill"){if(!(d.ref||"").trim())return bad(f,"err","Enter the customer reference from your bill.");post(a.id,"out",amt,"Bill: "+d.biller)}
  else post(a.id,tab=="deposit"?"in":"out",amt,d.note||(tab=="deposit"?"Deposit":"Withdrawal"));
  save();toast("Done: "+fmt(amt)+" "+(tab=="deposit"?"deposited":tab=="withdraw"?"withdrawn":tab=="bill"?"paid":"sent"));return A.nav("overview")}
 if(id=="loanf"){const amt=parseFloat(d.amt);if(!(amt>=1000))return bad(f,"err","Loans start at EGP 1,000.");if(!mine().length)return bad(f,"err","Open an account first.");DB.loans.push({id:DB.nid++,uid:me.id,amt,months:+d.m,status:"pending",paid:0});save();page();toast("Loan request sent for review")}
 if(id=="pf"){if(!d.n.trim())return bad(f,"err","Name cannot be empty.");me.name=d.n.trim();save();shell();toast("Name updated")}
 if(id=="cf"){if(d.o!=me.pw)return bad(f,"err2","Current password is wrong.");if(d.p.length<6)return bad(f,"err2","New password needs at least 6 characters.");me.pw=d.p;save();f.reset();$("#err2").textContent="";toast("Password updated")}};
root.oninput=e=>{const t=e.target;
 if(t.id=="q"){q=t.value;const l=[...scope()].sort((a,b)=>b.d-a.d).filter(x=>(flt=="all"||x.t==flt)&&(x.note+accName(x.acc)).toLowerCase().includes(q.toLowerCase()));$("#rows").innerHTML=rows(l,admin())}
 if(t.id=="to"){const b=DB.accs.find(x=>x.no==t.value.trim().toUpperCase());$("#hint").textContent=b?"Sending to "+usr(b.uid).name:""}
 if(t.id=="la"||t.id=="lm"){const a=parseFloat($("#la").value),m=+$("#lm").value;$("#prev").textContent=a>0?"About "+fmt(monthly(a,m))+" a month, "+fmt(monthly(a,m)*m)+" in total.":"Enter an amount to see your monthly payment."}};
document.addEventListener("change",e=>e.target.id=="lm"&&root.oninput(e));
