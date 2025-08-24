import { BrowserRouter, Route, Routes } from "react-router";
import Login from "./pages/login";
import Register from "./pages/register";
import Home from "./pages/home";
import MarketById from "./pages/market/by-id";
import AppHomeLayout from "./components/AppLayout";
import MarketLayout from "./components/MarketLayout";
import Markets from "./pages/market/markets";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* frontend route will go here */}
        <Route>
          <Route path="/" element={<Home />} />
        </Route>

        {/* auth route */}
        <Route path="auth/login" element={<Login />} />
        <Route path="auth/register" element={<Register />} />

        {/* market routes */}
        <Route element={<AppHomeLayout />}>
          <Route path="/markets" element={<Markets />} />
        </Route>

        <Route element={<MarketLayout />}>
          <Route path="/market/:id" element={<MarketById />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
