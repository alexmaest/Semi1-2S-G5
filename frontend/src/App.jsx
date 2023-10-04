import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Routes/Home";
import Login from "./Routes/Login";
import Register from "./Routes/Register";
import Recognition from "./Routes/Recognition";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
      errorElement: <h1>404 Not Found</h1>,
    },
    {
      path: "/login",
      element: <Login />,
      errorElement: <h1>404 Not Found</h1>,
    },
    {
      path: "/registrarse",
      element: <Register />,
      errorElement: <h1>404 Not Found</h1>,
    },
    {
      path: "/reconocimiento",
      element: <Recognition />,
      errorElement: <h1>404 Not Found</h1>,
    }
  ]);
  return <RouterProvider router={router} />;
}

export default App
