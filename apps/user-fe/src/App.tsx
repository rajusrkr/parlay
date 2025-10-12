import { BrowserRouter, Route, Routes } from "react-router";
import Login from "./pages/login";
import Signup from "./pages/signup";
import LandingPage from "./pages/landing-page";
import HomeLayout from "./layouts/home-layout";
import MarketLayout from "./layouts/market-layout";
import Market from "./pages/market";
import Positions from "./pages/positions";
import Orders from "./pages/orders";
import MarketById from "./pages/market-byId";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<HomeLayout />}>
          <Route path="/" element={<LandingPage />} />
        </Route>
        <Route element={<MarketLayout />}>
          <Route path="/market" element={<Market />} />
          <Route path="/market/:id" element={<MarketById />} />
          <Route path="/positions" element={<Positions />} />
          <Route path="/orders" element={<Orders />} />
        </Route>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}
