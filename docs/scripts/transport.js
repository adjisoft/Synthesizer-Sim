/* transport.js: demo otomatis, rekam, dan ekspor WAV/OGG/MIDI (WAV dibuat lewat Int16Array agar cepat). */
// demo
let dm=null;function stopDemo(){if(dm){clearInterval(dm);dm=null;$('#demo').classList.remove('on');$('#demo').textContent='Demo'}}
$('#demo').onclick=()=>{if(dm){stopDemo();return}init();const [p,ms]=S[cur].demo;let i=0;$('#demo').classList.add('on');$('#demo').textContent='Stop demo';
dm=setInterval(()=>{const m=p[i++%p.length];if(m){noteOn(m);setTimeout(()=>noteOff(m),ms*.85)}},ms)};
// record + export
const dl=async(b,n)=>{let D=null;try{D=window.claude&&await claude.use('downloads')}catch(e){}
if(!D){const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=n;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),4000);return}
let f=n,d=b;if(!/\.(webm|zip)$/.test(n)&&window.JSZip){const z=new JSZip();z.file(n,b);d=await z.generateAsync({type:'blob'});f=n+'.zip'}
try{await D.save({filename:f,data:d})}catch(e){if(!e||e.code!='declined')msg('Gagal menyimpan: '+((e&&e.message)||''))}};
function wav(){const n=chunks.reduce((s,c)=>s+c[0].length,0),sr=ac.sampleRate,pcm=new Int16Array(n*2),h=new DataView(new ArrayBuffer(44)),w=(o,t)=>[...t].forEach((c,i)=>h.setUint8(o+i,c.charCodeAt(0)));let o=0;
for(const c of chunks){const l=c[0],r=c[1];for(let i=0;i<l.length;i++){let x=l[i];x=x<-1?-1:x>1?1:x;pcm[o++]=x<0?x*32768:x*32767;x=r[i];x=x<-1?-1:x>1?1:x;pcm[o++]=x<0?x*32768:x*32767}}
w(0,'RIFF');h.setUint32(4,36+n*4,true);w(8,'WAVEfmt ');h.setUint32(16,16,true);h.setUint16(20,1,true);h.setUint16(22,2,true);h.setUint32(24,sr,true);h.setUint32(28,sr*4,true);h.setUint16(32,4,true);h.setUint16(34,16,true);w(36,'data');h.setUint32(40,n*4,true);
return new Blob([h,pcm],{type:'audio/wav'})}
function mid(){const vl=n=>{const b=[n&127];while(n>>=7)b.unshift((n&127)|128);return b},tk=[0,0xFF,0x51,3,7,0xA1,0x20];let last=0;
[...ev].sort((a,b)=>a.t-b.t).forEach(e=>{const t=Math.round(e.t*960);tk.push(...vl(t-last),e.on?0x90:0x80,e.m,e.on?90:0);last=t});tk.push(0,0xFF,0x2F,0);
const h=[77,84,104,100,0,0,0,6,0,0,0,1,1,0xE0,77,84,114,107,tk.length>>>24,tk.length>>16&255,tk.length>>8&255,tk.length&255];return new Blob([new Uint8Array([...h,...tk])],{type:'audio/midi'})}
$('#rec').onclick=()=>{init();if(!recording){chunks=[];ev=[];mrC=[];t0=ac.currentTime;recording=true;spOn(true);blobs={};
const mt=['audio/ogg;codecs=opus','audio/webm;codecs=opus'].find(t=>window.MediaRecorder&&MediaRecorder.isTypeSupported(t));
if(mt){mr=new MediaRecorder(rcd.stream,{mimeType:mt});mr.ondataavailable=e=>mrC.push(e.data);mr.onstop=()=>{blobs.ogg=new Blob(mrC,{type:mt});blobs.ext=mt.includes('ogg')?'ogg':'webm';$('#eogg').disabled=false};mr.start()}else mr=null;
$('#rec').classList.add('on');$('#rec').textContent='Stop rekam';['#ewav','#eogg','#emid'].forEach(s=>$(s).disabled=true);msg('Merekam...')}
else{Object.keys(act).forEach(m=>log(+m,0));recording=false;spOn(!!ct);if(mr)mr.stop();blobs.wav=wav();blobs.mid=mid();$('#rec').classList.remove('on');$('#rec').textContent='Rekam';$('#ewav').disabled=false;$('#emid').disabled=!ev.length;msg('Rekaman siap diekspor.')}};
$('#ewav').onclick=()=>dl(blobs.wav,S[cur].n+'.wav');$('#emid').onclick=()=>dl(blobs.mid,S[cur].n+'.mid');
$('#eogg').onclick=()=>{if(blobs.ogg){dl(blobs.ogg,S[cur].n+'.'+blobs.ext);if(blobs.ext=='webm')msg('Browser ini hanya mendukung Opus/WebM, file disimpan sebagai .webm.')}};
