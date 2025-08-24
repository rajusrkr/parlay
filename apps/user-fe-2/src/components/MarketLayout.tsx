import { Outlet } from "react-router";
import Navbar from "./navbar";

export default function MarketLayout(){
    return(
        <div>
            <Navbar />
            <main>
                <Outlet />
            </main>
        </div>
    )
}