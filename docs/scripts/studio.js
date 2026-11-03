/* studio.js: 3 synth baru (FM-STUDIO, PLUCKLAB, DRUMBOX), hemat daya, simpan/buka proyek, rekam 1 loop, offline (PWA). */
Object.assign(PR,{rt:['Rasio mod',.5,8,2,.5],ix:['Indeks FM',0,12,3,.1],ixd:['Indeks decay',.01,2,.3,0,1],kd:['Gema senar',0,1,.6,.01],kb:['Terang',0,1,.6,.01],dpt:['Pitch drum',.5,2,1,.01],ddc:['Panjang',.4,2.5,1,.01]});
['rt','ix','ixd','kd','kb','dpt','ddc'].forEach(k=>V[k]=DEF[k]=PR[k][3]);
Object.assign(S,{
fm:{n:'FM-STUDIO',g:'Sintesis FM: piano listrik, lonceng, gamelan, bas',show:['w1','rt','ix','ixd','cut','res','drv','a','d','s','r'],base:{cut:16000,res:.7},demo:[[60,64,67,72,71,67,64,67,62,65,69,74,72,69,65,69],220],
pre:{'E-Piano':{w1:0,rt:1,ix:2.2,ixd:.5,a:.005,d:.9,s:.2,r:.4,rev:.25},'Lonceng Kaca':{w1:0,rt:3.5,ix:4,ixd:1.2,a:.002,d:1.4,s:0,r:1.2,rev:.4},'Gamelan':{w1:0,rt:2.76,ix:3,ixd:1.5,a:.002,d:1.8,s:0,r:1.5,rev:.45},'Bas FM':{w1:0,rt:1,ix:3.5,ixd:.15,a:.003,d:.25,s:.7,r:.15,cut:3000},'Marimba':{w1:0,rt:4,ix:1.5,ixd:.06,a:.002,d:.5,s:0,r:.3},'Brass':{w1:0,rt:1,ix:5,ixd:.35,a:.06,d:.3,s:.7,r:.2},'Organ':{w1:0,rt:2,ix:1.2,ixd:2,a:.01,d:.1,s:.9,r:.15},'Suling':{w1:0,rt:1,ix:.6,ixd:.3,a:.1,d:.2,s:.85,r:.25}}},
ks:{n:'PLUCKLAB',g:'Senar petik: gitar, harpa, kecapi, sasando',show:['kd','kb','cut','res','drv','d','r'],base:{cut:9000},demo:[[52,59,64,67,71,67,64,59,50,57,62,66,69,66,62,57],200],
pre:{'Gitar Nilon':{kd:.6,kb:.5,d:1,cut:6000},'Harpa':{kd:.85,kb:.8,d:1.5,r:.5},'Kecapi':{kd:.7,kb:.9,d:1.2},'Sasando':{kd:.9,kb:.7,d:1.8,rev:.4},'Koto':{kd:.75,kb:.95,d:1.3,rev:.3},'Bas Petik':{kd:.4,kb:.25,d:.9,cut:1800},'Senar Teredam':{kd:.1,kb:.4,d:.4}}},
dr:{n:'DRUMBOX',g:'Drum machine: tiap tuts = 1 drum (C kick, D snare, F hat)',show:['dpt','ddc','drv','bit'],base:{},demo:[[36,0,41,0,38,0,41,0,36,36,41,0,38,0,41,41],150],
pre:{'808 Klasik':{},'Lo-Fi Hip Hop':{dpt:.85,ddc:.8,bit:9,drv:.2},'Trap Dalam':{dpt:.7,ddc:1.6},'Elektro Tajam':{dpt:1.3,ddc:.6,drv:.3},'Mainan Retro':{dpt:1.1,ddc:.7,bit:5}}}});
function fmOn(m){init();if(act[m])noteOff(m);if(ord.length>(eco?3:9))noteOff(ord[0]);
const t=ac.currentTime,f=440*2**((m-69)/12),g=ac.createGain(),fl=ac.createBiquadFilter(),c=ac.createOscillator(),md=ac.createOscillator(),mg=ac.createGain(),a=Math.max(V.a,.006);
fl.frequency.value=V.cut;fl.Q.value=V.res;c.type=WT[V.w1]||'sine';c.frequency.value=f;md.frequency.value=f*V.rt;
mg.gain.setValueAtTime(V.ix*f,t);mg.gain.setTargetAtTime(V.ix*f*.1,t,V.ixd/3);md.connect(mg);mg.connect(c.frequency);c.connect(fl);fl.connect(g);g.connect(bus);
g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(1,t+a);g.gain.setTargetAtTime(V.s,t+a,V.d/3);c.start(t);md.start(t);act[m]={g,ss:[c,md],fl};ord.push(m);log(m,1)}
const kc={};
function ksOn(m){init();if(act[m])noteOff(m);if(ord.length>(eco?3:9))noteOff(ord[0]);
const t=ac.currentTime,sr=ac.sampleRate,f=440*2**((m-69)/12),N=Math.max(2,Math.round(sr/f)),key=[m,V.kd,V.kb,V.d,sr].join();let b=kc[key];
if(!b){const L=Math.min(sr*4,sr*(.5+V.d*2)|0),k=.99+.0095*V.kd,B=.15+.85*V.kb;b=ac.createBuffer(1,L,sr);const d=b.getChannelData(0);let p=0,pk=0;
for(let i=0;i<N;i++){p+=(Math.random()*2-1-p)*B;d[i]=p;pk=Math.max(pk,Math.abs(p))}for(let i=0;i<N;i++)d[i]/=pk||1;for(let i=N;i<L;i++)d[i]=k*.5*(d[i-N]+d[i-N+1]);
if(Object.keys(kc).length>60)for(const x in kc)delete kc[x];kc[key]=b}
const s=ac.createBufferSource(),g=ac.createGain(),fl=ac.createBiquadFilter();s.buffer=b;fl.frequency.value=V.cut;fl.Q.value=V.res;s.connect(fl);fl.connect(g);g.connect(bus);g.gain.value=.9;s.start(t);act[m]={g,ss:[s],fl};ord.push(m);log(m,1)}
function drum(m){init();const T=ac.currentTime,P=V.dpt,D=V.ddc,i=m%12;
const tn=(ty,a,b,d,v)=>{const o=ac.createOscillator(),g=ac.createGain();o.type=ty;o.frequency.setValueAtTime(a*P,T);o.frequency.exponentialRampToValueAtTime(b*P,T+d*D);g.gain.setValueAtTime(v,T);g.gain.exponentialRampToValueAtTime(.001,T+d*D);o.connect(g);g.connect(bus);o.start(T);o.stop(T+d*D+.05)};
const nz=(ty,fr,q,d,v)=>{const s=ac.createBufferSource(),f=ac.createBiquadFilter(),g=ac.createGain();s.buffer=nb;s.loop=true;f.type=ty;f.frequency.value=fr;f.Q.value=q;g.gain.setValueAtTime(v,T);g.gain.exponentialRampToValueAtTime(.001,T+d*D);s.connect(f);f.connect(g);g.connect(bus);s.start(T,Math.random()*2);s.stop(T+d*D+.05)};
[()=>tn('sine',150,45,.35,1.2),()=>tn('sine',90,32,.8,1.3),()=>{tn('triangle',220,120,.12,.6);nz('highpass',1800,1,.2,.7)},()=>{tn('square',800,400,.04,.4);nz('bandpass',3000,2,.06,.6)},()=>nz('bandpass',1500,1.5,.25,1),()=>nz('highpass',7500,.7,.05,.5),()=>nz('highpass',7000,.7,.4,.5),()=>tn('sine',130,70,.4,1),()=>tn('sine',180,100,.35,1),()=>tn('sine',250,150,.3,1),()=>{tn('square',560,555,.3,.35);tn('square',845,840,.3,.35)},()=>nz('highpass',4000,.5,1.2,.5)][i]();
log(m,1);setTimeout(()=>log(m,0),120)}
const _no=noteOn;noteOn=function(m){const f={fm:fmOn,ks:ksOn,dr:drum}[cur];f?f(m):_no(m)};
// cegah menu tekan-lama (download gambar/salin) saat menahan tuts
addEventListener('contextmenu',e=>{if(!/INPUT|TEXTAREA/.test(e.target.tagName))e.preventDefault()},true);addEventListener('dragstart',e=>e.preventDefault(),true);
// hemat daya
const ls=(k,v)=>{try{return v==null?localStorage.getItem(k):localStorage.setItem(k,v)}catch(e){return null}};
const e0=ls('sl_eco');eco=e0=='1';
const ecoUI=()=>{$('#eco').textContent='Hemat daya: '+(eco?'On':'Off');$('#eco').classList.toggle('on',eco);ap()};
$('#eco').onclick=()=>{eco=!eco;ls('sl_eco',eco?'1':'0');ecoUI();msg(eco?'Hemat daya aktif: polifoni dibatasi, grafik diperlambat dan reverb dimatikan.':'Hemat daya mati.')};ecoUI();if(e0==null&&(navigator.deviceMemory||8)<=2)msg('HP kamu tampaknya berspesifikasi rendah. Coba aktifkan "Hemat daya" bila terasa berat.');
// proyek
const pj=()=>({v:1,synth:cur,V,SQ,bpm:+$('#sqb').value});
function ld(o){if(!o||!S[o.synth]||!o.V)throw 0;pick(o.synth);Object.assign(V,o.V);V.dw=dwNorm(V.dw);dwv=dwv.map(x=>x+1);V.sc=[...V.sc];shVer++;SQ=o.SQ.slice(0,16);$('#sqb').value=o.bpm||120;$('#sqv').textContent=$('#sqb').value;ref();shDraw();dwDraw();ap();sqDraw()}
$('#sp').onclick=()=>dl(new Blob([JSON.stringify(pj())],{type:'application/json'}),'proyek-synthlab.json');
$('#bp').onclick=()=>$('#bpf').click();
$('#bpf').onchange=async e=>{const f=e.target.files[0];e.target.value='';if(!f)return;try{ld(JSON.parse(await f.text()));msg('Proyek dibuka.')}catch(x){msg('Berkas proyek tidak valid.')}};
document.addEventListener('visibilitychange',()=>{if(document.hidden)ls('sl_auto',JSON.stringify(pj()))});
try{const a=ls('sl_auto');if(a)ld(JSON.parse(a))}catch(e){ls('sl_auto','')}
// rekam 1 loop sequencer
$('#r1').onclick=()=>{if(recording||sqT)return;$('#rec').click();$('#sqp').click();msg('Merekam 1 loop...');setTimeout(()=>{if(sqT)$('#sqp').click();setTimeout(()=>recording&&$('#rec').click(),(V.r*1.6+.4)*1000)},16*15000/+$('#sqb').value+100)};
if('serviceWorker' in navigator&&/^https?:/.test(location.protocol))navigator.serviceWorker.register('sw.js').catch(()=>{});
// lagu demo (domain publik/tradisional dan komposisi asli)
const NMAP={C:0,D:2,E:4,F:5,G:7,A:9,B:11},nmi=s=>{const m=/^([A-G])([#b]?)(\d)$/.exec(s);return m?12*(+m[3]+1)+NMAP[m[1]]+(m[2]=='#'?1:m[2]=='b'?-1:0):0};
const SONGS={
'Ode to Joy (Beethoven)':[230,'E4:2 E4:2 F4:2 G4:2 G4:2 F4:2 E4:2 D4:2 C4:2 C4:2 D4:2 E4:2 E4:3 D4:1 D4:4 E4:2 E4:2 F4:2 G4:2 G4:2 F4:2 E4:2 D4:2 C4:2 C4:2 D4:2 E4:2 D4:3 C4:1 C4:4'],
'Für Elise (Beethoven)':[120,'E5:1 D#5:1 E5:1 D#5:1 E5:1 B4:1 D5:1 C5:1 A4:2 r:1 C4:1 E4:1 A4:1 B4:2 r:1 E4:1 G#4:1 B4:1 C5:2 r:1 E4:1 E5:1 D#5:1 E5:1 D#5:1 E5:1 B4:1 D5:1 C5:1 A4:2 r:1 C4:1 E4:1 A4:1 B4:2 r:1 E4:1 C5:1 B4:1 A4:6'],
'Canon in D (Pachelbel)':[300,'F#5:2 E5:2 D5:2 C#5:2 B4:2 A4:2 B4:2 C#5:2 D5:2 C#5:2 B4:2 A4:2 G4:2 F#4:2 G4:2 E4:2 D5:8'],
'Twinkle Twinkle Little Star':[260,'C4:2 C4:2 G4:2 G4:2 A4:2 A4:2 G4:4 F4:2 F4:2 E4:2 E4:2 D4:2 D4:2 C4:4 G4:2 G4:2 F4:2 F4:2 E4:2 E4:2 D4:4 G4:2 G4:2 F4:2 F4:2 E4:2 E4:2 D4:4 C4:2 C4:2 G4:2 G4:2 A4:2 A4:2 G4:4 F4:2 F4:2 E4:2 E4:2 D4:2 D4:2 C4:4'],
'Jingle Bells':[190,'E4:2 E4:2 E4:4 E4:2 E4:2 E4:4 E4:2 G4:2 C4:3 D4:1 E4:8 F4:2 F4:2 F4:3 F4:1 F4:2 E4:2 E4:2 E4:1 E4:1 E4:2 D4:2 D4:2 E4:2 D4:4 G4:4'],
'Selamat Ulang Tahun':[280,'G4:1 G4:1 A4:2 G4:2 C5:2 B4:4 G4:1 G4:1 A4:2 G4:2 D5:2 C5:4 G4:1 G4:1 G5:2 E5:2 C5:2 B4:2 A4:2 F5:1 F5:1 E5:2 C5:2 D5:2 C5:6'],
'Gamelan Slendro (asli)':[300,'D4:2 F4:2 G4:2 A4:2 G4:2 F4:2 D4:2 r:2 A3:2 D4:2 F4:2 G4:2 F4:2 D4:2 A3:4 D4:2 G4:2 A4:4 C5:2 A4:2 G4:2 F4:2 D4:6'],
'Arpeggio Lo-fi (asli)':[320,'C4:2 E4:2 G4:2 B4:2 A3:2 C4:2 E4:2 G4:2 D4:2 F4:2 A4:2 C5:2 G3:2 B3:2 D4:2 F4:2 E4:8']};
$('#dsel').innerHTML='<option value="">Demo bawaan synth</option>'+Object.keys(SONGS).map(k=>'<option>'+k+'</option>').join('');
const _dm=$('#demo').onclick;
function songPlay(k){const[ms,tx]=SONGS[k],ev=tx.split(' ').map(t=>{const[n,d]=t.split(':');return[n=='r'?0:nmi(n),+d]});let i=0,w=0;
dm=setInterval(()=>{if(w-->0)return;if(i>=ev.length){stopDemo();return}const[m,d]=ev[i++];w=d-1;if(m){noteOn(m);setTimeout(()=>noteOff(m),d*ms*.9)}},ms)}
$('#demo').onclick=()=>{if(dm){stopDemo();return}const k=$('#dsel').value;if(!k||cur=='dr'){if(k)msg('DRUMBOX memakai pola drum sendiri.');_dm();return}init();$('#demo').classList.add('on');$('#demo').textContent='Stop demo';msg('Memainkan: '+k);songPlay(k)};
