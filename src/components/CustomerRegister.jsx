import React, { useState, useEffect } from 'react';
import useAuthStore from '../stores/useAuthStore';
import useCustomerStore from '../stores/useCustomerStore';
import useUIStore from '../stores/useUIStore';
import { supabase } from '../lib/supabase.js';
import toast from 'react-hot-toast';
import Button from './commons/Button.jsx';
import '../assets/styles/CustomerRegister.css';

const CustomerRegister = ({ onSuccess }) => {
  const session = useAuthStore((state) => state.session);
  const addCustomer = useCustomerStore((state) => state.addCustomer);
  const activeTab = useUIStore((state) => state.activeTab);

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
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
    first_visit: new Date().toISOString().split('T')[0],
    note: '',
    gender: 'NA'
  });

  // Reset form when switching to register tab
  useEffect(() => {
    if (activeTab === 'register') {
      setForm({
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
        first_visit: new Date().toISOString().split('T')[0],
        note: '',
        gender: 'NA'
      });
    }
  }, [activeTab]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    if (name === 'phone') {
      const digits = value.replace(/\D/g, '');
      if (digits.length <= 11) {
        setForm({ ...form, [name]: digits });
      }
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const resetForm = () => {
    setForm({
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
      first_visit: new Date().toISOString().split('T')[0],
      note: '',
      gender: 'NA'
    });
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
          .eq('phone', form.phone.trim())
          .eq('status', 1);

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

      const { data, error } = await supabase
        .from('customer')
        .insert([customerData])
        .select();

      if (error) {
        toast.error(`등록 실패: ${error.message}`);
      } else {
        toast.success('고객이 성공적으로 등록되었습니다!');

        // Add the new customer to Zustand store
        if (data && data.length > 0) {
          addCustomer(data[0]);
        }

        resetForm();

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
      <h2 className="card-title centered">고객 등록</h2>

      <div className="card customer-register-table-container">
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
              onChange={handleFormChange}
              className="note-textarea"
              placeholder="고객에 대한 추가 메모..."
              rows={4}
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="submit-button"
            color="yellow"
            size="large"
            text={isLoading ? '등록 중...' : '고객 등록하기'}
            style={{ width: '100%', padding: '12px 24px' }}
          />

        </form>
      </div>
    </div>
  );
}

export default CustomerRegister;
