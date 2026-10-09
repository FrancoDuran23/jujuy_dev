# jujuy.dev

Landing de la comunidad tech de Jujuy. HTML y CSS puro: sin frameworks, sin build, sin base de datos, sin dependencias que instalar.

Sitio publicado: https://jujuy.dev.ar/

## Ver el sitio en tu máquina

Abrí `index.html` con doble click. Listo. No hay nada que instalar.

> El doble click sirve solo para ver la home. Para navegar entre páginas (proyectos, oportunidades, recursos…) levantá un servidor local con `python3 -m http.server 8000` desde esta carpeta y abrí http://localhost:8000. Los links internos son absolutos a propósito (`/proyectos/`, `/recursos/`): el sitio se publica en la raíz del dominio, y con `file://` esos links no encuentran nada.

## Contribuir

Los PRs son bienvenidos. Leé [CONTRIBUTING.md](CONTRIBUTING.md) antes de empezar: ahí está qué aceptamos, qué no, y cómo probar tus cambios. También tenemos un [código de conducta](CODE_OF_CONDUCT.md).

## Editar el contenido

La home vive en `index.html` y cada listado en su propia página. Buscá los comentarios que dicen `EDIT` para encontrar cada punto rápido:

| Qué                          | Dónde                                                                |
| ---------------------------- | -------------------------------------------------------------------- |
| Eventos                      | Sección `#eventos`. Lo que viene se arma desde el [calendario de Luma](https://luma.com/jujuydev) (`assets/calendario.js`). Las fichas son el archivo de encuentros que ya pasaron. |
| Canales de la comunidad      | Sección `#comunidad`. Las cards con clase `soon` están sin link aún  |
| Logos de colaboradores       | Sección `#colaboradores`, reemplazá cada `.logo-slot` por un `<img>` |
| Staff                        | Sección `#staff`                                                     |
| Personas que contribuyen     | Lista `#contribuyen` dentro de colaboradores, foto en `assets/people/` |
| Números de la comunidad      | Sección `#numeros`                                                   |
| Links del footer             | `<footer>`                                                           |
| Proyectos de la comunidad    | `proyectos/index.html`: copiá una tarjeta (hay una plantilla en el comentario `EDIT`) |
| Ofertas laborales            | `oportunidades/index.html`, pestaña `#ofertas`                       |
| Perfiles abiertos a propuestas | `oportunidades/index.html`, pestaña `#talento`                     |
| Recursos para aprender       | `recursos/index.html`                                                |

## Cómo funcionan los buscadores y filtros

Los tres listados (proyectos, oportunidades y recursos) son HTML normal: cada tarjeta es un `<article>`. `assets/filtros.js` lee lo que está escrito en cada tarjeta y arma solo el buscador y los filtros. Quien suma una tarjeta no toca JavaScript.

- Cada valor filtrable lleva `data-facet="nombre"` (por ejemplo `data-facet="tech"`). En una lista `<ul>`, cada `<li>` es una opción.
- El contenedor del listado declara qué filtros hay con `data-facets="tech:Tecnología,tema:Temática"`.
- Si JavaScript no carga, la página se ve igual: es una lista de tarjetas.
- Los filtros se guardan en la URL, así que se puede compartir una búsqueda por WhatsApp.
- Una oferta con `data-cierre="AAAA-MM-DD"` se oculta sola pasada esa fecha.

El detalle completo está en el comentario del principio de `assets/filtros.js`.

## Publicación

El sitio se publica solo con GitHub Pages desde la rama `main`. Cada merge a `main` actualiza la página en un minuto.

El dominio `jujuy.dev.ar` está definido en el archivo `CNAME`. El DNS se administra desde el panel de dev.ar y apunta a `francoduran23.github.io`. No lo toques salvo que sepas lo que hacés.

## Archivos

```
index.html              la home
proyectos/              proyectos hechos en Jujuy, con buscador y filtros
oportunidades/          ofertas laborales y personas abiertas a propuestas
recursos/               recursos en español y skills de IA, con buscador y filtros
styles.css              estilos y paleta
assets/filtros.js              buscador, filtros y pestañas de los listados, sin dependencias
assets/hero-layers/hornocal-*.webp capas transparentes publicadas del parallax
assets/hero-parallax.js        parallax por scroll, sin dependencias
assets/hero-scene.md           composición, exportación y ajustes de las capas
assets/hornocal-prompts.md     prompts finales de las tres ilustraciones
assets/hero.webp               ilustración original, referencia de estilo
assets/hero-source.png         original en alta resolución
assets/logo.svg                logo de la marca, en el nav y como ícono de pestaña
assets/logo-white.svg          variante blanca del logo, para el footer oscuro
assets/og.jpg           imagen de vista previa para WhatsApp, LinkedIn y X
assets/logos/           logos de colaboradores
robots.txt              permite indexar y apunta al sitemap
sitemap.xml             lista de páginas para Google
CNAME                   dominio del sitio
CONTRIBUTING.md         cómo mandar un PR
CODE_OF_CONDUCT.md      normas de la comunidad
LICENSE                 MIT
```

La paleta sale de la ilustración: fondo crema y el gradiente del Hornocal, de naranja a azul. Está definida como variables al inicio de `styles.css`.
