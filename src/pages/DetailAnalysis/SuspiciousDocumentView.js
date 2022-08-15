import { useState, useEffect } from 'react';

const plagiarisedPartBgColor = (plagReport, caseNum, sentence) => {
  if (!Object.keys(plagReport).length) return;
  // const showingSouceDoc = plagReport.detectedCases[caseNum].filenum;
  if (
    sentence.case != null &&
    sentence.case === caseNum
    // Number.parseInt(sentence.source) === showingSouceDoc
  ) {
    return 'rgba(225, 29, 72, 0.35)';
  } else if (sentence.case != null) {
    return 'rgba(249, 115, 22, 0.35)';
  } else {
    return '';
  }
};

const SuspiciousDocumentView = ({
  filenum,
  plagReport,
  caseNum,
  setCaseNum,
}) => {
  const [doc, setDoc] = useState({});
  const [paragraphs, setParagraphs] = useState([]);

  async function requestSusDoc() {
    const res = await fetch(
      `http://127.0.0.1:8000/api/suspicious-document/${filenum}`
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

      const processedParagraphs = doc.sentences.map(sentence => {
        const caseNum2 = plagiarisedParts.findIndex(part => {
          return part.includes(sentence.number);
        });
        if (caseNum2 >= 0) {
          return { ...sentence, case: caseNum2 };
        } else {
          return sentence;
        }
      });
      setParagraphs(processedParagraphs);
    }
  }, [doc, plagReport]);

  useEffect(() => {
    if (paragraphs.length) {
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
                    sentence.case != null ? 'cursor-pointer' : ''
                  }`}
                  style={{
                    backgroundColor: `${plagiarisedPartBgColor(
                      plagReport,
                      caseNum,
                      sentence
                    )}`,
                  }}
                  onClick={() => clickHandler(sentence.case)}
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
