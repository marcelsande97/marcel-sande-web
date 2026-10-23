/*
  SCROLL CON RESISTENCIA (solo ordenador)
  ---------------------------------------
  Con la rueda del ratón o el trackpad, la página no se mueve libremente:
  cada gesto lleva al bloque siguiente (o al anterior) con una curva que
  arranca despacio, acelera y frena justo antes de llegar (referencia: Yurbban Passage).
  Mientras se mueve, la rueda no hace nada más: por mucho que la gires, no se salta bloques.
  Los puntos de parada están elegidos (ver «encuadres» más abajo): no avanza una distancia fija.
  El teclado, la barra de scroll y los enlaces siguen funcionando como siempre.
  Red de seguridad: en móvil, en pantallas de menos de 900 px o con «reducir movimiento»
  no hace nada y se queda el encaje del CSS (scroll-snap).
*/
(function () {
  // Ajustes: cámbialos para probar otros movimientos
  var DURACION = 1100;   // milisegundos que tarda en ir de un bloque a otro
  var SILENCIO = 160;    // ms sin mover la rueda para aceptar un gesto nuevo (se come la inercia del trackpad)
  var UMBRAL = 8;        // giros mínimos de rueda que cuentan como gesto (ignora roces)

  var ordenador = window.matchMedia('(min-width: 900px) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  var raiz = document.documentElement;
  var moviendo = false;
  var ultimoGiro = 0;
  var ultimoValor = 0;     // tamaño del último giro de rueda
  var esperando = false;   // tras moverse, espera a que la rueda pare del todo

  // Curva: lenta al empezar, rápida en medio y lenta al final (easeInOutCubic)
  function curva(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  // Alto de la cabecera (lo mismo que scroll-padding-top en estilos.css)
  function altoCabecera() { return parseFloat(getComputedStyle(raiz).scrollPaddingTop) || 0; }

  // Los «encuadres» (como keyframes de vídeo): posiciones donde un bloque queda bien
  // colocado en la pantalla. Cada gesto lleva al encuadre siguiente o al anterior.
  // - Principio de la página (el hero).
  // - Cada bloque, con su contenido (sin el aire de arriba y abajo) centrado en el
  //   hueco visible bajo la cabecera.
  // - Si el contenido no cabe en pantalla: dos encuadres, uno con su parte de arriba
  //   y otro con su parte de abajo.
  // - Final de la página (newsletter, firma y pie).
  var BLOQUES = '.frase-banda, .seccion, .manifiesto';
  var AIRE = 40;   // si un bloque no cabe: aire entre la cabecera (o el borde de abajo) y el contenido

  function encuadres() {
    var y = window.scrollY, hueco = altoCabecera();
    var visible = window.innerHeight - hueco;
    var lista = [0];
    document.querySelectorAll(BLOQUES).forEach(function (el) {
      var r = el.getBoundingClientRect(), estilo = getComputedStyle(el);
      var arriba = r.top + y + parseFloat(estilo.paddingTop);
      var alto = r.height - parseFloat(estilo.paddingTop) - parseFloat(estilo.paddingBottom);
      // Si casi cabe (le sobra menos de un cuarto de pantalla), mejor centrado que dos paradas seguidas
      if (alto <= visible - 2 * AIRE + visible * 0.25) {
        lista.push(arriba + alto / 2 - visible / 2 - hueco);   // centrado
      } else {
        lista.push(arriba - hueco - AIRE);                      // su parte de arriba
        lista.push(arriba + alto + AIRE - window.innerHeight);  // su parte de abajo
      }
    });
    var maximo = raiz.scrollHeight - window.innerHeight;
    lista.push(maximo);
    lista = lista
      .map(function (t) { return Math.round(Math.min(maximo, Math.max(0, t))); })
      .sort(function (a, b) { return a - b; });
    // Paradas demasiado juntas (menos de un 20 % de pantalla): se queda la de más abajo
    return lista.filter(function (t, i) { return i === lista.length - 1 || lista[i + 1] - t >= window.innerHeight * 0.2; });
  }

  // El encuadre siguiente (o el anterior) desde la posición actual
  function destino(abajo) {
    var y = window.scrollY, lista = encuadres();
    if (abajo) {
      var siguiente = lista.filter(function (t) { return t > y + 4; })[0];
      return siguiente === undefined ? y : siguiente;
    }
    var anterior = lista.filter(function (t) { return t < y - 4; }).pop();
    return anterior === undefined ? 0 : anterior;
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
    var giro = Math.abs(e.deltaY);
    var quieto = ahora - ultimoGiro > SILENCIO;
    var crece = giro > ultimoValor * 1.3 && giro >= UMBRAL;      // la rueda acelera: es un gesto nuevo
    var rueda = giro >= 50 && giro === ultimoValor;              // ratón con «clics»: cada clic igual que el anterior
    ultimoGiro = ahora;
    ultimoValor = giro;
    if (moviendo) return;
    // Después de moverse, la inercia del trackpad sigue mandando giros cada vez más
    // pequeños: se ignoran. Un gesto nuevo (pausa, giro que crece o clic de rueda) sí cuenta
    if (esperando && !quieto && !crece && !rueda) return;
    esperando = false;
    if (giro < UMBRAL) return;
    irA(destino(e.deltaY > 0));
  }, { passive: false });

  // Con el script activo, el encaje del CSS se apaga para que no se peleen
  function aplicar() { raiz.classList.toggle('scroll-resistencia', ordenador.matches); }
  aplicar();
  if (ordenador.addEventListener) ordenador.addEventListener('change', aplicar);
})();
