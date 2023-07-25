import axios from "axios";
import { ENDPOINT, EXPIRE_DATE, IMG_URl, ROLE, TOKEN } from "../const";
import Cookies from "js-cookie";



const token = Cookies.get(TOKEN);
console.log(token);
export const request = axios.create({
  baseURL: ENDPOINT,
  timeout: 10000,
  headers: {
    Authorization: token ? `Bearer ${token}` : "",
  },
});

export function setAuthCookies({ token, role, expire }) {
  Cookies.set(TOKEN, token);
  Cookies.set(ROLE, role);
  Cookies.set(EXPIRE_DATE, expire);
}




// geting all categories
export const fetchCategories = async () => {
  const result = await request.get('category')
  return result.json();
}

//getting the latest post
export const latestPost = async () => {
 const result = await request.get('post/lastone')
 return result.json();
}

