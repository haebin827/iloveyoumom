import React, { useState } from 'react';
import toast from 'react-hot-toast';
import SearchBar from './SearchBar';
import Pagination from './Pagination';
import PurchaseModal from './PurchaseModal';
import '../assets/styles/CustomerList.css';
import {FaArrowDown, FaArrowUp} from "react-icons/fa";

function CustomerList({ 
  searchTerm,
  setSearchTerm, 
  filteredCustomers,
  setFilteredCustomers,
  customers,
  setCustomers,
  loading,
  error,
  visitSuccess,
  visitLoading,
  handleVisit,
  handleEdit
}) {
  const [expandedCustomer, setExpandedCustomer] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [sortBy, setSortBy] = useState('id');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const calculateKoreanAge = (birthDate) => {
    if (!birthDate || birthDate === '-') return null;
    
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    const currentYear = today.getFullYear();
    const birthYear = birthDateObj.getFullYear();

    return currentYear - birthYear + 1;
  };

  const formatGender = (gender) => {
    if (!gender || gender === 'NA') return null;
    return gender === 'MAN' ? '남' : '여';
  };

  const formatPhoneNumber = (phone) => {
    if (!phone || phone === '-') return '-';

    const cleaned = phone.replace(/-/g, '');

    if (cleaned.length === 11) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7, 11)}`;
    } else if (cleaned.length === 10) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
    } else {
      return phone;
    }
  };

  const renderNameWithAge = (customer) => {
    if (!customer.birth && (!customer.gender || customer.gender === 'NA')) {
      return customer.name || '-';
    }
    
    const koreanAge = calculateKoreanAge(customer.birth);
    const gender = formatGender(customer.gender);
    
    let displayText = customer.name || '-';
    
    if (gender && koreanAge) {
      displayText = `${customer.name} (${gender}, ${koreanAge}세)`;
    } else if (gender) {
      displayText = `${customer.name} (${gender})`;
    } else if (koreanAge) {
      displayText = `${customer.name} (${koreanAge}세)`;
    }
    
    return displayText;
  };

  const toggleExpand = (customerId) => {
    if (expandedCustomer === customerId) {
      setExpandedCustomer(null);
    } else {
      setExpandedCustomer(customerId);
    }
  };

  const handleDeleteConfirm = (e, customerId) => {
    e.stopPropagation();
    setDeleteConfirmId(customerId);
  };

  const handleDeleteCancel = (e) => {
    e.stopPropagation();
    setDeleteConfirmId(null);
  };

  const handleDelete = async (e, customerId) => {
    e.stopPropagation();
    try {
      const { supabase } = await import('../lib/supabase.js');
      
      const { error } = await supabase
        .from('customer')
        .delete()
        .eq('id', customerId);
        
      if (error) throw error;

      const updatedCustomers = customers.filter(customer => customer.id !== customerId);
      setCustomers(updatedCustomers);

      const updatedFilteredCustomers = filteredCustomers.filter(customer => customer.id !== customerId);
      setFilteredCustomers(updatedFilteredCustomers);

      setDeleteConfirmId(null);
      toast.success('고객 정보가 성공적으로 삭제되었습니다.');
    } catch (err) {
      toast.error('고객 삭제에 실패했습니다.');
      setDeleteConfirmId(null);
    }
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    setCurrentPage(1); // Reset to first page when sort direction changes
  };

  // 정렬 함수
  const sortCustomers = (customerList, sortField, direction) => {
    return [...customerList].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (!aValue && !bValue) return 0;
      if (!aValue) return direction === 'asc' ? 1 : -1;
      if (!bValue) return direction === 'asc' ? -1 : 1;

      if (sortField === 'name') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      // Date comparison for created_at and first_visit
      if (sortField === 'created_at' || sortField === 'first_visit') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      // Number comparison for id and visit_count
      if (sortField === 'id' || sortField === 'visit_count') {
        aValue = Number(aValue);
        bValue = Number(bValue);
      }
      
      if (aValue < bValue) {
        return direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const sortedCustomers = sortCustomers(filteredCustomers, sortBy, sortDirection);

  const totalItems = sortedCustomers.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCustomers = sortedCustomers.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setExpandedCustomer(null); // Close any expanded customer when changing page
  };

  const handlePurchaseComplete = async (purchaseData) => {
    if (!selectedCustomer) return;
    
    await handleVisit(selectedCustomer, purchaseData);
    setShowPurchaseModal(false);
    setSelectedCustomer(null);
    toast.success(`${selectedCustomer.name}님의 구매 기록이 추가되었습니다.`);
  };

  const handlePurchaseClose = () => {
    setShowPurchaseModal(false);
    setSelectedCustomer(null);
  };

  return (
    <div>
      <h2 className="card-title centered">고객 관리</h2>

      <div className="search-sort-container">
        <div className="search-container">
          <SearchBar
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
            placeholder="이름 또는 전화번호로 검색..."
          />
        </div>
        
        <div className="sort-container">
          <select 
            className="sort-select"
            value={sortBy}
            onChange={handleSortChange}
          >
            <option value="id">등록순</option>
            <option value="name">이름순</option>
            <option value="first_visit">방문날짜순</option>
          </select>
          <button 
            className="sort-direction-button"
            onClick={toggleSortDirection}
            title={sortDirection === 'asc' ? '오름차순' : '내림차순'}
          >
            {sortDirection === 'asc' ? <FaArrowUp /> : <FaArrowDown />}
          </button>
        </div>
      </div>
      
      {/* 고객 목록 테이블 */}
      <div className="customer-list-table-container">
        {loading ? (
          <div className="loading-container">
            <p>데이터를 불러오는 중...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p>{error}</p>
          </div>
        ) : totalItems === 0 ? (
          <div className="empty-container">
            <p>
              {searchTerm ? '검색 결과가 없습니다.' : '등록된 고객이 없습니다.'}
            </p>
          </div>
        ) : (
          <>
            <div className="records-count">
              총 <span className="count-number">{totalItems}</span>명의 고객
            </div>
            
          <ul className="customer-list">
            {paginatedCustomers.map((customer, index) => (
              <li key={customer.id || index} className="customer-item">
                <div 
                  className="customer-header" 
                  onClick={() => toggleExpand(customer.id)}
                >
                  <div className="customer-main-info">
                    <div className="customer-name-container">
                      <span className="customer-name">{renderNameWithAge(customer)}</span>
                      {customer.visit_count > 0 && (
                        <span className="visit-count-badge">
                          구매 {customer.visit_count}회
                        </span>
                      )}
                    </div>
                    <span className="customer-phone">{formatPhoneNumber(customer.phone)}</span>
                  </div>
                  <div className="customer-actions">
                    {visitSuccess === customer.id ? (
                      <span className="visit-success">완료</span>
                    ) : (
                      <button 
                        className="visit-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCustomer(customer);
                          setShowPurchaseModal(true);
                        }}
                        disabled={visitLoading}
                      >
                        구매
                      </button>
                    )}
                    <span className="expand-icon">
                      {expandedCustomer === customer.id ? '▲' : '▼'}
                    </span>
                  </div>
                </div>
                
                {expandedCustomer === customer.id && (
                  <div className="customer-details">
                    <div className="details-grid">
                      <div className="detail-item">
                        <span className="detail-label">탑 사이즈</span>
                        <span className="detail-value">{customer.top_size || '-'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">바지 사이즈</span>
                        <span className="detail-value">{customer.bottom_size || '-'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">신체 특징</span>
                        <span className="detail-value">{customer.body_type || '-'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">선호 스타일</span>
                        <span className="detail-value">{customer.style_prefer || '-'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">첫 방문</span>
                        <span className="detail-value">{customer.first_visit ? new Date(customer.first_visit).toLocaleDateString() : '-'}</span>
                      </div>
                    </div>
                    <div className="note-container">
                      <span className="detail-label">노트</span>
                      <pre className="note-content">{customer.note || '-'}</pre>
                    </div>
                    
                    <div className="customer-edit-actions">
                      {deleteConfirmId === customer.id ? (
                        <div className="delete-confirm">
                          <span className="confirm-message">정말 삭제하시겠습니까?</span>
                          <div className="confirm-buttons">
                            <button 
                              className="confirm-button confirm-yes"
                              onClick={(e) => handleDelete(e, customer.id)}
                            >
                              예
                            </button>
                            <button 
                              className="confirm-button confirm-no"
                              onClick={handleDeleteCancel}
                            >
                              아니오
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <button 
                            className="edit-button"
                            onClick={(e) => handleEdit(e, customer)}
                          >
                            수정
                          </button>
                          <button 
                            className="delete-button"
                            onClick={(e) => handleDeleteConfirm(e, customer.id)}
                          >
                            삭제
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
          
          <Pagination
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            showInfo={true}
            maxVisiblePages={5}
          />
          </>
        )}
      </div>
      
      {/* Purchase Modal */}
      {showPurchaseModal && selectedCustomer && (
        <PurchaseModal
          onClose={handlePurchaseClose}
          onComplete={handlePurchaseComplete}
          customerName={selectedCustomer.name}
        />
      )}
    </div>
  );
}

export default CustomerList; 