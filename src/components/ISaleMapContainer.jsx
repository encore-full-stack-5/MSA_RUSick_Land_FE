import React, { useState, useEffect } from "react";
import ISaleDetail from "./ISaleDetail";

const ISaleMapContainer = () => {
  const login = () => {
    window.location.href =
      "http://192.168.0.12:5173/signin?redirect=" +
      window.location.href.split("?")[0] +
      "loading";
  };

  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const initialLat = 37.48645289999874;
    const initialLng = 127.02067890000285;

    const mapInstance = new window.naver.maps.Map("map", {
      center: new window.naver.maps.LatLng(initialLat, initialLng),
      zoom: 18,
    });

    setMap(mapInstance);
  }, []);

  useEffect(() => {
    if (map) {
      // map 상태가 설정된 후에 마커를 추가합니다.
      const addresses = [
        "서울시 서초구 효령로 335",
        "서울시 서초구 효령로 341",
      ];
      addresses.forEach((address) => {
        addMarkerByAddress(address, map); // map 인스턴스를 직접 전달합니다.
      });
    }
  }, [map]); // map 상태의 변화를 감지합니다.

  const onClickVisible = (address) => {
    setIsVisible(true);
    setSelectedAddress(address);
  };
  const onClickVisible2 = () => {
    setIsVisible(false);
  };

  const addMarkerByAddress = (address, mapInstance) => {
    // map 인스턴스를 매개변수로 받습니다.
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

        const result = response.v2.addresses[0];
        const newCoords = new window.naver.maps.LatLng(result.y, result.x);

        const marker = new window.naver.maps.Marker({
          position: newCoords,
          map: mapInstance, // 직접 전달받은 map 인스턴스를 사용합니다.
          title: address,
        });

        window.naver.maps.Event.addListener(marker, "click", () => {
          onClickVisible(address);
        });
        window.naver.maps.Event.addListener(map, "click", () => {
          onClickVisible2();
        });

        setMarkers((prevMarkers) => [...prevMarkers, marker]);
      }
    );
  };

  useEffect(() => {
    console.log(
      `선택된 주소: ${selectedAddress}, 패널 표시 여부: ${isVisible}`
    );
    // 이곳에서 패널의 상태나 선택된 주소의 변화에 따라 추가적인 로직을 구현할 수 있습니다.
  }, [selectedAddress]);

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
        <button
          onClick={
            () =>
              map &&
              addMarkerByAddress(document.getElementById("address").value, map) // map 상태 확인 후 함수 호출
          }
        >
          검색
        </button>
      </div>
      <div
        id="map"
        style={{
          width: "100%",
          height: "86vh",
        }}
      ></div>
      {isVisible ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: "14vh",
            width: "30%",
            height: "86%",
            zIndex: 100,
            backgroundColor: "white",
            overflow: "scroll",
            padding: "20px",
          }}
        >
          <ISaleDetail selectedAddress={selectedAddress} />
        </div>
      ) : (
        ""
      )}
    </>
  );
};
export default ISaleMapContainer;
