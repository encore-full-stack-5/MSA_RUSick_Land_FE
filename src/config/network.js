import axios from "axios";

export const api = async (url, method, body) => {
  axios.defaults.baseURL = "http://localhost:8000/api/v1/";
  const token = JSON.parse(localStorage.getItem("token"));
  const res = await axios({
    url,
    method,
    data: body,
    headers: {
      Authorization: "Bearer " + token.token,
    },
  });

  return res;
};
