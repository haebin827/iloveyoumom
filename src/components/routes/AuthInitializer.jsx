import { useEffect } from 'react';
import useAuthStore from '../../stores/useAuthStore.js';

const AuthInitializer = ({ children }) => {
  const initialize = useAuthStore((state) => state.initialize);
  const subscribeToAuthChanges = useAuthStore((state) => state.subscribeToAuthChanges);

  useEffect(() => {
    // initialize auth state
    initialize();

    // subscribe to auth changes
    const subscription = subscribeToAuthChanges();

    // cleanup subscription on unmount
    return () => {
      subscription?.unsubscribe();
    };
  }, [initialize, subscribeToAuthChanges]);

  return children;
}

export default AuthInitializer;
