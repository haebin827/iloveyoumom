import React from 'react';
import SearchBar from './SearchBar';
import '../styles/MainPage.css';

function CustomerList({ 
  searchTerm,
  setSearchTerm, 
  filteredCustomers,
  loading,
  error,
  expandedCustomer,
  toggleExpand,
  visitSuccess,
  visitLoading,
  handleVisit,
  deleteConfirmId,
  handleDeleteConfirm,
  handleDeleteCancel,
  handleDelete,
  handleEdit
}) {

  const calculateKoreanAge = (birthDate) => {
    if (!birthDate || birthDate === '-') return null;
    
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    const currentYear = today.getFullYear();
    const birthYear = birthDateObj.getFullYear();

    return currentYear - birthYear + 1;
  };

  const renderBirthDateWithAge = (birthDate) => {
    if (!birthDate || birthDate === '-') return '-';

    let formattedDate = birthDate;
    if (birthDate.includes('T')) {
      formattedDate = birthDate.split('T')[0];
    }
    
    const koreanAge = calculateKoreanAge(birthDate);
    return `${formattedDate} (${koreanAge}세)`;
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

  return (
    <div>
      <h2 className="card-title centered">고객 관리</h2>

      <div className="search-container">
        <SearchBar 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
          placeholder="이름 또는 전화번호로 검색..."
        />
      </div>
      
      {/* 고객 목록 테이블 */}
      <div className="table-container">
        {loading ? (
          <div className="loading-container">
            <p>데이터를 불러오는 중...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p>{error}</p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="empty-container">
            <p>
              {searchTerm ? '검색 결과가 없습니다.' : '등록된 고객이 없습니다.'}
            </p>
          </div>
        ) : (
          <>
            <div className="records-count">
              총 <span className="count-number">{filteredCustomers.length}</span>명의 고객
            </div>
            
          <ul className="customer-list">
            {filteredCustomers.map((customer, index) => (
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
                          방문 {customer.visit_count}회
                        </span>
                      )}
                    </div>
                    <span className="customer-phone">{formatPhoneNumber(customer.phone)}</span>
                  </div>
                  <div className="customer-actions">
                    {visitSuccess === customer.id ? (
                      <span className="visit-success">✓ 완료</span>
                    ) : (
                      <button 
                        className="visit-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVisit(customer);
                        }}
                        disabled={visitLoading}
                      >
                        방문
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
                        <span className="detail-label">선호 색상</span>
                        <span className="detail-value">{customer.color_prefer || '-'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">피하는 색상</span>
                        <span className="detail-value">{customer.color_avoid || '-'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">좋아하는 음료</span>
                        <span className="detail-value">{customer.drink_prefer || '-'}</span>
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
                          <span className="detail-label">성별</span>
                          <span className="detail-value">
                            {customer.gender === 'MAN' ? '남자' : 
                             customer.gender === 'WOMAN' ? '여자' : '-'}
                          </span>
                        </div>
                      <div className="detail-item">
                        <span className="detail-label">생년월일</span>
                        <span className="detail-value">{renderBirthDateWithAge(customer.birth)}</span>
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
          </>
        )}
      </div>
    </div>
  );
}

export default CustomerList; 