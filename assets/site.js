(function(){
var R=document.documentElement,reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
function getL(){try{return localStorage.getItem('l')||'ar'}catch(e){return 'ar'}}
var listeners=[];
function setL(l){R.setAttribute('data-l',l);R.lang=l;R.dir=l==='en'?'ltr':'rtl';try{localStorage.setItem('l',l)}catch(e){}
  var t=document.querySelector('meta[name="t-'+l+'"]');if(t)document.title=t.content;listeners.forEach(function(f){f(l)})}
window.AA={onLang:function(f){listeners.push(f)},lang:function(){return R.getAttribute('data-l')}};
setL(getL());
document.querySelectorAll('.lng').forEach(function(b){b.addEventListener('click',function(){setL(AA.lang()==='en'?'ar':'en')})});

/* menu sheet on phones */
var sheet=document.querySelector('.sheet'),burger=document.querySelector('.burger');
if(sheet&&burger){burger.addEventListener('click',function(){var o=sheet.classList.toggle('open');burger.setAttribute('aria-expanded',o)})}

/* Riyadh clock */
var clk=document.querySelectorAll('[data-clock]');
function tick(){var s;try{s=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Riyadh',hour:'2-digit',minute:'2-digit'}).format(new Date())}catch(e){s=''}clk.forEach(function(c){c.textContent='Riyadh '+s})}
tick();setInterval(tick,15000);

/* curtain transitions between pages */
requestAnimationFrame(function(){requestAnimationFrame(function(){document.body.classList.add('loaded')})});
addEventListener('pageshow',function(e){if(e.persisted){document.body.classList.remove('leaving');document.body.classList.add('loaded')}});
document.addEventListener('click',function(e){var a=e.target.closest('a');if(!a||e.defaultPrevented||e.metaKey||e.ctrlKey||e.shiftKey||a.target==='_blank')return;
  var u;try{u=new URL(a.href,location.href)}catch(x){return}
  if(u.origin!==location.origin||u.pathname===location.pathname||/^(mailto|tel):/.test(a.href))return;
  e.preventDefault();document.body.classList.add('leaving');setTimeout(function(){location.href=u.href},reduce?0:650)});

/* reveal on scroll */
if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target)}})},{rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.rv').forEach(function(el){io.observe(el)})}else document.body.classList.add('noobs');

/* barcode: drawn from the page's own word, so every cover has its own */
document.querySelectorAll('.barcode').forEach(function(b){var s=b.getAttribute('data-code')||'AA',h=0;for(var i=0;i<60;i++){h=(h*31+s.charCodeAt(i%s.length)+i)%997;var w=1+(h%3),el=document.createElement('i');el.style.width=w+'px';el.style.opacity=(h%5===0)?.25:.85;b.appendChild(el)}});

/* copy email */
document.querySelectorAll('[data-copy]').forEach(function(btn){btn.addEventListener('click',function(){var v=btn.getAttribute('data-copy'),n=document.getElementById(btn.getAttribute('aria-controls'));
  function ok(){if(n)n.textContent=AA.lang()==='en'?'Email copied.':'تم نسخ البريد.'}
  try{navigator.clipboard.writeText(v).then(ok,function(){if(n)n.textContent=v})}catch(e){if(n)n.textContent=v}})});

/* share card */
document.querySelectorAll('[data-share]').forEach(function(btn){btn.addEventListener('click',function(){var u=btn.getAttribute('data-share'),n=document.getElementById(btn.getAttribute('aria-controls')),en=AA.lang()==='en';
  function say(t){if(n)n.textContent=t}
  if(navigator.share){navigator.share({title:en?'Ali Aloraini':'علي العريني',text:'Data & Strategy',url:u}).catch(function(){})}
  else{try{navigator.clipboard.writeText(u).then(function(){say(en?'Link copied.':'تم نسخ الرابط.')},function(){say(u)})}catch(e){say(u)}}})});

/* card tilts toward the pointer */
var face=document.querySelector('.face');
if(face&&!reduce&&matchMedia('(hover:hover)').matches){face.addEventListener('pointermove',function(e){var r=face.getBoundingClientRect(),px=(e.clientX-r.left)/r.width-.5,py=(e.clientY-r.top)/r.height-.5;face.style.transform='perspective(900px) rotateY('+(px*10)+'deg) rotateX('+(-py*10)+'deg)'});
  face.addEventListener('pointerleave',function(){face.style.transform=''})}

/* cover: gold points that gather into the page's word and part around the cursor */
var cv=document.querySelector('.cover canvas');
if(cv){
  var x=cv.getContext('2d'),W,H,DPR=Math.min(devicePixelRatio||1,2),P=[],N=0,mx=-999,my=-999,t0=performance.now(),host=cv.parentElement;
  function word(){return host.getAttribute(AA.lang()==='en'?'data-word-en':'data-word-ar')||''}
  function targets(){
    var o=document.createElement('canvas'),c=o.getContext('2d');o.width=Math.round(W);o.height=Math.round(H);
    var en=AA.lang()==='en',w=word(),narrow=W<820;
    var fs=Math.min(W*(en?(narrow?.19:.13):(narrow?.3:.2)),H*(narrow?.16:.3));
    c.direction=en?'ltr':'rtl';c.font=(en?'200 ':'800 ')+fs+'px '+(en?'"Inter Tight",system-ui':'Zain,Tahoma');
    c.textAlign='center';c.textBaseline='middle';c.fillStyle='#fff';
    var cx=W/2,cy=narrow?H*.3:H*.4;c.fillText(w,cx,cy,narrow?W*.92:W*.7);
    var d=c.getImageData(0,0,o.width,o.height).data,pts=[];
    for(var yy=0;yy<o.height;yy++)for(var xx=0;xx<o.width;xx++)if(d[(yy*o.width+xx)*4+3]>160)pts.push(xx,yy);
    var M=pts.length/2;
    for(var i=0;i<N;i++){var p=P[i];if(M&&i<N*.8){var k=(Math.random()*M)|0;p.tx=pts[k*2]+Math.random();p.ty=pts[k*2+1]+Math.random();p.on=1}else{p.tx=Math.random()*W;p.ty=Math.random()*H;p.on=0}}
  }
  function size(){var r=host.getBoundingClientRect();W=r.width;H=r.height;cv.width=W*DPR;cv.height=H*DPR;x.setTransform(DPR,0,0,DPR,0,0);
    var n=Math.round(Math.min(5200,Math.max(2200,W*H/230)));if(n!==N){N=n;P=[];for(var i=0;i<N;i++)P.push({x:Math.random()*W,y:Math.random()*H,vx:0,vy:0,b:.35+Math.random()*.65,ph:Math.random()*6.28,z:Math.random()})}
    targets()}
  size();
  try{Promise.all([document.fonts.load('800 100px Zain','ع'),document.fonts.load('200 100px "Inter Tight"','A')]).then(targets,function(){})}catch(e){}
  var rt;addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(size,160)});
  AA.onLang(function(){targets()});
  host.addEventListener('pointermove',function(e){var r=host.getBoundingClientRect();mx=e.clientX-r.left;my=e.clientY-r.top});
  host.addEventListener('pointerleave',function(){mx=my=-999});
  var vis=true;if('IntersectionObserver' in window)new IntersectionObserver(function(es){vis=es[0].isIntersecting}).observe(host);
  function f(now){requestAnimationFrame(f);if(!vis)return;
    var t=(now-t0)/1000,gather=reduce?1:Math.min(1,Math.max(0,(t-.4)/2.2));gather=gather<.5?4*gather*gather*gather:1-Math.pow(-2*gather+2,3)/2;
    x.globalCompositeOperation='source-over';x.fillStyle='rgba(5,5,5,.42)';x.fillRect(0,0,W,H);x.globalCompositeOperation='lighter';
    for(var i=0;i<N;i++){var p=P[i],k=.035+.03*p.z;
      var tx=p.tx+(p.on?Math.sin(t*1.3+p.ph)*.7:Math.sin(t*.2+p.ph)*30),ty=p.ty+(p.on?Math.cos(t*1.1+p.ph)*.7:Math.cos(t*.17+p.ph)*30);
      p.vx+=(tx-p.x)*k*gather;p.vy+=(ty-p.y)*k*gather;
      var dx=p.x-mx,dy=p.y-my,d2=dx*dx+dy*dy;if(d2<14400){var f2=(1-Math.sqrt(d2)/120)*2.4;var dd=Math.sqrt(d2)||1;p.vx+=dx/dd*f2;p.vy+=dy/dd*f2}
      p.vx*=.84;p.vy*=.84;p.x+=p.vx;p.y+=p.vy;
      var a=p.b*(p.on?.95:.28),s=p.on?1.5:1.1;
      x.fillStyle='rgba(234,'+(198+((p.z*32)|0))+','+(140+((p.z*40)|0))+','+a.toFixed(3)+')';x.fillRect(p.x,p.y,s,s)}}
  requestAnimationFrame(f);
}
})();
