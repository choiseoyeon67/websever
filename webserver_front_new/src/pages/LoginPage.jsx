import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../components/Auth/AuthContext";
import "../components/Auth/Loginpage.css";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // [평가 편의 기능] 테스트용 더미 계정 자동 입력 함수
  const handleAutoFill = (roleType) => {
    setError('');
    if (roleType === 'DEVELOPER') {
      setEmail('dev01@test.com'); // DB 명세서 더미 데이터 기준
      setPassword('password123!');
    } else {
      setEmail('client01@test.com');
      setPassword('password123!');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 1차 유효성 검사
    if (!email || !password) {
      setError('이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('올바른 이메일 형식이 아닙니다.');
      return;
    }

    try {
      setIsLoading(true);
      // AuthContext의 로그인 함수 호출 (세션 쿠키 생성)
      const userData = await login(email, password);

      // [중요 수정] Router.jsx에 정의된 경로와 정확히 일치시킵니다.
      if (userData.role === 'ROLE_DEVELOPER') {
        navigate('/'); // 개발자는 공통 랜딩페이지(프로젝트 검색 리스트)로 이동
      } else if (userData.role === 'ROLE_CLIENT') {
        navigate('/client/mypage'); // 의뢰인은 의뢰인 마이페이지(프로젝트 관리 탭)로 이동
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || '로그인에 실패했습니다. 계정을 확인해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <header className="login-header">
          <h2>FREEMOA</h2>
          <p>IT 프로젝트 외주 매칭 플랫폼</p>
        </header>

        {/* 1. 에러 메시지 표시 영역 추가 */}
        {error && <div className="error-msg" style={{ color: '#ff5a00', marginBottom: '15px', fontSize: '14px', textAlign: 'center', fontWeight: '500' }}>{error}</div>}

        {/* 2. onSubmit 함수명을 handleSubmit으로 정확히 변경 */}
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">이메일 주소</label>
            {/* 3. value 및 onChange 바인딩 추가 */}
            <input 
              id="email"
              type="email" 
              placeholder="이메일을 입력하세요" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            {/* 4. value 및 onChange 바인딩 추가 */}
            <input 
              id="password"
              type="password" 
              placeholder="비밀번호를 입력하세요" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              disabled={isLoading}
            />
          </div>

          <button type="submit" className="login-submit-btn" disabled={isLoading}>
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;