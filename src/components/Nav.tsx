import { signIn, signOut, useSession } from "next-auth/react";

const Nav = () => {
  const { data } = useSession();

  return (
    <div className="flex h-20 border-b border-b-neutral-700/50 bg-neutral-900/50 px-10">
      <Logo />
    </div>
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

export default Nav;
