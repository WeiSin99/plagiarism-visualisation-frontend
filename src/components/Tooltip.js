import { BeakerIcon } from '@heroicons/react/solid';
const Tooltip = () => {
  return (
    <div>
      <BeakerIcon className="h-5 w-5" />
      <div className="absolute">
        <svg
          className="absolute z-10 w-6 h-6 text-orange-500 transform -translate-x-12 -translate-y-11 fill-current stroke-current"
          width="8"
          height="8"
        >
          <rect x="12" y="-10" width="8" height="8" transform="rotate(45)" />
        </svg>
        <div className="absolute top-0 z-10 w-32 p-2 -mt-1 text-sm leading-tight text-white transform  bg-orange-500 rounded-lg shadow-lg">
          Hi, I am Tooltip
        </div>
      </div>
    </div>
  );
};

export default Tooltip;
