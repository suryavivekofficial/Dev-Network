import { Post } from "@prisma/client";
import type { User } from "@prisma/client";
import { api } from "~/utils/api";
import Image from "next/image";
import Clock from "./icons/Clock";
import { useSession } from "next-auth/react";
import type { Session } from "next-auth";
import { useState } from "react";

const Feed = () => {
  const { data: session } = useSession();
  const { data, isLoading } = api.post.getAll.useQuery();

  if (isLoading) {
    return <div>loading...</div>;
  }

  return (
    <div className="space-y-4 py-8">
      {session && (
        <div>
          <NewPost session={session} />
        </div>
      )}
      {data?.map((post) => {
        return <Post post={post} key={post.id} />;
      })}
    </div>
  );
};

const Post = ({
  post,
}: {
  post: Post & {
    author: User;
  };
}) => {
  return (
    <div className="space-y-4 rounded-md border border-neutral-800 bg-neutral-900 p-6">
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
          <span>2 minutes ago</span>
        </span>
      </div>
      <p>{post.content}</p>
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
    <div className="space-y-4 rounded-md border border-neutral-800 bg-neutral-900 p-4">
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
              // console.log(e.key, "is pressed");
              handleSubmit();
            }
          }}
          type="text"
          placeholder="What's on your mind?"
          className="grow rounded-md bg-neutral-800 p-4 outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div className="flex">
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          type="submit"
          className="ml-auto rounded-md border border-neutral-700/50 bg-neutral-900/50 px-4 py-2 outline-none duration-150 hover:bg-neutral-800 focus-visible:bg-neutral-800 focus-visible:ring-1 focus-visible:ring-blue-500"
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default Feed;
