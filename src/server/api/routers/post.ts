import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const postRouter = createTRPCRouter({
  getAll: publicProcedure.query(
    async ({ ctx }) =>
      await ctx.prisma.post.findMany({
        include: {
          author: true,
          likes: true,
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
  updateLikeCount: protectedProcedure
    .input(z.object({ postId: z.string(), userId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // await
    }),
});
