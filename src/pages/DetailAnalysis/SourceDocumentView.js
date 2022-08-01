import { useState, useEffect } from 'react';

const SourceDocumentView = ({ filenum, allPlagParts, selectedCase }) => {
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
    if (!!allPlagParts && !!Object.keys(doc).length) {
      const plagiarisedParts = allPlagParts.map(plagCase => {
        const firstSentence = plagCase.sourceStart;
        const lastSentence = plagCase.sourceEnd;
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
  }, [doc]); //eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (paragraphs.length) {
      document
        .querySelector(`#source-doc-${filenum} .sentence-${selectedCase}`)
        ?.scrollIntoView({ behavior: 'smooth' });
    }
  });

  return (
    <section
      id={`source-doc-${filenum}`}
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

export default SourceDocumentView;
