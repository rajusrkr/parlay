import { BrowserRouter, Route, Routes } from "react-router"
import Login from "./pages/login"
import ConsoleLayout from "./layout/ConsoleLayout"
import Console from "./pages/console"
import Leaderboard from "./pages/leaderboard"
import AddNewMarket from "./pages/add-new-market"

function App() {
  return (
  <BrowserRouter>
    <Routes>
      <Route path="/" element = {<Login />}/>

      <Route element = {<ConsoleLayout />}>
        <Route path="/admin/console" element = {<Console />}/>
        <Route path="/admin/leaderboard" element = {<Leaderboard />}/>
        <Route path="/admin/add-new-market" element = {<AddNewMarket />}/>
      </Route>
    </Routes>
  </BrowserRouter>
  )
}

export default App
