import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./pages/home";
import OpenMarkets from "./pages/open-markets";

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
    path: "/open-markets",
    element: (
      <>
      <OpenMarkets />
      </>
    )
  }
])

export default function App(){
  return <RouterProvider router={routes}/>
}