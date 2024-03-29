import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DetailAnalysisViz from './DetailAnalysisViz';
import CompareView from './CompareView';
import PlagiarismSourcesViz from './PlagiarismSourcesViz';
import { plagiarisedColor, roundTwoDecimal } from '../../utils/utils';

const DetailAnalysis = () => {
  const { id: docId } = useParams();
  const [plagReport, setPlagReport] = useState({});
  const [caseNum, setCaseNum] = useState(-1);
  const [sourceFilenum, setSourceFilenum] = useState(null);

  const [docDetail, corpusNum] = docId.split('-');
  const docType = docDetail[0] === 's' ? 'source' : 'suspicious';
  const filenum = docDetail.slice(1);

  async function requestPlagReport() {
    const res = await fetch(
      `https://plagiarism-viz-backend.herokuapp.com/api/detail/${docType}/${filenum}`
    );
    const json = await res.json();
    setPlagReport(json);
  }

  useEffect(() => {
    requestPlagReport();
  }, []); //eslint-disable-line react-hooks/exhaustive-deps

  // set default source document to show
  useEffect(() => {
    if (
      !!Object.keys(plagReport).length &&
      plagReport.detectedCases.length > 0
    ) {
      const selectedCase = plagReport.detectedCases[caseNum >= 0 ? caseNum : 0];
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
          <p className="text-sm mt-1 text-gray-600">{plagReport.authors}</p>
          <p className="text-lg font-semibold mt-2 text-black mb-3">
            <span>Plagiarism Score: </span>
            <span
              className={`${plagiarisedColor(
                roundTwoDecimal(plagReport.plagiarismScore)
              )}`}
            >{`${Math.ceil(plagReport.plagiarismScore * 100)}%`}</span>
          </p>
          <DetailAnalysisViz plagReport={plagReport} setCaseNum={setCaseNum} />
          <CompareView
            docType={docType}
            susDoc={filenum}
            caseNum={caseNum}
            plagReport={plagReport}
            sourceFilenum={sourceFilenum}
            setCaseNum={setCaseNum}
          />
        </div>
        <div className="col-span-1">
          <PlagiarismSourcesViz
            docType={docType}
            plagReport={plagReport}
            corpusNum={corpusNum}
          />
        </div>
      </div>
    </div>
  );
};

export default DetailAnalysis;
