import { Outlet } from "react-router"
import Navbar from "../../Components/Navbar"


const MainLayout = () => {

  return (
    <div className="flex h-screen overflow-hidden">

        <Navbar/>
        <main className="min-w-0 flex-1 overflow-y-auto p-6">
            <Outlet/>
        </main>
    </div>
  )
}

export default MainLayout