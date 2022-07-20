import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SentenceViz from './SentenceViz';

const Sentence = () => {
  const { id: filenum } = useParams();
  const [report, setReport] = useState({});

  useEffect(() => {
    requestReport();
  }, []); //eslint-disable-line react-hooks/exhaustive-deps

  async function requestReport() {
    const res = await fetch('http://127.0.0.1:8000/api/detail/2964');
    const json = await res.json();
    setReport(json);
  }

  return (
    <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-8">
      <h1 className="text-2xl font-semibold text-gray-900">
        {`Plagiarism Report for suspicious-document${filenum.padStart(5, 0)}`}
      </h1>
      {!!Object.keys(report).length && (
        <div className="mt-10">
          <SentenceViz report={report} />
        </div>
      )}
    </div>
  );
};

export default Sentence;
