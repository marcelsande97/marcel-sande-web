# Web de Marcel Sandé, facialista en Barcelona

## Contexto
- Web de fase 1: facialista en solitario, con su propio nombre. Más adelante la rehará un equipo profesional.
- El autor es diseñador gráfico y está aprendiendo HTML y CSS: explica brevemente lo que haces y comenta el código en castellano.
- Enfoque de marca: «Facialismo funcional. Sin adornos.» Cada paso de un tratamiento tiene una función justificada; transparencia, sin promesas exageradas ni lenguaje médico.
- Idioma de la web: castellano. Tono directo, cercano y sin relleno, con tuteo.

## Técnica
- HTML y CSS a mano, sin frameworks ni librerías salvo que se pida.
- Estilos compartidos en `estilos.css`; cada página es un `.html`.
- Colores y medidas siempre como variables CSS en `:root` (con modo oscuro).
- Accesible: HTML semántico, foco visible, contraste suficiente, respetar `prefers-reduced-motion`.
- Márgenes laterales estrechos: `--margen` 16–40 px y `--ancho-max` 1600 px.
- Responsive: probar mentalmente en móvil (~380 px) y ordenador.

## Diseño (estado actual de `higiene-facial.html`, la página modelo)
- Dirección: limpia, editorial y algo de lujo; mucho aire pero sin bloques demasiado separados. Nada de verdes, azules ni serifs (probados y descartados).
- Color: fondo blanco `#ffffff`, texto casi negro `#111315`, gris `--tinta-suave` para etiquetas, líneas `#dfe2e5`. Modo oscuro incluido en `:root`.
- Botones en pastilla: negros con texto blanco (menú «Reserva», «Reservar Starter Pack»); con contorno negro e interior transparente para opciones secundarias (botón del hero, «Manifiesto», Higiene facial y Consulta online en tarifas); los de contorno se rellenan de negro al pasar el ratón.
- Tipografías (solo dos):
  - **Ridley Grotesk Medium** (`--fuente-display`), en MAYÚSCULAS con letras espaciadas: logo «MARCEL SANDÉ — FACIALS», título del hero, títulos de sección, título y frase del manifiesto, firma grande del pie. Sin cursiva.
  - **Hanken Grotesk** (Google Fonts, `--fuente` y `--fuente-titulos`): todo lo demás. Menú, botones, títulos de desplegables y nombres de tarifa en mayúsculas espaciadas pequeñas; texto corrido en minúsculas.
- Jerarquía mínima (variables en `:root`; no inventar tamaños nuevos):
  - Ridley: título del hero (grande) · títulos de sección (`clamp(20px, 2vw, 28px)`) · `--display-pequena` (14–16 px, letras 0,1em, interlineado 1,3) para logo, cita tras el hero, «Lo que no hacemos» y su frase · firma (calculada para ir de margen a margen).
  - Hanken: `--texto` 14 px, interlineado 1,4, letras −0,01em, para todo lo que va en minúsculas (párrafos, lema, desplegables, «Primera Visita», duraciones, notas) · `--etiqueta` 12 px en mayúsculas, peso 500, letras 0,1em (menú, botones, títulos de desplegables, nombres de tarifa, números de los pasos, pie) · `--cifra` 24–32 px, peso 500, para todos los precios.
- Ridley es de pago: el archivo está en `fuentes/` (excluida en `.gitignore`, no subir nunca). En la vista previa se pasa aparte; al publicar la web hay que copiarla al servidor y tener licencia web. Sin ella se ve Hanken.
- Nunca una palabra sola en la última línea: `text-wrap: pretty` en p, li, dd, h2 y h3 (junto a `body`). Revisarlo al cambiar anchos de caja o textos.
- Signos ¿? se pegan a la palabra con Hanken: envolverlos en `<span class="abre">` / `<span class="cierra">`.

## Estructura de la página de tratamiento
1. **Cabecera** fija, mismo fondo, sin línea, alta de `--alto-cabecera` (64 px). Menú: Tratamientos (desplegable al pasar el ratón con Higiene facial, Microneedling, Peeling y Evento; cada opción se pone negra al señalarla), Manifiesto, Equipo, Contacto y botón «Reserva». Por debajo de 980 px solo logo + «Reserva».
2. **Hero** (díptico): de 761 px para arriba, texto a la izquierda (alineado con el logo) y foto a la derecha (alineada con el borde derecho); foto de hasta 520 px (34vw); la columna de la foto mide lo que la foto y el aire entre lema/precios y foto lo marca el `padding-right` de `.hero-texto`. A partir de 1100 px el texto va en dos columnas: en la exterior, el título grande arriba y el botón «Reserva» abajo; junto a la foto, el lema arriba (texto normal negro) y abajo los datos «Primera Visita» / «Siguientes Visitas» (etiqueta gris, cifra en Hanken), alineados con los bordes superior e inferior de la foto. En móvil: foto, título, lema, botón y datos, en ese orden y cerca de la foto.
   - Lema: «Tratamiento diseñado para eliminar las impurezas acumuladas en la piel, mejorando su aspecto y su salud.»
   - **Cita centrada** (prueba, `.frase-banda`): justo después del hero, entre comillas «», con `--display-pequena` (igual que «Lo que no hacemos»), caja de 54ch centrada en la página y texto centrado. En móvil, el doble de margen a los lados para que no toque los bordes (mismo tamaño, sin jerarquía nueva). Debajo, una flecha fina hacia abajo (`.frase-flecha`, SVG de dos diagonales de distinto largo) que indica el flujo.
3. **Qué hacemos y por qué**: 6 pasos en desplegables numerados, dos columnas en ordenador.
4. **Manifiesto**: tres columnas centradas en vertical con la foto (proporción 3:4; en móvil máx. 380 px, en ordenador hasta 520 px / 38vw; el texto encima mantiene 324 px de ancho): a la izquierda «LO QUE NO HACEMOS» + párrafo + botón; a la derecha la frase en mayúsculas. Título y frase pequeños (14–16 px, Ridley en mayúsculas); el párrafo con el interlineado normal. En ordenador (≥ 900 px): el título a la izquierda, a media altura de la foto; el párrafo (blanco) centrado encima de la foto y el botón «Manifiesto» cerca de su borde inferior, hueco con contorno blanco y blanco sólido al pasar el ratón. La foto lleva un velo negro (`--velo-reposo` 0: sin velo hasta pasar el ratón) que se oscurece al pasar el ratón o con el teclado (`--velo-hover` 0,55). Se hace con `display: contents` en `.manifiesto-bloque` y colocando las piezas en la rejilla, sin tocar el HTML; por eso el script anima las piezas sueltas del manifiesto. En móvil, apilado con aire generoso alrededor de la foto.
5. **Antes de venir**: desplegables en dos columnas.
6. **Cómo empezar**: tres tarifas (Starter Pack destacado con línea negra gruesa; «Cliente nuevo» / «Ya eres cliente»). Botones a la misma altura. En móvil se deslizan en horizontal.
7. **Firma grande** «MARCEL SANDÉ — FACIALS» de margen a margen (tamaño calculado en `.firma`) y **pie** con datos y enlaces legales.
- Aparición al hacer scroll: `animaciones.js` (IntersectionObserver) vigila bloques enteros (cada sección, manifiesto, firma, pie; en la cita tras el hero se vigila el texto, no el bloque, porque en ordenador el bloque empieza justo en el borde de la pantalla y el fundido terminaba antes de verse el texto; el pie se anima entero para que la línea y el texto aparezcan a la vez); cuando un bloque asoma, todo su contenido (`.aparece` → `.visible`) sube y se funde a la vez; recorrido, duración y curva en `:root` (`--recorrido-aparecer` 60 px, `--tiempo-aparecer` 1,6 s, `--curva-aparecer`), una sola vez (referencia: Yurbban Passage). Solo se esconden los bloques cuyo borde superior (con su padding) empieza por debajo del 90 % de la pantalla al cargar. El hero mide como mínimo una pantalla, para que la cita quede debajo y aparezca con la animación. Red de seguridad: sin JS, sin respuesta del observador, al llegar al final o con «reducir movimiento», todo visible. Al abrir la página, cabecera y hero entran juntos con la misma curva; en el hero se animan los hijos de `.hero-titulo` y `.hero-arriba` porque usan `display: contents` (no se pueden animar).
- La opacidad va aparte de la subida y con `ease-in-out`: texto `--tiempo-texto` (2,4 s), fotos `--tiempo-imagen` (3,2 s). Con la curva de la subida el texto llegaba casi al 100 % en medio segundo y no se notaba el fundido.
- Scroll por bloques solo en ordenador (≥ 900 px): `scroll-snap-type: y mandatory` en `html`; topes en hero, cada `.seccion`, el manifiesto y el final del pie. En móvil, scroll libre.
- Botones con contorno: al hacer hover se rellenan de negro con texto blanco.
- Fotos en `img/`; las actuales son de referencia: para la web pública harán falta fotos propias o con licencia.

## Vista previa
- La vista previa se publica como artifact (https://claude.ai/artifact/TZQr5Tpm8njjEjCWEHKgb8, compartida con «cualquiera con el enlace») con `estilos.css`, `animaciones.js`, las fotos de `img/` y la fuente como archivos adjuntos. Si la fuente no está en `fuentes/`, se puede recuperar de la propia vista previa. Republicar tras cada cambio.
- Para ahorrar tokens: en cambios pequeños, no hacer capturas de comprobación salvo que se pida.

## Reglas de trabajo
- Cambia solo lo necesario; no reescribas archivos enteros para un ajuste pequeño.
- No añadas nunca datos internos (costes, márgenes, proveedores, datos de clientes): el repositorio puede ser público.
- Los enlaces de reserva van a `#` hasta que exista el motor de reservas.
