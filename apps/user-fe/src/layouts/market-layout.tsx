import { Outlet } from "react-router";
import MarketNavbar from "../components/MarketNavbar";

export default function MarketLayout() {
  return (
    <div>
      <MarketNavbar />
      <main className="max-w-7xl mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );
}
