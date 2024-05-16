import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../css/NavBar.css";
function NavBar() {
    const [loginState, setLoginState] = useState(null);
    const login = () => {
        if(loginState) {
            localStorage.removeItem("token");
            window.location.href =
                "http://192.168.0.19:5173"
        }else {
            window.location.href =
                "http://192.168.0.12:5173/signin?redirect=" +
                "http://192.168.0.19:5173/" +
                "loading";
            };
        }
    useEffect(() => {
        setLoginState(localStorage.getItem("token") == null ? false : true);
    }, []);

  return (
    <>
      <div
        className="flex space-x-96"
        style={{
          height: "5vh",
          alignItems: "center",
        }}
      >
        <Link to={"/"}>네이버 부동산</Link>
        <div className="size-full; inline-block">
            <button onClick={login}>
                {loginState? "로그아웃" : "로그인"}
            </button>
        </div>
      </div>
      <div
        class="nav-container"
        className="flex space-x-20"
        style={{ height: "5vh", alignItems: "center" }}
      >
        <Link to={"/"}>매물</Link>
        <Link to={"/iSale"}>분양</Link>
        <Link to={"/interest"}>관심</Link>
        <Link to={"/mypage"}>마이 페이지</Link>
      </div>
      <div className="border-t border-gray-400"></div>
    </>
  );
}

export default NavBar;
