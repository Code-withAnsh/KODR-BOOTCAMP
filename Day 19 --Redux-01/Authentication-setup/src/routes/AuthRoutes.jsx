import {createBrowserRouter, RouterProvider} from 'react-router'
import AuthLayout from '../Layout/AuthLayout'
import Login from '../pages/Login'
import Register from '../pages/Register'
import MainLayout from '../Layout/MainLayout'
import HomePage from '../pages/HomePage'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { addUser } from '../features/AuthSlice'
import { useEffect } from 'react'

const AuthRoutes = () => {


    let dispatch  = useDispatch()

    const hydrateuser = () =>{
        let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
        if(!loggedInUser){
            toast.error('user not logged in')
            return
        }
        dispatch(addUser(loggedInUser));
    }
    useEffect(() => {
        hydrateuser()
    
     
    }, [])
    

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