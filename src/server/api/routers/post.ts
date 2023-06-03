import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const postRouter = createTRPCRouter({
  getPosts: publicProcedure
    .input(z.object({ username: z.string() }).optional())
    .query(
      async ({ ctx, input }) =>
        await ctx.prisma.post.findMany({
          where: {
            authorUsername: input?.username,
          },
          include: {
            author: {
              select: {
                name: true,
                username: true,
                image: true,
              },
            },
            likes: {
              where: {
                userId: ctx.session?.user.id,
              },
              select: {
                userId: true,
              },
            },
            _count: {
              select: {
                likes: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        })
    ),
  getFollowingPosts: protectedProcedure.query(async ({ ctx }) => {
    const following = await ctx.prisma.follows.findMany({
      where: {
        followerUsername: ctx.session.user.username,
      },
      select: {
        followingUsername: true,
      },
    });
    const followingUsernames = following.map((ele) => ele.followingUsername);
    const username = ctx.session.user.username;
    const posts = await ctx.prisma.post.findMany({
      where: {
        OR: [
          {
            authorUsername: {
              in: followingUsernames,
            },
          },
          {
            authorUsername: username,
          },
        ],
      },
      include: {
        author: {
          select: {
            name: true,
            username: true,
            image: true,
          },
        },
        likes: {
          where: {
            userId: ctx.session?.user.id,
          },
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return posts;
  }),
  createPost: protectedProcedure
    .input(z.object({ authorUsername: z.string(), postContent: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const newPost = await ctx.prisma.post.create({
        data: {
          content: input.postContent,
          authorUsername: input.authorUsername,
        },
      });
      return { newPost };
    }),
  updateLikes: protectedProcedure
    .input(z.object({ postId: z.string(), userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const isLiked = await ctx.prisma.like.findUnique({
        where: {
          postId_userId: {
            postId: input.postId,
            userId: input.userId,
          },
        },
      });
      if (isLiked) {
        //remove like
        await ctx.prisma.like.delete({
          where: {
            postId_userId: {
              postId: input.postId,
              userId: input.userId,
            },
          },
        });
      } else {
        // add like
        await ctx.prisma.like.create({
          data: {
            postId: input.postId,
            userId: input.userId,
          },
        });
      }
    }),
});
