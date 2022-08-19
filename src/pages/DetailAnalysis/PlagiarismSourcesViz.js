import { useEffect, useState } from 'react';
import { plagiarisedColor, roundTwoDecimal } from '../../utils/utils';
import Tooltip from '../../components/Tooltip';

const PlagiarismSourcesViz = ({ docType, plagReport, corpusNum }) => {
  const [selectedSource, setSelectedSource] = useState(0);
  const [corpus, setCorpus] = useState([]);
  const [internalSources, setInternalSources] = useState([]);
  const [externalSources, setExternalSources] = useState([]);

  async function requestCorpus() {
    if (!corpusNum) return;
    const res = await fetch(`http://127.0.0.1:8000/api/corpus/${corpusNum}`);
    const json = await res.json();
    setCorpus(json.response);
  }

  useEffect(() => {
    requestCorpus();
  }, []); //eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!Object.keys(plagReport).length || !corpus.length) return;

    const sourceType = docType === 'source' ? 'suspicious' : 'source';
    const iSources = [];
    const eSources = [];
    plagReport.detectedSources.forEach(source => {
      const sourceInCorpus = corpus.find(doc => {
        return doc.id === `${sourceType}-${source.filenum}`;
      });
      if (sourceInCorpus) {
        iSources.push(source);
      } else {
        eSources.push(source);
      }
    });
    setInternalSources(iSources);
    setExternalSources(eSources);
  }, [corpus, plagReport, docType]);

  const clickHandler = sourceFilenum => {
    const allFileCases = [];
    plagReport.detectedCases.forEach((plagCase, idx) => {
      if (plagCase.filenum === sourceFilenum) {
        allFileCases.push(idx);
      }
    });
    const fileCaseAttributes = allFileCases
      .map(plagCase => `circle[data-id='${plagCase}']`)
      .join(', ');

    const daViz = document.getElementById('detailAnalysisViz');
    daViz.querySelectorAll('circle').forEach(node => {
      node.setAttribute('stroke', null);
    });
    daViz.querySelectorAll(fileCaseAttributes).forEach(node => {
      node.setAttribute('stroke', 'black');
      node.setAttribute('stroke-width', 2);
    });
    setSelectedSource(sourceFilenum);
  };

  if (
    !!Object.keys(plagReport).length &&
    plagReport.detectedCases.length === 0
  ) {
    return <></>;
  }

  return (
    <>
      <Tooltip>
        <ul className="list-disc list-inside">
          <li className="mt-1">
            <strong className="text-blue-600">Clicking</strong> on one of the
            sources will indicate the plagiarised parts that plagirise from this
            source with a black outline.
          </li>
        </ul>
      </Tooltip>
      <div className="bg-gray-200 rounded-lg px-3 py-5">
        <h2 className="text-lg font-semibold mb-4">Plagiarism Sources</h2>
        {internalSources.length ? (
          <h3 className="text-md font-semibold mb-3">
            Sources from the same corpus
          </h3>
        ) : null}
        {internalSources.map(source => (
          <div
            key={source.filenum}
            className={`flex flex-row justify-between bg-white p-2 rounded-lg mt-3 cursor-pointer hover:scale-105 ${
              selectedSource === source.filenum ? 'border-2 border-black' : ''
            }`}
            onClick={() => clickHandler(source.filenum)}
          >
            <p className={`truncate mr-3 `}>{source.title}</p>
            <p
              className={`${plagiarisedColor(source.percentage)} font-semibold`}
            >{`${roundTwoDecimal(source.percentage * 100)}%`}</p>
          </div>
        ))}
        {externalSources.length ? (
          <h3 className="text-md font-semibold mt-3">External Sources</h3>
        ) : null}
        {externalSources.map(source => (
          <div
            key={source.filenum}
            className={`flex flex-row justify-between bg-white p-2 rounded-lg mt-3 cursor-pointer hover:scale-105 ${
              selectedSource === source.filenum ? 'border-2 border-black' : ''
            }`}
            onClick={() => clickHandler(source.filenum)}
          >
            <p className={`truncate mr-3 `}>{source.title}</p>
            <p
              className={`${plagiarisedColor(source.percentage)} font-semibold`}
            >{`${roundTwoDecimal(source.percentage * 100)}%`}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default PlagiarismSourcesViz;
