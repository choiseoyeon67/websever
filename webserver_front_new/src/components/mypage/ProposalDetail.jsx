import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

function ProposalDetail({ applicationId, onClose }) {
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (applicationId) {
      fetchProposalData();
    } else {
      setLoading(false);
      setErrorMsg('제안서 식별 번호(applicationId)가 누락되었습니다.');
    }
  }, [applicationId]);

  const fetchProposalData = async () => {
    try {
      setLoading(true);
      setErrorMsg('');

      // 🎯 중복 /api 경로 없이 지정된 엔드포인트 호출
      const response = await api.get(`/developer/applications/${applicationId}`);
      
      // 백엔드 구조가 { code: 5080, message: "...", data: {...} } 이므로 response.data.data 참조
      if (response.data && response.data.data) {
        setProposal(response.data.data);
      } else {
        setErrorMsg('제안서 데이터를 가져오지 못했습니다.');
      }
    } catch (error) {
      console.error("제안서 단독 로드 실패:", error);
      setErrorMsg('서버 통신 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 날짜 포맷 헬퍼함수 (ISO 스트링 처리)
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  if (loading) return <div className="p-10 text-center text-gray-500 text-sm font-medium animate-pulse">⏳ 제안서 세부 내용을 불러오는 중...</div>;
  if (errorMsg) return <div className="p-10 text-center text-red-500 text-sm font-semibold">⚠️ {errorMsg}<br/><button onClick={fetchProposalData} className="mt-4 px-3 py-1 bg-gray-100 text-gray-700 rounded border">다시 시ve</button></div>;
  if (!proposal) return <div className="p-10 text-center text-gray-400 text-sm">정보를 표시할 수 없습니다.</div>;

  return (
    <div className="w-full max-w-2xl mx-auto bg-white border border-gray-200 rounded-xl shadow-md p-6 font-sans text-gray-700">
      
      {/* 1. 상단 타이틀 바 */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-3.5 mb-5">
        <div>
          <span className="text-[10px] font-bold text-orange-500 bg-orange-50 px-2.5 py-0.5 rounded-md uppercase mb-1 inline-block tracking-wider">
            PROPOSAL NO. {proposal.id}
          </span>
          <h3 className="text-xl font-bold text-gray-800">나의 제출 제안서 내역</h3>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-50 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* 2. 계약 및 매칭 세부 조건 격자 (제공해주신 DTO 맞춤 매핑) */}
      <div className="mb-6">
        <div className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">📋 제출 희망 계약 조건</div>
        <div className="grid grid-cols-2 gap-4">
          
          <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-center gap-3">
            <span className="text-xl">💼</span>
            <div>
              <div className="text-[11px] text-gray-400">담당 역할 (techRole)</div>
              <div className="text-sm font-bold text-gray-800">{proposal.techRole || '미지정'}</div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-center gap-3">
            <span className="text-xl">🏅</span>
            <div>
              <div className="text-[11px] text-gray-400">숙련도 등급 (experiencedLevel)</div>
              <div className="text-sm font-bold text-gray-800">{proposal.experiencedLevel || '미입력'}</div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-center gap-3">
            <span className="text-xl">⏳</span>
            <div>
              <div className="text-[11px] text-gray-400">투입 가능 기간 (workDuration)</div>
              <div className="text-sm font-bold text-gray-800">{proposal.workDuration ? `${proposal.workDuration}일` : '-'}</div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-center gap-3">
            <span className="text-xl">👥</span>
            <div>
              <div className="text-[11px] text-gray-400">참여 멤버 수 (memberCount)</div>
              <div className="text-sm font-bold text-gray-800">{proposal.memberCount ? `${proposal.memberCount}명` : '1명'}</div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-center gap-3">
            <span className="text-xl">💵</span>
            <div>
              <div className="text-[11px] text-gray-400">희망 총 예산 (appliedBudget / 도급)</div>
              <div className="text-sm font-bold text-orange-600">
                {proposal.appliedBudget ? `${proposal.appliedBudget.toLocaleString()}원` : '협의'}
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-center gap-3">
            <span className="text-xl">💰</span>
            <div>
              <div className="text-[11px] text-gray-400">희망 월 급여 (monthlySalary / 상주)</div>
              <div className="text-sm font-bold text-gray-800">
                {proposal.monthlySalary ? `${proposal.monthlySalary.toLocaleString()}원` : '협의'}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 3. 제안 내용 및 상세 소개 */}
      <div className="mb-6">
        <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">✉️ 제안 및 자기소개 내용 (contents)</label>
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-sm leading-relaxed whitespace-pre-wrap min-h-[150px] text-gray-700">
          {proposal.contents || "작성된 상세 제안서 내용이 없습니다."}
        </div>
      </div>

      {/* 4. 하단 트래킹용 정보 표시 바 */}
      <div className="flex justify-between items-center text-gray-400 text-[11px] pt-3 border-t border-gray-100">
        <div>프로젝트 연동 키 (projectId): <span className="font-semibold text-gray-500">{proposal.projectId}</span></div>
        <div>제출 일시: {formatDate(proposal.createdAt)}</div>
      </div>

    </div>
  );
}

export default ProposalDetail;