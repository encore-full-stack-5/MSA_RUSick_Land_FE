import React, { useEffect } from "react";
import axios from "axios";

function LoadingPage() {
  function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const tokenType = params.get("tokenType");

    return { token, tokenType };
  };

  useEffect(() => {
    const {token, tokenType} = getQueryParams();
    const login = async () => {
      try {
        const url = "http://192.168.0.19:8000/api/v1/auth/login";
        const headers = {
          "Content-Type": "application/json",
          "Authorization": tokenType + " " + token
        };
        const response = await axios.post(url, {}, { headers: headers });
        const newToken = {
          token: response.data.token,
          tokenType: response.data.tokenType
        };
        localStorage.setItem("token", JSON.stringify(newToken));
        if(localStorage.getItem("token") != null) {
          window.location.href = "http://192.168.0.19:5173"
        }else {
          alert("로그인 실패");
          window.history.back();
        }
      } catch (error) {
        setError(error);
        console.log(error);
        alert("로그인 실패");
      }
    };
    login();
  }, []);
  

  return (
    <>
      <div>로딩중...</div>
    </>
  );
}

export default LoadingPage;
