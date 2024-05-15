import React, { useState, useEffect, useRef } from "react";
import LandDetail from "./LandDetail";
import axios from "axios";

const LandMapContainer = () => {
  const [showDetail, setShowDetail] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [map, setMap] = useState(null);
  const [LandList, setLandList] = useState([]);

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

    // 초기 지도 위치 설정
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

    // landRepository에서 매물 정보를 받아옴
    const fetchData = async () => {
      try {
        const url = "http://localhost:8000/api/v1/lands";
        const response = await axios.get(url);
        setLandList(response.data);
        console.log(LandList);
      } catch (error) {
        setError(error);
        alert("불러오기 실패");
      }
    };
    fetchData();

    // 매물 정보를 받아와서 land.landYN가 true 인 것들만 골라 land.address를 좌표로 변경 후 지도에 마커로 표시
    LandList.map((land) => {
      if (land.landYN === true) {
        window.naver.maps.Service.geocode(
          {
            address: land.landAddress,
          },
          function (status, response) {
            if (status === window.naver.maps.Service.Status.ERROR) {
              return alert("주소를 찾을 수 없습니다.");
            }

            const result = response.result.items[0];
            const newCoords = new window.naver.maps.LatLng(
              result.point.y,
              result.point.x
            );

            const landMarkers = new window.naver.maps.Marker({
              position: newCoords,
              map: mapInstance,
              title: land.landName,
            });
          }
        );
      }
    });

    // 생성된 마커 클릭시 해당 매물의 상세 정보를 보여주는 detail 창 생성
    // window.naver.maps.Event.addListener(landMarkers, "click", function (e) {
    //   const selectedLand = LandList.find((land) => land.landName === e.overlay.getTitle());
    //   if (selectedLand) {
    //     const landDetail = {
    //       ownerName: selectedLand.ownerName,
    //       landName: selectedLand.landName,
    //       landCategory: selectedLand.landCategory,
    //       landArea: selectedLand.landArea,
    //       landDescription: selectedLand.landDescription,
    //       landAddress: selectedLand.landAddress,
    //       landDetailAddress: selectedLand.landDetailAddress,
    //       landPrice: selectedLand.landPrice,
    //       landBuiltDate: selectedLand.landBuiltDate,
    //     };
    //     setSelectedProperty(landDetail);
    //     setShowDetail(true);
    //   }
    // });

    // 마커 클릭 시 detail 창 띄우기
    window.naver.maps.Event.addListener(marker, "click", function (e) {
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

    // 지도 클릭 시 detail 창 닫기
    window.naver.maps.Event.addListener(mapInstance, "click", function (e) {
      const markerPosition = marker.getPosition();
      const clickedPosition = e.coord;

      const isClickOnMarker =
        markerPosition.lat() === clickedPosition.lat() &&
        markerPosition.lng() === clickedPosition.lng();

      if (!isClickOnMarker) {
        setShowDetail(false);
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
            height: "90vh",
          }}
        ></div>
      </div>
    </>
  );
};

export default LandMapContainer;
