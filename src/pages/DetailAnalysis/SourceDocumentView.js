import { useState, useEffect } from 'react';
import { plagiarisedPartBgColor } from '../../utils/utils';

const SourceDocumentView = ({ docType, filenum, plagReport, caseNum }) => {
  const [doc, setDoc] = useState({});
  const [paragraphs, setParagraphs] = useState([]);

  async function requestSourceDoc() {
    if (!filenum) return;

    const requestType = docType === 'source' ? 'suspicious' : 'source';
    const res = await fetch(
      `http://127.0.0.1:8000/api/${requestType}-document/${filenum}`
    );
    const json = await res.json();
    setDoc(json);
  }

  useEffect(() => {
    setDoc({});
    requestSourceDoc();
  }, [filenum]); //eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!!Object.keys(plagReport).length && !!Object.keys(doc).length) {
      const plagiarisedParts = {};
      plagReport.detectedCases.forEach((plagCase, i) => {
        if (plagCase.filenum === filenum) {
          const firstSentence = plagCase.sourceStart;
          const lastSentence = plagCase.sourceEnd;
          const numOfSentenes = lastSentence - firstSentence + 1;

          plagiarisedParts[i] = Array.from(
            { length: numOfSentenes },
            (_, idx) => firstSentence + idx
          );
        }
      });

      const processedParagraphs = doc.sentences.map(sentence => {
        let caseNum2 = -1;
        Object.entries(plagiarisedParts).forEach(([num, part]) => {
          if (part.includes(sentence.number)) {
            caseNum2 = Number.parseInt(num);
          }
        });
        if (caseNum2 >= 0) {
          return {
            ...sentence,
            case: caseNum2,
          };
        } else {
          return sentence;
        }
      });
      setParagraphs(processedParagraphs);
    }
  }, [doc]); //eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (paragraphs.length && caseNum >= 0) {
      const startSentence = plagReport.detectedCases[caseNum].sourceStart;
      document
        .querySelector(`#source-doc-${filenum} .sentence-${startSentence}`)
        ?.scrollIntoView({ behavior: 'smooth' });
    }
  });

  return (
    <section id={`source-doc-${filenum}`} className="col-span-1 ">
      {!!Object.keys(doc).length ? (
        <>
          <h1 className="text-2xl font-semibold text-gray-900 mb-5 overflow-x-scroll whitespace-nowrap">
            {doc.title}
          </h1>
          <div className="prose prose-slate prose-lg max-w-full overflow-y-scroll h-[55rem]">
            <p className="whitespace-pre-line">
              {paragraphs.map((sentence, j) => (
                <span
                  key={j}
                  className={`sentence-${sentence.number}`}
                  style={{
                    backgroundColor: `${plagiarisedPartBgColor(
                      plagReport,
                      caseNum,
                      sentence
                    )}`,
                  }}
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

export default SourceDocumentView;
