import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import LoadingPage from "./pages/LoadingPage";
import NavBar from "./components/NavBar";
import InterestPage from "./pages/InterestPage";
import ISalePage from "./pages/ISalePage";
import MyPage from "./pages/MyPage";
import { useEffect } from "react";
import axios from "axios";

function App() {
  function refresh() {
    const token = JSON.parse(localStorage.getItem("token"));
    if(token != null){
      refreshApi(token);
    }
  };
  
  const refreshApi = async (token) => {
    try {
      const url = "http://192.168.0.19:8000/api/v1/auth/refresh";
      const headers = {
        "Content-Type": "application/json",
        "Authorization": token.tokenType + " " + token.token
      };
      const response = await axios.get(url, { headers: headers });
      const newToken = {
        token: response.data.token,
        tokenType: response.data.tokenType
      };
      localStorage.setItem("token", JSON.stringify(newToken));
      refreshTimout()
    } catch (error) {
      console.log(error);
      alert("재발급 실패");
    }
  };
  const refreshTimout=()=>{
    setTimeout(refresh, 180000);
  }
  useEffect(() => {
    refreshTimout();
  },[])
  return (
    <>
      <BrowserRouter>
      <NavBar></NavBar>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/loading" element={<LoadingPage />} />
          <Route path="/interest" element={<InterestPage />} />
          <Route path="/isale" element={<ISalePage />} />
          <Route path="/mypage" element={<MyPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
