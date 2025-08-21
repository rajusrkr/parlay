import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./pages/home";
import MainLayout from "./layouts/main-layout";
import CreateMarket from "./pages/create-market";
import Login from "./pages/login";
import Register from "./pages/register";
import Open from "./pages/open";
import WillOpen from "./pages/will-open";
import Settled from "./pages/settled";
import Cancelled from "./pages/cancelled";
import MarketById from "./pages/market-by-id";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/market/create" element={<CreateMarket />} />
          <Route path="/market/open" element={<Open />} />
          <Route path="/market/will-open" element={<WillOpen />} />
          <Route path="/market/settled" element={<Settled />} />
          <Route path="/market/cancelled" element={<Cancelled />} />
          <Route path="/market/:id" element = {<MarketById />}/>
        </Route>

        <Route>
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
