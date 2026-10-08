
// import Comp1 from './Components/Comp1'
// import Comp2 from './Components/Comp2'
// import Comp3 from './Components/Comp3'
import { useState } from 'react'
import Navbar from './Components/Navbar'
import Hero from './Components/Hero'
import Contact from './Components/Contact'
import Footer from './Components/Footer'
const App = () => {
    let [count, setcount] = useState(0)
    let butonListner = () =>{



    }
  return (
    <div className='bg-gray-800 h-screen w-screen text-white p-2  '>
       {/* <Navbar/>
       <Hero/>
       <Contact/>
       <Footer/> */}
       <h1>Count is - {count}</h1>
       <button
       onClick={()=>{
        setcount(count+1)
       }}
       id = 'btn' className='border-2 p-2 rounded-2xl'>Increment</button>
    </div>
  )
}

export default App