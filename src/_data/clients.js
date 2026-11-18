// Собирает список клиентов из clients-source.json и находит логотипы в src/assets/img/clients/.
// Логотип ищется по имени <slug>.png|webp|svg|jpg|jpeg. Если файла нет, карточка показывает название текстом.
const fs = require("fs");
const path = require("path");

const SOURCE = path.join(__dirname, "clients-source.json");
const LOGO_DIR = path.join(__dirname, "..", "assets", "img", "clients");
const EXTENSIONS = ["png", "webp", "svg", "jpg", "jpeg"];

function normalizeUrl(raw) {
  const value = String(raw || "").trim();
  if (!value) return { url: "", host: "" };
  try {
    const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
    return { url: url.href, host: url.hostname.replace(/^www\./, "") };
  } catch {
    console.warn(`[clients] Некорректная ссылка: ${value}`);
    return { url: "", host: "" };
  }
}

function findLogo(slug) {
  for (const ext of EXTENSIONS) {
    if (fs.existsSync(path.join(LOGO_DIR, `${slug}.${ext}`))) {
      return `/img/clients/${slug}.${ext}`;
    }
  }
  console.warn(`[clients] Нет логотипа для "${slug}": положите src/assets/img/clients/${slug}.png`);
  return null;
}

module.exports = () => {
  const items = JSON.parse(fs.readFileSync(SOURCE, "utf8"));
  return items.map((item) => ({
    slug: item.slug,
    name: item.name,
    city: (item.city || "").trim(),
    review: (item.review || "").trim(),
    logo: findLogo(item.slug),
    ...normalizeUrl(item.url)
  }));
};
