import { compare } from "bcrypt-ts";
import NextAuth, { User, Session } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { getUser } from "@/db/queries";

import { authConfig } from "./auth.config";

interface ExtendedSession extends Session {
  user: User;
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  trustHost: true,
  providers: [
    Credentials({
      credentials: {},
      async authorize(credentials) {
        const credentialsObj = credentials as { email?: string; password?: string };
        const email = credentialsObj.email;
        const password = credentialsObj.password;
        
        if (!email || !password) return null;
        
        const users = await getUser(email);
        if (users.length === 0) return null;
        const passwordsMatch = await compare(password, users[0].password!);
        if (passwordsMatch) return users[0] as User;
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    },
    async session({
      session,
      token,
    }: {
      session: ExtendedSession;
      token: Record<string, unknown>;
    }) {
      if (session.user) {
        session.user.id = token.id as string;
      }

      return session;
    },
    async redirect({ url, baseUrl }) {
      if (!url || url === 'undefined') {
        return baseUrl;
      }
      
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      
      if (url.startsWith(baseUrl)) {
        return url;
      }
      
      return baseUrl;
    }
  },
});
