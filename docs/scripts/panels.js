/* panels.js: widget tambahan SynthLab: grafik ADSR, respons filter, osiloskop + spektrum, matriks modulasi, rantai efek, browser preset, step sequencer. */
const fit=c=>{const w=c.clientWidth;if(w&&c.width!=w)c.width=w};
let AC='#888',FG='#ddd',pq=0;
const pnQ=()=>{if(!pq)pq=requestAnimationFrame(()=>{pq=0;pnDraw()})};
const _ap=ap;ap=function(){_ap();pnQ()};const _rn=render;render=function(){_rn();pnBuild()};const _fp=fillPre;fillPre=function(s){_fp(s);pbr()};
const slot=t=>{const s=[...document.querySelectorAll('.sec')].find(e=>e.querySelector('h2').textContent==t);if(s)return s.lastChild;let f=$('#pnx');if(!f){f=document.createElement('div');f.id='pnx';f.className='sec';f.innerHTML='<h2>Panel tambahan</h2><div class="g"></div>';$('#ctl').append(f)}return f.lastChild};
const mkW=(h,c,html)=>{const d=document.createElement('div');d.className='pw '+c;d.innerHTML=html;h.append(d);return d};
const FXC=[['Drive','drv',0,.3],['Crush','bit',16,8],['Soften'],['EQ'],['Multiband','mb',0,.5],['Delay','dmx',0,.3],['Reverb','rev',0,.3],['Limiter']],sv={},isOn=id=>id=='bit'?V.bit<16:V[id]>0;
function pnBuild(){const s=S[cur];
mkW(slot('Envelope'),'r','<small>Envelope (ADSR)</small><canvas id="pe" width="640" height="150"></canvas>');
if(s.show.includes('cut'))mkW(slot('Filter, warna, dan modulasi'),'','<small>Respons filter</small><canvas id="pf" width="640" height="150"></canvas>');
const ch=mkW(slot('Dinamika dan ruang'),'f','<small>Rantai efek (klik untuk bypass)</small><div class="ch"></div>').lastChild;
FXC.forEach((f,k)=>{if(k){const a=document.createElement('i');a.textContent='›';ch.append(a)}const b=document.createElement('button'),id=f[1];b.textContent=f[0];
if(id){b.dataset.i=id;b.onclick=()=>{if(isOn(id)){sv[id]=V[id];V[id]=f[2]}else V[id]=sv[id]??f[3];UI[id]&&UI[id]();ap()}}else b.className='fx';ch.append(b)});
mkW(slot('EQ dan master'),'r','<small>Osiloskop + spektrum</small><canvas id="ps" width="640" height="150"></canvas>');
const m=mkW(slot('Pitch bend'),'m','<small>Matriks modulasi (sumber × tujuan)</small><div class="mx"></div>').lastChild;
const lb=t=>{const b=document.createElement('b');b.textContent=t;m.append(b)},cell=(id,mn,mx,st)=>{const w=document.createElement('div');w.innerHTML='<input type="range" min="'+mn+'" max="'+mx+'" step="'+st+'" aria-label="'+PR[id][0]+'"><output></output>';const i=w.firstChild,o=w.lastChild;i.oninput=()=>{V[id]=+i.value;o.textContent=V[id];ap()};UI['mx'+id]=()=>{i.value=V[id];o.textContent=V[id]};UI['mx'+id]();m.append(w)};
lb('');lb('Cutoff');lb('Pitch');lb('Amp');lb('LFO');cell('lfoD',0,4800,10);cell('lpt',0,200,1);cell('lam',0,.8,.01);lb('ENV');cell('fe',-4800,4800,10);lb('');lb('');lb('LFO Hz');cell('lfoR',.1,20,.1);lb('');lb('');pnQ()}
function dEnv(){const c=$('#pe');if(!c)return;fit(c);const x=c.getContext('2d'),W=c.width,H=c.height,P=16,a=Math.max(V.a,.006),d=V.d,r=V.r,h=Math.max(.35*(a+d+r),.3),T=a+d+h+r,X=t=>P+t/T*(W-2*P),Y=v=>H-P-v*(H-2*P-12);
x.clearRect(0,0,W,H);x.strokeStyle=x.fillStyle=AC;x.lineWidth=3;x.beginPath();x.moveTo(X(0),Y(0));x.lineTo(X(a),Y(1));
for(let i=1;i<=24;i++){const t=d*i/24;x.lineTo(X(a+t),Y(V.s+(1-V.s)*Math.exp(-3*t/d)))}x.lineTo(X(a+d+h),Y(V.s));
for(let i=1;i<=24;i++){const t=r*i/24;x.lineTo(X(a+d+h+t),Y(V.s*Math.exp(-5*t/r)))}x.stroke();x.lineTo(X(T),Y(0));x.lineTo(X(0),Y(0));x.globalAlpha=.2;x.fill();x.globalAlpha=1;
x.fillStyle=FG;x.font='15px sans-serif';x.fillText('A '+a.toFixed(2)+'s   D '+d+'s   S '+V.s+'   R '+r+'s',P,16)}
function dFlt(){const c=$('#pf');if(!c)return;fit(c);const x=c.getContext('2d'),W=c.width,H=c.height,Q=10**(V.res/20),Y=db=>H-10-(Math.max(-36,Math.min(24,db))+36)/60*(H-20),F=f=>Math.log(f/20)/Math.log(1000)*W,
mg=(f,fc,q)=>{const u=f/fc;return 1/Math.sqrt((1-u*u)**2+(u/q)**2)},cv=(fc,al,lw)=>{x.globalAlpha=al;x.lineWidth=lw;x.beginPath();for(let i=0;i<=W;i+=3){const f=20*1000**(i/W),db=20*Math.log10(mg(f,fc,Q)*mg(f,V.sm,1.06));i?x.lineTo(i,Y(db)):x.moveTo(i,Y(db))}x.stroke()};
x.clearRect(0,0,W,H);x.strokeStyle='#8886';x.lineWidth=1;x.beginPath();for(const f of[100,1000,10000]){x.moveTo(F(f),0);x.lineTo(F(f),H)}x.moveTo(0,Y(0));x.lineTo(W,Y(0));x.stroke();
x.strokeStyle=x.fillStyle=AC;if(V.lfoD>0){cv(V.cut*2**(V.lfoD/1200),.3,2);cv(V.cut*2**(-V.lfoD/1200),.3,2)}cv(V.cut,1,3);x.globalAlpha=1;x.fillStyle=FG;x.font='15px sans-serif';x.fillText(Math.round(V.cut)+' Hz   Q '+V.res,10,16)}
function pnDraw(){const g=n=>getComputedStyle(document.body).getPropertyValue(n).trim();AC=g('--ac')||AC;FG=g('--fg')||FG;dEnv();dFlt();document.querySelectorAll('.ch button[data-i]').forEach(b=>b.classList.toggle('off',!isOn(b.dataset.i)));sqDraw()}
// osiloskop + spektrum
const psW=new Uint8Array(2048),psF=new Uint8Array(1024);
(function pl(){requestAnimationFrame(pl);const c=$('#ps');if(!c||eco&&++ef1%4)return;fit(c);const x=c.getContext('2d'),W=c.width,H=c.height,h=H/2;x.clearRect(0,0,W,H);x.strokeStyle=x.fillStyle=AC;x.lineWidth=2;
if(!an){x.fillRect(0,h/2,W,2);return}an.getByteTimeDomainData(psW);let s=0;while(s<512&&!(psW[s]<128&&psW[s+1]>=128))s++;if(s>=512)s=0;
x.beginPath();for(let i=0;i<512;i++){const y=psW[s+i]/255*(h-8)+4;i?x.lineTo(i/511*W,y):x.moveTo(0,y)}x.stroke();
an.getByteFrequencyData(psF);const n=64,bw=W/n,ny=ac.sampleRate/2;x.globalAlpha=.85;
for(let k=0;k<n;k++){const b0=Math.floor(20*1000**(k/n)/ny*1024),b1=Math.max(b0+1,Math.floor(20*1000**((k+1)/n)/ny*1024));let m=0;for(let b=b0;b<b1;b++)m=Math.max(m,psF[b]);const bh=m/255*(h-6);x.fillRect(k*bw+1,H-bh,bw-2,bh)}x.globalAlpha=1})();
// preset browser
function pbr(){const q=$('#pq').value.toLowerCase(),l=$('#pl'),sl=$('#pre');l.innerHTML='';[...sl.options].forEach(o=>{if(q&&!o.textContent.toLowerCase().includes(q))return;const b=document.createElement('button');b.textContent=o.textContent;b.className=o.value==sl.value?'on':'';b.onclick=()=>{sl.value=o.value;loadPre(o.value);pbr()};l.append(b);
if(o.value.startsWith('u:')){const x=document.createElement('button');x.textContent='×';x.setAttribute('aria-label','Hapus preset '+o.textContent);x.onclick=()=>{const u=userP();delete u[o.value.slice(2)];try{localStorage.setItem('sl'+cur,JSON.stringify(u))}catch(e){}fillPre();pbr()};l.append(x)}})}
$('#pq').oninput=pbr;$('#pre').addEventListener('change',pbr);
// step sequencer: 16 langkah x 13 nada (satu oktaf + 1), nada dasar mengikuti oktaf PC
let SQ=[0,-1,7,-1,4,-1,7,-1,0,-1,7,-1,5,-1,9,-1],sqT=null,sqG=null,sqI=-1,sqP=null,sqN=0,sqD=null;const sqc=$('#sqs');
function sqDraw(){const x=sqc.getContext('2d'),W=sqc.width,H=sqc.height,cw=W/16,rh=H/13;x.clearRect(0,0,W,H);
for(let r=0;r<13;r++){if([1,3,6,8,10].includes(r))continue;x.fillStyle='#8882';x.fillRect(0,(12-r)*rh,W,rh)}
x.fillStyle='#8883';for(let i=0;i<16;i+=4)x.fillRect(i*cw,0,1,H);x.fillStyle=AC;
SQ.forEach((r,i)=>{if(r>=0)x.fillRect(i*cw+2,(12-r)*rh+2,cw-4,rh-4)});if(sqI>=0){x.globalAlpha=.18;x.fillStyle=FG;x.fillRect(sqI*cw,0,cw,H);x.globalAlpha=1}}
function seqStop(){clearTimeout(sqT);clearTimeout(sqG);if(sqP!=null)noteOff(sqP);sqP=null;sqI=-1;sqT=null;$('#sqp').textContent='Play';$('#sqp').classList.remove('on');sqDraw()}
function seqStep(){const ms=15000/+$('#sqb').value;if(sqP!=null){noteOff(sqP);sqP=null}sqI=(sqI+1)%16;const r=SQ[sqI];if(r>=0){sqP=base()+r;noteOn(sqP);sqG=setTimeout(()=>{if(sqP!=null){noteOff(sqP);sqP=null}},ms*.75)}sqDraw();sqN+=ms;sqT=setTimeout(seqStep,Math.max(0,sqN-performance.now()))}
$('#sqp').onclick=()=>{if(sqT){seqStop();return}init();sqI=-1;sqN=performance.now();$('#sqp').textContent='Stop';$('#sqp').classList.add('on');seqStep()};
$('#sqb').oninput=()=>$('#sqv').textContent=$('#sqb').value;$('#sqc').onclick=()=>{SQ.fill(-1);sqDraw()};
$('#sqr').onclick=()=>{const sc=[0,2,3,5,7,8,10,12];SQ=SQ.map(()=>Math.random()<.55?sc[Math.random()*8|0]:-1);sqDraw()};
const sqPos=e=>{const r=sqc.getBoundingClientRect();return[Math.max(0,Math.min(15,Math.floor((e.clientX-r.left)/r.width*16))),Math.max(0,Math.min(12,12-Math.floor((e.clientY-r.top)/r.height*13)))]};
const sqSet=(i,r)=>{const v=sqD=='clr'?-1:r;if(SQ[i]==v)return;SQ[i]=v;if(v>=0){noteOn(base()+v);setTimeout(()=>noteOff(base()+v),140)}sqDraw()};
sqc.onpointerdown=e=>{sqc.setPointerCapture(e.pointerId);const[i,r]=sqPos(e);sqD=SQ[i]==r?'clr':'set';sqSet(i,r)};sqc.onpointermove=e=>{if(sqD){const[i,r]=sqPos(e);sqSet(i,r)}};sqc.onpointerup=sqc.onpointercancel=()=>sqD=null;
