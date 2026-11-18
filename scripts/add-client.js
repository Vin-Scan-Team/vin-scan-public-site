// Добавляет или обновляет клиента (запись в clients-source.json и логотип в img/clients/).
// npm run add-client -- --name "ДАВ авто" --url https://davavto29.ru --review "Текст" --logo ./davavto29.png [--city "Город"] [--slug davavto29]
// --logo: путь к файлу или ссылка http(s). Повторный запуск с тем же slug обновляет запись.
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SOURCE = path.join(ROOT, "src", "_data", "clients-source.json");
const LOGO_DIR = path.join(ROOT, "src", "assets", "img", "clients");
const EXT = ["png", "webp", "svg", "jpg", "jpeg"];

const fail = (msg) => { console.error(`Ошибка: ${msg}`); process.exit(1); };

const args = {};
const argv = process.argv.slice(2);
for (let i = 0; i < argv.length; i++) {
  if (argv[i].startsWith("--")) args[argv[i].slice(2)] = argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[++i] : "";
}
if (!args.name) fail("укажите --name");

let url = "";
if (args.url) {
  try { url = new URL(/^https?:\/\//i.test(args.url) ? args.url : `https://${args.url}`).href; }
  catch { fail(`некорректная ссылка: ${args.url}`); }
}

const host = url ? new URL(url).hostname.replace(/^www\./, "") : "";
const slug = (args.slug || host.split(".").slice(0, -1).join("-")).toLowerCase();
if (!/^[a-z0-9-]+$/.test(slug)) fail("укажите --slug латиницей (a-z, 0-9, дефис)");

const items = JSON.parse(fs.readFileSync(SOURCE, "utf8"));
const i = items.findIndex((x) => x.slug === slug);
const old = i >= 0 ? items[i] : {};
const pick = (key, value) => (args[key] !== undefined ? value : old[key] || "");
const entry = { slug, name: args.name, url: pick("url", url), city: pick("city", args.city), review: pick("review", args.review) };
if (i >= 0) items[i] = entry; else items.push(entry);
fs.writeFileSync(SOURCE, `[\n${items.map((x) => `  ${JSON.stringify(x)}`).join(",\n")}\n]\n`);

async function saveLogo(src) {
  const remote = /^https?:\/\//i.test(src);
  if (!remote && !fs.existsSync(src)) fail(`файл логотипа не найден: ${src}`);
  let ext = path.extname(remote ? new URL(src).pathname : src).slice(1).toLowerCase();
  if (!EXT.includes(ext)) fail("логотип должен быть png, webp, svg или jpg");
  let data;
  if (remote) {
    const res = await fetch(src);
    if (!res.ok) fail(`не удалось скачать логотип (${res.status})`);
    data = Buffer.from(await res.arrayBuffer());
  } else {
    data = fs.readFileSync(src);
  }
  fs.mkdirSync(LOGO_DIR, { recursive: true });
  EXT.forEach((e) => fs.rmSync(path.join(LOGO_DIR, `${slug}.${e}`), { force: true }));
  fs.writeFileSync(path.join(LOGO_DIR, `${slug}.${ext}`), data);
  return `${slug}.${ext}`;
}

(async () => {
  const logo = args.logo ? await saveLogo(args.logo) : null;
  console.log(`${i >= 0 ? "Обновлён" : "Добавлен"}: ${entry.name} (${slug})${logo ? `, логотип ${logo}` : ""}`);
  if (!logo && !EXT.some((e) => fs.existsSync(path.join(LOGO_DIR, `${slug}.${e}`)))) {
    console.log(`Логотипа нет: на сайте будет название текстом. Положите src/assets/img/clients/${slug}.png`);
  }
})();
