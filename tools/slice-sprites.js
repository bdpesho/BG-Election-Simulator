// T: slice assets out of pixelart1.png (guy, roses, cathedral, monument) into
// assets/sprites/*.png at native art-pixel resolution. Run: node tools/slice-sprites.js
const fs=require("fs");
const path=require("path");
const zlib=require("zlib");

const CRC_TABLE=(()=>{const t=[];for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0;}return t;})();
function crc32(b){let c=0xFFFFFFFF;for(const x of b)c=CRC_TABLE[(c^x)&255]^(c>>>8);return(c^0xFFFFFFFF)>>>0;}
function chunk(type,data){
  const len=Buffer.alloc(4);len.writeUInt32BE(data.length,0);
  const td=Buffer.concat([Buffer.from(type,"ascii"),data]);
  const crc=Buffer.alloc(4);crc.writeUInt32BE(crc32(td),0);
  return Buffer.concat([len,td,crc]);
}
function encodePNG(w,h,px){
  const ihdr=Buffer.alloc(13);
  ihdr.writeUInt32BE(w,0);ihdr.writeUInt32BE(h,4);ihdr[8]=8;ihdr[9]=6;ihdr[10]=0;ihdr[11]=0;ihdr[12]=0;
  const raw=Buffer.alloc(h*(1+w*4));
  for(let y=0;y<h;y++){
    const row=y*(1+w*4);raw[row]=0;
    for(let x=0;x<w;x++){
      const [r,g,b,a]=px(x,y),o=row+1+x*4;
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

// ---- decode the source sheet ----
function decodePNG(file){
  const buf=fs.readFileSync(file);
  let off=8,W=0,H=0,bpp=0,idat=[];
  while(off<buf.length){
    const len=buf.readUInt32BE(off),ts=buf.toString("ascii",off+4,off+8);
    if(ts==="IHDR"){W=buf.readUInt32BE(off+8);H=buf.readUInt32BE(off+12);bpp=buf[off+17]===6?4:3;}
    if(ts==="IDAT")idat.push(buf.slice(off+8,off+8+len));
    off+=12+len;
  }
  const raw=zlib.inflateSync(Buffer.concat(idat));
  const stride=W*bpp;
  const out=Buffer.alloc(H*stride);
  let pos=0;
  for(let y=0;y<H;y++){
    const f=raw[pos++];
    const row=y*stride,prev=(y-1)*stride;
    for(let x=0;x<stride;x++){
      const rv=raw[pos++];
      const a=x>=bpp?out[row+x-bpp]:0,b=y>0?out[prev+x]:0,c=(x>=bpp&&y>0)?out[prev+x-bpp]:0;
      let v;
      if(f===0)v=rv;
      else if(f===1)v=rv+a;
      else if(f===2)v=rv+b;
      else if(f===3)v=rv+((a+b)>>1);
      else{const p=a+b-c,pa=Math.abs(p-a),pb=Math.abs(p-b),pc=Math.abs(p-c);v=rv+(pa<=pb&&pa<=pc?a:(pb<=pc?b:c));}
      out[row+x]=v&255;
    }
  }
  return {W,H,bpp,px(x,y){const i=y*stride+x*bpp;return bpp===4?[out[i],out[i+1],out[i+2],out[i+3]]:[out[i],out[i+1],out[i+2],255];}};
}

const img=decodePNG(path.join(__dirname,"..","pixelart1.png"));
const img2=decodePNG(path.join(__dirname,"..","pixelart2.png"));
const imgC=decodePNG(path.join(__dirname,"..","ChatGPT Image Aug 28, 2026, 08_57_03 PM.png"));

// ---- crop region, flood-fill white bg transparent, downsample by f ----
function slice(SRC,name,x0,y0,x1,y1,f,dir){
  const w=x1-x0,h=y1-y0;
  const outDir=dir!==undefined?dir:"sprites";
  // flood fill region background (near-white or alpha<10) from all border pixels
  const bg=new Int8Array(w*h);
  const stack=[];
  function seed(x,y){ const i=(y-y0)*w+(x-x0); if(x>=x0&&x<x1&&y>=y0&&y<y1&&!bg[i]){ bg[i]=1; stack.push([x,y]); } }
  for(let x=x0;x<x1;x++){seed(x,y0);seed(x,y1-1);}
  for(let y=y0;y<y1;y++){seed(x0,y);seed(x1-1,y);}
  const isBg=(x,y)=>{
    const [r,g,b,a]=SRC.px(x,y);
    return a<20||(r>243&&g>243&&b>242);
  };
  while(stack.length){
    const [x,y]=stack.pop();
    const i=(y-y0)*w+(x-x0);
    for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
      const nx=x+dx,ny=y+dy;
      if(nx<x0||nx>=x1||ny<y0||ny>=y1)continue;
      const ni=(ny-y0)*w+(nx-x0);
      if(bg[ni])continue;
      if(isBg(nx,ny)){bg[ni]=1;stack.push([nx,ny]);}
    }
  }
  // downsample by f: majority color per block, else transparent if bg-dominant
  const dw=Math.ceil(w/f),dh=Math.ceil(h/f);
  const px=Array.from({length:dw*dh},()=>[0,0,0,0]);
  for(let by=0;by<dh;by++){
    for(let bx=0;bx<dw;bx++){
      const counts=new Map();
      let bgc=0;
      for(let dy=0;dy<f;dy++){
        for(let dx=0;dx<f;dx++){
          const sx=x0+bx*f+dx,sy=y0+by*f+dy;
          if(sx>=x1||sy>=y1)continue;
          const i=(sy-y0)*w+(sx-x0);
          if(bg[i]){bgc++;continue;}
          const[ r,g,b,a]=SRC.px(sx,sy);
          if(a<20){bgc++;continue;}
          const key=r+","+g+","+b;
          if(!counts.has(key))counts.set(key,[r,g,b,0]);
          counts.get(key)[3]++;
        }
      }
      let best=null,bestN=0,total=0;
      for(const v of counts.values()){total+=v[3];if(v[3]>bestN){bestN=v[3];best=v;}}
      if(best&&bestN>=Math.max(2,total*0.5)) px[by*dw+bx]=[best[0],best[1],best[2],255];
      else if(bestN>0) px[by*dw+bx]=[best[0],best[1],best[2],255];
      // else stays transparent
    }
  }
  // keep only the largest connected component (drops stray pixels from neighbors)
  {
    const seen=new Int8Array(dw*dh);
    let best=[],bestSize=0;
    for(let i=0;i<dw*dh;i++){
      if(seen[i]||px[i][3]===0)continue;
      const q=[i];seen[i]=1;const comp=[];
      while(q.length){
        const cur=q.pop();comp.push(cur);
        const x=cur%dw,y=(cur/dw)|0;
        for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
          const nx=x+dx,ny=y+dy;
          if(nx<0||nx>=dw||ny<0||ny>=dh)continue;
          const ni=ny*dw+nx;
          if(seen[ni]||px[ni][3]===0)continue;
          seen[ni]=1;q.push(ni);
        }
      }
      if(comp.length>bestSize){bestSize=comp.length;best=comp;}
    }
    for(let i=0;i<dw*dh;i++)if(px[i][3]!==0)px[i][3]=0;
    for(const i of best)px[i][3]=255;
  }
  const out=path.join(__dirname,"..","assets",outDir);
  fs.mkdirSync(out,{recursive:true});
  fs.writeFileSync(path.join(out,name+".png"),encodePNG(dw,dh,(x,y)=>px[y*dw+x]));
  console.log(name,dw+"x"+dh,"(sheet",w+"x"+h,"at f="+f+")");
  if(String(name).indexOf("cursor")===0){
    // print hotspot: centre of the topmost opaque run, +2 rows down
    for(let yy=0;yy<dh;yy++){
      let sum=0,n=0;
      for(let xx=0;xx<dw;xx++){ if(px[yy*dw+xx][3]>0){ sum+=xx; n++; } }
      if(n>0){ console.log("  hotspot ≈", Math.round(sum/n), yy+2); break; }
    }
  }
}

// bounding boxes measured on the 1448x1086 sheets (may adjust if sheets change)
slice(img,"smoker",174,38,514,600,2);          // guy in neutral smoking pose
slice(img,"rose-red",650,132,859,484,2);
slice(img,"rose-pink",1035,132,1284,560,2);
slice(img,"cathedral",69,600,752,1020,2);
slice(img,"monument",845,600,1390,1017,2);
slice(img2,"booth",191,177,530,543,2);         // voting booth w/ tricolor curtain
slice(img2,"house",760,43,1419,543,2);         // traditional two-storey house
slice(img2,"car",88,543,681,1013,2);           // beige sedan
slice(img2,"cow",760,543,1326,1020,2);         // horned cow with bell
// cursor set (sheet from the user): arrow, pointing hand, pinching hand
slice(imgC,"cursor-arrow",71,423,298,640,8,"");
slice(imgC,"cursor-hand",469,447,755,660,9,"");
slice(imgC,"cursor-pinch",916,514,1174,660,8,"");
