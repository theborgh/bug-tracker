import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import DiscordProvider from "next-auth/providers/discord";
import EmailProvider from "next-auth/providers/email";
import { PrismaClient } from ".prisma/client";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();
const prisma = new PrismaClient();

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  ],
  theme: {
    colorScheme: "dark",
    logo: `${publicRuntimeConfig.baseUrl}/logo.svg`,
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log(`user ${user.email} has signed in`);
      return true;
    },

    async session({ session, user }) {
      session.user.id = "testingStuff";
      const res = await prisma.user.findUnique({
        where: { email: session.user.email },
      });
      session.user.id = res.id;

      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
};

export default NextAuth(authOptions);
