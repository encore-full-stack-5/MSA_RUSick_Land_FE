import React, { useState, useEffect } from "react";
import LandDetail from "./LandDetail";
import { getAllLand } from "../api/LandApi";

const LandMapContainer = () => {
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedLand, setSelectedLand] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [map, setMap] = useState(null);
  const [addresses, setAddress] = useState([]);
  const [land, setLand] = useState([]);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    fetchData();
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
      addresses.forEach((address) => {
        addMarkerByAddress(address, map); // map 인스턴스를 직접 전달합니다.
      });
    }
  }, [map]); // map 상태의 변화를 감지합니다.

  const onClickVisible = (address) => {
    setIsVisible(true);
    setSelectedAddress(address);
    const foundLand = land.find((land) => land.landAddress === address);
    setSelectedLand(foundLand);
  };

  const onClickVisible2 = () => {
    setIsVisible(false);
  };

  const fetchData = async () => {
    try {
      const response = await getAllLand();
      const validLand = response.data.filter((el) => el.landYN == true);
      setLand(validLand);
      const newAddresses = validLand
        .map((el) => el.landAddress)
        .filter((address) => !addresses.includes(address));
      setAddress((addresses) => [...addresses, ...newAddresses]);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (map && addresses.length > 0) {
      addresses.forEach((address) => {
        addMarkerByAddress(address, map);
      });
    }
  }, [addresses, map]);

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

        // 주소 검색 결과
        const result = response.v2.addresses[0];

        // 주소 검색 후 새로운 좌표 생성
        const newCoords = new window.naver.maps.LatLng(result.y, result.x);

        // 마커 생성
        const marker = new window.naver.maps.Marker({
          position: newCoords,
          map: mapInstance,
          title: address,
        });

        // 마커에 클릭 이벤트 등록
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
        map.panTo(newCoords);
      }
    );
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      searchAddressAndMoveMap();
    }
  };

  return (
    <>
      <div className="w-full h-10 flex items-center space-x-2">
        <input
          id="address"
          type="text"
          placeholder="도로명 주소를 입력하세요"
          className="flex-grow border border-gray-300 rounded px-2 py-1"
          onKeyDown={handleKeyPress}
        />
        <button
          onClick={searchAddressAndMoveMap}
          className="bg-blue-500 text-white px-4 py-1 rounded"
        >
          이동
        </button>
      </div>
      {isVisible ? (
        <div
          style={{
            borderTop: "1px solid #9e9e9e",
            position: "absolute",
            left: 0,
            top: "10vh",
            width: "30%",
            height: "95%",
            zIndex: 100,
            backgroundColor: "white",
            overflow: "scroll",
            padding: "20px",
          }}
        >
          <LandDetail
            selectedLand={selectedLand}
            onClose={() => setIsVisible(false)}
          />
        </div>
      ) : (
        ""
      )}
      <div
        className="z-0"
        id="map"
        style={{
          width: "100%",
          height: "90vh",
        }}
      ></div>
    </>
  );
};

export default LandMapContainer;
