import { createTRPCRouter, protectedProcedure } from "../trpc";

export const chatRouter = createTRPCRouter({
  getChatList: protectedProcedure.query(
    async ({ ctx }) =>
      await ctx.prisma.follows.findMany({
        where: {
          OR: [
            { followerUsername: ctx.session.user.username },
            { followingUsername: ctx.session.user.username },
          ],
        },
      })
  ),
});
