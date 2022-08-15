import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DetailAnalysisViz from './DetailAnalysisViz';
import CompareView from './CompareView';
import PlagiarismSourcesViz from './PlagiarismSourcesViz';

const DetailAnalysis = () => {
  const { id: filenum } = useParams();
  const [plagReport, setPlagReport] = useState({});
  const [caseNum, setCaseNum] = useState(0);
  const [sourceFilenum, setSourceFilenum] = useState(null);

  async function requestPlagReport() {
    const res = await fetch(`http://127.0.0.1:8000/api/detail/${filenum}`);
    const json = await res.json();
    setPlagReport(json);
  }

  useEffect(() => {
    requestPlagReport();
  }, []); //eslint-disable-line react-hooks/exhaustive-deps

  // set default source document to show
  useEffect(() => {
    if (!!Object.keys(plagReport).length) {
      const selectedCase = plagReport.detectedCases[caseNum];
      const filenum = selectedCase.filenum;

      setSourceFilenum(filenum);
    }
  }, [plagReport, caseNum]); //eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-8">
      <div className="grid grid-cols-4 gap-5">
        <div className="col-span-3">
          <h1 className="text-3xl font-semibold text-gray-900">
            {plagReport.title}
          </h1>
          <p className="text-base mt-2 text-gray-600">{plagReport.authors}</p>
          <DetailAnalysisViz plagReport={plagReport} setCaseNum={setCaseNum} />
          <CompareView
            susDoc={filenum}
            caseNum={caseNum}
            plagReport={plagReport}
            sourceFilenum={sourceFilenum}
            setCaseNum={setCaseNum}
          />
        </div>
        <div className="col-span-1">
          <PlagiarismSourcesViz plagReport={plagReport} />
        </div>
      </div>
    </div>
  );
};

export default DetailAnalysis;
