import React, { useEffect, useState } from 'react';
import Header from '../components/common/Header';
import ProjectCard from '../components/project/ProjectCard';
import ProjectFilter from '../components/project/ProjectFilter';
import Pagination from '../components/common/Pagination';
import api from '../api/axios';
import { useAuth } from '../components/Auth/AuthContext';

function LandingPage() {
  const { loading } = useAuth();
  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [filter, setFilter] = useState({ type: 'ALL', status: 'ALL', sort: 'LATEST' });

  // 페이지나 필터가 변경될 때마다 프로젝트 목록을 다시 불러옵니다.
  useEffect(() => {
    fetchProjects();
  }, [page, filter]);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects', {
        params: {
          page: page - 1, // 서버는 0부터 시작하므로 -1
          size: 4,
          employmentType: filter.type === 'ALL' ? null : filter.type,
          status: filter.status === 'ALL' ? null : filter.status,
          sort: filter.sort
        },
      });

      const result = response.data?.data;
      setProjects(result?.content || []);
      setTotalPage(result?.totalPages || 1);
    } catch (error) {
      console.error("프로젝트 조회 에러:", error);
      setProjects([]);
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPage(1); // 필터 변경 시 1페이지로 초기화
  };

  return (
    <div className='min-h-screen bg-[#f9fafb]'>
      <Header />

      {/* 배너 영역 */}
      <div className='bg-white border-b'>
        <div className='max-w-7xl mx-auto px-4 py-10'>
          <h2 className='text-2xl font-bold text-gray-800'>
            <span className='text-cyan-500'>프로젝트</span>를 찾아보세요.
          </h2>
        </div>
      </div>

      <main className='max-w-7xl mx-auto px-4 py-8 flex gap-8'>
        {/* 필터 사이드바 */}
        <aside className='w-64 shrink-0 hidden md:block'>
          <ProjectFilter filter={filter} setFilter={handleFilterChange} />
        </aside>

        {/* 프로젝트 목록 섹션 */}
        <section className='flex-1'>
          <div className='flex justify-end mb-4'>
            <select
              className='border border-gray-300 rounded p-1 text-sm'
              value={filter.sort}
              onChange={(e) => handleFilterChange({ ...filter, sort: e.target.value })}
            >
              <option value="createdAt">최신 등록 순</option>
              <option value="budget">금액 높은 순</option>
              <option value="endDate">마감 임박 순</option>
            </select>
          </div>

          <div className='flex flex-col gap-4'>
            {projects && projects.length > 0 ? (
              projects.map(project => (
                <ProjectCard
                  key={project.id || project.project_id}
                  project={project}
                  onApplySuccess={fetchProjects} // 지원 완료 시 목록 새로고침
                />
              ))
            ) : (
              <div className="text-center text-gray-500 py-10">
                {loading ? "로딩 중..." : "표시할 프로젝트가 없습니다."}
              </div>
            )}
          </div>

          {/* 페이지네이션 */}
          <div className='mt-10 flex justify-center'>
            <Pagination
              currentPage={page}
              totalPage={totalPage}
              onPageChange={(newPage) => setPage(newPage)}
            />
          </div>
        </section>
      </main>
    </div>
  );
}

export default LandingPage;