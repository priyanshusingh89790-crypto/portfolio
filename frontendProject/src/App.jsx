import { RouterProvider, createBrowserRouter,Outlet } from "react-router-dom";
import Login from "./assets/components/Login";
import Dashboard from "./assets/components/Dashboard";
import Header from "./assets/components/Header";
import Register from "./assets/components/Register";

const AppLayout =()=>{
  return (
    <>
    <Header/>
    <Outlet/>
    </>
  )
}
const router = createBrowserRouter([
  {
    path:"/",
    element: <AppLayout/>,
    children:[
      {
        index:true,
        element: <Login/>,
      },
      {
        path: "register",
        element: <Register/>
      },
      {
        path: "dashboard",
        element: <Dashboard/>
      },
    ],
  },
]);
export default function App(){
  return <RouterProvider router={router}/>
}