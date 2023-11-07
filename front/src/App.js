import React from 'react';

function App() {
  const handleClick = () => {
    window.location.href = 'http://localhost:1219/auth/kakao';
  };

  return (
    <button onClick={handleClick}>
      카카오로 인증
    </button>
  );
}

export default App;
