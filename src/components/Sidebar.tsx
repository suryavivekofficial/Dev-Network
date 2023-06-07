import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import Home from "./icons/HomeIcon";
import Messages from "./icons/MessagesIcon";
import Notifications from "./icons/NotificationsIcon";
import Settings from "./icons/SettingsIcon";

const Sidebar = () => {
  return (
    <aside className="fixed top-20 h-[calc(100vh-5rem)] w-1/4 border-r border-r-accent-6 bg-black p-8">
      <SearchBar />
      <div className="py-8">
        <SidebarItem href="">
          <Home />
        </SidebarItem>
        <SidebarItem href="messages">
          <Messages />
        </SidebarItem>
        <SidebarItem href="notifications">
          <Notifications />
        </SidebarItem>
        <SidebarItem href="settings">
          <Settings size={5} />
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

const SidebarItem = ({
  href,
  children,
}: {
  href: string;
  children: JSX.Element;
}) => {
  const { pathname } = useRouter();
  const [count, setCount] = useState(0);

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
        <span className="rounded-full bg-white px-2 text-black">{count}</span>
      </div>
    </Link>
  );
};

export default Sidebar;
