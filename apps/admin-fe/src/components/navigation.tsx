import { Link } from "react-router";

export default function Navigation() {
  return (
    <nav className="bg-gray-200 h-14 px-10 flex justify-between items-center">
      <div className="flex gap-4">
        <h2 className="text-3xl">
          PredictX <span className="border px-1 py-1 rounded bg-black text-white">admin</span>
        </h2>
        <Link to={"/auth/login"} className="bg-blue-600 px-3 py-1 rounded text-white hover:bg-blue-700">Login</Link>
      </div>

      <div className="flex gap-6 text-xl">
        <div className="bg-gray-300 flex items-center px-4 rounded py-1 transition-all hover:shadow-2xl border-b-2 border-blue-600 hover:bg-gray-600 hover:text-white">
          <Link to={"/"}>Open</Link>
        </div>
        <div className="bg-gray-300 flex items-center px-4 rounded py-1 transition-all hover:shadow-2xl border-b-2 border-blue-600 hover:bg-gray-600 hover:text-white">
            <Link to={"/"}>Settled</Link>
        </div>
        <div className="bg-gray-300 flex items-center px-4 rounded py-1 transition-all hover:shadow-2xl border-b-2 border-blue-600 hover:bg-gray-600 hover:text-white">
            <Link to={"/"}>Will Open</Link>
        </div>
        <div className="bg-blue-600 text-white rounded px-2 py-1 hover:bg-blue-700 transition-all hover:shadow">
            <Link to={"/create-market"}>Create Market</Link>
        </div>
      </div>
    </nav>
  );
}
