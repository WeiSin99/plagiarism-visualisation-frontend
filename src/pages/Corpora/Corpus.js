import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CorpusViz from './CorpusViz';

import Table from '../../components/table/Table';
import TableRow from '../../components/table/TableRow';
import TableHead from '../../components/table/TableHead';
import TableHeader from '../../components/table/TableHeader';
import TableBody from '../../components/table/TableBody';
import TableData from '../../components/table/TableData';

import Dropdown from '../../components/dropdown/Dropdown';

const Corpus = () => {
  const { id: filenum } = useParams();
  const [filter, setFilter] = useState('All');
  const [report, setReport] = useState({});

  useEffect(() => {
    requestCorpusReport();
  }, []); //eslint-disable-line react-hooks/exhaustive-deps

  async function requestCorpusReport() {
    const res = await fetch(`/corpus-report${filenum}.json`);
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
                <TableHeader>Document</TableHeader>
              </TableRow>
            </TableHead>

            <TableBody striped={true}>
              {Object.keys(report).map(filenum => (
                <TableRow key={filenum}>
                  <TableData>
                    {`source-document${filenum.padStart(5, 0)}`}
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
