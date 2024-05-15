import React, { useState, useEffect } from "react";
import LandDetail from "./LandDetail";
import axios from "axios";

const LandMapContainer = () => {
  const [selectedAddress, setSelectedAddress] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [map, setMap] = useState(null);
  const [landList, setLandList] = useState([]);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    const initialLat = 37.48645289999874;
    const initialLng = 127.02067890000285;

    const mapInstance = new window.naver.maps.Map("map", {
      center: new window.naver.maps.LatLng(initialLat, initialLng),
      zoom: 18,
    });

    setMap(mapInstance);
  }, []);

  // landRepository에서 매물 정보를 받아옴
  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = "http://localhost:8000/api/v1/lands";
        const response = await axios.get(url);
        setLandList(response.data);
        console.log(landList.length);
      } catch (error) {
        alert("불러오기 실패");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (map && landList.length > 0) {
      landList.forEach((land) => {
        addMarkerByAddress(land.landAddress, map); // map 인스턴스를 직접 전달합니다.
      });
    }
  }, [map, landList]); // map 및 landList 상태의 변화를 감지합니다.

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

        // 주소 검색 결과
        const result = response.v2.addresses[0];

        // 주소 검색 후 새로운 좌표 생성
        const newCoords = new window.naver.maps.LatLng(result.y, result.x);

        // 마커 생성
        const marker = new window.naver.maps.Marker({
          position: newCoords,
          map: mapInstance,
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
        map.setCenter(newCoords);
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
          검색
        </button>
      </div>
      <div style={{ display: "flex", width: "100%" }}>
        <div
          className="z-0"
          id="map"
          style={{
            width: "100%",
            height: "90vh",
          }}
        ></div>
      </div>
    </>
  );
};
export default LandMapContainer;
