import { useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { api } from "~/utils/api";
import { usePostStore } from "~/utils/zustand/posts";
import PostComponent from "./Post";
import LoadingSpinner from "./icons/LoadingSpinner";

const Feed = () => {
  const { selected } = usePostStore();

  const { data, isLoading, isError, error } =
    selected === "for you"
      ? api.post.getPosts.useQuery()
      : api.post.getFollowingPosts.useQuery();
  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-grow items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen">
        <h2 className="text-2xl">Error occured!☹️</h2>
        <p>This is due to {error.message} </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex-grow space-y-4">
      <NewPost />
      {data?.map((post) => {
        return (
          <div
            key={post.id}
            className="rounded-md border border-blue-2 dark:border-accent-6"
          >
            <PostComponent post={post} />
          </div>
        );
      })}
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
    <form className="space-y-4 rounded-md border border-blue-2 bg-white p-4 dark:border-accent-6 dark:bg-black">
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
          className="grow rounded-md border border-blue-2 bg-white p-4 outline-none placeholder:text-blue-2 placeholder:opacity-70 focus:ring-1 focus:ring-blue-2 dark:border-accent-6 dark:bg-black dark:text-accent-8 dark:placeholder:text-accent-6 dark:focus:ring-accent-8"
        />
      </div>
      <div className="flex">
        <button
          onClick={handleSubmit}
          disabled={isLoading || newPost.trim() === ""}
          type="submit"
          className="ml-auto flex items-center space-x-2 rounded-md border border-blue-2 px-4 py-2 font-bold text-blue-2 outline-none duration-150 focus-visible:ring-1 hover:enabled:bg-blue-1 disabled:cursor-not-allowed disabled:hover:brightness-75 dark:border-accent-8 dark:bg-accent-8 dark:text-accent-2 dark:hover:enabled:bg-black dark:hover:enabled:text-white"
        >
          {isLoading && <LoadingSpinner />}
          <span>Post</span>
        </button>
      </div>
    </form>
  );
};

export default Feed;
