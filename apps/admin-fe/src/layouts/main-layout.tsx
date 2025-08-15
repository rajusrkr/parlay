import { Outlet } from "react-router";
import Navigation from "../components/navigation";
import MarketCategoryBar from "../components/market-category-bar";

export default function MainLayout(){
    return (
        <div>
            <Navigation />
            <MarketCategoryBar />
            <main>
                <Outlet />
            </main>
        </div>
    )
}