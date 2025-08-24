import { Chip } from "@heroui/react";
import { LogOut } from "lucide-react";
import { Link } from "react-router";

export default function Navbar() {
  return (
    <nav className="bg-default border-b-2 border-black flex justify-between items-center h-12">
        {/* app name */}
        <div className="border-r-2 h-full flex items-center border-black px-5 font-semibold text-2xl">
          <Link to={"/markets"}>PerdictX</Link>
        </div>
        {/* menues */}
        <div className="space-x-8 h-full flex items-center  font-semibold">
          <Link to={"/markets"} className="hover:underline">Markets</Link>
          <Link to={"/portfolio"} className="hover:underline border-l-2 border-black pl-8 h-full items-center flex">Portfolio</Link>
          <Link to={"/news"} className="hover:underline border-l-2 border-black pl-8 h-full items-center flex">News</Link>
        </div>
        {/* Login */}
        <div className="border-l-2 h-full flex items-center border-black px-10 font-semibold">
          <Chip size="lg" color="danger"><span className="font-semibold flex items-center gap-2">Logout <LogOut size={"18"}/></span></Chip>
        </div>
    </nav>
  );
}
