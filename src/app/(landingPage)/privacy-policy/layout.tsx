import { PageLayout } from "../_components/layouts";

export const metadata = {
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "lisa | Privacy policy",
    description: "Privacy policy - Legal Intelligent Support Assistant (LISA)",
    url: "https://lisa.goweki.com/privacy-policy",
    siteName: "Legal Intelligent Support Assistant (LISA)",
    images: ["https://lisa.goweki.com/banner_onDark.png"],
    // locale: 'en_US',
    type: "website",
  },
};

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PageLayout title='Privacy Policy'>{children}</PageLayout>
}
