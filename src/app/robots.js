export default function robots() {
  return {
    rules: {
      userAgent: "*",
      disallow: "/user",
    },
    sitemap:
      process.env.NODE_ENV === "development"
        ? `https://lisa.goweki.com/sitemap.xml`
        : NEXTAUTH_URL + "/sitemap.xml",
  };
}
