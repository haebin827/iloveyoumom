import { create } from 'zustand';

const useUIStore = create((set) => ({

  activeTab: 'customers',
  editingCustomer: null,

  setActiveTab: (tab) => set({ activeTab: tab }),
  setEditingCustomer: (customer) => set({ editingCustomer: customer }),
  closeEditCustomer: () => set({ editingCustomer: null }),
}));

export default useUIStore;
