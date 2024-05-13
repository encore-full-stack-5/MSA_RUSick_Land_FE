import React, { useState, useEffect, useRef } from "react";

const MapContainer = () => {
  const login = () => {
    window.location.href =
      "http://192.168.0.12:5173/signin?redirect=" +
      window.location.href.split("?")[0] +
      "loading";
  };

  const [map, setMap] = useState(null);
  const markerRef = useRef(null);

  useEffect(() => {
    const initialLat = 37.48645289999874;
    const initialLng = 127.02067890000285;

    const mapInstance = new window.naver.maps.Map("map", {
      center: new window.naver.maps.LatLng(initialLat, initialLng),
      zoom: 18,
    });

    const marker = new window.naver.maps.Marker({
      position: new window.naver.maps.LatLng(initialLat, initialLng),
      map: mapInstance,
      title: "엔코아",
    });

    setMap(mapInstance);
    markerRef.current = marker;
  }, []);

  const searchAddressAndMoveMap = () => {
    const address = document.getElementById("address").value;
    if (!address) return;

    window.naver.maps.Service.geocode(
      { query: address },
      (status, response) => {
        if (
          status !== window.naver.maps.Service.Status.OK ||
          !response.v2.addresses.length
        ) {
          return alert("주소를 찾을 수 없습니다.");
        }

        const result = response.v2.addresses[0]; // API 응답 구조에 따라 접근 수정
        const newCoords = new window.naver.maps.LatLng(result.y, result.x);

        // 지도의 중심을 변경합니다.
        map.setCenter(newCoords);

        // 마커 위치를 업데이트합니다.
        markerRef.current.setPosition(newCoords);
      }
    );
  };

  return (
    <>
      <div>
        <button onClick={login}>로그인</button>
      </div>
      <div>
        <input id="address" type="text" placeholder="주소를 입력하세요" />
        <button onClick={searchAddressAndMoveMap}>검색</button>
        <div id="map" style={{ width: "100%", height: "700px" }}></div>
      </div>
    </>
  );
};
export default MapContainer;
