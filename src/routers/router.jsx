import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from "../App";
import Home from "../home/Home";
import About from "../components/About";
import Blog from "../components/Blog";
import DashboardLayout from "../dashboard/DashboardLayout";
import Dashboard from "../dashboard/Dashboard";
import Profile from "../components/Profile";
import UploadNotes from "../components/UploadNotes";
import ManageNotes from "../components/ManageNotes";
import EditNote from "../components/EditNote";
import Signup from "../components/Signup";
import Login from "../components/Login";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import Logout from "../components/Logout";
import ErrorPage from '../components/ErrorPage';
import NotesShop from "../components/NotesShop";
import NoteDetails from "../components/NoteDetails";
import Favorites from "../components/Favorites";
import UserDetails from "../components/UserDetails";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/about',
        element: <About />
      },
      {
        path: '/blog',
        element: <Blog />
      },
      {
        path: '/upload',
        element: <PrivateRoute><UploadNotes /></PrivateRoute>
      },
      {
        path: '/notes',
        element: <NotesShop />
      },
      {
        path: '/favorites',
        element: <PrivateRoute><Favorites /></PrivateRoute>
      },
      {
        path: '/user-details',
        element: <PrivateRoute><UserDetails /></PrivateRoute>
      },
      {
        path: '/notes/:id',
        element: <NoteDetails />
      }
    ]
  },
  {
    path: "/admin/dashboard",
    element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
    children: [
      {
        path: "/admin/dashboard",
        element: <PrivateRoute><Dashboard /></PrivateRoute>
      },
      {
        path: "/admin/dashboard/profile",
        element: <Profile />
      },
      {
        path: "/admin/dashboard/upload",
        element: <PrivateRoute><UploadNotes /></PrivateRoute>
      },
      {
        path: "/admin/dashboard/manage",
        element: <PrivateRoute><ManageNotes /></PrivateRoute>
      },
      {
        path: "/admin/dashboard/edit-note/:id",
        element: <PrivateRoute><EditNote /></PrivateRoute>,
        loader: ({ params }) => fetch(`${import.meta.env.VITE_API_URL}/api/notes/${params.id}`)
      }
    ]
  },
  {
    path: "/profile",
    element: <PrivateRoute><Profile /></PrivateRoute>
  },
  {
    path: "sign-up",
    element: <Signup />
  },
  {
    path: "login",
    element: <Login />
  },
  {
    path: "logout",
    element: <Logout />
  }
]);

export default router;
