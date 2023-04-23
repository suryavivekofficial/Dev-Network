import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const postRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) =>
    ctx.prisma.post.findMany({
      include: {
        author: true,
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
});
