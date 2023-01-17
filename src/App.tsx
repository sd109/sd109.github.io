import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
} from "react-router-dom";

// Make sure bootstrap css is first so we can override it
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/App.css';

import { Header } from "./components/Header";
import { NavBar } from "./components/NavBar";
import { Home } from "./components/Home";
import { About } from "./components/About";
import { TetrisGame } from "./components/tetris/TetrisGame";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
        { 
          path: "/",
          element: <Home />
        },
        {
          path: "about",
          element: <About />
        },
        {
          path: "test",
          element: (
            <div style={{padding: "2em"}}>
              <div>Test</div>
              <div>Test</div>
              <div>Test</div>
            </div>
          )
        },
        {
          path: "tetris",
          element: <TetrisGame />
        },
    ]
  }
]);


function Layout() {
  // <Outlet /> component is used to capture route children in nested react router construct
  return (
      <div>
        <Header />
        {/* <NavBar /> */}
        <Outlet />
      </div>
  )
}

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
