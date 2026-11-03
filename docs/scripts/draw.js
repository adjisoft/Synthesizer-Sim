/* draw.js: synth WAVECARVER, 1-3 oscillator dengan gelombang yang digambar sendiri (64 titik, diubah jadi PeriodicWave lewat DFT). */
let dwv=[1,1,1],dwc=[],dwi=0;
const DWN=['sine','saw','square','tri','pulse','wob','rand'],dwn=a=>{const m=Math.max(...a.map(Math.abs))||1;return a.map(x=>x/m)};
function dwMk(n){const a=[],r=[...Array(5)].map(()=>[Math.random()*2-1,Math.random()*6.28]);for(let i=0;i<64;i++){const t=i/64,p=2*Math.PI*t;a.push(n=='saw'?2*t-1:n=='square'?(t<.5?1:-1):n=='tri'?(t<.5?4*t-1:3-4*t):n=='pulse'?(t<.25?1:-1):n=='wob'?Math.sin(p)+.5*Math.sin(3*p+1)+.3*Math.sin(5*p):n=='rand'?r.reduce((s,h,k)=>s+h[0]*Math.sin((k+1)*p+h[1]),0):Math.sin(p))}return dwn(a)}
const dwNorm=d=>[0,1,2].map(i=>{const x=d&&d[i];return typeof x=='string'?dwMk(x):Array.isArray(x)&&x.length==64?[...x]:dwMk('sine')});
function cwv(i){if(dwc[i]&&dwc[i].v===dwv[i])return dwc[i].w;const a=V.dw[i],N=64,re=new Float32Array(33),im=new Float32Array(33);
for(let h=1;h<=32;h++){let r=0,m=0;for(let n=0;n<N;n++){const p=2*Math.PI*h*n/N;r+=a[n]*Math.cos(p);m+=a[n]*Math.sin(p)}re[h]=2*r/N;im[h]=2*m/N}
const w=ac.createPeriodicWave(re,im);dwc[i]={v:dwv[i],w};return w}
function dwEdit(i){dwv[i]++;dwDraw();for(const k in act)act[k].ss.forEach(o=>o._i===i&&o.setPeriodicWave(cwv(i)))}
function dwDraw(){const c=$('#dwc');if(!c||!V.dw)return;const x=c.getContext('2d'),W=c.width,H=c.height;x.clearRect(0,0,W,H);
x.strokeStyle='#8886';x.lineWidth=1;x.beginPath();x.moveTo(0,H/2);x.lineTo(W,H/2);for(let i=1;i<4;i++){x.moveTo(W*i/4,0);x.lineTo(W*i/4,H)}x.stroke();
x.strokeStyle=x.fillStyle=getComputedStyle(document.body).getPropertyValue('--ac').trim();
const ln=(o,al,lw)=>{x.globalAlpha=al;x.lineWidth=lw;x.beginPath();V.dw[o].forEach((v,i)=>{const px=(i+.5)/64*W,py=(1-v)/2*(H-16)+8;i?x.lineTo(px,py):x.moveTo(px,py)});x.stroke()};
for(let o=0;o<3;o++)if(o!=dwi&&o<V.nosc)ln(o,.3,2);ln(dwi,1,3);x.globalAlpha=1;V.dw[dwi].forEach((v,i)=>{if(i%4==0)x.fillRect((i+.5)/64*W-3,(1-v)/2*(H-16)+5,6,6)});
document.querySelectorAll('#dwt button').forEach((b,i)=>b.classList.toggle('on',i==dwi))}
function dwUI(host){if(!V.dw)V.dw=dwNorm();const h=document.createElement('div');h.className='sec shp dwp';
h.innerHTML='<h2>Gambar gelombang (Osc aktif mengikuti Jml Osc)</h2><div class="tr" id="dwt" style="margin-bottom:8px"></div><canvas id="dwc" width="640" height="170" aria-label="Gambar bentuk gelombang, seret untuk menggambar"></canvas><div class="tr" id="dwb"></div>';host.append(h);
const c=h.querySelector('canvas'),t=h.querySelector('#dwt'),b=h.querySelector('#dwb'),btn=(p,l,f)=>{const e=document.createElement('button');e.textContent=l;e.onclick=f;p.append(e)};
[0,1,2].forEach(k=>btn(t,'Osc '+(k+1),()=>{dwi=k;dwDraw()}));
DWN.forEach(n=>btn(b,n,()=>{V.dw[dwi]=dwMk(n);dwEdit(dwi)}));
btn(b,'smooth',()=>{const a=V.dw[dwi];for(let p=0;p<2;p++)V.dw[dwi]=a.map((v,i)=>(a[(i+63)%64]+2*v+a[(i+1)%64])/4);dwEdit(dwi)});
btn(b,'flip',()=>{V.dw[dwi]=V.dw[dwi].map(v=>-v);dwEdit(dwi)});
btn(b,'salin ke semua',()=>{V.dw=V.dw.map(()=>[...V.dw[dwi]]);[0,1,2].forEach(dwEdit)});
let li=-1,ly=0,dg=false;const ed=e=>{const r=c.getBoundingClientRect(),i=Math.max(0,Math.min(63,Math.floor((e.clientX-r.left)/r.width*64))),yc=(e.clientY-r.top)/r.height*c.height,y=Math.max(-1,Math.min(1,1-2*(yc-8)/(c.height-16))),a=li<0?i:li,y0=li<0?y:ly,w=V.dw[dwi];
for(let k=Math.min(a,i);k<=Math.max(a,i);k++)w[k]=a==i?y:y0+(y-y0)*(k-a)/(i-a);li=i;ly=y;dwEdit(dwi)};
c.onpointerdown=e=>{c.setPointerCapture(e.pointerId);dg=true;li=-1;ed(e)};c.onpointermove=e=>{if(dg)ed(e)};c.onpointerup=c.onpointercancel=()=>dg=false;
host.onpointerup=host.onkeyup=()=>setTimeout(dwDraw);dwDraw()}
