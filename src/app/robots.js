export default function robots() {
  return {
    rules: {
      userAgent: "*",
      disallow: "/user",
    },
    sitemap: "https://lisa.goweki.com/sitemap.xml",
  };
}
