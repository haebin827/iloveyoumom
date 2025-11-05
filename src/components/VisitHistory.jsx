import React, { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import {supabase} from "../lib/supabase.js";
import PurchaseEditModal from './PurchaseEditModal';
import Pagination from './commons/Pagination.jsx';
import CSVModal from './CSVModal';
import Button from './commons/Button.jsx';
import '../assets/styles/VisitHistory.css';
import toast from 'react-hot-toast';

function VisitHistory({ 
  historySearchTerm, 
  setHistorySearchTerm, 
  historyLoading, 
  historyError, 
  filteredHistory, 
  setFilteredHistory,
  visitHistory,
  setVisitHistory,
  sortConfig, 
  requestSort,
  getSortedHistory 
}) {
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [editingVisit, setEditingVisit] = useState(null);
  const [showCSVModal, setShowCSVModal] = useState(false);

  useEffect(() => {
    setHistorySearchTerm('');
    setStartDateFilter('');
    setEndDateFilter('');
  }, [setHistorySearchTerm]);

  const getFilteredHistoryByDate = () => {
    if (!startDateFilter && !endDateFilter) return getSortedHistory(); // 날짜 필터가 없으면 기존 데이터 반환
    
    return getSortedHistory().filter(visit => {
      if (startDateFilter && !endDateFilter) {
        return visit.visit_date === startDateFilter;
      }

      if (!startDateFilter && endDateFilter) {
        return visit.visit_date === endDateFilter;
      }

      return visit.visit_date >= startDateFilter && visit.visit_date <= endDateFilter;
    });
  };

  const totalRecords = getFilteredHistoryByDate().length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);

  const getCurrentPageData = () => {
    const filteredData = getFilteredHistoryByDate();
    const startIndex = (currentPage - 1) * recordsPerPage;
    return filteredData.slice(startIndex, startIndex + recordsPerPage);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchChange = (e) => {
    setHistorySearchTerm(e.target.value);
  };

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
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(today);
    monday.setDate(diff);
    return getFormattedDate(monday);
  };
  
  const getThisWeekEnd = () => {
    const today = new Date();
    const day = today.getDay();
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

  const clearDateFilters = () => {
    setStartDateFilter('');
    setEndDateFilter('');
  };

  const handleDelete = async (visitId) => {
    try {
      const { error } = await supabase
        .from('history')
        .update({ status: 0 })
        .eq('id', visitId);
        
      if (error) throw error;

      const updatedVisitHistory = visitHistory.filter(visit => visit.id !== visitId);
      const updatedFilteredHistory = filteredHistory.filter(visit => visit.id !== visitId);
      
      setVisitHistory(updatedVisitHistory);
      setFilteredHistory(updatedFilteredHistory);
      setDeleteConfirmId(null);

      toast.success('구매 기록이 성공적으로 삭제되었습니다.')
    } catch (err) {
      console.error('구매 기록 삭제 오류:', err);
    }
  };

  const handleEditComplete = async (visitId, updatedData) => {
    try {
      const { error } = await supabase
        .from('history')
        .update(updatedData)
        .eq('id', visitId);
        
      if (error) throw error;

      const updatedVisitHistory = visitHistory.map(visit => 
        visit.id === visitId ? { ...visit, ...updatedData } : visit
      );
      const updatedFilteredHistory = filteredHistory.map(visit => 
        visit.id === visitId ? { ...visit, ...updatedData } : visit
      );
      
      setVisitHistory(updatedVisitHistory);
      setFilteredHistory(updatedFilteredHistory);
      setEditingVisit(null);
      toast.success('구매 기록이 성공적으로 수정되었습니다.')
    } catch (err) {
      console.error('구매 기록 수정 오류:', err);
      throw err;
    }
  };

  const handleEditClose = () => {
    setEditingVisit(null);
  };


  // 필터나 검색어가 변경되면 페이지를 1로 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [startDateFilter, endDateFilter, historySearchTerm]);

  return (
    <div>
      <h2 className="card-title centered">구매 기록</h2>

      {/* 검색창 및 날짜필터 */}
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
            <Button
              text="오늘"
              color="default"
              size="small"
              className={`${startDateFilter === getToday() && endDateFilter === getToday() ? 'active' : ''}`}
              onClick={() => handleQuickFilter('today')}
            />
            <Button
              text="어제"
              color="default"
              size="small"
              className={`${startDateFilter === getYesterday() && endDateFilter === getYesterday() ? 'active' : ''}`}
              onClick={() => handleQuickFilter('yesterday')}
            />
            <Button
              text="그저께"
              color="default"
              size="small"
              className={`${startDateFilter === getTwoDaysAgo() && endDateFilter === getTwoDaysAgo() ? 'active' : ''}`}
              onClick={() => handleQuickFilter('twoDaysAgo')}
            />
            <Button
              text="이번주"
              color="default"
              size="small"
              className={`${startDateFilter === getThisWeekStart() && endDateFilter === getThisWeekEnd() ? 'active' : ''}`}
              onClick={() => handleQuickFilter('thisWeek')}
            />
            <Button
              text="저번주"
              color="default"
              size="small"
              className={`${startDateFilter === getLastWeekStart() && endDateFilter === getLastWeekEnd() ? 'active' : ''}`}
              onClick={() => handleQuickFilter('lastWeek')}
            />
            <Button
              text="엑셀로 다운로드"
              color="green"
              size="medium"
              onClick={() => setShowCSVModal(true)}
            />
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
            <div className="records-count">
              총 <span className="count-number">{totalRecords}</span>개의 구매 기록
            </div>
            
            <table className="visit-table">
              <thead>
              <tr>
                <th>No</th>
                <th>고객명</th>
                <th>전화번호</th>
                <th>구매 상품</th>
                <th>수량</th>
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
                <th></th>
              </tr>
              </thead>
              <tbody>
                {getCurrentPageData().map((visit, index) => (
                  <tr key={visit.id}>
                    <td>{totalRecords - ((currentPage - 1) * recordsPerPage) - index}</td>
                    <td>{visit.customer_name}</td>
                    <td>{visit.customer_phone ?? '-'}</td>
                    <td>{visit.product}</td>
                    <td>{visit.quantity}</td>
                    <td>{visit.visit_date}</td>
                    <td>
                      {deleteConfirmId === visit.id ? (
                        <div className="delete-confirm">
                          <span className="confirm-message">정말 삭제하시겠습니까?</span>
                          <div className="confirm-buttons">
                            <Button
                              text="예"
                              color="red"
                              size="small"
                              onClick={() => handleDelete(visit.id)}
                            />
                            <Button
                              text="아니오"
                              color="light"
                              size="small"
                              onClick={() => setDeleteConfirmId(null)}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="action-buttons">
                          <button 
                            className="edit-btn"
                            onClick={() => setEditingVisit(visit)}
                            title="수정"
                          >
                            <FiEdit2 />
                          </button>
                          <button 
                            className="delete-btn"
                            onClick={() => setDeleteConfirmId(visit.id)}
                            title="삭제"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalItems={totalRecords}
              itemsPerPage={recordsPerPage}
              onPageChange={handlePageChange}
              showInfo={true}
            />
          </>
        )}
      </div>
      
      {/* Edit Modal */}
      {editingVisit && (
        <PurchaseEditModal
          onClose={handleEditClose}
          onComplete={handleEditComplete}
          visitData={editingVisit}
        />
      )}
      
      {/* CSV Download Modal */}
      {showCSVModal && (
        <CSVModal
          onClose={() => setShowCSVModal(false)}
          visitHistory={visitHistory}
        />
      )}
    </div>
  );
}

export default VisitHistory; 