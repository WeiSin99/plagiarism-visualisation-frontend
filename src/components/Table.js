import { useParams } from 'react-router-dom';
import susDocs from '../assets/report.json';

const Table = () => {
  const { id: susDoc } = useParams();
  /* const [susDocs, setSusDocs] = useState({});

  useEffect(() => {
    requestSusDocs();
  }, []); //eslint-disable-line react-hooks/exhaustive-deps

  async function requestSusDocs() {
    const res = await fetch('../assets/report.json');
    const json = await res.json();
    setSusDocs(json);
  } */
  /* console.log(id);
  const susDoc = Number.parseInt(id); */

  return (
    <div className="mt-8 flex justify-center min-w-full">
      <div className="w-11/12 align-middle py-2 md:px-2 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          {`Plagiarism Report for suspicious-document${susDoc.padStart(5, 0)}`}
        </h1>

        <div>{susDocs[susDoc]['true_sources'].join(', ')}</div>

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
              {susDocs[susDoc]['detected'].map((filenum, idx) => (
                <tr
                  key={filenum}
                  className={idx % 2 === 0 ? undefined : 'bg-gray-50'}
                >
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 w-3/4 text-sm font-medium text-gray-900 sm:pl-6">
                    {`source-document${filenum.toString().padStart(5, 0)}`}
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-left text-sm font-medium sm:pr-6">
                    {Math.round(
                      (Number.parseFloat(susDocs[susDoc]['scores'][idx]) +
                        Number.EPSILON) *
                        100
                    ) / 100}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Table;
