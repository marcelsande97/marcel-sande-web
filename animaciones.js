/*
  APARICIÓN AL HACER SCROLL
  -------------------------
  La página se divide en bloques (cada sección, el manifiesto, la firma y el pie).
  Cuando la parte de arriba de un bloque asoma en pantalla, todo lo que hay dentro
  aparece a la vez y con el mismo movimiento (está en estilos.css: .aparece y .visible).
  Red de seguridad: si algo falla o la persona prefiere menos movimiento,
  no se esconde nada y la página se ve normal.
*/
(function () {
  // Sin soporte o con «reducir movimiento» activado: no hacemos nada
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Los bloques que se vigilan y, dentro de ellos, los elementos que se animan
  var grupos = '.frase-banda, .seccion, .manifiesto, .newsletter, .firma, .pie';
  var elementos = '.frase-banda .declaracion, .seccion h2, .antetitulo, .acordeon details, .manifiesto-bloque > *, .cartel, .manifiesto-frase, .precio, .aviso-reserva, .resultados-par, .newsletter, .firma, .pie-columnas, .pie-legal';   // el pie entero: la línea de arriba y el texto aparecen a la vez
  var altoPantalla = window.innerHeight;

  // Solo escondemos los bloques que empiezan por debajo de la pantalla al cargar.
  // Se mira el borde de arriba del BLOQUE (con su margen interior), no el de cada
  // elemento: si el bloque ya asoma, el observador lo daría por visto al momento
  // y su contenido aparecería sin que lo vieras
  var escondidos = [];
  document.querySelectorAll(grupos).forEach(function (g) {
    if (g.getBoundingClientRect().top <= altoPantalla * 0.9) return;
    var dentro = Array.prototype.slice.call(g.querySelectorAll(elementos));
    if (g.matches(elementos)) dentro.push(g);   // la firma es bloque y elemento a la vez
    dentro.forEach(function (el) {
      el.classList.add('aparece');
      escondidos.push(el);
      // Cuando termina el fundido, quitamos las clases: el elemento vuelve a sus
      // estilos normales (por ejemplo, la transición del hover de los botones)
      el.addEventListener('transitionend', function (e) {
        if (e.target === el && e.propertyName === 'opacity') el.classList.remove('aparece', 'visible');
      });
    });
  });

  function mostrar(grupo) {
    grupo.querySelectorAll('.aparece').forEach(function (el) { el.classList.add('visible'); });
    if (grupo.classList.contains('aparece')) grupo.classList.add('visible');   // la firma es grupo y elemento
  }

  // Qué se vigila de cada bloque: normalmente el bloque entero. En la cita se vigila
  // el propio texto: el bloque empieza justo en el borde de la pantalla y el texto
  // va mucho más abajo (por el padding), así que con un toque de scroll el fundido
  // terminaba antes de que el texto llegara a verse
  function disparador(g) {
    return g.matches('.frase-banda') ? g.querySelector('.declaracion') : g;
  }

  var respuesta = false;
  var observador = new IntersectionObserver(function (entradas) {
    respuesta = true;
    entradas.forEach(function (e) {
      if (e.isIntersecting) {
        mostrar(e.target.closest(grupos));
        observador.unobserve(e.target);   // solo una vez: al subir no se deshace
      }
    });
  }, { rootMargin: '0px 0px -10% 0px' });   // arranca cuando el bloque ha entrado un poco
  document.querySelectorAll(grupos).forEach(function (g) { observador.observe(disparador(g)); });

  // Red de seguridad: si el observador no responde, o llegamos al final de la página, lo mostramos todo
  function mostrarTodo() { escondidos.forEach(function (el) { el.classList.add('visible'); }); }
  setTimeout(function () { if (!respuesta) mostrarTodo(); }, 1500);
  window.addEventListener('scroll', function () {
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) mostrarTodo();
  }, { passive: true });
  window.addEventListener('beforeprint', mostrarTodo);
})();
