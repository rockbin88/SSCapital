import { getAllPosts } from "../lib/research";

const siteUrl = "https://sscapital.pages.dev";

const staticPages = [
  "/",
  "/projects/",
  "/journey/",
  "/about/",
  "/resources/",
  "/disclaimer/",
  "/privacy/",
  "/option-trading-desk/",
  "/personal-banker/",
  "/trade-journal/",
  "/research/",
];

const today = new Date().toISOString().split("T")[0];

const escapeXml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

export function GET() {
  const researchPages = getAllPosts().map((post) => ({
    path: `/research/${post.slug}/`,
    lastmod: post.publishedAt,
  }));

  const urls = [
    ...staticPages.map((path) => ({ path, lastmod: today })),
    ...researchPages,
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    ({ path, lastmod }) => `  <url>
    <loc>${escapeXml(new URL(path, siteUrl).toString())}</loc>
    <lastmod>${escapeXml(lastmod)}</lastmod>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
