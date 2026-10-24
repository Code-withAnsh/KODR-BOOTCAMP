import { useDispatch, useSelector } from "react-redux"
import { decrement, increment } from "./features/CounterSlice";


const App = () => {
const dispatch = useDispatch()
 const {count} =  useSelector((store)=>
store.counter

)
  return (
    <div className="h-screen w-screen bg-gray-800 p-4 text-white text-2xl font-extrabold">
      <h1>The count is - {count}</h1>
      <button
      onClick={()=>dispatch(increment())}
      >inc</button>
      <button
      onClick={()=>dispatch(decrement())}
      >dec</button>
    </div>
  );
}

export default App