import { useState } from 'react';
import api from '../api/axios';

function ProjectCreatePage() {
  const [form, setForm] = useState({
    title: '',
    endDate: '',
    employmentType: '도급외주',
    budget: '',
    duration: '',
    category: '',
    status: '',
    meetingRegion: '',
    description: '',
    progressMethod: '',
    techStack: '' // 콤마로 구분하여 입력 후 배열로 변환 예정
  });

  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const submitProject = async () => {
    // 필수 항목 체크
    if (!form.title || !form.budget || !form.description) {
      alert('프로젝트명, 예산, 업무내용은 필수입니다.');
      return;
    }

    const payload = {
      ...form,
      budget: parseInt(form.budget),
      duration: parseInt(form.duration),
      techStack: form.techStack.split(',').map(item => item.trim()) // 기술 스택 배열 변환
    };

    try {
      setLoading(true);
      await api.post('/projects', payload);
      alert('프로젝트 등록 완료');
      // 폼 초기화 로직 생략
    } catch (error) {
      console.error(error);
      alert('프로젝트 등록 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='max-w-3xl mx-auto p-6'>
      <div className='border rounded-xl p-6 space-y-4'>
        <h1 className='text-3xl font-bold mb-6'>프로젝트 등록</h1>
        
        {/* 프로젝트명 */}
        <input name='title' placeholder="프로젝트명" value={form.title} onChange={handleChange} className='border p-2 w-full rounded' />
        
        {/* 고용 형태 */}
        <select name='employmentType' value={form.employmentType} onChange={handleChange} className='border p-2 w-full rounded'>
          <option value='도급외주'>도급외주</option>
          <option value='상주'>상주</option>
        </select>

        {/* 예산 및 기간 */}
        <div className="grid grid-cols-2 gap-4">
          <input type='number' name='budget' placeholder="예산 (만원)" value={form.budget} onChange={handleChange} className='border p-2 w-full rounded' />
          <input type='number' name='duration' placeholder="예상 기간 (일)" value={form.duration} onChange={handleChange} className='border p-2 w-full rounded' />
        </div>

        {/* 분야, 기획상태, 마감일 */}
        <div className="grid grid-cols-3 gap-4">
          <input name='category' placeholder="분야 (개발/디자인)" value={form.category} onChange={handleChange} className='border p-2 w-full rounded' />
          <input name='status' placeholder="기획상태" value={form.status} onChange={handleChange} className='border p-2 w-full rounded' />
          <input type='date' name='endDate' value={form.endDate} onChange={handleChange} className='border p-2 w-full rounded' />
        </div>

        {/* 기술스택, 지역, 진행방식 */}
        <input name='techStack' placeholder="기술 스택 (쉼표로 구분, 예: React, Java)" value={form.techStack} onChange={handleChange} className='border p-2 w-full rounded' />
        <input name='meetingRegion' placeholder="미팅 지역" value={form.meetingRegion} onChange={handleChange} className='border p-2 w-full rounded' />
        <input name='progressMethod' placeholder="진행 방식" value={form.progressMethod} onChange={handleChange} className='border p-2 w-full rounded' />

        {/* 업무 내용 */}
        <textarea name='description' placeholder="업무 내용" value={form.description} onChange={handleChange} className='border p-2 w-full rounded h-32' />

        <button onClick={submitProject} disabled={loading} className='bg-black text-white px-5 py-3 rounded-lg w-full'>
          {loading ? '등록 중...' : '프로젝트 등록'}
        </button>
      </div>
    </div>
  );
}

export default ProjectCreatePage;