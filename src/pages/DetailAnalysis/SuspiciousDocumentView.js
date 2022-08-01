import { useState, useEffect } from 'react';

const SuspiciousDocumentView = ({
  filenum,
  plagReport,
  caseNum,
  setSourceDetail,
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

      const processedParagraphs = doc.processedParagraphs.map(paragraph => {
        return paragraph.map(sentence => {
          const caseNum = plagiarisedParts.findIndex(part => {
            return part.includes(sentence.number);
          });
          if (caseNum >= 0) {
            return { ...sentence, case: caseNum };
          } else {
            return sentence;
          }
        });
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
      const selectedCase = plagReport.detectedCases[plagiarisedCase];
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
  };

  return (
    <section
      id={`suspicious-doc-${filenum}`}
      className="col-span-1 overflow-y-scroll h-[55rem]"
    >
      {!!Object.keys(doc).length ? (
        <>
          <h1 className="text-2xl font-semibold text-gray-900 mb-5">
            {doc.title}
          </h1>
          <div className="prose prose-slate prose-lg max-w-full">
            {paragraphs?.map((paragraph, i) => (
              <p key={i}>
                {paragraph.map((sentence, j) => (
                  <span
                    key={j}
                    className={`sentence-${sentence.number} ${
                      sentence.case != null ? 'cursor-pointer' : ''
                    }`}
                    style={{
                      backgroundColor: `${
                        sentence.case != null ? 'rgba(249, 115, 22, 0.35)' : ''
                      }`,
                    }}
                    onClick={() => clickHandler(sentence.case)}
                  >
                    {sentence.rawText}{' '}
                  </span>
                ))}
              </p>
            ))}
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
