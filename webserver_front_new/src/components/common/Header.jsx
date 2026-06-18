import { Link, useNavigate } from 'react-router-dom'; // 1. useNavigate 추가
import { useAuth } from '../Auth/AuthContext';

function Header() {
  const { user, logout } = useAuth(); // 2. user는 한 번만 선언
  const navigate = useNavigate(); // 3. navigate 훅 추가

  const handleLogout = async () => {
    try {
      await logout(); 
      alert('로그아웃되었습니다.');
      navigate('/'); 
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  return (
    <header className='border-b bg-white'>
      <div className='max-w-6xl mx-auto px-4 py-4 flex justify-between'>
        <Link to='/' className='text-2xl font-bold'>
          FREEMOA
        </Link>

        <nav className='flex gap-4 items-center'>
          {user ? (
            <>
              {user.role === 'DEVELOPER' && (
                <Link to='/developer/mypage'>개발자 마이페이지</Link>
              )}
              {user.role === 'CLIENT' && (
                <Link to='/client/mypage'>의뢰인 마이페이지</Link>
              )}
              <button 
                onClick={handleLogout}
                className='text-gray-600 hover:text-red-600 transition-colors'
              >
                로그아웃
              </button>
            </>
          ) : (
            <Link to='/login'>로그인</Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;