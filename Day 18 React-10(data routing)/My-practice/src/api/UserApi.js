
import { axiosInstance } from "../Config/AxiosInstance"
export let getUsersnameapi = async () => {
try {
    let response = await axiosInstance.get("/users");
    return response.data;

    
} catch (error) {
    alert('error',error)
}    
}