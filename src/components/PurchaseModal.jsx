import React, { useState } from 'react';
import Button from './commons/Button.jsx';
import '../assets/styles/PurchaseModal.css';

const PurchaseModal = ({ onClose, onComplete, customerName }) => {
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!productName.trim()) {
      setError('제품명을 입력해주세요.');
      return;
    }
    
    if (quantity < 1) {
      setError('수량은 1개 이상이어야 합니다.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const purchaseData = {
        product: productName.trim(),
        quantity: quantity
      };
      
      await onComplete(purchaseData);
      onClose();
    } catch (err) {
      setError('구매 기록 저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1) {
      setQuantity(value);
    }
  };

  return (
    <div className="purchase-modal-overlay">
      <div className="purchase-modal">
        <div className="purchase-modal-header">
          <h2>구매 상품 등록</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form className="purchase-modal-form" onSubmit={handleSubmit}>
          <div className="customer-info">
            <span className="customer-label">고객:</span>
            <span className="customer-name">{customerName}</span>
          </div>
          
          <div className="form-group">
            <label htmlFor="productName">제품명</label>
            <input
              type="text"
              id="productName"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="구매한 상품명을 입력하세요"
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="quantity">수량</label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={handleQuantityChange}
              min="1"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="message error">
              {error}
            </div>
          )}

          <div className="form-actions">
            <Button
              type="button"
              className="cancel-button"
              color="light"
              size="medium"
              text="취소"
              onClick={onClose}
              disabled={loading}
            />
            <Button
              type="submit"
              className="save-button"
              color="yellow"
              size="medium"
              text={loading ? '저장 중...' : '완료'}
              style={{fontWeight: 700}}
              disabled={loading || !productName.trim()}
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default PurchaseModal;