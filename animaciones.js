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
  var grupos = '.frase-banda, .seccion, .manifiesto, .firma, .pie';
  var elementos = '.frase-banda .declaracion, .seccion h2, .acordeon details, .nota, .manifiesto-fila > *, .precio, .aviso-reserva, .firma, .pie-columnas > div';
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
    });
  });

  function mostrar(grupo) {
    grupo.querySelectorAll('.aparece').forEach(function (el) { el.classList.add('visible'); });
    if (grupo.classList.contains('aparece')) grupo.classList.add('visible');   // la firma es grupo y elemento
  }

  var respuesta = false;
  var observador = new IntersectionObserver(function (entradas) {
    respuesta = true;
    entradas.forEach(function (e) {
      if (e.isIntersecting) {
        mostrar(e.target);
        observador.unobserve(e.target);   // solo una vez: al subir no se deshace
      }
    });
  }, { rootMargin: '0px 0px -10% 0px' });   // arranca cuando el bloque ha entrado un poco
  document.querySelectorAll(grupos).forEach(function (g) { observador.observe(g); });

  // Red de seguridad: si el observador no responde, o llegamos al final de la página, lo mostramos todo
  function mostrarTodo() { escondidos.forEach(function (el) { el.classList.add('visible'); }); }
  setTimeout(function () { if (!respuesta) mostrarTodo(); }, 1500);
  window.addEventListener('scroll', function () {
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) mostrarTodo();
  }, { passive: true });
  window.addEventListener('beforeprint', mostrarTodo);
})();
