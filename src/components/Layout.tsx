import Nav from "./Nav";
import Sidebar from "./Sidebar";

const Layout = ({ children }: { children: JSX.Element }) => {
  return (
    <>
      <Nav />
      <div className="flex justify-between gap-8">
        <Sidebar />
        <div className="flex w-3/4 gap-8 overflow-y-scroll">
          <main className="w-2/3">{children}</main>
          <div className="w-1/3 bg-black">profile and following</div>
        </div>
      </div>
    </>
  );
};

export default Layout;
