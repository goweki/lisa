import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (session) {
    // user is signed in
    redirect(`/dashboard`);
  } else
    return (
      <main className="flex flex-col flex-grow items-center justify-center md:min-h-[600px]">
        {children}
      </main>
    );
}
