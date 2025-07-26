import { Outlet } from "react-router";
import Navigation from "../components/navigation";

export default function MainLayout(){
    return (
        <div>
            <Navigation />
            <main>
                <Outlet />
            </main>
        </div>
    )
}