import { useState, useEffect } from 'react';

const useIsLargeScreen = () => {
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1280);
    };

    // Check if window is defined (client-side)
    if (typeof window !== 'undefined') {
      handleResize(); // Set initial value
      window.addEventListener('resize', handleResize);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  return isLargeScreen;
};

export default useIsLargeScreen;
