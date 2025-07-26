import { Link } from "react-router";

export default function Navigation() {
  return (
    <nav className="bg-gray-200 h-14 px-10 flex justify-between items-center">
      <div>
        <h2 className="text-3xl">
          PredictX <span className="border px-1 rounded bg-black text-white">admin</span>
        </h2>
      </div>

      <div className="flex gap-6 text-xl">
        <div>
          <Link to={"/"} className="bg-gray-300 flex items-center px-2 rounded pb-1 hover:bg-gray-400 transition-all hover:shadow">Open</Link>
        </div>
        <div>
            <Link to={"/"} className="bg-gray-300 flex items-center px-2 rounded pb-1 hover:bg-gray-400 transition-all hover:shadow">Settled</Link>
        </div>
        <div>
            <Link to={"/"} className="bg-gray-300 flex items-center px-2 rounded pb-1 hover:bg-gray-400 transition-all hover:shadow">Will Open</Link>
        </div>
        <div>
            <Link to={"/"} className="bg-blue-600 text-white flex items-center px-2 rounded pb-1 hover:bg-blue-700 transition-all hover:shadow">Create Market</Link>
        </div>
      </div>
    </nav>
  );
}
