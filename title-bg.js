"use strict";
/* title-bg.js — animated 8-bit background for #screen-title.

   Scene, back to front: dithered sky (dawn -> day on entry) with a pixel sun, drifting
   clouds, Balkan mountains, a waving hero flag on a tall pole, the village ridge
   (house, cathedral, Shipka monument, voting booth), the meadow (smoker, cow, sheep,
   sunflowers, roses, posters, stork), the campaign road with cars, then fireworks.

   - Entrance sequence: sky warms from dawn, layers rise into place one after another,
     the flag unfurls, then a tricolor firework salute.
   - Mouse parallax on desktop; click the scenery to launch a firework.
   - Frame-rate independent (real dt everywhere), ~30fps on phones, static frame for
     prefers-reduced-motion, paused while the title screen is hidden.
   Sits behind the opaque XP window; pure canvas plus the sprites in assets/sprites.
*/
(function(){
  if(typeof document==="undefined" || typeof window==="undefined") return;

  let canvas=null, screen=null, ctx=null;
  let W=0, H=0, DPR=1;
  let isMobile=false, reduced=false;
  let L=null;                       // cached layout, rebuilt on resize / window move
  let needsDraw=true;

  try{
    const mm=window.matchMedia("(max-width: 899px)");
    const mr=window.matchMedia("(prefers-reduced-motion: reduce)");
    isMobile=mm.matches; reduced=mr.matches;
    const on=(q,fn)=>{ if(q.addEventListener) q.addEventListener("change",fn); else if(q.addListener) q.addListener(fn); };
    on(mm,e=>{ isMobile=e.matches; handleResize(); initEntities(); });
    on(mr,e=>{ reduced=e.matches; needsDraw=true; });
  }catch(_){}

  function recordBgErr(e){
    try{ (window.__titleBgErrors=window.__titleBgErrors||[]).push(String((e&&e.message)||e)); }catch(_){}
  }

  // ---------------------------------------------------------------
  //  helpers
  // ---------------------------------------------------------------
  const clamp=(v,a,b)=>v<a?a:(v>b?b:v);
  const lerp=(a,b,t)=>a+(b-a)*t;
  const easeOutCubic=t=>1-Math.pow(1-t,3);
  const easeOutBack=t=>{ const c1=1.35,c3=c1+1; return 1+c3*Math.pow(t-1,3)+c1*Math.pow(t-1,2); };
  function hash(i){ let x=(i*2654435761)>>>0; x^=x>>>13; x=Math.imul(x,1274126177)>>>0; return ((x^(x>>>16))>>>0)/4294967296; }
  function mixHex(a,b,t){
    const pa=parseInt(a.slice(1),16), pb=parseInt(b.slice(1),16);
    const r=Math.round(lerp(pa>>16,pb>>16,t)), g=Math.round(lerp((pa>>8)&255,(pb>>8)&255,t)), bl=Math.round(lerp(pa&255,pb&255,t));
    return "rgb("+r+","+g+","+bl+")";
  }
  function pRect(x,y,w,h,color){
    if(!color) return;
    ctx.fillStyle=color;
    ctx.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)));
  }
  function drawGrid(grid,pal,ox,oy,sc){
    const cs=Math.max(1,Math.ceil(sc));
    for(let r=0;r<grid.length;r++){
      const row=grid[r];
      for(let c=0;c<row.length;c++){
        const col=pal[row[c]];
        if(!col) continue;
        ctx.fillStyle=col;
        ctx.fillRect(Math.round(ox+c*sc),Math.round(oy+r*sc),cs,cs);
      }
    }
  }

  // ---------------------------------------------------------------
  //  sprites (URLs come from title-sprites.js when bundled by Vite)
  // ---------------------------------------------------------------
  const SPRITE_FILES={
    smoker:"assets/sprites/smoker.png", roseRed:"assets/sprites/rose-red.png",
    rosePink:"assets/sprites/rose-pink.png", cathedral:"assets/sprites/cathedral.png",
    monument:"assets/sprites/monument.png", booth:"assets/sprites/booth.png",
    house:"assets/sprites/house.png", car:"assets/sprites/car.png", cow:"assets/sprites/cow.png"
  };
  const SPRITES={}, FOOT={};   // FOOT[key] = transparent rows under the artwork
  function loadSprites(){
    const urls=window.__TITLE_SPRITE_URLS||{};
    for(const key in SPRITE_FILES){
      try{
        const im=new Image();
        im.onload=function(){ FOOT[key]=measureFoot(im); needsDraw=true; };
        im.src=urls[key]||SPRITE_FILES[key];
        SPRITES[key]=im;
      }catch(_){}
    }
  }
  // find the empty rows at the bottom of a sprite so things stand ON the ground, not above it
  function measureFoot(im){
    try{
      const c=document.createElement("canvas");
      c.width=im.naturalWidth; c.height=im.naturalHeight;
      const x=c.getContext("2d"); x.drawImage(im,0,0);
      const d=x.getImageData(0,0,c.width,c.height).data;
      for(let y=c.height-1;y>=0;y--){
        for(let xx=0;xx<c.width;xx++) if(d[(y*c.width+xx)*4+3]>40) return c.height-1-y;
      }
    }catch(_){}
    return 0;
  }
  function sprite(key){
    const im=SPRITES[key];
    return (im&&im.complete&&im.naturalWidth>0)?im:null;
  }
  // draw a sprite with its visible feet at (cx, baseY); returns its drawn box
  function standSprite(key,cx,baseY,k,flip){
    const im=sprite(key);
    if(!im) return null;
    const w=Math.round(im.naturalWidth*k), h=Math.round(im.naturalHeight*k);
    const x=Math.round(cx-w/2), y=Math.round(baseY-h+(FOOT[key]||0)*k);
    ctx.imageSmoothingEnabled=k<1;          // downscaled art reads cleaner smoothed
    if(ctx.imageSmoothingEnabled) ctx.imageSmoothingQuality="high";
    if(flip){ ctx.save(); ctx.translate(x+w,y); ctx.scale(-1,1); ctx.drawImage(im,0,0,w,h); ctx.restore(); }
    else ctx.drawImage(im,x,y,w,h);
    ctx.imageSmoothingEnabled=false;
    return {x,y,w,h};
  }

  // ---------------------------------------------------------------
  //  palette + small grid art
  // ---------------------------------------------------------------
  const PAL={
    flagW:"#ffffff", flagG:"#00966e", flagR:"#d62612",
    pole:"#7a4a2a", poleHi:"#a06a40", gold:"#ffcc33", goldSh:"#d9a41f",
    mtnFar:"#9fb9d0", mtnFarSh:"#8aa7c2", mtnNear:"#7f9fb8", snow:"#f4f8fb", snowSh:"#d7e3ee",
    ridge:"#7fb176", ridgeDk:"#6da266", ridgeHi:"#93c389",
    grass:"#5ea763", grassDk:"#4b8f50", grassHi:"#73b977",
    road:"#3b3b42", roadSide:"#54545c", roadLine:"#e8e8e8", roadEdge:"#2c2c31",
    cloud:"#ffffff", cloudSh:"#dce7f1",
    wool:"#f7f7f2", woolSh:"#dddddd", sheepFace:"#2a2a2a",
    posterPaper:"#fffdf0", posterFrame:"#8d8d8d", skin:"#e2b48c", navy:"#35507a", red:"#c94a3a"
  };
  // sky keyframes: dawn -> day, top / middle / horizon
  const SKY_DAWN=["#1d2550","#6a4b86","#f2a07b"];
  const SKY_DAY =["#78b7e6","#b9dcf3","#f3ead2"];

  const SUNFLOWER=[
    "..YYYYY..",".YYYYYYY.",".YYBBBYY.",".YYBbBYY.",".YYBBBYY.",".YYYYYYY.","..YYYYY..",
    "....S....",".L..S..L.",".LL.S.LL.","....S....","....S...."
  ];
  const SUNFLOWER_PAL={Y:"#f2b62b",B:"#6b4a1a",b:"#4a3210",S:"#4f8a2e",L:"#4f8a2e"};
  const ROSE=["..RRR..",".RRRRR.","RRLLRRR","RRLRrRR",".RRRrr.","..rrr..","...S...",".l.S.l."];
  const ROSE_PAL={R:"#e53935",r:"#b3261e",L:"#ff8a80",S:"#4a7a2e",l:"#3f8a3f"};
  const PAPER=["WWWWWWW","WKKKKWW","WKKKKWW","WWWWWWW","WWGGRRW","WWGGRRW","WWWWWWW"];
  const PAPER_PAL={W:"#ffffff",K:"#4a4a4a",G:PAL.flagG,R:PAL.flagR};
  const CLOUDS=[
    ["...YYYY...",".YYYYYYY..","YYYYYYYYYY","..YYYYYYY.","...YYYY..."],
    ["..YYYYY....",".YYYYYYYY..","YYYYYYYYYYY",".YYYYYYYY..","..YYYYYYY.."],
    ["..YYYYYYYY.",".YYYYYYYYYY","YYYYYYYYYYY",".YYYYYYYY..","...YYYYY..."]
  ];

  // ---------------------------------------------------------------
  //  layout (cached; reading the DOM every frame forced a layout per frame)
  // ---------------------------------------------------------------
  function computeLayout(){
    if(!W||!H) return null;
    let overlayBottom=H*0.40;
    try{
      // offsetTop/offsetHeight ignore the entrance transform, so the layout doesn't jump
      const titleEl=document.querySelector(".title-wrap");
      if(titleEl&&titleEl.offsetHeight>0){
        const rel=titleEl.offsetTop+titleEl.offsetHeight;
        if(rel>H*0.2&&rel<H*0.75) overlayBottom=rel;
      }
    }catch(_){}
    const hillsTop=Math.max(H*0.40,Math.min(H*0.62,overlayBottom+6));
    const meadowTop=Math.round(H*0.765);
    const roadH=Math.max(34,Math.round(H*0.052));
    const roadTop=H-roadH;
    const ridgeBase=Math.round(hillsTop+58);     // the village stands on this line
    let win=null;
    try{
      const tw=document.querySelector(".title-wrap");
      if(tw&&tw.offsetWidth>0) win={l:tw.offsetLeft-8,r:tw.offsetLeft+tw.offsetWidth+8,b:tw.offsetTop+tw.offsetHeight};
    }catch(_){}
    return {hillsTop,meadowTop,roadH,roadTop,ridgeBase,win,M:48}; // M = parallax bleed margin
  }

  function handleResize(){
    let rw=W||800, rh=H||600;
    try{
      const r=screen.getBoundingClientRect();
      if(r.width>0) rw=r.width;
      if(r.height>0) rh=r.height;
      if(rw<100) rw=window.innerWidth||800;
      if(rh<100) rh=window.innerHeight||600;
    }catch(_){}
    const nW=Math.max(1,Math.round(rw)), nH=Math.max(1,Math.round(rh));
    const nD=Math.min(2,window.devicePixelRatio||1);
    const sizeChanged=nW!==W||nH!==H;
    W=nW; H=nH; DPR=nD;
    try{
      canvas.width=Math.round(W*DPR); canvas.height=Math.round(H*DPR);
      canvas.style.width=W+"px"; canvas.style.height=H+"px";
      ctx.setTransform(DPR,0,0,DPR,0,0);
      ctx.imageSmoothingEnabled=false;
    }catch(_){}
    L=computeLayout();
    if(sizeChanged&&entitiesReady) initEntities();
    needsDraw=true;
  }

  // ---------------------------------------------------------------
  //  state: time, intro, parallax
  // ---------------------------------------------------------------
  let T=0;                 // seconds since the title screen was (re)shown
  let introDur=2.2;        // first visit plays the full entrance; returns get a quick one
  const mouse={x:0,y:0,tx:0,ty:0};
  // per-layer entrance: delay (s), parallax strength
  const LAYERS={ mountains:{d:0.15,p:0.12}, flag:{d:0.35,p:0.2}, ridge:{d:0.35,p:0.3}, meadow:{d:0.55,p:0.55}, road:{d:0.7,p:0.8} };
  function introK(layer){ return reduced?1:clamp((T*(2.2/introDur)-layer.d)/0.9,0,1); }
  function layerOffset(layer){
    const k=introK(layer);
    const rise=(1-easeOutBack(k))*H*0.55;
    return {x:Math.round(-mouse.x*26*layer.p), y:Math.round(-mouse.y*10*layer.p+rise)};
  }
  function dayK(){ return reduced?1:easeOutCubic(clamp(T*(2.2/introDur)/1.6,0,1)); }

  // ---------------------------------------------------------------
  //  sky, sun, stars
  // ---------------------------------------------------------------
  function drawSky(){
    const k=dayK(), top=L.ridgeBase;
    const c0=mixHex(SKY_DAWN[0],SKY_DAY[0],k), c1=mixHex(SKY_DAWN[1],SKY_DAY[1],k), c2=mixHex(SKY_DAWN[2],SKY_DAY[2],k);
    // banded 8-bit gradient: 12 hard bands with a checker dither between neighbours
    const bands=12, bh=Math.ceil(top/bands);
    for(let i=0;i<bands;i++){
      const t=i/(bands-1);
      const col=t<0.55?mixRGB(c0,c1,t/0.55):mixRGB(c1,c2,(t-0.55)/0.45);
      ctx.fillStyle=col; ctx.fillRect(0,i*bh,W,bh+1);
      if(i>0&&!isMobile){
        ctx.fillStyle=prevBand;
        for(let x=(i%2)*2;x<W;x+=4) ctx.fillRect(x,i*bh,2,2);
      }
      prevBand=col;
    }
    ctx.fillStyle=prevBand; ctx.fillRect(0,bands*bh,W,H-bands*bh);
    // stars fade out as day breaks
    const starA=1-k;
    if(starA>0.02){
      ctx.fillStyle="rgba(255,255,255,"+starA.toFixed(3)+")";
      for(let i=0;i<70;i++){
        const x=hash(i)*W, y=hash(i+500)*top*0.7;
        const tw=(Math.sin(T*3+i)>0.6)?2:1;
        ctx.fillRect(Math.round(x),Math.round(y),tw,tw);
      }
    }
  }
  let prevBand="#000";
  function mixRGB(a,b,t){
    const pa=a.match(/\d+/g).map(Number), pb=b.match(/\d+/g).map(Number);
    return "rgb("+Math.round(lerp(pa[0],pb[0],t))+","+Math.round(lerp(pa[1],pb[1],t))+","+Math.round(lerp(pa[2],pb[2],t))+")";
  }

  function drawSun(){
    const k=dayK();
    const r=isMobile?14:22;
    const cx=Math.round(isMobile?W*0.82:W*0.43);
    const restY=isMobile?H*0.09:H*0.16;
    const cy=Math.round(lerp(L.ridgeBase+r,restY,k) - mouse.y*3);
    const px=isMobile?2:3;
    // halo
    ctx.fillStyle="rgba(255,236,170,"+(0.18*k+0.08).toFixed(3)+")";
    pixelDisc(cx,cy,r+px*4,px);
    // rotating pixel rays
    const rot=reduced?0:T*0.35;
    ctx.fillStyle="#ffd65a";
    for(let i=0;i<12;i++){
      const a=rot+i*Math.PI/6, len=(i%2?2:3);
      for(let s=0;s<len;s++){
        const d=r+px*(2+s*1.6);
        ctx.fillRect(Math.round((cx+Math.cos(a)*d)/px)*px,Math.round((cy+Math.sin(a)*d)/px)*px,px,px);
      }
    }
    ctx.fillStyle=mixHex("#ff8a3d","#ffd23f",k); pixelDisc(cx,cy,r,px);
    ctx.fillStyle=mixHex("#ffb05a","#fff1a6",k); pixelDisc(cx-r*0.25,cy-r*0.25,r*0.45,px);
  }
  function pixelDisc(cx,cy,r,px){
    for(let y=-r;y<=r;y+=px){
      const half=Math.floor(Math.sqrt(Math.max(0,r*r-y*y))/px)*px;
      ctx.fillRect(Math.round((cx-half)/px)*px,Math.round((cy+y)/px)*px,half*2,px);
    }
  }

  function drawCloud(ox,oy,sc,variant){
    const g=CLOUDS[variant%CLOUDS.length], cs=Math.ceil(sc);
    for(let pass=0;pass<2;pass++){
      ctx.fillStyle=pass?PAL.cloud:PAL.cloudSh;
      for(let r=0;r<g.length;r++) for(let c=0;c<g[r].length;c++){
        if(g[r][c]==="Y") ctx.fillRect(Math.round(ox+c*sc),Math.round(oy+(r+(pass?0:1))*sc),cs,cs);
      }
    }
  }
  function drawBird(ox,oy,sc,frame){
    ctx.fillStyle="#3c3c46";
    if(frame%2===0){ ctx.fillRect(ox+sc,oy+sc,2*sc,sc); ctx.fillRect(ox+4*sc,oy+sc,2*sc,sc); ctx.fillRect(ox+3*sc,oy+2*sc,sc,sc); }
    else{ ctx.fillRect(ox,oy+2*sc,2*sc,sc); ctx.fillRect(ox+5*sc,oy+2*sc,2*sc,sc); ctx.fillRect(ox+2*sc,oy+2*sc,3*sc,sc); }
  }

  // ---------------------------------------------------------------
  //  mountains (stepped pixel silhouette with snowcaps)
  // ---------------------------------------------------------------
  const PEAKS_FAR=[[0.04,0.55],[0.16,0.9],[0.27,0.6],[0.38,1],[0.52,0.7],[0.63,0.95],[0.76,0.62],[0.88,0.85],[0.98,0.5]];
  const PEAKS_NEAR=[[0.0,0.5],[0.1,0.7],[0.22,0.45],[0.33,0.8],[0.47,0.5],[0.58,0.75],[0.7,0.45],[0.83,0.72],[0.95,0.55],[1.06,0.65]];
  function mtnHeight(peaks,x,width){
    let h=0;
    for(const p of peaks){
      const d=Math.abs(x-p[0]*W)/width;
      h=Math.max(h,p[1]*(1-d));
    }
    return h;
  }
  function drawMountains(off){
    const base=L.ridgeBase+10, step=isMobile?4:6;
    const farH=(L.ridgeBase-L.hillsTop)+(isMobile?60:120), nearH=farH*0.6;
    ctx.save(); ctx.translate(off.x,off.y);
    for(let pass=0;pass<2;pass++){
      const peaks=pass?PEAKS_NEAR:PEAKS_FAR, mh=pass?nearH:farH, spread=W*(pass?0.16:0.13);
      for(let x=-L.M;x<W+L.M;x+=step){
        const h=Math.round(mtnHeight(peaks,x,spread)*mh/step)*step;
        if(h<=0) continue;
        const top=base-h;
        ctx.fillStyle=pass?PAL.mtnNear:((Math.floor(x/step)%2)?PAL.mtnFar:PAL.mtnFarSh);
        ctx.fillRect(x,top,step,H);
        if(!pass&&h>mh*0.62){                           // snowcaps on the tall far peaks
          const cap=Math.round((h-mh*0.62)*0.7/step)*step+step;
          ctx.fillStyle=(Math.floor(x/step)%3===0)?PAL.snowSh:PAL.snow;
          ctx.fillRect(x,top,step,cap);
        }
      }
    }
    ctx.restore();
  }

  // ---------------------------------------------------------------
  //  hero flag: waving, shaded per column, unfurls during the intro
  // ---------------------------------------------------------------
  function flagMetrics(){
    let sc=isMobile?Math.max(5,Math.min(8,Math.round(W*0.022))):Math.max(10,Math.min(16,Math.round(W*0.0095)));
    const x=isMobile?Math.round(W*0.06)+sc*2:Math.round(W*0.035)+sc*2;
    // shrink the flag to fit beside the title window when there's reasonable room
    if(!isMobile&&L&&L.win&&L.win.l>x){
      const fit=Math.floor((L.win.l-x-12)/30);
      if(fit>=6&&fit<sc) sc=fit;
    }
    const y=Math.round(isMobile?H*0.05:H*0.07);
    return {sc,x,y,FW:30,FH:18};
  }
  function drawFlag(off){
    const m=flagMetrics(), sc=m.sc, k=introK(LAYERS.flag);
    const ox=m.x+off.x, oy=m.y+Math.round(off.y*0.35)-Math.round(mouse.y*2);
    // pole planted on the ridge
    const poleBottom=L.ridgeBase+off.y*0.6+30;
    pRect(ox-2*sc,oy-sc,sc,poleBottom-(oy-sc),PAL.pole);
    pRect(ox-2*sc,oy-sc,Math.max(1,Math.round(sc*0.35)),poleBottom-(oy-sc),PAL.poleHi);
    pRect(ox-2.5*sc,oy-2.6*sc,2*sc,2*sc,PAL.gold);
    pRect(ox-2.5*sc+sc*1.2,oy-2.6*sc,sc*0.8,2*sc,PAL.goldSh);
    // cloth
    const cols=Math.round(m.FW*easeOutCubic(k));
    const amp=reduced?0:1.6, wind=T*3.2;
    for(let c=0;c<cols;c++){
      const reach=c/m.FW;                                 // the free end waves more
      const ph=wind-c*0.42;
      const dy=Math.round(Math.sin(ph)*amp*reach*1.6)*Math.round(sc*0.5);
      const shade=Math.cos(ph)*reach;                     // light catching the folds
      const x=ox+c*sc, band=m.FH/3;
      const colors=[PAL.flagW,PAL.flagG,PAL.flagR];
      for(let b=0;b<3;b++){
        ctx.fillStyle=colors[b];
        ctx.fillRect(x,oy+dy+b*band*sc,sc,band*sc);
      }
      if(shade<-0.3){ ctx.fillStyle="rgba(0,0,0,"+(Math.min(0.13,-shade*0.15)).toFixed(3)+")"; ctx.fillRect(x,oy+dy,sc,m.FH*sc); }
      else if(shade>0.45){ ctx.fillStyle="rgba(255,255,255,"+(Math.min(0.1,shade*0.12)).toFixed(3)+")"; ctx.fillRect(x,oy+dy,sc,m.FH*sc); }
    }
  }

  // ---------------------------------------------------------------
  //  ridge + village
  // ---------------------------------------------------------------
  function ridgeTop(x){
    // stepped rolling hill line, always above ridgeBase so buildings sit IN the grass
    const v=Math.sin(x*0.0105)*10+Math.sin(x*0.027+1.3)*6+Math.sin(x*0.0041+2.1)*8;
    return L.ridgeBase-20-Math.round(v/4)*4;
  }
  function drawRidge(off){
    ctx.save(); ctx.translate(off.x,off.y);
    const step=4;
    for(let x=-L.M;x<W+L.M;x+=step){
      const top=ridgeTop(x);
      ctx.fillStyle=PAL.ridge; ctx.fillRect(x,top,step,L.meadowTop-top+60);
      ctx.fillStyle=PAL.ridgeHi; ctx.fillRect(x,top,step,2);
    }
    ctx.fillStyle=PAL.ridgeDk;
    for(let i=0;i<(isMobile?60:140);i++){
      const x=hash(i+90)*(W+L.M*2)-L.M, y=L.ridgeBase-6+hash(i+300)*(L.meadowTop-L.ridgeBase);
      ctx.fillRect(Math.round(x),Math.round(y),i%2?3:2,2);
    }
    drawFields();
    // village: tall landmarks go where the title window isn't; anything that would end up
    // hidden behind the window is scaled down to fit underneath it instead
    const spots=isMobile
      ? [["house",0.14,0.30],["cathedral",0.48,0.24],["booth",0.82,0.30]]
      : [["house",0.07,0.46],["monument",0.25,0.62],["cathedral",0.42,0.40],["booth",0.62,0.32],["house",0.80,0.30,1],["monument",0.94,0.3]];
    for(const sp of spots){
      let k=sp[2];
      const im=sprite(sp[0]);
      if(im&&L.win){
        const w=im.naturalWidth*k, x0=W*sp[1]-w/2;
        if(x0<L.win.r&&x0+w>L.win.l){
          const room=L.ridgeBase+4-L.win.b-2;
          k=Math.min(k,Math.max(0,room)/((im.naturalHeight-(FOOT[sp[0]]||0))||1));
        }
      }
      if(k>=0.12) standSprite(sp[0],W*sp[1],L.ridgeBase+4,k,!!sp[3]);
    }
    ctx.restore();
  }

  // patchwork of fields between the village and the meadow: wheat, lavender, rose rows
  const FIELD_TYPES=[
    {base:"#e1c35e",row:"#c9a948"},          // wheat
    {base:"#9b83c9",row:"#7d66ad"},          // lavender
    {base:"#79ad62",row:"#5f944e",dot:"#ff8fb0"}, // rose valley
    {base:"#8fbf6a",row:"#77a858"},          // young crops
    {base:"#c9a36a",row:"#a8834f"}           // ploughed
  ];
  function drawFields(){
    const top=L.ridgeBase+16, bot=L.meadowTop-6;
    if(bot-top<30) return;
    const split=top+(bot-top)*0.42;           // far row shallower than the near one
    for(let r=0;r<2;r++){
      const y0=Math.round(r?split:top), y1=Math.round(r?bot:split)-4;
      let x=-L.M+Math.round(hash(r*31)*80)-80, i=0;
      while(x<W+L.M){
        const w=Math.round(140+hash(r*97+i)*220);
        const f=FIELD_TYPES[Math.floor(hash(r*13+i*7)*FIELD_TYPES.length)];
        ctx.fillStyle=f.base; ctx.fillRect(x,y0,w-6,y1-y0);
        ctx.fillStyle=f.row;
        const gap=4+r*2;
        for(let yy=y0+2;yy<y1-1;yy+=gap) ctx.fillRect(x,yy,w-6,2);
        if(f.dot){ ctx.fillStyle=f.dot; for(let yy=y0+1;yy<y1-1;yy+=gap) for(let xx=x+((yy/gap)%2?3:8);xx<x+w-8;xx+=10) ctx.fillRect(xx,yy,2,2); }
        ctx.fillStyle=PAL.ridgeDk; ctx.fillRect(x+w-6,y0-2,6,y1-y0+4);  // hedgerow
        x+=w; i++;
      }
      ctx.fillStyle=PAL.ridgeDk; ctx.fillRect(-L.M,y1,W+L.M*2,4);
    }
  }

  // ---------------------------------------------------------------
  //  meadow: depth-sorted props so nothing pokes through what's in front of it
  // ---------------------------------------------------------------
  let meadowProps=[];
  function buildMeadowProps(){
    meadowProps=[];
    if(!L) return;
    const grassY=L.meadowTop-2, top=L.meadowTop+12, bottom=L.roadTop-26;
    if(!isMobile){
      meadowProps.push({y:grassY,     kind:"smoker", x:W*0.15});
      meadowProps.push({y:grassY-1,   kind:"posters",x:W*0.40});
      meadowProps.push({y:grassY+1,   kind:"cow",    x:W*0.57});
      meadowProps.push({y:grassY+2,   kind:"sheep",  x:W*0.73});
      meadowProps.push({y:L.meadowTop+8,kind:"stork",x:W*0.955});
    }
    // sunflower fence along the meadow edge
    const sfn=isMobile?6:13;
    for(let i=0;i<sfn;i++){
      const x=W*(0.03+0.94*i/(sfn-1))+(hash(i+40)-0.5)*20;
      if(!isMobile&&(Math.abs(x-W*0.15)<70||Math.abs(x-W*0.57)<90)) continue;
      meadowProps.push({y:L.meadowTop+4+hash(i)*4,kind:"sunflower",x,i});
    }
    // roses scattered down the field
    const rn=isMobile?14:30;
    for(let i=0;i<rn;i++){
      const x=W*0.02+hash(i+7)*W*0.96, y=top+hash(i+71)*(bottom-top);
      if(!isMobile&&y<top+40&&(Math.abs(x-W*0.15)<60||Math.abs(x-W*0.57)<80)) continue;
      const depth=(y-top)/Math.max(1,bottom-top);
      meadowProps.push({y,kind:"rose",x,i,k:(0.2+depth*0.26)*(isMobile?0.7:1),pink:i%6===4});
    }
    meadowProps.sort((a,b)=>a.y-b.y);
  }
  function drawMeadow(off){
    ctx.save(); ctx.translate(off.x,off.y);
    const y0=L.meadowTop;
    pRect(-L.M,y0,W+L.M*2,H-y0+60,PAL.grass);
    pRect(-L.M,y0,W+L.M*2,3,PAL.grassHi);
    ctx.fillStyle=PAL.grassDk;
    for(let i=0;i<(isMobile?90:220);i++){
      const x=hash(i+1000)*(W+L.M*2)-L.M, y=y0+6+hash(i+2000)*(L.roadTop-y0-6);
      ctx.fillRect(Math.round(x),Math.round(y),i%3?4:2,3);
    }
    for(const p of meadowProps) drawProp(p);
    ctx.restore();
  }
  let smokerBox=null;
  function drawProp(p){
    switch(p.kind){
      case "smoker":{
        const bob=reduced?0:Math.round(Math.sin(T*1.6)*1.2);
        const box=standSprite("smoker",p.x,p.y+bob,0.5);
        if(box){
          smokerBox=box;
          const sx=box.x+box.w*0.615, sy=box.y+box.h*0.075;
          updateSmokeSource(sx,sy);
          const flick=Math.floor(T*12)%4;
          pRect(sx-1,sy,3,3,flick===0?"#ff3b30":(flick===2?"#ff6b35":"#ff9a5a"));
          drawSmoke();
        }
        break;
      }
      case "cow":{
        const graze=reduced?0:Math.round(Math.sin(T*0.9)*2);
        standSprite("cow",p.x+graze,p.y,0.46);
        break;
      }
      case "posters": drawPosterWall(p.x,p.y,3); break;
      case "sheep": drawSheep(p.x,p.y,3.4); break;
      case "stork": drawStorkPole(p.x,p.y,2.6); break;
      case "sunflower":{
        const sc=isMobile?2:2.8, sway=reduced?0:Math.round(Math.sin(T*1.7+p.i*1.3)*sc*0.6);
        drawGrid(SUNFLOWER,SUNFLOWER_PAL,p.x-4.5*sc+sway,p.y-12*sc,sc);
        break;
      }
      case "rose":{
        const sway=reduced?0:Math.sin(T*1.4+p.i*1.7)*p.k*8;
        if(!standSprite(p.pink?"rosePink":"roseRed",p.x+sway,p.y,p.k)) drawGrid(ROSE,ROSE_PAL,p.x-7,p.y-21,2.6);
        break;
      }
    }
  }
  function drawPosterWall(cx,baseY,sc){
    const w=22*sc,h=14*sc,ox=cx-w/2,oy=baseY-h;
    pRect(ox,oy,w,h,"#b7bec4"); pRect(ox,oy,w,sc,"#dae1e7"); pRect(ox,oy+h-sc,w,sc,"#8f979e");
    for(let i=0;i<3;i++){
      const px=ox+2*sc+i*7*sc, peel=(!reduced&&i===2)?Math.round((Math.sin(T*2.4)+1)*0.5*sc):0;
      pRect(px,oy+2*sc,5*sc,9*sc,PAL.posterPaper); pRect(px,oy+2*sc,5*sc,sc,PAL.posterFrame);
      pRect(px+sc,oy+3*sc,3*sc,3*sc,PAL.skin); pRect(px+sc,oy+6*sc,3*sc,2*sc,i===1?PAL.navy:PAL.red);
      pRect(px+sc,oy+9*sc,sc,sc,PAL.flagW); pRect(px+2*sc,oy+9*sc,sc,sc,PAL.flagG); pRect(px+3*sc,oy+9*sc,sc,sc,PAL.flagR);
      if(peel) pRect(px+4*sc,oy+2*sc,sc,peel+sc,"#e8e2c8");
    }
  }
  function drawSheep(ox,baseY,sc){
    const oy=baseY-8*sc;
    for(let i=0;i<3;i++){
      const sx=ox+i*9*sc+(i===1?sc*2:0);
      const graze=reduced?false:Math.floor(T*0.6+i*0.7)%3===0;
      pRect(sx+sc,oy+3*sc,5*sc,3*sc,PAL.wool); pRect(sx,oy+4*sc,7*sc,2*sc,PAL.wool); pRect(sx+2*sc,oy+2*sc,3*sc,sc,PAL.wool);
      pRect(sx+sc,oy+4*sc,2*sc,sc,PAL.woolSh); pRect(sx+4*sc,oy+5*sc,2*sc,sc,PAL.woolSh);
      pRect(sx+sc,oy+6*sc,sc,2*sc,PAL.sheepFace); pRect(sx+5*sc,oy+6*sc,sc,2*sc,PAL.sheepFace);
      if(graze){ pRect(sx+6*sc,oy+5*sc,2*sc,2*sc,PAL.sheepFace); pRect(sx+7*sc,oy+6*sc,sc,sc,PAL.sheepFace); }
      else{ pRect(sx+6*sc,oy+2*sc,2*sc,2*sc,PAL.sheepFace); pRect(sx+8*sc,oy+2*sc,sc,sc,PAL.sheepFace); }
    }
  }
  function drawStorkPole(ox,oy,sc){
    pRect(ox,oy-24*sc,2*sc,24*sc,"#7a5e42"); pRect(ox-3*sc,oy-24*sc,8*sc,sc,"#7a5e42");
    pRect(ox-2*sc,oy-25*sc,6*sc,2*sc,"#9a7b52"); pRect(ox-2*sc,oy-25*sc,6*sc,sc,"#7a5e3c");
    pRect(ox+4*sc,oy-28*sc,2*sc,2*sc,"#ffffff"); pRect(ox+6*sc,oy-29*sc,sc,sc,"#ffffff");
    pRect(ox+7*sc,oy-29*sc,2*sc,sc,"#e04a2a"); pRect(ox+4*sc,oy-26*sc,sc,2*sc,"#232323");
    const flap=reduced?3:Math.floor(T*2)%6;
    pRect(ox-sc,oy-26*sc,2*sc,sc,"#ffffff");
    if(flap<2) pRect(ox,oy-(flap===0?28:27)*sc,2*sc,sc,"#232323");
  }

  // ---------------------------------------------------------------
  //  smoke (now uses the real frame delta, so it no longer slows down on phones)
  // ---------------------------------------------------------------
  const puffs=[];
  let puffClock=0, smokeSrc=null;
  function updateSmokeSource(x,y){ smokeSrc={x,y}; }
  function updateSmoke(s){
    if(!smokeSrc) return;
    const cyc=(T*0.45)%3, big=cyc>=0.5&&cyc<1.8;
    puffClock+=s;
    if(puffClock>=(big?0.17:0.38)){
      puffClock=0;
      puffs.push({x:smokeSrc.x+(Math.random()-0.5)*6,y:smokeSrc.y-4,vx:6+Math.random()*10,vy:-(20+Math.random()*8),age:0,life:big?2.5:1.9,size:big?4.4:3.2,sway:Math.random()*6.28});
      if(puffs.length>40) puffs.shift();
    }
    for(let i=puffs.length-1;i>=0;i--){
      const p=puffs[i];
      p.age+=s;
      if(p.age>=p.life){ puffs.splice(i,1); continue; }
      const a=p.age/p.life;
      p.y+=p.vy*s*(0.6+a);
      p.x+=p.vx*s+Math.sin(T*3.5+p.sway)*6*s;
    }
  }
  function drawSmoke(){
    for(const p of puffs){
      const a=p.age/p.life, sz=Math.max(2,Math.round(p.size*(1+a*1.6)));
      ctx.globalAlpha=0.36*(a<0.15?a/0.15:1-a);
      ctx.fillStyle="#fafafa"; ctx.fillRect(Math.round(p.x-sz),Math.round(p.y-sz*0.5),sz*2,Math.round(sz*1.5));
      ctx.fillStyle="#cbd6e0"; ctx.fillRect(Math.round(p.x-sz*0.6),Math.round(p.y),Math.round(sz*1.2),Math.round(sz*0.7));
    }
    ctx.globalAlpha=1;
  }

  // ---------------------------------------------------------------
  //  road + cars + roadside flags
  // ---------------------------------------------------------------
  function drawRoad(off){
    ctx.save(); ctx.translate(off.x,off.y);
    const y=L.roadTop, x0=-L.M, w=W+L.M*2;
    pRect(x0,y-6,w,2,PAL.flagW); pRect(x0,y-4,w,2,PAL.flagG); pRect(x0,y-2,w,2,PAL.flagR);
    pRect(x0,y,w,L.roadH+60,PAL.road); pRect(x0,y,w,2,PAL.roadSide); pRect(x0,y+L.roadH-2,w,2,PAL.roadEdge);
    const ym=y+Math.floor(L.roadH/2)-1, dash=reduced?0:(T*40)%26;
    for(let x=x0-26+dash;x<W+L.M;x+=26) pRect(x,ym,13,2,PAL.roadLine);
    // roadside mini flags
    const sc=isMobile?1.8:2.4;
    let i=0;
    for(let x=W*0.04;x<W*0.96;x+=W*0.085,i++){
      const h=Math.round(sc*11), wv=reduced?0:Math.round(Math.sin(T*2.5+i*1.7)*sc*0.7);
      pRect(x,y-1-h,Math.max(2,Math.round(sc*0.8)),h,PAL.pole);
      pRect(x,y-1-6*sc+wv,Math.round(sc*5),2*sc,PAL.flagW);
      pRect(x,y-1-4*sc+wv,Math.round(sc*5),2*sc,PAL.flagG);
      pRect(x,y-1-2*sc+wv,Math.round(sc*5),2*sc,PAL.flagR);
    }
    // cars (sprite faces left; mirrored when driving right)
    for(const v of cars) standSprite("car",v.x,y+L.roadH-4,isMobile?0.2:0.3,v.dir===1);
    ctx.restore();
  }

  // ---------------------------------------------------------------
  //  fireworks
  // ---------------------------------------------------------------
  const rockets=[], sparks=[];
  let nextShow=0, salutePending=true;
  const FW_COLS=["#ffffff","#00b386","#ff3b22","#ffd23f"];
  function launch(x,targetY,colorIdx){
    if(reduced) return;
    if(rockets.length>6) return;
    rockets.push({x,y:L?L.roadTop:H,vx:(Math.random()-0.5)*20,vy:-Math.sqrt(2*260*Math.max(40,(L?L.roadTop:H)-targetY)),ty:targetY,c:colorIdx==null?(Math.random()*3|0):colorIdx,trail:[]});
  }
  function burst(x,y,c){
    const n=isMobile?22:34, ring=Math.random()<0.4;
    for(let i=0;i<n;i++){
      const a=i/n*Math.PI*2+Math.random()*0.2, sp=ring?120:40+Math.random()*110;
      sparks.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,age:0,life:1+Math.random()*0.6,c:(i%4===0)?3:((c+(i%2?0:1))%3)});
    }
    if(sparks.length>400) sparks.splice(0,sparks.length-400);
  }
  function updateFireworks(s){
    if(reduced||!L) return;
    // salute right after the entrance, then an occasional volley
    if(salutePending&&T>introDur*0.8){
      salutePending=false;
      const xs=isMobile?[0.25,0.75]:[0.18,0.42,0.66];
      xs.forEach((fx,i)=>setTimeoutSafe(()=>launch(W*fx,H*(isMobile?0.12:0.16)+i*14,i%3),i*240));
      nextShow=T+4+Math.random()*3;
    }else if(!salutePending&&T>nextShow){
      launch(W*(0.1+Math.random()*0.8),H*(0.08+Math.random()*0.18));
      nextShow=T+3.5+Math.random()*4.5;
    }
    for(let i=rockets.length-1;i>=0;i--){
      const r=rockets[i];
      r.trail.push([r.x,r.y]); if(r.trail.length>6) r.trail.shift();
      r.vy+=260*s; r.x+=r.vx*s; r.y+=r.vy*s;
      if(r.vy>=-20||r.y<=r.ty){ burst(r.x,r.y,r.c); rockets.splice(i,1); }
    }
    for(let i=sparks.length-1;i>=0;i--){
      const p=sparks[i];
      p.age+=s;
      if(p.age>=p.life){ sparks.splice(i,1); continue; }
      p.vx*=Math.pow(0.25,s); p.vy=p.vy*Math.pow(0.25,s)+90*s;
      p.x+=p.vx*s; p.y+=p.vy*s;
    }
  }
  function drawFireworks(){
    const px=isMobile?2:3;
    for(const r of rockets){
      r.trail.forEach((t,i)=>{ ctx.globalAlpha=(i+1)/r.trail.length*0.8; pRect(t[0],t[1],px-1,px,"#ffe9a8"); });
      ctx.globalAlpha=1; pRect(r.x-1,r.y-1,px,px,"#ffffff");
    }
    for(const p of sparks){
      const a=1-p.age/p.life;
      if(a<0.35&&(Math.floor(p.age*20)%2)) continue;   // twinkle before fading out
      ctx.globalAlpha=Math.min(1,a*1.4);
      pRect(Math.round(p.x/px)*px,Math.round(p.y/px)*px,px,px,FW_COLS[p.c]);
    }
    ctx.globalAlpha=1;
  }
  const timers=[];
  function setTimeoutSafe(fn,ms){ timers.push({at:T+ms/1000,fn}); }
  function runTimers(){ for(let i=timers.length-1;i>=0;i--) if(T>=timers[i].at){ const t=timers.splice(i,1)[0]; try{t.fn();}catch(e){recordBgErr(e);} } }

  // ---------------------------------------------------------------
  //  moving entities
  // ---------------------------------------------------------------
  let clouds=[], birds=[], papers=[], cars=[], entitiesReady=false;
  function initEntities(){
    if(!W||!H) return;
    clouds=[];
    for(let i=0;i<(isMobile?3:5);i++) clouds.push({x:Math.random()*W*1.1-0.1*W,y:H*0.04+Math.random()*H*0.2,speed:8+Math.random()*12,variant:i%3,sc:isMobile?2.2:3.4,p:0.05+0.05*(i%3)});
    birds=[];
    const fx=Math.random()*W*0.5, fy=H*0.1+Math.random()*H*0.1;
    for(let i=0;i<(isMobile?3:5);i++){ const row=Math.ceil(i/2), side=i%2?1:-1; birds.push({x:fx-row*16,y:fy+side*row*9,speed:34,offset:i*0.37}); }
    papers=[];
    for(let i=0;i<(isMobile?3:6);i++) papers.push({x:Math.random()*W,y:Math.random()*H*0.35,vy:9+Math.random()*12,vx:(Math.random()-0.5)*10,sway:Math.random()*6.28,ss:0.8+Math.random()*1.2});
    cars=[{x:-80,speed:46+Math.random()*16,dir:1}];
    if(!isMobile) cars.push({x:W+120,speed:34,dir:-1});
    L=computeLayout();
    buildMeadowProps();
    entitiesReady=true;
  }
  function update(s){
    mouse.x=lerp(mouse.x,mouse.tx,1-Math.pow(0.02,s));
    mouse.y=lerp(mouse.y,mouse.ty,1-Math.pow(0.02,s));
    for(const c of clouds){ c.x+=c.speed*s; if(c.x>W+120){ c.x=-140-Math.random()*60; c.y=H*0.04+Math.random()*H*0.2; } }
    for(const b of birds){ b.x+=b.speed*s; b.offset+=s*5; }
    if(birds.length&&birds.every(b=>b.x>W+40)){ const fy=H*0.08+Math.random()*H*0.12; birds.forEach((b,i)=>{ const row=Math.ceil(i/2), side=i%2?1:-1; b.x=-30-row*16; b.y=fy+side*row*9; }); }
    for(const p of papers){
      p.y+=p.vy*s; p.x+=p.vx*s+Math.sin(T*p.ss+p.sway)*12*s;
      if(p.y>H*0.45){ p.y=-10; p.x=Math.random()*W; }
      if(p.x<-20) p.x=W+10; if(p.x>W+20) p.x=-10;
    }
    for(const v of cars){
      v.x+=v.speed*v.dir*s;
      if(v.dir===1&&v.x>W+140) v.x=-140;
      if(v.dir===-1&&v.x<-140) v.x=W+140;
    }
    updateSmoke(s);
    updateFireworks(s);
    runTimers();
  }

  // ---------------------------------------------------------------
  //  frame
  // ---------------------------------------------------------------
  function drawFrame(){
    if(!L) L=computeLayout();
    if(!L) return;
    ctx.imageSmoothingEnabled=false;
    drawSky();
    drawSun();
    for(const c of clouds) drawCloud(Math.round(c.x-mouse.x*26*c.p),Math.round(c.y),c.sc,c.variant);
    for(const b of birds) drawBird(Math.round(b.x),Math.round(b.y+Math.sin(b.offset)*2),isMobile?1.6:2,Math.floor(b.offset*2));
    drawMountains(layerOffset(LAYERS.mountains));
    const papSc=isMobile?1.5:2;
    for(const p of papers) drawGrid(PAPER,PAPER_PAL,p.x+Math.round(Math.sin(T*p.ss+p.sway)*2),p.y,papSc);
    drawFlag(layerOffset(LAYERS.flag));      // before the ridge, so houses stand in front of the pole
    drawRidge(layerOffset(LAYERS.ridge));
    drawMeadow(layerOffset(LAYERS.meadow));
    drawRoad(layerOffset(LAYERS.road));
    drawFireworks();
    if(!reduced){
      ctx.fillStyle="rgba(0,0,0,0.025)";
      for(let y=0;y<H;y+=4) ctx.fillRect(0,y,W,1);
    }
    placeBubble();
  }

  // ---------------------------------------------------------------
  //  smoker speech bubble: pinned over his head, typed out after the intro
  // ---------------------------------------------------------------
  let bubbleEl=null, bubbleTextEl=null, bubbleFull="", bubbleShown=-1, lastBubblePos="";
  function placeBubble(){
    if(!bubbleEl) return;
    const visible=!isMobile&&smokerBox&&T>introDur*0.9;
    const disp=visible?"block":"none";
    if(bubbleEl.style.display!==disp) bubbleEl.style.display=disp;
    if(!visible) return;
    // typewriter
    const chars=reduced?bubbleFull.length:Math.min(bubbleFull.length,Math.floor((T-introDur*0.9)*30));
    if(chars!==bubbleShown&&bubbleTextEl){ bubbleTextEl.textContent=bubbleFull.slice(0,chars)||" "; bubbleShown=chars; }
    const off=layerOffset(LAYERS.meadow);
    const bw=bubbleEl.offsetWidth||280, bh=bubbleEl.offsetHeight||46;
    let bx=smokerBox.x+off.x+smokerBox.w*0.5-bw*0.28;
    let by=smokerBox.y+off.y-bh-12+(reduced?0:Math.round(Math.sin(T*2)*1.5));
    bx=Math.round(clamp(bx,6,W-bw-6)); by=Math.round(clamp(by,6,H-bh-6));
    const pos=bx+","+by;
    if(pos!==lastBubblePos){ bubbleEl.style.transform="translate("+bx+"px,"+by+"px)"; lastBubblePos=pos; }
  }

  // ---------------------------------------------------------------
  //  loop
  // ---------------------------------------------------------------
  let last=0, active=false, firstShow=true;
  const rAF=window.requestAnimationFrame?window.requestAnimationFrame.bind(window):function(cb){return setTimeout(function(){cb(Date.now());},16);};
  const nowFn=(window.performance&&window.performance.now)?function(){return window.performance.now();}:function(){return Date.now();};
  let acc=0;
  function loop(now){
    rAF(loop);
    if(!W||!H||!active) return;
    if(reduced){
      if(needsDraw){ T=introDur; try{drawFrame();}catch(e){recordBgErr(e);} needsDraw=false; }
      return;
    }
    const dt=Math.min(0.1,Math.max(0,(now-last)/1000));
    last=now;
    // phones: ~30fps to save battery; accumulate time so motion speed stays correct
    acc+=dt;
    if(isMobile&&acc<1/31) return;
    const s=acc; acc=0;
    T+=s;
    try{update(s);}catch(e){recordBgErr(e);}
    try{drawFrame();}catch(e){recordBgErr(e);}
  }
  function onShown(){
    active=true; needsDraw=true;
    T=0; acc=0; last=nowFn();
    introDur=firstShow?2.2:1.1;   // coming back to the menu gets a snappier entrance
    firstShow=false;
    salutePending=true; rockets.length=0; sparks.length=0; timers.length=0;
    bubbleShown=-1;
    L=computeLayout(); buildMeadowProps();
    screen.classList.remove("title-intro"); void screen.offsetWidth;
    screen.classList.toggle("title-intro-quick",introDur<2); screen.classList.add("title-intro");
  }
  function syncActive(){
    const isActive=screen.classList.contains("active");
    if(isActive&&!active) onShown();
    else if(!isActive&&active){ active=false; if(bubbleEl) bubbleEl.style.display="none"; }
  }

  function boot(){
    canvas=document.getElementById("title-bg");
    screen=document.getElementById("screen-title");
    if(!canvas||!screen) return false;
    try{ ctx=canvas.getContext("2d"); }catch(_){ return false; }
    if(!ctx) return false;
    bubbleEl=document.getElementById("smoker-bubble");
    bubbleTextEl=bubbleEl&&bubbleEl.querySelector(".sb-text");
    bubbleFull=bubbleTextEl?bubbleTextEl.textContent.trim():"";
    if(bubbleEl){ bubbleEl.style.left="0px"; bubbleEl.style.top="0px"; bubbleEl.style.display="none"; }
    return true;
  }
  function start(){
    try{loadSprites();}catch(_){}
    try{handleResize();}catch(_){}
    try{initEntities();}catch(_){}
    window.addEventListener("resize",handleResize);
    // the title window can resize itself (fonts loading, Continue button appearing)
    try{
      const tw=document.querySelector(".title-wrap");
      if(tw&&window.ResizeObserver) new ResizeObserver(function(){ L=computeLayout(); buildMeadowProps(); needsDraw=true; }).observe(tw);
    }catch(_){}
    // parallax + click-to-launch fireworks (desktop pointers only for parallax)
    screen.addEventListener("pointermove",function(e){
      if(e.pointerType!=="mouse"||!W) return;
      mouse.tx=clamp(e.clientX/W*2-1,-1,1); mouse.ty=clamp(e.clientY/H*2-1,-1,1);
    });
    screen.addEventListener("pointerleave",function(){ mouse.tx=0; mouse.ty=0; });
    screen.addEventListener("pointerdown",function(e){
      if(!active||!L||(e.target&&e.target.closest&&e.target.closest(".title-wrap,button,a,.smoker-bubble"))) return;
      const r=screen.getBoundingClientRect();
      launch(e.clientX-r.left,Math.min(e.clientY-r.top,L.ridgeBase-40));
    });
    document.addEventListener("visibilitychange",function(){ last=nowFn(); });
    try{
      new MutationObserver(syncActive).observe(screen,{attributes:true,attributeFilter:["class"]});
    }catch(_){}
    syncActive();
    try{ drawFrame(); }catch(e){ recordBgErr(e); }
    rAF(function(t){ last=t||nowFn(); loop(last); });
    window.__titleBg={canvas,redraw:function(){ try{drawFrame();}catch(e){recordBgErr(e);} },resize:handleResize,firework:function(x,y){ launch(x==null?W/2:x,y==null?H*0.2:y); }};
  }
  if(!boot()){
    if(document.readyState==="loading"){
      document.addEventListener("DOMContentLoaded",function onReady(){
        document.removeEventListener("DOMContentLoaded",onReady);
        if(boot()) start();
      });
    }
  }else{
    start();
  }
})();
