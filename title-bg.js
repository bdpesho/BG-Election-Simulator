"use strict";
/* title-bg.js — animated 8-bit pixel background for #screen-title
   Pure code canvas, no assets. Medium parallax, mixed Bulgaria + election icons,
   tricolor sky, adaptive mobile / reduced-motion, behind opaque XP window.
   Inspired by https://www.shutterstock.com/shutterstock/photos/490056346 (Bulgaria pixel icons)
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
    // re-init positions that depend on W/H if needed
    try{ if(clouds.length) initEntities(true); }catch(_){}
    needsDraw = true;
  }

  // ----- pixel helpers -----
  function pRect(x,y,w,h,color){
    if(!color) return;
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), w, h);
  }
  function drawGrid(grid, pal, ox, oy, sc, wave, t){
    for(let r=0;r<grid.length;r++){
      const row=grid[r];
      let off = 0;
      if(wave) off = Math.round(Math.sin(t*0.003 + r*0.55)*sc*0.9);
      for(let c=0;c<row.length;c++){
        const ch=row[c];
        if(ch==="."||ch===" ") continue;
        const col=pal[ch];
        if(!col) continue;
        ctx.fillStyle=col;
        ctx.fillRect(Math.round(ox + c*sc + off), Math.round(oy + r*sc), sc, sc);
      }
    }
  }

  // ----- palettes -----
  const PAL = {
    // Bulgaria map
    mapG: "#7cc74f", mapGd: "#5fa038", mapS: "#4f8a2e", sofiaDot:"#ff1e1e",
    // flag
    flagW:"#ffffff", flagG:"#00966e", flagR:"#d62612", flagShadow:"#b0b0b0",
    // buildings
    wall:"#f0ece2", wallSh:"#d8d2c4", win:"#8a8f99", winLit:"#f7d88a",
    gold:"#ffcc33", goldSh:"#e6a823", goldDk:"#b87c0a",
    cross:"#ffcc33",
    churchTrim:"#a8c686",
    roofRed:"#c94a3a", roofRedDk:"#8e2f22", roofBrown:"#8b5a2b", roofBrownDk:"#5a3d1e",
    stone:"#9aa0a8", stoneDk:"#6e757d", stoneLi:"#c5c9cc",
    sky:"#6fa8dc", grass:"#6bb677", grassDk:"#4f9a5a", road:"#3d3d42", roadLine:"#f0f0f0", hillFar:"#4a6e8a",
    // priest
    skin:"#e8b98c", skinSh:"#d9a066", beard:"#8b4a1a", beardDk:"#5e3212",
    robe:"#1a1a1a", hat:"#0f0f0f", crossGold:"#ffd700", eye:"#2f5de2", eyeHi:"#ffffff",
    // election
    ballotWhite:"#ffffff", ballotBlue:"#2f6fd6", ballotGrey:"#c9c9c9", boxShadow:"#9a9a9a",
    vanWhite:"#f5f5f5", vanWin:"#5a8cc8", vanWinDk:"#2a5a9a", vanWheel:"#1a1a1a", vanWheelHi:"#5a5a5a",
    podiumWood:"#8b5a2b", podiumWoodDk:"#5e3d1e", mic:"#2b2b2b", micHi:"#7a7a7a",
    posterPaper:"#fffdf0", posterFrame:"#8d8d8d",
    roseRed:"#e53935", rosePink:"#ff8a80", roseGreen:"#3a9a3a", roseStem:"#4a6e2a",
    lionGold:"#c9981a", lionDark:"#8a6a0a",
    cloud:"#ffffff", cloudSh:"#dbe6f0", bird:"#1a1a1a",
    paper:"#ffffff", paperSh:"#e8e8e8"
  };

  // ----- procedural sprite draw functions -----
  // Flag wavy 28x14 (3 stripes 4+5+5)
  const FLAG_GRID=[
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "WWWWWWWWWWWWWWWWWWWWWWWWWWWW",
    "GGGGGGGGGGGGGGGGGGGGGGGGGGGG",
    "GGGGGGGGGGGGGGGGGGGGGGGGGGGG",
    "GGGGGGGGGGGGGGGGGGGGGGGGGGGG",
    "GGGGGGGGGGGGGGGGGGGGGGGGGGGG",
    "RRRRRRRRRRRRRRRRRRRRRRRRRRRR",
    "RRRRRRRRRRRRRRRRRRRRRRRRRRRR",
    "RRRRRRRRRRRRRRRRRRRRRRRRRRRR",
    "RRRRRRRRRRRRRRRRRRRRRRRRRRRR",
    "RRRRRRRRRRRRRRRRRRRRRRRRRRRR"
  ];
  const FLAG_PAL={W:PAL.flagW,G:PAL.flagG,R:PAL.flagR};

  function drawFlag(ox, oy, sc, t){
    drawGrid(FLAG_GRID, FLAG_PAL, ox, oy, sc, true, t);
    // pole
    pRect(ox - sc*2, oy - sc*3, sc, 14*sc + sc*6, "#8b5a2b");
    pRect(ox - sc*2, oy - sc*3, sc, sc, PAL.gold);
  }

  // Small but recognizable Bulgaria map as procedural polygon filled with pixels
  function drawBulgariaMap(ox, oy, sc, t){
    // base green block with stepped edges approximating Bulgaria silhouette
    // grid 36x16
    const MAP_GRID=[
      "....................................",
      "..GGGG...............................",
      ".GGGGGGG......GGGGGGGGGGG...........",
      "GGGGGGGGGGG.GGGGGGGGGGGGGGGGG.......",
      "GGGGGGGGGGGGGGGGGGGGGGGGGGGGGG......",
      "GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG....",
      "GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG....",
      "GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG.....",
      ".GGGGGGGGGGGGGGGGGGGGGGGGGGGGGG.....",
      ".GGGGGGGGGGGGGGGGGGGGGGGGGGGGG......",
      "..GGGGGGGGGGGGGGGGGGGGGGGGGGGG......",
      "...GGGGGGGGGGGGGGGGGGGGGGGGGG.......",
      ".....GGGGGGGGGGGGGGGGGGGGGG.........",
      ".......GGGGGGGGGGGGGGGG.............",
      ".........GGGGGGGG...................",
      "...................................."
    ];
    const pal={G:PAL.mapG};
    drawGrid(MAP_GRID, pal, ox, oy, sc, false, 0);
    // shadow edge (one pixel down-right for depth)
    for(let r=0;r<MAP_GRID.length;r++){
      const row=MAP_GRID[r];
      for(let c=0;c<row.length;c++) if(row[c]==="G"){
        // if neighbor down/right is empty, draw shadow
        const isEdge = (c===row.length-1 || row[c+1]===".") || (r===MAP_GRID.length-1 || MAP_GRID[r+1][c]===".");
        if(isEdge){
          ctx.fillStyle=PAL.mapGd+"55";
          ctx.fillRect(Math.round(ox + (c+0.6)*sc), Math.round(oy + (r+0.6)*sc), sc, sc);
        }
      }
    }
    // Sofia red dot (approx center-west)
    const sx = ox + 9*sc;
    const sy = oy + 7*sc;
    pRect(sx, sy, sc, sc, PAL.sofiaDot);
    pRect(sx, sy, sc, sc, "rgba(0,0,0,0.18)");
    // subtle float bob
    // outline pixel border for crispness
    // done
  }

  function drawNevsky(ox, oy, sc){
    const W=32, H=22;
    // base platform
    pRect(ox, oy+H*sc - 3*sc, W*sc, 3*sc, PAL.stone);
    pRect(ox, oy+H*sc - 2*sc, W*sc, 1*sc, PAL.stoneLi);
    // main white body
    pRect(ox+1*sc, oy+10*sc, (W-2)*sc, 9*sc, PAL.wall);
    // vertical window slits (4)
    for(let i=0;i<4;i++){
      const wx = ox+4*sc + i*7*sc;
      pRect(wx, oy+12*sc, sc, 4*sc, PAL.win);
      pRect(wx, oy+12*sc, sc, sc, "#5a5e66");
    }
    // side wings
    pRect(ox, oy+12*sc, 3*sc, 7*sc, PAL.wall);
    pRect(ox+W*sc-3*sc, oy+12*sc, 3*sc, 7*sc, PAL.wall);
    // windows side
    pRect(ox+1*sc, oy+14*sc, sc, 3*sc, PAL.win);
    pRect(ox+W*sc-2*sc, oy+14*sc, sc, 3*sc, PAL.win);
    // central entrance
    pRect(ox+13*sc, oy+15*sc, 6*sc, 4*sc, "#c2c2c2");
    pRect(ox+14*sc, oy+16*sc, 4*sc, 3*sc, "#6e6e6e");
    // upper central block under domes
    pRect(ox+8*sc, oy+8*sc, 16*sc, 4*sc, PAL.wall);
    // domes: left small, center large, right small — stepped pyramid for pixel dome
    function dome(cx, w, h){
      // w 6 or 10, h 5-6
      // bottom rect
      pRect(cx, oy+8*sc - h*sc + 1*sc, w*sc, 2*sc, PAL.gold);
      // stepped dome
      const steps = Math.floor(h*0.7);
      for(let s=0;s<steps;s++){
        const inset = s;
        const ww = w - inset*2;
        if(ww<=0) break;
        pRect(cx+inset*sc, oy+8*sc - h*sc + s*sc, ww*sc, sc, s===0?PAL.gold:PAL.gold);
        // shadow edge
        pRect(cx+inset*sc + ww*sc - sc, oy+8*sc - h*sc + s*sc, sc, sc, PAL.goldSh);
      }
      // drum
      pRect(cx+1*sc, oy+8*sc - 1*sc, (w-2)*sc, 1*sc, PAL.wallSh);
      // cross
      pRect(cx + Math.floor(w/2)*sc, oy+8*sc - h*sc -2*sc, sc, 2*sc, PAL.cross);
      pRect(cx + Math.floor(w/2)*sc - sc, oy+8*sc - h*sc -1*sc, 3*sc, sc, PAL.cross);
    }
    dome(ox+2*sc, 6, 5);
    dome(ox+11*sc, 10, 7);
    dome(ox+24*sc, 6, 5);
    // gold trim under domes
    pRect(ox+2*sc, oy+8*sc, 6*sc, sc, PAL.goldSh);
    pRect(ox+11*sc, oy+8*sc, 10*sc, sc, PAL.goldSh);
    pRect(ox+24*sc, oy+8*sc, 6*sc, sc, PAL.goldSh);
  }

  function drawSmallChurch(ox, oy, sc){
    // 24x18 white church with green trim + gold dome central
    const W=24,H=18;
    pRect(ox, oy+H*sc-2*sc, W*sc, 2*sc, PAL.grassDk);
    pRect(ox+2*sc, oy+8*sc, (W-4)*sc, 8*sc, PAL.wall);
    // left tower
    pRect(ox+2*sc, oy+4*sc, 6*sc, 12*sc, PAL.wall);
    pRect(ox+3*sc, oy+6*sc, 4*sc, 1*sc, PAL.churchTrim);
    pRect(ox+3*sc, oy+9*sc, 4*sc, 1*sc, PAL.churchTrim);
    // tower dome (small gold)
    pRect(ox+3*sc, oy+1*sc, 4*sc, 2*sc, PAL.gold);
    pRect(ox+4*sc, oy+0*sc, 2*sc, 1*sc, PAL.gold);
    pRect(ox+4*sc, oy-1*sc, 2*sc, 2*sc, PAL.cross);
    pRect(ox+3*sc, oy-1*sc, 4*sc, sc, PAL.cross);
    // main dome
    const cx = ox+14*sc;
    // drum
    pRect(cx, oy+3*sc, 8*sc, 3*sc, PAL.wall);
    pRect(cx+1*sc, oy+4*sc, 6*sc, 1*sc, PAL.win);
    // dome
    for(let s=0;s<4;s++){
      const w = 8 - s*2;
      pRect(cx+ s*sc, oy+1*sc + s*sc, w*sc, sc, PAL.gold);
      if(s>0) pRect(cx+ s*sc + w*sc - sc, oy+1*sc + s*sc, sc, sc, PAL.goldSh);
    }
    pRect(cx+3*sc, oy-1*sc, 2*sc, 2*sc, PAL.cross);
    pRect(cx+2*sc, oy, 4*sc, sc, PAL.cross);
    // green roofs
    pRect(ox+8*sc, oy+7*sc, 6*sc, 1*sc, PAL.churchTrim);
    pRect(ox+6*sc, oy+9*sc, 10*sc, 1*sc, PAL.churchTrim);
    pRect(ox+2*sc, oy+12*sc, (W-4)*sc, 1*sc, PAL.wallSh);
    // windows
    pRect(ox+9*sc, oy+11*sc, 2*sc, 2*sc, PAL.win);
    pRect(ox+13*sc, oy+11*sc, 2*sc, 2*sc, PAL.win);
    pRect(ox+17*sc, oy+11*sc, 2*sc, 2*sc, PAL.win);
  }

  function drawPriest(ox, oy, sc){
    // 10x20 chibi priest
    // hat
    pRect(ox+2*sc, oy, 6*sc, 5*sc, PAL.hat);
    pRect(ox+1*sc, oy+5*sc, 8*sc, 2*sc, PAL.hat);
    pRect(ox+1*sc, oy+2*sc, 8*sc, 1*sc, "#2a2a2a");
    // face
    pRect(ox+2*sc, oy+7*sc, 6*sc, 4*sc, PAL.skin);
    // eyes
    pRect(ox+3*sc, oy+8*sc, 1*sc, 1*sc, PAL.eye);
    pRect(ox+6*sc, oy+8*sc, 1*sc, 1*sc, PAL.eye);
    pRect(ox+3*sc, oy+8*sc, 1*sc, 1*sc, PAL.eyeHi); // highlight pixel inside? keep simple
    // beard
    pRect(ox+2*sc, oy+11*sc, 6*sc, 4*sc, PAL.beard);
    pRect(ox+3*sc, oy+12*sc, 4*sc, 2*sc, PAL.beardDk);
    // robe
    pRect(ox+1*sc, oy+15*sc, 8*sc, 5*sc, PAL.robe);
    // cross
    pRect(ox+4*sc, oy+16*sc, 2*sc, 3*sc, PAL.crossGold);
    pRect(ox+3*sc, oy+17*sc, 4*sc, 1*sc, PAL.crossGold);
    // hands small
    pRect(ox, oy+16*sc, 1*sc, 1*sc, PAL.skin);
    pRect(ox+9*sc, oy+16*sc, 1*sc, 1*sc, PAL.skin);
  }

  function drawFortress(ox, oy, sc){
    const W=28,H=14;
    // trees behind
    // left tree
    for(let r=0;r<6;r++){
      const ww = 6 - Math.floor(r/2);
      pRect(ox+2*sc - Math.floor((6-ww)/2)*sc, oy+2*sc + r*sc, ww*sc, sc, PAL.grass);
    }
    for(let r=0;r<7;r++){
      const ww = 7 - Math.floor(r/2.2);
      pRect(ox+20*sc - Math.floor((7-ww)/2)*sc, oy+1*sc + r*sc, ww*sc, sc, "#4a8a2a");
    }
    // main fortress brown
    pRect(ox+4*sc, oy+6*sc, 16*sc, 8*sc, PAL.roofBrown);
    pRect(ox+4*sc, oy+6*sc, 16*sc, 1*sc, PAL.roofBrownDk);
    // battlements
    for(let i=0;i<4;i++) pRect(ox+5*sc + i*4*sc, oy+5*sc, 2*sc, 1*sc, PAL.roofBrownDk);
    // tower
    pRect(ox+10*sc, oy+1*sc, 8*sc, 9*sc, PAL.roofBrown);
    pRect(ox+11*sc, oy, 6*sc, 2*sc, PAL.roofBrownDk);
    // windows
    pRect(ox+7*sc, oy+9*sc, 2*sc, 2*sc, "#3a2a1a");
    pRect(ox+13*sc, oy+4*sc, 2*sc, 2*sc, "#3a2a1a");
    // grass base
    pRect(ox, oy+H*sc, W*sc, 2*sc, PAL.grass);
    pRect(ox, oy+H*sc, W*sc, 1*sc, PAL.grassDk);
  }

  function drawMonument(ox, oy, sc){
    const W=14,H=18;
    // green base
    pRect(ox-2*sc, oy+H*sc, (W+4)*sc, 2*sc, PAL.grass);
    // monument grey tower narrowing upwards
    for(let r=0;r<H;r++){
      const inset = Math.floor(r*0.28);
      const w = W - inset*2;
      const y = oy + r*sc;
      const x = ox + inset*sc;
      const shade = r%3===0?PAL.stoneLi : (r%3===1?PAL.stone:PAL.stoneDk);
      // use vertical gradient: lighter at center, darker at edges
      pRect(x, y, w*sc, sc, shade);
      // vertical groove
      if(r>4 && r<H-4) pRect(x+ Math.floor(w/2)*sc, y, sc, sc, "#5a5e66");
    }
    // top crenellations
    pRect(ox+2*sc, oy, 2*sc, 1*sc, PAL.stoneDk);
    pRect(ox+10*sc, oy, 2*sc, 1*sc, PAL.stoneDk);
    pRect(ox+6*sc, oy-1*sc, 2*sc, 1*sc, PAL.stoneDk);
  }

  function drawRedChurch(ox, oy, sc){
    const W=24,H=18;
    // stone base striped
    for(let c=0;c<W;c+=4){
      pRect(ox+c*sc, oy+H*sc-3*sc, 2*sc, 3*sc, PAL.stoneLi);
      pRect(ox+c*sc+2*sc, oy+H*sc-3*sc, 2*sc, 3*sc, "#6e757d");
    }
    pRect(ox+4*sc, oy+H*sc-6*sc, (W-8)*sc, 1*sc, "#5a5e66");
    // red brick body
    pRect(ox+2*sc, oy+6*sc, (W-4)*sc, 7*sc, PAL.roofRed);
    pRect(ox+4*sc, oy+8*sc, (W-8)*sc, 1*sc, "#ff8a80");
    pRect(ox+2*sc, oy+10*sc, (W-4)*sc, 1*sc, "#ffab91");
    // cross pattern bricks
    for(let r=0;r<3;r++) for(let c=0;c<5;c++) pRect(ox+4*sc + c*4*sc, oy+7*sc + r*2*sc, 2*sc, sc, "#ffccbc");
    // upper beige drum
    pRect(ox+8*sc, oy+3*sc, 8*sc, 4*sc, "#d7c4a8");
    for(let i=0;i<4;i++) pRect(ox+9*sc + i*2*sc, oy+4*sc, sc, 2*sc, "#8d6e63");
    // cross on top
    pRect(ox+11*sc, oy, 2*sc, 3*sc, "#d7c4a8");
    pRect(ox+10*sc, oy+1*sc, 4*sc, 1*sc, "#d7c4a8");
  }

  function drawRose(ox, oy, sc){
    // stem
    pRect(ox+3*sc, oy+6*sc, 1*sc, 4*sc, PAL.roseStem);
    // leaves
    pRect(ox+1*sc, oy+7*sc, 2*sc, 1*sc, PAL.roseGreen);
    pRect(ox+4*sc, oy+8*sc, 2*sc, 1*sc, PAL.roseGreen);
    // flower 5x5
    pRect(ox+1*sc, oy+2*sc, 5*sc, 3*sc, PAL.roseRed);
    pRect(ox+2*sc, oy+1*sc, 3*sc, 1*sc, PAL.roseRed);
    pRect(ox+2*sc, oy+3*sc, 3*sc, 1*sc, PAL.rosePink);
    pRect(ox+2*sc, oy+4*sc, 1*sc, 1*sc, PAL.rosePink);
    pRect(ox+2*sc, oy, 3*sc, 1*sc, PAL.rosePink);
  }

  function drawLion(ox, oy, sc){
    // simplified lion shield: gold lion on red shield 12x14
    // shield shape
    pRect(ox+2*sc, oy+2*sc, 8*sc, 10*sc, PAL.flagR);
    pRect(ox+1*sc, oy+3*sc, 10*sc, 8*sc, PAL.flagR);
    pRect(ox+2*sc, oy+12*sc, 8*sc, 1*sc, PAL.flagR);
    pRect(ox+3*sc, oy+13*sc, 6*sc, 1*sc, PAL.flagR);
    pRect(ox+4*sc, oy+14*sc, 4*sc, 1*sc, PAL.flagR);
    // lion body gold simplified
    pRect(ox+4*sc, oy+5*sc, 4*sc, 4*sc, PAL.lionGold);
    pRect(ox+5*sc, oy+4*sc, 2*sc, 2*sc, PAL.lionGold);
    pRect(ox+3*sc, oy+6*sc, 1*sc, 2*sc, PAL.lionGold); // tail
    pRect(ox+8*sc, oy+7*sc, 1*sc, 2*sc, PAL.lionGold);
    pRect(ox+4*sc, oy+9*sc, 1*sc, 2*sc, PAL.lionGold);
    pRect(ox+7*sc, oy+9*sc, 1*sc, 2*sc, PAL.lionGold);
    // mane
    pRect(ox+4*sc, oy+4*sc, 4*sc, 1*sc, PAL.lionDark);
    // crown
    pRect(ox+5*sc, oy+3*sc, 2*sc, 1*sc, PAL.gold);
  }

  function drawBallotBox(ox, oy, sc){
    const W=12,H=10;
    // shadow
    pRect(ox+1*sc, oy+H*sc, W*sc, 1*sc, "rgba(0,0,0,0.18)");
    // box white
    pRect(ox, oy+2*sc, W*sc, H*sc, PAL.ballotWhite);
    pRect(ox, oy+2*sc, W*sc, 1*sc, PAL.boxShadow);
    // blue lid
    pRect(ox-1*sc, oy, (W+2)*sc, 3*sc, PAL.ballotBlue);
    pRect(ox-1*sc, oy, (W+2)*sc, 1*sc, "#5a8cc8");
    // slot
    pRect(ox+3*sc, oy+1*sc, 6*sc, 1*sc, "#0f1a2a");
    // ballot papers sticking out
    pRect(ox+4*sc, oy-2*sc, 4*sc, 3*sc, PAL.ballotWhite);
    pRect(ox+5*sc, oy-1*sc, 2*sc, 1*sc, PAL.flagG);
    pRect(ox+5*sc, oy, 2*sc, 1*sc, PAL.flagR);
    // tricolor stripe on box front
    pRect(ox+2*sc, oy+7*sc, 8*sc, 1*sc, PAL.flagW);
    pRect(ox+2*sc, oy+8*sc, 8*sc, 1*sc, PAL.flagG);
    pRect(ox+2*sc, oy+9*sc, 8*sc, 1*sc, PAL.flagR);
    // check mark
    pRect(ox+3*sc, oy+5*sc, 1*sc, 1*sc, PAL.flagG);
    pRect(ox+4*sc, oy+6*sc, 1*sc, 1*sc, PAL.flagG);
    pRect(ox+5*sc, oy+4*sc, 1*sc, 1*sc, PAL.flagG);
    pRect(ox+6*sc, oy+3*sc, 1*sc, 1*sc, PAL.flagG);
  }

  function drawPodium(ox, oy, sc){
    // 14x12 podium
    pRect(ox+2*sc, oy+6*sc, 10*sc, 6*sc, PAL.podiumWood);
    pRect(ox+2*sc, oy+6*sc, 10*sc, 1*sc, PAL.podiumWoodDk);
    pRect(ox+1*sc, oy+5*sc, 12*sc, 1*sc, PAL.podiumWood);
    // mic stand
    pRect(ox+7*sc, oy+2*sc, 1*sc, 4*sc, PAL.micHi);
    pRect(ox+6*sc, oy+1*sc, 3*sc, 2*sc, PAL.mic);
    pRect(ox+6*sc, oy+1*sc, 3*sc, 1*sc, "#9a9a9a");
    // small flag on podium
    pRect(ox+9*sc, oy+3*sc, 4*sc, 1*sc, PAL.flagW);
    pRect(ox+9*sc, oy+4*sc, 4*sc, 1*sc, PAL.flagG);
    pRect(ox+9*sc, oy+5*sc, 4*sc, 1*sc, PAL.flagR);
    // speaker front decoration
    pRect(ox+4*sc, oy+8*sc, 6*sc, 2*sc, "#d7c4a8");
    pRect(ox+5*sc, oy+8*sc, 4*sc, 1*sc, PAL.gold);
  }

  function drawPosterWall(ox, oy, sc){
    const W=22,H=14;
    // wall grey
    pRect(ox, oy, W*sc, H*sc, "#b0b8c0");
    pRect(ox, oy, W*sc, 1*sc, "#dbe3ec");
    // posters 3 across
    for(let i=0;i<3;i++){
      const px = ox+2*sc + i*7*sc;
      pRect(px, oy+2*sc, 5*sc, 8*sc, PAL.posterPaper);
      pRect(px, oy+2*sc, 5*sc, 1*sc, PAL.posterFrame);
      // candidate face pixel tiny
      const cx = px+1*sc;
      pRect(cx+1*sc, oy+3*sc, 3*sc, 3*sc, PAL.skin);
      pRect(cx+1*sc, oy+6*sc, 3*sc, 2*sc, i===1?PAL.vanWin:PAL.podiumWood);
      // slogan line
      pRect(px+1*sc, oy+9*sc, 3*sc, 1*sc, PAL.flagG);
    }
    // graffiti small
    // pRect()
  }

  function drawMegaphone(ox, oy, sc){
    // small 8x6
    pRect(ox+4*sc, oy+2*sc, 4*sc, 3*sc, "#c94a3a");
    pRect(ox+2*sc, oy+3*sc, 2*sc, 1*sc, "#f5f5f5");
    pRect(ox, oy+3*sc, 2*sc, 1*sc, PAL.mic);
  }

  function drawVan(ox, oy, sc, t){
    const W=28,H=10;
    // body
    pRect(ox, oy+2*sc, W*sc, 6*sc, PAL.vanWhite);
    pRect(ox, oy+2*sc, W*sc, 1*sc, "#ffffff");
    pRect(ox, oy+7*sc, W*sc, 1*sc, PAL.boxShadow);
    // windows
    pRect(ox+2*sc, oy+3*sc, 6*sc, 3*sc, PAL.vanWin);
    pRect(ox+9*sc, oy+3*sc, 6*sc, 3*sc, PAL.vanWin);
    pRect(ox+16*sc, oy+3*sc, 5*sc, 3*sc, PAL.vanWinDk);
    // tricolor stripe
    pRect(ox, oy+6*sc, W*sc, sc, PAL.flagW);
    pRect(ox, oy+7*sc, W*sc, sc, PAL.flagG); // actually already shadow but overlay
    // correct: we already used 7 as shadow, shift
    // redo stripe clean: use 6 as line
    pRect(ox+1*sc, oy+6*sc, (W-2)*sc, sc, PAL.flagG);
    // red bottom edge is shadow already; add red one pixel above wheels
    // wheels
    const wheelY = oy+8*sc;
    const wobble = Math.floor(Math.abs(Math.sin(t*0.012))*0); // not needed
    // left wheel
    pRect(ox+4*sc, wheelY, 4*sc, 3*sc, PAL.vanWheel);
    pRect(ox+5*sc, wheelY+1*sc, 2*sc, 1*sc, PAL.vanWheelHi);
    // right wheel
    pRect(ox+19*sc, wheelY, 4*sc, 3*sc, PAL.vanWheel);
    pRect(ox+20*sc, wheelY+1*sc, 2*sc, 1*sc, PAL.vanWheelHi);
    // wheel spin indicator: small white pixel rotating
    const spin = Math.floor(t*0.02)%4;
    const lx = ox+5*sc + (spin%2?1:0)*sc;
    const ly = wheelY+1*sc + (spin>1?1:0)*sc;
    pRect(lx, ly, sc, sc, "#ffffff");
    const rx = ox+20*sc + (spin%2?1:0)*sc;
    pRect(rx, ly, sc, sc, "#ffffff");
    // flag on top
    pRect(ox+12*sc, oy, 1*sc, 2*sc, "#8b5a2b");
    pRect(ox+13*sc, oy, 5*sc, 2*sc, PAL.flagW);
    pRect(ox+13*sc, oy+1*sc, 5*sc, 1*sc, PAL.flagG);
    // text "121"
    pRect(ox+9*sc, oy+4*sc, 1*sc, 1*sc, PAL.flagR);
    pRect(ox+11*sc, oy+4*sc, 1*sc, 1*sc, PAL.flagR);
  }

  function drawCloud(ox, oy, sc, variant){
    // variant 0,1,2 different shapes pixel clusters
    const shapes = [
      // small puff 12x5
      [
        "....YYYY....",
        "..YYYYYYYY..",
        ".YYYYYYYYYY.",
        "YYYYYYYYYYYY",
        "..YYYYYYYY.."
      ],
      [
        ".....YY.....",
        "...YYYYYY...",
        "..YYYYYYYY..",
        ".YYYYYYYYYY.",
        "YYYYYYYYYYYY"
      ],
      [
        "...YYYY...",
        ".YYYYYYYY.",
        "YYYYYYYYYY",
        ".YYYYYYYY.",
        "...YYYY..."
      ]
    ];
    const g = shapes[variant%shapes.length];
    const pal={Y:PAL.cloud, y:PAL.cloudSh};
    // draw with slight shadow offset
    for(let r=0;r<g.length;r++){
      for(let c=0;c<g[r].length;c++){
        if(g[r][c]==="Y"){
          ctx.fillStyle=PAL.cloud;
          ctx.fillRect(Math.round(ox + c*sc), Math.round(oy + r*sc), sc, sc);
          // shadow pixel one down-right occasionally
          if((r+c)%5===0){
            ctx.fillStyle=PAL.cloudSh;
            ctx.fillRect(Math.round(ox + c*sc + sc*0.4), Math.round(oy + r*sc + sc*0.4), sc*0.6, sc*0.6);
          }
        }
      }
    }
  }

  function drawBird(ox, oy, sc, frame){
    // 7x4 bird silhouette two frames flapping
    if(frame%2===0){
      pRect(ox, oy+1*sc, 3*sc, 1*sc, PAL.bird);
      pRect(ox+3*sc, oy, 1*sc, 1*sc, PAL.bird);
      pRect(ox+4*sc, oy+1*sc, 3*sc, 1*sc, PAL.bird);
    } else {
      pRect(ox, oy, 2*sc, 1*sc, PAL.bird);
      pRect(ox+2*sc, oy+1*sc, 3*sc, 1*sc, PAL.bird);
      pRect(ox+5*sc, oy, 2*sc, 1*sc, PAL.bird);
    }
  }

  function drawPaper(ox, oy, sc, rot){
    // 4x5 paper with slight rotation via offset
    // rot -1..1 sway
    const dx = Math.round(rot*sc*1.2);
    ctx.fillStyle=PAL.paper;
    ctx.fillRect(Math.round(ox+dx), Math.round(oy), 4*sc, 5*sc);
    ctx.fillStyle=PAL.paperSh;
    ctx.fillRect(Math.round(ox+dx+4*sc), Math.round(oy+1*sc), sc, 3*sc);
    // tricolor line on paper
    ctx.fillStyle=PAL.flagG;
    ctx.fillRect(Math.round(ox+dx+1*sc), Math.round(oy+2*sc), 2*sc, sc);
    ctx.fillStyle=PAL.flagR;
    ctx.fillRect(Math.round(ox+dx+1*sc), Math.round(oy+3*sc), 2*sc, sc);
  }

  function drawGroundAndRoad(){
    const groundH = Math.round(H*0.18);
    const roadH = Math.round(H*0.055);
    const grassY = H - groundH;
    const roadY = H - roadH - 4;
    // grass
    pRect(0, grassY, W, groundH, PAL.grass);
    // dither grass pixels darker
    ctx.fillStyle=PAL.grassDk;
    for(let x=0;x<W;x+=8){
      for(let y=grassY; y<grassY+6; y+=4){
        if(((x+y)*0.13)%1>0.6) ctx.fillRect(x+ ((x%16===0)?2:0), y, 4, 2);
      }
    }
    // road
    pRect(0, roadY, W, roadH, PAL.road);
    // road side lines
    pRect(0, roadY, W, 2, "#5a5a5a");
    pRect(0, roadY+roadH-2, W, 2, "#2a2a2e");
    // dashed center line
    const dash = 14, gap=12;
    const ymid = roadY + Math.floor(roadH/2)-1;
    for(let x=-dash; x<W+dash; x+=dash+gap){
      const seg = Math.min(dash, W - x);
      if(seg>0) pRect(x, ymid, seg, 2, PAL.roadLine);
    }
    // tricolor curb above road (pixel flag edge)
    const curbY = grassY - 3;
    pRect(0, curbY, W, 2, PAL.flagW);
    pRect(0, curbY+2, W, 2, PAL.flagG);
    pRect(0, curbY+4, W, 2, PAL.flagR);
  }

  // far hills / mountains parallax
  function drawFarMountains(t){
    // layered hills using stepped triangles pixelated
    const baseY = H*0.58;
    // far mountain dark silhouette
    ctx.fillStyle=PAL.hillFar;
    ctx.beginPath();
    ctx.moveTo(0, baseY);
    // jagged peaks pixel steps: create polygon with integer steps
    const peaks = [
      [0, baseY],
      [W*0.08, baseY-28],
      [W*0.14, baseY-18],
      [W*0.22, baseY-42],
      [W*0.30, baseY-22],
      [W*0.38, baseY-36],
      [W*0.46, baseY-18],
      [W*0.54, baseY-40],
      [W*0.64, baseY-20],
      [W*0.72, baseY-32],
      [W*0.82, baseY-16],
      [W*0.90, baseY-28],
      [W, baseY-14],
      [W, baseY],
      [0, baseY]
    ];
    for(let i=0;i<peaks.length;i++){
      if(i===0) ctx.moveTo(peaks[i][0], peaks[i][1]);
      else ctx.lineTo(peaks[i][0], peaks[i][1]);
    }
    ctx.closePath();
    ctx.fill();
    // pixelate edge: overlay one-pixel horizontal lines darker
    ctx.fillStyle="rgba(0,0,0,0.07)";
    for(let y=baseY-42; y<baseY; y+=3){
      ctx.fillRect(0, y, W, 1);
    }
    // tricolor haze on hill tops faint white-green-red dither
    // add small flag-colored snow caps on highest peaks
    const topPeaks = [W*0.22, W*0.54];
    for(const px of topPeaks){
      pRect(px-6, baseY-42 -2, 12, 2, "rgba(255,255,255,0.55)");
      pRect(px-4, baseY-42 -4, 8, 2, "rgba(255,255,255,0.35)");
    }
  }

  // ----- entities for animation -----
  let clouds=[], birds=[], papers=[], vans=[];
  let lastCloudSpawn=0;
  function initEntities(isResize){
    // keep existing velocities but reposition if resize and out of bounds
    if(clouds.length===0){
      const n = isMobile?2:4;
      clouds=[];
      for(let i=0;i<n;i++){
        clouds.push({
          x: Math.random()*W*1.2 - 0.1*W,
          y: H*0.12 + Math.random()*H*0.22,
          speed: 8 + Math.random()*14 + (i%2?6:0),
          variant: i%3,
          sc: isMobile?2:2
        });
      }
    } else if(isResize){
      // clamp y to new H
      for(const c of clouds) c.y = Math.min(c.y, H*0.38);
    }
    if(birds.length===0){
      const n = isMobile?3:5;
      birds=[];
      for(let i=0;i<n;i++){
        birds.push({
          x: Math.random()*W - 20,
          y: H*0.14 + Math.random()*H*0.18,
          speed: 32 + Math.random()*28,
          offset: Math.random()*1000
        });
      }
    } else if(isResize){
      for(const b of birds) b.y = Math.min(b.y, H*0.32);
    }
    if(papers.length===0){
      const n = isMobile?4:8;
      papers=[];
      for(let i=0;i<n;i++){
        papers.push({
          x: Math.random()*W,
          y: Math.random()*H*0.9 - H*0.1,
          vy: 18 + Math.random()*22,
          vx: (Math.random()-0.5)*18,
          sway: Math.random()*Math.PI*2,
          swaySpeed: 0.8+Math.random()*1.4,
          rot:0
        });
      }
    }
    if(vans.length===0){
      const n = isMobile?1:2;
      vans=[];
      for(let i=0;i<n;i++){
        vans.push({
          x: (i===0? -80 : W*0.5 + Math.random()*W*0.3),
          y: 0, // computed per frame
          speed: 45 + Math.random()*22,
          dir: 1
        });
      }
      // second van opposite on mobile hide, on desktop one opposite direction
      if(!isMobile && vans.length===2) vans[1].dir=-1, vans[1].speed=38, vans[1].x = W+60;
    }
  }

  // ----- scene drawing -----
  let needsDraw=true;
  function drawStaticLayer(t){
    // tricolor sky gradient
    // base sky: vertical gradient from near-white at top to muted tricolor near horizon
    const grad = ctx.createLinearGradient(0,0,0,H*0.65);
    grad.addColorStop(0, "#f1f4f8");
    grad.addColorStop(0.22, "#d8e8f0");
    grad.addColorStop(0.45, "#b9d4c2"); // greenish
    grad.addColorStop(0.70, "#d7b7b3"); // reddish haze near horizon
    grad.addColorStop(0.86, "#d9c2b8");
    ctx.fillStyle=grad;
    ctx.fillRect(0,0,W,H);

    // subtle pixel dither overlay for sky (checker 2px)
    ctx.fillStyle="rgba(255,255,255,0.04)";
    for(let y=0;y<H*0.55; y+=6){
      for(let x=(y%12===0?0:3); x<W; x+=12){
        ctx.fillRect(x, y, 2, 2);
      }
    }

    // far mountains
    drawFarMountains(t);

    // faint large Bulgaria map watermark behind title? place faintly top-left far
    // we will draw it again as static landmark later with higher opacity; this watermark is very faint
    ctx.globalAlpha=0.06;
    const mapSc = isMobile?1.6:2.2;
    drawBulgariaMap(W*0.06, H*0.06, mapSc, t);
    ctx.globalAlpha=1;

    // grid of static landmarks — positions chosen to avoid central title card
    // Top row — always above the centered XP window
    drawBulgariaMap(W*0.04, H*0.06, isMobile?1.3:1.9, t);
    drawNevsky(W*(isMobile?0.60:0.70), H*0.07, isMobile?1.4:1.9);
    drawFlag(W*0.06, H*(isMobile?0.14:0.22), isMobile?1.3:1.7, t);
    drawSmallChurch(W*(isMobile?0.34:0.42), H*0.11, isMobile?1.2:1.6);
    drawPriest(W*(isMobile?0.80:0.86), H*0.13, isMobile?1.4:1.9);
    // Bottom row — below the XP window (mobile window is taller, so push lower)
    const bottomY = H*(isMobile?0.68:0.50);
    drawRedChurch(W*0.03, bottomY - (isMobile?2:0), isMobile?1.3:1.7);
    drawFortress(W*(isMobile?0.28:0.34), bottomY + (isMobile?6:6), isMobile?1.3:1.8);
    drawMonument(W*(isMobile?0.72:0.78), bottomY + (isMobile?8:4), isMobile?1.3:1.7);
    // Additional election + cultural near bottom, just above grass/road
    const lowY = H*(isMobile?0.78:0.62);
    drawRose(W*0.02, lowY - (isMobile?6:0), isMobile?1.5:2.0);
    drawLion(W*0.90, lowY - (isMobile?4:2), isMobile?1.5:1.9);
    drawBallotBox(W*0.10, H*(isMobile?0.76:0.68), isMobile?1.5:2.0);
    drawPodium(W*(isMobile?0.62:0.72), H*(isMobile?0.74:0.66), isMobile?1.4:1.9);
    drawPosterWall(W*(isMobile?0.32:0.46), H*(isMobile?0.74:0.66), isMobile?1.2:1.6);
    drawMegaphone(W*0.78, H*(isMobile?0.80:0.74), isMobile?1.5:2.0);

    // ground and road
    drawGroundAndRoad();

    // decorative small flags on ground along road fence (tiny)
    for(let x= W*0.06; x< W*0.94; x+= 46){
      // skip where van is? just draw
      const fx = x;
      const fy = H*0.82;
      // tiny flag pole 6px
      pRect(fx, fy-8, 1, 8, "#7a4a2a");
      pRect(fx+1, fy-8, 4, 2, PAL.flagW);
      pRect(fx+1, fy-6, 4, 2, PAL.flagG);
      pRect(fx+1, fy-4, 4, 2, PAL.flagR);
    }
  }

  function update(dt, now){
    const s = dt/1000;
    // clouds
    for(const c of clouds){
      c.x += c.speed * s;
      if(c.x > W+80){ c.x = -80 - Math.random()*40; c.y = H*0.10 + Math.random()*H*0.22; }
    }
    // birds
    for(const b of birds){
      b.x += b.speed * s;
      if(b.x > W+20){ b.x = -20; b.y = H*0.12 + Math.random()*H*0.18; }
      b.offset += s*6;
    }
    // papers
    for(const p of papers){
      p.y += p.vy * s;
      p.x += p.vx * s + Math.sin(now*0.001* p.swaySpeed + p.sway)*0.6;
      p.rot = Math.sin(now*0.001* p.swaySpeed + p.sway)*0.9;
      if(p.y > H+20){ p.y = -20; p.x = Math.random()*W; }
      if(p.x < -20) p.x = W+10;
      if(p.x > W+20) p.x = -10;
    }
    // vans
    for(const v of vans){
      v.x += v.speed * v.dir * s;
      if(v.dir===1 && v.x > W+80) v.x = -90;
      if(v.dir===-1 && v.x < -80) v.x = W+80;
    }
  }

  function draw(t){
    // draw static layer each frame (cheap, or could cache but simple)
    drawStaticLayer(t);
    const sc = isMobile?2:2.5;
    // clouds (parallax mid)
    for(const c of clouds){
      drawCloud(c.x, c.y, sc, c.variant);
    }
    // birds
    for(const b of birds){
      const frame = Math.floor(b.offset)%2;
      drawBird(b.x, b.y, isMobile?1.8:2.2, frame);
    }
    // ballot papers falling (foreground)
    for(const p of papers){
      drawPaper(p.x, p.y, isMobile?1.6:1.9, p.rot);
    }
    // vans on road (foreground, fastest)
    const roadY = H - (H*0.055) - 4;
    for(const v of vans){
      const vy = roadY - 10* (isMobile?1.7:2.0);
      // flip for dir -1 ? draw mirrored? just draw normally but indicate
      if(v.dir===-1){
        // simple mirror by translating and scale -1? Easier: draw with same but indicate direction with flag mirrored
        // we will just draw normally; movement direction still indicates
      }
      drawVan(v.x, vy, isMobile?1.6:1.9, t + v.x*1.2);
      // dust puff behind van occasionally
      if(Math.floor(t*0.008 + v.x*0.03)%20===0){
        pRect(v.x - 6, vy+8, 3, 2, "rgba(120,120,120,0.25)");
      }
    }

    // subtle pixel scanline overlay for retro CRT feel very faint
    ctx.fillStyle="rgba(0,0,0,0.025)";
    for(let y=0;y<H;y+=4) ctx.fillRect(0,y,W,1);
    ctx.fillStyle="rgba(255,255,255,0.015)";
    for(let x=0;x<W;x+=4) ctx.fillRect(x,0,1,H);
  }

  // ----- animation loop -----
  let last=0;
  let raf=0;
  const rAF = window.requestAnimationFrame || function(cb){ return setTimeout(function(){ cb(Date.now()); }, 16); };
  const cAF = window.cancelAnimationFrame || clearTimeout;
  const nowFn = (window.performance && window.performance.now) ? function(){ return window.performance.now(); } : function(){ return Date.now(); };
  function loop(now){
    raf = rAF(loop);
    if(reduced){
      if(!needsDraw) return;
      // draw single static frame
      try{ draw(now||0); }catch(_){}
      needsDraw=false;
      return;
    }
    if(!screen.classList.contains("active")){
      // pause but keep listening; don't waste cpu
      return;
    }
    if(!W||!H) return;
    const dt = now - last;
    const cap = isMobile?34:16;
    if(dt < cap) return;
    // clamp large dt after tab switch
    const useDt = Math.min(dt, 100);
    last = now;
    try{ update(useDt, now); }catch(_){}
    try{ draw(now); }catch(_){}
  }

  function boot(){
    canvas = document.getElementById("title-bg");
    screen = document.getElementById("screen-title");
    if(!canvas || !screen) return false;
    try{ ctx = canvas.getContext("2d"); }catch(_){ return false; }
    if(!ctx) return false;
    try{ ctx.imageSmoothingEnabled = false; }catch(_){}
    return true;
  }
  function start(){
    try{ handleResize(); }catch(_){}
    try{ initEntities(false); }catch(_){}
    try{ window.addEventListener("resize", handleResize); }catch(_){}
    // draw first static frame immediately
    try{ draw(0); }catch(_){}
    // start loop after a tick to allow layout
    rAF(function(t){ last=t||nowFn(); loop(last); });
    // also observe screen class changes via MutationObserver to resume
    try{
      const obs = new MutationObserver(function(){ needsDraw=true; if(!reduced && screen.classList.contains("active")) { try{ last=nowFn(); }catch(_){ last=Date.now(); } } });
      obs.observe(screen, {attributes:true, attributeFilter:["class"]});
    }catch(_){}
    // expose for debugging / tests
    window.__titleBg = {canvas, redraw:function(){ try{ draw(nowFn()); }catch(_){ } }, resize:handleResize};
  }
  if(!boot()){
    if(document.readyState==="loading"){
      document.addEventListener("DOMContentLoaded", function onReady(){
        document.removeEventListener("DOMContentLoaded", onReady);
        if(boot()) start();
      });
    }
  } else {
    start();
  }
})();
