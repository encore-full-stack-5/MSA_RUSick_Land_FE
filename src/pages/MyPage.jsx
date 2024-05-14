import React, { useEffect, useState } from "react";
import axios from "axios";
function MyPage() {
  const [error, setError] = useState(null);
  const [myLandList, setMyLandList] = useState([]);
  const [addLandOpen, setAddLandOpen] = useState(false);
  const [formData, setFormData] = useState({
    landName: "",
    landCategory: "",
    landArea: "",
    landDescription: "",
    landAddress: "",
    landDetailAddress: "",
    landPrice: "",
    landBuiltDate: ""
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const addLandRequest = async () => {
    const token = JSON.parse(localStorage.getItem("token"));
    console.log(token.tokenType);
    try{
      const url = "http://192.168.0.19:8000/api/v1/lands";
      const headers = {
        "Content-Type": "application/json",
        "Authorization": token.tokenType + " " + token.token
      }
      await axios.post(url, formData, { headers: headers });
      alert("매물을 성공적으로 등록하였습니다.");
    }catch (error) {
      setError(error);
      alert("매물 등록에 실패하였습니다.");
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("token"));
        const url = "http://192.168.0.19:8000/api/v1/lands/mylands";
        const headers = {
          "Content-Type": "application/json",
          "Authorization": token.tokenType + " " + token.token
        };
        const response = await axios.get(url, { headers: headers });
        setMyLandList(response.data);
        console.log(myLandList);
      } catch (error) {
        setError(error);
        console.log(error);
        alert("실패");
      }
    };
    fetchData();
  }, []);



  return (
    <>
      <div>마이 페이지</div>
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" 
        onClick={() => {setAddLandOpen(!addLandOpen)}}>
        {addLandOpen ? "매물 등록 취소" : "매물 등록"}
      </button>
      {addLandOpen && (
        <div>
          <input
            class="appearance-none bg-transparent border-none w-80 text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" 
            type="text"
            name="landName"
            value={formData.landName}
            onChange={handleChange}
            placeholder="매물 이름"
          /><br />
          <input
            class="appearance-none bg-transparent border-none w-80 text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" 
            type="text"
            name="landPrice"
            value={formData.landPrice}
            onChange={handleChange}
            placeholder="매물 가격"
          /><br />
          <input
            class="appearance-none bg-transparent border-none w-80 text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" 
            type="text"
            name="landArea"
            value={formData.landArea}
            onChange={handleChange}
            placeholder="매물 크기"
          /><br />
          <input
            class="appearance-none bg-transparent border-none w-80 text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" 
            type="text"
            name="landDescription"
            placeholder="매물 설명"
            value={formData.landDescription}
            onChange={handleChange}
          /><br />
          <input
            class="appearance-none bg-transparent border-none w-80 text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" 
            type="text"
            name="landAddress"
            placeholder="매물 주소"
            value={formData.landAddress}
            onChange={handleChange}
          /><br />
          <input
            class="appearance-none bg-transparent border-none w-80 text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" 
            type="text"
            name="landDetailAddress"
            placeholder="매물 상세 주소"
            value={formData.landDetailAddress}
            onChange={handleChange}
          /><br />
          <input
            class="appearance-none bg-transparent border-none w-50 text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" 
            type="date"
            name="landBuiltDate"
            placeholder="건축일자"
            value={formData.landBuiltDate}
            onChange={handleChange}
          /><br />
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={addLandRequest}>등록</button>
          <div className="border-t border-gray-400"></div>
        </div>
      )}
      <div className="my-4 text-2xl font-bold">내 매물 목록</div>
      <ul>
        {myLandList.map((land, index) => (
          <li key={index}>
            <div>매물 이름: {land.landName}</div>
            <div>매물 가격: {land.landPrice}</div>
            <div>매물 크기: {land.landArea}</div>
            <div>매물 주소: {land.landAddress} {land.landDetailAddress}</div>
            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full">
              시세 보기
            </button>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
              거래 완료
            </button>
            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full">
              매물 삭제
            </button>
            <div className="border-t border-gray-400 mb-10"></div>
          </li>
        ))}
      </ul>
    </>
  );
}

export default MyPage;
