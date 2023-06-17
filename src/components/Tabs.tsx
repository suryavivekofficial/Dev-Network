import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { usePostStore } from "~/utils/zustand/posts";

const Tabs = () => {
  const { data: session } = useSession();
  const { pathname } = useRouter();
  const { selected, changeSelectionToFollowing, changeSelectionToForYou } =
    usePostStore();

  if (!session || pathname !== "/") return null;

  return (
    <div className="mt-2 flex h-10 w-full items-center justify-center md:mt-0">
      <div className="flex h-full items-center justify-around rounded-md border-blue-2 px-2 dark:border-accent-6 md:min-w-max md:justify-between md:border">
        <button
          onClick={changeSelectionToForYou}
          className={`whitespace-nowrap rounded px-4 py-1 text-sm  duration-300 ${
            selected === "for you"
              ? "bg-blue-2 text-accent-8 dark:bg-accent-2"
              : ""
          }`}
        >
          For You
        </button>
        <button
          onClick={changeSelectionToFollowing}
          className={`whitespace-nowrap rounded px-4 py-1 text-sm duration-300 ${
            selected === "following"
              ? "bg-blue-2 text-accent-8 dark:bg-accent-2"
              : ""
          }`}
        >
          Following
        </button>
      </div>
    </div>
  );
};

export default Tabs;
