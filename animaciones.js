/*
  APARICIÓN AL HACER SCROLL
  -------------------------
  Cada bloque empieza un poco más abajo y transparente, y cuando asoma en pantalla
  sube y aparece (los movimientos están en estilos.css, en .aparece y .visible).
  Red de seguridad: si algo falla o la persona prefiere menos movimiento,
  no se esconde nada y la página se ve normal.
*/
(function () {
  // Sin soporte o con «reducir movimiento» activado: no hacemos nada
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Qué bloques se animan
  var selector = '.seccion h2, .acordeon details, .nota, .manifiesto-fila > *, .precio, .aviso-reserva, .firma, .pie-columnas > div';
  var bloques = document.querySelectorAll(selector);
  var altoPantalla = window.innerHeight;

  // Solo escondemos lo que está por debajo de la pantalla al cargar
  var aEsconder = [];
  bloques.forEach(function (el) {
    if (el.getBoundingClientRect().top > altoPantalla * 0.9) aEsconder.push(el);
  });

  // Los hermanos de un mismo grupo (pasos, tarifas…) entran uno detrás de otro
  aEsconder.forEach(function (el) {
    var hermanos = aEsconder.filter(function (o) { return o.parentNode === el.parentNode; });
    var orden = Math.min(hermanos.indexOf(el), 5);
    el.style.setProperty('--retraso', (orden * 0.08) + 's');
    el.classList.add('aparece');
  });

  var respuesta = false;
  var observador = new IntersectionObserver(function (entradas) {
    respuesta = true;
    entradas.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observador.unobserve(e.target);   // solo una vez: al subir no se deshace
      }
    });
  }, { threshold: 0.15 });               // aparece cuando asoma un 15 % del bloque
  aEsconder.forEach(function (el) { observador.observe(el); });

  // Red de seguridad: si el observador no responde, lo mostramos todo
  function mostrarTodo() { aEsconder.forEach(function (el) { el.classList.add('visible'); }); }
  setTimeout(function () { if (!respuesta) mostrarTodo(); }, 1500);
  window.addEventListener('beforeprint', mostrarTodo);
})();
