import { createTRPCRouter } from "~/server/api/trpc";
import { chatRouter } from "./routers/chat";
import { postRouter } from "./routers/post";
import { searchRouter } from "./routers/search";
import { userRouter } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  user: userRouter,
  chat: chatRouter,
  search: searchRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
