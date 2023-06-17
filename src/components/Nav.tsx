import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Toaster } from "react-hot-toast";
import Tabs from "./Tabs";
import Chevron from "./icons/ChevronIcon";
import SettingsIcon from "./icons/SettingsIcon";

const Nav = () => {
  const { data: session } = useSession();

  return (
    <header className="fixed z-10 min-h-max w-screen space-y-4 divide-y divide-blue-1 border-b border-b-blue-2 bg-white px-4 py-2 dark:border-b-accent-6 dark:bg-black md:px-8 md:py-5">
      <div className="flex items-center justify-between">
        <Logo />
        <div className="hidden w-1/3 md:inline-block">
          <Tabs />
        </div>
        <Toaster />
        {session ? (
          <div className="flex w-1/3 items-center justify-end space-x-2">
            <Profile />
          </div>
        ) : (
          <LoginBtn />
        )}
      </div>
      <div className="mt-2 md:hidden">
        <Tabs />
      </div>
    </header>
  );
};

// const Tabs = () => {
//   const { data: session } = useSession();
//   const { pathname } = useRouter();
//   const { selected, changeSelectionToFollowing, changeSelectionToForYou } =
//     usePostStore();

//   if (!session || pathname !== "/") return null;

//   return (
//     <div className="flex h-10 w-1/3 items-center justify-center">
//       <div className="flex h-full min-w-max items-center justify-between rounded-md border border-blue-2 px-2 dark:border-accent-6">
//         <button
//           onClick={changeSelectionToForYou}
//           className={`whitespace-nowrap rounded px-4 py-1 text-sm  duration-300 ${
//             selected === "for you"
//               ? "bg-blue-2 text-accent-8 dark:bg-accent-2"
//               : ""
//           }`}
//         >
//           For You
//         </button>
//         <button
//           onClick={changeSelectionToFollowing}
//           className={`whitespace-nowrap rounded px-4 py-1 text-sm duration-300 ${
//             selected === "following"
//               ? "bg-blue-2 text-accent-8 dark:bg-accent-2"
//               : ""
//           }`}
//         >
//           Following
//         </button>
//       </div>
//     </div>
//   );
// };

const Logo = () => {
  return (
    <div className="flex w-1/2 items-center justify-start space-x-2 md:w-1/3">
      <div className="flex h-6 w-6 gap-1 md:h-8 md:w-8">
        <div className="flex h-full w-1/2 flex-col gap-1">
          <div className="h-2/5 w-full rounded-sm bg-blue-1"></div>
          <div className="h-3/5 w-full rounded-sm bg-blue-2"></div>
        </div>
        <div className="flex h-full w-1/2 flex-col gap-1">
          <div className="h-3/5 w-full rounded-sm bg-blue-2"></div>
          <div className="h-2/5 w-full rounded-sm bg-blue-1"></div>
        </div>
      </div>
      <span className="text-base font-bold md:text-xl">Dev Network</span>
    </div>
  );
};

const Profile = () => {
  const { data: session } = useSession();
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownBtnRef = useRef<HTMLButtonElement>(null);

  const toggleDropdown = (eventTarget: EventTarget) => {
    if (dropdownBtnRef.current?.contains(eventTarget as Node)) {
      return;
    } else {
      setOpenDropdown(!openDropdown);
    }
  };

  if (!session) return null;

  return (
    <>
      <Link
        href={`/${session.user.username}`}
        className="hidden duration-150 hover:text-blue-2 hover:underline md:inline-block"
      >
        <span className="whitespace-nowrap capitalize">
          {session.user.name}
        </span>
      </Link>
      <div className="relative">
        <button
          ref={dropdownBtnRef}
          onClick={() => setOpenDropdown(!openDropdown)}
          className="relative h-8 w-8 cursor-pointer overflow-hidden rounded-full border border-blue-2 md:h-10 md:w-10"
        >
          <Image
            src={session.user.image ?? "/user.png"}
            alt="User photo"
            fill={true}
          />
        </button>
        <span className="pointer-events-none absolute bottom-0 left-7 hidden h-4 w-4 cursor-pointer items-center justify-center rounded-full border-2 border-blue-2 bg-blue-1 text-accent-2 md:flex">
          <Chevron />
        </span>
        {openDropdown && <Dropdown toggleDropdown={toggleDropdown} />}
      </div>
    </>
  );
};

const LoginBtn = () => {
  return (
    <button
      className="rounded-md border border-blue-2 bg-white px-4 py-2 text-blue-2 outline-none duration-150 hover:bg-blue-1 focus-visible:bg-accent-8 focus-visible:text-black focus-visible:ring-2 focus-visible:ring-blue-4 dark:border-accent-8 dark:bg-black dark:text-accent-8 dark:hover:bg-accent-8 dark:hover:text-black"
      onClick={() => void signIn()}
    >
      Login
    </button>
  );
};

const Dropdown = ({
  toggleDropdown,
}: {
  toggleDropdown: (eventTarget: EventTarget) => void;
}) => {
  const { data: session } = useSession();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        e.target && toggleDropdown(e.target);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [toggleDropdown]);

  if (!session) return null;
  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 mt-2 origin-top-left space-y-4 rounded-md border border-accent-6 bg-accent-1 p-4"
    >
      <div className="flex space-x-2">
        <div className="relative h-16 w-16 overflow-hidden rounded-full border border-blue-2">
          <Image
            src={session.user.image ?? "/user.png"}
            alt="User profile pic"
            fill={true}
          />
        </div>
        <span className="flex flex-col items-start justify-center">
          <h5 className="capitalize">{session.user.name}</h5>
          <Link
            href={`/${session.user.username}`}
            className="hover:text-blue-1"
          >
            <small>@{session.user.username}</small>
          </Link>
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
