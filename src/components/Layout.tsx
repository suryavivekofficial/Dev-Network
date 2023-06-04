// import { useRouter } from "next/router";
import Nav from "./Nav";
import Sidebar from "./Sidebar";
// import { useState } from "react";

const Layout = ({ children }: { children: JSX.Element }) => {
  // const router = useRouter()
  // const [loader, setLoader] = useState(0)
  // router.events.on("routeChangeStart", () => setLoader(loader))

  return (
    <div className="overflow-x-hidden">
      {/* <div className="h-1 w-screen bg-white"></div> */}
      <Nav />
      <div className="flex justify-between gap-8">
        <Sidebar />
        <div className="ml-[calc(25vw+2rem)] mt-20 flex w-3/4 gap-8">
          <main className="flex w-full gap-8 py-8">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
