import { useState } from "react";
import Home from "./icons/Home";
import Messages from "./icons/Messages";
import Notifications from "./icons/Notifications";
import Settings from "./icons/Settings";
import Link from "next/link";

const Sidebar = () => {
  return (
    <div className="min-h-screen w-1/4 border-r border-r-neutral-700/50 bg-neutral-900/50 p-8">
      <SearchBar />
      <div className="py-8">
        <SidebarItem key={"Home"} title={"Home"} href="/">
          <Home />
        </SidebarItem>
        <SidebarItem key={"Messages"} title={"Messages"} href="/messages">
          <Messages />
        </SidebarItem>
        <SidebarItem
          key={"Notifications"}
          title={"Notifications"}
          href="notifications"
        >
          <Notifications />
        </SidebarItem>
        <SidebarItem key={"Settings"} title={"Settings"} href="settings">
          <Settings />
        </SidebarItem>
      </div>
    </div>
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
          className="block w-full rounded-lg border border-neutral-600 bg-neutral-800 p-2.5 pl-10 text-sm outline-none placeholder:text-neutral-200 focus:ring-1 focus:ring-blue-500"
          placeholder="Search"
          required
        />
      </div>
      <button
        type="submit"
        // className="ml-2 rounded-lg border border-blue-700 bg-blue-700 p-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        {/* <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            >
            <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg> */}
        <span className="sr-only">Search</span>
      </button>
    </form>
  );
};

const SidebarItem = ({
  title,
  href,
  children,
}: {
  title: string;
  href: string;
  children: JSX.Element;
}) => {
  return (
    <Link href={href}>
      <div className="flex cursor-pointer items-center space-x-2 rounded-md p-4 duration-100 hover:bg-blue-500/80">
        {children}
        <span className="text-base">{title}</span>
      </div>
    </Link>
  );
};

export default Sidebar;