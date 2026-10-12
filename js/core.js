const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)],root=$("#root");
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fmt=n=>"EGP "+n.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2});
const day=n=>Date.now()-n*864e5,KEY="newgiza-v1",rnd=n=>String(Math.floor(Math.random()*9*10**(n-1)+10**(n-1)));
const seed=()=>({users:[
{id:1,name:"Sara Mahmoud",email:"sara@newgiza.bank",pw:"demo123",role:"customer"},
{id:2,name:"Omar Khalil",email:"omar@newgiza.bank",pw:"demo123",role:"customer"},
{id:9,name:"Branch Manager",email:"admin@newgiza.bank",pw:"admin123",role:"admin"}],
accs:[{id:1,uid:1,type:"Current",no:"NG482100",bal:18450,frozen:false},{id:2,uid:1,type:"Savings",no:"NG773002",bal:62000,frozen:false},{id:3,uid:2,type:"Current",no:"NG119544",bal:9300,frozen:false}],
txs:[{id:1,acc:1,t:"in",amt:12000,note:"Salary",d:day(6)},{id:2,acc:1,t:"out",amt:3500,note:"Rent",d:day(5)},{id:3,acc:3,t:"in",amt:5400,note:"Invoice 208",d:day(4)},{id:4,acc:1,t:"out",amt:640,note:"Bill: Electricity",d:day(3)},{id:5,acc:2,t:"in",amt:5000,note:"Savings top-up",d:day(2)},{id:6,acc:3,t:"out",amt:1200,note:"Supplier payment",d:day(1)},{id:7,acc:1,t:"out",amt:210,note:"Bill: Mobile",d:day(0)}],
cards:[{id:1,uid:1,acc:1,no:"5321 4408 1290 7734",exp:"09/29",frozen:false}],
loans:[{id:1,uid:2,amt:20000,months:12,status:"pending",paid:0}],nid:50,sess:null});
let DB;try{DB=JSON.parse(localStorage.getItem(KEY))||seed()}catch(e){DB=seed()}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(DB))}catch(e){}};
let me=DB.users.find(u=>u.id==DB.sess)||null,view="overview",tab="deposit",at="in",flt="all",q="",first=true;
const admin=()=>me.role=="admin",mine=()=>DB.accs.filter(a=>a.uid==me.id),
 scope=()=>admin()?DB.txs:DB.txs.filter(x=>mine().some(a=>a.id==x.acc)),
 acc=id=>DB.accs.find(a=>a.id==id),usr=id=>DB.users.find(u=>u.id==id),
 accName=id=>{const a=acc(id);return a?`${a.type} ${a.no}`:"Closed account"},
 monthly=(a,m)=>a*(1+.14*m/12)/m;
function toast(m,bad){const t=document.createElement("div");t.className="toast"+(bad?" bad":"");t.textContent=m;$("#toasts").append(t);setTimeout(()=>{t.style.opacity=0;t.style.transition="opacity .3s";setTimeout(()=>t.remove(),300)},2800)}
function countUp(el,to){if(matchMedia("(prefers-reduced-motion:reduce)").matches)return el.textContent=fmt(to).slice(4);const t0=performance.now();(function f(t){const p=Math.min(1,(t-t0)/1100);el.textContent=fmt(to*(1-Math.pow(1-p,4))).slice(4);if(p<1)requestAnimationFrame(f)})(t0)}
function post(id,t,amt,note){const a=acc(id);a.bal=Math.round((a.bal+(t=="in"?amt:-amt))*100)/100;DB.txs.push({id:DB.nid++,acc:id,t,amt,note,d:Date.now()})}
const themeBtn=()=>{const d=root.parentElement&&document.documentElement.dataset.theme=="dark";return `<button class="theme" data-a="theme" aria-label="Toggle dark and light mode"><span>${d?"Dark":"Light"} mode</span><b class="knob">${d?"☾":"☀"}</b></button>`};
const logoSvg=`<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3 30 27H2z" fill="none" stroke="#E3B547" stroke-width="2.4" stroke-linejoin="round"/><path d="M16 12l7 12H9z" fill="#E3B547"/></svg>`;
