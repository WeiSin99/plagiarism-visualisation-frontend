import { useState } from 'react';
import { QuestionMarkCircleIcon } from '@heroicons/react/outline';

const Tooltip = ({ children, className }) => {
  const [tooltipActive, setTooltipActive] = useState(false);

  return (
    <div className={`flex justify-end ${className}`}>
      <div className="relative flex items-center">
        <div
          className={`z-20 absolute border-[1px] bg-white border-black px-4 py-2 rounded flex items-center transition-all duration-150 w-80 ${
            tooltipActive ? '' : 'invisible'
          }`}
          style={{ top: '25px', left: '-120px', opacity: 1 }}
        >
          {/* <div
            className="border-[1px] border-black h-3 w-3 absolute bg-white z-10"
            style={{ top: '-6px', left: '125px', transform: 'rotate(45deg)' }}
          /> */}
          {children}
        </div>
        <QuestionMarkCircleIcon
          className="h-5 w-5"
          onMouseEnter={() => setTooltipActive(true)}
          onMouseLeave={() => setTooltipActive(false)}
        />
      </div>
    </div>
  );
};

export default Tooltip;
