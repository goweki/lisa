import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export default async function AuthLayout({ children }) {
  const session = await getServerSession(authOptions);
  if (session) {
    // user is signed in
    redirect(`/dashboard`);
  } else return children;
}
