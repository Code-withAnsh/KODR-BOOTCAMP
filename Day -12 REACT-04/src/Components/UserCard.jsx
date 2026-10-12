import { useContext } from "react"
import { MyData } from "../Context/MyContext"

const UserCard = ({user})=>{
const {userData,setuserData} = useContext(MyData)
const deleteHandler = (id) => {  
  setuserData((previousUsers) =>
    previousUsers.filter((user) => user.id !== id),
  );
};
  return (

   
<article className="w-full max-w-sm overflow-hidden rounded-2xl bg-white text-gray-800 shadow-lg">
      <img
        src={user.imageURL}
        alt={`${name}'s profile`}
        className="h-56 w-full object-cover"
      />
      <div className="p-5">
        <h2 className="truncate text-xl font-bold">{user.name}</h2>
        <p className="mt-1 truncate text-sm text-gray-500">{user.email}</p>
        <div className="mt-5 flex justify-between gap-4">
          <button
            type="button"
            className="flex-1 rounded-lg bg-emerald-100 px-4 py-2 font-semibold text-emerald-700 transition hover:bg-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-300"
          >
            Update
          </button>
          <button
          onClick={()=>deleteHandler(user.id)}
            type="button"
            className="flex-1 rounded-lg bg-red-100 px-4 py-2 font-semibold text-red-700 transition hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-300"
          >
            Delete
          </button>
        </div>
      </div>
    </article>

    
  

  )
}

export default UserCard