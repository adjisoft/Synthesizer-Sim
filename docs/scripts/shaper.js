/* shaper.js: editor kurva waveshaper yang bisa digambar langsung (dipakai BLASTSHAPER). */
// shaper
function curveFrom(a){const c=new Float32Array(2049);for(let i=0;i<2049;i++){const p=i/64,k=Math.min(31,p|0);c[i]=a[k]+(a[k+1]-a[k])*(p-k)}return c}
function shDraw(){const c=$('#shc');if(!c)return;const x=c.getContext('2d'),W=c.width,col=getComputedStyle(document.body).getPropertyValue('--ac').trim();
x.clearRect(0,0,W,W);x.strokeStyle='#8886';x.lineWidth=1;x.beginPath();x.moveTo(W/2,0);x.lineTo(W/2,W);x.moveTo(0,W/2);x.lineTo(W,W/2);x.moveTo(0,W);x.lineTo(W,0);x.stroke();
x.strokeStyle=x.fillStyle=col;x.lineWidth=3;x.beginPath();V.sc.forEach((v,i)=>{const px=i/32*W,py=(1-v)/2*W;i?x.lineTo(px,py):x.moveTo(px,py)});x.stroke();V.sc.forEach((v,i)=>{if(i%4==0)x.fillRect(i/32*W-3,(1-v)/2*W-3,6,6)})}
function shUI(host){const h=document.createElement('div');h.className='sec shp';h.innerHTML='<h2>Kurva waveshaper</h2><canvas id="shc" width="320" height="320" aria-label="Kurva waveshaper, seret untuk menggambar"></canvas><div class="tr" id="shb"></div>';host.append(h);
const c=h.querySelector('canvas'),b=h.querySelector('#shb');Object.keys(G).forEach(n=>{const e=document.createElement('button');e.textContent=n;e.onclick=()=>{V.sc=pts(n);shVer++;shDraw();ap()};b.append(e)});
let li=-1,py=0,dg=false;const ed=e=>{const r=c.getBoundingClientRect(),i=Math.max(0,Math.min(32,Math.round((e.clientX-r.left)/r.width*32))),y=Math.max(-1,Math.min(1,1-2*(e.clientY-r.top)/r.height)),a=li<0?i:li,ly=li<0?y:py;
for(let k=Math.min(a,i);k<=Math.max(a,i);k++)V.sc[k]=ly+(y-ly)*(a==i?1:(k-a)/(i-a));li=i;py=y;shVer++;shDraw();ap()};
c.onpointerdown=e=>{c.setPointerCapture(e.pointerId);dg=true;li=-1;ed(e)};c.onpointermove=e=>{if(dg)ed(e)};c.onpointerup=c.onpointercancel=()=>dg=false;shDraw()}
