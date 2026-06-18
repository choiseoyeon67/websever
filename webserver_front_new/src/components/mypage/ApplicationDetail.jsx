import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

function ApplicationDetail({ applicationId, projectId, onClose }) {
  const [detail, setDetail] = useState(null); 
  const [project, setProject] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  // 🎯 'combined': 통합 상세, 'proposal': 제안서 단독 상세 (사진 정보 중심)
  const [viewMode, setViewMode] = useState('combined'); 

  useEffect(() => {
    console.log("컴포넌트 호출됨 - applicationId:", applicationId, "projectId:", projectId);
    
    if (applicationId && projectId) {
      fetchCombinedData();
    } else {
      setLoading(false);
      setErrorMsg('applicationId 또는 projectId가 전달되지 않았습니다.');
    }
  }, [applicationId, projectId]);

  const fetchCombinedData = async () => {
    try {
      setLoading(true);
      setErrorMsg('');
      
      const [appResponse, projectResponse] = await Promise.all([
        api.get(`/developer/applications/${applicationId}`).catch(err => {
          console.warn("상세 API 실패, 목록 API로 우회 시도");
          return api.get(`/developer/applications`); 
        }),
        api.get(`/projects/${projectId}`)
      ]);

      let appData = appResponse.data?.data;
      if (Array.isArray(appData)) {
        appData = appData.find(item => String(item.applicationId || item.id) === String(applicationId));
      }

      if (appData) {
        setDetail(appData);
      } else {
        setErrorMsg('지원서 정보를 데이터베이스에서 찾을 수 없습니다.');
      }
      
      if (projectResponse.data && projectResponse.data.data) {
        setProject(projectResponse.data.data);
      } else {
        setErrorMsg('프로젝트 요약 정보를 찾을 수 없습니다.');
      }

    } catch (error) {
      console.error("데이터 로드 중 치명적 에러 발생:", error);
      setErrorMsg('서버 통신 중 에러가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500 text-sm font-medium animate-pulse">⏳ 상세 내용을 불러오는 중...</div>;
  if (errorMsg) return <div className="p-10 text-center text-red-500 text-sm font-semibold">⚠️ {errorMsg}<br/><button onClick={fetchCombinedData} className="mt-4 px-3 py-1 bg-gray-100 text-gray-700 rounded border">다시 시도</button></div>;
  if (!detail || !project) return <div className="p-10 text-center text-gray-400 text-sm">정보를 표시할 수 없습니다.</div>;

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  // ----------------------------------------------------
  // 📸 [분기 1] 나의 제안서 단독 상세보기 화면 (이미지 UI 맞춤 변환)
  // ----------------------------------------------------
  if (viewMode === 'proposal') {
    return (
      <div className="w-full max-w-2xl mx-auto bg-white border border-gray-100 rounded-2xl shadow-lg p-7 font-sans text-gray-700 relative animate-fadeIn">
        
        {/* 상단 닫기/돌아가기 버튼 */}
        <button 
          onClick={() => setViewMode('combined')} 
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-50 transition-colors"
          title="통합 상세로 돌아가기"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* 1. 헤더 (사진 스타일 적용) */}
        <div className="mb-6">
          <span className="text-[11px] font-bold text-orange-500 bg-orange-50 px-2.5 py-0.5 rounded-md uppercase tracking-wider block w-max mb-1.5">
            APPLICATION NO. {detail.id || detail.applicationId}
          </span>
          <h3 className="text-2xl font-bold text-gray-800">나의 지원서 상세 내용</h3>
        </div>

        {/* 2. 제안 조건 6분할 격자 영역 (사진 레이아웃 1:1 매핑) */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          
          {/* 담당 역할 */}
          <div className="bg-slate-50/60 border border-slate-100/80 rounded-xl p-4 text-center">
            <div className="text-xs text-gray-400 flex items-center justify-center gap-1.5 mb-1">
              <span>💼</span> 담당 역할
            </div>
            <div className="text-base font-bold text-gray-800">{detail.techRole || '미지정'}</div>
          </div>

          {/* 숙련도 등급 */}
          <div className="bg-slate-50/60 border border-slate-100/80 rounded-xl p-4 text-center">
            <div className="text-xs text-gray-400 flex items-center justify-center gap-1.5 mb-1">
              <span>🏅</span> 숙련도 등급
            </div>
            <div className="text-base font-bold text-gray-800">{detail.experiencedLevel || detail.experienceLevel || '미입력'}</div>
          </div>

          {/* 희망 총 예산 */}
          <div className="bg-slate-50/60 border border-slate-100/80 rounded-xl p-4 text-center">
            <div className="text-xs text-gray-400 flex items-center justify-center gap-1.5 mb-1">
              <span>💵</span> 희망 총 예산
            </div>
            <div className="text-base font-bold text-orange-500">
              {detail.appliedBudget ? `${detail.appliedBudget.toLocaleString()}원` : '협의'}
            </div>
          </div>

          {/* 희망 월 급여 */}
          <div className="bg-slate-50/60 border border-slate-100/80 rounded-xl p-4 text-center">
            <div className="text-xs text-gray-400 flex items-center justify-center gap-1.5 mb-1">
              <span>💰</span> 희망 월 급여
            </div>
            <div className="text-base font-bold text-gray-800">
              {detail.monthlySalary ? `${detail.monthlySalary.toLocaleString()}원` : '협의'}
            </div>
          </div>

          {/* 투입 가능 기간 */}
          <div className="bg-slate-50/60 border border-slate-100/80 rounded-xl p-4 text-center">
            <div className="text-xs text-gray-400 flex items-center justify-center gap-1.5 mb-1">
              <span>⏳</span> 투입 가능 기간
            </div>
            <div className="text-base font-bold text-gray-800">{detail.workDuration ? `${detail.workDuration}일` : '-'}</div>
          </div>

          {/* 참여 인원 */}
          <div className="bg-slate-50/60 border border-slate-100/80 rounded-xl p-4 text-center">
            <div className="text-xs text-gray-400 flex items-center justify-center gap-1.5 mb-1">
              <span>👥</span> 참여 인원
            </div>
            <div className="text-base font-bold text-gray-800">{detail.memberCount ? `${detail.memberCount}명` : '1명'}</div>
          </div>

        </div>

        {/* 3. 지원 내역 및 소개 내용 본문 박스 */}
        <div className="mb-6">
          <div className="text-xs font-bold text-gray-400 text-center mb-2.5 flex items-center justify-center gap-1 uppercase tracking-wider">
            <span>✉️</span> 지원 내역 및 소개 내용
          </div>
          <div className="bg-slate-50/50 border border-slate-100 p-5 rounded-2xl text-sm text-gray-700 leading-relaxed text-center whitespace-pre-wrap min-h-[140px]">
            {detail.contents || "명세서에 작성된 지원 내용이 존재하지 않습니다."}
          </div>
        </div>

        {/* 4. 하단 메타 바 */}
        <div className="flex justify-between items-center text-gray-400 text-[11px] pt-3 border-t border-gray-100">
          <div>프로젝트 번호: {detail.projectId}</div>
          <div>제출 일시: {formatDate(detail.createdAt)}</div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // 💡 [분기 2] 기본 통합 상세 보기 화면 (Combined Mode)
  // ----------------------------------------------------
  return (
    <div className="w-full max-w-3xl mx-auto bg-white border border-gray-200 rounded-xl shadow-md p-6 font-sans text-gray-700">
      
      {/* 1. 헤더 */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-3.5 mb-5">
        <div>
          <span className="text-[10px] font-bold text-orange-500 bg-orange-50 px-2.5 py-0.5 rounded-md uppercase mb-1 inline-block tracking-wider">
            APPLICATION NO. {detail.id || detail.applicationId}
          </span>
          <h3 className="text-xl font-bold text-gray-800">나의 지원서 및 프로젝트 상세</h3>
        </div>
        <div className="flex items-center gap-2">
          {/* 전환 액션 버튼 */}
          <button 
            onClick={() => setViewMode('proposal')} 
            className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-lg shadow-sm transition-colors animate-pulse"
          >
            📄 나의 제안서 보기
          </button>
          {onClose && (
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* 2. 프로젝트 요약 영역 */}
      <div className="mb-2 bg-slate-50 border border-gray-100 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-white bg-cyan-500 px-2 py-0.5 rounded">프로젝트 요약</span>
            <h4 className="text-base font-bold text-gray-800 truncate">{project.title}</h4>
          </div>
          <span className="text-xs font-bold text-red-500 bg-red-50 px-2.5 py-1 rounded-md">
            {project.dDay === 0 ? "오늘 마감" : `마감 D-${project.dDay}`}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-x-2 gap-y-3 text-center text-xs">
          <div><div className="text-gray-400 mb-1">모집방식</div><div className="font-semibold text-gray-800">{project.employmentType || '도급'}</div></div>
          <div><div className="text-gray-400 mb-1">예상기간</div><div className="font-semibold text-gray-800">{project.duration ? `${project.duration}일` : '-'}</div></div>
          <div><div className="text-gray-400 mb-1">예상비용</div><div className="font-semibold text-orange-600">{project.budget ? `${project.budget.toLocaleString()}만원` : '협의'}</div></div>
          <div><div className="text-gray-400 mb-1">총 지원자</div><div className="font-bold text-cyan-600">{project.applicantCount ? `${project.applicantCount}명` : '0명'}</div></div>
          <div className="pt-2 border-t border-gray-100"><div className="text-gray-400 mb-1">분야</div><div className="font-semibold text-gray-800">{project.category}</div></div>
          <div className="pt-2 border-t border-gray-100"><div className="text-gray-400 mb-1">기획 상태</div><div className="font-semibold text-gray-800">{project.status}</div></div>
          <div className="pt-2 border-t border-gray-100"><div className="text-gray-400 mb-1">진행 방식</div><div className="font-semibold text-gray-800">{project.progressMethod || '-'}</div></div>
          <div className="pt-2 border-t border-gray-100"><div className="text-gray-400 mb-1">모집 마감일</div><div className="font-semibold text-gray-600">{formatDate(project.endDate)}</div></div>
        </div>
      </div>
    </div>
  );
}

export default ApplicationDetail;