const Table = ({ report }) => {
  return (
    <>
      <div>{report.true_sources.join(', ')}</div>

      <div className="mt-8 overflow-x-auto shadow ring-1 ring-black ring-opacity-5 rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 w-3/4 text-left text-sm font-semibold text-gray-900 sm:pl-6"
              >
                Potential Plagiarism Source
              </th>
              <th
                scope="col"
                className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-left text-sm font-semibold text-gray-900"
              >
                Similarity Score
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {report.potential_sources.map((sourceFilenum, idx) => (
              <tr
                key={sourceFilenum}
                className={idx % 2 === 0 ? undefined : 'bg-gray-50'}
              >
                <td className="whitespace-nowrap py-4 pl-4 pr-3 w-3/4 text-sm font-medium text-gray-900 sm:pl-6">
                  {`source-document${sourceFilenum.toString().padStart(5, 0)}`}
                </td>
                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-left text-sm font-medium sm:pr-6">
                  {Math.round(
                    (Number.parseFloat(report.scores[idx]) + Number.EPSILON) *
                      100
                  ) / 100}
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
