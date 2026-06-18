import React from 'react';
import ClientApplicationDetail from './ClientApplicationDetail'; // 🎯 이름 변경 적용

function ApplicantDetailModal({ applicantId, projectId, onClose }) {
  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative shadow-2xl'>
        {/* 닫기 버튼 */}
        <button onClick={onClose} className='absolute top-4 right-4 text-gray-400 text-2xl font-bold z-10 hover:text-gray-600'>✕</button>
        
        {/* 상세 화면 컴포넌트 호출 */}
        <ClientApplicationDetail 
          applicationId={applicantId} 
          projectId={projectId} 
          onClose={onClose} 
        />
      </div>
    </div>
  );
}

export default ApplicantDetailModal;