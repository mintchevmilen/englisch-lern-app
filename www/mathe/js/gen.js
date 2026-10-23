/* =====================================================================
   Mathe Mission 5 — Aufgaben-Generatoren
   Alle Aufgaben werden zur Laufzeit NEU erzeugt. Es werden keinerlei
   Aufgaben aus dem Schulbuch uebernommen.

   Aufgaben-Objekt:
   { typ, frage, grafik?, loesung?, einheit?, optionen?, richtig?,
     items?, paare?, schritte?, tipp?, erklaerung?, stufe, punkte }
   ===================================================================== */

/* ---------- Zufalls- und Formathelfer ---------- */
function R(a,b){ return Math.floor(Math.random()*(b-a+1))+a; }
function pick(a){ return a[R(0,a.length-1)]; }
function shuffle(a){ a=a.slice(); for(var i=a.length-1;i>0;i--){var j=R(0,i),t=a[i];a[i]=a[j];a[j]=t;} return a; }
function nf(n){
  var s=String(n); if(s.length<5) return s;
  var out='',c=0;
  for(var i=s.length-1;i>=0;i--){ out=s.charAt(i)+out; c++; if(c%3===0&&i>0) out=' '+out; }
  return out;
}
function kf(n){ // Kommazahl deutsch
  return String(n).replace('.',',');
}
function eur(c){ // Cent -> "12,50"
  return (Math.floor(c/100))+','+(c%100<10?'0':'')+(c%100);
}

/* Multiple-Choice bauen: richtige Antwort + Distraktoren */
function mc(frage, richtig, falsche, erkl, extra){
  var opts = shuffle([String(richtig)].concat(falsche.map(String)).filter(function(v,i,a){return a.indexOf(v)===i;}).slice(0,4));
  if(opts.indexOf(String(richtig))<0){ opts[0]=String(richtig); opts=shuffle(opts); }
  var o = { typ:'mc', frage:frage, optionen:opts, richtig:opts.indexOf(String(richtig)), erklaerung:erkl };
  if(extra) for(var k in extra) o[k]=extra[k];
  return o;
}
function num(frage, loesung, erkl, extra){
  var o = { typ:'num', frage:frage, loesung:String(loesung), erklaerung:erkl };
  if(extra) for(var k in extra) o[k]=extra[k];
  return o;
}
function tf(frage, richtig, erkl){
  return { typ:'tf', frage:frage, loesung: richtig?'r':'f', erklaerung:erkl };
}
function steps(frage, schritte, erkl, extra){
  var o = { typ:'steps', frage:frage, schritte:schritte, erklaerung:erkl };
  if(extra) for(var k in extra) o[k]=extra[k];
  return o;
}
function order(frage, items, erkl){
  return { typ:'order', frage:frage, items:items, erklaerung:erkl };
}
function match(frage, paare, erkl){
  return { typ:'match', frage:frage, paare:paare, erklaerung:erkl };
}
function gap(frage, loesung, erkl){
  return { typ:'gap', frage:frage, loesung:String(loesung), erklaerung:erkl };
}
/* Fehlersuche: Rechenweg mit genau einem falschen Schritt */
function fehler(frage, zeilen, falscheZeile, erkl){
  return { typ:'fehler', frage:frage, optionen:zeilen, richtig:falscheZeile, erklaerung:erkl };
}

/* ---------- kleine SVG-Grafiken (leichtgewichtig, ohne Bibliothek) ---------- */
function svgZahlenstrahl(von, bis, teile, markIdx){
  var w=300,h=64,pad=18, x0=pad, x1=w-pad, s='';
  s+='<svg viewBox="0 0 '+w+' '+h+'" class="gsvg" role="img">';
  s+='<line x1="'+x0+'" y1="34" x2="'+x1+'" y2="34" stroke="currentColor" stroke-width="2"/>';
  s+='<polygon points="'+x1+',34 '+(x1-8)+',30 '+(x1-8)+',38" fill="currentColor"/>';
  for(var i=0;i<=teile;i++){
    var x = x0 + (x1-x0-10)*i/teile;
    var big = (i===0||i===teile);
    s+='<line x1="'+x+'" y1="'+(big?24:28)+'" x2="'+x+'" y2="'+(big?44:40)+'" stroke="currentColor" stroke-width="'+(big?2:1)+'"/>';
    if(big) s+='<text x="'+x+'" y="58" text-anchor="middle" font-size="11" fill="currentColor">'+nf(i===0?von:bis)+'</text>';
    if(i===markIdx) s+='<circle cx="'+x+'" cy="34" r="5" fill="#e0567a"/><text x="'+x+'" y="16" text-anchor="middle" font-size="12" fill="#e0567a" font-weight="700">?</text>';
  }
  s+='</svg>';
  return s;
}
function svgKoord(punkte, max, frageIdx){
  var w=260,h=260,pad=26,step=(w-2*pad)/max,s='';
  s+='<svg viewBox="0 0 '+w+' '+h+'" class="gsvg" role="img">';
  for(var i=0;i<=max;i++){
    var x=pad+i*step, y=h-pad-i*step;
    s+='<line x1="'+x+'" y1="'+pad+'" x2="'+x+'" y2="'+(h-pad)+'" stroke="currentColor" stroke-width="0.4" opacity="0.35"/>';
    s+='<line x1="'+pad+'" y1="'+y+'" x2="'+(w-pad)+'" y2="'+y+'" stroke="currentColor" stroke-width="0.4" opacity="0.35"/>';
    if(i%2===0&&i>0){
      s+='<text x="'+x+'" y="'+(h-pad+14)+'" text-anchor="middle" font-size="10" fill="currentColor">'+i+'</text>';
      s+='<text x="'+(pad-8)+'" y="'+(y+4)+'" text-anchor="end" font-size="10" fill="currentColor">'+i+'</text>';
    }
  }
  s+='<line x1="'+pad+'" y1="'+(h-pad)+'" x2="'+(w-pad)+'" y2="'+(h-pad)+'" stroke="currentColor" stroke-width="1.6"/>';
  s+='<line x1="'+pad+'" y1="'+(h-pad)+'" x2="'+pad+'" y2="'+pad+'" stroke="currentColor" stroke-width="1.6"/>';
  for(var p=0;p<punkte.length;p++){
    var px=pad+punkte[p][0]*step, py=h-pad-punkte[p][1]*step;
    var isQ = (p===frageIdx);
    s+='<circle cx="'+px+'" cy="'+py+'" r="5" fill="'+(isQ?'#e0567a':'#4f7cff')+'"/>';
    s+='<text x="'+(px+8)+'" y="'+(py-7)+'" font-size="12" font-weight="700" fill="'+(isQ?'#e0567a':'#4f7cff')+'">'+(punkte[p][2]||'')+'</text>';
  }
  s+='</svg>';
  return s;
}
function svgRechteck(a,b,ea,eb,label){
  var w=280,h=170,pad=32;
  var bw=w-2*pad, bh=Math.max(52, Math.min(h-2*pad, bw*b/a));
  var s='<svg viewBox="0 0 '+w+' '+h+'" class="gsvg" role="img">';
  s+='<rect x="'+pad+'" y="'+pad+'" width="'+bw+'" height="'+bh+'" fill="rgba(79,124,255,.14)" stroke="currentColor" stroke-width="2"/>';
  s+='<text x="'+(pad+bw/2)+'" y="'+(pad+bh+20)+'" text-anchor="middle" font-size="13" fill="currentColor">'+a+' '+ea+'</text>';
  s+='<text x="'+(pad-8)+'" y="'+(pad+bh/2+4)+'" text-anchor="end" font-size="13" fill="currentColor">'+b+' '+eb+'</text>';
  if(label) s+='<text x="'+(pad+bw/2)+'" y="'+(pad+bh/2+5)+'" text-anchor="middle" font-size="13" fill="currentColor" opacity=".75">'+label+'</text>';
  s+='</svg>';
  return s;
}
function svgLFigur(A,B,c,d){
  var w=280,h=190,pad=26,sc=Math.min((w-2*pad)/A,(h-2*pad)/B);
  var W=A*sc,H=B*sc,cw=c*sc,ch=d*sc;
  var pts=[[pad,pad+H],[pad,pad],[pad+W-cw,pad],[pad+W-cw,pad+ch],[pad+W,pad+ch],[pad+W,pad+H]];
  var p=pts.map(function(q){return q[0]+','+q[1];}).join(' ');
  var s='<svg viewBox="0 0 '+w+' '+h+'" class="gsvg" role="img">';
  s+='<polygon points="'+p+'" fill="rgba(224,86,122,.15)" stroke="currentColor" stroke-width="2"/>';
  s+='<text x="'+(pad+W/2)+'" y="'+(pad+H+18)+'" text-anchor="middle" font-size="12" fill="currentColor">'+A+' cm</text>';
  s+='<text x="'+(pad-6)+'" y="'+(pad+H/2)+'" text-anchor="end" font-size="12" fill="currentColor">'+B+' cm</text>';
  s+='<text x="'+(pad+W-cw/2)+'" y="'+(pad-8)+'" text-anchor="middle" font-size="11" fill="currentColor" opacity=".8">'+c+' cm</text>';
  s+='<text x="'+(pad+W+4)+'" y="'+(pad+ch/2+4)+'" font-size="11" fill="currentColor" opacity=".8">'+d+' cm</text>';
  s+='</svg>';
  return s;
}
function svgSaeulen(labels, werte){
  var w=290,h=160,pad=26,bw=(w-2*pad)/labels.length, mx=Math.max.apply(null,werte);
  var s='<svg viewBox="0 0 '+w+' '+h+'" class="gsvg" role="img">';
  for(var i=0;i<labels.length;i++){
    var bh=(h-pad-24)*werte[i]/mx, x=pad+i*bw+4, y=h-24-bh;
    s+='<rect x="'+x+'" y="'+y+'" width="'+(bw-8)+'" height="'+bh+'" fill="#4f7cff" opacity=".85" rx="3"/>';
    s+='<text x="'+(x+(bw-8)/2)+'" y="'+(y-4)+'" text-anchor="middle" font-size="11" fill="currentColor">'+werte[i]+'</text>';
    s+='<text x="'+(x+(bw-8)/2)+'" y="'+(h-8)+'" text-anchor="middle" font-size="11" fill="currentColor">'+labels[i]+'</text>';
  }
  s+='<line x1="'+pad+'" y1="'+(h-24)+'" x2="'+(w-6)+'" y2="'+(h-24)+'" stroke="currentColor" stroke-width="1.4"/>';
  s+='</svg>';
  return s;
}

var GEN = {};

/* =================== KAPITEL 1 — Zahlen & Daten =================== */
var STELLEN = ['Einer','Zehner','Hunderter','Tausender','Zehntausender','Hunderttausender','Millionen'];
var STELLENWERT = [1,10,100,1000,10000,100000,1000000];

/* Ziffer an Position pos (von rechts, 0-basiert) farbig hervorheben */
function markiereZiffer(n, pos){
  var s = String(n), i = s.length-1-pos, out='';
  for(var k=0;k<s.length;k++){
    out += (k===i) ? '<span style="color:#e0567a;font-weight:800">'+s.charAt(k)+'</span>' : s.charAt(k);
    if(s.length>4 && (s.length-1-k)%3===0 && k<s.length-1) out += ' ';
  }
  return out;
}

GEN.t101 = function(l){
  var len = l===1?4:(l===2?6:7);
  var z=''; for(var i=0;i<len;i++) z += String(i===0?R(1,9):R(0,9));
  var n = parseInt(z,10), pos = R(0, len-1);
  var nz = []; for(var q=0;q<len;q++) if(z.charAt(len-1-q)!=='0') nz.push(q);
  pos = pick(nz);
  var ziffer = parseInt(z.charAt(len-1-pos),10);
  if(l===1){
    return mc('Welchen Stellenwert hat die <b>farbig markierte</b> Ziffer?<br><span style="font-size:24px;font-weight:800">'+markiereZiffer(n,pos)+'</span>',
      STELLEN[pos], shuffle(STELLEN.slice(0,len).filter(function(x){return x!==STELLEN[pos];})).slice(0,3),
      'Zähle die Stellen von rechts: Einer, Zehner, Hunderter, Tausender …  Die markierte Ziffer steht an der '+(pos+1)+'. Stelle von rechts — das sind die '+STELLEN[pos]+'.');
  }
  if(l===2){
    return num('Welchen <b>Wert</b> hat die farbig markierte Ziffer?<br><span style="font-size:24px;font-weight:800">'+markiereZiffer(n,pos)+'</span>',
      ziffer*STELLENWERT[pos],
      'Die Ziffer '+ziffer+' steht an der '+STELLEN[pos]+'-Stelle ('+(pos+1)+'. Stelle von rechts). Also: '+ziffer+' · '+nf(STELLENWERT[pos])+' = '+nf(ziffer*STELLENWERT[pos])+'.');
  }
  var a=R(1,9),b=R(1,9),c=R(1,9);
  var erg = a*1000000 + b*10000 + c*10;
  return num('Schreibe als Zahl: '+a+' Millionen, '+b+' Zehntausender und '+c+' Zehner.',
    erg, 'Setze in die Stellenwerttafel ein und fülle leere Stellen mit 0:  M='+a+', HT=0, ZT='+b+', T=0, H=0, Z='+c+', E=0  →  '+nf(erg)+'.');
};

GEN.t102 = function(l){
  if(l===1){
    var a=R(1000,99999), b=a + pick([-1,1])*R(1,900);
    return mc('Welches Zeichen gehört in die Lücke?<br>'+nf(a)+'  ___  '+nf(b),
      a<b?'<':(a>b?'>':'='), ['<','>','='].filter(function(x){return x!==(a<b?'<':'>');}),
      'Vergleiche Stelle für Stelle von links. '+nf(a)+' '+(a<b?'<':'>')+' '+nf(b)+'.');
  }
  if(l===2){
    var zs;
    do { var base=R(10000,80000); zs=[base,base+R(1,60),base+R(100,900),base-R(1,90)]; }
    while(zs.filter(function(v,i,arr){return arr.indexOf(v)===i;}).length<4);
    var sorted=zs.slice().sort(function(x,y){return x-y;});
    return order('Ordne die Zahlen der Größe nach — beginne mit der <b>kleinsten</b>.',
      sorted.map(nf), 'Zuerst die Stellenanzahl vergleichen, dann von links Ziffer für Ziffer.');
  }
  var d=shuffle([R(1,9),R(1,9),R(1,9),R(1,9)]);
  var gr=parseInt(d.slice().sort(function(x,y){return y-x;}).join(''),10);
  return num('Bilde aus den Ziffern '+d.join(', ')+' die <b>größtmögliche</b> vierstellige Zahl (jede Ziffer genau einmal).',
    gr, 'Die größte Ziffer kommt an die vorderste Stelle, dann absteigend weiter: '+gr+'.');
};

GEN.t103 = function(l){
  var conf = l===1 ? {von:0,bis:100,teile:10} : (l===2 ? {von:0,bis:1000,teile:pick([5,10])} : {von:pick([2000,5000]),bis:0,teile:pick([4,8])});
  if(l===3){ conf.bis = conf.von + pick([1000,2000,4000]); conf.von = conf.von; }
  var idx = R(1, conf.teile-1);
  var schritt = (conf.bis-conf.von)/conf.teile;
  var wert = conf.von + idx*schritt;
  return num('Welche Zahl gehört zum markierten Punkt?', wert,
    'Schrittweite: ('+nf(conf.bis)+' − '+nf(conf.von)+') : '+conf.teile+' = '+nf(schritt)+'. Der Punkt liegt '+idx+' Schritte nach '+nf(conf.von)+': '+nf(conf.von)+' + '+idx+' · '+nf(schritt)+' = '+nf(wert)+'.',
    { grafik: svgZahlenstrahl(conf.von, conf.bis, conf.teile, idx) });
};

GEN.t104 = function(l){
  var stufe = l===1 ? R(1,2) : (l===2 ? R(2,3) : R(3,5));
  var n = R(Math.pow(10,stufe+1), Math.pow(10,stufe+2)-1);
  var p = STELLENWERT[stufe];
  var ger = Math.round(n/p)*p;
  var nachbar = Math.floor(n/p)*p;
  var name = STELLEN[stufe];
  return num('Runde '+nf(n)+' auf <b>'+name+'</b>.', ger,
    'Rundungsstelle: '+name+'. Rechts davon steht die Ziffer '+String(n).charAt(String(n).length-stufe)+
    ' → '+(ger>nachbar?'aufrunden':'abrunden')+'. Ergebnis: '+nf(ger)+'.');
};

GEN.t105 = function(l){
  if(l===1){
    var a=R(1,9),b=R(0,9),c=R(0,9),dd=R(0,9);
    var n=a*1000+b*100+c*10+dd;
    return num('Schreibe als Zahl:  '+a+' · 1000 + '+b+' · 100 + '+c+' · 10 + '+dd+' · 1', n,
      'Jeder Summand steht für einen Stellenwert: '+nf(n)+'.');
  }
  if(l===2){
    var n2=R(100000,999999);
    return num('Wie viele volle <b>Tausender</b> stecken in der Zahl '+nf(n2)+'?', Math.floor(n2/1000),
      'Alles ab der Tausenderstelle nach links: '+nf(n2)+' : 1000 = '+Math.floor(n2/1000)+' Rest '+(n2%1000)+'.');
  }
  var m=R(1,9), t=R(1,99), e=R(1,999);
  var erg=m*1000000+t*1000+e;
  return num('Schreibe als Zahl: '+m+' Millionen + '+t+' Tausender + '+e+' Einer', erg,
    m+' · 1 000 000 + '+t+' · 1000 + '+e+' = '+nf(erg)+'.');
};

GEN.t106 = function(l){
  var tage=['Mo','Di','Mi','Do','Fr'], w, mx, mn;
  do { w=[R(4,20),R(4,20),R(4,20),R(4,20),R(4,20)]; mx=Math.max.apply(null,w); mn=Math.min.apply(null,w); }
  while(w.filter(function(v){return v===mx;}).length>1 || w.filter(function(v){return v===mn;}).length>1);
  var kontexte=['In der Schulbibliothek wurden in einer Woche Bücher ausgeliehen.','Der Schulkiosk hat in einer Woche Brötchen verkauft.','Eine Klasse hat in einer Woche Pfandflaschen gesammelt.','Im Schwimmbad wurden in einer Woche Eintrittskarten für Kinder verkauft.'];
  var kontext=pick(kontexte);
  var g=svgSaeulen(tage,w);
  var sum=w.reduce(function(a,b){return a+b;},0);
  if(l===1){
    var i=R(0,4);
    return num(kontext+'<br>Wie viele waren es am '+tage[i]+'?', w[i], 'Lies die Höhe der Säule '+tage[i]+' ab: '+w[i]+'.', {grafik:g});
  }
  if(l===2){
    return num(kontext+'<br>Wie viele waren es in der ganzen Woche <b>insgesamt</b>?', sum,
      w.join(' + ')+' = '+sum+'.', {grafik:g});
  }
  return num(kontext+'<br>Wie groß ist der <b>Unterschied</b> zwischen dem stärksten und dem schwächsten Tag?', mx-mn,
    'Größter Wert '+mx+', kleinster Wert '+mn+'.  '+mx+' − '+mn+' = '+(mx-mn)+'.', {grafik:g});
};

/* =================== KAPITEL 2 — Rechnen =================== */
GEN.t201 = function(l){
  if(l===1){
    var a=R(20,89), b=R(11,49);
    if(R(0,1)) return num('Berechne im Kopf:  '+a+' + '+b, a+b, a+' + '+b+' = '+a+' + '+(Math.floor(b/10)*10)+' + '+(b%10)+' = '+(a+Math.floor(b/10)*10)+' + '+(b%10)+' = '+(a+b)+'.');
    if(a<=b){var t=a;a=b+R(1,15);b=b;}
    var zb=Math.floor(b/10)*10, eb=b%10;
    return num('Berechne im Kopf:  '+a+' − '+b, a-b,
      'Zerlege '+b+' in '+zb+' + '+eb+':  '+a+' − '+zb+' = '+(a-zb)+',  dann '+(a-zb)+' − '+eb+' = '+(a-b)+'.');
  }
  if(l===2){
    var x=R(120,890), y=R(60,320);
    return num('Berechne im Kopf:  '+x+' + '+y, x+y, x+' + '+y+' = '+x+' + '+(Math.floor(y/100)*100)+' + '+(y%100)+' = '+(x+y)+'.');
  }
  var p=R(200,900), q=R(150,600), r=R(20,90);
  return steps('Berechne geschickt:  '+p+' + '+q+' − '+r,
    [{frage:'Schritt 1: '+p+' + '+q+' = ?', loesung:String(p+q), tipp:'Erst die beiden großen Zahlen addieren.'},
     {frage:'Schritt 2: '+(p+q)+' − '+r+' = ?', loesung:String(p+q-r), tipp:'Jetzt den kleinen Wert abziehen.'}],
    'Von links nach rechts: '+p+' + '+q+' = '+(p+q)+', dann − '+r+' = '+(p+q-r)+'.');
};

GEN.t202 = function(l){
  var a,b;
  if(l===1){ a=R(100,899); b=R(100,899); return num('Rechne schriftlich:  '+a+' + '+b, a+b, 'Stellen untereinander, von rechts rechnen, Überträge nicht vergessen. '+a+' + '+b+' = '+(a+b)+'.'); }
  if(l===2){ a=R(2000,8999); b=R(1000,a-1); return num('Rechne schriftlich:  '+nf(a)+' − '+nf(b), a-b, 'Von rechts nach links; reicht eine Ziffer nicht, borgst du dir 10 von der nächsten Stelle. '+nf(a)+' − '+nf(b)+' = '+nf(a-b)+'.'); }
  a=R(10000,79999); b=R(5000,19999); var c=R(1000,7999);
  return steps('Rechne schriftlich:  '+nf(a)+' + '+nf(b)+' − '+nf(c),
    [{frage:'Schritt 1: '+nf(a)+' + '+nf(b)+' = ?', loesung:String(a+b), tipp:'Erst die Addition.'},
     {frage:'Schritt 2: '+nf(a+b)+' − '+nf(c)+' = ?', loesung:String(a+b-c), tipp:'Jetzt schriftlich subtrahieren.'}],
    'Zuerst addieren ('+nf(a+b)+'), dann subtrahieren: '+nf(a+b-c)+'.');
};

GEN.t203 = function(l){
  if(l===1){
    var a=R(2,9), b=pick([10,100,1000]);
    var c=R(11,99);
    if(R(0,1)) return num('Berechne:  '+c+' · '+b, c*b, 'Mit '+b+' multiplizieren heißt '+(String(b).length-1)+' Nullen anhängen → '+nf(c*b)+'.');
    return num('Berechne:  '+(a*b*10)+' : '+b, a*10, 'Durch '+b+' teilen heißt: so viele Nullen streichen → '+(a*10)+'.');
  }
  if(l===2){
    var x=pick([15,25,35,45,12,24,18]), y=R(3,9);
    return num('Berechne im Kopf:  '+x+' · '+y, x*y, x+' · '+y+' = ('+(Math.floor(x/10)*10)+' + '+(x%10)+') · '+y+' = '+(Math.floor(x/10)*10*y)+' + '+((x%10)*y)+' = '+(x*y)+'.');
  }
  var f1=pick([25,50,125]), f2=pick([4,8,2]), f3=R(3,19);
  return num('Rechne geschickt:  '+f1+' · '+f3+' · '+f2, f1*f2*f3,
    'Vertausche die Faktoren: '+f1+' · '+f2+' = '+(f1*f2)+', dann · '+f3+' = '+nf(f1*f2*f3)+'.');
};

GEN.t204 = function(l){
  var a,b;
  if(l===1){ a=R(23,99); b=R(3,9); return num('Rechne schriftlich:  '+a+' · '+b, a*b, a+' · '+b+' = '+(Math.floor(a/10)*10)+' · '+b+' + '+(a%10)+' · '+b+' = '+(Math.floor(a/10)*10*b)+' + '+((a%10)*b)+' = '+(a*b)+'.'); }
  if(l===2){ a=R(112,899); b=R(12,49); if(b%10===0) b++;
    return steps('Rechne schriftlich:  '+a+' · '+b,
      [{frage:'Teilprodukt 1:  '+a+' · '+(b%10)+' = ?', loesung:String(a*(b%10)), tipp:'Erst mit der Einerziffer.'},
       {frage:'Teilprodukt 2:  '+a+' · '+(Math.floor(b/10)*10)+' = ?', loesung:String(a*Math.floor(b/10)*10), tipp:'Jetzt mit der Zehnerziffer — eine Stelle nach links.'},
       {frage:'Summe beider Teilprodukte = ?', loesung:String(a*b), tipp:'Beide Zeilen addieren.'}],
      a+' · '+b+' = '+nf(a*b)+'.'); }
  a=R(210,980); b=R(112,499);
  return num('Rechne schriftlich:  '+a+' · '+b, a*b,
    'Drei Teilprodukte bilden und addieren: '+a+' · '+b+' = '+nf(a*b)+'.');
};

GEN.t205 = function(l){
  if(l===1){
    var d=R(3,9), q=R(21,99), a=d*q;
    return num('Rechne:  '+a+' : '+d, q, a+' : '+d+' = '+q+' (geht ohne Rest auf).');
  }
  if(l===2){
    var d2=R(3,9), q2=R(120,899), r2=R(1,d2-1), a2=d2*q2+r2;
    return steps('Rechne schriftlich mit Rest:  '+nf(a2)+' : '+d2,
      [{frage:'Ergebnis (ohne Rest) = ?', loesung:String(q2), tipp:'Von links Stelle für Stelle dividieren.'},
       {frage:'Rest = ?', loesung:String(r2), tipp:'Was bleibt am Ende übrig?'}],
      nf(a2)+' : '+d2+' = '+nf(q2)+' Rest '+r2+'.  Probe: '+nf(q2)+' · '+d2+' + '+r2+' = '+nf(a2)+'.');
  }
  var d3=R(12,29), q3=R(120,900), r3=R(1,d3-1), a3=d3*q3+r3;
  return steps('Rechne schriftlich mit Rest:  '+nf(a3)+' : '+d3,
    [{frage:'Ergebnis (ohne Rest) = ?', loesung:String(q3), tipp:'Überschlag hilft: '+nf(a3)+' : '+(Math.round(d3/10)*10)+' ≈ '+Math.round(a3/(Math.round(d3/10)*10 || d3))+'.'},
     {frage:'Rest = ?', loesung:String(r3), tipp:'Rest = '+nf(a3)+' − '+nf(q3)+' · '+d3+'.'}],
    nf(a3)+' : '+d3+' = '+nf(q3)+' Rest '+r3+'.');
};

GEN.t206 = function(l){
  if(l===1){
    var a=R(2,9),b=R(2,9),c=R(2,19);
    return num('Berechne:  '+c+' + '+a+' · '+b, c+a*b,
      'Punkt vor Strich: zuerst '+a+' · '+b+' = '+(a*b)+', dann '+c+' + '+(a*b)+' = '+(c+a*b)+'.');
  }
  if(l===2){
    if(R(0,1)){
      var a2=R(2,9), b2=R(2,9), c2=R(3,9), d2=R(2,9);
      var s1=a2+b2, s2=s1*c2, s3=s2-d2;
      var k=R(0,2), abw=pick([-2,-1,1,2,10]);
      var w1=s1, w2, w3;
      if(k===0){ w1=s1+abw; w2=w1*c2; w3=w2-d2; }
      else if(k===1){ w2=s1*c2+abw; w3=w2-d2; }
      else { w2=s1*c2; w3=w2-d2+abw; }
      if(k>0) w1=s1;
      if(k>1) w2=s1*c2;
      var zeilen=['Schritt 1:  '+a2+' + '+b2+' = '+w1,
                  'Schritt 2:  '+w1+' · '+c2+' = '+w2,
                  'Schritt 3:  '+w2+' − '+d2+' = '+w3];
      return fehler('Jemand hat  ('+a2+' + '+b2+') · '+c2+' − '+d2+'  so gerechnet:', zeilen, k,
        'In Schritt '+(k+1)+' stimmt das Ergebnis nicht. Richtig wäre '+[s1,s2,s3][k]+'. Damit lautet das richtige Endergebnis '+s3+'.');
    }
    var p=R(2,9),q=R(3,9),r=R(2,9),s=p*q+R(3,30);
    return num('Berechne:  '+s+' − '+p+' · '+q+' + '+r, s-p*q+r,
      'Zuerst '+p+' · '+q+' = '+(p*q)+'. Dann von links: '+s+' − '+(p*q)+' = '+(s-p*q)+', + '+r+' = '+(s-p*q+r)+'.');
  }
  var x=R(2,9),y=R(2,9),z=R(2,9);
  var w=R(2, Math.max(2, Math.min(9, Math.floor(((x+y)*z-1)/2))));
  var erg = (x+y)*z - w*2;
  return steps('Berechne:  ('+x+' + '+y+') · '+z+' − '+w+' · 2',
    [{frage:'Schritt 1 — Klammer:  '+x+' + '+y+' = ?', loesung:String(x+y), tipp:'Klammern haben Vorrang.'},
     {frage:'Schritt 2:  '+(x+y)+' · '+z+' = ?', loesung:String((x+y)*z), tipp:'Punktrechnung.'},
     {frage:'Schritt 3:  '+w+' · 2 = ?', loesung:String(w*2), tipp:'Zweite Punktrechnung.'},
     {frage:'Schritt 4:  '+((x+y)*z)+' − '+(w*2)+' = ?', loesung:String(erg), tipp:'Zum Schluss die Strichrechnung.'}],
    'Klammer → Punkt → Strich. Ergebnis: '+erg+'.');
};

GEN.t207 = function(l){
  if(l===1){
    var a=R(2,12),b=R(2,12); while(b===a) b=R(2,12);
    var c3=R(2,9);
    var K='Kommutativgesetz (Vertauschgesetz)', A='Assoziativgesetz (Verbindungsgesetz)', D='Distributivgesetz (Verteilungsgesetz)';
    var fall=pick([
      [a+' · '+b+' = '+b+' · '+a, K, 'Hier werden die Zahlen vertauscht, das Ergebnis bleibt gleich.'],
      [a+' + '+b+' = '+b+' + '+a, K, 'Auch beim Addieren darf man vertauschen.'],
      ['('+a+' + '+b+') + '+c3+' = '+a+' + ('+b+' + '+c3+')', A, 'Hier ändert sich nur, wo die Klammer steht. Das ist das Verbindungsgesetz.'],
      ['('+a+' · '+b+') · '+c3+' = '+a+' · ('+b+' · '+c3+')', A, 'Die Klammer wandert, die Reihenfolge der Zahlen bleibt. Das ist das Verbindungsgesetz.'],
      [c3+' · ('+a+' + '+b+') = '+c3+' · '+a+' + '+c3+' · '+b, D, 'Der Faktor wird auf jeden Summanden verteilt. Das ist das Verteilungsgesetz.']
    ]);
    return mc('Welches Rechengesetz steckt hier drin?<br>'+fall[0], fall[1],
      [K,A,D].filter(function(x){return x!==fall[1];}).concat(['Rundungsregel']), fall[2]);
  }
  if(l===2){
    if(R(0,1)){
      var g1=R(3,9), h1=R(2,9), i1=R(2,9);
      return gap('Ergänze die Lücke:  '+g1+' · ('+h1+' + '+i1+') = '+g1+' · '+h1+' + '+g1+' · ___', i1,
        'Beim Distributivgesetz wird der Faktor '+g1+' mit **jedem** Summanden in der Klammer multipliziert — also auch mit '+i1+'.');
    }
    var c=R(3,9), d=R(11,29), e=R(11,29);
    return num('Rechne geschickt mit dem Distributivgesetz:  '+c+' · '+d+' + '+c+' · '+e, c*(d+e),
      'Ausklammern: '+c+' · ('+d+' + '+e+') = '+c+' · '+(d+e)+' = '+(c*(d+e))+'.');
  }
  var f=R(3,9), g=R(101,199);
  return num('Rechne geschickt:  '+f+' · '+g, f*g,
    f+' · '+g+' = '+f+' · ('+(g-g%100)+' + '+(g%100)+') = '+(f*(g-g%100))+' + '+(f*(g%100))+' = '+(f*g)+'.');
};

GEN.t208 = function(l){
  if(l===1){
    var a=R(180,920), b=R(180,920);
    var ue=Math.round(a/100)*100 + Math.round(b/100)*100;
    return num('Überschlage (runde auf Hunderter):  '+a+' + '+b, ue,
      a+' ≈ '+(Math.round(a/100)*100)+',  '+b+' ≈ '+(Math.round(b/100)*100)+'  →  '+ue+'.');
  }
  if(l===2){
    var c=R(180,920), d=R(11,49);
    var ue2=Math.round(c/100)*100*(Math.round(d/10)*10);
    return num('Überschlage:  '+c+' · '+d, ue2,
      c+' ≈ '+(Math.round(c/100)*100)+',  '+d+' ≈ '+(Math.round(d/10)*10)+'  →  '+nf(ue2)+'.');
  }
  var e=R(300,900), f=R(20,60), echt=e*f;
  var falsch = Math.round(echt * pick([0.15, 0.35, 2.5, 4.5]));
  return mc('Jemand rechnet '+e+' · '+f+' und erhält '+nf(falsch)+'. Kann das stimmen?',
    'Nein — der Überschlag ergibt etwa '+nf(Math.round(e/100)*100*Math.round(f/10)*10),
    ['Ja, das passt genau','Ja, ungefähr richtig','Das kann man nicht überschlagen'],
    'Überschlag: '+(Math.round(e/100)*100)+' · '+(Math.round(f/10)*10)+' = '+nf(Math.round(e/100)*100*Math.round(f/10)*10)+'. Der Wert '+nf(falsch)+' liegt viel zu weit daneben.');
};

GEN.t209 = function(l){
  if(l===1){
    var n=pick([12,18,20,24,28,30,36,40,45,48]);
    var teiler=[]; for(var i=1;i<=n;i++) if(n%i===0) teiler.push(i);
    var kein = pick([1,2,3,4,5,6,7,8,9,10,11].filter(function(x){return n%x!==0;}));
    return mc('Welche Zahl ist <b>kein</b> Teiler von '+n+'?', kein,
      shuffle(teiler.filter(function(x){return x>1&&x<n;})).slice(0,3),
      'Teiler von '+n+': '+teiler.join(', ')+'.  '+n+' : '+kein+' geht nicht ohne Rest auf.');
  }
  if(l===2){
    var z=R(100,999), qs=String(z).split('').reduce(function(a,b){return a+parseInt(b,10);},0);
    var d=pick([2,3,5]);
    var ok = d===3 ? qs%3===0 : z%d===0;
    return tf('Die Zahl '+z+' ist durch '+d+' teilbar.', ok,
      d===3 ? ('Quersumme: '+String(z).split('').join(' + ')+' = '+qs+'. '+qs+(qs%3===0?' ist':' ist nicht')+' durch 3 teilbar.')
            : ('Letzte Ziffer: '+String(z).slice(-1)+'. '+(d===2?'Durch 2 teilbar sind Zahlen mit gerader Endziffer.':'Durch 5 teilbar sind Zahlen mit Endziffer 0 oder 5.')));
  }
  var prim=[2,3,5,7,11,13,17,19,23,29,31,37,41,43], nicht=[9,15,21,25,27,33,35,39,49,51,55];
  var p=pick(prim);
  return mc('Welche dieser Zahlen ist eine <b>Primzahl</b>?', p, shuffle(nicht).slice(0,3),
    'Eine Primzahl hat genau zwei Teiler: 1 und sich selbst. '+p+' ist nur durch 1 und '+p+' teilbar.');
};

GEN.t210 = function(l){
  if(l===1){
    var a=R(2,12);
    return num('Berechne:  '+a+'^{2}', a*a, a+'^{2} = '+a+' · '+a+' = '+(a*a)+'.');
  }
  if(l===2){
    var b=pick([2,3,4,5]), e=R(2,4);
    return num('Berechne:  '+b+'^{'+e+'}', Math.pow(b,e),
      b+'^{'+e+'} bedeutet '+Array(e+1).join(b+' · ').slice(0,-3)+' = '+Math.pow(b,e)+'.');
  }
  var c=pick([2,3,5,10]), e2=R(2,4), d2=R(2,9);
  return num('Berechne:  '+c+'^{'+e2+'} + '+d2+'^{2}', Math.pow(c,e2)+d2*d2,
    c+'^{'+e2+'} = '+Math.pow(c,e2)+' und '+d2+'^{2} = '+(d2*d2)+'.  Summe: '+(Math.pow(c,e2)+d2*d2)+'.');
};

GEN.t211 = function(l){
  if(l===1){
    var x=R(3,25), a=R(4,40);
    if(R(0,1)) return num('Löse die Gleichung:  x + '+a+' = '+(x+a)+'\nx = ?', x, 'Umkehraufgabe: x = '+(x+a)+' − '+a+' = '+x+'.');
    return num('Löse die Gleichung:  x − '+a+' = '+x+'\nx = ?', x+a, 'Umkehraufgabe: x = '+x+' + '+a+' = '+(x+a)+'.');
  }
  if(l===2){
    var y=R(3,12), f=R(3,9);
    return num('Löse die Gleichung:  '+f+' · x = '+(f*y)+'\nx = ?', y, 'Umkehraufgabe: x = '+(f*y)+' : '+f+' = '+y+'.');
  }
  var z=R(3,15), m=R(3,9), b=R(4,30);
  return steps('Löse die Gleichung:  '+m+' · x + '+b+' = '+(m*z+b),
    [{frage:'Schritt 1: Wie groß ist '+m+' · x?', loesung:String(m*z), tipp:'Ziehe '+b+' auf beiden Seiten ab: '+(m*z+b)+' − '+b+'.'},
     {frage:'Schritt 2: x = ?', loesung:String(z), tipp:'Jetzt durch '+m+' teilen.'}],
    m+' · x = '+(m*z+b)+' − '+b+' = '+(m*z)+', also x = '+(m*z)+' : '+m+' = '+z+'.  Probe: '+m+' · '+z+' + '+b+' = '+(m*z+b)+' ✓');
};

GEN.t212 = function(l){
  var namen=['Lena','Jonas','Mia','Emil','Nele','Ben','Ida','Timo'];
  if(l===1){
    var n=pick(namen), a=R(12,45), b=R(12,45);
    return num(n+' sammelt am Samstag '+a+' Pfandflaschen und am Sonntag '+b+'. Wie viele sind es insgesamt?', a+b,
      'Signalwort "insgesamt" → addieren: '+a+' + '+b+' = '+(a+b)+' Flaschen.', {einheit:'Flaschen'});
  }
  if(l===2){
    var n2=pick(namen), preis=R(3,9), anz=R(6,18), gegeben=preis*anz+R(1,40);
    return num(n2+' kauft '+anz+' Hefte zu je '+preis+' €. '+n2+' bezahlt mit '+gegeben+' €. Wie viel Geld bekommt '+n2+' zurück?',
      gegeben-preis*anz,
      'Erst die Kosten: '+anz+' · '+preis+' € = '+(anz*preis)+' €. Dann das Rückgeld: '+gegeben+' € − '+(anz*preis)+' € = '+(gegeben-anz*preis)+' €.', {einheit:'€'});
  }
  var plaetze=pick([42,48,52,56]), kinder=R(180,420);
  var busse=Math.ceil(kinder/plaetze);
  return steps('Ein Reisebus hat '+plaetze+' Sitzplätze. '+kinder+' Kinder fahren auf Klassenfahrt.',
    [{frage:'Wie viele Busse werden vollständig gefüllt?', loesung:String(Math.floor(kinder/plaetze)), tipp:kinder+' : '+plaetze+' — nur der ganzzahlige Anteil.'},
     {frage:'Wie viele Busse braucht man insgesamt?', loesung:String(busse), tipp:'Auch für die restlichen Kinder braucht man noch einen Bus.'}],
    kinder+' : '+plaetze+' = '+Math.floor(kinder/plaetze)+' Rest '+(kinder%plaetze)+'. Da '+(kinder%plaetze)+' Kinder übrig bleiben, braucht man '+busse+' Busse.');
};

/* =================== KAPITEL 3 — Größen =================== */
GEN.t301 = function(l){
  if(l===1){
    var m=R(2,9), cm=R(1,99);
    return num('Wie viele Zentimeter sind '+m+' m '+cm+' cm?', m*100+cm,
      m+' m = '+(m*100)+' cm.  '+(m*100)+' cm + '+cm+' cm = '+(m*100+cm)+' cm.', {einheit:'cm'});
  }
  if(l===2){
    var km=R(2,9), mm=R(100,900);
    if(R(0,1)) return num('Wie viele Meter sind '+km+' km '+mm+' m?', km*1000+mm, km+' km = '+(km*1000)+' m, dazu '+mm+' m = '+nf(km*1000+mm)+' m.', {einheit:'m'});
    var cm2=R(120,980);
    return num('Schreibe '+cm2+' cm in Millimeter.', cm2*10, '1 cm = 10 mm, also '+cm2+' · 10 = '+nf(cm2*10)+' mm.', {einheit:'mm'});
  }
  var a=R(2,6), b=R(10,90), c=R(1,9);
  return num('Schreibe '+a+' m '+b+' cm '+c+' mm in Millimeter.', a*1000+b*10+c,
    a+' m = '+(a*1000)+' mm,  '+b+' cm = '+(b*10)+' mm,  '+c+' mm.  Summe: '+nf(a*1000+b*10+c)+' mm.', {einheit:'mm'});
};

GEN.t302 = function(l){
  if(l===1){
    var kg=R(2,9), g=R(50,950);
    return num('Wie viele Gramm sind '+kg+' kg '+g+' g?', kg*1000+g, kg+' kg = '+nf(kg*1000)+' g, dazu '+g+' g → '+nf(kg*1000+g)+' g.', {einheit:'g'});
  }
  if(l===2){
    var t=R(2,9), kg2=R(50,900);
    return num('Wie viele Kilogramm sind '+t+' t '+kg2+' kg?', t*1000+kg2, '1 t = 1000 kg → '+nf(t*1000+kg2)+' kg.', {einheit:'kg'});
  }
  var stk=R(6,24), gew=pick([125,250,375,450,750]);
  return num(stk+' Packungen wiegen je '+gew+' g. Wie viel wiegen sie zusammen? (Antwort in Gramm)',
    stk*gew, stk+' · '+gew+' g = '+nf(stk*gew)+' g = '+kf(stk*gew/1000)+' kg.', {einheit:'g'});
};

GEN.t303 = function(l){
  var h1=R(14,20), m1=pick([0,5,10,15,20,25,30,35,40,45,50,55]);
  if(l===1){
    var dauer=pick([20,30,45,50]);
    var tot=h1*60+m1+dauer;
    return num('Ein Film beginnt um '+h1+':'+(m1<10?'0':'')+m1+' Uhr und dauert '+dauer+' Minuten. Wann endet er? (Antwort z. B. 18:30)',
      Math.floor(tot/60)+':'+(tot%60<10?'0':'')+(tot%60),
      m1+' + '+dauer+' Minuten → '+Math.floor(tot/60)+':'+(tot%60<10?'0':'')+(tot%60)+' Uhr.');
  }
  if(l===2){
    var min=R(70,240); if(min%60===0) min+=R(5,55);
    return steps(min+' Minuten — wie viel ist das in Stunden und Minuten?',
      [{frage:'Volle Stunden = ?', loesung:String(Math.floor(min/60)), tipp:min+' : 60 — nur die ganzen Stunden.'},
       {frage:'Restliche Minuten = ?', loesung:String(min%60), tipp:'Was bleibt übrig?'}],
      min+' min = '+Math.floor(min/60)+' h '+(min%60)+' min, denn '+Math.floor(min/60)+' · 60 = '+(Math.floor(min/60)*60)+' und '+min+' − '+(Math.floor(min/60)*60)+' = '+(min%60)+'.');
  }
  var s1=R(7,8), sm=pick([0,10,20,30,40,50]), s2=R(12,15), sm2=pick([5,15,35,45]);
  var span=(s2*60+sm2)-(s1*60+sm);
  return num('Der Unterricht beginnt um '+s1+':'+(sm<10?'0':'')+sm+' Uhr und endet um '+s2+':'+(sm2<10?'0':'')+sm2+' Uhr. Wie lang ist das in Minuten?',
    span, 'Von '+s1+':'+(sm<10?'0':'')+sm+' bis '+s2+':'+(sm2<10?'0':'')+sm2+' sind es '+Math.floor(span/60)+' h '+(span%60)+' min = '+span+' Minuten.', {einheit:'min'});
};

GEN.t304 = function(l){
  if(l===1){
    var e=R(2,19), c=pick([5,10,25,40,50,75,90]);
    return num('Wie viele Cent sind '+e+','+(c<10?'0':'')+c+' €?', e*100+c,
      e+' € = '+(e*100)+' ct, dazu '+c+' ct → '+(e*100+c)+' ct.', {einheit:'ct'});
  }
  if(l===2){
    var ct=R(150,4900);
    return num('Schreibe '+ct+' ct in Euro (z. B. 12,50).', eur(ct),
      ct+' ct : 100 = '+eur(ct)+' €.', {einheit:'€'});
  }
  var p1=R(120,890), p2=R(120,890), gg=pick([2000,5000]);
  return steps('Du kaufst zwei Dinge für '+eur(p1)+' € und '+eur(p2)+' € und zahlst mit '+(gg/100)+' €.',
    [{frage:'Wie viel kostet alles zusammen? (in Cent)', loesung:String(p1+p2), tipp:'Beide Preise in Cent addieren.'},
     {frage:'Wie viel Rückgeld bekommst du? (in Cent)', loesung:String(gg-p1-p2), tipp:gg+' ct − '+(p1+p2)+' ct.'}],
    'Zusammen '+eur(p1+p2)+' €, Rückgeld '+eur(gg-p1-p2)+' €.');
};

GEN.t305 = function(l){
  if(l===1){
    var m=R(2,8), cm=R(20,90);
    return num('Berechne:  '+m+' m + '+cm+' cm  (Antwort in cm)', m*100+cm,
      'Erst gleichnamig machen: '+m+' m = '+(m*100)+' cm. Dann '+(m*100)+' + '+cm+' = '+(m*100+cm)+' cm.', {einheit:'cm'});
  }
  if(l===2){
    var kg=R(1,4), g=R(100,900), g2=R(200,900);
    return num('Berechne:  '+kg+' kg '+g+' g + '+g2+' g  (Antwort in Gramm)', kg*1000+g+g2,
      kg+' kg '+g+' g = '+nf(kg*1000+g)+' g;  '+nf(kg*1000+g)+' + '+g2+' = '+nf(kg*1000+g+g2)+' g.', {einheit:'g'});
  }
  var n=R(4,12), l1=R(2,9), l2=pick([10,20,25,50]);
  return num('Berechne:  '+n+' · ('+l1+' m '+l2+' cm)  (Antwort in cm)', n*(l1*100+l2),
    l1+' m '+l2+' cm = '+(l1*100+l2)+' cm.  '+n+' · '+(l1*100+l2)+' = '+nf(n*(l1*100+l2))+' cm.', {einheit:'cm'});
};

GEN.t306 = function(l){
  if(l===1){
    var fl=R(4,12), ml=pick([250,330,500,750]);
    return num(fl+' Flaschen enthalten je '+ml+' ml. Wie viele Milliliter sind das zusammen?', fl*ml,
      fl+' · '+ml+' ml = '+nf(fl*ml)+' ml.', {einheit:'ml'});
  }
  if(l===2){
    var kg=R(3,9), preis=R(120,480);
    return num(kg+' kg Äpfel kosten '+eur(preis*kg)+' €. Wie viel kostet 1 kg? (Antwort in Cent)', preis,
      nf(preis*kg)+' ct : '+kg+' = '+preis+' ct = '+eur(preis)+' €.', {einheit:'ct'});
  }
  var strecke=R(12,36), tage=pick([5,6]), rest=R(3,15);
  return steps('Ein Radfahrer fährt an '+tage+' Tagen je '+strecke+' km und am letzten Tag noch '+rest+' km.',
    [{frage:'Wie viele Kilometer an den ersten '+tage+' Tagen?', loesung:String(strecke*tage), tipp:tage+' · '+strecke+' km.'},
     {frage:'Wie viele Kilometer insgesamt?', loesung:String(strecke*tage+rest), tipp:'Den letzten Tag dazuzählen.'}],
    tage+' · '+strecke+' + '+rest+' = '+(strecke*tage+rest)+' km.');
};

/* =================== KAPITEL 4 — Geometrie: Figuren =================== */
GEN.t401 = function(l){
  if(l===1){
    return pick([
      function(){ return mc('Welche Linie hat <b>zwei</b> Endpunkte?','die Strecke',['die Gerade','die Halbgerade','der Punkt'],'Eine Strecke [AB] beginnt in A und endet in B. Sie hat eine messbare Länge.'); },
      function(){ return mc('Welche Linie hat <b>keinen</b> Anfang und <b>kein</b> Ende?','die Gerade',['die Strecke','die Halbgerade','der Punkt'],'Eine Gerade geht in beide Richtungen unendlich weiter.'); },
      function(){ return mc('Welche Linie hat <b>genau einen</b> Anfangspunkt und geht dann unendlich weiter?','die Halbgerade',['die Strecke','die Gerade','der Kreis'],'Eine Halbgerade beginnt in einem Punkt und geht nur in eine Richtung weiter.'); }
    ])();
  }
  if(l===2){
    var alle=[['Strecke [AB]','zwei Endpunkte'],['Gerade AB','kein Anfang, kein Ende'],['Halbgerade [AB','ein Anfangspunkt'],['Punkt A','keine Ausdehnung'],['Länge einer Strecke','kann man messen'],['Gerade','kann man nicht messen']];
    return match('Ordne richtig zu.', shuffle(alle).slice(0,4),
      'Strecke = begrenzt, Gerade = unbegrenzt, Halbgerade = einseitig begrenzt.');
  }
  return pick([
    function(){ return tf('Durch zwei verschiedene Punkte lässt sich genau eine Gerade zeichnen.', true,'Ja, zwei Punkte legen eine Gerade eindeutig fest.'); },
    function(){ return tf('Durch zwei verschiedene Punkte lassen sich viele verschiedene Geraden zeichnen.', false,'Nein. Zwei Punkte legen genau eine Gerade fest.'); },
    function(){ return tf('Eine Strecke kann man messen, eine Gerade nicht.', true,'Eine Strecke hat zwei Endpunkte und damit eine Länge. Eine Gerade hat keine.'); },
    function(){ return tf('Eine Halbgerade hat zwei Endpunkte.', false,'Nein. Sie hat nur einen Anfangspunkt und geht dann unendlich weiter.'); }
  ])();
};

GEN.t402 = function(l){
  if(l===1){
    return mc('Zwei Linien treffen sich im rechten Winkel. Wie nennt man das?','senkrecht',
      ['parallel','schief','symmetrisch'],'Rechter Winkel (90°) → die Linien stehen senkrecht zueinander. Zeichen: ⊥');
  }
  if(l===2){
    return pick([
      function(){ return tf('Parallele Geraden haben überall den gleichen Abstand.', true,'Genau, deshalb schneiden sie sich nie. Zeichen: ∥'); },
      function(){ return tf('Parallele Geraden schneiden sich irgendwann.', false,'Nein. Parallele Geraden schneiden sich nie.'); },
      function(){ return tf('Senkrechte Geraden bilden einen rechten Winkel.', true,'Ja, 90°. Zeichen: ⊥'); },
      function(){ return tf('Zwei Geraden, die sich in einem 45°-Winkel schneiden, sind senkrecht zueinander.', false,'Nein. Senkrecht heißt: rechter Winkel, also 90°.'); }
    ])();
  }
  return mc('Wie stehen gegenüberliegende Seiten eines Rechtecks zueinander?','parallel',
    ['senkrecht','schief','sie schneiden sich'],
    'Gegenüberliegende Seiten sind parallel und gleich lang; benachbarte Seiten sind senkrecht zueinander.');
};

GEN.t403 = function(l){
  var max=10;
  if(l===1){
    var x=R(1,9), y=R(1,9), fragx=R(0,1)===0;
    return num('Wie lautet der '+(fragx?'x':'y')+'-Wert des Punktes P? Schreibe nur die Zahl.', fragx?x:y,
      'Zuerst nach rechts (x-Achse), dann nach oben (y-Achse). P('+x+'|'+y+') → '+(fragx?'x':'y')+' = '+(fragx?x:y)+'.',
      {grafik: svgKoord([[x,y,'P']], max, 0)});
  }
  if(l===2){
    var ax=R(1,4), ay=R(1,4), bx=ax+R(3,5), by=ay+R(3,4);
    return num('A und C sind gegenüberliegende Ecken eines Rechtecks (Seiten parallel zu den Achsen). Wie lautet der <b>x-Wert</b> von Punkt B, der rechts unten liegt?',
      bx, 'B liegt unter C und rechts von A: B('+bx+'|'+ay+'). Der x-Wert ist '+bx+'.',
      {grafik: svgKoord([[ax,ay,'A'],[bx,by,'C']], max, -1)});
  }
  var px=R(2,8), py=R(2,8);
  return steps('Lies den Punkt P im Koordinatensystem ab.',
    [{frage:'x-Wert von P = ?', loesung:String(px), tipp:'Wie weit nach rechts?'},
     {frage:'y-Wert von P = ?', loesung:String(py), tipp:'Wie weit nach oben?'}],
    'P('+px+'|'+py+') — erst der Flur (x), dann die Treppe (y).',
    {grafik: svgKoord([[px,py,'P']], max, 0)});
};

GEN.t404 = function(l){
  var defs=[
    ['Quadrat','4 gleich lange Seiten und 4 rechte Winkel'],
    ['Rechteck','4 rechte Winkel, gegenüberliegende Seiten gleich lang'],
    ['Raute','4 gleich lange Seiten, aber nicht unbedingt rechte Winkel'],
    ['Parallelogramm','gegenüberliegende Seiten parallel und gleich lang'],
    ['Trapez','mindestens ein Paar paralleler Seiten']
  ];
  if(l===1){
    var d=pick(defs);
    return mc('Welches Viereck hat '+d[1]+'?', d[0],
      shuffle(defs.filter(function(x){return x[0]!==d[0];})).slice(0,3).map(function(x){return x[0];}),
      'Merkmal "'+d[1]+'" → '+d[0]+'.');
  }
  if(l===2){
    return match('Ordne jedem Viereck sein Merkmal zu.',
      shuffle(defs).slice(0,4), 'Achte besonders auf den Unterschied zwischen Raute (gleiche Seiten) und Rechteck (rechte Winkel).');
  }
  return pick([
    function(){ return tf('Jedes Quadrat ist auch ein Rechteck.', true,'Ja. Ein Quadrat hat 4 rechte Winkel und erfüllt damit alle Bedingungen eines Rechtecks. Umgekehrt gilt das nicht.'); },
    function(){ return tf('Jedes Rechteck ist auch ein Quadrat.', false,'Nein. Beim Rechteck müssen nicht alle Seiten gleich lang sein.'); },
    function(){ return tf('Jede Raute ist auch ein Parallelogramm.', true,'Ja. Bei der Raute sind gegenüberliegende Seiten parallel.'); },
    function(){ return tf('Jedes Trapez hat vier gleich lange Seiten.', false,'Nein. Ein Trapez hat nur mindestens ein Paar paralleler Seiten.'); }
  ])();
};

GEN.t405 = function(l){
  var achsen={'Rechteck (kein Quadrat)':2,'Raute (kein Quadrat)':2,'gleichseitiges Dreieck':3,'gleichschenkliges Dreieck (nicht gleichseitig)':1,'regelmäßiges Fünfeck':5,'regelmäßiges Sechseck':6,'Halbkreis':1};
  if(l===1){
    return pick([
      function(){ return mc('Wie viele Symmetrieachsen hat ein Quadrat?','4',['2','1','8'],'Zwei Mittellinien (waagerecht und senkrecht) und zwei Diagonalen, zusammen 4 Achsen.'); },
      function(){ return mc('Wie viele Symmetrieachsen hat ein Kreis?','unendlich viele',['4','1','keine'],'Jede Gerade durch den Mittelpunkt ist eine Symmetrieachse.'); },
      function(){ return mc('Was ist eine Symmetrieachse?','Eine Gerade, an der man die Figur so falten kann, dass beide Hälften genau aufeinander liegen.',
        ['Die längste Seite der Figur.','Eine Gerade, die die Figur nicht berührt.','Der Mittelpunkt der Figur.'],'Beim Falten an der Achse decken sich die beiden Hälften.'); }
    ])();
  }
  if(l===2){
    var k=pick(Object.keys(achsen));
    return num('Wie viele Symmetrieachsen hat ein '+k+'? Schreibe nur die Zahl.', achsen[k],
      k+' → '+achsen[k]+' Symmetrieachsen.');
  }
  var mit=shuffle(['ein Quadrat','ein Kreis','ein Rechteck','eine Raute','ein gleichseitiges Dreieck']);
  return mc('Welche Figur hat <b>keine</b> Symmetrieachse?','ein schiefes Parallelogramm',
    mit.slice(0,3),
    'Ein schiefes Parallelogramm ist punktsymmetrisch, aber nicht achsensymmetrisch. Die anderen Figuren lassen sich falten.');
};

GEN.t406 = function(l){
  if(l===1){
    var r=R(3,25);
    return num('Ein Kreis hat den Radius '+r+' cm. Wie groß ist der Durchmesser?', 2*r,
      'd = 2 · r = 2 · '+r+' cm = '+(2*r)+' cm.', {einheit:'cm'});
  }
  if(l===2){
    var d=R(4,60); if(d%2) d++;
    return num('Ein Kreis hat den Durchmesser '+d+' cm. Wie groß ist der Radius?', d/2,
      'r = d : 2 = '+d+' cm : 2 = '+(d/2)+' cm.', {einheit:'cm'});
  }
  return mc('Was gilt für alle Punkte auf einem Kreis?','Sie haben den gleichen Abstand zum Mittelpunkt.',
    ['Sie liegen auf einer Geraden.','Sie haben den gleichen Abstand zum Durchmesser.','Sie bilden einen rechten Winkel.'],
    'Genau das ist die Definition des Kreises: alle Kreispunkte sind gleich weit vom Mittelpunkt M entfernt — dieser Abstand ist der Radius.');
};

/* =================== KAPITEL 5 — Flächen =================== */
GEN.t501 = function(l){
  if(l===1){
    var a=R(2,9);
    return num('Wie viele cm^{2} sind '+a+' dm^{2}?', a*100, '1 dm^{2} = 100 cm^{2}, also '+a+' · 100 = '+(a*100)+' cm^{2}.', {einheit:'cm²'});
  }
  if(l===2){
    var b=R(2,9);
    if(R(0,1)) return num('Wie viele dm^{2} sind '+b+' m^{2}?', b*100, '1 m^{2} = 100 dm^{2} → '+(b*100)+' dm^{2}.', {einheit:'dm²'});
    return num('Wie viele mm^{2} sind '+b+' cm^{2}?', b*100, '1 cm^{2} = 100 mm^{2} → '+(b*100)+' mm^{2}.', {einheit:'mm²'});
  }
  var c=R(2,9);
  return num('Wie viele cm^{2} sind '+c+' m^{2}?', c*10000,
    '1 m^{2} = 100 dm^{2} und 1 dm^{2} = 100 cm^{2}, also 1 m^{2} = 10 000 cm^{2}.  '+c+' · 10 000 = '+nf(c*10000)+' cm^{2}.', {einheit:'cm²'});
};

GEN.t502 = function(l){
  if(l===1){
    var a=R(3,20);
    return num('Ein Quadrat hat die Seitenlänge '+a+' cm. Wie groß ist der Umfang?', 4*a,
      'u = 4 · a = 4 · '+a+' cm = '+(4*a)+' cm.', {einheit:'cm', grafik: svgRechteck(a,a,'cm','cm','Quadrat')});
  }
  if(l===2){
    var x=R(5,24), y=R(3,x-1);
    return num('Wie groß ist der Umfang dieses Rechtecks?', 2*x+2*y,
      'u = 2 · a + 2 · b = 2 · '+x+' + 2 · '+y+' = '+(2*x)+' + '+(2*y)+' = '+(2*x+2*y)+' cm.', {einheit:'cm', grafik: svgRechteck(x,y,'cm','cm')});
  }
  var u=pick([24,30,36,40,48]), a3=R(3,Math.floor(u/2)-2);
  return num('Ein Rechteck hat den Umfang '+u+' cm. Eine Seite ist '+a3+' cm lang. Wie lang ist die andere Seite?',
    u/2-a3, 'u = 2 · (a + b) → a + b = '+u+' : 2 = '+(u/2)+'.  b = '+(u/2)+' − '+a3+' = '+(u/2-a3)+' cm.', {einheit:'cm'});
};

GEN.t503 = function(l){
  if(l===1){
    var a=R(3,15);
    return num('Ein Quadrat hat die Seitenlänge '+a+' cm. Wie groß ist der Flächeninhalt?', a*a,
      'A = a · a = '+a+' · '+a+' = '+(a*a)+' cm^{2}.', {einheit:'cm²', grafik: svgRechteck(a,a,'cm','cm','Quadrat')});
  }
  if(l===2){
    var x=R(4,20), y=R(3,x-1);
    return num('Wie groß ist der Flächeninhalt dieses Rechtecks?', x*y,
      'A = a · b = '+x+' cm · '+y+' cm = '+(x*y)+' cm^{2}.', {einheit:'cm²', grafik: svgRechteck(x,y,'cm','cm')});
  }
  var A=pick([48,60,72,84,96,120]), b3=pick([4,6,8,12].filter(function(v){return A%v===0;}));
  return steps('Ein Rechteck hat den Flächeninhalt '+A+' cm^{2} und ist '+b3+' cm breit.',
    [{frage:'Wie lang ist die andere Seite? (in cm)', loesung:String(A/b3), tipp:'Umkehraufgabe zu A = a · b:  a = A : b.'},
     {frage:'Wie groß ist der Umfang? (in cm)', loesung:String(2*(A/b3)+2*b3), tipp:'u = 2 · a + 2 · b.'}],
    'a = '+A+' : '+b3+' = '+(A/b3)+' cm.  u = 2 · '+(A/b3)+' + 2 · '+b3+' = '+(2*(A/b3)+2*b3)+' cm.');
};

GEN.t504 = function(l){
  var A=R(8,14), B=R(5,9), c=R(2,A-3), d=R(2,B-2);
  if(l===1){
    return num('Berechne den Flächeninhalt der farbigen Figur. (Antwort in cm^{2})', A*B-c*d,
      'Großes Rechteck: '+A+' · '+B+' = '+(A*B)+' cm^{2}.  Fehlende Ecke: '+c+' · '+d+' = '+(c*d)+' cm^{2}.  '+(A*B)+' − '+(c*d)+' = '+(A*B-c*d)+' cm^{2}.',
      {einheit:'cm²', grafik: svgLFigur(A,B,c,d)});
  }
  if(l===2){
    return steps('Berechne den Flächeninhalt der Figur.',
      [{frage:'Flächeninhalt des großen Rechtecks ('+A+' cm · '+B+' cm)?', loesung:String(A*B), tipp:'A = a · b'},
       {frage:'Flächeninhalt der fehlenden Ecke ('+c+' cm · '+d+' cm)?', loesung:String(c*d), tipp:'Auch hier A = a · b'},
       {frage:'Flächeninhalt der Figur?', loesung:String(A*B-c*d), tipp:'Großes Rechteck minus Ecke.'}],
      'A = '+(A*B)+' − '+(c*d)+' = '+(A*B-c*d)+' cm^{2}.', {grafik: svgLFigur(A,B,c,d)});
  }
  var a1=R(4,10), b1=R(3,8), a2=R(3,9), b2=R(2,6);
  return num('Zwei Rechtecke liegen nebeneinander: '+a1+' cm · '+b1+' cm und '+a2+' cm · '+b2+' cm. Wie groß ist die Gesamtfläche in cm^{2}?',
    a1*b1+a2*b2, 'Teilflächen einzeln berechnen und addieren: '+(a1*b1)+' + '+(a2*b2)+' = '+(a1*b1+a2*b2)+' cm^{2}.', {einheit:'cm²'});
};

/* =================== KAPITEL 6 — Körper =================== */
GEN.t601 = function(l){
  var koerper=[['Würfel',8,12,6],['Quader',8,12,6],['Pyramide mit quadratischer Grundfläche',5,8,5],['Dreiecksprisma',6,9,5]];
  if(l===1){
    return pick([
      function(){ return mc('Welcher Körper hat weder Ecken noch Kanten?','Kugel',['Würfel','Quader','Pyramide'],'Die Kugel ist rundum gekrümmt: keine Ecke, keine Kante, nur eine gebogene Fläche.'); },
      function(){ return mc('Welcher Körper hat eine Spitze und eine runde Grundfläche?','Kegel',['Zylinder','Würfel','Kugel'],'Der Kegel hat einen Kreis als Boden und läuft oben in eine Spitze zu.'); },
      function(){ return mc('Welcher Körper hat zwei gleich große Kreise als Grund- und Deckfläche?','Zylinder',['Kegel','Quader','Kugel'],'Der Zylinder hat oben und unten einen Kreis und dazwischen eine gebogene Fläche.'); }
    ])();
  }
  if(l===2){
    var k=pick(koerper), was=pick([['Ecken',1],['Kanten',2],['Flächen',3]]);
    return num('Wie viele '+was[0]+' hat '+(k[0]==='Würfel'||k[0]==='Quader'?'ein ':'eine ')+k[0]+'?', k[was[1]],
      k[0]+': '+k[1]+' Ecken, '+k[2]+' Kanten und '+k[3]+' Flächen.');
  }
  return match('Ordne die Körper ihren Eigenschaften zu.',
    [['Würfel','6 gleich große Quadrate'],['Zylinder','2 Kreise und eine gebogene Fläche'],
     ['Kegel','1 Kreis und eine Spitze'],['Kugel','keine Ecke, keine Kante']],
    'Achte auf die Grundflächen: Kreis oder Vieleck? Und ob der Körper eine Spitze hat.');
};

GEN.t602 = function(l){
  if(l===1){
    return pick([
      function(){ return num('Aus wie vielen Quadraten besteht das Netz eines Würfels?', 6,'Ein Würfel hat 6 Flächen. Im Netz erscheint jede genau einmal.'); },
      function(){ return num('Wie viele Rechtecke braucht man für das Netz eines Quaders (ohne Quadrate)?', 6,'Ein Quader hat 6 Flächen, die alle Rechtecke sind.'); },
      function(){ return num('Wie viele Flächen hat ein Würfel?', 6,'Oben, unten und vier Seiten: zusammen 6.'); }
    ])();
  }
  if(l===2){
    var a=R(2,9), b=R(2,9), c=R(2,9);
    return num('Ein Quader ist '+a+' cm · '+b+' cm · '+c+' cm groß. Wie lang sind alle Kanten zusammen? (Kantenmodell aus Draht, in cm)',
      4*(a+b+c), 'Von jeder Kantenlänge gibt es 4 Stück: 4 · ('+a+' + '+b+' + '+c+') = 4 · '+(a+b+c)+' = '+(4*(a+b+c))+' cm.', {einheit:'cm'});
  }
  return pick([
    function(){ return tf('Jede Anordnung aus 6 Quadraten ist ein gültiges Würfelnetz.', false,'Nein. Legt man die 6 Quadrate z. B. alle in eine Reihe, lässt sich daraus kein Würfel falten.'); },
    function(){ return tf('Es gibt genau 11 verschiedene Würfelnetze.', true,'Ja, genau 11 (gedrehte und gespiegelte Netze zählen nicht extra).'); },
    function(){ return tf('Das Netz eines Quaders besteht aus 6 Rechtecken.', true,'Ja, ein Quader hat 6 Rechteckflächen.'); }
  ])();
};

GEN.t603 = function(l){
  if(l===1){
    var a=R(2,9);
    return num('Wie viele cm^{3} sind '+a+' dm^{3}?', a*1000, '1 dm^{3} = 1000 cm^{3} → '+nf(a*1000)+' cm^{3}.', {einheit:'cm³'});
  }
  if(l===2){
    var b=R(2,9);
    return num('Wie viele Milliliter sind '+b+' Liter?', b*1000, '1 l = 1000 ml → '+nf(b*1000)+' ml.  (Und 1 l = 1 dm^{3}.)', {einheit:'ml'});
  }
  var c=R(2,9);
  return num('Wie viele cm^{3} sind '+c+' m^{3}?', c*1000000,
    '1 m^{3} = 1000 dm^{3} und 1 dm^{3} = 1000 cm^{3}, also 1 m^{3} = 1 000 000 cm^{3} → '+nf(c*1000000)+' cm^{3}.', {einheit:'cm³'});
};

GEN.t604 = function(l){
  if(l===1){
    var a=R(2,10);
    return num('Ein Würfel hat die Kantenlänge '+a+' cm. Wie groß ist sein Volumen?', a*a*a,
      'V = a · a · a = '+a+' · '+a+' · '+a+' = '+(a*a*a)+' cm^{3}.', {einheit:'cm³'});
  }
  if(l===2){
    var x=R(2,12), y=R(2,10), z=R(2,9);
    return num('Ein Quader ist '+x+' cm lang, '+y+' cm breit und '+z+' cm hoch. Wie groß ist sein Volumen?', x*y*z,
      'V = a · b · c = '+x+' · '+y+' · '+z+' = '+nf(x*y*z)+' cm^{3}.', {einheit:'cm³'});
  }
  var V=pick([120,144,180,240,336]), a3=pick([4,6,8].filter(function(v){return V%v===0;})), b3=pick([2,3,4,5,6].filter(function(v){return (V/a3)%v===0;}));
  return steps('Ein Quader hat das Volumen '+V+' cm^{3}. Er ist '+a3+' cm lang und '+b3+' cm breit.',
    [{frage:'Wie groß ist die Grundfläche? (in cm^{2})', loesung:String(a3*b3), tipp:'A = a · b'},
     {frage:'Wie hoch ist der Quader? (in cm)', loesung:String(V/(a3*b3)), tipp:'V = Grundfläche · Höhe → Höhe = V : Grundfläche'}],
    'Grundfläche '+(a3*b3)+' cm^{2}, Höhe = '+V+' : '+(a3*b3)+' = '+(V/(a3*b3))+' cm.');
};

GEN.t605 = function(l){
  if(l===1){
    var a=R(2,12);
    return num('Ein Würfel hat die Kantenlänge '+a+' cm. Wie groß ist die Oberfläche?', 6*a*a,
      'Eine Fläche: '+a+' · '+a+' = '+(a*a)+' cm^{2}. Ein Würfel hat 6 Flächen: 6 · '+(a*a)+' = '+(6*a*a)+' cm^{2}.', {einheit:'cm²'});
  }
  if(l===2){
    var x=R(2,10), y=R(2,9), z=R(2,8);
    return num('Ein Quader ist '+x+' cm · '+y+' cm · '+z+' cm groß. Wie groß ist seine Oberfläche?',
      2*(x*y+x*z+y*z),
      'O = 2 · (a·b + a·c + b·c) = 2 · ('+(x*y)+' + '+(x*z)+' + '+(y*z)+') = 2 · '+(x*y+x*z+y*z)+' = '+nf(2*(x*y+x*z+y*z))+' cm^{2}.', {einheit:'cm²'});
  }
  var a4=R(3,9), b4=R(2,8), c4=R(2,7);
  return steps('Ein Quader ist '+a4+' cm · '+b4+' cm · '+c4+' cm groß.',
    [{frage:'Volumen? (in cm^{3})', loesung:String(a4*b4*c4), tipp:'V = a · b · c'},
     {frage:'Oberfläche? (in cm^{2})', loesung:String(2*(a4*b4+a4*c4+b4*c4)), tipp:'O = 2 · (a·b + a·c + b·c)'}],
    'V = '+(a4*b4*c4)+' cm^{3},  O = '+(2*(a4*b4+a4*c4+b4*c4))+' cm^{2}.');
};

/* ---------- Aufgabe erzeugen (mit Stufe, Punkten, Thema) ---------- */
function erzeugeAufgabe(themaId, stufe){
  var f = GEN[themaId];
  if(!f){
    return { typ:'info', frage:'Für dieses Thema benötige ich noch Informationen aus dem Schulbuch.',
             stufe:stufe||1, punkte:0, themaId:themaId };
  }
  var a = f(stufe||1);
  a.themaId = themaId;
  a.stufe = stufe||1;
  a.punkte = a.punkte || (a.typ==='steps' ? (a.schritte.length+1) : (stufe===3?3:(stufe===2?2:1)));
  a.xp = stufe===3 ? 15 : (stufe===2 ? 10 : 5);
  return a;
}
