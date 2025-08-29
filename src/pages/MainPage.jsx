import { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar.jsx';
import EditCustomerForm from '../components/EditCustomerForm';
import CustomerList from '../components/CustomerList';
import CustomerRegister from '../components/CustomerRegister';
import VisitHistory from '../components/VisitHistory';
import '../assets/styles/MainPage.css';
import {supabase} from "../lib/supabase.js";

function MainPage() {
    const [activeTab, setActiveTab] = useState('customers');
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
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [visitLoading, setVisitLoading] = useState(false);
    const [visitSuccess, setVisitSuccess] = useState(null);
    const [visitHistory, setVisitHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [historyError, setHistoryError] = useState(null);
    const [historySearchTerm, setHistorySearchTerm] = useState('');
    const [filteredHistory, setFilteredHistory] = useState([]);
    const [sortConfig, setSortConfig] = useState({
        key: 'visit_date',
        direction: 'desc'
    });
    const [editingCustomer, setEditingCustomer] = useState(null);
    
    // 고객 데이터 가져오기
    const fetchCustomers = async () => {
        try {
            setLoading(true);
            setError(null);
            const { data, error } = await supabase
                .from('customer')
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            
            // 방문 횟수 데이터 가져오기
            const { data: historyData, error: historyError } = await supabase
                .from('history')
                .select('customer_id');
                
            if (historyError) throw historyError;
            
            // 고객별 방문 횟수 계산
            const visitCount = {};
            historyData.forEach(visit => {
                if (visit.customer_id in visitCount) {
                    visitCount[visit.customer_id]++;
                } else {
                    visitCount[visit.customer_id] = 1;
                }
            });

            const customersWithVisitCount = data.map(customer => ({
                ...customer,
                visit_count: visitCount[customer.id] || 0
            }));
            
            setCustomers(customersWithVisitCount || []);
            setFilteredCustomers(customersWithVisitCount || []);
        } catch (err) {
            setError('고객 데이터를 불러오는 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    // 검색 필터링
    useEffect(() => {
        let filtered = customers;
        
        // 검색 필터링
        if (searchTerm.trim()) {
            const searchTermLower = searchTerm.toLowerCase();
            filtered = customers.filter(customer => 
                (customer.name && customer.name.toLowerCase().includes(searchTermLower)) || 
                (customer.phone && customer.phone.includes(searchTerm))
            );
        }
        
        setFilteredCustomers(filtered);
    }, [searchTerm, customers]);

    // activeTab이 변경될 때 폼 초기화 (탭 전환 시)
    useEffect(() => {
        // 다른 탭에서 register 탭으로 전환될 때 폼 초기화
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Special handling for phone number - only allow digits and limit to 11 characters
        if (name === 'phone') {
            const digits = value.replace(/\D/g, ''); // Remove all non-digits
            if (digits.length <= 11) { // Only allow up to 11 digits
                setForm({ ...form, [name]: digits });
            }
            return;
        }
        
        setForm({ ...form, [name]: value });
    };

    // 폼 리셋 함수
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

    // 고객 등록 성공 콜백
    const handleRegistrationSuccess = () => {
        fetchCustomers(); // 데이터 새로고침
        setActiveTab('customers'); // 고객 목록 탭으로 이동
    };


    const handleVisit = async (customer) => {
        if (!customer.id) {
            alert('고객 ID가 없습니다. 고객 정보를 확인해주세요.');
            return;
        }
        
        try {
            setVisitLoading(true);

            const today = new Date().toISOString().split('T')[0];

            const { data, error } = await supabase
                .from('history')
                .insert([
                    { 
                        customer_id: customer.id, 
                        visit_date: today
                    }
                ]);
                
            if (error) throw error;

            const { data: historyData, error: historyError } = await supabase
                .from('history')
                .select('customer_id');
                
            if (historyError) throw historyError;
            
            // 고객별 방문 횟수
            const visitCount = {};
            historyData.forEach(visit => {
                if (visit.customer_id in visitCount) {
                    visitCount[visit.customer_id]++;
                } else {
                    visitCount[visit.customer_id] = 1;
                }
            });

            const updatedCustomers = customers.map(c => ({
                ...c,
                visit_count: visitCount[c.id] || 0
            }));
            
            setCustomers(updatedCustomers);
            setFilteredCustomers(
                searchTerm 
                ? updatedCustomers.filter(c => 
                    (c.name && c.name.toLowerCase().includes(searchTerm.toLowerCase())) || 
                    (c.phone && c.phone.includes(searchTerm))
                  )
                : updatedCustomers
            );

            setVisitSuccess(customer.id);
            setTimeout(() => {
                setVisitSuccess(null);
            }, 3000);
            
        } catch (err) {
            alert('방문 기록 저장에 실패했습니다');
        } finally {
            setVisitLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'visits') {
            fetchVisitHistory();
        }
    }, [activeTab]);

    useEffect(() => {
        if (!historySearchTerm.trim()) {
            setFilteredHistory(visitHistory);
            return;
        }

        const searchTermLower = historySearchTerm.toLowerCase();
        const filtered = visitHistory.filter(history =>
            (history.customer_name && history.customer_name.toLowerCase().includes(searchTermLower)) ||
            (history.customer_phone && history.customer_phone.includes(historySearchTerm))
        );
        setFilteredHistory(filtered);
    }, [historySearchTerm, visitHistory]);

    const getSortedHistory = () => {
        const sortableHistory = [...filteredHistory];
        if (sortConfig.key) {
            sortableHistory.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableHistory;
    };

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const fetchVisitHistory = async () => {
        try {
            setHistoryLoading(true);
            setHistoryError(null);

            const { data, error } = await supabase
                .from('history')
                .select(`
                    id,
                    customer_id,
                    visit_date,
                    visit_time,
                    customer:customer_id (name, phone)
                `)
                .order('visit_date', { ascending: false })
                .order('visit_time', { ascending: false });

            if (error) throw error;

            const formattedData = data.map(item => ({
                id: item.id,
                customer_id: item.customer_id,
                customer_name: item.customer ? item.customer.name : '-',
                customer_phone: item.customer ? item.customer.phone : '-',
                visit_date: item.visit_date,
                visit_time: item.visit_time ? new Date(item.visit_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '-'
            }));

            setVisitHistory(formattedData);
            setFilteredHistory(formattedData);
        } catch (err) {
            setHistoryError('방문 기록을 불러오는 중 오류가 발생했습니다.');
        } finally {
            setHistoryLoading(false);
        }
    };

    const handleEdit = (e, customer) => {
        e.stopPropagation();
        setEditingCustomer(customer);
    };

    const handleCancelEdit = () => {
        setEditingCustomer(null);
    };

    const handleSaveEdit = async (updatedCustomer) => {
        try {
            setLoading(true);

            const { ...customerDataToUpdate } = updatedCustomer;

            const { data, error } = await supabase
                .from('customer')
                .update(customerDataToUpdate)
                .eq('id', updatedCustomer.id)
                .select();
                
            if (error) throw error;

            const updatedCustomers = customers.map(c => 
                c.id === updatedCustomer.id ? { ...updatedCustomer } : c
            );
            
            setCustomers(updatedCustomers);
            setFilteredCustomers(
                searchTerm 
                ? updatedCustomers.filter(customer => 
                    (customer.name && customer.name.toLowerCase().includes(searchTerm.toLowerCase())) || 
                    (customer.phone && customer.phone.includes(searchTerm))
                  )
                : updatedCustomers
            );
            
            setEditingCustomer(null);
            alert('고객 정보가 성공적으로 업데이트되었습니다.');
        } catch (err) {
            alert('업데이트 실패');
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
            
            {/* 수정 폼 모달 */}
            {editingCustomer && (
                <EditCustomerForm 
                    customer={editingCustomer}
                    onSave={handleSaveEdit}
                    onCancel={handleCancelEdit}
                />
            )}
            
            <div className="main-container">
                {/* 고객 관리 탭 */}
                {activeTab === 'customers' && (
                    <CustomerList 
                        searchTerm={searchTerm} 
                        setSearchTerm={setSearchTerm} 
                        filteredCustomers={filteredCustomers}
                        loading={loading}
                        error={error}
                        visitSuccess={visitSuccess}
                        visitLoading={visitLoading}
                        handleVisit={handleVisit}
                        handleEdit={handleEdit}
                        onCustomerUpdate={fetchCustomers}
                    />
                )}
                
                {/* 고객 등록 탭 */}
                {activeTab === 'register' && (
                    <CustomerRegister 
                        form={form}
                        handleChange={handleChange}
                        loading={loading}
                        onSuccess={handleRegistrationSuccess}
                        onFormReset={resetForm}
                    />
                )}
                
                {/* 방문 기록 탭 */}
                {activeTab === 'visits' && (
                    <VisitHistory 
                        historySearchTerm={historySearchTerm}
                        setHistorySearchTerm={setHistorySearchTerm}
                        historyLoading={historyLoading}
                        historyError={historyError}
                        filteredHistory={filteredHistory}
                        sortConfig={sortConfig}
                        requestSort={requestSort}
                        getSortedHistory={getSortedHistory}
                    />
                )}
            </div>
        </>
    );
}

export default MainPage;