# Cómo contribuir

Este sitio es HTML y CSS estático. Sin frameworks, sin build, sin base de datos. Eso es a propósito: cualquiera puede abrir `index.html`, editarlo y mandar un PR sin instalar nada.

## Qué PRs aceptamos

- Sumar o corregir un **evento** (fecha, lugar, link de inscripción).
- Sumar un **proyecto**, una **oferta laboral**, tu **perfil abierto a propuestas** o un **recurso** en las páginas de [proyectos](https://jujuy.dev.ar/proyectos/), [oportunidades](https://jujuy.dev.ar/oportunidades/) y [recursos](https://jujuy.dev.ar/recursos/). Más abajo está cada plantilla. Si no querés hacer un PR, hay un formulario para cada caso en [Issues](https://github.com/FrancoDuran23/jujuy_dev/issues/new/choose).
- Sumar tu empresa, universidad o comunidad como **colaborador**. Logo en SVG o PNG, máximo 50 KB, dentro de `assets/logos/`.
- Sumarte al **staff** si sos parte del equipo organizador. Coordinalo antes por WhatsApp.
- Corregir textos, links rotos, problemas de accesibilidad o de responsive.

## Qué no aceptamos

- Frameworks, bundlers, `npm`, ni dependencias de ningún tipo.
- Trackers, analytics, cookies o scripts de terceros.
- Backends, formularios con base de datos o servicios pagos.
- Cambios a la paleta o la identidad visual sin charlarlo antes en un issue.

## Cómo hacerlo

1. Hacé un fork y creá una rama con un nombre claro, por ejemplo `feat/evento-meetup-2`.
2. Editá `index.html` (o la página del listado que corresponda: `proyectos/`, `oportunidades/`, `recursos/`). Los comentarios `EDIT` marcan cada lugar editable.
3. Abrí `index.html` en el navegador y revisalo en desktop y en mobile.
4. Abrí el PR y completá la plantilla.

Usá mensajes de commit cortos con prefijo: `feat:`, `fix:`, `docs:` o `chore:`.

## Sumar un proyecto

En `proyectos/index.html`, copiá una tarjeta de la lista y ponela **arriba de todo**. El comentario `EDIT` del principio de la lista trae la plantilla. Los filtros (tecnología, temática, tipo, estado y si busca colaboradores) se arman solos con lo que escribas; no hay que tocar JavaScript.

Condiciones: tiene que ser un proyecto de alguien de la comunidad y se tiene que poder ver (un repo, una demo o las dos). No hace falta que esté terminado. `estado` es uno de: *En producción*, *En desarrollo*, *Prototipo*.

## Sumar una oferta laboral

En `oportunidades/index.html`, dentro de `#ofertas`, copiá una tarjeta y ponela **arriba de todo**. La plantilla está en el comentario `EDIT`.

- Tiene que decir **modalidad** (Remoto, Híbrido, Presencial), **tipo de contrato** y **cómo postularse** (un link o un mail de la empresa).
- `data-cierre="AAAA-MM-DD"` es la fecha límite: pasada esa fecha la oferta se oculta sola. Si no tiene fecha de cierre, borrá el atributo.
- No se publican ofertas que pidan pagos para postularse, que pidan datos sensibles en el primer contacto (DNI, domicilio) o que excluyan por edad, género u otras condiciones personales.
- JujuyDev no intermedia: el botón *Postularme* lleva a la empresa. No guardamos currículums.

## Sumar tu perfil (abierto a propuestas)

En `oportunidades/index.html`, dentro de `#talento`, copiá una tarjeta y ponela **arriba de todo**.

- **Es público.** La página se indexa en buscadores. Poné solo los datos de contacto que quieras mostrar; recomendamos GitHub o LinkedIn en lugar de teléfono o domicilio.
- Foto: igual que en la sección de contribuidores (`assets/people/nombre-apellido.webp`, cuadrada, 168x168, menos de 10 KB). Si no ponés foto, la tarjeta usa un avatar con tus iniciales.
- Cada perfil muestra cuándo se actualizó. Los perfiles que llevan mucho tiempo sin cambios se retiran para que la lista siga siendo útil; se pueden volver a sumar.
- Para sacar tu perfil, abrí un PR que borre la tarjeta o escribí a jujuydev@gmail.com y lo sacamos.
- Solo se publica el perfil de quien lo pidió. No sumamos perfiles de terceros.

## Sumar un recurso

En `recursos/index.html`, copiá una tarjeta y ponela **arriba de todo** (después de las tarjetas de tipo Skill, que van primero). Etiquetalo bien (tipo, tema, nivel, idioma y costo): de eso salen los filtros.

- Tiene que ser algo que le haya servido a alguien de la comunidad. Mejor si es gratis o tiene una parte gratis.
- La lista es corta y **en español**: solo aceptamos recursos que estén en español (o con versión en español; en ese caso, linkeá esa versión).
- Revisamos que el link funcione y que sea lo que dice ser. No se aceptan links de afiliados ni publicidad disfrazada de recurso.

### Skills de IA

Las tarjetas de tipo **Skill** son los diez repositorios de skills para agentes de IA (formato `SKILL.md`) con más estrellas en GitHub, de más a menos. Son en inglés, así que van con idioma `Inglés`, la descripción en español y el tema `IA y agentes`.

- Cada tarjeta muestra las estrellas en el kicker (`★ +12 mil`: en miles, redondeado hacia abajo y con un `+`, porque las estrellas siguen subiendo). La plantilla está en el comentario `EDIT` de `recursos/index.html`.
- La fecha de la consulta queda en el `title` de las estrellas (`Estrellas en GitHub al AAAA-MM-DD`), que se ve al pasar el mouse. Si actualizás las estrellas, cambiá también esa fecha y volvé a ordenar las tarjetas.
- Para sumar o cambiar una, verificá el repo (que exista, que tenga `SKILL.md` y que las estrellas sean las reales). No entran apps, listas «awesome» ni repos que no sean skills.

## Quién revisa y mergea

El equipo organizador revisa cada PR. El merge lo hace Franco ([@FrancoDuran23](https://github.com/FrancoDuran23)). La rama `main` está protegida, nada entra sin revisión.

Si tenés dudas antes de empezar, abrí un issue o preguntá en el grupo de WhatsApp.

## Sumarte como contribuidor a la página

Todo PR mergeado suma a su autor a la sección **"Personas que hacen crecer este sitio"**. Para aparecer, en tu mismo PR o en uno aparte agregá dos cosas:

1. **Tu foto** en `assets/people/nombre-apellido.webp`. Cuadrada, 168x168, menos de 10 KB. Si no sabés convertirla, subí un JPG o PNG y la convertimos nosotros.

   **No pongas la URL de tu avatar de GitHub.** Es tentador, porque `https://github.com/tu-usuario.png` funciona de una. Pero GitHub te devuelve la imagen sin optimizar: medimos las que teníamos y pesaban entre 100 y 165 KB cada una, para mostrarse a 84 píxeles. Agregarle `?s=160` tampoco alcanza: redimensiona, pero sigue mandando PNG pesado.

   Las cinco fotos que había sumaban 504 KB. Convertidas a WebP local quedaron en 30 KB. Además, un archivo propio no se rompe si algún día borrás tu cuenta ni hace que cada visitante le pegue a los servidores de GitHub.
2. **Tu card**, copiando la última de la lista `#contribuyen` en `index.html`, con:
   - nombre y apellido
   - un título corto, por ejemplo "Frontend Developer" o "Estudiante de Sistemas"
   - un solo link: tu GitHub o tu LinkedIn

Si preferís no aparecer, decilo en el PR y listo. Nadie está obligado.

## Si tocás `styles.css`

Cambiá el número de versión del link del CSS en `index.html` (`styles.css?v=...`). GitHub Pages cachea los archivos diez minutos y, sin eso, la gente puede ver el HTML nuevo con los estilos viejos.
