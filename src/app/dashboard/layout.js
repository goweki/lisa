import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import Footer from "@/components/mols/footer";
import Navbar from "@/components/mols/navbar";
import Providers from "./providers";

export default async function UserLayout({ children }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/signin");
  else
    return (
      <Providers>
        <Navbar user={session.user} />
        {children}
        <Footer />
      </Providers>
    );
}
