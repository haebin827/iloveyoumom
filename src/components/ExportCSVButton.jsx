import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import { supabase } from '../lib/supabase.js';

const ExportCSVButton = ({ startDate, endDate }) => {
    const [isExporting, setIsExporting] = useState(false);

    const handleDownload = async () => {
        setIsExporting(true);
        try {
            let query = supabase
                .from('history')
                .select(`
                    id,
                    customer_id,
                    visit_date,
                    product,
                    customer:customer_id (name, phone)
                `)
                .eq('status', 1)
                .order('visit_date', { ascending: false });

            if (startDate && endDate) {
                query = query.gte('visit_date', startDate).lte('visit_date', endDate);
            } else if (startDate) {
                query = query.gte('visit_date', startDate);
            } else if (endDate) {
                query = query.lte('visit_date', endDate);
            }

            const { data, error } = await query;

            if (error) {
                console.error('Error fetching data');
                alert('데이터 가져오기 실패: ' + error.message);
                return;
            }

            if (!data || data.length === 0) {
                alert('내보낼 데이터가 없습니다.');
                return;
            }

            // data formatting
            const formattedData = data.map(item => ({
                방문ID: item.id,
                고객ID: item.customer_id,
                고객이름: item.customer?.name || '알 수 없음',
                고객전화번호: item.customer?.phone || '알 수 없음',
                방문날짜: item.visit_date,
                구매상품: item.product || '-',
            }));

            // JSON → CSV
            const csv = Papa.unparse(formattedData);

            // add BOM (Korean support)
            const BOM = '\uFEFF';
            const csvWithBOM = BOM + csv;

            // generate Blob and download
            const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' });
            const fileName = `구매기록_${startDate || '전체'}_${endDate || '전체'}_${new Date().toISOString().split('T')[0]}.csv`;
            saveAs(blob, fileName);
        } catch (err) {
            console.error('Export error');
            alert('내보내기 중 오류가 발생했습니다.');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <button
            onClick={handleDownload}
            disabled={isExporting}
            style={{ 
                padding: '10px 20px', 
                borderRadius: '8px', 
                background: isExporting ? '#ccc' : '#4f46e5', 
                color: 'white', 
                border: 'none',
                cursor: isExporting ? 'not-allowed' : 'pointer'
            }}
        >
            {isExporting ? 'CSV 내보내는 중...' : 'CSV 내보내기'}
        </button>
    );
}

export default ExportCSVButton;
