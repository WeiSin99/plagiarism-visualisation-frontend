const TableData = ({ children, className }) => {
  return (
    <td
      className={`whitespace-nowrap py-4 text-sm font-medium text-gray-900 ${className}`}
    >
      {children}
    </td>
  );
};

export default TableData;
