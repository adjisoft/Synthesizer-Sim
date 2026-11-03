/* controls.js: kontrol knob/fader, render panel, dan preset (bawaan + simpanan di localStorage). */
// controls
function lk(id){if(bl&&(id=='bs'||id=='be')){V[id=='bs'?'be':'bs']=V[id];UI.bs&&UI.bs();UI.be&&UI.be()}}
function fd(id,host){const [l,mn,mx,df,st,lg]=PR[id],w=document.createElement('div');w.className='kw fw';
w.innerHTML='<span>'+l+'</span><div class="fd" tabindex="0" role="slider" aria-valuemin="'+mn+'" aria-valuemax="'+mx+'" aria-label="'+l+'"><em></em><i></i></div><u></u>';const f=w.querySelector('.fd'),u=w.querySelector('u');
const nm=v=>lg?Math.log(v/mn)/Math.log(mx/mn):(v-mn)/(mx-mn),dn=n=>{let v=lg?mn*(mx/mn)**n:mn+(mx-mn)*n;if(st)v=Math.round(v/st)*st;return +v.toFixed(3)};
const sh=()=>{f.style.setProperty('--p',nm(V[id]));u.textContent=Math.round(V[id]*100)/100;f.setAttribute('aria-valuenow',V[id])};
const set=n=>{V[id]=dn(Math.max(0,Math.min(1,n)));lk(id);sh();ap()};let dg=false;
const pos=e=>{const r=f.getBoundingClientRect();set(1-(e.clientY-r.top-9)/(r.height-18))};
f.onpointerdown=e=>{f.setPointerCapture(e.pointerId);dg=true;pos(e)};f.onpointermove=e=>{if(dg)pos(e)};f.onpointerup=f.onpointercancel=()=>dg=false;
f.ondblclick=()=>{V[id]=df;lk(id);sh();ap()};f.onkeydown=e=>{const d=e.key=='ArrowUp'||e.key=='ArrowRight'?.04:e.key=='ArrowDown'||e.key=='ArrowLeft'?-.04:0;if(d){e.preventDefault();set(nm(V[id])+d)}};
UI[id]=sh;host.append(w);sh()}
function mk(id,host){if((mode=='f'||mode=='m'&&FD.has(id))&&id[0]!='w'){fd(id,host);return}const p=PR[id],w=document.createElement('div');w.className='kw';
if(id[0]=='w'){w.innerHTML='<span>'+p[0]+'</span><select aria-label="'+p[0]+'">'+WN.map((x,i)=>'<option value='+i+'>'+x+'</option>').join('')+'</select>';const s=w.querySelector('select');s.onchange=()=>{V[id]=+s.value};UI[id]=()=>s.value=V[id];host.append(w);UI[id]();return}
const [l,mn,mx,df,st,lg]=p;w.innerHTML='<div class="k" tabindex="0" role="slider" aria-valuemin="'+mn+'" aria-valuemax="'+mx+'" aria-label="'+l+'"><i></i></div><span>'+l+'</span><u></u>';const k=w.firstChild,u=w.lastChild;
const nm=v=>lg?Math.log(v/mn)/Math.log(mx/mn):(v-mn)/(mx-mn),dn=n=>{let v=lg?mn*(mx/mn)**n:mn+(mx-mn)*n;if(st)v=Math.round(v/st)*st;return +v.toFixed(3)};
const sh=()=>{k.style.setProperty('--a',(nm(V[id])*270-135)+'deg');u.textContent=V[id];k.setAttribute('aria-valuenow',V[id])};
const set=n=>{V[id]=dn(Math.max(0,Math.min(1,n)));lk(id);sh();ap()};let y0=null,n0=0;
k.onpointerdown=e=>{k.setPointerCapture(e.pointerId);y0=e.clientY;n0=nm(V[id])};k.onpointermove=e=>{if(y0!=null)set(n0+(y0-e.clientY)/140)};k.onpointerup=k.onpointercancel=()=>y0=null;
k.ondblclick=()=>{V[id]=df;lk(id);sh();ap()};k.onkeydown=e=>{const d=e.key=='ArrowUp'||e.key=='ArrowRight'?.04:e.key=='ArrowDown'||e.key=='ArrowLeft'?-.04:0;if(d){e.preventDefault();set(nm(V[id])+d)}};
UI[id]=sh;host.append(w);sh()}
const ref=()=>Object.values(UI).forEach(f=>f());
function userP(){try{return JSON.parse(localStorage.getItem('sl'+cur)||'{}')}catch(e){return{}}}
function fillPre(sel){const s=S[cur],u=userP();$('#pre').innerHTML=Object.keys(s.pre).map(k=>'<option>'+k+'</option>').join('')+Object.keys(u).map(k=>'<option value="u:'+k+'">* '+k+'</option>').join('');if(sel)$('#pre').value=sel}
function loadPre(v){const s=S[cur];let p;if(v.startsWith('u:'))p=userP()[v.slice(2)];else p=s.pre[v];const o={};for(const k in DEF)if(!FXK.includes(k))o[k]=DEF[k];Object.assign(V,o,s.base,p||{});V.dw=dwNorm(V.dw);dwv=dwv.map(x=>x+1);V.sc=typeof V.sc=='string'?pts(V.sc):[...V.sc];shVer++;ref();shDraw();dwDraw();ap()}
const FD=new Set(['a','d','s','r','eqL','eqM','eqH','vol','bs','be','bt']);
function grp(host,ids,t){if(!ids.length)return;const h=document.createElement('div');h.className='sec';h.innerHTML='<h2>'+t+'</h2><div class="g"></div>';host.append(h);ids.forEach(id=>mk(id,h.lastChild))}
function render(){const s=S[cur],c=$('#ctl'),x=$('#fx');c.innerHTML=x.innerHTML='';if(cur=='bsh')shUI(c);if(cur=='dw')dwUI(c);
if(mode!='m'){s.show.forEach(id=>mk(id,c));FXK.forEach(id=>mk(id,x));return}
const OS=['w1','w2','w3','o1','o2','o3','nosc','uni','det','sub','nz'],sh=s.show;
grp(c,sh.filter(i=>OS.includes(i)),'Oscillator');const WS=['shin','shmx','sho'];grp(c,sh.filter(i=>WS.includes(i)),'Waveshaper');grp(c,sh.filter(i=>!OS.includes(i)&&!FD.has(i)&&!WS.includes(i)),'Filter, warna, dan modulasi');grp(c,sh.filter(i=>FD.has(i)),'Envelope');
grp(x,['mb','dt','dfb','dmx','rev','sm'],'Dinamika dan ruang');grp(x,['eqL','eqM','eqH','vol'],'EQ dan master');grp(x,['bs','be','bt'],'Pitch bend')}
function pick(k){cur=k;document.body.dataset.s=S[k].skin||k;const s=S[k];$('#ttl').textContent=s.n;$('#sub').textContent=s.g;render();
document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('on',b.dataset.k==k));fillPre();loadPre(Object.keys(s.pre)[0])}
FXK.forEach(id=>mk(id,$('#fx')));
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>{stopDemo();pick(b.dataset.k)});
$('#pre').onchange=e=>loadPre(e.target.value);
$('#sv').onclick=()=>{const n=$('#pn').value.trim();if(!n){msg('Isi nama preset dulu.');return}const u=userP();u[n]={};for(const k in V)if(!FXK.includes(k))u[n][k]=V[k];FXK.forEach(k=>u[n][k]=V[k]);try{localStorage.setItem('sl'+cur,JSON.stringify(u))}catch(e){}fillPre('u:'+n);msg('Preset "'+n+'" disimpan.')};
const msg=t=>$('#msg').textContent=t;
