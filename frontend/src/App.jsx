import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Routes/Home";
import Login from "./Routes/Login";
import Register from "./Routes/Register";
import Recognition from "./Routes/Recognition";
import MainPage from "./Routes/Mainpage";
import Friends from "./Routes/Friends";
import Chat from "./Routes/Chat";
import Profile from "./Routes/Profile";
import Bot from "./Routes/Bot";
import Confirm from "./Routes/Confirm";

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
      path: "/confirmar",
      element: <Confirm />,
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
    },
    {
      path: "/inicio",
      element: <MainPage />,
      errorElement: <h1>404 Not Found</h1>,
    },
    {
      path: "/friends",
      element: <Friends />,
      errorElement: <h1>404 Not Found</h1>,
    },
    {
      path: "/chat",
      element: <Chat />,
      errorElement: <h1>404 Not Found</h1>,
    },
    {
      path: "/perfil",
      element: <Profile />,
      errorElement: <h1>404 Not Found</h1>,
    },
    {
      path: "/bot",
      element: <Bot />,
      errorElement: <h1>404 Not Found</h1>,
    }
  ]);
  return <RouterProvider router={router} />;
}

export default App
