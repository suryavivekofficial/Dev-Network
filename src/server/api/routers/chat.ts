import { z } from "zod";
import { pusherServer } from "~/server/pusher";
import { formatChannelName } from "~/utils/snippets/formatPusher";
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
        sentAt: "asc",
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
  newMsg: protectedProcedure
    .input(z.object({ msgContent: z.string(), msgReciever: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // trigger pusher
      const channelName = formatChannelName(
        ctx.session.user.username,
        input.msgReciever
      );
      await pusherServer.trigger(`newMsg_${channelName}`, "msgEvent", {
        content: input.msgContent,
        sender: ctx.session.user.username,
        receiver: input.msgReciever,
      });

      const newChat = await ctx.prisma.messages.create({
        data: {
          message: input.msgContent,
          receiverUsername: input.msgReciever,
          senderUsername: ctx.session.user.username,
        },
      });
      return newChat;
    }),
});
