import { useState } from "react";
import Home from "./icons/Home";
import Messages from "./icons/Messages";
import Notifications from "./icons/Notifications";
import Settings from "./icons/Settings";
import Link from "next/link";
import { useRouter } from "next/router";

const Sidebar = () => {
  return (
    <div className="min-h-screen w-full border-r border-r-accent-6 bg-black p-8">
      <SearchBar />
      <div className="py-8">
        <SidebarItem key={"Home"} href="">
          <Home />
        </SidebarItem>
        <SidebarItem key={"Messages"} href="messages">
          <Messages />
        </SidebarItem>
        <SidebarItem key={"notifications"} href="notifications">
          <Notifications />
        </SidebarItem>
        <SidebarItem key={"Settings"} href="settings">
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

  return (
    <Link href={`/${href}`}>
      <div
        className={`${
          pathname === `/${href}` ? `bg-accent-2` : ``
        } flex cursor-pointer items-center space-x-2 rounded-md p-4 duration-100 hover:bg-accent-2`}
      >
        {children}
        <span className="text-base capitalize">{href}</span>
      </div>
    </Link>
  );
};

export default Sidebar;
