/* engine.js: mesin audio Web Audio (rantai efek, suara polifonik noteOn/noteOff, arpeggiator, panic). */
let eco=false,ef1=0,ef2=0,shg,sh1,shw,shd,shm,mode='m',bl=false,sum,rvb,lpG,laG,spn,spz,spOn,ord=[],live=0,xr=0,lp=0,sf,lc={},cur='x2',UI={},ac,bus,drive,crush,eq,mbc,ms,dly,fb,dw,rw,lfo,lfoG,vibG,nb,an,rcd,chunks=[],ev=[],t0=0,recording=false,mr,mrC=[],blobs={},act={},oct=3;
const dcv=a=>{if(!a)return null;const c=new Float32Array(2049),k=1+a*30;for(let i=0;i<2049;i++)c[i]=Math.tanh(k*(i/1024-1))/Math.tanh(k);return c};
const ccv=b=>{if(b>=16)return null;const c=new Float32Array(2049),l=2**(b-1);for(let i=0;i<2049;i++)c[i]=Math.round((i/1024-1)*l)/l;return c};
function init(){if(ac){ac.resume();return}
ac=new (window.AudioContext||window.webkitAudioContext)();const f=(t,fr)=>{const b=ac.createBiquadFilter();b.type=t;b.frequency.value=fr;return b};
bus=ac.createGain();bus.gain.value=.6;drive=ac.createWaveShaper();drive.oversample='4x';crush=ac.createWaveShaper();
eq=[f('lowshelf',200),f('peaking',1200),f('highshelf',5000)];
sf=f('lowpass',12000);sf.Q.value=.5;shg=ac.createGain();sh1=ac.createWaveShaper();sh1.oversample='4x';shw=ac.createGain();shd=ac.createGain();shm=ac.createGain();bus.connect(shg);sh1.connect(shw);shw.connect(shm);bus.connect(shd);shd.connect(shm);const dcb=f('highpass',25);shm.connect(dcb);dcb.connect(drive);drive.connect(crush);crush.connect(sf);sf.connect(eq[0]);eq[0].connect(eq[1]);eq[1].connect(eq[2]);
sum=ac.createGain();mbc=[];
[[f('lowpass',250)],[f('highpass',250),f('lowpass',3000)],[f('highpass',3000)]].forEach(ch=>{const c=ac.createDynamicsCompressor();let p=eq[2];ch.forEach(x=>{p.connect(x);p=x});p.connect(c);c.connect(sum);mbc.push(c)});
ms=ac.createGain();dly=ac.createDelay(1.5);fb=ac.createGain();dw=ac.createGain();rw=ac.createGain();
const fbf=f('lowpass',4500);sum.connect(ms);sum.connect(dly);dly.connect(fbf);fbf.connect(fb);fb.connect(dly);dly.connect(dw);dw.connect(ms);
rvb=ac.createConvolver();const L=ac.sampleRate*2.4|0,ir=ac.createBuffer(2,L,ac.sampleRate);
for(let c=0;c<2;c++){const d=ir.getChannelData(c);let p=0;for(let i=0;i<L;i++){p=p*.55+(Math.random()*2-1)*.45;d[i]=p*1.5*(1-i/L)**3}}
rvb.buffer=ir;sum.connect(rvb);rvb.connect(rw);rw.connect(ms);
const lim=ac.createDynamicsCompressor();lim.threshold.value=-6;lim.knee.value=8;lim.ratio.value=12;lim.attack.value=.005;
ms.connect(lim);lim.connect(ac.destination);an=ac.createAnalyser();an.fftSize=2048;lim.connect(an);
spn=ac.createScriptProcessor(4096,2,2);spz=ac.createGain();spz.gain.value=0;spz.connect(ac.destination);spOn=on=>{lp=0;try{if(on){lim.connect(spn);spn.connect(spz)}else{lim.disconnect(spn);spn.disconnect()}}catch(e){}};
spn.onaudioprocess=e=>{const nw=performance.now();if(lp&&nw-lp>4096/ac.sampleRate*1500)xr++;lp=nw;if(recording)chunks.push([new Float32Array(e.inputBuffer.getChannelData(0)),new Float32Array(e.inputBuffer.getChannelData(1))])};
rcd=ac.createMediaStreamDestination();lim.connect(rcd);
lfo=ac.createOscillator();lfoG=ac.createGain();lfo.connect(lfoG);lfo.start();lpG=ac.createGain();laG=ac.createGain();lfo.connect(lpG);lfo.connect(laG);
const vo=ac.createOscillator();vo.frequency.value=6;vibG=ac.createGain();vo.connect(vibG);vo.start();
nb=ac.createBuffer(1,ac.sampleRate*3,ac.sampleRate);const nd=nb.getChannelData(0);let np=0;for(let i=0;i<nd.length;i++){np=np*.6+(Math.random()*2-1)*.4;nd[i]=np*1.6}
const re=new Float32Array(33),im=new Float32Array(33);for(let n=1;n<33;n++)im[n]=2/(n*Math.PI)*Math.sin(n*Math.PI*.25);
pw=ac.createPeriodicWave(re,im);ap();spOn(!!ct)}
let pw;
function ap(){if(!ac)return;const T=ac.currentTime,s=(p,v)=>p.setTargetAtTime(v,T,.03);
s(eq[0].gain,V.eqL);s(eq[1].gain,V.eqM);s(eq[2].gain,V.eqH);s(sf.frequency,V.sm);
s(dly.delayTime,V.dt);s(fb.gain,V.dfb);s(dw.gain,V.dmx);s(rw.gain,V.rev);s(ms.gain,V.vol);
s(vibG.gain,V.vib);s(lfo.frequency,V.lfoR);s(lfoG.gain,V.lfoD);s(lpG.gain,V.lpt);s(laG.gain,V.lam*.5);
mbc.forEach(c=>{s(c.threshold,-6-30*V.mb);s(c.ratio,1+7*V.mb)});
if(lc.d!==V.drv){drive.curve=dcv(V.drv);lc.d=V.drv}if(lc.b!==V.bit){crush.curve=ccv(V.bit);lc.b=V.bit}
const so=V.shmx>0;if(so!==lc.o){lc.o=so;try{so?shg.connect(sh1):shg.disconnect(sh1)}catch(e){}}if(lc.c!==shVer){sh1.curve=curveFrom(V.sc);lc.c=shVer}s(shg.gain,V.shin);s(shw.gain,V.shmx*V.sho);s(shd.gain,1-V.shmx);
const ro=V.rev>0&&!eco,dO=V.dmx>0;if(ro!==lc.rv){lc.rv=ro;try{ro?sum.connect(rvb):sum.disconnect(rvb)}catch(e){}}if(dO!==lc.dy){lc.dy=dO;try{dO?sum.connect(dly):sum.disconnect(dly)}catch(e){}}
for(const k in act){const q=act[k].fl;s(q.frequency,V.cut);s(q.Q,V.res)}}
function log(m,on){if(recording)ev.push({t:ac.currentTime-t0,m,on})}
function noteOn(m){init();if(act[m])noteOff(m);if(ord.length>(eco?3:9))noteOff(ord[0]);const t=ac.currentTime,f=440*2**((m-69)/12),g=ac.createGain(),fl=ac.createBiquadFilter(),ss=[],n=V.nosc,u=eco?1:V.uni,lv=.5/Math.sqrt(n*u);
fl.frequency.value=V.cut;fl.Q.value=V.res;lfoG.connect(fl.detune);
const add=(o,gv,dt)=>{const og=ac.createGain();og.gain.value=gv;if(V.bs||V.be){o.detune.setValueAtTime(dt+V.bs*100,t);o.detune.linearRampToValueAtTime(dt+V.be*100,t+V.bt)}else o.detune.value=dt;o.connect(og);og.connect(fl);vibG.connect(o.detune);lpG.connect(o.detune);o.start(t);ss.push(o);live++;o.addEventListener('ended',()=>{live--;try{vibG.disconnect(o.detune);lpG.disconnect(o.detune)}catch(e){}})};
const noise=gv=>{const o=ac.createBufferSource();o.buffer=nb;o.loop=true;o.playbackRate.value=Math.max(.2,f/440);add(o,gv,0)};
for(let i=0;i<n;i++)for(let k=0;k<u;k++){const ty=V['w'+(i+1)];if(ty==5){noise(lv);continue}
const o=ac.createOscillator();if(cur=='dw'){o._i=i;o.setPeriodicWave(cwv(i))}else if(ty==4)o.setPeriodicWave(pw);else o.type=WT[ty];o.frequency.value=f*2**V['o'+(i+1)];add(o,lv,(k-(u-1)/2)*V.det+(i-(n-1)/2)*V.det*.3)}
if(V.sub>0){const o=ac.createOscillator();o.type='square';o.frequency.value=f/2;add(o,V.sub*.4,0)}
if(V.nz>0)noise(V.nz*.25);
fl.connect(g);g.connect(bus);g.gain.setValueAtTime(0,t);const a=Math.max(V.a,.006);g.gain.linearRampToValueAtTime(1,t+a);g.gain.setTargetAtTime(V.s,t+a,V.d/3);laG.connect(g.gain);if(V.fe){fl.detune.setValueAtTime(0,t);fl.detune.linearRampToValueAtTime(V.fe,t+a);fl.detune.setTargetAtTime(V.fe*V.s,t+a,V.d/3)}
act[m]={g,ss,fl};ord.push(m);log(m,1)}
function noteOff(m){const v=act[m];if(!v)return;delete act[m];const oi=ord.indexOf(m);if(oi>=0)ord.splice(oi,1);const t=ac.currentTime;v.g.gain.cancelScheduledValues(t);v.g.gain.setValueAtTime(v.g.gain.value,t);v.g.gain.setTargetAtTime(0,t,V.r/5);if(V.fe){v.fl.detune.cancelScheduledValues(t);v.fl.detune.setValueAtTime(v.fl.detune.value,t);v.fl.detune.setTargetAtTime(0,t,V.r/5)}
const te=t+V.r*1.6+.05;v.ss.forEach(o=>o.stop(te));v.ss[0].addEventListener('ended',()=>{try{v.g.disconnect();lfoG.disconnect(v.fl.detune)}catch(e){}try{laG.disconnect(v.g.gain)}catch(e){}});log(m,0)}
const held=[];let at=null,ai=0,ar=null;
function press(m){init();if(!V.arp){noteOn(m);return}if(!held.includes(m))held.push(m);if(at)return;ai=0;const tk=()=>{if(ar!=null)noteOff(ar);const s=[...held].sort((a,b)=>a-b),q=[...s,...s.map(x=>x+12)];ar=q[ai++%q.length];noteOn(ar)};tk();at=setInterval(tk,1000/V.arp)}
function release(m){if(!V.arp){noteOff(m);return}const i=held.indexOf(m);if(i>=0)held.splice(i,1);if(!held.length&&at){clearInterval(at);at=null;if(ar!=null)noteOff(ar);ar=null}}

function panic(){held.length=0;if(at){clearInterval(at);at=null}ar=null;Object.keys(act).forEach(m=>noteOff(+m));for(const k in dn)delete dn[k];document.querySelectorAll('.kb .on').forEach(e=>e.classList.remove('on'));document.querySelectorAll('.kb [data-n]').forEach(e=>delete e.dataset.n);if(typeof stopDemo=='function')stopDemo();if(typeof seqStop=='function')seqStop()}
addEventListener('blur',panic);document.addEventListener('visibilitychange',()=>{if(document.hidden)panic()});
