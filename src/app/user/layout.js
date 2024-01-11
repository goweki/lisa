import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Footer from "@/components/mols/footer";
import Navbar from "@/components/mols/navbar";

export default async function UserLayout({ children }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/signin");
  else
    return (
      <>
        <Navbar user={session.user} />
        {children}
        <Footer />
      </>
    );
}
