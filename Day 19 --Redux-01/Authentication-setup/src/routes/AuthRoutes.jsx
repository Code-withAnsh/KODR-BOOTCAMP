import {createBrowserRouter, RouterProvider} from 'react-router'
import AuthLayout from '../Layout/AuthLayout'
import Login from '../pages/Login'
import Register from '../pages/Register'
import MainLayout from '../Layout/MainLayout'
import HomePage from '../pages/HomePage'

const AuthRoutes = () => {

    let route = createBrowserRouter([
{
    path:"/",
    element:<AuthLayout/>,
    children:[
        {
            path:"",
            element:<Login/>
        },
        {
            path:"register",
            element:<Register/>
        }
    ]
},{
    path:"main",
    element:<MainLayout/>,
    children:[
        {
            path:"",
            element:<HomePage/>
        }
    ]
}

    ])
  return (
<RouterProvider router={route}/>
  )
}

export default AuthRoutes