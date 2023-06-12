import { z } from "zod";
import { pusherServer } from "~/server/pusher";
import { formatChannelName } from "~/utils/snippets/formatPusher";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const chatRouter = createTRPCRouter({
  // getChatList: protectedProcedure.query(
  //   async ({ ctx }) =>
  //     await ctx.prisma.follows.findMany({
  //       where: {
  //         OR: [
  //           { followerUsername: ctx.session.user.username },
  //           { followingUsername: ctx.session.user.username },
  //         ],
  //       },
  //     })
  // ),
  getChat: protectedProcedure
    .input(z.object({ otherUsername: z.string() }))
    .query(async ({ ctx, input }) => {
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
              receiverUsername: input.otherUsername,
            },
            {
              receiverUsername: username,
              senderUsername: input.otherUsername,
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
        message: input.msgContent,
        senderUsername: ctx.session.user.username,
        receiverUsername: input.msgReciever,
        sentAt: Date.now(),
        id: (Math.random() * 10000).toString(),
      });

      // trigger pusher for any message
      await pusherServer.trigger(
        `newUnseenMsg_${input.msgReciever}`,
        "unseenMsgEvent",
        {
          senderUsername: ctx.session.user.username,
        }
      );

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
