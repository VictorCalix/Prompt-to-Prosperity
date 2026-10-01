const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const directoryPath = path.join(rootDir, "pages", "directory.json");

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

function generateDirectory() {
  const directory = Object.fromEntries(
    Object.entries(categories).map(([category, relativeDir]) => [
      category,
      listHtmlFiles(relativeDir)
    ])
  );

  fs.writeFileSync(directoryPath, `${JSON.stringify(directory, null, 2)}\n`);
  return directory;
}

if (require.main === module) {
  const directory = generateDirectory();
  const total = Object.values(directory).reduce((sum, items) => sum + items.length, 0);
  console.log(`Directorio actualizado con ${total} paginas.`);
}

module.exports = { generateDirectory };
