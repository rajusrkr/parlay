import { Outlet } from "react-router";
import HomeNavbar from "../components/HomeNavbar";

export default function HomeLayout() {
  return (
    <div>
        <HomeNavbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
