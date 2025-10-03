import { Outlet } from "react-router";
import ConsoleNavbar from "../components/ConsoleNavbar";

export default function ConsoleLayout(){
    return(
        <div>
            <ConsoleNavbar />
            <main className="max-w-7xl mx-auto px-2">
                <Outlet />
            </main>
        </div>
    )
}