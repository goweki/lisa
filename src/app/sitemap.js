const rootURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://lisa.goweki.com";
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
    url: `${rootURL}/${route}`,
    lastModified: new Date().toISOString(),
  }));

  //   return [...routes, ...blog];
  return [...routes];
}
