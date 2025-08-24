import { Outlet } from "react-router";
import Navbar from "./navbar";
import MarketFilterbar from "./market-filter-bar";

export default function AppHomeLayout(){
    return (
        <div>
            <Navbar />
            <MarketFilterbar />
            <main>
                <Outlet />
            </main>
        </div>
    )
}