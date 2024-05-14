import React from "react";
function LoadingPage() {
  function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const tokenType = params.get("tokenType");

    return { token, tokenType };
  }

  return (
    <>
      <div>로딩중...</div>
    </>
  );
}

export default LoadingPage;
