const ISaleDetail = ({ selectedAddress }) => {
  return (
    <>
      <div>
        <h1>제목</h1>
        <button>☆</button>
      </div>
      <div>
        <p>행복주택/분양중/10세대/25층</p>
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
      <table>
        <tbody>
          <tr>
            <td>분양주소</td>
            <td>{selectedAddress}</td>
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
