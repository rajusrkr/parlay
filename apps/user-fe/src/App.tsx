import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./pages/home";
import OpenMarkets from "./pages/markets";
import Signin from "./pages/signin";
import TradeCanvas from "./pages/trade-canvas";
import MainLayout from "./layouts/main-layout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* General routes */}
        <Route path="/auth/signin" element={<Signin />} />
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/market" element={<OpenMarkets />} />
          <Route path="/market/:id" element={<TradeCanvas />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
