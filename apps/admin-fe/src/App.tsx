import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./pages/home";
import MainLayout from "./layouts/main-layout";
import CreateMarket from "./pages/create-market";

export default function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route element = {<MainLayout />}>
        <Route path="/" element = {<Home />}/>
        <Route path="/create-market" element = {<CreateMarket />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}