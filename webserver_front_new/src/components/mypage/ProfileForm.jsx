import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import TagInput from '../common/TagInput';

function ProfileForm({ onCancel }) {
  const [tags, setTags] = useState([]); 
  const [isLoading, setIsLoading] = useState(true); 
  
  // 이미지 처리를 위한 상태 관리
  const [imageFile, setImageFile] = useState(null); // 선택한 바이너리 파일
  const [imagePreview, setImagePreview] = useState(''); // 화면 미리보기 및 기존 정적 이미지 경로

  const [form, setForm] = useState({
    devType: '',
    isActive: false,
    isResident: false,
    region: '',
    bizType: '',
    careerYears: 0,
    introduction: '',
  });

  useEffect(() => {
    const fetchExistingProfile = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/developer/profile');
        
        if (response.data && response.data.data) {
          const profileData = response.data.data;
          
          setForm({
            devType: profileData.devType || '',
            isActive: profileData.isActive || false,
            isResident: profileData.isResident || false,
            region: profileData.region || '',
            bizType: profileData.bizType || '',
            careerYears: profileData.careerYears || 0,
            introduction: profileData.introduction || '',
          });

          // 🎯 백엔드 명세(/uploads/profile/...)에 맞는 기존 이미지 경로 바인딩
          if (profileData.profileImageUrl) {
            setImagePreview(profileData.profileImageUrl);
          }

          if (profileData.searchTags) {
            setTags(profileData.searchTags.split(',').filter(tag => tag.trim() !== ''));
          }
        }
      } catch (error) {
        console.error("기존 프로필 로딩 실패:", error);
        alert("기존 프로필 정보를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchExistingProfile();
  }, []);

  // 클라이언트에서 이미지 파일을 선택했을 때 핸들러
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // 브라우저 화면에 띄울 임시 Blob 주소 생성
    }
  };

  const submitProfile = async () => {
    if (tags.length > 5) {
      alert("태그는 최대 5개까지만 등록 가능합니다.");
      return;
    }

    try {
      // 🎯 Step 1: 사용자가 새로운 이미지 파일을 선택했다면, 이미지 업로드 API를 먼저 호출!
      if (imageFile) {
        const imgFormData = new FormData();
        // 백엔드 uploadImage(MultipartFile image, ...) 메서드의 파라미터명인 'image'와 정확히 매치해야 함!
        imgFormData.append('image', imageFile); 

        // 이미지 전용 멀티파트 API 엔드포인트 호출 (프로젝트의 실제 주소에 맞게 확인 요망)
        // 예: /api/developer/profile/image 또는 /api/developer/image 등
        await api.post('/developer/profile/image', imgFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        // 이 시점에 이미 백엔드는 로컬 폴더에 UUID_명으로 파일을 물리 저장하고 DB 컬럼을 바꿉니다.
      }

      // 🎯 Step 2: 이미지 업로드가 끝났거나 변경이 없다면 기존 순수 JSON 기반 프로필 업데이트 실행
      const careerYears = parseInt(form.careerYears);
      const requestData = {
        devType: form.devType,
        isActive: form.isActive,
        isResident: form.isResident,
        region: form.region,
        bizType: form.bizType,
        careerYears: isNaN(careerYears) ? 0 : careerYears,
        introduction: form.introduction,
        searchTags: tags.join(','),
      };

      // 백엔드의 @PutMapping("/profile")에 JSON 전달 (@RequestBody 대응)
      await api.put('/developer/profile', requestData);
      
      alert('프로필 수정이 완료되었습니다.');
      
      if (typeof onCancel === 'function') {
        onCancel(); 
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || '수정 실패';
      console.error("수정 에러:", error);
      alert(errorMessage);
    }
  };

  if (isLoading) {
    return (
      <div className='border p-6 rounded-xl bg-white shadow-sm text-center py-12 text-gray-500'>
        기존 프로필 정보를 불러오는 중입니다...
      </div>
    );
  }

  return (
    <div className='border p-6 rounded-xl bg-white shadow-sm max-w-xl mx-auto'>
      <h2 className='text-2xl font-bold mb-6 text-gray-800'>프로필 수정</h2>

      <div className='space-y-5'>
        {/* 프로필 이미지 UI 구역 */}
        <div className="flex flex-col items-center bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300">
          <label className="block text-sm font-semibold text-gray-700 mb-2">프로필 사진 변경</label>
          <div className="w-24 h-24 rounded-full overflow-hidden bg-white border border-gray-200 mb-3 relative">
            {imagePreview ? (
              <img src={imagePreview} alt="미리보기" className="w-full h-full object-cover" />
            ) : (
              <img src="https://cdn-icons-png.flaticon.com/512/149/149071.png" alt="기본 아바타" className="w-full h-full object-cover opacity-60" />
            )}
          </div>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageChange} 
            className="text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
          />
        </div>

        {/* 텍스트 입력 구역 */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>개발 유형</label>
          <input placeholder='예: 백엔드 개발자, 풀스택' className='border p-2 w-full rounded-lg text-sm' value={form.devType} onChange={e => setForm(prev => ({ ...prev, devType: e.target.value }))} />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>지역</label>
          <input placeholder='예: 서울 강남구, 경기' className='border p-2 w-full rounded-lg text-sm' value={form.region} onChange={e => setForm(prev => ({ ...prev, region: e.target.value }))} />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>비즈니스 유형</label>
          <input placeholder='예: 개인 프리랜서, 개인사업자' className='border p-2 w-full rounded-lg text-sm' value={form.bizType} onChange={e => setForm(prev => ({ ...prev, bizType: e.target.value }))} />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>경력 (년)</label>
          <input type='number' placeholder='경력 연수를 입력하세요' className='border p-2 w-full rounded-lg text-sm' value={form.careerYears === 0 ? '' : form.careerYears} 
            onChange={e => {
              const val = e.target.value;
              setForm(prev => ({ 
                ...prev, 
                careerYears: val === '' ? 0 : parseInt(val) 
              }));
            }}
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>소개</label>
          <textarea placeholder='소개글을 작성해 주세요.' className='border p-2 w-full rounded-lg text-sm h-32 resize-none' value={form.introduction} onChange={e => setForm(prev => ({ ...prev, introduction: e.target.value }))} />
        </div>

        <div className='flex gap-6 py-1 bg-gray-50 p-3 rounded-lg justify-around border'>
          <label className='flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700'>
            <input type='checkbox' className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4" checked={form.isActive} onChange={e => setForm(prev => ({ ...prev, isActive: e.target.checked }))} /> 활동 가능 여부
          </label>
          <label className='flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700'>
            <input type='checkbox' className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4" checked={form.isResident} onChange={e => setForm(prev => ({ ...prev, isResident: e.target.checked }))} /> 상주 근무 가능 여부
          </label>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>기술 태그 (최대 5개)</label>
          <TagInput tags={tags} setTags={setTags} />
        </div>

        <div className='flex gap-2 pt-2'>
          {typeof onCancel === 'function' && (
            <button type='button' onClick={onCancel} className='w-1/3 bg-gray-100 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-200 transition'>
              취소
            </button>
          )}
          <button onClick={submitProfile} className='flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-sm'>
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileForm;