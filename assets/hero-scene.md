# Hero: Hornocal y cerros de Jujuy

La composición fusiona los pliegues triangulares del Hornocal con la paleta coral, magenta y violeta y el grabado sobre crema de la identidad visual del sitio. Las laderas cercanas se inspiran en las bandas y formas erosionadas de Maimará y Purmamarca. Es una interpretación artística de varios paisajes jujeños.

## Assets publicados

Cada plano publicado es un WebP transparente ya recortado. El repositorio conserva únicamente las seis variantes que carga el navegador, sin SVG ni imágenes intermedias de generación.

| Plano | Archivo en `hero-layers/` | Tamaño lógico | Variante móvil |
| --- | --- | --- | --- |
| Serranía | `hornocal-fusion.webp` | 1536 × 661 | `hornocal-fusion-small.webp` |
| Cerros laterales | `hornocal-frame-middle.webp` | 1536 × 895 | `hornocal-frame-middle-small.webp` |
| Primer plano | `hornocal-frame-front.webp` | 1536 × 773 | `hornocal-frame-front-small.webp` |

Hasta 899 px el navegador elige por `srcset`/`sizes`: las variantes de 960 px en pantallas de baja densidad cuando alcanzan para el ancho dibujado, y las de 1536 px en pantallas de 2×/3× o cuando el hero es muy alto. Las tres descargas suman aproximadamente 357 KiB con las variantes pequeñas y 968 KiB con las grandes. El preload de la serranía utiliza la misma selección para evitar una segunda descarga.

En una comparación local de 120 pasos a 390 × 844 y densidad 2×, el promedio de frame fue 16,62 ms con las capas de 960 px y 16,55 ms con las de 1536 px; ninguna ejecución superó los 20 ms. Es una prueba sintética en Chromium headless, no una medida de usuarios reales. Las pantallas de 3× todavía pueden exceder la resolución de los assets grandes; resolverlo por completo exigiría ilustraciones originales con más detalle y un costo adicional de descarga y memoria.

## Composición y movimiento

La página mantiene el scroll normal y fija la escena durante un tramo de 70 % de su altura. El hero animado mide 1,7 veces la escena: esta permanece visible mientras el Hornocal se aleja y suben los dos marcos, y luego sale de pantalla antes de entrar en la siguiente sección. No se bloquean la rueda, el tacto ni los enlaces. Con movimiento reducido o sin JavaScript, el hero conserva una sola altura y no añade el tramo fijo. La escena tiene un alto mínimo de 760 px en escritorio y 700 px en móvil, lo que mantiene la flecha de scroll visible en teléfonos de 700 px de alto. El Hornocal comienza al 37 % de la altura de la escena en escritorio y al 39 % en móvil. En escritorio, su ancho mínimo de 1,55 veces la altura permite mantenerla cubierta. Los cerros laterales empiezan al 14 % (22 % en móvil) y las rocas cercanas al 32 % (30,5 % en móvil).

En móvil los dos marcos tienen una proporción más vertical, con relaciones de aspecto de 1 y 1,15 respectivamente. La serranía conserva su proporción original, usa un ancho mínimo de 980 px y desplaza su centro un 1 % hacia la izquierda para mostrar más pliegues diagonales. Los marcos adaptan también su ancho a la altura de la ventana para cubrir el borde inferior durante el recorrido. La niebla ocupa el último 10 % del hero estático y el 15 % durante el parallax para suavizar la base de la serranía en la entrada. El indicador de scroll se apoya sobre ella sin una caja exterior y concentra el contraste en la flecha circular.

En escritorio el título usa una sola línea y el párrafo queda directamente sobre el cielo; los botones funcionan como transición hacia la serranía. En móvil se omite el párrafo introductorio: el título y los botones ocupan el valle central. En la escena animada, el Hornocal usa 90 % de opacidad y los dos marcos empiezan bajos, con el centro abierto. En la composición estática, la serranía usa 74 % de opacidad y los marcos vuelven a su posición normal.

En pantallas de al menos 1400 px de ancho y hasta 980 px de alto, los marcos se amplían y suben al 8 % y 28 %. Las laderas cercanas abrazan la composición y el valle central conserva aire alrededor del texto.

Al inicio, el Hornocal se presenta con una escala de 1,07 en escritorio y 1,01 en móvil, desplazado 2,5 % hacia abajo. Durante el tramo fijo se reduce a 0,92 y 0,88 respectivamente. El plano intermedio parte 32 % más abajo y el frente 42 % más abajo; ambos suben mientras el fondo se aleja. Al final, el desplazamiento vertical del Hornocal, el plano intermedio y el frente es +8 %, −10 % y −3,5 % de la escena en escritorio; +6 %, −8 % y −2 % en móvil. Estas distancias conservan la serranía dentro del valle mientras la escena está fija, sin dejar un área grande de cielo vacío. La entrada usa únicamente `transform` sobre las mismas tres imágenes.

El mismo recorrido añade una deriva horizontal suave al fondo y al plano intermedio: −8 y +18 px en escritorio; −4 y +10 px en móvil. El frente se mantiene centrado para conservar el valle abierto hacia el Hornocal. No aparecen transparencias parciales entre montañas: cada marco entra desde abajo como una silueta opaca. La flecha de “Seguí explorando” oscila 4 px para indicar el recorrido, se detiene al interactuar y respeta la preferencia de movimiento reducido.

Los navegadores compatibles usan `animation-timeline` y el rango `exit-crossing 0% exit-crossing 41,176%`. La proporción 0,7 / 1,7 hace que la animación termine cuando la escena sticky se libera. El recorrido comienza cuando el borde superior del hero llega al borde superior de la ventana. Referencia: [rangos de scroll, W3C](https://www.w3.org/TR/scroll-animations-1/#view-timelines-ranges).

La alternativa en `hero-parallax.js` usa `requestAnimationFrame` y geometría guardada, que actualiza al redimensionar o volver a entrar en pantalla. Su progreso se mide sobre la diferencia entre la altura del hero y la de la escena fija. No introduce un bucle de interpolación. Solo se anima `transform`; los recortes, la protección del texto y el degradado inferior son estáticos.

Con movimiento reducido, el parallax se desactiva, incluso si la preferencia cambia con la página abierta. Sin JavaScript, las imágenes y el contenido permanecen visibles en una composición estática.

## Navegación durante la escena

En el inicio, el nav permanece oculto durante el primer 6 % del tramo fijo. Entre el 6 % y el 20 % recorre 24 px y aumenta su opacidad con una curva suave; después queda fijo y visible. Al volver arriba, el mismo recorrido se invierte. Mientras está oculto, no intercepta clics.

La aparición comparte el controlador de scroll y las medidas guardadas del hero. Los cerros siguen usando la animación CSS cuando está disponible; JavaScript solo actualiza la aparición del nav en ese caso. Al salir del hero se fija el estado final, también al saltar directamente a una sección o restaurar una posición de scroll.

El foco visible de teclado y el menú móvil abierto mantienen el nav desplegado. Con movimiento reducido, sin JavaScript o en las páginas secundarias, la navegación aparece desde el inicio. Se comprobaron la aparición parcial y completa, los saltos por anclas, la vuelta al inicio, el menú móvil y la alternativa JavaScript del parallax.

## Generación y exportación

Se usó **imagegen integrada**, sin API ni CLI de generación. El [conjunto de prompts final](hornocal-prompts.md) documenta las tres transferencias de estilo.

La referencia visual principal fue una composición exploratoria usada solo durante la generación. Una [fotografía del Hornocal publicada por TodoJujuy](https://www.todojujuy.com/lugares/otra-maravilla-jujuy-el-hornocal-es-el-paisaje-estrella-la-quebrada-humahuaca-n101931) orientó la forma de los pliegues. Ninguna de las referencias se distribuye como asset del sitio.

Los SVG de generación se renderizaron una sola vez con fondo transparente y se exportaron a WebP con calidad 82 en escritorio y 80 en móvil. Así se conserva el recorte de la silueta sin procesar el trazado vectorial durante la navegación. No se modifica el raster durante el scroll.

**Al exportar WebP con ffmpeg, escribir a un archivo que permita reposicionar la escritura, no a `pipe:1`.** La exportación anterior por pipe dejó el tamaño RIFF en cero y añadió ese tamaño al final. Algunos decodificadores rechazaban esos archivos y las sesiones fallaban al visualizarlos. Las nuevas exportaciones verifican el tamaño RIFF y la decodificación completa del raster.

## Verificación

La revisión incluye capturas de escritorio, móvil y transición a la sección siguiente; carga y selección de assets; cobertura inferior de la serranía; ausencia de desbordamiento horizontal y de solapamientos entre controles.

La comprobación del movimiento compara las transformaciones reales con el recorrido esperado en diferentes alturas de ventana, además de la alternativa JavaScript forzada, movimiento reducido, enlaces internos, regreso al inicio y funcionamiento sin JavaScript.

En una prueba sintética de 120 pasos a 1916 × 900, el percentil 95 del tiempo entre frames bajó de 25,9 ms a 18,6 ms y los frames de más de 20 ms bajaron de 10 a 5. Es una comparación local en Chromium headless, útil para detectar regresiones; no reemplaza métricas de usuarios reales.
