# Videos

Coloca aqui los archivos de video. Se eligen por nombre en `script.js`:

```js
const videos = {
  fondo: "video-temporal.mp4",
  informativo: ""
};
```

- `fondo`: se reproduce sin sonido y en bucle detras de "Prompt to Prosperity"
  en el inicio. Se pausa solo cuando la persona baja y el inicio ya no se ve.
- `informativo`: mientras este vacio (`""`) no aparece nada. Al escribir el
  nombre de un archivo de esta carpeta (por ejemplo `"video-informativo.mp4"`),
  aparece en el inicio el boton "Ver video informativo", que lo abre en grande
  con sonido.

Opcional: reemplaza `assets/Programa/hero-poster.jpg` por un fotograma del video
de fondo. Es la imagen que se ve mientras carga o si el navegador no reproduce
videos automaticamente.
