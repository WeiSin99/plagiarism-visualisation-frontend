const TableData = ({ children, className, id, onClick }) => {
  return (
    <td
      id={id}
      className={`whitespace-nowrap py-4 text-sm font-medium ${className}`}
      onClick={onClick}
    >
      {children}
    </td>
  );
};

export default TableData;
