import { useSession } from "next-auth/react";
import { useState } from "react";
import { api } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import Image from "next/image";
import PostComponent from "./Post";

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
