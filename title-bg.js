"use strict";
/* title-bg.js — animated 8-bit pixel background for #screen-title
   Pure code canvas, no assets. Layered landscape: tricolor sky, crisp hero flag,
   a village row perched on the ridge, rose gardens and a campaign bus on the road.
   Adapts to mobile / reduced-motion. Sits behind the opaque XP window.
*/
(function(){
  if(typeof document==="undefined" || typeof window==="undefined") return;
  let canvas=null, screen=null, ctx=null;

  let W=0,H=0,DPR=1;
  let isMobile = false;
  let reduced = false;
  try{
    isMobile = window.matchMedia("(max-width: 899px)").matches;
    reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mm = window.matchMedia("(max-width: 899px)");
    const mr = window.matchMedia("(prefers-reduced-motion: reduce)");
    if(mm.addEventListener) mm.addEventListener("change", e=>{ isMobile=e.matches; handleResize(); });
    else if(mm.addListener) mm.addListener(e=>{ isMobile=e.matches; handleResize(); });
    if(mr.addEventListener) mr.addEventListener("change", e=>{ reduced=e.matches; if(reduced) needsDraw=true; });
    else if(mr.addListener) mr.addListener(e=>{ reduced=e.matches; if(reduced) needsDraw=true; });
  }catch(_){}

  function handleResize(){
    let rw=W||800, rh=H||600;
    try{
      const r = screen.getBoundingClientRect();
      if(r && r.width>0) rw=r.width;
      if(r && r.height>0) rh=r.height;
      if(rw<100) rw=window.innerWidth||800;
      if(rh<100) rh=window.innerHeight||600;
    }catch(_){}
    W = Math.max(1, Math.round(rw));
    H = Math.max(1, Math.round(rh));
    DPR = window.devicePixelRatio||1;
    try{
      canvas.width = Math.round(W*DPR);
      canvas.height = Math.round(H*DPR);
      canvas.style.width = W+"px";
      canvas.style.height = H+"px";
      ctx.setTransform(DPR,0,0,DPR,0,0);
      ctx.imageSmoothingEnabled = false;
    }catch(_){}
    needsDraw = true;
  }

  // ----- helpers -----
  function recordBgErr(e){
    try{ (window.__titleBgErrors=window.__titleBgErrors||[]).push(String((e&&e.message)||e)); }catch(_){}
  }
  function pRect(x,y,w,h,color){
    if(!color) return;
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), w, h);
  }
  function drawGrid(grid, pal, ox, oy, sc){
    const cs = Math.max(1, Math.round(sc));
    for(let r=0;r<grid.length;r++){
      const row = grid[r];
      for(let c=0;c<row.length;c++){
        const ch = row[c];
        if(ch==="."||ch===" ") continue;
        const col = pal[ch];
        if(!col) continue;
        ctx.fillStyle = col;
        ctx.fillRect(Math.round(ox + c*sc), Math.round(oy + r*sc), cs, cs);
      }
    }
  }

  // ----- palettes -----
  const PAL = {
    skyTop:"#f2f6fa", skyMid:"#dde9f2", skyLow:"#cde0ee",
    ridgeFar:"#a9c6d8", ridgeNear:"#7fb176", ridgeNearDk:"#6da266",
    grass:"#5ea763", grassDk:"#4b8f50", grassHi:"#6fb774",
    road:"#3b3b42", roadSide:"#54545c", roadLine:"#e8e8e8", roadEdge:"#2c2c31",
    flagW:"#ffffff", flagG:"#00966e", flagR:"#d62612",
    flagWSh:"#dfe4e8", flagGSh:"#007a58", flagRSh:"#b01e0c",
    pole:"#7a4a2a", poleDk:"#5e371e", gold:"#ffcc33", goldSh:"#d9a41f",
    wall:"#f0ece2", wallSh:"#d8d2c4", win:"#7d8ba0", winLit:"#f7d88a",
    churchTrim:"#a8c686", trim:"#e8d9b8",
    roofRed:"#c94a3a", roofRedDk:"#8e2f22", roofBrown:"#8b5a2b", roofBrownDk:"#5a3d1e",
    stone:"#9aa3ab", stoneDk:"#6f7880", stoneLi:"#b7bec4",
    ballotWhite:"#ffffff", ballotBlue:"#2f6fd6", ballotBlueHi:"#6ba3e8", ballotGrey:"#c9cccc",
    vanWhite:"#f5f5f5", vanWinN:"#35507a", vanWheel:"#1a1a1a", vanWheelHi:"#5a5a5a",
    podiumWood:"#8b5a2b", podiumWoodDk:"#5e3d1e", mic:"#2b2b2b", micHi:"#7a7a7a",
    posterPaper:"#fffdf0", posterFrame:"#8d8d8d",
    roseRed:"#e53935", roseDeep:"#b3261e", rosePink:"#ff8a80", stem:"#4a7a2e", leafGreen:"#3f8a3f",
    sunYellow:"#f2b62b", sunYellowDk:"#d69a1f", sunBrown:"#6b4a1a", sunBrownDk:"#4a3210", stalk:"#4f8a2e",
    wool:"#f7f7f2", woolSh:"#dddddd", sheepFace:"#2a2a2a",
    storkW:"#ffffff", storkB:"#232323", beakR:"#e04a2a",
    cloud:"#ffffff", cloudSh:"#dce7f1",
    hair:"#39281a", hairHi:"#57402c", skin:"#e2b48c", skinSh:"#c8935f",
    brow:"#5d4433", stubble:"#a67c53",
    jackF:"#46515c", jackS:"#333b44", jackHi:"#5d6a77", tee:"#ececec", zipper:"#8f979e",
    denim:"#3d4c6e", denimDk:"#32405e", denimHi:"#55688f",
    shoe:"#232323", sole:"#f0f0f0",
    cigWhite:"#f5f5f5", cigFilter:"#d4a574", cigGlow:"#ff3b30",
    lionGold:"#c9981a", lionDark:"#8a6a0a"
  };

  // =========================================================
  //  GRID SPRITES
  // =========================================================
  const PAPER_GRID=[
    "WWWWWWW",
    "WKKKKWW",
    "WKKKKWW",
    "WWWWWWW",
    "WWGGRRW",
    "WWGGRRW",
    "WWWWWWW"
  ];
  const PAPER_PAL={W:"#ffffff",K:"#4a4a4a",G:PAL.flagG,R:PAL.flagR};

  const REDCHURCH_GRID=[
    "......GGG........",
    ".....GGGGG.......",
    "....GGGGGGG......",
    "....TTTTTTT......",
    "....BBDDBBB......",
    "....BBDDBBB......",
    "....BBBBBBB......",
    ".TTTTTTTTTTTTTTT.",
    ".BBBBDDDBBBBDDDB.",
    ".BBBBDDDBBBBDDDB.",
    ".BBBBDDDBBBBDDDB.",
    ".BBBBBBBBBBBBBBB.",
    ".BbBbBbBbBbBbBbB.",
    "SSSSSSSSSSSSSSSSS",
    "SsSsSsSsSsSsSsSsS"
  ];
  const REDCHURCH_PAL={B:PAL.roofRed,b:PAL.roofRedDk,D:"#47150e",T:PAL.trim,G:PAL.gold,S:PAL.stoneLi,s:PAL.stone};

  const ROSE_GRID=[
    "..RRR..",
    ".RRRRR.",
    "RRLLRRR",
    "RRLRrRR",
    ".RRRrr.",
    "..rrr..",
    "...S...",
    ".l.S.l."
  ];
  const ROSE_PAL={R:PAL.roseRed,r:PAL.roseDeep,L:PAL.rosePink,S:PAL.stem,l:PAL.leafGreen};

  const SUNFLOWER_GRID=[
    "..YYYYY..",
    ".YYYYYYY.",
    ".YYBBBYY.",
    ".YYByBYY.",
    ".YYBBBYY.",
    ".YYYYYYY.",
    "..YYYYY..",
    "....S....",
    ".L..S..L.",
    ".L..S....",
    "....S....",
    "....S...."
  ];
  const SUNFLOWER_PAL={Y:PAL.sunYellow,y:PAL.sunYellowDk,B:PAL.sunBrown,b:PAL.sunBrownDk,S:PAL.stalk,L:PAL.stalk};

  const SMOKER_HEAD=[
    "....HH.h....",
    "...HHHHHH...",
    "....SSSSSN..",
    "....SSSESN..",
    "....SSSUUNN.",
    ".....UUUU...",
    "......SSS..."
  ];
  const SMOKER_HEAD_PAL={H:PAL.hair,h:PAL.hairHi,S:PAL.skin,s:PAL.skinSh,E:"#1a1a1a",B:PAL.brow,N:PAL.skinSh,U:PAL.stubble};

  // =========================================================
  //  RECT SPRITES (readable pixel-cluster buildings)
  // =========================================================

  // Alexander Nevsky cathedral: white body, 3 gold domes
  function drawNevsky(ox, oy, sc){
    const Wd=32,Hd=22;
    pRect(ox, oy+Hd*sc-3*sc, Wd*sc, 3*sc, PAL.stone);
    pRect(ox, oy+Hd*sc-2*sc, Wd*sc, sc, PAL.stoneLi);
    pRect(ox+sc, oy+10*sc, (Wd-2)*sc, 9*sc, PAL.wall);
    for(let i=0;i<4;i++){
      const wx=ox+(4+i*7)*sc;
      pRect(wx, oy+12*sc, sc, 4*sc, PAL.win);
      pRect(wx, oy+12*sc, sc, sc, "#5a626c");
    }
    pRect(ox, oy+12*sc, 3*sc, 7*sc, PAL.wall);
    pRect(ox+Wd*sc-3*sc, oy+12*sc, 3*sc, 7*sc, PAL.wall);
    pRect(ox+sc, oy+14*sc, sc, 3*sc, PAL.win);
    pRect(ox+Wd*sc-2*sc, oy+14*sc, sc, 3*sc, PAL.win);
    pRect(ox+13*sc, oy+15*sc, 6*sc, 4*sc, "#c2c2c2");
    pRect(ox+14*sc, oy+16*sc, 4*sc, 3*sc, "#6e6e6e");
    pRect(ox+8*sc, oy+8*sc, 16*sc, 4*sc, PAL.wall);
    function dome(cx,w,h){
      pRect(cx, oy+8*sc-(h-1)*sc, w*sc, 2*sc, PAL.gold);
      const steps=Math.floor(h*0.7);
      for(let s=0;s<steps;s++){
        const ww=w-s*2; if(ww<=0) break;
        pRect(cx+s*sc, oy+8*sc-h*sc+s*sc, ww*sc, sc, PAL.gold);
        pRect(cx+s*sc+ww*sc-sc, oy+8*sc-h*sc+s*sc, sc, sc, PAL.goldSh);
      }
      pRect(cx+sc, oy+8*sc-sc, (w-2)*sc, sc, PAL.wallSh);
      pRect(cx+Math.floor(w/2)*sc, oy+8*sc-h*sc-2*sc, sc, 2*sc, PAL.gold);
      pRect(cx+Math.floor(w/2)*sc-sc, oy+8*sc-h*sc-sc, 3*sc, sc, PAL.gold);
    }
    dome(ox+2*sc,6,5); dome(ox+11*sc,10,7); dome(ox+24*sc,6,5);
    pRect(ox+2*sc, oy+8*sc, 6*sc, sc, PAL.goldSh);
    pRect(ox+11*sc, oy+8*sc, 10*sc, sc, PAL.goldSh);
    pRect(ox+24*sc, oy+8*sc, 6*sc, sc, PAL.goldSh);
  }

  // small village church: white walls, green trims, one gold dome
  function drawSmallChurch(ox, oy, sc){
    const Wd=24,Hd=18;
    pRect(ox, oy+Hd*sc-2*sc, Wd*sc, 2*sc, PAL.grassDk);
    pRect(ox+2*sc, oy+8*sc, (Wd-4)*sc, 8*sc, PAL.wall);
    pRect(ox+2*sc, oy+4*sc, 6*sc, 12*sc, PAL.wall);
    pRect(ox+3*sc, oy+6*sc, 4*sc, sc, PAL.churchTrim);
    pRect(ox+3*sc, oy+9*sc, 4*sc, sc, PAL.churchTrim);
    pRect(ox+3*sc, oy+sc, 4*sc, 2*sc, PAL.gold);
    pRect(ox+4*sc, oy, 2*sc, sc, PAL.gold);
    pRect(ox+4*sc, oy-sc, 2*sc, 2*sc, PAL.gold);
    pRect(ox+3*sc, oy-sc, 4*sc, sc, PAL.gold);
    const cx=ox+14*sc;
    pRect(cx, oy+3*sc, 8*sc, 3*sc, PAL.wall);
    pRect(cx+sc, oy+4*sc, 6*sc, sc, PAL.win);
    for(let s=0;s<4;s++){
      const w=8-s*2;
      pRect(cx+s*sc, oy+sc+s*sc, w*sc, sc, PAL.gold);
      if(s>0) pRect(cx+s*sc+w*sc-sc, oy+sc+s*sc, sc, sc, PAL.goldSh);
    }
    pRect(cx+3*sc, oy-2*sc, 2*sc, 2*sc, PAL.gold);
    pRect(cx+2*sc, oy-sc, 4*sc, sc, PAL.gold);
    pRect(ox+8*sc, oy+7*sc, 6*sc, sc, PAL.churchTrim);
    pRect(ox+6*sc, oy+9*sc, 10*sc, sc, PAL.churchTrim);
    pRect(ox+2*sc, oy+12*sc, (Wd-4)*sc, sc, PAL.wallSh);
    pRect(ox+9*sc, oy+11*sc, 2*sc, 2*sc, PAL.win);
    pRect(ox+13*sc, oy+11*sc, 2*sc, 2*sc, PAL.win);
    pRect(ox+17*sc, oy+11*sc, 2*sc, 2*sc, PAL.win);
  }

  // Shipka stone monument: narrowing tower
  function drawMonument(ox, oy, sc){
    const Wd=14,Hd=17;
    pRect(ox-2*sc, oy+Hd*sc, (Wd+4)*sc, 2*sc, PAL.grass);
    for(let r=0;r<Hd;r++){
      const inset=Math.floor(r*0.3);
      const w=Wd-inset*2;
      const col=r%3===0?PAL.stoneLi:(r%3===1?PAL.stone:PAL.stoneDk);
      pRect(ox+inset*sc, oy+r*sc, w*sc, sc, col);
      if(r>3) pRect(ox+inset*sc, oy+r*sc, sc*0.7, sc, "rgba(0,0,0,0.10)");
    }
    pRect(ox+2*sc, oy, 2*sc, sc, PAL.stoneDk);
    pRect(ox+10*sc, oy, 2*sc, sc, PAL.stoneDk);
    pRect(ox+6*sc, oy-sc, 2*sc, sc, PAL.stoneDk);
  }

  // red brick church with gold dome + arched windows
  function drawRedChurch(ox, oy, sc){
    drawGrid(REDCHURCH_GRID, REDCHURCH_PAL, ox, oy, sc);
  }

  // small brown fortress keep
  function drawFortress(ox, oy, sc){
    const Wd=28,Hd=14;
    for(let r=0;r<7;r++){
      const ww=6-Math.floor(r/2);
      pRect(ox+2*sc-Math.floor((6-ww)/2)*sc, oy+2*sc+r*sc, ww*sc, sc, PAL.grass);
    }
    pRect(ox+4*sc, oy+6*sc, 16*sc, 8*sc, PAL.roofBrown);
    pRect(ox+4*sc, oy+6*sc, 16*sc, sc, PAL.roofBrownDk);
    for(let i=0;i<4;i++) pRect(ox+(5+i*4)*sc, oy+5*sc, 2*sc, sc, PAL.roofBrownDk);
    pRect(ox+10*sc, oy+sc, 8*sc, 9*sc, PAL.roofBrown);
    pRect(ox+11*sc, oy, 6*sc, 2*sc, PAL.roofBrownDk);
    pRect(ox+7*sc, oy+9*sc, 2*sc, 2*sc, "#3a2a1a");
    pRect(ox+13*sc, oy+4*sc, 2*sc, 2*sc, "#3a2a1a");
    pRect(ox, oy+Hd*sc, Wd*sc, 2*sc, PAL.grass);
    pRect(ox, oy+Hd*sc, Wd*sc, sc, PAL.grassDk);
    // small tricolor flag on the keep
    pRect(ox+9*sc, oy-sc, sc, 2*sc, PAL.pole);
    pRect(ox+10*sc, oy-sc, 4*sc, sc, PAL.flagW);
    pRect(ox+10*sc, oy, 4*sc, sc, PAL.flagG);
    pRect(ox+10*sc, oy+sc, 4*sc, sc, PAL.flagR);
  }

  // ballot box: blue lid, slot, white body, tricolor band, green check
  function drawBallotBox(ox, oy, sc){
    const Wd=12,Hd=10;
    pRect(ox+sc, oy+Hd*sc, Wd*sc, sc, "rgba(0,0,0,0.16)");
    // sticking-out ballots above slot
    pRect(ox+4*sc, oy-2*sc, 4*sc, 2*sc, "#ffffff");
    pRect(ox+5*sc, oy-sc, 2*sc, sc, PAL.flagG);
    pRect(ox+5*sc, oy, 2*sc, sc, PAL.flagR);
    // blue lid + slot
    pRect(ox-sc, oy, (Wd+2)*sc, 3*sc, PAL.ballotBlue);
    pRect(ox-sc, oy, (Wd+2)*sc, sc, PAL.ballotBlueHi);
    pRect(ox+3*sc, oy+sc, 6*sc, sc, "#0f1a2a");
    // white body
    pRect(ox, oy+3*sc, Wd*sc, Hd*sc, "#ffffff");
    pRect(ox, oy+3*sc, Wd*sc, sc, PAL.ballotGrey);
    // tricolor band
    pRect(ox+2*sc, oy+8*sc, 8*sc, sc, PAL.flagW);
    pRect(ox+2*sc, oy+9*sc, 8*sc, sc, PAL.flagG);
    pRect(ox+2*sc, oy+10*sc, 8*sc, sc, PAL.flagR);
    // green check
    pRect(ox+3*sc, oy+6*sc, sc, sc, PAL.flagG);
    pRect(ox+4*sc, oy+7*sc, sc, sc, PAL.flagG);
    pRect(ox+5*sc, oy+5*sc, sc, sc, PAL.flagG);
    pRect(ox+6*sc, oy+4*sc, sc, sc, PAL.flagG);
  }

  // wooden podium with mic + tricolor pennant
  function drawPodium(ox, oy, sc){
    pRect(ox+2*sc, oy+6*sc, 10*sc, 6*sc, PAL.podiumWood);
    pRect(ox+2*sc, oy+6*sc, 10*sc, sc, PAL.podiumWoodDk);
    pRect(ox+sc, oy+5*sc, 12*sc, sc, PAL.podiumWood);
    pRect(ox+7*sc, oy+2*sc, sc, 4*sc, PAL.micHi);
    pRect(ox+6*sc, oy+sc, 3*sc, 2*sc, PAL.mic);
    pRect(ox+6*sc, oy+sc, 3*sc, sc, "#9a9a9a");
    pRect(ox+9*sc, oy+3*sc, 4*sc, sc, PAL.flagW);
    pRect(ox+9*sc, oy+4*sc, 4*sc, sc, PAL.flagG);
    pRect(ox+9*sc, oy+5*sc, 4*sc, sc, PAL.flagR);
    pRect(ox+4*sc, oy+8*sc, 6*sc, 2*sc, PAL.trim);
    pRect(ox+5*sc, oy+8*sc, 4*sc, sc, PAL.gold);
  }

  // bus stop shelter with bench
  function drawBusStop(ox, oy, sc){
    const Wd=18,Hd=16;
    pRect(ox, oy, Wd*sc, Hd*sc, "rgba(0,0,0,0.10)");
    pRect(ox-sc, oy, (Wd+2)*sc, 3*sc, PAL.podiumWoodDk);
    pRect(ox-sc, oy, (Wd+2)*sc, sc, PAL.podiumWood);
    pRect(ox, oy+3*sc, 2*sc, 9*sc, "#a8c0d8");
    pRect(ox+Wd*sc-2*sc, oy+3*sc, 2*sc, 9*sc, "#a8c0d8");
    pRect(ox, oy+3*sc, Wd*sc, sc, "#dbe6f0");
    pRect(ox+3*sc, oy+11*sc, 12*sc, sc, PAL.podiumWood);
    pRect(ox+4*sc, oy+12*sc, sc, 3*sc, PAL.podiumWoodDk);
    pRect(ox+12*sc, oy+12*sc, sc, 3*sc, PAL.podiumWoodDk);
    // big sign board
    pRect(ox+4*sc, oy+4*sc, 10*sc, 5*sc, "#ffffff");
    pRect(ox+4*sc, oy+4*sc, 10*sc, sc, "#b9b9b9");
    // pixel letters B U S
    pRect(ox+5*sc, oy+6*sc, 2*sc, 2*sc, PAL.flagR);
    pRect(ox+5*sc, oy+6*sc, sc, sc, PAL.flagG);
    pRect(ox+8*sc, oy+6*sc, 2*sc, 2*sc, PAL.flagR);
    pRect(ox+8*sc, oy+6*sc, 2*sc, sc, PAL.flagG);
    pRect(ox+11*sc, oy+6*sc, 2*sc, 2*sc, PAL.flagR);
    pRect(ox+11*sc, oy+6*sc, sc, sc, PAL.flagG);
  }

  // gold lion on red shield
  function drawLion(ox, oy, sc){
    pRect(ox+2*sc, oy+2*sc, 8*sc, 10*sc, PAL.flagR);
    pRect(ox+sc, oy+3*sc, 10*sc, 8*sc, PAL.flagR);
    pRect(ox+2*sc, oy+12*sc, 8*sc, sc, PAL.flagR);
    pRect(ox+3*sc, oy+13*sc, 6*sc, sc, PAL.flagR);
    pRect(ox+4*sc, oy+14*sc, 4*sc, sc, PAL.flagR);
    pRect(ox+4*sc, oy+5*sc, 4*sc, 4*sc, PAL.lionGold);
    pRect(ox+5*sc, oy+4*sc, 2*sc, 2*sc, PAL.lionGold);
    pRect(ox+3*sc, oy+6*sc, sc, 2*sc, PAL.lionGold);
    pRect(ox+8*sc, oy+7*sc, sc, 2*sc, PAL.lionGold);
    pRect(ox+4*sc, oy+9*sc, sc, 2*sc, PAL.lionGold);
    pRect(ox+7*sc, oy+9*sc, sc, 2*sc, PAL.lionGold);
    pRect(ox+4*sc, oy+4*sc, 4*sc, sc, PAL.lionDark);
    pRect(ox+5*sc, oy+3*sc, 2*sc, sc, PAL.gold);
  }

  // rakia bottle + shot glass
  function drawRakia(ox, oy, sc){
    pRect(ox, oy, 3*sc, 8*sc, "#cfe8ee");
    pRect(ox, oy+4*sc, 3*sc, 4*sc, "#c67f2e");
    pRect(ox+sc, oy-2*sc, sc, 2*sc, "#cfe8ee");
    pRect(ox+sc, oy-3*sc, sc, sc, "#c9a06a");
    pRect(ox, oy+2*sc, 3*sc, 2*sc, "#ffffff");
    pRect(ox, oy+2*sc, 3*sc, sc, PAL.flagG);
    pRect(ox, oy+3*sc, 3*sc, sc, PAL.flagR);
    pRect(ox+5*sc, oy+5*sc, 2*sc, 3*sc, "#cfe8ee");
    pRect(ox+5*sc, oy+6*sc, 2*sc, 2*sc, "#c67f2e");
  }

  // stork nest on power pole
  function drawStorkPole(ox, oy, sc, t){
    pRect(ox, oy-24*sc, 2*sc, 24*sc, "#7a5e42");
    pRect(ox-3*sc, oy-24*sc, 8*sc, sc, "#7a5e42");
    pRect(ox-2*sc, oy-25*sc, 6*sc, 2*sc, "#9a7b52");
    pRect(ox-2*sc, oy-25*sc, 6*sc, sc, "#7a5e3c");
    pRect(ox+4*sc, oy-28*sc, 2*sc, 2*sc, "#ffffff");
    pRect(ox+6*sc, oy-29*sc, sc, sc, "#ffffff");
    pRect(ox+7*sc, oy-29*sc, 2*sc, sc, PAL.beakR);
    pRect(ox+4*sc, oy-26*sc, sc, sc, PAL.storkB);
    pRect(ox+4*sc, oy-26*sc, sc, 2*sc, PAL.storkB);
    const flap=Math.floor(t*0.002)%6;
    pRect(ox-sc, oy-26*sc, 2*sc, sc, "#ffffff");
    if(flap<2) pRect(ox, oy-(flap===0?28:27)*sc, 2*sc, sc, PAL.storkB);
  }

  // three woolly sheep
  function drawSheep(ox, oy, sc, t){
    for(let i=0;i<3;i++){
      const sx=ox+i*9*sc;
      const graze=Math.floor((t*0.0006+i*0.7))%3===0;
      pRect(sx+sc, oy+3*sc, 5*sc, 3*sc, PAL.wool);
      pRect(sx, oy+4*sc, 7*sc, 2*sc, PAL.wool);
      pRect(sx+2*sc, oy+2*sc, 3*sc, sc, PAL.wool);
      pRect(sx+sc, oy+4*sc, 2*sc, sc, PAL.woolSh);
      pRect(sx+4*sc, oy+5*sc, 2*sc, sc, PAL.woolSh);
      pRect(sx+sc, oy+6*sc, sc, 2*sc, PAL.sheepFace);
      pRect(sx+5*sc, oy+6*sc, sc, 2*sc, PAL.sheepFace);
      if(graze){
        pRect(sx+6*sc, oy+5*sc, 2*sc, 2*sc, PAL.sheepFace);
        pRect(sx+7*sc, oy+6*sc, sc, sc, PAL.sheepFace);
      }else{
        pRect(sx+6*sc, oy+2*sc, 2*sc, 2*sc, PAL.sheepFace);
        pRect(sx+8*sc, oy+2*sc, sc, sc, PAL.sheepFace);
      }
    }
  }

  // pixel clouds (3 variants)
  function drawCloud(ox, oy, sc, variant){
    const shapes=[
      ["...YYYY...",
       ".YYYYYYY..",
       "YYYYYYYYYY",
       "..YYYYYYY.",
       "...YYYY..."],
      ["..YYYYY....",
       ".YYYYYYYY..",
       "YYYYYYYYYYY",
       ".YYYYYYYY..",
       "..YYYYYYY.."],
      ["..YYYYYYYY.",
       ".YYYYYYYYYY",
       "YYYYYYYYYYY",
       ".YYYYYYYY..",
       "...YYYYY..."]
    ];
    const g=shapes[variant%shapes.length];
    for(let r=0;r<g.length;r++){
      for(let c=0;c<g[r].length;c++){
        if(g[r][c]==="Y"){
          ctx.fillStyle=PAL.cloudSh;
          ctx.fillRect(Math.round(ox+c*sc), Math.round(oy+(r+1)*sc), Math.ceil(sc), Math.ceil(sc));
          ctx.fillStyle=PAL.cloud;
          ctx.fillRect(Math.round(ox+c*sc), Math.round(oy+r*sc), Math.ceil(sc), Math.ceil(sc));
        }
      }
    }
  }

  // small two-frame pixel bird
  function drawBird(ox, oy, sc, frame){
    const b="#4a4a52";
    if(frame%2===0){
      pRect(ox+sc, oy+sc, 2*sc, sc, b);
      pRect(ox+4*sc, oy+sc, 2*sc, sc, b);
      pRect(ox+2*sc, oy+2*sc, 3*sc, sc, b);
    }else{
      pRect(ox, oy+2*sc, 2*sc, sc, b);
      pRect(ox+5*sc, oy+2*sc, 2*sc, sc, b);
      pRect(ox+2*sc, oy+2*sc, 3*sc, sc, b);
    }
  }

  function drawPaper(ox, oy, sc, rot){
    const dx=Math.round(Math.sin(rot)*sc*1.2);
    drawGrid(PAPER_GRID, PAPER_PAL, ox+dx, oy, sc);
  }

  // ---- campaign bus ----
  function drawVan(ox, oy, sc, t){
    pRect(ox, oy, 30*sc, 5*sc, "#f5f5f5");
    pRect(ox, oy, 30*sc, sc, "#ffffff");
    pRect(ox, oy+5*sc, 30*sc, sc, "#c9cccc");
    pRect(ox+2*sc, oy+sc, 6*sc, 3*sc, PAL.vanWinN);
    pRect(ox+9*sc, oy+sc, 6*sc, 3*sc, PAL.vanWinN);
    pRect(ox+16*sc, oy+sc, 5*sc, 3*sc, PAL.vanWinN);
    pRect(ox, oy+6*sc, 30*sc, 2*sc, "#ffffff");
    pRect(ox, oy+8*sc, 30*sc, sc, PAL.flagG);
    pRect(ox, oy+9*sc, 30*sc, sc, PAL.flagR);
    const wheelY=oy+10*sc;
    pRect(ox+4*sc, wheelY, 5*sc, 3*sc, PAL.vanWheel);
    pRect(ox+6*sc, wheelY+sc, 2*sc, 2*sc, PAL.vanWheelHi);
    pRect(ox+21*sc, wheelY, 5*sc, 3*sc, PAL.vanWheel);
    pRect(ox+23*sc, wheelY+sc, 2*sc, 2*sc, PAL.vanWheelHi);
    pRect(ox+12*sc, oy-2*sc, sc, 2*sc, PAL.pole);
    pRect(ox+13*sc, oy-2*sc, 4*sc, sc, PAL.flagW);
    pRect(ox+13*sc, oy-sc, 4*sc, sc, PAL.flagG);
    pRect(ox+13*sc, oy, 4*sc, sc, PAL.flagR);
    pRect(ox+9*sc, oy+3*sc, sc, sc, "#d62612");
    pRect(ox+11*sc, oy+3*sc, sc, sc, "#d62612");
    pRect(ox+13*sc, oy+3*sc, sc, sc, "#d62612");
  }

  // ---- crisp hero flag: 3 straight bands + pole, no melty wave ----
  function drawFlag(ox, oy, sc, t){
    const FW=28, FH=15;
    for(let c=0;c<FW;c++){
      pRect(ox+c*sc, oy, sc, 5*sc, PAL.flagW);
      pRect(ox+c*sc, oy+5*sc, sc, 5*sc, PAL.flagG);
      pRect(ox+c*sc, oy+10*sc, sc, 5*sc, PAL.flagR);
      // shading rows at band bottoms
      pRect(ox+c*sc, oy+4*sc, sc, sc, PAL.flagWSh);
      pRect(ox+c*sc, oy+9*sc, sc, sc, PAL.flagGSh);
      pRect(ox+c*sc, oy+14*sc, sc, sc, PAL.flagRSh);
    }
    // pole + gold finial
    pRect(ox-2*sc, oy-sc, sc, FH*sc+sc, PAL.pole);
    pRect(ox-2*sc, oy-sc, sc, sc, PAL.poleDk);
    pRect(ox-2*sc+sc*0.2, oy-2*sc+sc*0.25, sc*1.6, sc*1.6, PAL.gold);
  }

  // =========================================================
  //  LANDSCAPE
  // =========================================================
  let needsDraw=true;

  function layoutVars(){
    if(!W||!H) return null;
    let overlayBottom=H*0.40;
    try{
      const titleEl=document.querySelector(".title-wrap");
      if(titleEl){
        const tr=titleEl.getBoundingClientRect();
        const sr=screen.getBoundingClientRect();
        if(tr && tr.height>0 && sr && (sr.height||1)>0){
          const rel=(tr.bottom-sr.top);
          if(rel>H*0.2 && rel<H*0.75) overlayBottom=rel;
        }
      }
    }catch(_){}
    const hillsTop=Math.max(H*0.40, Math.min(H*0.62, overlayBottom+6));
    const meadowTop=Math.round(H*0.765);
    const roadH=Math.max(34, Math.round(H*0.052));
    const roadTop=H-roadH;
    return {overlayBottom, hillsTop, meadowTop, roadH, roadTop};
  }

  function drawSky(){
    const grad=ctx.createLinearGradient(0,0,0,H*0.72);
    grad.addColorStop(0,PAL.skyTop);
    grad.addColorStop(0.35,PAL.skyMid);
    grad.addColorStop(0.8,PAL.skyLow);
    grad.addColorStop(1,"#d5e4ef");
    ctx.fillStyle=grad;
    ctx.fillRect(0,0,W,H);
    if(!reduced){
      ctx.fillStyle="rgba(255,255,255,0.05)";
      for(let y=0;y<H*0.5;y+=8){
        for(let x=((y/8)%2===0?0:4);x<W;x+=8) ctx.fillRect(x,y,2,2);
      }
    }
  }

  function drawRidge(L, t){
    const shift=Math.round(Math.sin(t*0.0004)*2);
    // far blue-grey ridge
    const far=[[0,L.hillsTop+10],[W*0.09,L.hillsTop-14],[W*0.18,L.hillsTop+2],[W*0.27,L.hillsTop-22],[W*0.38,L.hillsTop-4],[W*0.47,L.hillsTop-18],[W*0.58,L.hillsTop],[W*0.70,L.hillsTop-24],[W*0.82,L.hillsTop-6],[W*0.92,L.hillsTop-16],[W,L.hillsTop+6]];
    ctx.fillStyle=PAL.ridgeFar;
    ctx.beginPath();
    ctx.moveTo(0,L.meadowTop);
    for(const p of far) ctx.lineTo(p[0]+shift,p[1]);
    ctx.lineTo(W,L.meadowTop);
    ctx.closePath();
    ctx.fill();
    // near green ridge
    const near=[[0,L.hillsTop+46],[W*0.10,L.hillsTop+30],[W*0.20,L.hillsTop+54],[W*0.32,L.hillsTop+36],[W*0.44,L.hillsTop+58],[W*0.56,L.hillsTop+38],[W*0.68,L.hillsTop+52],[W*0.80,L.hillsTop+32],[W*0.90,L.hillsTop+48],[W,L.hillsTop+40]];
    ctx.fillStyle=PAL.ridgeNear;
    ctx.beginPath();
    ctx.moveTo(0,L.meadowTop);
    for(const p of near) ctx.lineTo(p[0],p[1]);
    ctx.lineTo(W,L.meadowTop);
    ctx.closePath();
    ctx.fill();
    // pixel texture dots on the near ridge (grass tufts, scattered)
    ctx.fillStyle=PAL.ridgeNearDk;
    for(let g=0;g<(isMobile?50:100);g++){
      const gx=((g*2654435761)>>>0)%W;
      const gy=L.hillsTop+72+(((g*7919)>>>0)%15)*4+((g%3)*3);
      ctx.fillRect(gx, gy, (g%2===0?3:2), 2);
    }
    // tiny 2px flowers scattered on the ridge
    const cols=["#f8c7c9","#f7d88a","#f2f2f2","#d9a6d9"];
    for(let g=0;g<(isMobile?8:16);g++){
      const gx=(g*97+37)%W;
      const gy=L.hillsTop+80+((g*61)%10)*4;
      ctx.fillStyle=g%2===0?"#f8c7c9":"#f7d88a";
      ctx.fillRect(gx,gy,2,2);
    }
  }

  function drawMeadow(L){
    const meadowY=L.meadowTop;
    pRect(0,meadowY,W,H-meadowY,PAL.grass);
    ctx.fillStyle=PAL.grassDk;
    for(let x=0;x<W;x+=10){
      for(let y=meadowY+6;y<H;y+=8){
        if(((x+y)*0.13)%1>0.55) ctx.fillRect(x+((x%20===0)?3:0),y,4,3);
      }
    }
    const roadY=L.roadTop;
    pRect(0,roadY-6,W,2,PAL.flagW);
    pRect(0,roadY-4,W,2,PAL.flagG);
    pRect(0,roadY-2,W,2,PAL.flagR);
    pRect(0,roadY,W,L.roadH,PAL.road);
    pRect(0,roadY,W,2,PAL.roadSide);
    pRect(0,roadY+L.roadH-2,W,2,PAL.roadEdge);
    const ymid=roadY+Math.floor(L.roadH/2)-1;
    for(let x=0;x<W;x+=26) pRect(x,ymid,13,2,PAL.roadLine);
  }

  // roadside tricolor mini flags
  function drawMiniFlags(L,t){
    const y=L.roadTop-1;
    const sc=isMobile?1.8:2.4;
    let i=0;
    for(let x=W*0.04;x<W*0.96;x+=W*0.085,i++){
      const h=Math.round(sc*11);
      pRect(x,y-h,Math.max(2,Math.round(sc*0.8)),h,PAL.pole);
      pRect(x-Math.round(sc*2),y-6*sc+Math.round(Math.sin(t*0.0025+i*1.7)*sc*0.7),Math.round(sc*5),2*sc,PAL.flagW);
      pRect(x-Math.round(sc*2),y-4*sc+Math.round(Math.sin(t*0.0025+i*1.7)*sc*0.7),Math.round(sc*5),2*sc,PAL.flagG);
      pRect(x-Math.round(sc*2),y-2*sc+Math.round(Math.sin(t*0.0025+i*1.7)*sc*0.7),Math.round(sc*5),2*sc,PAL.flagR);
    }
  }

  function drawSunflowers(meadowTop,t){
    const sc=isMobile?2.0:2.8;
    let i=0;
    for(let x=W*0.02;x<W*0.98;x+=W/(isMobile?7:15),i++){
      if(i%3===1) continue;
      const sway=Math.round(Math.sin(t*0.0018+i*1.3)*sc*0.5);
      const y=meadowTop+6-12*sc+(((i*5)%4)+((i%3)))*sc*0.5;
      drawGrid(SUNFLOWER_GRID,SUNFLOWER_PAL,x+sway,y,sc*(0.92+(i%4)*0.04));
    }
  }

  function drawRoseBed(ox,yBase,sc,n,t,seed){
    const step=Math.round(sc*3.4)+6;
    for(let i=0;i<n;i++){
      const row=(i+seed)%2;
      const x=ox+i*step+(((i*13+seed*7)%5)-2)*sc*0.5;
      const y=yBase-row*sc*1.9;
      const s=sc*(0.86+((i+seed)%3)*0.10);
      const sway=Math.round(Math.sin(t*0.0016+i*1.1+seed)*s*0.55);
      drawGrid(ROSE_GRID,ROSE_PAL,x+sway,y,s);
    }
  }

  function drawRoseGardens(meadowTop,t){
    const sc=isMobile?2.4:3.2;
    drawRoseBed(W*0.025,meadowTop+sc*6,sc,isMobile?4:7,t,1);
    drawRoseBed(W*0.025,meadowTop+sc*15,sc*1.2,isMobile?3:6,t,2);
    drawRoseBed(W*0.615,meadowTop+sc*6,sc,isMobile?3:6,t,3);
    drawRoseBed(W*0.615,meadowTop+sc*15,sc*1.2,isMobile?3:5,t,4);
    drawRoseBed(W*0.86,meadowTop+sc*8,sc,isMobile?2:4,t,5);
  }

  // =========================================================
  //  THE SMOKER
  // =========================================================
  function drawSmoker(ox,oy,sc,t){
    const breathe=Math.round(Math.sin(t*0.0016));
    const blink=((t*0.001)%4.7)<0.12;
    const dragCyc=(t*0.00045)%3;
    const dragging=dragCyc<0.5;
    const exhaling=dragCyc>=0.5&&dragCyc<1.8;
    const bobY=breathe*sc*0.5;

    // legs + sneakers
    pRect(ox+3*sc,oy+16*sc,3*sc,8*sc,PAL.denimDk);
    pRect(ox+6*sc,oy+16*sc,4*sc,8*sc,PAL.denim);
    pRect(ox+4*sc,oy+17*sc,sc,7*sc,PAL.denimHi);
    pRect(ox+3*sc,oy+22*sc,3*sc,sc,PAL.denimHi);
    pRect(ox+6*sc,oy+22*sc,4*sc,sc,PAL.denimHi);
    pRect(ox+2*sc,oy+24*sc,5*sc,2*sc,PAL.shoe);
    pRect(ox+6*sc,oy+24*sc,4*sc,2*sc,PAL.shoe);
    pRect(ox+2*sc,oy+25*sc,8*sc,sc,PAL.sole);
    // torso
    const ty=oy+8*sc+bobY;
    pRect(ox+3*sc,ty,8*sc,8*sc,PAL.jackF);
    pRect(ox+9*sc,ty,2*sc,8*sc,PAL.jackS);
    pRect(ox+3*sc,ty,8*sc,sc,PAL.jackHi);
    pRect(ox+4*sc,ty+sc,2*sc,6*sc,PAL.tee);
    pRect(ox+6*sc,ty+2*sc,sc,5*sc,PAL.zipper);
    pRect(ox+3*sc,ty+8*sc,8*sc,sc,PAL.jackS);
    // raised arm
    pRect(ox+10*sc,ty,2*sc,4*sc,PAL.jackF);
    pRect(ox+11*sc,ty-3*sc,sc,4*sc,PAL.jackS);
    // head
    const hy=oy+bobY;
    const g=SMOKER_HEAD;
    for(let r=0;r<g.length;r++){
      for(let c=0;c<g[r].length;c++){
        const ch=g[r][c];
        if(ch===".") continue;
        let col=SMOKER_HEAD_PAL[ch];
        if(ch==="E"&&blink) col=PAL.skin;
        if(!col) continue;
        ctx.fillStyle=col;
        ctx.fillRect(Math.round(ox+c*sc),Math.round(hy+r*sc),Math.ceil(sc),Math.ceil(sc));
      }
    }
    // hand + cigarette at lips
    pRect(ox+11*sc,hy+3*sc,sc,2*sc,PAL.skin);
    const flick=Math.floor(t*0.02)%4;
    const glow=dragging?"#ffd23f":(flick===0?PAL.cigGlow:(flick===2?"#ff6b35":"#ff9a5a"));
    pRect(ox+9*sc,hy+3*sc,sc,sc,PAL.cigWhite);
    pRect(ox+10*sc,hy+3*sc,sc,sc,PAL.cigFilter);
    pRect(ox+8*sc,hy+3*sc+sc*0.3,sc,sc*0.7,dragging?glow:"#ff9a5a");
    // smoke
    const puffs=exhaling?6:3;
    const puffAlpha=exhaling?0.55:0.32;
    for(let i=0;i<puffs;i++){
      const age=(t*0.0004+i*(exhaling?0.13:0.2))%1;
      const sx=ox+9*sc+Math.sin(age*6.5+i*1.7)*age*5*sc+age*7*sc;
      const sy=hy+3*sc-age*12*sc;
      const s=sc*(1+age*(exhaling?3.4:2.0));
      ctx.fillStyle="rgba(215,215,215,"+Math.max(0,(1-age))*puffAlpha+")";
      ctx.fillRect(Math.round(sx),Math.round(sy),Math.round(s),Math.round(s));
      ctx.fillStyle="rgba(255,255,255,"+Math.max(0,(1-age))*puffAlpha*0.5+")";
      ctx.fillRect(Math.round(sx+sc),Math.round(sy+sc),Math.ceil(sc),Math.ceil(sc));
    }
  }

  // poster wall: 3 campaign posters
  function drawPosterWall(ox,oy,sc,t){
    const Wd=22,Hd=14;
    pRect(ox,oy,Wd*sc,Hd*sc,"#b7bec4");
    pRect(ox,oy,Wd*sc,sc,"#dae1e7");
    for(let i=0;i<3;i++){
      const px=ox+2*sc+i*7*sc;
      pRect(px,oy+2*sc,5*sc,8*sc,PAL.posterPaper);
      pRect(px,oy+2*sc,5*sc,sc,PAL.posterFrame);
      pRect(px+sc,oy+3*sc,3*sc,3*sc,PAL.skin);
      pRect(px+sc,oy+6*sc,3*sc,2*sc,i===1?PAL.vanWinN:PAL.roofRed);
      pRect(px+sc,oy+9*sc,3*sc,sc,PAL.flagG);
    }
  }

  // =========================================================
  //  SCENE
  // =========================================================
  function drawStaticLayer(t){
    const L=layoutVars();
    if(!L) return;
    drawSky();

    // gentle confetti slips drift under the sky, behind everything else
    const sc2=isMobile?1.5:2.1;
    for(const p of papers) drawPaper(p.x,p.y,sc2,p.rot);

    // crisp hero flag, upper left
    let flagSc,flagX,flagY;
    if(isMobile){
      flagSc=Math.max(6,Math.min(9,Math.round(W*0.028)));
      flagX=Math.round(W*0.03);
      flagY=Math.round(H*0.045);
    }else{
      flagSc=Math.max(12,Math.min(20,Math.round(W*0.0102)));
      flagX=Math.round(W*0.03);
      flagY=Math.round(H*0.05);
    }
    drawFlag(flagX,flagY,flagSc,t);

    // ridges, meadow, road
    drawRidge(L,t);
    drawMeadow(L);

    // ---- village row: everything stands on the ridge line ----
    const ridgeLine=L.hillsTop+58;
    function stand(fn,x,base,h,sc){
      fn(x, ridgeLine+base-h*sc, sc);
    }
    if(isMobile){
      stand(drawSmallChurch,W*0.06,42,18,2.4);
      stand(drawRedChurch,W*0.34,52,15,2.6);
      stand(drawNevsky,W*0.62,34,22,2.2);
      stand(drawPodium,W*0.92,48,12,2.6);
    }else{
      stand(drawSmallChurch,W*0.075,58,18,3.4);
      stand(drawRedChurch,W*0.165,66,15,4.4);
      stand(drawNevsky,W*0.30,46,22,3.8);
      stand(drawMonument,W*0.425,84,17,4.2);
      stand(drawLion,W*0.545,58,15,4.6);
      stand(drawPodium,W*0.635,72,12,4.8);
      stand(drawBallotBox,W*0.72,86,12,4.6);
      stand(drawFortress,W*0.855,96,14,4.4);
      stand(drawSmallChurch,W*0.945,110,18,3.0);
    }

    // ---- meadow life ----
    drawSunflowers(L.meadowTop,t);
    drawRoseGardens(L.meadowTop,t);

    if(!isMobile){
      drawPosterWall(W*0.50,L.meadowTop-14*3.2+2,3.2,t);
      drawStorkPole(W*0.955,L.meadowTop+6,2.6,t);
      // bus stop + bench + rakia + smoker (left meadow, focal)
      const grassY=L.meadowTop-2;
      drawBusStop(W*0.145,grassY-16*3.6,3.6);
      drawRakia(W*0.145+3.2*3.6,grassY-4.4*3.6,3.0);
      const smokerSc=6.4;
      const smokerY=grassY-26*smokerSc+4;
      const smokerX=W*0.145+20*3.6-4;
      drawSmoker(smokerX,smokerY,smokerSc,t);
      drawSheep(W*0.66,grassY-8*2.4,2.4,t);

      // ---- bubble positioning (DOM, tail to mouth) ----
      const bubbleEl=document.getElementById("smoker-bubble");
      if(bubbleEl){
        const mouthX=smokerX+9*smokerSc;
        const mouthY=smokerY+4*smokerSc;
        const bubbleW2=bubbleEl.offsetWidth||280;
        const bubbleH2=bubbleEl.offsetHeight||46;
        let bx=mouthX-bubbleW2*0.45;
        let by=smokerY-bubbleH2-10;
        bx=Math.max(6,Math.min(W-bubbleW2-6,bx));
        by=Math.max(6,Math.min(H-bubbleH2-6,by));
        const titleEl=document.querySelector(".title-wrap");
        if(titleEl){
          const tr=titleEl.getBoundingClientRect();
          const sr=screen.getBoundingClientRect();
          const bxAbs=sr.left+bx,byAbs=sr.top+by;
          const overlap=!(bxAbs+bubbleW2<tr.left||bxAbs>tr.right||byAbs+bubbleH2<tr.top||byAbs>tr.bottom);
          if(overlap){
            by=Math.max(6,tr.top-sr.top-bubbleH2-16);
            bx=Math.max(6,Math.min(W-bubbleW2-6,mouthX-bubbleW2*0.35));
          }
        }
        bubbleEl.style.left=Math.round(bx)+"px";
        bubbleEl.style.top=Math.round(by)+"px";
        bubbleEl.style.display=screen.classList.contains("active")?"block":"none";
        const bob=Math.round(Math.sin(t*0.002)*1.5);
        bubbleEl.style.transform="translateY("+bob+"px)";
      }
    }else{
      const bubbleEl=document.getElementById("smoker-bubble");
      if(bubbleEl) bubbleEl.style.display="none";
    }

    drawMiniFlags(L,t);
  }

  // =========================================================
  //  ENTITIES
  // =========================================================
  let clouds=[],birds=[],papers=[],vans=[];
  function initEntities(){
    clouds=[];
    const cn=isMobile?2:4;
    for(let i=0;i<cn;i++){
      clouds.push({x:Math.random()*W*1.1-0.1*W,y:H*0.05+Math.random()*H*0.16,speed:9+Math.random()*13+(i%2?6:0),variant:i%3,sc:isMobile?2.2:3.4});
    }
    birds=[];
    const bn=isMobile?2:4;
    for(let i=0;i<bn;i++){
      birds.push({x:Math.random()*W,y:H*0.08+Math.random()*H*0.12,speed:28+Math.random()*24,offset:Math.random()*1000});
    }
    papers=[];
    const pn=isMobile?2:5;
    for(let i=0;i<pn;i++){
      papers.push({x:Math.random()*W,y:H*0.03+Math.random()*H*0.28,vy:10+Math.random()*12,vx:(Math.random()-0.5)*10,sway:Math.random()*Math.PI*2,swaySpeed:0.8+Math.random()*1.2,rot:0});
    }
    vans=[];
    const vn=isMobile?1:2;
    for(let i=0;i<vn;i++){
      vans.push({x:(i===0?-100:W*0.6+Math.random()*W*0.25),speed:42+Math.random()*20,dir:1});
    }
    if(vans.length===2){vans[1].dir=-1;vans[1].speed=34;vans[1].x=W+80;}
  }

  function update(dt,now){
    const s=dt/1000;
    for(const c of clouds){
      c.x+=c.speed*s;
      if(c.x>W+80){c.x=-80-Math.random()*40;c.y=H*0.05+Math.random()*H*0.16;}
    }
    for(const b of birds){
      b.x+=b.speed*s;
      if(b.x>W+20){b.x=-20;b.y=H*0.08+Math.random()*H*0.13;}
      b.offset+=s*6;
    }
    for(const p of papers){
      p.y+=p.vy*s;
      p.x+=p.vx*s+Math.sin(now*0.001*p.swaySpeed+p.sway)*0.5;
      p.rot=Math.sin(now*0.001*p.swaySpeed+p.sway)*0.8;
      if(p.y>H*0.42){p.y=H*0.03;p.x=Math.random()*W;}
      if(p.x<-20)p.x=W+10;
      if(p.x>W+20)p.x=-10;
    }
    for(const v of vans){
      v.x+=v.speed*v.dir*s;
      if(v.dir===1&&v.x>W+100)v.x=-100;
      if(v.dir===-1&&v.x<-100)v.x=W+100;
    }
  }

  function drawFrame(t){
    const L=layoutVars();
    drawStaticLayer(t);
    const sc=isMobile?2.2:3.2;
    for(const c of clouds) drawCloud(c.x,c.y,c.sc||sc,c.variant);
    for(const b of birds){
      drawBird(b.x,b.y,isMobile?1.6:2.2,Math.floor(b.offset)%2);
    }
    const roadY=L.roadTop-12*(isMobile?1.8:3.2);
    for(const v of vans) drawVan(v.x,roadY,isMobile?1.8:3.2,t+v.x*1.2);
    if(!reduced){
      ctx.fillStyle="rgba(0,0,0,0.02)";
      for(let y=0;y<H;y+=4) ctx.fillRect(0,y,W,1);
    }
  }

  // =========================================================
  //  LOOP + BOOT
  // =========================================================
  let last=0,raf=0;
  const rAF=window.requestAnimationFrame||function(cb){return setTimeout(function(){cb(Date.now());},16);};
  const cAF=window.cancelAnimationFrame||clearTimeout;
  const nowFn=(window.performance&&window.performance.now)?function(){return window.performance.now();}:function(){return Date.now();};
  function loop(now){
    raf=rAF(loop);
    if(!W||!H) return;
    if(reduced){
      if(!needsDraw) return;
      try{drawFrame(now||0);}catch(e){recordBgErr(e);}
      needsDraw=false;
      return;
    }
    if(!screen.classList.contains("active")) return;
    const dt=now-last;
    const cap=isMobile?34:16;
    if(dt<cap) return;
    const useDt=Math.min(dt,100);
    last=now;
    try{update(useDt,now);}catch(e){recordBgErr(e);}
    try{drawFrame(now);}catch(e){recordBgErr(e);}
  }

  function boot(){
    canvas=document.getElementById("title-bg");
    screen=document.getElementById("screen-title");
    if(!canvas||!screen) return false;
    try{ctx=canvas.getContext("2d");}catch(_){return false;}
    if(!ctx) return false;
    try{ctx.imageSmoothingEnabled=false;}catch(_){}
    return true;
  }
  function start(){
    try{handleResize();}catch(_){}
    try{initEntities();}catch(_){}
    try{window.addEventListener("resize",handleResize);}catch(_){}
    try{drawFrame(0);}catch(_){}
    rAF(function(t){last=t||nowFn();loop(last);});
    try{
      const obs=new MutationObserver(function(){needsDraw=true;if(!reduced&&screen.classList.contains("active")){try{last=nowFn();}catch(_){last=Date.now();}}});
      obs.observe(screen,{attributes:true,attributeFilter:["class"]});
    }catch(_){}
    window.__titleBg={canvas,redraw:function(){try{drawFrame(nowFn());}catch(e){recordBgErr(e);}},resize:handleResize};
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
