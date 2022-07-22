import { ChevronDownIcon } from '@heroicons/react/solid';
import useOutsideClick from '../../hooks/useOutsideClick';

const Dropdown = ({ selectedItem, dropdownItems, clickHandler }) => {
  const [ref, isVisible, setIsVisible] = useOutsideClick();

  const handleClick = item => {
    clickHandler(item);
    setIsVisible(false);
  };

  return (
    <div ref={ref} className="relative inline-block text-left mb-10">
      <button
        onClick={() => setIsVisible(!isVisible)}
        type="button"
        className="inline-flex justify-center w-full rounded-full border border-primary-500 shadow-sm px-4 py-2.5 bg-white text-xl font-medium text-primary-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
        aria-haspopup="true"
      >
        {selectedItem}
        <ChevronDownIcon
          className="ml-2 h-6 w-6 self-center"
          aria-hidden="true"
        />
      </button>

      <div
        className={`origin-top-left absolute w-[500px] rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 mt-2 focus:outline-none py-2 ${
          isVisible ? 'visible' : 'invisible'
        }`}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="menu-button"
        tabIndex="-1"
      >
        {dropdownItems.map(item => (
          <button
            key={item}
            onClick={() => handleClick(item)}
            className="block w-full text-gray-700 text-base text-left px-4 py-2 hover:bg-gray-50 hover:text-primary-600"
            role="menuitem"
            tabIndex="-1"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Dropdown;
