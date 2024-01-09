import CredentialsProvider from "next-auth/providers/credentials";
// import db from "@/lib/mongodb";

// export const providers = [
//   CredentialsProvider({
//     // The name to display on the sign in form (e.g. 'Sign in with...')
//     name: "Credentials",
//     // The credentials is used to generate a suitable form on the sign in page.
//     // You can specify whatever fields you are expecting to be submitted.
//     // e.g. domain, username, password, 2FA token, etc.
//     // You can pass any HTML attribute to the <input> tag through the object.
//     credentials: {
//       email: { label: "Email", type: "text", placeholder: "example@email.com" },
//       password: { label: "Password", type: "password" },
//     },
//     async authorize(credentials, req) {
//       console.log("====THIS MESSAGE IS NOT SHOWN ON CONSOLE====");
//       if (!credentials) return null;
//       /* AUTH LOGIC
//        * logic that takes the credentials
//        * submitted and returns either a object representing a user or value
//        * that is false/null if the credentials are invalid.
//        * e.g. return { id: 1, name: 'Defi Motors', email: 'contact@defioffroads.com' }
//        * You can also use the `req` object to obtain additional parameters
//        * (i.e., the request IP address)
//        * check if user exists in db
//        */

//       const collection = db.collection("users"); //reference to collection
//       // Query Obj
//       const findQuery = {
//         email: credentials.email,
//         password: credentials.password,
//       };
//       // user variable
//       let user = null;
//       //run query on db
//       {
//         user = await collection.findOne(findQuery);
//         if (!user) {
//           return null;
//         } else {
//           console.log(`Found user:\n${JSON.stringify(user)}\n`);
//           return user;
//         }
//       }
//     },
//   }),
// ];

// export const pages = {
//   signIn: "/signin",
//   signOut: "/signout",
//   error: "/error", // Error code passed in query string as ?error=
//   verifyRequest: "/verify-request", // (used for check email message)
//   newUser: "/new-user", // New users will be directed here on first sign in (leave the property out if not of interest)
// };
