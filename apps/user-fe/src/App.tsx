import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./pages/home";
import OpenMarkets from "./pages/markets";
import MyChart from "./pages/market-by-id";

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
        <MyChart />
      </>
    )
  }
])

export default function App(){
  return <RouterProvider router={routes}/>
}