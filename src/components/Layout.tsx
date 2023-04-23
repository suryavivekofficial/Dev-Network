import Nav from "./Nav";
import Sidebar from "./Sidebar";

const Layout = ({ children }: { children: JSX.Element }) => {
  return (
    <>
      <Nav />
      <div className="flex gap-8">
        <div className="w-1/4">
          <Sidebar />
        </div>
        <div className="w-2/4">{children}</div>
        <div className="w-1/4 bg-neutral-900">profile and following</div>
      </div>
    </>
  );
};

export default Layout;
