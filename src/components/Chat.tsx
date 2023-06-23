import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { type FC, type ReactNode } from "react";
import { api } from "~/utils/api";
import LoadingSpinner from "./icons/LoadingSpinner";

dayjs.extend(relativeTime);

type ChatProps = {
  children?: ReactNode;
  selectedChat: string | null;
};

const Chat: FC<ChatProps> = ({ children, selectedChat }) => {
  const { data: session } = useSession();

  return (
    <div className="h-full w-full rounded-md border-blue-2 bg-white dark:border-accent-6 dark:bg-black md:flex md:border">
      {!session && (
        <div className="flex h-full w-full items-center justify-center">
          <span>You need to login first.</span>
        </div>
      )}
      <Usernames selectedChat={selectedChat} />
      <div className="flex-grow">{children}</div>
    </div>
  );
};

const Usernames = ({ selectedChat }: { selectedChat: string | null }) => {
  const { data: session } = useSession();
  const { data, isLoading } = api.user.getAllUsers.useQuery();

  if (!session) return null;

  if (isLoading)
    return (
      <div className="flex w-full items-center justify-center">
        <LoadingSpinner />
      </div>
    );

  if (!data) return <div>No users available to chat.</div>;

  return (
    <div className="w-full flex-shrink-0 space-y-2 divide-y divide-blue-1 overflow-y-scroll border-blue-2 p-2 dark:divide-accent-2 dark:border-accent-6 md:w-1/4 md:border-r">
      {data.map((user) => {
        const username = user.username || "Error";
        return (
          <Link
            href={`/messages/${username}`}
            className={`${
              selectedChat === username
                ? 'relative rounded-md bg-blue-1 text-blue-2 before:absolute before:left-0 before:top-1/2 before:h-6 before:w-1 before:-translate-y-1/2 before:rounded-md before:bg-blue-2 before:content-[""] dark:bg-accent-2 dark:text-accent-8 dark:before:bg-white'
                : ""
            } hover:bg- flex w-full items-center space-x-2 p-4 hover:rounded-md hover:bg-blue-1 dark:hover:bg-accent-2`}
            key={username}
          >
            <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-full">
              <Image
                src={user.image || "/user.png"}
                fill={true}
                alt="profile pic"
              />
            </div>
            <span className="truncate">{username}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default Chat;
