import { Inter } from "next/font/google";
import "@/css/globals.css";
import Providers from "@/app/providers";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
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
    index: true,
    follow: true,
  },
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
