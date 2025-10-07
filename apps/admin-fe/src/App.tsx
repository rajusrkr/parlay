import { BrowserRouter, Route, Routes } from "react-router";
import Login from "./pages/login";
import ConsoleLayout from "./layout/ConsoleLayout";
import Console from "./pages/console";
import Leaderboard from "./pages/leaderboard";
import AddNewMarket from "./pages/add-new-market";
import MarketById from "./pages/market-id";
import EditMarket from "./pages/edit-market";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<ConsoleLayout />}>
          <Route path="/admin/console" element={<Console />} />
          <Route path="/admin/leaderboard" element={<Leaderboard />} />
          <Route path="/admin/add-new-market" element={<AddNewMarket />} />
          <Route path="/admin/market/:id" element={<MarketById />} />
          <Route path="/admin/market/edit/:id" element={<EditMarket />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
