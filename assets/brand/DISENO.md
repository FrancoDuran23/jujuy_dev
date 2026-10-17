# JujuyDev — guía de diseño

JujuyDev es la comunidad tech de San Salvador de Jujuy: meetups, workshops y hackatones para más de 600 devs, diseñadores y curiosos del norte argentino. La marca combina dos mundos: **pósters editoriales** (papel cálido, tipografía condensada negra enorme, fotos en blanco y negro y un orbe degradado magenta→azul) y una **mascota holográfica**, la llama con antiparras arcoíris. Este sistema arma la web de jujuy.dev con esa mezcla, tomando la estructura de landing de comunidades como CuyoConnect (hero → quiénes somos → eventos → galería → FAQ → contacto).

## Voz y contenido

- Escribí en español rioplatense, con voseo: «Unite», «Deslizá», «Traé tu compu», «Sumate a la comunidad». Nunca «únete» ni «desliza».
- Hablá en primera persona del plural: «Somos», «Buscamos voces nuevas». La comunidad es un nosotros, no una empresa.
- Los títulos van en **MAYÚSCULAS** con `display-xl` / `display-l` y son cortos: «MEET UP TECH», «CABILDO TECH JUJUY», «ASÍ SE VIVIÓ». Máximo tres líneas.
- Las bajadas son una sola oración concreta con los temas separados por comas: «Hackatones, Web3 y becas para estudiar en EE. UU.».
- La metadata va con punto medio: «20:00 hs · Online», «Cabildo · Salón Belgrano».
- Sin emojis en la interfaz. El guiño local lo dan las palabras (cerros, altura, cardón, Tren Solar) y la llama, no los íconos.
- Las indicaciones de acción van en `cue` (mono, espaciada, mayúsculas) con una flecha de texto: «DESLIZÁ →», «VER TODOS →».

## Color

- La página es `paper` (blanco cálido de póster) con texto `ink`. Bandas alternas en `paper-sunk`; tarjetas en `paper-raised` con borde `line-soft`.
- `ink` hace casi todo el trabajo: títulos, botón primario, etiqueta sólida, reglas de 48×4px sobre los títulos de sección.
- `violet` es el único acento de texto: una palabra destacada por título («Código con **altura**», «Hecho en **Jujuy**»), links al pasar el mouse y el foco. Nunca párrafos enteros en violeta.
- El orbe (`orb-magenta` → `orb-violet` → `orb-blue`, de izquierda a derecha, con un desenfoque leve) es la firma de los pósters: uno por pieza, detrás de la foto o de la mascota, nunca como fondo de texto.
- La palabra **Dev** de «JujuyDev» va siempre con el degradado del orbe como texto (`<span class="jd-dev">Dev</span>`): en la portada, en las etiquetas «**JujuyDev** presenta» y en el footer. «Jujuy» queda en el color del texto que lo rodea. Es el único texto que lleva el degradado.
- `sunset`, `cardon` y `sky` son los colores del isotipo; se usan sólo en el isotipo y en ilustraciones, no en la UI.
- `plum` es la superficie oscura de marca (tarjeta del mosaico, bloque final «Sumate a la comunidad») con `on-plum` encima.
- Tema **Noche**: el papel pasa a `#0e0d14`, `ink` se invierte a blanco cálido y el violeta se aclara. Los botones primarios en Noche son claros con texto oscuro (`on-ink`).

## Tipografía

- `condensed` (Anton) para todo título: `display-xl` en el hero y pósters, `display-l` para secciones, `display-m` para tarjetas y números grandes.
- `wide` (Archivo Black) sólo como alternativa de póster con un edificio emblemático detrás («CABILDO TECH JUJUY»). Una pieza no mezcla `condensed` y `wide`.
- `sans` (Montserrat) para todo lo demás: `date` en bold para la fecha, `lead` para bajadas, `body` para texto corrido, `label` para botones y etiquetas, `small` para metadatos.
- `mono` (Space Mono) sólo para `cue`.
- Las cuatro familias se cargan de Google Fonts (con un `<link>` en el `<head>` de cada página).

## Formas, espacio y profundidad

- La marca es **cuadrada**: etiquetas, botones, tarjetas de evento y pósters van con `radius-none`. Lo redondeado es la excepción: fotos del mosaico y tarjetas de foto en `radius-tile` (eco del isotipo), orbe y avatares en `radius-round`.
- Etiquetas: contorno de 1.5px en `line` («**JujuyDev** presenta») o sólidas en `ink` («Evento virtual»). Van de a dos, en fila, sobre el título.
- Espaciado en pasos de `space-*`: `space-12` de margen lateral en escritorio, `space-4` en móvil; `space-24` entre secciones.
- Sin sombras en la UI. `shadow-tile` es sólo para las fotos del mosaico y la tarjeta destacada.
- Foco: anillo sólido de 2px en `focus` con 2px de separación, en cualquier superficie.

## Imágenes y mascota

- Fotos de eventos (`assets/fotos/`) **a color** en el mosaico del hero, la portada, la galería «Así se vivió» y «Hecho en Jujuy». El blanco y negro queda para los pósters de evento.
- La llama recortada (`assets/brand/jujuydev-llama-hd.webp`) va siempre **en una capa delante** de las fotos, con el orbe detrás de su cabeza. Mirando hacia la derecha; no se espeja, no se recolorea, no se recorta por la cabeza.
- La ilustración completa (llama con cerros de colores) es para avatar de redes y para la sección «Quiénes somos».

## La presentación (HeroMosaic)

El hero es un mosaico de fotos de eventos en tres filas que se desplazan como carrusel continuo (filas alternadas en sentido contrario), con un **fade a los costados** y hacia abajo hacia `paper`. La llama va una capa adelante, centrada, con el orbe detrás. El título va abajo a la izquierda y la bajada con los botones abajo a la derecha. El carrusel se pausa al pasar el mouse y se detiene con `prefers-reduced-motion`. El mosaico es sólo de fotos a color del grupo Fotos (`assets/fotos/`), sin bloques ni huecos: se repiten fotos para llenar las filas.

## Logos

- `assets/brand/jujuydev-logo.webp` (isotipo degradado + «jujuy» en `navy` + «.dev» en `violet`) sobre `paper`.
- `assets/brand/jujuydev-logo-white.webp` sobre `ink`, `plum` o el tema Noche.
- `assets/brand/jujuydev-isotipo.png` solo, como favicon o sello; `../logo.svg` cuando hace falta en vector.
- No hay ícono propio aparte del isotipo: las flechas son caracteres de texto (→ ↓) y el «+ / –» del FAQ va en `mono`.


## Archivos

- `index.html`: la home (nav, hero con mosaico, «Hecho en Jujuy», pilares, eventos, galería, Tren Solar, canales, colaboradores, preguntas, «Sumate a la comunidad», quiénes organizan, footer).
- `css/tokens.css`: colores (temas claro y oscuro), espaciado, radios y familias tipográficas, generados desde `css/tokens.json`.
- `css/jd.css`: todos los componentes (`.jd-*`).
- `css/pages.css`: lleva los componentes de `styles.css` de las páginas internas al sistema (paleta, títulos, formas cuadradas).
- `assets/jd-nav.js`: menú en pantallas chicas y año del footer, en todas las páginas. `assets/jd-home.js`: mosaico del hero y Tren Solar.
- `assets/fotos/`: fotos de eventos a color. `assets/brand/`: logos, isotipo y la llama.
- El Tren Solar lleva a las personas del bloque `jd-tren-miembros` de `index.html`, cada una con su foto en `assets/people/`.
- El tema de la home se elige solo según el sistema (`prefers-color-scheme`); para forzarlo: `localStorage.setItem('jd-theme', 'dark' | 'light')`. Las páginas internas son sólo tema claro por ahora.
