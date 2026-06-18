import { useState } from 'react'
import Profile from '../components/mypage/Profile' // 새로 만든 조회 컴포넌트 임포트
import ProfileForm from '../components/mypage/ProfileForm'
import AppliedProjectList from '../components/mypage/AppliedProjectList'
import Header from '../components/common/Header'

function DeveloperMyPage() {
  const [activeTab, setActiveTab] = useState('profile')
  // 프로필 내에서 '조회' 중인지 '수정' 중인지 관리하는 상태 추가
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div>
      <Header />
      <div className='max-w-6xl mx-auto p-4'>
        <div className='flex gap-4 mb-8 border-b'>
          <button
            onClick={() => { setActiveTab('profile'); setIsEditing(false); }}
            className={`pb-2 px-4 font-bold ${activeTab === 'profile' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          >
            프로필 관리
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`pb-2 px-4 font-bold ${activeTab === 'projects' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
          >
            지원한 프로젝트
          </button>
        </div>

        <div>
          {activeTab === 'projects' ? (
            <AppliedProjectList />
          ) : (
            // 프로필 탭일 때: 수정 모드면 Form, 아니면 Profile 조회 화면
            isEditing ? (
              <ProfileForm onCancel={() => setIsEditing(false)} />
            ) : (
              <Profile onEdit={() => setIsEditing(true)} />
            )
          )}
        </div>
      </div>
    </div>
  )
}

export default DeveloperMyPage