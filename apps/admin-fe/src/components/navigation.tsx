import { Chip } from "@heroui/react";
import { Link } from "react-router";

export default function Navigation() {
  return (
    <nav className="bg-gray-200 h-14 px-10 flex justify-between items-center shadow-md">
      <div className="flex gap-4">
        <Link to={"/"} className="text-3xl flex items-center">
          PredictX
          <span className="border px-2 pb-1 ml-1 rounded-xl bg-black text-white">
            admin
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-2 text-xl">
        <div>
          <Link to={"/market/create"}>
            <Chip size="lg" radius="md" variant="flat" color="primary">
              Create Market
            </Chip>
          </Link>
        </div>
        <div>
          <Link to={"/auth/login"}>
            <Chip size="lg" radius="md" color="primary">
              Login
            </Chip>
          </Link>
        </div>
      </div>
    </nav>
  );
}
