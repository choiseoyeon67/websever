import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Header from '../components/common/Header'
import ProjectApplyModal from '../components/project/ProjectApplyModal'
import api from '../api/axios'

function ProjectDetailPage() {
  const { id } = useParams()

  const [project, setProject] = useState(null)

  useEffect(() => {
    fetchProject()
  }, [])

  const fetchProject = async () => {
    try {
      const response = await api.get(`/projects/${id}`)
      setProject(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  if (!project) {
    return <div>로딩중...</div>
  }

  return (
    <div>
      <Header />

      <div className='max-w-5xl mx-auto p-4'>
        <div className='border rounded-xl p-6'>
          <h1 className='text-3xl font-bold'>
            {project.title}
          </h1>

          <div className='mt-4'>
            계약 형태: {project.contractType}
          </div>

          <div>예산: {project.budget}</div>

          <div>예상 기간: {project.period}</div>

          <div>
            지원자 수: {project.applicantCount}
          </div>

          <div className='flex gap-2 mt-4 flex-wrap'>
            {project.stacks?.map(stack => (
              <span
                key={stack}
                className='bg-gray-100 px-3 py-1 rounded-full'
              >
                {stack}
              </span>
            ))}
          </div>

          <div className='mt-6 whitespace-pre-wrap'>
            {project.description}
          </div>

          <div className='mt-6'>
            <ProjectApplyModal projectId={project.id} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectDetailPage
