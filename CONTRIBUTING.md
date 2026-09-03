# Cómo contribuir

Este sitio es HTML y CSS estático. Sin frameworks, sin build, sin base de datos. Eso es a propósito: cualquiera puede abrir `index.html`, editarlo y mandar un PR sin instalar nada.

## Qué PRs aceptamos

- Sumar o corregir un **evento** (fecha, lugar, link de inscripción).
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
2. Editá `index.html`. Los comentarios `EDIT` marcan cada lugar editable.
3. Abrí `index.html` en el navegador y revisalo en desktop y en mobile.
4. Abrí el PR y completá la plantilla.

Usá mensajes de commit cortos con prefijo: `feat:`, `fix:`, `docs:` o `chore:`.

## Quién revisa y mergea

El equipo organizador revisa cada PR. El merge lo hace Franco ([@FrancoDuran23](https://github.com/FrancoDuran23)). La rama `main` está protegida, nada entra sin revisión.

Si tenés dudas antes de empezar, abrí un issue o preguntá en el grupo de WhatsApp.

## Sumarte como contribuidor a la página

Todo PR mergeado suma a su autor a la sección **"Personas que hacen crecer este sitio"**. Para aparecer, en tu mismo PR o en uno aparte agregá dos cosas:

1. **Tu foto** en `assets/people/nombre-apellido.webp`. Cuadrada, 400x400, menos de 80 KB. Si no sabés convertirla, subí un JPG o PNG y la convertimos nosotros.
2. **Tu card**, copiando la última de la lista `#contribuyen` en `index.html`, con:
   - nombre y apellido
   - un título corto, por ejemplo "Frontend Developer" o "Estudiante de Sistemas"
   - un solo link: tu GitHub o tu LinkedIn

Si preferís no aparecer, decilo en el PR y listo. Nadie está obligado.
