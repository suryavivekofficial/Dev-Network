import Image from "next/image";
import Link from "next/link";
import { api } from "~/utils/api";
import LoadingSpinner from "./icons/LoadingSpinner";
import { useSession } from "next-auth/react";

const FollowingListCard = () => {
  const { data: session } = useSession();
  const { data, isLoading } = api.user.getUserFollows.useQuery();

  if (!session) return null;

  if (isLoading) {
    return (
      <div className="mr-8 flex items-center justify-center rounded-md border border-blue-2 bg-white p-6 dark:border-accent-6 dark:bg-black">
        <LoadingSpinner />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="mr-8 flex flex-col items-center space-y-4 rounded-md border border-blue-2 bg-white p-6 text-sm dark:border-accent-6 dark:bg-black">
        People you follow appear here.
      </div>
    );
  }

  return (
    <div className="mr-8 space-y-2 rounded-md border border-blue-2 bg-white p-4 dark:border-accent-6 dark:bg-black">
      <h3 className="px-4 text-left">People You Follow:</h3>
      {data.map((user) => (
        <Link
          href={`/${user.followingUsername}`}
          key={user.followingUsername}
          className="flex w-full items-center justify-start space-x-4 rounded-md p-4 hover:bg-blue-1 dark:hover:bg-accent-2"
        >
          <div className="relative h-10 w-10 overflow-hidden rounded-full">
            <Image
              src={user.following.image ?? "/user.png"}
              alt="profile photo"
              fill={true}
            />
          </div>
          <div className="mt-0 flex flex-col">
            <span className="text-sm">{user.following.name}</span>
            <span className="text-xs">@{user.followingUsername}</span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default FollowingListCard;
