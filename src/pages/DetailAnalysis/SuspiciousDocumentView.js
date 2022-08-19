import { useState, useEffect } from 'react';
import { plagiarisedPartBgColor } from '../../utils/utils';

const SuspiciousDocumentView = ({
  docType,
  filenum,
  plagReport,
  caseNum,
  setCaseNum,
}) => {
  const [doc, setDoc] = useState({});
  const [paragraphs, setParagraphs] = useState([]);

  async function requestSusDoc() {
    const requestType = docType === 'source' ? 'source' : 'suspicious';
    const res = await fetch(
      `https://plagiarism-viz-backend.herokuapp.com/api/${requestType}-document/${filenum}`
    );
    const json = await res.json();
    setDoc(json);
  }

  useEffect(() => {
    requestSusDoc();
  }, [filenum]); //eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!!Object.keys(doc).length && !!Object.keys(plagReport).length) {
      const plagiarisedParts = plagReport.detectedCases.map(plagCase => {
        const firstSentence = plagCase.thisStart;
        const lastSentence = plagCase.thisEnd;
        const numOfSentenes = lastSentence - firstSentence + 1;

        return Array.from(
          { length: numOfSentenes },
          (_, idx) => firstSentence + idx
        );
      });

      // need to account for overlapped part
      const processedParagraphs = doc.sentences.map(sentence => {
        const caseNums2 = [];
        plagiarisedParts.forEach((part, idx) => {
          if (part.includes(sentence.number)) {
            caseNums2.push(idx);
          }
        });
        return { ...sentence, case: caseNums2 };
      });
      setParagraphs(processedParagraphs);
    }
  }, [doc, plagReport]);

  useEffect(() => {
    if (paragraphs.length && caseNum >= 0) {
      const startSentence = plagReport.detectedCases[caseNum].thisStart;
      document
        .querySelector(`#suspicious-doc-${filenum} .sentence-${startSentence}`)
        ?.scrollIntoView();
    }
  });

  const clickHandler = plagiarisedCase => {
    if (plagiarisedCase != null) {
      setCaseNum(plagiarisedCase);
    }
  };

  return (
    <section id={`suspicious-doc-${filenum}`} className="col-span-1  ">
      {!!Object.keys(doc).length ? (
        <>
          <h1 className="text-2xl font-semibold text-gray-900 mb-5 overflow-x-scroll whitespace-nowrap">
            {doc.title}
          </h1>
          <div className="prose prose-slate prose-lg max-w-full overflow-y-scroll h-[55rem]">
            <p className="whitespace-pre-line">
              {paragraphs.map((sentence, i) => (
                <span
                  key={i}
                  className={`sentence-${sentence.number} ${
                    sentence.case.length > 0 ? 'cursor-pointer' : ''
                  }`}
                  style={{
                    backgroundColor: `${plagiarisedPartBgColor(
                      plagReport,
                      caseNum,
                      sentence
                    )}`,
                  }}
                  onClick={() => clickHandler(sentence.case[0])}
                >
                  {sentence.rawText.replace(/(?<!\n)\n(?!\n)/g, ' ')}{' '}
                </span>
              ))}
            </p>
          </div>
        </>
      ) : (
        <div className="flex h-full w-full">
          <h1 className="my-auto mx-auto prose prose-slate prose-xl">
            Loading...
          </h1>
        </div>
      )}
    </section>
  );
};

export default SuspiciousDocumentView;
