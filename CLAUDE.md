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
- Responsive: probar mentalmente en móvil (~380 px) y ordenador.

## Diseño
- Tipografía: Instrument Sans (Google Fonts).
- Fondo blanco, texto negro, gris para texto secundario.
- Acento ultramar `#2a35ff`, solo para lo que se puede pulsar y para algún detalle puntual.
- Botones en forma de pastilla. Desplegables con `<details>`/`<summary>` y símbolo «+».
- Referencia de estilo: jamesvivian.co, pero sin copiar elementos reconocibles (nada de nombre gigante en el pie ni color lima).

## Reglas de trabajo
- Cambia solo lo necesario; no reescribas archivos enteros para un ajuste pequeño.
- No añadas nunca datos internos (costes, márgenes, proveedores, datos de clientes): el repositorio puede ser público.
- Los enlaces de reserva van a `#` hasta que exista el motor de reservas.
