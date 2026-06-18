import { useEffect, useState } from 'react'
import api from '../../api/axios'
import ApplicationDetail from './ApplicationDetail' 

function AppliedProjectList() {
  const [projects, setProjects] = useState([])
  const [activeStatusTab, setActiveStatusTab] = useState('전체')
  const [searchQuery, setSearchQuery] = useState('')
  
  // 🎯 단일 ID 대신 객체로 관리하여 두 식별자를 동시에 추적합니다.
  const [selectedIds, setSelectedIds] = useState({ applicationId: null, projectId: null })

  useEffect(() => {
    fetchAppliedProjects()
  }, [])

  const fetchAppliedProjects = async () => {
    try {
      const response = await api.get('/developer/applications')
      if (response.data && response.data.data) {
        setProjects(response.data.data)
      }
    } catch (error) {
      console.error("지원 목록 조회 실패:", error)
    }
  }

  const formatBudget = (price) => {
    if (!price) return '금액 미정';
    if (price >= 10000000) {
      const man = Math.floor(price / 10000);
      return `${man.toLocaleString()}원`;
    }
    return `${price.toLocaleString()}원`;
  }

  return (
    <div className="w-full bg-white font-sans text-gray-700 mt-4 relative">
      
      {/* 1. 진행 상태별 세부 필터 탭 */}
      <div className="flex items-center space-x-1 border-b border-gray-200 pb-3 text-sm overflow-x-auto whitespace-nowrap">
        {[
          { key: '전체', label: `전체(${projects.length})` },
          { key: '지원', label: `지원(${projects.length})` },
          { key: '미팅', label: '미팅(0)' },
          { key: '상세견적', label: '상세견적(0)' },
          { key: '계약중', label: '계약중(0)' },
          { key: '진행중', label: '진행중(0)' },
          { key: '완료', label: '완료(0)' },
          { key: '보류/실패', label: '보류/실패(0)' }
        ].map((status, index, arr) => (
          <div key={status.key} className="flex items-center">
            <button
              onClick={() => setActiveStatusTab(status.key)}
              className={`pb-1 px-1 font-medium relative transition-colors ${
                activeStatusTab === status.key ? 'text-orange-500 font-bold' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {status.label}
              {activeStatusTab === status.key && (
                <span className="absolute bottom-[-13px] left-0 right-0 h-[2px] bg-orange-500 z-10" />
              )}
            </button>
            {index < arr.length - 1 && (
              <span className="text-gray-300 mx-2 text-[10px]">▶</span>
            )}
          </div>
        ))}
      </div>

      {/* 2. 프로젝트 리스트 본문 영역 */}
      <div className="divide-y divide-gray-100 border-b border-gray-100">
        {projects.length > 0 ? (
          projects.map((item) => (
            <div key={item.id || item.applicationId} className="flex flex-col sm:flex-row sm:items-center justify-between py-5 group">
              
              {/* 좌측 정보: 하트 + 배지 + 제목 */}
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <button className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>

                <span className="px-2 py-0.5 border border-orange-500 text-orange-500 rounded-full text-[11px] font-semibold flex-shrink-0">
                  지원
                </span>

                <div className="font-bold text-gray-800 text-[15px] truncate max-w-xs md:max-w-md lg:max-w-xl">
                  {item.projectTitle}
                </div>
              </div>

              {/* 우측 정보: 금액 + 지원자수 + 기한 + 액션버튼 */}
              <div className="flex flex-wrap items-center gap-y-2 text-xs text-gray-500 font-medium mt-3 sm:mt-0 pl-8 sm:pl-0">
                
                <div className="flex items-center space-x-1 border-r border-gray-200 pr-3">
                  <span className="text-sm">💵</span>
                  <span className="text-gray-700 font-semibold">{formatBudget(item.estimate || item.appliedBudget)}</span>
                </div>

                <div className="flex items-center space-x-1 border-r border-gray-200 px-3">
                  <span className="text-sm">👥</span>
                  <span className="text-gray-700 font-semibold">{item.applicantCount || 0}명 지원</span>
                </div>

                <div className="flex items-center space-x-1 sm:pr-4 px-3">
                  <span className="text-sm">📅</span>
                  <span className="text-gray-700 font-semibold">{item.duration || 0}일</span>
                </div>

                {/* 액션 아이콘 및 버튼 그룹 */}
                <div className="flex items-center space-x-2 pl-2 w-full sm:w-auto justify-end">
                  {/* 🎯 상세열기 클릭 시 해당 아이템 내부의 id와 projectId를 묶어서 상태 세팅 */}
                  <button 
                    onClick={() => setSelectedIds({
                      applicationId: item.id || item.applicationId,
                      projectId: item.projectId
                    })}
                    className="border border-orange-400 text-orange-500 font-semibold px-2.5 py-1 rounded text-xs flex items-center hover:bg-orange-50 transition-colors"
                  >
                    상세열기 <span className="ml-1 text-[9px]">▼</span>
                  </button>
                  
                  <button className="text-gray-400 hover:text-gray-600 p-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </button>
                  <button className="text-gray-400 hover:text-gray-600 p-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </button>
                  <button className="text-gray-300 hover:text-red-500 p-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-400 text-sm">
            지원한 프로젝트 내역이 존재하지 않습니다.
          </div>
        )}
      </div>

      {/* 3. 하단 페이지네이션 번호 */}
      <div className="flex justify-center pt-5">
        <button className="border border-gray-300 text-gray-700 w-7 h-7 flex items-center justify-center text-xs font-semibold rounded shadow-sm bg-gray-50">
          1
        </button>
      </div>

      {/* 🎯 4. 레이어 팝업 모달 백드롭 - 두 조건이 다 유효할 때만 모달 스위칭 */}
      {selectedIds.applicationId && selectedIds.projectId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto animate-fadeIn">
            <ApplicationDetail 
              applicationId={selectedIds.applicationId} 
              projectId={selectedIds.projectId} 
              onClose={() => setSelectedIds({ applicationId: null, projectId: null })} 
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default AppliedProjectList;