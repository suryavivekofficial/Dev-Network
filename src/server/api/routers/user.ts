import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getUser: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          username: input.username,
        },
        include: {
          followedBy: {
            select: {
              followerUsername: true,
            },
          },
        },
      });

      if (!ctx.session) {
        return {
          user,
          isFollow: false,
        };
      }

      if (ctx.session.user.username === input.username) {
        return {
          user,
          isFollow: "own",
        };
      }

      let isFollow = false;

      if (
        user?.followedBy.includes({
          followerUsername: ctx.session?.user?.username,
        })
      ) {
        isFollow = true;
      }

      return {
        user,
        isFollow,
      };
    }),
  updateFollow: protectedProcedure
    .input(z.object({ username: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const follower = ctx.session.user.username;
      const following = input.username;

      const isFollow = await ctx.prisma.follows.findUnique({
        where: {
          followerUsername_followingUsername: {
            followerUsername: follower,
            followingUsername: following,
          },
        },
      });
      if (isFollow) {
        await ctx.prisma.follows.delete({
          where: {
            followerUsername_followingUsername: {
              followerUsername: follower,
              followingUsername: following,
            },
          },
        });
      } else {
        await ctx.prisma.follows.create({
          data: {
            followerUsername: follower,
            followingUsername: following,
          },
        });
      }
    }),
});
