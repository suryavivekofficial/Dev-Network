import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState, type FC } from "react";
import { toast } from "react-toastify";
import { api } from "~/utils/api";
import { pusherClient } from "~/utils/pusher";
import { useNotificationStore } from "~/utils/zustand/notifications";
import { useThemeStore } from "~/utils/zustand/theme";
import DarkThemeIcon from "./icons/DarkThemeIcon";
import HomeIcon from "./icons/HomeIcon";
import LightThemeIcon from "./icons/LightThemeIcon";
import LoadingSpinner from "./icons/LoadingSpinner";
import MessagesIcon from "./icons/MessagesIcon";
import NotificationsIcon from "./icons/NotificationsIcon";
import SearchIcon from "./icons/SearchIcon";
import SettingsIcon from "./icons/SettingsIcon";

const Nav = () => {
  const { data: session } = useSession();

  return (
    <nav>
      <aside className="fixed top-20 hidden h-[calc(100vh-5rem)] w-1/4 border-r border-r-blue-2 bg-white p-8 dark:border-r-accent-6 dark:bg-black md:block">
        <SearchBar />
        <div className="py-8">
          <SidebarItem href="">
            <HomeIcon />
          </SidebarItem>

          <SidebarItem
            href="messages"
            pusherProps={
              session
                ? {
                    type: "messages",
                    channelName: `newUnseenMsg_${session.user.username}`,
                    eventName: "unseenMsgEvent",
                  }
                : undefined
            }
          >
            <MessagesIcon />
          </SidebarItem>

          <SidebarItem
            href="notifications"
            pusherProps={
              session
                ? {
                    type: "notifications",
                    channelName: `notifications_channel_${session.user.username}`,
                    eventName: "followEvent",
                  }
                : undefined
            }
          >
            <NotificationsIcon />
          </SidebarItem>

          <SidebarItem href="settings">
            <SettingsIcon size={5} />
          </SidebarItem>
        </div>
        <ThemeBtn />
      </aside>
      <Footer />
    </nav>
  );
};

const Footer = () => {
  const router = useRouter();
  const { pathname } = router;

  return (
    <footer className="fixed bottom-0 left-0 right-0 flex items-center justify-between border-t border-blue-2 bg-white p-4 px-6 dark:border-accent-6 dark:bg-black md:hidden">
      <Link href={"/"}>
        <div className={`${pathname === `/` ? `text-blue-2` : ""}`}>
          <HomeIcon size={6} />
        </div>
      </Link>
      <Link href={"messages"}>
        <div className={`${pathname === `/messages` ? `text-blue-2` : ""}`}>
          <MessagesIcon size={6} />
        </div>
      </Link>
      <Link href={"/search"}>
        <div className={`${pathname === `/search` ? `text-blue-2` : ""}`}>
          <SearchIcon size={6} />
        </div>
      </Link>
      <Link href={"/notifications"}>
        <div
          className={`${pathname === `/notifications` ? `text-blue-2` : ""}`}
        >
          <NotificationsIcon size={6} />
        </div>
      </Link>
      <Link href={"/settings"}>
        <div className={`${pathname === `/settings` ? `text-blue-2` : ""}`}>
          <SettingsIcon size={6} />
        </div>
      </Link>
    </footer>
  );
};

const ThemeBtn = () => {
  const { isDarkTheme, setTheme } = useThemeStore();

  return (
    <button
      onClick={setTheme}
      className="flex w-full items-center justify-around rounded-md bg-blue-1 p-4 dark:bg-accent-2"
    >
      <span>Change Theme</span>
      <span>{isDarkTheme ? <DarkThemeIcon /> : <LightThemeIcon />}</span>
    </button>
  );
};

const SearchBar = () => {
  const [input, setInput] = useState("");

  return (
    <div className="relative">
      <form className="flex items-center">
        <label htmlFor="simple-search" className="sr-only">
          Search
        </label>
        <div className="relative w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-blue-3 dark:text-accent-8">
            <svg
              aria-hidden="true"
              className="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
          <input
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
            type="text"
            id="simple-search"
            className="block w-full rounded-lg border border-blue-2 bg-white p-2.5 pl-10 text-sm text-blue-2 outline-none placeholder:text-blue-2 placeholder:opacity-70 focus:ring-1 focus:ring-blue-2 dark:border-accent-6 dark:bg-black dark:text-accent-8 dark:ring-accent-8 dark:placeholder:text-accent-6"
            placeholder="Search"
            required
          />
        </div>
        <button type="submit">
          <span className="sr-only">Search</span>
        </button>
      </form>
      {input.trim().length !== 0 && <SearchResults searchTerm={input} />}
    </div>
  );
};

const SearchResults = ({ searchTerm }: { searchTerm: string }) => {
  const { data, isLoading } = api.search.searchUser.useQuery({
    searchTerm: searchTerm,
  });

  if (isLoading)
    return (
      <div className="absolute left-0 right-0 mt-2 origin-top-left rounded-md border border-accent-6 bg-accent-1 p-4 text-center">
        <LoadingSpinner />
      </div>
    );

  if (!data || data.length === 0)
    return (
      <div className="absolute left-0 right-0 mt-2 origin-top-left rounded-md border border-accent-6 bg-accent-1 p-4 text-center">
        No results for this search!
      </div>
    );

  return (
    <div className="absolute left-0 right-0 mt-2 origin-top-left rounded-md border border-accent-6 bg-accent-1">
      {data.map((user) => {
        if (!user.username) return null;
        if (!user.image) {
          user.image = "/user.png";
        }
        return (
          <Link
            href={`/${user.username}`}
            key={user.username}
            className="duration-200 hover:text-blue-2"
          >
            <div className="flex items-center space-x-2 p-4">
              <div className="relative h-10 w-10 overflow-hidden rounded-full">
                <Image src={user.image} fill={true} alt="Author photo" />
              </div>
              <span>{user.username}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

interface SidebarItemProps {
  href: string;
  children: JSX.Element;
  pusherProps?: {
    type: string;
    channelName: string;
    eventName: string;
  };
}

const SidebarItem: FC<SidebarItemProps> = ({ href, pusherProps, children }) => {
  const { pathname } = useRouter();
  const [count, setCount] = useState(0);
  const { notifications } = useNotificationStore();

  useEffect(() => {
    void useNotificationStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    if (!pusherProps) return;

    const channel = pusherClient.subscribe(pusherProps.channelName);
    channel.bind(pusherProps.eventName, () => {
      setCount((count) => count + 1);
      toast(`You have new ${pusherProps.type}`, { toastId: count });
    });

    return () => {
      pusherClient.unsubscribe(pusherProps.channelName);
      channel.unbind(pusherProps.eventName, () => {
        setCount((count) => count + 1);
        toast(`You have new ${pusherProps.type}`, { toastId: count });
      });
    };
  }, [count, pusherProps]);

  const regex = new RegExp(`^\\/${href}(\\/.*)?$`);

  return (
    <Link href={`/${href}`}>
      <div
        className={`${
          regex.test(pathname)
            ? `relative bg-blue-1 text-blue-2 before:absolute before:left-0 before:top-1/2 before:h-6 before:w-1 before:-translate-y-1/2 before:rounded-md before:bg-blue-2 before:content-[''] dark:bg-accent-2 dark:text-white dark:before:bg-white`
            : ``
        } my-4 flex cursor-pointer items-center justify-between rounded-md p-4 duration-200 hover:bg-blue-1 dark:hover:bg-accent-2`}
      >
        <div className="flex items-center space-x-2">
          {children}
          <span className="text-base capitalize">
            {href === "" ? "home" : href}
          </span>
        </div>
        {href === "messages" && (
          <span className="rounded-full bg-blue-2 px-2 text-accent-8 dark:bg-white dark:text-black">
            {count}
          </span>
        )}
        {href === "notifications" && (
          <span className="rounded-full bg-blue-2 px-2 text-accent-8 dark:bg-white dark:text-black">
            {notifications.length}
          </span>
        )}
      </div>
    </Link>
  );
};

export default Nav;
