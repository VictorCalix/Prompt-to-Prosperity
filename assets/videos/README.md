# Videos

Coloca aqui el archivo `video-informativo.mp4`. Aparece en el inicio como una
miniatura compacta debajo de la tarjeta del hero y se abre en grande al hacer
clic.

Para usar otro archivo, abre `script.js` y cambia los datos de `featuredVideo`:

```js
const featuredVideo = {
  filename: "video-informativo.mp4",
  title: "Video informativo",
  description: "Conoce Prompt to Prosperity"
};
```

Si el archivo no existe, la miniatura muestra "Disponible proximamente". Si
`filename` queda vacio, no se muestra ningun espacio de video.
