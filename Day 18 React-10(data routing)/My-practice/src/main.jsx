
import { createRoot } from 'react-dom/client'
import './index.css'

import {  createBrowserRouter, RouterProvider } from 'react-router'
import { AuthProvider } from './Context/AuthContext.jsx';
import ProtectedRoute from './Routes/ProtectedRoute.jsx';
import MainLayout from './pages/Layouts/MainLayout.jsx';
import HomePage from './pages/MainPages/HomePage.jsx';
import AuthLayout from './pages/Layouts/AuthLayout.jsx';
import LoginPage from './pages/AuthPages/LoginPage.jsx';
import Registerpage from './pages/AuthPages/Registerpage.jsx';
import ProductCard from './Components/ProductCard.jsx';
import ProductPage from './pages/MainPages/ProductPage.jsx';
import UsersPage from './pages/UserPage/UsersPage.jsx';


let router = createBrowserRouter([
    {
        path:"/",
        element:<AuthLayout/>,
        children:[
            {
                index:true,
                element:<LoginPage/>
            },{
                path:"register",
                element:<Registerpage/>
            }
        ]
    }
  ,{
    path: "/main",
    element: <ProtectedRoute />,
    children: [
      {
        path: "",
        element: <MainLayout />,
        children: [
          {
            index: true,
            element:<HomePage/>
          },
          {
            path:"products",
            element:<ProductPage/>
          },{
            path:"users",
            element:<UsersPage/>
          }
       
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <AuthProvider>
 <RouterProvider router={router}/>
  </AuthProvider>,
);
