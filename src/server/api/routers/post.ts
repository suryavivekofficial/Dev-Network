import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

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
