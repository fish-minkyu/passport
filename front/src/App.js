import React from 'react';

function App() {
  const kakaoClick = () => {
    window.location.href = 'http://localhost:1219/auth/kakao';
  };

  const naverClick = () => {
    window.location.href = 'http://localhost:1219/auth/naver';
  };

  return (
    <div>
      <button onClick={kakaoClick}>
        카카오로 인증
      </button>

      <button onClick={naverClick}>
        네이버로 인증
      </button>
    </div>
  );
}

export default App;
