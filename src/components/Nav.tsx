import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Messages from "./icons/Messages";
import Notifications from "./icons/Notifications";
import Settings from "./icons/Settings";
import Chevron from "./icons/Chevron";
import { useState } from "react";
import { type Session } from "next-auth";
// import Link from "next/link";

const Nav = () => {
  const { data: session } = useSession();

  return (
    <nav className="fixed z-10 flex h-20 w-screen items-center justify-between border-b border-b-accent-6 bg-black px-8">
      <Logo />
      {session ? (
        <div className="flex items-center space-x-8">
          <div className="flex space-x-4">
            <NavBtn>
              <Messages />
            </NavBtn>
            <NavBtn>
              <Notifications />
            </NavBtn>
            <NavBtn>
              <Settings />
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
          onClick={() => setOpenDropdown(!openDropdown)}
          className="border-neutral-700 relative h-10 w-10 cursor-pointer overflow-hidden rounded-full border"
        >
          {session && session.user.image && (
            <Image src={session?.user.image} alt="User photo" fill={true} />
          )}
        </button>
        <span className="border-neutral-700 bg-neutral-200 text-neutral-950 absolute bottom-0 left-7 flex h-4 w-4 items-center justify-center rounded-full border-2">
          <Chevron />
        </span>
        {openDropdown && <Dropdown session={session} />}
      </div>
    </>
  );
};

const LoginBtn = () => {
  return (
    <button
      className="focus-visible:bg-neutral-800 focus-visible:ring-blue-500 rounded-md border border-accent-8 bg-black px-4 py-2 outline-none duration-150 hover:bg-accent-8 focus-visible:ring-1"
      onClick={() => void signIn()}
    >
      Login
    </button>
  );
};

const NavBtn = ({ children }: { children: JSX.Element }) => {
  return (
    <button className="bg-neutral-800 flex h-10 w-10 items-center justify-center rounded-full">
      {children}
    </button>
  );
};

const Dropdown = ({ session }: { session: Session | null }) => {
  if (!session) {
    return null;
  }

  return (
    <div className="bg-neutral-600 absolute right-0 mt-2 w-56 origin-top-left rounded-md p-4">
      <div className="flex justify-between">
        <div className="border-neutral-700 relative h-10 w-10 overflow-hidden rounded-full border">
          {session.user.image && (
            <Image
              src={session.user.image}
              alt="User profile pic"
              fill={true}
            />
          )}
        </div>
        <button
          onClick={() => void signOut()}
          className="bg-blue-500 rounded-md px-4"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Nav;
