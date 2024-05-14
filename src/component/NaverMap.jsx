import React, { useEffect } from "react";

const NaverMap = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=cjd3qg7ml2&submodules=geocoder";
    script.async = true;
    script.onload = () => {
      var mapOptions = {
        center: new naver.maps.LatLng(37.3595704, 127.105399),
        zoom: 10,
      };

      var map = new naver.maps.Map("map", mapOptions);
    };

    document.head.appendChild(script);

    return () => document.head.removeChild(script);
  }, []);

  return <div id="map" style={{ width: "100%", height: "400px" }}></div>;
};

export default NaverMap;
