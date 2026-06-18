import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import ApplicantDetailModal from './ApplicantDetailModal'; // 필요 시 ApplicationDetail로 변경 가능

function ApplicantList({ project }) {
  const [detailedProject, setDetailedProject] = useState(project);
  const [applicants, setApplicants] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false); // 🎯 초기값을 false로 변경
  const [selectedApplicantId, setSelectedApplicantId] = useState(null);

  const formatMoney = (value) => {
    if (value == null) return '-'
    return `${value.toLocaleString()}만원`
  }

  // 프로젝트 상세 및 지원자 목록 초기 로드
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const detailRes = await api.get(`/projects/${project.id}`);
        setDetailedProject(detailRes.data.data);
        
        // 데이터 초기화 및 첫 페이지 호출
        setApplicants([]);
        setPage(0);
        fetchApplications(0);
      } catch (error) {
        console.error("데이터 로드 실패", error);
      }
    };
    fetchAllData();
  }, [project.id]);

  // 더보기 및 데이터 로드 로직
const fetchApplications = async (pageNum) => {
  try {
    const size = 2;
    // API 호출
    const response = await api.get(`/client/projects/${project.id}/applications?page=${pageNum}&size=${size}`);
    
    // 데이터 추출
    const data = response.data.data;
    const newApplicants = data.content || [];

    // 상태 업데이트 (중복 제거)
    setApplicants(prev => {
      const combined = [...prev, ...newApplicants];
      return Array.from(new Map(combined.map(item => [item.id, item])).values());
    });

    // 마지막 페이지 여부 판단
    // 서버에서 last를 주면 사용하고, 없으면 받아온 개수가 size보다 작은지 확인
    const isLastPage = data.last !== undefined 
      ? data.last 
      : (newApplicants.length < size);
      
    setHasMore(!isLastPage);
    
  } catch (error) {
    console.error("지원자 조회 실패", error);
    setHasMore(false); 
  }
};

  return (
    <div className='p-6 bg-white border rounded-xl shadow-sm'>
      {/* 1. 프로젝트 요약 영역 */}
      <div className='bg-gray-50 p-6 rounded-lg mb-8 border'>
        <h2 className='text-xl font-bold mb-4'>{detailedProject.title}</h2>
        <div className='grid grid-cols-2 gap-y-4 gap-x-8 text-sm'>
          <div className='flex'><span className='text-gray-500 w-32'>모집 마감일</span> <span>{detailedProject.endDate} (D-{detailedProject.dDay})</span></div>
          <div className='flex'><span className='text-gray-500 w-32'>고용 형태</span> <span>{detailedProject.employmentType}</span></div>
          <div className='flex'><span className='text-gray-500 w-32'>프로젝트 분야</span> <span>{detailedProject.category}</span></div>
          <div className='flex'><span className='text-gray-500 w-32'>진행 분류</span> <span>{detailedProject.progressMethod}</span></div>
          <div className='flex'><span className='text-gray-500 w-32'>기획 상태</span> <span>{detailedProject.status}</span></div>
          <div className='flex'><span className='text-gray-500 w-32'>미팅 희망 지역</span> <span>{detailedProject.meetingRegion}</span></div>
        </div>
      </div>

      {/* 2. 지원자 리스트 */}
      <h3 className='text-lg font-bold mb-4'>지원자 리스트</h3>
      {applicants.length === 0 ? (
        <p className='text-gray-500 p-4 border rounded-lg text-center'>현재 지원자가 없습니다.</p>
      ) : (
        <div className='w-full border rounded-lg overflow-hidden'>
          <table className='w-full text-left'>
            <thead className='bg-gray-100 text-sm'>
              <tr>
                <th className='p-3'>순번</th>
                <th className='p-3'>예상 금액</th>
                <th className='p-3'>지원일</th>
                <th className='p-3'>상세보기</th>
              </tr>
            </thead>
            <tbody>
              {applicants.map((app, index) => (
                <tr key={app.id} className='border-t'>
                  <td className='p-3'>{index + 1}</td>
                  <td className='p-3'>{formatMoney(app.appliedBudget ?? app.monthlySalary)}</td>
                  <td className='p-3'>{app.createdAt?.split('T')[0]}</td>
                  <td className='p-3'>
                    <button onClick={() => setSelectedApplicantId(app.id)} className='text-blue-600 underline'>상세보기</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 3. 더보기 제어 */}
      {/* hasMore가 true일 때만 버튼 노출 */}
      {hasMore && (
        <button 
          onClick={() => { 
            const next = page + 1;
            setPage(next); 
            fetchApplications(next); 
          }} 
          className='w-full mt-4 py-2 border rounded-lg hover:bg-gray-50 font-bold'
        >
          더보기
        </button>
      )}

      {selectedApplicantId && (
  <ApplicantDetailModal 
    applicantId={selectedApplicantId} 
    projectId={project.id} // projectId도 전달
    onClose={() => setSelectedApplicantId(null)} 
  />
)}
    </div>
  );
}
export default ApplicantList;
