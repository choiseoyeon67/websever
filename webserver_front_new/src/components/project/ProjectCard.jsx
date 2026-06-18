import { useState } from 'react';
import ProjectApplyModal from './ProjectApplyModal'; // 경로 확인 필요

const ProjectCard = ({ project, onApplySuccess }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const calculateDDay = (endDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? `D-${diffDays}` : '마감';
  };
  const isClosed = calculateDDay(project.endDate) === '마감';
  const displayStatus = isClosed ? '마감' : project.status;

  return (
    <>
      <div 
        onClick={() => {
          if (!isClosed) setIsModalOpen(true)
        }} // 🎯 카드 클릭 시 지원 모달 오픈
        className={`bg-white border border-gray-200 rounded-md p-6 hover:shadow-md transition-shadow relative ${isClosed ? 'cursor-default bg-gray-50' : 'cursor-pointer'}`}
      >
        <div className='flex justify-between items-start'>
          <div>
            <span className='text-xs text-orange-500 font-semibold mb-2 block'>
              {project.category || "기타"}
            </span>
            <h3 className='text-lg font-bold text-gray-800 mb-2 hover:text-blue-600'>
              {project.title}
            </h3>
          </div>
          <div className='flex gap-2'>
            <span className='px-2 py-1 bg-gray-100 text-gray-700 text-[11px] font-semibold rounded'>{project.employmentType}</span>
            <span className={`px-2 py-1 text-[11px] font-bold rounded ${isClosed ? 'bg-red-50 text-red-500' : 'bg-cyan-50 text-cyan-600'}`}>
              {displayStatus}
            </span>
          </div>
        </div>

        <div className='grid grid-cols-4 gap-4 py-4 my-4 border-y border-gray-100 text-center'>
          <div>
            <p className='text-[11px] text-gray-600 mb-1'>예상비용</p>
            <p className='text-sm font-bold text-gray-800'>{project.budget?.toLocaleString()}만원</p>
          </div>
          <div className='border-l border-gray-200'>
            <p className='text-[11px] text-gray-600 mb-1'>예상기간</p>
            <p className='text-sm font-bold text-gray-800'>{project.duration}일</p>
          </div>
          <div className='border-l border-gray-200'>
            <p className='text-[11px] text-gray-600 mb-1'>지원자수</p>
            <p className='text-sm font-bold text-gray-800'>{project.applicantCount || 0}명</p>
          </div>
          <div className='border-l border-gray-200'>
            <p className='text-[11px] text-gray-600 mb-1'>마감일정</p>
            <p className='text-sm font-bold text-red-500'>{calculateDDay(project.endDate)}</p>
          </div>
        </div>

        <p className='text-xs text-gray-700 line-clamp-2 leading-relaxed'>
          {project.description}
        </p>
      </div>

      {/* 🎯 모달 컴포넌트 연결 */}
      {isModalOpen && !isClosed && (
  <ProjectApplyModal 
    // 여기를 콘솔에서 확인해서 값이 안 나오면 데이터 문제임
    projectId={console.log("Card에서 넘기는 ID:", project.project_id || project.id) || (project.project_id || project.id)} 
    employmentType={project.employmentType}
    onClose={() => setIsModalOpen(false)}
    onApplySuccess={onApplySuccess}
  />
)}
    </>
  );
};

export default ProjectCard;
