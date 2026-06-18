import { useState } from 'react'
import Header from '../components/common/Header'
import ProjectCreatePage from './ProjectCreatePage'
import ClientProjectManage from '../components/mypage/ClientProjectManage'

function ClientMyPage() {
  const [tab, setTab] = useState('manage')

  return (
    <div>
      <Header />

      <div className='max-w-6xl mx-auto p-4'>
        <div className='flex gap-4 mb-6'>
          <button
            onClick={() => setTab('manage')}
            className={`px-5 py-2 rounded-lg ${
              tab === 'manage'
                ? 'bg-black text-white'
                : 'bg-gray-200'
            }`}
          >
            프로젝트 관리
          </button>

          <button
            onClick={() => setTab('create')}
            className={`px-5 py-2 rounded-lg ${
              tab === 'create'
                ? 'bg-black text-white'
                : 'bg-gray-200'
            }`}
          >
            프로젝트 등록
          </button>
        </div>

        {tab === 'manage' && <ClientProjectManage />}
        {tab === 'create' && <ProjectCreatePage />}
      </div>
    </div>
  )
}

export default ClientMyPage