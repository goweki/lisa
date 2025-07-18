import React from "react";

export const metadata = {
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "lisa | Contacts",
    description: "Contact - Legal Intelligent Support Assistant (LISA)",
    url: "https://lisa.goweki.com/contacts",
    siteName: "Legal Intelligent Support Assistant (LISA)",
    images: ["https://i.postimg.cc/nrV7ytdv/og-image.jpg"],
    // locale: 'en_US',
    type: "website",
  },
};

export default function ContactsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
