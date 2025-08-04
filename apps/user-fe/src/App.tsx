import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./pages/home";
import OpenMarkets from "./pages/markets";
import Signin from "./pages/signin";
import MainLayout from "./layouts/main-layout";
import MarketById from "./pages/market-by-id";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* General routes */}
        <Route path="/auth/signin" element={<Signin />} />
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/market" element={<OpenMarkets />} />
          <Route path="/market/:id" element={<MarketById />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
