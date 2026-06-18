// src/components/project/ProjectFilter.jsx
const ProjectFilter = ({ filter, setFilter }) => {
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    // 이전 필터 상태를 유지하면서 바뀐 항목만 업데이트 (1페이지로 초기화 로직은 부모에서 처리)
    setFilter(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className='border border-gray-200 rounded-sm bg-white overflow-hidden'>
      <div className='bg-orange-500 text-white p-3 font-bold text-sm'>
        프로젝트 필터
      </div>
      <div className='p-4 space-y-6'>
        <div>
          <h4 className='font-bold text-sm mb-3 border-b pb-2'>프로젝트 형태</h4>
          <div className='space-y-2 text-sm text-gray-600'>
            <label className='flex items-center gap-2 cursor-pointer'>
              <input type="radio" name="type" value="ALL" checked={filter.type === 'ALL'} onChange={handleChange} className='accent-orange-500' /> 전체
            </label>
            <label className='flex items-center gap-2 cursor-pointer'>
              <input type="radio" name="type" value="도급외주" checked={filter.type === '도급외주'} onChange={handleChange} className='accent-orange-500' /> 도급(원격)
            </label>
            <label className='flex items-center gap-2 cursor-pointer'>
              <input type="radio" name="type" value="상주" checked={filter.type === '상주'} onChange={handleChange} className='accent-orange-500' /> 상주
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
export default ProjectFilter;