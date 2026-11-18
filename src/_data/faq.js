// Разделы FAQ лежат в src/_data/faq-groups/*.json, порядок задаёт префикс в имени файла.
const fs = require("fs");
const path = require("path");

const DIR = path.join(__dirname, "faq-groups");

module.exports = fs.readdirSync(DIR)
  .filter((file) => file.endsWith(".json"))
  .sort()
  .map((file) => JSON.parse(fs.readFileSync(path.join(DIR, file), "utf8")));
