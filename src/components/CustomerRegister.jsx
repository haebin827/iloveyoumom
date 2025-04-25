import React from 'react';
import '../styles/MainPage.css';

function CustomerRegister({ form, handleChange, handleSubmit, loading }) {
  return (
    <div>
      <h2 className="card-title centered">새 고객 등록</h2>
      
      <div className="card table-container">
        <form onSubmit={handleSubmit}>
          <div className="form-container">
            <div className="form-group">
              <label className="form-label">이름 *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="고객 이름"
              />
            </div>
            <div className="form-group">
              <label className="form-label">전화번호 *</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                placeholder="010-0000-0000"
              />
            </div>
            <div className="form-group">
              <label className="form-label">생년월일</label>
              <input
                type="date"
                name="birth"
                value={form.birth}
                onChange={handleChange}
              />
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
              <label className="form-label">선호 색상</label>
              <input
                type="text"
                name="color_prefer"
                value={form.color_prefer}
                onChange={handleChange}
                placeholder="블랙, 노랑 등"
              />
            </div>
            <div className="form-group">
              <label className="form-label">피하는 색상</label>
              <input
                type="text"
                name="color_avoid"
                value={form.color_avoid}
                onChange={handleChange}
                placeholder="노랑, 빨강 등"
              />
            </div>
            <div className="form-group">
              <label className="form-label">좋아하는 음료</label>
              <input
                type="text"
                name="drink_prefer"
                value={form.drink_prefer}
                onChange={handleChange}
                placeholder="아메리카노, 녹차 등"
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
            disabled={loading}
            className="submit-button"
          >
            {loading ? '등록 중...' : '고객 등록하기'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CustomerRegister; 