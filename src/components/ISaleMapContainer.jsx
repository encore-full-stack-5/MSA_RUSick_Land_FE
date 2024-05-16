import React, { useState, useEffect } from "react";
import ISaleDetail from "./ISaleDetail";
import { getAlliSale } from "../api/iSaleApi";

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
  const [addresses, setAddress] = useState([]);
  const [iSale, setISale] = useState([]);
  const [selectedISale, setSelectedISale] = useState(null);

  useEffect(() => {
    fetchData();
    // const initialLat = 37.48645289999874;
    // const initialLng = 127.02067890000285;
    const initialLat = 37.5525;
    const initialLng = 127.0311;

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
    const foundISale = iSale.find((sale) => sale.iSaleAddress === address);
    setSelectedISale(foundISale);
  };
  const onClickVisible2 = () => {
    setIsVisible(false);
  };

  const fetchData = async () => {
    try {
      const response = await getAlliSale();
      console.log(response);
      setISale(response.data);
      const newAddresses = response.data
        .map((el) => el.iSaleAddress)
        .filter((address) => !addresses.includes(address));
      setAddress((addresses) => [...addresses, ...newAddresses]);
    } catch (error) {
      console.error("Error:", error);
    }
    console.log(iSale);
    console.log(addresses);
  };

  useEffect(() => {
    if (map && addresses.length > 0) {
      addresses.forEach((address) => {
        addMarkerByAddress(address, map); // map 인스턴스를 직접 전달합니다.
      });
    }
  }, [addresses, map]); // addresses와 map 상태의 변화를 감지합니다.

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
    document.getElementById("address").value = "";
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      searchAddressAndMoveMap();
    }
  };

  return (
    <>
      <div
        className="w-full flex items-center space-x-2"
        style={{
          height: "5vh",
        }}
      >
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

      <div
        className="z-0"
        id="map"
        style={{
          width: "100%",
          height: "84.9vh",
        }}
      ></div>
      {isVisible ? (
        <div
          style={{
            borderTop: "1px solid #9e9e9e",
            position: "absolute",
            left: 0,
            top: "10vh",
            width: "31%",
            height: "89.9%",
            zIndex: 100,
            backgroundColor: "white",
            overflow: "scroll",
            padding: "20px",
          }}
        >
          <ISaleDetail selectedISale={selectedISale} />
        </div>
      ) : (
        ""
      )}
    </>
  );
};
export default ISaleMapContainer;
