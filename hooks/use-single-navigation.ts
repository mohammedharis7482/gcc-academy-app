import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useRef } from 'react';

/**
 * Prevents a focused screen from dispatching the same navigation interaction
 * more than once before it loses focus. The lock resets when the screen is
 * focused again, so it follows navigation lifecycle rather than a timeout.
 */
export function useSingleNavigation() {
  const navigationPending = useRef(false);

  useFocusEffect(useCallback(() => {
    navigationPending.current = false;
  }, []));

  return useCallback((navigate: () => void) => {
    if (navigationPending.current) return false;
    navigationPending.current = true;
    try {
      navigate();
      return true;
    } catch (error) {
      navigationPending.current = false;
      throw error;
    }
  }, []);
}
