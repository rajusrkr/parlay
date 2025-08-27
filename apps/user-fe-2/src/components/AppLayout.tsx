import { Outlet } from "react-router";
import Navbar from "./navbar";
import MarketFilterbar from "./market-filter-bar";
import { SocketProvider } from "./web-socket/socketContext";

export default function AppHomeLayout() {
  return (
    <div>
      <Navbar />
      <MarketFilterbar />
      <main>
        <SocketProvider>
          <Outlet />
        </SocketProvider>
      </main>
    </div>
  );
}
