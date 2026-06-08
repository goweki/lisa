import { BASE_URL } from "@/lib/utils/getUrl";

export default async function sitemap() {
  // DYNAMIC PAGES - blogposts
  //   let blog = [];
  //   const blogData_ = await fetch(`${rootURL}/api/blog`);
  //   const blogData = await blogData_.json();
  //   if (blogData.success) {
  //     const blogData = await blogData.success.filter(
  //       (item) => item.type === "blogpost"
  //     );

  //     blog = blogData.map((blog) => ({
  //       url: `${rootURL}library/blog/${blog._id}`,
  //       lastModified: new Date(blog.date).toISOString(),
  //     }));
  //   }
  // pages;
  const routes = ["", "blog", "contacts"].map((route) => ({
    url: `${BASE_URL}/${route}`,
    lastModified: new Date().toISOString(),
  }));

  //   return [...routes, ...blog];
  return [...routes];
}
