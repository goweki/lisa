export const metadata = {
  title: "Blog",
  description: "Blog - Legal Intelligent Support Assistant (LISA)",
  robots: {
    index: true,
    follow: true,
  },
  // change with url of your image (recommended dimension = 1.91:1)
  // used in twitter, facebook, etc. card when link copied in tweet/status
  openGraph: {
    title: "lisa | Blog",
    description: "Blog - Legal Intelligent Support Assistant (LISA)",
    url: "https://lisa.goweki.com/contacts",
    siteName: "Legal Intelligent Support Assistant (LISA)",
    images: ["https://i.postimg.cc/nrV7ytdv/og-image.jpg"],
    // locale: 'en_US',
    type: "website",
  },
};

export default function BlogLayout({ children }) {
  return children;
}
