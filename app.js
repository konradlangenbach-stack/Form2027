(()=>{
const KEY='form27',$=s=>document.querySelector(s);
const E=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const ymd=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const addD=(d,n)=>{const x=new Date(d);x.setDate(x.getDate()+n);return x};
const mon=d=>addD(d,-((d.getDay()+6)%7));
const uid=()=>Math.random().toString(36).slice(2,8);
const END=new Date(2027,9,1);
const SEC=[['thron','Thron'],['skills','Skills'],['koerper','Körper'],['kopf','Kopf'],['regen','Regeneration'],['ernaehrung','Ernährung'],['spiel','Spiel'],['plan','Plan'],['routinen','Routinen']];
const MET={skills:[['hit','Treffer heute'],['att','Versuche heute']],kopf:[['mood','Stimmung (1–5)'],['ref','Tagesreflexion','t']],regen:[['sleep','Schlaf (Std.)'],['energy','Energie (1–5)']],ernaehrung:[['water','Wasser (Gläser)'],['prot','Protein (g)']]};
const PH=[['Grundlagen',[2026,10,1]],['Aufbau',[2027,1,1]],['Intensität',[2027,4,1]],['Feinschliff',[2027,7,1]],['Peak',[2027,9,1]],['Ende',[2027,10,1]]];
const DAYS=['Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag','Sonntag'];
const GR=['Morgen','Training','Abend'];
const it=(n,t,r,g)=>({id:uid(),n,t,r,g});
const seed=()=>({items:{
skills:[it('Form Shooting',5,'50 Würfe'),it('Freiwürfe',5,'50 Würfe'),it('Ballhandling',4,'20 Min.'),it('Verteidigung: Footwork',3,'15 Min.')],
koerper:[it('Krafttraining',3,''),it('Sprungkraft',2,''),it('Ausdauer',2,''),it('Mobilität und Prävention',4,'')],
kopf:[it('Visualisierung',5,'10 Min.'),it('Atemübung',5,'5 Min.'),it('Pre-Game-Ritual',3,'')],
regen:[it('Dehnen',5,''),it('Foam Rolling',4,'')],
ernaehrung:[it('Proteinziel erreicht',7,''),it('Drei volle Mahlzeiten',7,'')],
routinen:[it('Wasser und Mobilität',7,'','Morgen'),it('Aufwärmen',5,'','Training'),it('Reflexion und Schlafvorbereitung',7,'','Abend')]},
log:{},met:{},goal:{},games:[],sw:{s:'',w:''},wp:{},rep:{}});
let S;try{S=JSON.parse(localStorage.getItem(KEY))}catch(e){}
S=S||seed();
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
let cur='thron',T,WS;
const done=(id,d)=>!!(S.log[d]&&S.log[d][id]);
const wc=(id,ws)=>{let c=0;for(let i=0;i<7;i++)if(done(id,ymd(addD(ws,i))))c++;return c};
const pct=(items,ws)=>{let a=0,b=0;items.forEach(i=>{a+=Math.min(wc(i.id,ws),i.t);b+=i.t});return b?Math.round(a/b*100):0};
const all=()=>Object.values(S.items).flat();
const dayPct=d=>{const a=all();return a.length?Math.round(a.filter(i=>done(i.id,d)).length/a.length*100):0};
const form=()=>{const a=[0,1,2,3].map(i=>pct(all(),addD(WS,-7*i))).filter((p,i)=>i===0||p>0);return Math.round(a.reduce((x,y)=>x+y,0)/a.length)};
const mv=k=>(S.met[T]||{})[k]??'';
const streak=g=>{const its=S.items.routinen.filter(i=>i.g===g);if(!its.length)return 0;let d=new Date(),n=0;const ok=x=>its.every(i=>done(i.id,ymd(x)));if(!ok(d))d=addD(d,-1);while(ok(d)&&n<2000){n++;d=addD(d,-1)}return n};
const bar=p=>`<div class="bar"><i style="width:${p}%"></i></div>`;
const phase=()=>{const n=new Date();for(let i=0;i<5;i++){const s=new Date(...PH[i][1]),e=new Date(...PH[i+1][1]);if(n<e||i===4)return{n:PH[i][0],p:Math.round(Math.max(0,Math.min(1,(n-s)/(e-s)))*100)}}};
const list=(sec,g)=>S.items[sec].filter(i=>!g||i.g===g).map(i=>`<div class="row"><button class="chk ${done(i.id,T)?'on':''}" data-a="tog" data-id="${i.id}" aria-label="Abhaken"></button><div class="nm"><b>${E(i.n)}</b><small>${E(i.r)} ${E(i.r)?'· ':''}${wc(i.id,WS)}/${i.t} diese Woche</small></div><button class="ed" data-a="edit" data-s="${sec}" data-id="${i.id}">⋯</button></div>`).join('')||'<small>Noch nichts angelegt.</small>';
const head=(sec,t)=>{const p=pct(S.items[sec]||[],WS);return `<h1>${t}</h1><div class="card"><small>Woche: ${p}%</small>${bar(p)}</div>`};
const V={
thron(){const d=Math.max(0,Math.ceil((END-new Date())/864e5)),ph=phase();
return `<h1>Thron</h1><div class="hero"><small>Noch</small><div class="big">${d}</div><small>Tage bis Oktober 2027 · ${Math.floor(d/7)} Wochen</small></div>
<div class="card"><label class="mt"><span>HAUPTZIEL HEUTE</span><input data-goal value="${E(S.goal[T])}" placeholder="Was entscheidet heute?"></label></div>
<div class="trio">${[['Heute',dayPct(T)],['Woche',pct(all(),WS)],['Form',form()]].map(([l,p])=>`<div class="card tri"><b>${p}%</b><small>${l}</small></div>`).join('')}</div>
<div class="card"><small>Phase: ${ph.n}</small>${bar(ph.p)}</div>`},
generic(sec){const t=SEC.find(s=>s[0]===sec)[1];
const m=(MET[sec]||[]).map(([k,l,x])=>`<label class="mt"><span>${l.toUpperCase()}</span>${x?`<textarea data-m="${k}" rows="3">${E(mv(k))}</textarea>`:`<input data-m="${k}" type="number" inputmode="decimal" value="${E(mv(k))}">`}</label>`).join('');
let q='';if(sec==='skills'){let h=0,a=0;for(let i=0;i<7;i++){const x=S.met[ymd(addD(WS,i))]||{};h+=+x.hit||0;a+=+x.att||0}q=`<small>Trefferquote diese Woche: ${a?Math.round(h/a*100)+'%':'–'}</small>`}
return head(sec,t)+(m?`<div class="card">${m}${q}</div>`:'')+`<div class="card">${list(sec)}</div><button class="btn" data-a="add" data-s="${sec}">+ HINZUFÜGEN</button>`},
spiel(){const g=S.games,avg=g.length?(g.reduce((a,x)=>a+(+x.p||0),0)/g.length).toFixed(1):'–';
return `<h1>Spiel</h1><div class="trio"><div class="card tri"><b>${g.length}</b><small>Spiele</small></div><div class="card tri"><b>${avg}</b><small>Ø Punkte</small></div><div class="card tri"><b>${g.length?g[g.length-1].p:'–'}</b><small>Letztes</small></div></div>
<button class="btn" data-a="game">+ SPIEL EINTRAGEN</button>
<div class="card">${g.map((x,i)=>`<div class="row"><div class="nm"><b>${E(x.o)} · ${E(x.p)} Pkt.</b><small>${E(x.d)} ${E(x.n)}</small></div><button class="ed" data-a="delgame" data-id="${i}">✕</button></div>`).reverse().join('')||'<small>Noch keine Spiele.</small>'}</div>
<div class="card"><label class="mt"><span>STÄRKEN</span><textarea data-sw="s" rows="3">${E(S.sw.s)}</textarea></label><label class="mt"><span>SCHWÄCHEN</span><textarea data-sw="w" rows="3">${E(S.sw.w)}</textarea></label></div>`},
plan(){const ph=PH.slice(0,5).map((p,i)=>{const s=new Date(...p[1]),e=new Date(...PH[i+1][1]),v=Math.round(Math.max(0,Math.min(1,(new Date()-s)/(e-s)))*100);return `<div class="row col"><b>${p[0]}</b><small>${s.toLocaleDateString('de-DE')} – ${addD(e,-1).toLocaleDateString('de-DE')}</small>${bar(v)}</div>`}).join('');
const k=ymd(WS);
return `<h1>Plan</h1><div class="card">${ph}</div>
<div class="card">${DAYS.map((d,i)=>`<label class="mt"><span>${d.toUpperCase()}</span><input data-wp="${i}" value="${E(S.wp[i])}" placeholder="Schwerpunkt"></label>`).join('')}</div>
<div class="card"><small>WOCHENBERICHT</small>${SEC.filter(s=>S.items[s[0]]).map(s=>{const p=pct(S.items[s[0]],WS);return `<div class="row col"><span>${s[1]} · ${p}%</span>${bar(p)}</div>`}).join('')}<label class="mt"><span>NOTIZEN: WAS LIEF GUT, WAS WIRD ANGEPASST?</span><textarea data-rep="${k}" rows="4">${E(S.rep[k])}</textarea></label></div>
<button class="btn" data-a="exp">DATEN SICHERN (EXPORT)</button><button class="btn" data-a="imp">DATEN LADEN (IMPORT)</button>`},
routinen(){return `<h1>Routinen</h1>`+GR.map(g=>`<div class="card"><small>${g.toUpperCase()} · Serie: ${streak(g)} Tage</small>${list('routinen',g)}<button class="btn" style="margin:10px 0 0" data-a="add" data-s="routinen" data-g="${g}">+ HINZUFÜGEN</button></div>`).join('')}
};
function render(){T=ymd(new Date());WS=mon(new Date());const m=$('#main');m.innerHTML=(V[cur]||(()=>V.generic(cur)))();document.querySelectorAll('#nav button').forEach(b=>b.classList.toggle('on',b.dataset.s===cur))}
$('#nav').innerHTML=SEC.map(s=>`<button data-a="nav" data-s="${s[0]}">${s[1]}</button>`).join('');
document.addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a,id=b.dataset.id,s=b.dataset.s;
if(a==='nav'){cur=s;render();$('#main').scrollTop=0;b.scrollIntoView({inline:'center'});return}
if(a==='tog'){S.log[T]=S.log[T]||{};S.log[T][id]?delete S.log[T][id]:S.log[T][id]=1}
else if(a==='add'){const n=prompt('Name:');if(!n)return;const t=Math.min(7,Math.max(1,+prompt('Einheiten pro Woche (1–7):','3')||1));const r=prompt('Wiederholungen oder Notiz (z. B. 50 Würfe):','')||'';S.items[s].push(it(n,t,r,b.dataset.g))}
else if(a==='edit'){const x=S.items[s].find(i=>i.id===id),n=prompt('Name (leer lassen = löschen):',x.n);if(n===null)return;if(!n.trim()){if(!confirm('Wirklich löschen?'))return;S.items[s]=S.items[s].filter(i=>i.id!==id)}else{x.n=n;x.t=Math.min(7,Math.max(1,+prompt('Einheiten pro Woche (1–7):',x.t)||x.t));const r=prompt('Wiederholungen oder Notiz:',x.r||'');if(r!==null)x.r=r}}
else if(a==='game'){const o=prompt('Gegner:');if(!o)return;S.games.push({o,p:prompt('Eigene Punkte:','')||0,n:prompt('Notiz (optional):','')||'',d:new Date().toLocaleDateString('de-DE')})}
else if(a==='delgame'){if(confirm('Spiel löschen?'))S.games.splice(+id,1);else return}
else if(a==='exp'){const l=document.createElement('a');l.href=URL.createObjectURL(new Blob([JSON.stringify(S)],{type:'application/json'}));l.download='form2027-backup-'+T+'.json';l.click();return}
else if(a==='imp'){$('#file').click();return}
save();render()});
document.addEventListener('change',e=>{const t=e.target,d=t.dataset;
if(t.id==='file'){const f=t.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{try{S=Object.assign(seed(),JSON.parse(r.result));save();render();alert('Daten geladen.')}catch(x){alert('Datei konnte nicht gelesen werden.')}};r.readAsText(f);return}
if(d.m!==undefined){S.met[T]=S.met[T]||{};S.met[T][d.m]=t.value}
else if(d.goal!==undefined)S.goal[T]=t.value;
else if(d.wp!==undefined)S.wp[d.wp]=t.value;
else if(d.rep!==undefined)S.rep[d.rep]=t.value;
else if(d.sw!==undefined)S.sw[d.sw]=t.value;
else return;
save();render()});
render();
})();
