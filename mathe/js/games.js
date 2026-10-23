/* =====================================================================
   Mathe Mission 5 — drei leichtgewichtige Mathe-Spiele
   ===================================================================== */
var gTimer = null;
function stopSpiel(){ clearInterval(gTimer); gTimer = null; }

VIEWS.spiele = function(){
  stopSpiel();
  var h = kopf('🎮 Mathe-Spiele','Kurz, schnell, mit XP');
  h += '<button class="btn" id="g1">🏁 Rechen-Rennen<br><span class="small" style="font-weight:400;color:#fff;opacity:.85">So viele Aufgaben wie möglich in 60 Sekunden</span></button>';
  h += '<button class="btn" id="g2">🎯 Zahlen-Jagd<br><span class="small" style="font-weight:400;color:#fff;opacity:.85">Finde alle passenden Zahlen, bevor die Zeit abläuft</span></button>';
  h += '<button class="btn" id="g3">🧩 Mathe-Puzzle<br><span class="small" style="font-weight:400;color:#fff;opacity:.85">Bringe den Rechenweg in die richtige Reihenfolge</span></button>';
  h += '<div class="card"><h3>Deine Bestwerte</h3><table>'+
       '<tr><td>🏁 Rechen-Rennen</td><td class="num"><b>'+S.spiele.rennen+'</b></td></tr>'+
       '<tr><td>🎯 Zahlen-Jagd</td><td class="num"><b>'+S.spiele.jagd+'</b></td></tr>'+
       '<tr><td>🧩 Mathe-Puzzle</td><td class="num"><b>'+S.spiele.puzzle+'</b></td></tr></table></div>';
  app.innerHTML = h;
  on('#g1', function(){ go('rennen'); });
  on('#g2', function(){ go('jagd'); });
  on('#g3', function(){ go('puzzle'); });
};

/* ---------------- Spiel 1: Rechen-Rennen ---------------- */
var RR = null;
function rrAufgabe(){
  var op = pick(['+','-','·',':']);
  var a,b,e;
  if(op==='+'){ a=R(12,89); b=R(9,79); e=a+b; }
  else if(op==='-'){ a=R(30,99); b=R(6,a-2); e=a-b; }
  else if(op==='·'){ a=R(3,12); b=R(3,12); e=a*b; }
  else { b=R(3,9); e=R(3,12); a=b*e; }
  var opts=[e], k=0;
  while(opts.length<4 && k<40){ var d=e+pick([-12,-9,-6,-3,-2,-1,1,2,3,5,7,10]); if(d>0 && opts.indexOf(d)<0) opts.push(d); k++; }
  return { text:a+' '+op+' '+b, e:e, opts:shuffle(opts) };
}
VIEWS.rennen = function(){
  stopSpiel();
  RR = { punkte:0, rest:60, akt:rrAufgabe(), fehler:0, start:Date.now() };
  rrZeichne();
  gTimer = setInterval(function(){
    RR.rest = 60 - Math.floor((Date.now()-RR.start)/1000);
    var u = $('#rrUhr'); if(!u){ stopSpiel(); return; }
    u.textContent = '⏱ '+RR.rest+' s';
    if(RR.rest<=0){ stopSpiel(); rrEnde(); }
  }, 300);
};
function rrZeichne(){
  var h = kopf('🏁 Rechen-Rennen','Tippe das richtige Ergebnis');
  h += '<div class="card tight"><div class="row between"><b id="rrUhr" class="timer">⏱ '+RR.rest+' s</b>'+
       '<b>'+RR.punkte+' Punkte</b></div></div>';
  h += '<div class="card spielfeld"><div class="zahlgross">'+RR.akt.text+' = ?</div>'+
       '<div style="width:100%">'+RR.akt.opts.map(function(o){
         return '<button class="opt center" data-o="'+o+'" style="text-align:center;font-size:20px">'+o+'</button>'; }).join('')+'</div></div>';
  app.innerHTML = h;
  var b=$('#btnBack'); if(b) b.onclick=function(){ stopSpiel(); zurueck(); };
  on('.opt[data-o]', function(e){
    var v = parseInt(e.getAttribute('data-o'),10);
    if(v===RR.akt.e){ RR.punkte += 10; }
    else { RR.punkte = Math.max(0, RR.punkte-5); RR.fehler++; }
    RR.akt = rrAufgabe();
    rrZeichne();
  });
}
function rrEnde(){
  if(RR.punkte > S.spiele.rennen) S.spiele.rennen = RR.punkte;
  var xp = Math.round(RR.punkte/5);
  gibXP(xp); pruefeErfolge(); speichere();
  var h = kopf('🏁 Ziel!','Rechen-Rennen', false);
  h += '<div class="card center"><div class="zahlgross">'+RR.punkte+' Punkte</div>'+
       '<div class="small">'+RR.fehler+' Fehler · +'+xp+' XP</div>'+
       '<div class="small" style="margin-top:6px">Bestwert: '+S.spiele.rennen+'</div></div>';
  h += '<button class="btn go" id="bNeu">↻ Nochmal</button><button class="btn ghost" id="bZ">Zurück</button>';
  app.innerHTML = h;
  on('#bNeu', function(){ VIEWS.rennen(); });
  on('#bZ', function(){ zurueck(); });
}

/* ---------------- Spiel 2: Zahlen-Jagd ---------------- */
var ZJ = null;
function zjRunde(){
  var art = pick(['vielfach','teiler','quadrat','groesser']);
  var basis, regel, test;
  if(art==='vielfach'){ basis=pick([3,4,6,7,8,9]); regel='Vielfache von '+basis; test=function(n){return n%basis===0;}; }
  else if(art==='teiler'){ basis=pick([24,36,48,60]); regel='Teiler von '+basis; test=function(n){return basis%n===0;}; }
  else if(art==='quadrat'){ regel='Quadratzahlen'; test=function(n){var w=Math.round(Math.sqrt(n));return w*w===n;}; }
  else { basis=pick([40,50,60,70]); regel='Zahlen größer als '+basis; test=function(n){return n>basis;}; }
  var zahlen=[], i=0;
  while(zahlen.length<12 && i<400){ var n=(art==='teiler')?R(2,basis):R(2,99); if(zahlen.indexOf(n)<0) zahlen.push(n); i++; }
  if(!zahlen.some(test)){ zahlen[0] = (art==='vielfach')? basis*R(2,9) : (art==='quadrat'? pick([4,9,16,25,36,49,64,81]) : (art==='teiler'? basis : basis+R(1,20))); }
  return { regel:regel, zahlen:shuffle(zahlen), test:test, getroffen:[] };
}
VIEWS.jagd = function(){
  stopSpiel();
  ZJ = { punkte:0, rest:45, runde:zjRunde(), start:Date.now(), fehler:0 };
  zjZeichne();
  gTimer = setInterval(function(){
    ZJ.rest = 45 - Math.floor((Date.now()-ZJ.start)/1000);
    var u=$('#zjUhr'); if(!u){ stopSpiel(); return; }
    u.textContent = '⏱ '+ZJ.rest+' s';
    if(ZJ.rest<=0){ stopSpiel(); zjEnde(); }
  }, 300);
};
function zjZeichne(){
  var r = ZJ.runde;
  var h = kopf('🎯 Zahlen-Jagd','Tippe alle passenden Zahlen an');
  h += '<div class="card tight"><div class="row between"><b id="zjUhr" class="timer">⏱ '+ZJ.rest+' s</b><b>'+ZJ.punkte+' Punkte</b></div></div>';
  h += '<div class="card"><div class="center" style="font-size:18px;font-weight:800;margin-bottom:10px">Finde: '+r.regel+'</div>'+
       '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">'+
       r.zahlen.map(function(n,i){
         var tr = r.getroffen.indexOf(i)>=0;
         return '<button class="opt center'+(tr?' right':'')+'" data-i="'+i+'" style="text-align:center;font-size:19px;margin:0">'+n+'</button>';
       }).join('')+'</div></div>';
  app.innerHTML = h;
  var b=$('#btnBack'); if(b) b.onclick=function(){ stopSpiel(); zurueck(); };
  on('.opt[data-i]', function(e){
    var i = parseInt(e.getAttribute('data-i'),10);
    if(r.getroffen.indexOf(i)>=0) return;
    var n = r.zahlen[i];
    if(r.test(n)){ r.getroffen.push(i); ZJ.punkte += 10;
      var offen = r.zahlen.filter(function(x){return r.test(x);}).length;
      if(r.getroffen.length >= offen){ ZJ.punkte += 20; ZJ.runde = zjRunde(); toast('✅ Runde geschafft! +20 Bonus', 1200); }
    } else { ZJ.punkte = Math.max(0, ZJ.punkte-5); ZJ.fehler++; toast('❌ '+n+' passt nicht.', 900); }
    zjZeichne();
  });
}
function zjEnde(){
  if(ZJ.punkte > S.spiele.jagd) S.spiele.jagd = ZJ.punkte;
  var xp = Math.round(ZJ.punkte/5);
  gibXP(xp); pruefeErfolge(); speichere();
  var h = kopf('🎯 Zeit um!','Zahlen-Jagd', false);
  h += '<div class="card center"><div class="zahlgross">'+ZJ.punkte+' Punkte</div>'+
       '<div class="small">'+ZJ.fehler+' Fehlgriffe · +'+xp+' XP</div>'+
       '<div class="small" style="margin-top:6px">Bestwert: '+S.spiele.jagd+'</div></div>';
  h += '<button class="btn go" id="bNeu">↻ Nochmal</button><button class="btn ghost" id="bZ">Zurück</button>';
  app.innerHTML = h;
  on('#bNeu', function(){ VIEWS.jagd(); });
  on('#bZ', function(){ zurueck(); });
}

/* ---------------- Spiel 3: Mathe-Puzzle ---------------- */
var MP = null;
function mpRunde(){
  var art = pick(['term','groesse','gleichung']);
  var schritte, frage;
  if(art==='term'){
    var a=R(2,9), b=R(2,9), c=R(2,9), d=R(2,6);
    frage = '('+a+' + '+b+') · '+c+' − '+d+' · 2';
    schritte = ['Klammer: '+a+' + '+b+' = '+(a+b),
                'Punktrechnung: '+(a+b)+' · '+c+' = '+((a+b)*c),
                'Punktrechnung: '+d+' · 2 = '+(d*2),
                'Strichrechnung: '+((a+b)*c)+' − '+(d*2)+' = '+((a+b)*c-d*2)];
  } else if(art==='groesse'){
    var m=R(2,6), cm=R(10,90), plus=R(20,90);
    frage = m+' m '+cm+' cm + '+plus+' cm = ?';
    schritte = ['Einheiten angleichen: '+m+' m = '+(m*100)+' cm',
                'Zusammenfassen: '+(m*100)+' cm + '+cm+' cm = '+(m*100+cm)+' cm',
                'Addieren: '+(m*100+cm)+' cm + '+plus+' cm = '+(m*100+cm+plus)+' cm',
                'Ergebnis umschreiben: '+(m*100+cm+plus)+' cm = '+Math.floor((m*100+cm+plus)/100)+' m '+((m*100+cm+plus)%100)+' cm'];
  } else {
    var x=R(3,12), f=R(3,8), p=R(4,25);
    frage = f+' · x + '+p+' = '+(f*x+p);
    schritte = ['Auf beiden Seiten '+p+' abziehen',
                f+' · x = '+(f*x+p)+' − '+p+' = '+(f*x),
                'Durch '+f+' teilen: x = '+(f*x)+' : '+f,
                'x = '+x+'  (Probe: '+f+' · '+x+' + '+p+' = '+(f*x+p)+')'];
  }
  return { frage:frage, richtig:schritte, pool:shuffle(schritte), gewaehlt:[] };
}
VIEWS.puzzle = function(){
  stopSpiel();
  MP = { punkte:0, runden:0, r:mpRunde() };
  mpZeichne();
};
function mpZeichne(){
  var r = MP.r;
  var h = kopf('🧩 Mathe-Puzzle','Bringe den Rechenweg in die richtige Reihenfolge');
  h += '<div class="card tight"><div class="row between"><b>Runde '+(MP.runden+1)+'</b><b>'+MP.punkte+' Punkte</b></div></div>';
  h += '<div class="card"><div class="frage center">'+fmt(r.frage)+'</div>';
  h += '<div class="small">Dein Rechenweg:</div><div style="min-height:40px;margin:6px 0">'+
       (r.gewaehlt.length? r.gewaehlt.map(function(s,i){return '<div class="puzzle-item sel">'+(i+1)+'. '+fmt(s)+'</div>';}).join('') : '<div class="small">— noch leer —</div>')+'</div>';
  h += '<div style="border-top:1px solid var(--line);padding-top:8px">'+
       r.pool.map(function(s,i){ return r.gewaehlt.indexOf(s)>=0 ? '' : '<button class="puzzle-item" data-s="'+i+'">'+fmt(s)+'</button>'; }).join('')+'</div>';
  h += '</div>';
  h += '<button class="btn go" id="bPr">Reihenfolge prüfen</button>';
  h += '<button class="btn ghost" id="bRe">↺ Zurücksetzen</button>';
  app.innerHTML = h;
  var b=$('#btnBack'); if(b) b.onclick=function(){ zurueck(); };
  on('.puzzle-item[data-s]', function(e){ r.gewaehlt.push(r.pool[parseInt(e.getAttribute('data-s'),10)]); mpZeichne(); });
  on('#bRe', function(){ r.gewaehlt=[]; mpZeichne(); });
  on('#bPr', function(){
    if(r.gewaehlt.length < r.richtig.length){ toast('Ordne erst alle Schritte ein.'); return; }
    var ok = r.gewaehlt.join('|')===r.richtig.join('|');
    if(ok){
      MP.punkte += 25; MP.runden++;
      if(MP.runden>=4){ mpEnde(); return; }
      toast('✅ Richtig! +25 Punkte', 1400);
      MP.r = mpRunde(); mpZeichne();
    } else {
      var falschAb = 0;
      for(var i=0;i<r.richtig.length;i++){ if(r.gewaehlt[i]!==r.richtig[i]){ falschAb=i+1; break; } }
      MP.punkte = Math.max(0, MP.punkte-10);
      toast('❌ Ab Schritt '+falschAb+' stimmt die Reihenfolge nicht. Denk an: Klammern → Punkt → Strich.', 3600);
      r.gewaehlt = r.gewaehlt.slice(0, falschAb-1);
      mpZeichne();
    }
  });
}
function mpEnde(){
  if(MP.punkte > S.spiele.puzzle) S.spiele.puzzle = MP.punkte;
  var xp = Math.round(MP.punkte/5);
  gibXP(xp); pruefeErfolge(); speichere();
  var h = kopf('🧩 Geschafft!','Mathe-Puzzle', false);
  h += '<div class="card center"><div class="zahlgross">'+MP.punkte+' Punkte</div>'+
       '<div class="small">+'+xp+' XP · Bestwert: '+S.spiele.puzzle+'</div></div>';
  h += '<button class="btn go" id="bNeu">↻ Nochmal</button><button class="btn ghost" id="bZ">Zurück</button>';
  app.innerHTML = h;
  on('#bNeu', function(){ VIEWS.puzzle(); });
  on('#bZ', function(){ zurueck(); });
}
