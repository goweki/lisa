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
    images: ["https://i.postimg.cc/nrV7ytdv/og-image.jpg"],
    // locale: 'en_US',
    type: "website",
  },
};

export default function BlogLayout({ children }) {
  return children;
}
