import { useState } from "react";
import { api } from "~/utils/api";
import { type Like } from "@prisma/client";
import { useSession } from "next-auth/react";

const LikeIcon = ({ likes }: { likes: Like[] }) => {
  const { data: session } = useSession();

  let initialLikedState = false;
  if (session) {
    const singleLike = likes.find((like) => like.userId === session.user.id);
    if (singleLike) {
      initialLikedState = true;
    }
  }

  const [isLiked, setIsLiked] = useState(initialLikedState);

  // const formatLikes = (likes: number) => {
  //   const formatter = new Intl.NumberFormat("en-US", {
  //     notation: "compact",
  //   });

  //   return formatter.format(likes);
  // };
  // console.log({ likeCount });
  // const [likes, setLikes] = useState(formatLikes(likeCount));
  // const [isLiked, setIsLiked] = useState(false);

  const ctx = api.useContext();
  const { mutate } = api.post.updateLikeCount.useMutation({
    onMutate: async ({ postId, userId }) => {
      // cancel any outgoing queries
      await ctx.post.getAll.cancel();

      // get the data from query cache
      const prevPostsSnapshot = ctx.post.getAll.getData();

      // Modify the cache
      // ctx.post.getAll.setData(undefined, (oldPosts) =>
      //   oldPosts?.map((post) => {
      //     if (post.id === postId) {
      //       post.likes.push({ postId, userId });
      //       return {
      //         post,
      //       };
      //     }
      //   })
      // );

      console.log(prevPostsSnapshot);

      return { prevPostsSnapshot };
    },
    // onError(err, newLikeCount, ctx) {
    //   ctx.post.getAll.setData(undefined, ctx?.prevLikeCount)
    // },
    // async onSettled() {
    //   await utils.post.getAll.invalidate()
    // }
  });

  const updateLikeCount = () => {
    setIsLiked(!isLiked);
    if (!likes[0] || !session) return;
    mutate({ postId: likes[0]?.postId, userId: session?.user.id });
    // if (isLiked) {
    //   setLikes(formatLikes(likeCount - 1));
    //   mutate({ postId });
    // } else {
    //   setLikes(formatLikes(likeCount + 1));
    //   mutate({ postId });
    // }
  };

  return (
    <button
      onClick={updateLikeCount}
      className={`flex items-center space-x-2 rounded-md px-4 py-2 duration-300 hover:bg-accent-2 ${
        isLiked ? `text-blue-2` : ``
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        fill="none"
        stroke="currentColor"
        className={`h-5 w-5 cursor-pointer duration-300 ${
          isLiked ? `fill-blue-2 stroke-blue-3` : ``
        }`}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"
        />
      </svg>
      <span>Like</span>
      <span
        className={`h-full rounded-full bg-accent-4 px-2 text-sm ${
          isLiked ? "bg-blue-1" : ""
        }`}
      >
        {likes.length}
      </span>
    </button>
  );
};

export default LikeIcon;
