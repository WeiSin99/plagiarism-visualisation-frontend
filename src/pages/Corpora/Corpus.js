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
  const { id: corpusNum } = useParams();
  const [filter, setFilter] = useState('All');
  const [report, setReport] = useState({});

  useEffect(() => {
    requestCorpus();
  }, []); //eslint-disable-line react-hooks/exhaustive-deps

  async function requestCorpus() {
    const res = await fetch(`http://127.0.0.1:8000/api/corpus/${corpusNum}`);
    const json = await res.json();
    setReport(json);
  }

  const clickHandler = docId => {
    const corpusViz = document.getElementById('corpusViz');
    corpusViz.scrollIntoView({ behavior: 'smooth' });
    corpusViz.querySelectorAll('circle').forEach(node => {
      node.setAttribute('fill', null);
    });
    const node = corpusViz.querySelector(`[data-id='${docId}']`);
    node.setAttribute('fill', 'rgb(153, 202, 225)');
  };

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
                <TableHeader className="w-3/6">Document</TableHeader>
                <TableHeader className="w-1/6 max-w-xs">Authors</TableHeader>
                <TableHeader className="w-1/6">Plagiarism Score</TableHeader>
                <TableHeader className="w-1/6"></TableHeader>
              </TableRow>
            </TableHead>

            <TableBody striped={true}>
              {report.response.map(result => (
                <TableRow id={result.id} key={result.id}>
                  <TableData
                    className="w-3/6 cursor-pointer"
                    onClick={() => clickHandler(result.id)}
                  >
                    {result.title.length > 75
                      ? result.title.slice(0, 75) + '...'
                      : result.title}
                  </TableData>
                  <TableData className="w-1/6 max-w-xs truncate">
                    {result.authors ?? '-'}
                  </TableData>
                  <TableData
                    className={`text-md font-semibold w-1/6 ${plagiarisedColor(
                      roundTwoDecimal(result.score)
                    )}`}
                  >
                    {`${Math.ceil(result.score * 100)}%`}
                  </TableData>
                  <TableData className="w-1/6">
                    <Link
                      className="inline-flex ml-3 items-center rounded-md bg-[#186FAF] px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-[#0F609B] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      to={`/document/${
                        result.id.split('-')[0] === 'suspicious' ? 'u' : 's'
                      }${result.id.split('-')[1]}-${corpusNum}`}
                    >
                      Investigate
                    </Link>
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
