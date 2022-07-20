import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Table from './Table';
import DocumentViz from './DocumentViz';

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
          <Table filenum={filenum} report={report} />
        </>
      )}
    </div>
  );
};

export default Report;
