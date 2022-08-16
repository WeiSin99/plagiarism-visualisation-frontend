import { useEffect, useState } from 'react';
import { plagiarisedColor, roundTwoDecimal } from '../../utils/utils';

// underline source if the source is in the same corpus
const underlineSource = (corpus, docType, sourceFilenum) => {
  if (Object.keys(corpus).length === 0) return;
  const sourceType = docType === 'source' ? 'suspicious' : 'source';
  const sourceInCorpus = corpus.response.find(doc => {
    return doc.id === `${sourceType}-${sourceFilenum}`;
  });

  if (sourceInCorpus) return 'underline decoration-2';
  else return '';
};

const PlagiarismSourcesViz = ({ docType, plagReport, corpusNum }) => {
  const [selectedSource, setSelectedSource] = useState(0);
  const [corpus, setCorpus] = useState({});

  async function requestCorpus() {
    const res = await fetch(`http://127.0.0.1:8000/api/corpus/${corpusNum}`);
    const json = await res.json();
    setCorpus(json);
  }

  useEffect(() => {
    requestCorpus();
  }, []); //eslint-disable-line react-hooks/exhaustive-deps

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

    document.querySelectorAll('svg > circle').forEach(node => {
      node.setAttribute('stroke', null);
    });
    document.querySelectorAll(fileCaseAttributes).forEach(node => {
      node.setAttribute('stroke', 'black');
      node.setAttribute('stroke-width', 2);
    });
    setSelectedSource(sourceFilenum);
  };

  return (
    <div className="bg-gray-200 rounded-lg px-3 py-5">
      <p className="text-lg font-semibold mb-4">Plagiarism Sources</p>
      {!!Object.keys(plagReport).length &&
        plagReport.detectedSources.map(source => (
          <div
            key={source.filenum}
            className={`flex flex-row justify-between bg-white p-2 rounded-lg mt-3 cursor-pointer hover:scale-105 ${
              selectedSource === source.filenum ? 'border-2 border-black' : ''
            }`}
            onClick={() => clickHandler(source.filenum)}
          >
            <p
              className={`truncate mr-3 ${underlineSource(
                corpus,
                docType,
                source.filenum
              )}`}
            >
              {source.title}
            </p>
            <p
              className={`${plagiarisedColor(source.percentage)} font-semibold`}
            >{`${roundTwoDecimal(source.percentage * 100)}%`}</p>
          </div>
        ))}
    </div>
  );
};

export default PlagiarismSourcesViz;
