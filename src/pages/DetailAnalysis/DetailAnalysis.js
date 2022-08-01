import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DetailAnalysisViz from './DetailAnalysisViz';
import CompareView from './CompareView';

const DetailAnalysis = () => {
  const { id: filenum } = useParams();
  const [plagReport, setPlagReport] = useState({});
  const [caseNum, setCaseNum] = useState(0);
  const [sourceDetail, setSourceDetail] = useState({});

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
      const filenum = selectedCase.sources[0].filenum;
      const startSentence = selectedCase.sources[0].sourceStart;
      const sourcePlagParts = plagReport.detectedCases.flatMap(detectedCase => {
        return detectedCase.sources.filter(
          source => source.filenum === filenum
        );
      });

      setSourceDetail({
        filenum: filenum,
        selectedCase: startSentence,
        allPlagParts: sourcePlagParts,
      });
    }
  }, [plagReport, caseNum]); //eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-8">
      <DetailAnalysisViz plagReport={plagReport} setCaseNum={setCaseNum} />
      <CompareView
        susDoc={filenum}
        caseNum={caseNum}
        plagReport={plagReport}
        sourceDetail={sourceDetail}
        setSourceDetail={setSourceDetail}
      />
    </div>
  );
};

export default DetailAnalysis;
