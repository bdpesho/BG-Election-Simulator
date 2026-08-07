// T18: generate assets/favicon.png (32x32) and assets/og.png (1200x630) with a pure-Node
// PNG encoder + a tiny hand-drawn 5x7 pixel font. Run: node tools/gen-assets.js
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
function encodePNG(w,h,getPixel){
  const ihdr=Buffer.alloc(13);
  ihdr.writeUInt32BE(w,0);ihdr.writeUInt32BE(h,4);ihdr[8]=8;ihdr[9]=6;ihdr[10]=0;ihdr[11]=0;ihdr[12]=0;
  const raw=Buffer.alloc(h*(1+w*4));
  for(let y=0;y<h;y++){
    const row=y*(1+w*4);raw[row]=0;
    for(let x=0;x<w;x++){
      const [r,g,b,a]=getPixel(x,y);
      const o=row+1+x*4;
      raw[o]=r;raw[o+1]=g;raw[o+2]=b;raw[o+3]=a;
    }
  }
  return Buffer.concat([
    Buffer.from([137,80,78,71,13,10,26,10]),
    chunk("IHDR",ihdr),
    chunk("IDAT",zlib.deflateSync(raw,{level:9})),
    chunk("IEND",Buffer.alloc(0))
  ]);
}

// ---- tiny 5x7 pixel font ----
const FONT={
  "1":["...#.","..##.",".#.#.","...#.","...#.","...#.",".###."],
  "2":[".###.","#...#","....#","...#.","..#..",".#...","#####"],
  "0":["#####","#...#","#..##","#.#.#","##..#","#...#","#####"],
  "T":["#####","..#..","..#..","..#..","..#..","..#..","..#.."],
  "O":[".###.","#...#","#...#","#...#","#...#","#...#",".###."],
  "W":["#...#","#...#","#...#","#...#","#.#.#","#.#.#",".#.#."],
  "I":[".###.","..#..","..#..","..#..","..#..","..#..",".###."],
  "N":["#...#","##..#","#.#.#","#..##","#...#","#...#","#...#"],
  "B":["####.","#...#","#...#","####.","#...#","#...#","####."],
  "U":["#...#","#...#","#...#","#...#","#...#","#...#",".###."],
  "L":["#....","#....","#....","#....","#....","#....","#####"],
  "G":[".###.","#...#","#....","#.###","#...#","#...#",".###."],
  "A":[".###.","#...#","#...#","#####","#...#","#...#","#...#"],
  "R":["####.","#...#","#...#","####.","#.#..","#..#.","#...#"],
  " ":[".....",".....",".....",".....",".....",".....","....."]
};
function textWidth(txt,scale){return txt.split("").reduce((a,ch)=>a+(7+(ch===" "?2:2))*scale,0)-2*scale;}
function drawText(setPixel,txt,x,y,scale,color){
  let cx=x;
  for(const ch of txt.toUpperCase()){
    const g=FONT[ch]||FONT[" "];
    for(let row=0;row<7;row++){
      for(let col=0;col<5;col++){
        if(g[row][col]==="#")for(let dy=0;dy<scale;dy++)for(let dx=0;dx<scale;dx++)setPixel(cx+col*scale+dx,y+row*scale+dy,color);
      }
    }
    cx+=(5+2)*scale;
  }
  return cx;
}

// ---- drawing helpers over an RGBA buffer ----
function makeBuffer(w,h,fill){const buf=Buffer.alloc(w*h*4);for(let i=0;i<buf.length;i+=4){buf[i]=fill[0];buf[i+1]=fill[1];buf[i+2]=fill[2];buf[i+3]=fill[3];}return{buf,w,h,set(x,y,c){if(x<0||y<0||x>=w||y>=h)return;const o=(y*w+x)*4;buf[o]=c[0];buf[o+1]=c[1];buf[o+2]=c[2];buf[o+3]=c[3];}};}

// ---- favicon: 32x32 Bulgarian flag + "121" ----
{
  const b=makeBuffer(32,32,[0,0,0,0]);
  const W=[255,255,255,255],G=[0,150,110,255],R=[214,38,18,255],INK=[20,20,25,255];
  for(let y=0;y<32;y++){
    const c=y<11?W:y<22?G:R;
    for(let x=0;x<32;x++)b.set(x,y,c);
  }
  drawText(b.set,"121",7,2,1,INK);
  fs.writeFileSync(path.join(__dirname,"..","assets","favicon.png"),encodePNG(32,32,(x,y)=>[b.buf[(y*32+x)*4],b.buf[(y*32+x)*4+1],b.buf[(y*32+x)*4+2],b.buf[(y*32+x)*4+3]]));
  console.log("wrote assets/favicon.png");
}

// ---- og image: 1200x630 flag bands + pixel title ----
{
  const W=1200,H=630;
  const b=makeBuffer(W,H,[0,0,0,0]);
  const WHITE=[255,255,255,255],GREEN=[0,150,110,255],RED=[214,38,18,255],INK=[20,20,25,255];
  for(let y=0;y<H;y++){
    const c=y<H/3?WHITE:y<2*H/3?GREEN:RED;
    for(let x=0;x<W;x++)b.set(x,y,c);
  }
  // top title on the white band
  const title="121 TO WIN";
  const scale=11;
  const tw=textWidth(title,scale);
  drawText(b.set,title,(W-tw)/2,96,scale,INK);
  // bottom line on the red band, white
  const sub="BULGARIA";
  const sw=textWidth(sub,9);
  drawText(b.set,sub,(W-sw)/2,H-180,9,[255,255,255,255]);
  // thin dark frame
  for(let x=0;x<W;x++){b.set(x,0,INK);b.set(x,H-1,INK);}
  for(let y=0;y<H;y++){b.set(0,y,INK);b.set(W-1,y,INK);}
  fs.writeFileSync(path.join(__dirname,"..","assets","og.png"),encodePNG(W,H,(x,y)=>{const o=(y*W+x)*4;return[b.buf[o],b.buf[o+1],b.buf[o+2],b.buf[o+3]];}));
  console.log("wrote assets/og.png");
}
