const Table = ({ report }) => {
  return (
    <>
      <div className="mt-8 overflow-x-auto shadow ring-1 ring-black ring-opacity-5 rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 w-3/4 text-left text-sm font-semibold text-gray-900 sm:pl-6"
              >
                Document
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {Object.keys(report).map((filenum, idx) => (
              <tr
                key={filenum}
                className={idx % 2 === 0 ? undefined : 'bg-gray-50'}
              >
                <td className="whitespace-nowrap py-4 pl-4 pr-3 w-3/4 text-sm font-medium text-gray-900 sm:pl-6">
                  {`source-document${filenum.padStart(5, 0)}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Table;
