import React, { useState, useEffect } from 'react';
import '../styles/EditCustomerForm.css';

function EditCustomerForm({ customer, onSave, onCancel }) {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    top_size: '',
    bottom_size: '',
    color_prefer: '',
    color_avoid: '',
    drink_prefer: '',
    body_type: '',
    style_prefer: '',
    birth: '',
    first_visit: '',
    note: '',
    gender: 'NA'
  });
  
  // 초기값 설정
  useEffect(() => {
    if (customer) {
      // birth와 first_visit이 있을 경우 날짜 형식으로 변환
      const formattedCustomer = { ...customer };
      if (formattedCustomer.birth) {
        formattedCustomer.birth = formattedCustomer.birth.split('T')[0];
      }
      if (formattedCustomer.first_visit) {
        formattedCustomer.first_visit = formattedCustomer.first_visit.split('T')[0];
      }
      
      // gender 필드가 없으면 기본값으로 'NA' 설정
      if (!formattedCustomer.gender) {
        formattedCustomer.gender = 'NA';
      }
      
      setForm(prevForm => ({
        ...prevForm,
        ...formattedCustomer
      }));
    }
  }, [customer]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 데이터 정제: 빈 날짜 필드는 null로 변환
    const formData = { ...form };
    formData.birth = formData.birth && formData.birth.trim() ? formData.birth : null;
    formData.first_visit = formData.first_visit && formData.first_visit.trim() ? formData.first_visit : null;
    
    onSave(formData);
  };
  
  return (
    <div className="edit-form-overlay">
      <div className="edit-form-container">
        <div className="edit-form-header">
          <h2>고객 정보 수정</h2>
          <button className="close-button" onClick={onCancel}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-grid">
            <div className="form-group">
              <label>이름 <span className="required-star">*</span></label>
              <input
                type="text"
                name="name"
                value={form.name || ''}
                onChange={handleChange}
                required
                placeholder="고객 이름"
              />
            </div>
            
            <div className="form-group">
              <label>전화번호 <span className="required-star">*</span></label>
              <input
                type="text"
                name="phone"
                value={form.phone || ''}
                onChange={handleChange}
                required
                placeholder="010-0000-0000"
              />
            </div>
            
            <div className="form-group">
              <label>성별</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="gender"
                    value="MAN"
                    checked={form.gender === 'MAN'}
                    onChange={handleChange}
                  />
                  <span>남자</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="gender"
                    value="WOMAN"
                    checked={form.gender === 'WOMAN'}
                    onChange={handleChange}
                  />
                  <span>여자</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="gender"
                    value="NA"
                    checked={form.gender === 'NA'}
                    onChange={handleChange}
                  />
                  <span>알수없음</span>
                </label>
              </div>
            </div>
            
            <div className="form-group">
              <label>생년월일</label>
              <input
                type="date"
                name="birth"
                value={form.birth || ''}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label>첫 방문일</label>
              <input
                type="date"
                name="first_visit"
                value={form.first_visit || ''}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label>탑 사이즈</label>
              <input
                type="text"
                name="top_size"
                value={form.top_size || ''}
                onChange={handleChange}
                placeholder="S, M, L 등"
              />
            </div>
            
            <div className="form-group">
              <label>바지 사이즈</label>
              <input
                type="text"
                name="bottom_size"
                value={form.bottom_size || ''}
                onChange={handleChange}
                placeholder="26, 27, 28 등"
              />
            </div>
            
            <div className="form-group">
              <label>신체 특징</label>
              <input
                type="text"
                name="body_type"
                value={form.body_type || ''}
                onChange={handleChange}
                placeholder="어깨가 넓음, 다리가 길다 등"
              />
            </div>
            
            <div className="form-group">
              <label>선호 스타일</label>
              <input
                type="text"
                name="style_prefer"
                value={form.style_prefer || ''}
                onChange={handleChange}
                placeholder="미니멀, 캐주얼 등"
              />
            </div>
            
            <div className="form-group">
              <label>선호 색상</label>
              <input
                type="text"
                name="color_prefer"
                value={form.color_prefer || ''}
                onChange={handleChange}
                placeholder="블랙, 노랑 등"
              />
            </div>
            
            <div className="form-group">
              <label>피하는 색상</label>
              <input
                type="text"
                name="color_avoid"
                value={form.color_avoid || ''}
                onChange={handleChange}
                placeholder="노랑, 빨강 등"
              />
            </div>
            
            <div className="form-group">
              <label>좋아하는 음료</label>
              <input
                type="text"
                name="drink_prefer"
                value={form.drink_prefer || ''}
                onChange={handleChange}
                placeholder="아메리카노, 녹차 등"
              />
            </div>
          </div>
          
          <div className="form-group note-group">
            <label>노트</label>
            <textarea
              name="note"
              value={form.note || ''}
              onChange={handleChange}
              rows={4}
              placeholder="고객에 대한 추가 메모..."
            />
          </div>
          
          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onCancel}>
              취소
            </button>
            <button type="submit" className="save-button">
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditCustomerForm; 