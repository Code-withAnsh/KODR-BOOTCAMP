import { createContext, useContext, useState } from "react";


 export const Auth = createContext();

export const AuthProvider = ({ children }) => {

    const [registeredUsers, setregisteredUsers] = useState(
      JSON.parse(localStorage.getItem("registeredUsers")) || [],
    );

    const [loggedInUser, setloggedInUser] = useState(
      JSON.parse(localStorage.getItem("loggedInUser" )),
    );

    const [toggle, settoggle] = useState(false)
  return (
    <Auth.Provider
      value={{
        registeredUsers,
        setregisteredUsers,
        loggedInUser,
        setloggedInUser,
        toggle,
        settoggle,
      }}
    >
      {children}
    </Auth.Provider>
  );
}
export const useContextData = () => useContext(Auth);
