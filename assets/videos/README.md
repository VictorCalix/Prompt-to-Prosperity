# Videos

Coloca aqui el archivo del video. Aparece en el inicio como una miniatura en
bucle y sin sonido debajo de la tarjeta del hero, y se abre en grande con audio
al hacer clic.

Para usar otro archivo, abre `script.js` y cambia los datos de `featuredVideo`:

```js
const featuredVideo = {
  filename: "video-temporal.mp4",
  title: "Video informativo",
  description: "Conoce Prompt to Prosperity"
};
```

Si el archivo no existe, la miniatura muestra "Disponible proximamente". Si
`filename` queda vacio, no se muestra ningun espacio de video.
