import Nav from "./Nav";
import Sidebar from "./Sidebar";

const Layout = ({ children }: { children: JSX.Element }) => {
  return (
    <div>
      <Nav />
      <Sidebar />
      {children}
    </div>
  );
};

export default Layout;
