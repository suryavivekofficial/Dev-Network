import Nav from "./Nav";
import Sidebar from "./Sidebar";

const Layout = ({ children }: { children: JSX.Element }) => {
  return (
    <div className="overflow-x-hidden">
      <Nav />
      <div className="flex justify-between gap-8">
        <Sidebar />
        <div className="ml-[calc(25vw+2rem)] mt-20 flex w-3/4 gap-8">
          <main className="w-2/3 py-8">{children}</main>
          <div className="w-1/3 bg-black">profile and following</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
