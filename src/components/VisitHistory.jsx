import React, { useState, useEffect } from 'react';
import '../styles/MainPage.css';

function VisitHistory({ 
  historySearchTerm, 
  setHistorySearchTerm, 
  historyLoading, 
  historyError, 
  filteredHistory, 
  sortConfig, 
  requestSort,
  getSortedHistory 
}) {
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  
  // 컴포넌트가 마운트될 때 검색값 초기화
  useEffect(() => {
    setHistorySearchTerm('');
    setStartDateFilter('');
    setEndDateFilter('');
  }, [setHistorySearchTerm]);
  
  // 날짜 필터를 적용한 기록 가져오기
  const getFilteredHistoryByDate = () => {
    if (!startDateFilter && !endDateFilter) return getSortedHistory(); // 날짜 필터가 없으면 기존 데이터 반환
    
    return getSortedHistory().filter(visit => {
      // 시작 날짜만 있는 경우 해당 날짜만 필터링
      if (startDateFilter && !endDateFilter) {
        return visit.visit_date === startDateFilter;
      }
      
      // 끝 날짜만 있는 경우 해당 날짜만 필터링
      if (!startDateFilter && endDateFilter) {
        return visit.visit_date === endDateFilter;
      }
      
      // 시작 날짜와 끝 날짜 모두 있는 경우 범위로 필터링
      return visit.visit_date >= startDateFilter && visit.visit_date <= endDateFilter;
    });
  };
  
  // 필터링된 데이터의 총 페이지 수 계산
  const totalRecords = getFilteredHistoryByDate().length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  
  // 현재 페이지에 표시할 데이터 가져오기
  const getCurrentPageData = () => {
    const filteredData = getFilteredHistoryByDate();
    const startIndex = (currentPage - 1) * recordsPerPage;
    return filteredData.slice(startIndex, startIndex + recordsPerPage);
  };
  
  // 페이지 번호 클릭 핸들러
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 검색어 변경 핸들러
  const handleSearchChange = (e) => {
    setHistorySearchTerm(e.target.value);
  };
  
  // 빠른 날짜 필터링 기능
  const getFormattedDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const getToday = () => {
    const today = new Date();
    return getFormattedDate(today);
  };
  
  const getYesterday = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return getFormattedDate(yesterday);
  };
  
  const getTwoDaysAgo = () => {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    return getFormattedDate(twoDaysAgo);
  };
  
  const getThisWeekStart = () => {
    const today = new Date();
    const day = today.getDay(); // 0: 일요일, 1: 월요일, ... 6: 토요일
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // 월요일로 조정, 일요일이면 전주 월요일
    const monday = new Date(today);
    monday.setDate(diff);
    return getFormattedDate(monday);
  };
  
  const getThisWeekEnd = () => {
    const today = new Date();
    const day = today.getDay(); // 0: 일요일, 1: 월요일, ... 6: 토요일
    const diff = today.getDate() + (day === 0 ? 0 : 7 - day); // 일요일로 조정
    const sunday = new Date(today);
    sunday.setDate(diff);
    return getFormattedDate(sunday);
  };
  
  const getLastWeekStart = () => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day - 6; // 전주 월요일
    const lastMonday = new Date(today);
    lastMonday.setDate(diff);
    return getFormattedDate(lastMonday);
  };
  
  const getLastWeekEnd = () => {
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day; // 전주 일요일
    const lastSunday = new Date(today);
    lastSunday.setDate(diff);
    return getFormattedDate(lastSunday);
  };
  
  // 날짜 필터 적용 핸들러
  const handleQuickFilter = (filterType) => {
    switch (filterType) {
      case 'today':
        setStartDateFilter(getToday());
        setEndDateFilter(getToday());
        break;
      case 'yesterday':
        setStartDateFilter(getYesterday());
        setEndDateFilter(getYesterday());
        break;
      case 'twoDaysAgo':
        setStartDateFilter(getTwoDaysAgo());
        setEndDateFilter(getTwoDaysAgo());
        break;
      case 'thisWeek':
        setStartDateFilter(getThisWeekStart());
        setEndDateFilter(getThisWeekEnd());
        break;
      case 'lastWeek':
        setStartDateFilter(getLastWeekStart());
        setEndDateFilter(getLastWeekEnd());
        break;
      default:
        setStartDateFilter('');
        setEndDateFilter('');
    }
  };
  
  // 필터 초기화 핸들러
  const clearDateFilters = () => {
    setStartDateFilter('');
    setEndDateFilter('');
  };
  
  // 필터나 검색어가 변경되면 페이지를 1로 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [startDateFilter, endDateFilter, historySearchTerm]);

  return (
    <div>
      <h2 className="card-title centered">방문 기록</h2>
      
      {/* 검색창과 날짜 필터 - 재설계 */}
      <div className="filter-controls">
        <div className="filter-control-item">
          <div className="search-input-container">
            <span className="search-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </span>
            <input
              type="text"
              value={historySearchTerm}
              onChange={handleSearchChange}
              placeholder="이름 또는 전화번호 검색..."
              className="filter-input"
            />
            {historySearchTerm && (
              <button 
                onClick={() => setHistorySearchTerm('')}
                className="filter-clear-button"
                title="검색어 지우기"
              >
                ✕
              </button>
            )}
          </div>
        </div>
        
        <div className="filter-control-item">
          <div className="date-range-container">
            <div className="date-input-container">
              <span className="date-label">시작일:</span>
              <input
                type="date"
                value={startDateFilter}
                onChange={(e) => setStartDateFilter(e.target.value)}
                className="filter-input"
                placeholder="시작 날짜"
              />
            </div>
            <span className="date-range-separator">~</span>
            <div className="date-input-container">
              <span className="date-label">종료일:</span>
              <input
                type="date"
                value={endDateFilter}
                onChange={(e) => setEndDateFilter(e.target.value)}
                className="filter-input"
                placeholder="종료 날짜"
              />
            </div>
            {(startDateFilter || endDateFilter) && (
              <button 
                onClick={clearDateFilters}
                className="filter-clear-button"
                title="날짜 필터 지우기"
              >
                ✕
              </button>
            )}
          </div>
          
          {/* 빠른 날짜 필터 버튼 */}
          <div className="quick-filter-buttons">
            <button
              className={`quick-filter-button ${startDateFilter === getToday() && endDateFilter === getToday() ? 'active' : ''}`}
              onClick={() => handleQuickFilter('today')}
            >
              오늘
            </button>
            <button
              className={`quick-filter-button ${startDateFilter === getYesterday() && endDateFilter === getYesterday() ? 'active' : ''}`}
              onClick={() => handleQuickFilter('yesterday')}
            >
              어제
            </button>
            <button
              className={`quick-filter-button ${startDateFilter === getTwoDaysAgo() && endDateFilter === getTwoDaysAgo() ? 'active' : ''}`}
              onClick={() => handleQuickFilter('twoDaysAgo')}
            >
              그저께
            </button>
            <button
              className={`quick-filter-button ${startDateFilter === getThisWeekStart() && endDateFilter === getThisWeekEnd() ? 'active' : ''}`}
              onClick={() => handleQuickFilter('thisWeek')}
            >
              이번주
            </button>
            <button
              className={`quick-filter-button ${startDateFilter === getLastWeekStart() && endDateFilter === getLastWeekEnd() ? 'active' : ''}`}
              onClick={() => handleQuickFilter('lastWeek')}
            >
              저번주
            </button>
          </div>
        </div>
      </div>
      
      {/* 방문 기록 테이블 */}
      <div className="table-container">
        {historyLoading ? (
          <div className="loading-container">
            <p>데이터를 불러오는 중...</p>
          </div>
        ) : historyError ? (
          <div className="error-container">
            <p>{historyError}</p>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="empty-container">
            <p>
              {historySearchTerm ? '검색 결과가 없습니다.' : '방문 기록이 없습니다.'}
            </p>
          </div>
        ) : getFilteredHistoryByDate().length === 0 ? (
          <div className="empty-container">
            <p>선택한 기간에 방문 기록이 없습니다.</p>
          </div>
        ) : (
          <>
            {/* 레코드 수 표시 */}
            <div className="records-count">
              총 <span className="count-number">{totalRecords}</span>개의 방문 기록
            </div>
            
            <table className="visit-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>고객명</th>
                  <th>전화번호</th>
                  <th 
                    className={`sortable ${sortConfig.key === 'visit_date' ? 'sorted-' + sortConfig.direction : ''}`}
                    onClick={() => requestSort('visit_date')}
                  >
                    방문 날짜 
                    <span className="sort-icon">
                      {sortConfig.key === 'visit_date' ? 
                        (sortConfig.direction === 'asc' ? ' ↑' : ' ↓') : ' ⇅'}
                    </span>
                  </th>
                  <th 
                    className={`sortable ${sortConfig.key === 'visit_time' ? 'sorted-' + sortConfig.direction : ''}`}
                    onClick={() => requestSort('visit_time')}
                  >
                    방문 시간
                    <span className="sort-icon">
                      {sortConfig.key === 'visit_time' ? 
                        (sortConfig.direction === 'asc' ? ' ↑' : ' ↓') : ' ⇅'}
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {getCurrentPageData().map((visit, index) => (
                  <tr key={visit.id}>
                    <td>{totalRecords - ((currentPage - 1) * recordsPerPage) - index}</td>
                    <td>{visit.customer_name}</td>
                    <td>{visit.customer_phone}</td>
                    <td>{visit.visit_date}</td>
                    <td>{visit.visit_time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* 페이지네이션 */}
            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  className="pagination-button" 
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                >
                  &laquo;
                </button>
                
                <button 
                  className="pagination-button" 
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  &lt;
                </button>
                
                <div className="pagination-info">
                  {currentPage} / {totalPages}
                </div>
                
                <button 
                  className="pagination-button" 
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  &gt;
                </button>
                
                <button 
                  className="pagination-button" 
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  &raquo;
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default VisitHistory; 