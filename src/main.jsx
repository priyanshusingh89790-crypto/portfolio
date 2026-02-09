import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Header from "./components/Header";
import Body from "./components/Body";
import About from "./components/About";
import Skills from "./components/Skills";
import { Outlet } from "react-router-dom";
import Project from "./components/Project";
import Contact from "./components/Contact";
import { store } from "./utils/store";
import { Provider } from "react-redux";
const AppLayout = () => {
  return (
    <Provider store={store}>
    <div>
      <Header />
      <Outlet />
      <Body />
      <About />
      <Skills />
      <Project />
      <Contact />
    </div>
    </Provider>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
