# Prompt to Prosperity

Base estatica para la pagina de Prompt to Prosperity.

La primera version usa informacion publica del Instagram y publicaciones
indexadas del proyecto: programa para emprendedores hondurenos, IA aplicada,
marketing, productividad, datos, operaciones, mentorias, talleres, convocatoria
gratuita, cupos limitados y acompanamiento de expertos.

## Archivos principales

- `index.html`: estructura de la pagina (texto en espanol).
- `styles.css`: estilos y paleta base.
- `script.js`: logica de Prompty (chatbot), graficos de cifras, tarjetas del
  curriculum, comunidad y video del inicio.
- `i18n.js`: cambio de idioma ES / EN. El ingles se escribe aqui por clave
  (`data-i18n="clave"` en el HTML). Se puede abrir la pagina en ingles con
  `?lang=en`.
- `faq.md` / `faq.en.md`: preguntas, respuestas y palabras clave de Prompty en
  espanol e ingles.
- `assets/videos/`: carpeta para videos. Consulta su `README.md`.
- `assets/Programa/`: fotogramas del video usados como imagenes del programa.
- `assets/Aliados/`: logos de aliados (Banco Atlantida y ADH). Si falta un
  archivo, la seccion de alianzas muestra su nombre en su lugar.
- `pages/miembros/`: paginas individuales para perfiles de miembros.
- `pages/negocios/`: paginas individuales para perfiles de negocios.
- `pages/directory.json`: indice generado automaticamente desde las paginas HTML.
- `assets/Negocios Cinta/manifest.json`: indice generado automaticamente desde
  las imagenes de `assets/Negocios Cinta/`.

## Perfiles de comunidad

Para agregar o cambiar perfiles, crea o renombra archivos `.html` dentro de:

- `pages/miembros/` para miembros.
- `pages/negocios/` para negocios.

En perfiles de negocios puedes agregar estos metadatos dentro del `<head>` para
activar los filtros del home:

```html
<meta name="p2p-generation" content="Generacion 1">
<meta name="p2p-category" content="Alimentos y bebidas">
```

Si no se agregan, el negocio igual aparece; la categoria se toma del primer
texto del perfil y la generacion queda como `Sin generacion`.

Luego ejecuta:

```bash
npm run sync-pages
```

Para trabajar en local con sincronizacion automatica al refrescar:

```bash
npm run dev
```

Esto permite que el navegador cargue `faq.md` y que el indice de comunidad se
actualice desde los archivos reales en `pages`.

## Cinta de negocios

Para cambiar los logos o imagenes de la cinta del inicio, agrega o elimina
archivos de imagen dentro de:

```bash
assets/Negocios Cinta/
```

Si la imagen se llama igual que la pagina del negocio (por ejemplo
`royal-sugar.png` para `pages/negocios/royal-sugar.html`), tambien se usa como
logo en su tarjeta de Comunidad y en su perfil.

No edites `assets/Negocios Cinta/manifest.json` manualmente. Se regenera al
ejecutar:

```bash
npm run sync-pages
```

Tambien se actualiza al correr `npm run build` o al refrescar la pagina con
`npm run dev`.
