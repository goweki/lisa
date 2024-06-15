import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export default async function InstitutionsLayout({ children }) {
  const session = await getServerSession(authOptions);
  if (session.user?.role === "admin") {
    // user is signed in
    return children;
  } else redirect(`/dashboard`);
}
