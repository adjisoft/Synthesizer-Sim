/* main.js: tombol tampilan, kunci bend, indikator CPU, dan pemilihan synth awal. */
$('#vw').onclick=()=>{mode=mode=='m'?'f':mode=='f'?'k':'m';$('#vw').textContent='Tampilan: '+{m:'Campuran',f:'Fader',k:'Knob'}[mode];render()};
$('#blk').onclick=()=>{bl=!bl;$('#blk').textContent='Kunci bend: '+(bl?'On':'Off');$('#blk').classList.toggle('on',bl);if(bl){V.be=V.bs;ref();ap()}};
let ct=null,xt=0;const cb=$('#cpu');
function cpuT(on){clearInterval(ct);ct=null;if(typeof spOn=='function')spOn(on||recording);cb.textContent='CPU: '+(on?'On':'Off');cb.classList.toggle('on',on);$('#cpuv').textContent='';
if(on)ct=setInterval(()=>{const x=xr;xr=0;xt+=x;const c=Math.min(99,Math.round(3+live*.45+(V.drv>0?1.5:0)+(V.rev>0?2:0)+(V.dmx>0?1:0)+(V.mb>0?2:0)+x*8));$('#cpuv').textContent='CPU ~'+c+'%, osc '+live+', xrun '+xt},500)}
cb.onclick=()=>cpuT(!ct);
pick('x2');
