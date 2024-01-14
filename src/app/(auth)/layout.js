import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function AuthLayout({ children }) {
  const session = await getServerSession(authOptions);
  if (session) {
    // user is signed in
    redirect(`/user`);
  } else return children;
}
