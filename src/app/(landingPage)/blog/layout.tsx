import BlogProvider from "./providers";

export const metadata = {
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "lisa | Blog",
    description: "Blog - Legal Intelligent Support Assistant (LISA)",
    url: "https://lisa.goweki.com/blog",
    siteName: "Legal Intelligent Support Assistant (LISA)",
    images: ["https://lisa.goweki.com/banner_onDark.png"],
    // locale: 'en_US',
    type: "website",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BlogProvider>
      <main className="flex flex-col flex-grow items-center px-4">
        <div className="max-w-screen-lg w-full mx-auto px-4 md:px-6">
          {children}
        </div>
      </main>
    </BlogProvider>
  );
}
