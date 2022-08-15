import { plagiarisedColor, roundTwoDecimal } from '../../utils/utils';

const PlagiarismSourcesViz = ({ plagReport }) => {
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
  };

  return (
    <div className="bg-gray-200 rounded-lg px-3 py-5">
      <p className="text-lg font-semibold mb-4">Plagiarism Sources</p>
      {!!Object.keys(plagReport).length &&
        plagReport.detectedSources.map(source => (
          <div
            key={source.filenum}
            className="flex flex-row justify-between bg-white p-2 rounded-lg mt-3 cursor-pointer hover:scale-105"
            onClick={() => clickHandler(source.filenum)}
          >
            <p className="truncate mr-3">{source.title}</p>
            <p
              className={`${plagiarisedColor(source.percentage)} font-semibold`}
            >{`${roundTwoDecimal(source.percentage * 100)}%`}</p>
          </div>
        ))}
    </div>
  );
};

export default PlagiarismSourcesViz;
