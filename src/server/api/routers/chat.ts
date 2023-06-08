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
  getChat: protectedProcedure.query(async ({ ctx }) => {
    const username = ctx.session.user.username;

    //trigger pusher for msgs.

    const chat = await ctx.prisma.messages.findMany({
      orderBy: {
        sentAt: "desc",
      },
      where: {
        OR: [
          {
            senderUsername: username,
          },
          {
            receiverUsername: username,
          },
        ],
      },
    });

    return chat;
  }),
});
