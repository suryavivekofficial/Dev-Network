import { useThemeStore } from "~/utils/zustand/theme";
// import Nav from "./Nav";
import Header from "./Header";
import Nav from "./Nav";

export interface TlocalTheme {
  state: {
    isDarkTheme: boolean;
  };
  version: number;
}

const Layout = ({ children }: { children: JSX.Element }) => {
  const { isDarkTheme } = useThemeStore();

  return (
    <div className={`overflow-x-hidden ${isDarkTheme ? "dark" : ""}`}>
      <div className="hidden bg-blue-1 text-accent-2 dark:bg-accent-1 dark:text-accent-8 md:block">
        <Header />
        <div className="flex justify-between gap-8">
          <Nav />
          <div className="ml-[25vw] mt-20 flex w-3/4 gap-8">
            <main className="flex h-full w-full gap-8 py-8">{children}</main>
          </div>
        </div>
      </div>
      <div className="md:hidden">
        <Header />
        <div>{children}</div>
        <Nav />
      </div>
    </div>
  );
};

export default Layout;
