(()=>{
const C=window.CONFIG,$=s=>document.querySelector(s),PAL=['#e76f51','#f4a261','#f2d16b','#8ab17d','#2a9d8f','#7fc4e8','#5c6bc0','#b39ddb','#a47148','#b8c0c8'];
let S={level:"1",best:"1",streak:0,last:"",hints:1,done:0,vol:.5,sfx:true,tut:0,p:{name:'Giocatore',pfp:1,frame:0},frames:[],wins:'0',comp:{day:0,stars:0},chests:[],pend:null},TH=C.theme,P,M,cur=0,won=false,lives=3,busy=false,errs=0,hu=0,nw=-1,H=[];
const asset=f=>`assets/themes/${TH}/${f}`;
window.fb=i=>{if(!i.dataset.f){i.dataset.f=1;i.src='assets/themes/default/'+i.dataset.n}else i.outerHTML=i.dataset.e||''};
const img=(n,e,c='')=>`<img class="${c}" data-n="${n}" data-e="${e}" src="${asset(n)}" onerror="fb(this)">`;
// ---- storage ----
const idb=()=>new Promise((a,b)=>{const r=indexedDB.open('gattoku',1);r.onupgradeneeded=()=>r.result.createObjectStore('s');r.onsuccess=()=>a(r.result);r.onerror=()=>b(r.error)});
async function save(){const j=JSON.stringify(S);try{localStorage.setItem('gattoku',j)}catch(e){}try{(await idb()).transaction('s','readwrite').objectStore('s').put(j,'save')}catch(e){}}
async function load(){let j=null;try{const d=await idb();j=await new Promise(r=>{const q=d.transaction('s').objectStore('s').get('save');q.onsuccess=()=>r(q.result);q.onerror=()=>r(null)})}catch(e){}
 if(!j)try{j=localStorage.getItem('gattoku')}catch(e){}if(j)try{Object.assign(S,JSON.parse(j))}catch(e){}}
try{navigator.storage&&navigator.storage.persist&&navigator.storage.persist()}catch(e){}
// ---- streak ----
const today=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const dn=s=>{const[a,b,c]=s.split('-').map(Number);return Date.UTC(a,b-1,c)/864e5};
const checkStreak=()=>{if(S.last&&dn(today())-dn(S.last)>1)S.streak=0};
function played(){const t=today();if(S.last===t)return;S.streak=(S.last&&dn(t)-dn(S.last)===1)?S.streak+1:1;S.last=t;save();hud()}
const fmt=s=>{s=String(s);return s.length<=12?BigInt(s).toLocaleString('it-IT'):s[0]+','+s.slice(1,4)+' ×10^'+(s.length-1)};
// ---- generatore ----
function hash(str){let h=1779033703^str.length;for(let i=0;i<str.length;i++){h=Math.imul(h^str.charCodeAt(i),3432918353);h=h<<13|h>>>19}h=Math.imul(h^h>>>16,2246822507);h=Math.imul(h^h>>>13,3266489909);return(h^h>>>16)>>>0}
const rng=s=>{let a=hash(s);return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}};
const sizeOf=l=>{l=(l-1n)%100n+1n;return l<6n?5:l<16n?6:l<31n?7:l<51n?8:l<76n?9:10};
const shuf=(a,R)=>{for(let i=a.length-1;i>0;i--){const j=R()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
function solveFrom(n,g,fx){const u=[],ru=[],s=[];const go=r=>{if(r==n)return true;for(let c=0;c<n;c++){if(fx[r]>=0&&fx[r]!=c)continue;const q=g[r*n+c];if(u[c]||ru[q]||(r&&Math.abs(c-s[r-1])<2))continue;u[c]=ru[q]=1;s[r]=c;if(go(r+1))return true;u[c]=ru[q]=0}return false};return go(0)?s:null}
function place(n,R){const s=[],u=[];const go=r=>{if(r==n)return true;const cs=shuf([...Array(n).keys()],R);for(const c of cs){if(u[c]||(r&&Math.abs(c-s[r-1])<2))continue;s[r]=c;u[c]=1;if(go(r+1))return true;u[c]=0}return false};return go(0)?s:null}
function grow(n,s,R){const g=Array(n*n).fill(-1);s.forEach((c,r)=>g[r*n+c]=r);let left=n*n-n;const D=[[1,0],[-1,0],[0,1],[0,-1]];
 while(left){const o=[];for(let i=0;i<n*n;i++)if(g[i]<0){const r=i/n|0,c=i%n;for(const[a,b]of D){const y=r+a,x=c+b;if(y>=0&&y<n&&x>=0&&x<n&&g[y*n+x]>=0)o.push([i,g[y*n+x]])}}const[i,k]=o[R()*o.length|0];g[i]=k;left--}return g}
function count(n,g){let k=0;const u=[],ru=[],s=[];const go=r=>{if(k>1)return;if(r==n){k++;return}for(let c=0;c<n;c++){const q=g[r*n+c];if(u[c]||ru[q]||(r&&Math.abs(c-s[r-1])<2))continue;u[c]=ru[q]=1;s[r]=c;go(r+1);u[c]=ru[q]=0}};go(0);return k}
function alt(n,g,sol){const u=[],ru=[],s=[];let res=null;const go=r=>{if(res)return;if(r==n){if(s.some((c,i)=>c!=sol[i]))res=s.slice();return}for(let c=0;c<n;c++){const q=g[r*n+c];if(u[c]||ru[q]||(r&&Math.abs(c-s[r-1])<2))continue;u[c]=ru[q]=1;s[r]=c;go(r+1);u[c]=ru[q]=0}};go(0);return res}
function conn(n,g,q){const m=[];g.forEach((v,i)=>v==q&&m.push(i));if(!m.length)return false;const seen=new Set([m[0]]),st=[m[0]];while(st.length){const i=st.pop(),r=i/n|0,c=i%n;for(const[y,x]of[[1,0],[-1,0],[0,1],[0,-1]]){const yy=r+y,xx=c+x,j=yy*n+xx;if(yy>=0&&yy<n&&xx>=0&&xx<n&&g[j]==q&&!seen.has(j)){seen.add(j);st.push(j)}}}return seen.size==m.length}
function fix(n,g,sol,R){for(let it=0;it<500;it++){const a=alt(n,g,sol);if(!a)return true;const cand=[];a.forEach((c,r)=>{if(c!=sol[r])cand.push(r*n+c)});shuf(cand,R);let done=false;
 for(const i of cand){const r=i/n|0,c=i%n,nb=[];for(const[y,x]of[[1,0],[-1,0],[0,1],[0,-1]]){const yy=r+y,xx=c+x;if(yy>=0&&yy<n&&xx>=0&&xx<n&&g[yy*n+xx]!=g[i])nb.push(g[yy*n+xx])}
  shuf(nb,R);for(const q of nb){const old=g[i];g[i]=q;if(conn(n,g,old)){done=true;break}g[i]=old}if(done)break}
 if(!done)return false}return false}
function gen(lv){const n=sizeOf(BigInt(lv));for(let t=0;;t++){const R=rng(lv+':'+t),sol=place(n,R);if(!sol)continue;const reg=grow(n,sol,R),u=fix(n,reg,sol,R);if(u||t>40)return{n,reg,sol,u}}}
// ---- audio (file mp3 se presenti, altrimenti sintetizzato) ----
let AC,MG,okf={},music=new Audio(),mOn=false,synth=false,step=0;
const AEX=['mp3','ogg','wav','m4a','opus'];
function findAudio(n,done){const L=[];[TH,'default'].forEach(t=>{if(!L.some(x=>x[0]==t))AEX.forEach(e=>L.push([t,e]))});let i=0;
 (function nx(){if(i>=L.length)return done(null);const a=new Audio(),[t,e]=L[i++];a.preload='auto';a.oncanplaythrough=()=>{a.oncanplaythrough=a.onerror=null;done(a)};a.onerror=nx;a.src=`assets/themes/${t}/${n}.${e}`})()}
const preload=()=>['click','win','cat','bad','hint','lose'].forEach(n=>findAudio(n,a=>{if(a)okf[n]=a}));
function ac(){if(!AC){AC=new(window.AudioContext||window.webkitAudioContext)();MG=AC.createGain();MG.connect(AC.destination)}if(AC.state=='suspended')AC.resume();return AC}
function tone(f,t,d,type='sine',v=.15,dst,f2){const o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.015);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(dst||AC.destination);o.start(t);o.stop(t+d+.05)}
const mf=m=>440*Math.pow(2,(m-69)/12);
function sfx(n){if(!S.sfx)return;try{if(okf[n]){const a=okf[n].cloneNode();a.volume=Math.min(1,S.vol+.3);a.play();return}ac();const t=AC.currentTime,v=Math.min(.3,S.vol*.3+.08);
 if(n=='cat'){tone(520,t,.28,'sine',v,0,880);tone(880,t+.1,.2,'triangle',v*.6)}
 else if(n=='click')tone(330,t,.07,'triangle',v*.7);
 else if(n=='bad'){tone(220,t,.4,'sawtooth',v*.7,0,70)}
 else if(n=='hint'){tone(mf(84),t,.4,'sine',v);tone(mf(91),t+.12,.5,'sine',v)}
 else if(n=='lose'){[67,64,60,55].forEach((m,i)=>tone(mf(m),t+i*.18,.4,'triangle',v))}
 else if(n=='win'){[60,64,67,72,76,79].forEach((m,i)=>tone(mf(m),t+i*.1,.45,'triangle',v))}}catch(e){}}
const PROG={default:[[48,[60,64,67]],[45,[57,60,64]],[41,[57,60,65]],[43,[59,62,67]]],halloween:[[45,[57,60,64]],[38,[53,57,62]],[40,[56,59,64]],[45,[57,60,64]]],natale:[[48,[64,67,72]],[43,[62,67,71]],[45,[60,64,69]],[41,[60,65,69]]]};
function bar(){if(!synth||!AC)return;const p=(PROG[TH]||PROG.default)[step++%4],t=AC.currentTime+.05,b=.3;
 tone(mf(p[0]),t,b*7,'sine',.5,MG);for(let i=0;i<8;i++)tone(mf(p[1][[0,1,2,1,2,1,0,1][i]%3]+(i%4==3?12:0)),t+i*b,b*1.6,TH=='natale'?'sine':'triangle',.22,MG)}
function startMusic(){if(mOn)return;mOn=true;const fb=()=>{if(synth)return;synth=true;ac();MG.gain.value=S.vol*.5;bar();setInterval(bar,2400)};
 findAudio('music',a=>{if(!a)return fb();music=a;music.loop=true;music.volume=S.vol;music.play().catch(()=>{mOn=false})})}
addEventListener('pointerdown',startMusic);addEventListener('keydown',startMusic);
const setVol=()=>{music.volume=S.vol;if(MG)MG.gain.value=S.vol*.5};
// ---- confetti ----
const cv=$('#fx'),cx=cv.getContext('2d');let pts=[];
function confetti(){cv.width=innerWidth;cv.height=innerHeight;for(let i=0;i<140;i++)pts.push({x:innerWidth/2,y:innerHeight*.45,vx:(Math.random()-.5)*16,vy:-Math.random()*16-4,c:`hsl(${Math.random()*360},90%,65%)`,s:5+Math.random()*7,r:Math.random()*6});if(pts.length==140)tick()}
function tick(){cx.clearRect(0,0,cv.width,cv.height);pts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.45;p.r+=.2;cx.fillStyle=p.c;cx.save();cx.translate(p.x,p.y);cx.rotate(p.r);cx.fillRect(-p.s/2,-p.s/3,p.s,p.s/1.5);cx.restore()});pts=pts.filter(p=>p.y<cv.height+20);if(pts.length)requestAnimationFrame(tick);else cx.clearRect(0,0,cv.width,cv.height)}
// ---- gioco ----
let tm;const toast=(t)=>{const e=$('#toast');e.textContent=t;e.style.opacity=1;clearTimeout(tm);tm=setTimeout(()=>e.style.opacity=0,2600)};
function newLevel(){P=gen(S.level);restart()}
function restart(){M=Array(P.n*P.n).fill(0);cur=0;won=false;lives=3;busy=false;errs=0;hu=0;H=[];render();hud();toast('Metti un gatto in ogni colore! 🐱')}
const placed=()=>M.filter(v=>v==2).length;
function hud(){$('#lv').textContent=fmt(S.level);$('#st').textContent='🔥 '+S.streak;$('#hn').textContent='💡 '+S.hints;$('#bu').disabled=!H.length;$('#cs').textContent=sIdx(dayN())<0?'—':'⭐ '+S.comp.stars;
 $('#hearts').innerHTML=[0,1,2].map(i=>img(i<lives?'heart.png':'heart_off.png','❤',i<lives?'':'off')).join('');$('#bh').textContent=`💡 Aiuto (${Math.max(0,2-hu)})`;$('#prog').textContent=`🐱 ${placed()}/${P?P.n:0}`}
function render(){const n=P.n,B=$('#board');B.style.gridTemplateColumns=B.style.gridTemplateRows=`repeat(${n},1fr)`;B.style.setProperty('--n',n);let h='';
 for(let i=0;i<n*n;i++){const r=i/n|0,c=i%n,q=P.reg[i],e=(a,b)=>{const y=r+a,x=c+b;return y<0||x<0||y>=n||x>=n||P.reg[y*n+x]!==q?3:.5};
  h+=`<div class="cell${i===cur?' cur':''}${i===nw?' new':''}" data-i="${i}" style="background:${PAL[q]};border-width:${e(-1,0)}px ${e(0,1)}px ${e(1,0)}px ${e(0,-1)}px">${M[i]==2?img('cat.png','🐱'):M[i]==1?'<span class="x">✕</span>':M[i]==3?'<span class="x a">✕</span>':''}</div>`}
 B.innerHTML=h;nw=-1;hud()}
function reason(i){const n=P.n,r=i/n|0,c=i%n;for(let j=0;j<n*n;j++)if(M[j]==2){const r2=j/n|0,c2=j%n;
  if(r==r2)return'In questa riga c\'è già un gatto!';if(c==c2)return'In questa colonna c\'è già un gatto!';if(P.reg[i]==P.reg[j])return'Questo colore ha già il suo gatto!';if(Math.abs(r-r2)<2&&Math.abs(c-c2)<2)return'I gatti non possono toccarsi, nemmeno in diagonale!'}
 return'Qui porta a un vicolo cieco: la casella giusta è un\'altra!'}
function autoX(i){const n=P.n,r=i/n|0,c=i%n;for(let j=0;j<n*n;j++){if(M[j])continue;const r2=j/n|0,c2=j%n;if(r==r2||c==c2||P.reg[i]==P.reg[j]||(Math.abs(r-r2)<2&&Math.abs(c-c2)<2))M[j]=3}}
function good(i,h){if(!h)H.push([i,M[i]]);M[i]=2;nw=i;sfx('cat');render();if(placed()==P.n)win()}
const mark=()=>{const o=document.querySelector('.cell.cur');o&&o.classList.remove('cur');const e=document.querySelector(`[data-i="${cur}"]`);e&&e.classList.add('cur')};
function tap(i,x){if(won||busy)return;mark();played();const v=M[i];
 if(v==2)return;if(v==3){sfx('click');toast('Questa casella è già esclusa ✕');return}
 if(x||v==0){H.push([i,v]);M[i]=v==1&&x?0:1;nw=i;sfx('click');render();return}
 // v==1 -> prova a mettere un gatto
 if(okPlace(i)){good(i);return}
 wrong(i)}
function okPlace(i){const n=P.n,r=i/n|0,fx=Array(n).fill(-1);M.forEach((v,j)=>v==2&&(fx[j/n|0]=j%n));if(fx[r]>=0)return false;fx[r]=i%n;return!!solveFrom(n,P.reg,fx)}
function wrong(i){const msg=reason(i);M[i]=1;nw=i;errs++;lives--;sfx('bad');navigator.vibrate&&navigator.vibrate(120);render();const el=document.querySelector(`[data-i="${i}"]`);el&&el.classList.add('bad');toast('❌ '+msg);
 const h=$('#hearts').children;h[lives]&&h[lives].classList.add('pop');hud();$('#hearts').children[lives]&&$('#hearts').children[lives].classList.add('pop');
 if(lives<=0){busy=true;setTimeout(()=>{sfx('lose');$('#lose').classList.remove('hidden')},900)}}
function win(){won=true;const st=Math.max(1,lives);S.level=(BigInt(S.level)+1n).toString();if(BigInt(S.level)>BigInt(S.best))S.best=S.level;S.done++;roll();if(sIdx(dayN())>=0)S.comp.stars+=st;let extra='';if(S.done%C.hintEvery==0){S.hints++;extra=' · +1 aiuto 💡'}save();
 setTimeout(()=>{sfx('win');confetti();$('#wd').innerHTML=img('cat.png','🐱','dance');$('#wh').textContent=errs==0?'PERFETTO!':errs<=2?'OTTIMO!':errs<=5?'BRAVO!':'CE L\'HAI FATTA!';$('#we').textContent='Errori: '+(errs>10?'10+':errs);$('#stars').innerHTML=[1,2,3].map(i=>`<span style="animation-delay:${i*.2}s">${i<=st?'⭐':'☆'}</span>`).join('');
  $('#wt').textContent=`Prossimo: livello ${fmt(S.level)} · Streak 🔥 ${S.streak}${extra}`;$('#win').classList.remove('hidden')},500)}
function hint(){if(won||busy)return;if(hu>=2)return toast('Hai già usato 2 aiuti in questo livello! 💡');if(S.hints<1)return toast('Nessun aiuto: completa livelli per guadagnarne! 🎁');const n=P.n,fx=Array(n).fill(-1);M.forEach((v,j)=>v==2&&(fx[j/n|0]=j%n));const sl=solveFrom(n,P.reg,fx),r=fx.findIndex(c=>c<0);if(r<0||!sl)return;S.hints--;hu++;played();save();sfx('hint');good(r*n+sl[r],1);toast('💡 Ecco un gatto al posto giusto!')}
function undo(){if(won||busy||!H.length)return;const[i,v]=H.pop();M[i]=v;nw=-1;sfx('click');render()}
const reset=()=>{if(!won&&!busy){restart()}};
function mv(dx,dy){const n=P.n;cur=Math.max(0,Math.min(n-1,(cur/n|0)+dy))*n+Math.max(0,Math.min(n-1,cur%n+dx));mark()}
const toggle=id=>$(id).classList.toggle('hidden');
// ---- input ----
$('#board').addEventListener('click',e=>{const c=e.target.closest('.cell');if(c){cur=+c.dataset.i;tap(cur)}});
$('#board').addEventListener('contextmenu',e=>{e.preventDefault();const c=e.target.closest('.cell');if(c){cur=+c.dataset.i;tap(cur,1)}});
addEventListener('keydown',e=>{if(document.querySelector('.ov:not(.hidden)'))return;const k=e.key;
 if(k=='ArrowUp')mv(0,-1);else if(k=='ArrowDown')mv(0,1);else if(k=='ArrowLeft')mv(-1,0);else if(k=='ArrowRight')mv(1,0);
 else if(k==' '||k=='Enter'){e.preventDefault();tap(cur)}else if(k=='x'||k=='X')tap(cur,1);else if(k=='h'||k=='H')hint();else if(k=='z'||k=='Z')undo();else if(k=='Escape')toggle('#opt')});
const pv={};let dt=0,padOn=false,zone='board',bi=0,oi=0,lastOv=null;
const bts=()=>[...document.querySelectorAll('.btns button')];
const ovEl=()=>[...document.querySelectorAll('.ov:not(.hidden):not(#load)')].pop();
const focs=o=>[...o.querySelectorAll('button,input:not([type=file])')];
function gf(){document.querySelectorAll('.gpf').forEach(e=>e.classList.remove('gpf'));const o=ovEl(),L=$('#pad');L.style.display=padOn?'block':'none';
 L.textContent=o?'✚ Naviga · Ⓐ Conferma · Ⓑ Chiudi':'✚ Muovi · Ⓐ ✕/Gatto · Ⓑ ✕ · Ⓧ Aiuto · Ⓨ Ricomincia · RB Indietro · LB Tutorial · Select Classifica · Start Opzioni';
 if(!padOn)return;if(o){const f=focs(o);oi=Math.max(0,Math.min(oi,f.length-1));f[oi]&&(f[oi].classList.add('gpf'),f[oi].scrollIntoView({block:'nearest'}))}else if(zone=='bar')bts()[bi].classList.add('gpf')}
function nav(dx,dy){const o=ovEl();
 if(o){const f=focs(o),e=f[oi];if(e&&e.type=='range'&&dx){e.value=Math.max(0,Math.min(1,+e.value+dx*.05));e.dispatchEvent(new Event('input'));return}oi=Math.max(0,Math.min(f.length-1,oi+(dy||dx)))}
 else if(zone=='bar'){if(dy<0)zone='board';else bi=Math.max(0,Math.min(bts().length-1,bi+dx))}
 else if(dy>0&&(cur/P.n|0)==P.n-1)zone='bar';else mv(dx,dy);gf()}
addEventListener('gamepadconnected',()=>{padOn=true;gf()});
function poll(){const p=[...(navigator.getGamepads?navigator.getGamepads():[])].find(x=>x);
 if(p){const b=i=>!!(p.buttons[i]&&p.buttons[i].pressed),now=performance.now();
  if(!padOn&&(p.buttons.some(x=>x.pressed)||p.axes.some(a=>Math.abs(a)>.6))){padOn=true;gf()}
  const dx=Math.sign((b(15)?1:0)-(b(14)?1:0)+(Math.abs(p.axes[0])>.6?p.axes[0]:0)),dy=Math.sign((b(13)?1:0)-(b(12)?1:0)+(Math.abs(p.axes[1])>.6?p.axes[1]:0));
  if((dx||dy)&&now-dt>180&&padOn){dt=now;nav(dx,dy)}
  const o0=ovEl();if(o0!==lastOv){lastOv=o0;oi=0;gf()}
  [[0,()=>{const o=ovEl();if(o){const e=focs(o)[oi];e&&e.click()}else if(zone=='bar')bts()[bi].click();else tap(cur)}],
   [1,()=>{const o=ovEl();if(o){const c=o.querySelector('.cl');c&&c.click()}else if(zone=='bar')zone='board';else tap(cur,1)}],
   [2,()=>{if(!ovEl())hint()}],[3,()=>{if(!ovEl())reset()}],[5,()=>{if(!ovEl())undo()}],[4,()=>{if(!ovEl())tut(0)}],[8,()=>{if(!ovEl())$('#bl').click()}],
   [9,()=>{const o=ovEl();if(!o||o.id=='opt')toggle('#opt')}]].forEach(([i,f])=>{const d=b(i);if(d&&!pv[i]){f();gf()}pv[i]=d})}
 requestAnimationFrame(poll)}
$('#bh').onclick=hint;$('#bu').onclick=undo;$('#br').onclick=reset;$('#bo').onclick=()=>toggle('#opt');$('#bt').onclick=()=>tut(0);
$('#bl').onclick=()=>{const L=[...C.leaderboard];L.push({name:'Tu',level:S.best,me:1});L.sort((a,b)=>{const x=BigInt(a.level),y=BigInt(b.level);return x<y?1:x>y?-1:0});
 $('#ol').innerHTML=L.map((p,i)=>`<li${p.me?' style="font-weight:800;color:#2a9d8f"':''}>${i<3?['🥇','🥈','🥉'][i]+' ':''}${p.name} — liv. ${fmt(p.level)}</li>`).join('');toggle('#lb')};
document.querySelectorAll('.cl').forEach(b=>b.onclick=()=>b.closest('.ov').classList.add('hidden'));
$('#nx').onclick=()=>{$('#win').classList.add('hidden');newLevel()};
$('#rt').onclick=()=>{$('#lose').classList.add('hidden');restart()};
$('#vol').oninput=e=>{S.vol=+e.target.value;setVol();save()};$('#sfx').onchange=e=>{S.sfx=e.target.checked;save()};
// ---- tutorial ----
const mini=(g,cols)=>`<div class="mini" style="grid-template-columns:repeat(${cols},1fr)">${g.split('').map(ch=>{const m={C:['🐱','g'],x:['✕',''],'.':['',''],R:['🐱','r'],y:['','y'],b:['','b'],Y:['🐱','y'],B:['🐱','b']}[ch];return`<i class="${m[1]}">${m[0]}</i>`}).join('')}</div>`;
const TUT=[['Benvenuto in Gattoku! 🐱','Ogni colore deve avere esattamente UN gattino. Trova dove metterli tutti!',mini('YyybbbyyBbyyy',0)||mini('Yyyybbbb',4)],
['Una riga, una colonna','In ogni riga e in ogni colonna può esserci un solo gatto. Usa le ✕ come appunti per segnarti dove i gatti non possono stare.',mini('C.x.x.x.x.x.x.x.x.',3).replace(/./,m=>m)],
['Niente vicini!','Due gatti non possono toccarsi, nemmeno in diagonale: i gatti amano il loro spazio.',mini('CxxxR.xx.',3)],
['Come si gioca','Tocca una casella: prima compare ✕ (appunto), tocca ancora per mettere il gatto. Gli aiuti 💡 sono al massimo 2 per tentativo. Sbagli? Perdi una ❤️ (hai 3 vite). Finite le vite riparti dallo stesso livello.',mini('.xC.',2)],
['Aiuti, streak e livelli ∞','Completa i livelli per guadagnare aiuti 💡. Gioca ogni giorno per far crescere la streak 🔥: se salti un giorno si azzera. I livelli non finiscono mai!',mini('C.',2)]];
let ti=0;function tut(i){ti=i;$('#tut').classList.remove('hidden');const t=TUT[i];$('#tt').textContent=t[0];$('#tx').textContent=t[1];$('#td').innerHTML=i==0?mini('Yyybbyyb',4).replace('Y','Y'):t[2];$('#dots').innerHTML=TUT.map((_,k)=>`<i class="${k==i?'on':''}"></i>`).join('');$('#tn').textContent=i==TUT.length-1?'Giochiamo! 🎮':'Avanti'}
$('#tn').onclick=()=>{sfx('click');if(ti<TUT.length-1)tut(ti+1);else{$('#tut').classList.add('hidden');S.tut=1;save()}};
// ---- export / import ----
$('#ex').onclick=async()=>{const blob=new Blob([JSON.stringify(S)],{type:'application/json'}),name='gattoku-save.json';
 if(window.showSaveFilePicker){try{const h=await showSaveFilePicker({suggestedName:name}),w=await h.createWritable();await blob.stream().pipeTo(w);$('#msg').textContent='Esportato ✔';return}catch(e){if(e.name=='AbortError')return}}
 const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();$('#msg').textContent='Esportato ✔'};
$('#im').onclick=()=>$('#fi').click();
$('#fi').onchange=async e=>{const f=e.target.files[0];if(!f)return;try{let t='';const d=new TextDecoder(),r=f.stream().getReader();for(;;){const{done,value}=await r.read();if(done)break;t+=d.decode(value,{stream:true})}
 const o=JSON.parse(t);if(!/^\d+$/.test(String(o.level)))throw 0;Object.assign(S,o);S.level=String(o.level);S.best=String(o.best||o.level);await save();newLevel();syncOpt();$('#msg').textContent='Importato ✔'}catch(x){$('#msg').textContent='File non valido ✖'}e.target.value=''};
const syncOpt=()=>{$('#vol').value=S.vol;$('#sfx').checked=S.sfx;setVol()};
// ---- profilo, cornici, competizione (tutto offline, giorno = data locale) ----
const EX=C.exts,esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
window.xf=i=>{const k=+i.dataset.k+1;if(k<EX.length){i.dataset.k=k;i.src=i.dataset.b+'.'+EX[k]}else if(i.dataset.fb){i.dataset.b=i.dataset.fb;i.dataset.fb='';i.dataset.k=0;i.src=i.dataset.b+'.'+EX[0]}else if(i.dataset.em)i.outerHTML=i.dataset.em;else i.style.visibility='hidden'};
const xi=(b,c='',fb='',em='')=>`<img class="${c}" loading="lazy" decoding="async" data-b="${b}" data-fb="${fb}" data-em="${em}" data-k="0" src="${b}.${EX[0]}" onerror="xf(this)">`;
const fmtW=s=>{s=String(s);return s.length<=6?Number(s).toLocaleString('it-IT'):s[0]+','+s.slice(1,4)+' ×10^'+(s.length-1)};
const dfl=n=>'assets/pfp/'+(hash(String(n))%C.pfpCount+1);
const av=(n,p,f,z,bot)=>`<span class="av" style="--s:${z}px">${xi(bot?(p?'assets/botpfp/'+p:dfl(n)):'assets/pfp/'+p,'pf',dfl(n))}${f?xi('assets/frames/'+f,'fr'):''}</span>`;
const dayN=()=>dn(today()),sIdx=d=>C.seasons.findIndex(s=>d>=dn(s.from)&&d<=dn(s.to));
const dayProg=()=>{const d=new Date(),s=new Date(d);s.setHours(0,0,0,0);return(d-s)/864e5};
const BC={};let BL=[];
function pick(day){const N=BOTS.length,K=Math.min(C.botCount,N),R=rng('c'+day),set=new Set();for(let j=N-K;j<N;j++){const t=R()*(j+1)|0;set.add(set.has(t)?j:t)}
 const q=[...'ppppp'+'oooooo'+'lllllllll'];while(q.length<K)q.push('m');q.length=K;shuf(q,R);
 return[...set].map((x,i)=>{const b=BOTS[x],r=rng('b'+day+':'+x),t=b[4]||q[i],tg=t=='p'?45+r()*25:t=='m'?12+r()*23:t=='l'?2+r()*10:0,s=r()*.6;return{n:b[0],f:b[1],p:b[2],w:b[3],tg,s,e:Math.min(1,s+.2+r()*(1-s))}})}
const stand=(day,p)=>{const B=BC[day]||(BC[day]=pick(day));return[...B.map(b=>({...b,st:Math.floor(b.tg*Math.max(0,Math.min(1,(p-b.s)/(b.e-b.s))))})),{me:1,n:S.p.name,f:S.p.frame,p:S.p.pfp,st:S.comp.stars}].sort((a,b)=>b.st-a.st||(b.me?1:0)-(a.me?1:0))};
function roll(){const d=dayN();if(S.comp.day===d)return;
 if(S.comp.day&&S.comp.stars>0){const rk=stand(S.comp.day,1).findIndex(x=>x.me)+1;S.pend={rank:rk,stars:S.comp.stars};if(rk==1){S.wins=(BigInt(S.wins)+1n).toString();if(sIdx(S.comp.day)>=0)S.chests.push(S.comp.day)}}
 const se=C.seasons[sIdx(d)];S.comp={day:d,stars:0,fr:se?se.frame:0};save()}
function compUI(){roll();const se=C.seasons[sIdx(dayN())];let h=se?`<p class="sub">${esc(se.name)} · cornice in palio</p><div class="cen">${av(S.p.name,S.p.pfp,se.frame,84)}</div><p id="tl"></p>`:'';
 if(S.chests.length)h+='<p class="msg">🎁 Hai una cassa da aprire!</p>';
 else if(S.pend){h+=`<p class="msg">Ultima competizione: sei arrivato ${S.pend.rank}º con ${S.pend.stars} ⭐. Riprova oggi!</p>`;S.pend=null;save()}
 if(!se)h+='<p class="msg">⏳ Una prossima competizione stagionale arriverà fra poco</p>';else h+='<ol id="cl"></ol>';
 $('#cb').innerHTML=h;compList();$('#comp').classList.remove('hidden');if(S.chests.length)showChest()}
function compList(){const e=$('#cl');if(!e)return;const L=stand(dayN(),dayProg()),l=Math.ceil((1-dayProg())*1440);BL=L;$('#tl').textContent=`Termina tra ${Math.floor(l/60)}h ${l%60}m · la tua posizione: ${L.findIndex(x=>x.me)+1}º`;
 e.innerHTML=L.map((x,i)=>`<li class="${x.me?'me':''}"><button class="plain row" data-i="${x.me?-1:i}"><span class="rk">${i+1}</span>${av(x.n,x.p,x.f,38,!x.me)}<span class="nm">${esc(x.n)}</span><b>${x.st} ⭐</b></button></li>`).join('')}
setInterval(()=>{if(!$('#comp').classList.contains('hidden'))compList()},20000);
function showChest(){$('#co').innerHTML=xi('assets/chest/closed','ch','','🎁');$('#co').dataset.o='';$('#cr').innerHTML='<p>Hai vinto! Tocca la cassa 🎁</p>';$('#chestov').classList.remove('hidden')}
$('#chestov').onclick=e=>{const o=e.target.closest('#co'),r=e.target.closest('#rw');
 if(o&&!o.dataset.o){o.dataset.o=1;const c0=S.chests[0],se0=typeof c0=='object'?{frame:c0.f}:C.seasons[sIdx(c0)],fid=se0?se0.frame:0,has=!fid||S.frames.includes(fid);sfx('win');confetti();
  o.innerHTML=xi('assets/chest/open','ch','','🎉');$('#cr').innerHTML=`<div class="card cen">${has?'':'<h3>Nuova cornice! 🖼</h3>'+av(S.p.name,S.p.pfp,fid,84)}<p>+${C.chestHints} 💡 aiuti</p><button id="rw" data-f="${fid}">Riscatta</button></div>`}
 else if(r){const fid=+r.dataset.f;S.chests.shift();if(fid&&!S.frames.includes(fid))S.frames.push(fid);S.hints+=C.chestHints;save();hud();$('#chestov').classList.add('hidden');compUI()}};
$('#cb').onclick=e=>{const b=e.target.closest('[data-i]');if(b&&+b.dataset.i>=0){const x=BL[+b.dataset.i];$('#bpv').innerHTML=av(x.n,x.p,x.f,110,1);$('#bpn').textContent=x.n;$('#bpw').textContent='🏆 Vittorie in competizione: '+fmtW(x.w||0);$('#bp').classList.remove('hidden')}};
$('#bk').onclick=compUI;
function renderPB(){$('#pb').innerHTML=av(S.p.name,S.p.pfp,S.p.frame,40)+'<span>'+esc(S.p.name)+'</span>'}
let D,fp=0,ft='mine';const PG=12;
function drawProf(){$('#pv').innerHTML=av(D.name,D.pfp,D.frame,96);
 $('#pg').innerHTML=Array.from({length:C.pfpCount},(_,i)=>`<button class="plain${D.pfp==i+1?' sel':''}" data-p="${i+1}">${xi('assets/pfp/'+(i+1))}</button>`).join('');
 const tot=ft=='mine'?S.frames.length+1:C.frameCount,pgs=Math.ceil(tot/PG);fp=Math.max(0,Math.min(fp,pgs-1));const ids=[];
 for(let k=fp*PG;k<Math.min(tot,fp*PG+PG);k++)ids.push(ft=='mine'?(k?S.frames[k-1]:0):k+1);
 $('#fg').innerHTML=ids.map(id=>{const own=!id||S.frames.includes(id);return`<button class="plain${D.frame==id?' sel':''}${own?'':' lock'}" data-f="${id}">${id?xi('assets/frames/'+id,'','','🖼'):'∅'}${own?'':'<i>🔒</i>'}</button>`}).join('');
 $('#fpg').textContent=`${fp+1}/${pgs}`;$('#ftm').className=ft=='mine'?'on':'';$('#fta').className=ft=='all'?'on':'';$('#pw').textContent='🏆 Vittorie in competizione: '+fmtW(S.wins)}
$('#pb').onclick=()=>{D={...S.p};fp=0;ft='mine';$('#pn').value=D.name;drawProf();$('#prof').classList.remove('hidden')};
$('#pn').oninput=e=>{D.name=e.target.value.slice(0,14);$('#pv').innerHTML=av(D.name,D.pfp,D.frame,96)};
$('#prof').addEventListener('click',e=>{const t=e.target.closest('[data-p],[data-f],#ftm,#fta,#fpv,#fnx');if(!t)return;sfx('click');
 if(t.dataset.p)D.pfp=+t.dataset.p;else if(t.dataset.f!==undefined){const id=+t.dataset.f;if(id&&!S.frames.includes(id))return;D.frame=id}
 else if(t.id=='ftm'){ft='mine';fp=0}else if(t.id=='fta'){ft='all';fp=0}else if(t.id=='fpv')fp--;else fp++;drawProf()});
$('#ps').onclick=()=>{S.p={name:D.name.trim()||'Giocatore',pfp:D.pfp,frame:D.frame};save();renderPB();$('#prof').classList.add('hidden')};
// ---- crediti e info ----
$('#bi').onclick=()=>{$('#ib').innerHTML=(C.credits||[]).map(s=>`<h3>${esc(s.title)}</h3>`+s.lines.map(l=>typeof l=='string'?`<p>${esc(l)}</p>`:/^https?:\/\//.test(l.url)?`<p><button class="plain lk" data-u="${esc(l.url)}">${esc(l.t)}</button></p>`:'').join('')).join('');$('#info').classList.remove('hidden')};
$('#ib').onclick=e=>{const u=e.target.closest('[data-u]');if(u)window.open(u.dataset.u,'_blank','noopener')};
// ---- avvio ----
(async()=>{await load();checkStreak();syncOpt();roll();renderPB();
 const ev=C.seasons[sIdx(dayN())];if(ev&&ev.theme)TH=ev.theme;preload();
 const ph=ev&&ev.phrases&&ev.phrases.length?ev.phrases:C.phrases;$('#phrase').textContent=ph[Math.random()*ph.length|0];
 $('#lc').outerHTML=img('cat.png','🐱','bounce').replace('class="bounce"','class="bounce" width="120"');$('#bc').outerHTML=img('cat.png','🐱').replace('<img','<img width="38"');
 const im=new Image();im.onload=()=>document.documentElement.style.backgroundImage=`url(${asset('bg.png')})`;im.onerror=()=>{const d=new Image();d.onload=()=>document.documentElement.style.backgroundImage=`url(assets/themes/default/bg.png)`;d.src='assets/themes/default/bg.png'};im.src=asset('bg.png');
 newLevel();poll();const t0=performance.now(),f=$('#fill');
 (function a(){const p=Math.min(1,(performance.now()-t0)/2500);f.style.width=p*100+'%';if(p<1)requestAnimationFrame(a);else{$('#load').classList.add('hidden');if(!S.tut)tut(0)}})()})();
})();
