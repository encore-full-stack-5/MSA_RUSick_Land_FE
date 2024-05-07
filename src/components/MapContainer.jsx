import React, { useEffect } from "react";

const MapContainer = () => {
  useEffect(() => {
    // 초기 위치
    const map = new window.naver.maps.Map("map", {
      center: new window.naver.maps.LatLng(
        37.48645289999874,
        127.02067890000285
      ),
      zoom: 18,
    });

    new window.naver.maps.Marker({
      position: new window.naver.maps.LatLng(
        37.48645289999874,
        127.02067890000285
      ),
      map: map,
      title: "네이버 본사",
    });
  }, []);

  return (
    <>
      <div>header</div>
      <div>navigator</div>
      <div id="map" style={{ width: "100%", height: "800px" }}></div>
    </>
  );
};

export default MapContainer;
