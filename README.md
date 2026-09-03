# jujuy.dev

Landing de la comunidad tech de Jujuy. HTML y CSS puro: sin frameworks, sin build, sin base de datos, sin dependencias que instalar.

Sitio publicado: https://jujuy.dev.ar/

## Ver el sitio en tu máquina

Abrí `index.html` con doble click. Listo. No hay nada que instalar.

## Contribuir

Los PRs son bienvenidos. Leé [CONTRIBUTING.md](CONTRIBUTING.md) antes de empezar: ahí está qué aceptamos, qué no, y cómo probar tus cambios. También tenemos un [código de conducta](CODE_OF_CONDUCT.md).

## Editar el contenido

Todo vive en `index.html`. Buscá los comentarios que dicen `EDIT` para encontrar cada punto rápido:

| Qué                          | Dónde                                                                |
| ---------------------------- | -------------------------------------------------------------------- |
| Eventos                      | Sección `#eventos`, cada `<article>` es un evento                    |
| Canales de la comunidad      | Sección `#comunidad`. Las cards con clase `soon` están sin link aún  |
| Logos de colaboradores       | Sección `#colaboradores`, reemplazá cada `.logo-slot` por un `<img>` |
| Staff                        | Sección `#staff`                                                     |
| Personas que contribuyen     | Lista `#contribuyen` dentro de colaboradores, foto en `assets/people/` |
| Números de la comunidad      | Sección `#numeros`                                                   |
| Links del footer             | `<footer>`                                                           |

## Publicación

El sitio se publica solo con GitHub Pages desde la rama `main`. Cada merge a `main` actualiza la página en un minuto.

El dominio `jujuy.dev.ar` está definido en el archivo `CNAME`. El DNS se administra desde el panel de dev.ar y apunta a `francoduran23.github.io`. No lo toques salvo que sepas lo que hacés.

## Archivos

```
index.html              la página completa
styles.css              estilos y paleta
assets/hero.webp               ilustración del hero en desktop, optimizada
assets/hero-mobile.webp        ilustración del hero en celulares, optimizada
assets/hero-source.png         original en alta resolución (desktop)
assets/hero-mobile-source.png  original en alta resolución (celulares)
assets/favicon.svg      ícono de la pestaña (chakana)
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
