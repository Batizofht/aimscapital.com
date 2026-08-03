type BreadcrumbItem = { name: string; url: string };

export default function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => {
      let url = item.url;
      if (url !== "/" && !url.endsWith("/")) url = `${url}/`;
      return {
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: `https://aimscapital.rw${url}`,
      };
    }),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}