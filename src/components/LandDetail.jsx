import React, { useEffect, useState } from "react";
import {
  getLandDetail,
  getLandPrice,
  addOrDeleteInterestLand,
  getInterestLand,
} from "../api/LandApi";

const LandDetail = ({ selectedLand, onClose }) => {
  const [land, setLand] = useState({});
  const [isStarred, setIsStarred] = useState(false);
  const [landPrice, setLandPrice] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");

  const fetchData = async () => {
    try {
      const response = await getLandDetail(selectedLand.landId);
      setIsStarred((await getInterestLand(selectedLand.landId)).data);
      setLand(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // 관심 매물 등록 및 알람 메시지
  const handleStarClick = async () => {
    try {
      await addOrDeleteInterestLand(selectedLand.landId);
      setIsStarred((await getInterestLand(selectedLand.landId)).data);

      if (!isStarred) {
        setAlertMessage("관심 매물로 등록되었습니다!");
      } else {
        setAlertMessage("관심 매물에서 삭제되었습니다");
      }
    } catch (error) {
      console.error("Error adding or deleting interest land:", error);
      setAlertMessage("작업을 수행하는 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    if (alertMessage !== "") {
      const timer = setTimeout(() => {
        setAlertMessage("");
      }, 1500); // 1.5초 후에 알림 메시지 지우기
      return () => clearTimeout(timer); // 타이머 정리
    }
  }, [alertMessage]);

  // 매물 상세 정보 가져오기
  useEffect(() => {
    fetchData();
  }, []);

  // 시세조회 버튼 클릭 시 시세 조회 api 호출
  const handlePriceInquiryClick = async () => {
    try {
      const response = await getLandPrice(selectedLand.landId);
      const formattedData = response.data.map((entry) => ({
        ...entry,
        sellLogDate: new Date(entry.sellLogDate).toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        price: new Intl.NumberFormat("ko-KR", {
          style: "currency",
          currency: "KRW",
        }).format(entry.price),
      }));
      setLandPrice(formattedData);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // 매물의 분류를 숫자로 받아서 문자열로 반환
  const getCategoryName = (category) => {
    const categoryMap = {
      1: "아파트",
      2: "주택",
      3: "상가",
    };
    return categoryMap[category] || "분류 없음"; // 매핑된 값이 없는 경우 '분류 없음' 반환
  };
  const categoryName = getCategoryName(land.landCategory);

  //숫자를 한국 통화 형식으로 변환
  const formattedPrice = new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(land.landPrice);

  // 건축일을 한국 날짜 형식으로 변환
  const formattedBuiltDate = land.landBuiltDate
    ? new Date(land.landBuiltDate).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <>
      <div className="z-10 w-full max-w-lg mx-auto p-6 bg-white rounded-xl shadow-lg font-sans">
        {alertMessage && (
          <div className="mb-4 p-2 bg-green-100 text-green-800 rounded-lg">
            {alertMessage}
          </div>
        )}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">{land.landName}</h1>
          <button onClick={handleStarClick} className="focus:outline-none">
            <svg
              className={`w-6 h-6 ${
                isStarred ? "text-yellow-500" : "text-gray-300"
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.96a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.357 2.436a1 1 0 00-.364 1.118l1.286 3.96c.3.921-.755 1.688-1.538 1.118L10 13.347l-3.357 2.436c-.783.57-1.838-.197-1.538-1.118l1.286-3.96a1 1 0 00-.364-1.118L2.67 9.387c-.783-.57-.381-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.96z" />
            </svg>
          </button>
          <button onClick={onClose} className="focus:outline-none text-red-500">
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-10.293a1 1 0 00-1.414-1.414L10 8.586 7.707 6.293a1 1 0 00-1.414 1.414L8.586 10l-2.293 2.293a1 1 0 001.414 1.414L10 11.414l2.293 2.293a1 1 0 001.414-1.414L11.414 10l2.293-2.293z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <div className="mb-4">
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">소유주:</span> {land.ownerName}
          </p>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">주소:</span> {land.landAddress}{" "}
            {land.landDetailAddress}
          </p>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">매매가격:</span> {formattedPrice}
          </p>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">면적:</span> {land.landArea}
          </p>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">분류:</span> {categoryName}
          </p>
          <p className="text-gray-700 mb-2">
            <span className="font-semibold">상세:</span> {land.landDescription}
          </p>
          <p className="text-gray-700 mb-4">
            <span className="font-semibold">완공일:</span> {formattedBuiltDate}
          </p>
          <button
            onClick={handlePriceInquiryClick}
            className="w-full py-2 px-4 mb-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
          >
            매매조회
          </button>
          {landPrice !== null &&
            (landPrice.length > 0 ? (
              <div className="bg-gray-100 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-2">매매 내역</h2>
                <ul>
                  {landPrice.map((entry, index) => (
                    <li key={index} className="mb-2">
                      <span className="font-semibold">
                        {entry.sellLogDate}:
                      </span>{" "}
                      {entry.price}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="bg-gray-100 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-2">매매 내역</h2>
                <p className="text-gray-700">매매내역없음</p>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default LandDetail;
