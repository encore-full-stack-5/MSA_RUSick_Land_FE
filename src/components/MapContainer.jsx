import React, { useState, useEffect, useRef } from "react";

const MapContainer = ({ addresses, onMarkerClick }) => {
  const [map, setMap] = useState(null);
  const markersRef = useRef([]);

  useEffect(() => {
    // 초기 지도 생성
    const initialLat = 37.48645289999874;
    const initialLng = 127.02067890000285;

    const mapInstance = new window.naver.maps.Map("map", {
      center: new window.naver.maps.LatLng(initialLat, initialLng),
      zoom: 18,
    });

    // 초기 마커 생성
    // const marker = new window.naver.maps.Marker({
    //   position: new window.naver.maps.LatLng(initialLat, initialLng),
    //   map: mapInstance,
    //   title: "엔코아",
    // });

    setMap(mapInstance);
    markersRef.current.forEach((marker) => {
      marker.setMap(null);
    });
    // 새로운 마커들을 추가합니다.
    addresses.forEach((address, index) => {
      window.naver.maps.Service.geocode(
        // 도로명 주소나 지번 주소 둘 다 가능
        { query: address },
        (status, response) => {
          if (
            status !== window.naver.maps.Service.Status.OK ||
            !response.v2.addresses.length
          ) {
            console.error("Failed to geocode address: ", address);
            return;
          }

          // 주소 검색 결과
          const result = response.v2.addresses[0];
          // 주소 검색 후 새로운 좌표 생성
          const newCoords = new window.naver.maps.LatLng(result.y, result.x);

          // 새로운 마커 생성
          const marker = new window.naver.maps.Marker({
            position: newCoords,
            map: mapInstance,
          });

          // 마커 리스트에 추가
          markersRef.current.push(marker);

          // 마커 클릭 이벤트 처리
          window.naver.maps.Event.addListener(marker, "click", () => {
            if (onMarkerClick) {
              onMarkerClick(index); // 클릭된 마커의 인덱스 전달
            }
          });
        }
      );
    });

    // 마커 리스트 업데이트
    // markersRef.current = newMarkers;
  }, [addresses, onMarkerClick]);

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
      <div
        id="map"
        style={{
          width: "100%",
          height: "86vh",
        }}
      ></div>

      {/* <div className="size-full">
        <button onClick={login}>로그인</button>
      </div>
      <div>
        <input id="address" type="text" placeholder="주소를 입력하세요" />
        <button onClick={searchAddressAndMoveMap}>검색</button>
      </div>
      <div id="map" className="w-full h-auto"></div> */}
    </>
  );
};
export default MapContainer;
