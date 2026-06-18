import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../components/Auth/AuthContext' 

import LoginPage from '../pages/LoginPage' 
import LandingPage from '../pages/LandingPage' 
import DeveloperMyPage from '../pages/DeveloperMyPage'
import ClientMyPage from '../pages/ClientMyPage'
import ProjectDetailPage from '../pages/ProjectDetailPage'
import ProjectCreatePage from '../pages/ProjectCreatePage'

// 1. 인증 필수 가드
function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>로딩 중...</div>
  return user ? children : <Navigate to='/login' replace />
}

// 2. 비로그인 사용자 전용 가드
function AnonymousRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>로딩 중...</div>
  return !user ? children : <Navigate to='/' replace />
}

// 3. 역할 기반 권한 가드
function RoleRoute({ children, allowedRole }) {
  const { user, loading } = useAuth()
  if (loading) return <div>로딩 중...</div>
  
  console.log("현재 사용자 역할:", user.role); // 이 로그를 크롬 개발자 도구 콘솔에서 확인하세요.
  console.log("허용된 역할:", allowedRole);

  if (!user) return <Navigate to='/login' replace />
  
  if (user.role !== allowedRole) {
    alert('해당 페이지에 접근할 권한이 없습니다.');
    return <Navigate to='/' replace />
  }
  return children
}

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path='/login' 
          element={
            <AnonymousRoute>
              <LoginPage />
            </AnonymousRoute>
          } 
        />
        <Route 
          path='/' 
          element={
            <PrivateRoute>
              <LandingPage />
            </PrivateRoute>
          } 
        />
        <Route 
          path='/project/:id' 
          element={
            <PrivateRoute>
              <ProjectDetailPage />
            </PrivateRoute>
          } 
        />
        <Route 
          path='/developer/mypage' 
          element={
            <RoleRoute allowedRole='DEVELOPER'>
              <DeveloperMyPage />
            </RoleRoute>
          } 
        />
        <Route 
          path='/client/mypage' 
          element={
            <RoleRoute allowedRole='CLIENT'>
              <ClientMyPage />
            </RoleRoute>
          } 
        />
        <Route 
          path='/project/create' 
          element={
            <RoleRoute allowedRole='CLIENT'>
              <ProjectCreatePage />
            </RoleRoute>
          } 
        />
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router