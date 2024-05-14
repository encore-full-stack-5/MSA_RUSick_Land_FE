import React from "react";
import MapContainer from "../components/MapContainer";
function MainPage() {
  const addresses = [
    "서울특별시 노원구 동일로184길 63",
    "서울특별시 노원구 동일로184길 62"
  ];
  // 마커 클릭 이벤트 처리하는 콜백 함수
  const handleMarkerClick = (index) => {
    // 클릭된 마커의 인덱스를 상위 페이지로 전달
    console.log("마커 클릭 인덱스:", index);
    // 원하는 작업을 수행할 수 있습니다.
  };
  return (
    <>
      <MapContainer addresses={addresses} onMarkerClick={handleMarkerClick} />
    </>
  );
}

export default MainPage;
