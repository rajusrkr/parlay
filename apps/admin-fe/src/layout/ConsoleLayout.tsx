import { Outlet } from "react-router";
import ConsoleNavbar from "../components/ConsoleNavbar";

export default function ConsoleLayout(){
    return(
        <div>
            <ConsoleNavbar />
            <main className="max-w-7xl mx-auto">
                <Outlet />
            </main>
        </div>
    )
}