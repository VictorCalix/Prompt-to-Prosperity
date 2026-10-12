const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const directoryPath = path.join(rootDir, "pages", "directory.json");
const businessRibbonDir = path.join(rootDir, "assets", "Negocios Cinta");
const businessRibbonManifestPath = path.join(businessRibbonDir, "manifest.json");
const imageExtensions = new Set([".avif", ".gif", ".jpg", ".jpeg", ".png", ".svg", ".webp"]);

const categories = {
  members: path.join("pages", "miembros"),
  businesses: path.join("pages", "negocios")
};

function toWebPath(filePath) {
  return filePath.split(path.sep).join("/");
}

function listHtmlFiles(relativeDir) {
  const absoluteDir = path.join(rootDir, relativeDir);

  if (!fs.existsSync(absoluteDir)) {
    return [];
  }

  return fs
    .readdirSync(absoluteDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".html"))
    .map((entry) => toWebPath(path.join(relativeDir, entry.name)))
    .sort((first, second) => first.localeCompare(second, "es", { sensitivity: "base" }));
}

function listBusinessRibbonFiles() {
  if (!fs.existsSync(businessRibbonDir)) {
    return [];
  }

  return fs
    .readdirSync(businessRibbonDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && imageExtensions.has(path.extname(entry.name).toLowerCase()))
    .map((entry) => entry.name)
    .sort((first, second) => first.localeCompare(second, "es", { sensitivity: "base" }));
}

function generateDirectory() {
  const directory = Object.fromEntries(
    Object.entries(categories).map(([category, relativeDir]) => [
      category,
      listHtmlFiles(relativeDir)
    ])
  );
  const businessRibbonFiles = listBusinessRibbonFiles();

  fs.writeFileSync(directoryPath, `${JSON.stringify(directory, null, 2)}\n`);
  fs.writeFileSync(businessRibbonManifestPath, `${JSON.stringify(businessRibbonFiles, null, 2)}\n`);
  return { directory, businessRibbonFiles };
}

if (require.main === module) {
  const { directory, businessRibbonFiles } = generateDirectory();
  const total = Object.values(directory).reduce((sum, items) => sum + items.length, 0);
  console.log(`Directorio actualizado con ${total} paginas.`);
  console.log(`Cinta de negocios actualizada con ${businessRibbonFiles.length} imagenes.`);
}

module.exports = { generateDirectory };
