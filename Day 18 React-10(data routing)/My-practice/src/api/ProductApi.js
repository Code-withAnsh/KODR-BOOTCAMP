import { axiosInstance } from "../Config/AxiosInstance";

export let getAllproductsApi = async () => {

    try {
        let response = await axiosInstance.get("/products")
        return response.data;
        
    } catch (error) {
        alert("data not fetched",error)
    }
    
}