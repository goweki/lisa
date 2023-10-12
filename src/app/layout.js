import { Inter } from "next/font/google";
import "@/css/globals.css";
import Context from "@/app/context";
import Navbar from "@/components/navbar";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "lisa - Welcome",
  description: "Legal Intelligent Support Assistant",
};

export default function RootLayout({ auth, portal }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={inter.className}>
        <Context routes={{ auth, portal }} navbar={Navbar} />
      </body>
    </html>
  );
}
