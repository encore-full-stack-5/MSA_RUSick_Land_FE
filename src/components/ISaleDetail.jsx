import { useEffect, useState } from "react";
import {
  addInterestISale,
  enrollISale,
  getISaleDetail,
  iSaleInTable,
} from "../api/iSaleApi";

const ISaleDetail = ({ selectedISale }) => {
  console.log(selectedISale);

  const [iSale, setISale] = useState([]);
  const [cate, setCate] = useState("");
  const [interest, setInterest] = useState(false);
  // const [inTable, setInTable] = useState(false);
  const [fakeIncome, setFakeIncome] = useState(null);
  const [child, setChild] = useState(null);

  useEffect(() => {
    // const savedInterest = localStorage.getItem(`interest_${selectedISale.id}`);
    // if (savedInterest) {
    //   setInterest(JSON.parse(savedInterest)); // String을 Boolean으로 변환
    // }
    fetchData();
  }, []);
  // }, [selectedISale.id]);
  useEffect(() => {
    iSaleCategory();
  }, [iSale]);
  const iSaleCategory = () => {
    if (iSale.iSaleCategory === 1) setCate("아파트·오피스텔");
    else if (iSale.iSaleCategory === 2) setCate("빌라·주택");
    else if (iSale.iSaleCategory === 3) setCate("원룸·투룸");
    else if (iSale.iSaleCategory === 4) setCate("상가·업무·공장·토지");
    else setCate("-");
  };

  const fetchData = async () => {
    try {
      const response = await getISaleDetail(selectedISale.id);
      setInterest((await iSaleInTable(selectedISale.id)).data);
      setISale(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
    console.log(interest);

    iSaleCategory();
  };

  const formatPriceToKorean = (price) => {
    const validPrice = Number(price) || 0;
    const units = ["", "만", "억", "조"];
    let unitIndex = 0;
    let formattedPrice = validPrice;

    while (formattedPrice >= 10000) {
      formattedPrice /= 10000;
      unitIndex++;
    }

    // 소수점 아래를 만 단위와 분리하여 처리
    let integerPart = Math.floor(formattedPrice);
    let remainder = 0;
    if (unitIndex > 0) {
      // 만 단위 이상일 때만 나머지 계산
      remainder = Math.round((formattedPrice - integerPart) * 10000);
    }

    // 나머지가 0이 아닐 경우만 표시
    return remainder > 0
      ? `${integerPart}${units[unitIndex]} ${remainder}`
      : `${integerPart}${units[unitIndex]}`;
  };

  // 날짜 문자열을 받아서 Date 객체로 변환하는 함수
  const parseDate = (dateStr) => {
    const parts = dateStr.match(/(\d+)/g);
    // 주의: months are 0-based
    return new Date(parts[0], parts[1] - 1, parts[2]);
  };

  // 날짜 객체를 받아서 원하는 형식의 문자열로 변환하는 함수
  const formatDate = (date) => {
    return `${date.getFullYear()}년 ${
      date.getMonth() + 1
    }월 ${date.getDate()}일`;
  };

  // iSaleIn 문자열에서 2년을 빼는 함수
  const subtractTwoYears = (dateStr) => {
    const date = parseDate(dateStr);
    date.setFullYear(date.getFullYear() - 2);
    return formatDate(date);
  };

  // iSaleIn 문자열에서 2개월을 빼는 함수
  const subtractTwoMonths = (dateStr) => {
    const date = parseDate(dateStr);
    date.setMonth(date.getMonth() - 2);
    return formatDate(date);
  };

  const interestClick = async () => {
    await addInterestISale(selectedISale.id);
    setInterest((await iSaleInTable(selectedISale.id)).data);
    if (!interest) alert("관심 분양에 추가되었습니다.");
    else alert("관심 분양에서 삭제되었습니다.");
    // alert("ㄱㄷ");
  };

  const clickEnroll = async () => {
    const income = parseInt(fakeIncome) * 1000000;
    const body = { income, child: parseInt(child, 10) };
    // console.log(body);
    enrollISale(selectedISale.id, body);
    setChild(null);
    setFakeIncome(null);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
        }}
      >
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
          }}
        >
          {iSale.iSaleName}
        </h1>
        {interest ? (
          <button onClick={() => interestClick()}>★</button>
        ) : (
          <button onClick={() => interestClick()}>☆</button>
        )}
      </div>
      <div>
        <p
          style={{
            fontSize: "0.85rem",
          }}
        >
          {cate} / 분양중 / -세대 / -층
        </p>
      </div>
      <div style={{ marginTop: "5px" }}>
        <p
          style={{
            fontSize: "0.85rem",
            color: "red",
          }}
        >
          분양가
        </p>
        <p
          style={{
            fontSize: "1.4rem",
            color: "red",
          }}
        >
          {formatPriceToKorean(iSale.iSaleSellPrice)}
        </p>
        <p
          style={{
            fontSize: "0.8rem",
            color: "#484848",
          }}
        >
          {iSale.iSaleArea},입주일 {iSale.iSaleIn}
        </p>
      </div>
      <br />
      <hr />
      <br />
      <div>
        <h1
          style={{
            fontSize: "1.25rem",
            fontWeight: "bold",
          }}
        >
          기본정보
        </h1>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "5px",
            marginBottom: "20px",
          }}
        >
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
      </div>
      <hr
        style={{
          height: "10px",
        }}
      />
      <div>
        <div style={{ marginTop: "10px" }}>
          <h1
            style={{
              fontSize: "1.25rem",
              fontWeight: "bold",
            }}
          >
            청약일정
          </h1>
          <p style={{ marginTop: "10px" }}>
            공고: {subtractTwoYears("20" + iSale.iSaleIn)} ~
          </p>
          <p style={{ marginTop: "5px" }}>
            발표: {subtractTwoMonths("20" + iSale.iSaleIn)}
          </p>
          <p style={{ marginTop: "5px", marginBottom: "10px" }}>
            계약: {"20" + iSale.iSaleIn} ~
          </p>
        </div>
      </div>
      <hr />
      <div
        style={{
          marginTop: "20px",
        }}
      >
        <p style={{ fontSize: "1rem", fontWeight: "bold" }}>분양 신청하기</p>
        <div
          style={{
            display: "flex",
            marginTop: "10px",
          }}
        >
          <label htmlFor="fakeIncome" />
          <input
            id="fakeIncome"
            type="number"
            placeholder="수입(단위:백만원)"
            style={{ border: "1px solid lightgray", marginRight: "5px" }}
            onChange={(e) => setFakeIncome(e.target.value)}
            value={fakeIncome === null ? "" : fakeIncome}
          />
          <label htmlFor="child" />
          <input
            id="child"
            type="number"
            placeholder="자녀 수"
            style={{ border: "1px solid lightgray" }}
            onChange={(e) => setChild(e.target.value)}
            value={child === null ? "" : child}
          />
        </div>
        <button
          style={{
            width: "6rem",
            height: "2rem",
            marginTop: "10px",
            color: "white",
            backgroundColor: "#03c75a",
            borderRadius: "0.3rem",
          }}
          onClick={() => clickEnroll()}
        >
          분양 신청
        </button>
      </div>
    </>
  );
};

export default ISaleDetail;
