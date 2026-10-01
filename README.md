# Prompt to Prosperity

Base estatica para la pagina de Prompt to Prosperity.

La primera version usa informacion publica del Instagram y publicaciones
indexadas del proyecto: programa para emprendedores hondurenos, IA aplicada,
marketing, productividad, datos, operaciones, mentorias, talleres, convocatoria
gratuita, cupos limitados y acompanamiento de expertos.

## Archivos principales

- `index.html`: estructura de la pagina.
- `styles.css`: estilos y paleta base.
- `script.js`: logica del chatbot, tarjetas y configuracion del video destacado.
- `faq.md`: preguntas, respuestas y palabras clave del chatbot.
- `assets/videos/`: carpeta para videos. Consulta su `README.md` para mostrarlos por nombre.
- `pages/miembros/`: paginas individuales para perfiles de miembros.
- `pages/negocios/`: paginas individuales para perfiles de negocios.
- `pages/directory.json`: indice generado automaticamente desde las paginas HTML.

## Perfiles de comunidad

Para agregar o cambiar perfiles, crea o renombra archivos `.html` dentro de:

- `pages/miembros/` para miembros.
- `pages/negocios/` para negocios.

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
