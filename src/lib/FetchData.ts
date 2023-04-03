import axios, { AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { Endpoints } from "./Endpoints";

interface FetchDataParams {
  type: "GET" | "POST";
  route: string;
  data?: any;
}
const token = Cookies.get("admin_token");

const FetchData = async ({ type, route, data }: FetchDataParams) => {
  if (!token && route !== Endpoints.AdminLogin) {
    return { auth: false };
  } else {
    const config: AxiosRequestConfig = {
      method: type,
      baseURL: "http://localhost:8080".concat(route),
      // baseURL: "https://timothy-siwes-api.onrender.com".concat(route),
      headers: { "x-access-token": token },
      data: type === "POST" ? data : "",
    };
    const response: any = await axios.request(config);
    return response;
  }
};

export { FetchData };
