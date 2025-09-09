import React, { useState } from 'react';
import '../assets/styles/PurchaseEditModal.css';

function PurchaseEditModal({ onClose, onComplete, visitData }) {
  const [product, setProduct] = useState(() => {
    if (visitData.product) {
      return visitData.product.replace(/ \(수량: \d+\)$/, '');
    }
    return '';
  });
  const [quantity, setQuantity] = useState(() => {
    if (visitData.product) {
      const match = visitData.product.match(/\(수량: (\d+)\)$/);
      return match ? parseInt(match[1]) : 1;
    }
    return 1;
  });
  const [visitDate, setVisitDate] = useState(visitData.visit_date || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!product.trim()) {
      setError('구매상품을 입력해주세요.');
      return;
    }

    if (!visitDate) {
      setError('방문날짜를 선택해주세요.');
      return;
    }

    if (quantity < 1) {
      setError('수량은 1개 이상이어야 합니다.');
      return;
    }

    setLoading(true);
    
    try {
      const updatedData = {
        product: `${product.trim()} (수량: ${quantity})`,
        visit_date: visitDate
      };
      
      await onComplete(visitData.id, updatedData);
    } catch (err) {
      setError('수정에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-modal-overlay">
      <div className="edit-modal">
        <div className="edit-modal-header">
          <h2>구매 기록 수정</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="edit-modal-form">
          <div className="form-group">
            <label>고객명</label>
            <div className="readonly-field">{visitData.customer_name}</div>
          </div>
          
          <div className="form-group">
            <label>전화번호</label>
            <div className="readonly-field">{visitData.customer_phone}</div>
          </div>
          
          <div className="form-group">
            <label htmlFor="product">구매상품</label>
            <input
              type="text"
              id="product"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              placeholder="구매한 상품명을 입력하세요"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="quantity">수량</label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              min="1"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="visitDate">방문날짜</label>
            <input
              type="date"
              id="visitDate"
              value={visitDate}
              onChange={(e) => setVisitDate(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="message error">
              {error}
            </div>
          )}
          
          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-button"
              onClick={onClose}
              disabled={loading}
            >
              취소
            </button>
            <button 
              type="submit" 
              className="save-button"
              disabled={loading}
            >
              {loading ? '수정 중...' : '수정 완료'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PurchaseEditModal;