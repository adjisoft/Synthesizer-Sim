/* diag.js: uji cepat audio (konteks, suara, osiloskop, spektrum, fps, hemat daya). */
$('#dgb').onclick=async()=>{const o=$('#dgo');o.textContent='Menguji...';init();await ac.resume();let fr=0,run=true;(function c(){if(run){fr++;requestAnimationFrame(c)}})();
const m=cur=='dr'?36:69;noteOn(m);await new Promise(r=>setTimeout(r,500));
const w=new Uint8Array(2048),f=new Uint8Array(1024);an.getByteTimeDomainData(w);an.getByteFrequencyData(f);let pk=0,fm=0,fi=0;w.forEach(v=>pk=Math.max(pk,Math.abs(v-128)));f.forEach((v,i)=>{if(v>fm){fm=v;fi=i}});
noteOff(m);run=false;const ok=b=>b?'OK  ':'GAGAL',hz=Math.round(fi*ac.sampleRate/2048);
o.textContent=[ok(ac.state=='running')+' AudioContext: '+ac.state+', '+ac.sampleRate+' Hz',ok(pk>2)+' Suara keluar, puncak '+pk+'/128',ok(pk>2)+' Osiloskop: data gelombang '+(pk>2?'ada':'kosong'),ok(fm>20)+' Spektrum: puncak ~'+hz+' Hz (level '+fm+')',ok(fr>15)+' Animasi: '+Math.round(fr*2)+' fps',(eco?'INFO':'OK  ')+' Hemat daya: '+(eco?'On (grafik 15 fps)':'Off'),'INFO Synth: '+S[cur].n].join('\n')};
