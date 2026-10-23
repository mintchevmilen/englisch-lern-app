/* =====================================================================
   Mathe Mission 5 — Klassenarbeits-Modus, Lernplan, Probe-Klassenarbeit
   ===================================================================== */
var PHASEN = [
  {t:'Grundlagen wiederholen', b:'Erklärungen ansehen und leichte Aufgaben lösen', modus:'uebung', stufe:1, anzahl:8},
  {t:'Aufgaben trainieren',    b:'Mittlere Aufgaben zu allen Themen',              modus:'uebung', stufe:2, anzahl:10},
  {t:'Schwierige Aufgaben',    b:'Challenge-Aufgaben — hier wird es anspruchsvoll',modus:'uebung', stufe:3, anzahl:8},
  {t:'Gemischte Aufgaben',     b:'Alles bunt gemischt, wie in der echten Arbeit',  modus:'quiz',   anzahl:12},
  {t:'Probe-Test',             b:'Kurzer Test ohne Hilfen',                        modus:'test',   anzahl:8},
  {t:'Fehlertraining',         b:'Genau die Themen, die noch wackeln',             modus:'schwach',anzahl:10},
  {t:'Probe-Klassenarbeit',    b:'Komplette Arbeit mit Punkten und Zeit',          modus:'arbeit', anzahl:8, zeit:2700}
];

function planErstellen(datum, themen){
  var tage = Math.max(1, tageDiff(heute(), datum));
  var n = Math.min(7, tage);
  var idx = [];
  if(n===1) idx=[6];
  else for(var i=0;i<n;i++) idx.push(Math.round(i*6/(n-1)));
  idx = idx.filter(function(v,i,a){return a.indexOf(v)===i;});
  var plan = [];
  var start = tage - idx.length;
  for(var j=0;j<idx.length;j++){
    var d = new Date(); d.setDate(d.getDate() + start + j);
    var iso = d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2);
    plan.push({ phase: idx[j], datum: iso, erledigt:false });
  }
  return { datum:datum, themen:themen, erstellt:heute(), plan:plan };
}

VIEWS.arbeit = function(){
  if(!S.arbeit){ VIEWS.arbeitSetup({}); return; }
  var a = S.arbeit;
  var tage = tageDiff(heute(), a.datum);
  var pg = prognose(a.themen);
  var fertig = a.plan.filter(function(p){return p.erledigt;}).length;

  var h = kopf('🚨 Klassenarbeit', datumDE(a.datum)+' · noch '+(tage>0?tage+' Tage':'heute!'));
  h += '<div class="card center"><div style="font-size:30px;font-weight:800">'+(tage>0?tage:'0')+'</div>'+
       '<div class="small">Tage bis zur Klassenarbeit</div>'+
       '<div style="margin-top:10px;font-size:18px;font-weight:800">'+
       (pg.stufe==='gruen'?'🟢':(pg.stufe==='gelb'?'🟡':'🔴'))+' '+pg.text+'</div>'+
       '<div class="small">Übungsquote in diesen Themen: '+pg.q+' %</div>'+
       '<div class="small" style="margin-top:6px">Das ist keine Notenprognose — sie beruht nur auf deinen Übungsergebnissen.</div></div>';

  h += '<div class="card"><div class="row between"><h3>Dein Lernplan</h3><span class="small">'+fertig+'/'+a.plan.length+'</span></div>'+
       bar(Math.round(fertig/a.plan.length*100),'ok');
  a.plan.forEach(function(p,i){
    var ph = PHASEN[p.phase];
    var heuteDran = (p.datum === heute());
    h += '<div class="plantag'+(p.erledigt?' done':'')+'">'+
         '<span class="nr">'+(p.erledigt?'✓':(i+1))+'</span>'+
         '<span class="mid"><b>'+ph.t+(heuteDran?' <span class="chip on" style="font-size:11px">heute</span>':'')+'</b>'+
         '<span>'+datumDE(p.datum)+' · '+ph.b+'</span></span>'+
         '<button class="btn sm" data-p="'+i+'" style="width:auto;padding:8px 12px">▶</button></div>';
  });
  h += '</div>';

  h += '<div class="card"><h3>Themen der Arbeit</h3>';
  a.themen.forEach(function(id){
    var st = status(id), q = quote(id);
    h += '<div class="row between" style="margin-top:6px"><span class="small">'+STATUS_INFO[st].p+' '+fmt(THEMA_BY_ID[id].titel)+'</span>'+
         '<span class="small">'+(q===null?'—':q+' %')+'</span></div>';
  });
  h += '</div>';

  h += '<button class="btn alarm" id="bProbe">📝 Probe-Klassenarbeit schreiben</button>';
  h += '<button class="btn ghost" id="bNeu">✏️ Termin / Themen ändern</button>';
  app.innerHTML = h;
  on('.btn[data-p]', function(e){ startePhase(parseInt(e.getAttribute('data-p'),10)); });
  on('#bProbe', function(){ probeKlassenarbeit(a.themen); });
  on('#bNeu', function(){ go('arbeitSetup', {edit:true}); });
};

function startePhase(i){
  var a = S.arbeit, p = a.plan[i], ph = PHASEN[p.phase];
  if(ph.modus==='schwach'){
    var sw = schwaechen(4).filter(function(s){ return a.themen.indexOf(s.id)>=0; });
    var ids = sw.length ? sw.map(function(s){return s.id;}) : a.themen;
    starte({modus:'uebung', themen:ids, anzahl:ph.anzahl, titel:'Fehlertraining', planTag:i});
    return;
  }
  if(ph.modus==='arbeit'){ probeKlassenarbeit(a.themen, i); return; }
  starte({modus:ph.modus, themen:a.themen, stufe:ph.stufe, anzahl:ph.anzahl, titel:'Tag '+(i+1)+' · '+ph.t, planTag:i});
}

function probeKlassenarbeit(themen, planTag){
  var anzahl = Math.max(6, Math.min(10, themen.length+2));
  var h = kopf('📝 Probe-Klassenarbeit','So läuft es ab');
  h += '<div class="card"><h3>Regeln</h3><ul style="padding-left:18px;margin:0">'+
       '<li>'+anzahl+' Aufgaben mit unterschiedlichen Punktzahlen</li>'+
       '<li>Keine Lösungen, keine Tipps, keine sofortige Korrektur</li>'+
       '<li>45 Minuten Zeit (Countdown läuft mit)</li>'+
       '<li>Am Ende bekommst du Punkte, Prozente und eine Fehleranalyse</li></ul></div>';
  h += '<div class="card"><h3>Themen</h3><div>'+themen.map(function(id){
        return '<span class="chip">'+fmt(THEMA_BY_ID[id].titel)+'</span>'; }).join('')+'</div></div>';
  h += '<button class="btn alarm" id="bLos">Arbeit jetzt beginnen</button>';
  h += '<button class="btn ghost" id="bAb">Abbrechen</button>';
  stack.push({view:'_probeinfo', params:{}});
  VIEWS._probeinfo = function(){ app.innerHTML = h;
    var b=$('#btnBack'); if(b) b.onclick=function(){ zurueck(); };
    on('#bLos', function(){
      stack.pop();
      starte({modus:'arbeit', themen:themen, anzahl:anzahl, zeit:45*60,
              titel:'Probe-Klassenarbeit', planTag:(planTag===undefined?null:planTag)});
    });
    on('#bAb', function(){ zurueck(); });
  };
  render();
}

VIEWS.arbeitSetup = function(p){
  var vorauswahl = (p.edit && S.arbeit) ? S.arbeit.themen.slice() : [];
  var datumVor = (p.edit && S.arbeit) ? S.arbeit.datum : '';
  var h = kopf('🚨 Klassenarbeit vorbereiten','Termin und Themen eintragen');
  h += '<div class="card"><h3>1 · Wann ist die Klassenarbeit?</h3>'+
       '<input type="date" id="dArbeit" value="'+datumVor+'"></div>';
  h += '<div class="card"><h3>2 · Welche Themen kommen dran?</h3>'+
       '<p class="small">Tippe alle Themen an, die in der Arbeit vorkommen. Du findest sie im Hefter oder in der Ankündigung deiner Lehrkraft.</p>';
  KAPITEL.forEach(function(k){
    h += '<div style="margin-top:12px"><div class="row between"><b style="font-size:14px">'+k.icon+' '+fmt(k.titel)+'</b>'+
         '<button class="btn ghost sm" data-k="'+k.id+'" style="width:auto;padding:6px 10px;font-size:12px">alle</button></div><div style="margin-top:6px">';
    k.themen.forEach(function(t){
      h += '<button class="chip'+(vorauswahl.indexOf(t.id)>=0?' on':'')+'" data-t="'+t.id+'" style="border:0;font-family:inherit">'+fmt(t.titel)+'</button>';
    });
    h += '</div></div>';
  });
  h += '</div>';
  h += '<button class="btn go" id="bPlan">Lernplan erstellen</button>';
  if(S.arbeit) h += '<button class="btn ghost" id="bLoesch">Klassenarbeit löschen</button>';
  app.innerHTML = h;

  var gewaehlt = vorauswahl;
  on('.chip[data-t]', function(e){
    var id = e.getAttribute('data-t'), i = gewaehlt.indexOf(id);
    if(i>=0){ gewaehlt.splice(i,1); e.classList.remove('on'); }
    else { gewaehlt.push(id); e.classList.add('on'); }
  });
  on('.btn[data-k]', function(e){
    var k = KAPITEL.filter(function(x){return x.id===e.getAttribute('data-k');})[0];
    k.themen.forEach(function(t){ if(gewaehlt.indexOf(t.id)<0) gewaehlt.push(t.id); });
    $$('.chip[data-t]').forEach(function(c){ if(gewaehlt.indexOf(c.getAttribute('data-t'))>=0) c.classList.add('on'); });
  });
  on('#bPlan', function(){
    var d = $('#dArbeit').value;
    if(!d){ toast('Bitte trage zuerst das Datum der Klassenarbeit ein.'); return; }
    if(!gewaehlt.length){ toast('Wähle mindestens ein Thema aus.'); return; }
    if(tageDiff(heute(), d) < 0){ toast('Das Datum liegt in der Vergangenheit.'); return; }
    S.arbeit = planErstellen(d, gewaehlt);
    speichere();
    stack.pop(); go('arbeit');
  });
  on('#bLoesch', function(){ if(confirm('Klassenarbeit und Lernplan löschen?')){ S.arbeit=null; speichere(); stack.pop(); render(); } });
};
