/* keyboard.js: piano di layar, input keyboard PC, pergeseran dan oktaf. */
// keyboard
const kb=$('#kb'),kw=$('#kbw'),LO=36,N=48;
const whites=[];for(let i=0;i<=N;i++){if([1,3,6,8,10].includes(i%12))continue;const b=document.createElement('b');b.dataset.o=i;whites.push(b);kb.append(b)}

[...Array(N+1).keys()].filter(i=>[1,3,6,8,10].includes(i%12)).forEach(o=>{const s=document.createElement('s'),wi=whites.findIndex(w=>+w.dataset.o==o-1);s.dataset.o=o;s.style.left=((wi+1)/whites.length*100)+'%';kb.append(s)});
const base=()=>12*oct+12,keyEl=o=>kb.querySelector('[data-o="'+(base()+o-LO)+'"]');
kb.querySelectorAll('b,s').forEach(e=>{const m=LO+ +e.dataset.o;e.onpointerdown=ev=>{ev.preventDefault();e.classList.add('on');e.dataset.n=m;press(m)};const up=()=>{if(e.dataset.n){e.classList.remove('on');release(+e.dataset.n);delete e.dataset.n}};e.onpointerup=e.onpointerleave=e.onpointercancel=up});
const KM='awsedftgyhujkolp;';const dn={};
addEventListener('keydown',e=>{if(e.repeat||e.metaKey||e.ctrlKey||/INPUT|SELECT/.test(e.target.tagName))return;const o=KM.indexOf(e.key.toLowerCase());if(o<0||dn[o])return;dn[o]=base()+o;keyEl(o)?.classList.add('on');press(dn[o])});
addEventListener('keyup',e=>{const o=KM.indexOf(e.key.toLowerCase());if(o<0||!dn[o])return;release(dn[o]);delete dn[o];keyEl(o)?.classList.remove('on')});
const goOct=sm=>{const w=kb.scrollWidth/whites.length;kw.scrollTo({left:Math.max(0,(Math.floor((base()-LO)/12)*7-.5)*w),behavior:sm?'smooth':'instant'})};
const soct=()=>$('#oc').textContent='PC: C'+oct;soct();$('#om').onclick=()=>{oct=Math.max(2,oct-1);soct();goOct(1)};$('#op').onclick=()=>{oct=Math.min(4,oct+1);soct();goOct(1)};
const rail=$('#rail'),th=$('#rth'),sk=d=>kw.scrollBy({left:d*kb.scrollWidth/whites.length*7,behavior:'smooth'});
const upd=()=>{th.style.width=Math.min(100,kw.clientWidth/kw.scrollWidth*100)+'%';th.style.left=kw.scrollLeft/kw.scrollWidth*100+'%'};
kw.addEventListener('scroll',upd);addEventListener('resize',upd);$('#kl').onclick=()=>sk(-1);$('#kr').onclick=()=>sk(1);
let rd=false;const rp=e=>{const r=rail.getBoundingClientRect();kw.scrollTo({left:(e.clientX-r.left)/r.width*kw.scrollWidth-kw.clientWidth/2,behavior:'instant'})};
rail.onpointerdown=e=>{rail.setPointerCapture(e.pointerId);rd=true;rp(e)};rail.onpointermove=e=>{if(rd)rp(e)};rail.onpointerup=rail.onpointercancel=()=>rd=false;
goOct();upd();
