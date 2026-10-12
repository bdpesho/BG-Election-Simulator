// Generate the retro Windows-XP-style cursor set as pixel-perfect PNGs at 1x, 2x and 3x.
// Each cursor is hand-drawn below as a character grid; every output pixel is a hard
// nearest-neighbour block, so cursors stay razor-sharp on any display density.
// Run: node tools/gen-cursors.js   (writes assets/cursors/*.png)
//
// Cursor size rule: every 1x cursor is <= 32x32 CSS px. Chromium refuses custom cursors
// bigger than that near the browser UI and silently falls back to the system arrow.
"use strict";
const fs=require("fs");
const path=require("path");
const zlib=require("zlib");

const CRC_TABLE=(()=>{const t=[];for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0;}return t;})();
function crc32(buf){let c=0xFFFFFFFF;for(const b of buf)c=CRC_TABLE[(c^b)&255]^(c>>>8);return (c^0xFFFFFFFF)>>>0;}
function chunk(type,data){
  const len=Buffer.alloc(4);len.writeUInt32BE(data.length,0);
  const td=Buffer.concat([Buffer.from(type,"ascii"),data]);
  const crc=Buffer.alloc(4);crc.writeUInt32BE(crc32(td),0);
  return Buffer.concat([len,td,crc]);
}
function encodePNG(w,h,px){
  const ihdr=Buffer.alloc(13);
  ihdr.writeUInt32BE(w,0);ihdr.writeUInt32BE(h,4);ihdr[8]=8;ihdr[9]=6;
  const raw=Buffer.alloc(h*(1+w*4));
  for(let y=0;y<h;y++){
    raw[y*(1+w*4)]=0;
    px.copy(raw,y*(1+w*4)+1,y*w*4,(y+1)*w*4);
  }
  return Buffer.concat([
    Buffer.from([137,80,78,71,13,10,26,10]),
    chunk("IHDR",ihdr),
    chunk("IDAT",zlib.deflateSync(raw,{level:9})),
    chunk("IEND",Buffer.alloc(0))
  ]);
}

// palette: X outline, W white, g light grey shade, d mid grey, B wood, b dark wood,
// S sand, s sand shade, R red, G green, . transparent. Shadow is added automatically.
const PAL={
  X:[0,0,0,255], W:[255,255,255,255], g:[214,214,214,255], d:[150,150,150,255],
  B:[150,96,44,255], b:[96,58,24,255], S:[240,196,84,255], s:[204,152,48,255],
  R:[214,38,18,255], G:[0,150,110,255]
};
const SHADOW=[0,0,0,90];

const CURSORS={
  // classic XP arrow, hotspot = tip
  arrow:{hot:[0,0],grid:[
    "X...........",
    "XX..........",
    "XWX.........",
    "XWWX........",
    "XWWWX.......",
    "XWWWWX......",
    "XWWWWWX.....",
    "XWWWWWWX....",
    "XWWWWWWWX...",
    "XWWWWWWWWX..",
    "XWWWWWWWWWX.",
    "XWWWWWWXXXXX",
    "XWWWXWWX....",
    "XWWX.XWWX...",
    "XWX..XWWX...",
    "XX....XWWX..",
    "X.....XWWX..",
    ".......XWWX.",
    ".......XWWX.",
    "........XX.."
  ]},
  // XP "link select" hand, hotspot = index fingertip
  hand:{hot:[5,0],grid:[
    ".....XX..........",
    "....XWWX.........",
    "....XWWX.........",
    "....XWWX.........",
    "....XWWX.........",
    "....XWWXXX.......",
    "....XWWXWWXXX....",
    "....XWWXWWXWWXX..",
    ".XX.XWWXWWXWWXWX.",
    "XWWXXWWWWWWWWXWWX",
    "XWWWXWWWWWWWWWWgX",
    ".XWWXWWWWWWWWWWgX",
    "..XWWWWWWWWWWWWgX",
    "..XWWWWWWWWWWWWgX",
    "...XWWWWWWWWWWgX.",
    "...XWWWWWWWWWWgX.",
    "....XWWWWWWWWWX..",
    "....XWWWWWWWWgX..",
    ".....XWWWWWWWgX..",
    ".....XXXXXXXXXX.."
  ]},
  // pressed hand: finger pushed down + little click rays; tip stays on the hotspot
  press:{hot:[5,4],grid:[
    "..X.......X......",
    "...X.....X.......",
    ".....X.X.........",
    ".................",
    ".....XX..........",
    "....XWWXXX.......",
    "....XWWXWWXXX....",
    "....XWWXWWXWWXX..",
    ".XX.XWWXWWXWWXWX.",
    "XWWXXWWWWWWWWXWWX",
    "XWWWXWWWWWWWWWWgX",
    ".XWWXWWWWWWWWWWgX",
    "..XWWWWWWWWWWWWgX",
    "..XWWWWWWWWWWWWgX",
    "...XWWWWWWWWWWgX.",
    "...XWWWWWWWWWWgX.",
    "....XWWWWWWWWWX..",
    "....XWWWWWWWWgX..",
    ".....XWWWWWWWgX..",
    ".....XXXXXXXXXX.."
  ]},
  // open palm for draggable things (political compass)
  grab:{hot:[8,8],grid:[
    "......XX.XX......",
    "....XXWWXWWXX....",
    "...XWWXWWXWWXX...",
    "...XWWXWWXWWXWX..",
    ".XXXWWXWWXWWXWWX.",
    "XWWXWWXWWXWWXWWX.",
    "XWWXWWWWWWWWWWWX.",
    ".XWWWWWWWWWWWWgX.",
    ".XWWWWWWWWWWWWgX.",
    "..XWWWWWWWWWWWgX.",
    "..XWWWWWWWWWWgX..",
    "...XWWWWWWWWWgX..",
    "....XWWWWWWWgX...",
    "....XWWWWWWWgX...",
    "....XXXXXXXXXX..."
  ]},
  // closed fist while dragging
  grabbing:{hot:[8,6],grid:[
    ".................",
    ".................",
    ".....XX.XX.XX....",
    "....XWWXWWXWWXX..",
    "...XXWWXWWXWWXWX.",
    "..XWXWWWWWWWWXWX.",
    "..XWWWWWWWWWWWgX.",
    "...XWWWWWWWWWWgX.",
    "...XWWWWWWWWWWgX.",
    "....XWWWWWWWWgX..",
    "....XWWWWWWWWgX..",
    ".....XXXXXXXXX..."
  ]},
  // map crosshair: black cross with a white halo so it reads on any district colour
  cross:{hot:[9,9],gen:function(){
    const N=19,c=9,g=[];
    for(let y=0;y<N;y++){let r="";for(let x=0;x<N;x++){
      const onV=x===c&&(y<=c-3||y>=c+3), onH=y===c&&(x<=c-3||x>=c+3);
      const halo=(Math.abs(x-c)===1&&(y<=c-2||y>=c+2)&&y>=0)||(Math.abs(y-c)===1&&(x<=c-2||x>=c+2));
      const capV=x===c&&(y===c-2||y===c+2), capH=y===c&&(x===c-2||x===c+2);
      const dot=x===c&&y===c, ring=Math.abs(x-c)+Math.abs(y-c)===1;
      r+=(onV||onH||dot)?"X":(halo||capV||capH||ring)?"W":".";
    }g.push(r);}
    return g;
  }},
  // XP hourglass for busy states
  busy:{hot:[6,9],grid:[
    "XXXXXXXXXXXXX",
    "XbBBBBBBBBBbX",
    "XXXXXXXXXXXXX",
    ".XWWWWWWWWWX.",
    ".XWSSSSSSSWX.",
    ".XWsSSSSSsWX.",
    "..XWsSSSsWX..",
    "...XWsSsWX...",
    "....XWSWX....",
    ".....XSX.....",
    "....XWSWX....",
    "...XWWSWWX...",
    "..XWWWSWWWX..",
    ".XWWWsSsWWWX.",
    ".XWWsSSSsWWX.",
    ".XWsSSSSSsWX.",
    "XXXXXXXXXXXXX",
    "XbBBBBBBBBBbX",
    "XXXXXXXXXXXXX"
  ]}
};

function render(grid){
  // +1px each side for the drop shadow (offset 1,1)
  const h=grid.length, w=Math.max(...grid.map(r=>r.length));
  const W=w+1, H=h+1, px=Buffer.alloc(W*H*4);
  const at=(x,y)=>(grid[y]&&grid[y][x])||".";
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){
    const ch=at(x,y);let col=null;
    if(ch!=="."&&PAL[ch]) col=PAL[ch];
    else if(at(x-1,y-1)!=="."&&x>0&&y>0) col=SHADOW;
    if(col) col.forEach((v,i)=>{px[(y*W+x)*4+i]=v;});
  }
  return {w:W,h:H,px};
}
function scale(img,k){
  const W=img.w*k,H=img.h*k,px=Buffer.alloc(W*H*4);
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){
    img.px.copy(px,(y*W+x)*4,(((y/k|0)*img.w)+(x/k|0))*4,(((y/k|0)*img.w)+(x/k|0))*4+4);
  }
  return {w:W,h:H,px};
}

const out=path.join(__dirname,"..","assets","cursors");
fs.mkdirSync(out,{recursive:true});
const manifest={};
for(const name of Object.keys(CURSORS)){
  const def=CURSORS[name];
  const grid=def.grid||def.gen();
  const base=render(grid);
  if(base.w>32||base.h>32) throw new Error(name+" is larger than 32x32");
  for(const k of [1,2,3]){
    const img=k===1?base:scale(base,k);
    const file=name+(k===1?"":"@"+k+"x")+".png";
    fs.writeFileSync(path.join(out,file),encodePNG(img.w,img.h,img.px));
  }
  manifest[name]={size:[base.w,base.h],hotspot:def.hot};
  console.log("wrote "+name+" "+base.w+"x"+base.h+" hotspot "+def.hot.join(","));
}
fs.writeFileSync(path.join(out,"cursors.json"),JSON.stringify(manifest,null,2)+"\n");
