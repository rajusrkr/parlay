import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./pages/home";
import OpenMarkets from "./pages/markets";
import Signin from "./pages/signin";
import TradeCanvas from "./pages/TradeCanvas";

const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
      <Home />
      </>
    )
  }, 
  {
    path: "/market",
    element: (
      <>
      <OpenMarkets />
      </>
    )
  },
  {
    path: "/market/:id",
    element: (
      <>
        <TradeCanvas />
      </>
    )
  },
  {
    path: "/auth/signin",
    element: (
      <>
      <Signin />
      </>
    )
  }
])

export default function App(){
  return <RouterProvider router={routes}/>
}