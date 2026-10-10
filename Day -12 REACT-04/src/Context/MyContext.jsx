import { createContext } from "react"

 export let MyData = createContext()

export const ContextProvider = ({children})=>{
    let name = "ansh"
    return <MyData.Provider value = {{name}} > {children}</MyData.Provider>
}


