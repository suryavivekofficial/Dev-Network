import { useSession } from "next-auth/react";
import Image from "next/image";
import Messages from "./icons/Messages";
import Notifications from "./icons/Notifications";
import Settings from "./icons/Settings";
import Chevron from "./icons/Chevron";

const Nav = () => {
  const { data: session } = useSession();

  return (
    <nav className="flex h-20 items-center justify-between border-b border-b-neutral-700/50 bg-neutral-900/50 px-10">
      <Logo />
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
    </nav>
  );
};

const Logo = () => {
  return (
    <div className="flex items-center justify-center space-x-2">
      <div className="flex h-8 w-8 gap-1">
        <div className="flex h-full w-1/2 flex-col gap-1">
          <div className="h-2/5 w-full rounded-sm bg-blue-500"></div>
          <div className="h-3/5 w-full rounded-sm bg-blue-200"></div>
        </div>
        <div className="flex h-full w-1/2 flex-col gap-1">
          <div className="h-3/5 w-full rounded-sm bg-blue-200"></div>
          <div className="h-2/5 w-full rounded-sm bg-blue-500"></div>
        </div>
      </div>
      <span className="text-xl font-bold">Dev Network</span>
    </div>
  );
};

const Profile = () => {
  const { data: session } = useSession();

  return (
    <>
      <span className="capitalize">{session?.user.name}</span>
      <div className="relative">
        <button className="relative h-10 w-10 cursor-pointer overflow-hidden rounded-full border border-neutral-700">
          {session && session.user.image && (
            <Image src={session?.user.image} alt="User photo" fill={true} />
          )}
        </button>
        <span className="absolute bottom-0 left-7 flex h-4 w-4 items-center justify-center rounded-full border-2 border-neutral-700 bg-neutral-200 text-neutral-950">
          <Chevron />
        </span>
      </div>
    </>
  );
};

const NavBtn = ({ children }: { children: JSX.Element }) => {
  return (
    <button className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-800">
      {children}
    </button>
  );
};

export default Nav;
