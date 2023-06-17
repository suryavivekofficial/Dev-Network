import { useEffect, useState } from "react";
import { useThemeStore } from "~/utils/zustand/theme";
import Nav from "./Nav";
import Sidebar from "./Sidebar";

export interface TlocalTheme {
  state: {
    isDarkTheme: boolean;
  };
  version: number;
}

const Layout = ({ children }: { children: JSX.Element }) => {
  const { isDarkTheme } = useThemeStore();
  const [appTheme, setAppTheme] = useState("");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const localTheme: TlocalTheme | null = storedTheme
      ? (JSON.parse(storedTheme) as TlocalTheme)
      : null;
    if (localTheme?.state.isDarkTheme) {
      setAppTheme("dark");
    } else {
      setAppTheme("light");
    }
  }, [isDarkTheme]);

  return (
    <div className={`overflow-x-hidden ${appTheme}`}>
      <div className="bg-blue-1 text-accent-2 dark:bg-accent-1 dark:text-accent-8">
        <Nav />
        <div className="flex justify-between gap-8">
          <Sidebar />
          <div className="ml-[calc(25vw+2rem)] mt-20 flex w-3/4 gap-8">
            <main className="flex h-full w-full gap-8 py-8">{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
