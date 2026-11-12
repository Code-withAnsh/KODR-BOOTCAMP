import { toast } from "react-toastify"
import { axiosInstance } from "../../../config/AxiosInstance"

export let getAlbumApi = async () => {
    try {

let album = await axiosInstance.get("/search")
return album.data

        
    } catch (error) {
        toast.error(error)
        return
        
    }

    
}
