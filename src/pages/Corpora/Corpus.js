import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import CorpusViz from './CorpusViz';

import Table from '../../components/table/Table';
import TableRow from '../../components/table/TableRow';
import TableHead from '../../components/table/TableHead';
import TableHeader from '../../components/table/TableHeader';
import TableBody from '../../components/table/TableBody';
import TableData from '../../components/table/TableData';

import Dropdown from '../../components/dropdown/Dropdown';
import { plagiarisedColor, roundTwoDecimal } from '../../utils/utils';

const Corpus = () => {
  const { id: corpus_num } = useParams();
  const [filter, setFilter] = useState('All');
  const [report, setReport] = useState({});

  useEffect(() => {
    requestCorpus();
  }, []); //eslint-disable-line react-hooks/exhaustive-deps

  async function requestCorpus() {
    const res = await fetch(`http://127.0.0.1:8000/api/corpus/${corpus_num}`);
    const json = await res.json();
    setReport(json);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-8">
      <Dropdown
        selectedItem={filter}
        clickHandler={setFilter}
        dropdownItems={['All', 'Linked Documents']}
      />
      {!!Object.keys(report).length && (
        <>
          <CorpusViz report={report} filter={filter} />
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader className="w-3/4">Document</TableHeader>
                <TableHeader className="w-1/5">Authors</TableHeader>
                <TableHeader className="w-1/5">Plagiarism Score</TableHeader>
              </TableRow>
            </TableHead>

            <TableBody striped={true}>
              {report.response.map(result => (
                <TableRow id={result.id} key={result.id}>
                  <TableData className="w-3/5">
                    {result.id.startsWith('source') ? (
                      result.title.length > 75 ? (
                        result.title.slice(0, 75) + '...'
                      ) : (
                        result.title
                      )
                    ) : (
                      <Link to={`/document/${result.id.split('-')[1]}`}>
                        {result.title.length > 75
                          ? result.title.slice(0, 75) + '...'
                          : result.title}
                      </Link>
                    )}
                  </TableData>
                  <TableData className="w-1/5">
                    {result.authors ?? '-'}
                  </TableData>
                  <TableData
                    className={`text-md font-semibold w-1/5 ${plagiarisedColor(
                      roundTwoDecimal(result.score)
                    )}`}
                  >
                    {`${Math.round(result.score * 100)}%`}
                  </TableData>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </div>
  );
};

export default Corpus;
