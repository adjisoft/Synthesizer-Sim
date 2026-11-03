/* scope.js: osiloskop kecil dari AnalyserNode. Warna di-cache agar tidak menghitung style tiap frame. */
// scope
const cv=$('#sc'),cx=cv.getContext('2d'),dat=new Uint8Array(1024);
let ck,cc;(function dr(){requestAnimationFrame(dr);if(eco&&++ef2%4)return;const W=cv.width,H=cv.height;cx.clearRect(0,0,W,H);if(ck!==cur){ck=cur;cc=getComputedStyle(document.body).getPropertyValue('--ac').trim()||'#888'}cx.strokeStyle=cx.fillStyle=cc;cx.lineWidth=2;
if(!an){cx.fillRect(0,H/2,W,2);return}an.getByteTimeDomainData(dat);const px=cur[0]=='x';cx.beginPath();for(let i=0;i<512;i++){let y=dat[i*2]/255*H;if(px)y=Math.round(y/8)*8;i?cx.lineTo(i/512*W,y):cx.moveTo(0,y)}cx.stroke()})();
