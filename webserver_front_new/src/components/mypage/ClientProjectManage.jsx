import { useEffect, useState } from 'react'
import api from '../../api/axios'
import ApplicantList from './ApplicantList'

function ClientProjectManage() {
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await api.get('/client/projects');
      const projectsData = response.data.data || response.data;
      if (Array.isArray(projectsData)) {
        setProjects(projectsData);
      } else {
        setProjects([]);
      }
    } catch (error) {
      console.error("프로젝트 조회 실패:", error);
      setProjects([]);
    }
  }

  // 🎯 D-Day 계산 함수
  const getDDay = (endDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(endDate);
    targetDate.setHours(0, 0, 0, 0);
    
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "마감";
    if (diffDays === 0) return "D-Day";
    return `D-${diffDays}`;
  }

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
      <div className='border rounded-xl p-5'>
        <h2 className='text-2xl font-bold mb-4'>등록 프로젝트</h2>

        <div className='space-y-4'>
          {projects.map(project => (
            <div key={project.id} className='border rounded-lg p-4 bg-white shadow-sm'>
              <div className='flex justify-between items-start mb-2'>
                <div className='font-bold text-lg'>{project.title}</div>
                <span className='bg-slate-100 px-2 py-1 rounded text-sm font-semibold'>
                  {getDDay(project.endDate)}
                </span>
              </div>

              <div className='text-sm space-y-1 text-gray-600'>
                <div>예상 금액: {project.budget?.toLocaleString()}만원</div>
                <div>계약 형태: {project.employmentType}</div>
                <div>지원자 수: {project.applicantCount}명</div>
                <div className='text-xs text-gray-400'>모집 마감일: {project.endDate}</div>
              </div>

              <button
                onClick={() => setSelectedProject(project)}
                className='mt-4 bg-black text-white px-4 py-2 rounded-lg w-full text-sm'
              >
                상세보기
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        {selectedProject && (
          <ApplicantList project={selectedProject} />
        )}
      </div>
    </div>
  )
}

export default ClientProjectManage