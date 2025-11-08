import {create} from 'zustand';
import {supabase} from '../lib/supabase.js';

const useAuthStore = create((set) => ({

  session: null,
  loading: true,

  setLoading: (loading) => set({ loading }),

  // initialize auth state
  initialize: async () => {
    try {
      const response = await supabase.auth.getSession();
      const session = response?.data?.session || null;
      set({ session, loading: false });
    } catch (error) {
      console.error('Failed to get session');
      set({ session: null, loading: false });
    }
  },

  // subscribe to auth changes
  subscribeToAuthChanges: () => {
    const result = supabase.auth.onAuthStateChange((_event, session) => {
      set({ session, loading: false });
    });

    return result?.data.subscription;
  },

  // sign out
  signOut: async () => {
    try {
      await supabase.auth.signOut();
      set({ session: null });
    } catch (error) {
      console.error('Sign out failed');
      throw error;
    }
  },
}));

export default useAuthStore;
