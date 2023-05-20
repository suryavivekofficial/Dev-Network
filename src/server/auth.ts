import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider, { type GoogleProfile } from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      username: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  interface User {
    // ...other properties
    // role: UserRole;
    username: string;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
        username: user.username,
      },
    }),
    //   async signIn({ user, account, profile }) {
    //     if (user.email && account?.provider === "google") {
    //       const userInDB = await prisma.user.findUnique({
    //         where: {
    //           email: user.email,
    //         },
    //       });
    //       if (!userInDB) {
    //         await prisma.user.create({
    //           data: {
    //             name: profile?.name,
    //             email: profile?.email,
    //             image: user.image,
    //             username: profile?.email?.split("@")[0],
    //             accounts: {
    //               create: [
    //                 {
    //                   type: 'oauth',
    //                   provider: 'google'
    //                 }
    //               ]
    //             }
    //           },
    //         });
    //       }
    //     }
    //     return true;
    //   },
  },

  adapter: PrismaAdapter(prisma),

  events: {
    async signIn({ isNewUser, user, profile }) {
      if (!isNewUser) return;

      console.log("updating username");
      const updatedUsername = await prisma.user.update({
        data: {
          username: user.email?.split("@")[0],
        },
        where: {
          email: profile?.email,
        },
      });
      console.log({ updatedUsername });
    },
  },

  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      // profile(profile: GoogleProfile): any {
      //   const username = profile.email.split("@")[0];
      //   console.log("from auth");
      //   console.log({ ...profile, username });

      //   return {
      //     ...profile,
      //     id: profile.sub,
      //     username,
      //   };
      // },
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
