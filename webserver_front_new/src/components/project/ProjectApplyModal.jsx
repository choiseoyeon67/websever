import { useState, useEffect } from 'react'
import api from '../../api/axios'

function ProjectApplyModal({ projectId, employmentType, onClose, onApplySuccess }) {
  const techRoleOptions = ['개발자', '디자이너', '기획자', '기타 포지션']
  const experiencedLevelOptions = [
    '초급(1년이상 ~ 5년미만)',
    '중급(5년이상 ~ 10년미만)',
    '고급(10년이상)'
  ]

  const [form, setForm] = useState({
    techRole: '',
    experiencedLevel: '',
    memberCount: '',
    monthlySalary: '',
    workDuration: '',
    appliedBudget: '',
    contents: '',
  })
  const [positionRows, setPositionRows] = useState([
    { techRole: '', experiencedLevel: '', memberCount: '', monthlySalary: '' }
  ])

  const [projectInfo, setProjectInfo] = useState(null) // 🎯 프로젝트 상세 정보 상태
  const [loading, setLoading] = useState(false)
  const isSangju = employmentType === '상주'

  // 🎯 프로젝트 요약 정보 불러오기
  useEffect(() => {
    const fetchProjectDetail = async () => {
      try {
        const res = await api.get(`/projects/${projectId}`)
        setProjectInfo(res.data.data)
      } catch (error) {
        console.error("프로젝트 상세 로드 실패", error)
      }
    }
    fetchProjectDetail()
  }, [projectId])

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handlePositionChange = (index, name, value) => {
    setPositionRows(prev => prev.map((row, rowIndex) => (
      rowIndex === index ? { ...row, [name]: value } : row
    )))
  }

  const addPositionRow = () => {
    setPositionRows(prev => [
      ...prev,
      { techRole: '', experiencedLevel: '', memberCount: '', monthlySalary: '' }
    ])
  }

  const removePositionRow = (index) => {
    setPositionRows(prev => prev.length === 1
      ? prev
      : prev.filter((_, rowIndex) => rowIndex !== index)
    )
  }

  const hasContactInfo = (text) => {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const phoneRegex = /(01[016789])[-. ]?(\d{3,4})[-. ]?(\d{4})/;
    return emailRegex.test(text) || phoneRegex.test(text);
  }

  const submitApplication = async () => {
    if (hasContactInfo(form.contents)) {
      alert('지원 내용에 이메일이나 전화번호를 포함할 수 없습니다.')
      return
    }

    const normalizedPositions = positionRows.map(row => ({
      techRole: row.techRole,
      experiencedLevel: row.experiencedLevel,
      memberCount: parseInt(row.memberCount) || 0,
      monthlySalary: parseInt(row.monthlySalary) || 0,
    }))
    const filledPositions = normalizedPositions.filter(row =>
      row.techRole || row.experiencedLevel || row.memberCount || row.monthlySalary
    )
    const totalMemberCount = filledPositions.reduce((sum, row) => sum + row.memberCount, 0)
    const totalMonthlySalary = filledPositions.reduce((sum, row) => sum + row.monthlySalary, 0)

    const payload = isSangju ? {
      techRole: filledPositions.map(row => row.techRole).filter(Boolean).join(', '),
      experiencedLevel: filledPositions.map(row => row.experiencedLevel).filter(Boolean).join(', '),
      memberCount: totalMemberCount || 1,
      monthlySalary: totalMonthlySalary,
      positionDetails: JSON.stringify(filledPositions),
      contents: form.contents,
      workDuration: null,
      appliedBudget: null
    } : {
      workDuration: parseInt(form.workDuration) || 0,
      appliedBudget: parseInt(form.appliedBudget) || 0,
      memberCount: 1,
      contents: form.contents,
      techRole: null,
      experiencedLevel: null,
      monthlySalary: null,
      positionDetails: null
    }

    try {
      setLoading(true)
      await api.post(`/projects/${projectId}/applications`, payload)
      alert(`${employmentType} 프로젝트 지원이 완료되었습니다.`)
      if (onApplySuccess) onApplySuccess()
      onClose()
    } catch (error) {
      console.error(error)
      alert('지원에 실패했습니다. 입력값을 확인해주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4'>
      <div className={`bg-white rounded-xl p-6 w-full ${isSangju ? 'max-w-5xl' : 'max-w-lg'} shadow-xl relative max-h-[90vh] overflow-y-auto`}>
        <button onClick={onClose} className='absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold'>✕</button>
        <h2 className='text-xl font-bold mb-4 border-b pb-2'>{employmentType} 프로젝트 지원</h2>

        {/* 🎯 프로젝트 요약 정보 출력 */}
        {projectInfo && (
  <div className="bg-gray-50 p-4 rounded-lg mb-4 text-sm space-y-2 border border-gray-100">
    {/* 제목 */}
    <p className="font-bold text-gray-800 text-base">{projectInfo.title}</p>
    
    {/* 주요 정보 그리드 */}
    <div className="grid grid-cols-2 gap-2 text-gray-600">
      <p>분야: {projectInfo.category}</p>
      <p>마감: {projectInfo.endDate} (D-{projectInfo.dDay})</p>
      <p>예산: {projectInfo.budget?.toLocaleString()}만원</p>
      <p>고용: {projectInfo.employmentType}</p>
      <p>진행: {projectInfo.progressMethod}</p>
      <p>지역: {projectInfo.meetingRegion || '협의'}</p>
    </div>
    
    {/* 기획 상태는 강조가 필요할 경우 별도 라인 배치 */}
    <div className="pt-2 border-t border-gray-200">
      <span className="text-gray-500">기획 상태: </span>
      <span className="font-semibold text-orange-600">{projectInfo.status}</span>
    </div>
  </div>
)}

        <div className="space-y-4">
          {isSangju ? (
            <>
              <div className="space-y-3">
                {positionRows.map((row, index) => (
                  <div key={index} className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-2 items-center">
                    <select value={row.techRole} onChange={(e) => handlePositionChange(index, 'techRole', e.target.value)} className='border p-2 w-full rounded bg-white'>
                      <option value="">기술 구분</option>
                      {techRoleOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                    <select value={row.experiencedLevel} onChange={(e) => handlePositionChange(index, 'experiencedLevel', e.target.value)} className='border p-2 w-full rounded bg-white'>
                      <option value="">연차 구분</option>
                      {experiencedLevelOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                    <div className="flex items-center border rounded overflow-hidden">
                      <input type='number' placeholder="인원수" value={row.memberCount} onChange={(e) => handlePositionChange(index, 'memberCount', e.target.value)} className='p-2 w-full outline-none' />
                      <span className="px-2 text-sm text-gray-500">명</span>
                    </div>
                    <div className="flex items-center border rounded overflow-hidden">
                      <input type='number' placeholder="임금" value={row.monthlySalary} onChange={(e) => handlePositionChange(index, 'monthlySalary', e.target.value)} className='p-2 w-full outline-none' />
                      <span className="px-2 text-sm text-gray-500">만원</span>
                    </div>
                    <button type="button" onClick={() => removePositionRow(index)} className="w-9 h-9 rounded-full bg-gray-100 text-lg font-bold hover:bg-gray-200">
                      ×
                    </button>
                  </div>
                ))}
                <button type="button" onClick={addPositionRow} className="border border-gray-400 w-full py-2 rounded font-bold hover:bg-gray-50">
                  + 추가
                </button>
              </div>
            </>
          ) : (
            <>
              <input type='number' name='workDuration' placeholder="작업 기간(일)" value={form.workDuration} onChange={handleChange} className='border p-2 w-full rounded' />
              <input type='number' name='appliedBudget' placeholder="지원 금액(만원)" value={form.appliedBudget} onChange={handleChange} className='border p-2 w-full rounded' />
              <p className="text-xs text-gray-500">* 인원수: 1명 (본인 고정)</p>
            </>
          )}
          <textarea name='contents' placeholder="지원 내용 (연락처 입력 금지)" value={form.contents} onChange={handleChange} className='border p-2 w-full rounded h-24' />
        </div>

        <button onClick={submitApplication} className='bg-slate-800 text-white w-full py-3 mt-4 rounded font-bold'>
          {loading ? '제출 중...' : '지원서 등록'}
        </button>
      </div>
    </div>
  )
}

export default ProjectApplyModal
