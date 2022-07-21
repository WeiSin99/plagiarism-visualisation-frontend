import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DocumentViz from './DocumentViz';

import Table from '../../components/table/Table';
import TableRow from '../../components/table/TableRow';
import TableHead from '../../components/table/TableHead';
import TableHeader from '../../components/table/TableHeader';
import TableBody from '../../components/table/TableBody';
import TableData from '../../components/table/TableData';

const roundTwoDecimal = num => {
  return Math.round((Number.parseFloat(num) + Number.EPSILON) * 100) / 100;
};

const Report = () => {
  const { id: filenum } = useParams();
  const [report, setReport] = useState({});

  useEffect(() => {
    requestSusDocs();
  }, []); //eslint-disable-line react-hooks/exhaustive-deps

  async function requestSusDocs() {
    const res = await fetch(
      `/tfidf-reports/suspicious-document${filenum}.json`
    );
    const json = await res.json();
    setReport(json);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-8">
      <h1 className="text-2xl font-semibold text-gray-900">
        {`Plagiarism Report for suspicious-document${filenum.padStart(5, 0)}`}
      </h1>
      {!!Object.keys(report).length && (
        <>
          <DocumentViz report={report} />
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader className="w-3/4">
                  Potential Plagiarism Source
                </TableHeader>
                <TableHeader>Similarity Score</TableHeader>
              </TableRow>
            </TableHead>

            <TableBody striped={true}>
              {report.potential_sources.map((sourceFilenum, idx) => (
                <TableRow key={sourceFilenum}>
                  <TableData className="w-3/4">
                    {`source-document${sourceFilenum
                      .toString()
                      .padStart(5, 0)}`}
                  </TableData>
                  <TableData>{roundTwoDecimal(report.scores[idx])}</TableData>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </div>
  );
};

export default Report;
