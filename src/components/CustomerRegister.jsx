import React, { useState } from 'react';
import { useAuth } from '../providers/AuthProvider.jsx';
import { supabase } from '../lib/supabase.js';
import toast from 'react-hot-toast';
import '../assets/styles/CustomerRegister.css';

function CustomerRegister({ form, handleChange, loading, onSuccess, onFormReset }) {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { session } = useAuth();

  const handleRegistration = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Form validation
    const newErrors = {};
    if (!form.name) {
      newErrors.name = '이름을 입력해주세요.';
    }
    if (form.phone) {
      // Phone number validation: must be exactly 11 digits
      const phoneDigits = form.phone.replace(/\D/g, '');
      if (phoneDigits.length !== 11) {
        newErrors.phone = '올바르지 않은 전화번호입니다.';
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
      const customerData = {
        user_id: session.user.id,
        name: form.name,
        phone: form.phone,
        gender: form.gender || 'NA',
        first_visit: form.first_visit || null,
        top_size: form.top_size || null,
        bottom_size: form.bottom_size || null,
        body_type: form.body_type || null,
        style_prefer: form.style_prefer || null,
        note: form.note || null,
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">탑 사이즈</label>
              <input
                type="text"
                name="top_size"
                value={form.top_size}
                onChange={handleChange}
                placeholder="S, M, L 등"
              />
            </div>
            <div className="form-group">
              <label className="form-label">바지 사이즈</label>
              <input
                type="text"
                name="bottom_size"
                value={form.bottom_size}
                onChange={handleChange}
                placeholder="26, 27, 28 등"
              />
            </div>
            <div className="form-group">
              <label className="form-label">신체 특징</label>
              <input
                type="text"
                name="body_type"
                value={form.body_type}
                onChange={handleChange}
                placeholder="어깨가 넓음, 다리가 길다 등"
              />
            </div>
            <div className="form-group">
              <label className="form-label">선호 스타일</label>
              <input
                type="text"
                name="style_prefer"
                value={form.style_prefer}
                onChange={handleChange}
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