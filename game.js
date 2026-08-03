"use strict";

const ISSUES=[
  {id:"euro",name:"Eurozone Entry",lo:"Eurosceptic",hi:"Eurozone Now"},
  {id:"corruption",name:"Anticorruption Reform",lo:"Status Quo",hi:"Zero Tolerance"},
  {id:"energy",name:"Energy Subsidies",lo:"Free Market",hi:"State Subsidies"},
  {id:"judiciary",name:"Judicial Independence",lo:"Executive Control",hi:"Full Independence"}
];

const MINISTRIES=["Finance","Interior","Foreign Affairs","Justice","Energy","Health","Education","Defence","Agriculture","Transport","Economy","Culture","Environment","Labour & Social Policy","Tourism","Digital Governance"];

const DISTRICTS=[
  {id:"sofia-city",name:"Sofia City",short:"Sofia City",bg:"София (град)",seats:40,x:176,y:314,w:{euro:.30,corruption:.30,energy:.15,judiciary:.25},ideal:{euro:.85,corruption:.80,energy:.50,judiciary:.75},ent:1.08,lean:{ppdb:.14,gerb:.08,pb:.10}},
  {id:"sofia-obl",name:"Sofia Oblast",short:"Sofia Prov.",bg:"Софийска област",seats:9,x:245,y:296,w:{euro:.25,corruption:.25,energy:.30,judiciary:.20},ideal:{euro:.65,corruption:.55,energy:.60,judiciary:.50},ent:.92,lean:{gerb:.10}},
  {id:"plovdiv-city",name:"Plovdiv-Grad",short:"Plovdiv",bg:"Пловдив (град)",seats:17,x:397,y:390,w:{euro:.30,corruption:.25,energy:.20,judiciary:.25},ideal:{euro:.75,corruption:.65,energy:.50,judiciary:.60},ent:1.05,lean:{ppdb:.10,gerb:.08,pb:.06}},
  {id:"plovdiv-obl",name:"Plovdiv Oblast",short:"Plovdiv Prov.",bg:"Пловдивска област",seats:10,x:398,y:351,w:{euro:.25,corruption:.20,energy:.35,judiciary:.20},ideal:{euro:.60,corruption:.50,energy:.65,judiciary:.45},ent:.88,lean:{gerb:.08}},
  {id:"varna",name:"Varna",short:"Varna",bg:"Варна",seats:13,x:866,y:238,w:{euro:.35,corruption:.30,energy:.15,judiciary:.20},ideal:{euro:.80,corruption:.70,energy:.55,judiciary:.60},ent:1.04,lean:{ppdb:.12,gerb:.06,pb:.06}},
  {id:"burgas",name:"Burgas",short:"Burgas",bg:"Бургас",seats:11,x:799,y:343,w:{euro:.30,corruption:.25,energy:.25,judiciary:.20},ideal:{euro:.70,corruption:.60,energy:.60,judiciary:.50},ent:.98,lean:{gerb:.10}},
  {id:"blagoevgrad",name:"Blagoevgrad",short:"Blagoevgrad",bg:"Благоевград",seats:8,x:143,y:416,w:{euro:.25,corruption:.20,energy:.35,judiciary:.20},ideal:{euro:.60,corruption:.50,energy:.70,judiciary:.45},ent:.90,lean:{dps:.06,gerb:.06}},
  {id:"stara-zagora",name:"Stara Zagora",short:"Stara Zagora",bg:"Стара Загора",seats:9,x:523,y:353,w:{euro:.20,corruption:.20,energy:.40,judiciary:.20},ideal:{euro:.65,corruption:.50,energy:.80,judiciary:.45},ent:.92,lean:{bsp:.14}},
  {id:"pleven",name:"Pleven",short:"Pleven",bg:"Плевен",seats:9,x:371,y:207,w:{euro:.25,corruption:.25,energy:.30,judiciary:.20},ideal:{euro:.60,corruption:.55,energy:.60,judiciary:.50},ent:.88,lean:{bsp:.10}},
  {id:"ruse",name:"Ruse",short:"Ruse",bg:"Русе",seats:9,x:572,y:140,w:{euro:.30,corruption:.25,energy:.25,judiciary:.20},ideal:{euro:.75,corruption:.60,energy:.50,judiciary:.55},ent:.95,lean:{gerb:.08}},
  {id:"velikotarnovo",name:"Veliko Tarnovo",short:"V. Tarnovo",bg:"Велико Търново",seats:8,x:523,y:257,w:{euro:.25,corruption:.25,energy:.25,judiciary:.25},ideal:{euro:.65,corruption:.60,energy:.55,judiciary:.60},ent:.90,lean:{gerb:.08}},
  {id:"pazardzhik",name:"Pazardzhik",short:"Pazardzhik",bg:"Пазарджик",seats:8,x:328,y:388,w:{euro:.20,corruption:.20,energy:.40,judiciary:.20},ideal:{euro:.55,corruption:.50,energy:.70,judiciary:.45},ent:.86,lean:{dps:.08}},
  {id:"haskovo",name:"Haskovo",short:"Haskovo",bg:"Хасково",seats:7,x:512,y:428,w:{euro:.25,corruption:.20,energy:.35,judiciary:.20},ideal:{euro:.60,corruption:.55,energy:.60,judiciary:.50},ent:.88,lean:{bsp:.06}},
  {id:"shumen",name:"Shumen",short:"Shumen",bg:"Шумен",seats:7,x:718,y:228,w:{euro:.20,corruption:.20,energy:.40,judiciary:.20},ideal:{euro:.55,corruption:.45,energy:.70,judiciary:.40},ent:.84,lean:{dps:.10,aps:.06}},
  {id:"sliven",name:"Sliven",short:"Sliven",bg:"Сливен",seats:7,x:627,y:316,w:{euro:.20,corruption:.20,energy:.40,judiciary:.20},ideal:{euro:.50,corruption:.45,energy:.75,judiciary:.40},ent:.84,lean:{vaz:.12,velichie:.05}},
  {id:"dobrich",name:"Dobrich",short:"Dobrich",bg:"Добрич",seats:7,x:853,y:183,w:{euro:.20,corruption:.20,energy:.40,judiciary:.20},ideal:{euro:.55,corruption:.50,energy:.70,judiciary:.45},ent:.84,lean:{bsp:.08}},
  {id:"vratsa",name:"Vratsa",short:"Vratsa",bg:"Враца",seats:6,x:212,y:237,w:{euro:.20,corruption:.25,energy:.35,judiciary:.20},ideal:{euro:.50,corruption:.55,energy:.65,judiciary:.45},ent:.80,lean:{bsp:.12}},
  {id:"montana",name:"Montana",short:"Montana",bg:"Монтана",seats:6,x:162,y:206,w:{euro:.20,corruption:.20,energy:.40,judiciary:.20},ideal:{euro:.45,corruption:.50,energy:.70,judiciary:.40},ent:.78,lean:{bsp:.14}},
  {id:"kyustendil",name:"Kyustendil",short:"Kyustendil",bg:"Кюстендил",seats:5,x:81,y:376,w:{euro:.25,corruption:.20,energy:.35,judiciary:.20},ideal:{euro:.55,corruption:.50,energy:.65,judiciary:.45},ent:.82,lean:{gerb:.08}},
  {id:"pernik",name:"Pernik",short:"Pernik",bg:"Перник",seats:5,x:133,y:328,w:{euro:.20,corruption:.25,energy:.35,judiciary:.20},ideal:{euro:.55,corruption:.55,energy:.70,judiciary:.45},ent:.84,lean:{bsp:.12}},
  {id:"lovech",name:"Lovech",short:"Lovech",bg:"Ловеч",seats:5,x:386,y:248,w:{euro:.25,corruption:.20,energy:.35,judiciary:.20},ideal:{euro:.60,corruption:.50,energy:.60,judiciary:.50},ent:.84,lean:{bsp:.08}},
  {id:"gabrovo",name:"Gabrovo",short:"Gabrovo",bg:"Габрово",seats:5,x:478,y:287,w:{euro:.25,corruption:.25,energy:.25,judiciary:.25},ideal:{euro:.65,corruption:.60,energy:.55,judiciary:.55},ent:.88,lean:{ppdb:.06}},
  {id:"kardzhali",name:"Kardzhali",short:"Kardzhali",bg:"Кърджали",seats:5,x:484,y:473,w:{euro:.15,corruption:.15,energy:.50,judiciary:.20},ideal:{euro:.60,corruption:.40,energy:.80,judiciary:.40},ent:.90,lean:{dps:.30,aps:.18}},
  {id:"yambol",name:"Yambol",short:"Yambol",bg:"Ямбол",seats:4,x:652,y:346,w:{euro:.20,corruption:.20,energy:.40,judiciary:.20},ideal:{euro:.50,corruption:.45,energy:.70,judiciary:.40},ent:.80,lean:{vaz:.10,velichie:.05}},
  {id:"targovishte",name:"Targovishte",short:"Targovishte",bg:"Търговище",seats:4,x:627,y:231,w:{euro:.20,corruption:.20,energy:.40,judiciary:.20},ideal:{euro:.50,corruption:.45,energy:.70,judiciary:.40},ent:.80,lean:{dps:.14,aps:.08}},
  {id:"razgrad",name:"Razgrad",short:"Razgrad",bg:"Разград",seats:4,x:657,y:188,w:{euro:.20,corruption:.20,energy:.40,judiciary:.20},ideal:{euro:.50,corruption:.45,energy:.70,judiciary:.40},ent:.80,lean:{dps:.16,aps:.10}},
  {id:"silistra",name:"Silistra",short:"Silistra",bg:"Силистра",seats:4,x:768,y:101,w:{euro:.20,corruption:.20,energy:.40,judiciary:.20},ideal:{euro:.50,corruption:.45,energy:.70,judiciary:.40},ent:.78,lean:{vaz:.08}},
  {id:"smolyan",name:"Smolyan",short:"Smolyan",bg:"Смолян",seats:4,x:382,y:482,w:{euro:.25,corruption:.20,energy:.35,judiciary:.20},ideal:{euro:.60,corruption:.50,energy:.60,judiciary:.50},ent:.82,lean:{bsp:.06}},
  {id:"vidin",name:"Vidin",short:"Vidin",bg:"Видин",seats:4,x:109,y:120,w:{euro:.20,corruption:.25,energy:.35,judiciary:.20},ideal:{euro:.45,corruption:.55,energy:.65,judiciary:.45},ent:.76,lean:{bsp:.12}}
];
const DIST_BY_ID={};
DISTRICTS.forEach(d=>DIST_BY_ID[d.id]=d);

const AI_PARTIES=[
  {id:"gerb",name:"GERB",abbr:"GERB",color:"#0066b3",leader:"Boyko Borisov",ideo:"Center-right incumbent (GERB–SDS)",pos:{euro:.80,corruption:.45,energy:.50,judiciary:.40},appeal:.86,favMinistry:"Finance",topIssue:"euro"},
  {id:"pb",name:"Progresivna Balgariya",abbr:"PB",color:"#e67e22",leader:"Rumen Radev",ideo:"Centre-left populist, anti-oligarch",pos:{euro:.55,corruption:.85,energy:.75,judiciary:.70},appeal:.92,mainRival:true,favMinistry:"Justice",topIssue:"corruption"},
  {id:"ppdb",name:"Produlzhavame promyanata – Demokratichna Balgariya",abbr:"PP-DB",color:"#2fa84f",leader:"Assen Vassilev",ideo:"Reformist anti-corruption",pos:{euro:.90,corruption:.90,energy:.35,judiciary:.90},appeal:.80,favMinistry:"Justice",topIssue:"corruption"},
  {id:"dps",name:"Dvizhenie za prava i svobodi",abbr:"DPS",color:"#8e44ad",leader:"Delyan Peevski",ideo:"Minority interests",pos:{euro:.60,corruption:.35,energy:.75,judiciary:.40},appeal:.60,favMinistry:"Agriculture",topIssue:"energy"},
  {id:"vaz",name:"Vazrazhdane",abbr:"VRZ",color:"#e0a71e",leader:"Kostadin Kostadinov",ideo:"Nationalist, anti-EU",pos:{euro:.10,corruption:.60,energy:.60,judiciary:.30},appeal:.56,favMinistry:"Interior",topIssue:"euro"},
  {id:"bsp",name:"Bulgarska sotsialisticheska partiya – Obedinena levitsa",abbr:"BSP",color:"#e41e20",leader:"Krum Zarkov",ideo:"Socialist, centre-left",pos:{euro:.50,corruption:.55,energy:.85,judiciary:.50},appeal:.218,favMinistry:"Labour & Social Policy",topIssue:"energy"},
  {id:"itn",name:"Ima takav narod",abbr:"ITN",color:"#17a2b8",leader:"Slavi Trifonov",ideo:"National-conservative populist",pos:{euro:.45,corruption:.80,energy:.65,judiciary:.45},appeal:.227,favMinistry:"Health",topIssue:"corruption"},
  {id:"mech",name:"Morale, edinstvo, chest",abbr:"MECh",color:"#6d4c41",leader:"Radostin Vassilev",ideo:"Right-wing populist, anti-corruption",pos:{euro:.30,corruption:.75,energy:.60,judiciary:.45},appeal:.19,favMinistry:"Interior",topIssue:"corruption"},
  {id:"aps",name:"Alians za prava i svobodi",abbr:"APS",color:"#7f8c8d",leader:"Collective leadership",ideo:"Minority interests (DPS split)",pos:{euro:.60,corruption:.40,energy:.75,judiciary:.40},appeal:.17,favMinistry:"Agriculture",topIssue:"energy"},
  {id:"velichie",name:"Velichie",abbr:"VEL",color:"#34495e",leader:"Albena Pekova",ideo:"Far-right nationalist",pos:{euro:.15,corruption:.60,energy:.65,judiciary:.35},appeal:.12,favMinistry:"Energy",topIssue:"energy"}
];

const INCOMPAT_PAIRS=[["bsp","gerb"],["aps","dps"],["pb","dps"],["mech","dps"],["velichie","ppdb"],
  ["vaz","gerb"],["vaz","ppdb"],["vaz","bsp"],["vaz","dps"],["vaz","itn"],["vaz","mech"],["vaz","aps"],["vaz","velichie"],
  ["ppdb","dps"]];

const REL_MATRIX={
  gerb:{pb:-1,ppdb:-1,bsp:-2,dps:1,vaz:-2,itn:-1,mech:-1,aps:1,velichie:-1},
  pb:{gerb:-1,ppdb:1,bsp:1,dps:-2,vaz:-1,itn:0,mech:-1,aps:0,velichie:-1},
  ppdb:{gerb:-1,pb:1,bsp:0,dps:-2,vaz:-2,itn:0,mech:-1,aps:-1,velichie:-2},
  dps:{gerb:1,pb:-2,ppdb:-2,bsp:0,vaz:-2,itn:0,mech:-2,aps:-2,velichie:-1},
  vaz:{gerb:-2,pb:-1,ppdb:-2,bsp:-2,dps:-2,itn:-1,mech:1,aps:-1,velichie:1},
  bsp:{gerb:-2,pb:1,ppdb:0,dps:0,vaz:-2,itn:0,mech:-1,aps:0,velichie:-1},
  itn:{gerb:-1,pb:0,ppdb:0,dps:0,vaz:-1,bsp:0,mech:0,aps:0,velichie:0},
  mech:{gerb:-1,pb:-1,ppdb:-1,bsp:-1,dps:-2,vaz:1,itn:0,aps:0,velichie:1},
  aps:{gerb:1,pb:0,ppdb:-1,bsp:0,dps:-2,vaz:-1,itn:0,mech:0,velichie:0},
  velichie:{gerb:-1,pb:-1,ppdb:-2,bsp:-1,dps:-1,vaz:1,itn:0,mech:1,aps:0}
};

const DIFFS={easy:{cash:160000,aggr:.6},normal:{cash:120000,aggr:.85},hard:{cash:90000,aggr:1.15}};
const ELECTION_DATE="Sunday, 19 April";
const MAJORITY=121;
const TOTAL_SEATS=240;
const COSTS={rallySP:3,ad:12000,hq:40000,hqIncome:9000,stipend:6000,hqMax:8};
const SAVE_KEY="bulgaria-decides-save-v4";

const EMBLEM_IDS=["lion","star","rose","fist","sun","eagle","book","gear","flame","scales"];
const PALETTE=["#00966e","#2f6fd6","#d63a3a","#e0a71e","#8e44ad","#17a2b8","#e67e22","#2fa84f","#c2185b","#607d8b"];

/* ---- T4: pixel portrait system (24×24 grids, layered) ---- */
const SKIN_TONES=["#f7d5b3","#e8b98c","#d9a066","#c98a52","#8d5a3b","#5e3a24"];
const HAIR_COLORS=["#1c1c1c","#3b2a20","#5a3d2b","#8c5a2b","#c9a26b","#d8d8d8","#8a3324","#4a6a8a"];
const SUIT_COLORS=["#1b2a44","#2b2d42","#22304a","#14213d","#1b4332","#3a2e22","#4a2450","#8a1f1f","#22424a","#0f1f38"];
const SHIRT_COLORS=["#ffffff","#e8edf4","#f2d8c8","#dde8e8","#e6e0d0","#f0f0f0"];
const HAIR_STYLES=["short","side","long","bun","curly","buzz","bald"];
const HAIR_STYLE_NAMES={short:"Short",side:"Side part",long:"Long",bun:"Bun",curly:"Curly",buzz:"Buzz",bald:"Bald"};
const SUIT_STYLES=["classic","open","vest","blouse"];
const SUIT_STYLE_NAMES={classic:"Classic + tie",open:"Open collar",vest:"Vest",blouse:"Shirt only"};
const ETHNICITY_NAMES={bulgarian:"Bulgarian",turkish:"Turkish minority",roma:"Roma"};
const TURKISH_STRONG=["kardzhali","razgrad","targovishte","shumen"];
const NATIONALIST_STRONG=["sliven","yambol"];
const POVERTY_DISTRICTS=["vidin","montana","vratsa","silistra"];
const URBAN_DISTRICTS=["sofia-city","plovdiv-city","varna"];

const FACE_GRID=[
"........................",
"........................",
"........................",
"........KKKKKKKK........",
".......KKKKKKKKKK.......",
"......KKKKKKKKKKKK......",
".....KKKKKKKKKKKKKK.....",
".....KKKKKKKKKKKKKK.....",
".....KKKKKKKKKKKKKK.....",
".....KKKKKKKKKKKKKK.....",
".....KKKKKKKKKKKKKK.....",
".....KKKKKKKKKKKKKK.....",
".....KKKKKKKKKKKKKK.....",
"......KKKKKKKKKKKK......",
".......KKKKKKKKKK.......",
"........KKKKKKKK........",
".........KKKKKK.........",
".........KKKKKK........."
];
const FEATURES_GRIDS={
  male:[
"........................",
"........................",
"........................",
"........................",
"........................",
"........................",
"........................",
".......EE......EE.......",
".......EE......EE.......",
"...........NN...........",
"...........NN...........",
"...........NN...........",
".........MMMMMM.........",
"........................",
"........................",
"........................",
"........................",
"........................"
  ],
  female:[
"........................",
"........................",
"........................",
"........................",
"........................",
"........................",
"........................",
".......EE......EE.......",
".......EE......EE.......",
"...........NN...........",
"...........NN...........",
"...........NN...........",
"........MMMMMMMM........",
"........mmmmmmmm........",
"........................",
"........................",
"........................",
"........................"
  ]
};
const HAIR_GRIDS={
  short:[
"........................",
"........................",
"........HHHHHHHH........",
"......HHHHHHHHHHHH......",
".....HHHHHHHHHHHHHH.....",
"....HHHHHHHHHHHHHHHH....",
"....HHHHHHHHHHHHHHHH....",
"....HHH.........HHH.....",
"....HHH.........HHH....."
  ],
  side:[
"........................",
"........................",
".............HHHHHH.....",
"..........HHHHHHHHHH....",
"........HHHHHHHHHHHHHH..",
"....HHHHHHHHHHHHHHHH....",
"....HHHHHHHHHHHHHHHH....",
"....HHH.........HHH.....",
"....HHH.........HHH....."
  ],
  long:[
"........................",
"........................",
"........HHHHHHHH........",
"......HHHHHHHHHHHH......",
".....HHHHHHHHHHHHHH.....",
"....HHHHHHHHHHHHHHHH....",
"....HHHHHHHHHHHHHHHH....",
"...HHHH.........HHHH....",
"...HHHH.........HHHH....",
"...HHHH.........HHHH....",
"...HHHH.........HHHH....",
"...HHHH.........HHHH....",
"...HHHH.........HHHH....",
"....HHH.........HHH.....",
"....HHH.........HHH.....",
".....HH.........HH......"
  ],
  bun:[
"........................",
".........HHHHHH.........",
"........HHHHHHHH........",
".......HHHHHHHHHH.......",
"......HHHHHHHHHHHH......",
"....HHHHHHHHHHHHHHHH....",
"....HHHHHHHHHHHHHHHH....",
"....HHH.........HHH.....",
"....HHH.........HHH....."
  ],
  curly:[
"........................",
"........................",
"........HHHHHHHH........",
"......HHHHHHHHHHHH......",
".....HHHHHHHHHHHHHH.....",
"....HHHHHHHHHHHHHHHH....",
"....HHHHHHHHHHHHHHHH....",
"....HHH.........HHH....."
  ],
  buzz:[
"........................",
"........................",
"........................",
"........HHHHHHHH........",
".......HHHHHHHHHH.......",
".......HHHHHHHHHH.......",
".......HHHHHHHHHH......."
  ],
  bald:[
"........................",
"........................",
"........................",
"........................",
"............HH..........",
".........HH....HH......."
  ]
};
const SUIT_GRIDS={
  classic:[
"........TTTttTTT........",
".......TTTTttTTTT.......",
"......TTTTTttTTTTT......",
"......SSSSttSSSSSS......",
".....SSSSSSSSSSSSSS.....",
".....SSSSSSSSSSSSSS....."
  ],
  open:[
"........TTTTTTTT........",
".......TTTTTTTTTT.......",
".......TTTTTTTTTT.......",
".......TTSSSSSSSSTT.....",
"......SSSSSSSSSSSS......",
"......SSSSSSSSSSSS......"
  ],
  vest:[
"........TTTTTTTT........",
".......TTTTTTTTTT.......",
".......TTTTTTTTTT.......",
"......STTTTTTTTTTS......",
"......SSSSSSSSSSSS......",
"......SSSSSSSSSSSS......"
  ],
  blouse:[
"........TTTTTTTT........",
".......TTTTTTTTTT.......",
"......TTTTTTTTTTTT......",
"......TTTTTTTTTTTT......",
"......TTTTTTTTTTTT......",
"......TTTTTTTTTTTT......"
  ]
};
const PIXEL_FACE={W:24,H:24,FACE:FACE_GRID,FEATURES:FEATURES_GRIDS,HAIR:HAIR_GRIDS,SUIT:SUIT_GRIDS};

const FACES=[
  {bg:"#26547c",skin:2,hairColor:"#3b2a20",hairStyle:"short",suitColor:"#1b2a44",shirtColor:"#ffffff",suitStyle:"classic",gender:"male",glasses:false},
  {bg:"#3d5a80",skin:2,hairColor:"#22201c",hairStyle:"side",suitColor:"#22304a",shirtColor:"#e8edf4",suitStyle:"classic",gender:"male",glasses:true},
  {bg:"#5e548e",skin:1,hairColor:"#5a3d2b",hairStyle:"long",suitColor:"#2b2d42",shirtColor:"#f2d8c8",suitStyle:"blouse",gender:"female",glasses:false},
  {bg:"#26547c",skin:3,hairColor:"#4a3b2a",hairStyle:"bald",suitColor:"#14213d",shirtColor:"#ffffff",suitStyle:"classic",gender:"male",glasses:false},
  {bg:"#2d6a4f",skin:1,hairColor:"#6b4f2a",hairStyle:"bun",suitColor:"#1b4332",shirtColor:"#e6e0d0",suitStyle:"blouse",gender:"female",glasses:false},
  {bg:"#7f4f24",skin:4,hairColor:"#2b1d12",hairStyle:"curly",suitColor:"#3a2e22",shirtColor:"#ffffff",suitStyle:"open",gender:"male",glasses:true},
  {bg:"#4a4e69",skin:2,hairColor:"#8c5a2b",hairStyle:"long",suitColor:"#22223b",shirtColor:"#dde8e8",suitStyle:"vest",gender:"female",glasses:false},
  {bg:"#1d3557",skin:2,hairColor:"#777777",hairStyle:"short",suitColor:"#0f1f38",shirtColor:"#ffffff",suitStyle:"classic",gender:"male",glasses:false},
  {bg:"#355070",skin:1,hairColor:"#4b3621",hairStyle:"side",suitColor:"#1f2f46",shirtColor:"#e8edf4",suitStyle:"open",gender:"male",glasses:true},
  {bg:"#6d597a",skin:4,hairColor:"#1c1c1c",hairStyle:"bun",suitColor:"#2a2238",shirtColor:"#e6e0d0",suitStyle:"blouse",gender:"female",glasses:false}
];

const PRESET_LEADERS=[
  {name:"Elena Dimitrova",face:6,attrs:{stamina:5,charisma:7,intelligence:6},tag:"Reformist mayor",ethnicity:"bulgarian"},
  {name:"Georgi Ivanov",face:0,attrs:{stamina:8,charisma:5,intelligence:5},tag:"Former minister",ethnicity:"bulgarian"},
  {name:"Maria Stoyanova",face:2,attrs:{stamina:5,charisma:6,intelligence:7},tag:"Investigative journalist",ethnicity:"turkish"},
  {name:"Stefan Kolev",face:3,attrs:{stamina:6,charisma:6,intelligence:6},tag:"Business founder",ethnicity:"roma"}
];

const BGSTYLES=[
  (c1)=>"background:linear-gradient(160deg, "+c1+", "+shade(c1,.68)+")",
  (c1,c2)=>"background:repeating-linear-gradient(0deg, "+c1+" 0 26px, "+c2+" 26px 52px)",
  (c1,c2)=>"background:linear-gradient(115deg, "+c1+" 0 55%, "+c2+" 55%)",
  (c1,c2)=>"background:radial-gradient(circle at 30% 35%, "+c2+" 0%, "+c1+" 75%)",
  (c1,c2)=>"background:repeating-linear-gradient(45deg, "+c1+" 0 20px, "+c2+" 20px 40px)"
];
const BGSTYLE_NAMES=["Solid","Stripes","Diagonal split","Spotlight","Chevrons"];

const CELEBS=["Veselin Marinov","Azis","Kubrat Pulev","Grigor Dimitrov","Maria Ilieva","Ivo Arakov","Vasil Naydenov"];
const OUTLETS=["Nova TV","bTV","BNT 1","24 Chasa","Capital Daily","Dnevnik.bg","Bulgaria ON AIR"];

const MAP_CELL=8;
let CELL_PATHS_CACHE=null;
const RING_CACHE={};
function pathToRings(d){
  const tokens=d.match(/([MLZ]|-?\d+(?:\.\d+)?)/g);
  const rings=[];let cur=[];
  for(const t of tokens){
    if(t==="M"||t==="L")continue;
    if(t==="Z"){if(cur.length>=6)rings.push(cur);cur=[];continue;}
    cur.push(parseFloat(t));
  }
  return rings.map(r=>{const pts=[];for(let i=0;i<r.length-1;i+=2)pts.push([r[i],r[i+1]]);return pts;});
}
function ringsOf(d){
  if(!RING_CACHE[d])RING_CACHE[d]=pathToRings(REGION_PATHS[d]);
  return RING_CACHE[d];
}
function pointInPath(pt,d){
  const px=pt[0],py=pt[1];
  for(const ring of ringsOf(d)){
    let inside=false;
    for(let i=0,j=ring.length-1;i<ring.length;j=i++){
      const xi=ring[i][0],yi=ring[i][1],xj=ring[j][0],yj=ring[j][1];
      if(((yi>py)!==(yj>py))&&(px<(xj-xi)*(py-yi)/(yj-yi)+xi))inside=!inside;
    }
    if(inside)return true;
  }
  return false;
}
function computeCellPaths(){
  if(CELL_PATHS_CACHE)return CELL_PATHS_CACHE;
  const priority={"sofia-city":0,"plovdiv-city":1};
  const order=DISTRICTS.slice().sort((a,b)=>(priority[a.id]!==undefined?priority[a.id]:2)-(priority[b.id]!==undefined?priority[b.id]:2));
  const w=Math.ceil(MAP_VIEWBOX[2]/MAP_CELL),h=Math.ceil(MAP_VIEWBOX[3]/MAP_CELL);
  const owners=new Array(w*h).fill(null);
  const bboxes={};
  for(const d of order){
    let minX=1e9,minY=1e9,maxX=-1e9,maxY=-1e9;
    for(const ring of ringsOf(d.id))for(const p of ring){
      minX=Math.min(minX,p[0]);minY=Math.min(minY,p[1]);
      maxX=Math.max(maxX,p[0]);maxY=Math.max(maxY,p[1]);
    }
    bboxes[d.id]=[minX-1,minY-1,maxX+1,maxY+1];
  }
  const offs=[[0,0],[2,2],[2,6],[6,2],[6,6]];
  for(let gy=0;gy<h;gy++){
    for(let gx=0;gx<w;gx++){
      const cx=MAP_VIEWBOX[0]+gx*MAP_CELL,cy=MAP_VIEWBOX[1]+gy*MAP_CELL;
      let bestId=null,bestN=0;
      for(const d of order){
        const b=bboxes[d.id];
        if(cx+MAP_CELL<b[0]||cx>b[2]||cy+MAP_CELL<b[1]||cy>b[3])continue;
        let n=0;
        for(const off of offs){
          if(pointInPath([cx+off[0]+1,cy+off[1]+1],d.id))n++;
        }
        if(n>bestN){bestN=n;bestId=d.id;}
      }
      owners[gy*w+gx]=bestN>0?bestId:null;
    }
  }
  const paths={};
  let border="";
  const ownerAt=(gx,gy)=>(gx<0||gy<0||gx>=w||gy>=h)?null:owners[gy*w+gx];
  for(let gy=0;gy<h;gy++){
    for(let gx=0;gx<w;gx++){
      const id=owners[gy*w+gx];
      if(!id)continue;
      const x=MAP_VIEWBOX[0]+gx*MAP_CELL;
      const y=MAP_VIEWBOX[1]+gy*MAP_CELL;
      paths[id]=(paths[id]||"")+"M"+x+" "+y+"h"+MAP_CELL+"v"+MAP_CELL+"h-"+MAP_CELL+"z";
      if(ownerAt(gx+1,gy)!==id)border+="M"+(x+MAP_CELL)+" "+y+"L"+(x+MAP_CELL)+" "+(y+MAP_CELL);
      if(ownerAt(gx,gy+1)!==id)border+="M"+x+" "+(y+MAP_CELL)+"L"+(x+MAP_CELL)+" "+(y+MAP_CELL);
    }
  }
  CELL_PATHS_CACHE={cells:paths,borders:border};
  return CELL_PATHS_CACHE;
}
function labelPos(d){
  const lb=LABEL_POS[d.id];
  return lb?lb:[d.x,d.y-14,"m"];
}

let S=null;
let EVENT_POOL=[];

function freshState(){
  return {
    phase:"setup",setupStep:0,
    player:{name:"",face:0,photo:null,appearance:defaultAppearance(),attrs:{stamina:5,charisma:5,intelligence:5}},
    party:{name:"National Renewal Movement",abbr:"NRM",color:"#00966e",slogan:"Bulgaria, forward!",bgStyle:0,emblemIdx:0,logo:null,pos:{euro:.60,corruption:.60,energy:.60,judiciary:.60}},
    difficulty:"normal",
    week:1,cash:0,stamina:0,location:"sofia-city",selDistrict:"sofia-city",
    hq:{},boost:{},enthusiasm:{},modifiers:[],rel:{},touched:[],ralliesThisTurn:0,
    pollsPrev:null,pollNat:{},districtPoll:{},
    log:[],stats:{rallies:0,ads:0,hqs:0,travels:0},
    eventBag:[],eventCursor:0,paused:false,eventQueue:[],
    results:null,coalition:null,ending:null,
    cheat:false,cheatFloor:false
  };
}

const $=id=>document.getElementById(id);
function rng(){return Math.random();}
function rnd(a,b){return a+Math.floor(rng()*(b-a+1));}
function pick(arr){return arr[Math.floor(rng()*arr.length)];}
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));const t=a[i];a[i]=a[j];a[j]=t;}return a;}
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function fmtMoney(n){return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g," ")+" лв";}
function pct(x,dp){return (x*100).toFixed(dp===undefined?1:dp)+"%";}
function uid(){return Math.random().toString(36).slice(2,9);}
function svgEl(tag,attrs){const e=document.createElementNS("http://www.w3.org/2000/svg",tag);for(const k in attrs)e.setAttribute(k,attrs[k]);return e;}
function hexToRgb(h){h=h.replace("#","");if(h.length===3)h=h.split("").map(c=>c+c).join("");const n=parseInt(h,16);return[(n>>16)&255,(n>>8)&255,n&255];}
function shade(hex,f){const rgb=hexToRgb(hex).map(v=>clamp(Math.round(v*f),0,255));return "rgb("+rgb[0]+","+rgb[1]+","+rgb[2]+")";}
function contrast(hex){const rgb=hexToRgb(hex);return(rgb[0]*0.299+rgb[1]*0.587+rgb[2]*0.114)>150?"#101826":"#ffffff";}
function mulberry32(seed){
  let a=seed>>>0;
  return function(){
    a|=0;a=a+0x6D2B79F5|0;
    let t=Math.imul(a^a>>>15,1|a);
    t=t+Math.imul(t^t>>>7,61|t)^t;
    return((t^t>>>14)>>>0)/4294967296;
  };
}
function hashStr(s){
  let h=2166136261;
  for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}
  return h>>>0;
}
function pts(x){return (x*100).toFixed(1);}

function showScreen(name){
  document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
  $("screen-"+name).classList.add("active");
}

function partyOf(id){if(id==="player")return playerParty();return AI_PARTIES.find(p=>p.id===id);}
function partyName(p){return p.name===p.abbr?p.name:p.name+" ("+p.abbr+")";}
function playerParty(){return{id:"player",name:S.party.name,abbr:S.party.abbr,color:S.party.color,pos:S.party.pos,appeal:playerAppeal()};}
function playerAppeal(){return 0.74+(getAttr("charisma")+getAttr("intelligence"))*0.012;}
function allParties(){return[playerParty(),...AI_PARTIES];}

function getAttr(a){let v=S.player.attrs[a];for(const m of S.modifiers){const e=m.effects["attr_"+a];if(e)v+=e;}return clamp(v,1,12);}
function modSum(key){let v=0;for(const m of S.modifiers){if(m.effects[key])v+=m.effects[key];}return v;}
function getMaxStamina(){return 8+getAttr("stamina")+Math.round(modSum("maxStamina"));}
function addModifier(spec){
  S.modifiers.push({id:uid(),name:spec.name,desc:spec.desc,bad:!!spec.bad,expires:spec.turns?S.week+spec.turns:null,effects:spec.effects||{}});
}
function expireModifiers(){
  const kept=[],gone=[];
  for(const m of S.modifiers){if(m.expires&&m.expires<=S.week)gone.push(m);else kept.push(m);}
  S.modifiers=kept;
  for(const m of gone)log("Modifier expired: <b>"+esc(m.name)+"</b>.","info");
}

function issueAlign(p,d){
  let a=0;
  for(const i of ISSUES)a+=d.w[i.id]*(1-Math.abs(p.pos[i.id]-d.ideal[i.id]));
  return a;
}
function pollNoise(){return Math.max(.008,.024-getAttr("intelligence")*.0018);}
function pollNoiseFor(dId,pId){
  const base=pollNoise();
  const rnd=mulberry32(S.week*1000+hashStr(dId+":"+pId));
  let noise=(rnd()-.5)*2*base;
  if(S.hq&&S.hq[dId])noise*=0.5;
  return noise;
}
function districtShares(d,noisy){
  const ent=S.enthusiasm[d.id]!==undefined?S.enthusiasm[d.id]:d.ent;
  const scores={};
  for(const p of allParties()){
    let sc=(0.30+0.70*issueAlign(p,d))*p.appeal;
    const ln=d.lean&&d.lean[p.id]?d.lean[p.id]:0;
    sc*=1+ln;
    sc*=ent;
    const b=S.boost[d.id]&&S.boost[d.id][p.id]?S.boost[d.id][p.id]:0;
    sc*=1+b;
    if(p.id==="player"){
      sc*=1+modSum("appealMult");
      const cm=candidateModifiers(d);
      if(cm&&(cm.appealMult||cm.entBonus))sc*=1+cm.appealMult+cm.entBonus;
    }
    scores[p.id]=Math.max(0.001,sc);
  }
  scores.others=0.055*ent;
  let sum=0;for(const k in scores)sum+=scores[k];
  const out={};
  for(const k in scores){let sh=scores[k]/sum;if(noisy)sh+=pollNoiseFor(d.id,k);out[k]=Math.max(0,sh);}
  if(noisy){let s2=0;for(const k in out)s2+=out[k];if(s2>0)for(const k in out)out[k]/=s2;}
  return out;
}
function nationalShares(noisy){
  const tot={};
  for(const d of DISTRICTS){
    const sh=districtShares(d,noisy);
    for(const k in sh)tot[k]=(tot[k]||0)+sh[k]*d.seats;
  }
  for(const k in tot)tot[k]/=TOTAL_SEATS;
  return tot;
}
function aggregateFromDistrictPolls(){
  const tot={};
  for(const d of DISTRICTS){
    const sh=S.districtPoll[d.id];
    if(!sh)continue;
    for(const k in sh)tot[k]=(tot[k]||0)+sh[k]*d.seats;
  }
  for(const k in tot)tot[k]/=TOTAL_SEATS;
  return tot;
}
function recomputePolls(){
  if(!S||S.phase!=="campaign")return;
  S.districtPoll={};
  for(const d of DISTRICTS)S.districtPoll[d.id]=districtShares(d,true);
  S.pollNat=aggregateFromDistrictPolls();
}
function addBoost(dId,pId,v){
  if(!S.boost[dId])S.boost[dId]={};
  S.boost[dId][pId]=Math.max(-0.25,(S.boost[dId][pId]||0)+v);
}

function faceSVG(cfg){
  cfg=cfg||{};
  const skin=SKIN_TONES[cfg.skin]||SKIN_TONES[2];
  const colors={
    K:skin,N:shade(skin,.72),E:"#1a1a1a",M:"#7a2d25",m:"#c97a6a",
    H:cfg.hairColor||HAIR_COLORS[0],S:cfg.suitColor||SUIT_COLORS[0],T:cfg.shirtColor||SHIRT_COLORS[0],
    t:shade(cfg.suitColor||SUIT_COLORS[0],.55)
  };
  const layers=[
    {g:FACE_GRID,y0:0},
    {g:FEATURES_GRIDS[cfg.gender==="female"?"female":"male"],y0:0},
    {g:HAIR_GRIDS[cfg.hairStyle]||HAIR_GRIDS.short,y0:0},
    {g:SUIT_GRIDS[cfg.suitStyle]||SUIT_GRIDS.classic,y0:18}
  ];
  let out='<rect width="24" height="24" fill="'+cfg.bg+'"/>';
  for(const L of layers){
    for(let i=0;i<L.g.length;i++){
      const row=L.g[i];
      const y=i+L.y0;
      for(let x=0;x<24;x++){
        const c=row[x];
        if(c==="."||c===undefined)continue;
        const fill=colors[c];
        if(fill)out+='<rect x="'+x+'" y="'+y+'" width="1" height="1" fill="'+fill+'"/>';
      }
    }
  }
  if(cfg.glasses)out+='<rect x="6" y="6" width="4" height="4" fill="none" stroke="#20242c" stroke-width="1"/><rect x="14" y="6" width="4" height="4" fill="none" stroke="#20242c" stroke-width="1"/><line x1="10" y1="8" x2="14" y2="8" stroke="#20242c" stroke-width="1"/>';
  return '<svg viewBox="0 0 24 24" shape-rendering="crispEdges">'+out+'</svg>';
}

function defaultAppearance(){
  return{skin:2,hairColor:"#3b2a20",hairStyle:"short",suitColor:"#1b2a44",shirtColor:"#ffffff",suitStyle:"classic",gender:"male",ethnicity:"bulgarian",glasses:false,bg:"#26547c"};
}

function candidateModifiers(d){
  const app=S&&S.player&&S.player.appearance;
  if(!app)return{appealMult:0,entBonus:0};
  const out={appealMult:0,entBonus:0};
  if(app.ethnicity==="turkish"){
    if(TURKISH_STRONG.indexOf(d.id)>=0)out.appealMult+=0.06;
    if(NATIONALIST_STRONG.indexOf(d.id)>=0)out.appealMult-=0.05;
  }else if(app.ethnicity==="roma"){
    if(POVERTY_DISTRICTS.indexOf(d.id)>=0)out.entBonus+=0.07;
  }
  if(app.gender==="female"){
    if(URBAN_DISTRICTS.indexOf(d.id)>=0)out.entBonus+=0.03;
  }
  return out;
}

function identityEffectLines(){
  const app=S&&S.player&&S.player.appearance;
  if(!app)return[];
  const lines=[];
  if(app.ethnicity==="turkish")lines.push("Turkish minority: +6% appeal in Kardzhali, Razgrad, Targovishte, Shumen; −5% in Sliven, Yambol");
  if(app.ethnicity==="roma")lines.push("Roma: +7% voter enthusiasm in Vidin, Montana, Vratsa, Silistra");
  if(app.gender==="female")lines.push("Female candidate: +3% enthusiasm in Sofia, Plovdiv, Varna");
  return lines;
}
function portraitHTML(){
  if(S.player.photo)return '<img src="'+S.player.photo+'" alt="">';
  return faceSVG(S.player.appearance||defaultAppearance());
}

function emblemSVG(id,color,size){
  size=size||48;
  let inner="";
  switch(id){
    case "lion":inner='<path d="M32 8 L36 17 L45 11 L45 21 L55 19 L51 28 L60 32 L51 36 L55 45 L45 43 L45 53 L36 47 L32 56 L28 47 L19 53 L19 43 L9 45 L13 36 L4 32 L13 28 L9 19 L19 21 L19 11 L28 17 Z"/><circle cx="32" cy="32" r="13"/><circle cx="27" cy="29" r="2" fill="rgba(0,0,0,.55)"/><circle cx="37" cy="29" r="2" fill="rgba(0,0,0,.55)"/><path d="M28 37 L36 37 L32 42 Z" fill="rgba(0,0,0,.45)"/>';break;
    case "star":inner='<polygon points="32,10 37.6,26.3 54.8,26.6 41,36.9 46.1,53.4 32,43.5 17.9,53.4 23,36.9 9.2,26.6 26.4,26.3"/>';break;
    case "rose":inner='<circle cx="43" cy="34" r="7"/><circle cx="37.5" cy="43.5" r="7"/><circle cx="26.5" cy="43.5" r="7"/><circle cx="21" cy="34" r="7"/><circle cx="26.5" cy="24.5" r="7"/><circle cx="37.5" cy="24.5" r="7"/><circle cx="32" cy="34" r="6" fill="rgba(0,0,0,.35)"/>';break;
    case "fist":inner='<rect x="24" y="10" width="16" height="11" rx="5"/><rect x="20" y="19" width="24" height="9" rx="4"/><rect x="20" y="28" width="24" height="9" rx="4"/><rect x="22" y="37" width="20" height="8" rx="4"/><rect x="26" y="43" width="12" height="13" rx="4"/>';break;
    case "sun":inner='<circle cx="32" cy="34" r="10"/><g stroke="'+color+'" stroke-width="4" stroke-linecap="round"><line x1="47" y1="34" x2="55" y2="34"/><line x1="42.6" y1="44.6" x2="48.3" y2="50.3"/><line x1="32" y1="49" x2="32" y2="57"/><line x1="21.4" y1="44.6" x2="15.7" y2="50.3"/><line x1="17" y1="34" x2="9" y2="34"/><line x1="21.4" y1="23.4" x2="15.7" y2="17.7"/><line x1="32" y1="19" x2="32" y2="11"/><line x1="42.6" y1="23.4" x2="48.3" y2="17.7"/></g>';break;
    case "eagle":inner='<path d="M32 12 L38 23 L56 14 L46 29 L58 37 L42 37 L44 52 L32 42 L20 52 L22 37 L6 37 L18 29 L8 14 L26 23 Z"/>';break;
    case "book":inner='<path d="M32 18 C26 13 15 13 9 16 L9 46 C15 43 26 43 32 48 C38 43 49 43 55 46 L55 16 C49 13 38 13 32 18 Z"/><path d="M32 18 L32 48" stroke="rgba(0,0,0,.45)" stroke-width="2.5" fill="none"/>';break;
    case "gear":inner='<circle cx="32" cy="32" r="13"/><rect x="29" y="7" width="6" height="10"/><rect x="29" y="47" width="6" height="10"/><rect x="7" y="29" width="10" height="6"/><rect x="47" y="29" width="10" height="6"/><rect x="29" y="7" width="6" height="10" transform="rotate(45 32 32)"/><rect x="29" y="47" width="6" height="10" transform="rotate(45 32 32)"/><rect x="7" y="29" width="10" height="6" transform="rotate(45 32 32)"/><rect x="47" y="29" width="10" height="6" transform="rotate(45 32 32)"/><circle cx="32" cy="32" r="6" fill="rgba(0,0,0,.5)"/>';break;
    case "flame":inner='<path d="M32 6 C30 16 20 22 20 34 A12 13 0 0 0 44 34 C44 26 38 21 37 12 C34 17 33 13 32 6 Z"/><circle cx="32" cy="38" r="6" fill="rgba(255,255,255,.35)"/>';break;
    case "scales":inner='<rect x="10" y="14" width="44" height="4" rx="2"/><rect x="30" y="14" width="4" height="36"/><rect x="20" y="50" width="24" height="5" rx="2"/><path d="M13 18 L4 33 A9.5 6 0 0 0 22 33 Z"/><path d="M51 18 L42 33 A9.5 6 0 0 0 60 33 Z"/>';break;
  }
  return '<svg viewBox="0 0 64 64" width="'+size+'" height="'+size+'"><g fill="'+color+'">'+inner+'</g></svg>';
}

function bannerInner(){
  const c=S.party.color;
  const emb=S.party.logo
    ?'<img src="'+S.party.logo+'" alt="" style="width:52px;height:52px;object-fit:contain">'
    :emblemSVG(EMBLEM_IDS[S.party.emblemIdx],contrast(c),52);
  return '<div class="banner-emblem">'+emb+'</div>'
    +'<div class="banner-name" style="color:'+contrast(c)+'">'+esc(S.party.name)+'</div>'
    +'<div class="banner-abbr" style="color:'+contrast(c)+'">'+esc(S.party.abbr)+'</div>'
    +'<div class="banner-slogan" style="color:'+contrast(c)+'">'+esc(S.party.slogan)+'</div>';
}

function buildEventPool(){
  EVENT_POOL=[];
  const P=EVENT_POOL;
  const coalD=["stara-zagora","pernik","vratsa","montana","kyustendil","vidin"];
  const ally=closestAlly();
  const allyP=partyOf(ally);
  for(const d of DISTRICTS){
    P.push({kind:"good",title:"Donation in "+d.name,text:"A business association in "+d.name+" transfers funds to your campaign, impressed by your platform.",opts:[{label:"Accept with thanks",fx:{cash:rnd(12,28)*1000}}]});
    P.push({kind:"good",title:"Festival invitation — "+d.name,text:"Organizers of the local festival in "+d.name+" invite you to the main stage. The crowd is warm.",opts:[{label:"Take the stage",fx:{districtBoost:{d:d.id,v:.02},entDistrict:{d:d.id,v:.06}}}]});
    P.push({kind:"good",flavor:true,title:"Volunteer surge in "+d.name,text:"Dozens of volunteers sign up to canvass door to door in "+d.name+".",opts:[{label:"Put them to work",fx:{districtBoost:{d:d.id,v:.03}}},{label:"Pizza night first",fx:{districtBoost:{d:d.id,v:.03}}}]});
    P.push({kind:"good",flavor:true,title:"Mayor endorses you in "+d.name,text:"The popular mayor of "+d.name+" publicly backs your candidacy.",opts:[{label:"Seal the endorsement",fx:{districtBoost:{d:d.id,v:.04}}},{label:"Share the stage with him",fx:{districtBoost:{d:d.id,v:.04}}}]});
    P.push({kind:"good",title:"Factory visit near "+d.name,text:"A factory tour goes well; workers photograph you and the owner writes a cheque.",opts:[{label:"Great visit",fx:{cash:rnd(6,12)*1000,districtBoost:{d:d.id,v:.015}}}]});
    P.push({kind:"good",title:"Local media praise — "+d.name,text:"A regional outlet runs a flattering profile of your campaign in "+d.name+".",opts:[{label:"Nice",fx:{districtBoost:{d:d.id,v:.025}}}]});
    P.push({kind:"bad",title:"Factory closure anger in "+d.name,text:"A major employer in "+d.name+" announces layoffs. Voters are furious at all politicians.",opts:[{label:"Weather it",fx:{entDistrict:{d:d.id,v:-.08}}}]});
    P.push({kind:"bad",flavor:true,title:"Gaffe caught on camera — "+d.name,text:"A clumsy remark you made in "+d.name+" goes viral.",opts:[{label:"Laugh it off",fx:{districtBoost:{d:d.id,v:-.04}}},{label:"Blame the intern",fx:{districtBoost:{d:d.id,v:-.04}}}]});
    P.push({kind:"bad",title:"Protest in "+d.name,text:"Protesters disrupt your appearance in "+d.name+", chanting against the 'political class'.",opts:[{label:"Keep calm",fx:{entDistrict:{d:d.id,v:-.06},districtBoost:{d:d.id,v:-.01}}}]});
    P.push({kind:"bad",flavor:true,title:"Smear leaflets in "+d.name,text:"Anonymous leaflets flood mailboxes in "+d.name+" with claims about your past.",opts:[{label:"Ignore them",fx:{districtBoost:{d:d.id,v:-.025}}},{label:"Burn them in a photo op",fx:{districtBoost:{d:d.id,v:-.025}}}]});
    P.push({kind:"bad",title:"Rival ad blitz in "+d.name,text:"A rival party buys every billboard and radio slot in "+d.name+".",opts:[{label:"Nothing we can do",fx:{districtBoost:{d:d.id,v:-.03}}}]});
    P.push({kind:"bad",title:"Donor controversy — "+d.name,text:"A local donor in "+d.name+" turns out to owe money to half the town. The gift is returned, with costs.",opts:[{label:"Damage control",fx:{cash:-12000}}]});
    P.push({kind:"bad",title:"Storm cancels rally in "+d.name,text:"Torrential rain washes out your planned rally in "+d.name+".",opts:[{label:"Reschedule",fx:{districtBoost:{d:d.id,v:-.02},entDistrict:{d:d.id,v:-.03}}}]});
  }
  const gRival=pick(AI_PARTIES);
  P.push({kind:"good",title:"Major donor steps forward",text:"A wealthy donor impressed by your message wires a large sum to the campaign.",opts:[{label:"Accept",fx:{cash:rnd(40,60)*1000}}]});
  P.push({kind:"good",flavor:true,title:"Celebrity endorsement",text:pick(CELEBS)+" posts a photo wearing your party colours. It spreads fast.",opts:[{label:"Thank them publicly",fx:{nationBoost:.012,enthusiasmAll:.02}},{label:"Make it a meme",fx:{nationBoost:.012,enthusiasmAll:.02}}]});
  P.push({kind:"good",title:"Rival gaffe",text:gRival.leader+" of "+gRival.name+" is caught in an awkward hot-mic moment. Their campaign bleeds support.",opts:[{label:"Capitalize",fx:{oppHit:{party:gRival.id,v:.04}}}]});
  P.push({kind:"good",title:"Prime-time feature",text:pick(OUTLETS)+" airs a long, sympathetic feature about your campaign trail.",opts:[{label:"Great coverage",fx:{nationBoost:.015}}]});
  P.push({kind:"good",title:"Volunteer wave",text:"Hundreds of new volunteers register nationwide, and a donation jar overflows.",opts:[{label:"Forward!",fx:{stamina:2,cash:10000}}]});
  P.push({kind:"good",title:"Poll surge story",text:"National outlets report that your campaign is 'the one to watch'. Enthusiasm rises.",opts:[{label:"Keep pushing",fx:{enthusiasmAll:.04}}]});
  P.push({kind:"good",title:"Diaspora support",text:"Bulgarian communities abroad organize a fundraiser for your campaign.",opts:[{label:"Thank them",fx:{cash:20000}}]});
  P.push({kind:"good",flavor:true,title:"Debate night win",text:"You outperform "+gRival.leader+" in a televised exchange. Commentators declare a clear winner.",opts:[{label:"Claim victory",fx:{nationBoost:.02,rel:{[gRival.id]:-10}}},{label:"Stay humble on air",fx:{nationBoost:.02,rel:{[gRival.id]:-10}}}]});
  P.push({kind:"good",title:"Reform NGO endorsement",text:"A prominent anticorruption NGO praises your platform.",opts:[{label:"Accept",fx:{nationBoost:.01,rel:{ppdb:8}}}]});
  P.push({kind:"good",title:"Union backing",text:"A national union federation signals support for your social platform.",opts:[{label:"Accept",fx:{nationBoost:.012,rel:{bsp:8}}}]});
  P.push({kind:"good",title:"Newspaper endorsement",text:"A national daily endorses your candidacy in a front-page editorial.",opts:[{label:"Frame it",fx:{nationBoost:.012}}]});
  P.push({kind:"good",title:"Leaked rival memo",text:"An anonymous source hands you an internal memo exposing chaos inside "+gRival.name+".",opts:[{label:"Leak it",fx:{oppHit:{party:gRival.id,v:.03},nationBoost:.01}}]});
  const bRival=pick(AI_PARTIES);
  P.push({kind:"bad",title:"Donor scandal",text:"One of your donors is arrested for fraud. The story dominates the news cycle.",opts:[{label:"Distance yourself",fx:{cash:-30000,nationBoost:-.01}}]});
  P.push({kind:"bad",flavor:true,title:"Smear campaign",text:"Coordinated attack ads question your record across national media.",opts:[{label:"Issue a statement",fx:{nationBoost:-.015}},{label:"Ride it out quietly",fx:{nationBoost:-.015}}]});
  P.push({kind:"bad",title:"Campaign bus breakdown",text:"Your campaign bus dies on the Trakia motorway. A day of events is lost.",opts:[{label:"Push on by taxi",fx:{stamina:-3}}]});
  P.push({kind:"bad",title:"Email hack",text:"Hackers leak internal campaign emails and cost consultants a small fortune in cleanup.",opts:[{label:"Hire experts",fx:{cash:-15000,nationBoost:-.01}}]});
  P.push({kind:"bad",title:"Rival air dominance",text:bRival.name+" floods swing regions with ads attacking you directly.",opts:[{label:"Endure",fx:{rivalBoost:{n:5,v:.04}}}]});
  P.push({kind:"bad",title:"Turnout worries",text:"Analysts warn your supporters are staying home. Enthusiasm dips nationwide.",opts:[{label:"Worrying",fx:{enthusiasmAll:-.05}}]});
  P.push({kind:"bad",title:"Interview stumble",text:"You freeze on a live interview question about the budget. The clip circulates.",opts:[{label:"Move on",fx:{nationBoost:-.02}}]});
  P.push({kind:"bad",flavor:true,title:"Fake news wave",text:"Fabricated stories about your private life spread on social media.",opts:[{label:"Issue denials",fx:{enthusiasmAll:-.03}},{label:"Ignore and smile",fx:{enthusiasmAll:-.03}}]});
  P.push({kind:"bad",title:"Office rent hike",text:"Your landlord triples the rent on the Sofia campaign office.",opts:[{label:"Pay up",fx:{cash:-10000}}]});
  P.push({kind:"bad",title:"Senior advisor resigns",text:"Your top strategist quits after a dispute, taking contacts with them.",opts:[{label:"Reorganize",fx:{mod:{name:"Staff turmoil",desc:"Rally power −10% for 3 weeks",turns:3,bad:true,effects:{rallyMult:-.1}}}}]});
  P.push({kind:"bad",title:"Polling fiasco",text:"A pollster you paid publishes numbers riddled with errors. Wasted money, muddled message.",opts:[{label:"Write it off",fx:{cash:-8000,nationBoost:-.005}}]});
  P.push({kind:"bad",title:"Counter-protest clash",text:"A scuffle at your rally makes the evening news in a bad way.",opts:[{label:"Calm tensions",fx:{nationBoost:-.01,enthusiasmAll:-.02}}]});
  const cRival=pick(AI_PARTIES);
  P.push({kind:"choice",title:"A shady donor's offer",text:"An oligarch with a murky reputation offers 50 000 лв in exchange for 'access' if you win.",opts:[
    {label:"Take the money",sub:"+50 000 лв, but questions will follow",fx:{cash:50000,mod:{name:"Questions about a donor",desc:"National appeal −5% for 4 weeks",turns:4,bad:true,effects:{appealMult:-.05}}}},
    {label:"Refuse publicly",sub:"Your integrity becomes a talking point",fx:{mod:{name:"Clean hands",desc:"National appeal +3% for 4 weeks",turns:4,effects:{appealMult:.03}}}}
  ]});
  P.push({kind:"choice",title:"Prime-time debate invitation",text:cRival.name+" agrees to a one-on-one televised debate. High risk, high reward.",opts:[
    {label:"Accept the debate",sub:"−2 SP, rally power +15% for 3 weeks",fx:{stamina:-2,mod:{name:"Media trained",desc:"Rally power +15% for 3 weeks",turns:3,effects:{rallyMult:.15}},rel:{[cRival.id]:-8}}},
    {label:"Decline",sub:"You will look evasive",fx:{mod:{name:"Seen as evasive",desc:"Rally power −10% for 3 weeks",turns:3,bad:true,effects:{rallyMult:-.1}}}}
  ]});
  P.push({kind:"choice",title:"Anti-government protest erupts",text:"Tens of thousands gather in Sofia against the incumbent. Organizers invite you to the stage.",opts:[
    {label:"Join the protest",sub:"Energy surges, but GERB will remember",fx:{enthusiasmAll:.08,nationBoost:.01,rel:{gerb:-12}}},
    {label:"Stay above the fray",sub:"The street notices your absence",fx:{enthusiasmAll:-.04}}
  ]});
  P.push({kind:"choice",title:"Attack ad package",text:"A media agency offers a brutal attack ad campaign against "+cRival.name+".",opts:[
    {label:"Buy the campaign",sub:"−35 000 лв, damages "+cRival.abbr,fx:{cash:-35000,oppHit:{party:cRival.id,v:.05},rel:{[cRival.id]:-20}}},
    {label:"Stay positive",sub:"",fx:{}}
  ]});
  P.push({kind:"choice",title:"Union endorsement request",text:"The energy workers' union wants you to pledge generous state subsidies before they endorse you.",opts:[
    {label:"Pledge subsidies",sub:"Shift toward subsidies; coal regions love it",fx:{posShift:{issue:"energy",delta:.2},rel:{bsp:15},multiBoost:coalD.map(x=>({d:x,v:.03})),mod:{name:"Business wing unhappy",desc:"National appeal −3% for 4 weeks",turns:4,bad:true,effects:{appealMult:-.03}}}},
    {label:"Stay non-committal",sub:"The union stays neutral",fx:{rel:{bsp:-10}}}
  ]});
  P.push({kind:"choice",title:"Foreign leader's endorsement",text:"A prominent European leader offers a joint appearance endorsing your pro-EU credentials.",opts:[
    {label:"Accept",sub:"Eurozone stance hardens; nationalists grumble",fx:{posShift:{issue:"euro",delta:.1},nationBoost:.01,rel:{vaz:-15}}},
    {label:"Politely decline",sub:"",fx:{}}
  ]});
  const eRival=pick(AI_PARTIES.filter(p=>p.id!=="gerb"));
  P.push({kind:"choice",title:"Investigative interview offer",text:"A journalist offers you exclusive documents about corruption inside "+eRival.name+" — if you go on record.",opts:[
    {label:"Go on record",sub:"Big boost, burning a bridge",fx:{nationBoost:.02,rel:{[eRival.id]:-10}}},
    {label:"Sell the story quietly",sub:"+20 000 лв for 'consulting'",fx:{cash:20000}}
  ]});
  P.push({kind:"choice",title:"Prime-time entertainment show",text:"A beloved late-night show invites you to sing, cook and joke on air.",opts:[
    {label:"Show your human side",sub:"+2 Charisma for 4 weeks, enthusiasm up",fx:{attrTemp:{attr:"charisma",v:2,turns:4},enthusiasmAll:.03}},
    {label:"Send your policy book instead",sub:"+1 Intelligence for 4 weeks",fx:{attrTemp:{attr:"intelligence",v:1,turns:4}}}
  ]});
  P.push({kind:"choice",title:"Anonymous dossier",text:"A courier delivers a dossier of compromising material on "+cRival.leader+".",opts:[
    {label:"Publish it",sub:"Damages "+cRival.abbr+", raises ethics questions",fx:{oppHit:{party:cRival.id,v:.06},mod:{name:"Ethics questions",desc:"National appeal −4% for 3 weeks",turns:3,bad:true,effects:{appealMult:-.04}}}},
    {label:"Destroy it publicly",sub:"A show of clean politics",fx:{rel:{[cRival.id]:6},mod:{name:"Clean campaign",desc:"National appeal +3% for 5 weeks",turns:5,effects:{appealMult:.03}}}}
  ]});
  P.push({kind:"choice",title:"Pre-electoral signal",text:allyP.name+" — the party closest to you — floats a public pre-electoral alliance before voting day.",opts:[
    {label:"Accept the alliance",sub:"Permanent +2% appeal, better relations",fx:{mod:{name:"Pre-electoral alliance",desc:"National appeal +2% (permanent)",turns:null,effects:{appealMult:.02}},rel:{[ally]:20}}},
    {label:"Go it alone",sub:"",fx:{rel:{[ally]:-10}}}
  ]});
  P.push({kind:"choice",title:"Oligarch media deal",text:"A media mogul offers discounted ad rates and friendly coverage — for a price later.",opts:[
    {label:"Take the deal",sub:"+30 000 лв and +50% ad power for 6 weeks",fx:{cash:30000,mod:{name:"Media dependency",desc:"Ad power +50%, appeal −5% for 6 weeks",turns:6,bad:true,effects:{adMult:.5,appealMult:-.05}}}},
    {label:"Stay independent",sub:"+2% appeal for 6 weeks",fx:{mod:{name:"Independent voice",desc:"National appeal +2% for 6 weeks",turns:6,effects:{appealMult:.02}}}}
  ]});
  P.push({kind:"choice",title:"Reality campaign show",text:"A TV network wants to follow your campaign for a reality-style series.",opts:[
    {label:"Cameras everywhere",sub:"Big visibility boost",fx:{nationBoost:.025,enthusiasmAll:.05}},
    {label:"Keep it professional",sub:"",fx:{}}
  ]});
  P.push({kind:"choice",title:"Hot-mic scandal",text:"You were recorded mocking a small town's festival. The audio is everywhere.",opts:[
    {label:"Apologize immediately",sub:"The story cools, slowly",fx:{enthusiasmAll:-.02,mod:{name:"Apologetic tour",desc:"Rally power −10% for 2 weeks",turns:2,bad:true,effects:{rallyMult:-.1}}}},
    {label:"Double down",sub:"Your base loves the defiance",fx:{mod:{name:"Defiant tone",desc:"Rally power +10% for 3 weeks",turns:3,effects:{rallyMult:.1}},rel:{ppdb:-15}}}
  ]});
  P.push({kind:"choice",title:"Energy crisis pledge",text:"With energy prices spiking, reporters demand your position on subsidies.",opts:[
    {label:"Promise state subsidies",sub:"Coal regions cheer; your stance shifts",fx:{posShift:{issue:"energy",delta:.15},multiBoost:coalD.map(x=>({d:x,v:.03})),rel:{bsp:8}}},
    {label:"Defend the free market",sub:"Business approves",fx:{posShift:{issue:"energy",delta:-.15},nationBoost:.01,rel:{gerb:8}}}
  ]});
  P.push({kind:"choice",title:"Youth social-media blitz",text:"Your digital team wants 15 000 лв for a TikTok-first youth campaign.",opts:[
    {label:"Fund it",sub:"−15 000 лв, national boost + ad power",fx:{cash:-15000,nationBoost:.018,mod:{name:"Viral momentum",desc:"Ad power +20% for 4 weeks",turns:4,effects:{adMult:.2}}}},
    {label:"Stick to TV",sub:"",fx:{}}
  ]});
}

function closestAlly(){
  let best="ppdb",bd=9;
  for(const p of AI_PARTIES){
    let s=0;
    for(const i of ISSUES)s+=Math.abs(p.pos[i.id]-S.party.pos[i.id]);
    if(s<bd){bd=s;best=p.id;}
  }
  return best;
}

function mainRivalId(){
  let best="gerb",bv=-1;
  const nat=S.pollNat&&Object.keys(S.pollNat).length?S.pollNat:nationalShares(false);
  for(const p of AI_PARTIES){const v=nat[p.id]||0;if(v>bv){bv=v;best=p.id;}}
  return best;
}

function applyFx(fx,prefix){
  if(!fx)return;
  const tag=prefix?prefix+" — ":"";
  const pollBefore=[];
  if(S.phase==="campaign"&&S.districtPoll){
    for(const d of DISTRICTS){
      const sh=S.districtPoll[d.id];
      if(sh)pollBefore.push({d:d.id,before:sh.player||0});
    }
  }
  const natBefore=S.pollNat&&S.pollNat.player?S.pollNat.player:null;
  if(fx.cash){S.cash+=fx.cash;log(tag+((fx.cash>0?"Received ":"Lost ")+"<b>"+fmtMoney(Math.abs(fx.cash))+"</b>."),fx.cash>0?"good":"bad");}
  if(fx.stamina){S.stamina=clamp(S.stamina+fx.stamina,0,getMaxStamina());log(tag+((fx.stamina>0?"+":"")+fx.stamina)+" SP (stamina).",fx.stamina>0?"good":"bad");}
  if(fx.enthusiasmAll){for(const d of DISTRICTS){S.enthusiasm[d.id]=clamp((S.enthusiasm[d.id]!==undefined?S.enthusiasm[d.id]:d.ent)+fx.enthusiasmAll,0.5,1.4);}log(tag+"National voter enthusiasm "+(fx.enthusiasmAll>0?"+":"")+pts(fx.enthusiasmAll)+".",fx.enthusiasmAll>0?"good":"bad");}
  if(fx.entDistrict){S.enthusiasm[fx.entDistrict.d]=clamp((S.enthusiasm[fx.entDistrict.d]!==undefined?S.enthusiasm[fx.entDistrict.d]:DIST_BY_ID[fx.entDistrict.d].ent)+fx.entDistrict.v,0.5,1.4);log(tag+"Enthusiasm in <b>"+DIST_BY_ID[fx.entDistrict.d].name+"</b> "+(fx.entDistrict.v>0?"+":"")+pts(fx.entDistrict.v)+".",fx.entDistrict.v>0?"good":"bad");}
  if(fx.districtBoost){addBoost(fx.districtBoost.d,"player",fx.districtBoost.v);log(tag+"Local support +"+pts(fx.districtBoost.v)+" pts in <b>"+DIST_BY_ID[fx.districtBoost.d].name+"</b>.","good");}
  if(fx.nationBoost){for(const d of DISTRICTS)addBoost(d.id,"player",fx.nationBoost);log(tag+"Nationwide support +"+pts(fx.nationBoost)+" pts.","good");}
  if(fx.multiBoost){
    for(const mb of fx.multiBoost)addBoost(mb.d,"player",mb.v);
    log(tag+"Support +"+pts(fx.multiBoost[0].v)+" pts in "+fx.multiBoost.map(mb=>"<b>"+DIST_BY_ID[mb.d].short+"</b>").join(", ")+".","good");
  }
  if(fx.oppHit){
    const pid=fx.oppHit.party||mainRivalId();
    const ds=shuffle(DISTRICTS.slice()).slice(0,6);
    for(const d of ds)addBoost(d.id,pid,-fx.oppHit.v);
    for(const d of DISTRICTS)addBoost(d.id,pid,-fx.oppHit.v*0.3);
    log(tag+"<b>"+partyOf(pid).abbr+"</b> loses support in 6 districts and nationwide.","good");
  }
  if(fx.rivalBoost){
    const pid=mainRivalId();
    const ds=shuffle(DISTRICTS.slice()).slice(0,fx.rivalBoost.n);
    for(const d of ds)addBoost(d.id,pid,fx.rivalBoost.v);
    log(tag+"<b>"+partyOf(pid).abbr+"</b> gains support in "+fx.rivalBoost.n+" districts.","bad");
  }
  if(fx.rel){
    for(const k in fx.rel)S.rel[k]=(S.rel[k]||0)+fx.rel[k];
    log(tag+"Relationship: "+Object.keys(fx.rel).map(k=>"<b>"+partyOf(k).abbr+"</b> "+(fx.rel[k]>0?"+":"")+fx.rel[k]).join(", ")+".",Object.keys(fx.rel).some(k=>fx.rel[k]<0)?"bad":"good");
  }
  if(fx.posShift){S.party.pos[fx.posShift.issue]=clamp(S.party.pos[fx.posShift.issue]+fx.posShift.delta,0,1);log(tag+"Platform shift on <b>"+ISSUES.find(i=>i.id===fx.posShift.issue).name+"</b> "+(fx.posShift.delta>0?"+":"")+fx.posShift.delta+".","info");}
  if(fx.attrTemp){addModifier({name:"Sharp form",desc:"+"+fx.attrTemp.v+" "+fx.attrTemp.attr+" for "+fx.attrTemp.turns+" weeks",turns:fx.attrTemp.turns,effects:{["attr_"+fx.attrTemp.attr]:fx.attrTemp.v}});log(tag+"+"+fx.attrTemp.v+" "+fx.attrTemp.attr+" for "+fx.attrTemp.turns+" weeks.","good");}
  if(fx.mod){addModifier(fx.mod);log(tag+"New modifier: <b>"+esc(fx.mod.name)+"</b> ("+esc(fx.mod.desc)+").",fx.mod.bad?"bad":"good");}
  recomputePolls();
  if(pollBefore.length&&S.phase==="campaign"){
    const natDelta=natBefore===null?0:(S.pollNat.player||0)-natBefore;
    const deltas=[];
    for(const pb of pollBefore){
      const after=S.districtPoll[pb.d].player||0;
      const dv=after-pb.before;
      if(Math.abs(dv)>=0.0005)deltas.push({d:pb.d,v:dv,before:pb.before,after:after});
    }
    deltas.sort((a,b)=>Math.abs(b.v)-Math.abs(a.v));
    const parts=[];
    if(natBefore!==null&&Math.abs(natDelta)>=0.0005)parts.push("national "+(natDelta>0?"+":"")+pts(natDelta)+" pts ("+pct(natBefore)+" → "+pct(S.pollNat.player||0)+")");
    for(const dl of deltas.slice(0,4))parts.push((dl.v>0?"YOU +":"YOU ")+pts(dl.v)+" pts in <b>"+DIST_BY_ID[dl.d].short+"</b> ("+pct(dl.before)+" → "+pct(dl.after)+")");
    if(deltas.length>4)parts.push((deltas.length-4)+" more districts shifted <0.1 pts");
    if(parts.length)log(tag+"Polling: "+parts.join("; ")+".","info");
  }
}

function drawEvent(){
  if(S.eventCursor>=S.eventBag.length){S.eventBag=shuffle([...Array(EVENT_POOL.length).keys()]);S.eventCursor=0;}
  return S.eventBag[S.eventCursor++];
}
function maybeEvents(){
  const r=rng();
  const n=r<0.12?2:(r<0.72?1:0);
  for(let i=0;i<n;i++)S.eventQueue.push(drawEvent());
  if(S.eventQueue.length)showNextEvent();
}
function showNextEvent(){
  if(!S.eventQueue.length){S.paused=false;updateAll();return;}
  S.paused=true;
  renderEventModal(EVENT_POOL[S.eventQueue.shift()]);
}
function renderEventModal(ev){
  const root=$("modal-root");
  const headCls=ev.kind==="good"?"good":ev.kind==="bad"?"bad":"choice";
  const headTxt=ev.kind==="good"?"GOOD NEWS":ev.kind==="bad"?"BAD NEWS":"DECISION REQUIRED";
  const optsHtml=ev.opts.map((o,i)=>'<button class="btn" data-i="'+i+'">'+esc(o.label)+(o.sub?'<small>'+esc(o.sub)+'</small>':"")+'</button>').join("");
  root.innerHTML='<div class="modal-back"><div class="modal">'
    +'<div class="ev-head '+headCls+'"><span>'+headTxt+'</span><span class="paused-badge">GAME PAUSED</span></div>'
    +'<div class="ev-body"><h3>'+esc(ev.title)+'</h3><p>'+esc(ev.text)+'</p><div class="ev-opts">'+optsHtml+'</div></div>'
    +'</div></div>';
  root.querySelectorAll(".ev-opts .btn").forEach(b=>{
    b.onclick=()=>{
      const o=ev.opts[+b.dataset.i];
      applyFx(o.fx, ev.flavor&&o.label? "EVENT ("+o.label+")" : "EVENT");
      root.innerHTML="";
      updateAll();
      showNextEvent();
    };
  });
}

function openModal(html){$("modal-root").innerHTML='<div class="modal-back"><div class="modal"><div class="modal-pad">'+html+'</div></div></div>';}
function closeModal(){$("modal-root").innerHTML="";}

function helpModal(){
  openModal('<h3>How to play</h3>'
    +'<p>You have <b>20 weeks</b> until Election Day. Each week you receive stamina points (SP) based on your candidate\'s Stamina attribute. Spend them to travel between the 29 districts and hold targeted rallies on one of four issues: Eurozone Entry, Anticorruption Reform, Energy Subsidies and Judicial Independence.</p>'
    +'<ul><li>Rallies are strongest on high-weight issues where your platform matches the district stance.</li><li>Campaign HQs cost 40 000 лв but pay 9 000 лв per week and slowly grow local support.</li><li>Local media ads scale with Intelligence and suffer diminishing returns.</li></ul>'
    +'<p>Polling: a district\'s vote share comes from <b>issue alignment × voter enthusiasm × campaign boosts</b>. Ten rivals campaign too — GERB, Progresivna Balgariya, PP-DB, DPS, Vazrazhdane, BSP, ITN, MECh, APS and Velichie — and the strict 4% national threshold will drop the weakest of them out of the Narodno Subranie.</p>'
    +'<p>Election Day uses proportional representation: a strict <b>4% national threshold</b>, then the <b>D\'Hondt method</b> allocates each district\'s seats. 240 seats total; 121 for a majority.</p>'
    +'<p>After the vote, negotiate a coalition: spend political capital on cabinet posts, policy concessions and cash to push parties\' willingness to 100. Random events — <b>'+EVENT_POOL.length+' in the database</b> — pause the game and apply permanent, timed or one-time modifiers.</p>'
    +'<div class="center-row"><button class="btn primary" onclick="closeModal()">Got it</button></div>');
}

function menuModal(){
  openModal('<h3>Menu</h3><div class="ev-opts">'
    +'<button class="btn" id="m-resume">Resume campaign</button>'
    +'<button class="btn" id="m-save">Save campaign</button>'
    +'<button class="btn" id="m-load">Load last save</button>'
    +'<button class="btn" id="m-help">How to play</button>'
    +'<button class="btn danger" id="m-quit">Quit to title</button>'
    +'</div>');
  $("m-resume").onclick=closeModal;
  $("m-save").onclick=()=>{saveGame();closeModal();log("Campaign saved.","info");renderLog();};
  $("m-load").onclick=()=>{closeModal();if(!loadGame())alert("No save found.");};
  $("m-help").onclick=helpModal;
  $("m-quit").onclick=()=>location.reload();
}

function debugModal(){
  if(!S||!S.cheat||S.phase!=="campaign")return;
  const rivalBtns=AI_PARTIES.map(p=>'<button class="btn sm" data-weaken="'+p.id+'">Weaken '+esc(p.abbr)+'</button>').join("");
  const attrIn=k=>'<label class="fld"><span>'+k+' (1–12)</span><input type="number" id="dbg-'+k+'" min="1" max="12" value="'+S.player.attrs[k]+'"></label>';
  openModal('<h3>CHEAT CONSOLE</h3>'
    +'<div class="dbg-status" id="dbg-status"></div>'
    +'<div class="ev-opts">'
    +'<button class="btn" id="dbg-cash">+100 000 лв</button>'
    +'<button class="btn" id="dbg-sp">Refill stamina to max</button>'
    +'<button class="btn" id="dbg-end">+10 max SP this run</button>'
    +'<button class="btn" id="dbg-boost">+5% boost in <b>'+esc((S.selDistrict?DIST_BY_ID[S.selDistrict]:DIST_BY_ID[S.location]).short)+'</b></button>'
    +'<div class="center-row" style="gap:6px">'+rivalBtns+'</div>'
    +attrIn("stamina")+attrIn("charisma")+attrIn("intelligence")
    +'<button class="btn" id="dbg-apply">Apply attributes</button>'
    +'<button class="btn" id="dbg-floor">Guarantee 4% threshold</button>'
    +'<button class="btn danger" id="dbg-election">Trigger Election Day now</button>'
    +'<button class="btn ghost" id="dbg-close">Close</button>'
    +'</div>');
  function refreshStatus(){
    const st=$("dbg-status");
    if(st)st.innerHTML="Funds: <b>"+fmtMoney(S.cash)+"</b> · Stamina: <b>"+S.stamina+"/"+getMaxStamina()+"</b> · Selected district: <b>"+esc((S.selDistrict?DIST_BY_ID[S.selDistrict]:DIST_BY_ID[S.location]).short)+"</b>";
    const fl=$("dbg-floor");
    if(fl)fl.textContent=S.cheatFloor?"Threshold guarantee: ARMED":"Guarantee 4% threshold";
  }
  refreshStatus();
  $("dbg-cash").onclick=()=>{S.cash+=100000;log("CHEAT — +100 000 лв.","info");updateAll();refreshStatus();};
  $("dbg-sp").onclick=()=>{S.stamina=getMaxStamina();log("CHEAT — stamina refilled to "+S.stamina+".","info");updateAll();refreshStatus();};
  $("dbg-end").onclick=()=>{addModifier({name:"Cheat: iron lungs",desc:"+10 max stamina (permanent)",turns:null,effects:{maxStamina:10}});log("CHEAT — +10 max stamina for the run.","info");updateAll();refreshStatus();};
  $("dbg-boost").onclick=()=>{const bid=S.selDistrict||S.location;addBoost(bid,"player",0.05);recomputePolls();log("CHEAT — +5% boost in <b>"+DIST_BY_ID[bid].short+"</b>.","info");updateAll();refreshStatus();};
  document.querySelectorAll("[data-weaken]").forEach(b=>{
    b.onclick=()=>{
      const pid=b.dataset.weaken;
      for(const d of DISTRICTS)addBoost(d.id,pid,-0.05);
      recomputePolls();
      log("CHEAT — <b>"+partyOf(pid).abbr+"</b> weakened nationwide (−5%).","info");
      updateAll();refreshStatus();
    };
  });
  $("dbg-apply").onclick=()=>{
    for(const k of["stamina","charisma","intelligence"]){
      S.player.attrs[k]=clamp(parseInt($("dbg-"+k).value,10)||S.player.attrs[k],1,12);
    }
    S.stamina=Math.min(S.stamina,getMaxStamina());
    log("CHEAT — attributes set to S"+S.player.attrs.stamina+" C"+S.player.attrs.charisma+" I"+S.player.attrs.intelligence+".","info");
    updateAll();refreshStatus();
  };
  $("dbg-floor").onclick=()=>{S.cheatFloor=!S.cheatFloor;log("CHEAT — threshold guarantee "+(S.cheatFloor?"ARMED":"disarmed")+".","info");refreshStatus();};
  $("dbg-election").onclick=()=>{closeModal();runElection();};
  $("dbg-close").onclick=closeModal;
}

function saveGame(){try{localStorage.setItem(SAVE_KEY,JSON.stringify(S));}catch(e){}}
function hasSave(){try{return !!localStorage.getItem(SAVE_KEY);}catch(e){return false;}}
function loadGame(){
  try{
    const raw=localStorage.getItem(SAVE_KEY);
    if(!raw)return false;
    S=JSON.parse(raw);
    if(!S.player.appearance)S.player.appearance=Object.assign(defaultAppearance(),FACES[S.player.face||0]||{});
    if(!S.eventBag||!S.eventBag.length){buildEventPool();S.eventBag=shuffle([...Array(EVENT_POOL.length).keys()]);S.eventCursor=0;}
    else if(!EVENT_POOL.length){buildEventPool();}
    S.paused=false;S.eventQueue=[];
    resumeFromState();
    return true;
  }catch(e){return false;}
}
function resumeFromState(){
  if(S.phase==="campaign"){
    if(!S.districtPoll||!Object.keys(S.districtPoll).length)recomputePolls();
    showScreen("game");buildMap();updateAll();
  }
  else if(S.phase==="election"){renderElectionScreen();showScreen("election");}
  else if(S.phase==="coalition"){renderCoalition();showScreen("coalition");}
  else if(S.phase==="end"){renderEndScreen();showScreen("end");}
  else showScreen("title");
}

function buildMap(){
  const svg=$("bg-map");
  svg.innerHTML="";
  svg.setAttribute("viewBox",MAP_VIEWBOX.join(" "));
  svg.setAttribute("shape-rendering","crispEdges");
  svg.appendChild(svgEl("rect",{class:"map-sea",x:MAP_VIEWBOX[0]-24,y:MAP_VIEWBOX[1]-24,width:MAP_VIEWBOX[2]+48,height:MAP_VIEWBOX[3]+48,fill:"transparent"}));
  const cellData=computeCellPaths();
  const g=svgEl("g",{id:"map-nodes"});
  svg.appendChild(g);
  for(const d of DISTRICTS){
    const node=svgEl("g",{class:"node","data-id":d.id});
    const title=svgEl("title");
    title.textContent=d.name+" · "+d.seats+" seats";
    const body=svgEl("path",{class:"body region",d:(cellData.cells[d.id])||"",fill:"#44506b"});
    node.appendChild(title);node.appendChild(body);
    node.addEventListener("click",()=>selectDistrict(d.id));
    g.appendChild(node);
  }
  svg.appendChild(svgEl("path",{class:"map-borders",d:cellData.borders||"",fill:"none",stroke:"#0b1220","stroke-width":"2","pointer-events":"none"}));
  const ovl=svgEl("g",{class:"overlay-layer"});
  svg.appendChild(ovl);
  for(const d of DISTRICTS){
    const ov=svgEl("g",{class:"overlay","data-id":d.id});
    const dot=svgEl("rect",{class:"city-dot",x:d.x-2.5,y:d.y-2.5,width:5,height:5});
    dot.setAttribute("fill","#ffffff");
    const hq=svgEl("text",{class:"hq-mark",x:d.x+8,y:d.y+2,"font-size":"8"});
    hq.textContent="HQ";
    hq.style.display="none";
    const lb=labelPos(d);
    const label=svgEl("text",{x:lb[0],y:lb[1],"text-anchor":lb[2]||"m"});
    label.textContent=MAP_NAMES[d.id]||d.short;
    ov.appendChild(dot);ov.appendChild(hq);ov.appendChild(label);
    ovl.appendChild(ov);
  }
  svg.appendChild(svgEl("g",{id:"pin-layer"}));
  $("map-legend").innerHTML=
    '<span class="lg"><i style="background:'+S.party.color+'"></i>You</span>'
    +'<span class="lg"><i style="background:#2f6fd6"></i>Rivals lead</span>'
    +'<span class="lg"><i style="background:#e8b33d"></i>You lead (dot)</span>'
    +'<span class="lg">HQ · ★ your location</span>';
}

function redrawMap(){
  const svg=$("bg-map");
  if(!svg.firstChild)return;
  for(const d of DISTRICTS){
    const node=svg.querySelector('.node[data-id="'+d.id+'"]');
    if(!node)continue;
    const sh=S.districtPoll[d.id]||districtShares(d,false);
    let leader="others",lv=-1;
    for(const k in sh){if(k==="others")continue;if(sh[k]>lv){lv=sh[k];leader=k;}}
    const p=partyOf(leader);
    const body=node.querySelector(".body");
    body.setAttribute("fill",p?p.color:"#44506b");
    body.setAttribute("fill-opacity","0.85");
    node.classList.toggle("sel",S.selDistrict===d.id);
    const ov=svg.querySelector('.overlay[data-id="'+d.id+'"]');
    const dot=ov?ov.querySelector(".city-dot"):null;
    if(dot)dot.setAttribute("fill",leader==="player"?"#e8b33d":"#ffffff");
    const hq=ov?ov.querySelector(".hq-mark"):null;
    if(hq)hq.style.display=S.hq[d.id]?"":"none";
  }
  const pin=svg.querySelector("#pin-layer");
  pin.innerHTML="";
  const d=DIST_BY_ID[S.location];
  const t=svgEl("text",{class:"pin",x:d.x,y:d.y+3,"text-anchor":"middle","font-size":"14",fill:"#e8b33d"});
  t.textContent="★";
  pin.appendChild(t);
}

function renderTopbar(){
  $("tb-banner").style.background=S.party.color;
  $("tb-banner").innerHTML=S.party.logo
    ?'<img src="'+S.party.logo+'" alt="">'
    :emblemSVG(EMBLEM_IDS[S.party.emblemIdx],contrast(S.party.color),26);
  $("tb-pm").innerHTML='<div class="pm-face">'+portraitHTML()+'</div><div><b>'+esc(S.player.name)+'</b><span>'+esc(S.party.abbr)+' · PM candidate</span></div>';
  const clock=$("tb-clock");
  clock.textContent="WEEK "+Math.min(S.week,20)+"/20";
  clock.classList.toggle("urgent",S.week>=18&&S.week<=20);
  $("tb-days").textContent=S.week>20?"ELECTION DAY":Math.max(0,(21-S.week))*7+" days to "+ELECTION_DATE;
  $("tb-cash").innerHTML="Funds <b>"+fmtMoney(S.cash)+"</b>";
  $("tb-stamina").innerHTML="SP <b>"+S.stamina+"/"+getMaxStamina()+"</b>";
  const pol=S.pollNat.player||0;
  $("tb-poll").innerHTML="Poll <b>"+pct(pol)+"</b>";
  const dbgBtn=$("btn-debug");
  if(dbgBtn)dbgBtn.style.display=S.cheat?"":"none";
  const cheatChip=$("tb-cheat");
  if(cheatChip)cheatChip.style.display=S.cheat?"":"none";
}

let inspectorTab="district";

function renderDistrictCard(){
  const tabs='<div class="insp-tabs">'
    +'<button class="insp-tab'+(inspectorTab==="district"?" active":"")+'" data-tab="district">District</button>'
    +'<button class="insp-tab'+(inspectorTab==="national"?" active":"")+'" data-tab="national">National Polls</button>'
    +'</div>';
  $("district-card").innerHTML='<div class="side-block">'+tabs
    +(inspectorTab==="national"?renderNationalPolls():renderDistrictDetail())
    +'</div>';
  $("district-card").querySelectorAll("[data-act]").forEach(b=>{
    b.onclick=()=>{
      const act=b.dataset.act;
      const d=DIST_BY_ID[S.selDistrict];
      if(act==="travel")travelTo(d.id);
      else if(act==="rally")doRally(b.dataset.issue);
      else if(act==="ad")buyAd();
      else if(act==="hq")buildHQ();
    };
  });
  $("district-card").querySelectorAll(".insp-tab").forEach(b=>{
    b.onclick=()=>setInspectorTab(b.dataset.tab);
  });
}

function setInspectorTab(t){
  inspectorTab=t;
  if(t==="national"&&S.selDistrict){S.selDistrict=null;redrawMap();}
  renderDistrictCard();
}

function renderDistrictDetail(){
  const d=S.selDistrict?DIST_BY_ID[S.selDistrict]:null;
  if(!d)return '<div class="dc-empty">Click a district on the map to inspect it.</div>';
  const here=S.location===d.id;
  const sh=S.districtPoll[d.id]||districtShares(d,true);
  const rows=Object.keys(sh).filter(k=>k!=="others").map(k=>({k:k,v:sh[k]})).sort((a,b)=>b.v-a.v);
  const ent=S.enthusiasm[d.id]!==undefined?S.enthusiasm[d.id]:d.ent;
  let issues="";
  for(const i of ISSUES){
    const w=d.w[i.id],ideal=d.ideal[i.id],you=S.party.pos[i.id];
    issues+='<div class="issue-row"><div class="mini-label"><span>'+i.name+'</span><span>weight '+Math.round(w*100)+'%</span></div>'
      +'<div class="issue-track"><div class="issue-weight" style="width:'+(w*100)+'%"></div>'
      +'<div class="issue-dot ideal" style="left:'+(ideal*100)+'%" title="District stance"></div>'
      +'<div class="issue-dot you" style="left:'+(you*100)+'%" title="Your stance"></div></div></div>';
  }
  const polls=rows.map(r=>{
    const p=partyOf(r.k);
    return '<div class="poll-row '+(r.k==="player"?"you":"")+'"><span class="pdot" style="background:'+p.color+'"></span><span class="pname">'+esc(p.abbr)+'</span><span class="pval">'+pct(r.v)+'</span></div>';
  }).join("");
  let actions="";
  if(!here){
    const c=travelCost(S.location,d.id);
    actions+='<button class="btn wide" data-act="travel" '+((S.stamina<c||S.paused)?"disabled":"")+'>Travel here <span class="cost">'+c+' SP</span></button>';
  }else{
    for(const i of ISSUES){
      actions+='<button class="btn wide" data-act="rally" data-issue="'+i.id+'" '+((S.stamina<COSTS.rallySP||S.paused)?"disabled":"")+' title="Hold a rally focused on '+i.name+'">Rally: '+i.name+' <span class="cost">'+COSTS.rallySP+' SP</span></button>';
    }
    actions+='<button class="btn wide" data-act="ad" '+((S.cash<COSTS.ad||S.paused)?"disabled":"")+'>Local media ads <span class="cost">'+fmtMoney(COSTS.ad)+'</span></button>';
    if(S.hq[d.id])actions+='<button class="btn wide" disabled>Campaign HQ operational</button>';
    else actions+='<button class="btn wide" data-act="hq" '+((S.cash<COSTS.hq||Object.keys(S.hq).length>=COSTS.hqMax||S.paused)?"disabled":"")+'>Build Campaign HQ <span class="cost">'+fmtMoney(COSTS.hq)+'</span></button>';
  }
  return '<div class="dc-head"><div><b>'+esc(d.name)+'</b><div class="dc-bg">'+esc(d.bg)+'</div></div><span class="seat-chip">'+d.seats+' seats</span></div>'
    +'<div class="dc-enthusiasm"><div class="mini-label"><span>Voter enthusiasm</span><span>'+Math.round(ent*100)+'%</span></div>'
    +'<div class="bar"><div class="fill" style="width:'+clamp(ent/1.4*100,0,100)+'%;background:var(--acc)"></div></div></div>'
    +issues
    +'<div class="mini-label" style="margin-top:8px"><span>Poll · your share: <b style="color:var(--gold)">'+pct(sh.player||0)+'</b></span></div>'
    +polls
    +'<div class="dc-actions">'+actions+'</div>'
    +'<div class="dc-note">'+(here?"You are campaigning here now.":"Your candidate is in <b>"+DIST_BY_ID[S.location].name+"</b>.")+' Rallies are strongest on high-weight issues close to the district stance. HQs pay '+fmtMoney(COSTS.hqIncome)+'/week.</div>';
}

function projectNationalSeats(est){
  const elig=Object.keys(est).filter(k=>k!=="others"&&(est[k]||0)>=0.04);
  const seats={};
  const eligSum=elig.reduce((a,k)=>a+est[k],0);
  if(eligSum>0){
    let rem=240;
    const raw={},fracs=[];
    for(const k of elig){
      const r=est[k]/eligSum*240;
      raw[k]=Math.floor(r);
      fracs.push({k:k,f:r-Math.floor(r)});
      rem-=raw[k];
    }
    fracs.sort((a,b)=>b.f-a.f);
    for(let i=0;i<rem;i++)raw[fracs[i%fracs.length].k]++;
    for(const k of elig)seats[k]=raw[k];
  }
  return seats;
}

function renderNationalPolls(){
  const est=S.pollNat&&Object.keys(S.pollNat).length?S.pollNat:nationalShares(true);
  const rows=Object.keys(est).filter(k=>k!=="others").map(k=>({k:k,v:est[k]||0})).sort((a,b)=>b.v-a.v);
  const top=rows.length?Math.max(rows[0].v,0.001):1;
  const threshPct=0.04/top*100;
  const proj=projectNationalSeats(est);
  const rowsHtml=rows.map(r=>{
    const p=partyOf(r.k);
    const seats=proj[r.k];
    return '<div class="np-row '+(r.k==="player"?"you":"")+'">'
      +'<span class="pdot" style="background:'+(p?p.color:"#888")+'"></span>'
      +'<span class="pname">'+esc(p?p.abbr:r.k)+'</span>'
      +'<span class="np-bar"><span class="np-fill" style="width:'+Math.max(2,r.v/top*100)+'%;background:'+(p?p.color:"#888")+'"></span><span class="np-thresh" style="left:'+threshPct+'%" title="4% threshold"></span></span>'
      +'<span class="np-pct">'+pct(r.v)+'</span>'
      +'<span class="np-seats">'+(seats!==undefined?"~"+seats:"—")+'</span>'
      +'</div>';
  }).join("");
  const othersRow=(est.others||0)>0.001?'<div class="np-row np-others"><span class="pdot" style="background:#bbb"></span><span class="pname">Others</span><span class="np-bar"></span><span class="np-pct">'+pct(est.others)+'</span><span class="np-seats">—</span></div>':"";
  const youSeats=proj.player!==undefined?proj.player:0;
  return '<div class="np-head"><div class="mini-label"><span>National polling estimate</span><span>Week '+Math.min(S.week,20)+'</span></div>'
    +'<div class="np-sum">Projected <b style="color:var(--gold)">~'+youSeats+'</b> seats for your party · <b style="color:var(--gold)">'+pct(est.player||0)+'</b> nationally</div></div>'
    +rowsHtml+othersRow
    +'<div class="np-note">Polling estimate — seat projection assumes the 4% threshold. Real polls are never exact; the final results will differ.</div>';
}

function renderMods(){
  const list=$("mods-list");
  if(!S.modifiers.length){list.innerHTML='<span class="hint">None — for now.</span>';return;}
  list.innerHTML=S.modifiers.map(m=>'<div class="mod '+(m.bad?"bad":"")+'"><b>'+esc(m.name)+'</b><span>'+esc(m.desc)+(m.expires?" · ends after week "+(m.expires-1):" · permanent")+'</span></div>').join("");
}

function logEntriesHTML(limit){
  const arr=S.log.slice(-(limit||30)).reverse();
  let html="",prevWeek=null;
  for(const l of arr){
    if(prevWeek!==null&&l.week!==prevWeek)html+='<div class="log-week">— Week '+l.week+' —</div>';
    html+='<div class="log-line log-'+l.cls+'"><b>W'+l.week+'</b> · '+l.html+'</div>';
    prevWeek=l.week;
  }
  return html;
}

function renderLog(){
  $("log-list").innerHTML=logEntriesHTML(30);
}

function log(html,cls){
  S.log.push({week:Math.min(S.week,20),html:html,cls:cls||"info"});
  if(S.log.length>80)S.log.shift();
}

function updateAll(){
  if(!S||S.phase!=="campaign")return;
  renderTopbar();
  redrawMap();
  renderDistrictCard();
  renderMods();
  renderLog();
}

function selectDistrict(id){
  S.selDistrict=id;
  inspectorTab="district";
  renderDistrictCard();
  redrawMap();
}

function travelCost(a,b){
  const A=DIST_BY_ID[a],B=DIST_BY_ID[b];
  return Math.hypot(A.x-B.x,A.y-B.y)<160?1:2;
}

function travelTo(id){
  if(S.paused||id===S.location)return;
  const c=travelCost(S.location,id);
  if(S.stamina<c)return;
  S.stamina-=c;
  S.location=id;
  S.selDistrict=id;
  S.stats.travels++;
  log("Travelled to <b>"+DIST_BY_ID[id].name+"</b> (−"+c+" SP).","info");
  updateAll();
}

function doRally(issueId){
  if(S.paused||S.stamina<COSTS.rallySP)return;
  const d=DIST_BY_ID[S.location];
  if(!S.districtPoll||!S.districtPoll[d.id])recomputePolls();
  const before={...S.districtPoll[d.id]};
  const w=d.w[issueId];
  const fit=1-Math.abs(S.party.pos[issueId]-d.ideal[issueId]);
  const diminish=1/(1+S.ralliesThisTurn*0.5);
  const power=(0.055+getAttr("charisma")*0.0075)*(1+modSum("rallyMult"));
  const gain=power*(0.5+w*1.5*fit)*diminish;
  addBoost(d.id,"player",gain);
  S.enthusiasm[d.id]=clamp((S.enthusiasm[d.id]!==undefined?S.enthusiasm[d.id]:d.ent)+0.04,0.5,1.4);
  S.stamina-=COSTS.rallySP;
  S.ralliesThisTurn++;
  S.stats.rallies++;
  S.touched.push(d.id);
  recomputePolls();
  const after=S.districtPoll[d.id];
  const myDelta=after.player-(before.player||0);
  let rivalDelta=0;
  for(const k in after)if(k!=="player")rivalDelta+=after[k]-(before[k]||0);
  log("Rally in <b>"+d.name+"</b> focused on <b>"+ISSUES.find(i=>i.id===issueId).name+"</b>: YOU "+(myDelta>0?"+":"")+pts(myDelta)+" pts ("+pct(before.player||0)+" → "+pct(after.player)+"); other parties "+(rivalDelta>0?"+":"")+pts(rivalDelta)+" pts.","good");
  updateAll();
}

function buyAd(){
  if(S.paused||S.cash<COSTS.ad)return;
  const d=DIST_BY_ID[S.location];
  if(!S.districtPoll||!S.districtPoll[d.id])recomputePolls();
  const before={...S.districtPoll[d.id]};
  const cur=S.boost[d.id]&&S.boost[d.id].player?S.boost[d.id].player:0;
  const gain=(0.05+getAttr("intelligence")*0.004)*(1+modSum("adMult"))*(1/(1+3*cur));
  S.cash-=COSTS.ad;
  addBoost(d.id,"player",gain);
  S.stats.ads++;
  S.touched.push(d.id);
  recomputePolls();
  const after=S.districtPoll[d.id];
  const myDelta=after.player-(before.player||0);
  let rivalDelta=0;
  for(const k in after)if(k!=="player")rivalDelta+=after[k]-(before[k]||0);
  log("Bought local media ads in <b>"+d.name+"</b>: YOU "+(myDelta>0?"+":"")+pts(myDelta)+" pts ("+pct(before.player||0)+" → "+pct(after.player)+"); other parties "+(rivalDelta>0?"+":"")+pts(rivalDelta)+" pts.","good");
  updateAll();
}

function buildHQ(){
  if(S.paused||S.cash<COSTS.hq)return;
  const d=DIST_BY_ID[S.location];
  if(S.hq[d.id]||Object.keys(S.hq).length>=COSTS.hqMax)return;
  S.cash-=COSTS.hq;
  S.hq[d.id]=true;
  S.stats.hqs++;
  log("Opened a Campaign HQ in <b>"+d.name+"</b> (+"+fmtMoney(COSTS.hqIncome)+"/week).","good");
  recomputePolls();
  updateAll();
}

function aiTurn(){
  const aggr=DIFFS[S.difficulty].aggr;
  const sharesCache={};
  for(const d of DISTRICTS)sharesCache[d.id]=districtShares(d,false);
  let mainRivalTargets=null;
  for(const p of AI_PARTIES){
    let pts=Math.round(aggr*(2+p.appeal*4))+(p.mainRival?2:0);
    if(pts<=0)continue;
    const scored=DISTRICTS.map(d=>{
      const sh=sharesCache[d.id];
      let top=0;
      for(const k in sh){if(k!=="others"&&sh[k]>top)top=sh[k];}
      const mine=sh[p.id]||0;
      const comp=1-Math.max(0,top-mine);
      let v=d.seats*(0.25+issueAlign(p,d))*(0.4+comp);
      if(S.touched.includes(d.id))v*=1.6;
      return {d:d,v:v};
    });
    scored.sort((a,b)=>b.v-a.v);
    const top3=scored.slice(0,3);
    if(p.mainRival)mainRivalTargets=top3.map(t=>t.d.short);
    const wsum=top3.reduce((s,t)=>s+t.v,0)||1;
    for(const t of top3)addBoost(t.d.id,p.id,(pts*t.v/wsum)*0.013);
  }
  if(mainRivalTargets&&mainRivalTargets.length)log("<b>"+AI_PARTIES.find(p=>p.mainRival).abbr+"</b> campaigns this week in "+mainRivalTargets.join(", ")+".","info");
}

function endTurn(){
  if(S.paused||S.phase!=="campaign")return;
  S.week++;
  for(const d of DISTRICTS){
    const b=S.boost[d.id]||{};
    for(const k in b)b[k]*=0.72;
    const e=S.enthusiasm[d.id]!==undefined?S.enthusiasm[d.id]:d.ent;
    S.enthusiasm[d.id]=e+(d.ent-e)*0.15;
  }
  const hqCount=Object.keys(S.hq).length;
  const incMult=1+modSum("incomeMult");
  const hqIncome=hqCount*COSTS.hqIncome*incMult;
  const income=COSTS.stipend+hqIncome;
  S.cash+=Math.round(income);
  log("Week "+S.week+" income: <b>"+fmtMoney(income)+"</b> (state subsidy "+fmtMoney(COSTS.stipend)+(hqCount>0?" + "+hqCount+" HQ "+fmtMoney(hqIncome):"")+").","info");
  for(const dId in S.hq)addBoost(dId,"player",0.006);
  aiTurn();
  expireModifiers();
  S.pollsPrev=S.pollNat;
  recomputePolls();
  S.stamina=getMaxStamina();
  S.ralliesThisTurn=0;
  S.touched=[];
  saveGame();
  if(S.week>20){runElection();return;}
  maybeEvents();
  updateAll();
}

function dhondt(votes,seats){
  const res={};
  for(let s=0;s<seats;s++){
    let best=null,bv=-1;
    for(const k in votes){
      if(votes[k]<=0)continue;
      const q=votes[k]/((res[k]||0)+1);
      if(q>bv){bv=q;best=k;}
    }
    if(best===null)break;
    res[best]=(res[best]||0)+1;
  }
  return res;
}

function runElection(){
  S.phase="election";
  closeModal();
  const turnout=0.55+rng()*0.10;
  const votes={},dvAll=[];
  let total=0;
  for(const d of DISTRICTS){
    const sh=districtShares(d,false);
    const ent=S.enthusiasm[d.id]!==undefined?S.enthusiasm[d.id]:d.ent;
    const V=d.seats*12500*turnout*(0.85+0.15*ent);
    const dv={};
    for(const k in sh){
      if(k==="others")continue;
      dv[k]=sh[k]*V*(0.95+rng()*0.1);
    }
    dvAll.push({d:d,dv:dv});
    for(const k in dv){votes[k]=(votes[k]||0)+dv[k];total+=dv[k];}
  }
  const natShare={};
  for(const k in votes)natShare[k]=votes[k]/total;
  if(S.cheatFloor){
    const need=Math.max(0,0.0405*total-(votes.player||0));
    if(need>0)votes.player=(votes.player||0)+need;
    for(const k in votes)natShare[k]=votes[k]/total;
  }
  const qualified=Object.keys(votes).filter(k=>natShare[k]>=0.04);
  const seats={};
  for(const item of dvAll){
    const qv={};
    for(const k of qualified)if(item.dv[k]>0)qv[k]=item.dv[k];
    const res=dhondt(qv,item.d.seats);
    for(const k in res)seats[k]=(seats[k]||0)+res[k];
  }
  S.results={votes:votes,natShare:natShare,qualified:qualified,seats:seats,totalVotes:total,turnout:turnout};
  renderElectionScreen();
  showScreen("election");
}

function renderElectionScreen(){
  const r=S.results;
  $("election-sub").textContent="Turnout "+pct(r.turnout*100,0)+" · "+Math.round(r.totalVotes).toString().replace(/\B(?=(\d{3})+(?!\d))/g," ")+" valid votes · threshold 4%";
  const order=Object.keys(r.votes).sort((a,b)=>r.votes[b]-r.votes[a]);
  const maxShare=r.natShare[order[0]]||1;
  $("election-results").innerHTML=order.map(k=>{
    const p=partyOf(k);
    const qualified=r.qualified.includes(k);
    const seats=r.seats[k]||0;
    return '<div class="res-row '+(k==="player"?"you":"")+'">'
      +'<div class="res-top"><span class="pdot" style="background:'+p.color+'"></span>'
      +'<span class="rname">'+esc(partyName(p))+'</span>'
      +'<span class="rflag">'+(qualified?'<span class="chip green">IN PARLIAMENT</span>':'<span class="chip red">BELOW 4%</span>')+'</span>'
      +'<span class="rpct">'+pct(r.natShare[k])+'</span>'
      +'<span class="rseats">'+seats+' seats</span></div>'
      +'<div class="res-bar"><div class="fill" data-w="'+(r.natShare[k]/maxShare*100).toFixed(1)+'" style="background:'+p.color+'"></div></div>'
      +'</div>';
  }).join("");
  setTimeout(()=>{document.querySelectorAll(".res-bar .fill").forEach(f=>f.style.width=f.dataset.w+"%");},60);
  const seatOrder=Object.keys(r.seats).sort((a,b)=>r.seats[b]-r.seats[a]);
  let cells="";
  for(const k of seatOrder){
    const p=partyOf(k);
    for(let i=0;i<r.seats[k];i++)cells+='<div class="seat-cell" style="background:'+p.color+'" title="'+esc(p.abbr)+'"></div>';
  }
  $("seat-strip").innerHTML=cells;
}

function startCoalition(){
  const r=S.results,ps=r.seats.player||0;
  const aiSeats=AI_PARTIES.map(p=>r.seats[p.id]||0);
  const playerFirst=ps>=Math.max.apply(null,aiSeats);
  const parties={};
  for(const p of AI_PARTIES){
    const s=r.seats[p.id]||0;
    if(!s)continue;
    let dist=0;
    for(const i of ISSUES)dist+=Math.abs(p.pos[i.id]-S.party.pos[i.id]);
    dist/=ISSUES.length;
    let will=40-dist*55+(playerFirst?12:-12)+(S.rel[p.id]||0)/2+clamp((ps-s)/4,-8,12)+rnd(0,6);
    const demands=[{type:"ministry",name:p.favMinistry,cpCost:18,will:38,done:false}];
    if(rng()<0.85)demands.push({type:"policy",name:ISSUES.find(i=>i.id===p.topIssue).name,cpCost:14,will:30,done:false});
    if(rng()<0.65)demands.push({type:"cash",name:"Fund transfer",amount:rnd(20,50)*1000,will:26,done:false});
    parties[p.id]={baseWill:Math.round(clamp(will,5,95)),earned:0,joined:false,pact:false,courtesy:0,demands:demands};
  }
  const second=Math.max.apply(null,aiSeats);
  S.coalition={cp:40+getAttr("intelligence")*6+clamp(ps-second,-20,20),parties:parties,ministriesGiven:[],playerFirst:playerFirst};
  S.phase="coalition";
  renderCoalition();
  showScreen("coalition");
}

function coalitionSeats(){
  const r=S.results;
  let s=0;
  for(const pid in S.coalition.parties){
    const c=S.coalition.parties[pid];
    if(c.joined||c.pact)s+=r.seats[pid]||0;
  }
  return s;
}

function willOf(pid){
  const c=S.coalition.parties[pid];
  if(!c)return 0;
  let w=c.baseWill+(c.earned||0);
  for(const j in S.coalition.parties){
    if(j===pid||!S.coalition.parties[j].joined)continue;
    const rel=REL_MATRIX[pid]?REL_MATRIX[pid][j]:0;
    w+=rel*6;
  }
  return w;
}

function incompatibleJoined(pid){
  const bad=[];
  for(const pair of INCOMPAT_PAIRS){
    let other=null;
    if(pair[0]===pid)other=pair[1];
    else if(pair[1]===pid)other=pair[0];
    if(other&&S.coalition.parties[other]&&S.coalition.parties[other].joined)bad.push(partyOf(other).abbr);
  }
  return bad;
}

function checkJoin(pid){
  const c=S.coalition.parties[pid];
  if(willOf(pid)>=100&&!c.joined&&!c.pact){
    const bad=incompatibleJoined(pid);
    if(bad.length){c.blocked=bad.join(", ");return;}
    c.joined=true;
    c.blocked=null;
    log("<b>"+partyOf(pid).abbr+"</b> joins the coalition ("+(S.results.seats[pid]||0)+" seats)!","good");
  }
}

function fulfillDemand(pid,di){
  const C=S.coalition,c=C.parties[pid],dm=c.demands[di];
  if(!dm||dm.done)return;
  if(dm.type==="cash"){if(S.cash<dm.amount)return;S.cash-=dm.amount;}
  else{if(C.cp<dm.cpCost)return;C.cp-=dm.cpCost;}
  dm.done=true;
  c.earned+=dm.will;
  if(dm.type==="ministry")C.ministriesGiven.push({party:pid,name:dm.name});
  log("<b>"+partyOf(pid).abbr+"</b> demand met — "+(dm.type==="ministry"?"Cabinet: "+dm.name:dm.type==="policy"?"Policy: "+dm.name:fmtMoney(dm.amount))+" (−"+(dm.type==="cash"?fmtMoney(dm.amount):dm.cpCost+" CP")+", +"+dm.will+" willingness).","good");
  checkJoin(pid);
  renderCoalition();
}

function renderCoalition(){
  const C=S.coalition,r=S.results,ps=r.seats.player||0;
  const cs=coalitionSeats();
  const total=ps+cs;
  let segs='<div class="tseg" style="width:'+(ps/TOTAL_SEATS*100)+'%;background:'+S.party.color+'">'+ps+'</div>';
  for(const pid in C.parties){
    const c=C.parties[pid];
    if(!c.joined)continue;
    const s=r.seats[pid]||0,p=partyOf(pid);
    segs+='<div class="tseg" style="width:'+(s/TOTAL_SEATS*100)+'%;background:'+p.color+'">'+s+'</div>';
  }
  for(const pid in C.parties){
    const c=C.parties[pid];
    if(!c.pact)continue;
    const s=r.seats[pid]||0,p=partyOf(pid);
    segs+='<div class="tseg" style="width:'+(s/TOTAL_SEATS*100)+'%;background:'+p.color+';opacity:.55">'+s+'</div>';
  }
  segs+='<div class="tseg" style="flex:1;background:#1b2740"></div>';
  $("coal-tally-bar").innerHTML=segs+'<div class="tally-marker" style="left:'+(MAJORITY/TOTAL_SEATS*100)+'%"></div>';
  $("coal-tally-text").innerHTML="Your bloc: <b>"+total+"</b> / 240 · majority "+MAJORITY;
  $("coal-resources").innerHTML="Political capital: <b>"+C.cp+"</b> · Funds: <b>"+fmtMoney(S.cash)+"</b>";
  let cards="";
  for(const p of AI_PARTIES){
    const c=C.parties[p.id];
    if(!c)continue;
    const s=r.seats[p.id]||0;
    let demandsHtml="";
    c.demands.forEach((dm,di)=>{
      const label=dm.type==="ministry"?"Cabinet: "+dm.name:dm.type==="policy"?"Policy: "+dm.name:"Funds: "+fmtMoney(dm.amount);
      const cost=dm.type==="cash"?"cash":"−"+dm.cpCost+" CP";
      const afford=dm.type==="cash"?S.cash>=dm.amount:C.cp>=dm.cpCost;
      demandsHtml+='<button class="demand-chip '+(dm.done?"done":"")+'" data-demand="'+p.id+':'+di+'" '+((dm.done||!afford)?"disabled":"")+'>'
        +(dm.done?esc(label)+" · granted":esc(label)+' <span class="dc-cost">'+cost+'</span>')+'</button>';
    });
    const status=c.joined?'<span class="cc-status" style="color:#3fd4a6">IN COALITION</span>':c.pact?'<span class="cc-status" style="color:var(--gold)">SUPPORT PACT</span>':"";
    const w=willOf(p.id);
    cards+='<div class="coal-card '+(c.joined?"joined":c.pact?"pacted":"")+'">'
      +'<div class="cc-head"><span class="pdot" style="background:'+p.color+'"></span><b>'+esc(p.name)+'</b><span class="cc-seats">'+s+' seats</span></div>'
      +'<div class="cc-ideo">'+esc(p.ideo)+' · led by '+esc(p.leader)+' · '+status+'</div>'
      +'<div class="will-wrap"><div class="will-num"><span>Willingness</span><span>'+Math.min(w,130)+'/100</span></div>'
      +'<div class="bar"><div class="fill" style="width:'+clamp(w/120*100,0,100)+'%;background:'+(w>=100?"#3fd4a6":"var(--gold)")+'"></div></div></div>'
      +'<div class="cc-demands">'+demandsHtml+'</div>'
      +'<div class="cc-btns">'
      +'<button class="btn sm" data-courtesy="'+p.id+'" '+((c.courtesy>=3||C.cp<6||c.joined||c.pact)?"disabled":"")+'>Courteous gesture (−6 CP, +8)</button>'
      +((!c.joined&&!c.pact&&w>=75)?'<button class="btn sm" data-pact="'+p.id+'" '+((C.cp<12)?"disabled":"")+'>Support pact (−12 CP)</button>':"")
      +(c.joined?'<button class="btn sm ghost" data-leave="'+p.id+'">Ask to leave</button>':"")
      +'</div>'
      +(c.blocked?'<div class="dc-note" style="color:#ff7b6d">Refuses to govern with '+esc(c.blocked)+' — remove them first.</div>':"")
      +'</div>';
  }
  $("coalition-cards").innerHTML=cards;
  $("btn-form-gov").disabled=total<MAJORITY;
  $("btn-minority").style.display=(ps>=100&&ps<MAJORITY&&total<MAJORITY)?"":"none";
  document.querySelectorAll("#coalition-cards [data-demand]").forEach(b=>{
    b.onclick=()=>{const parts=b.dataset.demand.split(":");fulfillDemand(parts[0],+parts[1]);};
  });
  document.querySelectorAll("#coalition-cards [data-courtesy]").forEach(b=>{
    b.onclick=()=>{
      const pid=b.dataset.courtesy,c=C.parties[pid];
      if(c.courtesy>=3||C.cp<6||c.joined||c.pact)return;
      C.cp-=6;c.courtesy++;c.earned+=8;
      log("Courteous gesture to <b>"+partyOf(pid).abbr+"</b>: +8 willingness (−6 CP).","info");
      checkJoin(pid);
      renderCoalition();
    };
  });
  document.querySelectorAll("#coalition-cards [data-pact]").forEach(b=>{
    b.onclick=()=>{
      const pid=b.dataset.pact,c=C.parties[pid];
      if(c.joined||c.pact||willOf(pid)<75||C.cp<12)return;
      C.cp-=12;c.pact=true;
      log("Support pact with <b>"+partyOf(pid).abbr+"</b> ("+(r.seats[pid]||0)+" seats toward the majority, −12 CP).","info");
      renderCoalition();
    };
  });
  document.querySelectorAll("#coalition-cards [data-leave]").forEach(b=>{
    b.onclick=()=>{
      const pid=b.dataset.leave,c=C.parties[pid];
      c.joined=false;
      log("<b>"+partyOf(pid).abbr+"</b> has been asked to leave the coalition.","bad");
      renderCoalition();
    };
  });
  const cl=$("coal-log");
  if(cl)cl.innerHTML=logEntriesHTML(15);
}

function finishGame(type){
  S.phase="end";
  S.ending=type;
  closeModal();
  renderEndScreen();
  showScreen("end");
  saveGame();
}

function renderEndScreen(){
  const r=S.results||{seats:{},natShare:{}};
  const ps=r.seats.player||0;
  const C=S.coalition;
  $("end-banner").style.cssText=BGSTYLES[S.party.bgStyle](S.party.color,shade(S.party.color,.6));
  $("end-banner").innerHTML=bannerInner();
  let title="",text="";
  if(S.ending==="threshold"){
    title="Below the 4% Threshold";
    text=S.party.name+" finished with "+pct(r.natShare.player||0)+" of the national vote — short of the 4% barrier. No seats in the Narodno Subranie, no coalition calls, no second chances.\n\n"+S.player.name+" announces 'we will be back' — and means it.";
  }else if(S.ending==="majority"){
    title="Single-Party Majority!";
    text="An astonishing result: "+S.party.abbr+" wins "+ps+" seats — an outright majority in the 240-seat Narodno Subranie. No coalition haggling, no concessions.\n\n"+S.player.name+" is elected Prime Minister with a mandate history books will remember.";
  }else if(S.ending==="coalition"){
    const partners=Object.keys(C.parties).filter(pid=>C.parties[pid].joined).map(pid=>partyOf(pid).abbr);
    const pacts=Object.keys(C.parties).filter(pid=>C.parties[pid].pact).map(pid=>partyOf(pid).abbr);
    const bloc=ps+coalitionSeats();
    const margin=bloc-MAJORITY;
    const grade=(margin>=15&&C.cp>=20)?"STRONG":(margin>=5?"STABLE":"FRAGILE");
    title="Government Formed!";
    text="After tense negotiations, "+S.player.name+" secures "+bloc+" seats — "+margin+" above the "+MAJORITY+" majority line.\n\nCoalition partners: "+(partners.join(", ")||"none")+(pacts.length?" · Support pacts: "+pacts.join(", "):"")+".\nMinistries given away: "+(C.ministriesGiven.length?C.ministriesGiven.map(m=>m.name+" ("+partyOf(m.party).abbr+")").join(", "):"none — you kept them all")+".\n\nAssessment: a "+grade+" government. The real campaign — governing — begins now.";
  }else if(S.ending==="minority"){
    title="Minority Government";
    text="With "+ps+" seats, "+S.party.abbr+" forms a minority cabinet tolerated by a weary parliament. Every bill will be a knife fight.\n\n"+S.player.name+" becomes Prime Minister — on borrowed time.";
  }else if(S.ending==="opposition"){
    title="Into Opposition";
    text="Negotiations collapse and the winners form a government without you.\n\n"+S.party.abbr+"'s "+ps+" MPs take the opposition benches. "+S.player.name+" promises to hold them accountable 'every single day'.";
  }else{
    title="Mandate Failed";
    text="Despite finishing first, "+S.player.name+" cannot stitch together "+MAJORITY+" seats. The President dissolves the Narodno Subranie and appoints a caretaker government.\n\nSnap elections loom — and your rivals will remember what you promised them.";
  }
  $("end-title").textContent=title;
  if(S.cheat)text+="\n\n(Played in CHEAT MODE.)";
  $("end-text").textContent=text;
  $("end-stats").innerHTML=[
    ["Seats won",ps],["National vote",pct(r.natShare.player||0)],["Rallies",S.stats.rallies],
    ["Media ads",S.stats.ads],["HQs built",S.stats.hqs],["Weeks on trail",20]
  ].map(x=>'<div class="end-stat"><b>'+x[1]+'</b>'+x[0]+'</div>').join("");
}

function gotoStep(n){
  S.setupStep=n;
  clearSetupError();
  for(let i=0;i<3;i++){
    $("setup-step-"+i).classList.toggle("active",i===n);
    $("step-tab-"+i).classList.toggle("active",i===n);
    $("step-tab-"+i).classList.toggle("done",i<n);
  }
  $("btn-setup-back").style.visibility=n===0?"hidden":"visible";
  $("btn-setup-next").textContent=n===2?"Start Campaign ▸":"Next ›";
  if(n===2)renderSummary();
}

function renderPresetLeaders(){
  $("preset-leaders").innerHTML=PRESET_LEADERS.map((p,i)=>
    '<div class="preset-card" data-i="'+i+'"><div class="pc-face">'+faceSVG(FACES[p.face])+'</div><div><b>'+esc(p.name)+'</b><span>'+esc(p.tag)+' · S'+p.attrs.stamina+' C'+p.attrs.charisma+' I'+p.attrs.intelligence+'</span></div></div>'
  ).join("");
  document.querySelectorAll("#preset-leaders .preset-card").forEach(c=>{
    c.onclick=()=>{
      const p=PRESET_LEADERS[+c.dataset.i];
      S.player.name=p.name;
      S.player.face=p.face;
      S.player.photo=null;
      S.player.appearance=Object.assign(defaultAppearance(),FACES[p.face]);
      S.player.appearance.ethnicity=p.ethnicity||"bulgarian";
      S.player.attrs={stamina:p.attrs.stamina,charisma:p.attrs.charisma,intelligence:p.attrs.intelligence};
      $("in-cand-name").value=p.name;
      updateAttrUI();
      renderFaceGrid();
      renderAppearanceUI();
      renderPortraitPreview();
      document.querySelectorAll("#preset-leaders .preset-card").forEach(x=>x.classList.remove("sel"));
      c.classList.add("sel");
    };
  });
}

function renderFaceGrid(){
  $("face-grid").innerHTML=FACES.map((f,i)=>'<div class="face-cell '+(S.player.face===i&&!S.player.photo?"sel":"")+'" data-i="'+i+'">'+faceSVG(f)+'</div>').join("");
  document.querySelectorAll("#face-grid .face-cell").forEach(c=>{
    c.onclick=()=>{
      S.player.face=+c.dataset.i;
      S.player.photo=null;
      S.player.appearance=Object.assign({},FACES[+c.dataset.i]);
      $("btn-clear-photo").style.display="none";
      renderFaceGrid();
      renderAppearanceUI();
      renderPortraitPreview();
    };
  });
}

function swatchRow(elId,colors,current,fn){
  const el=$(elId);
  if(!el)return;
  el.innerHTML=colors.map(c=>'<div class="swatch '+(c===current?"sel":"")+'" data-c="'+c+'" style="background:'+c+'"></div>').join("");
  el.querySelectorAll(".swatch").forEach(s=>{
    s.onclick=()=>{fn(s.dataset.c);renderAppearanceUI();renderPortraitPreview();};
  });
}

function cycleAppearanceStyle(key,list,dir){
  const app=S.player.appearance;
  let i=list.indexOf(app[key]);
  i=(i+dir+list.length)%list.length;
  app[key]=list[i];
  renderAppearanceUI();
  renderPortraitPreview();
}

function renderAppearanceUI(){
  const app=S.player.appearance;
  if(!app)return;
  swatchRow("sw-skin",SKIN_TONES,SKIN_TONES[app.skin],c=>{app.skin=SKIN_TONES.indexOf(c);});
  swatchRow("sw-hair",HAIR_COLORS,app.hairColor,c=>{app.hairColor=c;});
  swatchRow("sw-suit",SUIT_COLORS,app.suitColor,c=>{app.suitColor=c;});
  swatchRow("sw-shirt",SHIRT_COLORS,app.shirtColor,c=>{app.shirtColor=c;});
  $("hair-label").textContent=HAIR_STYLE_NAMES[app.hairStyle]||app.hairStyle;
  $("suit-label").textContent=SUIT_STYLE_NAMES[app.suitStyle]||app.suitStyle;
  $("btn-gender-m").classList.toggle("on",app.gender==="male");
  $("btn-gender-f").classList.toggle("on",app.gender==="female");
  $("sel-ethnicity").value=app.ethnicity;
  $("btn-glasses").textContent="Glasses: "+(app.glasses?"On":"Off");
}

function renderPortraitPreview(){
  $("portrait-preview").innerHTML=portraitHTML();
}

function updateAttrUI(){
  for(const k of["stamina","charisma","intelligence"]){
    $("in-attr-"+k).value=S.player.attrs[k];
    $("val-attr-"+k).textContent=S.player.attrs[k];
  }
  const sum=S.player.attrs.stamina+S.player.attrs.charisma+S.player.attrs.intelligence;
  const rem=15-sum;
  if(rem>=0)clearSetupError();
  const el=$("attr-remaining");
  el.textContent=rem>=0?rem+" points left":(-rem)+" over budget";
  el.className="chip "+(rem<0?"red":"gold");
}

function showSetupError(msg){
  const el=$("setup-error");
  if(el){el.textContent=msg;el.style.display="block";}
}
function clearSetupError(){
  const el=$("setup-error");
  if(el){el.style.display="none";el.textContent="";}
}

function renderSwatches(){
  $("color-swatches").innerHTML=PALETTE.map(c=>'<div class="swatch '+(S.party.color===c?"sel":"")+'" data-c="'+c+'" style="background:'+c+'"></div>').join("");
  document.querySelectorAll("#color-swatches .swatch").forEach(s=>{
    s.onclick=()=>{
      S.party.color=s.dataset.c;
      renderSwatches();
      renderBannerPreview();
    };
  });
}

function renderPlatformSliders(){
  $("platform-sliders").innerHTML=ISSUES.map(i=>
    '<div class="platform-row"><div class="pr-top"><span>'+i.name+'</span><span id="plv-'+i.id+'"></span></div>'
    +'<input type="range" min="0" max="100" value="'+Math.round(S.party.pos[i.id]*100)+'" data-issue="'+i.id+'">'
    +'<div class="pr-ends"><span>'+i.lo+'</span><span>'+i.hi+'</span></div></div>'
  ).join("");
  document.querySelectorAll("#platform-sliders input").forEach(inp=>{
    inp.addEventListener("input",()=>{
      S.party.pos[inp.dataset.issue]=+inp.value/100;
      $("plv-"+inp.dataset.issue).textContent=inp.value;
    });
    $("plv-"+inp.dataset.issue).textContent=inp.value;
  });
}

function renderBannerPreview(){
  const c=S.party.color;
  $("banner-preview").innerHTML='<div class="banner" style="'+BGSTYLES[S.party.bgStyle](c,shade(c,.6))+'">'+bannerInner()+'</div>';
  $("bg-label").textContent="Style: "+BGSTYLE_NAMES[S.party.bgStyle];
  $("emb-label").textContent="Emblem: "+(S.party.logo?"custom logo":EMBLEM_IDS[S.party.emblemIdx]);
  $("btn-clear-logo").style.display=S.party.logo?"":"none";
}

function renderSummary(){
  const idLines=identityEffectLines();
  $("setup-summary").innerHTML='<div class="sum-portrait">'+portraitHTML()+'</div><div class="sum-lines">'
    +'PM candidate: <b>'+esc(S.player.name||"Unnamed candidate")+'</b> · Stamina '+S.player.attrs.stamina+' · Charisma '+S.player.attrs.charisma+' · Intelligence '+S.player.attrs.intelligence+'<br>'
    +'Identity: <b>'+esc(ETHNICITY_NAMES[S.player.appearance.ethnicity]||S.player.appearance.ethnicity)+'</b> · <b>'+esc(S.player.appearance.gender==="female"?"Female":"Male")+'</b>'+(idLines.length?'<br><span class="hint">'+idLines.map(esc).join("<br>")+'</span>':"")
    +'<br>Party: <b>'+esc(S.party.name)+'</b> ('+esc(S.party.abbr)+') · "'+esc(S.party.slogan)+'"<br>'
    +'Platform: '+ISSUES.map(i=>i.name+" "+Math.round(S.party.pos[i.id]*100)).join(" · ")
    +((S.player.name||"").trim().toUpperCase()==="EASY WIN"?'<br><b style="color:var(--gold)">CHEAT MODE WILL BE ACTIVE.</b>':"")
    +'</div>';
}

function readImage(file,maxSide,cb){
  const fr=new FileReader();
  fr.onload=()=>{
    const img=new Image();
    img.onload=()=>{
      const f=Math.min(1,maxSide/Math.max(img.width,img.height));
      const c=document.createElement("canvas");
      c.width=Math.max(1,Math.round(img.width*f));
      c.height=Math.max(1,Math.round(img.height*f));
      c.getContext("2d").drawImage(img,0,0,c.width,c.height);
      cb(c.toDataURL("image/jpeg",0.85));
    };
    img.src=fr.result;
  };
  fr.readAsDataURL(file);
}

function initSetup(){
  S=freshState();
  buildEventPool();
  $("in-cand-name").value="";
  renderPresetLeaders();
  renderFaceGrid();
  renderAppearanceUI();
  renderPortraitPreview();
  updateAttrUI();
  $("in-party-name").value=S.party.name;
  $("in-party-abbr").value=S.party.abbr;
  $("in-party-slogan").value=S.party.slogan;
  renderSwatches();
  renderPlatformSliders();
  renderBannerPreview();
  showScreen("setup");
  gotoStep(0);
}

function startCampaign(){
  if(!S)S=freshState();
  if(!S.player.appearance)S.player.appearance=Object.assign(defaultAppearance(),FACES[S.player.face||0]||{});
  if(!S.player.name)S.player.name="Aleksandar Vasilev";
  if(!S.party.name)S.party.name="National Renewal Movement";
  if(!S.party.abbr)S.party.abbr=S.party.name.split(/\s+/).map(w=>w[0]).join("").toUpperCase().slice(0,5);
  S.cheat=!!(S.player.name&&S.player.name.trim().toUpperCase()==="EASY WIN");
  S.cheatFloor=false;
  S.phase="campaign";
  S.week=1;
  S.cash=DIFFS[S.difficulty].cash;
  S.stamina=getMaxStamina();
  S.location="sofia-city";
  S.selDistrict="sofia-city";
  S.hq={};S.boost={};S.enthusiasm={};S.modifiers=[];S.rel={};S.touched=[];S.ralliesThisTurn=0;
  S.log=[];
  S.stats={rallies:0,ads:0,hqs:0,travels:0};
  for(const d of DISTRICTS){
    S.enthusiasm[d.id]=d.ent;
    S.boost[d.id]={};
    for(const p of AI_PARTIES){
      if(d.lean&&d.lean[p.id])S.boost[d.id][p.id]=d.lean[p.id]*0.3;
    }
  }
  S.boost["sofia-city"].player=0.02;
  if(!EVENT_POOL.length)buildEventPool();
  S.eventBag=shuffle([...Array(EVENT_POOL.length).keys()]);
  S.eventCursor=0;
  S.eventQueue=[];
  recomputePolls();
  S.pollsPrev=null;
  buildMap();
  showScreen("game");
  log("The campaign begins. "+ELECTION_DATE+" is 20 weeks away. First stop: <b>Sofia</b>.","info");
  log("National poll: <b>"+esc(S.party.abbr)+"</b> at "+pct(S.pollNat.player||0)+". Threshold: 4%.","info");
  if(S.cheat)log("CHEAT MODE ENABLED — the gods smile upon <b>"+esc(S.player.name)+"</b>.","info");
  updateAll();
  saveGame();
}

function bindUI(){
  $("btn-new-game").onclick=initSetup;
  $("btn-continue").onclick=()=>{if(!loadGame())alert("No save found.");};
  $("btn-title-help").onclick=helpModal;

  for(let i=0;i<3;i++)$("step-tab-"+i).onclick=()=>gotoStep(i);
  $("btn-setup-back").onclick=()=>gotoStep(Math.max(0,S.setupStep-1));
  $("btn-setup-next").onclick=()=>{
    if(S.setupStep===0){
      const sum=S.player.attrs.stamina+S.player.attrs.charisma+S.player.attrs.intelligence;
      if(sum>15){showSetupError("Attribute points exceed the budget of 15.");return;}
      if(!$("in-cand-name").value.trim())$("in-cand-name").value="Aleksandar Vasilev";
      gotoStep(1);
    }else if(S.setupStep===1){
      if(!S.party.abbr.trim())S.party.abbr="NRM";
      gotoStep(2);
    }else{
      startCampaign();
    }
  };

  $("in-cand-name").addEventListener("input",e=>{if(S)S.player.name=e.target.value;});
  for(const k of["stamina","charisma","intelligence"]){
    $("in-attr-"+k).addEventListener("input",e=>{
      S.player.attrs[k]=+e.target.value;
      updateAttrUI();
    });
  }
  $("btn-upload-photo").onclick=()=>$("file-photo").click();
  $("btn-hair-prev").onclick=()=>cycleAppearanceStyle("hairStyle",HAIR_STYLES,-1);
  $("btn-hair-next").onclick=()=>cycleAppearanceStyle("hairStyle",HAIR_STYLES,1);
  $("btn-suit-prev").onclick=()=>cycleAppearanceStyle("suitStyle",SUIT_STYLES,-1);
  $("btn-suit-next").onclick=()=>cycleAppearanceStyle("suitStyle",SUIT_STYLES,1);
  $("btn-gender-m").onclick=()=>{if(S&&S.player.appearance){S.player.appearance.gender="male";renderAppearanceUI();renderPortraitPreview();}};
  $("btn-gender-f").onclick=()=>{if(S&&S.player.appearance){S.player.appearance.gender="female";renderAppearanceUI();renderPortraitPreview();}};
  $("sel-ethnicity").addEventListener("change",e=>{if(S&&S.player.appearance)S.player.appearance.ethnicity=e.target.value;});
  $("btn-glasses").onclick=()=>{if(S&&S.player.appearance){S.player.appearance.glasses=!S.player.appearance.glasses;renderAppearanceUI();renderPortraitPreview();}};
  $("file-photo").addEventListener("change",e=>{
    const f=e.target.files[0];
    if(!f)return;
    readImage(f,240,url=>{
      S.player.photo=url;
      renderFaceGrid();
      renderPortraitPreview();
      $("btn-clear-photo").style.display="";
    });
    e.target.value="";
  });
  $("btn-clear-photo").onclick=()=>{
    S.player.photo=null;
    $("btn-clear-photo").style.display="none";
    renderFaceGrid();
    renderPortraitPreview();
  };

  $("in-party-name").addEventListener("input",e=>{S.party.name=e.target.value;renderBannerPreview();});
  $("in-party-abbr").addEventListener("input",e=>{S.party.abbr=e.target.value.toUpperCase();renderBannerPreview();});
  $("in-party-slogan").addEventListener("input",e=>{S.party.slogan=e.target.value;renderBannerPreview();});
  $("btn-bg-prev").onclick=()=>{S.party.bgStyle=(S.party.bgStyle+BGSTYLES.length-1)%BGSTYLES.length;renderBannerPreview();};
  $("btn-bg-next").onclick=()=>{S.party.bgStyle=(S.party.bgStyle+1)%BGSTYLES.length;renderBannerPreview();};
  $("btn-emb-prev").onclick=()=>{S.party.emblemIdx=(S.party.emblemIdx+EMBLEM_IDS.length-1)%EMBLEM_IDS.length;renderBannerPreview();};
  $("btn-emb-next").onclick=()=>{S.party.emblemIdx=(S.party.emblemIdx+1)%EMBLEM_IDS.length;renderBannerPreview();};
  $("btn-upload-logo").onclick=()=>$("file-logo").click();
  $("file-logo").addEventListener("change",e=>{
    const f=e.target.files[0];
    if(!f)return;
    readImage(f,240,url=>{S.party.logo=url;renderBannerPreview();});
    e.target.value="";
  });
  $("btn-clear-logo").onclick=()=>{S.party.logo=null;renderBannerPreview();};
  document.querySelectorAll('input[name="diff"]').forEach(r=>{
    r.addEventListener("change",()=>{
      S.difficulty=r.value;
      document.querySelectorAll(".diff-opt").forEach(o=>o.classList.remove("picked"));
      r.closest(".diff-opt").classList.add("picked");
    });
  });

  $("btn-endturn").onclick=endTurn;
  $("btn-help").onclick=helpModal;
  $("btn-debug").onclick=debugModal;
  $("btn-save").onclick=()=>{saveGame();log("Campaign saved.","info");renderLog();};
  $("btn-menu").onclick=menuModal;
  const startBtn=$("btn-start");
  if(startBtn)startBtn.onclick=menuModal;

  $("btn-election-continue").onclick=()=>{
    const r=S.results,ps=r.seats.player||0;
    if(!r.qualified.includes("player"))finishGame("threshold");
    else if(ps>=MAJORITY)finishGame("majority");
    else startCoalition();
  };

  $("btn-form-gov").onclick=()=>finishGame("coalition");
  $("btn-minority").onclick=()=>finishGame("minority");
  $("btn-give-up").onclick=()=>finishGame(S.coalition&&S.coalition.playerFirst?"caretaker":"opposition");

  $("btn-restart").onclick=()=>location.reload();
}

function init(){
  bindUI();
  document.querySelectorAll(".diff-opt").forEach(o=>{
    if(o.querySelector("input").checked)o.classList.add("picked");
  });
  if(hasSave())$("btn-continue").style.display="";
}

if(typeof document!=="undefined"){
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);
  else init();
}

if(typeof module!=="undefined"&&module.exports){
  module.exports={
    DISTRICTS:DISTRICTS,AI_PARTIES:AI_PARTIES,dhondt:dhondt,TOTAL_SEATS:TOTAL_SEATS,
    state:()=>S,freshState:freshState,startCampaign:startCampaign,endTurn:endTurn,runElection:runElection,
    startCoalition:startCoalition,coalitionSeats:coalitionSeats,fulfillDemand:fulfillDemand,finishGame:finishGame,
    doRally:doRally,travelTo:travelTo,buyAd:buyAd,buildHQ:buildHQ,districtShares:districtShares,nationalShares:nationalShares,
    candidateModifiers:candidateModifiers,faceSVG:faceSVG,defaultAppearance:defaultAppearance,PIXEL_FACE:PIXEL_FACE,
    portraitHTML:portraitHTML,
    SKIN_TONES:SKIN_TONES,HAIR_STYLES:HAIR_STYLES,SUIT_STYLES:SUIT_STYLES,ETHNICITY_NAMES:ETHNICITY_NAMES,
    saveGame:saveGame,loadGame:loadGame,recomputePolls:recomputePolls,
    applyFx:applyFx,logEntriesHTML:logEntriesHTML,EVENT_POOL:()=>EVENT_POOL,
    checkJoin:checkJoin,willOf:willOf,REL_MATRIX:REL_MATRIX,INCOMPAT_PAIRS:INCOMPAT_PAIRS,
    setPlayer:(cfg)=>{
      if(!S)S=freshState();
      if(cfg.attrs)Object.assign(S.player.attrs,cfg.attrs);
      if(cfg.name)S.player.name=cfg.name;
      if(cfg.pos)Object.assign(S.party.pos,cfg.pos);
      if(cfg.abbr)S.party.abbr=cfg.abbr;
    }
  };
}
