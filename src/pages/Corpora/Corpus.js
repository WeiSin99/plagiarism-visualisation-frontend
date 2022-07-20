import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CorpusViz from './CorpusViz';
import Table from './Table';

const Corpus = () => {
  const { id: filenum } = useParams();
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
      {!!Object.keys(report).length && (
        <>
          <CorpusViz report={report} />
          <Table report={report} />
        </>
      )}
    </div>
  );
};

export default Corpus;
