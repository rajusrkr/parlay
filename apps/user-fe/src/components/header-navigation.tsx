import { LogIn } from "lucide-react";
import { Link } from "react-router";

export default function HeaderNavigation() {
  return (
    <nav className="bg-gray-200 border-b-2 border-black flex justify-between items-center h-12">
      {/* main div */}
        {/* app name */}
        <div className="border-r-2 h-full flex items-center border-black px-5 font-semibold text-2xl">
          <Link to={"/"}>PerdictX</Link>
        </div>
        {/* menues */}
        <div className="space-x-8 h-full flex items-center  font-semibold">
          <Link to={"/markets"} className="hover:underline">Markets</Link>
          <Link to={"/portfolio"} className="hover:underline border-l-2 border-black pl-8 h-full items-center flex">Portfolio</Link>
          <Link to={"/news"} className="hover:underline border-l-2 border-black pl-8 h-full items-center flex">News</Link>
        </div>
        {/* Login */}
        <div className="border-l-2 h-full flex items-center border-black px-10 font-semibold bg-blue-100">
          <Link to={"/auth/login"} className="flex items-center hover:underline">Login <LogIn size={20}/></Link>
        </div>
    </nav>
  );
}
