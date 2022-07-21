const TableHeader = ({ children, className }) => {
  return (
    <th
      scope="col"
      className={`py-3.5 text-left text-sm font-semibold text-gray-900 ${className}`}
    >
      {children}
    </th>
  );
};

export default TableHeader;
