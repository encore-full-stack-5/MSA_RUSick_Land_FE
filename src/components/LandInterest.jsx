import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MapContainer from "./MapContainer";
import axios from "axios";
import InterestDetail from "./InterestDetail"
import ISaleDetail from "./ISaleDetail";
import { getInterestland } from "../api/landInterest";



function landInterest() {

  const login = () => {
    window.location.href =
      "http://192.168.219.104:5173/signin?redirect=" +
      window.location.href.split("?")[0] +
      "loading";
  };




  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [interest, setInterest] = useState([]);
  const [map, setMap] = useState(null);
  const [addresses, setAddress] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [markers, setMarkers] = useState([]);
  const [iSale, setISale] = useState([]);
  const [selectedISale, setSelectedISale] = useState(null);








  useEffect(() => {
    fetchData();
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
  }, [map]); 

  const onClickVisible = (address) => {
    setIsVisible(true);
    setSelectedAddress(address);
    const foundISale = interest.find((interest) => interest.iSaleAddress === address);
    console.log(foundISale);
    setSelectedISale(foundISale);
  };
  const onClickVisible2 = () => {
    setIsVisible(false);
  };


  console.log(interest);


  const fetchData = async () => {
    try {
      const response = await getInterestland();
      console.log(response);
      setInterest(response.data);
      const newAddresses = response.data
      .map((el) => el.iSaleAddress)
      .filter((address) => !addresses.includes(address));
    setAddress((addresses) => [...addresses, ...newAddresses]);
      
    } catch (error) {
      setError(error);
      console.log(error);
      alert("실패");
    }
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



  return (
    <>
      <div
        style={{ height: "100%", display: "flex", border: "1px solid #e9e9e9" }}
      >
        <div>
          <div
            style={{
              top: "10%",
              display: "flex",
              padding: "1em",
              width: "400px",
              border: "1px solid #e9e9e9",
            }}
          >
            <button
              style={{
                width: "50%",
                padding: "6px 0",
                backgroundColor: "#35c44b",
                border: "1px solid #e9e9e9",
                color: "#fff",
              }}
              onClick={() => {
                navigate("/lands/interests");
              }}
            >
              관심매물
            </button>
            <button
              style={{
                width: "50%",
                padding: "6px 0",
                backgroundColor: "#fff",
                border: "1px solid #e9e9e9",
                color: "#000",
              }}
              onClick={() => {
                navigate("/iSale/interest");
              }}
            >
              관심분양
            </button>
          </div>
          <div style={{ height: "569px", border: "1px solid #e9e9e9" }}>
          {interest.map((item, index) => (
              <div key={index} style={{ padding: "10px", borderBottom: "1px solid #e9e9e9" }}>
                <h3 style={{fontWeight:"600"}}>{item.iSaleName}</h3>
                <h3 style={{fontSize:"17px", color:"#4c94e8", fontWeight:"600"}}>분양가 {item.iSaleSellPrice}원</h3>
                <h3>{item.iSaleAddress}</h3>
              </div>
            ))}


          </div>
        </div>
        {/* <MapContainer></MapContainer> */}
        <div
        id="map"
        style={{
          width: "100%",
          height: "89.9vh",
        }}
      ></div>
      {isVisible ? (
        <div
          style={{
            borderTop: "1px solid #9e9e9e",
            position: "absolute",
            left: 0,
            top: "10vh",
            width: "30%",
            height: "89.9%",
            zIndex: 100,
            backgroundColor: "white",
            overflow: "scroll",
            padding: "20px",
          }}
        >
          <InterestDetail selectedISale={selectedISale} />
        </div>
      ) : (
        ""
      )}
      </div>
    </>
  );
}

export default landInterest;