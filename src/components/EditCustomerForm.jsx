import React, { useState, useEffect } from 'react';
import useAuthStore from '../stores/useAuthStore';
import { supabase } from '../lib/supabase.js';
import Button from './commons/Button.jsx';
import '../assets/styles/EditCustomerForm.css';

const EditCustomerForm = ({ customer, onComplete }) => {
  const session = useAuthStore((state) => state.session);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    top_size: '',
    bottom_size: '',
    body_type: '',
    style_prefer: '',
    first_visit: '',
    note: '',
    gender: 'NA'
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (customer) {
      const formattedCustomer = { ...customer };
      if (formattedCustomer.first_visit) {
        formattedCustomer.first_visit = formattedCustomer.first_visit.split('T')[0];
      }

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

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    if (name === 'phone') {
      const digits = value.replace(/\D/g, '');
      if (digits.length <= 11) { // Only allow up to 11 digits
        setForm(prevForm => ({
          ...prevForm,
          [name]: digits
        }));
      }
      return;
    }
    
    setForm(prevForm => ({
      ...prevForm,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const newErrors = {};
    if (!form.name?.trim()) {
      newErrors.name = '이름을 입력해주세요.';
    }
    if (form.phone) {
      const phoneDigits = form.phone.replace(/\D/g, '');
      if (phoneDigits.length !== 11) {
        newErrors.phone = '전화번호는 11자리 숫자여야 합니다.';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    if (!session?.user?.id) {
      setMessage('로그인이 필요합니다.');
      setLoading(false);
      return;
    }

    try {
      if (form.phone) {
        const { data: existingCustomers, error: checkError } = await supabase
          .from('customer')
          .select('id, phone')
          .eq('phone', form.phone.trim())
          .eq('status', 1)
          .neq('id', customer.id); // Exclude current customer
          
        if (checkError) throw checkError;

        if (existingCustomers && existingCustomers.length > 0) {
          setErrors({ phone: '이미 등록된 전화번호입니다.' });
          setLoading(false);
          return;
        }
      }

      const formData  = { ...form};
      const fieldsToTrim = [ "first_visit", "name", "phone", "top_size", "bottom_size", "body_type", "style_prefer", "note" ];
      fieldsToTrim.forEach(key => {
        const value = formData[key]?.trim();
        if (value) {
          formData[key] = value;
        } else {
          delete formData[key];
        }
      });

      const { error } = await supabase
        .from('customer')
        .update(formData)
        .eq('id', customer.id)
        .eq('user_id', session.user.id); // Ensure user owns this customer
        
      if (error) throw error;

      onComplete({ type: 'save', data: { ...customer, ...formData }, success: true });
      
    } catch (err) {
      console.error('Customer update error');
      setMessage('고객 정보 수정 중 오류가 발생했습니다.');
      onComplete({ type: 'save', data: null, success: false });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onComplete({ type: 'cancel' });
  };
  
  return (
    <div className="edit-form-overlay">
      <div className="edit-form-container">
        <div className="edit-form-header">
          <h2>고객 정보 수정</h2>
          <button className="close-button" onClick={handleCancel}>×</button>
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
                placeholder="고객 이름"
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <div className="error-message">{errors.name}</div>}
            </div>
            
            <div className="form-group">
              <label>전화번호 <span className="required-star">*</span></label>
              <input
                type="text"
                name="phone"
                value={form.phone || ''}
                onChange={handleChange}
                placeholder="(예: 01012345678)"
                className={errors.phone ? 'error' : ''}
              />
              {errors.phone && <div className="error-message">{errors.phone}</div>}
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
            <Button
              type="button"
              className="cancel-button"
              color="light"
              size="medium"
              text="취소"
              onClick={handleCancel}
            />
            <Button
              type="submit"
              className="save-button"
              color="yellow"
              size="medium"
              text={loading ? '저장 중...' : '저장'}
              disabled={loading}
            />
          </div>
          
          {message && (
            <div className={`message ${message.includes('성공') ? 'success-message' : 'error-message'}`}>
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default EditCustomerForm; 