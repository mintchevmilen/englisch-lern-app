/* Mathe Mission 5 — Start (eingebettet als Kurs in English Adventure; der Service Worker der Hauptapp deckt die Dateien ab) */
(function(){
  function boot(){
    app = document.getElementById('app');
    ladeState();
    stack = [{view:'home', params:{}}];
    try{ history.replaceState({i:1}, ''); }catch(e){}
    render();
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
