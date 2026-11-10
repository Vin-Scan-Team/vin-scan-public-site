# Vin-Scan

Публичный сайт сервиса: https://vin-scan.ru

Исходники сайта находятся в `src/`, сборка Eleventy формирует `_site/`, содержимое которой выгружается в корень бакета. Все публичные URL остаются абсолютными (`/css/...`, `/img/...`).

## Структура репозитория

```text
src/
  pages/                  страницы Nunjucks и Markdown-посты `blog/<slug>/index.md`
  _includes/
    layouts/               базовый, юридический и блоговый layouts
    partials/              общие head, header, footer и cookie
  _data/                   общие данные сайта и навигации
  assets/                  css/, js/, img/, sitemap.xml, robots.txt и PWA-файлы
_site/                     генерируется Eleventy, не коммитится
.github/workflows/         проверка, сборка и деплой
```

## Страницы и блог

Страницы сайта лежат в `src/pages/`; Eleventy сохраняет URL и генерирует их в `_site/`. Шапка, подвал и cookie-плашка подключаются через общие шаблоны в `src/_includes/partials/`. Юридические документы используют отдельный layout без шапки и подвала.

Блог доступен по `/blog/`. Для публикации создайте `src/pages/blog/<slug>/index.md` с полями `title`, `date`, `description` и `layout: layouts/post.njk`. Список сортируется от новых записей к старым; фиктивных записей в репозитории нет. Релизные заметки необходимо отредактировать для клиентов перед публикацией, исходные технические notes автоматически не публикуются.

## Сборка и проверка

```sh
npm ci
npm run build
npm run validate
npm run serve
```

`npm run serve` запускает локальный Eleventy-сервер. CI собирает сайт один раз, валидирует `_site/` и передаёт тот же artifact в deploy job. Pull request не деплоится; production deploy выполняется только для `main`.

Палитра, архитектура CSS и брейкпоинты описаны в [.rules.md](.rules.md). Изменения стилей должны соответствовать этим правилам.
