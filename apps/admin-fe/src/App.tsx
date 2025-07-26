import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./pages/home";
import MainLayout from "./layouts/main-layout";

export default function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route element = {<MainLayout />}>

        <Route path="/" element = {<Home />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}