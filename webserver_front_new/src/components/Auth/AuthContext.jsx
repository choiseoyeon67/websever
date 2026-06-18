import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/auth/me') // 명세서의 정확한 엔드포인트 경로로 수정
      .then(res => {
        // 응답 구조: { code: ..., message: ..., data: { id, email, name, role } }
        // res.data.data에 접근해야 실제 사용자 정보가 나옵니다.
        if (res.data && res.data.data) {
          setUser(res.data.data);
        }
      })
      .catch(() => {
        setUser(null); 
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    try {
      const payload = {
        email: email,
        password: password
      };

      const res = await api.post('/auth/login', payload);
      
      const userData = res.data.data; 
      
      setUser(userData); 
      return userData; // 페이지 이동을 위해 userData 반환
    } catch (err) {
      throw new Error(err.response?.data?.message || '로그인에 실패했습니다.');
    }
  };

  const logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (err) {
    console.error("로그아웃 실패:", err);
  } finally {
    // 1. 상태를 초기화하여 인증 컨텍스트 업데이트
    setUser(null);
    localStorage.removeItem('token'); 
    
    // 2. navigate 대신 강제 새로고침을 동반한 이동 사용
    window.location.href = '/login'; 
  }
};

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);