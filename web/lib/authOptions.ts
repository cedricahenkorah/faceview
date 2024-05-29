import axios from "axios";
import { NextAuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

interface userSession extends Session {
  token: string;
}

const uri = process.env.NEXT_PUBLIC_SERVER_URL;

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials, req): Promise<any | {}> {
        if (!credentials) {
          throw new Error("Please provide all required login credentials");
        }

        const { username, password } = credentials;

        const response = await axios.post(`${uri}/auth`, {
          username,
          password,
        });

        const user = {
          id: response.data.user.id,
          username: response.data.user.username,
          email: response.data.user.email,
          accessToken: response.data.user.accessToken,
        };

        return user;
      },
    }),
  ],

  pages: {
    signIn: "/auth/sign-in",
  },

  session: {
    strategy: "jwt",
    maxAge: 6 * 60 * 60,
  },

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }

      return token;
    },

    async session({ token, session }) {
      if (token) {
        session.user = token.user as Session["user"];
      }

      return session;
    },
  },
};
