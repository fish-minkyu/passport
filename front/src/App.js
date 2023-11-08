import React from 'react';

function App() {
  const kakaoClick = () => {
    window.location.href = 'http://localhost:1219/auth/kakao';
  };

  const naverClick = () => {
    window.location.href = 'http://localhost:1219/auth/naver';
  };

  const googleClick = () => {
    window.location.href = 'http://localhost:1219/auth/google';
  };

  return (
    <div>
      <button onClick={kakaoClick}>
        카카오로 인증
      </button>

      <button onClick={naverClick}>
        네이버로 인증
      </button>

      <button onClick={googleClick}>
        구글로 인증
      </button>

      {/* <a id="kakao" href="http://localhost:1219/auth/kakao" class="btn">카카오톡 로그인</a> */}
    </div>
  );
}

export default App;
