const Table = ({ children }) => {
  return (
    <div className="mt-3 overflow-x-auto shadow ring-1 ring-black ring-opacity-5 rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">{children}</table>
    </div>
  );
};

export default Table;
