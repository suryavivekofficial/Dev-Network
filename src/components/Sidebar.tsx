import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState, type FC } from "react";
import { toast } from "react-hot-toast";
import { pusherClient } from "~/utils/pusher";
import { useNotificationStore } from "~/utils/zustand/notifications";
import { useThemeStore } from "~/utils/zustand/theme";
import HomeIcon from "./icons/HomeIcon";
import MessagesIcon from "./icons/MessagesIcon";
import NotificationsIcon from "./icons/NotificationsIcon";
import SettingsIcon from "./icons/SettingsIcon";

const Sidebar = () => {
  const { setTheme } = useThemeStore();
  const { data: session } = useSession();

  const pusherMsgProps = {
    type: "messages",
    channelName: session ? `newUnseenMsg_${session.user.username}` : undefined,
    eventName: session ? `unseenMsgEvent` : undefined,
  };

  const pusherNotificationProps = {
    type: "notifications",
    channelName: session
      ? `notifications_channel_${session.user.username}`
      : undefined,
    eventName: session ? "followEvent" : undefined,
  };

  return (
    <aside className="fixed top-20 h-[calc(100vh-5rem)] w-1/4 border-r border-r-blue-2 bg-white p-8 dark:border-r-accent-6 dark:bg-black">
      <SearchBar />
      <div className="py-8">
        <SidebarItem
          href=""
          pusherProps={{
            type: undefined,
            channelName: undefined,
            eventName: undefined,
          }}
        >
          <HomeIcon />
        </SidebarItem>
        <SidebarItem href="messages" pusherProps={pusherMsgProps}>
          <MessagesIcon />
        </SidebarItem>
        <SidebarItem href="notifications" pusherProps={pusherNotificationProps}>
          <NotificationsIcon />
        </SidebarItem>
        <SidebarItem
          href="settings"
          pusherProps={{
            type: undefined,
            channelName: undefined,
            eventName: undefined,
          }}
        >
          <SettingsIcon size={5} />
        </SidebarItem>
      </div>
      <button
        onClick={setTheme}
        className="w-full rounded-md bg-red-2 p-4 dark:bg-blue-2"
      >
        Theme
      </button>
    </aside>
  );
};

const SearchBar = () => {
  const [input, setInput] = useState("");

  return (
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
  );
};

interface SidebarItemProps {
  href: string;
  children: JSX.Element;
  pusherProps: {
    type: string | undefined;
    channelName: string | undefined;
    eventName: string | undefined;
  };
}

const SidebarItem: FC<SidebarItemProps> = ({ href, pusherProps, children }) => {
  const { pathname } = useRouter();
  const [count, setCount] = useState(0);
  const { setNotifications } = useNotificationStore();

  useEffect(() => {
    if (!pusherProps.channelName || !pusherProps.eventName || !pusherProps.type)
      return;
    if (pathname === `/${pusherProps.type}`) return;

    const channel = pusherClient.subscribe(pusherProps.channelName);

    const handlePusher = (data: { message: string; date: number }) => {
      setCount((prevCount) => prevCount + 1);
      console.log(data);
      toast(data.message);
      if (pusherProps.type === "notifications")
        setNotifications({
          notificationContent: data.message,
          date: data.date,
        });
    };

    channel.bind(pusherProps.eventName, handlePusher);

    return () => {
      if (!pusherProps.channelName) return;

      pusherClient.unsubscribe(pusherProps.channelName);
      pusherClient.unbind(pusherProps.eventName, handlePusher);
    };
  }, [
    pathname,
    pusherProps.channelName,
    pusherProps.eventName,
    pusherProps.type,
    setNotifications,
  ]);

  return (
    <Link href={`/${href}`}>
      <div
        className={`${
          pathname === `/${href}`
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
        {href !== "settings" && href !== "" && (
          <span className="rounded-full bg-blue-2 px-2 text-accent-8 dark:bg-white dark:text-black">
            {count}
          </span>
        )}
      </div>
    </Link>
  );
};

export default Sidebar;
