import { z } from "zod";
import { pusherServer } from "~/server/pusher";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getAllUsers: protectedProcedure.query(
    async ({ ctx }) =>
      await ctx.prisma.user.findMany({
        where: {
          NOT: {
            username: ctx.session.user.username,
          },
        },
      })
  ),
  getUser: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          username: input.username,
        },
        include: {
          followedBy: {
            where: {
              followerUsername: ctx.session?.user.username,
            },
            select: {
              followerUsername: true,
            },
          },
          _count: {
            select: {
              followedBy: true,
              following: true,
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

      if (user?.followedBy[0]?.followerUsername === ctx.session.user.username) {
        isFollow = true;
      }

      return {
        user,
        isFollow,
      };
    }),
  getFollowAndFollowingCount: protectedProcedure
    // .input(z.object({username: z.string()}))
    .query(
      async ({ ctx }) =>
        await ctx.prisma.user.findUnique({
          where: {
            username: ctx.session.user.username,
          },
          select: {
            _count: {
              select: {
                followedBy: true,
                following: true,
              },
            },
          },
        })
    ),
  updateUserInfo: protectedProcedure
    .input(
      z.object({ name: z.string(), username: z.string(), bio: z.string() })
    )
    .mutation(async ({ ctx, input }) => {
      const updatedUser = await ctx.prisma.user.update({
        data: {
          bio: input.bio,
          name: input.name,
          username: input.username,
        },
        where: {
          id: ctx.session.user.id,
        },
      });
      return {
        updatedUser,
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
        // trigger a pusher notification
        await pusherServer.trigger(
          `notifications_channel_${following}`,
          "followEvent",
          {
            message: `${follower} started following you.`,
            date: Date(),
          }
        );

        await ctx.prisma.follows.create({
          data: {
            followerUsername: follower,
            followingUsername: following,
          },
        });
      }
    }),
});
