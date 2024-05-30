export default function robots() {
  return {
    rules: {
      userAgent: "*",
      disallow: "/dashboard",
    },
    sitemap:
      process.env.NODE_ENV === "development"
        ? `https://lisa.goweki.com/sitemap.xml`
        : process.env.NEXTAUTH_URL + "/sitemap.xml",
  };
}
