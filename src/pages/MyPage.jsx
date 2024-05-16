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
    landBuiltDate: "",
  });
  const [transactionDetails, setTransactionDetails] = useState({
    buyerEmail: "",
    sellingPrice: "",
  });
  const [selectedLandIndex, setSelectedLandIndex] = useState(null);
  const [expandedIndexes, setExpandedIndexes] = useState([]);
  const [marketPriceLists, setMarketPriceLists] = useState([]);
  const toggleExpansion = (index) => {
    if (expandedIndexes.includes(index)) {
      setExpandedIndexes(expandedIndexes.filter((i) => i !== index));
    } else {
      setExpandedIndexes([...expandedIndexes, index]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTransactionDetailsChange = (e) => {
    const { name, value } = e.target;
    setTransactionDetails((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // const handleTransactionDetailsChange = (e) => {
  //   const { name, value } = e.target;
  //   setTransactionDetails((prevData) => ({
  //     ...prevData,
  //     [name]: value,
  //   }));
  // };

  const addLandRequest = async () => {
    const token = JSON.parse(localStorage.getItem("token"));
    console.log(token.tokenType);
    try {
      const url = "http://localhost:8000/api/v1/lands";
      const headers = {
        "Content-Type": "application/json",
        "Authorization": token.tokenType + " " + token.token
      }
      await axios.post(url, formData, { headers: headers })
        .then(res => {
          if(res.data != "") {
            alert("해당 매물의 주인이 아닙니다.");
          }else {
            alert("매물 등록에 성공하였습니다.");
            window.location.reload();
          }
        });
    }catch (error) {
      setError(error);
      alert("매물 등록에 실패하였습니다.");
    }
  };

  useEffect(() => {
    if(localStorage.getItem("token") == null) {
      alert("로그인을 먼저 해야합니다.")
      window.location.href =
          "http://192.168.0.19:5173"
    }
    const fetchData = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("token"));
        const url = "http://192.168.68.106:8000/api/v1/lands/mylands";
        const headers = {
          "Content-Type": "application/json",
          Authorization: token.tokenType + " " + token.token,
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

  const handleTransactionConfirmation = async () => {
    try {
      const selectedLand = myLandList[selectedLandIndex];
      const url = `http://192.168.0.19:8000/api/v1/lands/${selectedLand.landId}`;
      const token = JSON.parse(localStorage.getItem("token"));
      const headers = {
        "Content-Type": "application/json",
        Authorization: token.tokenType + " " + token.token,
      };
      const data = {
        buyerEmail: transactionDetails.buyerEmail,
        sellLogPrice: transactionDetails.sellingPrice,
      };
      await axios.put(url, data, { headers: headers });
      alert("거래가 성공적으로 완료되었습니다.");
      window.location.reload();
    } catch (error) {
      setError(error);
      console.log(error);
      alert("거래 확정에 실패하였습니다.");
    }
  };

  const handleDeleteLand = async () => {
    const confirmation = window.confirm("정말로 매물을 삭제하시겠습니까?");
    if (confirmation) {
      try {
        const selectedLand = myLandList[selectedLandIndex];
        const url = `http://192.168.0.19:8000/api/v1/lands/${selectedLand.landId}`;
        const token = JSON.parse(localStorage.getItem("token"));
        const headers = {
          "Content-Type": "application/json",
          Authorization: token.tokenType + " " + token.token,
        };
        await axios.post(url, {}, { headers: headers });
        alert("매물이 성공적으로 삭제되었습니다.");
        window.location.reload();
      } catch (error) {
        setError(error);
        console.log(error);
        alert("매물 삭제에 실패하였습니다.");
      }
    }
  };

  const fetchMarketPrices = async (landId, index) => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const url = `http://192.168.0.19:8000/api/v1/lands/price/${landId}`;
      const headers = {
        "Content-Type": "application/json",
        Authorization: token.tokenType + " " + token.token,
      };
      const response = await axios.get(url, { headers: headers });
      const updatedLists = [...marketPriceLists];
      updatedLists[index] = response.data;
      setMarketPriceLists(updatedLists);
    } catch (error) {
      setError(error);
      console.log(error);
      alert("시세 정보를 불러오는 데 실패하였습니다.");
    }
  };

  return (
    <>
      <div>마이 페이지</div>
      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
        onClick={() => {
          setAddLandOpen(!addLandOpen);
        }}
      >
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
          />
          <br />
          <input
            class="appearance-none bg-transparent border-none w-80 text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
            type="text"
            name="landPrice"
            value={formData.landPrice}
            onChange={handleChange}
            placeholder="매물 가격"
          />
          <br />
          <input
            class="appearance-none bg-transparent border-none w-80 text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
            type="text"
            name="landArea"
            value={formData.landArea}
            onChange={handleChange}
            placeholder="매물 크기"
          />
          <br />
          <input
            class="appearance-none bg-transparent border-none w-80 text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
            type="text"
            name="landDescription"
            placeholder="매물 설명"
            value={formData.landDescription}
            onChange={handleChange}
          />
          <br />
          <input
            class="appearance-none bg-transparent border-none w-80 text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
            type="text"
            name="landAddress"
            placeholder="매물 주소"
            value={formData.landAddress}
            onChange={handleChange}
          />
          <br />
          <input
            class="appearance-none bg-transparent border-none w-80 text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
            type="text"
            name="landDetailAddress"
            placeholder="매물 상세 주소"
            value={formData.landDetailAddress}
            onChange={handleChange}
          />
          <br />
          <input
            class="appearance-none bg-transparent border-none w-50 text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
            type="date"
            name="landBuiltDate"
            placeholder="건축일자"
            value={formData.landBuiltDate}
            onChange={handleChange}
          />
          <br />
          <button
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            onClick={addLandRequest}
          >
            등록
          </button>
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
            <div>
              매물 주소: {land.landAddress} {land.landDetailAddress}
            </div>
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
              onClick={() => {
                toggleExpansion(index);
                fetchMarketPrices(land.landId, index);
              }}
            >
              시세 보기
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
              onClick={() => setSelectedLandIndex(index)}
            >
              매물 관리
            </button>
            {/* 시세 정보 표시 */}
            {expandedIndexes.includes(index) &&
              marketPriceLists[index] &&
              marketPriceLists[index].length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">시세 정보</h3>
                  <div className="overflow-x-auto"></div>
                  <table className="table-auto border-collapse border border-gray-400">
                    <thead>
                      <tr className="bg-gray-200">
                        <th className="px-4 py-2">거래날짜</th>
                        <th className="px-4 py-2">거래금액</th>
                      </tr>
                    </thead>
                    <tbody>
                      {marketPriceLists[index].map((price, idx) => (
                        <tr
                          key={idx}
                          className={
                            idx % 2 === 0 ? "bg-gray-100" : "bg-gray-200"
                          }
                        >
                          <td className="border px-4 py-2">{price.sellDate}</td>
                          <td className="border px-4 py-2">{price.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            {selectedLandIndex === index && (
              <div>
                {/* 구매자 이메일 입력 필드 */}
                <input
                  className="appearance-none bg-transparent border-b border-gray-500 w-80 text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                  type="text"
                  name="buyerEmail"
                  value={transactionDetails.buyerEmail}
                  onChange={handleTransactionDetailsChange}
                  placeholder="구매자 이메일"
                />
                <br />
                {/* 판매 가격 입력 필드 */}
                <input
                  className="appearance-none bg-transparent border-b border-gray-500 w-80 text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                  type="text"
                  name="sellingPrice"
                  value={transactionDetails.sellingPrice}
                  onChange={handleTransactionDetailsChange}
                  placeholder="판매 가격"
                />
                <br />
                {/* 구매 확정 버튼 */}
                <button
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
                  onClick={handleTransactionConfirmation}
                >
                  거래 확정
                </button>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full"
                  onClick={handleDeleteLand}
                >
                  매물 삭제
                </button>
              </div>
            )}
            <div className="border-t border-gray-400 mb-10"></div>
          </li>
        ))}
      </ul>
    </>
  );
}

export default MyPage;
