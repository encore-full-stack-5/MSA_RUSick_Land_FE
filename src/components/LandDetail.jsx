import React from "react";

const LandDetail = ({ property, onClose }) => {
  if (!property) return null;

  const getCategoryName = (category) => {
    const categoryMap = {
      1: "아파트",
      2: "주택",
      3: "상가",
    };
    return categoryMap[category] || "분류 없음"; // 매핑된 값이 없는 경우 '분류 없음' 반환
  };

  const formattedPrice = new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
  }).format(property.landPrice);

  const categoryName = getCategoryName(property.landCategory);

  // 매물의 상세 정보를 맵 위에 왼쪽에 표시
  return (
    <>
      <div style={{ width: "30%", padding: "10px" }}>
        <button className="pb-10" onClick={onClose}>
          닫기
        </button>
        <p>{property.landName}</p>
        <p>소유주: {property.ownerName}</p>
        <p>
          주소: {property.landAddress}
          {property.landDetailAddress}
        </p>
        <p>매매가격: {formattedPrice}</p>
        <p>면적: {property.landArea}</p>
        <p>분류: {categoryName}</p>
        <p>상세: {property.landDescription}</p>
        <p>완공일: {property.landBuiltDate}</p>
      </div>
    </>
  );
};

export default LandDetail;
