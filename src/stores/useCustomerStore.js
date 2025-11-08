import { create } from 'zustand';
import { supabase } from '../lib/supabase.js';

const useCustomerStore = create((set, get) => ({

  customers: [],
  filteredCustomers: [],
  searchTerm: '',
  loading: false,
  error: null,

  setSearchTerm: (searchTerm) => {
    set({ searchTerm });
    // Automatically filter when search term changes
    const { customers } = get();
    if (!searchTerm.trim()) {
      set({ filteredCustomers: customers });
    } else {
      const searchTermLower = searchTerm.toLowerCase();
      const filtered = customers.filter(customer =>
        (customer.name && customer.name.toLowerCase().includes(searchTermLower)) ||
        (customer.phone && customer.phone.includes(searchTerm))
      );
      set({ filteredCustomers: filtered });
    }
  },

  // Fetch all customers with visit counts
  fetchCustomers: async () => {
    try {
      set({ loading: true, error: null });

      const { data, error } = await supabase
        .from('customer')
        .select('*')
        .eq('status', 1)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get visit counts
      const { data: historyData, error: historyError } = await supabase
        .from('history')
        .select('customer_id')
        .eq('status', 1);

      if (historyError) throw historyError;

      // Calculate visit counts per customer
      const visitCount = {};
      historyData.forEach(visit => {
        visitCount[visit.customer_id] = (visitCount[visit.customer_id] || 0) + 1;
      });

      const customersWithVisitCount = data.map(customer => ({
        ...customer,
        visit_count: visitCount[customer.id] || 0
      }));

      set({
        customers: customersWithVisitCount,
        filteredCustomers: customersWithVisitCount,
        loading: false
      });
    } catch (err) {
      set({
        error: '고객 데이터를 불러오는 중 오류가 발생했습니다.',
        loading: false
      });
      console.error('Fetch customers error');
    }
  },

  // Add a new customer
  addCustomer: (newCustomer) => {
    const { customers, filteredCustomers, searchTerm } = get();
    const customerWithVisitCount = { ...newCustomer, visit_count: 0 };
    const updatedCustomers = [customerWithVisitCount, ...customers];

    set({ customers: updatedCustomers });

    // Update filtered list based on search term
    const searchTermLower = searchTerm.toLowerCase();
    if (!searchTerm.trim() ||
      (newCustomer.name && newCustomer.name.toLowerCase().includes(searchTermLower)) ||
      (newCustomer.phone && newCustomer.phone.includes(searchTerm))) {
      set({ filteredCustomers: [customerWithVisitCount, ...filteredCustomers] });
    }
  },

  // Update a customer
  updateCustomer: (updatedCustomer) => {
    const { customers, searchTerm } = get();
    const updatedCustomers = customers.map(c =>
      c.id === updatedCustomer.id ? { ...updatedCustomer } : c
    );

    set({ customers: updatedCustomers });

    // Re-filter based on search term
    if (!searchTerm.trim()) {
      set({ filteredCustomers: updatedCustomers });
    } else {
      const searchTermLower = searchTerm.toLowerCase();
      const filtered = updatedCustomers.filter(customer =>
        (customer.name && customer.name.toLowerCase().includes(searchTermLower)) ||
        (customer.phone && customer.phone.includes(searchTerm))
      );
      set({ filteredCustomers: filtered });
    }
  },

  // Delete a customer (soft delete)
  deleteCustomer: (customerId) => {
    const { customers, filteredCustomers } = get();
    const updatedCustomers = customers.filter(c => c.id !== customerId);
    const updatedFilteredCustomers = filteredCustomers.filter(c => c.id !== customerId);

    set({
      customers: updatedCustomers,
      filteredCustomers: updatedFilteredCustomers
    });
  },

  // Update visit counts after adding a visit
  updateVisitCounts: async () => {
    try {
      const { data: historyData, error } = await supabase
        .from('history')
        .select('customer_id')
        .eq('status', 1);

      if (error) throw error;

      const visitCount = {};
      historyData.forEach(visit => {
        visitCount[visit.customer_id] = (visitCount[visit.customer_id] || 0) + 1;
      });

      const { customers, searchTerm } = get();
      const updatedCustomers = customers.map(c => ({
        ...c,
        visit_count: visitCount[c.id] || 0
      }));

      set({ customers: updatedCustomers });

      // Re-filter
      if (!searchTerm.trim()) {
        set({ filteredCustomers: updatedCustomers });
      } else {
        const searchTermLower = searchTerm.toLowerCase();
        const filtered = updatedCustomers.filter(c =>
          (c.name && c.name.toLowerCase().includes(searchTermLower)) ||
          (c.phone && c.phone.includes(searchTerm))
        );
        set({ filteredCustomers: filtered });
      }
    } catch (err) {
      console.error('Update visit counts error');
    }
  },
}));

export default useCustomerStore;
