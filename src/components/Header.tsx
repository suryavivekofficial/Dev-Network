import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useThemeStore } from "~/utils/zustand/theme";
import Tabs from "./Tabs";
import Chevron from "./icons/ChevronIcon";
import DarkThemeIcon from "./icons/DarkThemeIcon";
import LightThemeIcon from "./icons/LightThemeIcon";
import SettingsIcon from "./icons/SettingsIcon";

const Header = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { pathname } = router;

  return (
    <header
      className={`${
        session
          ? "space-y-4 divide-y divide-blue-1 dark:divide-accent-4"
          : "flex items-center"
      } fixed top-0 z-10 min-h-max w-screen border-b border-b-blue-2 bg-white p-4 px-6 dark:border-b-accent-6 dark:bg-black md:fixed md:px-8 md:py-5`}
    >
      <div className="flex w-full items-center justify-between">
        <Logo />
        <div className="hidden w-1/3 md:inline-block">
          <Tabs />
        </div>
        {session ? (
          <div className="flex w-1/3 items-center justify-end space-x-2">
            <Profile />
          </div>
        ) : (
          <LoginBtn />
        )}
      </div>
      {pathname === "/" && (
        <div className="mt-2 md:hidden">
          <Tabs />
        </div>
      )}
    </header>
  );
};

const Logo = () => {
  return (
    <div className="flex min-w-max items-center justify-start space-x-2 md:w-1/3">
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
      <span className="whitespace-nowrap text-xl font-bold">Dev Network</span>
    </div>
  );
};

const Profile = () => {
  const { data: session } = useSession();
  const [openDropdown, setOpenDropdown] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
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
          onClick={() => {
            setOpenDropdown(!openDropdown);
            setIsMobileSidebarOpen(true);
          }}
          className="relative h-10 w-10 cursor-pointer overflow-hidden rounded-full border border-blue-2"
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
        {isMobileSidebarOpen && (
          <MobileSidebar setIsMobileSidebarOpen={setIsMobileSidebarOpen} />
        )}
      </div>
    </>
  );
};

const MobileSidebar = ({
  setIsMobileSidebarOpen,
}: {
  setIsMobileSidebarOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const { setTheme, isDarkTheme } = useThemeStore();
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <div className="fixed inset-0 animate-slide-in bg-white p-4 dark:bg-black md:hidden">
      <div className="text-2xl">
        <button onClick={() => setIsMobileSidebarOpen(false)}>&times;</button>
      </div>
      <div className="flex h-3/5 flex-col items-center justify-around">
        <Link href={`/${session.user.username}`}>Go to your Account</Link>
        <Link href={"/settings"}>Manage your Account</Link>
        <button onClick={setTheme} className="flex justify-center space-x-4">
          <span>Change Theme</span>
          {isDarkTheme ? <DarkThemeIcon /> : <LightThemeIcon />}
        </button>
        <button onClick={() => void signOut()}>Sign Out</button>
      </div>
    </div>
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
      className="absolute right-0 mt-2 hidden origin-top-left space-y-4 rounded-md border border-blue-2 bg-blue-1 p-4 dark:border-accent-6 dark:bg-accent-1 md:block"
    >
      <div className="flex space-x-2">
        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full border border-blue-2">
          <Image
            src={session.user.image ?? "/user.png"}
            alt="User profile pic"
            fill={true}
          />
        </div>
        <span className="flex flex-col items-start justify-center">
          <h5 className="whitespace-nowrap capitalize">{session.user.name}</h5>
          <Link
            href={`/${session.user.username}`}
            className="hover:text-blue-2 dark:hover:text-blue-1"
          >
            <small>@{session.user.username}</small>
          </Link>
        </span>
      </div>
      <Link
        href="/settings"
        className="flex items-center justify-center space-x-2 rounded-md border border-blue-2 border-opacity-50 p-2 duration-200 hover:bg-white dark:border-accent-6 dark:hover:bg-accent-2"
      >
        <SettingsIcon size={4} />
        <span className="whitespace-nowrap text-xs">Manage your Account</span>
      </Link>
      <hr className="text-accent-6 text-opacity-50" />
      <div className="flex w-full items-center justify-center">
        <button
          onClick={() => void signOut()}
          className="rounded-md border border-blue-2 bg-white px-4 py-2 text-blue-2 duration-200 hover:bg-blue-3 hover:text-white dark:border-accent-6 dark:bg-accent-8 dark:text-accent-2 dark:hover:brightness-75"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Header;
