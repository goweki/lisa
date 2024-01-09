import { Inter } from "next/font/google";
import "@/css/globals.css";
import Providers from "@/app/providers";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: {
    template: "lisa | %s",
    default: "lisa - Legal Assistant", // a default is required when creating a template
  },
  description: "Legal Intelligent Support Assistant (LISA)",
  keywords: [
    "legal",
    "intelligent",
    "tech",
    "assistant",
    "support",
    "lawyer",
    "research",
  ],
  robots: {
    // index: false,
    index: false,
    follow: false,
    nocache: true,
    // googleBot: {
    //   index: true,
    //   follow: true,
    //   noimageindex: true,
    //   'max-video-preview': -1,
    //   'max-image-preview': 'large',
    //   'max-snippet': -1,
    // },
  },
  // change with url of your image (recommended dimension = 1.91:1)
  // used in twitter, facebook, etc. card when link copied in tweet/status
  images: ["https://i.postimg.cc/nrV7ytdv/og-image.jpg"],
  openGraph: {
    title: "lisa - Legal Assistant",
    description: "Legal Intelligent Support Assistant (LISA)",
    url: "https://lisa.goweki.com",
    siteName: "Legal Intelligent Support Assistant (LISA)",
    images: ["https://i.postimg.cc/nrV7ytdv/og-image.jpg"],
    // locale: 'en_US',
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
