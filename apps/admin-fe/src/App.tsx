import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./pages/home";
import MainLayout from "./layouts/main-layout";
import CreateMarket from "./pages/create-market";
import Login from "./pages/login";
import Register from "./pages/register";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/create-market" element={<CreateMarket />} />
        </Route>

        <Route>
          <Route path="/auth/login" element = {<Login />}/>
          <Route path="/auth/register" element = {<Register />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
