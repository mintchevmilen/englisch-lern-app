/* =====================================================================
   Mathe Mission 5 — Oberfläche & Lernlogik
   ===================================================================== */
var app, stack = [], toastTimer = null;

/* ---------- Mathe-Formatierung (leichtgewichtig, kein MathJax nötig) ---------- */
function fmt(s){
  s = String(s == null ? '' : s);
  s = s.replace(/\\f\{([^{}]*)\}\{([^{}]*)\}/g,
        '<span class="frac"><span class="fz">$1</span><span class="fn">$2</span></span>');
  s = s.replace(/\^\{([^{}]+)\}/g, '<sup>$1</sup>');
  s = s.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
  s = s.replace(/\n/g, '<br>');
  return s;
}

/* ---------- Helfer ---------- */
function $(sel, root){ return (root||document).querySelector(sel); }
function $$(sel, root){ return Array.prototype.slice.call((root||document).querySelectorAll(sel)); }
function on(sel, fn){ $$(sel).forEach(function(e){ e.onclick = function(){ fn(e); }; }); }
function toast(txt, ms){
  var t = document.createElement('div'); t.className='toast'; t.innerHTML = fmt(txt);
  document.body.appendChild(t);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function(){ if(t.parentNode) t.parentNode.removeChild(t); }, ms||2200);
}
function kopf(titel, unter, zurueck){
  return '<div class="top">'+
    (zurueck===false?'':'<button class="back" id="btnBack">‹</button>')+
    '<div class="title"><b>'+fmt(titel)+'</b>'+(unter?'<span>'+fmt(unter)+'</span>':'')+'</div></div>';
}
function bar(p, kl){ return '<div class="bar '+(kl||'')+'"><i style="width:'+Math.max(0,Math.min(100,p))+'%"></i></div>'; }

/* ---------- Navigation ---------- */
function go(view, params){
  stack.push({view:view, params:params||{}});
  try{ history.pushState({i:stack.length}, ''); }catch(e){}
  render();
}
function zurueck(){
  if(stack.length > 1){ stack.pop(); render(); }
  else { stack = [{view:'home', params:{}}]; render(); }
}
window.onpopstate = function(){ if(stack.length>1){ stack.pop(); render(); } };

function render(){
  var cur = stack[stack.length-1];
  window.scrollTo(0,0);
  VIEWS[cur.view](cur.params||{});
  var b = $('#btnBack'); if(b) b.onclick = function(){ if(stack.length>1) history.back(); else zurueck(); };
}

var VIEWS = {};

/* =====================================================================
   STARTSEITE
   ===================================================================== */
VIEWS.home = function(){
  pruefeTag();
  var lv = levelVon(S.xp), nx = naechstesLevel(S.xp);
  var sw = schwaechen(3);
  var nt = naechstesThema();
  var kapAkt = KAPITEL_BY_THEMA[nt.id];
  var d = S.daily, dailyFertig = (d.aufgaben>=10 && d.schweres && d.minitest);

  var h = '';
  h += '<div class="center" style="margin:6px 0 14px">'+
       '<h1>🧮 Mathe Mission 5</h1>'+
       '<p class="small">Werde fit für deine nächste Klassenarbeit!</p></div>';

  h += '<div class="hud">'+
       '<div><b>'+lv.n+'</b><span>Level</span></div>'+
       '<div><b>'+S.xp+'</b><span>XP</span></div>'+
       '<div><b>'+S.streak.tage+' 🔥</b><span>Lernserie</span></div>'+
       '<div><b>'+gesamtFortschritt()+'%</b><span>Gesamt</span></div></div>';

  h += '<div class="card tight"><div class="row between" style="margin-bottom:6px">'+
       '<b>'+lv.name+'</b><span class="small">'+(nx? (nx.xp-S.xp)+' XP bis '+nx.name : 'Höchstes Level!')+'</span></div>'+
       bar(levelFortschritt(S.xp))+'</div>';

  /* Tagesmission */
  h += '<div class="card"><div class="row between"><h3>🎯 Deine heutige Mission</h3>'+
       (dailyFertig?'<span class="chip gruen">geschafft</span>':'<span class="small">+100 XP</span>')+'</div>'+
       '<div class="small" style="margin-top:6px">'+
       (d.aufgaben>=10?'✅':'⬜')+' 10 Aufgaben lösen <b>('+Math.min(10,d.aufgaben)+'/10)</b><br>'+
       (d.schweres?'✅':'⬜')+' 1 schwierige Aufgabe schaffen<br>'+
       (d.minitest?'✅':'⬜')+' 1 Mini-Test bestehen</div>'+
       bar(Math.round(((Math.min(10,d.aufgaben)/10)+(d.schweres?1:0)+(d.minitest?1:0))/3*100),'ok')+'</div>';

  /* Nächste Mission */
  h += '<div class="card"><h3>Nächste Mission</h3>'+
       '<div class="small">Kapitel '+kapAkt.nr+' · '+kapAkt.titel+'</div>'+
       '<div style="font-weight:700;margin:4px 0 2px">'+nt.icon+' '+fmt(nt.titel)+'</div>'+
       '<div class="small">'+fmt(nt.ziel)+'</div></div>';

  h += '<button class="btn go" id="bWeiter">▶ Weiterlernen</button>';
  h += '<button class="btn alarm" id="bArbeit">🚨 Klassenarbeit vorbereiten</button>';
  h += '<div class="grid2">'+
       '<button class="btn ghost sm" id="bKap">📚 Kapitel</button>'+
       '<button class="btn ghost sm" id="bSchwach">🎯 Meine Schwächen</button>'+
       '<button class="btn ghost sm" id="bSpiele">🎮 Spiele</button>'+
       '<button class="btn ghost sm" id="bErf">🏆 Erfolge</button>'+
       '<button class="btn ghost sm" id="bEltern">👨‍👩‍👦 Elternbereich</button>'+
       '<button class="btn ghost sm" id="bInfo">ℹ️ Info</button></div>';

  if(sw.length){
    h += '<div class="card" style="margin-top:12px"><h3>Deine aktuellen Schwächen</h3>';
    sw.forEach(function(s){
      h += '<div class="row between" style="margin-bottom:8px"><span style="font-size:14px">'+
           STATUS_INFO[s.st].p+' '+fmt(s.titel)+'</span><b class="small">'+s.q+' %</b></div>'+
           bar(s.q, s.st==='rot'?'bad':(s.st==='gelb'?'warn':'ok'));
    });
    h += '<button class="btn ghost sm" id="bTrain" style="margin-top:10px">Meine Schwächen trainieren</button></div>';
  }

  app.innerHTML = h;
  on('#bWeiter', function(){ starte({modus:'lernen', themaId:naechstesThema().id}); });
  on('#bArbeit', function(){ go('arbeit'); });
  on('#bKap',    function(){ go('kapitel'); });
  on('#bSchwach',function(){ go('schwaechen'); });
  on('#bSpiele', function(){ go('spiele'); });
  on('#bErf',    function(){ go('erfolge'); });
  on('#bEltern', function(){ go('eltern'); });
  on('#bInfo',   function(){ go('info'); });
  on('#bTrain',  function(){ starteSchwaechen(); });
};

/* =====================================================================
   KAPITEL & THEMEN
   ===================================================================== */
VIEWS.kapitel = function(){
  var h = kopf('📚 Kapitel','Dein Lernpfad');
  h += '<div class="card tight"><div class="row between"><span class="small">Gesamtfortschritt</span>'+
       '<b>'+gesamtFortschritt()+' %</b></div>'+bar(gesamtFortschritt())+'</div>';
  KAPITEL.forEach(function(k){
    var p = kapitelFortschritt(k);
    var amp = p>=80?'🟢':(p>=40?'🟡':(p>0?'🟠':'🔴'));
    h += '<button class="kap" data-k="'+k.id+'">'+
         '<span class="ic" style="background:'+k.farbe+'22">'+k.icon+'</span>'+
         '<span class="mid"><b>'+amp+' Kapitel '+k.nr+' · '+fmt(k.titel)+'</b>'+
         '<span class="small">'+k.themen.length+' Themen</span>'+bar(p)+'</span>'+
         '<span class="pct">'+p+'%</span></button>';
  });
  app.innerHTML = h;
  on('.kap', function(e){ go('kapitelDetail', {k:e.getAttribute('data-k')}); });
};

VIEWS.kapitelDetail = function(p){
  var k = KAPITEL.filter(function(x){return x.id===p.k;})[0];
  var h = kopf(k.icon+' Kapitel '+k.nr+': '+k.titel, kapitelFortschritt(k)+' % geschafft');
  h += '<div class="card tight">'+bar(kapitelFortschritt(k))+'</div>';
  k.themen.forEach(function(t){
    var st = status(t.id), q = quote(t.id);
    h += '<button class="thema" data-t="'+t.id+'">'+
         '<span class="dot">'+STATUS_INFO[st].p+'</span>'+
         '<span class="mid"><b>'+fmt(t.titel)+'</b>'+
         '<span>'+STATUS_INFO[st].t+(q!==null?' · '+q+' %':'')+'</span>'+
         bar(themaFortschritt(t.id),'sm')+'</span><span class="pct">›</span></button>';
  });
  h += '<div class="grid2" style="margin-top:12px">'+
       '<button class="btn sm" id="bQuiz">🧩 Quiz (Kapitel)</button>'+
       '<button class="btn ghost sm" id="bChall">🔥 Challenge</button></div>'+
       '<button class="btn alarm sm" id="bAbschluss" style="margin-top:10px">📝 Abschlusstest Kapitel '+k.nr+'</button>';
  app.innerHTML = h;
  on('.thema', function(e){ go('thema', {t:e.getAttribute('data-t')}); });
  on('#bQuiz', function(){ starte({modus:'quiz', themen:k.themen.map(function(t){return t.id;}), anzahl:8, titel:'Quiz · '+k.titel}); });
  on('#bChall',function(){ starte({modus:'quiz', themen:k.themen.map(function(t){return t.id;}), anzahl:6, stufe:3, titel:'Challenge · '+k.titel}); });
  on('#bAbschluss', function(){ starte({modus:'test', themen:k.themen.map(function(t){return t.id;}), anzahl:10, titel:'Abschlusstest · '+k.titel}); });
};

VIEWS.thema = function(p){
  var t = THEMA_BY_ID[p.t], st = status(t.id), stat = S.themen[t.id];
  var h = kopf(t.titel, t.kapitelTitel);
  h += '<div class="card"><div class="small">Lernziel</div><b>'+fmt(t.ziel)+'</b>'+
       '<div class="row between" style="margin-top:10px"><span class="chip '+st+'">'+STATUS_INFO[st].p+' '+STATUS_INFO[st].t+'</span>'+
       '<span class="small">'+(stat? stat.n+' Aufgaben · '+(quote(t.id)||0)+' % richtig' : 'noch nicht geübt')+'</span></div></div>';
  h += '<button class="btn" id="b0">💡 Verstehen &amp; Beispiel</button>';
  h += '<button class="btn go" id="b1">🟢 Üben — einfach</button>';
  h += '<button class="btn go" id="b2">🟡 Anwenden — mittel</button>';
  h += '<button class="btn alarm" id="b3">🔴 Challenge — schwer</button>';
  h += '<button class="btn ghost" id="b4">🧩 Quiz zu diesem Thema</button>';
  app.innerHTML = h;
  on('#b0', function(){ go('lernen', {t:t.id}); });
  on('#b1', function(){ starte({modus:'uebung', themen:[t.id], stufe:1, anzahl:5, titel:t.titel+' · einfach'}); });
  on('#b2', function(){ starte({modus:'uebung', themen:[t.id], stufe:2, anzahl:5, titel:t.titel+' · mittel'}); });
  on('#b3', function(){ starte({modus:'uebung', themen:[t.id], stufe:3, anzahl:4, titel:t.titel+' · schwer'}); });
  on('#b4', function(){ starte({modus:'quiz', themen:[t.id], anzahl:6, titel:'Quiz · '+t.titel}); });
};

/* ---------- 1. Verstehen + 2. Beispiel ---------- */
VIEWS.lernen = function(p){
  var t = THEMA_BY_ID[p.t];
  var h = kopf('💡 '+t.titel, 'Verstehen & Beispiel');
  h += '<div class="card"><h3>1 · Verstehen</h3><div>'+fmt(t.erklaerung)+'</div></div>';
  h += '<div class="card"><h3>2 · Beispiel</h3><div class="frage">'+fmt(t.beispiel.frage)+'</div>';
  t.beispiel.schritte.forEach(function(s,i){
    h += '<div class="schritt done"><span class="small">Schritt '+(i+1)+'</span><br>'+fmt(s)+'</div>';
  });
  h += '<div class="fb ok"><b>Ergebnis</b>'+fmt(t.beispiel.ergebnis)+'</div></div>';
  h += '<button class="btn go" id="bNext">3 · Jetzt selbst üben ▶</button>';
  app.innerHTML = h;
  themaStat(t.id).gelernt = true; speichere();
  on('#bNext', function(){ starte({modus:'uebung', themen:[t.id], stufe:1, anzahl:5, titel:t.titel+' · üben'}); });
};

/* =====================================================================
   AUFGABEN-RUNNER (Üben, Quiz, Test, Klassenarbeit)
   ===================================================================== */
var SES = null;

function baueListe(cfg){
  var ids = cfg.themen && cfg.themen.length ? cfg.themen : [cfg.themaId];
  var anzahl = cfg.anzahl || 5, liste = [], i;
  for(i=0;i<anzahl;i++){
    var id = ids[i % ids.length];
    if(ids.length > 1) id = ids[R(0, ids.length-1)];
    var st = cfg.stufe;
    if(!st){
      var t = S.themen[id];
      st = t ? Math.max(1, Math.min(3, t.stufe||1)) : 1;
      if(cfg.modus==='test' || cfg.modus==='arbeit') st = (i%3)+1;
    }
    liste.push({themaId:id, stufe:st});
  }
  if(cfg.modus==='test'||cfg.modus==='arbeit'){
    /* jedes gewählte Thema mindestens einmal */
    for(i=0;i<ids.length && i<liste.length;i++) liste[i].themaId = ids[i];
    liste = shuffle(liste);
  }
  return liste;
}

function starte(cfg){
  markiereAktiv();
  var liste = baueListe(cfg);
  SES = {
    modus: cfg.modus, titel: cfg.titel || 'Üben', liste: liste, idx:0,
    richtig:0, falsch:0, punkte:0, max:0, log:[], start:Date.now(),
    sofort: (cfg.modus!=='test' && cfg.modus!=='arbeit'),
    zeit: cfg.zeit || 0, themen: cfg.themen || [cfg.themaId], a:null, schrittIdx:0, antw:null,
    planTag: (cfg.planTag===undefined? null : cfg.planTag)
  };
  SES.liste.forEach(function(x){ SES.max += (x.stufe===3?3:(x.stufe===2?2:1)); });
  go('runner');
}

function starteSchwaechen(){
  var sw = schwaechen(4);
  if(!sw.length){ toast('Übe erst ein paar Aufgaben — dann erkenne ich deine Schwächen.'); return; }
  starte({modus:'uebung', themen:sw.map(function(s){return s.id;}), anzahl:8, titel:'Schwächen-Training'});
}

function neueAufgabe(){
  var it = SES.liste[SES.idx];
  SES.a = erzeugeAufgabe(it.themaId, it.stufe);
  SES.schrittIdx = 0; SES.antw = null; SES.fertig = false;
}

VIEWS.runner = function(){
  if(!SES){ zurueck(); return; }
  if(SES.idx >= SES.liste.length){ auswertung(); return; }
  if(!SES.a || SES.neu){ neueAufgabe(); SES.neu = false; }
  var a = SES.a, t = THEMA_BY_ID[a.themaId];
  var stufeTxt = ['','🟢 einfach','🟡 mittel','🔴 schwer'][a.stufe];
  var pruefmodus = !SES.sofort;

  var h = kopf(SES.titel, (pruefmodus?'Aufgabe ':'')+(SES.idx+1)+' von '+SES.liste.length+(pruefmodus?' · '+SES.a.punkte+' P':' · '+stufeTxt));
  h += '<div class="pruef">'+bar(Math.round(SES.idx/SES.liste.length*100))+'</div>';
  if(SES.zeit) h += '<div class="card tight center"><b class="timer" id="uhr">--:--</b></div>';

  h += '<div class="card"><div class="small" style="margin-bottom:4px">'+t.icon+' '+fmt(t.titel)+'</div>';
  h += '<div class="frage">'+fmt(a.frage)+'</div>';
  if(a.grafik) h += a.grafik;
  h += eingabeHTML(a);
  h += '</div>';
  h += '<div id="fbBox"></div>';
  h += '<button class="btn go" id="bCheck">Antwort prüfen</button>';
  if(SES.sofort) h += '<div class="center"><button class="btn ghost sm" id="bTipp" style="width:auto;display:inline-block;padding:8px 16px">💡 Tipp</button></div>';
  else h += '<button class="btn ghost" id="bSkip">Überspringen ›</button>';

  app.innerHTML = h;
  bindeEingabe(a);
  on('#bCheck', pruefeJetzt);
  on('#bSkip', function(){ verbuche(false, 0); weiter(); });
  on('#bTipp', function(){
    var tp = (a.typ==='steps' && a.schritte[SES.schrittIdx].tipp) ? a.schritte[SES.schrittIdx].tipp : (a.tipp || 'Schau dir das Beispiel im Lernmodus noch einmal an.');
    toast('💡 '+tp, 3800);
  });
  if(SES.zeit) startUhr();
};

/* ---------- Eingabe-Oberflächen je Aufgabentyp ---------- */
function eingabeHTML(a){
  switch(a.typ){
    case 'mc':
    case 'fehler':
      return (a.typ==='fehler'?'<div class="small" style="margin-bottom:6px">In welchem Schritt steckt der Fehler?</div>':'')+
        '<div id="opts">'+a.optionen.map(function(o,i){
          return '<button class="opt" data-i="'+i+'">'+fmt(o)+'</button>'; }).join('')+'</div>';
    case 'tf':
      return '<div id="opts"><button class="opt" data-i="r">✅ Richtig</button><button class="opt" data-i="f">❌ Falsch</button></div>';
    case 'num':
    case 'gap':
      return '<div class="inputrow"><input type="text" inputmode="decimal" id="inp" autocomplete="off" placeholder="Antwort">'+
             (a.einheit?'<span class="einheit">'+fmt(a.einheit)+'</span>':'')+'</div>';
    case 'steps':
      var h='';
      for(var i=0;i<a.schritte.length;i++){
        if(i < SES.schrittIdx) h += '<div class="schritt done"><span class="small">'+fmt(a.schritte[i].frage)+'</span><br><b>'+fmt(a.schritte[i].loesung)+'</b></div>';
      }
      var s = a.schritte[SES.schrittIdx];
      h += '<div class="schritt"><div style="margin-bottom:8px">'+fmt(s.frage)+'</div>'+
           '<input type="text" inputmode="decimal" id="inp" autocomplete="off" placeholder="Zwischenergebnis"></div>';
      return h;
    case 'order':
      SES.ordSel = SES.ordSel || [];
      var pool = SES.ordPool || (SES.ordPool = shuffle(a.items));
      var hh = '<div class="small">Tippe die Antworten in der richtigen Reihenfolge an.</div>';
      hh += '<div id="ordZiel" style="min-height:44px;margin:8px 0">'+ (SES.ordSel.length? SES.ordSel.map(function(v,i){return '<span class="chip on">'+(i+1)+'. '+fmt(v)+'</span>';}).join('') : '<span class="small">— noch leer —</span>')+'</div>';
      hh += '<div id="ordPool">'+pool.map(function(v){
        return SES.ordSel.indexOf(v)>=0 ? '' : '<button class="opt" data-v="'+v+'">'+fmt(v)+'</button>'; }).join('')+'</div>';
      hh += '<button class="btn ghost sm" id="bOrdReset">↺ Zurücksetzen</button>';
      return hh;
    case 'match':
      SES.matSel = SES.matSel || {};
      SES.matAktiv = SES.matAktiv || null;
      var links = a.paare.map(function(p){return p[0];});
      var rechts = SES.matRechts || (SES.matRechts = shuffle(a.paare.map(function(p){return p[1];})));
      var m = '<div class="small">Tippe links ein Feld an und ordne rechts zu.</div>';
      m += '<div style="margin-top:8px">'+links.map(function(l,i){
        var z = SES.matSel[l];
        return '<button class="opt'+(SES.matAktiv===l?' sel':'')+(z?' right':'')+'" data-l="'+i+'">'+fmt(l)+(z?' → <b>'+fmt(z)+'</b>':'')+'</button>';
      }).join('')+'</div>';
      m += '<div style="border-top:1px solid var(--line);padding-top:8px">'+rechts.map(function(r,i){
        var benutzt = false; for(var k in SES.matSel) if(SES.matSel[k]===r) benutzt=true;
        return benutzt?'':'<button class="opt" data-r="'+i+'">'+fmt(r)+'</button>';
      }).join('')+'</div>';
      m += '<button class="btn ghost sm" id="bMatReset">↺ Zurücksetzen</button>';
      return m;
    default:
      return '<div class="fb no">Für dieses Thema benötige ich noch Informationen aus dem Schulbuch.</div>';
  }
}

function bindeEingabe(a){
  if(a.typ==='mc'||a.typ==='fehler'||a.typ==='tf'){
    on('#opts .opt', function(e){
      $$('#opts .opt').forEach(function(x){ x.classList.remove('sel'); });
      e.classList.add('sel');
      SES.antw = a.typ==='tf' ? e.getAttribute('data-i') : parseInt(e.getAttribute('data-i'),10);
    });
  }
  if(a.typ==='order'){
    on('#ordPool .opt', function(e){ SES.ordSel.push(e.getAttribute('data-v')); render(); });
    on('#bOrdReset', function(){ SES.ordSel=[]; render(); });
  }
  if(a.typ==='match'){
    on('.opt[data-l]', function(e){
      var l = a.paare[parseInt(e.getAttribute('data-l'),10)][0];
      if(SES.matSel[l]){ delete SES.matSel[l]; SES.matAktiv=null; } else SES.matAktiv = l;
      render();
    });
    on('.opt[data-r]', function(e){
      if(!SES.matAktiv){ toast('Wähle zuerst links ein Feld aus.'); return; }
      SES.matSel[SES.matAktiv] = SES.matRechts[parseInt(e.getAttribute('data-r'),10)];
      SES.matAktiv = null; render();
    });
    on('#bMatReset', function(){ SES.matSel={}; SES.matAktiv=null; render(); });
  }
  var inp = $('#inp');
  if(inp){ inp.onkeydown = function(ev){ if(ev.key==='Enter'){ ev.preventDefault(); pruefeJetzt(); } }; }
}

/* ---------- Antwort prüfen ---------- */
function norm(s){
  s = String(s==null?'':s).trim().toLowerCase();
  s = s.replace(/\s| /g,'');
  s = s.replace(/(\d)\.(?=\d{3}(\D|$))/g,'$1');
  s = s.replace(/,/g,'.');
  return s;
}
function normZahl(s){
  s = norm(s);
  s = s.replace(/[a-zäöüß²³°]+$/,'');
  return s;
}
function gleich(a,b){
  var x = normZahl(a), y = normZahl(b);
  if(x===y) return true;
  var fx = parseFloat(x), fy = parseFloat(y);
  if(!isNaN(fx) && !isNaN(fy) && x!=='' && y!=='' && /^-?[\d.]+$/.test(x) && /^-?[\d.]+$/.test(y))
    return Math.abs(fx-fy) < 1e-9;
  return false;
}

function pruefeJetzt(){
  var a = SES.a;
  if(a.typ==='info'){ weiter(); return; }
  var richtig = false, teil = 1;

  if(a.typ==='mc'||a.typ==='fehler'){
    if(SES.antw===null||SES.antw===undefined){ toast('Wähle zuerst eine Antwort aus.'); return; }
    richtig = (SES.antw === a.richtig);
  } else if(a.typ==='tf'){
    if(!SES.antw){ toast('Wähle „Richtig" oder „Falsch".'); return; }
    richtig = (SES.antw === a.loesung);
  } else if(a.typ==='num'||a.typ==='gap'){
    var v = $('#inp').value;
    if(!v.trim()){ toast('Trage zuerst eine Antwort ein.'); return; }
    SES.antw = v; richtig = gleich(v, a.loesung);
  } else if(a.typ==='order'){
    if(SES.ordSel.length < a.items.length){ toast('Ordne erst alle Antworten ein.'); return; }
    richtig = SES.ordSel.join('|') === a.items.join('|');
    SES.antw = SES.ordSel.join(', ');
  } else if(a.typ==='match'){
    var alle = true, ok = true;
    a.paare.forEach(function(p){
      if(!SES.matSel[p[0]]) alle=false;
      else if(SES.matSel[p[0]] !== p[1]) ok=false;
    });
    if(!alle){ toast('Ordne erst alle Felder zu.'); return; }
    richtig = ok;
  } else if(a.typ==='steps'){
    var sv = $('#inp').value;
    if(!sv.trim()){ toast('Trage zuerst ein Zwischenergebnis ein.'); return; }
    var s = a.schritte[SES.schrittIdx];
    var stimmt = gleich(sv, s.loesung);
    if(stimmt){
      SES.schrittIdx++;
      if(SES.schrittIdx < a.schritte.length){
        if(SES.sofort) toast('✅ Richtig — weiter zum nächsten Schritt!', 1200);
        render(); return;
      }
      richtig = true;
      teil = 1;
    } else {
      richtig = false;
      teil = SES.schrittIdx / a.schritte.length;
      SES.fehlSchritt = SES.schrittIdx + 1;
      SES.fehlLoesung = s.loesung;
    }
  }

  var pkt = richtig ? a.punkte : Math.round(a.punkte * teil * (SES.sofort?0:1));
  verbuche(richtig, pkt);

  if(!SES.sofort){ weiter(); return; }
  zeigeFeedback(richtig);
}

function verbuche(richtig, pkt){
  var a = SES.a;
  buche(a.themaId, richtig, a.stufe);
  SES.punkte += pkt||0;
  if(richtig) SES.richtig++; else SES.falsch++;
  SES.log.push({ themaId:a.themaId, titel:THEMA_BY_ID[a.themaId].titel, frage:a.frage,
                 richtig:richtig, punkte:pkt||0, max:a.punkte, stufe:a.stufe,
                 loesung: a.typ==='mc'||a.typ==='fehler' ? a.optionen[a.richtig] :
                          (a.typ==='tf' ? (a.loesung==='r'?'Richtig':'Falsch') :
                          (a.typ==='steps' ? a.schritte[a.schritte.length-1].loesung :
                          (a.typ==='order' ? a.items.join(', ') :
                          (a.typ==='match' ? a.paare.map(function(p){return p[0]+' → '+p[1];}).join('; ') : a.loesung)))),
                 erklaerung:a.erklaerung });
  if(richtig){
    var lvl = gibXP(a.xp || 5);
    if(lvl) setTimeout(function(){ toast('🎉 Level '+lvl.n+' — '+lvl.name+'!', 3000); }, 900);
  }
  var neu = pruefeErfolge();
  if(neu.length) setTimeout(function(){ toast(neu[0].icon+' Erfolg: '+neu[0].titel, 3000); }, 1400);
}

function zeigeFeedback(richtig){
  var a = SES.a;
  var box = $('#fbBox');
  var h = '';
  if(richtig){
    h = '<div class="fb ok"><b>✅ Richtig! +'+(a.xp||5)+' XP</b>'+
        (a.erklaerung? fmt(a.erklaerung) : 'Weiter so!')+'</div>';
  } else {
    var kopfTxt = (a.typ==='steps') ? 'Fast! Beim Schritt '+SES.fehlSchritt+' hat sich ein Fehler eingeschlichen.'
                                     : 'Fast! Schau dir den Rechenweg noch einmal an.';
    h = '<div class="fb no"><b>❌ '+kopfTxt+'</b>'+
        (a.typ==='steps' ? 'Richtig wäre hier: <b>'+fmt(a.fehlLoesung||SES.fehlLoesung)+'</b><br>' : '')+
        fmt(a.erklaerung||'')+'</div>';
  }
  box.innerHTML = h;
  $('#bCheck').outerHTML = '<button class="btn go" id="bWeiterA">Weiter ▶</button>'+
    (richtig?'':'<button class="btn ghost" id="bNochmal">↻ Ähnliche Aufgabe noch einmal</button>');
  var bt=$('#bTipp'); if(bt) bt.parentNode.style.display='none';
  $$('#opts .opt').forEach(function(e,i){
    if(a.typ==='tf'){ if(e.getAttribute('data-i')===a.loesung) e.classList.add('right'); }
    else if(i===a.richtig) e.classList.add('right');
    else if(i===SES.antw) e.classList.add('wrong');
  });
  var inp=$('#inp'); if(inp) inp.disabled = true;
  on('#bWeiterA', weiter);
  on('#bNochmal', function(){
    SES.liste.splice(SES.idx+1, 0, {themaId:a.themaId, stufe:a.stufe});
    SES.max += a.punkte;
    weiter();
  });
  window.scrollTo(0, document.body.scrollHeight);
}

function weiter(){
  SES.idx++; SES.neu = true; SES.ordSel=null; SES.ordPool=null; SES.matSel=null; SES.matRechts=null; SES.matAktiv=null;
  if(SES.idx >= SES.liste.length){ auswertung(); return; }
  render();
}

/* ---------- Uhr für Prüfungen ---------- */
var uhrTimer=null;
function startUhr(){
  clearInterval(uhrTimer);
  uhrTimer = setInterval(function(){
    var el = $('#uhr'); if(!el){ clearInterval(uhrTimer); return; }
    var rest = SES.zeit - Math.floor((Date.now()-SES.start)/1000);
    if(rest <= 0){ clearInterval(uhrTimer); auswertung(); return; }
    el.textContent = '⏱ '+Math.floor(rest/60)+':'+('0'+(rest%60)).slice(-2);
  }, 500);
}

/* ---------- Auswertung ---------- */
function auswertung(){
  clearInterval(uhrTimer);
  var dauer = Math.round((Date.now()-SES.start)/1000);
  S.lernzeit += dauer;
  if(SES.planTag !== undefined && SES.planTag !== null && S.arbeit && S.arbeit.plan[SES.planTag]){
    S.arbeit.plan[SES.planTag].erledigt = true;
  }
  var prozent = SES.max ? Math.round(SES.punkte/SES.max*100) : 0;
  var sterne = prozent>=92?5:(prozent>=80?4:(prozent>=65?3:(prozent>=50?2:1)));

  if(SES.modus==='test' || SES.modus==='arbeit'){
    S.tests.push({datum:heute(), typ:SES.modus, titel:SES.titel, punkte:SES.punkte, max:SES.max,
                  prozent:prozent, themen:SES.themen, dauer:dauer,
                  fehler:SES.log.filter(function(l){return !l.richtig;}).map(function(l){return l.themaId;})});
    if(S.tests.length>30) S.tests = S.tests.slice(-30);
    if(prozent>=60) S.daily.minitest = true;
  } else if(SES.modus==='quiz' && prozent>=70){ S.daily.minitest = true; }

  var bonus = 0;
  if(SES.falsch===0 && SES.liste.length>=4){ bonus += 25; }
  if(SES.modus==='test'||SES.modus==='arbeit'){ if(prozent>=60) bonus += 150; }
  if(!S.daily.belohnt && S.daily.aufgaben>=10 && S.daily.schweres && S.daily.minitest){
    bonus += 100; S.daily.belohnt = true;
  }
  if(bonus) gibXP(bonus);
  speichere();
  pruefeErfolge();

  /* Fehleranalyse: häufigste Fehlerthemen */
  var zaehl = {};
  SES.log.forEach(function(l){ if(!l.richtig) zaehl[l.themaId] = (zaehl[l.themaId]||0)+1; });
  var baustellen = Object.keys(zaehl).sort(function(a,b){return zaehl[b]-zaehl[a];}).slice(0,3);

  var h = kopf('Auswertung', SES.titel, false);
  h += '<div class="card center"><div style="font-size:38px">'+Array(sterne+1).join('⭐')+'</div>'+
       '<h2 style="margin:6px 0">'+SES.punkte+' / '+SES.max+' Punkte</h2>'+
       '<div style="font-size:26px;font-weight:800;margin-bottom:8px">'+prozent+' %</div>'+
       bar(prozent, prozent>=80?'ok':(prozent>=60?'warn':'bad'))+
       '<div class="small" style="margin-top:10px">'+SES.richtig+' richtig · '+SES.falsch+' falsch · '+
       Math.floor(dauer/60)+' min '+(dauer%60)+' s'+(bonus?' · Bonus +'+bonus+' XP':'')+'</div></div>';

  if(baustellen.length){
    h += '<div class="card"><h3>Deine wichtigsten Baustellen</h3>';
    baustellen.forEach(function(id,i){
      h += '<div style="margin-bottom:6px">'+(i+1)+'. <b>'+fmt(THEMA_BY_ID[id].titel)+'</b> <span class="small">('+zaehl[id]+'× falsch)</span></div>';
    });
    h += '<p class="small">Diese Themen solltest du vor der Klassenarbeit noch einmal üben.</p>'+
         '<button class="btn sm" id="bFix">Diese Themen jetzt trainieren</button></div>';
  }

  h += '<div class="card"><h3>Alle Aufgaben</h3>';
  SES.log.forEach(function(l,i){
    h += '<div style="padding:9px 0;border-bottom:1px solid var(--line)">'+
         '<div class="row between"><b style="font-size:14px">'+(l.richtig?'✅':'❌')+' Aufgabe '+(i+1)+'</b>'+
         '<span class="small">'+l.punkte+'/'+l.max+' P · '+fmt(l.titel)+'</span></div>'+
         '<div class="small" style="margin-top:3px">'+fmt(l.frage)+'</div>'+
         (l.richtig?'':'<div class="small" style="margin-top:3px"><b>Lösung:</b> '+fmt(l.loesung)+'<br>'+fmt(l.erklaerung||'')+'</div>')+
         '</div>';
  });
  h += '</div>';
  h += '<button class="btn go" id="bNochmalAlle">↻ Noch eine Runde</button>';
  h += '<button class="btn ghost" id="bHome">🏠 Zur Startseite</button>';

  app.innerHTML = h;
  var themenKopie = SES.themen, modusKopie = SES.modus, titelKopie = SES.titel, anz = SES.liste.length;
  on('#bFix', function(){ starte({modus:'uebung', themen:baustellen, anzahl:8, titel:'Fehlertraining'}); });
  on('#bNochmalAlle', function(){ starte({modus:modusKopie, themen:themenKopie, anzahl:anz, titel:titelKopie, zeit:0}); });
  on('#bHome', function(){ stack=[{view:'home',params:{}}]; render(); });
}

/* =====================================================================
   SCHWÄCHEN
   ===================================================================== */
VIEWS.schwaechen = function(){
  var alle = [];
  THEMEN.forEach(function(t){
    var st = S.themen[t.id];
    if(st && st.n>=3) alle.push({id:t.id, titel:t.titel, kap:t.kapitelTitel, q:quote(t.id), st:status(t.id), n:st.n});
  });
  alle.sort(function(a,b){ return a.q-b.q; });
  var h = kopf('🎯 Meine Schwächen','Automatisch aus deinen Ergebnissen');
  if(!alle.length){
    h += '<div class="card"><p>Du hast noch zu wenige Aufgaben gelöst. Sobald du ein Thema dreimal geübt hast, erkenne ich hier deine Stärken und Schwächen.</p>'+
         '<button class="btn sm" id="bStart">Jetzt üben</button></div>';
    app.innerHTML = h; on('#bStart', function(){ starte({modus:'lernen', themaId:naechstesThema().id, themen:[naechstesThema().id], anzahl:6, titel:'Üben'}); });
    return;
  }
  var rot = alle.filter(function(a){return a.st==='rot';});
  if(rot.length) h += '<div class="card"><b>'+rot[0].titel+'</b><p class="small" style="margin-top:4px">Du solltest dieses Thema noch einmal üben — deine Quote liegt bei '+rot[0].q+' %.</p><button class="btn sm" id="bJetzt">Jetzt trainieren</button></div>';
  h += '<div class="card">';
  alle.forEach(function(a){
    h += '<div style="padding:8px 0;border-bottom:1px solid var(--line)">'+
         '<div class="row between"><span style="font-size:14px">'+STATUS_INFO[a.st].p+' <b>'+fmt(a.titel)+'</b></span>'+
         '<span class="small">'+a.q+' % · '+a.n+' Aufg.</span></div>'+
         bar(a.q, a.st==='rot'?'bad':(a.st==='gelb'?'warn':'ok'))+
         '<button class="btn ghost sm" data-t="'+a.id+'" style="margin-top:7px">Trainieren</button></div>';
  });
  h += '</div><button class="btn go" id="bAlle">Alle Schwächen trainieren</button>';
  app.innerHTML = h;
  on('#bJetzt', function(){ starte({modus:'uebung', themen:[rot[0].id], anzahl:6, titel:rot[0].titel}); });
  on('#bAlle', starteSchwaechen);
  on('.btn[data-t]', function(e){ var id=e.getAttribute('data-t'); starte({modus:'uebung', themen:[id], anzahl:6, titel:THEMA_BY_ID[id].titel}); });
};

/* =====================================================================
   ERFOLGE
   ===================================================================== */
VIEWS.erfolge = function(){
  var offen = ERFOLGE.filter(function(e){return !S.erfolge[e.id];}).length;
  var h = kopf('🏆 Erfolge', (ERFOLGE.length-offen)+' von '+ERFOLGE.length+' freigeschaltet');
  h += '<div class="card tight">'+bar(Math.round((ERFOLGE.length-offen)/ERFOLGE.length*100),'ok')+'</div>';
  h += '<div class="card">';
  ERFOLGE.forEach(function(e){
    var frei = !!S.erfolge[e.id];
    h += '<div class="erf'+(frei?'':' locked')+'"><span class="ic">'+(frei?e.icon:'🔒')+'</span>'+
         '<span><b style="font-size:14.5px">'+e.titel+'</b><br><span class="small">'+e.text+
         (frei?' · '+datumDE(S.erfolge[e.id]):'')+'</span></span></div>';
  });
  h += '</div>';
  app.innerHTML = h;
};

/* =====================================================================
   ELTERNBEREICH
   ===================================================================== */
VIEWS.eltern = function(){
  var q = gesamtQuote(), n = gesamtAufgaben();
  var st = staerken(3), sw = schwaechen(3);
  var pg = prognose(S.arbeit ? S.arbeit.themen : null);
  var h = kopf('👨‍👩‍👦 Elternbereich','Lernstand — keine personenbezogenen Daten');

  h += '<div class="card"><h3>Überblick</h3><table>'+
    '<tr><td>Lernzeit gesamt</td><td class="num"><b>'+Math.floor(S.lernzeit/60)+' min</b></td></tr>'+
    '<tr><td>Bearbeitete Aufgaben</td><td class="num"><b>'+n+'</b></td></tr>'+
    '<tr><td>Erfolgsquote</td><td class="num"><b>'+q+' %</b></td></tr>'+
    '<tr><td>XP / Level</td><td class="num"><b>'+S.xp+' · Lv '+levelVon(S.xp).n+'</b></td></tr>'+
    '<tr><td>Lernserie</td><td class="num"><b>'+S.streak.tage+' Tag'+(S.streak.tage===1?'':'e')+'</b></td></tr>'+
    '<tr><td>Längste Fehlerfrei-Serie</td><td class="num"><b>'+S.maxSerie+'</b></td></tr>'+
    '<tr><td>Gesamtfortschritt</td><td class="num"><b>'+gesamtFortschritt()+' %</b></td></tr></table></div>';

  h += '<div class="card"><h3>Lernstand nach Kapiteln</h3>';
  KAPITEL.forEach(function(k){
    var p = kapitelFortschritt(k);
    h += '<div class="row between" style="margin-top:8px"><span class="small">'+k.icon+' '+fmt(k.titel)+'</span><b class="small">'+p+' %</b></div>'+bar(p);
  });
  h += '</div>';

  h += '<div class="card"><h3>Stark &amp; schwach</h3>';
  if(st.length){ h += '<div class="small" style="margin-bottom:4px">Stark</div>';
    st.forEach(function(x){ h += '<div class="small">🟢 '+fmt(x.titel)+' — '+x.q+' %</div>'; }); }
  if(sw.length){ h += '<div class="small" style="margin:10px 0 4px">Schwach</div>';
    sw.forEach(function(x){ h += '<div class="small">'+STATUS_INFO[x.st].p+' '+fmt(x.titel)+' — '+x.q+' %</div>'; }); }
  if(!st.length && !sw.length) h += '<p class="small">Noch keine ausreichenden Daten.</p>';
  h += '</div>';

  h += '<div class="card"><h3>Klassenarbeits-Prognose</h3>'+
       '<div style="font-size:20px;font-weight:800">'+(pg.stufe==='gruen'?'🟢':(pg.stufe==='gelb'?'🟡':'🔴'))+' '+pg.text+'</div>'+
       '<p class="small" style="margin-top:6px">Übungsquote in den relevanten Themen: '+pg.q+' %'+
       (pg.ungeuebt?' · '+pg.ungeuebt+' Themen noch kaum geübt':'')+'.</p>'+
       '<p class="small"><b>Wichtig:</b> Das ist keine Notenprognose. Die Einschätzung beruht ausschließlich auf den bisherigen Übungsergebnissen in dieser App.</p></div>';

  h += '<div class="card"><h3>Testergebnisse</h3>';
  if(!S.tests.length) h += '<p class="small">Noch keine Tests geschrieben.</p>';
  else {
    h += '<table><tr><th>Datum</th><th>Test</th><th class="num">Punkte</th><th class="num">%</th></tr>';
    S.tests.slice().reverse().slice(0,12).forEach(function(t){
      h += '<tr><td>'+datumDE(t.datum)+'</td><td style="font-size:12.5px">'+fmt(t.titel||t.typ)+'</td>'+
           '<td class="num">'+t.punkte+'/'+t.max+'</td><td class="num"><b>'+t.prozent+'</b></td></tr>';
    });
    h += '</table>';
  }
  h += '</div>';

  h += '<button class="btn ghost" id="bExport">⬇️ Lernstand als Datei sichern</button>';
  h += '<button class="btn ghost" id="bReset">🗑 Fortschritt zurücksetzen</button>';
  app.innerHTML = h;
  on('#bExport', function(){
    var blob = new Blob([JSON.stringify(S,null,1)], {type:'application/json'});
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'mathe-mission-5-lernstand.json';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  });
  on('#bReset', function(){
    if(confirm('Wirklich den gesamten Lernfortschritt löschen?')){ resetState(); toast('Fortschritt zurückgesetzt.'); stack=[{view:'home',params:{}}]; render(); }
  });
};

/* =====================================================================
   INFO
   ===================================================================== */
VIEWS.info = function(){
  var h = kopf('ℹ️ Über diese App','Mathe Mission 5');
  h += '<div class="card"><p>Diese App begleitet den Mathematikunterricht der <b>Klasse 5 (Gymnasium G9, Hessen)</b>.</p>'+
    '<p class="small">Die Kapitelstruktur folgt dem <b>hessischen Lehrplan Mathematik G9, Jahrgangsstufe 5</b> und ist auf das Schulbuch '+
    '<i>Fundamente der Mathematik 5, Hessen</i> (Cornelsen, ISBN 978-3-06-009267-3) abgestimmt.</p>'+
    '<p class="small"><b>Keine Inhalte aus dem Schulbuch:</b> Alle Erklärungen, Beispiele und Aufgaben sind eigenständig formuliert. '+
    'Aufgaben werden bei jedem Start neu erzeugt — deshalb sind sie nie zweimal gleich.</p>'+
    '<p class="small">Sobald das Inhaltsverzeichnis des Schulbuchs vorliegt, wird die Kapitelstruktur in der Datei <code>js/data.js</code> daran angepasst.</p></div>';
  h += '<div class="card"><h3>Datenschutz</h3><p class="small">Kein Login, kein Konto, keine Cloud. Der gesamte Lernfortschritt bleibt im Browser dieses Geräts (localStorage) und wird nirgendwo hochgeladen.</p></div>';
  h += '<div class="card"><h3>Themenübersicht</h3><p class="small">'+KAPITEL.length+' Kapitel · '+THEMEN.length+' Themen · über 100 verschiedene Aufgabenvarianten</p></div>';
  app.innerHTML = h;
};
