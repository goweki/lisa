import { BASE_URL } from "@/helpers/getUrl";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      disallow: "/dashboard",
    },
    sitemap: BASE_URL + "/sitemap.xml",
  };
}
