import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Messages from "./icons/MessagesIcon";
import Notifications from "./icons/NotificationsIcon";
import Chevron from "./icons/ChevronIcon";
import { useEffect, useRef, useState } from "react";
import { type Session } from "next-auth";
import SettingsIcon from "./icons/SettingsIcon";
import Link from "next/link";
import type { Dispatch, SetStateAction } from "react";

const Nav = () => {
  const { data: session } = useSession();

  return (
    <nav className="fixed z-10 flex h-20 w-screen items-center justify-between border-b border-b-accent-6 bg-black px-8">
      <Logo />
      {session ? (
        <div className="flex items-center space-x-6">
          <div className="flex space-x-4">
            <NavBtn>
              <Messages />
            </NavBtn>
            <NavBtn>
              <Notifications />
            </NavBtn>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Profile />
          </div>
        </div>
      ) : (
        <LoginBtn />
      )}
    </nav>
  );
};

const Logo = () => {
  return (
    <div className="flex items-center justify-center space-x-2">
      <div className="flex h-8 w-8 gap-1">
        <div className="flex h-full w-1/2 flex-col gap-1">
          <div className="h-2/5 w-full rounded-sm bg-blue-1"></div>
          <div className="h-3/5 w-full rounded-sm bg-blue-2"></div>
        </div>
        <div className="flex h-full w-1/2 flex-col gap-1">
          <div className="h-3/5 w-full rounded-sm bg-blue-2"></div>
          <div className="h-2/5 w-full rounded-sm bg-blue-1"></div>
        </div>
      </div>
      <span className="text-xl font-bold">Dev Network</span>
    </div>
  );
};

const Profile = () => {
  const { data: session } = useSession();
  const [openDropdown, setOpenDropdown] = useState(false);

  return (
    <>
      <span className="capitalize">{session?.user.name}</span>
      <div className="relative">
        <button
          onClick={() => setOpenDropdown((prevState) => !prevState)}
          className="relative h-10 w-10 cursor-pointer overflow-hidden rounded-full border border-blue-2"
        >
          {session && session.user.image && (
            <Image src={session?.user.image} alt="User photo" fill={true} />
          )}
        </button>
        <span className="pointer-events-none absolute bottom-0 left-7 flex h-4 w-4 cursor-pointer items-center justify-center rounded-full border-2 border-blue-2 bg-blue-1 text-accent-2">
          <Chevron />
        </span>
        {openDropdown && session && (
          <Dropdown session={session} setOpenDropdown={setOpenDropdown} />
        )}
      </div>
    </>
  );
};

const LoginBtn = () => {
  return (
    <button
      className="rounded-md border border-accent-8 bg-black px-4 py-2 outline-none duration-150 hover:bg-accent-8 hover:text-black focus-visible:bg-accent-8 focus-visible:text-black focus-visible:ring-2 focus-visible:ring-blue-4"
      onClick={() => void signIn()}
    >
      Login
    </button>
  );
};

const NavBtn = ({ children }: { children: JSX.Element }) => {
  return (
    <button className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-2 hover:bg-accent-4">
      {children}
    </button>
  );
};

const Dropdown = ({
  session,
  setOpenDropdown,
}: {
  session: Session;
  setOpenDropdown: Dispatch<SetStateAction<boolean>>;
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (e: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target as Node)
    ) {
      setOpenDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 w-56 origin-top-left space-y-4 rounded-md border border-accent-6 bg-accent-1 p-4"
    >
      <div className="flex space-x-2">
        <div className="border-neutral-700 relative h-16 w-16 overflow-hidden rounded-full border">
          {session.user.image && (
            <Image
              src={session.user.image}
              alt="User profile pic"
              fill={true}
            />
          )}
        </div>
        <span className="flex flex-col items-start justify-center">
          <h5 className="capitalize">{session.user.name}</h5>
          <small>@{session.user.username}</small>
        </span>
      </div>
      <Link
        href="/settings"
        className="flex items-center justify-center space-x-2 rounded-md border border-accent-6 border-opacity-50 p-2 duration-200 hover:bg-accent-2"
      >
        <SettingsIcon size={4} />
        <span className="text-xs">Manage your Account</span>
      </Link>
      <hr className="text-accent-6 text-opacity-50" />
      <div className="flex w-full items-center justify-center">
        <button
          onClick={() => void signOut()}
          className="rounded-md bg-blue-4 px-4 py-2 duration-200 hover:bg-blue-3"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Nav;
