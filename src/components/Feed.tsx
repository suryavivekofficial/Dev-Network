import { useSession } from "next-auth/react";
import Image from "next/image";
import {
  useState,
  type Dispatch,
  type FC,
  type FormEvent,
  type SetStateAction,
} from "react";
import { api } from "~/utils/api";
import { usePostStore } from "~/utils/zustand/posts";
import PostComponent from "./Post";
import LoadingSpinner from "./icons/LoadingSpinner";
import { toast } from "react-toastify";

const Feed = () => {
  const { data: session } = useSession();
  const { selected } = usePostStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  if (isModalOpen && session) {
    return <MobileNewPost setIsModalOpen={setIsModalOpen} />;
  }

  return (
    <div className="min-h-screen flex-grow space-y-4 px-4 md:px-0">
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
      {session && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-28 right-8 h-14 w-14 rounded-full bg-blue-2 text-4xl font-medium text-white shadow-md dark:text-black md:hidden"
        >
          +
        </button>
      )}
    </div>
  );
};

type MobileNewPostProps = {
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
};

const MobileNewPost: FC<MobileNewPostProps> = ({ setIsModalOpen }) => {
  const { data: session } = useSession();
  const [newPost, setNewPost] = useState("");
  const ctx = api.useContext();

  const closeModal = () => setIsModalOpen(false);

  const { mutate, isLoading } = api.post.createPost.useMutation({
    onSuccess: async () => {
      setNewPost("");
      await ctx.post.invalidate();
    },
  });

  if (!session) return null;

  const handleSubmit = () => {
    mutate({ authorUsername: session.user.username, postContent: newPost });
    closeModal();
  };

  return (
    <div className="absolute inset-0 z-20 overflow-hidden bg-white dark:bg-black">
      <form className="space-y-4 p-4">
        <div className="flex items-center justify-between px-2">
          <button onClick={closeModal} className="text-2xl">
            &times;
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            type="submit"
            className="rounded-md bg-blue-2 px-4 py-2 text-accent-8 dark:bg-accent-8 dark:text-accent-2"
          >
            {isLoading && <LoadingSpinner />}
            Post
          </button>
        </div>
        <div className="flex gap-4">
          <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
            <Image
              src={session.user.image || "/user.png"}
              alt="profile photo"
              fill={true}
            />
          </div>
          <textarea
            rows={10}
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full resize-none bg-white pr-2 pt-2 outline-none dark:bg-black"
          />
        </div>
      </form>
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

  // if (!session) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!session) {
      toast("You need to login to post");
      return;
    }
    mutate({ authorUsername: session.user.username, postContent: newPost });
  };

  return (
    <form className="hidden space-y-4 rounded-md border border-blue-2 bg-white p-4 dark:border-accent-6 dark:bg-black md:block">
      <div className="flex items-center space-x-4 ">
        <div className="relative h-10 w-10 overflow-hidden rounded-full">
          <Image
            src={session?.user.image || "/user.png"}
            alt="profile photo"
            fill={true}
          />
        </div>
        <input
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit(e);
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
