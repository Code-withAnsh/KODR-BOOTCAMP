import { useEffect, useState } from "react";
import { getUsersnameapi } from "../../api/UserApi";
import UserCard from "../../Components/UserCard";

const UsersPage = () => {
  const [userData, setuserData] = useState([]);
  let getUser = async () => {
    let response = await getUsersnameapi();
    setuserData(response.users);
  };
  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {userData.map((val) => (
        <UserCard key={val.id} user={val} />
      ))}
    </div>
  );
};

export default UsersPage;
