// Without a defined matcher, this line applies next-auth
// to the entire project
// export { default } from "next-auth/middleware";
// export const config = { matcher: ["/dashboard", "/api/dashboard"] };

import { NextRequest } from "next/server";
import authConfig from "@/lib/auth/auth.config";
import NextAuth from "next-auth";

// Use only one of the two proxy options below
// 1. Use proxy directly
// export const { auth: proxy } = NextAuth(authConfig)

// 2. Wrapped proxy option
const { auth } = NextAuth(authConfig);
export const proxy = auth(async function proxy(req: NextRequest) {
  // Your custom proxy logic goes here
});
