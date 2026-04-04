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

/* ═══ STEP TABS & GSAP ANIMATIONS ═══ */
let chatTimeline = null;
function playChatAnimation() {
  if (chatTimeline) chatTimeline.kill();

  const msg1 = document.querySelector('.msg-1');
  const type1 = document.querySelector('.typing-1');
  const msg2 = document.querySelector('.msg-2');
  const type2 = document.querySelector('.typing-2');
  const msg3 = document.querySelector('.msg-3');

  if (!msg1) return;

  gsap.set([msg1, type1, msg2, type2, msg3], { opacity: 0, y: 15, display: 'none' });
  gsap.set(msg1, { display: 'block' });
  
  chatTimeline = gsap.timeline({ delay: 0.4 });
  
  chatTimeline.to(msg1, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" })
    .set(type1, { display: 'flex' })
    .to(type1, { opacity: 1, y: 0, duration: 0.3 })
    .to(type1, { opacity: 0, duration: 0.2, delay: 0.8 })
    .set(type1, { display: 'none' })
    
    .set(msg2, { display: 'block' })
    .fromTo(msg2, { opacity: 0, y: 15, scale: 0.96, transformOrigin: 'left bottom' }, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "back.out(1.2)" })
    
    .set(type2, { display: 'flex' })
    .to(type2, { opacity: 1, y: 0, duration: 0.3 })
    .to(type2, { opacity: 0, duration: 0.2, delay: 1.5 })
    .set(type2, { display: 'none' })
    
    .set(msg3, { display: 'block' })
    .fromTo(msg3, { opacity: 0, y: 15, scale: 0.96, transformOrigin: 'left bottom' }, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "back.out(1.2)" });
}

let p1Timeline = null;
function playPanel1() {
  if (p1Timeline) p1Timeline.kill();
  const scanOverlay = document.querySelector('.p1-scan-overlay');
  const rows = document.querySelectorAll('.p1-data .data-row');
  const action = document.querySelector('.p1-action');

  if (!scanOverlay) return;

  gsap.set(scanOverlay, { opacity: 1 });
  gsap.set(rows, { opacity: 0, x: -10 });
  gsap.set(action, { opacity: 0, scale: 0.95 });

  p1Timeline = gsap.timeline({delay: 0.2});
  p1Timeline.to(scanOverlay, { opacity: 0, duration: 0.5, delay: 1 })
    .to(rows, { opacity: 1, x: 0, duration: 0.3, stagger: 0.15, ease: "power2.out" })
    .to(action, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.5)" });
}

let p2Timeline = null;
function playPanel2() {
  if (p2Timeline) p2Timeline.kill();
  const items = document.querySelectorAll('.p2-item');
  const sumRows = document.querySelectorAll('.p2-sum-row');
  
  if (!items.length) return;

  gsap.set(items, { opacity: 0, y: 15 });
  gsap.set(sumRows, { opacity: 0, x: -10 });

  p2Timeline = gsap.timeline({delay: 0.2});
  p2Timeline.to(items, { opacity: 1, y: 0, duration: 0.4, stagger: 0.2, ease: "back.out(1.2)" })
    .to(sumRows, { opacity: 1, x: 0, duration: 0.3, stagger: 0.1, ease: "power2.out" }, "+=0.2");
}

let p3Timeline = null;
function playPanel3() {
  if (p3Timeline) p3Timeline.kill();
  const clients = document.querySelectorAll('.p3-client');
  const btn = document.querySelector('.p3-btn');

  if (!clients.length) return;

  gsap.set(clients, { opacity: 0, x: -20 });
  gsap.set(btn, { opacity: 0, y: 10 });

  p3Timeline = gsap.timeline({delay: 0.2});
  p3Timeline.to(clients, { opacity: 1, x: 0, duration: 0.4, stagger: 0.15, ease: "power2.out" })
    .to(btn, { opacity: 1, y: 0, duration: 0.3, ease: "back.out(1.5)" }, "-=0.1");
}

let p4Timeline = null;
function playPanel4() {
  if (p4Timeline) p4Timeline.kill();
  const cards = document.querySelectorAll('.p4-card');
  const status = document.querySelector('.p4-status');

  if (!cards.length) return;

  gsap.set(cards, { opacity: 0, scale: 0.95 });
  gsap.set(status, { opacity: 0, y: 5 });

  p4Timeline = gsap.timeline({delay: 0.3});
  p4Timeline.to(cards, { opacity: 1, scale: 1, duration: 0.4, stagger: 0.2, ease: "back.out(1.2)" })
    .to(status, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }, "+=0.3");
}

document.querySelectorAll('.step-tab').forEach(tab=>{
  tab.addEventListener('click',()=>{
    document.querySelectorAll('.step-tab').forEach(t=>t.classList.remove('active'));
    document.querySelectorAll('.step-panel').forEach(p=>p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('panel-'+tab.dataset.panel).classList.add('active');
    
    if (tab.dataset.panel === "0") playChatAnimation();
    if (tab.dataset.panel === "1") playPanel1();
    if (tab.dataset.panel === "2") playPanel2();
    if (tab.dataset.panel === "3") playPanel3();
    if (tab.dataset.panel === "4") playPanel4();
  });
});

// Trigger once if visible initially
ScrollTrigger.create({
  trigger: ".step-panels",
  start: "top 80%",
  once: true,
  onEnter: () => {
    const activeTab = document.querySelector('.step-tab.active');
    if(activeTab) {
      if (activeTab.dataset.panel === "0") playChatAnimation();
      if (activeTab.dataset.panel === "1") playPanel1();
      if (activeTab.dataset.panel === "2") playPanel2();
      if (activeTab.dataset.panel === "3") playPanel3();
      if (activeTab.dataset.panel === "4") playPanel4();
    }
  }
});

/* ═══ GSAP SCROLL REVEAL ═══ */
gsap.registerPlugin(ScrollTrigger);

// Replace intersection observer with GSAP ScrollTrigger for .rv, .rv-l, .rv-r
document.querySelectorAll('.rv, .rv-l, .rv-r').forEach(el => {
  ScrollTrigger.create({
    trigger: el,
    start: "top 85%",
    toggleClass: "in",
    once: true
  });
});

// GSAP staggered animations for lists and grids
gsap.utils.toArray('.features-grid, .built-grid').forEach(grid => {
  const items = grid.children;
  gsap.from(items, {
    scrollTrigger: {
      trigger: grid,
      start: "top 85%",
      toggleActions: "play none none none"
    },
    y: 30,
    opacity: 0,
    duration: 0.6,
    stagger: 0.08,
    ease: "power2.out"
  });
});

// Micro-interactions for buttons
document.querySelectorAll('.btn-hero-main, .btn-hero-sec, .btn-cta-main, .btn-cta-sec, .prob-card').forEach(btn => {
  btn.addEventListener('mouseenter', () => {
    gsap.to(btn, { scale: 1.03, duration: 0.3, ease: "power2.out" });
  });
  btn.addEventListener('mouseleave', () => {
    gsap.to(btn, { scale: 1, duration: 0.3, ease: "power2.out" });
  });
});

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