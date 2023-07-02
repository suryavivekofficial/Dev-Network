import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const searchRouter = createTRPCRouter({
  searchUser: publicProcedure
    .input(z.object({ searchTerm: z.string() }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.prisma.user.findMany({
        where: {
          NOT: {
            username: ctx.session?.user.username,
          },
          username: {
            startsWith: input.searchTerm,
          },
        },
        select: {
          username: true,
          name: true,
          image: true,
        },
      });
      return result;
    }),
});
