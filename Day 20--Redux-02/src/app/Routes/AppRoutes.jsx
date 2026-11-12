import { createBrowserRouter, RouterProvider } from "react-router"

import AuthLayout from "../layout/AuthLayout";
import Login from "../../features/Auth/UI/pages/Login";
import Register from "../../features/Auth/UI/pages/register";
import { toast } from "react-toastify";
import { addUser } from "../../features/auth/state/authSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import MainLayout from "../layout/MainLayout";
import SongList from "../../features/components/SongListCard";
import Homepage from "../../features/Shared/UI/Pages/HomePage";
import AlbumSongPage from "../../features/Shared/UI/Pages/SongPage";




const Approutes = () =>{

    let dispatch = useDispatch()

        const hydrateuser = () => {
          let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
          if (!loggedInUser) {
            toast.error("user not logged in");
            return;
          }
          dispatch(addUser(loggedInUser));
        };
        useEffect(() => {
          hydrateuser();
        }, []);

    const router = createBrowserRouter([
      {
        Path: "/",
        element: <AuthLayout />,
        children: [
          {
            index: true,
            element: <Login />,
          },
          {
            path: "register",
            element: <Register />,
          },
          {
            path: "home",
            element: <Homepage/>,
          },
        ],
      },
      {
        path: "main",
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <Homepage />,
          },
          {
            path: "songlist",
            element: <SongList />,
          },
          {
            path: "songpage",
            element: < AlbumSongPage/>,
          },
        ],
      },
    ]);

    return <RouterProvider router = {router} />;

    }
export default Approutes;
