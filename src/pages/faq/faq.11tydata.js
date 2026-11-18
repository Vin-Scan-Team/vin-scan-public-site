// JSON-LD страницы FAQ строится из тех же данных, что и видимые вопросы.
const BASE = "https://vin-scan.ru";
const PAGE = `${BASE}/faq/`;

const plain = (html) => html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();

module.exports = {
  eleventyComputed: {
    jsonld: (data) => JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "@id": `${PAGE}#webpage`,
          url: PAGE,
          name: data.title,
          description: data.description,
          inLanguage: "ru",
          isPartOf: { "@id": `${BASE}/#website` },
          breadcrumb: { "@id": `${PAGE}#breadcrumb` }
        },
        {
          "@type": "BreadcrumbList",
          "@id": `${PAGE}#breadcrumb`,
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Главная", item: `${BASE}/` },
            { "@type": "ListItem", position: 2, name: "Вопросы и ответы", item: PAGE }
          ]
        },
        {
          "@type": "FAQPage",
          "@id": `${PAGE}#faq`,
          mainEntity: data.faq.flatMap((group) => group.items).map((item) => ({
            "@type": "Question",
            name: item.q,
            acceptedAnswer: { "@type": "Answer", text: plain(item.a) }
          }))
        }
      ]
    }, null, 2).replace(/</g, "\\u003c")
  }
};
