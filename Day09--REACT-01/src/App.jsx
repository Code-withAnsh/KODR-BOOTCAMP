
// import Comp1 from './Components/Comp1'
// import Comp2 from './Components/Comp2'
// import Comp3 from './Components/Comp3'
import { useState } from 'react'
const App = () => {
    let [count, setcount] = useState(0)
  return (
    <div className='bg-gray-800 h-screen w-screen text-white '>
        <h1>Count is {count}</h1>
        <button className='rounded-[20px] border-2 p-2'
        onClick={() => setcount(currentCount => currentCount + 1)}
        >Increment</button>
    </div>
  )
}

export default App