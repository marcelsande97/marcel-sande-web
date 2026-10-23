/*
  SCROLL SUAVE CON PESO (solo ordenador)
  --------------------------------------
  La rueda del ratón o el trackpad no mueven la página de golpe: marcan adónde
  quieres llegar y la página va hacia allí como si tuviera peso (referencia: Yurbban Passage).
  - Arranca despacio, acelera y frena muy poco a poco, con un frenado largo.
  - No hay paradas fijas: se detiene donde lo lleve tu gesto.
  Funciona como un muelle: la página «tira» hacia el destino y un rozamiento la frena.
  El teclado, la barra de scroll y los enlaces siguen funcionando como siempre.
  Red de seguridad: en móvil, en pantallas de menos de 900 px o con «reducir movimiento»
  no hace nada y el scroll es el normal del navegador.
*/
(function () {
  // Ajustes: cámbialos para probar otros movimientos
  var RIGIDEZ = 22;     // fuerza con la que tira hacia el destino (más baja: arranque más lento y frenado más largo)
  var DISTANCIA = 1.4;  // cuánto recorre cada giro de rueda (1 = lo normal del navegador; más alto = más caña)

  var ordenador = window.matchMedia('(min-width: 900px) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  var raiz = document.documentElement;
  var destino = window.scrollY;   // adónde vamos
  var posicion = window.scrollY;  // dónde estamos (con decimales)
  var velocidad = 0;
  var enMarcha = false;
  var ultimoTiempo = 0;
  var ultimaY = -1;               // la última posición que pusimos nosotros

  function maximo() { return raiz.scrollHeight - window.innerHeight; }

  // Cada fotograma: muelle con el rozamiento justo para no pasarse ni rebotar
  // (en física, «amortiguamiento crítico»). Parte de velocidad 0, así que arranca suave
  function fotograma(ahora) {
    var dt = Math.min(0.05, (ahora - ultimoTiempo) / 1000);   // segundos desde el fotograma anterior
    ultimoTiempo = ahora;
    var aceleracion = RIGIDEZ * (destino - posicion) - 2 * Math.sqrt(RIGIDEZ) * velocidad;
    velocidad += aceleracion * dt;
    posicion += velocidad * dt;
    // Parado del todo: casi en el destino y casi sin velocidad
    if (Math.abs(destino - posicion) < 0.5 && Math.abs(velocidad) < 5) {
      posicion = destino;
      velocidad = 0;
      enMarcha = false;
    }
    ultimaY = Math.round(posicion);
    window.scrollTo(0, ultimaY);
    if (enMarcha) requestAnimationFrame(fotograma);
  }

  window.addEventListener('wheel', function (e) {
    if (!ordenador.matches || e.ctrlKey) return;                 // Ctrl + rueda: zoom, no tocamos
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;         // gesto horizontal: carruseles
    if (e.target.closest && e.target.closest('.submenu')) return;
    e.preventDefault();                                          // a partir de aquí, mandamos nosotros
    // deltaMode 1: la rueda cuenta en líneas (Firefox); las pasamos a píxeles
    var giro = e.deltaY * (e.deltaMode === 1 ? 16 : 1) * DISTANCIA;
    if (!enMarcha) { posicion = window.scrollY; destino = posicion; velocidad = 0; }
    destino = Math.max(0, Math.min(maximo(), destino + giro));
    if (!enMarcha) {
      enMarcha = true;
      ultimoTiempo = performance.now();
      requestAnimationFrame(fotograma);
    }
  }, { passive: false });

  // Si te mueves de otra forma (teclado, barra, enlace), paramos y seguimos desde ahí
  window.addEventListener('scroll', function () {
    if (enMarcha && Math.abs(window.scrollY - ultimaY) > 2) {
      enMarcha = false;
      velocidad = 0;
    }
  }, { passive: true });
})();
