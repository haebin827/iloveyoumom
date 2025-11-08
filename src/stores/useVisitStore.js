import { create } from 'zustand';
import { supabase } from '../lib/supabase.js';

const useVisitStore = create((set, get) => ({

  visitHistory: [],
  filteredHistory: [],
  historySearchTerm: '',
  sortConfig: {
    key: 'visit_date',
    direction: 'desc'
  },
  loading: false,
  error: null,
  visitLoading: false,
  visitSuccess: null,

  setHistorySearchTerm: (searchTerm) => {
    set({ historySearchTerm: searchTerm });
    // Auto-filter
    const { visitHistory } = get();
    if (!searchTerm.trim()) {
      set({ filteredHistory: visitHistory });
    } else {
      const searchTermLower = searchTerm.toLowerCase();
      const filtered = visitHistory.filter(history =>
        (history.customer_name && history.customer_name.toLowerCase().includes(searchTermLower)) ||
        (history.customer_phone && history.customer_phone.includes(searchTerm))
      );
      set({ filteredHistory: filtered });
    }
  },

  setSortConfig: (sortConfig) => set({ sortConfig }),

  // Fetch visit history
  fetchVisitHistory: async () => {
    try {
      set({ loading: true, error: null });

      const { data, error } = await supabase
        .from('history')
        .select(`
          id,
          customer_id,
          visit_date,
          visit_time,
          product,
          quantity,
          customer:customer_id (name, phone)
        `)
        .eq('status', 1)
        .order('visit_date', { ascending: false })
        .order('visit_time', { ascending: false });

      if (error) throw error;

      const formattedData = data.map(item => ({
        id: item.id,
        customer_id: item.customer_id,
        customer_name: item.customer ? item.customer.name : '-',
        customer_phone: item.customer ? item.customer.phone : '-',
        visit_date: item.visit_date,
        visit_time: item.visit_time ? new Date(item.visit_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-',
        product: item.product || '-',
        quantity: item.quantity || 1
      }));

      set({
        visitHistory: formattedData,
        filteredHistory: formattedData,
        loading: false
      });
    } catch (err) {
      set({
        error: '방문 기록을 불러오는 중 오류가 발생했습니다.',
        loading: false
      });
      console.error('Fetch visit history error');
    }
  },

  // Add a visit
  addVisit: async (customer, purchaseData, userId) => {
    if (!customer.id) {
      throw new Error('고객 ID가 없습니다. 고객 정보를 확인해주세요.');
    }

    if (!userId) {
      throw new Error('로그인이 필요합니다.');
    }

    try {
      set({ visitLoading: true });

      const today = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('history')
        .insert([
          {
            user_id: userId,
            customer_id: customer.id,
            visit_date: today,
            product: purchaseData?.product || null,
            quantity: purchaseData?.quantity || 1
          }
        ]);

      if (error) throw error;

      set({ visitSuccess: customer.id, visitLoading: false });

      // Clear success message after 3 seconds
      setTimeout(() => {
        set({ visitSuccess: null });
      }, 3000);

      return true;
    } catch (err) {
      set({ visitLoading: false });
      console.error('Add visit error');
      throw err;
    }
  },

  // Update a visit
  updateVisit: async (visitId, updatedData) => {
    try {
      const { error } = await supabase
        .from('history')
        .update(updatedData)
        .eq('id', visitId);

      if (error) throw error;

      const { visitHistory, historySearchTerm } = get();
      const updatedVisitHistory = visitHistory.map(visit =>
        visit.id === visitId ? { ...visit, ...updatedData } : visit
      );

      set({ visitHistory: updatedVisitHistory });

      // Re-filter
      if (!historySearchTerm.trim()) {
        set({ filteredHistory: updatedVisitHistory });
      } else {
        const searchTermLower = historySearchTerm.toLowerCase();
        const filtered = updatedVisitHistory.filter(history =>
          (history.customer_name && history.customer_name.toLowerCase().includes(searchTermLower)) ||
          (history.customer_phone && history.customer_phone.includes(historySearchTerm))
        );
        set({ filteredHistory: filtered });
      }
    } catch (err) {
      console.error('Update visit error');
      throw err;
    }
  },

  // Delete a visit (soft delete)
  deleteVisit: async (visitId) => {
    try {
      const { error } = await supabase
        .from('history')
        .update({ status: 0 })
        .eq('id', visitId);

      if (error) throw error;

      const { visitHistory, filteredHistory } = get();
      const updatedVisitHistory = visitHistory.filter(visit => visit.id !== visitId);
      const updatedFilteredHistory = filteredHistory.filter(visit => visit.id !== visitId);

      set({
        visitHistory: updatedVisitHistory,
        filteredHistory: updatedFilteredHistory
      });
    } catch (err) {
      console.error('Delete visit error');
      throw err;
    }
  },
}));

export default useVisitStore;
