import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import LoadingPage from "./pages/LoadingPage";
import ISale from "./pages/ISale";
import NavBar from "./components/NavBar";
import InterestPage from "./pages/InterestPage";
import ISalePage from "./pages/ISalePage";
import MyPage from "./pages/MyPage";
import { useEffect } from "react";
import ISaleInterest from "./components/ISaleInterest";
import LandInterest from "./components/LandInterest";

function App() {
  useEffect(() => {
    const t = {
      token:
        "eyJhbGciOiJIUzI1NiJ9.eyJpZCI6ImZmOWEwMmY1LTIwMTMtNDExMS04MmY3LTUxMjk2NTBlYjhhMCIsIm5pY2tuYW1lIjoidGVzdDMiLCJiaXJ0aERheSI6IjIwMjQtMDUtMTQiLCJleHAiOjE3MTYyNjMxNzN9.UT5NhS1cURx3ffBv2QfwIMwCtZFSP5Q7n8TAIJttyU0",
      tokenType: "Bearer",
    };
    localStorage.setItem("token", JSON.stringify(t));
  }, []);
  return (
    <>
      <BrowserRouter>
        <NavBar></NavBar>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/loading" element={<LoadingPage />} />
          <Route path="/iSale" element={<ISale />} />
          {/* <Route path="/interest" element={<InterestPage />} /> */}
          {/* <Route path="/isale" element={<ISalePage />} /> */}
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/iSale/interest" element={<ISaleInterest />} />
          <Route path="/lands/interests" element={<LandInterest />} />

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
