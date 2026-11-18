// JSON-LD страницы «Наши клиенты» строится из списка клиентов: новые магазины попадают в разметку сами.
const BASE = "https://vin-scan.ru";
const PAGE = `${BASE}/clients/`;

const toListItem = (c, i) => ({
  "@type": "ListItem",
  position: i + 1,
  item: {
    "@type": "Organization",
    name: c.name,
    ...(c.url && { url: c.url }),
    ...(c.logo && { logo: BASE + c.logo }),
    ...(c.city && { address: { "@type": "PostalAddress", addressLocality: c.city } })
  }
});

module.exports = {
  eleventyComputed: {
    jsonld: (data) => JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "CollectionPage",
          "@id": `${PAGE}#webpage`,
          url: PAGE,
          name: data.title,
          description: data.description,
          inLanguage: "ru",
          isPartOf: { "@id": `${BASE}/#website` },
          breadcrumb: { "@id": `${PAGE}#breadcrumb` },
          mainEntity: { "@id": `${PAGE}#list` }
        },
        {
          "@type": "BreadcrumbList",
          "@id": `${PAGE}#breadcrumb`,
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Главная", item: `${BASE}/` },
            { "@type": "ListItem", position: 2, name: "Наши клиенты", item: PAGE }
          ]
        },
        {
          "@type": "ItemList",
          "@id": `${PAGE}#list`,
          name: "Магазины и автосервисы, которые работают с Vin-Scan",
          numberOfItems: data.clients.length,
          itemListElement: data.clients.map(toListItem)
        }
      ]
    }, null, 2).replace(/</g, "\\u003c")
  }
};
