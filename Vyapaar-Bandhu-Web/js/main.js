/* ═══ MODAL MANAGEMENT ═══ */
function openModal(id) {
  document.getElementById(id).style.display = 'flex';
  document.body.classList.add('modal-open');
}
function closeModal(id) {
  document.getElementById(id).style.display = 'none';
  document.body.classList.remove('modal-open');
  if (id === 'videoModal') {
    const v = document.getElementById('demoVideo');
    if (v) v.pause();
  }
}
// Close on backdrop click
['videoModal', 'caModal'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('click', e => { if (e.target === el) closeModal(id); });
});
// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    ['videoModal', 'caModal'].forEach(id => {
      if (document.getElementById(id).style.display === 'flex') closeModal(id);
    });
  }
});

/* ═══ CURSOR ═══ */
const cur = document.getElementById('cur');
const curR = document.getElementById('cur-r');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove', e => {
  mx=e.clientX; my=e.clientY;
  cur.style.left=mx+'px'; cur.style.top=my+'px';
});
(function animR(){
  rx+=(mx-rx)*.1; ry+=(my-ry)*.1;
  curR.style.left=rx+'px'; curR.style.top=ry+'px';
  requestAnimationFrame(animR);
})();
document.querySelectorAll('a,button,.feat-cell,.prob-card,.risk-card,.built-item').forEach(el=>{
  el.addEventListener('mouseenter',()=>document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave',()=>document.body.classList.remove('cursor-hover'));
});

/* ═══ LOADER ═══ */
window.addEventListener('load',()=>{
  setTimeout(()=>document.getElementById('loader').classList.add('out'),2500);
});

/* ═══ NAVBAR ═══ */
const nav = document.getElementById('nav');
window.addEventListener('scroll',()=>nav.classList.toggle('stuck',scrollY>50));

/* ═══ MOBILE NAV ═══ */
const mnav=document.getElementById('mnav');
document.getElementById('ham').addEventListener('click',()=>mnav.classList.add('open'));
document.getElementById('mnav-close').addEventListener('click',()=>mnav.classList.remove('open'));
mnav.querySelectorAll('.mnl').forEach(a=>a.addEventListener('click',()=>mnav.classList.remove('open')));

/* ═══ STEP TABS ═══ */
document.querySelectorAll('.step-tab').forEach(tab=>{
  tab.addEventListener('click',()=>{
    document.querySelectorAll('.step-tab').forEach(t=>t.classList.remove('active'));
    document.querySelectorAll('.step-panel').forEach(p=>p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('panel-'+tab.dataset.panel).classList.add('active');
  });
});

/* ═══ SCROLL REVEAL ═══ */
const io = new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('in'); });
},{threshold:0.1});
document.querySelectorAll('.rv,.rv-l,.rv-r').forEach(el=>io.observe(el));

/* ═══ HERO CANVAS — circuit particles ═══ */
(function(){
  const c=document.getElementById('hero-c');
  const ctx=c.getContext('2d');
  let W,H,nodes=[];
  function resize(){ W=c.width=c.offsetWidth; H=c.height=c.offsetHeight; }
  resize(); window.addEventListener('resize',resize);
  class Node{
    constructor(){this.reset();}
    reset(){
      this.x=Math.random()*W; this.y=Math.random()*H;
      this.vx=(Math.random()-.5)*.25; this.vy=(Math.random()-.5)*.25;
      this.r=Math.random()*1.8+.5; this.a=Math.random()*.5+.1;
    }
    update(){
      this.x+=this.vx; this.y+=this.vy;
      if(this.x<0||this.x>W) this.vx*=-1;
      if(this.y<0||this.y>H) this.vy*=-1;
    }
    draw(){
      ctx.beginPath(); ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(10,110,255,${this.a})`; ctx.fill();
    }
  }
  for(let i=0;i<70;i++) nodes.push(new Node());
  function frame(){
    ctx.clearRect(0,0,W,H);
    nodes.forEach(n=>{ n.update(); n.draw(); });
    for(let i=0;i<nodes.length;i++){
      for(let j=i+1;j<nodes.length;j++){
        const dx=nodes[i].x-nodes[j].x, dy=nodes[i].y-nodes[j].y;
        const d=Math.sqrt(dx*dx+dy*dy);
        if(d<120){
          ctx.beginPath();
          ctx.moveTo(nodes[i].x,nodes[i].y);
          ctx.lineTo(nodes[j].x,nodes[j].y);
          const a=.07*(1-d/120);
          ctx.strokeStyle=`rgba(10,110,255,${a})`; ctx.lineWidth=.5; ctx.stroke();
        }
      }
    }
    requestAnimationFrame(frame);
  }
  frame();
})();

/* ═══ PERF BARS — animate on scroll ═══ */
const perfIO = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.querySelectorAll('.perf-fill').forEach(b=>{
        b.style.animation='none';
        void b.offsetWidth;
        b.style.animation='grow 1.4s ease forwards';
      });
    }
  });
},{threshold:.3});
document.querySelectorAll('#tech').forEach(s=>perfIO.observe(s));