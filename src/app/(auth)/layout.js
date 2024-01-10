import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function AuthLayout({ children }) {
  const session = await getServerSession(authOptions);
  if (session) {
    // signedIn
    console.log(
      `...................\nACTIVE SESSION: \n > ${session.user}\n....`
    );
    return <>You are logged in</>;
    //redirect(`/`);
  } else return children;
}
