import { createBrowserRouter } from "react-router"
import AuthLayout from "../Layout/AuthLayout"
import Login from "../Pages/Login"
import Register from "../Pages/Register"
import Mainlayout from "../Layout/Mainlayout"
import Home from "../Pages/Home"
import About from "../Pages/About"
import { RouterProvider } from "react-router/dom"

const AppRoutes = () => {
    let router = createBrowserRouter([
        {
path:"/",
element:<AuthLayout/>,
children:[
    {
        index:true,
        element:<Login/>
    },
    {
        path:"register",
        element:<Register/>
    }
]
        },
        {

            path:"/main",
            element:<Mainlayout/>,
            children:[
                {
                    index:true,
                    element:<Home/>
                },
                {
                    path:"About",
                    element:<About/>
                },
              
            ]
        }
    ])

    return <RouterProvider router={router} />
}

export default AppRoutes