// Generate sitemap.xml for Adventure Atlas
// Run: node scripts/generate-sitemap.js

const fs = require("fs");
const path = require("path");

const BASE = "https://adventureatlas.dev";

// Determine the destinations array from the data file
const destContent = fs.readFileSync(
  path.join(__dirname, "../src/data/destinations.js"),
  "utf-8"
);

// Extract all destination IDs from the data
const idMatches = destContent.matchAll(/\bid:\s*(\d+)/g);
const destinationIds = [...new Set([...idMatches].map((m) => parseInt(m[1])))];

const staticPages = [
  { url: "", priority: 1.0, changefreq: "weekly" },
  { url: "/bookmarks", priority: 0.3, changefreq: "monthly" },
  { url: "/itinerary", priority: 0.3, changefreq: "monthly" },
  { url: "/cost-index", priority: 0.4, changefreq: "weekly" },
  { url: "/budget-calculator", priority: 0.4, changefreq: "monthly" },
  { url: "/currency-converter", priority: 0.3, changefreq: "monthly" },
];

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

for (const page of staticPages) {
  xml += `  <url>
    <loc>${BASE}${page.url}</loc>
    <priority>${page.priority}</priority>
    <changefreq>${page.changefreq}</changefreq>
  </url>
`;
}

if (destinationIds.length > 0) {
  const idsToUse = destinationIds.slice(0, 150);
  for (const id of idsToUse) {
    xml += `  <url>
    <loc>${BASE}/destination/${id}</loc>
    <priority>0.6</priority>
    <changefreq>monthly</changefreq>
  </url>
`;
  }
}

xml += `</urlset>`;

const outPath = path.join(__dirname, "../public/sitemap.xml");
fs.writeFileSync(outPath, xml);
console.log(`✅ Sitemap written to ${outPath}`);
console.log(`   ${staticPages.length} static + ${destinationIds.length} destination URLs`);

// Generate robots.txt
const robots = `User-agent: *
Allow: /
Sitemap: ${BASE}/sitemap.xml
`;
fs.writeFileSync(path.join(__dirname, "../public/robots.txt"), robots);
console.log("✅ robots.txt written to public/robots.txt");
