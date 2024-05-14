import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import LoadingPage from "./pages/LoadingPage";
import ISale from "./pages/ISale";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/loading" element={<LoadingPage />} />
          <Route path="/iSale" element={<ISale />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
