import React, { useState, useEffect, useRef } from "react";
import LandDetail from "./LandDetail";

const LandMapContainer = () => {
  const [showDetail, setShowDetail] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [map, setMap] = useState(null);
  const login = () => {
    window.location.href =
      "http://192.168.0.12:5173/signin?redirect=" +
      window.location.href.split("?")[0] +
      "loading";
  };

  const markerRef = useRef(null);

  useEffect(() => {
    // 초기 지도 생성
    const initialLat = 37.48645289999874;
    const initialLng = 127.02067890000285;

    const mapInstance = new window.naver.maps.Map("map", {
      center: new window.naver.maps.LatLng(initialLat, initialLng),
      zoom: 18,
    });

    // 초기 마커 생성
    const marker = new window.naver.maps.Marker({
      position: new window.naver.maps.LatLng(initialLat, initialLng),
      map: mapInstance,
      title: "엔코아",
    });

    // 초기 infoWindow 내용
    const contentString = `
    <div class="map_info" style="cursor: pointer; padding: 10px; text-align: center;">
      <h1>플레이 데이터</h1>
      <p>클릭하여 상세 정보를 확인</p>
    </div>
  `;

    // infoWindow 생성
    const infoWindow = new window.naver.maps.InfoWindow({
      content: contentString,
      maxWidth: 200,
      backgroundColor: "#eee",
      borderColor: "#2db400",
      borderWidth: 5,
      anchorSize: new window.naver.maps.Size(30, 30),
      anchorSkew: true,
      anchorColor: "#eee",
      pixelOffset: new window.naver.maps.Point(20, -20),
    });

    // 마커 클릭 시 infoWindow 열고 닫기
    window.naver.maps.Event.addListener(marker, "click", function (e) {
      if (infoWindow.getMap()) {
        infoWindow.close();
      } else {
        infoWindow.open(mapInstance, marker);
      }
    });

    // infoWindow가 열릴 때 클릭시 상세 정보 확인
    window.naver.maps.Event.addListener(infoWindow, "domready", () => {
      const infoWindowDiv = document.querySelector(".map_info");
      if (infoWindowDiv) {
        infoWindowDiv.addEventListener("click", () => {
          console.log("infoWindowDiv 클릭됨");
          const landDetail = {
            // 매물 상세 정보(임시 데이터)
            ownerName: "홍길동",
            landName: "엔코아 플레이데이터",
            landCategory: 3, // 1: 아파트, 2: 주택, 3: 상가로 변경
            landArea: "30평",
            landDescription: "서초캠퍼스",
            landAddress: "서울특별시 서초구",
            landDetailAddress: "효령로 335",
            landPrice: 1000000000,
            landBuiltDate: "2021-08-01",
          };
          setSelectedProperty(landDetail);
          setShowDetail(true);
        });
      } else {
        console.log("안열림");
      }
    });

    setMap(mapInstance);
    markerRef.current = marker;
  }, []);

  const searchAddressAndMoveMap = () => {
    const address = document.getElementById("address").value;
    if (!address) return;

    window.naver.maps.Service.geocode(
      // 도로명 주소나 지번 주소 둘 다 가능
      { query: address },
      (status, response) => {
        if (
          status !== window.naver.maps.Service.Status.OK ||
          !response.v2.addresses.length
        ) {
          return alert("주소를 찾을 수 없습니다.");
        }

        // 주소 검색 결과
        const result = response.v2.addresses[0];

        // 주소 검색 후 새로운 좌표 생성
        const newCoords = new window.naver.maps.LatLng(result.y, result.x);

        // 지도의 중심을 변경
        map.setCenter(newCoords);

        // 마커 위치를 업데이트
        markerRef.current.setPosition(newCoords);
      }
    );
  };

  return (
    <>
      <div
        style={{
          width: "100%",
          height: "7vh",
        }}
      >
        <button onClick={login}>로그인</button>
      </div>
      <div
        style={{
          width: "100%",
          height: "7vh",
        }}
      >
        <input id="address" type="text" placeholder="주소를 입력하세요" />
        <button onClick={searchAddressAndMoveMap}>검색</button>
      </div>
      <div style={{ display: "flex", width: "100%" }}>
        {showDetail && selectedProperty && (
          <LandDetail
            property={selectedProperty}
            onClose={() => setShowDetail(false)}
          />
        )}
        <div
          className="z-0"
          id="map"
          style={{
            width: "100%",
            height: "86vh",
          }}
        ></div>
      </div>
    </>
  );
};

export default LandMapContainer;
