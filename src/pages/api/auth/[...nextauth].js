import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import DiscordProvider from "next-auth/providers/discord";
import EmailProvider from "next-auth/providers/email";
import { PrismaClient } from ".prisma/client";
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
    // EmailProvider({
    //   server: {
    //     host: process.env.EMAIL_SERVER_HOST,
    //     port: process.env.EMAIL_SERVER_PORT,
    //     auth: {
    //       user: process.env.EMAIL_SERVER_USER,
    //       pass: process.env.EMAIL_SERVER_PASSWORD,
    //     },
    //   },
    //   from: process.env.EMAIL_FROM,
    // }),
  ],
  theme: {
    colorScheme: "dark", // "auto" | "dark" | "light"
    brandColor: "red", // Hex color code
    logo: `${publicRuntimeConfig.baseUrl}/logo.svg`, // Absolute URL to image
    buttonText: "#c94b4b", // Hex color code
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
};

export default NextAuth(authOptions);
