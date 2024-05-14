import axios from "axios";
export const api = async (url, method, body) => {
  axios.defaults.baseURL = "http://localhost:8000";
  const res = await axios({
    url,
    method,
    data: body,
    headers: {
      Authorization: localStorage.getItem("id"),
    },
  });
  return res;
};
