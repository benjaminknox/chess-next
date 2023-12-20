import qs from "qs";
import NextAuth from "next-auth";
import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from "next-auth/providers/credentials";

const refreshToken = (refresh_token: string) =>
  fetch(`${process.env.OAUTH_CLIENT_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    },
    body: qs.stringify({
      client_id: process.env.KEYCLOAK_CLIENT_ID,
      grant_type: "refresh_token",
      client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
      refresh_token,
    }),
  });

export const authOptions : NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login",
    signOut: "/logout",
  },
  providers: [
    CredentialsProvider({
      name: "Chess",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(formData) {
        const response = await fetch(`${process.env.OAUTH_CLIENT_URL}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
          body: qs.stringify({
            client_id: process.env.KEYCLOAK_CLIENT_ID,
            grant_type: "password",
            client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
            scope: "openid",
            username: formData?.username,
            password: formData?.password,
          }),
        });

        if (!response.ok) return null;

        const token = await response.json();

        const user = await (
          await fetch(`${process.env.OAUTH_VALIDATION_URL}`, {
            method: "POST",
            headers: {
              authorization: `Bearer ${token.access_token}`,
            },
          })
        ).json();

        return { token, ...user };
      },
    }),
  ],
  callbacks: {
    redirect: async ({ baseUrl }: { baseUrl: string }) => baseUrl,
    session: async ({session, token}) => {
      if(token?.id) {
        session.user.id = token.id
      }

      return session;
    },
    jwt: async ({ token, user }) => {
      if(user?.sub) {
        token.id = user.sub
      }

        return token;
    },
  },
};

export default NextAuth(authOptions);
