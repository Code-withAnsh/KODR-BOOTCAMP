import { createContext, useState } from "react"

 export let MyData = createContext()

export const ContextProvider = ({children})=>{

    const [userData, setuserData] = useState([])
    const [toggle, settoggle] = useState(false)
  const [isEditedUser, setIsEditedUser] = useState(null);

    return <MyData.Provider value = {{userData,setuserData,toggle,settoggle,isEditedUser,setIsEditedUser}} > {children}</MyData.Provider>
}


