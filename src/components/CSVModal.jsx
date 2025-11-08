import React, { useState, useEffect } from 'react';
import useAuthStore from '../stores/useAuthStore';
import { supabase } from '../lib/supabase.js';
import * as XLSX from 'xlsx';
import Button from './commons/Button.jsx';
import '../assets/styles/CSVModal.css';

const CSVModal = ({ onClose, visitHistory }) => {
  const session = useAuthStore((state) => state.session);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Set default dates
    if (visitHistory && visitHistory.length > 0) {
      // Find oldest date
      const dates = visitHistory.map(visit => visit.visit_date).sort();
      const oldestDate = dates[0];
      const today = new Date().toISOString().split('T')[0];
      
      setStartDate(oldestDate || today);
      setEndDate(today);
    }
  }, [visitHistory]);

  const getStoreInfo = async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      
      return {
        storeName: data.user?.user_metadata?.store_name || '매장명 없음',
        ownerName: data.user?.user_metadata?.full_name || '점주명 없음'
      };
    } catch (err) {
      console.error('매장 정보 가져오기 오류');
      return {
        storeName: '매장명 없음',
        ownerName: '점주명 없음'
      };
    }
  };

  const handleDownload = async () => {
    if (!startDate || !endDate) {
      setError('시작날짜와 끝날짜를 모두 선택해주세요.');
      return;
    }

    if (startDate > endDate) {
      setError('시작날짜는 끝날짜보다 이전이어야 합니다.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { storeName, ownerName } = await getStoreInfo();

      // filter data by date range
      const filteredData = visitHistory.filter(visit => 
        visit.visit_date >= startDate && visit.visit_date <= endDate
      );

      // create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet([]);

      // add header information
      XLSX.utils.sheet_add_aoa(ws, [
        [''],
        ['매장이름', storeName],
        ['점주명', ownerName],
        ['기간', `${startDate} ~ ${endDate}`],
        [''],
        ['No', '고객명', '전화번호', '구매상품', '수량', '방문날짜']
      ], { origin: 'A1' });

      // add data rows
      const dataRows = filteredData.map((visit, index) => [
        index + 1,
        visit.customer_name,
        visit.customer_phone,
        visit.product || '',
        visit.quantity || 1,
        visit.visit_date
      ]);

      if (dataRows.length > 0) {
        XLSX.utils.sheet_add_aoa(ws, dataRows, { origin: 'A7' });
      }

      XLSX.utils.book_append_sheet(wb, ws, '구매기록');

      const today = new Date().toISOString().split('T')[0];
      const filename = `${storeName}_구매기록_${startDate}_${endDate}_${today}.xlsx`;

      // Download file
      XLSX.writeFile(wb, filename);

      onClose();
    } catch (err) {
      console.error('엑셀 다운로드 오류');
      setError('다운로드 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="csv-modal-overlay">
      <div className="csv-modal">
        <div className="csv-modal-header">
          <h2>엑셀 다운로드</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="csv-modal-form">
          <div className="form-group">
            <p>다운로드할 기간을 선택해주세요.</p>
          </div>
          
          <div className="form-group">
            <label htmlFor="startDate">시작날짜</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="endDate">끝날짜</label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
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
              type="button"
              className="save-button"
              color="green"
              size="medium"
              text={loading ? '다운로드 중...' : '다운로드'}
              onClick={handleDownload}
              disabled={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CSVModal;