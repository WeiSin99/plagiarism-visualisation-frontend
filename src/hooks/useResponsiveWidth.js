import { useState, useEffect, useRef } from 'react';

// set width on resizing
const useResponsiveWidth = () => {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    setWidth(ref.current.clientWidth);

    let timeoutId;
    const resizeListener = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setWidth(ref.current.clientWidth);
      }, 300);
    };
    window.addEventListener('resize', resizeListener);

    return () => window.removeEventListener('resize', resizeListener);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return [ref, width];
};

export default useResponsiveWidth;
