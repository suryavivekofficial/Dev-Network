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
    <div className="flex-grow space-y-4">
      <NewPost />
      {data?.map((post) => {
        return (
          <div key={post.id} className="rounded-md border border-accent-6">
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
          disabled={isLoading || newPost.trim() === ""}
          type="submit"
          className="ml-auto flex items-center space-x-2 rounded-md border border-accent-8 bg-accent-8 px-4 py-2 font-bold text-accent-2 outline-none duration-150 focus-visible:ring-1 hover:enabled:bg-black hover:enabled:text-white disabled:cursor-not-allowed disabled:hover:brightness-75"
        >
          {isLoading && <LoadingSpinner />}
          <span>Post</span>
        </button>
      </div>
    </div>
  );
};

export default Feed;
