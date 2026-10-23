/* =====================================================================
   Mathe Mission 5 — Fortschritt & Speicherung (localStorage)
   Kein Login, keine Cloud, keine personenbezogenen Daten.
   ===================================================================== */
var KEY = 'mathe-mission-5';

var LEVELS = [
  {n:1, name:'Mathe Starter',    xp:0},
  {n:2, name:'Zahlenprofi',      xp:150},
  {n:3, name:'Rechenkünstler',   xp:400},
  {n:4, name:'Mathe Explorer',   xp:800},
  {n:5, name:'Mathe Champion',   xp:1400},
  {n:6, name:'Mathe Master',     xp:2200},
  {n:7, name:'Mathe Legende',    xp:3200},
  {n:8, name:'Großmeister',      xp:4500}
];

var ERFOLGE = [
  {id:'xp100',   icon:'🏆', titel:'Erste 100 XP',        text:'Sammle 100 XP.',                  test:function(s){return s.xp>=100;}},
  {id:'serie10', icon:'🎯', titel:'10 ohne Fehler',      text:'Löse 10 Aufgaben in Folge richtig.',test:function(s){return s.maxSerie>=10;}},
  {id:'profi',   icon:'🧠', titel:'Mathe-Profi',         text:'Erreiche Level 4.',                test:function(s){return levelVon(s.xp).n>=4;}},
  {id:'streak7', icon:'🔥', titel:'7 Tage Lernserie',    text:'Lerne an 7 Tagen hintereinander.', test:function(s){return s.streak.tage>=7;}},
  {id:'kapitel', icon:'📚', titel:'Kapitel geschafft',   text:'Schließe ein ganzes Kapitel ab.',  test:function(s){return KAPITEL.some(function(k){return kapitelFortschritt(k)>=100;});}},
  {id:'test100', icon:'⭐', titel:'Perfekter Test',      text:'Schreibe einen Test ohne Fehler.', test:function(s){return s.tests.some(function(t){return t.prozent>=100;});}},
  {id:'arbeit',  icon:'🚨', titel:'Klassenarbeit bereit',text:'Schließe eine Probe-Klassenarbeit ab.',test:function(s){return s.tests.some(function(t){return t.typ==='arbeit';});}},
  {id:'a100',    icon:'💯', titel:'100 Aufgaben',        text:'Bearbeite 100 Aufgaben.',          test:function(s){return gesamtAufgaben(s)>=100;}},
  {id:'spiel',   icon:'🎮', titel:'Spieler',             text:'Spiele alle drei Mathe-Spiele.',   test:function(s){return s.spiele.rennen>0&&s.spiele.jagd>0&&s.spiele.puzzle>0;}},
  {id:'schwach', icon:'💪', titel:'Schwäche besiegt',    text:'Bringe ein rotes Thema auf grün.',  test:function(s){return s.besiegt>0;}}
];

function heute(){ var d=new Date(); return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2); }
function tageDiff(a,b){ return Math.round((new Date(b)-new Date(a))/86400000); }
function datumDE(iso){ if(!iso) return '—'; var p=iso.split('-'); return p[2]+'.'+p[1]+'.'+p[0]; }

function leerState(){
  return { v:1, xp:0, themen:{}, erfolge:{}, tests:[], serie:0, maxSerie:0, besiegt:0,
    streak:{tage:0, letzterTag:null},
    lernzeit:0,
    spiele:{rennen:0, jagd:0, puzzle:0},
    daily:{datum:null, aufgaben:0, schweres:false, minitest:false, belohnt:false},
    arbeit:null,
    erstellt: heute() };
}

var S = leerState();

function ladeState(){
  try{
    var raw = localStorage.getItem(KEY);
    if(raw){ var o=JSON.parse(raw); for(var k in S) if(!(k in o)) o[k]=S[k]; S=o; }
  }catch(e){ S = leerState(); }
  pruefeTag();
  return S;
}
function speichere(){
  try{ localStorage.setItem(KEY, JSON.stringify(S)); }catch(e){}
}
function resetState(){ S = leerState(); speichere(); }

/* --- Lernserie / Tagesmission --- */
function pruefeTag(){
  var h = heute();
  if(S.daily.datum !== h){
    S.daily = {datum:h, aufgaben:0, schweres:false, minitest:false, belohnt:false};
  }
  if(!S.streak.letzterTag){ /* noch nichts gelernt */ }
  else {
    var d = tageDiff(S.streak.letzterTag, h);
    if(d > 1) S.streak.tage = 0;
  }
}
function markiereAktiv(){
  var h = heute();
  if(S.streak.letzterTag !== h){
    var d = S.streak.letzterTag ? tageDiff(S.streak.letzterTag, h) : 99;
    S.streak.tage = (d===1) ? S.streak.tage+1 : 1;
    S.streak.letzterTag = h;
  }
}

/* --- XP / Level --- */
function levelVon(xp){
  var lv = LEVELS[0];
  for(var i=0;i<LEVELS.length;i++) if(xp >= LEVELS[i].xp) lv = LEVELS[i];
  return lv;
}
function naechstesLevel(xp){
  for(var i=0;i<LEVELS.length;i++) if(xp < LEVELS[i].xp) return LEVELS[i];
  return null;
}
function levelFortschritt(xp){
  var lv=levelVon(xp), nx=naechstesLevel(xp);
  if(!nx) return 100;
  return Math.round((xp-lv.xp)/(nx.xp-lv.xp)*100);
}
function gibXP(n){
  var vorher = levelVon(S.xp).n;
  S.xp += n;
  var nachher = levelVon(S.xp).n;
  markiereAktiv();
  speichere();
  return nachher > vorher ? levelVon(S.xp) : null;
}

/* --- Themen-Statistik --- */
function themaStat(id){
  if(!S.themen[id]) S.themen[id] = {n:0, r:0, f:0, letzte:null, stufe:1, gelernt:false, letzteFalsch:[]};
  return S.themen[id];
}
function quote(id){
  var t = S.themen[id];
  if(!t || t.n===0) return null;
  return Math.round(t.r/t.n*100);
}
function status(id){
  var t = S.themen[id];
  if(!t || t.n < 3) return 'neu';
  var q = t.r/t.n;
  if(q >= 0.85) return 'gruen';
  if(q >= 0.65) return 'gelb';
  return 'rot';
}
var STATUS_INFO = { neu:{p:'⚪', t:'Noch nicht geübt'}, gruen:{p:'🟢', t:'Sicher'}, gelb:{p:'🟡', t:'Üben'}, rot:{p:'🔴', t:'Schwach'} };

function buche(themaId, richtig, stufe){
  var t = themaStat(themaId);
  var vorher = status(themaId);
  t.n++; if(richtig) t.r++; else t.f++;
  t.letzte = heute();
  if(richtig){ S.serie++; if(S.serie>S.maxSerie) S.maxSerie=S.serie;
    if(t.stufe<3 && t.n>=3 && t.r/t.n>=0.8) t.stufe = Math.min(3,(stufe||t.stufe)+1);
  } else {
    S.serie = 0;
    t.stufe = Math.max(1, (stufe||t.stufe)-1);
    t.letzteFalsch = (t.letzteFalsch||[]).concat([heute()]).slice(-5);
  }
  S.daily.aufgaben++;
  if(richtig && stufe===3) S.daily.schweres = true;
  if(vorher==='rot' && status(themaId)==='gruen') S.besiegt++;
  markiereAktiv();
  speichere();
}

function gesamtAufgaben(s){
  s = s||S; var n=0; for(var k in s.themen) n += s.themen[k].n; return n;
}
function gesamtRichtig(s){
  s = s||S; var n=0; for(var k in s.themen) n += s.themen[k].r; return n;
}
function gesamtQuote(){
  var n=gesamtAufgaben(); return n? Math.round(gesamtRichtig()/n*100) : 0;
}

/* Fortschritt eines Themas: 0..100 — basiert auf geübten Aufgaben und Erfolgsquote */
function themaFortschritt(id){
  var t = S.themen[id];
  if(!t || t.n===0) return 0;
  var menge = Math.min(1, t.n/12);
  var guete = t.r/t.n;
  return Math.round(menge*guete*100);
}
function kapitelFortschritt(k){
  var s=0; for(var i=0;i<k.themen.length;i++) s += themaFortschritt(k.themen[i].id);
  return Math.round(s/k.themen.length);
}
function gesamtFortschritt(){
  var s=0; for(var i=0;i<KAPITEL.length;i++) s += kapitelFortschritt(KAPITEL[i]);
  return Math.round(s/KAPITEL.length);
}

/* Schwächste Themen (nur bereits geübte) */
function schwaechen(max){
  var arr = [];
  for(var i=0;i<THEMEN.length;i++){
    var id = THEMEN[i].id, t = S.themen[id];
    if(t && t.n >= 3){ arr.push({id:id, titel:THEMEN[i].titel, q:Math.round(t.r/t.n*100), st:status(id)}); }
  }
  arr.sort(function(a,b){ return a.q-b.q; });
  return arr.slice(0, max||3);
}
function staerken(max){
  var arr=[];
  for(var i=0;i<THEMEN.length;i++){
    var id=THEMEN[i].id, t=S.themen[id];
    if(t && t.n>=3) arr.push({id:id, titel:THEMEN[i].titel, q:Math.round(t.r/t.n*100), st:status(id)});
  }
  arr.sort(function(a,b){return b.q-a.q;});
  return arr.slice(0, max||3);
}

/* Nächstes sinnvolles Thema */
function naechstesThema(){
  var sw = schwaechen(1);
  if(sw.length && sw[0].q < 70) return THEMA_BY_ID[sw[0].id];
  for(var i=0;i<THEMEN.length;i++){
    var t=S.themen[THEMEN[i].id];
    if(!t || t.n < 6) return THEMEN[i];
  }
  return THEMEN[R(0,THEMEN.length-1)];
}

/* --- Erfolge --- */
function pruefeErfolge(){
  var neu=[];
  for(var i=0;i<ERFOLGE.length;i++){
    var e=ERFOLGE[i];
    if(!S.erfolge[e.id] && e.test(S)){ S.erfolge[e.id]=heute(); neu.push(e); }
  }
  if(neu.length) speichere();
  return neu;
}

/* --- Klassenarbeits-Prognose --- */
function prognose(themenIds){
  var ids = themenIds && themenIds.length ? themenIds : THEMEN.map(function(t){return t.id;});
  var n=0, r=0, ungeuebt=0;
  for(var i=0;i<ids.length;i++){
    var t = S.themen[ids[i]];
    if(!t || t.n<3){ ungeuebt++; continue; }
    n += t.n; r += t.r;
  }
  if(n===0) return {stufe:'rot', text:'Noch keine Übungsdaten', q:0, ungeuebt:ungeuebt};
  var q = Math.round(r/n*100);
  var anteilUngeuebt = ungeuebt/ids.length;
  var st = (q>=85 && anteilUngeuebt<0.25) ? 'gruen' : ((q>=68 && anteilUngeuebt<0.5) ? 'gelb' : 'rot');
  var txt = st==='gruen' ? 'Gut vorbereitet' : (st==='gelb' ? 'Noch üben' : 'Intensive Wiederholung empfohlen');
  return {stufe:st, text:txt, q:q, ungeuebt:ungeuebt};
}
