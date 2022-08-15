const TableData = ({ children, className, id }) => {
  return (
    <td
      id={id}
      className={`whitespace-nowrap py-4 text-sm font-medium ${className}`}
    >
      {children}
    </td>
  );
};

export default TableData;
