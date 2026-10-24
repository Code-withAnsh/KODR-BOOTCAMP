import { useDispatch, useSelector } from "react-redux";
import { decrement, increment } from "./features/CounterSlice";

const App = () => {
  //pahle hm data lete ke liye use kar rhe the createcontext
  //but ab we use useSelector

  let {count} = useSelector((store) => store.counter);

  let dispatch = useDispatch();
  return (
    <div className="h-screen w-screen bg-gray-800 text-white font text-2xl p-5 ">
      <h1>My count is- {count}</h1>
      <div className="flex gap-5">
        <button
          onClick={() => dispatch(increment())}
          className="border-2 px-1 py-1 rounded-2xl bg-green-600 text-black mt-5"
        >
          Increment
        </button>
        <button
          onClick={() => dispatch(decrement())}
          className="border-2 px-1 py-1 rounded-2xl bg-red-600 text-black mt-5"
        >
          decrement
        </button>
      </div>
    </div>
  );
};

export default App;
