import { useEffect } from 'react';
import toast from 'react-hot-toast';
import useAuthStore from '../stores/useAuthStore';
import useCustomerStore from '../stores/useCustomerStore';
import useVisitStore from '../stores/useVisitStore';
import useUIStore from '../stores/useUIStore';
import Navbar from '../components/layout/Navbar.jsx';
import EditCustomerForm from '../components/EditCustomerForm';
import CustomerList from '../components/CustomerList';
import CustomerRegister from '../components/CustomerRegister';
import VisitHistory from '../components/VisitHistory';
import SendSMS from '../components/SendSMS.jsx'
import '../assets/styles/pages/MainPage.css';

const MainPage = () => {
    const session = useAuthStore((state) => state.session);
    const activeTab = useUIStore((state) => state.activeTab);
    const {setActiveTab, editingCustomer, setEditingCustomer} = useUIStore((state) => state);

    const fetchCustomers = useCustomerStore((state) => state.fetchCustomers);
    const updateCustomer = useCustomerStore((state) => state.updateCustomer);
    const updateVisitCounts = useCustomerStore((state) => state.updateVisitCounts);

    const fetchVisitHistory = useVisitStore((state) => state.fetchVisitHistory);
    const addVisit = useVisitStore((state) => state.addVisit);

    // Fetch customers
    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    // Fetch visit history when visits tab is active
    useEffect(() => {
        if (activeTab === 'visits') {
            fetchVisitHistory();
        }
    }, [activeTab, fetchVisitHistory]);

    const handleRegistrationSuccess = () => {
        setActiveTab('customers');
    };

    const handleVisit = async (customer, purchaseData) => {
        try {
            await addVisit(customer, purchaseData, session?.user?.id);
            await updateVisitCounts();
            toast.success(`${customer.name}님의 구매 기록이 추가되었습니다.`);
        } catch (err) {
            toast.error(err.message || '방문 기록 저장에 실패했습니다');
        }
    };

    const handleEdit = (e, customer) => {
        e.stopPropagation();
        setEditingCustomer(customer);
    };

    const handleEditComplete = ({ type, data, success }) => {
        if (type === 'cancel') {
            setEditingCustomer(null);
        } else if (type === 'save') {
            if (success) {
                updateCustomer(data);
                setEditingCustomer(null);
                toast.success('고객 정보가 성공적으로 업데이트되었습니다.');
            } else {
                toast.error('고객 정보 업데이트에 실패하였습니다.');
            }
        }
    };

    return (
        <>
            <Navbar />

            {/* Edit Customer Modal */}
            {editingCustomer && (
                <EditCustomerForm
                    customer={editingCustomer}
                    onComplete={handleEditComplete}
                />
            )}

            <div className="main-container">
                {/* Customer List Tab */}
                {activeTab === 'customers' && (
                    <CustomerList
                        handleVisit={handleVisit}
                        handleEdit={handleEdit}
                    />
                )}

                {/* Customer Register Tab */}
                {activeTab === 'register' && (
                    <CustomerRegister
                        onSuccess={handleRegistrationSuccess}
                    />
                )}

                {/* Visit History Tab */}
                {activeTab === 'visits' && (
                    <VisitHistory />
                )}

                {/* Send SMS Tab */}
                {activeTab === 'sms' && (
                    <SendSMS />
                )}
            </div>
        </>
    );
}

export default MainPage;
