import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

function Profile({ onEdit }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/developer/profile');
      // 백엔드 응답 데이터 구조 { code, message, data: { ... } } 적용
      if (response.data && response.data.data) {
        setProfile(response.data.data);
      }
    } catch (error) {
      console.error("프로필 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6 text-center text-gray-500">로딩 중...</div>;
  if (!profile) return <div className="p-6 text-center text-gray-500">프로필 정보를 불러올 수 없습니다.</div>;

  return (
    <div className='border p-6 rounded-xl bg-white shadow-sm max-w-xl mx-auto'>
      <h2 className='text-2xl font-bold mb-6 text-gray-800'>내 프로필</h2>
      
      {/* 🎯 프로필 이미지 구역: 서버 로컬에서 서빙하는 정적 경로/URL을 그대로 바인딩 */}
      <div className="flex flex-col items-center mb-6 border-b pb-6">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border mb-3">
          {profile.profileImageUrl ? (
            <img 
              src={profile.profileImageUrl} 
              alt="프로필 이미지" 
              className="w-full h-full object-cover"
              onError={(e) => {
                // 이미지 로딩 실패 시 기본 더미 아바타로 대체 처리
                e.target.src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
              }}
            />
          ) : (
            <img 
              src='https://cdn-icons-png.flaticon.com/512/149/149071.png' 
              alt="기본 프로필" 
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${profile.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
          {profile.isActive ? '활동 가능' : '활동 중지'}
        </span>
      </div>

      <div className='space-y-4 text-gray-700'>
        <p className="flex border-b pb-2"><strong className="w-28 text-gray-500">개발 유형</strong> <span>{profile.devType || '미입력'}</span></p>
        <p className="flex border-b pb-2"><strong className="w-28 text-gray-500">지역</strong> <span>{profile.region || '미입력'}</span></p>
        <p className="flex border-b pb-2"><strong className="w-28 text-gray-500">비즈니스 유형</strong> <span>{profile.bizType || '미입력'}</span></p>
        <p className="flex border-b pb-2"><strong className="w-28 text-gray-500">경력</strong> <span>{profile.careerYears ?? 0}년</span></p>
        <p className="flex border-b pb-2"><strong className="w-28 text-gray-500">상주 여부</strong> <span>{profile.isResident ? '가능' : '불가능'}</span></p>
        <div className="border-b pb-2">
          <strong className="block text-gray-500 mb-1">소개</strong>
          <p className="bg-gray-50 p-3 rounded-lg text-sm whitespace-pre-wrap min-h-[60px]">{profile.introduction || '등록된 소개가 없습니다.'}</p>
        </div>
        <div>
          <strong className="block text-gray-500 mb-1">기술 태그</strong>
          <div className="flex flex-wrap gap-2 mt-1">
            {profile.searchTags ? profile.searchTags.split(',').map((tag, idx) => (
              <span key={idx} className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md text-xs font-medium border border-blue-100">
                #{tag.trim()}
              </span>
            )) : <span className="text-gray-400 text-sm">등록된 태그가 없습니다.</span>}
          </div>
        </div>
      </div>
      
      <button 
        onClick={onEdit}
        className='mt-8 w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-sm'
      >
        프로필 수정하기
      </button>
    </div>
  );
}

export default Profile;