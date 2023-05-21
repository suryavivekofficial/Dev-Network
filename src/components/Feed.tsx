import { useSession } from "next-auth/react";
import { useState, type FC } from "react";
import { api } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import Image from "next/image";
import LikeIcon from "./icons/LikeIcon";
import Clock from "./icons/ClockIcon";

import type { Post, User } from "@prisma/client";

dayjs.extend(relativeTime);

const Feed = () => {
  const { data, isLoading, isError, error } = api.post.getAll.useQuery();
  if (isLoading) {
    return <div>loading...</div>;
  }

  if (isError) {
    return (
      <div>
        <h2 className="text-2xl">Error occured!☹️</h2>
        <p>This is due to {error.message} </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <NewPost />
      {data?.map((post) => {
        return <PostComponent post={post} key={post.id} />;
      })}
    </div>
  );
};

type TPostComponent = {
  post: Post & { likes: { userId: string }[]; author: User };
};

const PostComponent: FC<TPostComponent> = ({ post }) => {
  return (
    <div className="space-y-4 rounded-md border border-accent-6 bg-black p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative h-10 w-10 overflow-hidden rounded-full">
            {post.author.image && (
              <Image src={post?.author.image} fill={true} alt="Author photo" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-bold capitalize">{post.author.name}</span>
            <span className="text-sm">@{post.author.username}</span>
          </div>
        </div>
        <span className="flex items-center space-x-2 text-sm opacity-80">
          <Clock />
          <span className="font-thin">{dayjs(post.createdAt).fromNow()}</span>
        </span>
      </div>
      <p>{post.content}</p>
      <LikeIcon likes={post.likes} postId={post.id} />
    </div>
  );
};

const NewPost = () => {
  const { data: session } = useSession();
  const [newPost, setNewPost] = useState("");
  const ctx = api.useContext();

  const { mutate, isLoading } = api.post.createPost.useMutation({
    onSuccess: async () => {
      setNewPost("");
      await ctx.post.invalidate();
    },
  });

  if (!session) return null;

  const handleSubmit = () => {
    mutate({ authorUsername: session.user.username, postContent: newPost });
  };

  return (
    <div className="space-y-4 rounded-md border border-accent-6 bg-black p-4">
      <div className="flex items-center space-x-4 ">
        <div className="relative h-10 w-10 overflow-hidden rounded-full">
          {session.user.image && (
            <Image src={session.user.image} alt="profile photo" fill={true} />
          )}
        </div>
        <input
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
            }
          }}
          type="text"
          placeholder="What's on your mind?"
          className="grow rounded-md border border-accent-6 bg-black p-4 outline-none placeholder:text-accent-6 focus:ring-1 focus:ring-accent-8"
        />
      </div>
      <div className="flex">
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          type="submit"
          className="ml-auto rounded-md border border-white bg-accent-8 px-4 py-2 text-accent-2 outline-none duration-150 hover:bg-black hover:text-white focus-visible:ring-1"
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default Feed;
