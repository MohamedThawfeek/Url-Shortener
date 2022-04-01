import axios from "axios";

const instance = axios.create({
  baseURL: "https://my-first-app-url-shortener.herokuapp.com",
});

export default instance;
