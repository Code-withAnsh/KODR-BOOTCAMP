const UserCard = ({user,handleDelete,handleUpdate}) => {
  return (
    <div className="flex flex-wrap gap-4 ">

        <div
          className="w-80 overflow-hidden rounded-2xl bg-white text-gray-800 shadow-lg"
        >
          <img
            className="h-45 w-full object-cover"
            src={user.imageURL}
            alt="User"
          />
          <div className="p-5">
            <h1 className="text-2xl font-semibold">{user.name}</h1>
            <p className="mt-1 text-gray-500">{user.email}</p>
            <div className="mt-5 flex justify-between">
              <button className="rounded-lg bg-green-600 px-4 py-2 text-white"
              onClick={()=>handleUpdate(user)}
              >

                Update
              </button>
              <button
              onClick={()=>{
                handleDelete(user.id)
              }}
              className="rounded-lg bg-red-600 px-4 py-2 text-white">
                Delete
              </button>
            </div>
          </div>
        </div>

    </div>
  );
}
    

export default UserCard;
