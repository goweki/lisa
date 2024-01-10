export const metadata = {
  title: "contacts",
  description: "Contact - Legal Intelligent Support Assistant (LISA)",
  keywords: [
    "contacts",
    "legal",
    "intelligent",
    "tech",
    "assistant",
    "support",
    "lawyer",
    "research",
  ],

  // change with url of your image (recommended dimension = 1.91:1)
  // used in twitter, facebook, etc. card when link copied in tweet/status
  openGraph: {
    title: "Contact - lisa",
    description: "Legal Intelligent Support Assistant (LISA)",
    url: "https://lisa.goweki.com/contacts",
    siteName: "Legal Intelligent Support Assistant (LISA)",
    images: ["https://i.postimg.cc/nrV7ytdv/og-image.jpg"],
    // locale: 'en_US',
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return children;
}
