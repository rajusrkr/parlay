import HeaderNavigation from "@/components/header-navigation";
import { Outlet } from "react-router";

export default function MainLayout(){
    return(
        <div>
            <HeaderNavigation />
            <main>
                <Outlet />
            </main>
        </div>
    )
}