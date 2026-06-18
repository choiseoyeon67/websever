import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

function ClientApplicationDetail({ applicationId, projectId, onClose }) {
  const [detail, setDetail] = useState(null);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [appRes, projRes] = await Promise.all([
          api.get(`/client/applications/${applicationId}`),
          api.get(`/projects/${projectId}`)
        ]);

        setDetail(appRes.data.data);
        setProject(projRes.data.data);
      } catch (err) {
        console.error("데이터 로드 실패", err);
        setErrorMsg('정보를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (applicationId && projectId) fetchData();
  }, [applicationId, projectId]);

  if (loading) return <div className="p-10 text-center text-sm text-gray-500">⏳ 로딩 중...</div>;
  if (errorMsg) return <div className="p-10 text-center text-sm text-red-500">{errorMsg}</div>;
  if (!detail || !project) return null;

  return (
    <div className="p-6 bg-white rounded-xl">
      <h2 className="text-xl font-bold mb-6 border-b pb-2">지원서 상세 정보</h2>
      
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-bold text-gray-700 mb-1">프로젝트: {project.title}</h3>
        <p className="text-sm text-gray-500">모집 마감일: {project.endDate}</p>
      </div>

      <div className="space-y-4 text-sm">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="font-semibold block text-gray-500 mb-1">제안 금액</label> {detail.appliedBudget?.toLocaleString()}만원</div>
          <div><label className="font-semibold block text-gray-500 mb-1">희망 월 급여</label> {detail.monthlySalary?.toLocaleString()}만원</div>
          <div><label className="font-semibold block text-gray-500 mb-1">작업 기간</label> {detail.workDuration}일</div>
          <div><label className="font-semibold block text-gray-500 mb-1">참여 인원</label> {detail.memberCount}명</div>
          <div><label className="font-semibold block text-gray-500 mb-1">담당 역할</label> {detail.techRole}</div>
          <div><label className="font-semibold block text-gray-500 mb-1">숙련도</label> {detail.experiencedLevel}</div>
        </div>
        
        <div>
          <label className="font-semibold block text-gray-500 mb-2">지원 내용</label>
          <div className="p-4 bg-gray-50 rounded min-h-[120px] whitespace-pre-wrap leading-relaxed">
            {detail.contents}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientApplicationDetail;