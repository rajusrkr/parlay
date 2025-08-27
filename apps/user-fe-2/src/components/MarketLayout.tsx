import { Outlet } from "react-router";
import Navbar from "./navbar";
import { SocketProvider } from "./web-socket/socketContext";

export default function MarketLayout() {
  return (
    <div>
      <Navbar />
      <main>
        <SocketProvider>
          <Outlet />
        </SocketProvider>
      </main>
    </div>
  );
}
