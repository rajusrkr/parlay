import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./pages/home";
import OpenMarkets from "./pages/markets"
import Signin from "./pages/signin";
import TradeCanvas from "./pages/TradeCanvas";

export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        {/* General routes */}
        <Route path="/" element = {<Home />}/>
        <Route path="/market" element = {<OpenMarkets />}/>
        <Route path="/auth/signin" element = {<Signin />}/>
        <Route path="/market/:id" element = {<TradeCanvas />}/>
      </Routes>
    </BrowserRouter>
  )
}