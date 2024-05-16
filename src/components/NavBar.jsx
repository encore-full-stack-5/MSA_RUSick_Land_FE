import React from "react";
import { Link } from "react-router-dom";
import "../css/NavBar.css"
function NavBar() {
    const login = () => {
        window.location.href =
            "http://192.168.0.12:5173/signin?redirect=" +
            "http://192.168.0.19:5173/" +
            "loading";
        };

  return (
    <>
        <div className="flex space-x-96">
            <Link to={"/"}>네이버 부동산</Link>
            <div className="size-full; inline-block">
                <button onClick={login}>로그인</button>
            </div>
        </div>
        <div class="nav-container" className="flex space-x-20">
            <Link to={"/"}>매물</Link>
            <Link to={"/isale"}>분양</Link>
            <Link to={"/interest"}>관심</Link>
            <Link to={"/mypage"}>마이 페이지</Link>
        </div>
        <div className="border-t border-gray-400"></div>
    </>
  );
}

export default NavBar;