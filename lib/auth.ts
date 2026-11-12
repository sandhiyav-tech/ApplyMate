import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "applymate-dev-secret-key-min-32-chars-long",
  session: {
    strategy: "jwt",
  },
  providers: [
    ...(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
          }),
        ]
      : []),
    // Built-in Demo Credentials Provider for seamless local testing & verification
    CredentialsProvider({
      id: "demo-login",
      name: "Demo Student Account",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "student@berkeley.edu" },
        name: { label: "Name", type: "text", placeholder: "Alex Morgan" },
      },
      async authorize(credentials) {
        if (!credentials?.email) {
          return {
            id: "student-demo-1",
            name: "Alex Morgan",
            email: "alex.morgan@university.edu",
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
          };
        }
        return {
          id: `student-${credentials.email.split("@")[0]}`,
          name: credentials.name || "Alex Morgan",
          email: credentials.email,
          image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        (session.user as any).id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: "/dashboard",
  },
};

