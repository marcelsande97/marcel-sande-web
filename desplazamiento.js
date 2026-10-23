/*
  SCROLL CON RESISTENCIA (solo ordenador)
  ---------------------------------------
  Con la rueda del ratón o el trackpad, la página no se mueve libremente:
  cada gesto lleva al bloque siguiente (o al anterior) con una curva que
  arranca despacio, acelera y frena justo antes de llegar (referencia: Yurbban Passage).
  Mientras se mueve, la rueda no hace nada más: por mucho que la gires, no se salta bloques.
  Los bloques muy altos (más que la pantalla) se recorren a trozos.
  El teclado, la barra de scroll y los enlaces siguen funcionando como siempre.
  Red de seguridad: en móvil, en pantallas de menos de 900 px o con «reducir movimiento»
  no hace nada y se queda el encaje del CSS (scroll-snap).
*/
(function () {
  // Ajustes: cámbialos para probar otros movimientos
  var DURACION = 1100;   // milisegundos que tarda en ir de un bloque a otro
  var TROZO = 0.8;       // en bloques altos, cuánto avanza cada gesto (0.8 = 80 % de la pantalla)
  var SILENCIO = 220;    // ms sin mover la rueda para aceptar un gesto nuevo (se come la inercia del trackpad)
  var UMBRAL = 8;        // giros mínimos de rueda que cuentan como gesto (ignora roces)

  var ordenador = window.matchMedia('(min-width: 900px) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  var raiz = document.documentElement;
  var moviendo = false;
  var ultimoGiro = 0;
  var esperando = false;   // tras moverse, espera a que la rueda pare del todo

  // Curva: lenta al empezar, rápida en medio y lenta al final (easeInOutCubic)
  function curva(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  // Alto de la cabecera (lo mismo que scroll-padding-top en estilos.css)
  function altoCabecera() { return parseFloat(getComputedStyle(raiz).scrollPaddingTop) || 0; }

  // Los topes: el principio de cada bloque (los mismos del scroll-snap) y el final de la página
  function topes() {
    var y = window.scrollY, hueco = altoCabecera();
    var lista = Array.prototype.map.call(
      document.querySelectorAll('.hero, .frase-banda, .seccion, .manifiesto'),
      function (el) { return Math.round(el.getBoundingClientRect().top + y - hueco); }
    );
    lista.push(raiz.scrollHeight - window.innerHeight);
    return lista.map(function (t) { return Math.max(0, t); }).sort(function (a, b) { return a - b; });
  }

  // Calcula adónde ir desde la posición actual
  function destino(abajo) {
    var y = window.scrollY, paso = window.innerHeight * TROZO, lista = topes();
    if (abajo) {
      var siguiente = lista.filter(function (t) { return t > y + 2; })[0];
      if (siguiente === undefined) return y;
      // Bloque alto: avanza a trozos, pero si el tope está cerca va directo (sin saltitos)
      return siguiente - y <= paso * 1.3 ? siguiente : y + paso;
    }
    var anterior = lista.filter(function (t) { return t < y - 2; }).pop();
    if (anterior === undefined) return 0;
    return y - anterior <= paso * 1.3 ? anterior : y - paso;
  }

  function irA(final) {
    var inicio = window.scrollY, recorrido = final - inicio, t0 = null;
    if (Math.abs(recorrido) < 1) return;
    moviendo = true;
    function paso(ahora) {
      if (t0 === null) t0 = ahora;
      var t = Math.min(1, (ahora - t0) / DURACION);
      window.scrollTo(0, inicio + recorrido * curva(t));
      if (t < 1) requestAnimationFrame(paso);
      else { moviendo = false; esperando = true; }
    }
    requestAnimationFrame(paso);
  }

  window.addEventListener('wheel', function (e) {
    if (!ordenador.matches || e.ctrlKey) return;                 // Ctrl + rueda: zoom, no tocamos
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;         // gesto horizontal: carruseles
    if (e.target.closest && e.target.closest('.submenu')) return;
    e.preventDefault();                                          // a partir de aquí, mandamos nosotros
    var ahora = performance.now();
    var quieto = ahora - ultimoGiro > SILENCIO;
    ultimoGiro = ahora;
    if (moviendo) return;
    if (esperando && !quieto) return;                            // aún llega la inercia del gesto anterior
    esperando = false;
    if (Math.abs(e.deltaY) < UMBRAL) return;
    irA(destino(e.deltaY > 0));
  }, { passive: false });

  // Con el script activo, el encaje del CSS se apaga para que no se peleen
  function aplicar() { raiz.classList.toggle('scroll-resistencia', ordenador.matches); }
  aplicar();
  if (ordenador.addEventListener) ordenador.addEventListener('change', aplicar);
})();
