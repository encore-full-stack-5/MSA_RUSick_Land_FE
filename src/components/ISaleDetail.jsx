import { useEffect, useState } from "react";
import { getISaleDetail } from "../api/iSaleApi";

const ISaleDetail = ({ selectedISale }) => {
  console.log(selectedISale);
  const [iSale, setISale] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await getISaleDetail(selectedISale.id);
      setISale(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
    console.log(iSale);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
        }}
      >
        <h1>{iSale.iSaleName}</h1>
        <button>☆</button>
      </div>
      <div>
        <p>{iSale.iSaleCategory}/분양중/10세대/25층</p>
      </div>
      <div>
        <p>분양가</p>
        <h3>가격</h3>
        <p>면적</p>
      </div>
      <hr />
      <div>
        <h1>기본정보</h1>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          <tr>
            <td
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                backgroundColor: "#ededed",
              }}
            >
              분양주소
            </td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
              {iSale.iSaleAddress}
            </td>
          </tr>
          <tr>
            <td
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                backgroundColor: "#ededed",
              }}
            >
              입주일
            </td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
              {iSale.iSaleIn}
            </td>
          </tr>
          <tr>
            <td
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                backgroundColor: "#ededed",
              }}
            >
              면적
            </td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
              {iSale.iSaleArea}
            </td>
          </tr>
          <tr>
            <td
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                backgroundColor: "#ededed",
              }}
            >
              주차 대수
            </td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>-</td>
          </tr>
        </tbody>
      </table>
      <div>
        <h1>청약일정</h1>
        <p>공고 ~~~~</p>
        <p>접수 ~~~~</p>
        <p>발표 ~~~~</p>
        <p>계약 ~~~~</p>
      </div>
    </>
  );
};

export default ISaleDetail;
