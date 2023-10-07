import { Inter } from "next/font/google";
import "@/css/globals.css";
import Context from "@/components/context";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "lisa",
  description: "Legal Intelligent Support Assistant",
};

export default function RootLayout({ auth, home }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Context routes={{ auth, home }}></Context>
      </body>
    </html>
  );
}
