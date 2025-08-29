import React, { useState } from 'react';
import { useAuth } from '../providers/AuthProvider.jsx';
import { supabase } from '../lib/supabase.js';
import toast from 'react-hot-toast';
import '../assets/styles/CustomerRegister.css';

function CustomerRegister({ form, handleChange, loading, onSuccess, onFormReset }) {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { session } = useAuth();

  const handleFormChange = (e) => {
    const { name } = e.target;

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    handleChange(e);
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Form validation
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
      setIsLoading(false);
      return;
    }

    if (!session?.user?.id) {
      toast.error('로그인이 필요합니다.');
      setIsLoading(false);
      return;
    }

    try {
      if (form.phone) {
        const { data: existingCustomers, error: checkError } = await supabase
          .from('customer')
          .select('id, phone')
          .eq('phone', form.phone.trim());
          
        if (checkError) throw checkError;

        if (existingCustomers && existingCustomers.length > 0) {
          setErrors({ phone: '이미 등록된 전화번호입니다.' });
          setIsLoading(false);
          return;
        }
      }

      const customerData = {
        user_id: session.user.id,
        name: form.name?.trim() || null,
        phone: form.phone?.trim() || null,
        gender: form.gender || 'NA',
        first_visit: form.first_visit || null,
        top_size: form.top_size?.trim() || null,
        bottom_size: form.bottom_size?.trim() || null,
        body_type: form.body_type?.trim() || null,
        style_prefer: form.style_prefer?.trim() || null,
        note: form.note?.trim() || null,
      };

      // Insert customer into database
      const { error } = await supabase
        .from('customer')
        .insert([customerData]);

      if (error) {
          toast.error(`등록 실패: ${error.message}`);
      } else {
        toast.success('고객이 성공적으로 등록되었습니다!');
        // Reset form after successful registration
        if (onFormReset) {
          onFormReset();
        }
        if (onSuccess) {
          setTimeout(() => {
            onSuccess();
          }, 1000);
        }
      }
    } catch (err) {
      toast.error('고객 등록 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <h2 className="card-title centered">새 고객 등록</h2>
      
      <div className="card table-container">
        <form onSubmit={handleRegistration}>
          <div className="form-container">
            <div className="form-group">
              <label className="form-label">이름 <span className="form-label-required">*</span></label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleFormChange}
                placeholder="고객 이름"
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <div className="error-message">{errors.name}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">전화번호</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleFormChange}
                placeholder="(예: 01012345678)"
                className={errors.phone ? 'error' : ''}
              />
              {errors.phone && <div className="error-message">{errors.phone}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">성별</label>
              <select
                name="gender"
                value={form.gender || 'NA'}
                onChange={handleFormChange}
              >
                <option value="NA">알수없음</option>
                <option value="MAN">남</option>
                <option value="WOMAN">여</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">첫 방문일</label>
              <input
                type="date"
                name="first_visit"
                value={form.first_visit}
                onChange={handleFormChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">탑 사이즈</label>
              <input
                type="text"
                name="top_size"
                value={form.top_size}
                onChange={handleFormChange}
                placeholder="S, M, L 등"
              />
            </div>
            <div className="form-group">
              <label className="form-label">바지 사이즈</label>
              <input
                type="text"
                name="bottom_size"
                value={form.bottom_size}
                onChange={handleFormChange}
                placeholder="26, 27, 28 등"
              />
            </div>
            <div className="form-group">
              <label className="form-label">신체 특징</label>
              <input
                type="text"
                name="body_type"
                value={form.body_type}
                onChange={handleFormChange}
                placeholder="어깨가 넓음, 다리가 길다 등"
              />
            </div>
            <div className="form-group">
              <label className="form-label">선호 스타일</label>
              <input
                type="text"
                name="style_prefer"
                value={form.style_prefer}
                onChange={handleFormChange}
                placeholder="미니멀, 캐주얼 등"
              />
            </div>
          </div>

          <div className="form-group note-form-group">
            <label className="form-label">노트</label>
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              className="note-textarea"
              placeholder="고객에 대한 추가 메모..."
              rows={4}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || loading}
            className="submit-button"
          >
            {(isLoading || loading) ? '등록 중...' : '고객 등록하기'}
          </button>

        </form>
      </div>
    </div>
  );
}

export default CustomerRegister; 