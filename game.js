"use strict";

const ISSUES=[
  {id:"euro",name:"Eurozone Entry",lo:"Eurosceptic",hi:"Eurozone Now"},
  {id:"corruption",name:"Anticorruption Reform",lo:"Status Quo",hi:"Zero Tolerance"},
  {id:"energy",name:"Energy Subsidies",lo:"Free Market",hi:"State Subsidies"},
  {id:"judiciary",name:"Judicial Independence",lo:"Executive Control",hi:"Full Independence"}
];
const NEW_ISSUES=[
  {id:"pensions",name:"Pension Reform",lo:"Austerity",hi:"Generous Pensions"},
  {id:"healthcare",name:"Healthcare",lo:"Private Care",hi:"Public Care"},
  {id:"defense",name:"Defense Spending",lo:"Cut Defence",hi:"Rearm"},
  {id:"rural",name:"Rural Development",lo:"Urban Focus",hi:"Village Investment"},
  {id:"migration",name:"Migration",lo:"Open Borders",hi:"Restrictive"}
];
const ISSUE_POOL=ISSUES.concat(NEW_ISSUES);
const ISSUE_BY_ID={};
ISSUE_POOL.forEach(i=>ISSUE_BY_ID[i.id]=i);

const MINISTRIES=["Finance","Interior","Foreign Affairs","Justice","Energy","Health","Education","Defence","Agriculture","Transport","Economy","Culture","Environment","Labour & Social Policy","Tourism","Digital Governance"];

const DISTRICTS=[
  {id:"sofia-city",name:"Sofia City",short:"Sofia City",bg:"София (град)",seats:40,x:176,y:314,w:{"euro":0.28,"corruption":0.28,"energy":0.1,"judiciary":0.22,"pensions":0.07,"healthcare":0.12,"defense":0.04,"rural":0.03,"migration":0.1},ideal:{"euro":0.9,"corruption":0.85,"energy":0.45,"judiciary":0.85,"pensions":0.45,"healthcare":0.75,"defense":0.45,"rural":0.15,"migration":0.7},ent:1.08,lean:{"ppdb":0.16,"pb":0.12,"gerb":0.06},eth:{"bulgarian":0.95,"turkish":0.005,"roma":0.015},geo:{"proEU":0.92,"proRussia":0.15,"proNATO":0.9,"proUS":0.8,"nationalism":0.3,"urbanization":0.97},tb:0.524},
  {id:"sofia-obl",name:"Sofia Oblast",short:"Sofia Prov.",bg:"Софийска област",seats:9,x:245,y:296,w:{"euro":0.18,"corruption":0.18,"energy":0.22,"judiciary":0.14,"pensions":0.14,"healthcare":0.14,"defense":0.08,"rural":0.2,"migration":0.1},ideal:{"euro":0.68,"corruption":0.58,"energy":0.62,"judiciary":0.52,"pensions":0.6,"healthcare":0.7,"defense":0.58,"rural":0.7,"migration":0.55},ent:0.92,lean:{"ppdb":0.08,"gerb":0.12,"pb":0.1},eth:{"bulgarian":0.9,"turkish":0.015,"roma":0.05},geo:{"proEU":0.68,"proRussia":0.35,"proNATO":0.65,"proUS":0.6,"nationalism":0.48,"urbanization":0.55},tb:0.56},
  {id:"plovdiv-city",name:"Plovdiv-Grad",short:"Plovdiv",bg:"Пловдив (град)",seats:17,x:397,y:390,w:{"euro":0.27,"corruption":0.26,"energy":0.14,"judiciary":0.2,"pensions":0.08,"healthcare":0.13,"defense":0.04,"rural":0.04,"migration":0.1},ideal:{"euro":0.8,"corruption":0.75,"energy":0.5,"judiciary":0.7,"pensions":0.5,"healthcare":0.75,"defense":0.48,"rural":0.2,"migration":0.62},ent:1.05,lean:{"ppdb":0.12,"pb":0.12,"gerb":0.06},eth:{"bulgarian":0.88,"turkish":0.05,"roma":0.035},geo:{"proEU":0.85,"proRussia":0.25,"proNATO":0.82,"proUS":0.75,"nationalism":0.35,"urbanization":0.85},tb:0.522},
  {id:"plovdiv-obl",name:"Plovdiv Oblast",short:"Plovdiv Prov.",bg:"Пловдивска област",seats:10,x:398,y:351,w:{"euro":0.18,"corruption":0.16,"energy":0.28,"judiciary":0.14,"pensions":0.14,"healthcare":0.13,"defense":0.08,"rural":0.24,"migration":0.1},ideal:{"euro":0.62,"corruption":0.52,"energy":0.7,"judiciary":0.47,"pensions":0.65,"healthcare":0.72,"defense":0.62,"rural":0.75,"migration":0.5},ent:0.88,lean:{"gerb":0.1,"pb":0.08,"dps":0.06},eth:{"bulgarian":0.82,"turkish":0.1,"roma":0.04},geo:{"proEU":0.62,"proRussia":0.42,"proNATO":0.6,"proUS":0.55,"nationalism":0.55,"urbanization":0.5},tb:0.481},
  {id:"varna",name:"Varna",short:"Varna",bg:"Варна",seats:13,x:866,y:238,w:{"euro":0.3,"corruption":0.26,"energy":0.12,"judiciary":0.18,"pensions":0.07,"healthcare":0.14,"defense":0.05,"rural":0.04,"migration":0.1},ideal:{"euro":0.85,"corruption":0.78,"energy":0.55,"judiciary":0.68,"pensions":0.48,"healthcare":0.75,"defense":0.5,"rural":0.25,"migration":0.65},ent:1.04,lean:{"ppdb":0.12,"pb":0.1,"gerb":0.06},eth:{"bulgarian":0.86,"turkish":0.07,"roma":0.03},geo:{"proEU":0.88,"proRussia":0.25,"proNATO":0.85,"proUS":0.78,"nationalism":0.4,"urbanization":0.88},tb:0.509},
  {id:"burgas",name:"Burgas",short:"Burgas",bg:"Бургас",seats:11,x:799,y:343,w:{"euro":0.22,"corruption":0.2,"energy":0.2,"judiciary":0.14,"pensions":0.12,"healthcare":0.13,"defense":0.13,"rural":0.1,"migration":0.12},ideal:{"euro":0.75,"corruption":0.65,"energy":0.62,"judiciary":0.55,"pensions":0.58,"healthcare":0.7,"defense":0.7,"rural":0.35,"migration":0.55},ent:0.98,lean:{"pb":0.1,"gerb":0.08,"dps":0.08},eth:{"bulgarian":0.74,"turkish":0.13,"roma":0.04},geo:{"proEU":0.8,"proRussia":0.35,"proNATO":0.78,"proUS":0.7,"nationalism":0.5,"urbanization":0.8},tb:0.5},
  {id:"blagoevgrad",name:"Blagoevgrad",short:"Blagoevgrad",bg:"Благоевград",seats:8,x:143,y:416,w:{"euro":0.18,"corruption":0.16,"energy":0.28,"judiciary":0.14,"pensions":0.13,"healthcare":0.13,"defense":0.12,"rural":0.16,"migration":0.1},ideal:{"euro":0.62,"corruption":0.55,"energy":0.72,"judiciary":0.48,"pensions":0.62,"healthcare":0.68,"defense":0.7,"rural":0.72,"migration":0.48},ent:0.9,lean:{"gerb":0.08,"pb":0.08,"dps":0.05},eth:{"bulgarian":0.88,"turkish":0.05,"roma":0.03},geo:{"proEU":0.65,"proRussia":0.4,"proNATO":0.58,"proUS":0.52,"nationalism":0.55,"urbanization":0.68},tb:0.488},
  {id:"stara-zagora",name:"Stara Zagora",short:"Stara Zagora",bg:"Стара Загора",seats:9,x:523,y:353,w:{"euro":0.15,"corruption":0.16,"energy":0.34,"judiciary":0.14,"pensions":0.13,"healthcare":0.13,"defense":0.07,"rural":0.16,"migration":0.1},ideal:{"euro":0.62,"corruption":0.55,"energy":0.85,"judiciary":0.48,"pensions":0.72,"healthcare":0.72,"defense":0.58,"rural":0.62,"migration":0.45},ent:0.92,lean:{"bsp":0.16,"pb":0.08,"gerb":0.06},eth:{"bulgarian":0.88,"turkish":0.03,"roma":0.06},geo:{"proEU":0.6,"proRussia":0.45,"proNATO":0.55,"proUS":0.5,"nationalism":0.55,"urbanization":0.75},tb:0.511},
  {id:"pleven",name:"Pleven",short:"Pleven",bg:"Плевен",seats:9,x:371,y:207,w:{"euro":0.18,"corruption":0.18,"energy":0.24,"judiciary":0.14,"pensions":0.16,"healthcare":0.13,"defense":0.07,"rural":0.2,"migration":0.1},ideal:{"euro":0.62,"corruption":0.58,"energy":0.62,"judiciary":0.52,"pensions":0.72,"healthcare":0.72,"defense":0.58,"rural":0.72,"migration":0.45},ent:0.88,lean:{"bsp":0.12,"gerb":0.08,"pb":0.05},eth:{"bulgarian":0.88,"turkish":0.06,"roma":0.04},geo:{"proEU":0.62,"proRussia":0.42,"proNATO":0.55,"proUS":0.5,"nationalism":0.55,"urbanization":0.7},tb:0.474},
  {id:"ruse",name:"Ruse",short:"Ruse",bg:"Русе",seats:9,x:572,y:140,w:{"euro":0.22,"corruption":0.2,"energy":0.18,"judiciary":0.14,"pensions":0.12,"healthcare":0.13,"defense":0.17,"rural":0.1,"migration":0.12},ideal:{"euro":0.78,"corruption":0.65,"energy":0.55,"judiciary":0.58,"pensions":0.62,"healthcare":0.7,"defense":0.75,"rural":0.52,"migration":0.58},ent:0.95,lean:{"gerb":0.1,"pb":0.08,"dps":0.06},eth:{"bulgarian":0.83,"turkish":0.07,"roma":0.05},geo:{"proEU":0.82,"proRussia":0.4,"proNATO":0.75,"proUS":0.68,"nationalism":0.55,"urbanization":0.78},tb:0.459},
  {id:"velikotarnovo",name:"Veliko Tarnovo",short:"V. Tarnovo",bg:"Велико Търново",seats:8,x:523,y:257,w:{"euro":0.18,"corruption":0.18,"energy":0.2,"judiciary":0.16,"pensions":0.14,"healthcare":0.13,"defense":0.09,"rural":0.16,"migration":0.1},ideal:{"euro":0.68,"corruption":0.62,"energy":0.58,"judiciary":0.6,"pensions":0.7,"healthcare":0.7,"defense":0.58,"rural":0.68,"migration":0.5},ent:0.9,lean:{"gerb":0.08,"bsp":0.08,"pb":0.06},eth:{"bulgarian":0.86,"turkish":0.04,"roma":0.04},geo:{"proEU":0.7,"proRussia":0.4,"proNATO":0.65,"proUS":0.6,"nationalism":0.52,"urbanization":0.72},tb:0.498},
  {id:"pazardzhik",name:"Pazardzhik",short:"Pazardzhik",bg:"Пазарджик",seats:8,x:328,y:388,w:{"euro":0.15,"corruption":0.16,"energy":0.3,"judiciary":0.14,"pensions":0.13,"healthcare":0.12,"defense":0.08,"rural":0.18,"migration":0.14},ideal:{"euro":0.58,"corruption":0.52,"energy":0.75,"judiciary":0.48,"pensions":0.68,"healthcare":0.7,"defense":0.62,"rural":0.72,"migration":0.45},ent:0.86,lean:{"dps":0.1,"bsp":0.08,"pb":0.06},eth:{"bulgarian":0.8,"turkish":0.08,"roma":0.07},geo:{"proEU":0.6,"proRussia":0.42,"proNATO":0.52,"proUS":0.48,"nationalism":0.55,"urbanization":0.62},tb:0.46},
  {id:"haskovo",name:"Haskovo",short:"Haskovo",bg:"Хасково",seats:7,x:512,y:428,w:{"euro":0.17,"corruption":0.16,"energy":0.26,"judiciary":0.14,"pensions":0.12,"healthcare":0.12,"defense":0.1,"rural":0.16,"migration":0.15},ideal:{"euro":0.6,"corruption":0.55,"energy":0.72,"judiciary":0.5,"pensions":0.68,"healthcare":0.7,"defense":0.65,"rural":0.72,"migration":0.45},ent:0.88,lean:{"dps":0.1,"bsp":0.08,"gerb":0.06},eth:{"bulgarian":0.74,"turkish":0.19,"roma":0.03},geo:{"proEU":0.58,"proRussia":0.45,"proNATO":0.5,"proUS":0.45,"nationalism":0.55,"urbanization":0.6},tb:0.493},
  {id:"shumen",name:"Shumen",short:"Shumen",bg:"Шумен",seats:7,x:718,y:228,w:{"euro":0.14,"corruption":0.14,"energy":0.28,"judiciary":0.14,"pensions":0.13,"healthcare":0.12,"defense":0.09,"rural":0.22,"migration":0.14},ideal:{"euro":0.55,"corruption":0.48,"energy":0.75,"judiciary":0.42,"pensions":0.68,"healthcare":0.65,"defense":0.62,"rural":0.72,"migration":0.48},ent:0.84,lean:{"dps":0.12,"aps":0.07,"vaz":0.08},eth:{"bulgarian":0.61,"turkish":0.29,"roma":0.04},geo:{"proEU":0.55,"proRussia":0.5,"proNATO":0.48,"proUS":0.44,"nationalism":0.62,"urbanization":0.62},tb:0.385},
  {id:"sliven",name:"Sliven",short:"Sliven",bg:"Сливен",seats:7,x:627,y:316,w:{"euro":0.14,"corruption":0.15,"energy":0.28,"judiciary":0.14,"pensions":0.14,"healthcare":0.12,"defense":0.08,"rural":0.2,"migration":0.12},ideal:{"euro":0.48,"corruption":0.48,"energy":0.78,"judiciary":0.42,"pensions":0.68,"healthcare":0.65,"defense":0.62,"rural":0.72,"migration":0.35},ent:0.84,lean:{"vaz":0.16,"velichie":0.07,"bsp":0.08},eth:{"bulgarian":0.74,"turkish":0.07,"roma":0.13},geo:{"proEU":0.48,"proRussia":0.58,"proNATO":0.42,"proUS":0.38,"nationalism":0.72,"urbanization":0.65},tb:0.398},
  {id:"dobrich",name:"Dobrich",short:"Dobrich",bg:"Добрич",seats:7,x:853,y:183,w:{"euro":0.14,"corruption":0.15,"energy":0.26,"judiciary":0.14,"pensions":0.17,"healthcare":0.12,"defense":0.07,"rural":0.22,"migration":0.12},ideal:{"euro":0.55,"corruption":0.52,"energy":0.72,"judiciary":0.48,"pensions":0.72,"healthcare":0.68,"defense":0.62,"rural":0.85,"migration":0.45},ent:0.84,lean:{"bsp":0.1,"gerb":0.08,"dps":0.06},eth:{"bulgarian":0.76,"turkish":0.11,"roma":0.06},geo:{"proEU":0.62,"proRussia":0.48,"proNATO":0.55,"proUS":0.5,"nationalism":0.58,"urbanization":0.68},tb:0.404},
  {id:"vratsa",name:"Vratsa",short:"Vratsa",bg:"Враца",seats:6,x:212,y:237,w:{"euro":0.14,"corruption":0.18,"energy":0.24,"judiciary":0.14,"pensions":0.18,"healthcare":0.12,"defense":0.07,"rural":0.22,"migration":0.1},ideal:{"euro":0.5,"corruption":0.55,"energy":0.68,"judiciary":0.48,"pensions":0.78,"healthcare":0.72,"defense":0.58,"rural":0.82,"migration":0.4},ent:0.8,lean:{"bsp":0.14,"gerb":0.06,"vaz":0.05},eth:{"bulgarian":0.83,"turkish":0.01,"roma":0.1},geo:{"proEU":0.52,"proRussia":0.52,"proNATO":0.48,"proUS":0.44,"nationalism":0.6,"urbanization":0.58},tb:0.53},
  {id:"montana",name:"Montana",short:"Montana",bg:"Монтана",seats:6,x:162,y:206,w:{"euro":0.14,"corruption":0.15,"energy":0.26,"judiciary":0.14,"pensions":0.18,"healthcare":0.12,"defense":0.07,"rural":0.24,"migration":0.1},ideal:{"euro":0.48,"corruption":0.52,"energy":0.75,"judiciary":0.42,"pensions":0.8,"healthcare":0.72,"defense":0.58,"rural":0.88,"migration":0.4},ent:0.78,lean:{"bsp":0.16,"vaz":0.06},eth:{"bulgarian":0.8,"turkish":0.02,"roma":0.11},geo:{"proEU":0.5,"proRussia":0.55,"proNATO":0.45,"proUS":0.4,"nationalism":0.62,"urbanization":0.58},tb:0.521},
  {id:"kyustendil",name:"Kyustendil",short:"Kyustendil",bg:"Кюстендил",seats:5,x:81,y:376,w:{"euro":0.17,"corruption":0.16,"energy":0.26,"judiciary":0.14,"pensions":0.17,"healthcare":0.12,"defense":0.11,"rural":0.18,"migration":0.1},ideal:{"euro":0.55,"corruption":0.52,"energy":0.8,"judiciary":0.48,"pensions":0.75,"healthcare":0.7,"defense":0.65,"rural":0.78,"migration":0.45},ent:0.82,lean:{"gerb":0.08,"bsp":0.08,"vaz":0.06},eth:{"bulgarian":0.88,"turkish":0.005,"roma":0.08},geo:{"proEU":0.6,"proRussia":0.45,"proNATO":0.55,"proUS":0.5,"nationalism":0.58,"urbanization":0.65},tb:0.442},
  {id:"pernik",name:"Pernik",short:"Pernik",bg:"Перник",seats:5,x:133,y:328,w:{"euro":0.14,"corruption":0.18,"energy":0.26,"judiciary":0.14,"pensions":0.17,"healthcare":0.12,"defense":0.08,"rural":0.2,"migration":0.1},ideal:{"euro":0.55,"corruption":0.55,"energy":0.78,"judiciary":0.48,"pensions":0.75,"healthcare":0.68,"defense":0.6,"rural":0.75,"migration":0.45},ent:0.84,lean:{"bsp":0.14,"vaz":0.06},eth:{"bulgarian":0.9,"turkish":0.01,"roma":0.04},geo:{"proEU":0.58,"proRussia":0.45,"proNATO":0.52,"proUS":0.48,"nationalism":0.58,"urbanization":0.7},tb:0.544},
  {id:"lovech",name:"Lovech",short:"Lovech",bg:"Ловеч",seats:5,x:386,y:248,w:{"euro":0.17,"corruption":0.16,"energy":0.24,"judiciary":0.14,"pensions":0.17,"healthcare":0.13,"defense":0.08,"rural":0.22,"migration":0.1},ideal:{"euro":0.58,"corruption":0.55,"energy":0.62,"judiciary":0.52,"pensions":0.75,"healthcare":0.72,"defense":0.58,"rural":0.82,"migration":0.4},ent:0.84,lean:{"bsp":0.1,"gerb":0.08},eth:{"bulgarian":0.84,"turkish":0.03,"roma":0.1},geo:{"proEU":0.6,"proRussia":0.42,"proNATO":0.58,"proUS":0.52,"nationalism":0.52,"urbanization":0.58},tb:0.491},
  {id:"gabrovo",name:"Gabrovo",short:"Gabrovo",bg:"Габрово",seats:5,x:478,y:287,w:{"euro":0.19,"corruption":0.19,"energy":0.18,"judiciary":0.17,"pensions":0.13,"healthcare":0.13,"defense":0.08,"rural":0.18,"migration":0.1},ideal:{"euro":0.7,"corruption":0.62,"energy":0.58,"judiciary":0.58,"pensions":0.68,"healthcare":0.7,"defense":0.6,"rural":0.68,"migration":0.5},ent:0.88,lean:{"gerb":0.08,"ppdb":0.06},eth:{"bulgarian":0.91,"turkish":0.03,"roma":0.04},geo:{"proEU":0.75,"proRussia":0.38,"proNATO":0.7,"proUS":0.65,"nationalism":0.55,"urbanization":0.7},tb:0.487},
  {id:"kardzhali",name:"Kardzhali",short:"Kardzhali",bg:"Кърджали",seats:5,x:484,y:473,w:{"euro":0.12,"corruption":0.12,"energy":0.36,"judiciary":0.14,"pensions":0.08,"healthcare":0.12,"defense":0.06,"rural":0.2,"migration":0.22},ideal:{"euro":0.6,"corruption":0.45,"energy":0.85,"judiciary":0.42,"pensions":0.62,"healthcare":0.7,"defense":0.48,"rural":0.82,"migration":0.55},ent:0.9,lean:{"dps":0.34,"aps":0.2},eth:{"bulgarian":0.26,"turkish":0.66,"roma":0.02},geo:{"proEU":0.62,"proRussia":0.4,"proNATO":0.48,"proUS":0.45,"nationalism":0.45,"urbanization":0.55},tb:0.298},
  {id:"yambol",name:"Yambol",short:"Yambol",bg:"Ямбол",seats:4,x:652,y:346,w:{"euro":0.14,"corruption":0.15,"energy":0.28,"judiciary":0.14,"pensions":0.14,"healthcare":0.12,"defense":0.08,"rural":0.2,"migration":0.12},ideal:{"euro":0.45,"corruption":0.45,"energy":0.78,"judiciary":0.4,"pensions":0.68,"healthcare":0.65,"defense":0.62,"rural":0.75,"migration":0.35},ent:0.8,lean:{"vaz":0.14,"velichie":0.06,"bsp":0.08},eth:{"bulgarian":0.85,"turkish":0.05,"roma":0.07},geo:{"proEU":0.45,"proRussia":0.6,"proNATO":0.42,"proUS":0.38,"nationalism":0.74,"urbanization":0.62},tb:0.483},
  {id:"targovishte",name:"Targovishte",short:"Targovishte",bg:"Търговище",seats:4,x:627,y:231,w:{"euro":0.13,"corruption":0.14,"energy":0.28,"judiciary":0.14,"pensions":0.13,"healthcare":0.12,"defense":0.08,"rural":0.22,"migration":0.18},ideal:{"euro":0.52,"corruption":0.45,"energy":0.75,"judiciary":0.42,"pensions":0.68,"healthcare":0.65,"defense":0.6,"rural":0.8,"migration":0.5},ent:0.8,lean:{"dps":0.16,"aps":0.1},eth:{"bulgarian":0.53,"turkish":0.36,"roma":0.04},geo:{"proEU":0.55,"proRussia":0.5,"proNATO":0.48,"proUS":0.44,"nationalism":0.6,"urbanization":0.55},tb:0.414},
  {id:"razgrad",name:"Razgrad",short:"Razgrad",bg:"Разград",seats:4,x:657,y:188,w:{"euro":0.13,"corruption":0.14,"energy":0.28,"judiciary":0.14,"pensions":0.13,"healthcare":0.12,"defense":0.08,"rural":0.22,"migration":0.18},ideal:{"euro":0.5,"corruption":0.45,"energy":0.78,"judiciary":0.42,"pensions":0.68,"healthcare":0.65,"defense":0.62,"rural":0.8,"migration":0.52},ent:0.8,lean:{"dps":0.18,"aps":0.12},eth:{"bulgarian":0.41,"turkish":0.5,"roma":0.04},geo:{"proEU":0.52,"proRussia":0.55,"proNATO":0.45,"proUS":0.42,"nationalism":0.65,"urbanization":0.55},tb:0.369},
  {id:"silistra",name:"Silistra",short:"Silistra",bg:"Силистра",seats:4,x:768,y:101,w:{"euro":0.13,"corruption":0.15,"energy":0.26,"judiciary":0.14,"pensions":0.17,"healthcare":0.12,"defense":0.11,"rural":0.22,"migration":0.14},ideal:{"euro":0.5,"corruption":0.5,"energy":0.75,"judiciary":0.45,"pensions":0.75,"healthcare":0.68,"defense":0.65,"rural":0.88,"migration":0.5},ent:0.78,lean:{"dps":0.1,"bsp":0.08,"vaz":0.06},eth:{"bulgarian":0.67,"turkish":0.21,"roma":0.05},geo:{"proEU":0.55,"proRussia":0.52,"proNATO":0.5,"proUS":0.45,"nationalism":0.6,"urbanization":0.55},tb:0.439},
  {id:"smolyan",name:"Smolyan",short:"Smolyan",bg:"Смолян",seats:4,x:382,y:482,w:{"euro":0.17,"corruption":0.16,"energy":0.24,"judiciary":0.14,"pensions":0.15,"healthcare":0.13,"defense":0.13,"rural":0.24,"migration":0.1},ideal:{"euro":0.62,"corruption":0.55,"energy":0.62,"judiciary":0.52,"pensions":0.68,"healthcare":0.7,"defense":0.7,"rural":0.85,"migration":0.48},ent:0.82,lean:{"bsp":0.08,"gerb":0.06,"dps":0.06},eth:{"bulgarian":0.93,"turkish":0.05,"roma":0.015},geo:{"proEU":0.65,"proRussia":0.4,"proNATO":0.6,"proUS":0.55,"nationalism":0.55,"urbanization":0.65},tb:0.555},
  {id:"vidin",name:"Vidin",short:"Vidin",bg:"Видин",seats:4,x:109,y:120,w:{"euro":0.13,"corruption":0.16,"energy":0.24,"judiciary":0.14,"pensions":0.18,"healthcare":0.12,"defense":0.09,"rural":0.24,"migration":0.1},ideal:{"euro":0.45,"corruption":0.52,"energy":0.68,"judiciary":0.48,"pensions":0.82,"healthcare":0.72,"defense":0.62,"rural":0.9,"migration":0.4},ent:0.76,lean:{"bsp":0.14,"vaz":0.06},eth:{"bulgarian":0.89,"turkish":0.01,"roma":0.07},geo:{"proEU":0.5,"proRussia":0.55,"proNATO":0.45,"proUS":0.4,"nationalism":0.62,"urbanization":0.6},tb:0.461}
];

/* T15: geopolitical axes + demographics — derived so eth (census) stays the single source of truth.
   Axes: proEU, proRussia, proNATO, proUS, nationalism, turkishMinority, urbanization.
   Demographics: turkishShare, romaShare (mirror eth). */
DISTRICTS.forEach(d=>{
  const e=d.eth||{};
  const g=d.geo||(d.geo={});
  if(g.turkishMinority===undefined)g.turkishMinority=e.turkish||0;
  if(g.turkishShare===undefined)g.turkishShare=e.turkish||0;
  if(g.romaShare===undefined)g.romaShare=e.roma||0;
});

const DIST_BY_ID={};
DISTRICTS.forEach(d=>DIST_BY_ID[d.id]=d);

const AI_PARTIES=[
  {id:"gerb",name:"GERB",abbr:"GERB",color:"#0066b3",leader:"Boyko Borisov",ideo:"Center-right incumbent (GERB–SDS)",pos:{euro:.80,corruption:.45,energy:.50,judiciary:.40,pensions:.45,healthcare:.40,defense:.70,rural:.40,migration:.55},appeal:.86,favMinistry:"Finance",topIssue:"euro"},
  {id:"pb",name:"Progresivna Balgariya",abbr:"PB",color:"#e67e22",leader:"Rumen Radev",ideo:"Centre-left populist, anti-oligarch",pos:{euro:.55,corruption:.85,energy:.75,judiciary:.70,pensions:.75,healthcare:.80,defense:.45,rural:.60,migration:.45},appeal:.92,mainRival:true,favMinistry:"Justice",topIssue:"corruption"},
  {id:"ppdb",name:"Produlzhavame promyanata – Demokratichna Balgariya",abbr:"PP-DB",color:"#2fa84f",leader:"Assen Vassilev",ideo:"Reformist anti-corruption",pos:{euro:.90,corruption:.90,energy:.35,judiciary:.90,pensions:.50,healthcare:.65,defense:.55,rural:.45,migration:.50},appeal:.80,favMinistry:"Justice",topIssue:"corruption",focus:["sofia-city","sofia-obl","burgas","varna","plovdiv-city","plovdiv-obl"]},
  {id:"dps",name:"Dvizhenie za prava i svobodi",abbr:"DPS",color:"#8e44ad",leader:"Delyan Peevski",ideo:"Minority interests",pos:{euro:.60,corruption:.35,energy:.75,judiciary:.40,pensions:.70,healthcare:.70,defense:.30,rural:.75,migration:.65},appeal:.60,favMinistry:"Agriculture",topIssue:"energy"},
  {id:"vaz",name:"Vazrazhdane",abbr:"VRZ",color:"#e0a71e",leader:"Kostadin Kostadinov",ideo:"Nationalist, anti-EU",pos:{euro:.10,corruption:.60,energy:.60,judiciary:.30,pensions:.60,healthcare:.40,defense:.90,rural:.65,migration:.05},appeal:.56,favMinistry:"Interior",topIssue:"euro"},
  {id:"bsp",name:"Bulgarska sotsialisticheska partiya – Obedinena levitsa",abbr:"BSP",color:"#e41e20",leader:"Krum Zarkov",ideo:"Socialist, centre-left",pos:{euro:.50,corruption:.55,energy:.85,judiciary:.50,pensions:.90,healthcare:.90,defense:.35,rural:.70,migration:.40},appeal:.218,favMinistry:"Labour & Social Policy",topIssue:"energy"},
  {id:"itn",name:"Ima takav narod",abbr:"ITN",color:"#17a2b8",leader:"Slavi Trifonov",ideo:"National-conservative populist",pos:{euro:.45,corruption:.80,energy:.65,judiciary:.45,pensions:.65,healthcare:.70,defense:.60,rural:.55,migration:.30},appeal:.227,favMinistry:"Health",topIssue:"corruption"},
  {id:"mech",name:"Morale, edinstvo, chest",abbr:"MECh",color:"#6d4c41",leader:"Radostin Vassilev",ideo:"Right-wing populist, anti-corruption",pos:{euro:.30,corruption:.75,energy:.60,judiciary:.45,pensions:.55,healthcare:.45,defense:.75,rural:.50,migration:.20},appeal:.19,favMinistry:"Interior",topIssue:"corruption"},
  {id:"aps",name:"Alians za prava i svobodi",abbr:"APS",color:"#7f8c8d",leader:"Collective leadership",ideo:"Minority interests (DPS split)",pos:{euro:.60,corruption:.40,energy:.75,judiciary:.40,pensions:.70,healthcare:.75,defense:.35,rural:.80,migration:.60},appeal:.17,favMinistry:"Agriculture",topIssue:"energy"},
  {id:"velichie",name:"Velichie",abbr:"VEL",color:"#34495e",leader:"Albena Pekova",ideo:"Far-right nationalist",pos:{euro:.15,corruption:.60,energy:.65,judiciary:.35,pensions:.60,healthcare:.35,defense:.85,rural:.70,migration:.05},appeal:.12,favMinistry:"Energy",topIssue:"energy"}
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

const DIFFS={easy:{cash:160000,aggr:.6,edge:1.08},normal:{cash:120000,aggr:.85,edge:1.00},hard:{cash:90000,aggr:1.15,edge:0.93}};
const PERFORMANCE_PARTIES=["bsp","itn"];
const PERFORMANCE_PROTECTED=["gerb","pb","ppdb","dps","vaz","mech","aps","velichie"];
const ELECTION_DATE="Sunday, 19 April";
const MAJORITY=121;
const TOTAL_SEATS=240;
const COSTS={rallySP:3,ad:12000,hq:40000,hqIncome:9000,stipend:6000,hqMax:8,
  campaignNational:20000,campaignDistrict:8000,
  hireCost:12000,hireCostInc:6000,trainCost:8000,
  upkeepBase:1000,upkeepPerLvl:500,
  hqUpgrade:[30000,50000,75000,100000]};
const PARTY_HQ_MAX=5;
const CAMPAIGN_CAP=3;
const PHASE_NAMES=["Planning","Execution","Release"];
const STAFF_ROLES=["Strategist","Spokesperson","Organizer","Fundraiser","Digital Lead","Pollster"];
const STAFF_NAMES=["Ivan Petrov","Maya Georgieva","Nikola Dimitrov","Elena Hristova","Georgi Marinov","Radka Ivanova","Stoyan Kolev","Petia Yordanova","Krasimir Todorov","Desislava Angelova","Vladimir Atanasov","Silvia Petkova"];
const CAMPAIGN_NAMES=["For a Strong Border","Clean Sweep","Europe Forward","Pensions First","Our Villages, Our Future","Zero Tolerance","A Fair State","Healthy Nation","Sofia's Promise","Step Forward","The New Deal","Open Doors"];
const SAVE_KEY="121towin-save-v6";

const EMBLEM_IDS=["alarm-clock","anchor","book-open","bookmark","briefcase","castle","crown","diamond-gem","earth","factory","flag","globe","hammer","hand","heart","leaf","moon","robot","rose","shield","skull","snake","star","sword","tree","tree-pine","trophy"];
const EMBLEM_SVGS={
  "alarm-clock":'<path d="M6 4 4 2 2 4l3 3m13-3 2-2 2 2-3 3M12 5a7 7 0 1 0 0 14 7 7 0 1 0 0-14m0 4v4l3 2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"/>',
  anchor:'<path d="M10 2h4v8h3v3h-3v5h3v2H7v-2h3v-5H7v-3h3V2m-6 8H2v3h3a7 7 0 0 0 14 0h3v-3h-2a10 10 0 0 1-16 0"/>',
  "book-open":'<path d="M3 4h4c2 0 4 1 5 3 1-2 3-3 5-3h4v16h-4c-2 0-4 1-5 3-1-2-3-3-5-3H3V4m9 3v16" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
  bookmark:'<path d="M5 3h14v18l-7-4-7 4V3m3 3h8v2H8V6"/>',
  briefcase:'<path d="M8 6V4h8v2h4v14H4V6h4m2-2h4v2h-4v-2m-6 7h16m-9-2h4v4h-4v-4"/>',
  castle:'<path d="M3 21V8l3 2V6l3 2V4h6v4l3-2v4l3-2v13H3m7-2v-5h4v5"/>',
  crown:'<path d="m3 6 5 4 4-7 4 7 5-4-2 14H5L3 6m4 11h10"/>',
  "diamond-gem":'<path d="M4 4h16l3 5-11 12L1 9l3-5m0 0 8 17m8-17-8 17M1 9h22" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>',
  earth:'<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" fill="none" stroke="currentColor" stroke-width="1.5"/>',
  factory:'<path d="M3 21V9l6 3V8l6 3V6h6v15H3m4-4h2v2H7v-2m4 0h2v2h-2v-2m4 0h2v2h-2v-2m4 0h2v2h-2v-2"/>',
  flag:'<path d="M5 22V3h2v2h12l-3 4 3 4H7v9H5"/>',
  globe:'<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" fill="none" stroke="currentColor" stroke-width="1.5"/>',
  hammer:'<path d="M3 4h11v2h3v3h-3v2h-5v3h-2v2H5v2H3v-4h2v-2h2V9H3zM11 12h3v3h2v2h2v2h-3v-2h-2v-2h-2z"/>',
  hand:'<path d="M5 12V7a2 2 0 0 1 4 0v3-7a2 2 0 0 1 4 0v7-5a2 2 0 0 1 4 0v7-3a2 2 0 0 1 4 0v5c0 5-3 8-8 8h-3c-4 0-7-3-7-7v-3h2"/>',
  heart:'<path d="M12 21S3 15 3 9a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6-9 12-9 12"/>',
  leaf:'<path d="M21 3C11 3 4 7 4 14c0 3 2 5 5 5 7 0 10-7 12-16M3 21c3-6 7-9 13-12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"/>',
  moon:'<path d="M20 15a8 8 0 0 1-11-11 9 9 0 1 0 11 11"/>',
  robot:'<path d="M7 7h10a3 3 0 0 1 3 3v8H4v-8a3 3 0 0 1 3-3m5-5v5m-8 7H2m20 0h-2M8 12h2v2H8v-2m6 0h2v2h-2v-2m-5 6v3h6v-3"/>',
  rose:'<path d="M10 2h5v2h3v3h-2v3h-2v2h-2v3h2v2h2v2h-2v-2H9v-2h2v-3H9v-2H7V7H5V4h3V2m-3 3v2h3v2h2V5H9V3H8v2m8 0h3v2h-3m-8 3h2v2H7m8 7h2v2h-2M3 20h8v2H3z"/>',
  shield:'<path d="M12 2 20 5v6c0 5-3 9-8 11-5-2-8-6-8-11V5l8-3m0 4v12"/>',
  skull:'<path d="M12 3a8 8 0 0 0-8 8c0 3 2 5 4 6v3h8v-3c2-1 4-3 4-6a8 8 0 0 0-8-8m-3 7h2v2H9v-2m4 0h2v2h-2v-2m-2 5h2v2h-2v-2"/>',
  snake:'<path d="M4 3h6v2H6v3h4v2H6v3h5v2H4v-2H2v-5h2V6H2V3m7 11h7v2h4v5h-2v1h-6v-2h6v-2H9v-4m7-8h4v2h2v4h-2v-2h-4z"/>',
  star:'<path d="m12 2 3 6 7 1-5 5 1 8-6-3-6 3 1-8-5-5 7-1 3-6"/>',
  sword:'<path d="m4 20 7-7 2 2-7 7H4v-2m8-9 7-7 2 2-7 7-2-2m-2 1 4 4-2 2-4-4 2-2"/>',
  tree:'<path d="M11 21v-5H7l3-4H7l4-5H9l3-5 3 5h-2l4 5h-3l3 4h-4v5h-2z"/>',
  "tree-pine":'<path d="M12 2 5 11h3l-4 5h5l-4 5h14l-4-5h5l-4-5h3L12 2m-2 19h4v-4h-4v4"/>',
  trophy:'<path d="M7 3h10v5c0 4-2 7-5 8-3-1-5-4-5-8V3m-4 1h4v4H3V4m18 0h-4v4h4V4M9 18h6v3H9v-3m-3 3h12v2H6v-2"/>'
};
const PALETTE=["#00966e","#2f6fd6","#d63a3a","#e0a71e","#8e44ad","#17a2b8","#e67e22","#2fa84f","#c2185b","#607d8b"];

/* ---- T4: pixel portrait system (24×24 grids, layered) ---- */
const SKIN_TONES=["#f7d5b3","#e8b98c","#d9a066","#c98a52","#8d5a3b","#5e3a24"];
const HAIR_COLORS=["#1c1c1c","#3b2a20","#5a3d2b","#8c5a2b","#c9a26b","#d8d8d8","#8a3324","#4a6a8a"];
const SUIT_COLORS=["#1b2a44","#2b2d42","#22304a","#14213d","#1b4332","#3a2e22","#4a2450","#8a1f1f","#22424a","#0f1f38"];
const SHIRT_COLORS=["#ffffff","#e8edf4","#f2d8c8","#dde8e8","#e6e0d0","#f0f0f0"];
const HAIR_STYLES=["short","side","long","bun","curly","buzz","bald","bob","ponytail","mohawk","waves","locs","undercut"];
const HAIR_STYLE_NAMES={short:"Short crop",side:"Side part",long:"Long",bun:"Bun",curly:"Curly",buzz:"Buzz",bald:"Bald",bob:"Bob cut",ponytail:"Ponytail",mohawk:"Mohawk",waves:"Waves",locs:"Locs",undercut:"Undercut"};
const SUIT_STYLES=["classic","open","vest","blouse"];
const SUIT_STYLE_NAMES={classic:"Classic + tie",open:"Open collar",vest:"Vest",blouse:"Shirt only"};
const ETHNICITY_NAMES={bulgarian:"Bulgarian",turkish:"Turkish minority",roma:"Roma"};
const POVERTY_DISTRICTS=["vidin","montana","vratsa","silistra"];

/* Basic 16x16 pixel-art portraits — hand-drawn ASCII sprite grids.
   Chars: K skin, N nose shade, E eye, M/m lips, H hair, S suit, T shirt, t tie. */
const FACE_GRID=[
"................",
"................",
"................",
"...KKKKKKKKKK...",
"..KKKKKKKKKKKK..",
"..KKKKKKKKKKKK..",
"..KKKKKKKKKKKK..",
"..KKKKKKKKKKKK..",
"..KKKKKKKKKKKK..",
"..KKKKKKKKKKKK..",
"..KKKKKKKKKKKK..",
"..KKKKKKKKKKKK..",
"..KKKKKKKKKKKK..",
"...KKKKKKKKKK...",
"................",
"................"
];
const FEATURES_GRIDS={
  male:[
"................",
"................",
"................",
"................",
"................",
"................",
"................",
"...EE....EE.....",
"...EE....EE.....",
".......N........",
"......MMM.......",
"................",
"................",
"................",
"................",
"................"
  ],
  female:[
"................",
"................",
"................",
"................",
"................",
"................",
"................",
"...EE....EE.....",
"...EE....EE.....",
".......N........",
".....MMMM.......",
"......mmm.......",
"................",
"................",
"................",
"................"
  ]
};
const HAIR_GRIDS={
  short:[
"....HHHHHHHH....",
"..HHHHHHHHHHHH..",
".HHHHHHHHHHHHHH.",
".HHHHHHHHHHHHHH.",
".HH..........HH.",
".HH..........HH.",
".HH..........HH.",
"................",
"................",
"................",
"................",
"................",
"................",
"................",
"................",
"................"
  ],
  side:[
"....HHHHHHHH....",
"..HHHHHHHHHHHH..",
".HHHHHKKHHHHHHH.",
".HHHHHHHHHHHHHH.",
".HH..........HH.",
".HH..........HH.",
"................",
"................",
"................",
"................",
"................",
"................",
"................",
"................",
"................",
"................"
  ],
  long:[
"....HHHHHHHH....",
"..HHHHHHHHHHHH..",
".HHHHHHHHHHHHHH.",
"HHH..........HHH",
"HHH..........HHH",
"HHH..........HHH",
"HHH..........HHH",
"HHH..........HHH",
"HHH..........HHH",
"HHH..........HHH",
"HHH..........HHH",
"HHH..........HHH",
"HHH..........HHH",
"HHH..........HHH",
"HHH..........HHH",
"HHH..........HHH"
  ],
  bun:[
"......HHHH......",
"....HHHHHHHH....",
"..HHHHHHHHHHHH..",
"..HHHHHHHHHHHH..",
".HH..........HH.",
".HH..........HH.",
"................",
"................",
"................",
"................",
"................",
"................",
"................",
"................",
"................",
"................"
  ],
  curly:[
"....HHHHHHHH....",
"..HHHHHHHHHHHH..",
".HHHHHHHHHHHHHH.",
"HHHH........HHHH",
"HHHH........HHHH",
".HH..........HH.",
".HH..........HH.",
"................",
"................",
"................",
"................",
"................",
"................",
"................",
"................",
"................"
  ],
  buzz:[
"....HHHHHHHH....",
"..HHHHHHHHHHHH..",
".HHHHHHHHHHHHHH.",
"................",
"................",
"................",
"................",
"................",
"................",
"................",
"................",
"................",
"................",
"................",
"................",
"................"
  ],
  bald:[
"................",
"................",
"................",
"................",
"................",
"................",
"................",
"................",
"................",
"................",
"................",
"................",
"................",
"................",
"................",
"................"
  ],
  bob:[
"....HHHHHHHH....",
"..HHHHHHHHHHHH..",
".HHHHHHHHHHHHHH.",
".HHHHHHHHHHHHHH.",
".HH..........HH.",
".HH..........HH.",
".HH..........HH.",
".HH..........HH.",
".HH..........HH.",
".HH..........HH.",
".HH..........HH.",
"................",
"................",
"................",
"................",
"................"
  ],
  ponytail:[
"....HHHHHHHH....",
"..HHHHHHHHHHHH..",
".HHHHHHHHHHHHHH.",
".HHHHHHHHHHHHHH.",
".HH..........HH.",
".HH..........HH.",
".HH..........HH.",
".HH..........HH.",
".HH..........HH.",
".HH.........HHH.",
".HH.........HHH.",
"................",
"................",
"................",
"................",
"................"
  ],
  mohawk:[
"......HHH.......",
"......HHH.......",
"......HHH.......",
"......HHH.......",
"......HHH.......",
"......HHH.......",
"......HHH.......",
"......HHH.......",
"......HHH.......",
"................",
"................",
"................",
"................",
"................",
"................",
"................"
  ],
  waves:[
"....HHHHHHHH....",
"..HHHHHHHHHHHH..",
".HHHHHHHHHHHHHH.",
".HHHH....HHHHHH.",
".HHH........HHH.",
".HH..........HH.",
".HH..........HH.",
"................",
"................",
"................",
"................",
"................",
"................",
"................",
"................",
"................"
  ],
  locs:[
"....HHHHHHHH....",
"..HHHHHHHHHHHH..",
".HHHHHHHHHHHHHH.",
"HHH..........HHH",
"HH............HH",
"HHH..........HHH",
"HH............HH",
"HHH..........HHH",
"HH............HH",
"HHH..........HHH",
"HH............HH",
"HHH..........HHH",
"HH............HH",
"HHH..........HHH",
"HH............HH",
"HHH..........HHH"
  ],
  undercut:[
"....HHHHHHHH....",
"..HHHHHHHHHHHH..",
".HHHHHHHHHHHHHH.",
".HHHHHHHHHHHHHH.",
"................",
"................",
"................",
"................",
"................",
"................",
"................",
"................",
"................",
"................",
"................",
"................"
  ]
};
const SUIT_GRIDS={
  classic:[
"..SSSSSSSSSSSS..",
"..SSTTTTTTTTSS..",
"..SSSSSSSSSSSS.."
  ],
  open:[
"..TTTTTTTTTTTT..",
"..TTSSSSSSSSTT..",
"..SSSSSSSSSSSS.."
  ],
  vest:[
"..TTTTTTTTTTTT..",
"..STTTTTTTTTTS..",
"..SSSSSSSSSSSS.."
  ],
  blouse:[
"..TTTTTTTTTTTT..",
"..TTTTTTTTTTTT..",
"..TTTTTTTTTTTT.."
  ]
};
const PIXEL_FACE={W:16,H:16,FACE:FACE_GRID,FEATURES:FEATURES_GRIDS,HAIR:HAIR_GRIDS,SUIT:SUIT_GRIDS};

const FACES=[
  {bg:"#26547c",skin:2,hairColor:"#3b2a20",hairStyle:"short",suitColor:"#1b2a44",shirtColor:"#ffffff",suitStyle:"classic",gender:"male",glasses:false},
  {bg:"#3d5a80",skin:2,hairColor:"#22201c",hairStyle:"side",suitColor:"#22304a",shirtColor:"#e8edf4",suitStyle:"classic",gender:"male",glasses:true},
  {bg:"#5e548e",skin:1,hairColor:"#5a3d2b",hairStyle:"long",suitColor:"#2b2d42",shirtColor:"#f2d8c8",suitStyle:"blouse",gender:"female",glasses:false},
  {bg:"#26547c",skin:3,hairColor:"#4a3b2a",hairStyle:"buzz",suitColor:"#14213d",shirtColor:"#ffffff",suitStyle:"classic",gender:"male",glasses:false},
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

const CANDIDATE_NAMES=["Aleksandar Vasilev","Elena Dimitrova","Georgi Ivanov","Maria Stoyanova","Stefan Kolev","Ralitsa Petkova","Dimitar Georgiev","Krasimira Todorova","Boris Angelov","Yana Hristova","Nikola Stoyanov","Vesela Marinova","Kamen Radev","Iliana Krusteva"];

const BGSTYLES=[
  (c1)=>"background:linear-gradient(180deg, "+shade(c1,1.16)+" 0 10%, "+c1+" 10% 90%, "+shade(c1,.72)+" 90% 100%)",
  (c1,c2)=>"background:linear-gradient(180deg, "+c1+" 0 32%, "+c2+" 32% 68%, "+shade(c1,.78)+" 68% 100%)",
  (c1,c2)=>"background:linear-gradient(135deg, "+c1+" 0 58%, "+c2+" 58% 72%, "+c1+" 72% 100%)",
  (c1,c2)=>"background:radial-gradient(circle at 28% 25%, "+c2+" 0 12%, "+c1+" 58%, "+shade(c1,.72)+" 100%)",
  (c1,c2)=>"background:repeating-linear-gradient(135deg, transparent 0 10px, "+c2+" 10px 14px, transparent 14px 24px), "+c1,
  (c1,c2)=>"background:repeating-linear-gradient(90deg, "+c1+" 0 18px, "+c2+" 18px 21px, "+c1+" 21px 39px)",
  (c1,c2)=>"background:linear-gradient(90deg, "+c1+" 0 50%, "+c2+" 50%), repeating-linear-gradient(0deg, transparent 0 15px, rgba(255,255,255,.16) 15px 16px)",
  (c1,c2)=>"background:linear-gradient(90deg, "+c1+" 0 47%, "+shade(c2,.72)+" 47% 53%, "+c2+" 53% 100%)",
  (c1,c2)=>"background:linear-gradient(45deg, "+c1+" 0 46%, "+c2+" 46% 54%, "+c1+" 54% 100%)",
  (c1,c2)=>"background:radial-gradient(circle at 50% 50%, "+c2+" 0 18%, "+c1+" 18% 76%, "+shade(c1,.70)+" 76% 100%)",
  (c1,c2)=>"background:conic-gradient(from 225deg at 50% 50%, "+c1+" 0 12.5%, "+c2+" 12.5% 25%, "+c1+" 25% 37.5%, "+c2+" 37.5% 50%, "+c1+" 50% 62.5%, "+c2+" 62.5% 75%, "+c1+" 75% 87.5%, "+c2+" 87.5% 100%)",
  (c1,c2)=>"background:linear-gradient(0deg, rgba(255,255,255,.14) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.14) 1px, transparent 1px), "+c1+";background-size:18px 18px,18px 18px,auto",
  (c1,c2)=>"background:repeating-linear-gradient(0deg, "+c1+" 0 18px, "+c2+" 18px 22px, "+c1+" 22px 40px)"
];
const BGSTYLE_NAMES=["Solid","Stripes","Diagonal split","Spotlight","Chevrons","Pinstripes","Checkerboard","Half & half","Diagonal","Halo","Sunburst","Grid","Waves"];

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

function defaultPartyMachine(){
  return{hqLevel:1,energy:6,staff:[],campaigns:[],history:[]};
}
function partyEnergyMax(){return 6+(S.partyMachine.hqLevel-1)*2;}
function partyStaffCap(){return 2+S.partyMachine.hqLevel;}
function partyUpkeep(){return S.partyMachine.staff.reduce((a,s)=>a+COSTS.upkeepBase+(s.level-1)*COSTS.upkeepPerLvl,0);}
function partyQuality(){const st=S.partyMachine.staff;if(!st.length)return 1;const avg=st.reduce((a,s)=>a+s.level,0)/st.length;return 1+0.12*(avg-1);}
function partyHqUpgradeCost(){return S.partyMachine.hqLevel>=PARTY_HQ_MAX?null:COSTS.hqUpgrade[S.partyMachine.hqLevel-1];}
function partyHireCost(){return COSTS.hireCost+S.partyMachine.staff.length*COSTS.hireCostInc;}
function partyTrainCost(s){return COSTS.trainCost*s.level;}
function stanceLabel(stance,iss){return(stance==="pro"?"PRO ":"ANTI ")+(stance==="pro"?iss.hi:iss.lo);}

function freshState(){
  return {
    phase:"setup",setupStep:0,
    player:{name:"",face:0,photo:null,appearance:defaultAppearance(),attrs:{stamina:5,charisma:5,intelligence:5}},
    party:{name:"National Renewal Movement",abbr:"NRM",color:"#00966e",slogan:"Bulgaria, forward!",bgStyle:0,emblemIdx:0,logo:null,compass:{x:0,y:0},pos:{euro:.60,corruption:.60,energy:.60,judiciary:.60,pensions:.60,healthcare:.60,defense:.50,rural:.60,migration:.50}},
    difficulty:"normal",
    week:1,cash:0,stamina:0,location:"sofia-city",selDistrict:"sofia-city",
    hq:{},boost:{},enthusiasm:{},modifiers:[],rel:{},touched:[],ralliesThisTurn:0,
    partyMachine:defaultPartyMachine(),
    pollsPrev:null,pollNat:{},districtPoll:{},
    activeIssues:[],
    debateWeek:15,debateDone:false,debate:null,
    pigWeek:18,pigPending:false,pigDone:false,pigRaid:false,
    virusDone:false,virusLoss:null,
    log:[],stats:{rallies:0,ads:0,hqs:0,travels:0,campaigns:0},
    cashHist:[],
    eventBag:[],eventCursor:0,paused:false,eventQueue:[],
    results:null,coalition:null,ending:null,perfMod:{},
    term:1,termHistory:[],
    cheat:false,cheatFloor:false,debugBoost:{},cheatEasyWin:false,diksy:false,kosyo:false
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
  const nb=typeof document!=="undefined"?document.getElementById("news-bar"):null;
  if(nb)nb.style.display=(name==="game"&&S&&S.phase==="campaign"&&isMobileUI())?"flex":"none";
}

function partyOf(id){if(id==="player")return playerParty();return AI_PARTIES.find(p=>p.id===id);}
function partyName(p){return p.name===p.abbr?p.name:p.name+" ("+p.abbr+")";}
function playerParty(){return{id:"player",name:S.party.name,abbr:S.party.abbr,color:S.party.color,pos:S.party.pos,appeal:playerAppeal()};}
function playerAppeal(){return 0.74+(getAttr("charisma")+getAttr("intelligence"))*0.012;}
function allParties(){return[playerParty(),...AI_PARTIES];}

function getAttr(a){let v=S.player.attrs[a];for(const m of S.modifiers){const e=m.effects["attr_"+a];if(e)v+=e;}return clamp(v,1,12);}
function modSum(key){let v=0;for(const m of S.modifiers){if(m.effects[key])v+=m.effects[key];}return v;}
function getMaxStamina(){return 8+getAttr("stamina")+Math.round(modSum("maxStamina"))-(S.term>1?(S.term-1):0);}
function addModifier(spec){
  S.modifiers.push({id:uid(),name:spec.name,desc:spec.desc,bad:!!spec.bad,expires:spec.turns?S.week+spec.turns:null,effects:spec.effects||{}});
}
function expireModifiers(){
  const kept=[],gone=[];
  for(const m of S.modifiers){if(m.expires&&m.expires<=S.week)gone.push(m);else kept.push(m);}
  S.modifiers=kept;
  for(const m of gone)log("Modifier expired: <b>"+esc(m.name)+"</b>.","info");
}

function activeIssueList(){
  const a=S&&S.activeIssues&&S.activeIssues.length?S.activeIssues:null;
  if(a)return a.map(id=>ISSUE_BY_ID[id]).filter(Boolean);
  return ISSUE_POOL;
}
function issActive(id){
  const a=S&&S.activeIssues;
  if(!a||!a.length)return true;
  return a.indexOf(id)>=0;
}
function drawActiveIssues(){
  const core=shuffle(ISSUES.slice()).slice(0,1);
  const extra=shuffle(NEW_ISSUES.slice()).slice(0,4);
  S.activeIssues=shuffle(core.concat(extra)).map(i=>i.id);
}
function activeWeights(d){
  const ids=activeIssueList().map(i=>i.id);
  let tw=0;
  for(const id of ids)tw+=d.w[id]||0;
  const out={};
  for(const id of ids)out[id]={w:(d.w[id]||0)/(tw||1),ideal:d.ideal[id],name:ISSUE_BY_ID[id].name,lo:ISSUE_BY_ID[id].lo,hi:ISSUE_BY_ID[id].hi};
  return out;
}
function issueAlign(p,d){
  let a=0,tw=0;
  for(const id of activeIssueList().map(i=>i.id)){
    const w=d.w[id]||0;
    if(w<=0)continue;
    tw+=w;
    a+=w*(1-Math.abs(p.pos[id]-d.ideal[id]));
  }
  return tw>0?a/tw:0.5;
}
function pollNoise(){return Math.max(.008,.024-getAttr("intelligence")*.0018);}
function pollNoiseFor(dId,pId){
  const base=pollNoise();
  const rnd=mulberry32(S.week*1000+hashStr(dId+":"+pId));
  let noise=(rnd()-.5)*2*base;
  if(S.hq&&S.hq[dId])noise*=0.5;
  return noise;
}
function districtShares(d,noisy,boostOv){
  const ent=S.enthusiasm[d.id]!==undefined?S.enthusiasm[d.id]:d.ent;
  const scores={};
  for(const p of allParties()){
    let sc=(0.30+0.70*issueAlign(p,d))*p.appeal;
    const ln=d.lean&&d.lean[p.id]?d.lean[p.id]:0;
    sc*=1+ln;
    sc*=ent;
    const performance=S&&S.perfMod&&S.perfMod[p.id];
    if(performance)sc*=performance.factor||(1+performance.value);
    const b=boostOv&&boostOv[p.id]!==undefined?boostOv[p.id]:(S.boost[d.id]&&S.boost[d.id][p.id]?S.boost[d.id][p.id]:0);
    sc*=1+b;
    if(p.id==="player"){
      sc*=1+modSum("appealMult");
      const cm=candidateModifiers(d);
      if(cm&&(cm.appealMult||cm.entBonus))sc*=1+cm.appealMult+cm.entBonus;
      sc*=DIFFS[S.difficulty].edge;
    }
    scores[p.id]=Math.max(0.001,sc);
  }
  scores.others=0.055*ent;
  let sum=0;for(const k in scores)sum+=scores[k];
  const out={};
  for(const k in scores){let sh=scores[k]/sum;if(noisy)sh+=pollNoiseFor(d.id,k);out[k]=Math.max(0,sh);}
  if(noisy){let s2=0;for(const k in out)s2+=out[k];if(s2>0)for(const k in out)out[k]/=s2;}
  if(S.virusLoss){
    let gained=0;
    for(const k in out){
      if(k==="others")continue;
      const dloss=S.virusLoss[k];
      if(dloss>0&&out[k]>0){const cut=Math.min(out[k],dloss);out[k]-=cut;gained+=cut;}
    }
    if(gained>0)out.others=(out.others||0)+gained;
  }
  const debugB=S.debugBoost&&S.debugBoost[d.id]?S.debugBoost[d.id]:0;
  if(debugB>0){
    const p0=out.player||0,np=Math.min(0.98,p0+debugB);
    if(np>p0){const keep=1-np,others=1-p0;if(others>0){for(const k in out)if(k!=="player")out[k]*=keep/others;}out.player=np;}
  }
  if(S.cheatEasyWin){
    const p0=out.player||0,np=Math.min(0.98,p0+0.50);
    if(np>p0){const keep=1-np,others=1-p0;if(others>0){for(const k in out)if(k!=="player")out[k]*=keep/others;}out.player=np;}
  }
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
  const female=cfg.gender==="female",skin=SKIN_TONES[cfg.skin]||SKIN_TONES[2];
  const hair=cfg.hairColor||HAIR_COLORS[0],suit=cfg.suitColor||SUIT_COLORS[0],shirt=cfg.shirtColor||SHIRT_COLORS[0];
  const shadow=shade(skin,.72),suitShadow=shade(suit,.62);
  const mouth=female?"#9e3d50":"#7a2d25",lip=female?"#d9828b":shade(mouth,.85);
  let out='<rect width="16" height="16" fill="'+(cfg.bg||"#26547c")+'"/>';
  const C={K:skin,H:hair,N:shadow,E:"#24252b",M:mouth,m:lip,S:suit,T:shirt,t:suitShadow};
  const run=(grid,y0)=>{
    y0=y0||0;
    grid.forEach((row,y)=>{
      let x=0;
      while(x<row.length){
        const ch=row[x];
        const c=C[ch];
        if(!c){x++;continue;}
        let w=1;
        while(x+w<row.length&&row[x+w]===ch)w++;
        out+='<rect x="'+x+'" y="'+(y+y0)+'" width="'+w+'" height="1" fill="'+c+'"/>';
        x+=w;
      }
    });
  };
  run(PIXEL_FACE.FACE);
  run(female?PIXEL_FACE.FEATURES.female:PIXEL_FACE.FEATURES.male);
  run(PIXEL_FACE.HAIR[cfg.hairStyle]||PIXEL_FACE.HAIR.short);
  run(PIXEL_FACE.SUIT[cfg.suitStyle]||PIXEL_FACE.SUIT.classic,13);
  if(cfg.glasses)out+='<rect x="2" y="6" width="4" height="4" fill="none" stroke="#20242c"/><rect x="8" y="6" width="4" height="4" fill="none" stroke="#20242c"/><rect x="6" y="7" width="2" height="1" fill="#20242c"/>';
  return '<svg viewBox="0 0 16 16" data-gender="'+(female?"female":"male")+'" data-body-width="'+(female?16:18)+'" shape-rendering="crispEdges">'+out+'</svg>';
}

function defaultAppearance(){
  return{skin:2,hairColor:"#3b2a20",hairStyle:"short",suitColor:"#1b2a44",shirtColor:"#ffffff",suitStyle:"classic",gender:"male",ethnicity:"bulgarian",glasses:false,bg:"#26547c"};
}

function candidateModifiers(d){
  const app=S&&S.player&&S.player.appearance;
  if(!app)return{appealMult:0,entBonus:0};
  const out={appealMult:0,entBonus:0};
  if(S&&S.kosyo)out.appealMult+=0.30;
  const g=d.geo||{};
  if(app.ethnicity==="turkish"){
    if(g.turkishMinority>=0.28)out.appealMult+=0.06;
    if(g.nationalism>=0.68)out.appealMult-=0.05;
  }else if(app.ethnicity==="roma"){
    if(POVERTY_DISTRICTS.indexOf(d.id)>=0)out.entBonus+=0.07;
  }
  if(app.gender==="female"){
    if(g.urbanization>=0.85)out.entBonus+=0.03;
  }
  return out;
}

function districtsWhere(axis,min,max){
  max=max===undefined?1:max;
  return DISTRICTS.filter(d=>{
    const v=d.geo&&d.geo[axis];
    return typeof v==="number"&&v>=min&&v<=max;
  }).map(d=>d.id);
}

function rollPerformance(){
  S.perfMod={};
  for(const id of PERFORMANCE_PARTIES){
    const r=rng();
    if(r<.15)S.perfMod[id]={value:.04+rng()*.03,factor:3.8+rng()*1.2,type:"surge"};
    else if(r<.25)S.perfMod[id]={value:-.03,factor:.97,type:"slump"};
  }
}
function performanceLines(){
  return Object.keys(S.perfMod||{}).map(id=>{
    const p=partyOf(id),m=S.perfMod[id];
    return p.abbr+" is "+(m.type==="surge"?"in exceptional form this campaign":"having an unusually difficult campaign");
  });
}
function performanceInspectorLine(){
  const lines=performanceLines();
  return lines.length?'<div class="dc-note" style="margin-top:6px">Campaign form: '+lines.map(esc).join(" · ")+".</div>":"";
}

function identityEffectLines(){
  const app=S&&S.player&&S.player.appearance;
  if(!app)return[];
  const lines=[];
  if(app.ethnicity==="turkish")lines.push("Turkish minority: +6% appeal in districts with a high Turkish share (≥28%: Kardzhali, Razgrad, Targovishte, Shumen); −5% in nationalist strongholds (nationalism ≥68%: Sliven, Yambol)");
  if(app.ethnicity==="roma")lines.push("Roma: +7% voter enthusiasm in Vidin, Montana, Vratsa, Silistra");
  if(app.gender==="female")lines.push("Female candidate: +3% enthusiasm in highly urban districts (urbanization ≥85%: Sofia, Plovdiv, Varna)");
  return lines;
}
function portraitHTML(){
  if(S.player.photo)return '<img src="'+S.player.photo+'" alt="">';
  return faceSVG(S.player.appearance||defaultAppearance());
}

function emblemSVG(id,color,size){
  size=size||48;
  const shape=EMBLEM_SVGS[id]||EMBLEM_SVGS.star;
  return '<svg class="party-emblem" viewBox="0 0 24 24" width="'+size+'" height="'+size+'" aria-hidden="true" shape-rendering="crispEdges" style="color:'+color+';font-size:'+size+'px"><g fill="currentColor">'+shape+'</g></svg>';
}

function bannerInner(){
  const c=S.party.color;
  const txt=contrast(c);
  const glow=txt==="#ffffff"
    ?"text-shadow:0 0 4px rgba(0,0,0,.85), 1px 1px 0 rgba(0,0,0,.6)"
    :"text-shadow:0 0 4px rgba(255,255,255,.85), 1px 1px 0 rgba(0,0,0,.2)";
  const emb=S.party.logo
    ?'<img src="'+S.party.logo+'" alt="" style="width:52px;height:52px;object-fit:contain">'
    :emblemSVG(EMBLEM_IDS[S.party.emblemIdx],txt,52);
  return '<div class="banner-emblem">'+emb+'</div>'
    +'<div class="banner-name" style="color:'+txt+';'+glow+'">'+esc(S.party.name)+'</div>'
    +'<div class="banner-abbr" style="color:'+txt+';'+glow+'">'+esc(S.party.abbr)+'</div>'
    +'<div class="banner-slogan" style="color:'+txt+';'+glow+'">'+esc(S.party.slogan)+'</div>';
}

/* ---- T11: the big TV debate (12-question pool, 8 per debate) ---- */
const DEBATE_POOL=[
  {q:"Will Bulgaria adopt the euro?",issue:"euro",a:[
    {t:"Yes, as soon as possible",sub:"+1% national, reformers approve",fx:{nationBoost:.01,rel:{ppdb:8}}},
    {t:"Only after a referendum",sub:"Enthusiasm +3% nationwide, soft euro shift",fx:{enthusiasmAll:.03,posShift:{issue:"euro",delta:.02}}},
    {t:"No — the lev is sacred",sub:"Nationalists warm to you, soft anti-euro shift",fx:{rel:{vaz:10,gerb:8},posShift:{issue:"euro",delta:-.06},nationBoost:.005}},
    {t:"Deflect with a joke",sub:"+1 Charisma for 3 weeks, slight dip",fx:{attrTemp:{attr:"charisma",v:1,turns:3},nationBoost:-.004}}
  ]},
  {q:"Your anticorruption plan — how far will you actually go?",issue:"corruption",a:[
    {t:"Open the full dossiers",sub:"+1.5% national, the machine is furious",fx:{nationBoost:.015,rel:{gerb:-12,bsp:-8}}},
    {t:"An independent prosecutor, nothing else",sub:"Reformers approve, +0.5%",fx:{nationBoost:.005,rel:{ppdb:10,pb:8}}},
    {t:"Focus on the tax side",sub:"+1% national, ITN wary",fx:{nationBoost:.01,rel:{itn:-5}}},
    {t:"They're all watching — I'm clean",sub:"+2% enthusiasm, soft reform shift",fx:{enthusiasmAll:.02,posShift:{issue:"corruption",delta:.03}}}
  ]},
  {q:"Energy prices are squeezing households. What's your answer?",issue:"energy",a:[
    {t:"Cap prices now",sub:"Coal districts cheer, soft subsidy shift",fx:{entDistrict:{d:"stara-zagora",v:.08},posShift:{issue:"energy",delta:.08},rel:{bsp:8}}},
    {t:"Subsidize the poorest only",sub:"Targeted help, +0.5%",fx:{nationBoost:.005,cash:-5000,posShift:{issue:"energy",delta:.03}}},
    {t:"Free market — let prices settle",sub:"Business approves",fx:{posShift:{issue:"energy",delta:-.05},rel:{gerb:6}}},
    {t:"Invest in renewables",sub:"+1% national, costs a little",fx:{nationBoost:.01,cash:-10000}}
  ]},
  {q:"The healthcare system is collapsing. Public or private?",issue:"healthcare",a:[
    {t:"Public first, always",sub:"BSP-friendly, +1%, soft public shift",fx:{nationBoost:.01,rel:{bsp:10},posShift:{issue:"healthcare",delta:.06}}},
    {t:"A public-private mix",sub:"Reformers like the pragmatism",fx:{rel:{ppdb:8},nationBoost:.004}},
    {t:"Cut the paperwork, not the staff",sub:"Efficiency message, +0.5%",fx:{nationBoost:.005,attrTemp:{attr:"intelligence",v:1,turns:2}}},
    {t:"Doctors' salaries doubled",sub:"Bold promise, −30 000 лв, +1%",fx:{nationBoost:.01,cash:-30000,posShift:{issue:"healthcare",delta:.08}}}
  ]},
  {q:"Will you protect the judges?",issue:"judiciary",a:[
    {t:"Total independence",sub:"+1% national, PB/PP-DB approve, soft shift",fx:{nationBoost:.01,rel:{pb:10,ppdb:10},posShift:{issue:"judiciary",delta:.06}}},
    {t:"Independence with accountability",sub:"Balanced, +0.5%",fx:{nationBoost:.005}},
    {t:"The people are the judge",sub:"Nationalists approve, soft shift",fx:{rel:{vaz:8,mech:6},posShift:{issue:"judiciary",delta:-.04}}},
    {t:"No comment, next question",sub:"You dodge, −0.4%",fx:{nationBoost:-.004}}
  ]},
  {q:"How should Bulgaria handle migration?",issue:"migration",a:[
    {t:"Secure the border, humanely",sub:"Balanced, +1%, soft restrictive shift",fx:{nationBoost:.01,posShift:{issue:"migration",delta:.04}}},
    {t:"Open and welcoming",sub:"Cities approve, nationalists furious",fx:{rel:{vaz:-15,aps:10},nationBoost:.003,posShift:{issue:"migration",delta:-.08}}},
    {t:"Close the border completely",sub:"Nationalists cheer, +0.8%, hard shift",fx:{nationBoost:.008,rel:{vaz:12,velichie:8},posShift:{issue:"migration",delta:.1}}},
    {t:"Work visas, not asylum debate",sub:"Pragmatic, +0.4%",fx:{nationBoost:.004,attrTemp:{attr:"intelligence",v:1,turns:2}}}
  ]},
  {q:"Russia's war next door — do we rearm?",issue:"defense",a:[
    {t:"Rearm, and fast",sub:"NATO allies approve, +1%, rearm shift",fx:{nationBoost:.01,posShift:{issue:"defense",delta:.1},rel:{gerb:6}}},
    {t:"Modernize smart, not big",sub:"Pragmatic, +0.5%",fx:{nationBoost:.005}},
    {t:"We are neutral",sub:"VRZ/MECh approve, −0.3%, soft shift",fx:{nationBoost:-.003,rel:{vaz:10,mech:8},posShift:{issue:"defense",delta:-.08}}},
    {t:"Ask the generals",sub:"They like the deference, +0.4%",fx:{nationBoost:.004}}
  ]},
  {q:"Pensions are tiny. What will you do?",issue:"pensions",a:[
    {t:"Index them to prices",sub:"Pensioners' votes, +1%, generous shift",fx:{nationBoost:.01,posShift:{issue:"pensions",delta:.08},rel:{bsp:8}}},
    {t:"Raise them — and the taxes",sub:"Honest but unpopular, +0.3%",fx:{nationBoost:.003,posShift:{issue:"pensions",delta:.05}}},
    {t:"Pay them on time, at least",sub:"Competence message, +0.5%",fx:{nationBoost:.005}},
    {t:"The young should fund them",sub:"Controversial, −0.5%, soft shift",fx:{nationBoost:-.005,posShift:{issue:"pensions",delta:-.04}}}
  ]},
  {q:"Villages are emptying. What's your plan?",issue:"rural",a:[
    {t:"Roads, water, internet first",sub:"Rural vote, +1%, village shift",fx:{nationBoost:.01,multiBoost:[{d:"vidin",v:.03},{d:"silistra",v:.03},{d:"montana",v:.03}],posShift:{issue:"rural",delta:.08}}},
    {t:"Subsidize small farms",sub:"Farmers approve, +0.5%",fx:{nationBoost:.005,rel:{aps:8}}},
    {t:"Move people to the cities",sub:"Honest but brutal, −0.5%, urban shift",fx:{nationBoost:-.005,posShift:{issue:"rural",delta:-.06}}},
    {t:"One village, one doctor",sub:"Heartfelt, +0.8%",fx:{nationBoost:.008,cash:-10000,posShift:{issue:"rural",delta:.04}}}
  ]},
  {q:"Your critics say you are an opportunist. What do you say?",issue:null,a:[
    {t:"Watch me govern",sub:"+2% enthusiasm, debate prep costs",fx:{enthusiasmAll:.02,cash:-20000}},
    {t:"I stand for something real",sub:"+1% national",fx:{nationBoost:.01}},
    {t:"Critics are cheap",sub:"Sass wins, reformers cool",fx:{nationBoost:-.003,rel:{ppdb:-8}}},
    {t:"Ask them what they've built",sub:"Punchy, +0.5%",fx:{nationBoost:.005,rel:{vaz:-6}}}
  ]},
  {q:"Who could you ever work with in parliament?",issue:null,a:[
    {t:"Anyone who serves Bulgaria",sub:"Statesmanlike, +0.5%",fx:{nationBoost:.005}},
    {t:"The reformist bloc",sub:"PB/PP-DB warm",fx:{rel:{ppdb:10,pb:8}}},
    {t:"Nobody — I go it alone",sub:"Defiant, +0.8%, rivals wary",fx:{nationBoost:.008,rel:{gerb:-8,ppdb:-6}}},
    {t:"That's for after the vote",sub:"Cagey, −0.3%",fx:{nationBoost:-.003}}
  ]},
  {q:"What makes you different from the old parties?",issue:null,a:[
    {t:"I'm not them",sub:"+1% national, the machine bristles",fx:{nationBoost:.01,rel:{gerb:-8}}},
    {t:"Results, not promises",sub:"+0.5%",fx:{nationBoost:.005}},
    {t:"My record speaks",sub:"+0.8%",fx:{nationBoost:.008}},
    {t:"I don't need the office",sub:"Humble, +1% enthusiasm",fx:{enthusiasmAll:.01}}
  ]}
];

function buildDebateQuestions(){
  const valid=DEBATE_POOL.filter(q=>!q.issue||issActive(q.issue));
  const active=activeIssueList().map(i=>i.id);
  const issue=active.slice().sort((a,b)=>
    Math.abs((S.party.pos[b]===undefined ? .5 : S.party.pos[b])-.5)-
    Math.abs((S.party.pos[a]===undefined ? .5 : S.party.pos[a])-.5)
  )[0];
  const ambush=damageControlQuestions(issue).slice(0,2);
  return shuffle(ambush.concat(shuffle(valid).slice(0,6)));
}

/* T32: the strongest platform stance gets two unavoidable, least-bad ambushes. */
const DAMAGE_CONTROL_LABELS={
  euro:"euro adoption",corruption:"anticorruption",energy:"energy prices",judiciary:"judicial independence",
  pensions:"pensions",healthcare:"public healthcare",defense:"national defense",rural:"rural investment",migration:"migration policy"
};
function damageControlQuestions(issue){
  if(!issue)return [];
  const value=S.party.pos[issue]===undefined ? .5 : S.party.pos[issue];
  const stance=value>=.5?"your firm support for":"your opposition to";
  const subject=DAMAGE_CONTROL_LABELS[issue]||issue;
  const prefix="You have made "+stance+" "+subject+" a central platform promise. ";
  return [
    {damageControl:true,issue:issue,q:prefix+"Critics say it will hurt ordinary families. How do you answer?",a:[
      {t:"Admit the risk and apologise",sub:"A small national loss, but no one can call it evasive",fx:{nationBoost:-.006,enthusiasmAll:-.01}},
      {t:"Pay for a serious rebuttal",sub:"The response costs campaign money",fx:{cash:-15000}},
      {t:"Blame the old parties",sub:"Your coalition options take a hit",fx:{rel:{gerb:-8,ppdb:-8}}},
      {t:"Make a joke and move on",sub:"The clip is humiliating",fx:{nationBoost:-.012}}
    ]},
    {damageControl:true,issue:issue,q:prefix+"An expert says your numbers do not add up. What do you say on live television?",a:[
      {t:"Say you got the numbers wrong",sub:"Honest, but damaging",fx:{nationBoost:-.01}},
      {t:"Commission an expensive review",sub:"It drains the campaign account",fx:{cash:-20000}},
      {t:"Question the expert's motives",sub:"Rivals will remember the attack",fx:{rel:{ppdb:-10,bsp:-6}}},
      {t:"Refuse to answer",sub:"The silence becomes the headline",fx:{enthusiasmAll:-.015}}
    ]}
  ];
}

/* ---- T31: "The Pig attacks!" — late-campaign Deyan Peevski event ---- */
const PIG_RAID={
  kind:"good",title:"BREAKING: The Pig Arrested!",
  text:"Agents of Interpol, the FBI and the CIA raid The Pig's Black Sea villa at dawn. Bribes, offshore ledgers, vote-buying records — all of it on camera. DPS headquarters is silent.",
  opts:[
    {label:"Let the justice system work",sub:"DPS approval collapses nationwide",fx:{partyHit:{party:"dps",v:-.85},nationBoost:.005,rel:{dps:-30}}},
    {label:"Gloat publicly",sub:"The collapse is total, but gloating costs you",fx:{partyHit:{party:"dps",v:-.85},nationBoost:-.01,rel:{dps:-40}}}
  ]
};
const PIG_EVENTS=[
  {kind:"bad",title:"The Pig attacks: vote-buying",text:"Sources say The Pig bought a ton of votes in Kardzhali. Reporters shove microphones at you: 'What's your reaction, sir?'",opts:[
    {label:"Denounce him loudly",sub:"Strong words, DPS relations crater",fx:{nationBoost:.008,rel:{dps:-15}}},
    {label:"Demand an official investigation",sub:"High ground, but your name gets dragged in",fx:{mod:{name:"Investigation politics",desc:"National appeal −3% for 3 weeks",turns:3,bad:true,effects:{appealMult:-.03}},rel:{dps:-10}}},
    {label:"Say it's not our business",sub:"Looks like you're looking away",fx:{nationBoost:-.01}}
  ]},
  {kind:"bad",title:"The Pig attacks: the Hitler remark",text:"The Pig came out and publicly stated you are worse than Hitler when it comes to minorities. The clip is everywhere.",opts:[
    {label:"Stay calm and dignified",sub:"The insult backfires on him, +1%",fx:{nationBoost:.01,rel:{dps:-15}}},
    {label:"Attack him back personally",sub:"The mud fight drags you down",fx:{rel:{dps:-20},mod:{name:"Mud fight",desc:"National appeal −4% for 3 weeks",turns:3,bad:true,effects:{appealMult:-.04}}}},
    {label:"Sue him for libel",sub:"Legal costs, but you look serious",fx:{cash:-20000,nationBoost:.005}}
  ]},
  {kind:"bad",title:"The Pig attacks: the ad wave",text:"The Pig's media machine unleashes a brutal attack-ad wave against you in every region he controls.",opts:[
    {label:"Answer with positive ads",sub:"Costly, but it works",fx:{cash:-15000,nationBoost:.005}},
    {label:"Ignore them",sub:"The ads do their damage",fx:{nationBoost:-.012}},
    {label:"Hit back with opposition research",sub:"A small counter-blow",fx:{oppHit:{party:"dps",v:.05},rel:{dps:-15}}}
  ]},
  {kind:"bad",title:"The Pig ambushes you live",text:"The Pig ambushes you on live TV: 'This puppet? This nothing? Look at him sweat!' The studio watches you.",opts:[
    {label:"Smile and pivot to policy",sub:"Grace under fire, +0.5%",fx:{nationBoost:.005,attrTemp:{attr:"charisma",v:1,turns:2}}},
    {label:"Get rattled on air",sub:"Worst-case damage control",fx:{nationBoost:-.02}},
    {label:"Punchline: 'The Pig would know about mud-slinging'",sub:"The clip goes viral, DPS furious",fx:{nationBoost:.008,rel:{dps:-12}}}
  ]}
];

function startPigEvent(){
  const ev=S.pigRaid?PIG_RAID:pick(PIG_EVENTS);
  renderPigEvent(ev);
}
function renderPigEvent(ev){
  S.paused=true;
  log("The Pig strikes — <b>"+esc(ev.title)+"</b> ("+(ev.kind==="good"?"raid":"attack")+").",ev.kind==="good"?"good":"bad");
  if(typeof window==="undefined"){
    applyFx(ev.opts[0].fx,"PIG EVENT");
    S.paused=false;
    updateAll();
    return;
  }
  const root=$("modal-root");
  const optsHtml=ev.opts.map((o,i)=>'<button class="btn" data-ai="'+i+'">'+esc(o.label)+(o.sub?'<small>'+esc(o.sub)+'</small>':"")+'</button>').join("");
  root.innerHTML='<div class="modal-back"><div class="modal">'
    +'<div class="ev-head '+(ev.kind==="good"?"good":"bad")+'"><span>'+(ev.kind==="good"?"BREAKING NEWS":"THE PIG ATTACKS")+'</span><span class="paused-badge">GAME PAUSED</span></div>'
    +'<div class="ev-body"><h3>'+esc(ev.title)+'</h3><p>'+esc(ev.text)+'</p><div class="ev-opts">'+optsHtml+'</div></div>'
    +'</div></div>';
  root.querySelectorAll("[data-ai]").forEach(b=>{b.onclick=()=>pigAnswer(ev,+b.dataset.ai);});
}
function pigAnswer(ev,ai){
  applyFx(ev.opts[ai].fx,"PIG EVENT");
  $("modal-root").innerHTML="";
  S.paused=false;
  updateAll();
}

/* ---- T39: the virus from India — V. Tarnovo stops the campaign ---- */
const VIRUS_RATE=0.05;
const VIRUS_DISTRICT="velikotarnovo";
const VIRUS_WEEKS_SKIPPED=3;
const VIRUS_PLANE_SVG='<svg viewBox="0 0 64 32"><path d="M4 18 L60 6 L50 26 L36 22 L30 30 L24 24 L6 24 Z" fill="#f4f4f8" stroke="#8892a6" stroke-width="1.5"/><path d="M60 6 L50 26" stroke="#8892a6" stroke-width="1.5"/></svg>';
function virusRoll(){return S&&S.phase==="campaign"&&!S.virusDone&&rng()<VIRUS_RATE;}
function virusDisarm(){if(S)S.virusDone=true;}
function startVirusEvent(){
  if(!S||S.phase!=="campaign")return;
  S.paused=true;
  S.virusDone=true;
  log("BREAKING — a new virus has arrived in <b>V. Tarnovo</b>. The campaign freezes.","bad");
  if(typeof window==="undefined"||!document.getElementById("map-canvas")){virusSkipTurns();return;}
  const c=$("map-canvas");
  const plane=document.createElement("div");
  plane.id="virus-plane";
  plane.innerHTML=VIRUS_PLANE_SVG;
  plane.style.left="-90px";plane.style.top="56%";
  c.appendChild(plane);
  requestAnimationFrame(()=>{
    plane.style.left="52%";plane.style.top="34%";
    plane.classList.add("fly");
  });
  setTimeout(()=>{plane.classList.add("arrived");},2600);
  setTimeout(()=>{plane.remove();},3600);
  setTimeout(virusArrive,2700);
}
function virusArrive(){
  zoomToDistrict(VIRUS_DISTRICT,2.6);
  const node=document.querySelector('#bg-map .node[data-id="'+VIRUS_DISTRICT+'"]');
  if(node)node.classList.add("virus-flash");
  setTimeout(()=>{
    const root=$("modal-root");
    root.innerHTML='<div class="modal-back"><div class="modal">'
      +'<div class="ev-head bad"><span>A NEW VIRUS HAS ARRIVED FROM INDIA</span><span class="paused-badge">GAME PAUSED</span></div>'
      +'<div class="ev-body"><h3>V. Tarnovo is cut off</h3>'
      +'<p>An unknown virus lands with the travellers in V. Tarnovo. Every party freezes for three weeks — no rallies, no ads, no doors. And when polling restarts, the voters punish them all.</p>'
      +'<div class="ev-opts"><button class="btn primary" id="virus-continue">The campaign waits ▸</button></div></div>'
      +'</div></div>';
    $("virus-continue").onclick=virusContinue;
  },700);
}
function virusContinue(){
  virusCleanup();
  $("modal-root").innerHTML="";
  virusSkipTurns();
}
function virusCleanup(){
  const plane=document.getElementById("virus-plane");
  if(plane)plane.remove();
  const node=document.querySelector('#bg-map .node[data-id="'+VIRUS_DISTRICT+'"]');
  if(node)node.classList.remove("virus-flash");
  const z=mapZoom;
  if(z&&z.reset)z.reset();
}
function zoomToDistrict(id,scale){
  const c=$("map-canvas"),svg=$("bg-map"),d=DIST_BY_ID[id];
  if(!c||!svg||!d||!mapZoom)return;
  const z=mapZoom;
  const r=c.getBoundingClientRect();
  const sr=svg.getBoundingClientRect();
  if(!r.width||!r.height||!sr.width||!sr.height){z.setView(0,0,scale);return;}
  const k=Math.min(sr.width/1000,sr.height/620);
  const ox=(sr.width-1000*k)/2,oy=(sr.height-620*k)/2;
  z.setView(-(ox+d.x*k)*scale+r.width/2,-(oy+d.y*k)*scale+r.height/2,scale);
}
function virusSkipTurns(){
  const nat=nationalShares(false);
  const loss={};
  for(const p of allParties()){
    const sh=nat[p.id]||0;
    const target=Math.max(0.03,sh*0.75-0.02);
    loss[p.id]=Math.max(0,sh-target);
  }
  S.virusLoss=loss;
  recomputePolls();
  const parts=[];
  for(const p of allParties()){
    const before=nat[p.id]||0;
    parts.push(partyOf(p.id).abbr+" "+pct(before)+" → "+pct(S.pollNat[p.id]||0));
  }
  log("The virus shakes every party — "+parts.join(", ")+".","bad");
  for(let i=1;i<=VIRUS_WEEKS_SKIPPED;i++){
    S.week++;
    log("Week "+S.week+" — campaigning suspended. Rallies cancel, polling stops, doors stay shut.","bad");
  }
  saveGame();
  S.paused=false;
  updateAll();
  if(S.week>20){runElection();return;}
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
    if((d.geo&&d.geo.proRussia)>=0.5)P.push({kind:"choice",title:"Oligarch courts you in "+d.name,text:"A businessman with deep ties to Moscow wants to 'invest' in your campaign in "+d.name+". He mentions old friends in the Kremlin.",opts:[
      {label:"Take the money",sub:"+40 000 лв, questions will follow",fx:{cash:40000,mod:{name:"Oligarch money",desc:"National appeal −4% for 4 weeks",turns:4,bad:true,effects:{appealMult:-.04}}}},
      {label:"Decline publicly",sub:"Clean hands, reformers warm to you",fx:{nationBoost:.004,rel:{ppdb:6}}}
    ]});
    if((d.geo&&d.geo.proEU)>=0.75)P.push({kind:"good",title:"EU grant for "+d.name,text:"A European fund approves an infrastructure project in "+d.name+" — your campaign takes the credit and a modest windfall.",opts:[{label:"Cut the ribbon",fx:{cash:15000,districtBoost:{d:d.id,v:.02},rel:{ppdb:8}}}]});
    if((d.geo&&d.geo.nationalism)>=0.6)P.push({kind:"choice",title:"Patriotic association in "+d.name,text:"A nationalist veterans' association in "+d.name+" offers its endorsement — at a price of rhetoric.",opts:[
      {label:"Accept their endorsement",sub:"Nationalists warm to you",fx:{rel:{vaz:10,velichie:8},nationBoost:.004}},
      {label:"Politely decline",sub:"Reformers approve",fx:{rel:{ppdb:6},nationBoost:.003}}
    ]});
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
  if(issActive("energy"))P.push({kind:"choice",title:"Union endorsement request",text:"The energy workers' union wants you to pledge generous state subsidies before they endorse you.",opts:[
    {label:"Pledge subsidies",sub:"Shift toward subsidies; coal regions love it",fx:{posShift:{issue:"energy",delta:.2},rel:{bsp:15},multiBoost:coalD.map(x=>({d:x,v:.03})),mod:{name:"Business wing unhappy",desc:"National appeal −3% for 4 weeks",turns:4,bad:true,effects:{appealMult:-.03}}}},
    {label:"Stay non-committal",sub:"The union stays neutral",fx:{rel:{bsp:-10}}}
  ]});
  if(issActive("euro"))P.push({kind:"choice",title:"Foreign leader's endorsement",text:"A prominent European leader offers a joint appearance endorsing your pro-EU credentials.",opts:[
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
  if(issActive("energy"))P.push({kind:"choice",title:"Energy crisis pledge",text:"With energy prices spiking, reporters demand your position on subsidies.",opts:[
    {label:"Promise state subsidies",sub:"Coal regions cheer; your stance shifts",fx:{posShift:{issue:"energy",delta:.15},multiBoost:coalD.map(x=>({d:x,v:.03})),rel:{bsp:8}}},
    {label:"Defend the free market",sub:"Business approves",fx:{posShift:{issue:"energy",delta:-.15},nationBoost:.01,rel:{gerb:8}}}
  ]});
  P.push({kind:"choice",title:"Youth social-media blitz",text:"Your digital team wants 15 000 лв for a TikTok-first youth campaign.",opts:[
    {label:"Fund it",sub:"−15 000 лв, national boost + ad power",fx:{cash:-15000,nationBoost:.018,mod:{name:"Viral momentum",desc:"Ad power +20% for 4 weeks",turns:4,effects:{adMult:.2}}}},
    {label:"Stick to TV",sub:"",fx:{}}
  ]});

  /* ---- T7: expanded pool — local families (per district) ---- */
  for(const d of DISTRICTS){
    P.push({kind:"good",title:"Market day in "+d.name,text:"You work the market stalls in "+d.name+" and shake a hundred hands; traders slip you their concerns.",opts:[{label:"Great morning",fx:{entDistrict:{d:d.id,v:.05},districtBoost:{d:d.id,v:.01}}}]});
    P.push({kind:"bad",title:"Mining accident near "+d.name,text:"A mining incident near "+d.name+" dominates the local news. Any political visit feels tone-deaf.",opts:[{label:"Show solidarity quietly",fx:{entDistrict:{d:d.id,v:-.07},districtBoost:{d:d.id,v:-.02}}}]});
    P.push({kind:"bad",title:"Flood damage in "+d.name,text:"Flooding hits villages around "+d.name+". Your team donates to relief — out of campaign funds.",opts:[{label:"Help with donations",fx:{cash:-8000,entDistrict:{d:d.id,v:-.06}}}]});
    P.push({kind:"good",title:"Road-works promise in "+d.name,text:"You promise to finish the half-paved roads around "+d.name+" if elected. The crowd cheers.",opts:[{label:"Make the promise",fx:{districtBoost:{d:d.id,v:.02},cash:-5000}}]});
    P.push({kind:"good",title:"Diaspora gift for "+d.name,text:"Emigrants from "+d.name+" abroad pool funds for a hometown project and invite you to inaugurate it.",opts:[{label:"Accept the invitation",fx:{cash:10000,districtBoost:{d:d.id,v:.015}}}]});
    P.push({kind:"good",title:"Football photo op in "+d.name,text:"The local club invites you to a derby in "+d.name+". Fans surround you for selfies.",opts:[{label:"Join the fans",fx:{entDistrict:{d:d.id,v:.04},districtBoost:{d:d.id,v:.01}}}]});
    P.push({kind:"good",title:"School visit in "+d.name,text:"Pupils in "+d.name+" hold a mock election and invite you to answer their questions.",opts:[{label:"Take it seriously",fx:{entDistrict:{d:d.id,v:.04},cash:-3000}}]});
    P.push({kind:"good",title:"Hospital tour in "+d.name,text:"You tour the crowded hospital in "+d.name+" and promise new equipment. Doctors note the attention.",opts:[{label:"Promise equipment",fx:{entDistrict:{d:d.id,v:.05},cash:-6000}}]});
    P.push({kind:"bad",title:"Bus-fare protest in "+d.name,text:"Commuters block the centre of "+d.name+" over rising fares. Politicians are blamed on all sides.",opts:[{label:"Weather it",fx:{entDistrict:{d:d.id,v:-.05},districtBoost:{d:d.id,v:-.01}}}]});
    P.push({kind:"good",title:"Harvest festival in "+d.name,text:"The harvest festival in "+d.name+" is a warm, crowded celebration and you are a guest of honour.",opts:[{label:"Celebrate with them",fx:{entDistrict:{d:d.id,v:.04}}}]});
    P.push({kind:"good",title:"Youth sports day in "+d.name,text:"A youth sports tournament in "+d.name+" invites you to hand out the medals.",opts:[{label:"Hand out medals",fx:{entDistrict:{d:d.id,v:.03},districtBoost:{d:d.id,v:.015}}}]});
    P.push({kind:"bad",title:"Market-price protest in "+d.name,text:"Producers and shoppers alike protest grocery prices in "+d.name+". Your campaign flyers get torn.",opts:[{label:"Stay away",fx:{entDistrict:{d:d.id,v:-.05},districtBoost:{d:d.id,v:-.015}}}]});
    P.push({kind:"good",title:"Library reading in "+d.name,text:"The library in "+d.name+" hosts a reading with local authors and invites you to open it.",opts:[{label:"Open the evening",fx:{entDistrict:{d:d.id,v:.04},cash:-2000}}]});
  }

  /* ---- T7: national good families ---- */
  P.push({kind:"good",title:"Jobs report surprise",text:"Fresh unemployment figures beat expectations. The mood lifts and some credit the political class.",opts:[{label:"Celebrate quietly",fx:{nationBoost:.008}}]});
  P.push({kind:"good",title:"Tourism boom",text:"A record tourist season fills hotels and restaurants. The country feels prosperous.",opts:[{label:"Smile for the cameras",fx:{nationBoost:.006}}]});
  P.push({kind:"good",title:"EU funding approved",text:"A long-pending EU infrastructure grant is finally approved. Newspapers print the big number.",opts:[{label:"Take credit",fx:{nationBoost:.012}}]});
  P.push({kind:"good",title:"Railway modernization",text:"The mainline stations get a long-awaited modernization contract. Construction jobs follow.",opts:[{label:"Cut the ribbon",fx:{nationBoost:.008,cash:6000}}]});
  P.push({kind:"good",title:"Digital ID rollout",text:"The digital ID system launches smoothly — a rare administrative success story.",opts:[{label:"Applaud efficiency",fx:{nationBoost:.007}}]});
  P.push({kind:"good",title:"Scholarship funds",text:"A new scholarship round lets hundreds of students study. Education advocates cheer.",opts:[{label:"Support them",fx:{nationBoost:.006,enthusiasmAll:.02}}]});
  P.push({kind:"good",title:"Artisan export deal",text:"Bulgarian rose oil and crafts land a major export contract. Pride swells.",opts:[{label:"Toast the artisans",fx:{nationBoost:.007,cash:4000}}]});
  P.push({kind:"good",title:"Mountain resort season",text:"A snow-heavy winter fills the ski resorts. Bansko is buzzing.",opts:[{label:"Visit a resort",fx:{nationBoost:.005,enthusiasmAll:.02}}]});
  P.push({kind:"good",title:"Solar farm opening",text:"A giant solar farm opens near the coast, generating jobs and headlines.",opts:[{label:"Attend the opening",fx:{nationBoost:.009}}]});
  P.push({kind:"good",title:"Danube shipping record",text:"Ruse's port moves record cargo. The Danube economy hums.",opts:[{label:"Praise the port",fx:{nationBoost:.006}}]});
  P.push({kind:"good",title:"Heritage restoration",text:"A medieval fortress is restored to its former glory. Culture pages are delighted.",opts:[{label:"Visit the fortress",fx:{nationBoost:.005,enthusiasmAll:.015}}]});
  P.push({kind:"good",title:"Birth-rate uptick",text:"Demographers note a small but real rise in births. The news warms hearts.",opts:[{label:"Welcome the news",fx:{nationBoost:.005}}]});
  P.push({kind:"good",title:"Micro-credit program",text:"A micro-credit program lets small businesses across the country expand.",opts:[{label:"Champion small business",fx:{nationBoost:.008,cash:5000}}]});
  P.push({kind:"good",title:"Science lab grant",text:"A Bulgarian research lab wins a prestigious international grant.",opts:[{label:"Congratulate them",fx:{nationBoost:.006}}]});
  P.push({kind:"good",title:"Emergency services upgrade",text:"New ambulances and fire trucks arrive in the poorest regions. Officials look competent.",opts:[{label:"Tour a station",fx:{nationBoost:.008}}]});
  P.push({kind:"good",title:"Library funding",text:"A state program funds 100 village libraries. Book lovers rejoice.",opts:[{label:"Read to children",fx:{nationBoost:.005,enthusiasmAll:.02}}]});
  P.push({kind:"good",title:"Wine harvest award",text:"A Bulgarian wine takes a gold medal at an international competition.",opts:[{label:"Raise a glass",fx:{nationBoost:.005}}]});
  P.push({kind:"good",title:"Tech campus",text:"An international tech company opens a campus in Sofia, promising hundreds of jobs.",opts:[{label:"Welcome them",fx:{nationBoost:.01}}]});
  P.push({kind:"good",title:"Fishing quotas",text:"Black Sea fishing quotas improve. Coastal communities breathe easier.",opts:[{label:"Visit the harbour",fx:{nationBoost:.005,entDistrict:{d:"burgas",v:.04}}}]});
  P.push({kind:"good",title:"Education rankings",text:"Bulgarian pupils climb an international education ranking.",opts:[{label:"Praise the teachers",fx:{nationBoost:.007}}]});
  P.push({kind:"good",title:"Startup fund",text:"A public startup fund backs young founders — the tech press is thrilled.",opts:[{label:"Meet the founders",fx:{nationBoost:.008}}]});
  P.push({kind:"good",title:"National team win",text:"The national football team pulls off a famous victory. The whole country is smiling.",opts:[{label:"Celebrate with fans",fx:{enthusiasmAll:.03}}]});
  P.push({kind:"good",title:"Recycling scheme",text:"A pilot recycling scheme in three cities is a genuine success.",opts:[{label:"Applaud it",fx:{nationBoost:.005}}]});
  P.push({kind:"good",title:"Property market stable",text:"House prices stabilise after years of chaos. First-time buyers feel hopeful.",opts:[{label:"Welcome stability",fx:{nationBoost:.006}}]});
  P.push({kind:"good",title:"Station refurbishment",text:"A grand old railway station reopens after renovation, a crowd gathers for the ceremony.",opts:[{label:"Attend the ceremony",fx:{nationBoost:.005,enthusiasmAll:.02}}]});
  P.push({kind:"good",title:"Veterans' care",text:"A veterans' support centre opens its doors. The gesture touches the country.",opts:[{label:"Visit the centre",fx:{nationBoost:.007}}]});

  /* ---- T7: national bad families ---- */
  P.push({kind:"bad",title:"Currency fluctuation",text:"The lev wobbles against the euro for a week. Markets are nervous; headlines are louder.",opts:[{label:"Stay calm",fx:{nationBoost:-.006}}]});
  P.push({kind:"bad",title:"Drought warning",text:"A prolonged drought threatens crops across the plains. Farmers are furious at everyone.",opts:[{label:"Express concern",fx:{nationBoost:-.008,entDistrict:{d:"plovdiv-obl",v:-.04}}}]});
  P.push({kind:"bad",title:"Bank cyberattack",text:"Hackers hit a large bank. Customers queue nervously and blame the state.",opts:[{label:"Ask for calm",fx:{nationBoost:-.008}}]});
  P.push({kind:"bad",title:"Bridge toll hike",text:"Tolls rise on the major bridges. Commuters protest at every toll booth.",opts:[{label:"Take a different route",fx:{nationBoost:-.006}}]});
  P.push({kind:"bad",title:"Train delays",text:"A week of signal failures wrecks the rail timetable. Commuters seethe.",opts:[{label:"Apologize on behalf of everyone",fx:{nationBoost:-.007}}]});
  P.push({kind:"bad",title:"Hospital shortage",text:"A hospital in a mid-size town runs out of vital supplies. The story goes national.",opts:[{label:"Promise intervention",fx:{nationBoost:-.012,cash:-10000}}]});
  P.push({kind:"bad",title:"Teacher strike",text:"Teachers strike over wages in three regions. Classrooms empty.",opts:[{label:"Offer dialogue",fx:{nationBoost:-.006}}]});
  P.push({kind:"bad",title:"Postal strike",text:"Postal workers walk out; pensioners wait for letters that never come.",opts:[{label:"Voice sympathy",fx:{nationBoost:-.006}}]});
  P.push({kind:"bad",title:"Border congestion",text:"Truck queues stretch for kilometres at border crossings. Hauliers fume.",opts:[{label:"Avoid the border roads",fx:{nationBoost:-.007}}]});
  P.push({kind:"bad",title:"Fuel surcharge",text:"A fuel surcharge hits buses and flights. Everything costs a little more.",opts:[{label:"Grimace publicly",fx:{nationBoost:-.006}}]});
  P.push({kind:"bad",title:"Benefit payment delays",text:"State benefit payments arrive late for thousands of households.",opts:[{label:"Demand answers",fx:{nationBoost:-.009}}]});
  P.push({kind:"bad",title:"Court backlog",text:"A leaked report shows courts drowning in old cases. Justice feels distant.",opts:[{label:"Promise reform",fx:{nationBoost:-.006}}]});
  P.push({kind:"bad",title:"Border camp protests",text:"Protests erupt around an overcrowded reception centre on the border.",opts:[{label:"Call for calm",fx:{nationBoost:-.01}}]});
  P.push({kind:"bad",title:"Phone outage",text:"A mobile network outage cuts off a third of the country for a day.",opts:[{label:"Use a landline",fx:{nationBoost:-.006}}]});
  P.push({kind:"bad",title:"Grain price collapse",text:"Grain prices collapse and farmers face ruin. Tractor convoys block roads.",opts:[{label:"Meet the farmers",fx:{nationBoost:-.008,cash:-8000}}]});
  P.push({kind:"bad",title:"Hotel cancellations",text:"A wave of cancellations empties the Black Sea resorts. Tourism towns worry.",opts:[{label:"Offer reassurance",fx:{nationBoost:-.005,entDistrict:{d:"varna",v:-.03}}}]});
  P.push({kind:"bad",title:"Night trains cancelled",text:"Night trains are cancelled for maintenance 'indefinitely'. Rural commuters are stranded.",opts:[{label:"Sympathize",fx:{nationBoost:-.005}}]});
  P.push({kind:"bad",title:"Road toll protests",text:"Truckers blockade the Trakia motorway over toll prices. Traffic chaos follows.",opts:[{label:"Stay off the motorway",fx:{nationBoost:-.008}}]});
  P.push({kind:"bad",title:"Fuel station shortages",text:"Several regions run out of fuel for a day. Panic buying follows.",opts:[{label:"Reassure the public",fx:{nationBoost:-.007}}]});
  P.push({kind:"bad",title:"Postal scam wave",text:"A scam wave preys on pensioners pretending to be officials. Trust erodes.",opts:[{label:"Condemn the scammers",fx:{nationBoost:-.007}}]});
  P.push({kind:"bad",title:"Pharmacy closures",text:"Pharmacies close in small towns citing red tape. The elderly suffer most.",opts:[{label:"Promise help",fx:{nationBoost:-.008}}]});
  P.push({kind:"bad",title:"School repair delays",text:"A school roof collapses after repairs were delayed for years. Lucky: no injuries.",opts:[{label:"Visit the school",fx:{nationBoost:-.01}}]});
  P.push({kind:"bad",title:"Dam safety fears",text:"Engineers flag cracks in an old dam. Evacuation drills scare the region.",opts:[{label:"Attend the briefing",fx:{nationBoost:-.007}}]});
  P.push({kind:"bad",title:"Factory bankruptcy",text:"A once-mighty factory declares bankruptcy. Hundreds lose their jobs.",opts:[{label:"Visit the workers",fx:{nationBoost:-.011}}]});
  P.push({kind:"bad",title:"Market dip",text:"Global markets dip and Bulgaria's small exchange follows. Your donors feel poorer.",opts:[{label:"Stay steady",fx:{nationBoost:-.005}}]});
  P.push({kind:"bad",title:"Fire season",text:"Forest fires break out in the mountains. Firefighters are stretched thin.",opts:[{label:"Visit the front line",fx:{nationBoost:-.006,cash:-5000}}]});

  /* ---- T7: choice families ---- */
  P.push({kind:"choice",title:"Podcast ambush",text:"A popular podcast invites you for a casual chat — then ambushes you with hostile questions.",opts:[
    {label:"Stay loose and funny",sub:"+1 Charisma for 3 weeks",fx:{attrTemp:{attr:"charisma",v:1,turns:3}}},
    {label:"Demand the script",sub:"You come off evasive",fx:{nationBoost:-.01}}
  ]});
  P.push({kind:"choice",title:"Whistleblower meeting",text:"A whistleblower wants to meet you with evidence of waste in the health system.",opts:[
    {label:"Meet them on the record",sub:"Big boost, allies nervous",fx:{nationBoost:.02,rel:{gerb:-10}}},
    {label:"Send an advisor",sub:"You stay clean",fx:{}}
  ]});
  P.push({kind:"choice",title:"Oligarch wedding invite",text:"A notorious oligarch invites you to his son's wedding in a Black Sea palace.",opts:[
    {label:"Go — it's just dinner",sub:"+20 000 лв, questions later",fx:{cash:20000,mod:{name:"Palace photos",desc:"National appeal −4% for 4 weeks",turns:4,bad:true,effects:{appealMult:-.04}}}},
    {label:"Send regrets",sub:"Your integrity is noted",fx:{mod:{name:"Clean distance",desc:"National appeal +2% for 4 weeks",turns:4,effects:{appealMult:.02}}}}
  ]});
  P.push({kind:"choice",title:"Union strike line",text:"Rail workers are on strike and ask you to walk the picket line.",opts:[
    {label:"Walk the line",sub:"Workers love it; management wary",fx:{entDistrict:{d:"ruse",v:.06},rel:{bsp:10},nationBoost:.005}},
    {label:"Stay neutral",sub:"Workers notice",fx:{entDistrict:{d:"ruse",v:-.03}}}
  ]});
  P.push({kind:"choice",title:"Church council letter",text:"The Holy Synod publicly asks candidates to defend traditional values in the campaign.",opts:[
    {label:"Answer respectfully",sub:"Conservatives approve",fx:{nationBoost:.008,rel:{vaz:8}}},
    {label:"Politely decline",sub:"Secular voters notice",fx:{rel:{ppdb:6},nationBoost:.003}}
  ]});
  P.push({kind:"choice",title:"TikTok duel",text:"A rival leader challenges you to a TikTok debate on his turf: dancing, roasting, policy.",opts:[
    {label:"Accept the challenge",sub:"Risky but electric — +2% if you land it",fx:{nationBoost:.02,rel:{mech:-10}}},
    {label:"Ignore the circus",sub:"Dignified, but they call you boring",fx:{nationBoost:-.005}}
  ]});
  P.push({kind:"choice",title:"Radio phone-in",text:"A national radio phone-in invites you to take calls from voters — unscripted.",opts:[
    {label:"Take the calls",sub:"Raw and human, +1.5%",fx:{nationBoost:.015,attrTemp:{attr:"charisma",v:1,turns:2}}},
    {label:"Send your spokesperson",sub:"Safe but forgettable",fx:{}}
  ]});
  P.push({kind:"choice",title:"University Q&A",text:"Students at Sofia University want a sharp, unmoderated Q&A.",opts:[
    {label:"Face the students",sub:"They grill you; +1%",fx:{nationBoost:.01,attrTemp:{attr:"intelligence",v:1,turns:2}}},
    {label:"Cancel politely",sub:"Students feel snubbed",fx:{nationBoost:-.006}}
  ]});
  if(issActive("pensions"))P.push({kind:"choice",title:"Chamber of commerce dinner",text:"The Chamber of Commerce wants a private dinner and a 'business-friendly' commitment.",opts:[
    {label:"Pledge lighter taxes",sub:"Donors cheer; shift your stance",fx:{cash:25000,posShift:{issue:"pensions",delta:-.05},rel:{gerb:8}}},
    {label:"Keep your promises",sub:"They stay polite but cool",fx:{rel:{gerb:-6}}}
  ]});
  P.push({kind:"choice",title:"Sports commentary stint",text:"A TV channel invites you to guest-commentate on a national team match.",opts:[
    {label:"Do the commentary",sub:"Fun, human, +1%",fx:{nationBoost:.01,enthusiasmAll:.02}},
    {label:"Stay on message",sub:"",fx:{}}
  ]});
  P.push({kind:"choice",title:"Charity auction",text:"A charity auction asks you to donate an experience for the highest bidder.",opts:[
    {label:"A day on the trail with you",sub:"Raises 15 000 лв for charity and goodwill",fx:{cash:-15000,nationBoost:.008}},
    {label:"Donate quietly",sub:"",fx:{}}
  ]});
  P.push({kind:"choice",title:"Festival jury duty",text:"A folklore festival asks you to sit on the jury for the grand prize.",opts:[
    {label:"Judge the festival",sub:"Warm local coverage",fx:{entDistrict:{d:"plovdiv-obl",v:.05},nationBoost:.004}},
    {label:"Decline politely",sub:"",fx:{}}
  ]});
  P.push({kind:"choice",title:"Farmers' roundtable",text:"Farmers demand a roundtable about subsidies, storage and exports — on their soil.",opts:[
    {label:"Go to the fields",sub:"Grain belt votes, −10 000 лв",fx:{cash:-10000,nationBoost:.01,entDistrict:{d:"dobrich",v:.05}}},
    {label:"Send a deputy",sub:"They feel ignored",fx:{nationBoost:-.006}}
  ]});
  P.push({kind:"choice",title:"Tech summit panel",text:"A regional tech summit wants you on a panel about innovation and brain drain.",opts:[
    {label:"Panel and punchlines",sub:"Young voters notice, +1%",fx:{nationBoost:.01,rel:{ppdb:6}}},
    {label:"Skip it",sub:"",fx:{}}
  ]});
  if(issActive("pensions"))P.push({kind:"choice",title:"Pensioners' lunch",text:"A community centre invites you to lunch with 300 pensioners.",opts:[
    {label:"Sit with them",sub:"They talk, you listen, +1%",fx:{nationBoost:.01,posShift:{issue:"pensions",delta:.04}}},
    {label:"A quick wave",sub:"They remember the wave",fx:{nationBoost:-.004}}
  ]});
  P.push({kind:"choice",title:"Border town visit",text:"A border town mayor invites you to see the empty streets and closed factories.",opts:[
    {label:"Walk the town",sub:"They trust you more, +0.8%",fx:{nationBoost:.008,entDistrict:{d:"vidin",v:.05}}},
    {label:"Send a team instead",sub:"",fx:{}}
  ]});
  P.push({kind:"choice",title:"Coal town roundtable",text:"Coal miners want a straight answer about the region's future.",opts:[
    {label:"Promise a fair transition",sub:"Coal region + enthusiasm, −1% national",fx:{entDistrict:{d:"stara-zagora",v:.08},nationBoost:-.01}},
    {label:"Pledge to keep mines open",sub:"Coal region loves it, greens rage",fx:{entDistrict:{d:"stara-zagora",v:.06},rel:{ppdb:-12}}}
  ]});
  P.push({kind:"choice",title:"Reality podcast offer",text:"A reality-style podcast wants to follow you for a week — every meeting, every call.",opts:[
    {label:"Cameras everywhere",sub:"Total transparency, +1.5%",fx:{nationBoost:.015,enthusiasmAll:.03}},
    {label:"Keep it private",sub:"",fx:{}}
  ]});
}

function closestAlly(){
  let best="ppdb",bd=9;
  for(const p of AI_PARTIES){
    let s=0;
    for(const i of activeIssueList())s+=Math.abs(p.pos[i.id]-S.party.pos[i.id]);
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
  if(fx.partyHit){
    const pid=fx.partyHit.party;
    for(const d of DISTRICTS){
      if(!S.boost[d.id])S.boost[d.id]={};
      const cur=S.boost[d.id][pid]||0;
      S.boost[d.id][pid]=Math.max(-0.9,cur+fx.partyHit.v);
    }
    log(tag+"<b>"+partyOf(pid).abbr+"</b> is hit nationwide ("+(fx.partyHit.v>0?"+":"")+pts(fx.partyHit.v)+" pts).",fx.partyHit.v<0?"good":"bad");
  }
  if(fx.rel){
    for(const k in fx.rel)S.rel[k]=(S.rel[k]||0)+fx.rel[k];
    log(tag+"Relationship: "+Object.keys(fx.rel).map(k=>"<b>"+partyOf(k).abbr+"</b> "+(fx.rel[k]>0?"+":"")+fx.rel[k]).join(", ")+".",Object.keys(fx.rel).some(k=>fx.rel[k]<0)?"bad":"good");
  }
  if(fx.posShift&&ISSUE_BY_ID[fx.posShift.issue]){S.party.pos[fx.posShift.issue]=clamp(S.party.pos[fx.posShift.issue]+fx.posShift.delta,0,1);log(tag+"Platform shift on <b>"+ISSUE_BY_ID[fx.posShift.issue].name+"</b> "+(fx.posShift.delta>0?"+":"")+fx.posShift.delta+".","info");}
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
  const n=r<0.08?2:(r<0.80?1:0);
  for(let i=0;i<n;i++)S.eventQueue.push(drawEvent());
  if(S.eventQueue.length)showNextEvent();
}
function showNextEvent(){
  if(!S.eventQueue.length){S.paused=false;updateAll();return;}
  S.paused=true;
  const nxt=S.eventQueue.shift();
  if(nxt==="__DEBATE__"){startDebate();return;}
  if(nxt==="__PIG__"){startPigEvent();return;}
  if(nxt==="__VIRUS__"){startVirusEvent();return;}
  renderEventModal(EVENT_POOL[nxt]);
}

/* ---- T11: TV debate flow ---- */
function startDebate(){
  if(typeof window==="undefined"){debateHeadless();return;}
  const qs=buildDebateQuestions();
  if(!qs.length){S.paused=false;updateAll();return;}
  S.debate={q:qs,i:-1,answers:[],natBefore:S.pollNat?S.pollNat.player:null};
  log("The big TV debate goes live — 8 questions, one night, no walking off.","info");
  renderDebateIntro();
}
function renderDebateIntro(){
  const root=$("modal-root");
  root.innerHTML='<div class="modal-back"><div class="modal">'
    +'<div class="ev-head choice"><span>THE BIG DEBATE</span><span class="paused-badge">GAME PAUSED</span></div>'
    +'<div class="ev-body"><h3>Live on air — 8 questions</h3>'
    +'<p>National television, a packed studio, and every rival watching. Eight questions decide how the country sees you tonight. There is no walking off the stage.</p>'
    +'<div class="ev-opts"><button class="btn primary" id="db-go">Go live ▸</button></div></div>'
    +'</div></div>';
  $("db-go").onclick=()=>renderDebateQuestion(0);
}
function renderDebateQuestion(i){
  S.debate.i=i;
  const d=S.debate,q=d.q[i];
  const root=$("modal-root");
  const optsHtml=q.a.map((o,ai)=>'<button class="btn" data-ai="'+ai+'">'+esc(o.t)+(o.sub?'<small>'+esc(o.sub)+'</small>':"")+'</button>').join("");
  root.innerHTML='<div class="modal-back"><div class="modal">'
    +'<div class="ev-head choice"><span>THE BIG DEBATE</span><span class="paused-badge">QUESTION '+(i+1)+' / 8</span></div>'
    +'<div class="ev-body"><h3>'+esc(q.q)+'</h3><div class="ev-opts">'+optsHtml+'</div></div>'
    +'</div></div>';
  root.querySelectorAll("[data-ai]").forEach(b=>{b.onclick=()=>debateAnswer(+b.dataset.ai);});
}
function debateAnswer(ai){
  const d=S.debate,q=d.q[d.i],o=q.a[ai];
  applyFx(o.fx,"DEBATE Q"+(d.i+1));
  d.answers.push({q:q.q,t:o.t,sub:o.sub});
  if(d.i+1>=d.q.length)renderDebateSummary();
  else renderDebateQuestion(d.i+1);
}
function renderDebateSummary(){
  const d=S.debate;
  const net=d.natBefore===null?0:(S.pollNat?S.pollNat.player:0)-d.natBefore;
  const rival=mainRivalId();
  if(net>=0)applyFx({oppHit:{party:rival,v:.02}},"DEBATE");
  else applyFx({rivalBoost:{n:3,v:.015}},"DEBATE");
  const netLine=(net>=0?"+":"")+(net*100).toFixed(1)+" pts nationally";
  log("DEBATE — the dust settles: net national change "+(net>=0?"+":"")+(net*100).toFixed(1)+" pts.","info");
  const rows=d.answers.map((a,i)=>'<div class="db-row"><b>Q'+(i+1)+'</b><span>'+esc(a.q)+'</span><span class="db-choice">— '+esc(a.t)+': '+esc(a.sub)+'</span></div>').join("");
  const root=$("modal-root");
  root.innerHTML='<div class="modal-back"><div class="modal">'
    +'<div class="ev-head good"><span>DEBATE OVER</span><span class="paused-badge">GAME PAUSED</span></div>'
    +'<div class="ev-body"><h3>You survived the night</h3>'
    +'<p>Analysts say <b>'+esc(partyOf(rival).abbr)+'</b> came off worse. Net effect on your campaign: <b style="color:var(--gold)">'+netLine+'</b>.</p>'
    +'<div class="db-list">'+rows+'</div>'
    +'<div class="ev-opts"><button class="btn primary" id="db-done">Resume campaign</button></div></div>'
    +'</div></div>';
  $("db-done").onclick=()=>{
    S.debate=null;
    S.paused=false;
    root.innerHTML="";
    updateAll();
  };
}
function debateHeadless(){
  const qs=buildDebateQuestions();
  const natBefore=S.pollNat?S.pollNat.player:null;
  for(const q of qs)applyFx(q.a[0].fx,"DEBATE Q");
  const net=natBefore===null?0:(S.pollNat?S.pollNat.player:0)-natBefore;
  if(net>=0)applyFx({oppHit:{party:mainRivalId(),v:.02}},"DEBATE");
  else applyFx({rivalBoost:{n:3,v:.015}},"DEBATE");
  log("DEBATE — net national change "+(net>=0?"+":"")+(net*100).toFixed(1)+" pts.","info");
  S.debate=null;
  S.paused=false;
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

/* ---- T35: DIKSY display rewrite layer (display-only, never touches state) ---- */
function diksyOverlay(){
  if(!S||!S.diksy||typeof document==="undefined")return;
  const root=document.getElementById("app");
  if(!root)return;
  const textSel=[
    "input[type=text]","input[type=search]","textarea",
    ".log-line",".ev-head span","#modal-root h3","#modal-root p",
    ".title-bar-text","label","h2","h4",".rname",".dc-name","#tb-pm","#end-title","#end-text"
  ];
  const skipSel="button,svg,.seat-cell,.chip,.tb-cash,.tb-stamina,.tb-poll,.tb-clock,.tb-days,.map-title,.preview-tip,.demand-chip,.mini-label,#end-stats,.pm-form,#mods-list";
  root.querySelectorAll(textSel.join(",")).forEach(el=>{
    if(el.closest(skipSel))return;
    if(el.querySelector&&el.querySelector("input,select,textarea"))return;
    if(el.tagName==="INPUT"||el.tagName==="TEXTAREA"){if(el.value!=="DIKSY")el.value="DIKSY";return;}
    if(el.textContent==="DIKSY")return;
    el.textContent="DIKSY";
  });
}
let diksyObserver=null;
function ensureDiksyObserver(){
  if(diksyObserver||!S||!S.diksy||typeof document==="undefined"||typeof MutationObserver==="undefined")return;
  const root=document.getElementById("app");
  if(!root)return;
  diksyObserver=new MutationObserver(()=>{
    if(!S||!S.diksy)return;
    diksyOverlay();
  });
  diksyObserver.observe(root,{subtree:true,childList:true,characterData:true});
}

function helpModal(){
  openModal('<h3>How to play</h3>'
    +'<p>You have <b>20 weeks</b> until Election Day. Each week you receive stamina points (SP) based on your candidate\'s Stamina attribute. Spend them to travel between the 29 districts and hold targeted rallies — each campaign draws <b>5 issues from a pool of nine</b> (Eurozone Entry, Anticorruption Reform, Energy Subsidies, Judicial Independence, Pension Reform, Healthcare, Defense Spending, Rural Development, Migration).</p>'
    +'<ul><li>Rallies are strongest on high-weight issues where your platform matches the district stance.</li><li>Campaign HQs cost 40 000 лв but pay 9 000 лв per week and slowly grow local support.</li><li>Local media ads scale with Intelligence and suffer diminishing returns.</li></ul>'
    +'<p>Polling: a district\'s vote share comes from <b>issue alignment × voter enthusiasm × campaign boosts</b>. Ten rivals campaign too — GERB, Progresivna Balgariya, PP-DB, DPS, Vazrazhdane, BSP, ITN, MECh, APS and Velichie — and the strict 4% national threshold will drop the weakest of them out of the Narodno Subranie.</p>'
    +'<p>Election Day uses proportional representation: a strict <b>4% national threshold</b>, then the <b>D\'Hondt method</b> allocates each district\'s seats. 240 seats total; 121 for a majority.</p>'
    +'<p>After the vote, negotiate a coalition: spend political capital on cabinet posts, policy concessions and cash to push parties\' willingness to 100. Random events — <b>1K+ in the database</b> — pause the game and apply permanent, timed or one-time modifiers.</p>'
    +'<div class="center-row"><button class="btn primary" onclick="closeModal()">Got it</button></div>');
}

function menuModal(){
  const mb=isMobileUI();
  openModal('<h3>Menu</h3><div class="ev-opts">'
    +'<button class="btn" id="m-resume">Resume campaign</button>'
    +'<button class="btn" id="m-save">Save campaign</button>'
    +'<button class="btn" id="m-load">Load last save</button>'
    +'<button class="btn" id="m-help">How to play</button>'
    +(mb&&S&&S.cheat?'<button class="btn" id="m-debug">Debug console</button>':'')
    +'<button class="btn danger" id="m-quit">Quit to title</button>'
    +'</div>'
    +(mb&&S&&S.cheat?'<p class="dc-note" style="margin:0;margin-top:8px"><b>CHEAT MODE ACTIVE</b> — Debug is available above.</p>':''));
  $("m-resume").onclick=closeModal;
  $("m-save").onclick=()=>{saveGame();closeModal();log("Campaign saved.","info");renderLog();};
  $("m-load").onclick=()=>{closeModal();if(!loadGame())alert("No save found.");};
  $("m-help").onclick=helpModal;
  const md=$("m-debug");
  if(md)md.onclick=debugModal;
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
    +'<button class="btn" id="dbg-boost">+5 points in <b>'+esc((S.selDistrict?DIST_BY_ID[S.selDistrict]:DIST_BY_ID[S.location]).short)+'</b></button>'
    +'<button class="btn" id="dbg-easy">EASY WIN — +50% everywhere this turn</button>'
    +'<div class="center-row" style="gap:6px">'+rivalBtns+'</div>'
    +attrIn("stamina")+attrIn("charisma")+attrIn("intelligence")
    +'<button class="btn" id="dbg-apply">Apply attributes</button>'
    +'<button class="btn" id="dbg-floor">Guarantee 4% threshold</button>'
    +'<button class="btn" id="dbg-virus">Trigger the India virus</button>'
    +'<button class="btn danger" id="dbg-election">Trigger Election Day now</button>'
    +'<button class="btn ghost" id="dbg-close">Close</button>'
    +'</div>');
  function refreshStatus(){
    const st=$("dbg-status");
    if(st)st.innerHTML="Funds: <b>"+fmtMoney(S.cash)+"</b> · Stamina: <b>"+S.stamina+"/"+getMaxStamina()+"</b> · Selected district: <b>"+esc((S.selDistrict?DIST_BY_ID[S.selDistrict]:DIST_BY_ID[S.location]).short)+"</b>";
    const fl=$("dbg-floor");
    if(fl)fl.textContent=S.cheatFloor?"Threshold guarantee: ARMED":"Guarantee 4% threshold";
    const ew=$("dbg-easy");
    if(ew)ew.textContent=S.cheatEasyWin?"EASY WIN: ARMED (clears at the end of the week)":"EASY WIN — +50% everywhere this turn";
  }
  refreshStatus();
  $("dbg-cash").onclick=()=>{S.cash+=100000;log("CHEAT — +100 000 лв.","info");updateAll();refreshStatus();};
  $("dbg-sp").onclick=()=>{S.stamina=getMaxStamina();log("CHEAT — stamina refilled to "+S.stamina+".","info");updateAll();refreshStatus();};
  $("dbg-end").onclick=()=>{addModifier({name:"Cheat: iron lungs",desc:"+10 max stamina (permanent)",turns:null,effects:{maxStamina:10}});log("CHEAT — +10 max stamina for the run.","info");updateAll();refreshStatus();};
  $("dbg-boost").onclick=()=>{const bid=S.selDistrict||S.location;S.debugBoost[bid]=Math.min(0.45,(S.debugBoost[bid]||0)+0.05);recomputePolls();log("CHEAT — +5 points for <b>"+DIST_BY_ID[bid].short+"</b>.","info");updateAll();refreshStatus();};
  $("dbg-easy").onclick=()=>{S.cheatEasyWin=!S.cheatEasyWin;recomputePolls();log("CHEAT — Easy Win "+(S.cheatEasyWin?"ARMED (+50% support everywhere this turn).":"disarmed."),"info");updateAll();refreshStatus();};
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
  $("dbg-virus").onclick=()=>{S.virusDone=false;closeModal();startVirusEvent();};
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
    if(!S.term)S.term=1;
    if(!S.termHistory||!Array.isArray(S.termHistory))S.termHistory=[];
    if(!S.player.appearance)S.player.appearance=Object.assign(defaultAppearance(),FACES[S.player.face||0]||{});
    if(!S.partyMachine)S.partyMachine=defaultPartyMachine();
    if(!Array.isArray(S.cashHist))S.cashHist=[];
    if(S.virusDone===undefined)S.virusDone=false;
    if(!S.virusLoss)S.virusLoss=null;
    if(!S.debugBoost||typeof S.debugBoost!=="object")S.debugBoost={};
    if(S.cheatEasyWin===undefined)S.cheatEasyWin=false;
    if(!S.activeIssues||!S.activeIssues.length)drawActiveIssues();
    if(!S.debateWeek)S.debateWeek=15;
    if(!S.eventBag||!S.eventBag.length){buildEventPool();S.eventBag=shuffle([...Array(EVENT_POOL.length).keys()]);S.eventCursor=0;}
    else {buildEventPool();}
    S.paused=false;S.eventQueue=[];
    if(S.diksy){ensureDiksyObserver();diksyOverlay();}
    resumeFromState();
    return true;
  }catch(e){return false;}
}
function resumeFromState(){
  if(S.phase==="campaign"){
    if(!S.districtPoll||!Object.keys(S.districtPoll).length)recomputePolls();
    if(S.debate&&S.debate.q&&S.debate.q.length&&S.debate.i<=8){
      S.paused=true;
      if(S.debate.i<0)renderDebateIntro();
      else if(S.debate.i<8)renderDebateQuestion(S.debate.i);
      else renderDebateSummary();
    }
    showScreen("game");buildMap();updateAll();
  }
  else if(S.phase==="election"){renderElectionScreen();showScreen("election");}
  else if(S.phase==="coalition"){renderCoalition();showScreen("coalition");}
  else if(S.phase==="review"){
    if(!S.termReport&&S.termHistory.length)S.termReport=S.termHistory[S.termHistory.length-1].lines;
    renderReviewScreen();showScreen("review");
  }
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
    body.setAttribute("fill",S.kosyo?S.party.color:(p?p.color:"#44506b"));
    body.setAttribute("fill-opacity",S.kosyo?"1":"0.85");
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
  $("tb-cash").innerHTML='<span class="sc-ico">лв</span><span>Funds <b>'+fmtMoney(S.cash)+"</b></span>";
  $("tb-stamina").innerHTML='<span class="sc-ico">SP</span><span>SP <b>'+S.stamina+"/"+getMaxStamina()+"</b></span>";
  const pol=S.pollNat.player||0;
  $("tb-poll").innerHTML='<span class="sc-ico">%</span><span>Poll <b>'+pct(pol)+"</b></span>";
  const hud=(id,ico,val,cap)=>{
    const el=$(id);
    if(el)el.innerHTML='<span class="hud-ico">'+ico+'</span><span class="hud-txt"><span class="hud-val">'+val+'</span><span class="hud-cap">'+cap+'</span></span>';
  };
  hud("hud-cash","лв",fmtMoney(S.cash),"Campaign funds");
  hud("hud-stamina","SP",S.stamina+"/"+getMaxStamina(),"Stamina");
  hud("hud-poll","%",pct(pol),"National poll");
  const dbgBtn=$("btn-debug");
  if(dbgBtn)dbgBtn.style.display=S.cheat?"":"none";
  const cheatChip=$("tb-cheat");
  if(cheatChip)cheatChip.style.display=S.cheat?"":"none";
}

function weeklyIncomeBreakdown(){
  const hqCount=Object.keys(S.hq).length;
  const incMult=1+modSum("incomeMult");
  const hqIncome=hqCount*COSTS.hqIncome*incMult;
  const stipend=COSTS.stipend;
  return{stipend:stipend,hqIncome:hqIncome,income:Math.round(stipend+hqIncome),hqCount:hqCount,incMult:incMult};
}
function openFundsModal(){
  if(!S||S.phase!=="campaign")return;
  const bd=weeklyIncomeBreakdown();
  const next=bd.income;
  const hist=[...(S.cashHist||[])].reverse();
  const rows=hist.map(h=>'<div class="db-row"><b>W'+h.week+'</b><span>'+fmtMoney(h.cash)+'</span><span class="db-choice">'+(h.income>=0?"+"+fmtMoney(h.income)+" income":"—")+'</span></div>').join("");
  openModal(
    '<div class="ev-head good"><span>CAMPAIGN FINANCES</span></div>'
    +'<div class="dbg-status">Current funds: <b>'+fmtMoney(S.cash)+'</b></div>'
    +'<div class="dbg-status">Expected next week: <b>+'+fmtMoney(next)+'</b><span style="display:block;color:#555;font-size:.74rem;margin-top:2px">state subsidy '+fmtMoney(bd.stipend)+' · '
    +(bd.hqCount>0?bd.hqCount+" HQ × "+fmtMoney(Math.round(COSTS.hqIncome*bd.incMult))+"/week":"no campaign HQs yet")+'</span></div>'
    +'<h3>Weekly cash history</h3>'
    +(rows.length?'<div class="db-list">'+rows+'</div>':'<p>No income recorded yet — end your first week to start the ledger.</p>')
    +'<p class="dc-note">Income arrives every week: a fixed state subsidy plus <b>'+fmtMoney(COSTS.hqIncome)+' лв</b> per Campaign HQ. Money goes to ads, HQs, party staff and campaign launches — budget for the whole race, not just the week.</p>'
    +'<div class="center-row"><button class="btn primary" id="btn-close-funds">Close</button></div>'
  );
  const cb=$("btn-close-funds");
  if(cb)cb.onclick=closeModal;
}

let inspectorTab="district";

function renderDistrictCard(){
  const pmIds=["pm-issue","pm-stance","pm-target","pm-name"];
  const prevPm={};
  for(const id of pmIds){const el=document.getElementById(id);if(el)prevPm[id]=el.value;}
  const tabs='<div class="insp-tabs">'
    +'<button class="insp-tab'+(inspectorTab==="district"?" active":"")+'" data-tab="district">District</button>'
    +'<button class="insp-tab'+(inspectorTab==="national"?" active":"")+'" data-tab="national">National Polls</button>'
    +'<button class="insp-tab'+(inspectorTab==="party"?" active":"")+'" data-tab="party">Party Machine</button>'
    +'</div>';
  $("district-card").innerHTML='<div class="side-block">'+tabs
    +(inspectorTab==="national"?renderNationalPolls():inspectorTab==="party"?renderPartyMachine():renderDistrictDetail())
    +'</div>';
  for(const id in prevPm){const el=document.getElementById(id);if(el&&el.value!==prevPm[id])el.value=prevPm[id];}
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
  $("district-card").querySelectorAll("[data-pm]").forEach(b=>{
    b.onclick=()=>{
      const pm=b.dataset.pm;
      if(pm==="hq")upgradePartyHQ();
      else if(pm==="hire")hireStaff();
      else if(pm==="train")trainStaff(b.dataset.sid);
      else if(pm==="alloc")allocateStaff(b.dataset.cid,parseInt(b.dataset.n,10));
      else if(pm==="launch")launchCampaign({issue:$("pm-issue").value,stance:$("pm-stance").value,target:$("pm-target").value,name:$("pm-name").value});
      updateAll();
    };
  });
  $("district-card").querySelectorAll(".insp-tab").forEach(b=>{
    b.onclick=()=>setInspectorTab(b.dataset.tab);
  });
  $("district-card").querySelectorAll("[data-act]").forEach(b=>{
    wirePreviewTarget(b,()=>previewForButton(b));
  });
}

function setInspectorTab(t){
  inspectorTab=t;
  if(t!=="district"&&S.selDistrict){S.selDistrict=null;redrawMap();}
  renderDistrictCard();
  renderMobileActions();
}

/* ---- T40: mobile-only UI — hoisted HUD strip + top action cluster ---- */
function isMobileUI(){
  return !!(typeof window!=="undefined"&&window.matchMedia&&window.matchMedia("(max-width:899px)").matches);
}

function renderMobileActions(){
  if(typeof document==="undefined")return;
  if(isMobileUI())tipHide();
  const c=document.getElementById("mobile-actions");
  const nb=document.getElementById("news-bar");
  if(nb)nb.style.display=(isMobileUI()&&S&&S.phase==="campaign")?"flex":"none";
  if(!c||!isMobileUI())return;
  if(!S||S.phase!=="campaign"){
    c.style.display="none";
    c.innerHTML="";
    return;
  }
  seedMobileNews();
  const d=S.selDistrict?DIST_BY_ID[S.selDistrict]:null;
  if(!d){
    c.style.display="block";
    c.innerHTML='<div class="dc-note" style="margin:0">Tap a district on the map to take action.</div>';
    return;
  }
  const here=S.location===d.id;
  const ral=activeIssueList();
  let html='<div class="mb-acts">';
  if(here){
    html+='<button class="btn wide" id="btn-mb-rally" '+(S.paused?"disabled":"")+'>Rally <span class="cost">'+COSTS.rallySP+' SP</span> ▾</button>';
    html+='<button class="btn wide" data-act="ad" '+((S.cash<COSTS.ad||S.paused)?"disabled":"")+'>Local media ads <span class="cost">'+fmtMoney(COSTS.ad)+'</span></button>';
    if(S.hq[d.id])html+='<button class="btn wide" disabled>Campaign HQ operational</button>';
    else html+='<button class="btn wide" data-act="hq" '+((S.cash<COSTS.hq||Object.keys(S.hq).length>=COSTS.hqMax||S.paused)?"disabled":"")+'>Build Campaign HQ <span class="cost">'+fmtMoney(COSTS.hq)+'</span></button>';
    html+='<div id="mb-rally-pop" role="dialog" aria-modal="true" aria-hidden="true" aria-label="Choose a rally issue"><div class="mb-rally-panel"><div class="mb-rally-title">Choose a rally issue</div>'+ral.map(i=>'<button class="btn wide" data-act="rally" data-issue="'+i.id+'" '+((S.stamina<COSTS.rallySP||S.paused)?"disabled":"")+' title="Hold a rally focused on '+i.name+'">'+esc(i.name)+' <span class="cost">'+COSTS.rallySP+' SP</span></button>').join("")+'</div></div>';
  }else{
    const tc=travelCost(S.location,d.id);
    html+='<button class="btn wide" data-act="travel" '+((S.stamina<tc||S.paused)?"disabled":"")+'>Travel here <span class="cost">'+tc+' SP</span></button>';
  }
  html+='</div>';
  c.style.display="flex";
  c.innerHTML=html;
  c.querySelectorAll("[data-act]").forEach(b=>{
    b.onclick=()=>{
      const act=b.dataset.act;
      const dd=DIST_BY_ID[S.selDistrict];
      if(act==="travel")travelTo(dd.id);
      else if(act==="rally"){
        doRally(b.dataset.issue);
        setMobileRallyOpen(false);
      }
      else if(act==="ad")buyAd();
      else if(act==="hq")buildHQ();
    };
  });
  c.querySelectorAll("[data-act]").forEach(b=>wirePreviewTarget(b,()=>previewForButton(b)));
  const rt=document.getElementById("btn-mb-rally");
  if(rt)rt.onclick=()=>{
    if(S.paused)return;
    const o=document.getElementById("mb-rally-pop");
    if(!o)return;
    setMobileRallyOpen(!o.classList.contains("show"));
  };
}

function setMobileRallyOpen(open){
  const o=document.getElementById("mb-rally-pop");
  if(!o)return;
  o.classList.toggle("show",!!open);
  o.setAttribute("aria-hidden",open?"false":"true");
  const rt=document.getElementById("btn-mb-rally");
  if(rt)rt.innerHTML='Rally <span class="cost">'+COSTS.rallySP+' SP</span> '+(open?"▴":"▾");
}

/* ---- T41: mobile rally popup + news panel ---- */
let newsSeeded=false;
function pushNews(html){
  if(typeof document==="undefined")return;
  const list=document.getElementById("news-list");
  if(!list)return;
  const line=document.createElement("div");
  line.className="news-line";
  line.innerHTML=html;
  list.appendChild(line);
  while(list.children.length>12)list.removeChild(list.firstChild);
  list.scrollTop=list.scrollHeight;
}
function seedMobileNews(){
  if(typeof document==="undefined"||newsSeeded||!S)return;
  newsSeeded=true;
  const days=Math.max(0,(21-S.week))*7;
  pushNews('<b>Election Commission</b> — election day '+(S.week>20?"is here":("in "+days+" days"))+'. '+esc(S.party.abbr)+' is polling at <b>'+pct(S.pollNat.player||0)+'</b> nationally.');
  pushNews('<b>Campaign HQ</b> — '+esc(S.player.name)+' opens this week\'s push, funds at <b>'+fmtMoney(S.cash)+'</b>.');
}
function bindRallyPopOutsideClose(){
  if(typeof document==="undefined")return;
  document.addEventListener("pointerdown",e=>{
    if(!isMobileUI())return;
    const pop=document.getElementById("mb-rally-pop");
    if(!pop||!pop.classList.contains("show"))return;
    const rt=document.getElementById("btn-mb-rally");
    if(rt&&rt.contains(e.target))return;
    const panel=pop.querySelector(".mb-rally-panel");
    if(panel&&panel.contains(e.target))return;
    setMobileRallyOpen(false);
  });
}

function applyMobileLayout(){
  try{
    const mq=window.matchMedia("(max-width:899px)");
    const sync=()=>{
      const mobile=!!mq.matches;
      const hud=document.getElementById("hud-stats");
      const topbar=document.getElementById("topbar");
      const center=topbar?topbar.querySelector(".tb-center"):null;
      if(!hud||!topbar)return;
      if(mobile){
        const host=topbar.parentElement;
        if(host&&hud.parentElement!==host){
          const anchor=host.querySelector("#mobile-actions")||topbar.nextSibling;
          host.insertBefore(hud,anchor);
        }
        if(host&&center&&center.parentElement!==host){
          host.insertBefore(center,host.querySelector("#game-main")||null);
        }
      }else{
        const mapBody=document.querySelector("#map-panel .map-body");
        const toolbar=document.getElementById("map-toolbar");
        if(mapBody&&toolbar&&hud.parentElement!==mapBody){
          toolbar.after(hud);
        }
        const tbRight=topbar.querySelector(".tb-right");
        if(tbRight&&center&&center.parentElement!==topbar){
          topbar.insertBefore(center,tbRight);
        }
      }
      renderMobileActions();
    };
    sync();
    if(mq.addEventListener)mq.addEventListener("change",sync);
    else if(mq.addListener)mq.addListener(sync);
  }catch(e){}
}

function renderPartyMachine(){
  const pm=S.partyMachine;
  const maxE=partyEnergyMax();
  const cap=partyStaffCap();
  const upCost=partyHqUpgradeCost();
  const upkeep=partyUpkeep();
  let out='<div class="pm-head">'
    +'<div class="mini-label"><span>Party HQ — level '+pm.hqLevel+'/'+PARTY_HQ_MAX+'</span>'
    +(upCost?'<button class="btn sm" data-pm="hq" '+((S.cash<upCost||S.paused)?"disabled":"")+'>Upgrade '+fmtMoney(upCost)+'</button>':'<span class="chip green">MAX LEVEL</span>')+'</div>'
    +'<div class="mini-label" style="margin-top:6px"><span>Staff energy</span><span>'+pm.energy+'/'+maxE+' this week</span></div>'
    +'<div class="bar"><div class="fill" style="width:'+(maxE>0?pm.energy/maxE*100:0)+'%;background:var(--acc)"></div></div>'
    +(upkeep>0?'<div class="dc-note">Staff upkeep: '+fmtMoney(upkeep)+'/week.</div>':'')
    +'</div>';
  out+='<div class="pm-sec"><div class="mini-label"><span>Staff '+pm.staff.length+'/'+cap+'</span>'
    +(pm.staff.length<cap?'<button class="btn sm" data-pm="hire" '+((S.cash<partyHireCost()||S.paused)?"disabled":"")+'>Hire '+fmtMoney(partyHireCost())+'</button>':'')+'</div>';
  if(!pm.staff.length)out+='<div class="dc-note">No staff yet. Hire organizers to staff campaigns — the machine runs on people.</div>';
  else{
    for(const s of pm.staff){
      out+='<div class="pm-staff"><div><b>'+esc(s.name)+'</b><span>'+s.role+' · level '+s.level+' · '+fmtMoney(COSTS.upkeepBase+(s.level-1)*COSTS.upkeepPerLvl)+'/wk</span></div>'
        +(s.level<3?'<button class="btn sm" data-pm="train" data-sid="'+s.id+'" '+((S.cash<partyTrainCost(s)||S.paused)?"disabled":"")+'>Train '+fmtMoney(partyTrainCost(s))+'</button>':'<span class="chip green">MAXED</span>')+'</div>';
    }
  }
  out+='</div>';
  const issues=activeIssueList();
  const issOpts=issues.map(i=>'<option value="'+i.id+'">'+i.name+'</option>').join("");
  const distOpts='<option value="national">National ('+fmtMoney(COSTS.campaignNational)+')</option>'
    +DISTRICTS.slice().sort((a,b)=>a.name.localeCompare(b.name)).map(d=>'<option value="'+d.id+'">'+d.name+' ('+fmtMoney(COSTS.campaignDistrict)+')</option>').join("");
  out+='<div class="pm-sec"><div class="mini-label"><span>New campaign</span></div>'
    +'<div class="pm-form">'
    +'<select id="pm-issue">'+issOpts+'</select>'
    +'<select id="pm-stance"><option value="pro">PRO — toward the high stance</option><option value="anti">ANTI — toward the low stance</option></select>'
    +'<select id="pm-target">'+distOpts+'</select>'
    +'<input id="pm-name" type="text" maxlength="28" placeholder="Campaign name (optional)">'
    +'<button class="btn wide" data-pm="launch" '+((S.cash<COSTS.campaignDistrict||S.paused||pm.campaigns.length>=CAMPAIGN_CAP)?"disabled":"")+'>Launch campaign</button>'
    +'</div></div>';
  if(pm.campaigns.length){
    out+='<div class="pm-sec"><div class="mini-label"><span>Active campaigns</span></div>';
    for(const c of pm.campaigns){
      const iss=ISSUE_BY_ID[c.issue];
      const cur=c.alloc[c.phase]||0;
      out+='<div class="pm-camp">'
        +'<div class="pm-camp-top"><b>'+esc(c.name)+'</b><span>'+stanceLabel(c.stance,iss)+' · '+(c.target==="national"?"National":DIST_BY_ID[c.target].name)+'</span></div>'
        +'<div class="pm-phases">'+PHASE_NAMES.map((pn,i)=>'<span class="pm-phase'+(i<c.phase?" done":(i===c.phase?" cur":""))+'">'+pn+(i===c.phase?" — "+cur+" staff":'')+'</span>').join("")+'</div>';
      if(c.phase<3&&!S.paused){
        out+='<div class="pm-alloc"><span>Staff this phase:</span>'
          +[0,1,2,3].map(n=>'<button class="btn sm'+(n===cur?" sel":"")+'" data-pm="alloc" data-cid="'+c.id+'" data-n="'+n+'" '+((n>Math.min(3,pm.staff.length,pm.energy)||S.paused)?"disabled":"")+'>'+n+'</button>').join("")
          +'</div>';
      }
      out+='</div>';
    }
    out+='</div>';
  }
  if(pm.history.length){
    out+='<div class="pm-sec"><div class="mini-label"><span>Released</span></div>';
    for(const h of pm.history){
      out+='<div class="pm-hist"><div><b>'+esc(h.name)+'</b><span>week '+h.week+' · '+stanceLabel(h.stance,ISSUE_BY_ID[h.issue])+' · '+(h.target==="national"?"national":DIST_BY_ID[h.target].name)+' · '+h.staffWeeks+' staff-weeks</span></div>'
        +'<div class="pm-hist-result">'+((h.swing>=0?"+":"")+h.swing.toFixed(1)+" pts")+' · revenue +'+fmtMoney(h.rev)+'</div></div>';
    }
    out+='</div>';
  }
  out+='<div class="dc-note">Campaigns run Planning → Execution → Release, one phase per week; staff energy refills weekly. More staff-weeks → stronger release, and revenue funds the next campaign. Your platform stance matching the campaign direction boosts its effect.</div>';
  return out;
}

function actionButtonsHtml(d,here){
  let actions="";
  if(!here){
    const c=travelCost(S.location,d.id);
    actions+='<button class="btn wide" data-act="travel" '+((S.stamina<c||S.paused)?"disabled":"")+'>Travel here <span class="cost">'+c+' SP</span></button>';
  }else{
    for(const i of activeIssueList()){
      actions+='<button class="btn wide" data-act="rally" data-issue="'+i.id+'" '+((S.stamina<COSTS.rallySP||S.paused)?"disabled":"")+' title="Hold a rally focused on '+i.name+'">Rally: '+i.name+' <span class="cost">'+COSTS.rallySP+' SP</span></button>';
    }
    actions+='<button class="btn wide" data-act="ad" '+((S.cash<COSTS.ad||S.paused)?"disabled":"")+'>Local media ads <span class="cost">'+fmtMoney(COSTS.ad)+'</span></button>';
    if(S.hq[d.id])actions+='<button class="btn wide" disabled>Campaign HQ operational</button>';
    else actions+='<button class="btn wide" data-act="hq" '+((S.cash<COSTS.hq||Object.keys(S.hq).length>=COSTS.hqMax||S.paused)?"disabled":"")+'>Build Campaign HQ <span class="cost">'+fmtMoney(COSTS.hq)+'</span></button>';
  }
  return actions;
}

function renderDistrictDetail(){
  const d=S.selDistrict?DIST_BY_ID[S.selDistrict]:null;
  if(!d)return '<div class="dc-empty">Click a district on the map to inspect it.</div>';  const here=S.location===d.id;
  const sh=S.districtPoll[d.id]||districtShares(d,true);
  const rows=Object.keys(sh).filter(k=>k!=="others").map(k=>({k:k,v:sh[k]})).sort((a,b)=>b.v-a.v);
  const ent=S.enthusiasm[d.id]!==undefined?S.enthusiasm[d.id]:d.ent;
  const entDisp=clamp(Math.round((ent-0.5)/0.9*100),0,100);
  let issues="";
  const aw=activeWeights(d);
  for(const iid in aw){
    const i=aw[iid];
    issues+='<div class="issue-row"><div class="mini-label"><span>'+i.name+'</span><span>weight '+Math.round(i.w*100)+'%</span></div>'
      +'<div class="issue-track"><div class="issue-weight" style="width:'+(i.w*100)+'%"></div>'
      +'<div class="issue-dot ideal" style="left:'+(i.ideal*100)+'%" title="District stance"></div>'
      +'<div class="issue-dot you" style="left:'+((S.party.pos[iid]||0)*100)+'%" title="Your stance"></div></div></div>';
  }
  const polls=rows.map(r=>{
    const p=partyOf(r.k);
    return '<div class="poll-row '+(r.k==="player"?"you":"")+'"><span class="pdot" style="background:'+p.color+'"></span><span class="pname">'+esc(p.abbr)+'</span><span class="pval">'+pct(r.v)+'</span></div>';
  }).join("");
  const eth=d.eth||{};
  let ethLine="";
  if(eth.turkish||eth.roma){
    const parts=[];
    if(eth.turkish>0.005)parts.push("Turkish "+(eth.turkish*100).toFixed(0)+"%");
    if(eth.roma>0.005)parts.push("Roma "+(eth.roma*100).toFixed(0)+"%");
    if(parts.length)ethLine='<div class="dc-note" style="margin-top:6px">Ethnicity: '+parts.join(" · ")+'</div>';
  }
  ethLine+=performanceInspectorLine();
  const g3=d.geo||{};
  const GEO_LABELS=[["proEU","Pro-EU"],["proRussia","Pro-Russia"],["proNATO","Pro-NATO"],["proUS","Pro-US"],["nationalism","Nationalism"],["turkishMinority","Turkish"],["urbanization","Urban"]];
  const geoTop=GEO_LABELS.map(([k,l])=>({k,l,v:g3[k]||0})).sort((a,b)=>b.v-a.v).slice(0,3);
  const geoLine=geoTop.length
    ?'<div class="dc-geo">'+geoTop.map(gg=>'<div class="geo-chip" title="'+esc(gg.l)+'"><span>'+esc(gg.l)+'</span><div class="bar"><div class="fill" style="width:'+(gg.v*100)+'%"></div></div><em>'+Math.round(gg.v*100)+'%</em></div>').join("")+'</div>'
    :"";
  let actions=actionButtonsHtml(d,here);
  return '<div class="dc-head"><div><b>'+esc(d.name)+'</b><div class="dc-bg">'+esc(d.bg)+'</div></div><span class="seat-chip">'+d.seats+' seats</span></div>'
    +'<div class="dc-enthusiasm"><div class="mini-label"><span>Voter enthusiasm</span><span>'+entDisp+'%</span></div>'
    +'<div class="bar"><div class="fill" style="width:'+entDisp+'%;background:var(--acc)"></div></div></div>'
    +issues
    +geoLine
    +'<div class="mini-label" style="margin-top:8px"><span>Poll · your share: <b style="color:var(--gold)">'+pct(sh.player||0)+'</b></span></div>'
    +polls
    +ethLine
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
  renderMobileActions();
  renderMods();
  renderLog();
}

function selectDistrict(id){
  S.selDistrict=id;
  inspectorTab="district";
  renderDistrictCard();
  redrawMap();
  renderMobileActions();
  closeDrawer();
}

/* ---- T17: mobile drawer + collapsible log + map pinch-zoom ---- */
function toggleDrawer(){
  const p=$("side-panel");
  const open=!p.classList.contains("open");
  p.classList.toggle("open",open);
  const b=$("drawer-backdrop");
  if(b)b.classList.toggle("show",open);
  const t=$("btn-panel-toggle");
  if(t)t.textContent=open?"Inspector ✕":"Inspector ▸";
}
function closeDrawer(){
  const p=$("side-panel");
  if(p)p.classList.remove("open");
  const b=$("drawer-backdrop");
  if(b)b.classList.remove("show");
  const t=$("btn-panel-toggle");
  if(t)t.textContent="Inspector ▸";
}
let mapZoom=null;
function mapZoomInit(){
  const c=$("map-canvas"),svg=$("bg-map");
  if(!c||!svg||mapZoom)return;
  const z=mapZoom={scale:1,tx:0,ty:0,ptrs:new Map(),mode:null,pinchD:0};
  const apply=()=>{
    svg.style.transform="translate("+z.tx+"px,"+z.ty+"px) scale("+z.scale+")";
    c.classList.toggle("zoomed-out",z.scale<0.95);
  };
  const clampAll=()=>{
    z.scale=clamp(z.scale,0.6,4);
    const r=c.getBoundingClientRect();
    const mw=r.width*z.scale,mh=r.height*z.scale;
    z.tx=clamp(z.tx,Math.min(0,r.width-mw),Math.max(0,r.width-mw));
    z.ty=clamp(z.ty,Math.min(0,r.height-mh),Math.max(0,r.height-mh));
  };
  z.setView=(tx,ty,scale)=>{z.tx=tx;z.ty=ty;z.scale=scale;clampAll();apply();};
  z.reset=()=>{z.scale=1;z.tx=0;z.ty=0;apply();};
  const pinchDist=()=>{
    const pts=[...z.ptrs.values()];
    return Math.hypot(pts[0].x-pts[1].x,pts[0].y-pts[1].y);
  };
  const zoomAt=(cx,cy,factor)=>{
    const ns=clamp(z.scale*factor,0.6,4);
    z.tx=cx-(cx-z.tx)*(ns/z.scale);
    z.ty=cy-(cy-z.ty)*(ns/z.scale);
    z.scale=ns;
    clampAll();apply();
  };
  const startPan=(pid,cx,cy)=>{
    z.mode="pan";z.moved=true;
    z.startX=cx;z.startY=cy;
    z.panStart={tx:z.tx,ty:z.ty};
    c.setPointerCapture&&c.setPointerCapture(pid);
  };
  if(typeof window!=="undefined"&&typeof window.PointerEvent!=="undefined"){
    c.addEventListener("pointerdown",e=>{
      z.ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});
      if(z.ptrs.size===1){
        z.mode="maybe";z.moved=false;
        z.startX=e.clientX;z.startY=e.clientY;
        z.panStart={tx:z.tx,ty:z.ty};
      }else if(z.ptrs.size===2){
        z.mode="pinch";z.moved=true;z.pinchD=pinchDist();
        c.setPointerCapture&&c.setPointerCapture(e.pointerId);
      }
    });
    c.addEventListener("pointermove",e=>{
      const p=z.ptrs.get(e.pointerId);
      if(!p)return;
      if(z.mode==="maybe"&&Math.hypot(e.clientX-z.startX,e.clientY-z.startY)>6)startPan(e.pointerId,p.x,p.y);
      if(z.mode==="pan"&&z.ptrs.size===1){
        z.tx=z.panStart.tx+(e.clientX-z.startX);
        z.ty=z.panStart.ty+(e.clientY-z.startY);
        clampAll();apply();
      }else if(z.mode==="pinch"&&z.ptrs.size===2){
        z.ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});
        const d=pinchDist();
        if(z.pinchD>0){
          const r=c.getBoundingClientRect();
          const pts=[...z.ptrs.values()];
          zoomAt((pts[0].x+pts[1].x)/2-r.left,(pts[0].y+pts[1].y)/2-r.top,d/z.pinchD);
        }
        z.pinchD=d;
      }
      p.x=e.clientX;p.y=e.clientY;
    });
    const up=e=>{
      const had=z.ptrs.size;
      z.ptrs.delete(e.pointerId);
      if(z.ptrs.size===0){z.mode=null;}
      else if(had===2&&z.ptrs.size===1){
        const left=[...z.ptrs.values()][0];
        z.mode="pan";z.moved=true;
        z.startX=left.x;z.startY=left.y;
        z.panStart={tx:z.tx,ty:z.ty};
      }
    };
    c.addEventListener("pointerup",up);
    c.addEventListener("pointercancel",up);
  }
  c.addEventListener("wheel",e=>{
    e.preventDefault&&e.preventDefault();
    const r=c.getBoundingClientRect();
    zoomAt(e.clientX-r.left,e.clientY-r.top,Math.exp(-(e.deltaY||0)*0.0015));
  },{passive:false});
  c.addEventListener("dblclick",()=>{z.scale=1;z.tx=0;z.ty=0;apply();});
}

/* ---- T37: the alive map — floating voices from the provinces ---- */
const VOICES_BULGARISM=[
  // clean classics
  "Sega li me tursish kato me niama?",
  "Ako iskash mir, gotvi banica.",
  "Chestito! Ot ponedelnik si shef.",
  "Nai-bogat chovek e tozi, deto ima rakiya i vreme.",
  "Az kato glasuvam, i komshiata znae, che shte ima turbulencii.",
  "V Bulgaria vremeto e dva sezona: zima i remont.",
  "Shtom baba kazva, che shte e taka, shte e taka.",
  "Ivan ot selo, ama dumite mu sa ot grad.",
  "Pansionat, geran, ulica — tri oborota i pak sme tuk.",
  "Edin chern peperud odi s... ne, tova e drug film.",
  "Koito ne raboti, ne harchi. Koito harchi, ne si plati danatsite.",
  "Rano stanah, ama rano ne e vse edno.",
  "Vsiakoi gleda svoyata merja, ami nasheto selo e bez mreja.",
  "Da e zhiv i zdrav! Ostanalite sa za sled izborite.",
  "Shte gi vidim nai-nakraia, kato izlze novoto vladenie.",
  "Stara rakiya, mlada cheshma — tova e demokraciyata.",
  "Momcheto ot sasedno selo kazva, che shte ni izdruzhba.",
  "Samo lishie, kato baia mi hodi v bankata — nikoi ne pita za ID.",
  "Kazvaha, che shte ima i ovishto sireno. Ima, ami ot kutia.",
  "Po-dobre e da badem zaedno, otkolkoto da badem vsyaka se ot nas.",
  "Tez malki rabotni zaplatni listove ne se hranyat s chestitki.",
  "Naroda izbira, ami govori gosudarstvenata maika.",
  "Vseki zhelae da stane deputat, dori baba mi, a tya e za otpuskane.",
  "E, izbori, izbori — kato shtia shte te tursia.",
  "Ostavete nasheto oborche, ne e za politika.",
  "Neka da glasuvame s nadezhda, che niama da izgorim pak.",
  "V zemja na rakiya i med, niama nuzhda ot izvinenie.",
  "Poleka, poleka — posledniat kray e na nai-otkachenia.",
  "Malkata gradinka e otlivo ot nasheto selo.",
  "Ako vsichki peiat, znam che niama da ima dostatachno horца.",
  "Glasuvah, che da ne go boli glavata na gospozha.",
  "Otvori si ochite, chovek, vsichki politici sa edni i sushti.",
  "Rekoha mi, che glasut e tain. Sled tova go prodadoha tri puti.",
  "Zemia ni hrani, ama izborite i gladi.",
  "Vsiakoi iska da e ministar, ami i vodata she vi izchete.",
  "S milichka ot starata pesen: 'Iskam te, Bulgaria!' — po-fino shte bade s plovdivski rakii.",
  "I po-pazarnite dni sme gi izdruzhbali — izborite sa po-lesni.",
  "Kato kazvat 'reformi', az chakam da vidia chernia kliszar.",
  "Nai-vazhnoto e zdrave, ami i parite sa zdravni.",
  "Starata pesen za bialata rakiya pak e na moda.",
  "Ako te kani na obed, che te kani na izbori.",
  "Nyakoi hora imat ot mnogo: nashite niamat nishto, a imat nadezhda.",
  "S tezi razhodi i kalata, i pokrivite sa pod otkrito nebo.",
  "Chovek s chestiti rезултати e kato petel: edno kukuryagane, ama pak peе.",
  "Starite lyubovni pesni za selo i za izbori — po edno i sushto.",
  "Samo da ne zapochne pak 'shto ne si rabotil...'",
  "Vsichko e ot baba mi: 'Bez kusmet niama politika.'",
  "Novite izbori sa kato starite obuvki: shte gi nosish do sledvashtite.",
  "Ami dosta! Shte izpraznim shaшkata s horata i shte smenim vsichko.",
  "V selo se znae vsichko, no nikoiko ne glasuva za sebia.",
  "Po-lib si e dazhd v gradinata, otkolkoto obešchanie v parlamente.",
  "Sred sezona i izbora: ludi hora v dve zali.",
  "S truda si zabravih kartata za glasuvane — a taka i chakah izborite.",
  "Chakam da izleze novata vlada, che pazara trima.",
  "Samo edin vopros: koga shte ni obirish, pone tazi godina po-vkusi?",
  "Malka Bulgaria e, ami ima mesta za mnogo izvinenia.",
  "I v dobra i v losha zemia, nashata opravka e edna.",
  "Na selo i na izbori se poznava chovekot.",
  "Koiто sedi doma, ne misli. Koito misli, glasuva.",
  "Razdelna ot nasheto — vsichki сме edni i sushti.",
  "Vremeto leti, ami izborite пълзят.",
  // diaspora
  "Rodninite ot Germanija kazvat: 'Po-dobre tam, otkolkoto pak tuk.'",
  "V Chicago mi pisat, che tuk niama kafe. A nie tuk niamame i izbori.",
  "Emigrirah mentalno. Tяaloto e tuk.",
  "London chaka: shtom izborite svыршат, pak na gurbet.",
  // the classics
  "Shte si kupya mercedes, da me vidyat horata kakav sam stanal.",
  "S izbori ili bez, baba Penka pak ще пее.",
  "Da ne si izdal gelati na praznik — shte go otkupiat depatutite.",
  "Kazah na zhena si: 'Glasuvah za promяna.' Tя: 'Shte vidim sled godina.'",
  "Soseto v seloto kazva: 'Pazete si parite, za izbori se davat.'",
  "Nyakoga v Bulgaria izborite prodluzhavaha s nedelite — sega samo s debatite.",
  "Ivan v selo kaza, che shte stane kandidat. Seloto si zamălcha.",
  "Ako ne znaesh koi si, izborite shte ti kazhat: 'Na kogo si.'",
  "Shto e izbira, izbira i se izbira. Sled tova vsichko se izmazva.",
  "S glasovete, kato s dumite: poveche ot edin път ne se izkаzva.",
  "Baba mi: 'Ne glasuvai za tozi, deto e kato otzad nяkolko godini.'",
  "I smeh i salzi — izbori v Bulgaria.",
  "Starite praznici, mladite izbori — vsichko e ot edna i sashta karita.",
  "Vsichko shte бъде dobre, kazaha ot tribunata. Sled tova iztriха razglasiте.",
  "Nashaта ulitsa glasuva za nadezhda. Ami i nashата ulitsa glasuva za vseki.",
  "Uchitelkata ni kaza: 'Izborite sa vaжен ден.' Tя i sega si go спомня.",
  "Izgoria, izgoria — ama pak ще се оправим.",
  "Поне тия praznici shte ni e sram ot rakiяta... ne, sram ni e ot izborite.",
  // spicy (the boss demanded some bite)
  "Da im eba maikata na tiq komunisti, che pak si misliat, che sme v 1989!",
  "Eba li gi tezi GERB-ski — 30 godini gi davat, ami pак ни търсят glasa.",
  "Da im ebam izborite, deto ni aposa vsyaka se!",
  "Ebah gi s ushi tezi s reklamite po tiah naliva!",
  "Da se bierat po zala, ne po parite ni!",
  "Samo da ne izleze pak тия s avtobusiте i cheshmata!",
  "Ebem ti demokraciata, deto prodava ghiulia i chestitki!",
  "Mайka им, deto ni razdeliha na chasti като banica!",
  "S tezi izbori i s tezi na дядо ми — vsichko e edna голяма oргия!",
  "Eba li gi тия, deto ni obishtat zlato, a дават lutichki!",
  "Koito ni izбра и koito ни продаде — всички са от една глътка!",
  "Da ne bia togava, che ni izbraha така, че i gledat po cherni obuвki!",
  "Kato praznici - shtom izborite, che i chestitkite pak sa zameneni s obeshchaniya.",
  "Nyakoi kazvat, che politikata e shah. U nas e dame, i vsichki syat po samoto.",
  "Ako politikata e kato vremeto, nashata e samo prognoza za shturm.",
  "Shto da ti kazha - izbrah si, che da si po-star. Glavno da ne e pak same.",
  "Zheleznata logika na selo: koito obeshchava nai-mnogo, se nai-malko e smeel.",
  "Pone da ni izberat, che da ne hodi vsjaka nedelia po avtobusa.",
  "I sega - da vidim kakvo shte kazhe baba mi za novite obeshchaniya.",
  "Dobre, che sme edini v sveta, deto se smeem na izbori ot rakiya."
];

const VOICES_POLL={
  win:[
    "We're at {N}% here in {D} and the {P} flag sellers can't keep up!",
    "At {N}% in {D}, even the village cats vote {P} now.",
    "My father voted GERB for twenty years. Yesterday he hung a {P} flag.",
    "If {D} keeps this up, I'm naming my first born {P}.",
    "{D} is {N}% {P} — the pensioners switched, and they don't switch back.",
    "The canvassers in {D} are drinking all the mekitsi in the oblast.",
    "Week {W} — {D} has already picked out the {P} ribbons for the lamp posts.",
    "I told the neighbour: '{P} or nobody'. He said 'nobody then'. Neighbour's gone now.",
    "Sofia's analysts say {N}% nationally — down here we're ahead of the rumour mill.",
    "In {D} they call it the {P} spring. The municipality calls it a petition.",
    "{P} at {N}% in {D} — the mayor's started greeting me first.",
    "My wife said she'd vote {P} if the rallies keep giving out banitsa.",
    "Baba across the street: 'Glasuvam za {P}, che drugite sa za chuzhdite.'",
    "The kebab shop in {D} changed its name to 'Pepeto za {P}'."
  ],
  close:[
    "Thirty-one to thirty in {D}! My heart's in my throat, kum.",
    "It's 33–32 here. If you blink, {R} takes {D}.",
    "Close one in {D} — the babi are betting rakia on it.",
    "{N} to {V} in {D} and both campaigns are buying the same coffees.",
    "The barber in {D} shaves with the polls: a centimetre to {P}, a centimetre back.",
    "In {D} every vote counts twice — once in the booth, once in the recount.",
    "Nationally {NAT}%, in {D} a knife's edge. Campaigns live or die here.",
    "My neighbour says {P}, his brother says {R}. The gate's the border.",
    "{D} has never been this divided since the village council banned the fountains.",
    "Week {W}, {D} tied — the baba council has called an emergency sitting.",
    "Two points, {D}. I'll tell you after the elections who my son voted for.",
    "A close race in {D} and the TV pundits have already moved to Sofia."
  ],
  lose:[
    "In {D} we're at {N}% and {R} at {V}% — did your canvassers even come?",
    "Week {W} and {D} still leans {R}. I'm starting to doubt you, chicho.",
    "My uncle promised to vote {P}. Then {R}'s bus came by. The bus had free cheese.",
    "At {N}% in {D}, you couldn't fill a school bus with {P} supporters.",
    "The babi in {D} like you, but they like their pensions more. {R} knows.",
    "{D} is slipping — the coffee shops are all praising {R} now.",
    "I wanted to vote {P}, but the whole village has a {R} calendar on the wall.",
    "We're at {N}% in {D}. The rumour says even your own HQ staff shop in {R} colours.",
    "If {D} goes {R} again, I'm moving my flag collection to the basement.",
    "{D} last week, {D} this week — {R} is winning the photo finish by a nose.",
    "The teacher in {D} asked who's voting {P}. Two hands. One was mine, nervously.",
    "At this rate {D} will be {R} country by the time the snow falls.",
    "I'd help you canvass in {D}, but my pension depends on not being seen.",
    "Village rumour: {P} buys votes with promises. {R} buys them with rakia."
  ],
  rival:{
    gerb:[
      "GERB again in {D}? They treat parliament like a family business.",
      "Po-dobre da glasuvam za fenera, otkolkoto za GERB pak!",
      "The GERB machine in {D} buys coffees, souls, and the bakery's leftover bread.",
      "GERB's flyers here say 'stability'. Everyone knows what that means — the same as always.",
      "Ebah gi тия GERB-ski — 30 godini gi davat, ami pak ni tursyat!",
      "The bus with GERB flags came through {D}. Nobody waved. The bus waved back."
    ],
    bsp:[
      "Da im eba maikata na tiq komunisti, che pak se opravyat!",
      "The reds are strong in {D} — the pensioners still remember 1990 like yesterday.",
      "BSP's poster in {D}: 'We'll bring back the old days.' Which ones — the ration queues?",
      "The communist-era factory in {D} is closed, but the BSP nostalgia is open 24/7.",
      "My grandpa keeps the red flag 'for emergencies'. Election season is an emergency.",
      "{D} votes BSP out of habit — and habit here is a heavyweight."
    ],
    dps:[
      "DPS buy votes by the tray in {D} — my neighbour sold his for a sack of flour.",
      "Peevski's people are already counting votes in {D}. The pencils are sharpened.",
      "The DPS machine in {D} never sleeps. Neither does the counting.",
      "In {D} they say DPS is the only party that delivers — the votes, by van.",
      "DPS's candidate in {D} promised a mosque, a school and a discount on gypsy music. Voted.",
      "The DPS office in {D} has more visitors than the clinic. And they all leave smiling."
    ],
    vaz:[
      "Vazrazhdane in {D}? They promised to ban everything I love, including Mondays.",
      "VRZ posters say 'Bulgaria above all' — mate, I'm Bulgarian and even I'm confused.",
      "The nationalists in {D} sell their T-shirts with a strict 'return to the 1940s' policy.",
      "Vazrazhdane's man in {D} told the pensioners the euro is a cucumber. Half believed him.",
      "My nephew likes VRZ for the memes. The memes are better than the manifesto.",
      "{D} and VRZ — the only flag they raise is the one that comes with a mirror."
    ],
    ppdb:[
      "PP-DB talk about reforms in {D} and the coffee gets cold.",
      "The blue-green intellectuals in {D} can't find the exit from their own debate.",
      "PP-DB's canvasser in {D} explained the platform three times. Then explained it again.",
      "Reformers in {D} promise to fix everything — after the next report, of course.",
      "PP-DB's flyer in {D} has a QR code that leads to another flyer.",
      "In {D} they love PP-DB on Instagram and forget them by election day."
    ],
    itn:[
      "ITN's candidate in {D} is a singer. At least the rallies have bangers.",
      "Slavi's party in {D} promises change and a TV show. The show is better.",
      "ITN in {D} — the only party whose debate strategy is a drum solo.",
      "The ITN van in {D} plays hits from 2004. The voters hum along, then vote elsewhere.",
      "Ima takav narod? V {D} nyama — all our crazy people are already in the other parties.",
      "ITN's slogan in {D}: 'Let's go back to the good years'. Which years, Slavi?"
    ],
    pb:[
      "PB's man in {D} promised a moon base by Tuesday. We're still waiting on the ramp.",
      "Progresivna's rally in {D} had more generals than voters.",
      "Radev's people in {D} speak in slogans — long ones, with footnotes.",
      "PB promises in {D} sound great until you ask how. Then it's a committee.",
      "The PB candidate in {D} shook my hand with both hands. Politely suspicious.",
      "In {D} PB's posters fade fast — the sun and the promises go equally quick."
    ],
    mech:[
      "MECh's man in {D} keeps calling me 'brother' like we're in a heist movie.",
      "The MECh candidate in {D} promised morality and a discount at the gym.",
      "MECh in {D} — new party, old habits, fresh face, same smile.",
      "The MECh van in {D} ran out of fuel. Morale, edinstvo... and diesel.",
      "MECh's slogan in {D}: 'Honesty, unity, honour.' Their printer ran out of toner.",
      "The MECh guy in {D} told me he left ITN because of 'creative differences'."
    ],
    aps:[
      "APS splits DPS in {D} — two flags, same machine, twice the confusion.",
      "The APS office in {D} opened next to the DPS office. Same building, two locks.",
      "In {D} APS means 'the other DPS'. Nobody's sure which one is which anymore.",
      "APS's candidate in {D} promises everything DPS promised — a week later.",
      "The APS flyer in {D} lists 20 names. All of them worked for DPS last year.",
      "Two minority parties, one {D}, zero exit strategy."
    ],
    velichie:[
      "Velichie in {D}: 'Bulgaria above all' — above which part exactly?",
      "VEL's poster in {D} shows a lion. The lion looks embarrassed.",
      "Velichie's candidate in {D} gave a speech. The pigeons left politely.",
      "In {D} VEL promises the old greatness — from the time before we invented the light bulb.",
      "Velichie's man in {D} asked if I read his manifesto. I asked if he read the constitution.",
      "The VEL rally in {D} had a banner, a flag, and one confused shepherd."
    ]
  }
};

function voiceCtx(d){
  const sh=S.districtPoll&&S.districtPoll[d.id]?S.districtPoll[d.id]:districtShares(d,false);
  const rows=[];
  for(const k in sh){if(k==="others")continue;rows.push({k:k,v:sh[k]});}
  rows.sort((a,b)=>b.v-a.v);
  const player=sh.player||0;
  const leader=rows[0];
  const topRival=leader&&leader.k==="player"?rows[1]:leader;
  const nat=S.pollNat&&S.pollNat.player?S.pollNat.player:0;
  return{
    d:d,
    N:Math.round(player*100),
    nat:Math.round(nat*100),
    W:Math.min(S.week,20),
    player:player,
    leader:leader?leader.k:"others",
    leadShare:leader?leader.v:0,
    margin:topRival?Math.abs(player-topRival.v):1
  };
}
function fillVoice(tpl,ctx){
  const p=S.party;
  const r=partyOf(ctx.leader);
  const V=Math.round(ctx.leadShare*100);
  return tpl
    .replace(/\{D\}/g,ctx.d.name)
    .replace(/\{P\}/g,p.abbr)
    .replace(/\{PN\}/g,p.name)
    .replace(/\{R\}/g,r?r.abbr:"the others")
    .replace(/\{RN\}/g,r?r.name:"the others")
    .replace(/\{N\}/g,String(ctx.N))
    .replace(/\{V\}/g,String(V))
    .replace(/\{NAT\}/g,String(ctx.nat))
    .replace(/\{W\}/g,String(ctx.W));
}
function pickPollVoice(d){
  const ctx=voiceCtx(d);
  const isPlayer=ctx.leader==="player";
  if(isPlayer&&ctx.margin>0.04)return{ctx:ctx,tpl:pick(VOICES_POLL.win)};
  if(ctx.margin<=0.04)return{ctx:ctx,tpl:pick(VOICES_POLL.close)};
  const rb=VOICES_POLL.rival[ctx.leader];
  if(rb&&Math.random()<0.5)return{ctx:ctx,tpl:pick(rb)};
  return{ctx:ctx,tpl:pick(VOICES_POLL.lose)};
}
function aliveQuote(d){
  const q=Math.random()<0.5?pick(VOICES_BULGARISM):fillVoice(pickPollVoice(d).tpl,voiceCtx(d));
  return "\u201E"+q+"\u201D";
}

/* ---- alive runtime: dots flash, voices float up ---- */
let aliveTimer=null,aliveCountNow=0;
const ALIVE_MAX=4;
const ALIVE_MIN_WAIT=13000,ALIVE_JITTER_WAIT=4000;
const ALIVE_CHARW=9.5,ALIVE_MAXW=250,ALIVE_MAXLINES=3;
function aliveWrap(text){
  const words=String(text).split(/\s+/).filter(Boolean);
  const lines=[];
  let cur="";
  for(const w of words){
    const probe=cur?cur+" "+w:w;
    if(probe.length*ALIVE_CHARW>ALIVE_MAXW&&cur){lines.push(cur);cur=w;}
    else cur=probe;
  }
  if(cur)lines.push(cur);
  if(lines.length>ALIVE_MAXLINES){
    lines.length=ALIVE_MAXLINES;
    const maxC=Math.floor(ALIVE_MAXW/ALIVE_CHARW);
    lines[ALIVE_MAXLINES-1]=lines[ALIVE_MAXLINES-1].slice(0,maxC-1).trim()+"…";
  }
  return lines;
}
function aliveLayer(){
  const svg=document.getElementById("bg-map");
  if(!svg)return null;
  let l=svg.querySelector("#alive-layer");
  if(!l){
    l=svgEl("g",{id:"alive-layer","pointer-events":"none","class":"alive-layer"});
    svg.appendChild(l);
  }
  return l;
}
function aliveActive(){
  if(typeof document==="undefined"||typeof S==="undefined"||!S)return false;
  if(S.phase!=="campaign"||S.paused)return false;
  if(typeof document.hidden!=="undefined"&&document.hidden)return false;
  const sc=document.getElementById("screen-game");
  if(!sc||!sc.classList||typeof sc.classList.contains!=="function"||!sc.classList.contains("active"))return false;
  return true;
}
function aliveColorFor(d){
  const sh=S.districtPoll&&S.districtPoll[d.id]?S.districtPoll[d.id]:null;
  let best=null,leader="others",lv=-1;
  if(sh){for(const k in sh){if(k==="others")continue;if(sh[k]>lv){lv=sh[k];leader=k;}}}
  if(leader==="player")best=S.party.color;
  else{const p=partyOf(leader);best=p?p.color:null;}
  return best||"#e8b33d";
}
function spawnAliveVoice(){
  if(typeof document==="undefined")return null;
  if(isMobileUI()){
    const d=pick(DISTRICTS);
    pushNews('<b class="news-dot" style="background:'+aliveColorFor(d)+'"></b><b>'+esc(d.short)+'</b> — '+esc(aliveQuote(d)));
    return null;
  }
  if(aliveCountNow>=ALIVE_MAX)return null;
  const layer=aliveLayer();
  if(!layer)return null;
  const d=pick(DISTRICTS);
  const quote=aliveQuote(d);
  const lines=aliveWrap(quote);
  const w=Math.max(...lines.map(l=>l.length))*ALIVE_CHARW;
  const xMin=MAP_VIEWBOX[0]+14+w/2,xMax=MAP_VIEWBOX[0]+MAP_VIEWBOX[2]-14-w/2;
  const x=clamp(d.x+Math.floor(rng()*121)-60,xMin,xMax);
  const yMin=MAP_VIEWBOX[1]+52,yMax=MAP_VIEWBOX[1]+MAP_VIEWBOX[3]-14-(lines.length-1)*13;
  const y=clamp(d.y+Math.floor(rng()*66)-40,yMin,yMax);
  aliveCountNow++;
  const dot=svgEl("circle",{class:"alive-dot",cx:x,cy:y,r:3,fill:aliveColorFor(d),stroke:"#0b1220","stroke-width":"1"});
  layer.appendChild(dot);
  setTimeout(()=>{
    if(!dot.parentNode)return;
    dot.parentNode.removeChild(dot);
    const t=svgEl("text",{class:"alive-text",x:x,y:y,"text-anchor":"middle"});
    lines.forEach((ln,i)=>{
      const ts=svgEl("tspan",{x:x,dy:i===0?0:13});
      ts.textContent=ln;
      t.appendChild(ts);
    });
    layer.appendChild(t);
    setTimeout(()=>{
      if(t.parentNode)t.parentNode.removeChild(t);
      aliveCountNow=Math.max(0,aliveCountNow-1);
    },5600);
  },1100);
  return dot;
}
function aliveKillAll(){
  const layer=typeof document!=="undefined"?document.getElementById("bg-map"):null;
  if(layer){
    const old=layer.querySelector("#alive-layer");
    if(old)old.parentNode.removeChild(old);
  }
  aliveCountNow=0;
}
function startAliveLoop(){
  if(aliveTimer)return;
  if(typeof document==="undefined"||typeof document.getElementById!=="function")return;
  const base=isMobileUI()?9000:ALIVE_MIN_WAIT;
  aliveTimer=setTimeout(function tick(){
    try{
      if(aliveActive())spawnAliveVoice();
    }catch(e){}
    const wait=(isMobileUI()?9000:ALIVE_MIN_WAIT)+Math.floor(rng()*ALIVE_JITTER_WAIT);
    aliveTimer=setTimeout(tick,wait);
  },base+Math.floor(rng()*ALIVE_JITTER_WAIT));
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

function rallyGainFor(d,issueId){
  const w=d.w[issueId];
  const fit=1-Math.abs(S.party.pos[issueId]-d.ideal[issueId]);
  const diminish=1/(1+S.ralliesThisTurn*0.5);
  return (0.055+getAttr("charisma")*0.0075)*(1+modSum("rallyMult"))*(0.5+w*1.5*fit)*diminish;
}
function adGainFor(d){
  const cur=S.boost[d.id]&&S.boost[d.id].player?S.boost[d.id].player:0;
  return (0.05+getAttr("intelligence")*0.004)*(1+modSum("adMult"))*(1/(1+3*cur));
}

/* ---- T12: expected-effects preview (pure helpers, never mutate state) ---- */
function shareWithPlayerBoost(d,extra){
  const cur=S.boost[d.id]&&S.boost[d.id].player?S.boost[d.id].player:0;
  return districtShares(d,true,{player:cur+extra}).player;
}
function previewRally(issueId){
  const d=DIST_BY_ID[S.location];
  const gain=rallyGainFor(d,issueId);
  const before=shareWithPlayerBoost(d,0);
  const after=shareWithPlayerBoost(d,gain);
  const yd=after-before;
  return {district:d.id,youDelta:yd,rivalDelta:-yd,spCost:COSTS.rallySP,cashCost:0,notes:"+4% voter enthusiasm in "+d.short};
}
function previewAd(){
  const d=DIST_BY_ID[S.location];
  const gain=adGainFor(d);
  const before=shareWithPlayerBoost(d,0);
  const after=shareWithPlayerBoost(d,gain);
  const yd=after-before;
  return {district:d.id,youDelta:yd,rivalDelta:-yd,spCost:0,cashCost:COSTS.ad,notes:""};
}
function previewHQ(){
  const d=DIST_BY_ID[S.location];
  const gain=0.006;
  const before=shareWithPlayerBoost(d,0);
  const after=shareWithPlayerBoost(d,gain);
  const yd=after-before;
  return {district:d.id,youDelta:yd,rivalDelta:-yd,spCost:0,cashCost:COSTS.hq,notes:"+"+fmtMoney(COSTS.hqIncome)+"/week income · +0.6 pts/week local growth"};
}
function previewTravel(destId){
  const d=DIST_BY_ID[destId];
  const sh=S.districtPoll[d.id]||districtShares(d,true);
  const rows=Object.keys(sh).filter(k=>k!=="others").sort((a,b)=>sh[b]-sh[a]);
  const leader=rows.length?partyOf(rows[0]):null;
  const topLine=leader?" · leader <b>"+esc(leader.abbr)+"</b> "+pct(sh[rows[0]]):"";
  return {district:d.id,youDelta:0,rivalDelta:0,spCost:travelCost(S.location,destId),cashCost:0,notes:"Poll there: YOU <b>"+pct(sh.player||0)+"</b>"+topLine};
}
function previewLine(p){
  const band=pts(pollNoise());
  const act=p.youDelta>=0?"YOU ≈ +":"YOU ≈ ";
  const sig=p.youDelta>=0?"+":"−";
  let line;
  if(p.spCost&&!p.cashCost)line=act+pts(p.youDelta)+" pts (±"+band+" noise), rivals "+sig+pts(Math.abs(p.rivalDelta))+" pts · −"+p.spCost+" SP";
  else if(p.cashCost&&!p.spCost)line=act+pts(p.youDelta)+" pts (±"+band+" noise), rivals "+sig+pts(Math.abs(p.rivalDelta))+" pts · −"+fmtMoney(p.cashCost);
  else if(p.spCost&&p.cashCost)line="−"+p.spCost+" SP · −"+fmtMoney(p.cashCost);
  else if(p.spCost)line="−"+p.spCost+" SP";
  else line=act+pts(p.youDelta)+" pts (±"+band+" noise), rivals "+sig+pts(Math.abs(p.rivalDelta))+" pts";
  return '<div class="preview-title">'+esc(DIST_BY_ID[p.district].short)+'</div>'
    +(p.notes?'<div class="preview-note">'+p.notes+'</div>':"")
    +'<div class="preview-main">'+line+'</div>'
    +'<div class="preview-hint">Estimate only — real polls are never exact.</div>';
}
function previewForButton(b){
  if(!S||S.phase!=="campaign")return "";
  const act=b.dataset.act;
  if(act==="travel")return previewLine(previewTravel(DIST_BY_ID[S.selDistrict].id));
  if(act==="rally")return previewLine(previewRally(b.dataset.issue));
  if(act==="ad")return previewLine(previewAd());
  if(act==="hq")return previewLine(previewHQ());
  return "";
}

/* ---- T12: floating tooltip window (follows the cursor, classic Windows style) ---- */
let tipEl=null,tipTimer=null,tipVisible=false;
function getTip(){
  if(!tipEl){
    tipEl=document.createElement("div");
    tipEl.id="preview-tip";
    tipEl.style.position="fixed";
    tipEl.style.pointerEvents="none";
    document.body.appendChild(tipEl);
  }
  return tipEl;
}
function positionTip(e){
  const tip=getTip();
  let x=e.clientX+16,y=e.clientY+16;
  const w=tip.offsetWidth,h=tip.offsetHeight;
  if(x+w>window.innerWidth-8)x=window.innerWidth-w-8;
  if(y+h>window.innerHeight-8)y=e.clientY-h-16;
  if(x<8)x=8;
  if(y<8)y=8;
  tip.style.left=x+"px";
  tip.style.top=y+"px";
}
function tipShowAt(e,html){
  if(!html)return;
  const tip=getTip();
  tip.innerHTML=html;
  tip.style.display="block";
  positionTip(e);
  tipVisible=true;
}
function tipHide(){
  if(tipTimer){clearTimeout(tipTimer);tipTimer=null;}
  tipVisible=false;
  if(tipEl)tipEl.style.display="none";
}
function wirePreviewTarget(b,htmlFn){
  let holdTimer=null;
  const enter=e=>{if(isMobileUI())return;if(holdTimer){clearTimeout(holdTimer);holdTimer=null;}tipTimer=setTimeout(()=>tipShowAt(e,htmlFn()),200);};
  const move=e=>{if(tipVisible)positionTip(e);};
  const leave=()=>{if(holdTimer){clearTimeout(holdTimer);holdTimer=null;}tipHide();};
  b.addEventListener("mouseenter",enter);
  b.addEventListener("mousemove",move);
  b.addEventListener("mouseleave",leave);
  b.addEventListener("focus",enter);
  b.addEventListener("blur",leave);
  b.addEventListener("pointerdown",e=>{
    if(isMobileUI())tipHide();
    if(tipTimer){clearTimeout(tipTimer);tipTimer=null;}
    holdTimer=setTimeout(()=>tipShowAt(e,htmlFn()),500);
  });
  b.addEventListener("pointerup",()=>{if(holdTimer){clearTimeout(holdTimer);holdTimer=null;}tipHide();});
  b.addEventListener("pointercancel",leave);
  b.addEventListener("pointerleave",leave);
}

let mobilePreviewSafetyBound=false;
function bindMobilePreviewSafety(){
  if(typeof document==="undefined"||mobilePreviewSafetyBound)return;
  const hide=()=>{if(isMobileUI())tipHide();};
  ["pointerup","pointercancel","touchend","touchcancel","touchmove","scroll"].forEach(type=>document.addEventListener(type,hide,true));
  mobilePreviewSafetyBound=true;
}

function doRally(issueId){
  if(S.paused||S.stamina<COSTS.rallySP)return;
  if(!issActive(issueId))return;
  const d=DIST_BY_ID[S.location];
  if(!S.districtPoll||!S.districtPoll[d.id])recomputePolls();
  const before={...S.districtPoll[d.id]};
  const gain=rallyGainFor(d,issueId);
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
  log("Rally in <b>"+d.name+"</b> focused on <b>"+(ISSUE_BY_ID[issueId]?ISSUE_BY_ID[issueId].name:issueId)+"</b>: YOU "+(myDelta>0?"+":"")+pts(myDelta)+" pts ("+pct(before.player||0)+" → "+pct(after.player)+"); other parties "+(rivalDelta>0?"+":"")+pts(rivalDelta)+" pts.","good");
  updateAll();
}

function buyAd(){
  if(S.paused||S.cash<COSTS.ad)return;
  const d=DIST_BY_ID[S.location];
  if(!S.districtPoll||!S.districtPoll[d.id])recomputePolls();
  const before={...S.districtPoll[d.id]};
  const gain=adGainFor(d);
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

/* ---- T21: party machine — campaigns, staff, HQ upgrades ---- */
function suggestCampaignName(){return pick(CAMPAIGN_NAMES);}
function launchCampaign(spec){
  if(!S||S.phase!=="campaign"||S.paused)return null;
  const iss=spec&&spec.issue?ISSUE_BY_ID[spec.issue]:null;
  const stance=spec&&spec.stance;
  if(!iss||!issActive(iss.id)||(stance!=="pro"&&stance!=="anti"))return null;
  if(S.partyMachine.campaigns.length>=CAMPAIGN_CAP)return null;
  const target=spec&&spec.target==="national"?"national":(spec&&DIST_BY_ID[spec.target]?spec.target:null);
  if(!target)return null;
  const cost=target==="national"?COSTS.campaignNational:COSTS.campaignDistrict;
  if(S.cash<cost)return null;
  const name=String(spec.name||"").trim().slice(0,28)||suggestCampaignName();
  S.cash-=cost;
  const c={id:uid(),name:name,issue:iss.id,stance:stance,target:target,cost:cost,alloc:[0,0,0],phase:0,created:S.week};
  S.partyMachine.campaigns.push(c);
  log("Campaign <b>"+esc(name)+"</b> launched — "+stanceLabel(stance,iss)+" ("+(target==="national"?"nationwide":DIST_BY_ID[target].name)+"), "+fmtMoney(cost)+", 3-week run.","info");
  return c;
}
function allocateStaff(cid,n){
  if(!S||S.phase!=="campaign"||S.paused)return false;
  const c=S.partyMachine.campaigns.find(x=>x.id===cid);
  if(!c||c.phase>=3)return false;
  n=Math.floor(n);
  if(n<0||n>3||n>Math.min(3,S.partyMachine.staff.length,S.partyMachine.energy))return false;
  S.partyMachine.energy-=n-c.alloc[c.phase];
  c.alloc[c.phase]=n;
  return true;
}
function hireStaff(){
  if(!S||S.phase!=="campaign"||S.paused)return null;
  const pm=S.partyMachine;
  if(pm.staff.length>=partyStaffCap())return null;
  const cost=partyHireCost();
  if(S.cash<cost)return null;
  const avail=STAFF_NAMES.filter(n=>!pm.staff.some(x=>x.name===n));
  S.cash-=cost;
  const s={id:uid(),name:pick(avail.length?avail:STAFF_NAMES),role:pick(STAFF_ROLES),level:1};
  pm.staff.push(s);
  log("Hired <b>"+esc(s.name)+"</b> ("+s.role+", level "+s.level+"). Upkeep "+fmtMoney(COSTS.upkeepBase)+"/week.","good");
  return s;
}
function trainStaff(sid){
  if(!S||S.phase!=="campaign"||S.paused)return false;
  const s=S.partyMachine.staff.find(x=>x.id===sid);
  if(!s||s.level>=3)return false;
  const cost=partyTrainCost(s);
  if(S.cash<cost)return false;
  S.cash-=cost;
  s.level++;
  log("<b>"+esc(s.name)+"</b> trained to level "+s.level+" ("+fmtMoney(cost)+").","good");
  return true;
}
function upgradePartyHQ(){
  if(!S||S.phase!=="campaign"||S.paused)return false;
  const cost=partyHqUpgradeCost();
  if(!cost||S.cash<cost)return false;
  S.cash-=cost;
  S.partyMachine.hqLevel++;
  S.partyMachine.energy=partyEnergyMax();
  log("Party HQ upgraded to level "+S.partyMachine.hqLevel+": staff energy "+partyEnergyMax()+"/week, staff cap "+partyStaffCap()+".","good");
  return true;
}
function releaseCampaign(c){
  const pm=S.partyMachine;
  const iss=ISSUE_BY_ID[c.issue];
  const staffWeeks=c.alloc[0]+c.alloc[1]+c.alloc[2];
  const fit=c.stance==="pro"?S.party.pos[c.issue]:1-S.party.pos[c.issue];
  const power=(0.6+0.35*staffWeeks)*(0.6+0.4*fit)*partyQuality();
  const dir=c.stance==="pro"?1:-1;
  let reached="";
  if(c.target==="national"){
    const ranked=DISTRICTS.slice().sort((a,b)=>dir*b.ideal[c.issue]-dir*a.ideal[c.issue]).slice(0,12);
    for(const d of ranked){
      addBoost(d.id,"player",power*0.13);
      S.enthusiasm[d.id]=clamp((S.enthusiasm[d.id]!==undefined?S.enthusiasm[d.id]:d.ent)+0.04*partyQuality(),0.5,1.4);
    }
    for(const d of DISTRICTS)addBoost(d.id,"player",power*0.015);
    reached=ranked.map(d=>d.short).join(", ");
  }else{
    const d=DIST_BY_ID[c.target];
    addBoost(d.id,"player",power*0.35);
    S.enthusiasm[d.id]=clamp((S.enthusiasm[d.id]!==undefined?S.enthusiasm[d.id]:d.ent)+0.06*partyQuality(),0.5,1.4);
    reached=d.name;
  }
  if(power>=2.5)addModifier({name:"Media buzz: "+c.name,desc:"Ad power +15% for 2 weeks",turns:2,effects:{adMult:.15}});
  const rev=Math.round(c.cost*0.4+power*(c.target==="national"?4500:2200)+rnd(0,3000));
  S.cash+=rev;
  S.stats.campaigns=(S.stats.campaigns||0)+1;
  pm.campaigns=pm.campaigns.filter(x=>x.id!==c.id);
  const natBefore=S.pollNat&&S.pollNat.player?S.pollNat.player:0;
  recomputePolls();
  const swing=((S.pollNat.player||0)-natBefore)*100;
  pm.history.unshift({name:c.name,issue:c.issue,stance:c.stance,target:c.target,staffWeeks:staffWeeks,cost:c.cost,rev:rev,swing:swing,week:S.week,reached:reached});
  if(pm.history.length>10)pm.history.pop();
  log("Campaign <b>"+esc(c.name)+"</b> released"+(c.target==="national"?" — reached: "+reached+".":" in <b>"+reached+"</b>.")+" YOU "+(swing>=0?"+":"")+swing.toFixed(1)+" pts national · revenue <b>+"+fmtMoney(rev)+"</b>.","good");
}
function partyMachineTick(){
  const pm=S.partyMachine;
  pm.energy=partyEnergyMax();
  const up=partyUpkeep();
  if(up>0)S.cash-=up;
  const finishing=[];
  for(const c of pm.campaigns){
    if(c.phase>=3)continue;
    const w=c.alloc[c.phase]||0;
    if(c.phase===0)log("<b>"+esc(c.name)+"</b> — planning complete ("+w+" staff-weeks). Next: execution.","info");
    else if(c.phase===1)log("<b>"+esc(c.name)+"</b> — execution wrapped ("+w+" staff-weeks). The release is being prepared.","info");
    c.phase++;
    if(c.phase===3)finishing.push(c);
  }
  for(const c of finishing)releaseCampaign(c);
  if(S.week>=4&&S.week<=18&&S.week%3===0)aiFlavorCampaign();
}
function aiFlavorCampaign(){
  const issue=activeIssueList();
  if(!issue.length)return;
  const p=pick(AI_PARTIES);
  const i=pick(issue);
  const stance=Math.random()<0.5?"pro":"anti";
  const where=Math.random()<0.5?"nationwide":"in the border districts";
  log("<b>"+p.abbr+"</b> kicks off a new campaign: <b>"+esc(pick(CAMPAIGN_NAMES))+"</b> — "+stanceLabel(stance,i)+" push "+where+".","info");
}


function aiTurn(){
  const aggr=DIFFS[S.difficulty].aggr;
  const sharesCache={};
  for(const d of DISTRICTS)sharesCache[d.id]=districtShares(d,false);
  let mainRivalTargets=null;
  for(const p of AI_PARTIES){
    let pts=Math.round(aggr*(2+p.appeal*4))+(p.mainRival?2:0);
    if(pts<=0)continue;
    const candidates=p.focus?DISTRICTS.filter(d=>p.focus.indexOf(d.id)>=0):DISTRICTS;
    const scored=candidates.map(d=>{
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
    if(p.id==="ppdb"&&top3.length)log("<b>PP-DB</b> campaigns this week in "+top3.map(t=>t.d.short).join(", ")+" — city focus only.","info");
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
  S.cashHist.push({week:S.week,cash:S.cash,income:Math.round(income)});
  if(S.cashHist.length>24)S.cashHist.shift();
  log("Week "+S.week+" income: <b>"+fmtMoney(income)+"</b> (state subsidy "+fmtMoney(COSTS.stipend)+(hqCount>0?" + "+hqCount+" HQ "+fmtMoney(hqIncome):"")+").","info");
  for(const dId in S.hq)addBoost(dId,"player",0.006);
  partyMachineTick();
  aiTurn();
  expireModifiers();
  S.pollsPrev=S.pollNat;
  recomputePolls();
  S.stamina=getMaxStamina();
  S.ralliesThisTurn=0;
  S.touched=[];
  saveGame();
  if(S.week>20){runElection();return;}
  if(S.cheatEasyWin){S.cheatEasyWin=false;recomputePolls();}
  if(S.week>=S.debateWeek&&!S.debateDone){S.eventQueue.push("__DEBATE__");S.debateDone=true;}
  if(S.week>=S.pigWeek&&S.pigPending&&!S.pigDone){S.eventQueue.push("__PIG__");S.pigDone=true;}
  if(virusRoll()){S.eventQueue.push("__VIRUS__");S.virusDone=true;}
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
  const votes={},dvAll=[];
  let total=0,elecWeight=0,turnoutWeighted=0;
  const turnouts={},turnoutMode=rng()<.5?"low":"high";
  for(const d of DISTRICTS){
    const sh=districtShares(d,false);
    const ent=S.enthusiasm[d.id]!==undefined?S.enthusiasm[d.id]:d.ent;
    const tb=turnoutMode==="low"?.25+rng()*.035:.38+rng()*.22;
    const t=clamp(tb+(ent-1)*(turnoutMode==="low"?.02:.04),0.25,0.60);
    turnouts[d.id]=t;
    const elec=d.seats*DOMESTIC_POPULATION_PER_SEAT;
    const V=elec*t;
    elecWeight+=elec;
    turnoutWeighted+=elec*t;
    const dv={};
    for(const k in sh){
      if(k==="others")continue;
      dv[k]=sh[k]*V*(0.95+rng()*0.1);
    }
    if(S.kosyo&&dv.player!==undefined){
      const tot=Object.values(dv).reduce((a,b)=>a+b,0);
      const need=0.55*tot-dv.player;
      if(need>0)dv.player+=need;
    }
    dvAll.push({d:d,dv:dv,shares:sh,turnout:t,totalVotes:Object.values(dv).reduce((a,b)=>a+b,0)});
    for(const k in dv){votes[k]=(votes[k]||0)+dv[k];total+=dv[k];}
  }
  const turnout=turnoutWeighted/elecWeight;
  const natShare={};
  for(const k in votes)natShare[k]=votes[k]/total;
  if(S.cheatFloor){
    const need=Math.max(0,0.0405*total-(votes.player||0));
    if(need>0)votes.player=(votes.player||0)+need;
    for(const k in votes)natShare[k]=votes[k]/total;
  }
  if(S.kosyo){
    const need=Math.max(0,0.55*total-(votes.player||0));
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
  S.results={votes:votes,natShare:natShare,qualified:qualified,seats:seats,totalVotes:total,turnout:turnout,turnouts:turnouts,turnoutMode:turnoutMode,districts:dvAll.map(item=>({id:item.d.id,shares:item.shares,votes:item.dv,turnout:item.turnout,totalVotes:item.totalVotes}))};
  startElectionNight();
}

const ELECTION_NIGHT_TIMES=["08:00","10:00","12:00","14:00","16:00","20:00"];
const ELECTION_NIGHT_HEADLINES=["The first boxes are open. Every vote counts.","PB takes an early national lead, but the regional map is anything but settled.","GERB holds the northwest while BSP rallies in the coal belt.","Sofia reports a reformist surge. The seat projection starts to move.","The late-count districts are in. Margins tighten across the country.","The count is complete. Bulgaria has chosen."];
const ELECTION_NIGHT_DURATION=36000;
const DOMESTIC_POPULATION_ESTIMATE=6500000;
const DOMESTIC_POPULATION_PER_SEAT=DOMESTIC_POPULATION_ESTIMATE/TOTAL_SEATS;
let electionNightTimers=[];
function electionNightEarlyPoll(){
  const final=S.results.natShare,out={},targetBsp=.40,targetPb=.07;
  const otherKeys=Object.keys(final).filter(k=>k!=="bsp"&&k!=="pb"),otherSum=otherKeys.reduce((a,k)=>a+(final[k]||0),0)||1;
  for(const k of otherKeys)out[k]=(final[k]||0)/otherSum*(1-targetBsp-targetPb);
  out.bsp=targetBsp;out.pb=targetPb;
  return out;
}
function electionNightSwingPlan(){
  // The stable "story" for the late-count arc, derived only from the real
  // results so every render agrees without any state: 2nd and 3rd place
  // trade places through the afternoon, the leader's margin tightens, and
  // the party closest to the 4% barrier oscillates across the line.
  const final=S.results.natShare;
  const keys=Object.keys(final).filter(k=>k!=="others");
  const sorted=keys.slice().sort((a,b)=>(final[b]||0)-(final[a]||0));
  const swing={};
  if(sorted.length>=3){
    const s2=final[sorted[1]]||0,s3=final[sorted[2]]||0;
    const a23=clamp((s2-s3)*0.6,0.012,0.024);
    swing[sorted[0]]=-0.008;
    swing[sorted[1]]=a23;
    swing[sorted[2]]=-a23;
  }
  if(sorted.length>=4)swing[sorted[3]]=0.006;
  let thresh=null,td=1;
  for(const k of keys){const d=Math.abs((final[k]||0)-0.04);if(d<td){td=d;thresh=k;}}
  return {swing:swing,thresh:thresh};
}
function electionNightPoll(progress,tick){
  const final=S.results.natShare,early=electionNightEarlyPoll(),out={};
  // The fictional early-vote narrative is gone by noon. From then on the
  // bars ride one coherent late-count arc (see electionNightSwingPlan)
  // that is a smooth function of progress only — no per-tick wobble, no
  // rotating surge party — so the columns glide instead of jittering
  // frame-to-frame, and the final result stays exact at progress>=1.
  const t=clamp(progress*3,0,1);
  const late=progress<1/3?0:Math.sin(Math.min(1,(progress-1/3)/0.667)*Math.PI);
  const x=clamp((progress-1/3)/0.667,0,1);
  const plan=electionNightSwingPlan();
  for(const k in final){
    let drift=0;
    if(progress<1/3)drift=Math.sin(progress*60+k.length*1.7)*.0015*(1-t);
    else{
      drift=(plan.swing[k]||0)*late;
      if(plan.thresh===k)drift+=Math.sin(x*Math.PI*2)*.008;
      drift+=Math.sin(progress*40+k.length*1.7)*.0008*late;
    }
    out[k]=(early[k]||0)*(1-t)+(final[k]||0)*t+drift;
  }
  const sum=Object.values(out).reduce((a,b)=>a+Math.max(0,b),0)||1;
  for(const k in out)out[k]=Math.max(0,out[k])/sum;
  if(progress>=1)for(const k in final)out[k]=final[k];
  return out;
}
function electionNightEarlyDistrict(item,ordinal){
  const shares=item.shares||{},out={};
  for(const k in shares)out[k]=shares[k]*({bsp:2.5,gerb:1.18,pb:.82,ppdb:1.18}[k]||.92);
  return out;
}
function morningBspDistricts(){
  return (S.results.districts||[]).slice().sort((a,b)=>(b.shares.bsp||0)-(a.shares.bsp||0)).slice(0,6).map(item=>item.id);
}
function electionNightLeader(item,progress,ordinal){
  if(progress>=1){let final=null,score=-1;for(const k in item.shares)if(k!=="others"&&item.shares[k]>score){final=k;score=item.shares[k];}return final;}
  if(item.id==="sofia-city"||item.id==="sofia-obl")return item.shares.ppdb!==undefined?"ppdb":electionNightLeader(item,1,ordinal);
  const early=electionNightEarlyDistrict(item,ordinal),keys=new Set(Object.keys(item.shares).concat(Object.keys(early))),noon=1/3;
  if(progress<noon&&morningBspDistricts().includes(item.id)&&item.shares.bsp!==undefined)return "bsp";
  const finalBlend=Math.min(1,progress/noon);let leader=null,score=-1;
  keys.forEach(k=>{const v=(early[k]||0)*(1-finalBlend)+(item.shares[k]||0)*finalBlend;if(k!=="others"&&v>score){leader=k;score=v;}});
  return leader;
}
function electionNightOrder(){return DISTRICTS.slice().sort((a,b)=>b.seats-a.seats);}
function electionRegionTooltip(d,item){
  const votes=item.votes||{},total=item.totalVotes||Object.values(votes).reduce((a,b)=>a+b,0)||1;
  const rows=Object.keys(votes).sort((a,b)=>votes[b]-votes[a]).map(k=>{
    const p=partyOf(k);return '<div class="election-tip-row"><span><i style="background:'+p.color+'"></i>'+esc(p.abbr)+'</span><b>'+pct(votes[k]/total)+' <small>'+Math.round(votes[k]).toLocaleString("en-US")+'</small></b></div>';
  }).join("");
  return '<div class="preview-title">'+esc(d.name)+' · '+d.seats+' seats</div><div class="preview-note">Final district result · turnout '+pct(item.turnout||0,0)+'</div><div class="preview-main">'+Math.round(total).toLocaleString("en-US")+' valid votes</div><div class="election-tip-list">'+rows+'</div>';
}
function renderElectionMap(initial){
  const svg=$("election-map");if(!svg)return;
  if(initial){svg.innerHTML=DISTRICTS.map(d=>'<path class="election-region" data-id="'+d.id+'" d="'+(REGION_PATHS[d.id]||"")+'" fill="#c5cbd1"><title>'+esc(d.name)+' — counting</title></path>').join("");}
  const progress=S.electionNight.progress||0,ordered=electionNightOrder(),byId={};ordered.forEach((d,i)=>byId[d.id]={d:d,order:i});
  const results={};(S.results.districts||[]).forEach(item=>results[item.id]=item);
  if(initial)DISTRICTS.forEach(d=>{const node=svg.querySelector('.election-region[data-id="'+d.id+'"]'),item=results[d.id];if(node&&item)wirePreviewTarget(node,()=>electionRegionTooltip(d,item));});
  // The geometry is visible from the opening frame. Only the colors wait for
  // the first count, so the map never appears to be drawing itself in.
  DISTRICTS.forEach(d=>{const node=svg.querySelector('.election-region[data-id="'+d.id+'"]');if(!node)return;const shown=progress>0,item=results[d.id];
    if(shown){const p=partyOf(electionNightLeader(item,progress,byId[d.id].order)),old=node.dataset.party||"";node.classList.add("revealed");node.classList.remove("unrevealed");node.style.fill=p?p.color:"#c5cbd1";if(old!==p.id){node.classList.remove("leader-change");void node.offsetWidth;node.classList.add("leader-change");}node.dataset.party=p?p.id:"";node.querySelector("title").textContent=d.name+(p?" — "+p.abbr:" — counting");}
  });
}
function ensureElectionChart(){
  const box=$("election-results");if(box.dataset.ready)return;
  const order=Object.keys(S.results.votes).sort((a,b)=>S.results.votes[b]-S.results.votes[a]);
  box.innerHTML=order.map(k=>{const p=partyOf(k);return '<div class="res-row '+(k==="player"?"you":"")+'" data-party="'+k+'"><div class="res-top"><span class="pdot" style="background:'+p.color+'"></span><span class="rname">'+esc(partyName(p))+'</span><span class="rflag"></span><span class="rpct">0%</span><span class="rseats">0 seats</span></div><div class="res-bar"><div class="fill" style="background:'+p.color+';width:0%"></div></div></div>';}).join("");
  box.dataset.ready="1";
}
function updateElectionChart(est,seats,final){
  const box=$("election-results"),max=Math.max.apply(null,Object.values(est))||1;
  const rows=Array.from(box.querySelectorAll(".res-row"));
  rows.sort((a,b)=>(est[b.dataset.party]||0)-(est[a.dataset.party]||0));
  rows.forEach((row,rank)=>{row.dataset.rank=rank;box.appendChild(row);});
  rows.forEach(row=>{const k=row.dataset.party,p=row.querySelector(".rpct"),s=row.querySelector(".rseats"),fill=row.querySelector(".fill"),flag=row.querySelector(".rflag"),share=est[k]||0;
    p.textContent=pct(share);s.textContent=(seats[k]||0)+" seats";fill.style.width=(share/max*100).toFixed(1)+"%";flag.innerHTML=(share>=.04?'<span class="chip green">IN</span>':'<span class="chip red">OUT</span>');
  });
}
function updateElectionSeats(seats){
  const strip=$("seat-strip"),cells=strip.querySelectorAll(".seat-cell"),order=Object.keys(seats).sort((a,b)=>seats[b]-seats[a]);let at=0;
  order.forEach(k=>{const p=partyOf(k);for(let i=0;i<(seats[k]||0)&&at<cells.length;i++,at++){cells[at].style.background=p?p.color:"#777";cells[at].title=p?p.abbr:"";}});
  for(;at<cells.length;at++){cells[at].style.background="#d0d0d0";cells[at].title="";}
}
function electionNightClock(progress){
  const minutes=480+Math.round(clamp(progress,0,1)*720);
  return String(Math.floor(minutes/60)).padStart(2,"0")+":"+String(minutes%60).padStart(2,"0");
}
function finishElectionNight(){
  electionNightTimers.forEach(id=>clearTimeout(id));electionNightTimers=[];S.electionNight.progress=1;S.electionNight.step=5;S.electionNight.tick++;S.electionNight.revealed=DISTRICTS.map(d=>d.id);
  renderElectionScreen();
}
function advanceElectionNight(){
  if(!S.electionNight||S.electionNight.progress>=1)return;
  S.electionNight.elapsed=Math.min(ELECTION_NIGHT_DURATION,S.electionNight.elapsed+250);S.electionNight.progress=S.electionNight.elapsed/ELECTION_NIGHT_DURATION;S.electionNight.step=Math.min(5,Math.floor(S.electionNight.progress*6));S.electionNight.tick++;
  renderElectionScreen();
  if(S.electionNight.progress<1)electionNightTimers.push(setTimeout(advanceElectionNight,250));
}
function startElectionNight(){
  electionNightTimers.forEach(id=>clearTimeout(id));electionNightTimers=[];
  S.electionNight={progress:0,elapsed:0,step:0,tick:0,revealed:[]};renderElectionScreen();showScreen("election");
  if(typeof window==="undefined")finishElectionNight();else electionNightTimers.push(setTimeout(advanceElectionNight,250));
}
function renderElectionScreen(){
  const r=S.results,night=S.electionNight||{progress:1,step:5,tick:0},progress=night.progress===undefined?1:night.progress,est=progress>=1?r.natShare:electionNightPoll(progress,night.tick),seats=progress>=1?r.seats:projectNationalSeats(est);
  ensureElectionChart();
  const counted=Math.round(r.totalVotes*progress),activity=counted/DOMESTIC_POPULATION_ESTIMATE*100;
  $("election-clock").textContent=electionNightClock(progress);$("election-step").textContent=progress>=1?"FINAL RESULTS":"LIVE COUNT · "+Math.round(progress*100)+"%";$("election-live").textContent=progress>=1?"● FINAL":"● LIVE";$("election-headline").textContent=ELECTION_NIGHT_HEADLINES[Math.min(5,Math.floor(progress*6))];$("election-sub").textContent=(progress>=1?"Final count":"Live count")+" · Turnout "+pct(r.turnout,0)+" · threshold 4%";$("election-votes-counted").textContent=String(counted).replace(/\B(?=(\d{3})+(?!\d))/g," ");$("election-activity").textContent=activity.toFixed(1)+"%";
  updateElectionChart(est,seats,progress>=1);if(!$("seat-strip").dataset.ready){let cells="";for(let i=0;i<TOTAL_SEATS;i++)cells+='<div class="seat-cell"></div>';$("seat-strip").innerHTML=cells;$("seat-strip").dataset.ready="1";}updateElectionSeats(seats);renderElectionMap(!$("election-map").dataset.ready);$("election-map").dataset.ready="1";$("btn-election-continue").disabled=progress<1;$("btn-election-skip").style.display=progress<1?"":"none";
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
    const actIssues=activeIssueList();
    for(const i of actIssues)dist+=Math.abs(p.pos[i.id]-S.party.pos[i.id]);
    dist/=actIssues.length;
    let will=40-dist*55+(playerFirst?12:-12)+(S.rel[p.id]||0)/2+clamp((ps-s)/4,-8,12)+rnd(0,6);
    const demands=[{type:"ministry",name:p.favMinistry,cpCost:18,will:38,done:false}];
    if(rng()<0.85)demands.push({type:"policy",name:actIssues[Math.floor(rng()*actIssues.length)].name,cpCost:14,will:30,done:false});
    if(rng()<0.65)demands.push({type:"cash",name:"Fund transfer",amount:rnd(20,50)*1000,will:26,done:false});
    parties[p.id]={baseWill:Math.round(clamp(will,5,95)),earned:0,joined:false,pact:false,courtesy:0,demands:demands};
  }
  const second=Math.max.apply(null,aiSeats);
  S.coalition={cp:40+getAttr("intelligence")*6+clamp(ps-second,-20,20),parties:parties,ministriesGiven:[],playerFirst:playerFirst};
  S.phase="coalition";
  renderCoalition();
  showScreen("coalition");
}

/* ---- T27: post-election interview ---- */
const INTERVIEW_QUOTES={
  majority:[
    {t:"We're going to fix the country.",sub:"A historic mandate. No excuses now."},
    {t:"The people spoke; we listen.",sub:"Humble in victory, clear on the plan."},
    {t:"Watch us work.",sub:"Results speak louder than promises."}
  ],
  first:[
    {t:"We're looking to form a coalition that will follow our ideas.",sub:"The phones are already ringing."},
    {t:"A mandate to lead — we'll build the majority.",sub:"Talks begin today."},
    {t:"The campaign was only the beginning.",sub:"The real battle is in parliament."}
  ],
  other:[
    {t:"We're proud of the campaign we ran.",sub:"Every vote was earned the hard way."},
    {t:"Now we negotiate.",sub:"A coalition may still be possible."},
    {t:"We'll hold the government accountable.",sub:"Every single day."}
  ],
  none:[
    {t:"We're just getting started.",sub:"Next time, we'll be back."},
    {t:"The fight continues.",sub:"A movement doesn't die in one election."}
  ]
};
function leftistParty(){
  const p=S.party.pos;
  return !!(p&&p.pensions!==undefined&&p.healthcare!==undefined&&p.pensions>=0.75&&p.healthcare>=0.75);
}
function startInterview(){
  if(typeof window==="undefined"){continueAfterInterview();return;}
  const r=S.results,ps=r.seats.player||0;
  const top=Math.max.apply(null,AI_PARTIES.map(p=>r.seats[p.id]||0));
  const bucket=ps>=MAJORITY?INTERVIEW_QUOTES.majority:ps>=top?INTERVIEW_QUOTES.first:r.qualified.includes("player")?INTERVIEW_QUOTES.other:INTERVIEW_QUOTES.none;
  const opts=bucket.slice();
  if(leftistParty())opts.push({t:"We're restoring Bai Tosho's rule! Glory to the National Republic of Bulgaria, comrade!",sub:"Long live the people's democracy.",egg:true});
  const root=$("modal-root");
  root.innerHTML='<div class="modal-back"><div class="modal">'
    +'<div class="ev-head choice"><span>THE MORNING AFTER</span><span class="paused-badge">EXIT INTERVIEW</span></div>'
    +'<div class="ev-body"><h3>Are you happy about the results? What are your plans right now?</h3>'
    +'<p>The camera crew has caught you on the stairs of the party headquarters. The whole country is watching.</p>'
    +'<div class="ev-opts">'+opts.map((o,i)=>'<button class="btn" data-i="'+i+'">'+esc(o.t)+(o.sub?'<small>'+esc(o.sub)+'</small>':"")+'</button>').join("")+'</div></div>'
    +'</div></div>';
  root.querySelectorAll(".ev-opts .btn").forEach(b=>{
    b.onclick=()=>{
      const o=opts[+b.dataset.i];
      S.interview={choice:o.t,easterEgg:!!o.egg};
      log("INTERVIEW — \u201C"+o.t+"\u201D","info");
      root.innerHTML="";
      continueAfterInterview();
    };
  });
}
function continueAfterInterview(){
  const r=S.results,ps=r.seats.player||0;
  if(!r.qualified.includes("player"))finishGame("threshold");
  else if(ps>=MAJORITY)finishGame("majority");
  else startCoalition();
}

/* ---- final government formation: random AI coalition / no parliament ---- */
function partyViewDist(a,b){
  const act=activeIssueList();
  let s=0;
  for(const i of act)s+=Math.abs((a.pos[i.id]||0)-(b.pos[i.id]||0));
  return act.length?s/act.length:0;
}
function incompatiblePair(a,b){
  return INCOMPAT_PAIRS.some(p=>(p[0]===a&&p[1]===b)||(p[0]===b&&p[1]===a));
}
const COALITION_VIEW_MAX=0.45;
function findAICoalition(){
  const seats=S.results&&S.results.seats?S.results.seats:{};
  const ids=Object.keys(seats).filter(k=>k!=="player"&&(seats[k]||0)>0);
  const singles=ids.filter(k=>seats[k]>=MAJORITY);
  if(singles.length)return {parties:[singles[0]],seats:seats[singles[0]],pm:singles[0]};
  const combos=[];
  for(let i=0;i<ids.length;i++)for(let j=i+1;j<ids.length;j++)combos.push([ids[i],ids[j]]);
  for(let i=0;i<ids.length;i++)for(let j=i+1;j<ids.length;j++)for(let k=j+1;k<ids.length;k++)combos.push([ids[i],ids[j],ids[k]]);
  const valid=combos.filter(c=>{
    let total=0;
    for(const p of c)total+=seats[p]||0;
    if(total<MAJORITY)return false;
    for(let i=0;i<c.length;i++)for(let j=i+1;j<c.length;j++){
      if(incompatiblePair(c[i],c[j]))return false;
      if(partyViewDist(partyOf(c[i]),partyOf(c[j]))>COALITION_VIEW_MAX)return false;
    }
    return true;
  });
  if(!valid.length)return null;
  const ordered=c=>c.slice().sort((a,b)=>(seats[b]||0)-(seats[a]||0));
  const pick=ordered(valid[Math.floor(rng()*valid.length)]);
  let total=0;
  for(const p of pick)total+=seats[p]||0;
  return {parties:pick,seats:total,pm:pick[0]};
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
  document.querySelectorAll("#coalition-cards .demand-chip").forEach(ch=>{
    wirePreviewTarget(ch,()=>{
      const [pid,di]=ch.dataset.demand.split(":");
      const dm=S.coalition.parties[pid].demands[+di];
      if(!dm)return "";
      const cost=dm.type==="cash"?"−"+fmtMoney(dm.amount):"−"+dm.cpCost+" CP";
      return '<div class="preview-title">'+esc(partyOf(pid).abbr)+' — demand</div>'
        +'<div class="preview-main">'+esc(dm.type==="ministry"?"Cabinet: "+dm.name:dm.type==="policy"?"Policy: "+dm.name:"Funds: "+fmtMoney(dm.amount))+'</div>'
        +'<div class="preview-note">'+cost+' · +'+dm.will+' willingness</div>';
    });
  });
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
  S.government=null;
  if(type==="opposition"||type==="caretaker"){
    const gov=findAICoalition();
    if(gov){
      S.government=gov;
      S.ending="opposition";
      log("The country has a government: <b>"+gov.parties.map(p=>partyOf(p).abbr).join(" + ")+"</b> ("+gov.seats+" seats).","info");
    }else{
      S.ending="noparliament";
      log("No coalition could reach "+MAJORITY+" seats — new elections are coming.","bad");
    }
  }else if(type==="threshold"){
    S.government=findAICoalition();
  }
  closeModal();
  renderEndScreen();
  showScreen("end");
  saveGame();
}

/* ---- T22: second term — 4-year time skip, state of the nation, stat drop ---- */
const TERM_MAX=3;
const MINISTER_OUTCOMES=[
  "passed the budget on the first reading",
  "failed to pass the budget — a winter of brinkmanship",
  "modernized the ministry with modest success",
  "was replaced mid-term after a scandal",
  "delivered a quiet, competent term",
  "oversaw a pilot reform that showed promise",
  "clashed with the coalition partners constantly",
  "won praise from Brussels for the reforms"
];
const TERM_ECONOMY=[
  "GDP grew a steady 2–3% a year",
  "the economy wobbled through two recessions",
  "inflation bit into household budgets",
  "foreign investment picked up in the border regions",
  "a new motorway corridor opened, linking the northwest",
  "energy prices swung wildly after the subsidy reform",
  "tourism boomed along the Black Sea coast",
  "the lev held firm against the euro"
];
const TERM_SOCIETY=[
  "pensioner protests blocked the boulevards for a week",
  "a census-year identity debate dominated the news",
  "minority parties traded accusations over the language law",
  "a corruption trial finally reached the Supreme Court",
  "emigration slowed for the first time in years",
  "village schools merged across the rural districts",
  "a heatwave summer tested the health system",
  "a grassroots civic movement swept the city councils"
];
function termTitle(){return S.term<=1?"First term":(S.term===2?"Second term":"Third term");}
function startTimeSkip(){
  S.phase="review";
  buildTermReview();
  renderReviewScreen();
  showScreen("review");
  saveGame();
}
function buildTermReview(){
  const r=S.results||{},ps=(r.seats&&r.seats.player)||0;
  const govLine=({
    majority:"Your party won an outright majority — the cabinet had a free hand.",
    coalition:"A coalition government was formed with your party at the table.",
    minority:"A fragile minority cabinet limped from vote to vote.",
    opposition:"Your party sat in opposition, watching from the benches.",
    noparliament:"Parliament never formed — caretakers ran the country for months.",
    threshold:"Your party was left outside parliament entirely."
  })[S.ending]||"The country muddled through four years of coalition politics.";
  const nat=(r.natShare&&r.natShare.player)||0;
  const drift=nat>=0.30?"Your campaign's message aged well — polling drifted slightly up."
    :nat>=0.15?"Your support held steady in the polls."
    :"Your support faded in the polls — the drop was unmistakable.";
  const lines=[
    S.party.abbr+" finished the term with "+ps+" seats ("+pct(nat)+" of the vote).",
    govLine,
    "Your ministers didn't do their job: "+pick(MINISTER_OUTCOMES)+".",
    pick(TERM_ECONOMY)+".",
    pick(TERM_SOCIETY)+".",
    drift,
    "Year 1 — "+pick(MINISTER_OUTCOMES)+".",
    "Year 2 — "+pick(MINISTER_OUTCOMES)+".",
    "Year 3 — "+pick(MINISTER_OUTCOMES)+".",
    "Year 4 — "+pick(MINISTER_OUTCOMES)+"."
  ];
  S.termHistory.push({term:S.term,ending:S.ending,seats:ps,lines:lines});
  S.termReport=lines;
}
function renderReviewScreen(){
  $("review-title").textContent="State of the Nation — 4 years of "+termTitle().toLowerCase();
  const termNo=$("review-term");
  if(termNo)termNo.textContent="Term "+S.term+" of "+TERM_MAX;
  const el=$("review-list");
  el.innerHTML=(S.termReport||[]).map(l=>'<div class="rv-entry">'+esc(l)+'</div>').join("");
}
function beginNextTerm(){
  S.term++;
  S.results=null;S.coalition=null;S.ending=null;S.interview=null;S.government=null;S.electionNight=null;S.termReport=null;
  S.partyMachine=defaultPartyMachine();
  S.cheatFloor=false;
  startCampaign();
  log("TERM "+S.term+" BEGINS — four years have passed, and the country has changed.","info");
  updateAll();
  saveGame();
}

function endingInfo(){
  const r=S.results||{seats:{},natShare:{}};
  const ps=r.seats.player||0;
  const C=S.coalition;
  let title="",text="";
  if(S.ending==="threshold"){
    title="Below the 4% Threshold";
    text=S.party.name+" finished with "+pct(r.natShare.player||0)+" of the national vote — short of the 4% barrier. No seats in the Narodno Subranie, no coalition calls, no second chances.\n\n"+S.player.name+" announces 'we will be back' — and means it.";
    if(S.government){
      text+="\n\nMeanwhile, "+S.government.parties.map(p=>partyOf(p).abbr).join(" + ")+" form a government with "+S.government.seats+" seats.";
    }else{
      text+="\n\nNo two or three parties can reach "+MAJORITY+" seats — the President dissolves parliament. New elections are coming soon.";
    }
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
    const gov=S.government;
    if(gov){
      const gtxt=gov.parties.map(p=>partyName(partyOf(p))).join(" and ");
      text=(S.coalition&&S.coalition.playerFirst?"Despite finishing first, "+S.player.name+" cannot stitch together "+MAJORITY+" seats. Negotiations fail. ":"Negotiations collapse and the winners form a government without you. ")
        +gtxt+" form a government with "+gov.seats+" seats.\n\n"+S.party.abbr+"'s "+ps+" MPs take the opposition benches. "+S.player.name+" promises to hold them accountable 'every single day'.";
    }else{
      text="Negotiations collapse and the winners form a government without you.\n\n"+S.party.abbr+"'s "+ps+" MPs take the opposition benches. "+S.player.name+" promises to hold them accountable 'every single day'.";
    }
  }else if(S.ending==="noparliament"){
    title="No Parliament Formed";
    text="No two or three parties can bridge their differences to reach "+MAJORITY+" seats. The President dissolves the Narodno Subranie and appoints a caretaker cabinet.\n\nNew elections are coming — sooner than anyone expected, and "+S.player.name+" will be back on the trail.";
  }else{
    title="Mandate Failed";
    text="Despite finishing first, "+S.player.name+" cannot stitch together "+MAJORITY+" seats. The President dissolves the Narodno Subranie and appoints a caretaker government.\n\nSnap elections loom — and your rivals will remember what you promised them.";
  }
  if(S.cheat)text+="\n\n(Played in CHEAT MODE.)";
  if(S.kosyo)text+="\n\nKing Kosyo now rules over Bulgaria. Read 'em and weep.";
  return{title:title,text:text};
}
function renderEndScreen(){
  const r=S.results||{seats:{},natShare:{}};
  const ps=r.seats.player||0;
  const info=endingInfo();
  let title=info.title,text=info.text;
  $("end-banner").style.cssText=BGSTYLES[S.party.bgStyle](S.party.color,shade(S.party.color,.6));
  $("end-banner").innerHTML=bannerInner();
  $("end-title").textContent=title+" — Term "+S.term+" of "+TERM_MAX;
  const nextBtn=$("btn-next-term");
  if(nextBtn)nextBtn.style.display=S.term<TERM_MAX?"":"none";
  $("end-text").textContent=text;
  $("end-stats").innerHTML=[
    ["Seats won",ps],["National vote",pct(r.natShare.player||0)],["Rallies",S.stats.rallies],
    ["Media ads",S.stats.ads],["HQs built",S.stats.hqs],["Weeks on trail",20]
  ].map(x=>'<div class="end-stat"><b>'+x[1]+'</b>'+x[0]+'</div>').join("");
  renderRunCardPreview();
}

/* ---- T19: shareable run card (1200x675 canvas, 2x export) ---- */
function runCardData(){
  const r=S.results||{seats:{},natShare:{}};
  const tally=Object.keys(r.seats).sort((a,b)=>(r.seats[b]||0)-(r.seats[a]||0))
    .filter(k=>(r.seats[k]||0)>0)
    .map(k=>({id:k,seats:r.seats[k]||0,color:partyOf(k).color,abbr:partyOf(k).abbr}));
  return{
    party:{name:S.party.name,abbr:S.party.abbr,color:S.party.color,slogan:S.party.slogan,bgStyle:S.party.bgStyle,emblemIdx:S.party.emblemIdx},
    player:{name:S.player.name,face:S.player.face,appearance:S.player.appearance,photo:S.player.photo},
    info:endingInfo(),
    term:S.term,ending:S.ending,
    seats:r.seats.player||0,natShare:r.natShare.player||0,tally:tally,
    stats:{...S.stats},
    cheat:S.cheat,kosyo:S.kosyo
  };
}
function drawGridPortrait(ctx,x,y,scale,cfg){
  const female=cfg.gender==="female",skin=SKIN_TONES[cfg.skin]||SKIN_TONES[2];
  const hair=cfg.hairColor||HAIR_COLORS[0],suit=cfg.suitColor||SUIT_COLORS[0],shirt=cfg.shirtColor||SHIRT_COLORS[0];
  const C={K:skin,H:hair,N:shade(skin,.72),E:"#24252b",M:female?"#9e3d50":"#7a2d25",m:"#d9828b",S:suit,T:shirt};
  const layers=[[PIXEL_FACE.FACE,0],[female?PIXEL_FACE.FEATURES.female:PIXEL_FACE.FEATURES.male,0],[PIXEL_FACE.HAIR[cfg.hairStyle]||PIXEL_FACE.HAIR.short,0],[PIXEL_FACE.SUIT[cfg.suitStyle]||PIXEL_FACE.SUIT.classic,13]];
  layers.forEach(([g,y0])=>g.forEach((row,rowI)=>{
    for(let col=0;col<row.length;col++){
      const c=C[row[col]];
      if(c){ctx.fillStyle=c;ctx.fillRect(x+col*scale,y+(rowI+y0)*scale,scale,scale);}
    }
  }));
}
function drawRunCard(canvas,data){
  const ctx=canvas.getContext("2d");
  if(!ctx)return;
  const W=1200,H=675,s=canvas.width/W;
  ctx.setTransform(s,0,0,s,0,0);
  ctx.fillStyle="#f4f0e6";ctx.fillRect(0,0,W,H);
  const c=data.party.color,light=shade(c,1.18),dark=shade(c,.62);
  // banner strip
  const bg=ctx.createLinearGradient(0,0,0,150);
  bg.addColorStop(0,light);bg.addColorStop(.6,c);bg.addColorStop(1,dark);
  ctx.fillStyle=bg;ctx.fillRect(0,0,W,150);
  // flag stripes
  ctx.fillStyle="#fff";ctx.fillRect(28,26,18,18);
  ctx.fillStyle="#00966e";ctx.fillRect(46,26,18,18);
  ctx.fillStyle="#d62612";ctx.fillRect(64,26,18,18);
  ctx.fillStyle="#fff";
  ctx.font="bold 54px 'Pixelated MS Sans Serif','Press Start 2P',monospace";
  ctx.textBaseline="middle";
  ctx.fillText(data.party.abbr+" — "+data.player.name,110,56);
  ctx.font="26px 'Pixelated MS Sans Serif',monospace";
  ctx.fillStyle="#f0f4ff";
  ctx.fillText(data.party.name+' — "'+data.party.slogan+'"',110,106);
  // portrait
  const px=60,py=200,psize=132;
  ctx.fillStyle="#d8d8d8";ctx.fillRect(px-6,py-6,psize+12,psize+12);
  ctx.fillStyle=data.party.color;ctx.fillRect(px,py,psize,psize);
  if(data.player.photo&&data.portraitImg){
    ctx.drawImage(data.portraitImg,px,py,psize,psize);
  }else{
    drawGridPortrait(ctx,px+(psize-16*4)/2,py+(psize-16*4)/2,4,{...data.player.appearance,hairStyle:data.player.appearance.hairStyle||"short",suitStyle:data.player.appearance.suitStyle||"classic"});
  }
  ctx.fillStyle="#1b1b1b";
  ctx.font="bold 30px 'Pixelated MS Sans Serif',monospace";
  ctx.fillText(data.player.name,px-4,py+psize+46);
  ctx.font="22px 'Pixelated MS Sans Serif',monospace";
  ctx.fillStyle="#555";
  ctx.fillText(data.party.name+" ("+data.party.abbr+")",px-4,py+psize+80);
  // result block
  ctx.fillStyle="#000080";
  ctx.font="bold 44px 'Pixelated MS Sans Serif',monospace";
  ctx.fillText(data.info.title,250,205);
  ctx.fillStyle="#333";
  ctx.font="26px 'Pixelated MS Sans Serif',monospace";
  ctx.fillText("Term "+data.term+" of 3 · "+data.seats+" seats ("+(data.natShare*100).toFixed(1)+"% of the vote)",250,255);
  // seat tally bar
  const bx=250,by=300,bw=880,bh=34;
  ctx.fillStyle="#d8d8d8";ctx.fillRect(bx,by,bw,bh);
  let acc=bx;
  const total=data.tally.reduce((a,t)=>a+t.seats,0)||1;
  for(const t of data.tally){
    const w=bw*t.seats/total;
    ctx.fillStyle=t.color;ctx.fillRect(acc,by,w,bh);
    acc+=w;
  }
  ctx.strokeStyle="#1b1b1b";ctx.lineWidth=2;ctx.strokeRect(bx,by,bw,bh);
  // legend
  let lx=bx,ly=by+bh+34;
  data.tally.slice(0,10).forEach((t,idx)=>{
    const label=t.abbr+" "+t.seats;
    ctx.font="20px 'Pixelated MS Sans Serif',monospace";
    const w=ctx.measureText(label).width+34;
    if(lx+w>W-20){lx=bx;ly+=34;}
    ctx.fillStyle=t.color;ctx.fillRect(lx,ly-16,16,16);
    ctx.strokeStyle="#1b1b1b";ctx.lineWidth=1;ctx.strokeRect(lx,ly-16,16,16);
    ctx.fillStyle="#1b1b1b";ctx.fillText(label,lx+24,ly);
    lx+=w+18;
  });
  // campaign stats
  const stats=[["Rallies",data.stats.rallies],["Ads",data.stats.ads],["HQs",data.stats.hqs],["Campaigns",data.stats.campaigns],["Weeks",20],["Term",data.term+" / 3"]];
  ctx.font="24px 'Pixelated MS Sans Serif',monospace";
  stats.forEach((st,idx)=>{
    const x=250+idx*150;
    ctx.fillStyle="#000080";ctx.fillText(st[0],x,500);
    ctx.fillStyle="#1b1b1b";ctx.fillText(String(st[1]),x,540);
  });
  // footer
  ctx.fillStyle="#888";
  ctx.font="20px 'Pixelated MS Sans Serif',monospace";
  ctx.fillText("121 TO WIN — Bulgaria's answer to 280 to win",250,620);
  if(data.cheat){ctx.fillStyle="#8a6d00";ctx.fillRect(250,430,200,44);ctx.strokeStyle="#1b1b1b";ctx.strokeRect(250,430,200,44);ctx.fillStyle="#fff";ctx.font="bold 24px 'Pixelated MS Sans Serif',monospace";ctx.fillText("CHEAT MODE",262,458);}
  if(data.kosyo){ctx.fillStyle="#8a1f1f";ctx.fillRect(460,430,320,44);ctx.strokeStyle="#1b1b1b";ctx.strokeRect(460,430,320,44);ctx.fillStyle="#fff";ctx.font="bold 22px 'Pixelated MS Sans Serif',monospace";ctx.fillText("KING KOSYO RULES",474,458);}
}
let runCardImg=null;
function renderRunCardPreview(){
  const cv=$("run-card");
  if(!cv)return;
  cv.width=1200;cv.height=675;
  const data=runCardData();
  const draw=()=>{try{drawRunCard(cv,data);}catch(e){}};
  if(data.player.photo){
    const img=new Image();
    img.onload=()=>{data.portraitImg=img;draw();};
    img.onerror=draw;
    img.src=data.player.photo;
  }else draw();
}
function downloadRunCard(){
  const cv=document.createElement("canvas");
  cv.width=2400;cv.height=1350;
  const data=runCardData();
  const save=()=>{
    drawRunCard(cv,data);
    const a=document.createElement("a");
    a.download="121towin-"+String(data.party.abbr).toLowerCase().replace(/[^a-z0-9]/g,"")+"-"+String(data.ending||"result")+".png";
    a.href=cv.toDataURL("image/png");
    document.body.appendChild(a);a.click();a.remove();
  };
  if(data.player.photo){
    const img=new Image();
    img.onload=()=>{data.portraitImg=img;save();};
    img.onerror=save;
    img.src=data.player.photo;
  }else save();
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

function normHex(h){
  h=String(h||"").trim();
  if(/^#[0-9a-f]{6}$/i.test(h))return h.toLowerCase();
  if(/^[0-9a-f]{6}$/i.test(h))return "#"+h.toLowerCase();
  if(/^#[0-9a-f]{3}$/i.test(h))return "#"+h[1]+h[1]+h[2]+h[2]+h[3]+h[3];
  return null;
}

function setPartyColor(hex){
  const n=normHex(hex);
  if(!n||!S)return false;
  S.party.color=n;
  renderSwatches();
  renderBannerPreview();
  return true;
}

function renderSwatches(){
  $("color-swatches").innerHTML=PALETTE.map(c=>'<div class="swatch '+(S.party.color===c?"sel":"")+'" data-c="'+c+'" style="background:'+c+'"></div>').join("");
  document.querySelectorAll("#color-swatches .swatch").forEach(s=>{
    s.onclick=()=>setPartyColor(s.dataset.c);
  });
  const ci=$("in-party-color");
  if(ci)ci.value=S.party.color;
  const hx=$("in-party-hex");
  if(hx){hx.value=S.party.color.toUpperCase();hx.classList.remove("invalid");}
}

const COMPASS_AXES={
  euro:[.52,.02],corruption:[.22,-.34],energy:[-.34,.20],judiciary:[.18,-.40],
  pensions:[-.38,.12],healthcare:[-.08,.45],defense:[.28,.48],rural:[-.24,-.10],migration:[.24,.42]
};
function clampCompass(x,y){return{x:clamp(x,-1,1),y:clamp(y,-1,1)};}
function compassLabel(x,y){
  const horizontal=x<-.2?"Left":x>.2?"Right":"Center";
  const vertical=y<-.2?"Libertarian":y>.2?"Authoritarian":"Center";
  return vertical+" "+horizontal;
}
function renderCompass(){
  const el=$("political-compass");
  if(!el||!S)return;
  if(!S.party.compass)S.party.compass={x:0,y:0};
  const pos=clampCompass(S.party.compass.x,S.party.compass.y);
  S.party.compass=pos;
  const marker=$("compass-marker");
  if(marker){marker.style.left=((pos.x+1)*50)+"%";marker.style.top=((1-pos.y)*50)+"%";marker.title=compassLabel(pos.x,pos.y);}
  const readout=$("compass-position");
  if(readout)readout.textContent=compassLabel(pos.x,pos.y)+" · "+(pos.x>=0?"economic right":"economic left")+" · "+(pos.y>=0?"more authority":"more liberty");
  if(!el.dataset.bound){
    el.dataset.bound="1";
    let dragging=false;
    const dragPosition=e=>{
      const r=el.getBoundingClientRect();
      if(!r.width||!r.height)return;
      setCompassPosition((e.clientX-r.left)/r.width*2-1,1-(e.clientY-r.top)/r.height*2);
    };
    el.addEventListener("click",e=>{
      if(!dragging)dragPosition(e);
    });
    el.addEventListener("pointerdown",e=>{
      dragging=true;
      el.classList.add("dragging");
      if(el.setPointerCapture)el.setPointerCapture(e.pointerId);
      dragPosition(e);
      e.preventDefault();
    });
    el.addEventListener("pointermove",e=>{if(dragging)dragPosition(e);});
    const stopDrag=()=>{dragging=false;el.classList.remove("dragging");};
    el.addEventListener("pointerup",stopDrag);
    el.addEventListener("pointercancel",stopDrag);
    el.addEventListener("lostpointercapture",stopDrag);
    el.addEventListener("keydown",e=>{
      if(!["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(e.key))return;
      e.preventDefault();
      const step=e.shiftKey?.2:.05,p=S.party.compass||{x:0,y:0};
      setCompassPosition(p.x+(e.key==="ArrowRight"?step:e.key==="ArrowLeft"?-step:0),p.y+(e.key==="ArrowUp"?step:e.key==="ArrowDown"?-step:0));
    });
  }
}
function applyCompassToPlatform(){
  const p=S.party.compass||{x:0,y:0};
  for(const issue of ISSUE_POOL){
    const axis=COMPASS_AXES[issue.id]||[0,0];
    S.party.pos[issue.id]=clamp(.5+axis[0]*p.x+axis[1]*p.y,0,1);
  }
}
function setCompassPosition(x,y){
  if(!S)return;
  S.party.compass=clampCompass(x,y);
  applyCompassToPlatform();
  document.querySelectorAll("#platform-sliders input").forEach(inp=>{
    const v=Math.round(S.party.pos[inp.dataset.issue]*100);
    inp.value=v;
    const label=$("plv-"+inp.dataset.issue);
    if(label)label.textContent=v;
  });
  renderCompass();
}
function syncCompassFromPlatform(){
  if(!S)return;
  let rx=0,ry=0,xx=0,xy=0,yy=0;
  for(const issue of ISSUE_POOL){
    const axis=COMPASS_AXES[issue.id]||[0,0],delta=(S.party.pos[issue.id]||0)-.5;
    rx+=delta*axis[0];ry+=delta*axis[1];xx+=axis[0]*axis[0];xy+=axis[0]*axis[1];yy+=axis[1]*axis[1];
  }
  const det=xx*yy-xy*xy;
  S.party.compass=det?clampCompass((rx*yy-ry*xy)/det,(ry*xx-rx*xy)/det):{x:0,y:0};
  renderCompass();
}
function renderPlatformSliders(){
  const act=activeIssueList();
  $("platform-sliders").innerHTML=act.map(i=>
    '<div class="platform-row"><div class="pr-top"><span>'+i.name+'</span><span id="plv-'+i.id+'"></span></div>'
    +'<input type="range" min="0" max="100" value="'+Math.round(S.party.pos[i.id]*100)+'" data-issue="'+i.id+'">'
    +'<div class="pr-ends"><span>'+i.lo+'</span><span>'+i.hi+'</span></div></div>'
  ).join("");
  document.querySelectorAll("#platform-sliders input").forEach(inp=>{
    inp.addEventListener("input",()=>{
      S.party.pos[inp.dataset.issue]=+inp.value/100;
      $("plv-"+inp.dataset.issue).textContent=inp.value;
      syncCompassFromPlatform();
    });
    $("plv-"+inp.dataset.issue).textContent=inp.value;
  });
  syncCompassFromPlatform();
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
    +'Platform: '+activeIssueList().map(i=>i.name+" "+Math.round(S.party.pos[i.id]*100)).join(" · ")
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
  randomizeNewGame();
  drawActiveIssues();
  buildEventPool();
  $("in-cand-name").value=S.player.name;
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

function randomizeNewGame(){
  const app=defaultAppearance();
  app.skin=rnd(0,SKIN_TONES.length-1);
  app.hairColor=pick(HAIR_COLORS);
  app.hairStyle=pick(HAIR_STYLES);
  app.suitColor=pick(SUIT_COLORS);
  app.shirtColor=pick(SHIRT_COLORS);
  app.suitStyle=pick(SUIT_STYLES);
  app.gender=Math.random()<0.5?"male":"female";
  app.ethnicity=pick(["bulgarian","bulgarian","bulgarian","turkish","roma"]);
  app.glasses=Math.random()<0.3;
  app.bg=pick(FACES.map(f=>f.bg));
  S.player.appearance=app;
  S.player.face=-1;
  S.player.photo=null;
  const a=[rnd(1,8),rnd(1,8),rnd(1,8)];
  while(a[0]+a[1]+a[2]>15){
    a[a.indexOf(Math.max.apply(null,a))]--;
  }
  S.player.attrs={stamina:a[0],charisma:a[1],intelligence:a[2]};
  S.player.name=pick(CANDIDATE_NAMES);
  S.party.color=pick(PALETTE);
  S.party.bgStyle=rnd(0,BGSTYLES.length-1);
  S.party.emblemIdx=rnd(0,EMBLEM_IDS.length-1);
}

function startCampaign(){
  if(!S)S=freshState();
  if(!S.player.appearance)S.player.appearance=Object.assign(defaultAppearance(),FACES[S.player.face||0]||{});
  if(!S.player.name)S.player.name="Aleksandar Vasilev";
  if(!S.party.name)S.party.name="National Renewal Movement";
  if(!S.party.abbr)S.party.abbr=S.party.name.split(/\s+/).map(w=>w[0]).join("").toUpperCase().slice(0,5);
  S.cheat=!!(S.player.name&&S.player.name.trim().toUpperCase()==="EASY WIN");
  S.diksy=!!(S.player.name&&S.player.name.trim().toUpperCase()==="DIKSY");
  S.kosyo=!!(S.player.name&&S.player.name.trim().toUpperCase()==="KONSTANTIN MILEV");
  S.cheatFloor=false;
  if(!S.activeIssues||!S.activeIssues.length)drawActiveIssues();
  S.debateWeek=14+rnd(0,2);
  S.debateDone=false;
  S.debate=null;
  S.pigWeek=17+rnd(0,1);
  S.pigPending=rng()<0.80;
  S.pigDone=false;
  S.pigRaid=rng()<0.025;
  S.virusDone=false;
  S.virusLoss=null;
  S.phase="campaign";
  S.week=1;
  S.cash=DIFFS[S.difficulty].cash;
  S.stamina=getMaxStamina();
  S.location="sofia-city";
  S.selDistrict="sofia-city";
  S.hq={};S.boost={};S.enthusiasm={};S.modifiers=[];S.rel={};S.touched=[];S.ralliesThisTurn=0;
  S.paused=false;
  newsSeeded=false;
  S.debugBoost={};S.cheatEasyWin=false;
  rollPerformance();
  S.log=[];
  S.stats={rallies:0,ads:0,hqs:0,travels:0,campaigns:0};
  S.cashHist=[];
  for(const d of DISTRICTS){
    S.enthusiasm[d.id]=d.ent;
    S.boost[d.id]={};
    for(const p of AI_PARTIES){
      if(p.focus&&p.focus.indexOf(d.id)<0)continue;
      if(d.lean&&d.lean[p.id])S.boost[d.id][p.id]=d.lean[p.id]*0.3;
    }
  }
  S.boost["sofia-city"].player=0.02;
  buildEventPool();
  S.eventBag=shuffle([...Array(EVENT_POOL.length).keys()]);
  S.eventCursor=0;
  S.eventQueue=[];
  recomputePolls();
  S.pollsPrev=null;
  buildMap();
  showScreen("game");
  log("The campaign begins. "+ELECTION_DATE+" is 20 weeks away. First stop: <b>Sofia</b>.","info");
  log("National poll: <b>"+esc(S.party.abbr)+"</b> at "+pct(S.pollNat.player||0)+". Threshold: 4%.","info");
  for(const line of performanceLines())log("CAMPAIGN FORM — <b>"+esc(line)+"</b>.","info");
  if(S.cheat)log("CHEAT MODE ENABLED — the gods smile upon <b>"+esc(S.player.name)+"</b>.","info");
  updateAll();
  if(S.diksy){ensureDiksyObserver();diksyOverlay();}
  saveGame();
}

function bindUI(){
  $("btn-new-game").onclick=initSetup;
  $("btn-continue").onclick=()=>{if(!loadGame())alert("No save found.");};
  $("btn-title-help").onclick=helpModal;
  $("tb-cash").onclick=openFundsModal;
  $("hud-cash").onclick=openFundsModal;

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
  $("sel-ethnicity").addEventListener("change",e=>{if(S&&S.player.appearance){S.player.appearance.ethnicity=e.target.value;renderAppearanceUI();renderPortraitPreview();}});
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
  $("in-party-color").addEventListener("input",e=>{setPartyColor(e.target.value);});
  $("in-party-hex").addEventListener("input",e=>{
    if(!S)return;
    const v=e.target.value;
    if(normHex(v)){setPartyColor(v);e.target.classList.remove("invalid");}
    else e.target.classList.add("invalid");
  });
  $("in-party-hex").addEventListener("change",e=>{
    if(!S)return;
    if(!normHex(e.target.value))e.target.value=S.party.color.toUpperCase();
    e.target.classList.remove("invalid");
  });
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
    if(!S.interview)startInterview();
    else continueAfterInterview();
  };
  $("btn-election-skip").onclick=finishElectionNight;

  $("btn-form-gov").onclick=()=>finishGame("coalition");
  $("btn-minority").onclick=()=>finishGame("minority");
  $("btn-give-up").onclick=()=>finishGame(S.coalition&&S.coalition.playerFirst?"caretaker":"opposition");

  $("btn-restart").onclick=()=>location.reload();
  $("btn-next-term").onclick=startTimeSkip;
  $("btn-term-continue").onclick=beginNextTerm;
  const dlBtn=$("btn-download-card");
  if(dlBtn)dlBtn.onclick=downloadRunCard;

  $("btn-panel-toggle").onclick=toggleDrawer;
  const backdrop=$("drawer-backdrop");
  if(backdrop)backdrop.onclick=closeDrawer;
  const logBar=$("log-bar");
  if(logBar&&logBar.querySelector(".title-bar"))logBar.querySelector(".title-bar").addEventListener("click",()=>logBar.classList.toggle("collapsed"));
  mapZoomInit();
}

function init(){
  bindUI();
  applyMobileLayout();
  bindRallyPopOutsideClose();
  bindMobilePreviewSafety();
  document.querySelectorAll(".diff-opt").forEach(o=>{
    if(o.querySelector("input").checked)o.classList.add("picked");
  });
  if(hasSave())$("btn-continue").style.display="";
  startAliveLoop();
}

if(typeof document!=="undefined"){
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);
  else init();
}

if(typeof module!=="undefined"&&module.exports){
  module.exports={
    DISTRICTS:DISTRICTS,AI_PARTIES:AI_PARTIES,dhondt:dhondt,TOTAL_SEATS:TOTAL_SEATS,DIFFS:DIFFS,
    state:()=>S,freshState:freshState,startCampaign:startCampaign,endTurn:endTurn,runElection:runElection,
    startCoalition:startCoalition,coalitionSeats:coalitionSeats,fulfillDemand:fulfillDemand,finishGame:finishGame,
    startInterview:startInterview,continueAfterInterview:continueAfterInterview,leftistParty:leftistParty,
    findAICoalition:findAICoalition,partyViewDist:partyViewDist,COALITION_VIEW_MAX:COALITION_VIEW_MAX,getMaxStamina:getMaxStamina,
    startTimeSkip:startTimeSkip,beginNextTerm:beginNextTerm,buildTermReview:buildTermReview,TERM_MAX:TERM_MAX,
    runCardData:runCardData,drawRunCard:drawRunCard,downloadRunCard:downloadRunCard,drawGridPortrait:drawGridPortrait,endingInfo:endingInfo,
    diksyOverlay:diksyOverlay,ensureDiksyObserver:ensureDiksyObserver,openModal:openModal,closeModal:closeModal,redrawMap:redrawMap,
    doRally:doRally,travelTo:travelTo,buyAd:buyAd,buildHQ:buildHQ,districtShares:districtShares,nationalShares:nationalShares,
    previewRally:previewRally,previewAd:previewAd,previewHQ:previewHQ,previewTravel:previewTravel,rallyGainFor:rallyGainFor,adGainFor:adGainFor,previewLine:previewLine,
    candidateModifiers:candidateModifiers,rollPerformance:rollPerformance,performanceLines:performanceLines,districtsWhere:districtsWhere,renderDistrictDetail:renderDistrictDetail,faceSVG:faceSVG,defaultAppearance:defaultAppearance,PIXEL_FACE:PIXEL_FACE,
    portraitHTML:portraitHTML,
    defaultPartyMachine:defaultPartyMachine,launchCampaign:launchCampaign,allocateStaff:allocateStaff,hireStaff:hireStaff,trainStaff:trainStaff,upgradePartyHQ:upgradePartyHQ,
    partyEnergyMax:partyEnergyMax,partyStaffCap:partyStaffCap,partyUpkeep:partyUpkeep,partyQuality:partyQuality,partyHireCost:partyHireCost,partyTrainCost:partyTrainCost,partyHqUpgradeCost:partyHqUpgradeCost,
    releaseCampaign:releaseCampaign,partyMachineTick:partyMachineTick,aiFlavorCampaign:aiFlavorCampaign,stanceLabel:stanceLabel,renderPartyMachine:renderPartyMachine,CAMPAIGN_CAP:CAMPAIGN_CAP,PHASE_NAMES:PHASE_NAMES,
    SKIN_TONES:SKIN_TONES,HAIR_STYLES:HAIR_STYLES,SUIT_STYLES:SUIT_STYLES,ETHNICITY_NAMES:ETHNICITY_NAMES,
    PALETTE:PALETTE,HAIR_COLORS:HAIR_COLORS,SUIT_COLORS:SUIT_COLORS,SHIRT_COLORS:SHIRT_COLORS,
    saveGame:saveGame,loadGame:loadGame,recomputePolls:recomputePolls,
    setPartyColor:setPartyColor,normHex:normHex,BGSTYLES:BGSTYLES,BGSTYLE_NAMES:BGSTYLE_NAMES,contrast:contrast,EMBLEM_IDS:EMBLEM_IDS,emblemSVG:emblemSVG,
    applyFx:applyFx,logEntriesHTML:logEntriesHTML,EVENT_POOL:()=>EVENT_POOL,
    activeIssueList:activeIssueList,activeWeights:activeWeights,issActive:issActive,ISSUE_POOL:ISSUE_POOL,drawActiveIssues:drawActiveIssues,
    setCompassPosition:setCompassPosition,syncCompassFromPlatform,COMPASS_AXES:COMPASS_AXES,
    debateAnswer:debateAnswer,startDebate:startDebate,buildDebateQuestions:buildDebateQuestions,damageControlQuestions:damageControlQuestions,DEBATE_POOL:DEBATE_POOL,
    drawEvent:drawEvent,maybeEvents:maybeEvents,
    VOICES_BULGARISM:VOICES_BULGARISM,VOICES_POLL:VOICES_POLL,voiceCtx:voiceCtx,fillVoice:fillVoice,pickPollVoice:pickPollVoice,aliveQuote:aliveQuote,
    spawnAliveVoice:spawnAliveVoice,aliveLayer:aliveLayer,aliveActive:aliveActive,aliveKillAll:aliveKillAll,startAliveLoop:startAliveLoop,aliveCountNow:()=>aliveCountNow,ALIVE_MAX:ALIVE_MAX,
    aliveWrap:aliveWrap,ALIVE_MIN_WAIT:ALIVE_MIN_WAIT,
    openFundsModal:openFundsModal,weeklyIncomeBreakdown:weeklyIncomeBreakdown,renderDistrictCard:renderDistrictCard,
    isMobileUI:isMobileUI,renderMobileActions:renderMobileActions,applyMobileLayout:applyMobileLayout,actionButtonsHtml:actionButtonsHtml,
    pushNews:pushNews,seedMobileNews:seedMobileNews,bindRallyPopOutsideClose:bindRallyPopOutsideClose,
    electionNightPoll:electionNightPoll,electionNightClock:electionNightClock,electionNightLeader:electionNightLeader,startElectionNight:startElectionNight,finishElectionNight:finishElectionNight,
    PIG_EVENTS:PIG_EVENTS,PIG_RAID:PIG_RAID,startPigEvent:startPigEvent,renderPigEvent:renderPigEvent,pigAnswer:pigAnswer,
    VIRUS_RATE:VIRUS_RATE,virusRoll:virusRoll,virusDisarm:virusDisarm,startVirusEvent:startVirusEvent,
    virusArrive:virusArrive,virusContinue:virusContinue,virusSkipTurns:virusSkipTurns,zoomToDistrict:zoomToDistrict,
    debugModal:debugModal,
    mapZoom:()=>mapZoom,
    checkJoin:checkJoin,willOf:willOf,REL_MATRIX:REL_MATRIX,INCOMPAT_PAIRS:INCOMPAT_PAIRS,
    setPlayer:(cfg)=>{
      if(!S)S=freshState();
      if(cfg.attrs)Object.assign(S.player.attrs,cfg.attrs);
      if(cfg.name)S.player.name=cfg.name;
      if(cfg.pos)Object.assign(S.party.pos,cfg.pos);
      if(cfg.abbr)S.party.abbr=cfg.abbr;
      if(cfg.difficulty)S.difficulty=cfg.difficulty;
    }
  };
}
