import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Main from "./components/Main";
import SignUp from "./components/SignUp";
import Register from "./components/Register";
import AllTasks from "./components/AllTasks";
import Audio from "./components/Audio";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <SignUp />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/main",
      element: <Main />,
    },
    {
      path: "/alltasks",
      element: <AllTasks />,
    },
    {
      path: "/audio",
      element: <Audio />,
    }
  ]);

  return <RouterProvider router={router} />;
}

export default App;
