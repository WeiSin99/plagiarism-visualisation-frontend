import { useState, useRef, useEffect } from 'react';

const useOutsideClick = () => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const handleOutsideClick = e => {
    if (ref.current && !ref.current.contains(e.target)) {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  return [ref, isVisible, setIsVisible];
};

export default useOutsideClick;
