import type { Post, User } from "@prisma/client";
import type { Session } from "next-auth";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Clock from "./icons/Clock";
import Like from "./icons/Like";
import { api } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const Feed = () => {
  const { data: session } = useSession();
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
    <div className="h-screen space-y-4 py-8">
      {session && (
        <div>
          <NewPost session={session} />
        </div>
      )}
      {[...data, ...data, ...data]?.map((post) => {
        return <PostComponent post={post} key={post.id} />;
      })}
    </div>
  );
};

const PostComponent = ({
  post,
}: {
  post: Post & {
    author: User;
  };
}) => {
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
      <Like />
    </div>
  );
};

const NewPost = ({ session }: { session: Session }) => {
  const [newPost, setNewPost] = useState("");
  const ctx = api.useContext();

  const { mutate, isLoading } = api.post.createPost.useMutation({
    onSuccess: async () => {
      setNewPost("");
      await ctx.post.invalidate();
    },
  });

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
