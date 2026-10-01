const fs = require("fs");
const http = require("http");
const path = require("path");
const { generateDirectory } = require("./generate-directory");

const rootDir = path.resolve(__dirname, "..");
const port = Number(process.env.PORT || 8000);

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".md": "text/markdown; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp"
};

function serveFile(request, response) {
  const requestUrl = new URL(request.url, `http://localhost:${port}`);
  let filePath = decodeURIComponent(requestUrl.pathname);

  if (filePath === "/") {
    filePath = "/index.html";
  }

  if (filePath === "/index.html" || filePath === "/pages/directory.json") {
    generateDirectory();
  }

  const absolutePath = path.normalize(path.join(rootDir, filePath));

  if (!absolutePath.startsWith(rootDir)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  fs.readFile(absolutePath, (error, data) => {
    if (error) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }

    const contentType = contentTypes[path.extname(absolutePath).toLowerCase()] || "application/octet-stream";
    response.writeHead(200, { "Content-Type": contentType });
    response.end(data);
  });
}

generateDirectory();

http.createServer(serveFile).listen(port, () => {
  console.log(`Servidor listo en http://localhost:${port}`);
  console.log("El directorio se actualiza al refrescar index.html.");
});
