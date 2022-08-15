import { useState, useEffect } from 'react';
import { plagiarisedPartBgColor } from '../../utils/utils';

const SourceDocumentView = ({ filenum, plagReport, caseNum }) => {
  const [doc, setDoc] = useState({});
  const [paragraphs, setParagraphs] = useState([]);

  async function requestSourceDoc() {
    if (!filenum) return;

    const res = await fetch(
      `http://127.0.0.1:8000/api/source-document/${filenum}`
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
      const plagiarisedParts = [];
      plagReport.detectedCases.forEach((plagCase, i) => {
        if (plagCase.filenum === filenum) {
          const firstSentence = plagCase.sourceStart;
          const lastSentence = plagCase.sourceEnd;
          const numOfSentenes = lastSentence - firstSentence + 1;

          plagiarisedParts.push({
            [i]: Array.from(
              { length: numOfSentenes },
              (_, idx) => firstSentence + idx
            ),
          });
        }
      });

      const processedParagraphs = doc.sentences.map(sentence => {
        const caseNum2 = plagiarisedParts.findIndex(part => {
          return Object.values(part)[0].includes(sentence.number);
        });
        if (caseNum2 >= 0) {
          return {
            ...sentence,
            case: Object.keys(plagiarisedParts[caseNum2])[0],
          };
        } else {
          return sentence;
        }
      });
      setParagraphs(processedParagraphs);
    }
  }, [doc]); //eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (paragraphs.length) {
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
