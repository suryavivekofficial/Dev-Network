import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState, type FC } from "react";
import { toast } from "react-hot-toast";
import { pusherClient } from "~/utils/pusher";
import HomeIcon from "./icons/HomeIcon";
import MessagesIcon from "./icons/MessagesIcon";
import NotificationsIcon from "./icons/NotificationsIcon";
import SettingsIcon from "./icons/SettingsIcon";

const Sidebar = () => {
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

  // const pusherTemp2 = {
  //   channelName: null,
  //   eventName: null,
  // };

  // const pusherTemp3 = {
  //   channelName: null,
  //   eventName: null,
  // };

  return (
    <aside className="fixed top-20 h-[calc(100vh-5rem)] w-1/4 border-r border-r-accent-6 bg-black p-8">
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
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
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
          className="block w-full rounded-lg border border-accent-6 bg-black p-2.5 pl-10 text-sm outline-none placeholder:text-accent-6 focus:ring-1 focus:ring-accent-8"
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

  useEffect(() => {
    if (!pusherProps.channelName || !pusherProps.eventName || !pusherProps.type)
      return;
    if (pathname === `/${pusherProps.type}`) return;

    const channel = pusherClient.subscribe(pusherProps.channelName);

    const handlePusher = (data: { message: string }) => {
      setCount((prevCount) => prevCount + 1);
      console.log(data);
      toast(data.message);
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
  ]);

  return (
    <Link href={`/${href}`}>
      <div
        className={`${
          pathname === `/${href}`
            ? `relative bg-accent-2 before:absolute before:left-0 before:top-1/2 before:h-6 before:w-1 before:-translate-y-1/2 before:rounded-md before:bg-white before:content-['']`
            : ``
        } my-4 flex cursor-pointer items-center justify-between rounded-md p-4 duration-200 hover:bg-accent-2`}
      >
        <div className="flex items-center space-x-2">
          {children}
          <span className="text-base capitalize">
            {href === "" ? "home" : href}
          </span>
        </div>
        {href !== "" && (
          <span className="rounded-full bg-white px-2 text-black">{count}</span>
        )}
      </div>
    </Link>
  );
};

export default Sidebar;
