import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://api.audius.co/v1/tracks/",
});